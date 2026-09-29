'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Member = { id: string; userId: string; fullName: string; email: string; role: string; canSign: boolean; status: string; userStatus: string; isPrimary: boolean };
const ROLES = [['JOINT', 'Joint client (e.g. spouse)'], ['DIRECTOR', 'Director / officer'], ['CONTACT', 'Authorised contact'], ['MEMBER', 'Member']] as const;

/** Staff: the people who can log in for this client (household or company). Each gets their own login, OTP and signature. */
export default function MembersPanel({ clientId, members }: { clientId: string; members: Member[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [first, setFirst] = useState(''); const [last, setLast] = useState(''); const [email, setEmail] = useState('');
  const [role, setRole] = useState('JOINT'); const [canSign, setCanSign] = useState(true);
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);

  async function add() {
    if (!first.trim() || !email.includes('@')) { setMsg('First name and email are required.'); return; }
    setBusy(true); setMsg('');
    const res = await fetch(`/api/portal/clients/${clientId}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName: first.trim(), lastName: last.trim() || null, email: email.trim(), role, canSign }) });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; emailed?: boolean };
    setBusy(false);
    if (res.ok && data.ok) { setMsg(data.emailed ? 'Added — activation email sent.' : 'Added. The activation email could not be sent; use “Send password-reset link” for them.'); setFirst(''); setLast(''); setEmail(''); router.refresh(); }
    else setMsg(data.error ?? 'Could not add.');
  }
  async function remove(id: string) {
    if (!confirm('Remove this person’s access to the client? Their past signatures are kept.')) return;
    const res = await fetch(`/api/portal/clients/${clientId}/members?member=${id}`, { method: 'DELETE' });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) setMsg(data.error ?? 'Could not remove.'); else router.refresh();
  }

  return (
    <section className="mt-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">People on this client</h2>
      <p className="mt-1 text-xs text-muted">Joint clients (husband and wife), company directors and authorised contacts each get their own login. Only people marked “can sign” can be chosen as signers.</p>
      <div className="mt-3 space-y-2">
        {members.map(m => (
          <div key={m.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-mist bg-white px-5 py-3 text-sm ${m.status !== 'ACTIVE' ? 'opacity-60' : ''}`}>
            <div>
              <p className="font-semibold text-ink">{m.fullName} <span className="text-xs font-normal text-muted">· {m.email}</span></p>
              <p className="text-xs text-muted">{m.isPrimary ? 'Primary contact' : m.role.toLowerCase().replace(/_/g, ' ')} · {m.canSign ? 'can sign' : 'view only'} · login {m.userStatus.toLowerCase()}{m.status !== 'ACTIVE' ? ' · removed' : ''}</p>
            </div>
            {!m.isPrimary && m.status === 'ACTIVE' ? <button type="button" onClick={() => remove(m.id)} className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-ink hover:border-red-400">Remove</button> : null}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-2xl border border-mist bg-white p-4 text-sm">
        <button type="button" onClick={() => setOpen(v => !v)} className="font-semibold text-navy-ink">{open ? '− ' : '+ '}Add a person (joint client, director, contact)</button>
        {open ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input value={first} onChange={e => setFirst(e.target.value)} placeholder="First name" className="rounded-xl border border-mist px-3 py-2" />
            <input value={last} onChange={e => setLast(e.target.value)} placeholder="Last name" className="rounded-xl border border-mist px-3 py-2" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Their own email address" className="rounded-xl border border-mist px-3 py-2 sm:col-span-2" />
            <select value={role} onChange={e => setRole(e.target.value)} className="rounded-xl border border-mist px-3 py-2">{ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            <label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={canSign} onChange={e => setCanSign(e.target.checked)} /> Can approve and sign documents</label>
            <div className="flex items-center gap-3 sm:col-span-2">
              <button type="button" disabled={busy} onClick={add} className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Adding…' : 'Add & send activation email'}</button>
              {msg ? <span className="text-xs text-ink" role="status">{msg}</span> : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
