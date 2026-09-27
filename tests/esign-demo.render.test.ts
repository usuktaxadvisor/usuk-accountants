import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { sealSignedPdf, renderEvidenceCertificatePdf } from '@/lib/portal/esign-pdf';
import { sha256Hex, buildEvidenceCertificate, chainHash, verifyChain, consentTextSha256, type ChainableEvent } from '@/lib/portal/esign';

/** Not a test of behaviour — renders the synthetic demonstration artefacts. Skipped unless ESIGN_DEMO_OUT is set. */
it.skipIf(!process.env.ESIGN_DEMO_OUT)('renders the synthetic Jane Smith demo', async () => {
  const out = process.env.ESIGN_DEMO_OUT!;
  const pdf = await PDFDocument.create(); const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= 2; i++) { const p = pdf.addPage([612, 792]); p.drawText(`TEST ONLY — 2025 Form 1040 — Jane Smith — page ${i} of 2`, { x: 50, y: 740, size: 12, font }); p.drawText('Synthetic document. No real taxpayer data.', { x: 50, y: 720, size: 9, font }); }
  const original = await pdf.save(); const frozen = sha256Hex(original);
  writeFileSync(`${out}/original.pdf`, original);
  const t = (s: number) => new Date(Date.parse('2026-09-28T10:00:00Z') + s * 1000);
  const ids = { req: '11111111-1111-4111-8111-111111111111', signer: '22222222-2222-4222-8222-222222222222', user: '33333333-3333-4333-8333-333333333333' };
  const raw: Array<[string, number, Record<string, unknown> | null]> = [
    ['document_version_frozen', 0, { version: 1, sha256: frozen }], ['signature_request_created', 1, { action: 'APPROVAL_AND_SIGNATURE' }], ['signature_request_sent', 2, null], ['client_notified', 3, { emailed: true }],
    ['document_viewed', 600, null], ['esign_consent_accepted', 650, { version: '2026-09-28.v1', textSha256: consentTextSha256() }], ['identity_otp_sent', 660, { emailed: true }], ['identity_otp_verified', 700, null],
    ['approval_recorded', 720, null], ['signing_started', 740, { method: 'TYPED' }], ['signature_applied', 741, { method: 'TYPED', typedName: 'Jane Smith' }], ['signer_completed', 741, null],
  ];
  const events: Array<ChainableEvent & { prevHash: string | null; hash: string; id: string }> = []; let prev: string | null = null;
  raw.forEach(([type, s, meta], i) => { const body: ChainableEvent = { requestId: ids.req, signerId: i < 4 ? null : ids.signer, actorUserId: i < 4 ? 'staff' : ids.user, type, at: t(s).toISOString(), ip: i < 4 ? '198.51.100.7' : '203.0.113.9', userAgent: i < 4 ? 'staff-browser' : 'Mozilla/5.0 (iPhone)', meta }; const hash = chainHash(prev, body); events.push({ ...body, prevHash: prev, hash, id: `e${i + 1}` }); prev = hash; });
  const chain = verifyChain(events.map(({ id: _id, ...e }) => { void _id; return e; }));
  const sealed = await sealSignedPdf({ originalPdf: original,
    fields: [{ type: 'SIGNATURE', page: 9999, xPct: 5500, yPct: 8600, wPct: 3500, hPct: 700, signer: { fullName: 'Jane Smith', signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImagePng: null, signedAt: t(741) } },
             { type: 'DATE', page: 9999, xPct: 5500, yPct: 9350, wPct: 2000, hPct: 350, signer: { fullName: 'Jane Smith', signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImagePng: null, signedAt: t(741) } },
             { type: 'ACKNOWLEDGEMENT', page: 0, xPct: 0, yPct: 0, wPct: 0, hPct: 0, label: 'I confirm all my income sources have been disclosed', valueText: 'true', signer: { fullName: 'Jane Smith', signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImagePng: null, signedAt: t(741) } }],
    request: { id: ids.req, title: '2025 US Tax Return Approval — TEST ONLY', clientRef: 'CL-TEST', clientName: 'Jane Smith', action: 'APPROVAL_AND_SIGNATURE', completedAt: t(742) },
    documents: [{ title: '2025 Form 1040 — TEST ONLY', version: 1, frozenSha256: frozen }],
    signers: [{ fullName: 'Jane Smith', email: 'jane.smith@example.test', role: 'SIGNER', signedAt: t(741), approvedAt: t(720), signatureMethod: 'TYPED', ip: '203.0.113.9', authMethod: 'PASSWORD_SESSION+EMAIL_OTP', consentVersion: '2026-09-28.v1' }],
    eventSummary: events.map(e => `${e.at}  ${e.type.replace(/_/g, ' ')}  (${e.ip})`) });
  writeFileSync(`${out}/signed.pdf`, sealed.bytes);
  const cert = buildEvidenceCertificate({ requestId: ids.req, clientRef: 'CL-TEST', clientName: 'Jane Smith', title: '2025 US Tax Return Approval — TEST ONLY', action: 'APPROVAL_AND_SIGNATURE', docKind: 'TAX_RETURN', signingOrder: 'PARALLEL',
    createdAt: t(1).toISOString(), sentAt: t(2).toISOString(), completedAt: t(742).toISOString(),
    documents: [{ deliveryId: 'd1', title: '2025 Form 1040 — TEST ONLY', version: 1, originalName: '2025-1040-jane-smith-TEST.pdf', frozenSha256: frozen, frozenSizeBytes: original.length, frozenAt: t(0).toISOString() }],
    signers: [{ signerId: ids.signer, userId: ids.user, fullName: 'Jane Smith', email: 'jane.smith@example.test', role: 'SIGNER', sequence: 1, authMethod: 'PASSWORD_SESSION+EMAIL_OTP', ip: '203.0.113.9', userAgent: 'Mozilla/5.0 (iPhone)', viewedAt: t(600).toISOString(), consentedAt: t(650).toISOString(), consentVersion: '2026-09-28.v1', consentTextSha256: consentTextSha256(), otpVerifiedAt: t(700).toISOString(), approvedAt: t(720).toISOString(), signedAt: t(741).toISOString(), signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImageSha256: null, identityVerification: null }],
    events: events.map(({ id, type, at, actorUserId, signerId, ip, userAgent, meta, prevHash, hash }) => ({ id, type, at, actorUserId, signerId, ip, userAgent, meta, prevHash, hash })),
    eventChainValid: chain.ok, sealedPdf: { sha256: sealed.sha256, sizeBytes: sealed.bytes.length }, generatedAt: t(743).toISOString() });
  writeFileSync(`${out}/evidence.json`, JSON.stringify(cert, null, 2));
  writeFileSync(`${out}/evidence-certificate.pdf`, await renderEvidenceCertificatePdf(cert));
  console.log(JSON.stringify({ originalSha256: frozen, sealedSha256: sealed.sha256, certificateSha256: sha256Hex(JSON.stringify(cert)), chain: chain.ok, events: events.length }));
});
