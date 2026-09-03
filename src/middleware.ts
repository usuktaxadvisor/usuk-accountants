export { auth as middleware } from '@/lib/portal/auth';

/**
 * Route guard: everything under /portal (except the login page itself)
 * and every /api/portal endpoint requires an authenticated session.
 * Authorization (role + ownership) is enforced again inside each
 * endpoint — this middleware is the outer gate, never the only check.
 */
export const config = {
  matcher: ['/portal/((?!login).*)', '/api/portal/:path*'],
};
