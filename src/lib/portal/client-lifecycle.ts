/**
 * Client lifecycle — archive, restore, data minimisation and permitted deletion (owner decision, 29 Sep 2026).
 *
 * Principles, in order:
 *   1. EVERY client can be ARCHIVED: hidden from the working list, members cannot log in, nothing new can be
 *      sent or signed, open signature requests are voided with a reason. Documents, evidence, audit trail and
 *      Drive files are untouched. Restorable.
 *   2. PROTECTED records are never destroyed by this module: signature requests and their events, consents,
 *      evidence certificates, sealed PDFs, identity-verification (KYC) records, anything under legal hold or
 *      inside its retention period. The database triggers from migration 0002 would refuse anyway; this
 *      module never disables them and offers no privileged bypass.
 *   3. PERMANENT DELETE of the whole client is allowed only when the client has NO protected records at all
 *      (typically a test/duplicate/created-in-error client). It runs in one transaction; Drive files are moved
 *      to the bin only after the transaction has committed, so Drive can never run ahead of the database.
 *   4. When protected records exist and there is no legal hold, staff may instead DELETE REMOVABLE DATA:
 *      the client is archived, open requests voided, invitations/tokens removed, unsent/unsigned drafts and
 *      their Drive files removed, logins suspended — while the protected records stay exactly as they were.
 *      Client uploads (tax records) are retained as accounting records in this mode.
 *
 * Every action writes an audit event: actor, UTC time, client, action, reason, what was retained and deleted.
 * Never the deleted content itself.
 */
import { and, eq, inArray, isNull, sql } from 'drizzle-orm';
import { db, tables } from './db';
import { audit } from './audit';
import { isOpen, type SigRequestStatus } from './esign';
import { voidRequest } from './esign-store';
import { trashDriveFile } from './drive';

export const ARCHIVE_REASONS = {
  CLIENT_REQUESTED: 'Client requested deletion',
  DUPLICATE: 'Duplicate record',
  TEST_RECORD: 'Test / synthetic record',
  CREATED_IN_ERROR: 'Created in error',
  ENGAGEMENT_ENDED: 'Engagement ended',
  OTHER: 'Other',
} as const;
export type ArchiveReason = keyof typeof ARCHIVE_REASONS;
export function isArchiveReason(x: unknown): x is ArchiveReason { return typeof x === 'string' && x in ARCHIVE_REASONS; }

export type Decision = 'FULL_DELETE_ALLOWED' | 'PARTIAL_DELETE_RETENTION_REQUIRED' | 'ARCHIVE_ONLY';

export type Assessment = {
  client: { id: string; ref: string; name: string; primaryEmail: string; archivedAt: Date | null; archiveReason: string | null; dataMinimisedAt: Date | null };
  counts: {
    members: number; activeLogins: number; invitations: number;
    documentRequests: number; openDocumentRequests: number; uploads: number; deliveries: number;
    signatureRequests: number; openSignatureRequests: number; completedSignatures: number; evidenceCertificates: number;
    identityVerifications: number; auditEvents: number; driveFiles: number;
  };
  legalHold: boolean;
  retainUntil: Date | null;          // latest retention date across protected records (null = none / not computed)
  retentionActive: boolean;          // at least one protected record is still inside its retention period (or has no date yet)
  decision: Decision;
  reason: string;                    // plain English, shown to staff
  retained: string[];                // categories that will be kept under the strongest permitted action
  deletable: string[];               // categories that the strongest permitted action would remove
};

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Pure decision rule — unit-tested separately from the database. */
export function decide(input: { legalHold: boolean; protectedRecords: number; retainUntil: Date | null; now?: Date }): { decision: Decision; retentionActive: boolean } {
  const now = input.now ?? new Date();
  if (input.legalHold) return { decision: 'ARCHIVE_ONLY', retentionActive: true };
  if (input.protectedRecords === 0) return { decision: 'FULL_DELETE_ALLOWED', retentionActive: false };
  const retentionActive = !input.retainUntil || input.retainUntil.getTime() > now.getTime();
  return { decision: 'PARTIAL_DELETE_RETENTION_REQUIRED', retentionActive };
}

