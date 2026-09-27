import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { clientSigningContext } from '@/lib/portal/esign-http';
import { recordEvent, setSignerStatus } from '@/lib/portal/esign-store';
import { ESIGN_CONSENT_TEXT, ESIGN_CONSENT_VERSION, nextSignerStep } from '@/lib/portal/esign';

export const runtime = 'nodejs';

/** GET /api/portal/esign/requests/[id] — CLIENT: the signing bundle for this signer. First open records document_viewed. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = await clientSigningContext(id, 'view', 120);
  if ('error' in c) return c.error;
  const { req, signer, bundle, myTurn, ip, userAgent } = c;
  if (signer.status === 'PENDING' && req.status !== 'COMPLETED') {
    await setSignerStatus(signer, 'VIEWED', { viewedAt: new Date() });
    await recordEvent(req.id, 'document_viewed', { signerId: signer.id, actorUserId: signer.userId, ip, userAgent });
    signer.status = 'VIEWED';
  }
  const docs = await Promise.all(bundle.docs.map(async d => {
    const [dl] = await db.select({ title: tables.deliveries.title, originalName: tables.deliveries.originalName }).from(tables.deliveries).where(eq(tables.deliveries.id, d.deliveryId)).limit(1);
    return { deliveryId: d.deliveryId, title: dl?.title ?? 'Document', originalName: dl?.originalName ?? '', version: d.deliveryVersion, frozenSha256: d.frozenSha256, requiresSignature: d.requiresSignature === 1 };
  }));
  return NextResponse.json({
    ok: true,
    request: { id: req.id, title: req.title, action: req.action, docKind: req.docKind, status: req.status, message: req.message, dueAt: req.dueAt, expiresAt: req.expiresAt, completedAt: req.completedAt, sealedAvailable: !!req.sealedDriveFileId },
    documents: docs,
    signer: { id: signer.id, fullName: signer.fullName, status: signer.status, step: nextSignerStep(req.action, signer.status), myTurn, otpVerified: !!signer.otpVerifiedAt },
    otherSigners: bundle.signers.filter(s => s.id !== signer.id).map(s => ({ fullName: s.fullName, status: s.status, sequence: s.sequence })),
    consent: { version: ESIGN_CONSENT_VERSION, text: ESIGN_CONSENT_TEXT },
    fields: bundle.fields.filter(f => f.signerId === signer.id).map(f => ({ id: f.id, type: f.type, page: f.page, label: f.label, required: f.required === 1 })),
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}
