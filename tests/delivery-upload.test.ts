import { describe, it, expect } from 'vitest';
import { deliveryUploadSig, deliveryUploadSigValid, deliveryStoredName, DIRECT_UPLOAD_MAX_BYTES } from '@/lib/portal/delivery-upload';

const SECRET = 'test-secret';
const claim = { uid: 'u1', clientId: 'c1', storedName: '2026-11-25_v1_pack.pdf', size: 8_553_335, supersedesId: null };

describe('large delivery upload signature', () => {
  it('accepts the exact claim the session was opened for', () => {
    expect(deliveryUploadSigValid(SECRET, claim, deliveryUploadSig(SECRET, claim))).toBe(true);
  });
  it('rejects a different client, staff member, name, size or replaced version', () => {
    const sig = deliveryUploadSig(SECRET, claim);
    expect(deliveryUploadSigValid(SECRET, { ...claim, clientId: 'c2' }, sig)).toBe(false);
    expect(deliveryUploadSigValid(SECRET, { ...claim, uid: 'u2' }, sig)).toBe(false);
    expect(deliveryUploadSigValid(SECRET, { ...claim, storedName: '2026-11-25_v1_other.pdf' }, sig)).toBe(false);
    expect(deliveryUploadSigValid(SECRET, { ...claim, size: claim.size + 1 }, sig)).toBe(false);
    expect(deliveryUploadSigValid(SECRET, { ...claim, supersedesId: 'd1' }, sig)).toBe(false);
  });
  it('rejects empty, malformed and wrong-secret signatures', () => {
    expect(deliveryUploadSigValid(SECRET, claim, '')).toBe(false);
    expect(deliveryUploadSigValid(SECRET, claim, 'nope')).toBe(false);
    expect(deliveryUploadSigValid(SECRET, claim, deliveryUploadSig('other', claim))).toBe(false);
  });
  it('fails closed when the secret is missing', () => {
    expect(() => deliveryUploadSig('', claim)).toThrow();
    expect(deliveryUploadSigValid('', claim, 'anything')).toBe(false);
  });
  it('a client-upload style signature can never pass as a delivery', () => {
    expect(deliveryUploadSig(SECRET, claim)).not.toBe(deliveryUploadSig(SECRET, { ...claim, uid: claim.clientId, clientId: claim.uid }));
  });
});

describe('delivery stored name and size threshold', () => {
  it('carries date, version and name', () => {
    expect(deliveryStoredName(2, 'pack.pdf', new Date('2026-11-25T09:00:00Z'))).toBe('2026-11-25_v2_pack.pdf');
  });
  it('keeps the direct route under the hosting request limit', () => {
    expect(DIRECT_UPLOAD_MAX_BYTES).toBeLessThanOrEqual(4 * 1024 * 1024);
  });
});
