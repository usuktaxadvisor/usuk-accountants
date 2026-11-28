import { NextResponse } from 'next/server';
import { DELIVERY_FAILED_MESSAGE, sendNotification, validate, type LeadPayload } from '@/lib/lead';

/**
 * Lead submission endpoint.
 *
 * Accepts contact, booking and newsletter/lead-capture submissions, validates
 * server-side, then sends an email notification via Resend (https://resend.com).
 *
 * ENV required (set in .env.local / Vercel project settings):
 *   RESEND_API_KEY      – your Resend API key
 *   LEAD_NOTIFY_TO      – inbox that receives new-lead notifications
 *   LEAD_NOTIFY_FROM    – verified sender, e.g. "US UK Accountants <hello@usukaccountants.com>"
 *
 * If RESEND_API_KEY is absent the route still returns 200 and logs the lead,
 * so the funnel works in development without email configured. When email IS
 * configured and the send fails twice, enquiries get a 502 with a message that
 * gives the visitor the email address, so a lead is never silently lost.
 */

export const runtime = 'nodejs';

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 },
    );
  }

  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const error = validate(body);
  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  const { delivered, configured } = await sendNotification(body);

  // An enquiry that did not reach the team must never look like a success to the
  // visitor: they would wait for a reply that cannot come. Tell them, with the
  // email address as the fallback. (Without email configured, i.e. local
  // development, the submission is logged and accepted.)
  if (configured && !delivered && (body.type === 'contact' || body.type === 'booking' || body.type === 'lead')) {
    console.error('[lead] UNDELIVERED enquiry:', { type: body.type, source: body.source, page: body.page });
    return NextResponse.json({ ok: false, delivered: false, error: DELIVERY_FAILED_MESSAGE }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered });
}
