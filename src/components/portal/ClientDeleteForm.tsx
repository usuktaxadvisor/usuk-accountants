'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Assessment } from '@/lib/portal/client-lifecycle';

const REASONS: Array<[string, string]> = [
  ['CLIENT_REQUESTED', 'Client requested deletion'], ['DUPLICATE', 'Duplicate record'], ['TEST_RECORD', 'Test / synthetic record'],
  ['CREATED_IN_ERROR', 'Created in error'], ['ENGAGEMENT_ENDED', 'Engagement ended'], ['OTHER', 'Other'],
];

/**
 * Staff: the deliberate confirmation step. Shows the system's decision and what will be kept / removed, requires
 * a reason (always, for deletion) and the typed phrase DELETE <ref> for anything destructive.
 */
export default function ClientDeleteForm({ a, mode }: { a: Assessment; mode: 'archive' | 'delete' }) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState<string | null>(null);
  const phrase = `DELETE ${a.client.ref}`;
  const destructive = mode === 'delete' && a.decision !== 'ARCHIVE_ONLY';
  const action = mode === 'archive' || a.decision === 'ARCHIVE_ONLY' ? 'archive' : a.decision === 'FULL_DELETE_ALLOWED' ? 'delete_permanently' : 'delete_removable';
  const label = action === 'archive' ? 'Archive client and remove access' : action === 'delete_permanently' ? 'Permanently delete this client' : 'Delete removable data and archive (keep protected records)';

  async function go() {
    if (!reason) { setMsg('Please choose a reason.'); return; }
    if (destructive && confirm.trim().toUpperCase() !== phrase) { setMsg(`Type ${phrase} exactly to confirm.`); return; }
    setBusy(true); setMsg('');
    const res = await fetch(`/api/portal/clients/${a.client.id}/lifecycle`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, reason, note: note.trim() || undefined, confirm: confirm.trim() }) });
    const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
    setBusy(false);
    if (!res.ok) { setMsg(data.error ?? 'Something went wrong. Nothing was changed.'); return; }
    setDone(data.message ?? 'Done.');
    if (action === 'delete_permanently') setTimeout(() => router.push('/portal/admin?view=all'), 1200); else router.refresh();
  }

  if (done) return <div className="rounded-2xl border border-mist bg-white p-5 text-sm text-ink" role="status">{done}{action !== 'delete_permanently' ? <> <a href={`/portal/admin/clients/${a.client.id}`} className="ml-2 font-semibold text-navy-ink underline">Back to the client</a></> : null}</div>;

  return (
    <div className="rounded-2xl border border-mist bg-white p-5">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <label className="mt-3 block text-xs text-muted">Reason {mode === 'delete' ? '(required)' : ''}
        <select value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block w-full rounded-xl border border-mist px-3 py-2 text-sm text-ink">
          <option value="">Choose…</option>{REASONS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select></label>
      <label className="mt-3 block text-xs text-muted">Internal note (optional, staff only)
        <input value={note} onChange={e => setNote(e.target.value)} maxLength={500} className="mt-1 block w-full rounded-xl border border-mist px-3 py-2 text-sm text-ink" /></label>
      {destructive ? (
        <label className="mt-3 block text-xs text-muted">Type <span className="font-mono font-semibold text-ink">{phrase}</span> to confirm
          <input value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="off" className="mt-1 block w-full rounded-xl border border-mist px-3 py-2 font-mono text-sm text-ink" /></label>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy || (destructive && confirm.trim().toUpperCase() !== phrase)} onClick={go} className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${destructive ? 'bg-red-700' : 'bg-navy-ink'}`}>{busy ? 'Working…' : label}</button>
        <a href={`/portal/admin/clients/${a.client.id}`} className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink">Cancel</a>
        {msg ? <span className="text-xs text-red-700" role="alert">{msg}</span> : null}
      </div>
    </div>
  );
}
