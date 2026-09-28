import { NextResponse } from 'next/server';
import { inArray, lt, and, or, isNull } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { completeRequest, expireIfDue, recordEvent } from '@/lib/portal/esign-store';
import { notifySignersOfSignatureRequest } from '@/lib/portal/esign-notify';
import { eq } from 'drizzle-orm';
import { timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * GET /api/portal/esign/cron — Vercel Cron (Authorization: Bearer CRON_SECRET). Expires overdue requests and
 * sends at most one reminder per request every 3 days while open (never more), plus a due-date reminder.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(req.headers.get('authorization') ?? '', 'utf8'); const want = Buffer.from(secret ? `Bearer ${secret}` : '', 'utf8');
  if (!secret || given.length !== want.length || !timingSafeEqual(given, want)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const open = await db.select().from(tables.signatureRequests).where(inArray(tables.signatureRequests.status, ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED']));
  let expired = 0, reminded = 0;
  const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000);
  for (const r of open) {
    if ((await expireIfDue(r)) === 'EXPIRED') { expired++; continue; }
    const due = r.dueAt && r.dueAt.getTime() - Date.now() < 86_400_000 && r.dueAt.getTime() > Date.now();
    const stale = !r.lastReminderAt ? (r.sentAt && r.sentAt < threeDaysAgo) : r.lastReminderAt < threeDaysAgo;
    if (stale || (due && (!r.lastReminderAt || r.lastReminderAt < new Date(Date.now() - 86_400_000)))) {
      const ok = await notifySignersOfSignatureRequest(r.id, true);
      await db.update(tables.signatureRequests).set({ lastReminderAt: new Date() }).where(eq(tables.signatureRequests.id, r.id));
      await recordEvent(r.id, 'reminder_sent', { meta: { emailed: ok, dueSoon: !!due } });
      reminded++;
    }
  }
  // Self-heal: a request whose signers all completed but whose seal failed (Drive outage, transient error) is
  // COMPLETED without evidence. Retry the seal; completeRequest is idempotent and fails closed on any hash drift.
  let resealed = 0, resealFailed = 0;
  const unsealed = await db.select().from(tables.signatureRequests).where(and(eq(tables.signatureRequests.status, 'COMPLETED'), isNull(tables.signatureRequests.evidenceSha256)));
  for (const r of unsealed) {
    try { await completeRequest(r.id); resealed++; }
    catch (e) { resealFailed++; console.error('[portal:esign:cron:reseal]', r.id, e instanceof Error ? e.message : e); }
  }
  void lt; void or;
  return NextResponse.json({ ok: true, checked: open.length, expired, reminded, resealed, resealFailed });
}
