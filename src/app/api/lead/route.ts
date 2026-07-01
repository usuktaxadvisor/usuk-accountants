import { NextResponse } from 'next/server';

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
 * so the funnel works in development without email configured.
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

type LeadType = 'contact' | 'booking' | 'lead' | 'newsletter';

interface LeadPayload {
  type: LeadType;
  name?: string;
  email?: string;
  phone?: string;
  situation?: string;
  message?: string;
  source?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function validate(body: LeadPayload): string | null {
  const allowed: LeadType[] = ['contact', 'booking', 'lead', 'newsletter'];
  if (!body.type || !allowed.includes(body.type)) return 'Invalid submission type.';
  if (!body.email || !EMAIL_RE.test(body.email)) return 'A valid email is required.';
  if ((body.type === 'contact' || body.type === 'booking') && !body.name?.trim()) {
    return 'Name is required.';
  }
  // Length guards
  if ((body.message?.length ?? 0) > 5000) return 'Message is too long.';
  if ((body.name?.length ?? 0) > 200) return 'Name is too long.';
  return null;
}

async function sendNotification(body: LeadPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;

  if (!apiKey || !to || !from) {
    // Email not configured — log so the lead is never silently lost in dev.
    console.info('[lead] (email not configured) new submission:', {
      type: body.type, email: body.email, source: body.source,
    });
    return { delivered: false };
  }

  const rows = Object.entries(body)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5A6276">${escapeHtml(k)}</td><td style="padding:4px 0;font-weight:600">${escapeHtml(String(v))}</td></tr>`)
    .join('');

  const subject = `New ${body.type} lead${body.name ? ` — ${body.name}` : ''}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="font-family:Georgia,serif;color:#0A1330">New ${escapeHtml(body.type)} submission</h2>
      <table style="border-collapse:collapse;font-size:14px">${rows}</table>
      <p style="color:#5A6276;font-size:12px;margin-top:24px">Sent from usukaccountants.com</p>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      reply_to: body.email,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[lead] email send failed:', res.status, detail);
    return { delivered: false };
  }
  return { delivered: true };
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

  try {
    const { delivered } = await sendNotification(body);
    return NextResponse.json({ ok: true, delivered });
  } catch (err) {
    console.error('[lead] handler error:', err);
    // Never lose a lead to a 500 on the client — accept and log.
    return NextResponse.json({ ok: true, delivered: false });
  }
}
