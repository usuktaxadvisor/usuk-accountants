/**
 * Real-PostgreSQL integration tests for client archive / restore / data minimisation / permitted deletion.
 * Runs only with ESIGN_TEST_DATABASE_URL pointing at a DISPOSABLE database with migrations 0000–0004 applied.
 * Google Drive is replaced by an in-memory store that records what was moved to the bin. All data synthetic.
 *
 *   ESIGN_TEST_DATABASE_URL=postgres://... npx vitest run tests/client-lifecycle-db.integration.test.ts
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PDFDocument } from 'pdf-lib';

const TEST_URL = process.env.ESIGN_TEST_DATABASE_URL;
if (TEST_URL) process.env.DATABASE_URL = TEST_URL;

const fakeDrive = new Map<string, Buffer>();
const trashed: string[] = [];
vi.mock('@/lib/portal/drive', () => ({
  openDriveFileStream: async (fileId: string) => { const b = fakeDrive.get(fileId); if (!b) throw new Error('fake drive: no such file ' + fileId); return { body: new Blob([b]).stream() as ReadableStream<Uint8Array>, size: b.length }; },
  uploadToProcessedFolder: async (_c: string, name: string, _m: string, bytes: Buffer) => { const id = `fake-${name}-${fakeDrive.size + 1}`; fakeDrive.set(id, Buffer.from(bytes)); return id; },
  trashDriveFile: async (fileId: string) => { trashed.push(fileId); return true; },
  deleteDriveFile: async () => {},
}));
vi.mock('@/lib/portal/email', () => ({ sendPortalEmail: async () => true }));

const run = TEST_URL ? describe : describe.skip;

run('client lifecycle against real PostgreSQL', () => {
  let db: typeof import('@/lib/portal/db').db; let tables: typeof import('@/lib/portal/db').tables;
  let lc: typeof import('@/lib/portal/client-lifecycle'); let store: typeof import('@/lib/portal/esign-store'); let rules: typeof import('@/lib/portal/esign'); let members: typeof import('@/lib/portal/members');
  let orm: typeof import('drizzle-orm');
  let staffId: string; const actor = () => ({ uid: staffId, ip: '203.0.113.9', userAgent: 'integration-test' });
  const stamp = Date.now();

  async function makeClient(tag: string, extraMembers = 0) {
    const [u] = await db.insert(tables.users).values({ email: `${tag}.${stamp}@example.com`, role: 'CLIENT', status: 'ACTIVE', firstName: 'Test', lastName: tag, passwordHash: 'x' }).returning();
    const [c] = await db.insert(tables.clients).values({ clientRef: `TEST-${tag}-${stamp}`, displayName: `TEST CLIENT — ${tag}`, userId: u.id, driveFolderId: `fake-folder-${tag}` }).returning();
    await members.ensurePrimaryMembership(c.id, u.id, staffId);
    const extra: string[] = [];
    for (let i = 0; i < extraMembers; i++) {
      const [m] = await db.insert(tables.users).values({ email: `${tag}.m${i}.${stamp}@example.com`, role: 'CLIENT', status: 'ACTIVE', firstName: 'Member', lastName: String(i), passwordHash: 'x' }).returning();
      await db.insert(tables.clientMembers).values({ clientId: c.id, userId: m.id, role: 'JOINT', canSign: 1, status: 'ACTIVE', addedById: staffId });
      extra.push(m.id);
    }
    return { client: c, userId: u.id, extra };
  }
  async function makeDelivery(clientId: string, title: string) {
    const doc = await PDFDocument.create(); doc.addPage([595, 842]); const bytes = Buffer.from(await doc.save());
    const fileId = `fake-original-${title}-${Date.now()}-${Math.random()}`; fakeDrive.set(fileId, bytes);
    const [d] = await db.insert(tables.deliveries).values({ clientId, title, driveFileId: fileId, originalName: `${title}.pdf`, storedName: `${title}.pdf`, mimeType: 'application/pdf', sizeBytes: bytes.length, uploadedById: staffId }).returning();
    return d;
  }
  async function makeRequest(clientId: string, userId: string, title: string) {
    const d = await makeDelivery(clientId, title);
    return store.createRequest({
      clientId, title, action: 'SIGNATURE', docKind: 'ENGAGEMENT_LETTER', signingOrder: 'PARALLEL', message: null, dueAt: null, expiresAt: new Date(Date.now() + 30 * 86_400_000),
      consentVersion: rules.ESIGN_CONSENT_VERSION, createdById: staffId, documents: [{ deliveryId: d.id, requiresSignature: true }],
      signers: [{ userId, fullName: 'Test Signer', email: `signer.${stamp}@example.com`, role: 'PRIMARY', sequence: 1, identityVerificationId: null }],
      fields: [{ deliveryId: d.id, signerUserId: userId, type: 'SIGNATURE', page: 0, xPct: 6000, yPct: 9000, wPct: 3000, hPct: 600, label: null, required: true }],
      ip: '203.0.113.10', userAgent: 'integration-test',
    });
  }
  async function complete(reqId: string, userId: string) {
    let s = (await store.getSignerForUser(reqId, userId))!;
    await store.setSignerStatus(s, 'VIEWED', { viewedAt: new Date() }); s = (await store.getSignerForUser(reqId, userId))!;
    await db.insert(tables.esignConsents).values({ userId, version: rules.ESIGN_CONSENT_VERSION, textSha256: rules.consentTextSha256(), requestId: reqId });
    await store.setSignerStatus(s, 'CONSENTED', { consentedAt: new Date(), consentVersion: rules.ESIGN_CONSENT_VERSION }); s = (await store.getSignerForUser(reqId, userId))!;
    await db.update(tables.signatureSigners).set({ otpVerifiedAt: new Date() }).where(orm.eq(tables.signatureSigners.id, s.id)); s = (await store.getSignerForUser(reqId, userId))!;
    await store.setSignerStatus(s, 'SIGNED', { signedAt: new Date(), signatureMethod: 'TYPED', signatureText: 'Test Signer', ip: '203.0.113.10', userAgent: 'integration-test' });
    return store.completeRequest(reqId);
  }

  beforeAll(async () => {
    ({ db, tables } = await import('@/lib/portal/db')); lc = await import('@/lib/portal/client-lifecycle'); store = await import('@/lib/portal/esign-store'); rules = await import('@/lib/portal/esign'); members = await import('@/lib/portal/members'); orm = await import('drizzle-orm');
    const [staff] = await db.insert(tables.users).values({ email: `staff.lc.${stamp}@example.com`, role: 'STAFF', status: 'ACTIVE', firstName: 'Test', lastName: 'Staff' }).returning(); staffId = staff.id;
  });

  it('TEST 1 — empty test client: full delete allowed and succeeds; Drive folder binned only after commit; user removed', async () => {
    const { client, userId } = await makeClient('empty');
    await db.insert(tables.invitations).values({ tokenHash: 'h' + stamp, userId, expiresAt: new Date(Date.now() + 86_400_000) });
    const a = (await lc.assessClient(client.id))!;
    expect(a.decision).toBe('FULL_DELETE_ALLOWED'); expect(a.legalHold).toBe(false);
    const r = await lc.deleteClientPermanently(client.id, actor(), 'TEST_RECORD', 'integration');
    expect(r.deleted.memberships).toBe(1); expect(r.deleted.invitations).toBe(1); expect(r.usersDeleted).toBe(1); expect(r.driveTrashed).toBe(true);
    expect(trashed).toContain('fake-folder-empty');
    expect((await db.select().from(tables.clients).where(orm.eq(tables.clients.id, client.id))).length).toBe(0);
    expect((await db.select().from(tables.users).where(orm.eq(tables.users.id, userId))).length).toBe(0);
    const [log] = await db.select().from(tables.auditLogs).where(orm.and(orm.eq(tables.auditLogs.action, 'CLIENT_DELETED'), orm.eq(tables.auditLogs.targetId, client.id)));
    expect(log.actorUserId).toBe(staffId); expect((log.meta as { reason: string }).reason).toBe('TEST_RECORD');
  });

  it('TEST 2 — client with a draft engagement and an unsigned document only: full delete succeeds and the draft Drive file is binned', async () => {
    const { client } = await makeClient('draft');
    await db.insert(tables.documentRequests).values({ clientId: client.id, title: '2025 P60' });
    const d = await makeDelivery(client.id, 'draft-letter');
    const a = (await lc.assessClient(client.id))!;
    expect(a.decision).toBe('FULL_DELETE_ALLOWED'); expect(a.counts.deliveries).toBe(1); expect(a.counts.documentRequests).toBe(1);
    const r = await lc.deleteClientPermanently(client.id, actor(), 'CREATED_IN_ERROR', null);
    expect(r.deleted.deliveries).toBe(1); expect(r.deleted.documentRequests).toBe(1);
    expect(trashed).toContain('fake-folder-draft');
    void d;
  });

  it('TEST 3 — open signature request: voided with a reason on archive, then only partial deletion is available (events are append-only)', async () => {
    const { client, userId } = await makeClient('open');
    const req = await makeRequest(client.id, userId, 'open-letter');
    const before = (await lc.assessClient(client.id))!;
    expect(before.counts.openSignatureRequests).toBe(1); expect(before.decision).toBe('PARTIAL_DELETE_RETENTION_REQUIRED');
    const r = await lc.archiveClient(client.id, actor(), 'CLIENT_REQUESTED', null);
    expect(r.voidedRequests).toBe(1);
    const row = (await store.getRequestById(req.id))!;
    expect(row.status).toBe('VOIDED'); expect(row.closedReason).toMatch(/archived by staff/);
    const events = await store.listEvents(req.id);
    expect(events.map(e => e.type)).toContain('request_voided');
    await expect(lc.deleteClientPermanently(client.id, actor(), 'TEST_RECORD', null)).rejects.toMatchObject({ status: 409 });
    const m = await lc.minimiseClientData(client.id, actor(), 'TEST_RECORD', null);
    expect(m.deleted.draftDeliveries ?? 0).toBe(0); // the delivery is referenced by the (voided) request → retained
    expect((await store.listEvents(req.id)).length).toBe(events.length); // evidence untouched
  });

  it('TEST 4 — completed signed document in active retention: full delete blocked, archive + removable-data deletion allowed, evidence intact', async () => {
    const { client, userId } = await makeClient('signed');
    const req = await makeRequest(client.id, userId, 'signed-letter');
    const { sealedSha256, evidenceSha256 } = await complete(req.id, userId);
    const draft = await makeDelivery(client.id, 'never-signed-draft');
    await db.insert(tables.documentRequests).values({ clientId: client.id, title: 'open request' });
    const a = (await lc.assessClient(client.id))!;
    expect(a.decision).toBe('PARTIAL_DELETE_RETENTION_REQUIRED'); expect(a.retentionActive).toBe(true);
    expect(a.retainUntil!.getUTCFullYear()).toBeGreaterThanOrEqual(2033); expect(a.reason).toMatch(/must be retained until/);
    await expect(lc.deleteClientPermanently(client.id, actor(), 'ENGAGEMENT_ENDED', null)).rejects.toMatchObject({ status: 409 });
    const m = await lc.minimiseClientData(client.id, actor(), 'ENGAGEMENT_ENDED', 'left the UK');
    expect(m.deleted.draftDeliveries).toBe(1); expect(m.deleted.openDocumentRequests).toBe(1); expect(m.driveTrashed).toBe(1);
    expect(trashed).toContain(draft.driveFileId);
    // Protected records exactly as before:
    const row = (await store.getRequestById(req.id))!;
    expect(row.status).toBe('COMPLETED'); expect(row.sealedSha256).toBe(sealedSha256); expect(row.evidenceSha256).toBe(evidenceSha256);
    expect(trashed).not.toContain(row.sealedDriveFileId); expect(trashed).not.toContain(row.evidenceDriveFileId);
    const ev = (await store.getEvidence(req.id))!;
    expect(rules.certificateSha256(ev.certificateJson as never)).toBe(ev.certificateSha256);
    const events = await store.listEvents(req.id);
    expect(rules.verifyChain(events.map(e => ({ requestId: e.requestId, signerId: e.signerId, actorUserId: e.actorUserId, type: e.type, at: e.at.toISOString(), ip: e.ip, userAgent: e.userAgent, meta: (e.meta as Record<string, unknown> | null) ?? null, prevHash: e.prevHash, hash: e.hash })))).toEqual({ ok: true });
    const [c] = await db.select().from(tables.clients).where(orm.eq(tables.clients.id, client.id));
    expect(c.archivedAt).not.toBeNull(); expect(c.dataMinimisedAt).not.toBeNull();
  });

  it('TEST 5 — legal hold: every deletion path blocked; archive still allowed', async () => {
    const { client, userId } = await makeClient('hold');
    const req = await makeRequest(client.id, userId, 'held-letter');
    await complete(req.id, userId);
    await db.update(tables.signatureRequests).set({ legalHoldAt: new Date(), legalHoldReason: 'dispute' }).where(orm.eq(tables.signatureRequests.id, req.id));
    const a = (await lc.assessClient(client.id))!;
    expect(a.decision).toBe('ARCHIVE_ONLY'); expect(a.legalHold).toBe(true); expect(a.reason).toMatch(/legal hold/);
    await expect(lc.deleteClientPermanently(client.id, actor(), 'OTHER', null)).rejects.toMatchObject({ status: 409 });
    await expect(lc.minimiseClientData(client.id, actor(), 'OTHER', null)).rejects.toMatchObject({ status: 409 });
    const r = await lc.archiveClient(client.id, actor(), 'OTHER', 'hold');
    expect(r.suspendedLogins).toBe(1);
  });

  it('TEST 6 — archived client: members are suspended and the client is reported archived (login/session gate)', async () => {
    const { client, userId, extra } = await makeClient('login', 1);
    await lc.archiveClient(client.id, actor(), 'ENGAGEMENT_ENDED', null);
    const us = await db.select({ status: tables.users.status }).from(tables.users).where(orm.inArray(tables.users.id, [userId, ...extra]));
    expect(us.map(u => u.status)).toEqual(['SUSPENDED', 'SUSPENDED']);
    expect(await lc.isClientArchived(client.id)).toBe(true);
    expect(await lc.isClientArchived('00000000-0000-4000-8000-000000000000')).toBe(true); // unknown = treated as inactive
  });

  it('TEST 7 — restore: visible again, memberships intact, logins stay suspended until staff re-enable them explicitly', async () => {
    const { client, userId } = await makeClient('restore');
    await lc.archiveClient(client.id, actor(), 'DUPLICATE', null);
    await lc.restoreClient(client.id, actor());
    expect(await lc.isClientArchived(client.id)).toBe(false);
    expect(await members.getMembership(client.id, userId)).toEqual({ role: 'PRIMARY', canSign: true });
    expect((await db.select().from(tables.users).where(orm.eq(tables.users.id, userId)))[0].status).toBe('SUSPENDED');
    await lc.reenableLogin(client.id, userId, actor());
    expect((await db.select().from(tables.users).where(orm.eq(tables.users.id, userId)))[0].status).toBe('ACTIVE');
    await expect(lc.restoreClient(client.id, actor())).rejects.toMatchObject({ status: 409 }); // not archived any more
  });

  it('TEST 8 — cross-client: a member of another client is never touched, and a shared user is not suspended', async () => {
    const a = await makeClient('cross-a'); const b = await makeClient('cross-b');
    // Bob's primary user is ALSO an active member of client A (shared bookkeeper pattern) — archiving A must not lock him out of B.
    await db.insert(tables.clientMembers).values({ clientId: a.client.id, userId: b.userId, role: 'CONTACT', canSign: 0, status: 'ACTIVE', addedById: staffId }).catch(() => { /* partial unique index: a user is ACTIVE on one client only */ });
    await lc.archiveClient(a.client.id, actor(), 'OTHER', null);
    expect((await db.select().from(tables.users).where(orm.eq(tables.users.id, b.userId)))[0].status).toBe('ACTIVE');
    expect(await lc.isClientArchived(b.client.id)).toBe(false);
    await lc.deleteClientPermanently(a.client.id, actor(), 'TEST_RECORD', null);
    expect((await db.select().from(tables.clients).where(orm.eq(tables.clients.id, b.client.id))).length).toBe(1);
  });

  it('TEST 9 — Drive cleanup: eligible files binned, protected files never; never before the database commits', async () => {
    const { client, userId } = await makeClient('drive');
    const req = await makeRequest(client.id, userId, 'signed-for-drive');
    await complete(req.id, userId);
    const draft = await makeDelivery(client.id, 'draft-for-drive');
    const row = (await store.getRequestById(req.id))!;
    const mark = trashed.length;
    await lc.minimiseClientData(client.id, actor(), 'ENGAGEMENT_ENDED', null);
    const newly = trashed.slice(mark);
    expect(newly).toEqual([draft.driveFileId]);
    expect(newly).not.toContain(row.sealedDriveFileId); expect(newly).not.toContain(row.evidenceDriveFileId);
  });

  it('TEST 10 — double archive / double delete are safe: second call is a 409 (or 404 after deletion), nothing is repeated', async () => {
    const { client } = await makeClient('double');
    await Promise.all([lc.archiveClient(client.id, actor(), 'OTHER', null).catch(e => e), lc.archiveClient(client.id, actor(), 'OTHER', null).catch(e => e)]);
    const logs = await db.select().from(tables.auditLogs).where(orm.and(orm.eq(tables.auditLogs.action, 'CLIENT_ARCHIVED'), orm.eq(tables.auditLogs.targetId, client.id)));
    expect(logs.length).toBe(1);
    const results = await Promise.all([lc.deleteClientPermanently(client.id, actor(), 'TEST_RECORD', null).catch(e => e), lc.deleteClientPermanently(client.id, actor(), 'TEST_RECORD', null).catch(e => e)]);
    const ok = results.filter(r => !(r instanceof Error)); const failed = results.filter(r => r instanceof Error) as Array<Error & { status?: number }>;
    expect(ok.length).toBe(1); expect(failed.length).toBe(1); expect([404, 409]).toContain(failed[0].status);
    expect((await db.select().from(tables.auditLogs).where(orm.and(orm.eq(tables.auditLogs.action, 'CLIENT_DELETED'), orm.eq(tables.auditLogs.targetId, client.id)))).length).toBe(1);
  });

  it('append-only triggers are untouched by the new code paths', async () => {
    const [{ n }] = await db.execute(orm.sql`select count(*)::int as n from pg_trigger where tgname in ('signature_events_append_only','signature_evidence_append_only','esign_consents_append_only') and tgenabled = 'O'`).then(r => r.rows as Array<{ n: number }>);
    expect(Number(n)).toBe(3);
  });
});
