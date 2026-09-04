import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge-safe outer gate. Deliberately imports NOTHING from the auth/db
 * stack (Node-only libraries crash Vercel's Edge runtime). It only
 * checks that an Auth.js session cookie exists and redirects/401s when
 * absent. Real authentication + authorization (role, ownership) are
 * re-verified inside every server component and API route on the Node
 * runtime — this gate is a convenience layer, never the security boundary.
 */
const SESSION_COOKIES = ['__Secure-authjs.session-token', 'authjs.session-token'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public/pre-auth paths inside the guarded zone:
  if (
    pathname === '/portal/login' ||
    pathname === '/portal/forgot' ||
    pathname.startsWith('/portal/invite/') ||
    pathname.startsWith('/api/portal/bootstrap')
  ) {
    return NextResponse.next();
  }

  const hasSession = SESSION_COOKIES.some((c) => req.cookies.has(c));
  if (hasSession) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }
  const login = req.nextUrl.clone();
  login.pathname = '/portal/login';
  login.search = '';
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/portal/:path*', '/api/portal/:path*'],
};