export async function assessClient(clientId: string): Promise<Assessment | null> {
  const [c] = await db.select().from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
  if (!c) return null;
  const [primary] = await db.select({ email: tables.users.email }).from(tables.users).where(eq(tables.users.id, c.userId)).limit(1);
  const members = await db.select({ userId: tables.clientMembers.userId, status: tables.clientMembers.status }).from(tables.clientMembers).where(eq(tables.clientMembers.clientId, clientId));
  const memberIds = [...new Set([c.userId, ...members.map(m => m.userId)])];
  const users = await db.select({ id: tables.users.id, status: tables.users.status }).from(tables.users).where(inArray(tables.users.id, memberIds));
  const invitations = await db.select({ id: tables.invitations.id }).from(tables.invitations).where(and(inArray(tables.invitations.userId, memberIds), isNull(tables.invitations.usedAt)));
  const docReqs = await db.select({ status: tables.documentRequests.status }).from(tables.documentRequests).where(eq(tables.documentRequests.clientId, clientId));
  const uploads = await db.select({ id: tables.documents.id }).from(tables.documents).where(eq(tables.documents.clientId, clientId));
  const deliveries = await db.select({ id: tables.deliveries.id }).from(tables.deliveries).where(eq(tables.deliveries.clientId, clientId));
  const sigs = await db.select({ id: tables.signatureRequests.id, status: tables.signatureRequests.status, retainUntil: tables.signatureRequests.retainUntil, legalHoldAt: tables.signatureRequests.legalHoldAt, evidenceSha256: tables.signatureRequests.evidenceSha256 })
    .from(tables.signatureRequests).where(eq(tables.signatureRequests.clientId, clientId));
  const idv = await db.select({ id: tables.identityVerifications.id }).from(tables.identityVerifications).where(eq(tables.identityVerifications.clientId, clientId));
  const [{ n: auditEvents }] = await db.select({ n: sql<number>`count(*)` }).from(tables.auditLogs).where(and(eq(tables.auditLogs.targetType, 'client'), eq(tables.auditLogs.targetId, clientId)));

  const legalHold = sigs.some(s => !!s.legalHoldAt);
  const completed = sigs.filter(s => s.status === 'COMPLETED');
  const protectedRecords = sigs.length + idv.length; // ANY signature request carries append-only events → protected
  const retainDates = sigs.map(s => s.retainUntil).filter((d): d is Date => !!d);
  const retainUntil = retainDates.length ? new Date(Math.max(...retainDates.map(d => d.getTime()))) : null;
  const { decision, retentionActive } = decide({ legalHold, protectedRecords, retainUntil });
  const driveFiles = uploads.length + deliveries.length + completed.length * 2;

  const counts: Assessment['counts'] = {
    members: members.filter(m => m.status === 'ACTIVE').length || 1, activeLogins: users.filter(u => u.status === 'ACTIVE').length, invitations: invitations.length,
    documentRequests: docReqs.length, openDocumentRequests: docReqs.filter(r => r.status === 'REQUESTED').length, uploads: uploads.length, deliveries: deliveries.length,
    signatureRequests: sigs.length, openSignatureRequests: sigs.filter(s => isOpen(s.status as SigRequestStatus)).length, completedSignatures: completed.length,
    evidenceCertificates: sigs.filter(s => !!s.evidenceSha256).length, identityVerifications: idv.length, auditEvents: Number(auditEvents), driveFiles,
  };

  let reason: string; let retained: string[]; let deletable: string[];
  if (decision === 'ARCHIVE_ONLY') {
    reason = 'Deletion unavailable while legal hold is active. The client can be archived and portal access removed; every record stays exactly as it is until the hold is lifted.';
    retained = ['Signed documents and signature records', 'Evidence certificates and event log', 'Client uploads', 'Documents sent for review', 'Audit trail', 'Drive files'];
    deletable = [];
  } else if (decision === 'FULL_DELETE_ALLOWED') {
    reason = 'Permanent deletion is available. This client has no signed documents, no signature or approval records, no identity-verification records and no legal hold, so nothing has to be retained.';
    retained = ['Staff audit trail (who did what, when — no client content)'];
    deletable = ['Client record and portal memberships', 'Portal logins (deleted, or anonymised where an audit entry refers to them)', 'Invitations and links', 'Document requests', 'Client uploads and their Drive files', 'Documents sent for review and their Drive files', 'The client’s Drive folder (moved to the bin)'];
  } else {
    const n = counts.signatureRequests + counts.identityVerifications;
    const until = retainUntil ? ` until ${fmt(retainUntil)}` : '';
    reason = retentionActive
      ? `Permanent deletion is not available because ${n} signed or signature record${n === 1 ? '' : 's'} must be retained${until}. You can archive this client and remove portal access, and you can delete the removable personal data now; the signed documents, evidence and audit records cannot be deleted yet.`
      : `The retention period for this client’s ${n} signed record${n === 1 ? '' : 's'} has ended and there is no legal hold. This portal never destroys signature evidence itself: archive the client and delete the removable data here; a final purge of the retained evidence is a separate administrator procedure (see the e-sign documentation).`;
    retained = ['Signed documents, signature records and evidence certificates', 'Signature event log and consents', 'Identity-verification records', 'Client uploads (accounting records)', 'Audit trail', 'Drive files for the above'];
    deletable = ['Open signature requests (voided, not deleted)', 'Open document requests', 'Documents sent for review that were never signed, and their Drive files', 'Invitations and links', 'Portal access (logins suspended)'];
  }
  return {
    client: { id: c.id, ref: c.clientRef, name: c.displayName, primaryEmail: primary?.email ?? '', archivedAt: c.archivedAt, archiveReason: c.archiveReason, dataMinimisedAt: c.dataMinimisedAt },
    counts, legalHold, retainUntil, retentionActive, decision, reason, retained, deletable,
  };
}

