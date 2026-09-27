import Link from 'next/link';
import { requireRole } from '@/lib/portal/auth';
import { listOpenRequestsForStaff } from '@/lib/portal/esign-store';
import { SIG_STATUS_LABEL, SIG_ACTION_LABEL, type SigRequestStatus } from '@/lib/portal/esign';

export const dynamic = 'force-dynamic';
const ALL: SigRequestStatus[] = ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED', 'COMPLETED', 'DECLINED', 'VOIDED', 'EXPIRED', 'SUPERSEDED'];

/** Staff dashboard: every signature/approval request across clients, filterable by status. */
export default async function EsignDashboard({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireRole('STAFF');
  const { status, q } = await searchParams;
  const filter = status && ALL.includes(status as SigRequestStatus) ? [status as SigRequestStatus] : status === 'open' || !status ? ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED'] as SigRequestStatus[] : undefined;
  let rows = await listOpenRequestsForStaff(filter);
  if (q) { const needle = q.toLowerCase(); rows = rows.filter(r => r.req.title.toLowerCase().includes(needle) || r.clientName.toLowerCase().includes(needle) || r.clientRef.toLowerCase().includes(needle)); }
  const badge = (s: SigRequestStatus) => s === 'COMPLETED' ? 'bg-gold/10 text-gold-antique' : s === 'DECLINED' || s === 'VOIDED' || s === 'EXPIRED' || s === 'SUPERSEDED' ? 'bg-red-50 text-red-700' : 'bg-mist text-muted';
  return (
    <div>
      <Link href="/portal/admin" className="text-xs font-semibold uppercase tracking-widest text-muted">← Staff area</Link>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Signatures &amp; approvals</h1>
      <form className="mt-4 flex flex-wrap gap-2 text-sm">
        <select name="status" defaultValue={status ?? 'open'} className="rounded-xl border border-mist px-3 py-2">
          <option value="open">Open (awaiting / viewed / partially signed)</option><option value="all">All</option>
          {ALL.map(s => <option key={s} value={s}>{SIG_STATUS_LABEL[s]}</option>)}
        </select>
        <input name="q" defaultValue={q ?? ''} placeholder="Search client or title" className="rounded-xl border border-mist px-3 py-2" />
        <button className="rounded-xl bg-navy-ink px-4 py-2 font-semibold text-white">Filter</button>
      </form>
      <div className="mt-4 space-y-2">
        {rows.length === 0 ? <p className="rounded-2xl border border-mist bg-white p-5 text-sm text-muted">Nothing here.</p> : rows.map(({ req, clientName, clientRef }) => (
          <a key={req.id} href={`/portal/admin/esign/${req.id}`} className="block rounded-2xl border border-mist bg-white px-5 py-4 hover:border-navy-ink">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{req.title}</p>
                <p className="text-xs text-muted">{clientName} ({clientRef}) · {SIG_ACTION_LABEL[req.action]} · sent {req.sentAt?.toLocaleString('en-GB') ?? '—'}{req.dueAt ? ` · due ${req.dueAt.toISOString().slice(0, 10)}` : ''}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge(req.status)}`}>{SIG_STATUS_LABEL[req.status]}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
