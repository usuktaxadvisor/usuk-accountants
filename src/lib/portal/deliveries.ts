import { and, desc, eq } from 'drizzle-orm';
import { db, tables } from './db';

/**
 * Staff → client document deliveries: status rules and ownership-scoped
 * loaders. The pure functions at the top carry the workflow rules and are
 * unit-tested; the loaders below are the ONLY way delivery rows are read
 * for a session, so every read is scoped to the caller's client (or to
 * STAFF+) and fails closed with null.
 *
 * Lifecycle:
 *   READY_FOR_REVIEW → VIEWED → APPROVED
 *   READY_FOR_REVIEW → VIEWED → CHANGES_REQUESTED → (staff Replace: new v2 row READY_FOR_REVIEW; v1 → WITHDRAWN)
 *   any active status → WITHDRAWN (staff)
 */
export type DeliveryStatus = 'READY_FOR_REVIEW' | 'VIEWED' | 'APPROVED' | 'CHANGES_REQUESTED' | 'WITHDRAWN';
export type DeliveryDecision = 'APPROVED' | 'CHANGES_REQUESTED';

export const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
  READY_FOR_REVIEW: 'Ready for your review',
  VIEWED: 'Viewed — awaiting your response',
  APPROVED: 'Approved',
  CHANGES_REQUESTED: 'Changes requested',
  WITHDRAWN: 'Withdrawn',
};

export const DELIVERY_CATEGORIES = [
  'Tax return',
  'Draft for review',
  'Report',
  'Advisory document',
  'Engagement / letter',
  'Other',
] as const;

/** A client may only respond while the delivery is live and unanswered. */
export function canClientRespond(status: DeliveryStatus): boolean {
  return status === 'READY_FOR_REVIEW' || status === 'VIEWED';
}

/** A client may open/download anything that is not withdrawn (history stays readable after a response). */
export function canClientAccess(status: DeliveryStatus): boolean {
  return status !== 'WITHDRAWN';
}

/** Staff may withdraw anything not already withdrawn. */
export function canWithdraw(status: DeliveryStatus): boolean {
  return status !== 'WITHDRAWN';
}

/** Staff may issue a replacement version for anything not already withdrawn. */
export function canReplace(status: DeliveryStatus): boolean {
  return status !== 'WITHDRAWN';
}

/** First client access moves READY_FOR_REVIEW → VIEWED; nothing else changes on access. */
export function statusAfterClientView(status: DeliveryStatus): DeliveryStatus {
  return status === 'READY_FOR_REVIEW' ? 'VIEWED' : status;
}

export function statusAfterDecision(decision: DeliveryDecision): DeliveryStatus {
  return decision === 'APPROVED' ? 'APPROVED' : 'CHANGES_REQUESTED';
}

export function isDecision(v: unknown): v is DeliveryDecision {
  return v === 'APPROVED' || v === 'CHANGES_REQUESTED';
}

/** Comment is required when requesting changes, optional on approval; always bounded. */
export function normaliseComment(decision: DeliveryDecision, raw: unknown): { ok: true; comment: string | null } | { ok: false; reason: string } {
  const comment = String(raw ?? '').trim().slice(0, 4000);
  if (decision === 'CHANGES_REQUESTED' && comment.length === 0)
    return { ok: false, reason: 'Please tell us what needs changing.' };
  return { ok: true, comment: comment.length ? comment : null };
}

/* ───────── Ownership-scoped loaders (fail closed) ───────── */

export type DeliveryRow = typeof tables.deliveries.$inferSelect;

/** Client-side read: the row must belong to THIS client. Null on any mismatch — never distinguishes "not yours" from "not found". */
export async function getDeliveryForClient(clientId: string, deliveryId: string): Promise<DeliveryRow | null> {
  if (!clientId || !deliveryId) return null;
  const [row] = await db.select().from(tables.deliveries)
    .where(and(eq(tables.deliveries.id, deliveryId), eq(tables.deliveries.clientId, clientId))).limit(1);
  return row ?? null;
}

/** Staff-side read, scoped to the client the staff page is looking at, so a mistyped id can't reach another client's row. */
export async function getDeliveryForStaff(clientId: string, deliveryId: string): Promise<DeliveryRow | null> {
  if (!clientId || !deliveryId) return null;
  const [row] = await db.select().from(tables.deliveries)
    .where(and(eq(tables.deliveries.id, deliveryId), eq(tables.deliveries.clientId, clientId))).limit(1);
  return row ?? null;
}

export async function listDeliveriesForClient(clientId: string): Promise<DeliveryRow[]> {
  return db.select().from(tables.deliveries)
    .where(eq(tables.deliveries.clientId, clientId))
    .orderBy(desc(tables.deliveries.sentAt));
}

export async function listResponsesForClient(clientId: string) {
  return db.select().from(tables.deliveryResponses)
    .where(eq(tables.deliveryResponses.clientId, clientId))
    .orderBy(desc(tables.deliveryResponses.createdAt));
}
