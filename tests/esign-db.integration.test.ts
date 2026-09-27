/**
 * Real-PostgreSQL integration test for the e-signature store (no mocks of the database).
 *
 * Runs only when ESIGN_TEST_DATABASE_URL points at a DISPOSABLE database that already has
 * migrations 0000–0002 applied. Google Drive is replaced by an in-memory store so the test
 * needs no credentials. Everything it creates is synthetic (TEST CLIENT — Jane Smith).
 *
 *   ESIGN_TEST_DATABASE_URL=postgres://... npx vitest run tests/esign-db.integration.test.ts
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const TEST_URL = process.env.ESIGN_TEST_DATABASE_URL;
if (TEST_URL) process.env.DATABASE_URL = TEST_URL;

// ── In-memory "Drive": fileId → bytes. Lets us corrupt bytes deliberately for the hash-mismatch test. ──
const fakeDrive = new Map<string, Buffer>();
vi.mock('@/lib/portal/drive', () => ({
  openDriveFileStream: async (fileId: string) => {
    const bytes = fakeDrive.get(fileId); if (!bytes) throw new Error('fake drive: no such file ' + fileId);
    return { body: new Blob([bytes]).stream() as ReadableStream<Uint8Array>, size: bytes.length };
  },
  uploadToProcessedFolder: async (_clientId: string, name: string, _mime: string, bytes: Buffer) => {
    const id = `fake-${name}-${fakeDrive.size + 1}`; fakeDrive.set(id, Buffer.from(bytes)); return id;
  },
}));

const run = TEST_URL ? describe : describe.skip;

run('e-sign store against real PostgreSQL', () => {
  // Imported lazily so the mock and DATABASE_URL are in place first.
  let db: typeof import('@/lib/portal/db').db; let tables: typeof import('@/lib/portal/db').tables;
  let store: typeof import('@/lib/portal/esign-store'); let rules: typeof import('@/lib/portal/esign');
  let orm: typeof import('drizzle-orm');
  let staffId: string; let janeUserId: string; let janeClientId: string; let bobUserId: string; let bobClientId: string;

  async function makePdf(text: string): Promise<Buffer> {
    const doc = await PDFDocument.create(); const page = doc.addPage([595, 842]);
    const font = await doc.embedFont(StandardFonts.Helvetica); page.drawText(text, { x: 60, y: 760, size: 16, font });
    return Buffer.from(await doc.save());
  }
  async function makeDelivery(clientId: string, title: string, text: string, version = 1) {
    const bytes = await makePdf(text); const fileId = `fake-original-${title}-${version}-${Date.now()}`; fakeDrive.set(fileId, bytes);
    const [d] = await db.insert(tables.deliveries).values({ clientId, title, driveFileId: fileId, originalName: `${title}.pdf`, storedName: `${title}.pdf`, mimeType: 'application/pdf', sizeBytes: bytes.length, version, uploadedById: staffId }).returning();
    return d;
  }
  async function makeRequest(clientId: string, userId: string, action: 'APPROVAL' | 'SIGNATURE' | 'APPROVAL_AND_SIGNATURE', title: string, opts: { expiresAt?: Date; deliveryId?: string } = {}) {
    const d = opts.deliveryId ? (await db.select().from(tables.deliveries).where(orm.eq(tables.deliveries.id, opts.deliveryId)))[0] : await makeDelivery(clientId, title, `${title} — TEST ONLY`);
    const req = await store.createRequest({
      clientId, title, action, docKind: 'TAX_RETURN', signingOrder: 'PARALLEL', message: null, dueAt: null, expiresAt: opts.expiresAt ?? new Date(Date.now() + 30 * 86_400_000),
      consentVersion: rules.ESIGN_CONSENT_VERSION, createdById: staffId,
      documents: [{ deliveryId: d.id, requiresSignature: action !== 'APPROVAL' }],
      signers: [{ userId, fullName: 'Jane Smith', email: 'jane.smith.test@example.com', role: 'SIGNER', sequence: 1, identityVerificationId: null }],
      fields: action === 'APPROVAL' ? [] : [{ deliveryId: d.id, signerUserId: userId, type: 'SIGNATURE', page: 0, xPct: 6000, yPct: 9000, wPct: 3000, hPct: 600, label: null, required: true }],
      ip: '203.0.113.10', userAgent: 'integration-test',
    });
    return { req, delivery: d };
  }
  async function signer(reqId: string, userId: string) { return (await store.getSignerForUser(reqId, userId))!; }
  async function walkToSigned(reqId: string, userId: string, action: 'APPROVAL' | 'SIGNATURE' | 'APPROVAL_AND_SIGNATURE') {
    let s = await signer(reqId, userId);
    await store.setSignerStatus(s, 'VIEWED', { viewedAt: new Date() }); s = await signer(reqId, userId);
    await db.insert(tables.esignConsents).values({ userId, version: rules.ESIGN_CONSENT_VERSION, textSha256: rules.consentTextSha256(), requestId: reqId, ip: '203.0.113.10' });
    await store.setSignerStatus(s, 'CONSENTED', { consentedAt: new Date(), consentVersion: rules.ESIGN_CONSENT_VERSION }); s = await signer(reqId, userId);
    await db.update(tables.signatureSigners).set({ otpVerifiedAt: new Date(), authMethod: 'PASSWORD_SESSION+EMAIL_OTP' }).where(orm.eq(tables.signatureSigners.id, s.id)); s = await signer(reqId, userId);
    let status: string;
    if (action !== 'SIGNATURE') { status = await store.setSignerStatus(s, 'APPROVED', { approvedAt: new Date(), ip: '203.0.113.10' }); s = await signer(reqId, userId); }
    if (action !== 'APPROVAL') status = await store.setSignerStatus(s, 'SIGNED', { signedAt: new Date(), signatureMethod: 'TYPED', signatureText: 'Jane Smith', ip: '203.0.113.10', userAgent: 'integration-test', authMethod: 'PASSWORD_SESSION+EMAIL_OTP' });
    return status!;
  }

  beforeAll(async () => {
    ({ db, tables } = await import('@/lib/portal/db')); store = await import('@/lib/portal/esign-store'); rules = await import('@/lib/portal/esign'); orm = await import('drizzle-orm');
    const stamp = Date.now();
    const [staff] = await db.insert(tables.users).values({ email: `staff.${stamp}@example.com`, role: 'STAFF', status: 'ACTIVE', firstName: 'Test', lastName: 'Staff' }).returning(); staffId = staff.id;
    const [jane] = await db.insert(tables.users).values({ email: `jane.${stamp}@example.com`, role: 'CLIENT', status: 'ACTIVE', firstName: 'Jane', lastName: 'Smith' }).returning(); janeUserId = jane.id;
    const [jc] = await db.insert(tables.clients).values({ clientRef: `TEST-${stamp}-A`, displayName: 'TEST CLIENT — Jane Smith', userId: jane.id }).returning(); janeClientId = jc.id;
    const [bob] = await db.insert(tables.users).values({ email: `bob.${stamp}@example.com`, role: 'CLIENT', status: 'ACTIVE', firstName: 'Bob', lastName: 'Other' }).returning(); bobUserId = bob.id;
    const [bc] = await db.insert(tables.clients).values({ clientRef: `TEST-${stamp}-B`, displayName: 'TEST CLIENT — Client B', userId: bob.id }).returning(); bobClientId = bc.id;
  });

  it('freezes the document, walks the full approval+signature lifecycle and seals with a verifiable evidence chain', async () => {
    const { req, delivery } = await makeRequest(janeClientId, janeUserId, 'APPROVAL_AND_SIGNATURE', '2025 US Tax Return Approval — TEST ONLY');
    expect(req.status).toBe('AWAITING_CLIENT');
    const bundle = (await store.loadBundle(req.id))!;
    expect(bundle.docs[0].frozenSha256).toBe(rules.sha256Hex(fakeDrive.get(delivery.driveFileId)!));

    const status = await walkToSigned(req.id, janeUserId, 'APPROVAL_AND_SIGNATURE');
    expect(status).toBe('COMPLETED');
    const { sealedSha256, evidenceSha256 } = await store.completeRequest(req.id);
    expect(sealedSha256).toHaveLength(64); expect(evidenceSha256).toHaveLength(64);

    const done = (await store.getRequestById(req.id))!;
    expect(done.status).toBe('COMPLETED'); expect(done.sealedDriveFileId).toBeTruthy(); expect(done.evidenceDriveFileId).toBeTruthy();
    expect(done.retentionClass).toBe('STANDARD_7Y'); expect(done.retainUntil!.getUTCFullYear()).toBe(done.completedAt!.getUTCFullYear() + 7); expect(done.legalHoldAt).toBeNull();
    // Original untouched; sealed file is a separate object whose hash matches the record.
    expect(rules.sha256Hex(fakeDrive.get(delivery.driveFileId)!)).toBe(bundle.docs[0].frozenSha256);
    expect(done.sealedDriveFileId).not.toBe(delivery.driveFileId);
    expect(rules.sha256Hex(fakeDrive.get(done.sealedDriveFileId!)!)).toBe(sealedSha256);
    // Evidence: stored JSON hash matches, chain verifies, certificate references consent version + text hash.
    const ev = (await store.getEvidence(req.id))!;
    const cert = ev.certificateJson as import('@/lib/portal/esign').EvidenceCertificate;
    expect(rules.certificateSha256(cert)).toBe(ev.certificateSha256);
    expect(cert.eventChainValid).toBe(true);
    expect(cert.signers[0].consentVersion).toBe(rules.ESIGN_CONSENT_VERSION);
    expect(cert.signers[0].consentTextSha256).toBe(rules.consentTextSha256());
    expect(cert.sealedPdf?.sha256).toBe(sealedSha256);
    const events = await store.listEvents(req.id);
    expect(rules.verifyChain(events.map(e => ({ requestId: e.requestId, signerId: e.signerId, actorUserId: e.actorUserId, type: e.type, at: e.at.toISOString(), ip: e.ip, userAgent: e.userAgent, meta: (e.meta as Record<string, unknown> | null) ?? null, prevHash: e.prevHash, hash: e.hash })))).toEqual({ ok: true });
    expect(events.map(e => e.type)).toEqual(expect.arrayContaining(['document_version_frozen', 'signed_pdf_created', 'evidence_certificate_created', 'all_signers_completed']));
    // Idempotent: a second completion returns the same hashes and writes nothing new.
    const again = await store.completeRequest(req.id);
    expect(again).toEqual({ sealedSha256, evidenceSha256 });
    expect((await db.select().from(tables.signatureEvidence).where(orm.eq(tables.signatureEvidence.requestId, req.id))).length).toBe(1);
  });

  it('approval-only: completes on approval, evidence says APPROVAL, no signature image', async () => {
    const { req } = await makeRequest(janeClientId, janeUserId, 'APPROVAL', 'Advisory memo — TEST ONLY');
    const status = await walkToSigned(req.id, janeUserId, 'APPROVAL');
    expect(status).toBe('COMPLETED');
    await store.completeRequest(req.id);
    const cert = (await store.getEvidence(req.id))!.certificateJson as import('@/lib/portal/esign').EvidenceCertificate;
    expect(cert.action).toBe('APPROVAL');
    expect(cert.signers[0].approvedAt).toBeTruthy(); expect(cert.signers[0].signedAt).toBeNull(); expect(cert.signers[0].signatureImageSha256).toBeNull();
    expect((await store.getRequestById(req.id))!.status).toBe('COMPLETED');
  });

  it('append-only: events, evidence and consents cannot be updated or deleted by the application role', async () => {
    const { req } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Append-only probe — TEST ONLY');
    const [e] = await store.listEvents(req.id);
    const blocked = async (p: Promise<unknown>) => { try { await p; return 'ALLOWED'; } catch (err) { const m = (err as { cause?: Error }).cause?.message ?? (err as Error).message; return /append-only/.test(m) ? 'BLOCKED' : `OTHER: ${m}`; } };
    expect(await blocked(db.update(tables.signatureEvents).set({ ip: '198.51.100.1' }).where(orm.eq(tables.signatureEvents.id, e.id)))).toBe('BLOCKED');
    expect(await blocked(db.delete(tables.signatureEvents).where(orm.eq(tables.signatureEvents.id, e.id)))).toBe('BLOCKED');
    expect(await blocked(db.execute(orm.sql`update signature_events set hash = 'x' where id = ${e.id}`))).toBe('BLOCKED');
    expect(await blocked(db.execute(orm.sql`delete from signature_events where request_id = ${req.id}`))).toBe('BLOCKED');
    const [c] = await db.insert(tables.esignConsents).values({ userId: janeUserId, version: 'probe', textSha256: 'x', requestId: req.id }).returning();
    expect(await blocked(db.delete(tables.esignConsents).where(orm.eq(tables.esignConsents.id, c.id)))).toBe('BLOCKED');
    // The application role cannot switch the guard off either (only the table owner can).
    expect(await blocked(db.execute(orm.sql`alter table signature_events disable trigger signature_events_append_only`))).toMatch(/OTHER: .*must be owner/);
    // Unchanged after all attempts:
    expect((await store.listEvents(req.id))[0].hash).toBe(e.hash);
  });

  it('hash mismatch: if the stored bytes differ from the frozen hash, sealing is refused, logged, and no evidence is written', async () => {
    const { req, delivery } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Tampered bytes — TEST ONLY');
    const status = await walkToSigned(req.id, janeUserId, 'SIGNATURE');
    expect(status).toBe('COMPLETED');
    fakeDrive.set(delivery.driveFileId, await makePdf('DIFFERENT BYTES')); // corrupt the stored original
    await expect(store.completeRequest(req.id)).rejects.toThrow(/sealing refused/);
    const events = await store.listEvents(req.id);
    expect(events.some(e => e.type === 'access_denied' && (e.meta as { reason?: string })?.reason === 'frozen_hash_mismatch_at_completion')).toBe(true);
    expect(await store.getEvidence(req.id)).toBeNull();
    const row = (await store.getRequestById(req.id))!;
    expect(row.sealedDriveFileId).toBeNull(); expect(row.evidenceSha256).toBeNull(); expect(row.completedAt).toBeNull(); // claim released for a later retry
  });

  it('double-sign race: two concurrent transitions from the same state — exactly one wins', async () => {
    const { req } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Two tabs — TEST ONLY');
    const s = await signer(req.id, janeUserId);
    const results = await Promise.allSettled([
      store.setSignerStatus(s, 'VIEWED', { viewedAt: new Date() }),
      store.setSignerStatus(s, 'VIEWED', { viewedAt: new Date() }),
    ]);
    expect(results.filter(r => r.status === 'fulfilled').length).toBe(1);
    expect(results.filter(r => r.status === 'rejected' && r.reason instanceof store.StaleSignerStateError).length).toBe(1);
    // Concurrent event appends never fork the chain.
    await Promise.all(Array.from({ length: 8 }, (_, i) => store.recordEvent(req.id, 'document_viewed', { meta: { i } })));
    const events = await store.listEvents(req.id);
    expect(rules.verifyChain(events.map(e => ({ requestId: e.requestId, signerId: e.signerId, actorUserId: e.actorUserId, type: e.type, at: e.at.toISOString(), ip: e.ip, userAgent: e.userAgent, meta: (e.meta as Record<string, unknown> | null) ?? null, prevHash: e.prevHash, hash: e.hash })))).toEqual({ ok: true });
  });

  it('concurrent completion: only one sealed PDF and one certificate are ever produced', async () => {
    const { req } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Concurrent seal — TEST ONLY');
    await walkToSigned(req.id, janeUserId, 'SIGNATURE');
    const before = fakeDrive.size;
    const results = await Promise.allSettled([store.completeRequest(req.id), store.completeRequest(req.id), store.completeRequest(req.id)]);
    expect(results.filter(r => r.status === 'fulfilled').length).toBe(1);
    expect(results.filter(r => r.status === 'rejected' && r.reason instanceof store.SealInProgressError).length).toBe(2);
    expect(fakeDrive.size - before).toBe(2); // exactly one signed PDF + one evidence PDF
  });

  it('decline closes the request with reason; void by staff blocks signing; both keep the original', async () => {
    const { req: r1 } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Decline me — TEST ONLY');
    const s1 = await signer(r1.id, janeUserId);
    expect(await store.setSignerStatus(s1, 'DECLINED', { declinedAt: new Date(), declineReason: 'Figures look wrong' })).toBe('DECLINED');
    const d = (await store.getRequestById(r1.id))!; expect(d.status).toBe('DECLINED'); expect(d.closedReason).toBe('declined'); expect(d.sealedDriveFileId).toBeNull();
    expect(rules.canClientOpen(d.status)).toBe(false);

    const { req: r2, delivery } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Void me — TEST ONLY');
    expect(rules.canVoid(r2.status)).toBe(true);
    await store.voidRequest(r2, staffId, 'Sent in error', 'request_voided', '203.0.113.5', 'staff-ua');
    const v = (await store.getRequestById(r2.id))!; expect(v.status).toBe('VOIDED');
    expect(rules.canVoid(v.status)).toBe(false); expect(rules.canClientOpen(v.status)).toBe(false);
    expect(fakeDrive.has(delivery.driveFileId)).toBe(true);
    expect((await store.listEvents(r2.id)).at(-1)!.type).toBe('request_voided');
    // Even if someone bypasses the HTTP guard, the derived status never reopens a terminal request.
    expect(rules.deriveRequestStatus('SIGNATURE', 'VOIDED', [{ status: 'SIGNED' }])).toBe('VOIDED');
  });

  it('supersede: replacing the delivery closes the open request tied to v1 and records the event', async () => {
    const { req, delivery } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Version one — TEST ONLY');
    const v2 = await makeDelivery(janeClientId, 'Version one — TEST ONLY', 'v2 bytes', 2);
    const closed = await store.supersedeRequestsForDelivery(delivery.id, staffId, 'Document replaced by a new version', v2.id);
    expect(closed).toEqual([req.id]);
    const r = (await store.getRequestById(req.id))!; expect(r.status).toBe('SUPERSEDED'); expect(r.supersededById).toBe(v2.id);
    expect(rules.canClientOpen(r.status)).toBe(false);
    expect((await store.listEvents(req.id)).at(-1)!.type).toBe('request_superseded');
    // Running supersede again is a no-op (already terminal).
    expect(await store.supersedeRequestsForDelivery(delivery.id, staffId, 'again', null)).toEqual([]);
  });

  it('expiry: an overdue request is expired exactly once, and the client cannot open it', async () => {
    const { req } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Expired — TEST ONLY', { expiresAt: new Date(Date.now() - 60_000) });
    expect(await store.expireIfDue(req)).toBe('EXPIRED');
    const r = (await store.getRequestById(req.id))!; expect(r.status).toBe('EXPIRED'); expect(r.closedReason).toBe('expired');
    expect(await store.expireIfDue(r)).toBe('EXPIRED'); // second run: no change
    expect((await store.listEvents(req.id)).filter(e => e.type === 'request_expired').length).toBe(1);
    expect(rules.canClientOpen(r.status)).toBe(false);
  });

  it('cross-client isolation: Client B can never load Client A\'s request or signer row', async () => {
    const { req } = await makeRequest(janeClientId, janeUserId, 'SIGNATURE', 'Isolation — TEST ONLY');
    expect(await store.getRequestForClient(bobClientId, req.id)).toBeNull();
    expect(await store.getSignerForUser(req.id, bobUserId)).toBeNull();
    expect(await store.getRequestForClient(janeClientId, req.id)).not.toBeNull();
    // A document that belongs to another client cannot be frozen into this client's request.
    const foreign = await makeDelivery(bobClientId, 'Bobs doc — TEST ONLY', 'bob');
    await expect(store.createRequest({
      clientId: janeClientId, title: 'Cross-client — TEST ONLY', action: 'SIGNATURE', docKind: 'GENERAL', signingOrder: 'PARALLEL', message: null, dueAt: null, expiresAt: new Date(Date.now() + 86_400_000),
      consentVersion: rules.ESIGN_CONSENT_VERSION, createdById: staffId, documents: [{ deliveryId: foreign.id, requiresSignature: true }],
      signers: [{ userId: janeUserId, fullName: 'Jane Smith', email: 'j@example.com', role: 'SIGNER', sequence: 1, identityVerificationId: null }], fields: [], ip: null, userAgent: null,
    })).rejects.toThrow(/does not belong/);
  });

  it('years-later retrieval: the completed record is fully reconstructable from storage alone', async () => {
    const { req } = await makeRequest(janeClientId, janeUserId, 'APPROVAL_AND_SIGNATURE', 'Archive proof — TEST ONLY');
    await walkToSigned(req.id, janeUserId, 'APPROVAL_AND_SIGNATURE');
    const { sealedSha256, evidenceSha256 } = await store.completeRequest(req.id);
    // Fresh reads, no session, no OTP, no in-memory state:
    const row = (await db.select().from(tables.signatureRequests).where(orm.eq(tables.signatureRequests.id, req.id)))[0];
    const docs = await db.select().from(tables.signatureRequestDocuments).where(orm.eq(tables.signatureRequestDocuments.requestId, req.id));
    const delivery = (await db.select().from(tables.deliveries).where(orm.eq(tables.deliveries.id, docs[0].deliveryId)))[0];
    const evidence = (await db.select().from(tables.signatureEvidence).where(orm.eq(tables.signatureEvidence.requestId, req.id)))[0];
    const consents = await db.select().from(tables.esignConsents).where(orm.eq(tables.esignConsents.requestId, req.id));
    const events = await db.select().from(tables.signatureEvents).where(orm.eq(tables.signatureEvents.requestId, req.id)).orderBy(orm.asc(tables.signatureEvents.seq));
    expect(rules.sha256Hex(fakeDrive.get(delivery.driveFileId)!)).toBe(docs[0].frozenSha256);            // original intact
    expect(rules.sha256Hex(fakeDrive.get(row.sealedDriveFileId!)!)).toBe(row.sealedSha256!);            // signed PDF intact
    expect(row.sealedSha256).toBe(sealedSha256); expect(row.evidenceSha256).toBe(evidenceSha256);
    expect(rules.certificateSha256(evidence.certificateJson as import('@/lib/portal/esign').EvidenceCertificate)).toBe(evidence.certificateSha256); // certificate intact
    expect(consents.length).toBe(1); expect(consents[0].textSha256).toBe(rules.consentTextSha256());
    expect(rules.verifyChain(events.map(e => ({ requestId: e.requestId, signerId: e.signerId, actorUserId: e.actorUserId, type: e.type, at: e.at.toISOString(), ip: e.ip, userAgent: e.userAgent, meta: (e.meta as Record<string, unknown> | null) ?? null, prevHash: e.prevHash, hash: e.hash })))).toEqual({ ok: true });
  });
});
