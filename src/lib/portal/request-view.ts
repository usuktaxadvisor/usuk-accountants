import { and, asc, desc, eq, inArray } from 'drizzle-orm';
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
