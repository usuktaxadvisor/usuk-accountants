import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { portalSession } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { openDriveFileStream } from '@/lib/portal/drive';
import { rateLimit } from '@/lib/portal/ratelimit';
import { audit } from '@/lib/portal/audit';
import { canClientAccess, getDeliveryForClient, statusAfterClientView } from '@/lib/portal/deliveries';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * GET /api/portal/deliveries/[id]/file?download=1
 * Streams the file through the server. The only URL the browser ever sees is
 * this route; no Drive id, link or token is exposed. Authorisation:
 *   CLIENT → the row must belong to the session's own client (404 otherwise)
 *   STAFF+ → any client's row (staff preview), scoped by ?client= for defence in depth
 * Unauthenticated → 401. First client open moves READY_FOR_REVIEW → VIEWED.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (!rateLimit(`delivery:file:${session.uid}`, 120, 10 * 60_000))
    return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });

  const { id } = await ctx.params;
  const url = new URL(req.url);
  const download = url.searchParams.get('download') === '1';

  let row;
  if (session.role === 'CLIENT') {
    if (!session.clientId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    row = await getDeliveryForClient(session.clientId, id);
    if (!row || !canClientAccess(row.status)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } else {
    const [r] = await db.select().from(tables.deliveries).where(eq(tables.deliveries.id, id)).limit(1);
    row = r ?? null;
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const scoped = url.searchParams.get('client');
    if (scoped && scoped !== row.clientId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let stream;
  try { stream = await openDriveFileStream(row.driveFileId); }
  catch (e) {
    console.error('[portal:delivery:file]', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'The document could not be retrieved. Please try again.' }, { status: 502 });
  }

  if (session.role === 'CLIENT') {
    const next = statusAfterClientView(row.status);
    if (next !== row.status) {
      await db.update(tables.deliveries).set({ status: next, viewedAt: new Date(), updatedAt: new Date() }).where(eq(tables.deliveries.id, row.id));
    }
    await audit(session.uid, download ? 'DELIVERY_DOWNLOADED' : 'DELIVERY_VIEWED', { targetType: 'delivery', targetId: row.id });
  } else {
    await audit(session.uid, 'DELIVERY_STAFF_OPENED', { targetType: 'delivery', targetId: row.id });
  }

  const safeName = row.originalName.replace(/[^\w.\- ()]/g, '_');
  const disposition = `${download ? 'attachment' : 'inline'}; filename="${safeName}"`;
  const headers = new Headers({
    'Content-Type': row.mimeType || 'application/octet-stream',
    'Content-Disposition': disposition,
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox", // inline view can't run scripts
  });
  if (stream.size) headers.set('Content-Length', String(stream.size));
  return new Response(stream.body, { status: 200, headers });
}
