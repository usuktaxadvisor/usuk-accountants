'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv';

export default function UploadButton({ requestId }: { requestId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function onPick(file: File | undefined) {
    if (!file) return;
    setState('uploading');
    setMessage('');
    const LARGE = 4 * 1024 * 1024; // above this, Vercel's request-body limit applies → streamed path
    try {
      let res: Response;
      if (file.size > LARGE) {
        const s = await fetch('/api/portal/upload/session', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId, filename: file.name, size: file.size, mime: file.type || 'application/octet-stream' }),
        });
        const sess = (await s.json().catch(() => ({}))) as { sessionUrl?: string; storedName?: string; sig?: string; error?: string };
        if (!s.ok || !sess.sessionUrl) { setState('error'); setMessage(sess.error ?? 'Something went wrong. Please try again.'); return; }
        const put = await fetch(sess.sessionUrl, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
        const uploaded = (await put.json().catch(() => ({}))) as { id?: string };
        if (!put.ok || !uploaded.id) { setState('error'); setMessage('Upload was interrupted — please try again.'); return; }
        res = await fetch('/api/portal/upload/complete', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId, fileId: uploaded.id, storedName: sess.storedName, size: file.size, originalName: file.name, mime: file.type || 'application/octet-stream', sig: sess.sig }),
        });
      } else {
        const form = new FormData();
        form.set('file', file);
        form.set('requestId', requestId);
        res = await fetch('/api/portal/upload', { method: 'POST', body: form });
      }
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string };
      if (res.ok && data.ok) {
        setState('done');
        setMessage(data.message ?? 'Your document has been securely received.');
        router.refresh();
      } else {
        setState('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setState('error');
      setMessage('Connection problem — please try again.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <input ref={inputRef} type="file" accept={ACCEPT} className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])} />
      <button type="button" disabled={state === 'uploading'}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60">
        {state === 'uploading' ? 'Uploading…' : state === 'done' ? 'Upload another' : 'Upload document'}
      </button>
      {message ? (
        <p className={`max-w-56 text-right text-xs ${state === 'error' ? 'text-red-700' : 'text-muted'}`} role="status">{message}</p>
      ) : null}
    </div>
  );
}
