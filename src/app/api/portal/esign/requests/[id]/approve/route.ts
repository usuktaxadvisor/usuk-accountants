import { NextResponse } from 'next/server';
import { clientSigningContext, transitionErrorResponse } from '@/lib/portal/esign-http';
import { completeRequest, recordEvent, setSignerStatus } from '@/lib/portal/esign-store';
import { notifyStaffOfSignatureEvent, notifySignersOfCompletion, notifyNextSigners } from '@/lib/portal/esign-notify';
import { nextSignerStep } from '@/lib/portal/esign';

export const runtime = 'nodejs';
export const maxDuration = 60;

/** POST { confirmed: true } — explicit approval ("I have reviewed this document and approve it"). For APPROVAL-only requests this completes the signer. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = await clientSigningContext(id, 'approve');
  if ('error' in c) return c.error;
  const { req: request, signer, myTurn, ip, userAgent } = c;
  if (!myTurn) return NextResponse.json({ error: 'It is not your turn to act yet — another signer must complete first.' }, { status: 409 });
  let b: { confirmed?: unknown };
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (b.confirmed !== true) return NextResponse.json({ error: 'Please confirm that you have reviewed the document.' }, { status: 400 });
  if (nextSignerStep(request.action, signer.status) !== 'APPROVE') return NextResponse.json({ error: 'Please complete the previous step first.' }, { status: 409 });
  if (!signer.otpVerifiedAt) return NextResponse.json({ error: 'Please verify the one-time code first.', code: 'OTP_REQUIRED' }, { status: 403 });

  const now = new Date();
  let status;
  try { status = await setSignerStatus(signer, 'APPROVED', { approvedAt: now, ip, userAgent: userAgent?.slice(0, 400), authMethod: signer.authMethod ?? 'PASSWORD_SESSION+EMAIL_OTP' }); }
  catch (e) { const r = transitionErrorResponse(e); if (r) return r; throw e; }
  await recordEvent(request.id, 'approval_recorded', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent });
  if (request.action === 'APPROVAL') {
    await recordEvent(request.id, 'signer_completed', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent });
    if (status === 'COMPLETED') {
      try { await completeRequest(request.id); }
      catch (e) { const r = transitionErrorResponse(e); if (r) return r; console.error('[portal:esign:complete]', e instanceof Error ? e.message : e); return NextResponse.json({ error: 'Your approval was recorded, but the final record could not be sealed. We have been notified and will complete it.' }, { status: 502 }); }
      await notifyStaffOfSignatureEvent(request.clientId, request.title, 'approved');
      await notifySignersOfCompletion(request.id);
    } else {
      for (const nextId of await notifyNextSigners(request.id)) await recordEvent(request.id, 'client_notified', { signerId: nextId, meta: { kind: 'your_turn' } });
    }
    return NextResponse.json({ ok: true, done: true, requestStatus: status, message: 'Thank you — your approval has been recorded.' });
  }
  return NextResponse.json({ ok: true, done: false, next: 'SIGN' });
}