export class LifecycleError extends Error { constructor(public status: 400 | 404 | 409, message: string) { super(message); } }

type Actor = { uid: string; ip: string | null; userAgent: string | null };

/** Users whose ONLY active membership is this client (so suspending them locks nobody else out). */
async function exclusiveMemberUserIds(clientId: string, memberIds: string[]): Promise<string[]> {
  if (!memberIds.length) return [];
  const others = await db.select({ userId: tables.clientMembers.userId }).from(tables.clientMembers)
    .where(and(inArray(tables.clientMembers.userId, memberIds), eq(tables.clientMembers.status, 'ACTIVE'), sql`${tables.clientMembers.clientId} <> ${clientId}`));
  const shared = new Set(others.map(o => o.userId));
  return memberIds.filter(id => !shared.has(id));
}

async function voidOpenRequests(clientId: string, actor: Actor, why: string): Promise<string[]> {
  const open = await db.select().from(tables.signatureRequests).where(and(eq(tables.signatureRequests.clientId, clientId), inArray(tables.signatureRequests.status, ['DRAFT', 'AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED'])));
  for (const r of open) await voidRequest(r, actor.uid, why, 'request_voided', actor.ip, actor.userAgent);
  return open.map(r => r.id);
}

/**
 * ARCHIVE — idempotent and race-safe: the UPDATE only matches an un-archived row, so two staff clicking at once
 * produce one archive and one 409.
 */
