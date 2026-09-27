import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireRole, PortalAuthError } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { rateLimit } from '@/lib/portal/ratelimit';
import { audit } from '@/lib/portal/audit';
import { ESIGN_CONSENT_VERSION, remoteEsignPermitted } from '@/lib/portal/esign';
import { createRequest, latestIdentityVerification, recordEvent } from '@/lib/portal/esign-store';
import { notifyClientOfSignatureRequest } from '@/lib/portal/esign-notify';
import { requestMeta, GENERIC } from '@/lib/portal/esign-http';

export const runtime = 'nodejs';
export const maxDuration = 60;

const FieldSchema = z.object({
  deliveryId: z.string().uuid(), signerUserId: z.string().uuid().optional(),
  type: z.enum(['SIGNATURE', 'INITIALS', 'DATE', 'NAME', 'CHECKBOX', 'ACKNOWLEDGEMENT']),
  page: z.number().int().min(0).max(9999), xPct: z.number().int().min(0).max(10000).default(0), yPct: z.number().int().min(0).max(10000).default(0),
  wPct: z.number().int().min(100).max(10000).default(2500), hPct: z.number().int().min(100).max(10000).default(600),
  label: z.string().max(120).nullable().default(null), required: z.boolean().default(true),
});
const Body = z.object({
  clientId: z.string().uuid(),
  title: z.string().trim().min(1).max(160),
  action: z.enum(['APPROVAL', 'SIGNATURE', 'APPROVAL_AND_SIGNATURE']),
  docKind: z.enum(['GENERAL', 'TAX_RETURN', 'ENGAGEMENT_LETTER', 'ADVISORY', 'DECLARATION', 'IRS_8879', 'IRS_8878']).default('GENERAL'),
  signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).default('PARALLEL'),
  message: z.string().trim().max(2000).nullable().default(null),
  dueAt: z.string().datetime().nullable().default(null),
  expiresInDays: z.number().int().min(1).max(365).default(30),
  documents: z.array(z.object({ deliveryId: z.string().uuid(), requiresSignature: z.boolean().default(true) })).min(1).max(10),
  signerUserIds: z.array(z.string().uuid()).min(1).max(6).optional(), // default: the client's own portal user
  fields: z.array(FieldSchema).max(60).default([]),
});

/**
 * POST /api/portal/esign/requests — STAFF+. Creates a signature/approval request over one or more
 * existing deliveries. The document bytes are hashed and frozen at this moment; the client is emailed.
 */
export async function POST(req: Request) {
  let session;
  try { session = await requireRole('STAFF'); }
  catch (e) { return NextResponse.json({ error: e instanceof PortalAuthError && e.status === 403 ? 'Forbidden' : 'Not signed in' }, { status: e instanceof PortalAuthError ? e.status : 401 }); }
  if (!rateLimit(`esign:create:${session.uid}`, 60, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });

  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const [client] = await db.select().from(tables.clients).where(eq(tables.clients.id, body.clientId)).limit(1);
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Signers: default to the client's own user. Every signer must be a CLIENT user of this client (v1: one portal user per client;
  // additional signers — e.g. a spouse — need their own portal user linked to the same client, which is the joint-signer setup).
  const signerIds = body.signerUserIds ?? [client.userId];
  const signers: Array<{ userId: string; fullName: string; email: string; role: string; sequence: number; identityVerificationId: string | null }> = [];
  for (let i = 0; i < signerIds.length; i++) {
    const [u] = await db.select().from(tables.users).where(eq(tables.users.id, signerIds[i])).limit(1);
    if (!u || u.role !== 'CLIENT') return NextResponse.json({ error: 'Signer is not a client user' }, { status: 400 });
    if (u.id !== client.userId) {
      const [own] = await db.select({ id: tables.clients.id }).from(tables.clients).where(eq(tables.clients.userId, u.id)).limit(1);
      if (!own || own.id !== client.id) return NextResponse.json({ error: 'Signer does not belong to this client' }, { status: 400 });
    }
    const idv = await latestIdentityVerification(client.id, u.id);
    const gate = remoteEsignPermitted(body.docKind, idv ? { method: idv.method, validUntil: idv.validUntil } : null);
    if (!gate.ok) return NextResponse.json({ error: gate.reason, code: 'IDV_REQUIRED' }, { status: 422 });
    signers.push({ userId: u.id, fullName: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email, email: u.email, role: i === 0 ? 'SIGNER' : 'SIGNER', sequence: i + 1, identityVerificationId: idv?.id ?? null });
  }

  const { ip, userAgent } = await requestMeta();
  try {
    const row = await createRequest({
      clientId: client.id, title: body.title, action: body.action, docKind: body.docKind, signingOrder: body.signingOrder, message: body.message,
      dueAt: body.dueAt ? new Date(body.dueAt) : null, expiresAt: new Date(Date.now() + body.expiresInDays * 86_400_000),
      consentVersion: ESIGN_CONSENT_VERSION, createdById: session.uid, documents: body.documents, signers,
      fields: body.fields.map(f => ({ ...f, signerUserId: f.signerUserId ?? signers[0].userId })), ip, userAgent,
    });
    const emailed = await notifyClientOfSignatureRequest(client.id, row.title, body.action, body.message, row.dueAt);
    await recordEvent(row.id, 'client_notified', { actorUserId: session.uid, meta: { emailed } });
    await audit(session.uid, 'ESIGN_REQUEST_CREATED', { targetType: 'signature_request', targetId: row.id, ip: ip ?? undefined, meta: { clientId: client.id, action: body.action, docKind: body.docKind, documents: body.documents.length, signers: signers.length, clientEmailed: emailed } });
    return NextResponse.json({ ok: true, id: row.id, clientEmailed: emailed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    console.error('[portal:esign:create]', msg);
    if (/Only PDF|does not belong|not found/i.test(msg)) return NextResponse.json({ error: msg }, { status: 400 });
    await audit(session.uid, 'ESIGN_REQUEST_FAILED', { targetType: 'client', targetId: client.id });
    return NextResponse.json(GENERIC, { status: 500 });
  }
}
