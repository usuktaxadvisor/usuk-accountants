import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { validateUpload } from '@/lib/portal/validate';
import { verifyUploadedFile, deleteDriveFile } from '@/lib/portal/drive';
import { audit } from '@/lib/portal/audit';
import { DELIVERY_CATEGORIES, canReplace, getDeliveryForStaff } from '@/lib/portal/deliveries';
import { recordDelivery } from '@/lib/portal/delivery-record';
import { deliveryUploadSigValid } from '@/lib/portal/delivery-upload';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GENERIC = { error: 'Something went wrong. Please try again or contact support.' };

/**
 * POST /api/portal/deliveries/complete
 *   { clientId, fileId, storedName, size, originalName, mime, sig, title?, category?, note?, supersedesId? }
 * Staff, large-file path: finalises a delivery after the browser has streamed
 * the file to the session opened by /api/portal/deliveries/session. The
 * signature proves this staff member opened that session for this client,
 * name, size and replaced version; the file is then checked in Drive (right
 * folder, right size, real content) before the same record → email → audit
 * step as the ordinary route. A file that fails any check is removed.
 */
export async function POST(req: Request) {
  let session;
  try { session = await requireRole('STAFF'); }
  catch (e) { return NextResponse.json({ error: e instanceof PortalAuthError && e.status === 403 ? 'Forbidden' : 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }); }

  let b: { clientId?: string; fileId?: string; storedName?: string; size?: number; originalName?: string; mime?: string; sig?: string; title?: string; category?: string; note?: string; supersedesId?: string };
  try { b = await req.json(); } catch { return NextResponse.json(GENERIC, { status: 400 }); }
  const clientId = String(b.clientId ?? ''), fileId = String(b.fileId ?? ''), storedName = String(b.storedName ?? '');
  const size = Number(b.size ?? 0);
  const supersedesId = String(b.supersedesId ?? '').trim() || null;
  const mime = String(b.mime || 'application/octet-stream');
  const title = String(b.title ?? '').trim().slice(0, 160);
  const categoryRaw = String(b.category ?? '').trim();
  const category = (DELIVERY_CATEGORIES as readonly string[]).includes(categoryRaw) ? categoryRaw : null;
  const note = String(b.note ?? '').trim().slice(0, 2000) || null;

  if (!clientId || !fileId || !storedName || (!title && !supersedesId))
    return NextResponse.json({ error: 'Missing file, client or title' }, { status: 400 });
  // Nothing in Drive is touched until the signature is proven — an unsigned fileId is never read or deleted.
  if (!deliveryUploadSigValid(process.env.AUTH_SECRET ?? '', { uid: session.uid, clientId, storedName, size, supersedesId }, String(b.sig ?? '')))
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    // A file already recorded as a delivery is never re-recorded (double click, retry) and never removed by the checks below.
    const [dup] = await db.select({ id: tables.deliveries.id }).from(tables.deliveries).where(eq(tables.deliveries.driveFileId, fileId)).limit(1);
    if (dup) return NextResponse.json({ error: 'This file has already been sent.' }, { status: 409 });

    // The file must be the one streamed into THIS client's Processed Documents folder, complete and genuine.
    const v = await verifyUploadedFile(clientId, fileId, size, 'processed');
    if (!v.ok) {
      if (v.reason !== 'File not found' && v.reason !== 'File is not in your folder') await deleteDriveFile(fileId);
      return NextResponse.json({ error: 'The upload did not complete correctly. Please try again.' }, { status: 400 });
    }
    const probe = validateUpload(storedName, mime, v.head);
    if (!probe.ok) { await deleteDriveFile(fileId); return NextResponse.json({ error: probe.reason }, { status: 400 }); }

    const [client] = await db.select({ id: tables.clients.id, archivedAt: tables.clients.archivedAt }).from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
    if (!client) { await deleteDriveFile(fileId); return NextResponse.json({ error: 'Not found' }, { status: 404 }); }
    if (client.archivedAt) { await deleteDriveFile(fileId); return NextResponse.json({ error: 'This client is archived. Restore the client before sending anything new.' }, { status: 409 }); }

    let previous: Awaited<ReturnType<typeof getDeliveryForStaff>> = null;
    if (supersedesId) {
      previous = await getDeliveryForStaff(clientId, supersedesId);
      if (!previous) { await deleteDriveFile(fileId); return NextResponse.json({ error: 'Not found' }, { status: 404 }); }
      if (!canReplace(previous.status)) { await deleteDriveFile(fileId); return NextResponse.json({ error: 'That version can no longer be replaced' }, { status: 409 }); }
    }

    try {
      const out = await recordDelivery({
        uid: session.uid, clientId, previous, title, category, note,
        driveFileId: fileId, originalName: String(b.originalName ?? storedName), storedName, mime,
        sizeBytes: size, version: previous ? previous.version + 1 : 1, ext: probe.ext, path: 'resumable',
      });
      return NextResponse.json({ ok: true, ...out });
    } catch (e) {
      await deleteDriveFile(fileId); // never leave an orphan file that the DB doesn't know about
      throw e;
    }
  } catch (e) {
    console.error('[portal:delivery-complete]', e instanceof Error ? e.message : e); // server-side only
    await audit(session.uid, 'DELIVERY_FAILED', { targetType: 'client', targetId: clientId, meta: { path: 'resumable' } });
    return NextResponse.json(GENERIC, { status: 500 });
  }
}
