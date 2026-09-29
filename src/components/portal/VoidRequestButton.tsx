'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Staff: void an open request. The reason is captured inline (no native prompt) and recorded in the event log. */
export default function VoidRequestButton({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();
  async function go() {
    if (!reason.trim()) { setMsg('Please give a reason.'); return; }
    setBusy(true); setMsg('');
    const res = await fetch(`/api/portal/esign/requests/${requestId}/void`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: reason.trim() }) });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) { setMsg(data.error ?? 'Could not void.'); return; }
    router.refresh();
  }
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-red-700 hover:border-red-700">Void</button>;
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (the client will no longer be able to sign)" maxLength={500} className="rounded-lg border border-mist px-3 py-1.5 text-xs text-ink" style={{ minWidth: 260 }} />
      <button type="button" onClick={go} disabled={busy} className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">{busy ? '…' : 'Confirm void'}</button>
      <button type="button" onClick={() => { setOpen(false); setReason(''); setMsg(''); }} className="text-xs text-muted">Cancel</button>
      {msg ? <span className="text-xs text-red-700" role="alert">{msg}</span> : null}
    </span>
  );
}
