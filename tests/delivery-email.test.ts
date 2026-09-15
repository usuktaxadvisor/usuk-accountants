import { describe, it, expect } from 'vitest';
import { deliveryReadyHtml, deliveryResponseHtml } from '@/lib/portal/email';

describe('delivery emails', () => {
  it('escapes HTML in client-supplied and staff-supplied text', () => {
    const html = deliveryReadyHtml('<b>Kelly</b>', 'Return <script>alert(1)</script>', 'Note & "quotes"', 'https://x/portal');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;b&gt;Kelly&lt;/b&gt;');
    expect(html).toContain('Note &amp; &quot;quotes&quot;');
  });
  it('never attaches or links the document itself', () => {
    const html = deliveryReadyHtml('K', 'T', null, 'https://x/portal');
    expect(html).toContain('https://x/portal');
    expect(html).not.toMatch(/drive\.google|alt=media|\/file/);
  });
  it('staff response email escapes the client comment', () => {
    const html = deliveryResponseHtml('Client', 'CL-0001', 'T', 'CHANGES_REQUESTED', '<img src=x onerror=alert(1)>');
    expect(html).not.toContain('<img');
    expect(html).toContain('REQUESTED CHANGES');
  });
});
