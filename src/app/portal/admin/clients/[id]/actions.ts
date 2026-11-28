'use server';

import { redirect } from 'next/navigation';
import { and, eq, inArray } from 'drizzle-orm';
import { requireRole } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { audit } from '@/lib/portal/audit';
import { notifyClientOfRequest, requestBase } from '@/lib/portal/notify';
import { createInvitation } from '@/lib/portal/invite';
import { sendPortalEmail, resetEmailHtml, reminderEmailHtml } from '@/lib/portal/email';
import { removeEmptyRequest, setRequestStatus } from '@/lib/portal/request-view';
import { clientExists, type Section } from '@/lib/portal/client-overview';
import { createEngagement, getEngagementForClient } from '@/lib/portal/engagement-store';
import { ENGAGEMENT_STATUSES, isService, normaliseTaxYear } from '@/lib/portal/engagements';

/**
 * Staff actions for the client sections. Every action re-checks the staff role, that the client exists,
 * and that any record it touches belongs to that client. Nothing here deletes a record, with one exception:
 * a document request still waiting on the client with nothing uploaded (made by mistake or twice) can be
 * removed, and its details are kept in the audit log.
 */

const SECTIONS: Section[] = ['people', 'requests', 'files', 'work', 'signatures', 'engagements', 'activity'];
const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? '').trim().slice(0, max);

async function staffClient(f: FormData, opts: { allowArchived?: boolean } = {}) {
  const s = await requireRole('STAFF');
  const client = await clientExists(str(f, 'clientId', 64));
  if (!client) redirect('/portal/admin');
  if (client.archivedAt && !opts.allowArchived) back(client.id, f, 'archived');
  return { s, client };
}

function back(clientId: string, f: FormData, flag?: string): never {
  const section = str(f, 'section', 20) as Section;
  const base = `/portal/admin/clients/${clientId}${SECTIONS.includes(section) ? `/${section}` : ''}`;
  redirect(flag ? `${base}?done=${flag}` : base);
}

