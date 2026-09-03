import { redirect } from 'next/navigation';
import { portalSession } from '@/lib/portal/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Staff — US UK Accountants Portal', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await portalSession();
  if (!s) redirect('/portal/login');
  if (s.role === 'CLIENT') redirect('/portal'); // clients can never see staff pages
  return (
    <div>
      <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted">Staff area</p>
      {children}
    </div>
  );
}
