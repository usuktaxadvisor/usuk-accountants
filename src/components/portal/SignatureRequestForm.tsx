'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Delivery = { id: string; title: string; version: number; mimeType: string };
type Signer = { userId: string; fullName: string; email: string; role: string; userStatus: string };
const KINDS = [['GENERAL', 'General document'], ['TAX_RETURN', 'Tax return (approval)'], ['ENGAGEMENT_LETTER', 'Engagement letter'], ['ADVISORY', 'Advisory report'], ['DECLARATION', 'Declaration / authorisation'], ['IRS_8879', 'IRS Form 8879'], ['IRS_8878', 'IRS Form 8878']] as const;
const PRESETS = [['bottom-left', 'Bottom left of last page'], ['bottom-right', 'Bottom right of last page'], ['append', 'Signing record page only (no field on the document)']] as const;

/** Staff: "Require action" on one or more delivered PDFs → creates a signature/approval request. No coordinates to type: pick a preset. */
export default function SignatureRequestForm({ clientId, deliveries, hasIdv, signers }: { clientId: string; deliveries: Delivery[]; hasIdv: boolean; signers: Signer[] }) {
  const pdfs = deliveries.filter(d => d.mimeType === 'application/pdf');
  const router = useRouter();
  // Signers: ticked in the order they will sign (the order is only enforced for SEQUENTIAL).
  const [signerOrder, setSignerOrder] = useState<string[]>(signers.length ? [signers[0].userId] : []);
  const [order, setOrder] = useState<'PARALLEL' | 'SEQUENTIAL'>('PARALLEL');
  const toggleSigner = (id: string) => setSignerOrder(o => o.includes(id) ? o.filter(x => x !== id) : [...o, id]);
  const moveSigner = (id: string, dir: -1 | 1) => setSignerOrder(o => { const i = o.indexOf(id); const j = i + dir; if (i < 0 || j < 0 || j >= o.length) return o; const c = [...o]; [c[i], c[j]] = [c[j], c[i]]; return c; });
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [action, setAction] = useState<'APPROVAL' | 'SIGNATURE' | 'APPROVAL_AND_SIGNATURE'>('APPROVAL_AND_SIGNATURE');
  const [kind, setKind] = useState<string>('TAX_RETURN');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [signOn, setSignOn] = useState<string>(pdfs[0]?.id ?? '');
  const [preset, setPreset] = useState<string>('bottom-right');
  const [message, setMessage] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [ack, setAck] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const isIrs = kind === 'IRS_8879' || kind === 'IRS_8878';

  async function submit() {
    const docIds = Object.keys(selected).filter(k => selected[k]);
    if (!title.trim() || docIds.length === 0) { setState('error'); setMsg('Give the request a title and tick at least one document.'); return; }
    if (signerOrder.length === 0) { setState('error'); setMsg('Choose at least one signer.'); return; }
    const fields: Array<Record<string, unknown>> = [];
    if (action !== 'APPROVAL' && preset !== 'append' && signOn) {
      // One signature + date block per signer, stacked upwards from the preset corner (% ×100 of page size).
      const x = preset === 'bottom-left' ? 800 : 5500;
      signerOrder.forEach((uid, i) => {
        const y = 8600 - i * 1200;
        fields.push({ deliveryId: signOn, signerUserId: uid, type: 'SIGNATURE', page: 9999, xPct: x, yPct: Math.max(y, 500), wPct: 3500, hPct: 700 });
        fields.push({ deliveryId: signOn, signerUserId: uid, type: 'DATE', page: 9999, xPct: x, yPct: Math.max(y + 750, 1250), wPct: 2000, hPct: 350 });
      });
    }
    // The acknowledgement must be ticked by EVERY signer individually.
    if (ack.trim()) for (const uid of signerOrder) fields.push({ deliveryId: signOn || docIds[0], signerUserId: uid, type: 'ACKNOWLEDGEMENT', page: 0, label: ack.trim(), required: true });
    setState('sending'); setMsg('');
    const res = await fetch('/api/portal/esign/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      clientId, title: title.trim(), action, docKind: kind, message: message.trim() || null, dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      documents: docIds.map(id => ({ deliveryId: id, requiresSignature: action === 'APPROVAL' ? true : id === signOn })), fields,
      signerUserIds: signerOrder, signingOrder: signerOrder.length > 1 ? order : 'PARALLEL',
    }) });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; clientEmailed?: boolean; code?: string };
    if (res.ok && data.ok) { setState('done'); setMsg(`Sent. ${data.clientEmailed ? 'The client has been emailed.' : 'Email could not be sent — tell the client to check the portal.'}`); router.refresh(); }
    else { setState('error'); setMsg(data.error ?? 'Something went wrong.'); }
  }

  if (!pdfs.length) return null;
  return (
    <div className="mt-3 rounded-2xl border border-mist bg-white p-4">
      <button type="button" onClick={() => setOpen(v => !v)} className="text-sm font-semibold text-navy-ink">{open ? '− ' : '+ '}Require client action (approve / sign)</button>
      {open ? (
        <div className="mt-3 space-y-3 text-sm">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Request title, e.g. 2025 US Tax Return — approval and e-file authorisation" className="w-full rounded-xl border border-mist px-3 py-2" />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted">Action required
              <select value={action} onChange={e => setAction(e.target.value as typeof action)} className="mt-1 w-full rounded-xl border border-mist px-3 py-2 text-sm text-ink">
                <option value="APPROVAL">Approval only</option><option value="SIGNATURE">Signature</option><option value="APPROVAL_AND_SIGNATURE">Approval + signature</option>
              </select></label>
            <label className="block text-xs font-semibold text-muted">Document type
              <select value={kind} onChange={e => setKind(e.target.value)} className="mt-1 w-full rounded-xl border border-mist px-3 py-2 text-sm text-ink">{KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          </div>
          {isIrs && !hasIdv ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">IRS rules (Pub. 1345) require a recorded identity verification before Form 8878/8879 can be e-signed remotely. Record one below, or ask the client to print, sign by hand and upload the form.</p> : null}
          <fieldset><legend className="text-xs font-semibold text-muted">Who must {action === 'APPROVAL' ? 'approve' : 'sign'}</legend>
            {signers.map(s => { const pos = signerOrder.indexOf(s.userId); return (
              <div key={s.userId} className="mt-1 flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2"><input type="checkbox" checked={pos >= 0} onChange={() => toggleSigner(s.userId)} /> {s.fullName} <span className="text-xs text-muted">· {s.email} · {s.role.toLowerCase()}{s.userStatus !== 'ACTIVE' ? ' · login not activated yet' : ''}</span></label>
                {pos >= 0 && signerOrder.length > 1 && order === 'SEQUENTIAL' ? <span className="text-xs text-muted">#{pos + 1} <button type="button" onClick={() => moveSigner(s.userId, -1)} className="px-1">↑</button><button type="button" onClick={() => moveSigner(s.userId, 1)} className="px-1">↓</button></span> : null}
              </div>); })}
            {signerOrder.length > 1 ? (
              <label className="mt-2 block text-xs font-semibold text-muted">Signing order
                <select value={order} onChange={e => setOrder(e.target.value as typeof order)} className="mt-1 w-full rounded-xl border border-mist px-3 py-2 text-sm text-ink sm:w-auto">
                  <option value="PARALLEL">Parallel — everyone can sign at any time</option><option value="SEQUENTIAL">Sequential — one after another, in the numbered order</option>
                </select></label>
            ) : null}
            {signers.length < 2 ? <p className="mt-1 text-xs text-muted">Need a second signer (spouse, co-director)? Add them under “People on this client” first.</p> : null}
          </fieldset>
          <fieldset><legend className="text-xs font-semibold text-muted">Documents in this request</legend>
            {pdfs.map(d => <label key={d.id} className="mt-1 flex items-center gap-2"><input type="checkbox" checked={!!selected[d.id]} onChange={e => setSelected(s => ({ ...s, [d.id]: e.target.checked }))} /> {d.title} <span className="text-xs text-muted">v{d.version}</span></label>)}
          </fieldset>
          {action !== 'APPROVAL' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-muted">Signature goes on
                <select value={signOn} onChange={e => setSignOn(e.target.value)} className="mt-1 w-full rounded-xl border border-mist px-3 py-2 text-sm text-ink">{pdfs.map(d => <option key={d.id} value={d.id}>{d.title} v{d.version}</option>)}</select></label>
              <label className="block text-xs font-semibold text-muted">Where
                <select value={preset} onChange={e => setPreset(e.target.value)} className="mt-1 w-full rounded-xl border border-mist px-3 py-2 text-sm text-ink">{PRESETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
            </div>
          ) : null}
          <input value={ack} onChange={e => setAck(e.target.value)} placeholder="Optional acknowledgement the client must tick, e.g. I confirm all my income sources have been disclosed" className="w-full rounded-xl border border-mist px-3 py-2" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="Optional message shown to the client" className="w-full rounded-xl border border-mist px-3 py-2" />
          <label className="block text-xs font-semibold text-muted">Due date (optional) <input type="date" value={dueAt} onChange={e => setDueAt(e.target.value)} className="ml-2 rounded-xl border border-mist px-3 py-1.5 text-sm text-ink" /></label>
          <div className="flex items-center gap-3">
            <button type="button" disabled={state === 'sending' || (isIrs && !hasIdv)} onClick={submit} className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{state === 'sending' ? 'Freezing & sending…' : 'Send to client'}</button>
            {msg ? <p className={`text-xs ${state === 'error' ? 'text-red-700' : 'text-ink'}`} role="status">{msg}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
