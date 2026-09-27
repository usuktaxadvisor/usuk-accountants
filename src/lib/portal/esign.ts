import { createHash, randomInt } from 'node:crypto';

/**
 * E-signature / approval workflow — pure rules (no DB, no I/O) so the
 * legal and evidential logic is unit-tested in isolation. The loaders and
 * routes that touch the database live in ./esign-store.ts and the API routes.
 *
 * Request lifecycle
 *   DRAFT → AWAITING_CLIENT → VIEWED → PARTIALLY_SIGNED → COMPLETED
 *   AWAITING_CLIENT | VIEWED | PARTIALLY_SIGNED → DECLINED (a signer) | VOIDED (staff) | EXPIRED (clock) | SUPERSEDED (staff replaced the document)
 * Signer lifecycle
 *   PENDING → VIEWED → CONSENTED → APPROVED → SIGNED     (APPROVAL_AND_SIGNATURE)
 *   PENDING → VIEWED → CONSENTED → APPROVED              (APPROVAL)
 *   PENDING → VIEWED → CONSENTED → SIGNED                (SIGNATURE)
 *   any open → DECLINED
 */
export type SigAction = 'APPROVAL' | 'SIGNATURE' | 'APPROVAL_AND_SIGNATURE';
export type SigRequestStatus = 'DRAFT' | 'AWAITING_CLIENT' | 'VIEWED' | 'PARTIALLY_SIGNED' | 'COMPLETED' | 'DECLINED' | 'VOIDED' | 'EXPIRED' | 'SUPERSEDED';
export type SigSignerStatus = 'PENDING' | 'VIEWED' | 'CONSENTED' | 'APPROVED' | 'SIGNED' | 'DECLINED';
export type SigDocKind = 'GENERAL' | 'TAX_RETURN' | 'ENGAGEMENT_LETTER' | 'ADVISORY' | 'DECLARATION' | 'IRS_8879' | 'IRS_8878';
export type SignatureMethod = 'TYPED' | 'DRAWN' | 'CLICK';
export type IdvMethod = 'IN_PERSON_PHOTO_ID' | 'THIRD_PARTY_KBA' | 'MULTI_YEAR_RELATIONSHIP' | 'VIDEO_PHOTO_ID';

export const SIG_STATUS_LABEL: Record<SigRequestStatus, string> = {
  DRAFT: 'Draft',
  AWAITING_CLIENT: 'Awaiting client',
  VIEWED: 'Viewed by client',
  PARTIALLY_SIGNED: 'Partially signed',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
  VOIDED: 'Voided',
  EXPIRED: 'Expired',
  SUPERSEDED: 'Superseded',
};

export const SIG_ACTION_LABEL: Record<SigAction, string> = {
  APPROVAL: 'Review & approve',
  SIGNATURE: 'Review & sign',
  APPROVAL_AND_SIGNATURE: 'Review, approve & sign',
};

export const SIG_DOC_KIND_LABEL: Record<SigDocKind, string> = {
  GENERAL: 'General document',
  TAX_RETURN: 'Tax return (for approval)',
  ENGAGEMENT_LETTER: 'Engagement letter',
  ADVISORY: 'Advisory report',
  DECLARATION: 'Declaration / authorisation',
  IRS_8879: 'IRS Form 8879 (e-file authorisation)',
  IRS_8878: 'IRS Form 8878 (extension authorisation)',
};

/* ───────────── Consent wording (versioned; the exact text hash is stored with every acceptance) ───────────── */

export const ESIGN_CONSENT_VERSION = '2026-09-28.v1';
export const ESIGN_CONSENT_TEXT =
  `Consent to electronic records and signatures — US UK Accountants Ltd

By ticking the box and continuing, you agree that:
1. You have reviewed the document(s) shown in this request and had the opportunity to download and print them before signing.
2. Your electronic signature or approval, applied through this portal, is intended to be your signature and to have the same legal effect as a handwritten signature on paper, under the UK Electronic Communications Act 2000 and the UK eIDAS Regulation, and under the US Electronic Signatures in Global and National Commerce Act (ESIGN) and applicable state law (UETA).
3. You are signing or approving for yourself, using your own portal login, and no one else is acting for you.
4. We will keep an electronic record of the document, your signature or approval, and the related evidence (including the date and time, your login identity, and your connection details), and provide you with a copy of the completed document in your portal.
5. You may withdraw this consent for future documents by contacting us in writing; doing so will not affect documents you have already signed. You may also decline to sign any document and tell us why, and you may ask us for a paper copy of any document at any time.
6. This consent covers documents we send you through this portal for review, approval or signature (for example engagement letters, advisory reports and tax returns for approval). It does not cover deeds or other documents that the law requires to be witnessed or signed in a particular way; we will tell you separately if a document needs that.
7. To use this service you need a device with a current web browser, an internet connection, and a valid email address.`;

