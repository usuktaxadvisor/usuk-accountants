import { desc, eq, sql } from 'drizzle-orm';
import { requireRole } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import ClientsTable, { type ClientRow } from '@/components/portal/classic/ClientsTable';
import { PageTitle, Panel, Stat } from '@/components/portal/classic/ui';

export const dynamic = 'force-dynamic';

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await requireRole('STAFF');
  const { view: rawView } = await searchParams;
  const view = rawView === 'archived' || rawView === 'all' ? rawView : 'active';
  // Archived clients never clutter the working list; "Archived" and "All" are one click away.
  const allClients = await db.select().from(tables.clients).orderBy(desc(tables.clients.createdAt));
  const clientRows = view === 'active' ? allClients.filter(c => !c.archivedAt) : view === 'archived' ? allClients.filter(c => !!c.archivedAt) : allClients;

  const reqCounts = await db.select({ clientId: tables.documentRequests.clientId, status: tables.documentRequests.status, n: sql<number>`count(*)` })
    .from(tables.documentRequests).groupBy(tables.documentRequests.clientId, tables.documentRequests.status);
  const docsByClient = await db.select({ clientId: tables.documents.clientId, n: sql<number>`count(*)` })
    .from(tables.documents).groupBy(tables.documents.clientId);
  const [{ sigOpen }] = await db.select({ sigOpen: sql<number>`count(*)` }).from(tables.signatureRequests)
    .where(sql`${tables.signatureRequests.status} in ('AWAITING_CLIENT','VIEWED','PARTIALLY_SIGNED')`);
  const [{ followUp }] = await db.select({ followUp: sql<number>`count(*)` }).from(tables.documentRequests)
    .where(eq(tables.documentRequests.status, 'UNDER_REVIEW'));

  const count = (clientId: string, status: string) => Number(reqCounts.find(r => r.clientId === clientId && r.status === status)?.n ?? 0);
  const docMap = new Map(docsByClient.map(r => [r.clientId, Number(r.n)]));
  const rows: ClientRow[] = clientRows.map(c => ({
    id: c.id, ref: c.clientRef, name: c.displayName, archived: !!c.archivedAt,
    open: count(c.id, 'REQUESTED'), review: count(c.id, 'UPLOADED'), docs: docMap.get(c.id) ?? 0,
  }));
  const active = allClients.filter(c => !c.archivedAt);
  const totalReview = reqCounts.filter(r => r.status === 'UPLOADED').reduce((a, r) => a + Number(r.n), 0);
  const totalOpen = reqCounts.filter(r => r.status === 'REQUESTED' && active.some(c => c.id === r.clientId)).reduce((a, r) => a + Number(r.n), 0);

  return (
    <div>
      <PageTitle title="Clients" meta={totalReview ? `${totalReview} upload${totalReview === 1 ? '' : 's'} waiting for your review.` : 'Every upload has been reviewed.'} />

      <Panel className="mt-8 grid grid-cols-2 divide-mist sm:grid-cols-4 sm:divide-x [&>*]:border-mist max-sm:[&>*:nth-child(-n+2)]:border-b max-sm:[&>*:nth-child(odd)]:border-r">
        <Stat label="Active clients" value={active.length} />
        <Stat label="Uploads awaiting review" value={totalReview} href="/portal/admin/review" emphasis={totalReview > 0} />
        <Stat label="Items needing follow-up" value={Number(followUp)} href="/portal/admin/review?show=followup" />
        <Stat label="Signatures with clients" value={Number(sigOpen)} href="/portal/admin/esign" />
      </Panel>
      <p className="mt-2 text-xs text-muted">{totalOpen} document request{totalOpen === 1 ? '' : 's'} still waiting on clients.</p>

      <div className="mt-8">
        <ClientsTable rows={rows} view={view} />
      </div>
    </div>
  );
}
