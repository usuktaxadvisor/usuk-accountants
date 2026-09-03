import { pgTable, pgEnum, text, uuid, timestamp, integer, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['CLIENT', 'STAFF', 'ADMIN']);
export const userStatusEnum = pgEnum('user_status', ['INVITED', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED']);
export const requestStatusEnum = pgEnum('request_status', ['REQUESTED', 'UPLOADED', 'RECEIVED', 'UNDER_REVIEW', 'COMPLETED']);

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
  status: userStatusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('clients_ref_uq').on(t.clientRef), uniqueIndex('clients_user_uq').on(t.userId)]);

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
