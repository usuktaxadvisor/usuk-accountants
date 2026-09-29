import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { audit } from '@/lib/portal/audit';
import { getMembership } from '@/lib/portal/members';

export const runtime = 'nodejs';

const Body = z.object({
  clientId: z.string().uuid(),
  method: z.enum(['IN_PERSON_PHOTO_ID', 'THIRD_PARTY_KBA', 'MULTI_YEAR_RELATIONSHIP', 'VIDEO_PHOTO_ID']),
  providerRef: z.string().trim().max(120).nullable().default(null),
  note: z.string().trim().max(500).nullable().default(null), // never document numbers
  validForMonths: z.number().int().min(1).max(60).default(24),
  userId: z.string().uuid().optional(), // which member was verified (default: primary contact); must be a member of the client
});

/**
 * POST — STAFF+ records that a client's identity was verified (IRS Pub. 1345 prerequisite for remotely
 * e-signing Form 8878/8879). Recording is itself audited; the note must not contain ID numbers.
 */
export async function POST(req: Request) {
  let session;
  try { session = await requireRole('STAFF'); }
  catch (e) { return NextResponse.json({ error: e instanceof PortalAuthError && e.status === 403 ? 'Forbidden' : 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }); }
  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (body.note && /\b\d{6,}\b/.test(body.note)) return NextResponse.json({ error: 'Do not record document numbers in the note.' }, { status: 400 });
  const [client] = await db.select().from(tables.clients).where(eq(tables.clients.id, body.clientId)).limit(1);
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const userId = body.userId ?? client.userId;
  if (!(await getMembership(client.id, userId))) return NextResponse.json({ error: 'That person is not a member of this client' }, { status: 400 });
  const validUntil = new Date(); validUntil.setMonth(validUntil.getMonth() + body.validForMonths);
  const [row] = await db.insert(tables.identityVerifications).values({ clientId: client.id, userId, method: body.method, verifiedById: session.uid, providerRef: body.providerRef, note: body.note, validUntil }).returning({ id: tables.identityVerifications.id });
  await audit(session.uid, 'IDV_RECORDED', { targetType: 'client', targetId: client.id, meta: { method: body.method, validUntil: validUntil.toISOString() } });
  return NextResponse.json({ ok: true, id: row.id, validUntil });
}
