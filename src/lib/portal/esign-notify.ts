import { eq } from 'drizzle-orm';
import { db, tables } from './db';
import { sendPortalEmail } from './email';
import { requestBase } from './notify';
import { SIG_ACTION_LABEL, signersNowUp, type SigAction, type SigSignerStatus } from './esign';

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

/** Emails every signer who has not yet completed (or, for completion, every signer). Returns true if at least one email went out. */
export async function notifySignersOfSignatureRequest(requestId: string, reminder: boolean): Promise<boolean> {
  try {
    const [r] = await db.select().from(tables.signatureRequests).where(eq(tables.signatureRequests.id, requestId)).limit(1); if (!r) return false;
    const signers = await db.select().from(tables.signatureSigners).where(eq(tables.signatureSigners.requestId, requestId));
    const pending = signers.filter(s => !['SIGNED', 'DECLINED'].includes(s.status) && !(r.action === 'APPROVAL' && s.status === 'APPROVED'));
    const base = await requestBase();
    const what = SIG_ACTION_LABEL[r.action].toLowerCase();
    let any = false;
    for (const s of pending) {
      const others = signers.filter(x => x.id !== s.id).map(x => x.fullName);
      const html = wrap(`<h2 style="font-weight:600">${reminder ? 'Reminder: a document is waiting for you' : 'A document needs your attention'}</h2>
        <p>Dear ${escapeHtml(s.fullName.split(' ')[0])},</p>
        <p><strong>${escapeHtml(r.title)}</strong> is ready in your secure portal. Action needed: <strong>${what}</strong>.${r.dueAt ? ` Please complete it by <strong>${r.dueAt.toISOString().slice(0, 10)}</strong>.` : ''}</p>
        ${others.length ? `<p style="font-size:13px;color:#555">This document also needs ${others.map(escapeHtml).join(' and ')} to ${r.action === 'APPROVAL' ? 'approve' : 'sign'} it${r.signingOrder === 'SEQUENTIAL' ? ' — signing happens in turn, and we will let you know when it is yours' : ' — each of you signs with your own login'}.</p>` : ''}
        ${r.message ? `<p style="border-left:3px solid #C9A84C;padding-left:12px;color:#333">${escapeHtml(r.message)}</p>` : ''}
        ${btn(`${base}/portal`, 'Open your portal')}
        <p style="font-size:13px;color:#555">For your security the document is not attached to this email. Sign in with your own login to review it, download a copy, and ${r.action === 'APPROVAL' ? 'approve' : 'sign'} it.</p>`);
      if (await sendPortalEmail(s.email, `${reminder ? 'Reminder — ' : ''}${SIG_ACTION_LABEL[r.action]}: ${r.title}`, html)) any = true;
    }
    return any;
  } catch { return false; }
}

/**
 * SEQUENTIAL requests: after a signer completes, tell the signer(s) whose turn has now come.
 * Records a `client_notified` event per recipient via the caller. Safe to call for PARALLEL (no-op).
 */
export async function notifyNextSigners(requestId: string): Promise<string[]> {
  try {
    const [r] = await db.select().from(tables.signatureRequests).where(eq(tables.signatureRequests.id, requestId)).limit(1);
    if (!r || r.signingOrder !== 'SEQUENTIAL') return [];
    const signers = await db.select().from(tables.signatureSigners).where(eq(tables.signatureSigners.requestId, requestId));
    const nowUp = signersNowUp('SEQUENTIAL', r.action, signers.map(s => ({ ...s, status: s.status as SigSignerStatus })));
    const base = await requestBase();
    const what = SIG_ACTION_LABEL[r.action].toLowerCase();
    const notified: string[] = [];
    for (const s of nowUp) {
      const before = signers.filter(p => p.sequence < s.sequence).map(p => p.fullName);
      const html = wrap(`<h2 style="font-weight:600">It is your turn to ${r.action === 'APPROVAL' ? 'approve' : 'sign'}</h2>
        <p>Dear ${escapeHtml(s.fullName.split(' ')[0])},</p>
        <p>${before.map(escapeHtml).join(' and ')} ${before.length === 1 ? 'has' : 'have'} completed their part of <strong>${escapeHtml(r.title)}</strong>. It is now your turn: <strong>${what}</strong>.${r.dueAt ? ` Please complete it by <strong>${r.dueAt.toISOString().slice(0, 10)}</strong>.` : ''}</p>
        ${btn(`${base}/portal`, 'Open your portal')}
        <p style="font-size:13px;color:#555">For your security the document is not attached to this email. Sign in with your own login to review it and ${r.action === 'APPROVAL' ? 'approve' : 'sign'} it.</p>`);
      if (await sendPortalEmail(s.email, `Your turn — ${SIG_ACTION_LABEL[r.action]}: ${r.title}`, html)) notified.push(s.id);
    }
    return notified;
  } catch { return []; }
}

/** Completion email to EVERY signer of the request (each signed with their own login). */
export async function notifySignersOfCompletion(requestId: string): Promise<boolean> {
  try {
    const [r] = await db.select().from(tables.signatureRequests).where(eq(tables.signatureRequests.id, requestId)).limit(1); if (!r) return false;
    const signers = await db.select().from(tables.signatureSigners).where(eq(tables.signatureSigners.requestId, requestId));
    const base = await requestBase(); let any = false;
    for (const s of signers) {
      if (await sendPortalEmail(s.email, `Completed: ${r.title}`, wrap(`<h2 style="font-weight:600">All done</h2><p>Dear ${escapeHtml(s.fullName.split(' ')[0])},</p>
        <p><strong>${escapeHtml(r.title)}</strong> is complete. ${r.action === 'APPROVAL' ? 'Your approval record is' : 'Your signed copy and its signature record are'} now available in your portal, under your documents.</p>${btn(`${base}/portal`, 'View in your portal')}`))) any = true;
    }
    return any;
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
