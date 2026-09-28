import { and, asc, eq } from 'drizzle-orm';
import { db, tables } from './db';

/**
 * Client membership helpers — the ONLY way code should answer "does user U belong to client C?".
 * Backward compatible: a client whose membership rows are missing (should not happen after migration 0003's
 * backfill) still resolves through clients.user_id, so no existing login can break.
 */
export type MemberRole = 'PRIMARY' | 'JOINT' | 'DIRECTOR' | 'CONTACT' | 'MEMBER';
export const MEMBER_ROLES: MemberRole[] = ['PRIMARY', 'JOINT', 'DIRECTOR', 'CONTACT', 'MEMBER'];
export const MEMBER_ROLE_LABEL: Record<MemberRole, string> = { PRIMARY: 'Primary contact', JOINT: 'Joint client (e.g. spouse)', DIRECTOR: 'Director / officer', CONTACT: 'Authorised contact', MEMBER: 'Member' };

export type MemberRow = typeof tables.clientMembers.$inferSelect;
export type MemberWithUser = MemberRow & { email: string; firstName: string | null; lastName: string | null; userStatus: string; fullName: string };

/** The client this user may act for (ACTIVE membership first, then the legacy clients.user_id link). */
export async function clientIdForUser(userId: string): Promise<string | null> {
  const [m] = await db.select({ clientId: tables.clientMembers.clientId }).from(tables.clientMembers)
    .where(and(eq(tables.clientMembers.userId, userId), eq(tables.clientMembers.status, 'ACTIVE'))).limit(1);
  if (m) return m.clientId;
  const [c] = await db.select({ id: tables.clients.id }).from(tables.clients).where(eq(tables.clients.userId, userId)).limit(1);
  return c?.id ?? null;
}

/** ACTIVE membership of this user on this client, or null (legacy primary link counts as PRIMARY). */
export async function getMembership(clientId: string, userId: string): Promise<{ role: MemberRole; canSign: boolean } | null> {
  const [m] = await db.select().from(tables.clientMembers)
    .where(and(eq(tables.clientMembers.clientId, clientId), eq(tables.clientMembers.userId, userId), eq(tables.clientMembers.status, 'ACTIVE'))).limit(1);
  if (m) return { role: m.role as MemberRole, canSign: m.canSign === 1 };
  const [c] = await db.select({ id: tables.clients.id }).from(tables.clients).where(and(eq(tables.clients.id, clientId), eq(tables.clients.userId, userId))).limit(1);
  return c ? { role: 'PRIMARY', canSign: true } : null;
}

export async function listMembers(clientId: string): Promise<MemberWithUser[]> {
  const rows = await db.select({ m: tables.clientMembers, email: tables.users.email, firstName: tables.users.firstName, lastName: tables.users.lastName, userStatus: tables.users.status })
    .from(tables.clientMembers).innerJoin(tables.users, eq(tables.users.id, tables.clientMembers.userId))
    .where(eq(tables.clientMembers.clientId, clientId)).orderBy(asc(tables.clientMembers.createdAt));
  return rows.map(r => ({ ...r.m, email: r.email, firstName: r.firstName, lastName: r.lastName, userStatus: r.userStatus, fullName: [r.firstName, r.lastName].filter(Boolean).join(' ') || r.email }));
}

/** Members who may be signers: ACTIVE membership, can_sign, and a CLIENT user that is not suspended/deactivated. */
export async function listSigningMembers(clientId: string): Promise<MemberWithUser[]> {
  return (await listMembers(clientId)).filter(m => m.status === 'ACTIVE' && m.canSign === 1 && (m.userStatus === 'ACTIVE' || m.userStatus === 'INVITED'));
}

/** Creates the PRIMARY membership for a freshly created client (used by the new-client flow). */
export async function ensurePrimaryMembership(clientId: string, userId: string, addedById: string | null): Promise<void> {
  await db.insert(tables.clientMembers).values({ clientId, userId, role: 'PRIMARY', canSign: 1, status: 'ACTIVE', addedById }).onConflictDoNothing();
}
