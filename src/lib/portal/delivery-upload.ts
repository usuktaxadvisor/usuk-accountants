import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Large staff → client deliveries (over Vercel's ≈4.5 MB request-body limit).
 * The browser streams the file straight to a Google resumable-upload session
 * that the server created, then asks the server to finalise. These pure
 * helpers bind the two steps together: the signature ties the finished file
 * to the staff member, client, stored name, size and replaced version that
 * the server approved when it opened the session, so none can be swapped.
 */
export const DIRECT_UPLOAD_MAX_BYTES = 4 * 1024 * 1024; // at or below this, the ordinary multipart route is used

export type DeliveryUploadClaim = {
  uid: string; clientId: string; storedName: string; size: number; supersedesId: string | null;
};

export function deliveryUploadSig(secret: string, c: DeliveryUploadClaim): string {
  if (!secret) throw new Error('AUTH_SECRET missing');
  return createHmac('sha256', secret)
    .update(['delivery', c.uid, c.clientId, c.storedName, String(c.size), c.supersedesId ?? ''].join('|'))
    .digest('base64url');
}

export function deliveryUploadSigValid(secret: string, c: DeliveryUploadClaim, sig: string): boolean {
  if (!secret || !sig) return false;
  const expected = Buffer.from(deliveryUploadSig(secret, c));
  const given = Buffer.from(sig);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Stored name of a delivery file: date, version, sanitised original name. */
export function deliveryStoredName(version: number, safeName: string, now: Date = new Date()): string {
  return `${now.toISOString().slice(0, 10)}_v${version}_${safeName}`;
}
