import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { portalSession } from '@/lib/portal/auth';
import { rateLimit } from '@/lib/portal/ratelimit';
import { readDriveBytes, getRequestForClient, getRequestById, getSignerForUser, recordEvent, loadBundle } from '@/lib/portal/esign-store';
import { sha256Hex } from '@/lib/portal/esign';
import { requestMeta, pdfResponse } from '@/lib/portal/esign-http';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * GET /api/portal/esign/requests/[id]/file?doc=<deliveryId>&download=1
 * Serves the FROZEN original for review. The bytes are re-hashed on every serve and compared with
 * the frozen hash; on mismatch the request is refused (a client can never be shown a version that
 * differs from the one recorded). CLIENT must be a signer; STAFF+ may preview.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (!rateLimit(`esign:file:${session.uid}`, 120, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const docId = url.searchParams.get('doc') ?? '';
  const download = url.searchParams.get('download') === '1';

  const request = session.role === 'CLIENT' ? (session.clientId ? await getRequestForClient(session.clientId, id) : null) : await getRequestById(id);
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (session.role === 'CLIENT' && !(await getSignerForUser(request.id, session.uid))) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const bundle = await loadBundle(request.id);
  const doc = bundle?.docs.find(d => d.deliveryId === docId) ?? bundle?.docs[0];
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const [delivery] = await db.select().from(tables.deliveries).where(eq(tables.deliveries.id, doc.deliveryId)).limit(1);
  if (!delivery) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let bytes: Buffer;
  try { bytes = await readDriveBytes(delivery.driveFileId); } catch { return NextResponse.json({ error: 'The document could not be retrieved. Please try again.' }, { status: 502 }); }
  if (sha256Hex(bytes) !== doc.frozenSha256) {
    await recordEvent(request.id, 'access_denied', { actorUserId: session.uid, meta: { reason: 'frozen_hash_mismatch_on_serve', deliveryId: doc.deliveryId } });
    return NextResponse.json({ error: 'This document has changed since it was sent for signature. Please contact us.' }, { status: 409 });
  }
  const { ip, userAgent } = await requestMeta();
  if (session.role === 'CLIENT') {
    const signer = await getSignerForUser(request.id, session.uid);
    await recordEvent(request.id, download ? 'document_downloaded' : 'document_viewed', { signerId: signer?.id ?? null, actorUserId: session.uid, ip, userAgent, meta: { deliveryId: doc.deliveryId, sha256: doc.frozenSha256 } });
  }
  return pdfResponse(bytes, delivery.originalName, download);
}
