import { NextResponse } from 'next/server';
import { inArray, lt, and, or, isNull } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { expireIfDue, recordEvent } from '@/lib/portal/esign-store';
import { notifyClientOfSignatureRequest } from '@/lib/portal/esign-notify';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * GET /api/portal/esign/cron — Vercel Cron (Authorization: Bearer CRON_SECRET). Expires overdue requests and
 * sends at most one reminder per request every 3 days while open (never more), plus a due-date reminder.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const open = await db.select().from(tables.signatureRequests).where(inArray(tables.signatureRequests.status, ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED']));
  let expired = 0, reminded = 0;
  const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000);
  for (const r of open) {
    if ((await expireIfDue(r)) === 'EXPIRED') { expired++; continue; }
    const due = r.dueAt && r.dueAt.getTime() - Date.now() < 86_400_000 && r.dueAt.getTime() > Date.now();
    const stale = !r.lastReminderAt ? (r.sentAt && r.sentAt < threeDaysAgo) : r.lastReminderAt < threeDaysAgo;
    if (stale || (due && (!r.lastReminderAt || r.lastReminderAt < new Date(Date.now() - 86_400_000)))) {
      const ok = await notifyClientOfSignatureRequest(r.clientId, r.title, r.action, r.message, r.dueAt, true);
      await db.update(tables.signatureRequests).set({ lastReminderAt: new Date() }).where(eq(tables.signatureRequests.id, r.id));
      await recordEvent(r.id, 'reminder_sent', { meta: { emailed: ok, dueSoon: !!due } });
      reminded++;
    }
  }
  void lt; void and; void or; void isNull;
  return NextResponse.json({ ok: true, checked: open.length, expired, reminded });
}
