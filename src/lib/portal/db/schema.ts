import { pgTable, pgEnum, text, uuid, timestamp, integer, jsonb, uniqueIndex, bigserial } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['CLIENT', 'STAFF', 'ADMIN']);
export const userStatusEnum = pgEnum('user_status', ['INVITED', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED']);
export const requestStatusEnum = pgEnum('request_status', ['REQUESTED', 'UPLOADED', 'RECEIVED', 'UNDER_REVIEW', 'COMPLETED']);
// Staff → client direction. Kept separate from request_status so the two directions can never be confused.
export const deliveryStatusEnum = pgEnum('delivery_status', ['READY_FOR_REVIEW', 'VIEWED', 'APPROVED', 'CHANGES_REQUESTED', 'WITHDRAWN']);
export const deliveryDecisionEnum = pgEnum('delivery_decision', ['APPROVED', 'CHANGES_REQUESTED']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  passwordHash: text('password_hash'),
  role: roleEnum('role').notNull().default('CLIENT'),
  status: userStatusEnum('status').notNull().default('INVITED'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('users_email_uq').on(t.email)]);

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientRef: text('client_ref').notNull(), // e.g. CL-0042 — human ref, never a Drive id
  displayName: text('display_name').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  driveFolderId: text('drive_folder_id'),    // server-side only — never serialised to the browser
  incomingFolderId: text('incoming_folder_id'), // server-side only
  processedFolderId: text('processed_folder_id'), // server-side only — staff → client deliveries land here
  status: userStatusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('clients_ref_uq').on(t.clientRef), uniqueIndex('clients_user_uq').on(t.userId)]);

/**
 * Client membership — the source of truth for "which portal users belong to this client".
 * A household (Jane + John), a company (two directors + an authorised contact) or a single individual all
 * map to one client with one or more ACTIVE members. `clients.user_id` is retained as the PRIMARY contact
 * (billing/general notifications) and is always mirrored by a PRIMARY membership; access and signing
 * authorisation are decided by this table only. A user is an ACTIVE member of at most one client (partial
 * unique index) so a session resolves to exactly one client.
 */
