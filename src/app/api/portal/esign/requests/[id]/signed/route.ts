import { NextResponse } from 'next/server';
import { portalSession } from '@/lib/portal/auth';
import { rateLimit } from '@/lib/portal/ratelimit';
import { readDriveBytes, getRequestForClient, getRequestById, getSignerForUser, recordEvent } from '@/lib/portal/esign-store';
import { sha256Hex } from '@/lib/portal/esign';
import { requestMeta, pdfResponse } from '@/lib/portal/esign-http';

export const runtime = 'nodejs';
export const maxDuration = 60;

/** GET — the SEALED signed PDF. Re-hashed on every serve against the recorded sealed hash; a mismatch is refused and logged. */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (!rateLimit(`esign:signed:${session.uid}`, 60, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });
  const { id } = await ctx.params;
  const request = session.role === 'CLIENT' ? (session.clientId ? await getRequestForClient(session.clientId, id) : null) : await getRequestById(id);
  if (!request || request.status !== 'COMPLETED' || !request.sealedDriveFileId || !request.sealedSha256) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (session.role === 'CLIENT' && !(await getSignerForUser(request.id, session.uid))) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  let bytes: Buffer;
  try { bytes = await readDriveBytes(request.sealedDriveFileId); } catch { return NextResponse.json({ error: 'The document could not be retrieved. Please try again.' }, { status: 502 }); }
  if (sha256Hex(bytes) !== request.sealedSha256) {
    await recordEvent(request.id, 'access_denied', { actorUserId: session.uid, meta: { reason: 'sealed_hash_mismatch_on_serve' } });
    return NextResponse.json({ error: 'Integrity check failed for the signed document. Please contact us.' }, { status: 409 });
  }
  const { ip, userAgent } = await requestMeta();
  await recordEvent(request.id, 'signed_document_downloaded', { actorUserId: session.uid, ip, userAgent, meta: { role: session.role } });
  const download = new URL(req.url).searchParams.get('download') === '1';
  return pdfResponse(bytes, `${request.title} - signed.pdf`, download);
}
