import Link from 'next/link';
import { desc, eq, sql } from 'drizzle-orm';
import { requireRole } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  await requireRole('STAFF');
  const clientRows = await db.select().from(tables.clients).orderBy(desc(tables.clients.createdAt));
  const openByClient = await db.select({ clientId: tables.documentRequests.clientId, n: sql<number>`count(*)` })
    .from(tables.documentRequests).where(eq(tables.documentRequests.status, 'REQUESTED')).groupBy(tables.documentRequests.clientId);
  const docsByClient = await db.select({ clientId: tables.documents.clientId, n: sql<number>`count(*)` })
    .from(tables.documents).groupBy(tables.documents.clientId);
  const openMap = new Map(openByClient.map(r => [r.clientId, Number(r.n)]));
  const docMap = new Map(docsByClient.map(r => [r.clientId, Number(r.n)]));
  const rows = clientRows.map(c => ({
    id: c.id, ref: c.clientRef, name: c.displayName, status: c.status,
    openRequests: openMap.get(c.id) ?? 0, uploads: docMap.get(c.id) ?? 0,
  }));

  const pendingReview = await db.select({ id: tables.documentRequests.id })
    .from(tables.documentRequests).where(eq(tables.documentRequests.status, 'UPLOADED'));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Clients</h1>
          <p className="mt-1 text-sm text-muted">
            {pendingReview.length === 0 ? 'No uploads awaiting review.' : `${pendingReview.length} upload${pendingReview.length === 1 ? '' : 's'} awaiting review.`}
          </p>
        </div>
        <Link href="/portal/admin/new" className="rounded-xl bg-navy-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink">
          New client
        </Link>
      </div>
      <div className="mt-6 space-y-2">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-mist bg-white p-7 text-sm text-muted">No clients yet — create the first with “New client”.</p>
        ) : rows.map(c => (
          <Link key={c.id} href={`/portal/admin/clients/${c.id}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-mist bg-white px-6 py-4 transition-colors hover:border-navy-ink">
            <div>
              <p className="font-semibold text-ink">{c.name} <span className="ml-2 text-xs font-normal text-muted">{c.ref}</span></p>
              <p className="text-xs text-muted">{Number(c.openRequests)} open request(s) · {Number(c.uploads)} document(s)</p>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-muted">{c.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
