import { redirect } from 'next/navigation';
import { portalSession, signOut } from '@/lib/portal/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Staff — US UK Accountants Portal', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await portalSession();
  if (!s) redirect('/portal/login');
  if (s.role === 'CLIENT') redirect('/portal'); // clients can never see staff pages
  async function doLogout() {
    'use server';
    await signOut({ redirectTo: '/portal/login' });
  }
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">Staff area</p>
        <form action={doLogout}>
          <button className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
