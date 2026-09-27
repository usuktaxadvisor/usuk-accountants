import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { timingSafeEqual } from 'node:crypto';
import { db, tables } from '@/lib/portal/db';
import { clientSigningContext } from '@/lib/portal/esign-http';
import { recordEvent } from '@/lib/portal/esign-store';
import { OTP_MAX_ATTEMPTS, OTP_TTL_MS, generateOtp, otpHash } from '@/lib/portal/esign';
import { sendSigningCode } from '@/lib/portal/esign-notify';
import { rateLimit } from '@/lib/portal/ratelimit';

export const runtime = 'nodejs';

/**
 * POST { action: 'send' } → emails a 6-digit code to the signer's verified address (second factor for the signing event).
 * POST { action: 'verify', code } → checks it (max 5 attempts, 10-minute life). Only the hash is stored.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = await clientSigningContext(id, 'otp', 40);
  if ('error' in c) return c.error;
  const { req: request, signer, ip, userAgent } = c;
  let b: { action?: unknown; code?: unknown };
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  if (b.action === 'send') {
    if (!rateLimit(`esign:otp:send:${signer.id}`, 5, 15 * 60_000)) return NextResponse.json({ error: 'Too many codes requested — please wait 15 minutes.' }, { status: 429 });
    const code = generateOtp();
    await db.update(tables.signatureSigners).set({ otpHash: otpHash(code, signer.id), otpExpiresAt: new Date(Date.now() + OTP_TTL_MS), otpAttempts: 0 }).where(eq(tables.signatureSigners.id, signer.id));
    const sent = await sendSigningCode(signer.email, signer.fullName, code, request.title);
    await recordEvent(request.id, 'identity_otp_sent', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent, meta: { emailed: sent, emailDomain: signer.email.split('@')[1] } });
    if (!sent) return NextResponse.json({ error: 'We could not send the code. Please try again in a moment.' }, { status: 502 });
    return NextResponse.json({ ok: true, message: `We've emailed a 6-digit code to ${maskEmail(signer.email)}. It is valid for 10 minutes.` });
  }

  if (b.action === 'verify') {
    const code = String(b.code ?? '').replace(/\D/g, '');
    if (!signer.otpHash || !signer.otpExpiresAt || signer.otpExpiresAt.getTime() < Date.now()) return NextResponse.json({ error: 'The code has expired. Please request a new one.' }, { status: 400 });
    if (signer.otpAttempts >= OTP_MAX_ATTEMPTS) return NextResponse.json({ error: 'Too many incorrect attempts. Please request a new code.' }, { status: 429 });
    const expected = Buffer.from(signer.otpHash, 'utf8'); const given = Buffer.from(otpHash(code, signer.id), 'utf8');
    if (code.length !== 6 || expected.length !== given.length || !timingSafeEqual(expected, given)) {
      await db.update(tables.signatureSigners).set({ otpAttempts: sql`${tables.signatureSigners.otpAttempts} + 1` }).where(eq(tables.signatureSigners.id, signer.id));
      await recordEvent(request.id, 'identity_otp_failed', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent, meta: { attempt: signer.otpAttempts + 1 } });
      return NextResponse.json({ error: 'That code is not correct. Please check and try again.' }, { status: 400 });
    }
    const now = new Date();
    await db.update(tables.signatureSigners).set({ otpVerifiedAt: now, otpHash: null, otpExpiresAt: null, authMethod: 'PASSWORD_SESSION+EMAIL_OTP' }).where(eq(tables.signatureSigners.id, signer.id));
    await recordEvent(request.id, 'identity_otp_verified', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

function maskEmail(e: string): string { const [u, d] = e.split('@'); return `${u.slice(0, 2)}${'•'.repeat(Math.max(1, u.length - 2))}@${d}`; }
