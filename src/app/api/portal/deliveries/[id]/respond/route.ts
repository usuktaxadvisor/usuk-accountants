import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { portalSession } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { rateLimit } from '@/lib/portal/ratelimit';
import { audit } from '@/lib/portal/audit';
import { notifyStaffOfDeliveryResponse } from '@/lib/portal/notify';
import { canClientRespond, getDeliveryForClient, isDecision, normaliseComment, statusAfterDecision } from '@/lib/portal/deliveries';

export const runtime = 'nodejs';

const GENERIC = { error: 'Something went wrong. Please try again or contact support.' };

/**
 * POST /api/portal/deliveries/[id]/respond  { decision: 'APPROVED'|'CHANGES_REQUESTED', comment? }
 * CLIENT only; the delivery must belong to the session's own client and still
 * be open for a response. Records the response, updates status, emails staff, audits.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (session.role !== 'CLIENT' || !session.clientId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!rateLimit(`delivery:respond:${session.uid}`, 30, 10 * 60_000))
    return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });

  const { id } = await ctx.params;
  let b: { decision?: unknown; comment?: unknown };
  try { b = await req.json(); } catch { return NextResponse.json(GENERIC, { status: 400 }); }
  if (!isDecision(b.decision)) return NextResponse.json({ error: 'Invalid response' }, { status: 400 });
  const c = normaliseComment(b.decision, b.comment);
  if (!c.ok) return NextResponse.json({ error: c.reason }, { status: 400 });

  const row = await getDeliveryForClient(session.clientId, id);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canClientRespond(row.status)) return NextResponse.json({ error: 'This document is no longer open for a response.' }, { status: 409 });

  try {
    const status = statusAfterDecision(b.decision);
    await db.insert(tables.deliveryResponses).values({
      deliveryId: row.id, clientId: session.clientId, respondedById: session.uid, decision: b.decision, comment: c.comment,
    });
    await db.update(tables.deliveries)
      .set({ status, respondedAt: new Date(), updatedAt: new Date() })
      .where(eq(tables.deliveries.id, row.id));
    await audit(session.uid, 'DELIVERY_RESPONDED', { targetType: 'delivery', targetId: row.id, meta: { decision: b.decision, hasComment: !!c.comment } });
    await notifyStaffOfDeliveryResponse(session.clientId, row.title, b.decision, c.comment);
    return NextResponse.json({ ok: true, status, message: b.decision === 'APPROVED' ? 'Thank you — your approval has been recorded.' : 'Thank you — we\'ve received your comments and will come back to you.' });
  } catch (e) {
    console.error('[portal:delivery:respond]', e instanceof Error ? e.message : e);
    return NextResponse.json(GENERIC, { status: 500 });
  }
}
