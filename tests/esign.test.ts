import { describe, it, expect } from 'vitest';
import {
  ESIGN_CONSENT_VERSION, consentTextSha256, sha256Hex, canonicalJson, chainHash, verifyChain,
  isOpen, isTerminal, canVoid, canClientOpen, nextSignerStep, signerIsComplete, signerMayAct, deriveRequestStatus, hasExpired,
  remoteEsignPermitted, generateOtp, otpHash, normaliseSignature, buildEvidenceCertificate, summariseTimeline,
  type SigSignerStatus, type ChainableEvent,
} from '@/lib/portal/esign';

describe('consent wording is versioned and hashed', () => {
  it('has a version and a stable text hash', () => {
    expect(ESIGN_CONSENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}\.v\d+$/);
    expect(consentTextSha256()).toHaveLength(64);
    expect(consentTextSha256()).toBe(consentTextSha256());
    expect(consentTextSha256('different')).not.toBe(consentTextSha256());
  });
});

describe('hashing and the append-only event chain', () => {
  const ev = (type: string, i: number): ChainableEvent => ({ requestId: 'r1', signerId: 's1', actorUserId: 'u1', type, at: `2026-09-28T10:00:0${i}.000Z`, ip: '203.0.113.9', userAgent: 'UA', meta: { i } });
  it('canonical JSON is key-order independent', () => {
    expect(canonicalJson({ b: 1, a: { d: 2, c: [3, { f: 1, e: 2 }] } })).toBe(canonicalJson({ a: { c: [3, { e: 2, f: 1 }], d: 2 }, b: 1 }));
  });
  it('verifies a well-formed chain', () => {
    const events: Array<ChainableEvent & { prevHash: string | null; hash: string }> = [];
    let prev: string | null = null;
    for (let i = 0; i < 4; i++) { const body = ev(`e${i}`, i); const hash = chainHash(prev, body); events.push({ ...body, prevHash: prev, hash }); prev = hash; }
    expect(verifyChain(events)).toEqual({ ok: true });
  });
  it('detects a tampered event, a reordered event and a deleted event', () => {
    const events: Array<ChainableEvent & { prevHash: string | null; hash: string }> = [];
    let prev: string | null = null;
    for (let i = 0; i < 4; i++) { const body = ev(`e${i}`, i); const hash = chainHash(prev, body); events.push({ ...body, prevHash: prev, hash }); prev = hash; }
    const tampered = events.map(e => ({ ...e })); tampered[2].ip = '198.51.100.1';
    expect(verifyChain(tampered)).toEqual({ ok: false, at: 2 });
    const reordered = [events[0], events[2], events[1], events[3]];
    expect(verifyChain(reordered).ok).toBe(false);
    const deleted = [events[0], events[2], events[3]];
    expect(verifyChain(deleted)).toEqual({ ok: false, at: 1 });
  });
  it('sha256 of document bytes is deterministic and sensitive to a single byte', () => {
    const a = Buffer.from('%PDF-1.4 hello'); const b = Buffer.from('%PDF-1.4 hellp');
    expect(sha256Hex(a)).toBe(sha256Hex(Buffer.from('%PDF-1.4 hello')));
    expect(sha256Hex(a)).not.toBe(sha256Hex(b));
  });
});

