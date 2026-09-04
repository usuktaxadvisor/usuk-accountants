import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { portalSession } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { validateUpload } from '@/lib/portal/validate';
import { uploadToClientFolder } from '@/lib/portal/drive';
import { rateLimit } from '@/lib/portal/ratelimit';
import { audit } from '@/lib/portal/audit';
import { notifyStaffOfUpload } from '@/lib/portal/notify';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GENERIC = { error: 'Something went wrong. Please try again or contact support.' };

/**
 * POST /api/portal/upload  (multipart/form-data: file, requestId)
 * Auth → role CLIENT → ownership of the document request → server-side
 * validation → Drive upload into the client's own folder → DB record →
 * request status UPLOADED → audit. Nothing Drive-related reaches the browser.
 */
export async function POST(req: Request) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (session.role !== 'CLIENT' || !session.clientId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!rateLimit(`upload:${session.uid}`, 20, 10 * 60_000))
    return NextResponse.json({ error: 'Too many uploads — please wait a few minutes.' }, { status: 429 });

  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json(GENERIC, { status: 400 }); }

  const file = form.get('file');
  const requestId = String(form.get('requestId') ?? '');
  if (!(file instanceof File) || !requestId)
    return NextResponse.json({ error: 'Missing file or request reference' }, { status: 400 });

  // Ownership: the request must belong to THIS session's client. 404 on mismatch — no information leak.
  const [request] = await db.select().from(tables.documentRequests)
    .where(and(eq(tables.documentRequests.id, requestId), eq(tables.documentRequests.clientId, session.clientId)))
    .limit(1);
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const buf = Buffer.from(await file.arrayBuffer());
  const verdict = validateUpload(file.name, file.type || 'application/octet-stream', buf);
  if (!verdict.ok) return NextResponse.json({ error: verdict.reason }, { status: 400 });

  const stamp = new Date().toISOString().slice(0, 10);
  const storedName = `${stamp}_${verdict.safeName}`;

  try {
    const driveFileId = await uploadToClientFolder(session.clientId, storedName, file.type || 'application/octet-stream', buf);
    const [doc] = await db.insert(tables.documents).values({
      clientId: session.clientId,
      requestId: request.id,
      driveFileId,
      originalName: file.name.slice(0, 255),
      storedName,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: buf.length,
      uploadedById: session.uid,
    }).returning({ id: tables.documents.id });
    await db.update(tables.documentRequests)
      .set({ status: 'UPLOADED', updatedAt: new Date() })
      .where(eq(tables.documentRequests.id, request.id));
    await audit(session.uid, 'UPLOAD', {
      targetType: 'document', targetId: doc.id,
      meta: { requestId: request.id, sizeBytes: buf.length, ext: verdict.ext },
    });
    await notifyStaffOfUpload(session.clientId, request.id, file.name);
    return NextResponse.json({ ok: true, message: 'Your document has been securely received.' });
  } catch (e) {
    console.error('[portal:upload]', e instanceof Error ? e.message : e); // server-side only
    await audit(session.uid, 'UPLOAD_FAILED', { targetType: 'request', targetId: request.id });
    return NextResponse.json(GENERIC, { status: 500 });
  }
}
