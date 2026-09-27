import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { portalSession, type PortalSession } from './auth';
import { rateLimit } from './ratelimit';
import { getRequestForClient, getSignerForUser, expireIfDue, loadBundle, StaleSignerStateError, SealInProgressError, type RequestRow, type SignerRow } from './esign-store';
import { canClientOpen, signerMayAct } from './esign';

export const GENERIC = { error: 'Something went wrong. Please try again or contact support.' };

export async function requestMeta(): Promise<{ ip: string | null; userAgent: string | null }> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  return { ip: (fwd ? fwd.split(',')[0].trim() : h.get('x-real-ip')) || null, userAgent: h.get('user-agent') };
}

/**
 * Resolves the signing context for a CLIENT call: authenticated session → request belongs to
 * this client → this user is a signer on it → request still open → (sequential) it is this
 * signer's turn. Every failure returns 404 (never distinguishes "not yours" from "not found")
 * except a closed request (409) so the UI can explain.
 */
export async function clientSigningContext(requestId: string, limitKey: string, max = 60) {
  const session = await portalSession();
  if (!session) return { error: NextResponse.json({ error: 'Not signed in' }, { status: 401 }) } as const;
  if (session.role !== 'CLIENT' || !session.clientId) return { error: NextResponse.json({ error: 'Not found' }, { status: 404 }) } as const;
  if (!rateLimit(`esign:${limitKey}:${session.uid}`, max, 10 * 60_000)) return { error: NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 }) } as const;
  const req = await getRequestForClient(session.clientId, requestId);
  if (!req) return { error: NextResponse.json({ error: 'Not found' }, { status: 404 }) } as const;
  const signer = await getSignerForUser(req.id, session.uid);
  if (!signer) return { error: NextResponse.json({ error: 'Not found' }, { status: 404 }) } as const;
  const status = await expireIfDue(req);
  if (!canClientOpen(status)) return { error: NextResponse.json({ error: 'This request is no longer open.', status }, { status: 409 }) } as const;
  const bundle = await loadBundle(req.id);
  if (!bundle) return { error: NextResponse.json(GENERIC, { status: 500 }) } as const;
  const myTurn = signerMayAct(req.signingOrder as 'PARALLEL' | 'SEQUENTIAL', req.action, signer, bundle.signers);
  const meta = await requestMeta();
  return { session, req: { ...req, status }, signer, bundle, myTurn, ...meta } as { session: PortalSession; req: RequestRow; signer: SignerRow; bundle: NonNullable<Awaited<ReturnType<typeof loadBundle>>>; myTurn: boolean; ip: string | null; userAgent: string | null };
}

/** Maps a lost race (second tab, replayed request, concurrent seal) to a 409 the UI can explain; anything else is rethrown. */
export function transitionErrorResponse(e: unknown): NextResponse | null {
  if (e instanceof StaleSignerStateError || e instanceof SealInProgressError) return NextResponse.json({ error: e.message, code: 'STALE' }, { status: 409 });
  return null;
}

export function pdfResponse(bytes: Buffer | Uint8Array, name: string, download: boolean) {
  const safeName = name.replace(/[^\w.\- ()]/g, '_');
  return new Response(Buffer.from(bytes), { status: 200, headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safeName}"`,
    'Content-Length': String(bytes.length),
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  } });
}
