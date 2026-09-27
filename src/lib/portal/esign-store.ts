import { and, asc, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { db, tables } from './db';
import { openDriveFileStream, uploadToProcessedFolder } from './drive';
import {
  buildEvidenceCertificate, certificateSha256, chainHash, consentTextSha256, deriveRequestStatus, hasExpired, sha256Hex, verifyChain,
  type EsignEventType, type EvidenceCertificate, type SigAction, type SigRequestStatus, type SigSignerStatus, type SigDocKind,
} from './esign';
import { renderEvidenceCertificatePdf, sealSignedPdf, type PlacedField } from './esign-pdf';
import { retainUntilFor } from './esign-retention';

export type RequestRow = typeof tables.signatureRequests.$inferSelect;
export type SignerRow = typeof tables.signatureSigners.$inferSelect;
export type FieldRow = typeof tables.signatureFields.$inferSelect;
export type RequestDocRow = typeof tables.signatureRequestDocuments.$inferSelect;
export type EventRow = typeof tables.signatureEvents.$inferSelect;

/* ───────────── Reading bytes (server-side only) ───────────── */

export async function readDriveBytes(fileId: string): Promise<Buffer> {
  const { body } = await openDriveFileStream(fileId);
  const chunks: Uint8Array[] = [];
  const reader = body.getReader();
  for (;;) { const { done, value } = await reader.read(); if (done) break; if (value) chunks.push(value); }
  return Buffer.concat(chunks.map(c => Buffer.from(c)));
}

/* ───────────── Append-only events with hash chain ───────────── */

/**
 * Appends one event to the request's hash chain. Runs in a transaction holding a per-request advisory
 * lock, so two concurrent writers (two tabs, two signers) can never both chain onto the same previous
 * event and fork the chain. Order of record is the `seq` column, never the wall clock.
 */
export async function recordEvent(requestId: string, type: EsignEventType, opts: { signerId?: string | null; actorUserId?: string | null; ip?: string | null; userAgent?: string | null; meta?: Record<string, unknown> | null } = {}): Promise<EventRow> {
  return db.transaction(async tx => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${requestId}))`);
    const [last] = await tx.select({ hash: tables.signatureEvents.hash }).from(tables.signatureEvents)
      .where(eq(tables.signatureEvents.requestId, requestId)).orderBy(desc(tables.signatureEvents.seq)).limit(1);
    const at = new Date();
    const body = { requestId, signerId: opts.signerId ?? null, actorUserId: opts.actorUserId ?? null, type, at: at.toISOString(), ip: opts.ip ?? null, userAgent: opts.userAgent ? opts.userAgent.slice(0, 400) : null, meta: opts.meta ?? null };
    const hash = chainHash(last?.hash ?? null, body);
    const [row] = await tx.insert(tables.signatureEvents).values({ ...body, at, prevHash: last?.hash ?? null, hash }).returning();
    return row;
  });
}

export async function listEvents(requestId: string): Promise<EventRow[]> {
  return db.select().from(tables.signatureEvents).where(eq(tables.signatureEvents.requestId, requestId)).orderBy(asc(tables.signatureEvents.seq));
}

/* ───────────── Ownership-scoped loaders (fail closed) ───────────── */

export async function getRequestForClient(clientId: string, requestId: string): Promise<RequestRow | null> {
  if (!clientId || !requestId) return null;
  const [row] = await db.select().from(tables.signatureRequests).where(and(eq(tables.signatureRequests.id, requestId), eq(tables.signatureRequests.clientId, clientId))).limit(1);
  return row ?? null;
}
export async function getRequestForStaff(clientId: string, requestId: string): Promise<RequestRow | null> {
  return getRequestForClient(clientId, requestId);
}
export async function getRequestById(requestId: string): Promise<RequestRow | null> {
  const [row] = await db.select().from(tables.signatureRequests).where(eq(tables.signatureRequests.id, requestId)).limit(1);
  return row ?? null;
}
export async function listRequestsForClient(clientId: string): Promise<RequestRow[]> {
  return db.select().from(tables.signatureRequests).where(eq(tables.signatureRequests.clientId, clientId)).orderBy(desc(tables.signatureRequests.createdAt));
}
export async function listOpenRequestsForStaff(statuses?: SigRequestStatus[]) {
  const q = db.select({ req: tables.signatureRequests, clientRef: tables.clients.clientRef, clientName: tables.clients.displayName })
    .from(tables.signatureRequests).innerJoin(tables.clients, eq(tables.clients.id, tables.signatureRequests.clientId));
  const rows = statuses?.length ? await q.where(inArray(tables.signatureRequests.status, statuses)).orderBy(desc(tables.signatureRequests.updatedAt)) : await q.orderBy(desc(tables.signatureRequests.updatedAt));
  return rows;
}
export async function loadBundle(requestId: string) {
  const [request] = await db.select().from(tables.signatureRequests).where(eq(tables.signatureRequests.id, requestId)).limit(1);
  if (!request) return null;
  const docs = await db.select().from(tables.signatureRequestDocuments).where(eq(tables.signatureRequestDocuments.requestId, requestId)).orderBy(asc(tables.signatureRequestDocuments.position));
  const signers = await db.select().from(tables.signatureSigners).where(eq(tables.signatureSigners.requestId, requestId)).orderBy(asc(tables.signatureSigners.sequence));
  const fields = await db.select().from(tables.signatureFields).where(eq(tables.signatureFields.requestId, requestId));
  return { request, docs, signers, fields };
}
/** The signer row for THIS user on THIS request — the only way a client reaches signer state. */
export async function getSignerForUser(requestId: string, userId: string): Promise<SignerRow | null> {
  const [row] = await db.select().from(tables.signatureSigners).where(and(eq(tables.signatureSigners.requestId, requestId), eq(tables.signatureSigners.userId, userId))).limit(1);
  return row ?? null;
}

/* ───────────── Creation: freeze the exact bytes the client will sign ───────────── */

export async function freezeDelivery(deliveryId: string): Promise<{ sha256: string; size: number; version: number; driveFileId: string; title: string; originalName: string; mimeType: string; clientId: string }> {
  const [d] = await db.select().from(tables.deliveries).where(eq(tables.deliveries.id, deliveryId)).limit(1);
  if (!d) throw new Error('Delivery not found');
  if (d.mimeType !== 'application/pdf') throw new Error('Only PDF documents can be sent for signature');
  const bytes = await readDriveBytes(d.driveFileId);
  return { sha256: sha256Hex(bytes), size: bytes.length, version: d.version, driveFileId: d.driveFileId, title: d.title, originalName: d.originalName, mimeType: d.mimeType, clientId: d.clientId };
}

export type CreateRequestInput = {
  clientId: string; title: string; action: SigAction; docKind: SigDocKind; signingOrder: 'PARALLEL' | 'SEQUENTIAL'; message: string | null;
  dueAt: Date | null; expiresAt: Date | null; consentVersion: string; createdById: string;
  documents: Array<{ deliveryId: string; requiresSignature: boolean }>;
  signers: Array<{ userId: string; fullName: string; email: string; role: string; sequence: number; identityVerificationId: string | null }>;
  fields: Array<{ deliveryId: string; signerUserId: string; type: FieldRow['type']; page: number; xPct: number; yPct: number; wPct: number; hPct: number; label: string | null; required: boolean }>;
  ip: string | null; userAgent: string | null;
};

export async function createRequest(input: CreateRequestInput): Promise<RequestRow> {
  // Freeze first (reads Drive) — if any document can't be hashed, nothing is written.
  const frozen = await Promise.all(input.documents.map(async d => ({ ...d, f: await freezeDelivery(d.deliveryId) })));
  for (const f of frozen) if (f.f.clientId !== input.clientId) throw new Error('Document does not belong to this client');

  const [req] = await db.insert(tables.signatureRequests).values({
    clientId: input.clientId, title: input.title, action: input.action, docKind: input.docKind, signingOrder: input.signingOrder,
    status: 'AWAITING_CLIENT', message: input.message, dueAt: input.dueAt, expiresAt: input.expiresAt, consentVersion: input.consentVersion,
    createdById: input.createdById, sentAt: new Date(),
  }).returning();

  const docRows = await db.insert(tables.signatureRequestDocuments).values(frozen.map((f, i) => ({
    requestId: req.id, deliveryId: f.deliveryId, deliveryVersion: f.f.version, position: i + 1, frozenSha256: f.f.sha256, frozenSizeBytes: f.f.size, requiresSignature: f.requiresSignature ? 1 : 0,
  }))).returning();

  const signerRows = await db.insert(tables.signatureSigners).values(input.signers.map(s => ({
    requestId: req.id, userId: s.userId, clientId: input.clientId, fullName: s.fullName, email: s.email, role: s.role, sequence: s.sequence, identityVerificationId: s.identityVerificationId,
  }))).returning();

  if (input.fields.length) {
    await db.insert(tables.signatureFields).values(input.fields.map(f => {
      const doc = docRows.find(d => d.deliveryId === f.deliveryId); const signer = signerRows.find(s => s.userId === f.signerUserId);
      if (!doc || !signer) throw new Error('Field refers to an unknown document or signer');
      return { requestId: req.id, requestDocumentId: doc.id, signerId: signer.id, type: f.type, page: f.page, xPct: f.xPct, yPct: f.yPct, wPct: f.wPct, hPct: f.hPct, label: f.label, required: f.required ? 1 : 0 };
    }));
  }

  for (const f of frozen) await recordEvent(req.id, 'document_version_frozen', { actorUserId: input.createdById, ip: input.ip, userAgent: input.userAgent, meta: { deliveryId: f.deliveryId, version: f.f.version, sha256: f.f.sha256, sizeBytes: f.f.size } });
  await recordEvent(req.id, 'signature_request_created', { actorUserId: input.createdById, ip: input.ip, userAgent: input.userAgent, meta: { action: input.action, docKind: input.docKind, signers: signerRows.map(s => s.id), signingOrder: input.signingOrder } });
  await recordEvent(req.id, 'signature_request_sent', { actorUserId: input.createdById, ip: input.ip, userAgent: input.userAgent });
  return req;
}

/* ───────────── Transitions ───────────── */

async function refreshRequestStatus(requestId: string): Promise<SigRequestStatus> {
  const bundle = await loadBundle(requestId); if (!bundle) throw new Error('Request missing');
  const next = deriveRequestStatus(bundle.request.action, bundle.request.status, bundle.signers);
  if (next !== bundle.request.status) {
    const patch: Partial<RequestRow> = { status: next, updatedAt: new Date() };
    if (next === 'DECLINED') { patch.closedAt = new Date(); patch.closedReason = 'declined'; }
    await db.update(tables.signatureRequests).set(patch).where(eq(tables.signatureRequests.id, requestId));
  }
  return next;
}

/** Marks the request expired if its clock has run out. Returns the (possibly updated) status. */
export async function expireIfDue(req: RequestRow): Promise<SigRequestStatus> {
  if (!['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED'].includes(req.status) || !hasExpired(req.expiresAt)) return req.status;
  await db.update(tables.signatureRequests).set({ status: 'EXPIRED', closedAt: new Date(), closedReason: 'expired', updatedAt: new Date() }).where(and(eq(tables.signatureRequests.id, req.id), eq(tables.signatureRequests.status, req.status)));
  await recordEvent(req.id, 'request_expired', { meta: { expiresAt: req.expiresAt?.toISOString() } });
  return 'EXPIRED';
}

export class StaleSignerStateError extends Error { constructor() { super('This step has already been completed in another window.'); } }

/**
 * Compare-and-set: the signer row is only moved from the status the caller saw. A second tab (or a replayed
 * request) that races the first therefore finds zero rows updated and gets StaleSignerStateError instead
 * of a duplicate signature.
 */
export async function setSignerStatus(signer: SignerRow, status: SigSignerStatus, patch: Partial<SignerRow> = {}): Promise<SigRequestStatus> {
  const updated = await db.update(tables.signatureSigners).set({ status, ...patch })
    .where(and(eq(tables.signatureSigners.id, signer.id), eq(tables.signatureSigners.status, signer.status))).returning({ id: tables.signatureSigners.id });
  if (updated.length === 0) throw new StaleSignerStateError();
  return refreshRequestStatus(signer.requestId);
}

export async function voidRequest(req: RequestRow, actorUserId: string, reason: string, kind: 'request_voided' | 'request_superseded', ip: string | null, userAgent: string | null, supersededById?: string): Promise<void> {
  await db.update(tables.signatureRequests).set({ status: kind === 'request_voided' ? 'VOIDED' : 'SUPERSEDED', closedAt: new Date(), closedReason: reason.slice(0, 500), supersededById: supersededById ?? null, updatedAt: new Date() })
    .where(eq(tables.signatureRequests.id, req.id));
  await recordEvent(req.id, kind, { actorUserId, ip, userAgent, meta: { reason: reason.slice(0, 500), supersededById: supersededById ?? null } });
}

/** Any OPEN request that references this delivery is superseded (staff replaced/withdrew the document). */
export async function supersedeRequestsForDelivery(deliveryId: string, actorUserId: string, reason: string, replacedByDeliveryId: string | null): Promise<string[]> {
  const links = await db.select({ requestId: tables.signatureRequestDocuments.requestId }).from(tables.signatureRequestDocuments).where(eq(tables.signatureRequestDocuments.deliveryId, deliveryId));
  const out: string[] = [];
  for (const l of links) {
    const [req] = await db.select().from(tables.signatureRequests).where(eq(tables.signatureRequests.id, l.requestId)).limit(1);
    if (!req || !['DRAFT', 'AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED'].includes(req.status)) continue;
    await voidRequest(req, actorUserId, `${reason}${replacedByDeliveryId ? ` (replaced by delivery ${replacedByDeliveryId})` : ''}`, 'request_superseded', null, null, replacedByDeliveryId ?? undefined);
    out.push(req.id);
  }
  return out;
}

/* ───────────── Completion: verify hashes, seal, certificate, store ───────────── */

export async function completeRequest(requestId: string): Promise<{ sealedSha256: string; evidenceSha256: string }> {
  const bundle = await loadBundle(requestId); if (!bundle) throw new Error('Request missing');
  const { request, docs, signers, fields } = bundle;
  if (request.status === 'COMPLETED' && request.evidenceSha256) return { sealedSha256: request.sealedSha256 ?? '', evidenceSha256: request.evidenceSha256 }; // idempotent
  const [client] = await db.select().from(tables.clients).where(eq(tables.clients.id, request.clientId)).limit(1);
  if (!client) throw new Error('Client missing');
  const completedAt = new Date();

  // Claim the seal: exactly one caller may seal a request. `completed_at` is set atomically from NULL; a concurrent
  // second signer / second tab finds it already set and returns without writing a second PDF or certificate.
  const claimed = await db.update(tables.signatureRequests).set({ completedAt })
    .where(and(eq(tables.signatureRequests.id, requestId), isNull(tables.signatureRequests.completedAt))).returning({ id: tables.signatureRequests.id });
  if (claimed.length === 0) throw new SealInProgressError();
  try {
    return await sealAndCertify();
  } catch (e) {
    // Release the claim so staff/the next attempt can seal once the underlying problem (Drive, bytes) is fixed.
    await db.update(tables.signatureRequests).set({ completedAt: null }).where(and(eq(tables.signatureRequests.id, requestId), isNull(tables.signatureRequests.evidenceSha256)));
    throw e;
  }

  async function sealAndCertify(): Promise<{ sealedSha256: string; evidenceSha256: string }> {
  // 1. Re-read every frozen document and REFUSE to seal if the bytes no longer match what the client saw.
  const originals: Array<{ doc: RequestDocRow; delivery: typeof tables.deliveries.$inferSelect; bytes: Buffer }> = [];
  for (const doc of docs) {
    const [delivery] = await db.select().from(tables.deliveries).where(eq(tables.deliveries.id, doc.deliveryId)).limit(1);
    if (!delivery) throw new Error('Delivery missing');
    const bytes = await readDriveBytes(delivery.driveFileId);
    if (sha256Hex(bytes) !== doc.frozenSha256) {
      await recordEvent(requestId, 'access_denied', { meta: { reason: 'frozen_hash_mismatch_at_completion', deliveryId: doc.deliveryId } });
      throw new Error('Document changed since it was frozen — sealing refused');
    }
    originals.push({ doc, delivery, bytes });
  }

  // 2. Seal each signable document (fields drawn + signing record page). Non-signable docs (review-only) are referenced by hash.
  const eventsSoFar = await listEvents(requestId);
  const summary = eventsSoFar.map(e => `${e.at.toISOString()}  ${e.type.replace(/_/g, ' ')}${e.ip ? `  (${e.ip})` : ''}`);
  let sealedSha256 = ''; let sealedSize = 0; let sealedDriveFileId: string | null = null;
  const signable = originals.filter(o => o.doc.requiresSignature === 1);
  const target = signable[0] ?? originals[0];
  if (target) {
    const placed: PlacedField[] = fields.filter(f => f.requestDocumentId === target.doc.id).map(f => {
      const s = signers.find(x => x.id === f.signerId)!;
      return { type: f.type, page: f.page, xPct: f.xPct, yPct: f.yPct, wPct: f.wPct, hPct: f.hPct, label: f.label, valueText: f.valueText, signer: { fullName: s.fullName, signatureMethod: s.signatureMethod, signatureText: s.signatureText, signatureImagePng: s.signatureImagePng, signedAt: s.signedAt } };
    });
    // Every signer always gets a signature block on the signing record page, even if staff placed no fields.
    for (const s of signers) if (!placed.some(p => p.type === 'SIGNATURE' && p.signer.fullName === s.fullName))
      placed.push({ type: request.action === 'APPROVAL' ? 'ACKNOWLEDGEMENT' : 'SIGNATURE', page: 0, xPct: 0, yPct: 0, wPct: 0, hPct: 0, label: request.action === 'APPROVAL' ? `Approved by ${s.fullName}` : null, valueText: 'true', signer: { fullName: s.fullName, signatureMethod: s.signatureMethod, signatureText: s.signatureText, signatureImagePng: s.signatureImagePng, signedAt: s.signedAt ?? s.approvedAt } });
    const sealed = await sealSignedPdf({
      originalPdf: target.bytes, fields: placed,
      request: { id: request.id, title: request.title, clientRef: client.clientRef, clientName: client.displayName, action: request.action, completedAt },
      documents: originals.map(o => ({ title: o.delivery.title, version: o.doc.deliveryVersion, frozenSha256: o.doc.frozenSha256 })),
      signers: signers.map(s => ({ fullName: s.fullName, email: s.email, role: s.role, signedAt: s.signedAt, approvedAt: s.approvedAt, signatureMethod: s.signatureMethod, ip: s.ip, authMethod: s.authMethod, consentVersion: s.consentVersion })),
      eventSummary: summary,
    });
    sealedSha256 = sealed.sha256; sealedSize = sealed.bytes.length;
    const stamp = completedAt.toISOString().slice(0, 10);
    sealedDriveFileId = await uploadToProcessedFolder(request.clientId, `${stamp}_SIGNED_${target.delivery.storedName}`, 'application/pdf', Buffer.from(sealed.bytes));
    await recordEvent(requestId, 'signed_pdf_created', { meta: { sha256: sealedSha256, sizeBytes: sealedSize, sourceDeliveryId: target.doc.deliveryId } });
  }

  // 3. Evidence certificate (JSON authoritative; PDF rendering stored alongside).
  const events = await listEvents(requestId);
  const chain = verifyChain(events.map(e => ({ requestId: e.requestId, signerId: e.signerId, actorUserId: e.actorUserId, type: e.type, at: e.at.toISOString(), ip: e.ip, userAgent: e.userAgent, meta: (e.meta as Record<string, unknown> | null) ?? null, prevHash: e.prevHash, hash: e.hash })));
  const idvIds = signers.map(s => s.identityVerificationId).filter((v): v is string => !!v);
  const idvs = idvIds.length ? await db.select().from(tables.identityVerifications).where(inArray(tables.identityVerifications.id, idvIds)) : [];
  // The consent text hash comes from the acceptance actually recorded for this signer on this request — never from the current wording.
  const consents = await db.select().from(tables.esignConsents).where(eq(tables.esignConsents.requestId, requestId));
  const cert: EvidenceCertificate = buildEvidenceCertificate({
    requestId: request.id, clientRef: client.clientRef, clientName: client.displayName, title: request.title, action: request.action, docKind: request.docKind, signingOrder: request.signingOrder,
    createdAt: request.createdAt.toISOString(), sentAt: request.sentAt?.toISOString() ?? null, completedAt: completedAt.toISOString(),
    documents: originals.map(o => ({ deliveryId: o.doc.deliveryId, title: o.delivery.title, version: o.doc.deliveryVersion, originalName: o.delivery.originalName, frozenSha256: o.doc.frozenSha256, frozenSizeBytes: o.doc.frozenSizeBytes, frozenAt: o.doc.frozenAt.toISOString() })),
    signers: signers.map(s => { const idv = idvs.find(i => i.id === s.identityVerificationId) ?? null; return {
      signerId: s.id, userId: s.userId, fullName: s.fullName, email: s.email, role: s.role, sequence: s.sequence, authMethod: s.authMethod, ip: s.ip, userAgent: s.userAgent,
      viewedAt: s.viewedAt?.toISOString() ?? null, consentedAt: s.consentedAt?.toISOString() ?? null, consentVersion: s.consentVersion, consentTextSha256: consents.find(c => c.userId === s.userId && c.version === s.consentVersion)?.textSha256 ?? (s.consentVersion ? consentTextSha256() : null),
      otpVerifiedAt: s.otpVerifiedAt?.toISOString() ?? null, approvedAt: s.approvedAt?.toISOString() ?? null, signedAt: s.signedAt?.toISOString() ?? null, signatureMethod: s.signatureMethod, signatureText: s.signatureText,
      signatureImageSha256: s.signatureImagePng ? sha256Hex(s.signatureImagePng) : null,
      identityVerification: idv ? { method: idv.method, verifiedAt: idv.verifiedAt.toISOString(), providerRef: idv.providerRef } : null,
    }; }),
    events: events.map(e => ({ id: e.id, type: e.type, at: e.at.toISOString(), actorUserId: e.actorUserId, signerId: e.signerId, ip: e.ip, userAgent: e.userAgent, meta: (e.meta as Record<string, unknown> | null) ?? null, prevHash: e.prevHash, hash: e.hash })),
    eventChainValid: chain.ok,
    sealedPdf: sealedSha256 ? { sha256: sealedSha256, sizeBytes: sealedSize } : null,
    generatedAt: completedAt.toISOString(),
  });
  // Hash the CANONICAL serialisation (sorted keys, no whitespace): Postgres jsonb does not preserve key order or
  // whitespace, so a hash over JSON.stringify would never re-verify after storage. certificateSha256(cert) is the
  // one function used at creation and at every later verification.
  const evidenceSha256 = certificateSha256(cert);
  await db.insert(tables.signatureEvidence).values({ requestId, certificateJson: cert, certificateSha256: evidenceSha256 });
  const certPdf = await renderEvidenceCertificatePdf(cert);
  const evidenceDriveFileId = await uploadToProcessedFolder(request.clientId, `${completedAt.toISOString().slice(0, 10)}_EVIDENCE_${request.id}.pdf`, 'application/pdf', Buffer.from(certPdf));
  await recordEvent(requestId, 'evidence_certificate_created', { meta: { certificateSha256: evidenceSha256 } });

  const retention = retainUntilFor(request.docKind, completedAt);
  await db.update(tables.signatureRequests).set({ status: 'COMPLETED', completedAt, sealedDriveFileId, sealedSha256: sealedSha256 || null, evidenceDriveFileId, evidenceSha256, retentionClass: retention.retentionClass, retainUntil: retention.retainUntil, updatedAt: new Date() })
    .where(eq(tables.signatureRequests.id, requestId));
  await recordEvent(requestId, 'all_signers_completed', { meta: { sealedSha256: sealedSha256 || null, evidenceSha256 } });
  return { sealedSha256, evidenceSha256 };
  }
}

export class SealInProgressError extends Error { constructor() { super('This request is already being finalised.'); } }

export async function getEvidence(requestId: string) {
  const [row] = await db.select().from(tables.signatureEvidence).where(eq(tables.signatureEvidence.requestId, requestId)).limit(1);
  return row ?? null;
}

export async function latestIdentityVerification(clientId: string, userId: string) {
  const [row] = await db.select().from(tables.identityVerifications).where(and(eq(tables.identityVerifications.clientId, clientId), eq(tables.identityVerifications.userId, userId))).orderBy(desc(tables.identityVerifications.verifiedAt)).limit(1);
  return row ?? null;
}
