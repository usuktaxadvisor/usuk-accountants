import Link from 'next/link';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { notFound } from 'next/navigation';
import { clientExists } from '@/lib/portal/client-overview';
import { clientActivity, type ActivityKind } from '@/lib/portal/activity';
import { listNotesForClient } from '@/lib/portal/engagement-store';
import { EmptyNote, btn } from '@/components/portal/classic/ui';
import { Ctx, Flash, SectionHead, SubHead } from '@/components/portal/classic/sections';
import { addNoteAction } from '../actions';

export const dynamic = 'force-dynamic';

const FILTERS: Array<[ActivityKind | 'all', string]> = [['all', 'Everything'], ['request', 'Requests'], ['upload', 'Uploads'], ['review', 'Reviews'], ['signature', 'Signatures'], ['engagement', 'Engagements'], ['note', 'Notes'], ['access', 'Access']];
const KIND_LABEL: Record<ActivityKind, string> = { request: 'Request', upload: 'Upload', review: 'Review', signature: 'Signature', engagement: 'Engagement', note: 'Staff note', access: 'Access' };

/** Dated history for the client, plus internal notes. Staff only: this page is never reachable by a client session. */
export default async function ActivitySection({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ done?: string; show?: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const { done, show } = await searchParams;
  const client = await clientExists(id);
  if (!client) notFound();
  const base = `/portal/admin/clients/${id}`;
  const filter = FILTERS.some(([k]) => k === show) ? show as ActivityKind | 'all' : 'all';
  const all = await clientActivity(id, base);
  const items = (filter === 'all' ? all : all.filter(a => a.kind === filter)).slice(0, 300);
  const { ready } = await listNotesForClient(id);

  let lastDay = '';
  return (
    <div>
      <SectionHead clientId={id} title="Notes & activity" note="Everything that has happened on this client, newest first. Notes are internal and never shown to the client." />
      <Flash done={done} />
      {ready ? (
        <form action={addNoteAction} className="mt-6 rounded-md border border-mist bg-white p-4">
          <Ctx clientId={id} section="activity" />
          <label htmlFor="note" className="text-sm font-semibold text-navy-ink">Add an internal note</label>
          <textarea id="note" name="body" required maxLength={4000} rows={3} placeholder="Visible to staff only, e.g. call summary, agreed scope, follow-up date" className={`mt-2 ${btn.field}`} />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-muted">Saved with your name and the time. Notes cannot be edited or deleted.</span>
            <button className={btn.primary}>Save note</button>
          </div>
        </form>
      ) : <div className="mt-6"><EmptyNote>Notes are not set up on this database yet.</EmptyNote></div>}

      <SubHead title="History" count={items.length}>
        <div className="flex flex-wrap gap-1 text-xs font-semibold">
          {FILTERS.map(([k, label]) => (
            <Link key={k} href={k === 'all' ? `${base}/activity` : `${base}/activity?show=${k}`}
              className={`rounded-full px-3 py-1 ${filter === k ? 'bg-navy-ink text-white' : 'border border-mist bg-white text-navy-ink hover:border-navy-ink'}`}>{label}</Link>
          ))}
        </div>
      </SubHead>
      <div className="mt-4">
        {items.length === 0 ? <EmptyNote>No activity of this kind yet.</EmptyNote> : (
          <ol className="relative border-l border-mist pl-5">
            {items.map((a, i) => {
              const day = a.at.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
              const header = day !== lastDay ? (lastDay = day) : null;
              return (
                <li key={i} className="relative pb-4">
                  {header ? <p className="-ml-5 mb-3 mt-2 bg-porcelain pl-5 text-xs font-semibold text-muted">{header}</p> : null}
                  <span aria-hidden className={`absolute -left-[25px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${a.kind === 'note' ? 'bg-gold' : 'bg-navy-royal'}`} />
                  <div className={`rounded-md px-4 py-2.5 ${a.kind === 'note' ? 'border border-gold/40 bg-gold-tint/50' : 'border border-mist bg-white'}`}>
                    <p className={`text-sm text-ink ${a.kind === 'note' ? 'whitespace-pre-wrap' : ''}`}>
                      {a.href ? <Link href={a.href} className="hover:underline hover:decoration-gold hover:underline-offset-4">{a.text}</Link> : a.text}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">{KIND_LABEL[a.kind]} · {a.at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}{a.who ? ` · ${a.who}` : ''}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
