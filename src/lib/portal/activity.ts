import { and, eq, inArray, sql } from 'drizzle-orm';
import { db, tables } from './db';
import { listNotesForClient } from './engagement-store';
import { REQUEST_STATUS, type RequestStatus } from '@/components/portal/classic/ui';

export type ActivityKind = 'request' | 'upload' | 'review' | 'signature' | 'engagement' | 'note' | 'access';
export type ActivityItem = { at: Date; kind: ActivityKind; text: string; who: string | null; href?: string };

const SIG_EVENTS: Record<string, string> = {
  signature_request_sent: 'sent for signature', reminder_sent: 'reminder sent', document_viewed: 'opened',
  approval_recorded: 'approved', signature_applied: 'signed', all_signers_completed: 'completed by everyone',
  request_declined: 'declined', request_voided: 'withdrawn', request_expired: 'expired', request_superseded: 'replaced by a newer request',
};

/**
 * A dated history for one client, built only from records the portal already keeps. Staff-only:
 * internal notes are included, and the function must never be called for a client session.
 */
export async function clientActivity(clientId: string, base: string): Promise<ActivityItem[]> {
  const out: ActivityItem[] = [];
  const name = (f: string | null, l: string | null, e: string | null) => [f, l].filter(Boolean).join(' ') || e || null;

  const requests = await db.select().from(tables.documentRequests).where(eq(tables.documentRequests.clientId, clientId));
  const reqTitle = new Map(requests.map(r => [r.id, r.title]));
  for (const r of requests) out.push({ at: r.requestedAt, kind: 'request', text: `Requested “${r.title}”`, who: null, href: `${base}/requests#r-${r.id}` });

  const docs = await db.select({ d: tables.documents, f: tables.users.firstName, l: tables.users.lastName, e: tables.users.email })
    .from(tables.documents).innerJoin(tables.users, eq(tables.users.id, tables.documents.uploadedById)).where(eq(tables.documents.clientId, clientId));
  for (const x of docs) out.push({ at: x.d.createdAt, kind: 'upload', text: `Uploaded ${x.d.originalName}${x.d.requestId && reqTitle.get(x.d.requestId) ? ` for “${reqTitle.get(x.d.requestId)}”` : ''}`, who: name(x.f, x.l, x.e), href: `${base}/files` });

  const ids = requests.map(r => r.id);
  const audits = await db.select({ a: tables.auditLogs, f: tables.users.firstName, l: tables.users.lastName, e: tables.users.email })
    .from(tables.auditLogs).leftJoin(tables.users, eq(tables.users.id, tables.auditLogs.actorUserId))
    .where(and(
      inArray(tables.auditLogs.action, ['STATUS_CHANGE', 'REQUEST_REMINDER_SENT', 'REQUEST_DEADLINE_SET', 'ENGAGEMENT_CREATED', 'ENGAGEMENT_UPDATED', 'ENGAGEMENT_ROLLED_OVER', 'DEADLINE_ADDED', 'DEADLINE_DONE', 'DEADLINE_REOPENED', 'RESET_LINK_SENT', 'CLIENT_MEMBER_ADDED', 'CLIENT_MEMBER_REMOVED', 'IDV_RECORDED', 'REQUEST_REMOVED']),
      ids.length ? sql`(${tables.auditLogs.meta}->>'clientId' = ${clientId} or ${inArray(tables.auditLogs.targetId, ids)})` : sql`${tables.auditLogs.meta}->>'clientId' = ${clientId}`,
    ));
  // A removed request is no longer in the table; its audit record keeps the title for the rest of its history.
  for (const x of audits) {
    const m = (x.a.meta ?? {}) as Record<string, unknown>;
    if (x.a.action === 'REQUEST_REMOVED' && x.a.targetId && typeof m.title === 'string') {
      reqTitle.set(x.a.targetId, m.title);
      if (typeof m.requestedAt === 'string') out.push({ at: new Date(m.requestedAt), kind: 'request', text: `Requested “${m.title}”`, who: null, href: `${base}/requests` });
    }
  }
  for (const x of audits) {
    const m = (x.a.meta ?? {}) as Record<string, unknown>;
    const who = name(x.f, x.l, x.e) ?? 'System';
    const t = x.a.targetId && reqTitle.get(x.a.targetId);
    let text = '', kind: ActivityKind = 'request';
    switch (x.a.action) {
      case 'STATUS_CHANGE': text = `Marked “${t ?? 'request'}” as ${REQUEST_STATUS[m.status as RequestStatus]?.staff.toLowerCase() ?? String(m.status)}`; kind = 'review'; break;
      case 'REQUEST_REMINDER_SENT': text = `Reminder ${m.sent ? 'emailed' : 'could not be emailed'} for “${t ?? 'request'}”`; break;
      case 'REQUEST_DEADLINE_SET': text = m.deadline ? `Due date for “${t ?? 'request'}” set to ${m.deadline}` : `Due date removed from “${t ?? 'request'}”`; break;
      case 'ENGAGEMENT_CREATED': text = `Engagement added: ${String(m.service ?? '').replace(/_/g, ' ').toLowerCase()} ${m.taxYear ?? ''}`; kind = 'engagement'; break;
      case 'ENGAGEMENT_UPDATED': text = `Engagement status changed to ${String(m.status ?? '').replace(/_/g, ' ').toLowerCase()}`; kind = 'engagement'; break;
      case 'ENGAGEMENT_ROLLED_OVER': text = `Next year's engagement added automatically (${m.taxYear ?? ''})`; kind = 'engagement'; break;
      case 'DEADLINE_ADDED': text = `Deadline added for ${m.due ?? ''}`; kind = 'engagement'; break;
      case 'DEADLINE_DONE': text = 'Deadline marked as met'; kind = 'engagement'; break;
      case 'DEADLINE_REOPENED': text = 'Deadline reopened'; kind = 'engagement'; break;
      case 'RESET_LINK_SENT': text = `Password-reset link ${m.sent ? 'emailed' : 'could not be emailed'}`; kind = 'access'; break;
      case 'CLIENT_MEMBER_ADDED': text = 'Person added to the client'; kind = 'access'; break;
      case 'CLIENT_MEMBER_REMOVED': text = 'Person removed from the client'; kind = 'access'; break;
      case 'IDV_RECORDED': text = 'Identity verification recorded'; kind = 'signature'; break;
      case 'REQUEST_REMOVED': text = `Removed request “${String(m.title ?? 'request')}”${m.reason ? ` (${String(m.reason)})` : ''}. The client was not emailed`; break;
    }
    if (text) out.push({ at: x.a.createdAt, kind, text, who, href: kind === 'engagement' ? `${base}/engagements` : kind === 'access' ? `${base}/people` : `${base}/requests` });
  }

  const deliveries = await db.select().from(tables.deliveries).where(eq(tables.deliveries.clientId, clientId));
  for (const d of deliveries) {
    out.push({ at: d.sentAt, kind: 'review', text: `Shared “${d.title}” (version ${d.version}) for review`, who: null, href: `${base}/work#w-${d.id}` });
    if (d.viewedAt) out.push({ at: d.viewedAt, kind: 'review', text: `Client opened “${d.title}” (version ${d.version})`, who: null, href: `${base}/work#w-${d.id}` });
    if (d.withdrawnAt) out.push({ at: d.withdrawnAt, kind: 'review', text: `Withdrew “${d.title}” (version ${d.version})`, who: null, href: `${base}/work#w-${d.id}` });
  }
  const responses = await db.select({ r: tables.deliveryResponses, f: tables.users.firstName, l: tables.users.lastName, e: tables.users.email })
    .from(tables.deliveryResponses).innerJoin(tables.users, eq(tables.users.id, tables.deliveryResponses.respondedById)).where(eq(tables.deliveryResponses.clientId, clientId));
  const dTitle = new Map(deliveries.map(d => [d.id, d.title]));
  for (const x of responses) out.push({ at: x.r.createdAt, kind: 'review', text: `${x.r.decision === 'APPROVED' ? 'Approved' : 'Asked for changes to'} “${dTitle.get(x.r.deliveryId) ?? 'document'}”`, who: name(x.f, x.l, x.e), href: `${base}/work#w-${x.r.deliveryId}` });

  const sigs = await db.select().from(tables.signatureRequests).where(eq(tables.signatureRequests.clientId, clientId));
  if (sigs.length) {
    const sTitle = new Map(sigs.map(s => [s.id, s.title]));
    const events = await db.select({ ev: tables.signatureEvents, signer: tables.signatureSigners.fullName })
      .from(tables.signatureEvents).leftJoin(tables.signatureSigners, eq(tables.signatureSigners.id, tables.signatureEvents.signerId))
      .where(and(inArray(tables.signatureEvents.requestId, sigs.map(s => s.id)), inArray(tables.signatureEvents.type, Object.keys(SIG_EVENTS))));
    for (const x of events) out.push({ at: x.ev.at, kind: 'signature', text: `“${sTitle.get(x.ev.requestId) ?? 'Request'}” ${SIG_EVENTS[x.ev.type]}`, who: x.signer ?? null, href: `${base}/signatures#s-${x.ev.requestId}` });
  }

  const { notes } = await listNotesForClient(clientId);
  for (const n of notes) out.push({ at: n.createdAt, kind: 'note', text: n.body, who: n.author });

  return out.sort((a, b) => b.at.getTime() - a.at.getTime());
}