describe('request status rules', () => {
  it('open / terminal / void / client-open', () => {
    for (const s of ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED'] as const) { expect(isOpen(s)).toBe(true); expect(canVoid(s)).toBe(true); expect(canClientOpen(s)).toBe(true); }
    for (const s of ['COMPLETED', 'DECLINED', 'VOIDED', 'EXPIRED', 'SUPERSEDED'] as const) { expect(isTerminal(s)).toBe(true); expect(canVoid(s)).toBe(false); }
    expect(canClientOpen('COMPLETED')).toBe(true); // signed copy stays reachable
    expect(canClientOpen('VOIDED')).toBe(false);
    expect(canVoid('DRAFT')).toBe(true);
  });
  it('signer steps follow the action', () => {
    expect(nextSignerStep('APPROVAL_AND_SIGNATURE', 'PENDING')).toBe('VIEW');
    expect(nextSignerStep('APPROVAL_AND_SIGNATURE', 'VIEWED')).toBe('CONSENT');
    expect(nextSignerStep('APPROVAL_AND_SIGNATURE', 'CONSENTED')).toBe('APPROVE');
    expect(nextSignerStep('APPROVAL_AND_SIGNATURE', 'APPROVED')).toBe('SIGN');
    expect(nextSignerStep('APPROVAL_AND_SIGNATURE', 'SIGNED')).toBe('DONE');
    expect(nextSignerStep('SIGNATURE', 'CONSENTED')).toBe('SIGN');
    expect(nextSignerStep('APPROVAL', 'CONSENTED')).toBe('APPROVE');
    expect(nextSignerStep('APPROVAL', 'APPROVED')).toBe('DONE');
    expect(nextSignerStep('SIGNATURE', 'DECLINED')).toBe('DONE');
  });
  it('signer completion depends on the action', () => {
    expect(signerIsComplete('APPROVAL', 'APPROVED')).toBe(true);
    expect(signerIsComplete('SIGNATURE', 'APPROVED')).toBe(false);
    expect(signerIsComplete('APPROVAL_AND_SIGNATURE', 'SIGNED')).toBe(true);
  });
  it('sequential signing blocks signer 2 until signer 1 completes; parallel never blocks', () => {
    const all = [{ sequence: 1, status: 'CONSENTED' as SigSignerStatus }, { sequence: 2, status: 'PENDING' as SigSignerStatus }];
    expect(signerMayAct('SEQUENTIAL', 'SIGNATURE', { sequence: 2 }, all)).toBe(false);
    expect(signerMayAct('PARALLEL', 'SIGNATURE', { sequence: 2 }, all)).toBe(true);
    all[0].status = 'SIGNED';
    expect(signerMayAct('SEQUENTIAL', 'SIGNATURE', { sequence: 2 }, all)).toBe(true);
  });
  it('derives the request status from signers and never leaves a terminal state', () => {
    const d = (cur: Parameters<typeof deriveRequestStatus>[1], ...s: SigSignerStatus[]) => deriveRequestStatus('SIGNATURE', cur, s.map(status => ({ status })));
    expect(d('AWAITING_CLIENT', 'PENDING')).toBe('AWAITING_CLIENT');
    expect(d('AWAITING_CLIENT', 'VIEWED')).toBe('VIEWED');
    expect(d('AWAITING_CLIENT', 'SIGNED', 'PENDING')).toBe('PARTIALLY_SIGNED');
    expect(d('PARTIALLY_SIGNED', 'SIGNED', 'SIGNED')).toBe('COMPLETED');
    expect(d('VIEWED', 'DECLINED', 'PENDING')).toBe('DECLINED');
    expect(d('VOIDED', 'SIGNED', 'SIGNED')).toBe('VOIDED');
    expect(d('EXPIRED', 'SIGNED')).toBe('EXPIRED');
  });
  it('expiry', () => {
    expect(hasExpired(null)).toBe(false);
    expect(hasExpired(new Date(Date.now() - 1000))).toBe(true);
    expect(hasExpired(new Date(Date.now() + 1000))).toBe(false);
  });
});

describe('IRS Pub. 1345 document-type control', () => {
  it('ordinary documents need no identity verification', () => {
    expect(remoteEsignPermitted('TAX_RETURN', null).ok).toBe(true);
    expect(remoteEsignPermitted('ENGAGEMENT_LETTER', null).ok).toBe(true);
  });
  it('Forms 8878/8879 are refused for remote e-signature unless the feature is enabled AND a fresh third-party KBA pass exists (Pub. 1345 Rev. Dec 2025)', () => {
    const now = new Date();
    const fresh = { method: 'THIRD_PARTY_KBA' as const, verifiedAt: new Date(now.getTime() - 60_000), providerRef: 'kba-tx-123', validUntil: null };
    // Switched off (default): nothing unlocks it, not even a fresh KBA.
    expect(remoteEsignPermitted('IRS_8879', fresh, now, false).ok).toBe(false);
    expect(remoteEsignPermitted('IRS_8878', null, now, false).ok).toBe(false);
    // Switched on: only a fresh KBA pass with a provider reference.
    expect(remoteEsignPermitted('IRS_8879', null, now, true).ok).toBe(false);
    expect(remoteEsignPermitted('IRS_8879', fresh, now, true).ok).toBe(true);
    expect(remoteEsignPermitted('IRS_8879', { ...fresh, providerRef: null }, now, true).ok).toBe(false);
    expect(remoteEsignPermitted('IRS_8879', { ...fresh, verifiedAt: new Date(now.getTime() - 2 * 86_400_000) }, now, true).ok).toBe(false);
    // In-person photo ID and multi-year relationship only count for in-person signing — never for the portal.
    expect(remoteEsignPermitted('IRS_8879', { ...fresh, method: 'IN_PERSON_PHOTO_ID' }, now, true).ok).toBe(false);
    expect(remoteEsignPermitted('IRS_8879', { ...fresh, method: 'MULTI_YEAR_RELATIONSHIP' }, now, true).ok).toBe(false);
    expect(remoteEsignPermitted('IRS_8879', { ...fresh, method: 'VIDEO_PHOTO_ID' }, now, true).ok).toBe(false);
    // Ordinary documents are unaffected.
    expect(remoteEsignPermitted('TAX_RETURN', null, now, false).ok).toBe(true);
  });
});

describe('one-time code and signature input', () => {
  it('OTP is 6 digits and only its salted hash is comparable', () => {
    const c = generateOtp(); expect(c).toMatch(/^\d{6}$/);
    expect(otpHash(c, 's1')).not.toBe(otpHash(c, 's2'));
    expect(otpHash(c, 's1')).toBe(otpHash(c, 's1'));
  });
  it('typed signature needs a name; drawn needs a bounded PNG data URL; click is accepted', () => {
    expect(normaliseSignature('TYPED', 'J', null).ok).toBe(false);
    expect(normaliseSignature('TYPED', 'Jane Smith', null)).toMatchObject({ ok: true, method: 'TYPED', text: 'Jane Smith' });
    expect(normaliseSignature('DRAWN', null, 'data:image/png;base64,iVBORw0KGgo=').ok).toBe(true);
    expect(normaliseSignature('DRAWN', null, 'data:image/svg+xml;base64,abc').ok).toBe(false);
    expect(normaliseSignature('DRAWN', null, 'data:image/png;base64,' + 'A'.repeat(300_000)).ok).toBe(false);
    expect(normaliseSignature('CLICK', null, null).ok).toBe(true);
    expect(normaliseSignature('MAGIC', null, null).ok).toBe(false);
  });
});

describe('evidence certificate', () => {
  it('carries legal basis, schema, and a readable timeline', () => {
    const cert = buildEvidenceCertificate({
      requestId: 'r1', clientRef: 'CL-TEST', clientName: 'Jane Smith', title: '2025 US Tax Return Approval — TEST ONLY', action: 'APPROVAL_AND_SIGNATURE', docKind: 'TAX_RETURN', signingOrder: 'PARALLEL',
      createdAt: 'c', sentAt: 's', completedAt: 'z', documents: [], events: [{ id: 'e1', type: 'signature_applied', at: '2026-09-28T10:00:00.000Z', actorUserId: 'u1', signerId: 's1', ip: '203.0.113.9', userAgent: null, meta: null, prevHash: null, hash: 'h' }],
      signers: [{ signerId: 's1', userId: 'u1', fullName: 'Jane Smith', email: 'jane@example.test', role: 'SIGNER', sequence: 1, authMethod: 'PASSWORD_SESSION+EMAIL_OTP', ip: '203.0.113.9', userAgent: null, viewedAt: null, consentedAt: null, consentVersion: null, consentTextSha256: null, otpVerifiedAt: null, approvedAt: null, signedAt: null, signatureMethod: 'TYPED', signatureText: 'Jane Smith', signatureImageSha256: null, identityVerification: null }],
      eventChainValid: true, sealedPdf: { sha256: 'x', sizeBytes: 1 }, generatedAt: 'g',
    });
    expect(cert.schema).toBe('usuk-esign-evidence/1');
    expect(cert.legalBasis.join(' ')).toMatch(/Electronic Communications Act 2000/);
    expect(cert.legalBasis.join(' ')).toMatch(/15 U\.S\.C\. §7001/);
    expect(cert.legalBasis.join(' ')).toMatch(/Publication 1345/);
    expect(summariseTimeline(cert)[0]).toContain('Jane Smith');
  });
});

/* ───────── Lifecycle simulation: the scenarios from the brief, driven through the pure rules ───────── */
describe('lifecycle scenarios (pure-rule simulation)', () => {
  type S = { sequence: number; status: SigSignerStatus };
  const run = (action: 'APPROVAL' | 'SIGNATURE' | 'APPROVAL_AND_SIGNATURE', order: 'PARALLEL' | 'SEQUENTIAL', signers: S[], steps: Array<[number, SigSignerStatus]>) => {
    let status: Parameters<typeof deriveRequestStatus>[1] = 'AWAITING_CLIENT';
    for (const [i, next] of steps) {
      if (!signerMayAct(order, action, signers[i], signers)) throw new Error(`signer ${i + 1} acted out of turn`);
      signers[i].status = next; status = deriveRequestStatus(action, status, signers);
    }
    return status;
  };
  it('1. one signer: view → consent → approve → sign → completed', () => {
    expect(run('APPROVAL_AND_SIGNATURE', 'PARALLEL', [{ sequence: 1, status: 'PENDING' }], [[0, 'VIEWED'], [0, 'CONSENTED'], [0, 'APPROVED'], [0, 'SIGNED']])).toBe('COMPLETED');
  });
  it('2. two signers (husband and wife), sequential: partially signed then completed; wife cannot sign first', () => {
    const s: S[] = [{ sequence: 1, status: 'PENDING' }, { sequence: 2, status: 'PENDING' }];
    expect(() => run('SIGNATURE', 'SEQUENTIAL', s, [[1, 'SIGNED']])).toThrow(/out of turn/);
    const s2: S[] = [{ sequence: 1, status: 'PENDING' }, { sequence: 2, status: 'PENDING' }];
    let st = run('SIGNATURE', 'SEQUENTIAL', s2, [[0, 'VIEWED'], [0, 'CONSENTED'], [0, 'SIGNED']]); expect(st).toBe('PARTIALLY_SIGNED');
    st = run('SIGNATURE', 'SEQUENTIAL', s2, [[1, 'VIEWED'], [1, 'CONSENTED'], [1, 'SIGNED']]); expect(st).toBe('COMPLETED');
  });
  it('3. approval only completes at APPROVED', () => {
    expect(run('APPROVAL', 'PARALLEL', [{ sequence: 1, status: 'PENDING' }], [[0, 'VIEWED'], [0, 'CONSENTED'], [0, 'APPROVED']])).toBe('COMPLETED');
  });
  it('4. approval + signature is NOT complete at APPROVED', () => {
    expect(run('APPROVAL_AND_SIGNATURE', 'PARALLEL', [{ sequence: 1, status: 'PENDING' }], [[0, 'VIEWED'], [0, 'CONSENTED'], [0, 'APPROVED']])).toBe('VIEWED');
  });
  it('5. client declines → DECLINED, and a later signature cannot revive it', () => {
    const s: S[] = [{ sequence: 1, status: 'PENDING' }, { sequence: 2, status: 'PENDING' }];
    const st = run('SIGNATURE', 'PARALLEL', s, [[0, 'DECLINED']]); expect(st).toBe('DECLINED');
    expect(deriveRequestStatus('SIGNATURE', 'DECLINED', [{ status: 'DECLINED' }, { status: 'SIGNED' }])).toBe('DECLINED');
  });
  it('6/7. staff void / superseded are terminal and cannot be voided again', () => {
    expect(canVoid('VOIDED')).toBe(false); expect(canVoid('SUPERSEDED')).toBe(false); expect(canClientOpen('SUPERSEDED')).toBe(false);
  });
  it('8. expired request is closed to the client', () => {
    expect(hasExpired(new Date(0))).toBe(true); expect(canClientOpen('EXPIRED')).toBe(false);
  });
  it('11. a changed original is detected by the frozen hash', () => {
    const frozen = sha256Hex(Buffer.from('original bytes v1'));
    expect(sha256Hex(Buffer.from('original bytes v1'))).toBe(frozen);
    expect(sha256Hex(Buffer.from('original bytes v1 edited'))).not.toBe(frozen);
  });
});

describe('evidence certificate integrity hash', () => {
  it('is independent of key order and whitespace (survives jsonb storage)', async () => {
    const { buildEvidenceCertificate: build, certificateSha256 } = await import('@/lib/portal/esign');
    const cert = build({ requestId: 'r', clientRef: 'CL-1', clientName: 'TEST', title: 't', action: 'SIGNATURE', docKind: 'GENERAL', signingOrder: 'PARALLEL', createdAt: 'a', sentAt: null, completedAt: 'c', documents: [], signers: [], events: [], eventChainValid: true, sealedPdf: { sha256: 'x', sizeBytes: 1 }, generatedAt: 'g' });
    const reordered = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(cert).reverse()))) as typeof cert;
    expect(certificateSha256(reordered)).toBe(certificateSha256(cert));
    expect(certificateSha256({ ...cert, title: 'tampered' })).not.toBe(certificateSha256(cert));
  });
});

