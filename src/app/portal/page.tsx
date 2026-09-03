import { redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import { portalSession, signOut } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: 'Awaiting your upload',
  UPLOADED: 'Uploaded — with our team',
  RECEIVED: 'Received',
  UNDER_REVIEW: 'Under review',
  COMPLETED: 'Completed',
};

export default async function Dashboard() {
  const session = await portalSession();
  if (!session) redirect('/portal/login');
  if (session.role !== 'CLIENT' || !session.clientId) redirect('/portal/login'); // staff area comes in /admin phase

  const [client] = await db.select({ displayName: tables.clients.displayName })
    .from(tables.clients).where(eq(tables.clients.id, session.clientId)).limit(1);

  const requests = await db.select()
    .from(tables.documentRequests)
    .where(eq(tables.documentRequests.clientId, session.clientId))
    .orderBy(desc(tables.documentRequests.requestedAt));

  const open = requests.filter(r => r.status === 'REQUESTED');

  async function doLogout() {
    'use server';
    await signOut({ redirectTo: '/portal/login' });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Welcome{client ? `, ${client.displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {open.length === 0
              ? 'Nothing is waiting on you right now.'
              : `You have ${open.length} document${open.length === 1 ? '' : 's'} to upload.`}
          </p>
        </div>
        <form action={doLogout}>
          <button className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">
            Log out
          </button>
        </form>
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted">Documents requested</h2>
      <div className="mt-3 space-y-3">
        {requests.length === 0 ? (
          <p className="rounded-2xl border border-mist bg-white p-7 text-sm text-muted">
            No document requests yet. When our team needs something from you, it will appear here.
          </p>
        ) : requests.map(r => (
          <div key={r.id} className="flex items-center justify-between gap-4 rounded-2xl border border-mist bg-white p-6">
            <div>
              <p className="font-semibold text-ink">{r.title}</p>
              {r.description ? <p className="mt-0.5 text-sm text-muted">{r.description}</p> : null}
              {r.deadline ? <p className="mt-1 text-xs text-muted">Needed by {r.deadline.toLocaleDateString('en-GB')}</p> : null}
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${r.status === 'REQUESTED' ? 'bg-gold/10 text-gold-antique' : 'bg-mist text-muted'}`}>
              {STATUS_LABEL[r.status] ?? r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
