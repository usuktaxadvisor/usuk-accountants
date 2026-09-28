import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { audit } from '@/lib/portal/audit';
import { rateLimit } from '@/lib/portal/ratelimit';
import { createInvitation } from '@/lib/portal/invite';
import { sendPortalEmail, inviteEmailHtml } from '@/lib/portal/email';
import { requestBase } from '@/lib/portal/notify';
import { listMembers, MEMBER_ROLES } from '@/lib/portal/members';

export const runtime = 'nodejs';

const AddBody = z.object({
  email: z.string().trim().email().max(200),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().max(80).nullable().default(null),
  role: z.enum(MEMBER_ROLES as [string, ...string[]]).default('JOINT'),
  canSign: z.boolean().default(true),
});

async function staff() {
  try { return { session: await requireRole('STAFF') }; }
  catch (e) { return { error: NextResponse.json({ error: e instanceof PortalAuthError && e.status === 403 ? 'Forbidden' : 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }) }; }
}

/** GET — STAFF+: the client's members (never exposed to clients). */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const a = await staff(); if ('error' in a) return a.error;
  const { id } = await ctx.params;
  const members = await listMembers(id);
  return NextResponse.json({ ok: true, members: members.map(m => ({ id: m.id, userId: m.userId, fullName: m.fullName, email: m.email, role: m.role, canSign: m.canSign === 1, status: m.status, userStatus: m.userStatus })) });
}

/**
 * POST — STAFF+: add a member (joint client, director, authorised contact) to a client. Creates their own
 * portal user (INVITED) and emails an activation link. A person is an ACTIVE member of one client only.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const a = await staff(); if ('error' in a) return a.error;
  const { session } = a;
  if (!rateLimit(`members:add:${session.uid}`, 30, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });
  const { id } = await ctx.params;
  let body: z.infer<typeof AddBody>;
  try { body = AddBody.parse(await req.json()); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  const [client] = await db.select().from(tables.clients).where(eq(tables.clients.id, id)).limit(1);
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const email = body.email.toLowerCase();

  const [existing] = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1);
  if (existing) {
    // Never silently attach an account that belongs to another client — a login must map to exactly one client.
    const [active] = await db.select({ clientId: tables.clientMembers.clientId }).from(tables.clientMembers).where(and(eq(tables.clientMembers.userId, existing.id), eq(tables.clientMembers.status, 'ACTIVE'))).limit(1);
    const [primaryOf] = await db.select({ id: tables.clients.id }).from(tables.clients).where(eq(tables.clients.userId, existing.id)).limit(1);
    if ((active && active.clientId !== id) || (primaryOf && primaryOf.id !== id) || existing.role !== 'CLIENT')
      return NextResponse.json({ error: 'That email already has a portal login for a different client. Use a different email address for this member.' }, { status: 409 });
    if (active) return NextResponse.json({ error: 'That person is already a member of this client.' }, { status: 409 });
  }

  const user = existing ?? (await db.insert(tables.users).values({ email, role: 'CLIENT', status: 'INVITED', firstName: body.firstName, lastName: body.lastName }).returning())[0];
  const [member] = await db.insert(tables.clientMembers).values({ clientId: id, userId: user.id, role: body.role, canSign: body.canSign ? 1 : 0, status: 'ACTIVE', addedById: session.uid })
    .onConflictDoUpdate({ target: [tables.clientMembers.clientId, tables.clientMembers.userId], set: { status: 'ACTIVE', role: body.role, canSign: body.canSign ? 1 : 0, removedAt: null } }).returning();

  let emailed = false;
  if (user.status === 'INVITED') {
    const raw = await createInvitation(user.id);
    const base = await requestBase();
    emailed = await sendPortalEmail(email, 'Your secure client portal — US UK Accountants', inviteEmailHtml(body.firstName, `${base}/portal/invite/${raw}`));
  }
  await audit(session.uid, 'CLIENT_MEMBER_ADDED', { targetType: 'client', targetId: id, meta: { memberId: member.id, userId: user.id, role: body.role, canSign: body.canSign, inviteEmailSent: emailed } });
  return NextResponse.json({ ok: true, memberId: member.id, userId: user.id, emailed });
}

/** DELETE ?member=<memberId> — STAFF+: remove a member (their login stops resolving to this client). The primary contact cannot be removed here. */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const a = await staff(); if ('error' in a) return a.error;
  const { session } = a;
  const { id } = await ctx.params;
  const memberId = new URL(req.url).searchParams.get('member') ?? '';
  const [m] = await db.select().from(tables.clientMembers).where(and(eq(tables.clientMembers.id, memberId), eq(tables.clientMembers.clientId, id))).limit(1);
  if (!m) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const [client] = await db.select({ userId: tables.clients.userId }).from(tables.clients).where(eq(tables.clients.id, id)).limit(1);
  if (client?.userId === m.userId) return NextResponse.json({ error: 'The primary contact cannot be removed.' }, { status: 409 });
  await db.update(tables.clientMembers).set({ status: 'REMOVED', removedAt: new Date() }).where(eq(tables.clientMembers.id, m.id));
  await audit(session.uid, 'CLIENT_MEMBER_REMOVED', { targetType: 'client', targetId: id, meta: { memberId: m.id, userId: m.userId } });
  return NextResponse.json({ ok: true });
}
