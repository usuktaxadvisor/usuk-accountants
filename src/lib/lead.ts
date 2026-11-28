/**
 * Lead handling for /api/lead: validation, the staff notification email and its
 * delivery through Resend. Kept out of the route file so it can be unit tested
 * (a Next.js route module may only export handlers and route config).
 */

export type LeadType = 'contact' | 'booking' | 'lead' | 'newsletter';

export interface LeadPayload {
  type: LeadType;
  name?: string;
  email?: string;
  phone?: string;
  situation?: string;
  message?: string;
  source?: string;
  /** Path of the page the enquiry was sent from, e.g. /services/us-expat-tax/fbar-filing */
  page?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function validate(body: LeadPayload): string | null {
  const allowed: LeadType[] = ['contact', 'booking', 'lead', 'newsletter'];
  if (!body.type || !allowed.includes(body.type)) return 'Invalid submission type.';
  if (!body.email || !EMAIL_RE.test(body.email)) return 'A valid email is required.';
  if ((body.type === 'contact' || body.type === 'booking') && !body.name?.trim()) {
    return 'Name is required.';
  }
  // Length guards
  if ((body.message?.length ?? 0) > 5000) return 'Message is too long.';
  if ((body.name?.length ?? 0) > 200) return 'Name is too long.';
  if (body.page != null && (typeof body.page !== 'string' || body.page.length > 200 || !body.page.startsWith('/'))) {
    return 'Invalid page.';
  }
  return null;
}

const LABELS: Record<string, string> = {
  type: 'Type', name: 'Name', email: 'Email', phone: 'Phone', situation: 'Situation',
  message: 'Message', source: 'Source', page: 'Sent from page',
};
const FIELD_ORDER = ['name', 'email', 'phone', 'situation', 'message', 'page', 'source', 'type'] as const;

/** Builds the staff notification. Exported for tests. */
export function buildLeadEmail(body: LeadPayload): { subject: string; html: string; text: string } {
  const fields = FIELD_ORDER
    .map((k) => [k, body[k]] as const)
    .filter(([, v]) => v != null && String(v).trim() !== '');

  const rows = fields
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5A6276;vertical-align:top;white-space:nowrap">${escapeHtml(LABELS[k])}</td><td style="padding:4px 0;font-weight:600;white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`)
    .join('');

  const subject = `New ${body.type} lead${body.name ? ` — ${body.name}` : ''}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="font-family:Georgia,serif;color:#0A1330">New ${escapeHtml(body.type)} submission</h2>
      <table style="border-collapse:collapse;font-size:14px">${rows}</table>
      <p style="color:#5A6276;font-size:12px;margin-top:24px">Sent from usukaccountants.com</p>
    </div>`;
  // Plain-text part, one field per line, so the enquiry reads cleanly in previews and plain-text clients.
  const text = [
    `New ${body.type} submission`,
    '',
    ...fields.map(([k, v]) => `${LABELS[k]}: ${String(v)}`),
    '',
    'Sent from usukaccountants.com',
  ].join('\n');
  return { subject, html, text };
}

const SEND_ATTEMPTS = 2;
const RETRY_DELAY_MS = 700;

type SendResult = { delivered: boolean; configured: boolean };

/**
 * Sends the staff notification through Resend, retrying once on failure.
 * `configured: false` means email is not set up at all (local development).
 * Exported for tests.
 */
export async function sendNotification(body: LeadPayload, wait: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms))): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;

  if (!apiKey || !to || !from) {
    // Email not configured — log so the lead is visible in development.
    console.info('[lead] (email not configured) new submission:', {
      type: body.type, email: body.email, source: body.source,
    });
    return { delivered: false, configured: false };
  }

  const { subject, html, text } = buildLeadEmail(body);

  for (let attempt = 1; attempt <= SEND_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, subject, html, text, reply_to: body.email }),
      });
      if (res.ok) return { delivered: true, configured: true };
      const detail = await res.text().catch(() => '');
      console.error(`[lead] email send failed (attempt ${attempt}/${SEND_ATTEMPTS}):`, res.status, detail);
    } catch (err) {
      console.error(`[lead] email send threw (attempt ${attempt}/${SEND_ATTEMPTS}):`, err);
    }
    if (attempt < SEND_ATTEMPTS) await wait(RETRY_DELAY_MS);
  }
  return { delivered: false, configured: true };
}

/** Shown to the visitor when their enquiry could not be delivered to the team. */
export const DELIVERY_FAILED_MESSAGE =
  'Sorry, we could not send your message just now. Please email it to hello@usukaccountants.com and we will reply from there.';
