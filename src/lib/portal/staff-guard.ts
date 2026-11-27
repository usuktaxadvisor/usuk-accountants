import { redirect } from 'next/navigation';
import { portalSession, type PortalSession } from './auth';

/** Page guard for staff client sections: no session goes to login, a client session goes back to its own portal. */
export async function requireStaffPage(): Promise<PortalSession> {
  const s = await portalSession();
  if (!s) redirect('/portal/login');
  if (s.role === 'CLIENT') redirect('/portal');
  return s;
}
