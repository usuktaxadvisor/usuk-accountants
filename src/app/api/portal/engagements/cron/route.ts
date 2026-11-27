import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { rollOverRecurring, isMissingTable } from '@/lib/portal/engagement-store';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * GET /api/portal/engagements/cron — Vercel Cron (Authorization: Bearer CRON_SECRET), daily.
 * Saves any statutory deadline missing from an open engagement, and once a tax year or accounting
 * period closes, adds next year's engagement (status Planned) for every recurring engagement.
 * Additive only: it never edits or deletes an existing engagement or deadline, and skips archived clients.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(req.headers.get('authorization') ?? '', 'utf8'); const want = Buffer.from(secret ? `Bearer ${secret}` : '', 'utf8');
  if (!secret || given.length !== want.length || !timingSafeEqual(given, want)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, ...(await rollOverRecurring()) });
  } catch (e) {
    if (isMissingTable(e)) return NextResponse.json({ ok: true, skipped: 'engagement tables not created yet' });
    console.error('[portal:engagements:cron]', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
