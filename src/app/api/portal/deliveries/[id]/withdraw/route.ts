import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { audit } from '@/lib/portal/audit';
import { canWithdraw, getDeliveryForStaff } from '@/lib/portal/deliveries';

export const runtime = 'nodejs';

/**
 * POST /api/portal/deliveries/[id]/withdraw  { clientId }
 * STAFF+. Marks the delivery WITHDRAWN so the client can no longer open it.
 * The Drive file is retained (it is the firm's own file); nothing is deleted.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try { session = await requireRole('STAFF'); }
  catch (e) { return NextResponse.json({ error: 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }); }

  const { id } = await ctx.params;
  let b: { clientId?: unknown };
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
  const clientId = String(b.clientId ?? '');
  const row = await getDeliveryForStaff(clientId, id);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canWithdraw(row.status)) return NextResponse.json({ ok: true, status: row.status });

  await db.update(tables.deliveries)
    .set({ status: 'WITHDRAWN', withdrawnAt: new Date(), updatedAt: new Date() })
    .where(eq(tables.deliveries.id, row.id));
  await audit(session.uid, 'DELIVERY_WITHDRAWN', { targetType: 'delivery', targetId: row.id, meta: { clientId } });
  return NextResponse.json({ ok: true, status: 'WITHDRAWN' });
}
