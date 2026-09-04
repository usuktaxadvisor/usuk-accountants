import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { portalSession } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { validateUpload } from '@/lib/portal/validate';
import { verifyUploadedFile, deleteDriveFile } from '@/lib/portal/drive';
import { audit } from '@/lib/portal/audit';

export const runtime = 'nodejs';
const GENERIC = { error: 'Something went wrong. Please try again or contact support.' };

/** POST { requestId, fileId, storedName, size, originalName, mime, sig } — finalise a large upload after server-side verification. */
export async function POST(req: Request) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (session.role !== 'CLIENT' || !session.clientId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let b: { requestId?: string; fileId?: string; storedName?: string; size?: number; originalName?: string; mime?: string; sig?: string };
  try { b = await req.json(); } catch { return NextResponse.json(GENERIC, { status: 400 }); }
  const requestId = String(b.requestId ?? ''), fileId = String(b.fileId ?? ''), storedName = String(b.storedName ?? '');
  const size = Number(b.size ?? 0), sig = String(b.sig ?? '');
  const ext = storedName.includes('.') ? storedName.split('.').pop()!.toLowerCase() : '';
  const expected = createHmac('sha256', process.env.AUTH_SECRET ?? '').update([session.clientId, requestId, storedName, String(size), ext].join('|')).digest('base64url');
  if (!sig || sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [request] = await db.select({ id: tables.documentRequests.id }).from(tables.documentRequests)
    .where(and(eq(tables.documentRequests.id, requestId), eq(tables.documentRequests.clientId, session.clientId))).limit(1);
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const v = await verifyUploadedFile(session.clientId, fileId, size);
    if (!v.ok) { await deleteDriveFile(fileId); return NextResponse.json({ error: v.reason }, { status: 400 }); }
    // Content check on the real bytes (magic numbers) — same rule as the small-file path.
    const probe = validateUpload(storedName, String(b.mime || 'application/octet-stream'), v.head);
    if (!probe.ok) { await deleteDriveFile(fileId); return NextResponse.json({ error: probe.reason }, { status: 400 }); }

    const [doc] = await db.insert(tables.documents).values({
      clientId: session.clientId, requestId: request.id, driveFileId: fileId,
      originalName: String(b.originalName ?? storedName).slice(0, 255), storedName,
      mimeType: String(b.mime || 'application/octet-stream'), sizeBytes: size, uploadedById: session.uid,
    }).returning({ id: tables.documents.id });
    await db.update(tables.documentRequests).set({ status: 'UPLOADED', updatedAt: new Date() }).where(eq(tables.documentRequests.id, request.id));
    await audit(session.uid, 'UPLOAD', { targetType: 'document', targetId: doc.id, meta: { requestId: request.id, sizeBytes: size, ext, path: 'resumable' } });
    return NextResponse.json({ ok: true, message: 'Your document has been securely received.' });
  } catch (e) {
    console.error('[portal:upload-complete]', e instanceof Error ? e.message : e);
    await audit(session.uid, 'UPLOAD_FAILED', { targetType: 'request', targetId: request.id, meta: { path: 'resumable' } });
    return NextResponse.json(GENERIC, { status: 500 });
  }
}
