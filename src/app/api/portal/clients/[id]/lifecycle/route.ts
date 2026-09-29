import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { rateLimit } from '@/lib/portal/ratelimit';
import { requestMeta } from '@/lib/portal/esign-http';
import {
  assessClient, archiveClient, restoreClient, reenableLogin, minimiseClientData, deleteClientPermanently,
  LifecycleError, isArchiveReason,
} from '@/lib/portal/client-lifecycle';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Client lifecycle — STAFF/ADMIN only. Clients can never reach these (requireRole), a client id is validated
 * against the database inside each service, the confirmation phrase must match the client's own reference, and
 * every service is idempotent/race-safe (archive/restore via conditional UPDATE, deletes under a row lock).
 * Same-origin JSON POST with the session cookie; the portal sets no CORS headers, so cross-site forms cannot
 * post JSON here.
 */
async function guard() {
  try { return await requireRole('STAFF'); }
  catch (e) { throw NextResponse.json({ error: e instanceof PortalAuthError && e.status === 403 ? 'Forbidden' : 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }); }
}

/** GET — the deletion assessment (counts, protected records, decision, plain-English reason). */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  let session; try { session = await guard(); } catch (r) { return r as NextResponse; }
  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const a = await assessClient(id);
  if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  void session;
  return NextResponse.json(a);
}

const Body = z.object({
  action: z.enum(['archive', 'restore', 'reenable_login', 'delete_removable', 'delete_permanently']),
  reason: z.string().optional(),
  note: z.string().trim().max(500).optional(),
  confirm: z.string().trim().optional(),
  userId: z.string().uuid().optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  let session; try { session = await guard(); } catch (r) { return r as NextResponse; }
  if (!rateLimit(`client:lifecycle:${session.uid}`, 30, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });
  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  const meta = await requestMeta();
  const actor = { uid: session.uid, ip: meta.ip, userAgent: meta.userAgent };
  const a = await assessClient(id);
  if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const note = body.note || null;

  try {
    switch (body.action) {
      case 'archive': {
        if (!isArchiveReason(body.reason)) return NextResponse.json({ error: 'Please choose a reason.' }, { status: 400 });
        const r = await archiveClient(id, actor, body.reason, note);
        return NextResponse.json({ ok: true, ...r, message: `Archived. ${r.voidedRequests ? `${r.voidedRequests} open signing request(s) voided. ` : ''}${r.suspendedLogins} login(s) suspended.` });
      }
      case 'restore': {
        await restoreClient(id, actor);
        return NextResponse.json({ ok: true, message: 'Client restored. Logins stay suspended until you re-enable them.' });
      }
      case 'reenable_login': {
        if (!body.userId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        await reenableLogin(id, body.userId, actor);
        return NextResponse.json({ ok: true, message: 'Login re-enabled.' });
      }
      case 'delete_removable':
      case 'delete_permanently': {
        // Deliberate confirmation: the staff member must type DELETE <client ref> exactly. Reason is required.
        if (!isArchiveReason(body.reason)) return NextResponse.json({ error: 'A reason is required for deletion.' }, { status: 400 });
        const expected = `DELETE ${a.client.ref}`;
        if ((body.confirm ?? '').toUpperCase() !== expected.toUpperCase()) return NextResponse.json({ error: `Type ${expected} to confirm.`, code: 'CONFIRM' }, { status: 400 });
        if (body.action === 'delete_permanently') {
          const r = await deleteClientPermanently(id, actor, body.reason, note);
          return NextResponse.json({ ok: true, ...r, message: 'Client permanently deleted. The Drive folder has been moved to the bin.' });
        }
        const r = await minimiseClientData(id, actor, body.reason, note);
        return NextResponse.json({ ok: true, ...r, message: 'Removable data deleted; the client is archived and the retained records are untouched.' });
      }
    }
  } catch (e) {
    if (e instanceof LifecycleError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error('[portal:client:lifecycle]', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Something went wrong. Nothing was changed.' }, { status: 500 });
  }
}
