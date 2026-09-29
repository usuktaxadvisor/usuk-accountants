import Link from 'next/link';
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap items-center gap-2" aria-label="Staff navigation">
          <Link href="/portal/admin" className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">All clients</Link>
          <Link href="/portal/admin/esign" className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">Signatures &amp; approvals</Link>
          <Link href="/portal/admin/new" className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">New client</Link>
        </nav>
        <form action={doLogout}>
          <button className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
