import { NextResponse } from 'next/server';
import { exchangeCodeForRefreshToken } from '@/lib/portal/drive';
import { consentStateKey } from '@/lib/portal/invite';

/**
 * OAuth callback for the one-time refresh-token mint. Verifies state,
 * exchanges the code, and shows the refresh token ONCE for Sam to copy
 * into Vercel env vars. The token is never logged or stored by the app.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state || state !== consentStateKey()) return new NextResponse('Not found', { status: 404 });
  try {
    const refresh = await exchangeCodeForRefreshToken(code);
    if (!refresh) {
      return new NextResponse(
        'Google returned no refresh token. Remove the app at myaccount.google.com/permissions and run the consent link again.',
        { status: 400, headers: { 'content-type': 'text/plain' } },
      );
    }
    const html = `<!doctype html><meta name="robots" content="noindex"><body style="font-family:system-ui;max-width:640px;margin:4rem auto;line-height:1.6">
<h2>Drive connection authorised ✓</h2>
<p>Copy the value below into the Vercel environment variable <b>GOOGLE_REFRESH_TOKEN</b> now — it is shown only this once and is not stored anywhere by the portal.</p>
<pre style="background:#f4f4f4;padding:1rem;border-radius:8px;white-space:break-spaces;word-break:break-all">${refresh}</pre>
<p>Then redeploy. You can close this tab afterwards.</p></body>`;
    return new NextResponse(html, { headers: { 'content-type': 'text/html', 'cache-control': 'no-store' } });
  } catch (e) {
    console.error('[portal:oauth-callback]', e instanceof Error ? e.message : e);
    return new NextResponse('Something went wrong. Please try again.', { status: 500 });
  }
}
