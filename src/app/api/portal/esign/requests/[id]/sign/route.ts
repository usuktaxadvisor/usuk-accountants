import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { clientSigningContext, transitionErrorResponse } from '@/lib/portal/esign-http';
import { completeRequest, recordEvent, setSignerStatus } from '@/lib/portal/esign-store';
import { notifyStaffOfSignatureEvent, notifyClientOfCompletion } from '@/lib/portal/esign-notify';
import { nextSignerStep, normaliseSignature, sha256Hex } from '@/lib/portal/esign';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST { method: 'TYPED'|'DRAWN'|'CLICK', typedName?, png?, intent: true, acknowledgements?: {fieldId: true} }
 * Applies the signature for THIS signer only. Completion of the whole request happens only when the
 * server sees every signer complete — never because the browser says so.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = await clientSigningContext(id, 'sign');
  if ('error' in c) return c.error;
  const { req: request, signer, bundle, myTurn, ip, userAgent } = c;
  if (!myTurn) return NextResponse.json({ error: 'It is not your turn to sign yet — another signer must complete first.' }, { status: 409 });
  let b: { method?: unknown; typedName?: unknown; png?: unknown; intent?: unknown; acknowledgements?: Record<string, unknown> };
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (b.intent !== true) return NextResponse.json({ error: 'Please confirm that you intend to sign.' }, { status: 400 });
  if (nextSignerStep(request.action, signer.status) !== 'SIGN') return NextResponse.json({ error: 'Please complete the previous step first.' }, { status: 409 });
  if (!signer.otpVerifiedAt) return NextResponse.json({ error: 'Please verify the one-time code first.', code: 'OTP_REQUIRED' }, { status: 403 });
  const sig = normaliseSignature(b.method, b.typedName, b.png);
  if (!sig.ok) return NextResponse.json({ error: sig.reason }, { status: 400 });

  const myFields = bundle.fields.filter(f => f.signerId === signer.id);
  const acks = (b.acknowledgements ?? {}) as Record<string, unknown>;
  for (const f of myFields) {
    if ((f.type === 'CHECKBOX' || f.type === 'ACKNOWLEDGEMENT') && f.required === 1 && acks[f.id] !== true)
      return NextResponse.json({ error: `Please confirm: ${f.label ?? 'the acknowledgement'}.` }, { status: 400 });
  }
  const now = new Date();
  for (const f of myFields) {
    const value = f.type === 'DATE' ? now.toISOString().slice(0, 10) : f.type === 'NAME' ? signer.fullName : (f.type === 'CHECKBOX' || f.type === 'ACKNOWLEDGEMENT') ? String(acks[f.id] === true) : null;
    await db.update(tables.signatureFields).set({ valueText: value, filledAt: now }).where(and(eq(tables.signatureFields.id, f.id), eq(tables.signatureFields.signerId, signer.id)));
  }

  await recordEvent(request.id, 'signing_started', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent, meta: { method: sig.method } });
  let status;
  try {
    status = await setSignerStatus(signer, 'SIGNED', {
      signedAt: now, signatureMethod: sig.method, signatureText: sig.text, signatureImagePng: sig.png,
      ip, userAgent: userAgent?.slice(0, 400), authMethod: signer.authMethod ?? 'PASSWORD_SESSION+EMAIL_OTP',
    });
  } catch (e) { const r = transitionErrorResponse(e); if (r) return r; throw e; }
  await recordEvent(request.id, 'signature_applied', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent, meta: { method: sig.method, typedName: sig.text, drawnImageSha256: sig.png ? sha256Hex(sig.png) : null } });
  await recordEvent(request.id, 'signer_completed', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent });

  if (status === 'COMPLETED') {
    try { await completeRequest(request.id); }
    catch (e) { const r = transitionErrorResponse(e); if (r) return r; console.error('[portal:esign:complete]', e instanceof Error ? e.message : e); return NextResponse.json({ error: 'Your signature was recorded, but the final document could not be sealed. We have been notified and will complete it.' }, { status: 502 }); }
    await notifyStaffOfSignatureEvent(request.clientId, request.title, 'completed');
    await notifyClientOfCompletion(request.clientId, request.title);
    return NextResponse.json({ ok: true, done: true, requestStatus: 'COMPLETED', message: 'Signed. Your signed copy is now available in your documents.' });
  }
  await notifyStaffOfSignatureEvent(request.clientId, request.title, 'partially signed');
  return NextResponse.json({ ok: true, done: true, requestStatus: status, message: 'Signed. We will let you know when everyone has signed.' });
}
