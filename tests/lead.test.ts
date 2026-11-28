import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/lead/route';
import { buildLeadEmail, sendNotification, DELIVERY_FAILED_MESSAGE } from '@/lib/lead';

const ENV = { RESEND_API_KEY: 'k', LEAD_NOTIFY_TO: 'to@example.test', LEAD_NOTIFY_FROM: 'from@example.test' };
const lead = { type: 'contact' as const, name: 'Test Person', email: 'person@example.test', situation: 'us-in-uk', message: 'Line one\nLine two', source: 'service:/services/us-expat-tax/fbar-filing', page: '/services/us-expat-tax/fbar-filing' };
const noWait = async () => {};
let n = 0;
const req = (body: unknown) => new Request('https://example.test/api/lead', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${(n += 1)}` }, body: JSON.stringify(body),
});

describe('lead notification', () => {
  beforeEach(() => { Object.assign(process.env, ENV); vi.spyOn(console, 'error').mockImplementation(() => {}); vi.spyOn(console, 'info').mockImplementation(() => {}); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); for (const k of Object.keys(ENV)) delete process.env[k]; });

  it('builds a readable plain-text part with one field per line and the page it came from', () => {
    const { subject, text, html } = buildLeadEmail(lead);
    expect(subject).toBe('New contact lead — Test Person');
    expect(text).toContain('Name: Test Person');
    expect(text).toContain('Email: person@example.test');
    expect(text).toContain('Sent from page: /services/us-expat-tax/fbar-filing');
    expect(html).toContain('Sent from page');
  });

  it('escapes HTML in every field', () => {
    const { html } = buildLeadEmail({ ...lead, name: '<script>x</script>', message: 'a & b "c"' });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('a &amp; b &quot;c&quot;');
  });

  it('retries once and reports delivery when the second attempt succeeds', async () => {
    const f = vi.fn().mockResolvedValueOnce(new Response('quota', { status: 429 })).mockResolvedValueOnce(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', f);
    expect(await sendNotification(lead, noWait)).toEqual({ delivered: true, configured: true });
    expect(f).toHaveBeenCalledTimes(2);
    expect(JSON.parse(f.mock.calls[0][1].body).text).toContain('Name: Test Person');
  });

  it('reports failure after two failed attempts, including a thrown network error', async () => {
    const f = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(new Response('down', { status: 500 }));
    vi.stubGlobal('fetch', f);
    expect(await sendNotification(lead, noWait)).toEqual({ delivered: false, configured: true });
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('tells the visitor when an enquiry could not be delivered, instead of showing success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('quota', { status: 429 })));
    vi.useFakeTimers();
    const p = POST(req(lead));
    await vi.runAllTimersAsync();
    const res = await p;
    vi.useRealTimers();
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe(DELIVERY_FAILED_MESSAGE);
    expect(json.error).toContain('hello@usukaccountants.com');
  });

  it('returns success when the notification is delivered', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));
    const res = await POST(req(lead));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, delivered: true });
  });

  it('still accepts a newsletter sign-up when email delivery fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('down', { status: 500 })));
    vi.useFakeTimers();
    const p = POST(req({ type: 'newsletter', email: 'person@example.test' }));
    await vi.runAllTimersAsync();
    const res = await p;
    vi.useRealTimers();
    expect(res.status).toBe(200);
  });

  it('accepts and logs when email is not configured (local development)', async () => {
    for (const k of Object.keys(ENV)) delete process.env[k];
    const res = await POST(req(lead));
    expect(await res.json()).toEqual({ ok: true, delivered: false });
  });

  it('rejects a page value that is not a site path', async () => {
    const res = await POST(req({ ...lead, page: 'https://evil.example/x' }));
    expect(res.status).toBe(400);
  });
});
