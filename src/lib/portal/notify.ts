import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { db, tables } from './db';
import { sendPortalEmail, requestEmailHtml, uploadNotifyHtml } from './email';

/** Base URL derived from the current request (falls back to AUTH_URL / production). */
export async function requestBase(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : (process.env.AUTH_URL ?? 'https://www.usukaccountants.com');
}

/** Email the client that a new document has been requested. Best effort — never throws. */
export async function notifyClientOfRequest(clientId: string, title: string): Promise<boolean> {
  try {
    const [row] = await db.select({ email: tables.users.email, firstName: tables.users.firstName, displayName: tables.clients.displayName })
      .from(tables.clients).innerJoin(tables.users, eq(tables.users.id, tables.clients.userId))
      .where(eq(tables.clients.id, clientId)).limit(1);
    if (!row) return false;
    const base = await requestBase();
    return await sendPortalEmail(row.email, `Document requested: ${title}`, requestEmailHtml(row.firstName ?? row.displayName.split(' ')[0], title, `${base}/portal`));
  } catch { return false; }
}

/** Alert the firm that a client uploaded a document. Best effort — never throws. */
export async function notifyStaffOfUpload(clientId: string, requestId: string, filename: string): Promise<void> {
  try {
    const to = process.env.LEAD_NOTIFY_TO ?? process.env.PORTAL_FROM_EMAIL;
    if (!to) return;
    const [c] = await db.select({ name: tables.clients.displayName, ref: tables.clients.clientRef }).from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
    const [r] = await db.select({ title: tables.documentRequests.title }).from(tables.documentRequests).where(eq(tables.documentRequests.id, requestId)).limit(1);
    if (!c) return;
    await sendPortalEmail(to, `Portal upload: ${c.name} — ${r?.title ?? 'document'}`, uploadNotifyHtml(c.name, c.ref, r?.title ?? 'document', filename));
  } catch { /* never block the upload on email */ }
}