export function consentTextSha256(text: string = ESIGN_CONSENT_TEXT): string {
  return sha256Hex(Buffer.from(text.replace(/\r\n/g, '\n'), 'utf8'));
}

/* ───────────── Hashing ───────────── */

export function sha256Hex(data: Buffer | Uint8Array | string): string {
  return createHash('sha256').update(data).digest('hex');
}

/** Stable JSON: sorted keys, no whitespace — so the same event always hashes the same way. */
export function canonicalJson(value: unknown): string {
  const norm = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(norm);
    if (v && typeof v === 'object' && !(v instanceof Date)) {
      return Object.fromEntries(Object.keys(v as Record<string, unknown>).sort().map(k => [k, norm((v as Record<string, unknown>)[k])]));
    }
    if (v instanceof Date) return v.toISOString();
    return v;
  };
  return JSON.stringify(norm(value));
}

/** Hash chain for append-only events: each event's hash covers the previous hash + its own canonical content. */
export type ChainableEvent = { requestId: string; signerId: string | null; actorUserId: string | null; type: string; at: string; ip: string | null; userAgent: string | null; meta: Record<string, unknown> | null };
export function chainHash(prevHash: string | null, ev: ChainableEvent): string {
  return sha256Hex(`${prevHash ?? ''}|${canonicalJson(ev)}`);
}
export function verifyChain(events: Array<ChainableEvent & { prevHash: string | null; hash: string }>): { ok: true } | { ok: false; at: number } {
  let prev: string | null = null;
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e.prevHash !== prev) return { ok: false, at: i };
    const { prevHash: _p, hash, ...body } = e; void _p;
    if (chainHash(prev, body) !== hash) return { ok: false, at: i };
    prev = hash;
  }
  return { ok: true };
}

export const ESIGN_EVENT_TYPES = [
  'document_version_frozen', 'signature_request_created', 'signature_request_sent', 'client_notified', 'reminder_sent',
  'document_viewed', 'document_downloaded', 'esign_consent_accepted', 'identity_otp_sent', 'identity_otp_verified', 'identity_otp_failed',
  'signing_started', 'approval_recorded', 'signature_applied', 'signer_completed', 'all_signers_completed',
  'signed_pdf_created', 'evidence_certificate_created', 'signed_document_downloaded', 'evidence_downloaded',
  'request_declined', 'request_voided', 'request_expired', 'request_superseded', 'access_denied',
] as const;
export type EsignEventType = typeof ESIGN_EVENT_TYPES[number];

/* ───────────── Status rules ───────────── */

export const OPEN_REQUEST_STATUSES: SigRequestStatus[] = ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED'];
export function isOpen(status: SigRequestStatus): boolean { return OPEN_REQUEST_STATUSES.includes(status); }
export function isTerminal(status: SigRequestStatus): boolean { return !isOpen(status) && status !== 'DRAFT'; }
export function canVoid(status: SigRequestStatus): boolean { return status === 'DRAFT' || isOpen(status); }
export function canClientOpen(status: SigRequestStatus): boolean { return isOpen(status) || status === 'COMPLETED'; }

/** Which signer step comes next for the request's action, given the signer's current status. */
export function nextSignerStep(action: SigAction, s: SigSignerStatus): 'VIEW' | 'CONSENT' | 'APPROVE' | 'SIGN' | 'DONE' {
  if (s === 'DECLINED') return 'DONE';
  if (s === 'PENDING') return 'VIEW';
  if (s === 'VIEWED') return 'CONSENT';
  if (s === 'CONSENTED') return action === 'SIGNATURE' ? 'SIGN' : 'APPROVE';
  if (s === 'APPROVED') return action === 'APPROVAL' ? 'DONE' : 'SIGN';
  return 'DONE';
}
export function signerIsComplete(action: SigAction, s: SigSignerStatus): boolean {
  return action === 'APPROVAL' ? s === 'APPROVED' : s === 'SIGNED';
}

/** Sequential signing: signer N may act only when all lower sequences are complete. Parallel: always. */
export function signerMayAct(order: 'PARALLEL' | 'SEQUENTIAL', action: SigAction, signer: { sequence: number }, all: Array<{ sequence: number; status: SigSignerStatus }>): boolean {
  if (order === 'PARALLEL') return true;
  return all.filter(s => s.sequence < signer.sequence).every(s => signerIsComplete(action, s.status));
}

