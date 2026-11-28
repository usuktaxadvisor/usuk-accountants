import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { db, tables } from './db';
import { audit } from './audit';
import type { RequestItem } from '@/components/portal/classic/RequestCard';
import type { RequestStatus } from '@/components/portal/classic/ui';

export const REQUEST_STATUSES: RequestStatus[] = ['REQUESTED', 'UPLOADED', 'RECEIVED', 'UNDER_REVIEW', 'COMPLETED'];

/** Groups uploads under the request they answer. Drive ids never leave the server. */
export function nestFiles(
  requests: Array<typeof tables.documentRequests.$inferSelect>,
  docs: Array<typeof tables.documents.$inferSelect>,
): RequestItem[] {
  return requests.map(r => ({
    id: r.id, title: r.title, description: r.description, status: r.status as RequestStatus,
    requestedAt: r.requestedAt, deadline: r.deadline,
    files: docs.filter(d => d.requestId === r.id)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map(d => ({ id: d.id, name: d.originalName, sizeBytes: d.sizeBytes, createdAt: d.createdAt })),
  }));
}

export async function requestItemsForClient(clientId: string): Promise<RequestItem[]> {
  const requests = await db.select().from(tables.documentRequests)
    .where(eq(tables.documentRequests.clientId, clientId)).orderBy(desc(tables.documentRequests.requestedAt));
  const docs = await db.select().from(tables.documents).where(eq(tables.documents.clientId, clientId));
  return nestFiles(requests, docs);
}

/** Requests in the given statuses across every client, grouped by client, oldest upload first. */
export async function reviewQueue(statuses: RequestStatus[]) {
  const reqs = await db.select({ r: tables.documentRequests, clientRef: tables.clients.clientRef, clientName: tables.clients.displayName, archivedAt: tables.clients.archivedAt })
    .from(tables.documentRequests)
    .innerJoin(tables.clients, eq(tables.clients.id, tables.documentRequests.clientId))
    .where(inArray(tables.documentRequests.status, statuses))
    .orderBy(asc(tables.clients.clientRef), asc(tables.documentRequests.requestedAt));
  if (reqs.length === 0) return [];
  const docs = await db.select().from(tables.documents)
    .where(inArray(tables.documents.requestId, reqs.map(x => x.r.id)));
  const groups = new Map<string, { clientId: string; clientRef: string; clientName: string; archived: boolean; items: RequestItem[] }>();
  for (const x of reqs) {
    const g = groups.get(x.r.clientId) ?? { clientId: x.r.clientId, clientRef: x.clientRef, clientName: x.clientName, archived: !!x.archivedAt, items: [] };
    g.items.push(...nestFiles([x.r], docs));
    groups.set(x.r.clientId, g);
  }
  return [...groups.values()];
}

/**
 * Staff-only status change. Ownership is re-checked against the client so a
 * forged request id can never touch another client's record. Audited; the
 * client is not emailed (status changes are internal housekeeping).
 */
export async function setRequestStatus(staffUid: string, clientId: string, requestId: string, status: string, via: string) {
  if (!REQUEST_STATUSES.includes(status as RequestStatus)) return false;
  const [owned] = await db.select({ id: tables.documentRequests.id }).from(tables.documentRequests)
    .where(and(eq(tables.documentRequests.id, requestId), eq(tables.documentRequests.clientId, clientId))).limit(1);
  if (!owned) return false;
  await db.update(tables.documentRequests)
    .set({ status: status as RequestStatus, updatedAt: new Date(), completedAt: status === 'COMPLETED' ? new Date() : null })
    .where(eq(tables.documentRequests.id, requestId));
  await audit(staffUid, 'STATUS_CHANGE', { targetType: 'request', targetId: requestId, meta: { status, via } });
  return true;
}

/**
 * A request can be removed only while it is still waiting on the client and nothing has been
 * uploaded to it: one made by mistake or twice. Anything with an upload is kept, whatever its status.
 */
export function canRemoveRequest(item: { status: RequestStatus; files: unknown[] }): boolean {
  return item.status === 'REQUESTED' && item.files.length === 0;
}

export type RemoveRequestResult = 'removed' | 'not-found' | 'not-removable';

/**
 * Staff-only removal of an empty document request. The ownership, status and no-upload checks sit
 * in the same DELETE statement, so an upload arriving at the same moment wins and nothing is removed.
 * The request's details go into the audit log in the same transaction, so the removal can never go
 * unrecorded. The client is not emailed.
 */
export async function removeEmptyRequest(staffUid: string, clientId: string, requestId: string, reason: string): Promise<RemoveRequestResult> {
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) return 'not-found';
  const [row] = await db.select().from(tables.documentRequests)
    .where(and(eq(tables.documentRequests.id, requestId), eq(tables.documentRequests.clientId, clientId))).limit(1);
  if (!row) return 'not-found';
  try {
    return await db.transaction(async tx => {
      const gone = await tx.delete(tables.documentRequests)
        .where(and(
          eq(tables.documentRequests.id, requestId),
          eq(tables.documentRequests.clientId, clientId),
          eq(tables.documentRequests.status, 'REQUESTED'),
          sql`not exists (select 1 from ${tables.documents} where ${tables.documents.requestId} = ${tables.documentRequests.id})`,
        ))
        .returning({ id: tables.documentRequests.id });
      if (gone.length === 0) return 'not-removable' as const;
      await tx.insert(tables.auditLogs).values({
        actorUserId: staffUid, action: 'REQUEST_REMOVED', targetType: 'request', targetId: requestId,
        meta: {
          clientId, title: row.title, description: row.description,
          requestedAt: row.requestedAt.toISOString(),
          deadline: row.deadline ? row.deadline.toISOString().slice(0, 10) : null,
          reason: reason || null,
        },
      });
      return 'removed' as const;
    });
  } catch {
    // e.g. an upload committed between the check and the delete (foreign key): nothing was removed
    return 'not-removable';
  }
}
