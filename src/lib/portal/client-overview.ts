import { and, eq, inArray, sql } from 'drizzle-orm';
import { db, tables } from './db';
import { listMembers } from './members';
import { listEngagementsForClient } from './engagement-store';
import { CONDITIONAL_KINDS, deadlineState, isOpenEngagement } from './engagements';

export type Section = 'people' | 'requests' | 'files' | 'work' | 'signatures' | 'engagements' | 'activity';

export type OverviewCounts = {
  people: { active: number; joint: number; contacts: number; notActive: number };
  requests: { outstanding: number; followUp: number; awaitingReview: number; received: number; accepted: number; overdue: number };
  files: { uploads: number; prepared: number; signed: number };
  work: { awaitingFeedback: number; changesRequested: number; approved: number };
  signatures: { pending: number; completed: number; nextDue: Date | null };
  engagements: { ready: boolean; open: number; overdue: number; dueSoon: number; nextDeadline: { label: string; dueDate: string; engagement: string } | null; overdueFirst: { label: string; dueDate: string; engagement: string } | null };
};

export type NextAction = { tone: 'urgent' | 'action' | 'waiting' | 'calm'; text: string; section: Section | null };

const OPEN_SIG = ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED'];


/** One pass over the client's records for the overview cards. Read-only. */
export async function loadOverview(clientId: string, today = new Date()): Promise<OverviewCounts> {
  const members = await listMembers(clientId);
  const activeMembers = members.filter(m => m.status === 'ACTIVE');
  const reqRows = await db.select({ status: tables.documentRequests.status, deadline: tables.documentRequests.deadline, n: sql<number>`count(*)` })
    .from(tables.documentRequests).where(eq(tables.documentRequests.clientId, clientId))
    .groupBy(tables.documentRequests.status, tables.documentRequests.deadline);
  const reqCount = (s: string) => reqRows.filter(r => r.status === s).reduce((a, r) => a + Number(r.n), 0);
  const overdueReq = reqRows.filter(r => (r.status === 'REQUESTED' || r.status === 'UNDER_REVIEW') && r.deadline && r.deadline < today).reduce((a, r) => a + Number(r.n), 0);

  const [{ uploads }] = await db.select({ uploads: sql<number>`count(*)` }).from(tables.documents).where(eq(tables.documents.clientId, clientId));
  const deliveries = await db.select({ id: tables.deliveries.id, status: tables.deliveries.status, supersedesId: tables.deliveries.supersedesId })
    .from(tables.deliveries).where(eq(tables.deliveries.clientId, clientId));
  const superseded = new Set(deliveries.map(d => d.supersedesId).filter(Boolean));
  const latest = deliveries.filter(d => !superseded.has(d.id) && d.status !== 'WITHDRAWN');

  const sigs = await db.select({ status: tables.signatureRequests.status, dueAt: tables.signatureRequests.dueAt, sealed: tables.signatureRequests.sealedDriveFileId })
    .from(tables.signatureRequests).where(eq(tables.signatureRequests.clientId, clientId));
  const pendingSigs = sigs.filter(s => OPEN_SIG.includes(s.status));
  const nextDue = pendingSigs.map(s => s.dueAt).filter((d): d is Date => !!d).sort((a, b) => a.getTime() - b.getTime())[0] ?? null;

  const { engagements, deadlines, ready } = await listEngagementsForClient(clientId);
  const openIds = new Set(engagements.filter(e => isOpenEngagement(e.status)).map(e => e.id));
  const name = (id: string) => engagements.find(e => e.id === id)?.title ?? '';
  const live = deadlines.filter(d => openIds.has(d.engagementId) && !d.doneAt);
  const overdue = live.filter(d => !CONDITIONAL_KINDS.includes(d.kind) && deadlineState(d.dueDate, d.doneAt, today) === 'overdue');
  const soon = live.filter(d => !CONDITIONAL_KINDS.includes(d.kind) && deadlineState(d.dueDate, d.doneAt, today) === 'due-soon');
  const upcoming = live.filter(d => !CONDITIONAL_KINDS.includes(d.kind) && deadlineState(d.dueDate, d.doneAt, today) !== 'overdue');

  return {
    people: {
      active: activeMembers.length,
      joint: activeMembers.filter(m => m.role === 'JOINT').length,
      contacts: activeMembers.filter(m => m.role === 'CONTACT' || m.role === 'DIRECTOR' || m.role === 'MEMBER').length,
      notActive: activeMembers.filter(m => m.userStatus !== 'ACTIVE').length,
    },
    requests: { outstanding: reqCount('REQUESTED'), followUp: reqCount('UNDER_REVIEW'), awaitingReview: reqCount('UPLOADED'), received: reqCount('RECEIVED'), accepted: reqCount('COMPLETED'), overdue: overdueReq },
    files: { uploads: Number(uploads), prepared: deliveries.filter(d => d.status !== 'WITHDRAWN').length, signed: sigs.filter(s => s.status === 'COMPLETED' && s.sealed).length },
    work: {
      awaitingFeedback: latest.filter(d => d.status === 'READY_FOR_REVIEW' || d.status === 'VIEWED').length,
      changesRequested: latest.filter(d => d.status === 'CHANGES_REQUESTED').length,
      approved: latest.filter(d => d.status === 'APPROVED').length,
    },
    signatures: { pending: pendingSigs.length, completed: sigs.filter(s => s.status === 'COMPLETED').length, nextDue },
    engagements: {
      ready, open: openIds.size, overdue: overdue.length, dueSoon: soon.length,
      nextDeadline: upcoming[0] ? { label: upcoming[0].label, dueDate: upcoming[0].dueDate, engagement: name(upcoming[0].engagementId) } : null,
      overdueFirst: overdue[0] ? { label: overdue[0].label, dueDate: overdue[0].dueDate, engagement: name(overdue[0].engagementId) } : null,
    },
  };
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The single most important thing for staff to do next on this client, in priority order. */
export function computeNextAction(c: OverviewCounts, fmtDate: (iso: string) => string): NextAction {
  if (c.engagements.overdueFirst) return { tone: 'urgent', section: 'engagements', text: `Overdue: ${c.engagements.overdueFirst.label} for ${c.engagements.overdueFirst.engagement} (due ${fmtDate(c.engagements.overdueFirst.dueDate)})` };
  if (c.requests.awaitingReview) return { tone: 'action', section: 'requests', text: `Review ${plural(c.requests.awaitingReview, 'new upload')}` };
  if (c.work.changesRequested) return { tone: 'action', section: 'work', text: `The client asked for changes on ${plural(c.work.changesRequested, 'document')}` };
  if (c.requests.overdue) return { tone: 'urgent', section: 'requests', text: `${plural(c.requests.overdue, 'document request')} past due. Send a reminder` };
  if (c.requests.followUp) return { tone: 'action', section: 'requests', text: `Follow up ${plural(c.requests.followUp, 'item')} that need more from the client` };
  if (c.engagements.dueSoon && c.engagements.nextDeadline) return { tone: 'action', section: 'engagements', text: `${c.engagements.nextDeadline.label} for ${c.engagements.nextDeadline.engagement} is due ${fmtDate(c.engagements.nextDeadline.dueDate)}` };
  if (c.signatures.pending) return { tone: 'waiting', section: 'signatures', text: `Waiting for ${plural(c.signatures.pending, 'signature or approval', 'signatures or approvals')}` };
  if (c.work.awaitingFeedback) return { tone: 'waiting', section: 'work', text: `Waiting for client feedback on ${plural(c.work.awaitingFeedback, 'document')}` };
  if (c.requests.outstanding) return { tone: 'waiting', section: 'requests', text: `Waiting on the client for ${plural(c.requests.outstanding, 'document')}` };
  return { tone: 'calm', section: null, text: 'Nothing outstanding. Every request, review and signature is up to date.' };
}

/** Members of this client who have not yet activated their login (for the People card). */
export async function signerNamesForRequests(requestIds: string[]) {
  if (!requestIds.length) return [];
  return db.select().from(tables.signatureSigners).where(inArray(tables.signatureSigners.requestId, requestIds));
}

export async function clientExists(clientId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(clientId)) return null;
  const [c] = await db.select().from(tables.clients).where(and(eq(tables.clients.id, clientId))).limit(1);
  return c ?? null;
}