/** Request status derived from its signers (called after every signer transition). */
export function deriveRequestStatus(action: SigAction, current: SigRequestStatus, signers: Array<{ status: SigSignerStatus }>): SigRequestStatus {
  if (isTerminal(current)) return current;
  if (signers.some(s => s.status === 'DECLINED')) return 'DECLINED';
  const done = signers.filter(s => signerIsComplete(action, s.status)).length;
  if (signers.length > 0 && done === signers.length) return 'COMPLETED';
  if (done > 0) return 'PARTIALLY_SIGNED';
  if (signers.some(s => s.status !== 'PENDING')) return 'VIEWED';
  return current === 'DRAFT' ? 'DRAFT' : 'AWAITING_CLIENT';
}

export function hasExpired(expiresAt: Date | null, now: Date = new Date()): boolean {
  return !!expiresAt && now.getTime() > expiresAt.getTime();
}

/* ───────────── Document-type controls (IRS Pub. 1345) ───────────── */

export const IRS_EFILE_AUTH_KINDS: SigDocKind[] = ['IRS_8879', 'IRS_8878'];

/**
 * IRS Publication 1345 (Rev. Dec 2025) and the IRS e-file Signature Authorization FAQs (reviewed 27 Jun 2026),
 * re-verified 28 Sep 2026 from irs.gov:
 *  - A portal signing is a REMOTE transaction ("the ERO isn't physically present with the taxpayer").
 *  - Remote e-signature of Form 8878/8879 requires identity verification "in accordance with NIST SP 800-63 ...
 *    Level 2 assurance level and knowledge-based authentication or higher assurance level", and it "must be
 *    completed every time a taxpayer electronically signs Form 8878 or 8879". The IRS does not use the term "IAL2".
 *  - The two exceptions (in-person signing; in-person + multi-year business relationship) apply ONLY when the
 *    taxpayer signs in the ERO's physical presence. A stored photo-ID check or a long relationship therefore
 *    does NOT unlock remote e-signing.
 *  - A handwritten signature on the form returned by email/website is NOT a remote e-signature and needs no KBA
 *    (print → sign → upload stays available for every client).
 * The portal has no KBA provider integrated, so IRS e-file authorisations are refused for remote e-signature
 * unless (a) ESIGN_IRS_REMOTE_ENABLED=true AND (b) a third-party KBA pass with a provider reference was recorded
 * for this signer within the last 24 hours — i.e. for THIS signing event.
 */
export const IRS_KBA_FRESHNESS_MS = 24 * 60 * 60_000;
export type IdvForGate = { method: IdvMethod; verifiedAt: Date; providerRef: string | null; validUntil: Date | null };
export function remoteEsignPermitted(kind: SigDocKind, idv: IdvForGate | null, now: Date = new Date(), irsRemoteEnabled: boolean = process.env.ESIGN_IRS_REMOTE_ENABLED === 'true'): { ok: true } | { ok: false; reason: string } {
  if (!IRS_EFILE_AUTH_KINDS.includes(kind)) return { ok: true };
  const fallback = 'Use the print-sign-upload route for Forms 8878/8879 (the IRS treats a handwritten signature returned through the portal as a handwritten signature, with no identity-verification step).';
  if (!irsRemoteEnabled) return { ok: false, reason: `Remote e-signature of IRS e-file authorisations is switched off for this portal because IRS Publication 1345 requires knowledge-based authentication through a third-party provider for every remote signing, which is not integrated. ${fallback}` };
  if (!idv || idv.method !== 'THIRD_PARTY_KBA' || !idv.providerRef) return { ok: false, reason: `IRS Publication 1345 requires a passed third-party knowledge-based authentication (with the provider's reference) for each remote e-signature of Form 8878/8879; in-person checks and a multi-year relationship only count when the client signs in your physical presence. ${fallback}` };
  if (now.getTime() - idv.verifiedAt.getTime() > IRS_KBA_FRESHNESS_MS) return { ok: false, reason: `The KBA pass on file is older than 24 hours; the IRS requires identity verification for each signing event. Record today's KBA result or ${fallback.charAt(0).toLowerCase()}${fallback.slice(1)}` };
  if (idv.validUntil && now.getTime() > idv.validUntil.getTime()) return { ok: false, reason: `The identity verification on file has lapsed. ${fallback}` };
  return { ok: true };
}

/** Evidence the IRS expects the ERO to keep for a remote e-signature (Pub. 1345: digital image of the signed form, date/time, IP address, login identification, identity-verification result, signature method / audit trail). */
export const IRS_REMOTE_ESIGN_EVIDENCE = ['signedImage', 'signedAt', 'ip', 'loginIdentifier', 'signatureMethod', 'identityVerification'] as const;

