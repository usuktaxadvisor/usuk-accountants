import { NextResponse } from 'next/server';
import { consentUrl } from '@/lib/portal/drive';
import { consentStateKey } from '@/lib/portal/invite';

/**
 * One-time admin flow to mint the firm's Drive refresh token.
 * Guarded by a key derived from AUTH_SECRET (no session needed — this runs
 * before any user exists). Usage: /api/auth/google/start?key=<derived-key>
 * The exact URL is produced for Sam at handoff; without the key it 404s.
 */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key');
  if (!key || key !== consentStateKey()) return new NextResponse('Not found', { status: 404 });
  return NextResponse.redirect(consentUrl(key));
}
