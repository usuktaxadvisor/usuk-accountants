import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { sanitiseFilename, extensionOf, MAX_BYTES, ACCEPTED_TYPES_MESSAGE } from '@/lib/portal/validate';
import { createResumableSession } from '@/lib/portal/drive';
import { rateLimit } from '@/lib/portal/ratelimit';
import { canReplace, getDeliveryForStaff } from '@/lib/portal/deliveries';
import { deliveryStoredName, deliveryUploadSig } from '@/lib/portal/delivery-upload';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GENERIC = { error: 'Something went wrong. Please try again or contact support.' };
const ALLOWED_EXT = new Set(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'csv']);

/**
 * POST /api/portal/deliveries/session  { clientId, filename, size, mime, supersedesId? }
 * Staff, large-file path (over Vercel's request-body limit). Opens a Google
 * resumable-upload session bound to the client's Processed Documents folder
 * and returns its URL with a signature; the browser streams the file there,
 * then calls /api/portal/deliveries/complete, which verifies the finished
 * file before anything is recorded or the client is emailed.
 */
export async function POST(req: Request) {
  let session;
  try { session = await requireRole('STAFF'); }
  catch (e) { return NextResponse.json({ error: e instanceof PortalAuthError && e.status === 403 ? 'Forbidden' : 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }); }

  if (!rateLimit(`delivery:create:${session.uid}`, 60, 10 * 60_000))
    return NextResponse.json({ error: 'Too many uploads — please wait a few minutes.' }, { status: 429 });

  let body: { clientId?: string; filename?: string; size?: number; mime?: string; supersedesId?: string };
  try { body = await req.json(); } catch { return NextResponse.json(GENERIC, { status: 400 }); }
  const clientId = String(body.clientId ?? '');
  const supersedesId = String(body.supersedesId ?? '').trim() || null;
  const size = Number(body.size ?? 0);
  const mime = String(body.mime || 'application/octet-stream');
  let safeName = sanitiseFilename(String(body.filename ?? ''));
  let ext = extensionOf(safeName);
  // No extension but the browser says PDF: name it .pdf. The content is still checked after upload.
  if (!ext && !safeName.includes('.') && /pdf/i.test(mime)) { safeName = `${safeName}.pdf`; ext = 'pdf'; }
  if (!clientId) return NextResponse.json({ error: 'Missing file, client or title' }, { status: 400 });
  if (!ALLOWED_EXT.has(ext)) return NextResponse.json({ error: ACCEPTED_TYPES_MESSAGE }, { status: 400 });
  if (!Number.isFinite(size) || size <= 0 || size > MAX_BYTES())
    return NextResponse.json({ error: `File exceeds ${process.env.UPLOAD_MAX_MB ?? 25} MB limit` }, { status: 400 });

  const [client] = await db.select({ id: tables.clients.id, archivedAt: tables.clients.archivedAt }).from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (client.archivedAt) return NextResponse.json({ error: 'This client is archived. Restore the client before sending anything new.' }, { status: 409 });

  let version = 1;
  if (supersedesId) {
    const previous = await getDeliveryForStaff(clientId, supersedesId);
    if (!previous) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!canReplace(previous.status)) return NextResponse.json({ error: 'That version can no longer be replaced' }, { status: 409 });
    version = previous.version + 1;
  }

  const storedName = deliveryStoredName(version, safeName);
  try {
    const sessionUrl = await createResumableSession(clientId, storedName, mime, size, new URL(req.url).origin, 'processed');
    const sig = deliveryUploadSig(process.env.AUTH_SECRET ?? '', { uid: session.uid, clientId, storedName, size, supersedesId });
    return NextResponse.json({ sessionUrl, storedName, sig });
  } catch (e) {
    console.error('[portal:delivery-session]', e instanceof Error ? e.message : e); // server-side only
    return NextResponse.json(GENERIC, { status: 500 });
  }
}