/* ───────────── One-time code ───────────── */

export function generateOtp(): string { return String(randomInt(0, 1_000_000)).padStart(6, '0'); }
export function otpHash(code: string, signerId: string): string { return sha256Hex(`${signerId}:${code}`); }
export const OTP_TTL_MS = 10 * 60_000;
export const OTP_MAX_ATTEMPTS = 5;

/* ───────────── Signature input validation ───────────── */

export function normaliseSignature(method: unknown, typed: unknown, png: unknown): { ok: true; method: SignatureMethod; text: string | null; png: string | null } | { ok: false; reason: string } {
  if (method === 'TYPED') {
    const t = String(typed ?? '').trim().slice(0, 120);
    if (t.length < 2) return { ok: false, reason: 'Please type your full name as your signature.' };
    return { ok: true, method, text: t, png: null };
  }
  if (method === 'DRAWN') {
    const p = String(png ?? '');
    if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(p)) return { ok: false, reason: 'The drawn signature could not be read. Please try again.' };
    if (p.length > 200_000) return { ok: false, reason: 'The drawn signature is too large. Please draw it again.' };
    return { ok: true, method, text: null, png: p };
  }
  if (method === 'CLICK') return { ok: true, method, text: null, png: null };
  return { ok: false, reason: 'Please choose how you would like to sign.' };
}

/* ───────────── Evidence certificate ───────────── */

export type EvidenceCertificate = {
  schema: 'usuk-esign-evidence/1';
  requestId: string; clientRef: string; clientName: string; title: string; action: SigAction; docKind: SigDocKind; signingOrder: string;
  createdAt: string; sentAt: string | null; completedAt: string;
  documents: Array<{ deliveryId: string; title: string; version: number; originalName: string; frozenSha256: string; frozenSizeBytes: number; frozenAt: string }>;
  signers: Array<{
    signerId: string; userId: string; fullName: string; email: string; role: string; sequence: number;
    authMethod: string | null; ip: string | null; userAgent: string | null;
    viewedAt: string | null; consentedAt: string | null; consentVersion: string | null; consentTextSha256: string | null;
    otpVerifiedAt: string | null; approvedAt: string | null; signedAt: string | null; signatureMethod: string | null; signatureText: string | null; signatureImageSha256: string | null;
    identityVerification: { method: IdvMethod; verifiedAt: string; providerRef: string | null } | null;
  }>;
  events: Array<{ id: string; type: string; at: string; actorUserId: string | null; signerId: string | null; ip: string | null; userAgent: string | null; meta: Record<string, unknown> | null; prevHash: string | null; hash: string }>;
  eventChainValid: boolean;
  sealedPdf: { sha256: string; sizeBytes: number } | null;
  legalBasis: string[];
  generatedAt: string; generatedBy: string;
};

/** The certificate's integrity hash: SHA-256 of its canonical JSON. Stable across jsonb storage, key order and whitespace. */
export function certificateSha256(cert: EvidenceCertificate): string { return sha256Hex(canonicalJson(cert)); }

export function buildEvidenceCertificate(input: Omit<EvidenceCertificate, 'schema' | 'legalBasis' | 'generatedBy'>): EvidenceCertificate {
  return {
    schema: 'usuk-esign-evidence/1',
    ...input,
    legalBasis: [
      'UK: Electronic Communications Act 2000 s.7; UK eIDAS Regulation (Regulation (EU) 910/2014 as retained and amended by SI 2019/89); Law Commission, Electronic execution of documents (2019).',
      'US: Electronic Signatures in Global and National Commerce Act, 15 U.S.C. §7001 et seq.; Uniform Electronic Transactions Act as enacted by the states.',
      'IRS e-file authorisations (Forms 8878/8879): IRS Publication 1345 electronic signature and identity verification requirements; IRS e-file Signature Authorization FAQs.',
    ],
    generatedBy: 'US UK Accountants Ltd client portal — native e-signature module',
  };
}

/** A short human-readable timeline used by the sealed PDF and the staff "Signature record" page. */
export function summariseTimeline(cert: EvidenceCertificate): string[] {
  const lines: string[] = [];
  for (const e of cert.events) {
    const who = cert.signers.find(s => s.signerId === e.signerId)?.fullName ?? (e.actorUserId ? 'Staff' : 'System');
    lines.push(`${e.at}  ${e.type.replace(/_/g, ' ')}  —  ${who}${e.ip ? `  (${e.ip})` : ''}`);
  }
  return lines;
}
