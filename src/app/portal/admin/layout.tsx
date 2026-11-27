import Link from 'next/link';
import { redirect } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { portalSession, signOut } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import AdminNav from '@/components/portal/classic/AdminNav';
import { btn } from '@/components/portal/classic/ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Staff — US UK Accountants Portal', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await portalSession();
  if (!s) redirect('/portal/login');
  if (s.role === 'CLIENT') redirect('/portal'); // clients can never see staff pages
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(tables.documentRequests)
    .where(eq(tables.documentRequests.status, 'UPLOADED'));
  async function doLogout() {
    'use server';
    await signOut({ redirectTo: '/portal/login' });
  }
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-mist">
        <AdminNav reviewCount={Number(n)} />
        <div className="flex items-center gap-2 pb-3">
          <Link href="/portal/admin/new" className={btn.primary}>New client</Link>
          <form action={doLogout}>
            <button className={btn.secondary}>Log out</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