describe('retention model', () => {
  it('assigns a class per document type, computes retain_until, and a legal hold always blocks purge', async () => {
    const { retentionClassFor, retainUntilFor, mayPurge, RETENTION_POLICY } = await import('@/lib/portal/esign-retention');
    expect(retentionClassFor('IRS_8879')).toBe('IRS_EFILE_AUTH_7Y');
    expect(retentionClassFor('ENGAGEMENT_LETTER')).toBe('ENGAGEMENT_10Y');
    expect(retentionClassFor('TAX_RETURN')).toBe('STANDARD_7Y');
    const done = new Date('2026-09-28T12:00:00Z');
    expect(retainUntilFor('TAX_RETURN', done).retainUntil.toISOString()).toBe('2033-09-28T12:00:00.000Z');
    expect(retainUntilFor('ENGAGEMENT_LETTER', done).retainUntil.toISOString()).toBe('2036-09-28T12:00:00.000Z');
    for (const c of Object.values(RETENTION_POLICY)) expect(c.years).toBeGreaterThanOrEqual(3); // never below the IRS floor
    const later = new Date('2040-01-01T00:00:00Z');
    expect(mayPurge({ retainUntil: retainUntilFor('TAX_RETURN', done).retainUntil, legalHoldAt: null, status: 'COMPLETED' }, later).ok).toBe(true);
    expect(mayPurge({ retainUntil: retainUntilFor('TAX_RETURN', done).retainUntil, legalHoldAt: new Date(), status: 'COMPLETED' }, later).ok).toBe(false);
    expect(mayPurge({ retainUntil: retainUntilFor('TAX_RETURN', done).retainUntil, legalHoldAt: null, status: 'COMPLETED' }, new Date('2030-01-01')).ok).toBe(false);
    expect(mayPurge({ retainUntil: null, legalHoldAt: null, status: 'COMPLETED' }, later).ok).toBe(false);
  });
});
