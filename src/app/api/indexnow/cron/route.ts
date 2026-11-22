import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { submitToIndexNow } from '@/lib/indexnow';
import sitemap from '@/app/sitemap';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * GET /api/indexnow/cron — Vercel Cron (Authorization: Bearer CRON_SECRET).
 *
 * Sends the sitemap URLs to IndexNow once a week so Bing and the other
 * IndexNow engines hear about new and changed pages without anyone having to
 * remember to submit them. The manual POST /api/indexnow endpoint stays as it
 * is for one-off submissions.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(req.headers.get('authorization') ?? '', 'utf8');
  const want = Buffer.from(secret ? `Bearer ${secret}` : '', 'utf8');
  if (!secret || given.length !== want.length || !timingSafeEqual(given, want)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const urls = [...new Set(sitemap().map((e) => String(e.url)))];
  const result = await submitToIndexNow(urls);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
