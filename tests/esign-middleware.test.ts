import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const req = (path: string, cookie?: string) => new NextRequest(new URL(path, 'https://portal.example.test'), { headers: cookie ? { cookie } : {} });

describe('portal edge gate and the e-sign cron', () => {
  it('lets Vercel Cron reach /api/portal/esign/cron without a session cookie (the route enforces CRON_SECRET)', () => {
    const res = middleware(req('/api/portal/esign/cron'));
    expect(res.status).toBe(200); // NextResponse.next()
  });
  it('still blocks every other e-sign API path without a session', () => {
    for (const p of ['/api/portal/esign/requests', '/api/portal/esign/requests/x/sign', '/api/portal/esign/requests/x/evidence', '/api/portal/esign/idv']) {
      expect(middleware(req(p)).status).toBe(401);
    }
    expect(middleware(req('/portal/sign/x')).status).toBe(307);
  });
  it('passes requests that carry a session cookie through to the route (which re-authenticates)', () => {
    expect(middleware(req('/api/portal/esign/requests/x/sign', 'authjs.session-token=abc')).status).toBe(200);
  });
});
