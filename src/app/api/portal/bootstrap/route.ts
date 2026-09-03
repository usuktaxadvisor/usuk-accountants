import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { createInvitation, consentStateKey } from '@/lib/portal/invite';
import { audit } from '@/lib/portal/audit';

/**
 * One-time first-admin bootstrap for an invitation-only system.
 * GET /api/portal/bootstrap?key=<AUTH_SECRET-derived>&email=...
 * Self-disabling: refuses whenever ANY user already exists, so it is
 * only usable on a fresh database and dead thereafter.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get('key') !== consentStateKey()) return new NextResponse('Not found', { status: 404 });
  const email = (url.searchParams.get('email') ?? '').trim().toLowerCase();
  if (!email.includes('@')) return new NextResponse('email parameter required', { status: 400 });

  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(tables.users);
  if (Number(n) > 0) return new NextResponse('Not found', { status: 404 }); // permanently sealed after first user

  const [user] = await db.insert(tables.users).values({ email, role: 'ADMIN', status: 'INVITED', firstName: 'Admin' })
    .returning({ id: tables.users.id });
  const raw = await createInvitation(user.id, 2);
  await audit(user.id, 'BOOTSTRAP_ADMIN', { targetType: 'user', targetId: user.id });
  const base = process.env.AUTH_URL ?? '';
  return new NextResponse(
    `First admin created for ${email}.\nActivate within 48h at:\n${base}/portal/invite/${raw}\n\nThis endpoint is now permanently disabled.`,
    { headers: { 'content-type': 'text/plain', 'cache-control': 'no-store' } },
  );
}
