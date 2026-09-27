'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Delivery = { id: string; title: string; version: number; mimeType: string };
const KINDS = [['GENERAL', 'General document'], ['TAX_RETURN', 'Tax return (approval)'], ['ENGAGEMENT_LETTER', 'Engagement letter'], ['ADVISORY', 'Advisory report'], ['DECLARATION', 'Declaration / authorisation'], ['IRS_8879', 'IRS Form 8879'], ['IRS_8878', 'IRS Form 8878']] as const;
const PRESETS = [['bottom-left', 'Bottom left of last page'], ['bottom-right', 'Bottom right of last page'], ['append', 'Signing record page only (no field on the document)']] as const;

/** Staff: "Require action" on one or more delivered PDFs → creates a signature/approval request. No coordinates to type: pick a preset. */
export default function SignatureRequestForm({ clientId, deliveries, hasIdv }: { clientId: string; deliveries: Delivery[]; hasIdv: boolean }) {
  const pdfs = deliveries.filter(d => d.mimeType === 'application/pdf');
  const router = useRouter();
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
    const fields: Array<Record<string, unknown>> = [];
    if (action !== 'APPROVAL' && preset !== 'append' && signOn) {
      const x = preset === 'bottom-left' ? 800 : 5500; // % ×100 of page width
      fields.push({ deliveryId: signOn, type: 'SIGNATURE', page: 9999, xPct: x, yPct: 8600, wPct: 3500, hPct: 700 });
      fields.push({ deliveryId: signOn, type: 'DATE', page: 9999, xPct: x, yPct: 9350, wPct: 2000, hPct: 350 });
    }
    if (ack.trim()) fields.push({ deliveryId: signOn || docIds[0], type: 'ACKNOWLEDGEMENT', page: 0, label: ack.trim(), required: true });
    setState('sending'); setMsg('');
    const res = await fetch('/api/portal/esign/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      clientId, title: title.trim(), action, docKind: kind, message: message.trim() || null, dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      documents: docIds.map(id => ({ deliveryId: id, requiresSignature: action === 'APPROVAL' ? true : id === signOn })), fields,
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
