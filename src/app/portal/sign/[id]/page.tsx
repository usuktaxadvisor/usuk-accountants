import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { portalSession } from '@/lib/portal/auth';
import { getRequestForClient, getSignerForUser } from '@/lib/portal/esign-store';
import { SIG_ACTION_LABEL } from '@/lib/portal/esign';
import SignFlow from '@/components/portal/SignFlow';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Review & sign — US UK Accountants Portal', robots: { index: false, follow: false } };

export default async function SignPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await portalSession();
  if (!session) redirect('/portal/login');
  if (session.role !== 'CLIENT' || !session.clientId) redirect('/portal/admin');
  const { id } = await params;
  const req = await getRequestForClient(session.clientId, id);
  if (!req || !(await getSignerForUser(req.id, session.uid))) notFound();
  return (
    <div>
      <Link href="/portal" className="text-xs font-semibold uppercase tracking-widest text-muted">← Your portal</Link>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{req.title}</h1>
      <p className="mt-1 text-sm text-muted">{SIG_ACTION_LABEL[req.action]}{req.dueAt ? ` · please complete by ${req.dueAt.toISOString().slice(0, 10)}` : ''}</p>
      <div className="mt-6"><SignFlow requestId={req.id} /></div>
    </div>
  );
}
