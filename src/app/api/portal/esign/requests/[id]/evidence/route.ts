import { NextResponse } from 'next/server';
import { portalSession } from '@/lib/portal/auth';
import { rateLimit } from '@/lib/portal/ratelimit';
import { getEvidence, getRequestForClient, getRequestById, getSignerForUser, listEvents, recordEvent, loadBundle } from '@/lib/portal/esign-store';
import { verifyChain, sha256Hex, type EvidenceCertificate } from '@/lib/portal/esign';
import { renderEvidenceCertificatePdf } from '@/lib/portal/esign-pdf';
import { requestMeta, pdfResponse } from '@/lib/portal/esign-http';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * GET ?format=json|pdf — the evidence record. Completed requests return the stored certificate (its hash is re-verified);
 * open requests return a live view (events + chain check) for staff. Clients may fetch their own completed certificate.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await portalSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (!rateLimit(`esign:evidence:${session.uid}`, 60, 10 * 60_000)) return NextResponse.json({ error: 'Too many requests — please wait a few minutes.' }, { status: 429 });
  const { id } = await ctx.params;
  const format = new URL(req.url).searchParams.get('format') ?? 'json';
  const request = session.role === 'CLIENT' ? (session.clientId ? await getRequestForClient(session.clientId, id) : null) : await getRequestById(id);
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (session.role === 'CLIENT') {
    if (!(await getSignerForUser(request.id, session.uid)) || request.status !== 'COMPLETED') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const { ip, userAgent } = await requestMeta();
  const stored = await getEvidence(request.id);
  if (stored) {
    const cert = stored.certificateJson as EvidenceCertificate;
    const intact = sha256Hex(JSON.stringify(cert)) === stored.certificateSha256;
    await recordEvent(request.id, 'evidence_downloaded', { actorUserId: session.uid, ip, userAgent, meta: { format, intact } });
    if (format === 'pdf') return pdfResponse(await renderEvidenceCertificatePdf(cert), `Evidence certificate - ${request.title}.pdf`, true);
    return NextResponse.json({ ok: true, stored: true, intact, certificateSha256: stored.certificateSha256, certificate: cert }, { headers: { 'Cache-Control': 'private, no-store' } });
  }
  // Live (not yet completed) — staff only
  if (session.role === 'CLIENT') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const bundle = await loadBundle(request.id);
  const events = await listEvents(request.id);
  const chain = verifyChain(events.map(e => ({ requestId: e.requestId, signerId: e.signerId, actorUserId: e.actorUserId, type: e.type, at: e.at.toISOString(), ip: e.ip, userAgent: e.userAgent, meta: (e.meta as Record<string, unknown> | null) ?? null, prevHash: e.prevHash, hash: e.hash })));
  return NextResponse.json({ ok: true, stored: false, chainValid: chain.ok, request: { id: request.id, status: request.status, title: request.title, action: request.action, docKind: request.docKind },
    documents: bundle?.docs.map(d => ({ deliveryId: d.deliveryId, version: d.deliveryVersion, frozenSha256: d.frozenSha256, frozenAt: d.frozenAt })),
    signers: bundle?.signers.map(s => ({ id: s.id, fullName: s.fullName, email: s.email, status: s.status, viewedAt: s.viewedAt, consentedAt: s.consentedAt, otpVerifiedAt: s.otpVerifiedAt, approvedAt: s.approvedAt, signedAt: s.signedAt, declinedAt: s.declinedAt, declineReason: s.declineReason, signatureMethod: s.signatureMethod, ip: s.ip })),
    events: events.map(e => ({ id: e.id, type: e.type, at: e.at, signerId: e.signerId, actorUserId: e.actorUserId, ip: e.ip, meta: e.meta, prevHash: e.prevHash, hash: e.hash })),
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}