export const clientMembers = pgTable('client_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('MEMBER'), // PRIMARY | JOINT | DIRECTOR | CONTACT | MEMBER — descriptive, shown to staff and in evidence
  canSign: integer('can_sign').notNull().default(1), // 0 = view-only contact (e.g. bookkeeper) who may never be a signer
  status: text('status').notNull().default('ACTIVE'), // ACTIVE | REMOVED
  addedById: uuid('added_by_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  removedAt: timestamp('removed_at', { withTimezone: true }),
}, (t) => [
  uniqueIndex('client_members_client_user_uq').on(t.clientId, t.userId),
  uniqueIndex('client_members_active_user_uq').on(t.userId).where(sql`${t.status} = 'ACTIVE'`),
]);

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: text('token_hash').notNull(), // sha256 of the raw token; raw token exists only inside the emailed link
  userId: uuid('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('invitations_token_uq').on(t.tokenHash)]);

export const documentRequests = pgTable('document_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  instructions: text('instructions'),
  deadline: timestamp('deadline', { withTimezone: true }),
  status: requestStatusEnum('status').notNull().default('REQUESTED'),
  requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  requestId: uuid('request_id').references(() => documentRequests.id),
  driveFileId: text('drive_file_id').notNull(), // server-side only — never serialised to the browser
  originalName: text('original_name').notNull(),
  storedName: text('stored_name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  uploadedById: uuid('uploaded_by_id').notNull().references(() => users.id),
  status: requestStatusEnum('status').notNull().default('UPLOADED'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const deliveries = pgTable('deliveries', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  title: text('title').notNull(),
  category: text('category'),
  note: text('note'), // optional staff note shown to the client
  driveFileId: text('drive_file_id').notNull(), // server-side only — never serialised to the browser
  originalName: text('original_name').notNull(),
  storedName: text('stored_name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  version: integer('version').notNull().default(1),
  supersedesId: uuid('supersedes_id'), // previous version, if this is a replacement (self-reference; enforced in code)
  status: deliveryStatusEnum('status').notNull().default('READY_FOR_REVIEW'),
  uploadedById: uuid('uploaded_by_id').notNull().references(() => users.id),
  sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
  viewedAt: timestamp('viewed_at', { withTimezone: true }),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
  withdrawnAt: timestamp('withdrawn_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const deliveryResponses = pgTable('delivery_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  deliveryId: uuid('delivery_id').notNull().references(() => deliveries.id),
  clientId: uuid('client_id').notNull().references(() => clients.id), // denormalised for isolation checks
  respondedById: uuid('responded_by_id').notNull().references(() => users.id),
  decision: deliveryDecisionEnum('decision').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorUserId: uuid('actor_user_id').references(() => users.id),
  action: text('action').notNull(), // LOGIN | LOGIN_FAILED | LOGOUT | INVITE_CREATED | INVITE_ACCEPTED | REQUEST_CREATED | UPLOAD | STATUS_CHANGE | CLIENT_CREATED | ...
  targetType: text('target_type'),
  targetId: text('target_id'),
  ip: text('ip'),
  meta: jsonb('meta'), // non-sensitive metadata only — never contents, passwords, tokens
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/* ═══════════════════════════ E-signature / approval (feat/portal-esign) ═══════════════════════════
 * A signature_request ("envelope") bundles one or more deliveries (frozen by SHA-256 at creation),
 * one or more signers (each with their own authenticated, evidenced signing event), the fields to
 * place, an append-only event log, and — on completion — an evidence record + sealed PDF.
 * Nothing here ever mutates the original delivery row or its Drive file.
 */
export const sigActionEnum = pgEnum('sig_action', ['APPROVAL', 'SIGNATURE', 'APPROVAL_AND_SIGNATURE']);
export const sigRequestStatusEnum = pgEnum('sig_request_status', [
  'DRAFT', 'AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED', 'COMPLETED', 'DECLINED', 'VOIDED', 'EXPIRED', 'SUPERSEDED',
]);
export const sigSignerStatusEnum = pgEnum('sig_signer_status', ['PENDING', 'VIEWED', 'CONSENTED', 'APPROVED', 'SIGNED', 'DECLINED']);
export const sigFieldTypeEnum = pgEnum('sig_field_type', ['SIGNATURE', 'INITIALS', 'DATE', 'NAME', 'CHECKBOX', 'ACKNOWLEDGEMENT']);
export const sigDocKindEnum = pgEnum('sig_doc_kind', ['GENERAL', 'TAX_RETURN', 'ENGAGEMENT_LETTER', 'ADVISORY', 'DECLARATION', 'IRS_8879', 'IRS_8878']);
export const idvMethodEnum = pgEnum('idv_method', ['IN_PERSON_PHOTO_ID', 'THIRD_PARTY_KBA', 'MULTI_YEAR_RELATIONSHIP', 'VIDEO_PHOTO_ID']);

export const signatureRequests = pgTable('signature_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  title: text('title').notNull(),
  action: sigActionEnum('action').notNull(),
  docKind: sigDocKindEnum('doc_kind').notNull().default('GENERAL'),
  signingOrder: text('signing_order').notNull().default('PARALLEL'), // PARALLEL | SEQUENTIAL
  status: sigRequestStatusEnum('status').notNull().default('DRAFT'),
  message: text('message'),
  dueAt: timestamp('due_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  consentVersion: text('consent_version').notNull(), // wording version signers must accept
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  closedAt: timestamp('closed_at', { withTimezone: true }), // declined / voided / expired / superseded
  closedReason: text('closed_reason'),
  supersededById: uuid('superseded_by_id'),
  sealedDriveFileId: text('sealed_drive_file_id'), // server-side only
  sealedSha256: text('sealed_sha256'),
  evidenceDriveFileId: text('evidence_drive_file_id'), // server-side only
  evidenceSha256: text('evidence_sha256'),
  lastReminderAt: timestamp('last_reminder_at', { withTimezone: true }),
  // Retention (see esign-retention.ts): class chosen from document type; retain_until computed at completion;
  // a legal hold suspends any purge indefinitely. Nothing in the application deletes evidence — these fields
  // govern the documented administrative purge procedure only.
  retentionClass: text('retention_class').notNull().default('STANDARD_7Y'),
  retainUntil: timestamp('retain_until', { withTimezone: true }),
  legalHoldAt: timestamp('legal_hold_at', { withTimezone: true }),
  legalHoldReason: text('legal_hold_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Which delivery version(s) the request covers; the hash is computed when the request is created and never changes. */
export const signatureRequestDocuments = pgTable('signature_request_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').notNull().references(() => signatureRequests.id),
  deliveryId: uuid('delivery_id').notNull().references(() => deliveries.id),
  deliveryVersion: integer('delivery_version').notNull(),
  position: integer('position').notNull().default(1),
  frozenSha256: text('frozen_sha256').notNull(),
  frozenSizeBytes: integer('frozen_size_bytes').notNull(),
  frozenAt: timestamp('frozen_at', { withTimezone: true }).notNull().defaultNow(),
  requiresSignature: integer('requires_signature').notNull().default(1), // 1 = sign fields placed on this doc; 0 = review only
}, (t) => [uniqueIndex('sig_req_doc_uq').on(t.requestId, t.deliveryId)]);

export const signatureSigners = pgTable('signature_signers', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').notNull().references(() => signatureRequests.id),
  userId: uuid('user_id').notNull().references(() => users.id), // the authenticated portal user who must sign
  clientId: uuid('client_id').notNull().references(() => clients.id), // denormalised for isolation checks
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('SIGNER'), // SIGNER | APPROVER | COUNTERSIGNER
  sequence: integer('sequence').notNull().default(1),
  status: sigSignerStatusEnum('status').notNull().default('PENDING'),
  viewedAt: timestamp('viewed_at', { withTimezone: true }),
  consentedAt: timestamp('consented_at', { withTimezone: true }),
  consentVersion: text('consent_version'),
  otpVerifiedAt: timestamp('otp_verified_at', { withTimezone: true }),
  otpHash: text('otp_hash'), // sha256 of the one-time code; never the code
  otpExpiresAt: timestamp('otp_expires_at', { withTimezone: true }),
  otpAttempts: integer('otp_attempts').notNull().default(0),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  signedAt: timestamp('signed_at', { withTimezone: true }),
  declinedAt: timestamp('declined_at', { withTimezone: true }),
  declineReason: text('decline_reason'),
  signatureMethod: text('signature_method'), // TYPED | DRAWN | CLICK
  signatureText: text('signature_text'), // typed name as rendered
  signatureImagePng: text('signature_image_png'), // base64 PNG for DRAWN; bounded server-side
  ip: text('ip'),
  userAgent: text('user_agent'),
  authMethod: text('auth_method'), // e.g. PASSWORD_SESSION+EMAIL_OTP
  identityVerificationId: uuid('identity_verification_id'),
}, (t) => [uniqueIndex('sig_signer_req_user_uq').on(t.requestId, t.userId)]);

export const signatureFields = pgTable('signature_fields', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').notNull().references(() => signatureRequests.id),
  requestDocumentId: uuid('request_document_id').notNull().references(() => signatureRequestDocuments.id),
  signerId: uuid('signer_id').notNull().references(() => signatureSigners.id),
  type: sigFieldTypeEnum('type').notNull(),
  page: integer('page').notNull(), // 1-based; 0 = append to the signing page
  xPct: integer('x_pct').notNull().default(0), // position as % of page width/height ×100 (0–10000) — no coordinate maths for staff
  yPct: integer('y_pct').notNull().default(0),
  wPct: integer('w_pct').notNull().default(2500),
  hPct: integer('h_pct').notNull().default(600),
  required: integer('required').notNull().default(1),
  label: text('label'),
  valueText: text('value_text'), // filled value for NAME/DATE/CHECKBOX/ACK
  filledAt: timestamp('filled_at', { withTimezone: true }),
});

/** Append-only. No UPDATE/DELETE path exists in code; the DB migration also revokes UPDATE/DELETE from the app role where supported. */
export const signatureEvents = pgTable('signature_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  seq: bigserial('seq', { mode: 'number' }).notNull(), // insertion order — the chain is verified in seq order, never by wall-clock ties
  requestId: uuid('request_id').notNull().references(() => signatureRequests.id),
  signerId: uuid('signer_id').references(() => signatureSigners.id),
  actorUserId: uuid('actor_user_id').references(() => users.id),
  type: text('type').notNull(), // see ESIGN_EVENT_TYPES
  at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  meta: jsonb('meta'),
  prevHash: text('prev_hash'), // hash chain: sha256(prevHash + canonical(event))
  hash: text('hash').notNull(),
});

export const signatureEvidence = pgTable('signature_evidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').notNull().references(() => signatureRequests.id),
  certificateJson: jsonb('certificate_json').notNull(), // full evidence record (also rendered into the sealed PDF and a standalone certificate)
  certificateSha256: text('certificate_sha256').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('sig_evidence_req_uq').on(t.requestId)]);

export const esignConsents = pgTable('esign_consents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  version: text('version').notNull(),
  textSha256: text('text_sha256').notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }).notNull().defaultNow(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  requestId: uuid('request_id'),
});

/** IRS Pub. 1345 identity verification record — required before a REMOTE e-signature on Form 8878/8879. Recorded by staff. */
export const identityVerifications = pgTable('identity_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  method: idvMethodEnum('method').notNull(),
  verifiedById: uuid('verified_by_id').notNull().references(() => users.id),
  verifiedAt: timestamp('verified_at', { withTimezone: true }).notNull().defaultNow(),
  providerRef: text('provider_ref'), // KBA provider transaction id, if any
  note: text('note'), // e.g. "UK passport checked on video call" — no document numbers
  validUntil: timestamp('valid_until', { withTimezone: true }),
});