export async function archiveClient(clientId: string, actor: Actor, reason: ArchiveReason, note: string | null): Promise<{ voidedRequests: number; suspendedLogins: number }> {
  const voided = await voidOpenRequests(clientId, actor, `Client archived by staff (${ARCHIVE_REASONS[reason]})`);
  const [row] = await db.update(tables.clients)
    .set({ archivedAt: new Date(), archivedById: actor.uid, archiveReason: reason, archiveNote: note, status: 'DEACTIVATED', updatedAt: new Date() })
    .where(and(eq(tables.clients.id, clientId), isNull(tables.clients.archivedAt))).returning({ id: tables.clients.id, ref: tables.clients.clientRef, userId: tables.clients.userId });
  if (!row) {
    const [exists] = await db.select({ id: tables.clients.id }).from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
    throw new LifecycleError(exists ? 409 : 404, exists ? 'This client is already archived.' : 'Not found');
  }
  const members = await db.select({ userId: tables.clientMembers.userId }).from(tables.clientMembers).where(and(eq(tables.clientMembers.clientId, clientId), eq(tables.clientMembers.status, 'ACTIVE')));
  const ids = [...new Set([row.userId, ...members.map(m => m.userId)])];
  const exclusive = await exclusiveMemberUserIds(clientId, ids);
  let suspended = 0;
  if (exclusive.length) {
    const r = await db.update(tables.users).set({ status: 'SUSPENDED', updatedAt: new Date() })
      .where(and(inArray(tables.users.id, exclusive), eq(tables.users.status, 'ACTIVE'), eq(tables.users.role, 'CLIENT'))).returning({ id: tables.users.id });
    suspended = r.length;
  }
  await audit(actor.uid, 'CLIENT_ARCHIVED', { targetType: 'client', targetId: clientId, ip: actor.ip ?? undefined, meta: {
    clientRef: row.ref, reason, hasNote: !!note, voidedSignatureRequests: voided.length, suspendedLogins: suspended,
    retained: ['documents', 'signature_evidence', 'audit_trail', 'drive_files', 'retention_state'], deleted: [],
  } });
  return { voidedRequests: voided.length, suspendedLogins: suspended };
}

/**
 * RESTORE — makes the client visible and workable again. Memberships are untouched (they were never removed).
 * Logins stay SUSPENDED until staff explicitly re-enable them (reenableLogin). No emails are sent. Nothing that
 * was deleted by data minimisation is recreated.
 */
export async function restoreClient(clientId: string, actor: Actor): Promise<void> {
  const [row] = await db.update(tables.clients)
    .set({ archivedAt: null, archivedById: null, archiveReason: null, archiveNote: null, status: 'ACTIVE', updatedAt: new Date() })
    .where(and(eq(tables.clients.id, clientId), sql`${tables.clients.archivedAt} is not null`)).returning({ ref: tables.clients.clientRef });
  if (!row) {
    const [exists] = await db.select({ id: tables.clients.id }).from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
    throw new LifecycleError(exists ? 409 : 404, exists ? 'This client is not archived.' : 'Not found');
  }
  await audit(actor.uid, 'CLIENT_RESTORED', { targetType: 'client', targetId: clientId, ip: actor.ip ?? undefined, meta: { clientRef: row.ref, loginsReenabled: false } });
}

/** Staff explicitly re-enables one member's login after a restore. */
export async function reenableLogin(clientId: string, userId: string, actor: Actor): Promise<void> {
  const [c] = await db.select({ archivedAt: tables.clients.archivedAt, userId: tables.clients.userId }).from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
  if (!c) throw new LifecycleError(404, 'Not found');
  if (c.archivedAt) throw new LifecycleError(409, 'Restore the client before re-enabling logins.');
  const [m] = await db.select({ id: tables.clientMembers.id }).from(tables.clientMembers).where(and(eq(tables.clientMembers.clientId, clientId), eq(tables.clientMembers.userId, userId), eq(tables.clientMembers.status, 'ACTIVE'))).limit(1);
  if (!m && c.userId !== userId) throw new LifecycleError(404, 'Not found');
  await db.update(tables.users).set({ status: 'ACTIVE', updatedAt: new Date() }).where(and(eq(tables.users.id, userId), eq(tables.users.status, 'SUSPENDED'), eq(tables.users.role, 'CLIENT')));
  await audit(actor.uid, 'CLIENT_LOGIN_REENABLED', { targetType: 'client', targetId: clientId, ip: actor.ip ?? undefined, meta: { userId } });
}

