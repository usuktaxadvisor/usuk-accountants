'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Bundle = {
  request: { id: string; title: string; action: 'APPROVAL' | 'SIGNATURE' | 'APPROVAL_AND_SIGNATURE'; docKind: string; status: string; message: string | null; dueAt: string | null; completedAt: string | null; sealedAvailable: boolean };
  documents: Array<{ deliveryId: string; title: string; originalName: string; version: number; frozenSha256: string; requiresSignature: boolean }>;
  signer: { id: string; fullName: string; status: string; step: 'VIEW' | 'CONSENT' | 'APPROVE' | 'SIGN' | 'DONE'; myTurn: boolean; otpVerified: boolean };
  otherSigners: Array<{ fullName: string; status: string; sequence: number }>;
  consent: { version: string; text: string };
  fields: Array<{ id: string; type: string; page: number; label: string | null; required: boolean }>;
};

type Stage = 'loading' | 'review' | 'consent' | 'code' | 'approve' | 'sign' | 'done' | 'closed' | 'error';

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

export default function SignFlow({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [b, setB] = useState<Bundle | null>(null);
  const [stage, setStage] = useState<Stage>('loading');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [consentTick, setConsentTick] = useState(false);
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState('');
  const [method, setMethod] = useState<'TYPED' | 'DRAWN'>('TYPED');
  const [typed, setTyped] = useState('');
  const [intent, setIntent] = useState(false);
  const [acks, setAcks] = useState<Record<string, boolean>>({});
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/portal/esign/requests/${requestId}`, { cache: 'no-store' });
    const data = (await res.json().catch(() => ({}))) as Bundle & { error?: string; status?: string };
    if (res.status === 409) { setStage('closed'); setMsg(`This request is ${String(data.status ?? 'closed').toLowerCase().replace(/_/g, ' ')}.`); return; }
    if (!res.ok) { setStage('error'); setMsg(data.error ?? 'This document could not be loaded.'); return; }
    setB(data);
    setTyped(data.signer.fullName);
    if (data.request.status === 'COMPLETED' || data.signer.step === 'DONE') { setStage('done'); return; }
    const next = data.signer.step;
    setStage(next === 'VIEW' || next === 'CONSENT' ? 'review' : !data.signer.otpVerified ? 'code' : next === 'APPROVE' ? 'approve' : 'sign');
  }, [requestId]);
  useEffect(() => { void load(); }, [load]);

  async function acceptConsent() {
    if (!reviewed || !consentTick || !b) return;
    setBusy(true); setMsg('');
    const { ok, status, data } = await post(`/api/portal/esign/requests/${requestId}/consent`, { accepted: true, version: b.consent.version });
    setBusy(false);
    if (!ok) { setMsg(String(data.error ?? 'Please try again.')); if (status === 409) { setMsg(''); void load(); } return; }
    setStage('code'); void sendCode();
  }
  async function sendCode() {
    setBusy(true); setMsg('');
    const { ok, data } = await post(`/api/portal/esign/requests/${requestId}/otp`, { action: 'send' });
    setBusy(false);
    setCodeSent(ok ? String(data.message ?? 'Code sent.') : String(data.error ?? 'Could not send the code.'));
  }
  async function verifyCode() {
    if (!b) return;
    setBusy(true); setMsg('');
    const { ok, data } = await post(`/api/portal/esign/requests/${requestId}/otp`, { action: 'verify', code });
    setBusy(false);
    if (!ok) { setMsg(String(data.error ?? 'Please try again.')); return; }
    setStage(b.request.action === 'SIGNATURE' ? 'sign' : 'approve');
  }
  async function approve() {
    if (!b) return;
    setBusy(true); setMsg('');
    const { ok, status, data } = await post(`/api/portal/esign/requests/${requestId}/approve`, { confirmed: true });
    setBusy(false);
    if (!ok) { setMsg(String(data.error ?? 'Please try again.')); if (status === 409) { setMsg(''); void load(); } return; }
    if (data.done) { setMsg(String(data.message ?? 'Approved.')); markDone(String(data.requestStatus ?? '')); setStage('done'); router.refresh(); } else setStage('sign');
  }
  async function sign() {
    if (!b || !intent) { setMsg('Please confirm that you intend to sign.'); return; }
    const png = method === 'DRAWN' ? canvasRef.current?.toDataURL('image/png') : undefined;
    if (method === 'DRAWN' && !hasInk.current) { setMsg('Please draw your signature in the box.'); return; }
    setBusy(true); setMsg('');
    const { ok, status, data } = await post(`/api/portal/esign/requests/${requestId}/sign`, { method, typedName: typed, png, intent: true, acknowledgements: acks });
    setBusy(false);
    if (!ok) { setMsg(String(data.error ?? 'Please try again.')); if (status === 409) { setMsg(''); void load(); } return; }
    setMsg(String(data.message ?? 'Signed.')); markDone(String(data.requestStatus ?? '')); setStage('done'); router.refresh();
  }
  /** After the server confirms completion, reflect it locally so the download buttons appear without a reload. */
  function markDone(requestStatus: string) {
    if (requestStatus === 'COMPLETED') setB(prev => prev ? { ...prev, request: { ...prev.request, status: 'COMPLETED', sealedAvailable: true } } : prev);
  }
  async function decline() {
    if (!declineReason.trim()) { setMsg('Please tell us why.'); return; }
    setBusy(true); setMsg('');
    const { ok, status, data } = await post(`/api/portal/esign/requests/${requestId}/decline`, { reason: declineReason });
    setBusy(false);
    if (!ok) { setMsg(String(data.error ?? 'Please try again.')); if (status === 409) { setMsg(''); void load(); } return; }
    setMsg(String(data.message ?? 'Received.')); setStage('closed'); router.refresh();
  }

  // Drawn signature (pointer events → works with mouse, touch and stylus)
  function pos(e: React.PointerEvent<HTMLCanvasElement>) { const r = e.currentTarget.getBoundingClientRect(); return { x: (e.clientX - r.left) * (e.currentTarget.width / r.width), y: (e.clientY - r.top) * (e.currentTarget.height / r.height) }; }
  function down(e: React.PointerEvent<HTMLCanvasElement>) { const c = e.currentTarget.getContext('2d'); if (!c) return; drawing.current = true; hasInk.current = true; const p = pos(e); c.beginPath(); c.moveTo(p.x, p.y); c.lineWidth = 2.2; c.lineCap = 'round'; c.strokeStyle = '#0A1330'; e.currentTarget.setPointerCapture(e.pointerId); }
  function move(e: React.PointerEvent<HTMLCanvasElement>) { if (!drawing.current) return; const c = e.currentTarget.getContext('2d'); if (!c) return; const p = pos(e); c.lineTo(p.x, p.y); c.stroke(); }
  function up() { drawing.current = false; }
  function clear() { const c = canvasRef.current; if (!c) return; c.getContext('2d')?.clearRect(0, 0, c.width, c.height); hasInk.current = false; }

  if (stage === 'loading') return <p className="text-sm text-muted">Loading your document…</p>;
  if (stage === 'error') return <p className="rounded-2xl border border-mist bg-white p-5 text-sm text-ink" role="alert">{msg}</p>;
  // Closed before it was ever loaded (expired / voided / superseded / declined): say so plainly instead of a blank page.
  if (stage === 'closed' && !b) return (
    <section className="rounded-2xl border border-mist bg-white p-5 text-sm text-ink" role="status">
      <p className="font-semibold">{msg}</p>
      <p className="mt-1 text-muted">It can no longer be approved or signed. If you were expecting to act on it, please contact us and we will send a fresh request.</p>
      <Link href="/portal" className="mt-3 inline-block font-semibold text-navy-ink underline">Back to your portal</Link>
    </section>
  );
  if (!b) return null;

  const actionLabel = b.request.action === 'APPROVAL' ? 'approve' : b.request.action === 'SIGNATURE' ? 'sign' : 'approve and sign';
  const steps = ['Review', 'Consent', 'Verify', b.request.action === 'APPROVAL' ? 'Approve' : 'Sign', 'Done'];
  const idx = { review: 0, consent: 1, code: 2, approve: 3, sign: 3, done: 4, closed: 4, loading: 0, error: 0 }[stage];
  const docUrl = (d: Bundle['documents'][number], dl = false) => `/api/portal/esign/requests/${requestId}/file?doc=${d.deliveryId}${dl ? '&download=1' : ''}`;

  return (
    <div className="space-y-5">
      <ol className="flex flex-wrap gap-2 text-xs" aria-label="Progress">
        {steps.map((s, i) => <li key={s} className={`rounded-full px-3 py-1 font-semibold ${i < idx ? 'bg-gold/10 text-gold-antique' : i === idx ? 'bg-navy-ink text-white' : 'bg-mist text-muted'}`}>{i + 1}. {s}</li>)}
      </ol>

      {!b.signer.myTurn && stage !== 'done' && stage !== 'closed' ? (
        <p className="rounded-2xl border border-mist bg-porcelain p-4 text-sm text-ink">Another signer needs to complete this before you. We will email you when it is your turn. You can still review the document below.</p>
      ) : null}

      {/* Documents — always visible so the client can re-read at any step */}
      <section className="rounded-2xl border border-mist bg-white p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">Document{b.documents.length > 1 ? 's' : ''} to {actionLabel}</p>
        {b.request.message ? <p className="mt-2 border-l-2 border-gold pl-3 text-sm text-ink">{b.request.message}</p> : null}
        <div className="mt-3 space-y-3">
          {b.documents.map(d => (
            <div key={d.deliveryId}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{d.title} <span className="text-xs font-normal text-muted">v{d.version}{d.requiresSignature ? '' : ' · for review'}</span></p>
                <div className="flex gap-2">
                  <a href={docUrl(d)} target="_blank" rel="noopener" className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-ink hover:border-navy-ink">Open</a>
                  <a href={docUrl(d, true)} className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-ink hover:border-navy-ink">Download</a>
                </div>
              </div>
              <iframe title={d.title} src={docUrl(d)} className="mt-2 h-[60vh] w-full rounded-xl border border-mist bg-porcelain" />
            </div>
          ))}
        </div>
      </section>

      {stage === 'review' && b.signer.myTurn ? (
        <section className="rounded-2xl border border-mist bg-white p-4 sm:p-5">
          <label className="flex items-start gap-3 text-sm text-ink"><input type="checkbox" className="mt-1" checked={reviewed} onChange={e => setReviewed(e.target.checked)} /> I have reviewed the document{b.documents.length > 1 ? 's' : ''} above and had the chance to download and print {b.documents.length > 1 ? 'them' : 'it'}.</label>
          <details className="mt-4 rounded-xl border border-mist bg-porcelain p-3 text-xs text-ink" open>
            <summary className="cursor-pointer text-sm font-semibold">Electronic signature consent</summary>
            <pre className="mt-2 whitespace-pre-wrap font-sans">{b.consent.text}</pre>
          </details>
          <label className="mt-3 flex items-start gap-3 text-sm text-ink"><input type="checkbox" className="mt-1" checked={consentTick} onChange={e => setConsentTick(e.target.checked)} /> I agree to use electronic records and signatures as set out above.</label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={!reviewed || !consentTick || busy} onClick={acceptConsent} className="rounded-xl bg-navy-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Continue</button>
            <button type="button" onClick={() => setDeclineOpen(v => !v)} className="rounded-xl border border-mist px-4 py-2.5 text-sm font-semibold text-ink">I can&apos;t {actionLabel} this</button>
          </div>
        </section>
      ) : null}

      {stage === 'code' ? (
        <section className="rounded-2xl border border-mist bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold text-ink">Confirm it&apos;s you</p>
          <p className="mt-1 text-sm text-muted">{codeSent || 'We are sending a 6-digit code to your email address.'}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} placeholder="6-digit code" className="w-40 rounded-xl border border-mist px-3 py-2 text-lg tracking-widest" />
            <button type="button" disabled={code.length !== 6 || busy} onClick={verifyCode} className="rounded-xl bg-navy-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Verify</button>
            <button type="button" disabled={busy} onClick={sendCode} className="text-sm font-semibold text-navy-ink underline">Send a new code</button>
          </div>
        </section>
      ) : null}

      {stage === 'approve' ? (
        <section className="rounded-2xl border border-mist bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold text-ink">Your approval</p>
          <p className="mt-1 text-sm text-muted">By approving you confirm the document is correct and complete to the best of your knowledge{b.request.action === 'APPROVAL_AND_SIGNATURE' ? ', before signing the authorisation in the next step' : ''}.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={approve} className="rounded-xl bg-navy-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">I approve this document</button>
            <button type="button" onClick={() => setDeclineOpen(v => !v)} className="rounded-xl border border-mist px-4 py-2.5 text-sm font-semibold text-ink">Something needs changing</button>
          </div>
        </section>
      ) : null}

      {stage === 'sign' ? (
        <section className="rounded-2xl border border-mist bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold text-ink">Your signature</p>
          <div className="mt-2 flex gap-2 text-sm">
            <button type="button" onClick={() => setMethod('TYPED')} className={`rounded-xl px-4 py-2 font-semibold ${method === 'TYPED' ? 'bg-navy-ink text-white' : 'border border-mist text-ink'}`}>Type</button>
            <button type="button" onClick={() => setMethod('DRAWN')} className={`rounded-xl px-4 py-2 font-semibold ${method === 'DRAWN' ? 'bg-navy-ink text-white' : 'border border-mist text-ink'}`}>Draw</button>
          </div>
          {method === 'TYPED' ? (
            <div className="mt-3">
              <input value={typed} onChange={e => setTyped(e.target.value)} className="w-full rounded-xl border border-mist px-3 py-2 text-sm" aria-label="Type your full name" />
              <p className="mt-2 rounded-xl border border-mist bg-porcelain px-4 py-3 font-serif text-2xl italic text-navy-ink">{typed || ' '}</p>
            </div>
          ) : (
            <div className="mt-3">
              <canvas ref={canvasRef} width={600} height={180} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} className="w-full touch-none rounded-xl border border-mist bg-porcelain" aria-label="Draw your signature" />
              <button type="button" onClick={clear} className="mt-1 text-xs font-semibold text-navy-ink underline">Clear</button>
            </div>
          )}
          {b.fields.filter(f => f.type === 'CHECKBOX' || f.type === 'ACKNOWLEDGEMENT').map(f => (
            <label key={f.id} className="mt-3 flex items-start gap-3 text-sm text-ink"><input type="checkbox" className="mt-1" checked={!!acks[f.id]} onChange={e => setAcks(a => ({ ...a, [f.id]: e.target.checked }))} /> {f.label ?? 'I confirm'}{f.required ? '' : ' (optional)'}</label>
          ))}
          <label className="mt-4 flex items-start gap-3 text-sm text-ink"><input type="checkbox" className="mt-1" checked={intent} onChange={e => setIntent(e.target.checked)} /> I intend this to be my legally binding electronic signature on {b.documents.length > 1 ? 'these documents' : 'this document'}.</label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={busy || !intent} onClick={sign} className="rounded-xl bg-navy-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Signing…' : 'Sign now'}</button>
            <button type="button" onClick={() => setDeclineOpen(v => !v)} className="rounded-xl border border-mist px-4 py-2.5 text-sm font-semibold text-ink">I can&apos;t sign this</button>
          </div>
        </section>
      ) : null}

      {declineOpen && stage !== 'done' && stage !== 'closed' ? (
        <section className="rounded-2xl border border-mist bg-porcelain p-4 sm:p-5">
          <p className="text-sm font-semibold text-ink">Tell us what needs changing</p>
          <textarea value={declineReason} onChange={e => setDeclineReason(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-mist px-3 py-2 text-sm" />
          <button type="button" disabled={busy} onClick={decline} className="mt-2 rounded-xl border border-red-700 px-4 py-2 text-sm font-semibold text-red-700">Send to our team</button>
        </section>
      ) : null}

      {stage === 'done' ? (
        <section className="rounded-2xl border border-gold/40 bg-gold/5 p-4 sm:p-5">
          <p className="text-sm font-semibold text-ink">{msg || (b.request.status === 'COMPLETED' ? 'Completed.' : 'Your part is done.')}</p>
          {b.request.status === 'COMPLETED' || b.request.sealedAvailable ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`/api/portal/esign/requests/${requestId}/signed?download=1`} className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white">{b.request.action === 'APPROVAL' ? 'Download approved copy' : 'Download signed copy'}</a>
              <a href={`/api/portal/esign/requests/${requestId}/evidence?format=pdf`} className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink">{b.request.action === 'APPROVAL' ? 'Download approval record' : 'Download signature record'}</a>
            </div>
          ) : <p className="mt-1 text-sm text-muted">{b.request.action === 'APPROVAL' ? 'We will email you when everyone has approved and your approval record is ready.' : 'We will email you when everyone has signed and your signed copy is ready.'}</p>}
          <Link href="/portal" className="mt-3 inline-block text-sm font-semibold text-navy-ink underline">Back to your portal</Link>
        </section>
      ) : null}
      {stage === 'closed' ? <p className="rounded-2xl border border-mist bg-white p-4 text-sm text-ink" role="status">{msg}</p> : null}
      {msg && stage !== 'done' && stage !== 'closed' ? <p className="text-sm text-red-700" role="alert">{msg}</p> : null}
    </div>
  );
}
