/**
 * Real-PostgreSQL tests for removing an empty document request (staff "Remove this request").
 * Runs only with ESIGN_TEST_DATABASE_URL pointing at a DISPOSABLE database with migrations 0000–0005 applied.
 * All data synthetic.
 *
 *   ESIGN_TEST_DATABASE_URL=postgres://... npx vitest run tests/request-remove-db.integration.test.ts
 */
import { describe, it, expect, beforeAll } from 'vitest';

const TEST_URL = process.env.ESIGN_TEST_DATABASE_URL;
if (TEST_URL) process.env.DATABASE_URL = TEST_URL;
const run = TEST_URL ? describe : describe.skip;

run('removing a document request against real PostgreSQL', () => {
  let db: typeof import('@/lib/portal/db').db; let tables: typeof import('@/lib/portal/db').tables;
  let rv: typeof import('@/lib/portal/request-view'); let orm: typeof import('drizzle-orm');
  let staffId: string; const stamp = Date.now();

  async function makeClient(tag: string) {
    const [u] = await db.insert(tables.users).values({ email: `${tag}.${stamp}@example.com`, role: 'CLIENT', status: 'ACTIVE', firstName: 'Test', lastName: tag, passwordHash: 'x' }).returning();
    const [c] = await db.insert(tables.clients).values({ clientRef: `TEST-RR-${tag}-${stamp}`, displayName: `TEST CLIENT — ${tag}`, userId: u.id }).returning();
    return { clientId: c.id, userId: u.id };
  }
  async function makeRequest(clientId: string, title: string, status: 'REQUESTED' | 'UNDER_REVIEW' = 'REQUESTED') {
    const [r] = await db.insert(tables.documentRequests).values({ clientId, title, description: 'synthetic', status, deadline: new Date('2026-12-04T12:00:00Z') }).returning();
    return r;
  }
  const exists = async (id: string) => (await db.select().from(tables.documentRequests).where(orm.eq(tables.documentRequests.id, id))).length === 1;
  const removals = async (id: string) => db.select().from(tables.auditLogs).where(orm.and(orm.eq(tables.auditLogs.action, 'REQUEST_REMOVED'), orm.eq(tables.auditLogs.targetId, id)));

  beforeAll(async () => {
    ({ db, tables } = await import('@/lib/portal/db')); rv = await import('@/lib/portal/request-view'); orm = await import('drizzle-orm');
    const [s] = await db.insert(tables.users).values({ email: `staff.rr.${stamp}@example.com`, role: 'STAFF', status: 'ACTIVE', firstName: 'Test', lastName: 'Staff' }).returning(); staffId = s.id;
  });

  it('removes an empty request and records its details in the audit log', async () => {
    const { clientId } = await makeClient('a');
    const r = await makeRequest(clientId, 'Duplicate LLC documents');
    expect(await rv.removeEmptyRequest(staffId, clientId, r.id, 'duplicate')).toBe('removed');
    expect(await exists(r.id)).toBe(false);
    const [log] = await removals(r.id);
    expect(log.actorUserId).toBe(staffId);
    expect(log.meta).toMatchObject({ clientId, title: 'Duplicate LLC documents', description: 'synthetic', deadline: '2026-12-04', reason: 'duplicate' });
  });

  it('refuses when anything has been uploaded to the request, and leaves no audit record', async () => {
    const { clientId, userId } = await makeClient('b');
    const r = await makeRequest(clientId, 'Has an upload');
    await db.insert(tables.documents).values({ clientId, requestId: r.id, driveFileId: 'fake', originalName: 'a.pdf', storedName: 'a.pdf', mimeType: 'application/pdf', sizeBytes: 10, uploadedById: userId });
    expect(await rv.removeEmptyRequest(staffId, clientId, r.id, '')).toBe('not-removable');
    expect(await exists(r.id)).toBe(true);
    expect(await removals(r.id)).toHaveLength(0);
  });

  it('refuses a request that is no longer waiting on the client, even with no uploads', async () => {
    const { clientId } = await makeClient('c');
    const r = await makeRequest(clientId, 'Under review', 'UNDER_REVIEW');
    expect(await rv.removeEmptyRequest(staffId, clientId, r.id, '')).toBe('not-removable');
    expect(await exists(r.id)).toBe(true);
  });

  it("never touches another client's request, and rejects ids that are not request ids", async () => {
    const a = await makeClient('d'); const b = await makeClient('e');
    const r = await makeRequest(b.clientId, 'Belongs to another client');
    expect(await rv.removeEmptyRequest(staffId, a.clientId, r.id, '')).toBe('not-found');
    expect(await exists(r.id)).toBe(true);
    expect(await rv.removeEmptyRequest(staffId, a.clientId, "x' or 1=1 --", '')).toBe('not-found');
  });

  it('removes only the one request asked for', async () => {
    const { clientId } = await makeClient('f');
    const keep = await makeRequest(clientId, 'Stripe statements');
    const dup = await makeRequest(clientId, 'Stripe statements');
    expect(await rv.removeEmptyRequest(staffId, clientId, dup.id, 'duplicate')).toBe('removed');
    expect(await exists(keep.id)).toBe(true);
    expect(await exists(dup.id)).toBe(false);
  });
});
