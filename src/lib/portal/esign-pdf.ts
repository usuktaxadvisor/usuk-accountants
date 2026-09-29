import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';
import { sha256Hex, type EvidenceCertificate, summariseTimeline } from './esign';

/**
 * Sealing: takes the FROZEN original bytes (never the live Drive file — the
 * caller re-hashes and refuses to seal if the hash has drifted), draws each
 * signer's signature/initials/date/name into the placed fields, appends a
 * "Signing record" page (who / what / when / hash / event summary), sets
 * document metadata, and returns the sealed bytes. The result is a new PDF;
 * the original is left untouched and stored separately.
 *
 * Note on "tamper sealing": we do not apply a cryptographic PAdES signature
 * (that would need a certificate + HSM or a trust-service provider). Integrity
 * is proven by the SHA-256 of the sealed bytes, which is recorded in the
 * append-only evidence tables and printed on the signing page — any later
 * change to the PDF changes the hash and is detectable.
 */
export type PlacedField = {
  type: 'SIGNATURE' | 'INITIALS' | 'DATE' | 'NAME' | 'CHECKBOX' | 'ACKNOWLEDGEMENT';
  page: number; xPct: number; yPct: number; wPct: number; hPct: number; label?: string | null; valueText?: string | null;
  signer: { fullName: string; signatureMethod: string | null; signatureText: string | null; signatureImagePng: string | null; signedAt: Date | null };
};

export type SealInput = {
  originalPdf: Uint8Array;
  fields: PlacedField[];
  request: { id: string; title: string; clientRef: string; clientName: string; action: string; completedAt: Date };
  documents: Array<{ title: string; version: number; frozenSha256: string }>;
  signers: Array<{ fullName: string; email: string; role: string; signedAt: Date | null; approvedAt: Date | null; signatureMethod: string | null; ip: string | null; authMethod: string | null; consentVersion: string | null }>;
  eventSummary: string[];
};

const NAVY = rgb(0.05, 0.11, 0.24);
const GREY = rgb(0.35, 0.35, 0.35);

function drawWrapped(page: PDFPage, font: PDFFont, text: string, x: number, y: number, size: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(/\s+/); let line = ''; let cy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) { page.drawText(line, { x, y: cy, size, font, color: GREY }); cy -= lineHeight; line = w; }
    else line = test;
  }
  if (line) { page.drawText(line, { x, y: cy, size, font, color: GREY }); cy -= lineHeight; }
  return cy;
}

