import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/indexnow/cron/route';

const call = (auth?: string) =>
  GET(new Request('https://www.usukaccountants.com/api/indexnow/cron', {
    headers: auth ? { authorization: auth } : {},
  }));

describe('weekly IndexNow cron', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('refuses when no secret is configured', async () => {
    vi.stubEnv('CRON_SECRET', '');
    expect((await call('Bearer anything')).status).toBe(401);
  });

  it('refuses a missing or wrong secret and sends nothing', async () => {
    vi.stubEnv('CRON_SECRET', 'right-secret');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await call()).status).toBe(401);
    expect((await call('Bearer wrong-secret')).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits each sitemap URL once with the right secret', async () => {
    vi.stubEnv('CRON_SECRET', 'right-secret');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const res = await call('Bearer right-secret');
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.host).toBe('www.usukaccountants.com');
    expect(body.urlList.length).toBeGreaterThan(150);
    expect(new Set(body.urlList).size).toBe(body.urlList.length);
    expect(body.urlList.every((u: string) => u.startsWith('https://www.usukaccountants.com'))).toBe(true);
  });
});
