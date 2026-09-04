/**
 * Portal transactional email via Resend (same service the marketing
 * lead-forms already use — no new provider). Fails soft: an email
 * problem is reported to the caller but never crashes a flow.
 */
export async function sendPortalEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.error('[portal:email] RESEND_API_KEY missing'); return false; }
  // Portal sender first, then the sender the marketing site already uses (known-verified).
  const senders = [process.env.PORTAL_FROM_EMAIL, process.env.LEAD_NOTIFY_FROM].filter((v): v is string => !!v);
  for (const from of senders) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `US UK Accountants <${from}>`, to: [to], subject, html }),
      });
      if (res.ok) return true;
      const detail = await res.text().catch(() => '');
      console.error(`[portal:email] Resend ${res.status} using sender ${from}: ${detail.slice(0, 300)}`); // server logs only
    } catch (e) {
      console.error('[portal:email] network error', e instanceof Error ? e.message : e);
    }
  }
  return false;
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

export function requestEmailHtml(firstName: string, title: string, link: string): string {
  return `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
  <h2 style="font-weight:600">We need a document from you</h2>
  <p>Dear ${firstName},</p>
  <p>We've added a new request to your client portal:</p>
  <p style="font-size:17px;font-weight:600;margin:18px 0">${title}</p>
  <p>Please sign in and upload it when convenient — it takes under a minute, and works from your phone too.</p>
  <p style="margin:28px 0"><a href="${link}" style="background:#0A1330;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none">Open your portal</a></p>
  <p style="font-size:13px;color:#555">If you've forgotten your password, use “Forgotten your password?” on the login page and we'll send you a fresh link.</p>
  <p>Kind regards,<br/>US UK Accountants</p></div>`;
}

export function resetEmailHtml(firstName: string, link: string): string {
  return `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
  <h2 style="font-weight:600">Reset your portal password</h2>
  <p>Dear ${firstName},</p>
  <p>Use the button below to choose a new password for the US UK Accountants client portal.</p>
  <p style="margin:28px 0"><a href="${link}" style="background:#0A1330;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none">Set a new password</a></p>
  <p style="font-size:13px;color:#555">This link is personal to you and expires in 24 hours. If you didn't ask for a reset, you can ignore this email — your password stays as it is.</p>
  <p>Kind regards,<br/>US UK Accountants</p></div>`;
}

export function uploadNotifyHtml(clientName: string, clientRef: string, title: string, filename: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111">
  <h3 style="font-weight:600">Portal upload received</h3>
  <p><b>${clientName}</b> (${clientRef}) uploaded <b>${filename}</b> for the request “${title}”.</p>
  <p>It's in their Incoming Documents folder in Drive and marked UPLOADED in the staff area.</p></div>`;
}
