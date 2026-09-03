import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, tables } from './db';
import { audit } from './audit';

/**
 * Auth.js v5 — invitation-only credentials sign-in.
 * JWT session strategy (no DB adapter needed for Credentials);
 * the token carries { uid, role, clientId } and is the single
 * source of truth for authorization on the server.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 }, // 8h sessions
  pages: { signIn: '/portal/login' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = String(creds?.email ?? '').trim().toLowerCase();
        const password = String(creds?.password ?? '');
        if (!email || !password) return null;

        const [user] = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1);
        if (!user || !user.passwordHash || user.status !== 'ACTIVE') {
          await audit(null, 'LOGIN_FAILED', { targetType: 'user', meta: { emailDomain: email.split('@')[1] ?? '' } });
          return null;
        }
        const ok = await compare(password, user.passwordHash);
        if (!ok) {
          await audit(user.id, 'LOGIN_FAILED', { targetType: 'user', targetId: user.id });
          return null;
        }
        let clientId: string | null = null;
        if (user.role === 'CLIENT') {
          const [client] = await db.select({ id: tables.clients.id }).from(tables.clients).where(eq(tables.clients.userId, user.id)).limit(1);
          clientId = client?.id ?? null;
        }
        await audit(user.id, 'LOGIN', { targetType: 'user', targetId: user.id });
        return { id: user.id, email: user.email, name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email, role: user.role, clientId } as never;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; role?: string; clientId?: string | null };
        token.uid = u.id;
        token.role = u.role;
        token.clientId = u.clientId ?? null;
      }
      return token;
    },
    session({ session, token }) {
      (session as { uid?: unknown }).uid = token.uid;
      (session as { role?: unknown }).role = token.role;
      (session as { clientId?: unknown }).clientId = token.clientId ?? null;
      return session;
    },
  },
});

export type PortalSession = { uid: string; role: 'CLIENT' | 'STAFF' | 'ADMIN'; clientId: string | null };

/** Server-side session accessor with types; returns null when unauthenticated. */
export async function portalSession(): Promise<PortalSession | null> {
  const s = (await auth()) as (Awaited<ReturnType<typeof auth>> & Partial<PortalSession>) | null;
  if (!s?.uid || !s.role) return null;
  return { uid: String(s.uid), role: s.role as PortalSession['role'], clientId: (s.clientId as string | null) ?? null };
}

/** Guard helper: require a role (or above). Order: CLIENT < STAFF < ADMIN. */
const rank = { CLIENT: 0, STAFF: 1, ADMIN: 2 } as const;
export async function requireRole(min: keyof typeof rank): Promise<PortalSession> {
  const s = await portalSession();
  if (!s || rank[s.role] < rank[min]) throw new PortalAuthError(s ? 403 : 401);
  return s;
}
export class PortalAuthError extends Error {
  constructor(public status: 401 | 403 | 404) { super(String(status)); }
}
