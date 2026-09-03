import { describe, it, expect } from 'vitest';
import { rateLimit } from '@/lib/portal/ratelimit';

describe('rate limiter', () => {
  it('allows up to max then blocks within the window', () => {
    const key = `k${Math.random()}`;
    for (let i = 0; i < 5; i++) expect(rateLimit(key, 5, 60_000)).toBe(true);
    expect(rateLimit(key, 5, 60_000)).toBe(false);
  });
});