function parseDate(v: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const d = new Date(`${v}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/* ── Document requests ─────────────────────────────────────────────────────────────── */

export async function createRequestAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const title = str(f, 'title', 200);
  if (!title) back(client.id, f, 'missing');
  const description = str(f, 'description', 1000) || null;
  const deadline = parseDate(str(f, 'deadline', 10));
  const [r] = await db.insert(tables.documentRequests).values({ clientId: client.id, title, description, deadline }).returning({ id: tables.documentRequests.id });
  const emailed = await notifyClientOfRequest(client.id, title);
  await audit(s.uid, 'REQUEST_CREATED', { targetType: 'request', targetId: r.id, meta: { clientId: client.id, clientEmailed: emailed } });
  back(client.id, f, emailed ? 'requested' : 'email-failed');
}

export async function setRequestStatusAction(f: FormData) {
  const { s, client } = await staffClient(f, { allowArchived: true });
  const ok = await setRequestStatus(s.uid, client.id, str(f, 'requestId', 64), str(f, 'status', 20), 'client-section');
  back(client.id, f, ok ? 'saved' : 'failed');
}

export async function setRequestDeadlineAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const requestId = str(f, 'requestId', 64);
  const raw = str(f, 'deadline', 10);
  const deadline = raw ? parseDate(raw) : null;
  if (raw && !deadline) back(client.id, f, 'failed');
  const updated = await db.update(tables.documentRequests).set({ deadline, updatedAt: new Date() })
    .where(and(eq(tables.documentRequests.id, requestId), eq(tables.documentRequests.clientId, client.id))).returning({ id: tables.documentRequests.id });
  if (updated.length) await audit(s.uid, 'REQUEST_DEADLINE_SET', { targetType: 'request', targetId: requestId, meta: { clientId: client.id, deadline: raw || null } });
  back(client.id, f, updated.length ? 'saved' : 'failed');
}

/** Removes a document request made by mistake or twice. Refused if anything has been uploaded to it. */
export async function removeRequestAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const result = await removeEmptyRequest(s.uid, client.id, str(f, 'requestId', 64), str(f, 'reason', 200));
  back(client.id, f, result === 'removed' ? 'request-removed' : 'remove-refused');
}

/** Emails the primary contact a reminder for one outstanding request, or for all of them. */
export async function remindAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const which = str(f, 'requestId', 64);
  const open = await db.select({ id: tables.documentRequests.id, title: tables.documentRequests.title })
    .from(tables.documentRequests)
    .where(and(eq(tables.documentRequests.clientId, client.id), inArray(tables.documentRequests.status, ['REQUESTED', 'UNDER_REVIEW'])));
  const chosen = which === 'all' ? open : open.filter(r => r.id === which);
  if (!chosen.length) back(client.id, f, 'nothing');
  const [u] = await db.select({ email: tables.users.email, firstName: tables.users.firstName }).from(tables.users).where(eq(tables.users.id, client.userId)).limit(1);
  const base = await requestBase();
  const sent = u ? await sendPortalEmail(u.email, chosen.length === 1 ? `Reminder: ${chosen[0].title}` : `Reminder: ${chosen.length} documents still needed`,
    reminderEmailHtml(u.firstName ?? client.displayName.split(' ')[0], chosen.map(r => r.title), `${base}/portal`)) : false;
  for (const r of chosen) await audit(s.uid, 'REQUEST_REMINDER_SENT', { targetType: 'request', targetId: r.id, meta: { clientId: client.id, sent } });
  back(client.id, f, sent ? 'reminded' : 'email-failed');
}

/* ── People ─────────────────────────────────────────────────────────────────────────── */

export async function sendResetLinkAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const userId = str(f, 'userId', 64) || client.userId;
  // The person must be an active member of this client.
  const [m] = await db.select({ userId: tables.clientMembers.userId }).from(tables.clientMembers)
    .where(and(eq(tables.clientMembers.clientId, client.id), eq(tables.clientMembers.userId, userId), eq(tables.clientMembers.status, 'ACTIVE'))).limit(1);
  if (!m && userId !== client.userId) back(client.id, f, 'failed');
  const [u] = await db.select({ id: tables.users.id, email: tables.users.email, firstName: tables.users.firstName }).from(tables.users).where(eq(tables.users.id, userId)).limit(1);
  if (!u) back(client.id, f, 'failed');
  const raw = await createInvitation(u.id, 1); // 24h
  const base = await requestBase();
  const sent = await sendPortalEmail(u.email, 'Reset your portal password — US UK Accountants', resetEmailHtml(u.firstName ?? client.displayName.split(' ')[0], `${base}/portal/invite/${raw}`));
  await audit(s.uid, 'RESET_LINK_SENT', { targetType: 'user', targetId: u.id, meta: { sent, clientId: client.id } });
  back(client.id, f, sent ? 'reset-sent' : 'email-failed');
}

/* ── Engagements and deadlines ──────────────────────────────────────────────────────── */

export async function addEngagementAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const service = str(f, 'service', 40);
  if (!isService(service)) back(client.id, f, 'failed');
  const taxYear = normaliseTaxYear(service, str(f, 'taxYear', 40));
  if (!taxYear) back(client.id, f, 'bad-year');
  const made = await createEngagement({ clientId: client.id, service, taxYear, recurring: f.get('recurring') === 'on', nextAction: str(f, 'nextAction', 300) || null, createdById: s.uid });
  if (made) await audit(s.uid, 'ENGAGEMENT_CREATED', { targetType: 'engagement', targetId: made.id, meta: { clientId: client.id, service, taxYear } });
  back(client.id, f, made ? 'engagement-added' : 'duplicate');
}

export async function updateEngagementAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const e = await getEngagementForClient(client.id, str(f, 'engagementId', 64));
  if (!e) back(client.id, f, 'failed');
  const status = str(f, 'status', 20);
  if (!ENGAGEMENT_STATUSES.includes(status)) back(client.id, f, 'failed');
  const done = status === 'COMPLETED' || status === 'FILED';
  await db.update(tables.engagements).set({
    status, nextAction: str(f, 'nextAction', 300) || null, recurring: f.get('recurring') === 'on' ? 1 : 0,
    updatedAt: new Date(), completedAt: done ? (e.completedAt ?? new Date()) : null,
  }).where(eq(tables.engagements.id, e.id));
  await audit(s.uid, 'ENGAGEMENT_UPDATED', { targetType: 'engagement', targetId: e.id, meta: { clientId: client.id, status } });
  back(client.id, f, 'saved');
}

export async function addDeadlineAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const e = await getEngagementForClient(client.id, str(f, 'engagementId', 64));
  const label = str(f, 'label', 200);
  const due = str(f, 'dueDate', 10);
  if (!e || !label || !parseDate(due)) back(client.id, f, 'failed');
  const [d] = await db.insert(tables.engagementDeadlines).values({ engagementId: e.id, clientId: client.id, label, dueDate: due, kind: 'INTERNAL', source: 'MANUAL' }).returning({ id: tables.engagementDeadlines.id });
  await audit(s.uid, 'DEADLINE_ADDED', { targetType: 'deadline', targetId: d.id, meta: { clientId: client.id, engagementId: e.id, due } });
  back(client.id, f, 'saved');
}

export async function toggleDeadlineAction(f: FormData) {
  const { s, client } = await staffClient(f);
  const id = str(f, 'deadlineId', 64);
  const [d] = await db.select().from(tables.engagementDeadlines)
    .where(and(eq(tables.engagementDeadlines.id, id), eq(tables.engagementDeadlines.clientId, client.id))).limit(1);
  if (!d) back(client.id, f, 'failed');
  await db.update(tables.engagementDeadlines).set({ doneAt: d.doneAt ? null : new Date() }).where(eq(tables.engagementDeadlines.id, d.id));
  await audit(s.uid, d.doneAt ? 'DEADLINE_REOPENED' : 'DEADLINE_DONE', { targetType: 'deadline', targetId: d.id, meta: { clientId: client.id } });
  back(client.id, f, 'saved');
}

/* ── Internal notes ─────────────────────────────────────────────────────────────────── */

export async function addNoteAction(f: FormData) {
  const { s, client } = await staffClient(f, { allowArchived: true });
  const body = str(f, 'body', 4000);
  if (!body) back(client.id, f, 'missing');
  const [n] = await db.insert(tables.clientNotes).values({ clientId: client.id, authorId: s.uid, body }).returning({ id: tables.clientNotes.id });
  await audit(s.uid, 'NOTE_ADDED', { targetType: 'note', targetId: n.id, meta: { clientId: client.id } });
  back(client.id, f, 'note-added');
}
