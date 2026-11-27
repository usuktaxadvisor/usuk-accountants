import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/portal/auth';
import { reviewQueue, setRequestStatus } from '@/lib/portal/request-view';
import RequestCard from '@/components/portal/classic/RequestCard';
import { EmptyNote, PageTitle, SectionTitle, btn } from '@/components/portal/classic/ui';

export const dynamic = 'force-dynamic';

/**
 * Staff review queue: every upload waiting to be checked, across all clients,
 * with the files under the request they answer and one-click outcomes.
 */
export default async function ReviewQueue({ searchParams }: { searchParams: Promise<{ show?: string; done?: string }> }) {
  await requireRole('STAFF');
  const { show, done } = await searchParams;
  const followUp = show === 'followup';
  const groups = await reviewQueue(followUp ? ['UNDER_REVIEW'] : ['UPLOADED']);
  const total = groups.reduce((a, g) => a + g.items.length, 0);

  async function decide(formData: FormData) {
    'use server';
    const s = await requireRole('STAFF');
    const ok = await setRequestStatus(s.uid, String(formData.get('clientId') ?? ''), String(formData.get('requestId') ?? ''), String(formData.get('status') ?? ''), 'review-queue');
    const back = String(formData.get('show') ?? '') === 'followup' ? '?show=followup&' : '?';
    redirect(`/portal/admin/review${back}done=${ok ? '1' : '0'}`);
  }

  const outcome = (clientId: string, requestId: string, status: string, label: string, primary = false) => (
    <form action={decide}>
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="status" value={status} />
      {followUp ? <input type="hidden" name="show" value="followup" /> : null}
      <button className={primary ? btn.primary : btn.secondary}>{label}</button>
    </form>
  );

  return (
    <div>
      <PageTitle title="Review queue"
        meta={followUp
          ? `${total} item${total === 1 ? '' : 's'} marked as needing follow-up.`
          : total ? `${total} upload${total === 1 ? '' : 's'} to check, oldest client first. Open each file, then record the outcome.` : 'Nothing waiting. Every upload has been reviewed.'}>
        <div className="flex gap-1 text-xs font-semibold">
          <Link href="/portal/admin/review" className={`rounded-full px-3 py-1.5 ${!followUp ? 'bg-navy-ink text-white' : 'border border-mist bg-white text-navy-ink hover:border-navy-ink'}`}>Awaiting review</Link>
          <Link href="/portal/admin/review?show=followup" className={`rounded-full px-3 py-1.5 ${followUp ? 'bg-navy-ink text-white' : 'border border-mist bg-white text-navy-ink hover:border-navy-ink'}`}>Needs follow-up</Link>
        </div>
      </PageTitle>
      {done === '1' ? <p role="status" className="mt-4 rounded-md border border-[#2F5D46]/25 bg-[#2F5D46]/[0.06] px-4 py-2.5 text-sm text-[#2F5D46]">Saved. The client is not emailed about status changes.</p> : null}
      {done === '0' ? <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">That item could not be updated. Refresh and try again.</p> : null}

      <div className="mt-10 space-y-12">
        {groups.length === 0 ? <EmptyNote>{followUp ? 'No items are waiting on a follow-up.' : 'All caught up. New uploads will appear here as clients send them.'}</EmptyNote> : groups.map(g => (
          <section key={g.clientId}>
            <SectionTitle title={g.clientName} count={g.items.length}
              note={<>{g.clientRef}{g.archived ? ' · archived client' : ''}</>}>
              <Link href={`/portal/admin/clients/${g.clientId}`} className={btn.small}>Open client</Link>
            </SectionTitle>
            <div className="mt-4 grid items-start gap-3 lg:grid-cols-2">
              {g.items.map(item => (
                <RequestCard key={item.id} item={item} audience="staff"
                  fileHref={id => `/api/portal/documents/${id}/file?client=${g.clientId}`}
                  actions={<>
                    {outcome(g.clientId, item.id, 'COMPLETED', 'Accept as complete', true)}
                    {followUp ? null : outcome(g.clientId, item.id, 'UNDER_REVIEW', 'Needs follow-up')}
                    {followUp ? outcome(g.clientId, item.id, 'UPLOADED', 'Back to review') : outcome(g.clientId, item.id, 'RECEIVED', 'Mark received')}
                  </>} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