export async function sealSignedPdf(input: SealInput): Promise<{ bytes: Uint8Array; sha256: string }> {
  const pdf = await PDFDocument.load(input.originalPdf, { ignoreEncryption: false, updateMetadata: false });
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const script = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const pages = pdf.getPages();

  // 1. Draw placed fields onto their pages (page 0 = "append to signing page", handled below).
  const appendFields: PlacedField[] = [];
  for (const f of input.fields) {
    const pageNo = f.page === 9999 ? pages.length : f.page; // 9999 = "last page" preset
    if (pageNo < 1 || pageNo > pages.length) { appendFields.push(f); continue; }
    const page = pages[pageNo - 1];
    const { width, height } = page.getSize();
    const x = (f.xPct / 10000) * width, w = (f.wPct / 10000) * width, h = (f.hPct / 10000) * height;
    const yTop = height - (f.yPct / 10000) * height; const y = yTop - h;
    await drawField(pdf, page, f, x, y, w, h, helv, script);
  }

  // 2. Signing record page (always appended; also hosts fields with page = 0).
  const rec = pdf.addPage([595.28, 841.89]); // A4
  let y = 800;
  const approvalOnly = input.request.action === 'APPROVAL';
  rec.drawText(approvalOnly ? 'Approval record' : 'Signing record', { x: 50, y, size: 18, font: helvB, color: NAVY }); y -= 14;
  rec.drawText(approvalOnly ? 'US UK Accountants Ltd client portal — electronic approval record (no signature was applied)' : 'US UK Accountants Ltd client portal — electronic signature record', { x: 50, y, size: 9, font: helv, color: GREY }); y -= 24;
  const kv = (k: string, v: string) => { rec.drawText(k, { x: 50, y, size: 9, font: helvB, color: NAVY }); y = drawWrapped(rec, helv, v, 190, y, 9, 355, 12); y -= 2; };
  kv('Document', `${input.request.title}`);
  kv('Client', `${input.request.clientName} (${input.request.clientRef})`);
  kv('Request ID', input.request.id);
  kv('Action', input.request.action.replace(/_/g, ' ').toLowerCase());
  kv('Completed (UTC)', input.request.completedAt.toISOString());
  for (const d of input.documents) kv(`Original v${d.version}`, `${d.title} — SHA-256 ${d.frozenSha256}`);
  y -= 8;
  rec.drawText('Signers', { x: 50, y, size: 11, font: helvB, color: NAVY }); y -= 16;
  for (const s of input.signers) {
    const when = (s.signedAt ?? s.approvedAt)?.toISOString() ?? '—';
    kv(s.role.toLowerCase(), `${s.fullName} <${s.email}> — ${s.signedAt ? 'signed' : 'approved'} ${when} — method ${s.signatureMethod ?? 'approval'} — auth ${s.authMethod ?? 'portal session'}${s.ip ? ` — IP ${s.ip}` : ''} — consent ${s.consentVersion ?? '—'}`);
  }
  for (const f of appendFields) {
    y -= 6; const h = 46;
    await drawField(pdf, rec, f, 50, y - h, 240, h, helv, script);
    rec.drawText(`${f.signer.fullName}${f.signer.signedAt ? ` — ${f.signer.signedAt.toISOString()}` : ''}`, { x: 300, y: y - 20, size: 8, font: helv, color: GREY });
    y -= h + 10;
  }
  y -= 8;
  rec.drawText('Event summary', { x: 50, y, size: 11, font: helvB, color: NAVY }); y -= 14;
  for (const line of input.eventSummary.slice(0, 40)) {
    if (y < 60) break;
    y = drawWrapped(rec, helv, line, 50, y, 7, 495, 9);
  }
  rec.drawText('Integrity: the SHA-256 of this sealed file is recorded in the portal evidence record. Any change to this file changes that hash.', { x: 50, y: 34, size: 7, font: helv, color: GREY });

  pdf.setTitle(`${input.request.title} — ${approvalOnly ? 'approved' : 'signed'}`);
  pdf.setProducer('US UK Accountants client portal e-signature');
  pdf.setSubject(`Signature request ${input.request.id}`);
  pdf.setModificationDate(input.request.completedAt);
  const bytes = await pdf.save({ useObjectStreams: false });
  return { bytes, sha256: sha256Hex(bytes) };
}

async function drawField(pdf: PDFDocument, page: PDFPage, f: PlacedField, x: number, y: number, w: number, h: number, helv: PDFFont, script: PDFFont) {
  const s = f.signer;
  const when = s.signedAt ? s.signedAt.toISOString().slice(0, 10) : '';
  if (f.type === 'SIGNATURE' || f.type === 'INITIALS') {
    page.drawRectangle({ x, y, width: w, height: h, borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 0.5 });
    const value = f.type === 'INITIALS' ? initialsOf(s.fullName) : (s.signatureText ?? s.fullName);
    if (s.signatureMethod === 'DRAWN' && s.signatureImagePng && f.type === 'SIGNATURE') {
      try {
        const img = await pdf.embedPng(Buffer.from(s.signatureImagePng.split(',')[1] ?? '', 'base64'));
        const scale = Math.min((w - 8) / img.width, (h - 14) / img.height);
        page.drawImage(img, { x: x + 4, y: y + 12, width: img.width * scale, height: img.height * scale });
      } catch { page.drawText(value, { x: x + 6, y: y + h / 2 - 4, size: Math.min(16, h * 0.45), font: script, color: NAVY }); }
    } else {
      page.drawText(value, { x: x + 6, y: y + h / 2 - 4, size: Math.min(16, h * 0.45), font: script, color: NAVY });
    }
    page.drawText(`e-signed by ${s.fullName} ${when}`.trim(), { x: x + 4, y: y + 3, size: 5.5, font: helv, color: GREY });
  } else if (f.type === 'DATE') {
    page.drawText(when, { x: x + 2, y: y + h / 2 - 4, size: Math.min(11, h * 0.5), font: helv, color: NAVY });
  } else if (f.type === 'NAME') {
    page.drawText(s.fullName, { x: x + 2, y: y + h / 2 - 4, size: Math.min(11, h * 0.5), font: helv, color: NAVY });
  } else if (f.type === 'CHECKBOX' || f.type === 'ACKNOWLEDGEMENT') {
    const box = Math.min(10, h);
    page.drawRectangle({ x, y: y + (h - box) / 2, width: box, height: box, borderColor: NAVY, borderWidth: 1 });
    if (f.valueText === 'true') page.drawText('X', { x: x + 2, y: y + (h - box) / 2 + 1, size: box - 1, font: helv, color: NAVY });
    if (f.label) page.drawText(f.label.slice(0, 120), { x: x + box + 4, y: y + (h - 8) / 2, size: 8, font: helv, color: GREY });
  }
}

