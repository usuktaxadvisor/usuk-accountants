/**
 * Minimal fixed-window rate limiter, per key, in instance memory.
 * KNOWN LIMITATION (documented): on serverless, each instance keeps its
 * own window, so the effective limit is per-instance. Acceptable as a
 * brake on brute force in v1; swap for a shared store (e.g. Upstash)
 * without touching call sites if stronger guarantees are needed.
 */
const windows = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const w = windows.get(key);
  if (!w || now > w.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (w.count >= max) return false;
  w.count += 1;
  return true;
}
