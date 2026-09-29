import { NextResponse } from 'next/server';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { getRequestById, voidRequest } from '@/lib/portal/esign-store';
import { canVoid } from '@/lib/portal/esign';
import { audit } from '@/lib/portal/audit';
import { requestMeta } from '@/lib/portal/esign-http';

export const runtime = 'nodejs';

/** POST { reason } — STAFF+ voids an open request. Completed requests can never be voided; they are superseded by a new request instead. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try { session = await requireRole('STAFF'); }
  catch (e) { return NextResponse.json({ error: e instanceof PortalAuthError && e.status === 403 ? 'Forbidden' : 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }); }
  const { id } = await ctx.params;
  let b: { reason?: unknown };
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  const reason = String(b.reason ?? '').trim().slice(0, 500);
  if (!reason) return NextResponse.json({ error: 'A reason is required' }, { status: 400 });
  const row = await getRequestById(id);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canVoid(row.status)) return NextResponse.json({ error: 'Completed or closed requests cannot be voided.' }, { status: 409 });
  const { ip, userAgent } = await requestMeta();
  await voidRequest(row, session.uid, reason, 'request_voided', ip, userAgent);
  await audit(session.uid, 'ESIGN_REQUEST_VOIDED', { targetType: 'signature_request', targetId: row.id, meta: { clientId: row.clientId } });
  return NextResponse.json({ ok: true });
}
