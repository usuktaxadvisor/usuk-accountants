import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { validateUpload } from '@/lib/portal/validate';
import { uploadToProcessedFolder, deleteDriveFile } from '@/lib/portal/drive';
import { rateLimit } from '@/lib/portal/ratelimit';
import { audit } from '@/lib/portal/audit';
import { DELIVERY_CATEGORIES, canReplace, getDeliveryForStaff } from '@/lib/portal/deliveries';
import { recordDelivery } from '@/lib/portal/delivery-record';
import { deliveryStoredName } from '@/lib/portal/delivery-upload';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GENERIC = { error: 'Something went wrong. Please try again or contact support.' };

/**
 * POST /api/portal/deliveries  (multipart/form-data: file, clientId, title, category?, note?, supersedesId?)
 * Staff → client. Auth → role STAFF+ → client exists → server-side validation →
 * Drive upload into the client's Processed Documents folder → DB record →
 * client emailed → audit. With supersedesId, this is a Replace: the new row
 * becomes version N+1 and the previous version is marked WITHDRAWN.
 * Nothing Drive-related reaches the browser.
 */
export async function POST(req: Request) {
  let session;
  try { session = await requireRole('STAFF'); }
  catch (e) { return NextResponse.json({ error: e instanceof PortalAuthError && e.status === 403 ? 'Forbidden' : 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }); }

  if (!rateLimit(`delivery:create:${session.uid}`, 60, 10 * 60_000))
    return NextResponse.json({ error: 'Too many uploads — please wait a few minutes.' }, { status: 429 });

  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json(GENERIC, { status: 400 }); }

  const file = form.get('file');
  const clientId = String(form.get('clientId') ?? '');
  const title = String(form.get('title') ?? '').trim().slice(0, 160);
  const categoryRaw = String(form.get('category') ?? '').trim();
  const category = (DELIVERY_CATEGORIES as readonly string[]).includes(categoryRaw) ? categoryRaw : null;
  const note = String(form.get('note') ?? '').trim().slice(0, 2000) || null;
  const supersedesId = String(form.get('supersedesId') ?? '').trim() || null;

  // A replacement inherits the previous version's title, so the title is only required for a brand-new delivery.
  if (!(file instanceof File) || !clientId || (!title && !supersedesId))
    return NextResponse.json({ error: 'Missing file, client or title' }, { status: 400 });

  const [client] = await db.select({ id: tables.clients.id, archivedAt: tables.clients.archivedAt }).from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (client.archivedAt) return NextResponse.json({ error: 'This client is archived. Restore the client before sending anything new.' }, { status: 409 });

  // Replace: the previous version must belong to this same client and still be replaceable.
  let previous: Awaited<ReturnType<typeof getDeliveryForStaff>> = null;
  if (supersedesId) {
    previous = await getDeliveryForStaff(clientId, supersedesId);
    if (!previous) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!canReplace(previous.status)) return NextResponse.json({ error: 'That version can no longer be replaced' }, { status: 409 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const verdict = validateUpload(file.name, file.type || 'application/octet-stream', buf);
  if (!verdict.ok) return NextResponse.json({ error: verdict.reason }, { status: 400 });

  const version = previous ? previous.version + 1 : 1;
  const storedName = deliveryStoredName(version, verdict.safeName);
  const mime = file.type || 'application/octet-stream';

  let driveFileId: string | null = null;
  try {
    driveFileId = await uploadToProcessedFolder(clientId, storedName, mime, buf);
    const out = await recordDelivery({
      uid: session.uid, clientId, previous, title, category, note,
      driveFileId, originalName: file.name, storedName, mime, sizeBytes: buf.length, version, ext: verdict.ext,
    });
    return NextResponse.json({ ok: true, ...out });
  } catch (e) {
    console.error('[portal:delivery]', e instanceof Error ? e.message : e); // server-side only
    if (driveFileId) await deleteDriveFile(driveFileId); // never leave an orphan file that the DB doesn't know about
    await audit(session.uid, 'DELIVERY_FAILED', { targetType: 'client', targetId: clientId });
    return NextResponse.json(GENERIC, { status: 500 });
  }
}
