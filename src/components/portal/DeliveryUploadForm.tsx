'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv';

/**
 * Staff: send a document to a client for review (or replace an existing
 * version when supersedesId is given). Posts multipart to
 * /api/portal/deliveries; the server validates, uploads to Drive and emails
 * the client. Nothing Drive-related is handled here.
 */
export default function DeliveryUploadForm({ clientId, categories, supersedesId, compact }: {
  clientId: string; categories: readonly string[]; supersedesId?: string; compact?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.set('clientId', clientId);
    if (supersedesId) form.set('supersedesId', supersedesId);
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0) { setState('error'); setMessage('Choose a file first.'); return; }
    if (file.size > 4 * 1024 * 1024) { setState('error'); setMessage('Files over 4 MB are not yet supported on this path — compress the PDF or split it.'); return; }
    setState('sending'); setMessage('');
    try {
      const res = await fetch('/api/portal/deliveries', { method: 'POST', body: form });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; clientEmailed?: boolean; version?: number };
      if (res.ok && data.ok) {
        setState('done');
        setMessage(`Sent (v${data.version ?? 1}).${data.clientEmailed ? ' Client emailed.' : ' Saved — but the client email could not be sent; let them know directly.'}`);
        formRef.current?.reset();
        router.refresh();
      } else {
        setState('error'); setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setState('error'); setMessage('Connection problem — please try again.');
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className={compact ? 'mt-2 flex flex-wrap items-center gap-2' : 'mt-3 space-y-2 rounded-2xl border border-mist bg-white p-5'}>
      {!supersedesId ? (
        <>
          <input name="title" required maxLength={160} placeholder="e.g. 2025 US Tax Return — draft for your approval"
            className="w-full rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-navy-ink" />
          <div className="flex gap-2">
            <select name="category" defaultValue={categories[0]} className="rounded-xl border border-mist px-3 py-2.5 text-sm text-ink">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input name="note" maxLength={2000} placeholder="Optional note to the client"
              className="flex-1 rounded-xl border border-mist px-4 py-2.5 text-sm text-ink outline-none focus:border-navy-ink" />
          </div>
        </>
      ) : null}
      <input name="file" type="file" accept={ACCEPT} required className="text-sm text-ink file:mr-3 file:rounded-lg file:border file:border-mist file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold" />
      <button type="submit" disabled={state === 'sending'}
        className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60">
        {state === 'sending' ? 'Sending…' : supersedesId ? 'Replace with new version' : 'Send for client review'}
      </button>
      {message ? <p className={`text-xs ${state === 'error' ? 'text-red-700' : 'text-muted'}`} role="status">{message}</p> : null}
    </form>
  );
}
