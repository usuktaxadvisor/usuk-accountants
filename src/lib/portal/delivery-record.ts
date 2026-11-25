import { eq } from 'drizzle-orm';
import { db, tables } from './db';
import { audit } from './audit';
import { notifyClientOfDelivery } from './notify';
import { supersedeRequestsForDelivery } from './esign-store';
import type { getDeliveryForStaff } from './deliveries';

type Previous = NonNullable<Awaited<ReturnType<typeof getDeliveryForStaff>>>;

/**
 * Records a delivery whose file is already safely in the client's Processed
 * Documents folder: DB row → (Replace: previous version WITHDRAWN and any open
 * signature request superseded) → client emailed → audit. Shared by the
 * ordinary multipart route and the large-file route so both behave identically.
 * Throws on failure; the caller removes the Drive file so no orphan is left.
 */
export async function recordDelivery(a: {
  uid: string; clientId: string; previous: Previous | null;
  title: string; category: string | null; note: string | null;
  driveFileId: string; originalName: string; storedName: string; mime: string;
  sizeBytes: number; version: number; ext: string; path?: 'resumable';
}): Promise<{ id: string; version: number; clientEmailed: boolean }> {
  const { previous } = a;
  const [row] = await db.insert(tables.deliveries).values({
    clientId: a.clientId,
    title: previous ? previous.title : a.title,
    category: previous ? previous.category : a.category,
    note: a.note,
    driveFileId: a.driveFileId,
    originalName: a.originalName.slice(0, 255),
    storedName: a.storedName,
    mimeType: a.mime,
    sizeBytes: a.sizeBytes,
    version: a.version,
    supersedesId: previous?.id ?? null,
    uploadedById: a.uid,
  }).returning({ id: tables.deliveries.id, title: tables.deliveries.title });

  if (previous) {
    await db.update(tables.deliveries)
      .set({ status: 'WITHDRAWN', withdrawnAt: new Date(), updatedAt: new Date() })
      .where(eq(tables.deliveries.id, previous.id));
    await audit(a.uid, 'DELIVERY_REPLACED', { targetType: 'delivery', targetId: previous.id, meta: { clientId: a.clientId, replacedBy: row.id, version: a.version } });
    // Any open signature request on the old version is superseded — a client can never sign v1 while v2 exists.
    const superseded = await supersedeRequestsForDelivery(previous.id, a.uid, 'Document replaced by a new version', row.id);
    if (superseded.length) await audit(a.uid, 'ESIGN_REQUESTS_SUPERSEDED', { targetType: 'delivery', targetId: previous.id, meta: { requests: superseded } });
  }

  const emailed = await notifyClientOfDelivery(a.clientId, row.title, a.note);
  await audit(a.uid, 'DELIVERY_CREATED', {
    targetType: 'delivery', targetId: row.id,
    meta: { clientId: a.clientId, version: a.version, sizeBytes: a.sizeBytes, ext: a.ext, clientEmailed: emailed, ...(a.path ? { path: a.path } : {}) },
  });
  return { id: row.id, version: a.version, clientEmailed: emailed };
}
