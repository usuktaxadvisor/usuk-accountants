import { describe, it, expect } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { sealSignedPdf, renderEvidenceCertificatePdf } from '@/lib/portal/esign-pdf';
import { sha256Hex, buildEvidenceCertificate } from '@/lib/portal/esign';

async function syntheticReturn(): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= 3; i++) { const p = pdf.addPage([612, 792]); p.drawText(`TEST ONLY — 2025 Form 1040 — Jane Smith — page ${i}`, { x: 50, y: 740, size: 12, font }); }
  return pdf.save();
}
// 1×1 transparent PNG
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

describe('sealed PDF', () => {
  it('draws typed + drawn signatures on the last page, appends a signing record page, changes the hash, and leaves the original untouched', async () => {
    const original = await syntheticReturn();
    const originalHash = sha256Hex(original);
    const signedAt = new Date('2026-09-28T10:00:00Z');
    const { bytes, sha256 } = await sealSignedPdf({
      originalPdf: original,
      fields: [
        { type: 'SIGNATURE', page: 9999, xPct: 5500, yPct: 8600, wPct: 3500, hPct: 700, signer: { fullName: 'Jane Smith', signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImagePng: null, signedAt } },
        { type: 'DATE', page: 9999, xPct: 5500, yPct: 9350, wPct: 2000, hPct: 350, signer: { fullName: 'Jane Smith', signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImagePng: null, signedAt } },
        { type: 'SIGNATURE', page: 3, xPct: 800, yPct: 8600, wPct: 3500, hPct: 700, signer: { fullName: 'John Smith', signatureMethod: 'DRAWN', signatureText: null, signatureImagePng: PNG, signedAt } },
        { type: 'ACKNOWLEDGEMENT', page: 0, xPct: 0, yPct: 0, wPct: 0, hPct: 0, label: 'I confirm all income sources are disclosed', valueText: 'true', signer: { fullName: 'Jane Smith', signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImagePng: null, signedAt } },
      ],
      request: { id: '11111111-1111-4111-8111-111111111111', title: '2025 US Tax Return Approval — TEST ONLY', clientRef: 'CL-TEST', clientName: 'Jane Smith', action: 'APPROVAL_AND_SIGNATURE', completedAt: signedAt },
      documents: [{ title: '2025 Form 1040', version: 1, frozenSha256: originalHash }],
      signers: [
        { fullName: 'Jane Smith', email: 'jane@example.test', role: 'SIGNER', signedAt, approvedAt: signedAt, signatureMethod: 'TYPED', ip: '203.0.113.9', authMethod: 'PASSWORD_SESSION+EMAIL_OTP', consentVersion: '2026-09-28.v1' },
        { fullName: 'John Smith', email: 'john@example.test', role: 'SIGNER', signedAt, approvedAt: null, signatureMethod: 'DRAWN', ip: '203.0.113.10', authMethod: 'PASSWORD_SESSION+EMAIL_OTP', consentVersion: '2026-09-28.v1' },
      ],
      eventSummary: ['2026-09-28T09:55:00.000Z  document viewed  (203.0.113.9)', '2026-09-28T10:00:00.000Z  signature applied  (203.0.113.9)'],
    });
    expect(sha256).toBe(sha256Hex(bytes));
    expect(sha256).not.toBe(originalHash);
    expect(sha256Hex(original)).toBe(originalHash); // original buffer untouched
    const sealed = await PDFDocument.load(bytes);
    expect(sealed.getPageCount()).toBe(4);
    expect(sealed.getTitle()).toBe('2025 US Tax Return Approval — TEST ONLY — signed');
    expect(sealed.getSubject()).toContain('11111111-1111-4111-8111-111111111111');
  });

  it('a one-byte change to the sealed file is detectable by hash', async () => {
    const original = await syntheticReturn();
    const { bytes, sha256 } = await sealSignedPdf({ originalPdf: original, fields: [], request: { id: 'r', title: 't', clientRef: 'CL', clientName: 'n', action: 'APPROVAL', completedAt: new Date() }, documents: [], signers: [], eventSummary: [] });
    const altered = Buffer.from(bytes); altered[altered.length - 10] ^= 0x01;
    expect(sha256Hex(altered)).not.toBe(sha256);
  });
});

describe('evidence certificate PDF', () => {
  it('renders from the JSON record and names the request, signer and hashes', async () => {
    const cert = buildEvidenceCertificate({
      requestId: 'req-1', clientRef: 'CL-TEST', clientName: 'Jane Smith', title: 'Engagement letter — TEST ONLY', action: 'SIGNATURE', docKind: 'ENGAGEMENT_LETTER', signingOrder: 'PARALLEL',
      createdAt: '2026-09-28T09:00:00.000Z', sentAt: '2026-09-28T09:01:00.000Z', completedAt: '2026-09-28T10:00:00.000Z',
      documents: [{ deliveryId: 'd1', title: 'Engagement letter', version: 1, originalName: 'engagement.pdf', frozenSha256: 'a'.repeat(64), frozenSizeBytes: 1234, frozenAt: '2026-09-28T09:00:30.000Z' }],
      signers: [{ signerId: 's1', userId: 'u1', fullName: 'Jane Smith', email: 'jane@example.test', role: 'SIGNER', sequence: 1, authMethod: 'PASSWORD_SESSION+EMAIL_OTP', ip: '203.0.113.9', userAgent: 'Mozilla/5.0', viewedAt: '2026-09-28T09:10:00.000Z', consentedAt: '2026-09-28T09:11:00.000Z', consentVersion: '2026-09-28.v1', consentTextSha256: 'b'.repeat(64), otpVerifiedAt: '2026-09-28T09:12:00.000Z', approvedAt: null, signedAt: '2026-09-28T09:13:00.000Z', signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImageSha256: null, identityVerification: null }],
      events: [{ id: 'e1', type: 'document_viewed', at: '2026-09-28T09:10:00.000Z', actorUserId: 'u1', signerId: 's1', ip: '203.0.113.9', userAgent: null, meta: null, prevHash: null, hash: 'c'.repeat(64) }],
      eventChainValid: true, sealedPdf: { sha256: 'd'.repeat(64), sizeBytes: 5678 }, generatedAt: '2026-09-28T10:00:01.000Z',
    });
    const bytes = await renderEvidenceCertificatePdf(cert);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(doc.getTitle()).toBe('Evidence certificate — Engagement letter — TEST ONLY');
    expect(bytes.length).toBeGreaterThan(2000);
  });
});
