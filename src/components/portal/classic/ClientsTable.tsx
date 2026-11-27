'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type ClientRow = {
  id: string; ref: string; name: string; archived: boolean;
  open: number; review: number; docs: number;
};

/** Staff client list: one quiet table, searchable by name or reference. */
export default function ClientsTable({ rows, view }: { rows: ClientRow[]; view: 'active' | 'archived' | 'all' }) {
  const [q, setQ] = useState('');
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? rows.filter(r => r.name.toLowerCase().includes(n) || r.ref.toLowerCase().includes(n)) : rows;
  }, [q, rows]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 text-xs font-semibold" role="tablist" aria-label="Client list filter">
          {([['active', 'Active'], ['archived', 'Archived'], ['all', 'All']] as const).map(([v, label]) => (
            <Link key={v} href={v === 'active' ? '/portal/admin' : `/portal/admin?view=${v}`} role="tab" aria-selected={view === v}
              className={`rounded-full px-3 py-1.5 transition-colors ${view === v ? 'bg-navy-ink text-white' : 'border border-mist bg-white text-navy-ink hover:border-navy-ink'}`}>{label}</Link>
          ))}
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search clients</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or CL number"
            className="w-full rounded-md border border-mist bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-navy-ink" />
          <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 fill-none stroke-muted" strokeWidth="1.8"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" strokeLinecap="round" /></svg>
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-md border border-mist bg-white">
        <table className="w-full text-sm">
          <thead className="hidden border-b border-mist bg-porcelain text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted sm:table-header-group">
            <tr>
              <th className="px-5 py-3 font-semibold">Client</th>
              <th className="px-3 py-3 text-right font-semibold">Awaiting review</th>
              <th className="px-3 py-3 text-right font-semibold">Waiting on client</th>
              <th className="px-3 py-3 text-right font-semibold">Documents</th>
              <th className="px-5 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {shown.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{rows.length ? 'No client matches that search.' : 'No clients here yet.'}</td></tr>
            ) : shown.map(r => (
              <tr key={r.id} className="group relative transition-colors hover:bg-porcelain">
                <td className="px-5 py-4">
                  <Link href={`/portal/admin/clients/${r.id}`} className="font-semibold text-navy-ink after:absolute after:inset-0 group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">{r.name}</Link>
                  <span className="ml-2 font-data text-xs text-muted tnum">{r.ref}</span>
                  <p className="mt-1 text-xs text-muted sm:hidden">
                    {r.review ? `${r.review} to review · ` : ''}{r.open} waiting on client · {r.docs} documents
                  </p>
                </td>
                <td className="hidden px-3 py-4 text-right tnum sm:table-cell">{r.review ? <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-navy-ink">{r.review}</span> : <span className="text-muted">–</span>}</td>
                <td className="hidden px-3 py-4 text-right tnum text-ink sm:table-cell">{r.open || <span className="text-muted">–</span>}</td>
                <td className="hidden px-3 py-4 text-right tnum text-ink sm:table-cell">{r.docs}</td>
                <td className="px-5 py-4 text-right">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${r.archived ? 'border-gold/40 bg-gold-tint text-gold-antique' : 'border-mist bg-porcelain text-muted'}`}>{r.archived ? 'Archived' : 'Active'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
