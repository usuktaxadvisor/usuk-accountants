import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import { db, tables } from './db';
import { audit } from './audit';
import { SERVICES, isOpenEngagement, nextTaxYear, periodClosed, ruleDeadlines, type ServiceKey } from './engagements';

export type EngagementRow = typeof tables.engagements.$inferSelect;
export type DeadlineRow = typeof tables.engagementDeadlines.$inferSelect;

/** True when the 0005 tables have not been created yet (lets pages degrade instead of failing). */
export function isMissingTable(e: unknown) {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === '42P01' || err?.cause?.code === '42P01';
}

/** Saves the statutory deadlines for an engagement. Idempotent: an existing rule deadline is never duplicated or changed. */
export async function saveRuleDeadlines(e: Pick<EngagementRow, 'id' | 'clientId' | 'service' | 'taxYear'>) {
  const rules = ruleDeadlines(e.service as ServiceKey, e.taxYear);
  if (!rules.length) return 0;
  const rows = await db.insert(tables.engagementDeadlines)
    .values(rules.map(r => ({ engagementId: e.id, clientId: e.clientId, label: r.label, dueDate: r.dueDate, kind: r.kind, source: 'RULE', ruleKey: r.ruleKey })))
    .onConflictDoNothing().returning({ id: tables.engagementDeadlines.id });
  return rows.length;
}

export async function createEngagement(input: { clientId: string; service: ServiceKey; taxYear: string; recurring: boolean; nextAction: string | null; status?: string; createdById: string | null; rolledFromId?: string | null }) {
  const title = `${SERVICES[input.service].label} ${input.taxYear}`;
  const [row] = await db.insert(tables.engagements).values({
    clientId: input.clientId, service: input.service, title, taxYear: input.taxYear, recurring: input.recurring ? 1 : 0,
    nextAction: input.nextAction, status: input.status ?? 'IN_PROGRESS', createdById: input.createdById, rolledFromId: input.rolledFromId ?? null,
  }).onConflictDoNothing().returning();
  if (!row) return null; // same service and year already exists for this client
  await saveRuleDeadlines(row);
  return row;
}

export async function listEngagementsForClient(clientId: string): Promise<{ engagements: EngagementRow[]; deadlines: DeadlineRow[]; ready: boolean }> {
  try {
    const engagements = await db.select().from(tables.engagements).where(eq(tables.engagements.clientId, clientId)).orderBy(asc(tables.engagements.createdAt));
    const deadlines = await db.select().from(tables.engagementDeadlines).where(eq(tables.engagementDeadlines.clientId, clientId)).orderBy(asc(tables.engagementDeadlines.dueDate));
    return { engagements, deadlines, ready: true };
  } catch (e) {
    if (isMissingTable(e)) return { engagements: [], deadlines: [], ready: false };
    throw e;
  }
}

export async function listNotesForClient(clientId: string) {
  try {
    const rows = await db.select({ n: tables.clientNotes, firstName: tables.users.firstName, lastName: tables.users.lastName, email: tables.users.email })
      .from(tables.clientNotes).innerJoin(tables.users, eq(tables.users.id, tables.clientNotes.authorId))
      .where(eq(tables.clientNotes.clientId, clientId)).orderBy(sql`${tables.clientNotes.createdAt} desc`);
    return { notes: rows.map(r => ({ ...r.n, author: [r.firstName, r.lastName].filter(Boolean).join(' ') || r.email })), ready: true };
  } catch (e) {
    if (isMissingTable(e)) return { notes: [], ready: false };
    throw e;
  }
}

/**
 * Daily: for each recurring engagement, once the following tax year or accounting period has closed,
 * create that year's engagement (status Planned) with its statutory deadlines. Never touches archived
 * clients and never duplicates (unique on client + service + year). Also backfills any rule deadline
 * missing from an open engagement.
 */
export async function rollOverRecurring(today = new Date()) {
  let created = 0, backfilled = 0;
  const rows = await db.select({ e: tables.engagements, archivedAt: tables.clients.archivedAt })
    .from(tables.engagements).innerJoin(tables.clients, eq(tables.clients.id, tables.engagements.clientId))
    .where(isNull(tables.clients.archivedAt));
  for (const { e } of rows) {
    if (isOpenEngagement(e.status)) backfilled += await saveRuleDeadlines(e);
    if (!e.recurring || e.status === 'ON_HOLD' || !(e.service in SERVICES)) continue;
    const next = nextTaxYear(e.service as ServiceKey, e.taxYear);
    if (!next || !periodClosed(e.service as ServiceKey, next, today)) continue;
    const exists = rows.some(r => r.e.clientId === e.clientId && r.e.service === e.service && r.e.taxYear === next);
    if (exists) continue;
    const made = await createEngagement({ clientId: e.clientId, service: e.service as ServiceKey, taxYear: next, recurring: true, nextAction: 'Confirm scope and request documents', status: 'PLANNED', createdById: null, rolledFromId: e.id });
    if (made) {
      created++;
      rows.push({ e: made, archivedAt: null });
      await audit(null, 'ENGAGEMENT_ROLLED_OVER', { targetType: 'engagement', targetId: made.id, meta: { clientId: e.clientId, from: e.id, taxYear: next } });
    }
  }
  return { checked: rows.length, created, backfilled };
}

export async function getEngagementForClient(clientId: string, engagementId: string) {
  const [row] = await db.select().from(tables.engagements)
    .where(and(eq(tables.engagements.id, engagementId), eq(tables.engagements.clientId, clientId))).limit(1);
  return row ?? null;
}
