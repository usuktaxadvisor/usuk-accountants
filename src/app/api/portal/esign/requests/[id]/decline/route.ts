import { NextResponse } from 'next/server';
import { clientSigningContext, transitionErrorResponse } from '@/lib/portal/esign-http';
import { recordEvent, setSignerStatus } from '@/lib/portal/esign-store';
import { notifyStaffOfSignatureEvent } from '@/lib/portal/esign-notify';

export const runtime = 'nodejs';

/** POST { reason } — the signer declines; the whole request becomes DECLINED and staff are told why. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = await clientSigningContext(id, 'decline');
  if ('error' in c) return c.error;
  const { req: request, signer, ip, userAgent } = c;
  let b: { reason?: unknown };
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  const reason = String(b.reason ?? '').trim().slice(0, 2000);
  if (!reason) return NextResponse.json({ error: 'Please tell us why, so we can put it right.' }, { status: 400 });
  if (signer.status === 'SIGNED' || signer.status === 'DECLINED') return NextResponse.json({ error: 'This step is already complete.' }, { status: 409 });
  try { await setSignerStatus(signer, 'DECLINED', { declinedAt: new Date(), declineReason: reason, ip, userAgent: userAgent?.slice(0, 400) }); }
  catch (e) { const r = transitionErrorResponse(e); if (r) return r; throw e; }
  await recordEvent(request.id, 'request_declined', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent, meta: { reasonLength: reason.length } });
  await notifyStaffOfSignatureEvent(request.clientId, request.title, 'declined', reason);
  return NextResponse.json({ ok: true, message: "Thank you — we've received your comments and will come back to you." });
}