function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).map(p => p[0]!.toUpperCase()).join('');
}

/** Standalone evidence certificate PDF (mirrors the JSON record; the JSON stays authoritative). */
export async function renderEvidenceCertificatePdf(cert: EvidenceCertificate): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvB = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595.28, 841.89]); let y = 800;
  const nl = (h = 12) => { y -= h; if (y < 60) { page = pdf.addPage([595.28, 841.89]); y = 800; } };
  const H = (t: string) => { page.drawText(t, { x: 50, y, size: 12, font: helvB, color: NAVY }); nl(16); };
  const L = (t: string, size = 8) => { y = drawWrapped(page, helv, t, 50, y, size, 495, size + 3); if (y < 60) { page = pdf.addPage([595.28, 841.89]); y = 800; } };

  page.drawText('Signature evidence certificate', { x: 50, y, size: 18, font: helvB, color: NAVY }); nl(14);
  page.drawText('US UK Accountants Ltd — Company No. 17336015 — client portal e-signature record', { x: 50, y, size: 9, font: helv, color: GREY }); nl(22);
  H('Request');
  L(`Request ID: ${cert.requestId}`); L(`Title: ${cert.title}`); L(`Client: ${cert.clientName} (${cert.clientRef})`);
  L(`Action: ${cert.action}   Document type: ${cert.docKind}   Signing order: ${cert.signingOrder}`);
  L(`Created: ${cert.createdAt}   Sent: ${cert.sentAt ?? '—'}   Completed: ${cert.completedAt}`); nl(8);
  H('Documents (frozen at request creation)');
  for (const d of cert.documents) L(`${d.title} (v${d.version}, ${d.originalName}) — SHA-256 ${d.frozenSha256} — ${d.frozenSizeBytes} bytes — frozen ${d.frozenAt}`);
  if (cert.sealedPdf) L(`Sealed signed PDF — SHA-256 ${cert.sealedPdf.sha256} — ${cert.sealedPdf.sizeBytes} bytes`); nl(8);
  H('Signers');
  for (const s of cert.signers) {
    L(`${s.sequence}. ${s.fullName} <${s.email}> — role ${s.role} — portal user ${s.userId}`);
    L(`   Authentication: ${s.authMethod ?? '—'}   IP: ${s.ip ?? '—'}   User agent: ${s.userAgent ?? '—'}`);
    L(`   Viewed: ${s.viewedAt ?? '—'}   Consent: ${s.consentedAt ?? '—'} (v${s.consentVersion ?? '—'}, text SHA-256 ${s.consentTextSha256 ?? '—'})`);
    L(`   One-time code verified: ${s.otpVerifiedAt ?? '—'}   Approved: ${s.approvedAt ?? '—'}   Signed: ${s.signedAt ?? '—'}   Method: ${s.signatureMethod ?? '—'}${s.signatureText ? ` ("${s.signatureText}")` : ''}${s.signatureImageSha256 ? `   Drawn image SHA-256 ${s.signatureImageSha256}` : ''}`);
    L(`   Identity verification (IRS Pub. 1345): ${s.identityVerification ? `${s.identityVerification.method} on ${s.identityVerification.verifiedAt}${s.identityVerification.providerRef ? ` (ref ${s.identityVerification.providerRef})` : ''}` : 'not required / none recorded'}`);
    nl(4);
  }
  nl(6); H(`Event log (append-only, hash-chained — chain ${cert.eventChainValid ? 'VERIFIED' : 'BROKEN'})`);
  for (const line of summariseTimeline(cert)) L(line, 7);
  nl(6); H('Legal basis');
  for (const b of cert.legalBasis) L(b);
  nl(6); L(`Generated ${cert.generatedAt} by ${cert.generatedBy}. The authoritative record is the JSON evidence stored in the portal database (schema ${cert.schema}); this PDF is a rendering of it.`);
  pdf.setTitle(`Evidence certificate — ${cert.title}`);
  pdf.setProducer('US UK Accountants client portal e-signature');
  return pdf.save({ useObjectStreams: false });
}
