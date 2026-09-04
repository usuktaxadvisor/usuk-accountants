import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { createHmac } from 'node:crypto';
import { portalSession } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { sanitiseFilename, MAX_BYTES } from '@/lib/portal/validate';
import { createResumableSession } from '@/lib/portal/drive';
import { rateLimit } from '@/lib/portal/ratelimit';

export const runtime = 'nodejs';
const GENERIC = { error: 'Something went wrong. Please try again or contact support.' };
const ALLOWED_EXT = new Set(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'csv']);

function sessionSig(parts: string[]): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '').update(parts.join('|')).digest('base64url');
}

/** POST { requestId, filename, size, mime } → { sessionUrl, storedName, sig } (large-file path) */
export async function POST(req: Request) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (session.role !== 'CLIENT' || !session.clientId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!rateLimit(`upload:${session.uid}`, 20, 10 * 60_000)) return NextResponse.json({ error: 'Too many uploads — please wait a few minutes.' }, { status: 429 });

  let body: { requestId?: string; filename?: string; size?: number; mime?: string };
  try { body = await req.json(); } catch { return NextResponse.json(GENERIC, { status: 400 }); }
  const requestId = String(body.requestId ?? '');
  const size = Number(body.size ?? 0);
  const mime = String(body.mime || 'application/octet-stream');
  const safeName = sanitiseFilename(String(body.filename ?? ''));
  const ext = safeName.includes('.') ? safeName.split('.').pop()!.toLowerCase() : '';
  if (!requestId || !ALLOWED_EXT.has(ext)) return NextResponse.json({ error: 'File type not accepted' }, { status: 400 });
  if (!Number.isFinite(size) || size <= 0 || size > MAX_BYTES()) return NextResponse.json({ error: `File exceeds ${process.env.UPLOAD_MAX_MB ?? 25} MB limit` }, { status: 400 });

  const [request] = await db.select({ id: tables.documentRequests.id }).from(tables.documentRequests)
    .where(and(eq(tables.documentRequests.id, requestId), eq(tables.documentRequests.clientId, session.clientId))).limit(1);
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const storedName = `${new Date().toISOString().slice(0, 10)}_${safeName}`;
  const origin = new URL(req.url).origin;
  try {
    const sessionUrl = await createResumableSession(session.clientId, storedName, mime, size, origin);
    const sig = sessionSig([session.clientId, requestId, storedName, String(size), ext]);
    return NextResponse.json({ sessionUrl, storedName, sig });
  } catch (e) {
    console.error('[portal:upload-session]', e instanceof Error ? e.message : e);
    return NextResponse.json(GENERIC, { status: 500 });
  }
}
