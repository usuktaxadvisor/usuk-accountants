'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Staff: "More actions" on a client — Archive / Delete live behind this menu (never a one-click button beside
 * the ordinary actions). Archived clients get Restore and per-person "Re-enable login" instead.
 */
export default function ClientActionsMenu({ clientId, archived, suspendedMembers }: { clientId: string; archived: boolean; suspendedMembers: Array<{ userId: string; name: string }> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function post(body: Record<string, unknown>) {
    setBusy(true); setMsg('');
    const res = await fetch(`/api/portal/clients/${clientId}/lifecycle`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
    setBusy(false);
    if (!res.ok) { setMsg(data.error ?? 'Something went wrong.'); return; }
    setMsg(data.message ?? 'Done.'); setOpen(false); router.refresh();
  }

  if (archived) {
    return (
      <div className="mt-3 rounded-2xl border border-gold/50 bg-white px-5 py-4 text-sm">
        <p className="font-semibold text-ink">This client is archived.</p>
        <p className="mt-1 text-xs text-muted">Hidden from the working list; its people cannot log in; nothing new can be sent or signed. Documents, signature evidence, audit trail and Drive files are unchanged.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" disabled={busy} onClick={() => post({ action: 'restore' })} className="rounded-xl bg-navy-ink px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">Restore client</button>
          <a href={`/portal/admin/clients/${clientId}/delete`} className="rounded-xl border border-mist px-4 py-2 text-xs font-semibold text-red-700 hover:border-red-700">Delete client…</a>
          {msg ? <span className="text-xs text-ink" role="status">{msg}</span> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-3 inline-block">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open} className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">More actions ▾</button>
        {suspendedMembers.length ? suspendedMembers.map(m => (
          <button key={m.userId} type="button" disabled={busy} onClick={() => post({ action: 'reenable_login', userId: m.userId })} className="rounded-xl border border-mist px-3 py-2 text-xs font-semibold text-ink hover:border-navy-ink disabled:opacity-60">Re-enable login: {m.name}</button>
        )) : null}
        {msg ? <span className="text-xs text-ink" role="status">{msg}</span> : null}
      </div>
      {open ? (
        <div role="menu" className="absolute left-0 z-10 mt-1 w-64 rounded-xl border border-mist bg-white p-1 shadow-lg">
          <a role="menuitem" href={`/portal/admin/clients/${clientId}/delete?mode=archive`} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-porcelain">Archive client</a>
          <a role="menuitem" href={`/portal/admin/clients/${clientId}/delete`} className="block rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-porcelain">Delete client…</a>
          <p className="px-3 py-2 text-[11px] text-muted">Both open a review page first. Nothing happens from this menu.</p>
        </div>
      ) : null}
    </div>
  );
}
