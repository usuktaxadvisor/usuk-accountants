/**
 * Portal transactional email via Resend (same service the marketing
 * lead-forms already use — no new provider). Fails soft: an email
 * problem is reported to the caller but never crashes a flow.
 */
export async function sendPortalEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PORTAL_FROM_EMAIL ?? process.env.LEAD_NOTIFY_FROM;
  if (!apiKey || !from) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: `US UK Accountants <${from}>`, to: [to], subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function inviteEmailHtml(firstName: string, link: string): string {
  return `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
  <h2 style="font-weight:600">Your secure client portal</h2>
  <p>Dear ${firstName},</p>
  <p>We've set up your private area on the US UK Accountants client portal, where you can
  securely upload the documents we request and see their status at any time.</p>
  <p style="margin:28px 0"><a href="${link}" style="background:#0A1330;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none">Activate your account</a></p>
  <p style="font-size:13px;color:#555">This link is personal to you and expires in 7 days. If it expires,
  just reply to this email and we'll send a fresh one. If you weren't expecting this invitation,
  you can safely ignore it.</p>
  <p>Kind regards,<br/>US UK Accountants</p></div>`;
}
