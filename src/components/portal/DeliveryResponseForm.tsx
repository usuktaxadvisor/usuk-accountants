'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Client: approve a delivered document or request changes with a comment. */
export default function DeliveryResponseForm({ deliveryId }: { deliveryId: string }) {
  const [decision, setDecision] = useState<'APPROVED' | 'CHANGES_REQUESTED' | ''>('');
  const [comment, setComment] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function submit() {
    if (!decision) { setState('error'); setMessage('Please choose a response.'); return; }
    if (decision === 'CHANGES_REQUESTED' && !comment.trim()) { setState('error'); setMessage('Please tell us what needs changing.'); return; }
    setState('sending'); setMessage('');
    try {
      const res = await fetch(`/api/portal/deliveries/${deliveryId}/respond`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, comment }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string };
      if (res.ok && data.ok) { setState('done'); setMessage(data.message ?? 'Thank you — your response has been recorded.'); router.refresh(); }
      else { setState('error'); setMessage(data.error ?? 'Something went wrong. Please try again.'); }
    } catch { setState('error'); setMessage('Connection problem — please try again.'); }
  }

  if (state === 'done') return <p className="mt-3 text-sm text-ink" role="status">{message}</p>;

  return (
    <div className="mt-4 rounded-xl border border-mist bg-porcelain p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Your response</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => setDecision('APPROVED')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${decision === 'APPROVED' ? 'bg-navy-ink text-white' : 'border border-mist bg-white text-ink hover:border-navy-ink'}`}>
          Approve — looks correct
        </button>
        <button type="button" onClick={() => setDecision('CHANGES_REQUESTED')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${decision === 'CHANGES_REQUESTED' ? 'bg-navy-ink text-white' : 'border border-mist bg-white text-ink hover:border-navy-ink'}`}>
          Request changes
        </button>
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={4000} rows={3}
        placeholder={decision === 'CHANGES_REQUESTED' ? 'What needs changing? (required)' : 'Optional comment'}
        className="mt-3 w-full rounded-xl border border-mist bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-navy-ink" />
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={submit} disabled={state === 'sending'}
          className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60">
          {state === 'sending' ? 'Sending…' : 'Submit response'}
        </button>
        {message ? <p className={`text-xs ${state === 'error' ? 'text-red-700' : 'text-muted'}`} role="status">{message}</p> : null}
      </div>
    </div>
  );
}
