import { createHash, randomBytes, createHmac } from 'node:crypto';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { db, tables } from './db';

/** Invitation tokens: 32 random bytes, base64url in the emailed link, sha256 hash at rest. */
export function newInviteToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString('base64url');
  return { raw, hash: createHash('sha256').update(raw).digest('hex') };
}

export async function createInvitation(userId: string, days = 7): Promise<string> {
  const { raw, hash } = newInviteToken();
  await db.insert(tables.invitations).values({
    userId, tokenHash: hash, expiresAt: new Date(Date.now() + days * 86400_000),
  });
  return raw; // raw token only ever exists inside the emailed link
}

export async function findLiveInvitation(rawToken: string) {
  const hash = createHash('sha256').update(rawToken).digest('hex');
  const [inv] = await db.select().from(tables.invitations)
    .where(and(eq(tables.invitations.tokenHash, hash), isNull(tables.invitations.usedAt), gt(tables.invitations.expiresAt, new Date())))
    .limit(1);
  return inv ?? null;
}

/**
 * Setup key guarding the one-time bootstrap and Google-consent routes.
 * Prefers the plain PORTAL_SETUP_KEY env var (set directly by the admin —
 * what you type is what matches, nothing derived). Falls back to an
 * AUTH_SECRET-derived HMAC when unset.
 */
export function consentStateKey(): string {
  const plain = process.env.PORTAL_SETUP_KEY;
  if (plain && plain.length >= 10) return plain;
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET missing');
  return createHmac('sha256', secret).update('google-consent-v1').digest('base64url').slice(0, 24);
}
