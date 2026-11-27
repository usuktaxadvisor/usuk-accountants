import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { portalSession } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { openDriveFileStream } from '@/lib/portal/drive';
import { rateLimit } from '@/lib/portal/ratelimit';
import { audit } from '@/lib/portal/audit';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * GET /api/portal/documents/[id]/file?download=1
 * Opens a document a client uploaded, streamed through the server so no Drive
 * id, link or token ever reaches the browser. Authorisation:
 *   CLIENT → only their own client's uploads (404 otherwise)
 *   STAFF+ → any client's upload, optionally scoped by ?client= for defence in depth
 * Every open is audited.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (!rateLimit(`document:file:${session.uid}`, 240, 10 * 60_000))
    return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });

  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const url = new URL(req.url);
  const download = url.searchParams.get('download') === '1';

  const [row] = await db.select().from(tables.documents).where(eq(tables.documents.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (session.role === 'CLIENT') {
    if (!session.clientId || session.clientId !== row.clientId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } else {
    const scoped = url.searchParams.get('client');
    if (scoped && scoped !== row.clientId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let stream;
  try { stream = await openDriveFileStream(row.driveFileId); }
  catch (e) {
    console.error('[portal:document:file]', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'The document could not be retrieved. Please try again.' }, { status: 502 });
  }
  await audit(session.uid, session.role === 'CLIENT' ? 'DOCUMENT_CLIENT_OPENED' : 'DOCUMENT_STAFF_OPENED', { targetType: 'document', targetId: row.id, meta: { download } });

  const safeName = row.originalName.replace(/[^\w.\- ()]/g, '_');
  const headers = new Headers({
    'Content-Type': row.mimeType || 'application/octet-stream',
    'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safeName}"`,
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; sandbox", // inline view can't run scripts
  });
  if (stream.size) headers.set('Content-Length', String(stream.size));
  return new Response(stream.body, { status: 200, headers });
}
