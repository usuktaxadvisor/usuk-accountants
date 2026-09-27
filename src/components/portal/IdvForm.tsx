'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Staff: record an identity verification (IRS Pub. 1345 prerequisite for remote e-signature of Forms 8878/8879). */
export default function IdvForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState('VIDEO_PHOTO_ID');
  const [note, setNote] = useState('');
  const [ref, setRef] = useState('');
  const [msg, setMsg] = useState('');
  async function submit() {
    const res = await fetch('/api/portal/esign/idv', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId, method, note: note.trim() || null, providerRef: ref.trim() || null }) });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    setMsg(res.ok && data.ok ? 'Recorded.' : data.error ?? 'Could not record.');
    if (res.ok) router.refresh();
  }
  return (
    <div className="mt-2 rounded-2xl border border-mist bg-white p-4 text-sm">
      <button type="button" onClick={() => setOpen(v => !v)} className="font-semibold text-navy-ink">{open ? '− ' : '+ '}Record identity verification (for IRS e-file authorisations)</button>
      {open ? (
        <div className="mt-3 space-y-2">
          <select value={method} onChange={e => setMethod(e.target.value)} className="w-full rounded-xl border border-mist px-3 py-2">
            <option value="VIDEO_PHOTO_ID">Government photo ID checked on video call</option>
            <option value="IN_PERSON_PHOTO_ID">Government photo ID checked in person</option>
            <option value="THIRD_PARTY_KBA">Third-party knowledge-based authentication (KBA)</option>
            <option value="MULTI_YEAR_RELATIONSHIP">Multi-year relationship — identity verified previously</option>
          </select>
          <input value={ref} onChange={e => setRef(e.target.value)} placeholder="Provider reference (KBA only)" className="w-full rounded-xl border border-mist px-3 py-2" />
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note — e.g. UK passport, checked by Sal on video 28 Sep 2026 (never document numbers)" className="w-full rounded-xl border border-mist px-3 py-2" />
          <div className="flex items-center gap-3"><button type="button" onClick={submit} className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white">Record</button>{msg ? <span className="text-xs text-muted">{msg}</span> : null}</div>
        </div>
      ) : null}
    </div>
  );
}
