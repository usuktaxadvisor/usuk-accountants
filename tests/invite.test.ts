import { describe, it, expect } from 'vitest';
import { newInviteToken } from '@/lib/portal/invite';
import { createHash } from 'node:crypto';

describe('invitation tokens', () => {
  it('raw token is high-entropy and hash matches sha256', () => {
    const { raw, hash } = newInviteToken();
    expect(raw.length).toBeGreaterThanOrEqual(43);
    expect(hash).toBe(createHash('sha256').update(raw).digest('hex'));
  });
  it('tokens are unique', () => {
    const a = newInviteToken(); const b = newInviteToken();
    expect(a.raw).not.toBe(b.raw);
  });
});