/** Drive ids that belong to deliveries never referenced by a signature request (drafts / never signed). */
async function unreferencedDeliveries(clientId: string) {
  const rows = await db.select({ id: tables.deliveries.id, driveFileId: tables.deliveries.driveFileId }).from(tables.deliveries).where(eq(tables.deliveries.clientId, clientId));
  const referenced = new Set((await db.select({ deliveryId: tables.signatureRequestDocuments.deliveryId }).from(tables.signatureRequestDocuments)
    .where(inArray(tables.signatureRequestDocuments.deliveryId, rows.map(r => r.id).concat(['00000000-0000-0000-0000-000000000000'])))).map(r => r.deliveryId));
  return rows.filter(r => !referenced.has(r.id));
}

/**
 * DELETE REMOVABLE DATA (partial) — for a client whose protected records must stay. Archives (if not already),
 * voids open requests, removes invitations, open document requests and never-signed drafts (+ their Drive files),
 * suspends logins, and stamps data_minimised_at. Protected rows are never touched.
 */
export async function minimiseClientData(clientId: string, actor: Actor, reason: ArchiveReason, note: string | null): Promise<{ deleted: Record<string, number>; driveTrashed: number; driveFailed: number }> {
  const a = await assessClient(clientId);
  if (!a) throw new LifecycleError(404, 'Not found');
  if (a.decision === 'ARCHIVE_ONLY') throw new LifecycleError(409, 'Deletion unavailable while legal hold is active.');
  if (a.decision === 'FULL_DELETE_ALLOWED') throw new LifecycleError(409, 'This client has no protected records — use permanent deletion instead.');
  if (!a.client.archivedAt) await archiveClient(clientId, actor, reason, note);
  else await voidOpenRequests(clientId, actor, `Client data minimised by staff (${ARCHIVE_REASONS[reason]})`);

  const drafts = await unreferencedDeliveries(clientId);
  const memberIds = [...new Set([(await db.select({ userId: tables.clients.userId }).from(tables.clients).where(eq(tables.clients.id, clientId)))[0].userId,
    ...(await db.select({ userId: tables.clientMembers.userId }).from(tables.clientMembers).where(eq(tables.clientMembers.clientId, clientId))).map(m => m.userId)])];
  const deleted: Record<string, number> = {};
  await db.transaction(async tx => {
    const locked = await tx.execute(sql`select id, data_minimised_at from clients where id = ${clientId} for update`);
    if (!locked.rows?.length) throw new LifecycleError(404, 'Not found');
    if (drafts.length) {
      const ids = drafts.map(d => d.id);
      deleted.deliveryResponses = (await tx.delete(tables.deliveryResponses).where(inArray(tables.deliveryResponses.deliveryId, ids)).returning({ id: tables.deliveryResponses.id })).length;
      deleted.draftDeliveries = (await tx.delete(tables.deliveries).where(inArray(tables.deliveries.id, ids)).returning({ id: tables.deliveries.id })).length;
    }
    deleted.openDocumentRequests = (await tx.delete(tables.documentRequests).where(and(eq(tables.documentRequests.clientId, clientId), eq(tables.documentRequests.status, 'REQUESTED'),
      sql`not exists (select 1 from documents d where d.request_id = ${tables.documentRequests.id})`)).returning({ id: tables.documentRequests.id })).length;
    deleted.invitations = memberIds.length ? (await tx.delete(tables.invitations).where(inArray(tables.invitations.userId, memberIds)).returning({ id: tables.invitations.id })).length : 0;
    await tx.update(tables.clients).set({ dataMinimisedAt: new Date(), updatedAt: new Date() }).where(eq(tables.clients.id, clientId));
  });
  // Drive only after the database has committed.
  let driveTrashed = 0, driveFailed = 0;
  for (const d of drafts) { if (await trashDriveFile(d.driveFileId)) driveTrashed++; else driveFailed++; }
  await audit(actor.uid, 'CLIENT_DATA_MINIMISED', { targetType: 'client', targetId: clientId, ip: actor.ip ?? undefined, meta: {
    clientRef: a.client.ref, reason, hasNote: !!note, deleted, driveTrashed, driveFailed,
    retained: ['signature_requests', 'signature_events', 'signature_evidence', 'esign_consents', 'identity_verifications', 'client_uploads', 'signed_deliveries', 'audit_trail'],
    retainUntil: a.retainUntil?.toISOString() ?? null,
  } });
  return { deleted, driveTrashed, driveFailed };
}

