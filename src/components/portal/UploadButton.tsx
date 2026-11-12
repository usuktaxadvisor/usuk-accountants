'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv,application/pdf';

export default function UploadButton({ requestId }: { requestId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  /** Uploads one file and returns the server's message, or throws with a client-friendly reason. */
  async function uploadOne(file: File): Promise<string> {
    const LARGE = 4 * 1024 * 1024; // above this, Vercel's request-body limit applies → streamed path
    const mime = file.type || 'application/octet-stream';
    let res: Response;
    if (file.size > LARGE) {
      const s = await fetch('/api/portal/upload/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, filename: file.name, size: file.size, mime }),
      });
      const sess = (await s.json().catch(() => ({}))) as { sessionUrl?: string; storedName?: string; sig?: string; error?: string };
      if (!s.ok || !sess.sessionUrl) throw new Error(sess.error ?? 'Something went wrong. Please try again.');
      const put = await fetch(sess.sessionUrl, { method: 'PUT', headers: { 'Content-Type': mime }, body: file });
      const uploaded = (await put.json().catch(() => ({}))) as { id?: string };
      if (!put.ok || !uploaded.id) throw new Error('Upload was interrupted — please try again.');
      res = await fetch('/api/portal/upload/complete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, fileId: uploaded.id, storedName: sess.storedName, size: file.size, originalName: file.name, mime, sig: sess.sig }),
      });
    } else {
      const form = new FormData();
      form.set('file', file);
      form.set('requestId', requestId);
      res = await fetch('/api/portal/upload', { method: 'POST', body: form });
    }
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string };
    if (res.ok && data.ok) return data.message ?? 'Your document has been securely received.';
    throw new Error(data.error ?? 'Something went wrong. Please try again.');
  }

  async function onPick(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setState('uploading');
    setMessage(files.length > 1 ? `Uploading 1 of ${files.length}…` : '');
    const failed: string[] = [];
    let lastOk = '';
    try {
      // One at a time, so a large batch of statements never trips the request limits.
      for (let i = 0; i < files.length; i++) {
        if (files.length > 1) setMessage(`Uploading ${i + 1} of ${files.length}…`);
        try { lastOk = await uploadOne(files[i]); }
        catch (e) { failed.push(`${files[i].name}: ${e instanceof Error ? e.message : 'upload failed'}`); }
      }
    } catch {
      failed.push('Connection problem — please try again.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
    const done = files.length - failed.length;
    if (failed.length === 0) {
      setState('done');
      setMessage(files.length > 1 ? `All ${files.length} documents have been securely received.` : lastOk);
    } else {
      setState(done > 0 ? 'done' : 'error');
      setMessage(`${done} of ${files.length} received. Not received: ${failed.join('; ')}`);
    }
    if (done > 0) router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <input ref={inputRef} type="file" accept={ACCEPT} multiple className="hidden"
        onChange={(e) => onPick(e.target.files)} />
      <button type="button" disabled={state === 'uploading'}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60">
        {state === 'uploading' ? 'Uploading…' : state === 'done' ? 'Upload more' : 'Upload documents'}
      </button>
      {message ? (
        <p className={`max-w-72 text-right text-xs ${state === 'error' ? 'text-red-700' : 'text-muted'}`} role="status">{message}</p>
      ) : null}
    </div>
  );
}
