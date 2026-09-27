import { eq } from 'drizzle-orm';
import { db, tables } from './db';
import { sendPortalEmail } from './email';
import { requestBase } from './notify';
import { SIG_ACTION_LABEL, type SigAction } from './esign';

const wrap = (inner: string) => `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">${inner}<p>Kind regards,<br/>US UK Accountants</p></div>`;
const btn = (href: string, label: string) => `<p style="margin:28px 0"><a href="${href}" style="background:#0A1330;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none">${label}</a></p>`;

async function clientContact(clientId: string) {
  const [row] = await db.select({ email: tables.users.email, firstName: tables.users.firstName, displayName: tables.clients.displayName, ref: tables.clients.clientRef })
    .from(tables.clients).innerJoin(tables.users, eq(tables.users.id, tables.clients.userId)).where(eq(tables.clients.id, clientId)).limit(1);
  return row ?? null;
}

/** "Document ready for your review and signature" — never attaches the document; points back to the portal. */
export async function notifyClientOfSignatureRequest(clientId: string, title: string, action: SigAction, message: string | null, dueAt: Date | null, reminder = false): Promise<boolean> {
  try {
    const c = await clientContact(clientId); if (!c) return false;
    const base = await requestBase();
    const first = c.firstName ?? c.displayName.split(' ')[0];
    const what = SIG_ACTION_LABEL[action].toLowerCase();
    const html = wrap(`<h2 style="font-weight:600">${reminder ? 'Reminder: a document is waiting for you' : 'A document needs your attention'}</h2>
      <p>Dear ${first},</p>
      <p><strong>${escapeHtml(title)}</strong> is ready in your secure portal. Action needed: <strong>${what}</strong>.${dueAt ? ` Please complete it by <strong>${dueAt.toISOString().slice(0, 10)}</strong>.` : ''}</p>
      ${message ? `<p style="border-left:3px solid #C9A84C;padding-left:12px;color:#333">${escapeHtml(message)}</p>` : ''}
      ${btn(`${base}/portal`, 'Open your portal')}
      <p style="font-size:13px;color:#555">For your security the document is not attached to this email. Sign in to your portal to review it, download a copy, and ${action === 'APPROVAL' ? 'approve' : 'sign'} it in a few clicks.</p>`);
    return await sendPortalEmail(c.email, `${reminder ? 'Reminder — ' : ''}${SIG_ACTION_LABEL[action]}: ${title}`, html);
  } catch { return false; }
}

/** One-time signing code. Short life; never mention it anywhere else. */
export async function sendSigningCode(to: string, fullName: string, code: string, title: string): Promise<boolean> {
  const html = wrap(`<h2 style="font-weight:600">Your signing code</h2><p>Dear ${escapeHtml(fullName.split(' ')[0])},</p>
    <p>Use this code to confirm it is you before signing <strong>${escapeHtml(title)}</strong>:</p>
    <p style="font-size:28px;letter-spacing:6px;font-weight:700;margin:18px 0">${code}</p>
    <p style="font-size:13px;color:#555">It expires in 10 minutes. If you did not request it, please ignore this email and contact us.</p>`);
  return sendPortalEmail(to, `Your signing code: ${code}`, html);
}

export async function notifyClientOfCompletion(clientId: string, title: string): Promise<boolean> {
  try {
    const c = await clientContact(clientId); if (!c) return false;
    const base = await requestBase();
    return await sendPortalEmail(c.email, `Completed: ${title}`, wrap(`<h2 style="font-weight:600">All done</h2><p>Dear ${escapeHtml(c.firstName ?? c.displayName.split(' ')[0])},</p>
      <p><strong>${escapeHtml(title)}</strong> is complete. Your signed copy and its signature record are now available in your portal, under your documents.</p>${btn(`${base}/portal`, 'View in your portal')}`));
  } catch { return false; }
}

export async function notifyStaffOfSignatureEvent(clientId: string, title: string, what: 'completed' | 'approved' | 'partially signed' | 'declined', detail?: string): Promise<void> {
  try {
    const to = process.env.LEAD_NOTIFY_TO ?? process.env.PORTAL_FROM_EMAIL; if (!to) return;
    const c = await clientContact(clientId); if (!c) return;
    await sendPortalEmail(to, `Portal e-sign: ${c.displayName} ${what} — ${title}`, wrap(`<p><strong>${escapeHtml(c.displayName)}</strong> (${c.ref}) ${what}: <strong>${escapeHtml(title)}</strong>.</p>${detail ? `<p style="border-left:3px solid #C9A84C;padding-left:12px">${escapeHtml(detail)}</p>` : ''}<p>Open the client in the portal admin to view the signature record.</p>`));
  } catch { /* never block */ }
}

function escapeHtml(s: string): string { return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string)); }