/**
 * PERMANENT DELETE — only when the decision engine says FULL_DELETE_ALLOWED (re-checked inside the transaction
 * under a row lock, so a signature request created a moment earlier makes the delete fail rather than proceed).
 * FK-aware order; portal users are deleted when nothing else refers to them, otherwise anonymised and
 * deactivated (their audit entries stay, without personal details). Drive folder goes to the bin AFTER commit.
 */
export async function deleteClientPermanently(clientId: string, actor: Actor, reason: ArchiveReason, note: string | null): Promise<{ deleted: Record<string, number>; usersDeleted: number; usersAnonymised: number; driveTrashed: boolean | null }> {
  const a = await assessClient(clientId);
  if (!a) throw new LifecycleError(404, 'Not found');
  if (a.decision !== 'FULL_DELETE_ALLOWED') throw new LifecycleError(409, a.reason);
  const [c] = await db.select().from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
  if (!c) throw new LifecycleError(404, 'Not found');
  const deleted: Record<string, number> = {};
  let usersDeleted = 0, usersAnonymised = 0;
  const driveIds: string[] = [];
  await db.transaction(async tx => {
    // Row lock; a concurrent delete that already removed the row makes this a clean 404 instead of a second "success".
    const locked = await tx.execute(sql`select id from clients where id = ${clientId} for update`);
    if (!locked.rows?.length) throw new LifecycleError(404, 'Not found');
    // Re-verify under the lock: any protected record → abort (nothing has been deleted yet).
    const [{ n: sigN }] = await tx.select({ n: sql<number>`count(*)` }).from(tables.signatureRequests).where(eq(tables.signatureRequests.clientId, clientId));
    const [{ n: idvN }] = await tx.select({ n: sql<number>`count(*)` }).from(tables.identityVerifications).where(eq(tables.identityVerifications.clientId, clientId));
    if (Number(sigN) + Number(idvN) > 0) throw new LifecycleError(409, 'A protected record was added to this client; permanent deletion is no longer available. Refresh and review the options again.');

    const members = await tx.select({ userId: tables.clientMembers.userId }).from(tables.clientMembers).where(eq(tables.clientMembers.clientId, clientId));
    const memberIds = [...new Set([c.userId, ...members.map(m => m.userId)])];
    const docs = await tx.select({ id: tables.documents.id, driveFileId: tables.documents.driveFileId }).from(tables.documents).where(eq(tables.documents.clientId, clientId));
    const dels = await tx.select({ id: tables.deliveries.id, driveFileId: tables.deliveries.driveFileId }).from(tables.deliveries).where(eq(tables.deliveries.clientId, clientId));
    driveIds.push(...docs.map(d => d.driveFileId), ...dels.map(d => d.driveFileId));

    deleted.deliveryResponses = (await tx.delete(tables.deliveryResponses).where(eq(tables.deliveryResponses.clientId, clientId)).returning({ id: tables.deliveryResponses.id })).length;
    deleted.deliveries = (await tx.delete(tables.deliveries).where(eq(tables.deliveries.clientId, clientId)).returning({ id: tables.deliveries.id })).length;
    deleted.uploads = (await tx.delete(tables.documents).where(eq(tables.documents.clientId, clientId)).returning({ id: tables.documents.id })).length;
    deleted.documentRequests = (await tx.delete(tables.documentRequests).where(eq(tables.documentRequests.clientId, clientId)).returning({ id: tables.documentRequests.id })).length;
    deleted.memberships = (await tx.delete(tables.clientMembers).where(eq(tables.clientMembers.clientId, clientId)).returning({ id: tables.clientMembers.id })).length;
    deleted.invitations = memberIds.length ? (await tx.delete(tables.invitations).where(inArray(tables.invitations.userId, memberIds)).returning({ id: tables.invitations.id })).length : 0;
    await tx.delete(tables.clients).where(eq(tables.clients.id, clientId));

    // Portal users: delete when nothing else refers to them; otherwise anonymise + deactivate (audit rows keep their id only).
    for (const uid of memberIds) {
      const [u] = await tx.select({ id: tables.users.id, role: tables.users.role }).from(tables.users).where(eq(tables.users.id, uid)).limit(1);
      if (!u || u.role !== 'CLIENT') continue;
      const [other] = await tx.select({ id: tables.clientMembers.id }).from(tables.clientMembers).where(eq(tables.clientMembers.userId, uid)).limit(1);
      const [otherClient] = await tx.select({ id: tables.clients.id }).from(tables.clients).where(eq(tables.clients.userId, uid)).limit(1);
      if (other || otherClient) continue; // still attached elsewhere — leave entirely alone
      const refs = await tx.execute(sql`select
        (select count(*) from audit_logs where actor_user_id = ${uid}) +
        (select count(*) from documents where uploaded_by_id = ${uid}) +
        (select count(*) from deliveries where uploaded_by_id = ${uid}) +
        (select count(*) from esign_consents where user_id = ${uid}) +
        (select count(*) from signature_signers where user_id = ${uid}) +
        (select count(*) from identity_verifications where user_id = ${uid} or verified_by_id = ${uid}) +
        (select count(*) from client_members where added_by_id = ${uid}) +
        (select count(*) from clients where archived_by_id = ${uid}) as n`);
      const n = Number((refs.rows?.[0] as { n?: string | number } | undefined)?.n ?? 0);
      if (n === 0) { await tx.delete(tables.users).where(eq(tables.users.id, uid)); usersDeleted++; }
      else {
        await tx.update(tables.users).set({ email: `deleted-${uid}@invalid.local`, firstName: null, lastName: null, passwordHash: null, status: 'DEACTIVATED', updatedAt: new Date() }).where(eq(tables.users.id, uid));
        usersAnonymised++;
      }
    }
  });
  // Drive only after commit: bin the client's folder (contains incoming + processed); individual ids as a fallback.
  let driveTrashed: boolean | null = null;
  if (c.driveFolderId) driveTrashed = await trashDriveFile(c.driveFolderId);
  if (driveTrashed === false) for (const id of driveIds) await trashDriveFile(id);
  await audit(actor.uid, 'CLIENT_DELETED', { targetType: 'client', targetId: clientId, ip: actor.ip ?? undefined, meta: {
    clientRef: c.clientRef, reason, hasNote: !!note, deleted, usersDeleted, usersAnonymised, driveFolderTrashed: driveTrashed,
    retained: ['staff_audit_trail'], protectedRecordsAtDeletion: 0,
  } });
  return { deleted, usersDeleted, usersAnonymised, driveTrashed };
}

/** True when the client is archived (used by login and every client-facing request). */
export async function isClientArchived(clientId: string): Promise<boolean> {
  const [c] = await db.select({ archivedAt: tables.clients.archivedAt }).from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
  return !c || !!c.archivedAt;
}
