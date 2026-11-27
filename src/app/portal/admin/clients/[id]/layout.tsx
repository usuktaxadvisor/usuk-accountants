import Link from 'next/link';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { notFound } from 'next/navigation';
import { clientExists } from '@/lib/portal/client-overview';
import { listMembers } from '@/lib/portal/members';
import ClientActionsMenu from '@/components/portal/ClientActionsMenu';
import ClientTabs from '@/components/portal/classic/ClientTabs';
import { Pill, shortDate } from '@/components/portal/classic/ui';

export const dynamic = 'force-dynamic';

/** Shared header for every client section: who the client is, their status, and the section switcher. */
export default async function ClientLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const client = await clientExists(id);
  if (!client) notFound();
  const members = await listMembers(id);
  const primary = members.find(m => m.userId === client.userId);
  const people = members.filter(m => m.status === 'ACTIVE').length;

  return (
    <div>
      <Link href="/portal/admin" className="text-xs font-semibold text-muted hover:text-navy-ink">← All clients</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-brand text-[2rem] font-normal leading-tight text-navy-ink sm:text-[2.4rem]">
            <Link href={`/portal/admin/clients/${id}`} className="hover:text-navy-royal">{client.displayName}</Link>
            <span className="ml-3 align-middle font-sans text-sm font-semibold text-muted tnum">{client.clientRef}</span>
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            {client.archivedAt ? <Pill tone="action">Archived {shortDate(client.archivedAt)}</Pill> : <Pill tone="done">Active client</Pill>}
            {primary ? <span>{primary.fullName} · {primary.email}</span> : null}
            {people > 1 ? <span>{people} people on this account</span> : null}
            <span>Client since {shortDate(client.createdAt)}</span>
          </p>
        </div>
        <ClientActionsMenu clientId={id} archived={!!client.archivedAt} suspendedMembers={members.filter(m => m.userStatus === 'SUSPENDED' && m.status === 'ACTIVE').map(m => ({ userId: m.userId, name: m.fullName }))} />
      </div>
      <ClientTabs clientId={id} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
