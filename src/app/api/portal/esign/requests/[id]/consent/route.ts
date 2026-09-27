import { NextResponse } from 'next/server';
import { db, tables } from '@/lib/portal/db';
import { clientSigningContext } from '@/lib/portal/esign-http';
import { recordEvent, setSignerStatus } from '@/lib/portal/esign-store';
import { ESIGN_CONSENT_VERSION, consentTextSha256 } from '@/lib/portal/esign';

export const runtime = 'nodejs';

/** POST { accepted: true, version } — records the exact consent version + text hash for this signer. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = await clientSigningContext(id, 'consent');
  if ('error' in c) return c.error;
  const { req: request, signer, ip, userAgent } = c;
  let b: { accepted?: unknown; version?: unknown };
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (b.accepted !== true || b.version !== ESIGN_CONSENT_VERSION || request.consentVersion !== ESIGN_CONSENT_VERSION)
    return NextResponse.json({ error: 'Please read and accept the electronic signature consent to continue.' }, { status: 400 });
  if (signer.status !== 'VIEWED' && signer.status !== 'PENDING') return NextResponse.json({ ok: true, step: 'already' });
  const now = new Date();
  await db.insert(tables.esignConsents).values({ userId: signer.userId, version: ESIGN_CONSENT_VERSION, textSha256: consentTextSha256(), acceptedAt: now, ip, userAgent: userAgent?.slice(0, 400), requestId: request.id });
  await setSignerStatus(signer, 'CONSENTED', { consentedAt: now, consentVersion: ESIGN_CONSENT_VERSION, viewedAt: signer.viewedAt ?? now });
  await recordEvent(request.id, 'esign_consent_accepted', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent, meta: { version: ESIGN_CONSENT_VERSION, textSha256: consentTextSha256() } });
  return NextResponse.json({ ok: true });
}
