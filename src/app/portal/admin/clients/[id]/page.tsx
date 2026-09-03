import { notFound, redirect } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';
import { requireRole } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { audit } from '@/lib/portal/audit';

export const dynamic = 'force-dynamic';
const STATUSES = ['REQUESTED', 'UPLOADED', 'RECEIVED', 'UNDER_REVIEW', 'COMPLETED'] as const;

export default async function ClientDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ email?: string }> }) {
  await requireRole('STAFF');
  const { id } = await params;
  const { email } = await searchParams;

  const [client] = await db.select().from(tables.clients).where(eq(tables.clients.id, id)).limit(1);
  if (!client) notFound();

  const requests = await db.select().from(tables.documentRequests)
    .where(eq(tables.documentRequests.clientId, id)).orderBy(desc(tables.documentRequests.requestedAt));
  const docs = await db.select().from(tables.documents)
    .where(eq(tables.documents.clientId, id)).orderBy(desc(tables.documents.createdAt));

  async function createRequest(formData: FormData) {
    'use server';
    const s = await requireRole('STAFF');
    const title = String(formData.get('title') ?? '').trim();
    if (!title) return;
    const description = String(formData.get('description') ?? '').trim() || null;
    const [r] = await db.insert(tables.documentRequests).values({ clientId: id, title, description }).returning({ id: tables.documentRequests.id });
    await audit(s.uid, 'REQUEST_CREATED', { targetType: 'request', targetId: r.id, meta: { clientId: id } });
    redirect(`/portal/admin/clients/${id}`);
  }

  async function setStatus(formData: FormData) {
    'use server';
    const s = await requireRole('STAFF');
    const requestId = String(formData.get('requestId') ?? '');
    const status = String(formData.get('status') ?? '') as typeof STATUSES[number];
    if (!STATUSES.includes(status)) return;
    const [owned] = await db.select({ id: tables.documentRequests.id }).from(tables.documentRequests)
      .where(and(eq(tables.documentRequests.id, requestId), eq(tables.documentRequests.clientId, id))).limit(1);
    if (!owned) return;
    await db.update(tables.documentRequests)
      .set({ status, updatedAt: new Date(), completedAt: status === 'COMPLETED' ? new Date() : null })
      .where(eq(tables.documentRequests.id, requestId));
    await audit(s.uid, 'STATUS_CHANGE', { targetType: 'request', targetId: requestId, meta: { status } });
    redirect(`/portal/admin/clients/${id}`);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">{client.displayName} <span className="ml-2 text-sm font-normal text-muted">{client.clientRef}</span></h1>
      {email === 'failed' ? <p className="mt-2 rounded-xl border border-mist bg-white px-4 py-3 text-sm text-red-700">Client created, but the invitation email could not be sent — check PORTAL_FROM_EMAIL/RESEND settings and re-invite.</p> : null}

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Document requests</h2>
          <form action={createRequest} className="mt-3 space-y-2 rounded-2xl border border-mist bg-white p-5">
            <input name="title" required placeholder="e.g. 2025 UK P60" className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-navy-ink" />
            <input name="description" placeholder="Optional instructions for the client" className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-navy-ink" />
            <button className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink">Request document</button>
          </form>
          <div className="mt-3 space-y-2">
            {requests.map(r => (
              <div key={r.id} className="rounded-2xl border border-mist bg-white px-5 py-4">
                <p className="text-sm font-semibold text-ink">{r.title}</p>
                <form action={setStatus} className="mt-2 flex items-center gap-2">
                  <input type="hidden" name="requestId" value={r.id} />
                  <select name="status" defaultValue={r.status} className="rounded-lg border border-mist px-2 py-1.5 text-xs text-ink">
                    {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <button className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-ink hover:border-navy-ink">Update</button>
                </form>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Uploads</h2>
          <div className="mt-3 space-y-2">
            {docs.length === 0 ? <p className="rounded-2xl border border-mist bg-white p-5 text-sm text-muted">Nothing uploaded yet.</p> : docs.map(d => (
              <div key={d.id} className="rounded-2xl border border-mist bg-white px-5 py-4">
                <p className="text-sm font-semibold text-ink">{d.originalName}</p>
                <p className="text-xs text-muted">{d.createdAt.toLocaleString('en-GB')} · {(d.sizeBytes / 1024 / 1024).toFixed(1)} MB · in Drive as “{d.storedName}”</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
