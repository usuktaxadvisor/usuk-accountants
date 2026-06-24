import { NextResponse } from 'next/server';

/**
 * Review feedback endpoint (sentiment routing).
 *
 * Part of the review acquisition engine. When a client indicates a lukewarm
 * experience (≤3), they are routed to a PRIVATE feedback form that posts here
 * instead of to a public review platform — so issues reach the firm directly
 * and can be resolved before they become public. Happy clients (4–5) are sent
 * straight to the public Google / Trustpilot links and never hit this route.
 *
 * This is legitimate triage, not review-gating: every client can still leave a
 * public review; this simply routes the FIRST touch by sentiment.
 *
 * ENV (reuses the lead-notification config):
 *   RESEND_API_KEY, LEAD_NOTIFY_TO, LEAD_NOTIFY_FROM
 * Without RESEND_API_KEY the route logs and returns 200 (dev-friendly).
 */

export const runtime = 'nodejs';

interface FeedbackPayload {
  rating?: number;      // 1–5 the client selected
  name?: string;
  email?: string;
  message?: string;     // what could we have done better
  engagement?: string;  // optional reference to the engagement
}

function validate(body: FeedbackPayload): string | null {
  if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
    return 'A rating between 1 and 5 is required.';
  }
  if ((body.message?.length ?? 0) > 5000) return 'Message is too long.';
  if ((body.name?.length ?? 0) > 200) return 'Name is too long.';
  return null;
}

async function notify(body: FeedbackPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO ?? 'hello@usukaccountants.com';
  const from = process.env.LEAD_NOTIFY_FROM ?? 'US UK Accountants <hello@usukaccountants.com>';

  const subject = `Private client feedback — ${body.rating}/5`;
  const text = [
    `Rating: ${body.rating}/5`,
    body.name ? `Name: ${body.name}` : null,
    body.email ? `Email: ${body.email}` : null,
    body.engagement ? `Engagement: ${body.engagement}` : null,
    '',
    body.message ?? '(no message)',
  ].filter(Boolean).join('\n');

  if (!apiKey) {
    console.log('[review-feedback] (no RESEND_API_KEY) would notify:', { subject, text });
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text }),
  });
}

export async function POST(request: Request) {
  let body: FeedbackPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const error = validate(body);
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });

  try {
    await notify(body);
  } catch (e) {
    console.error('[review-feedback] notify failed', e);
    // Still return ok so the client sees a graceful thank-you.
  }

  return NextResponse.json({ ok: true });
}
