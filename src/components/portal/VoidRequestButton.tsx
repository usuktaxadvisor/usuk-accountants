'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VoidRequestButton({ requestId }: { requestId: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function go() {
    const reason = prompt('Void this request? The client will no longer be able to sign it. Reason:');
    if (!reason) return;
    setBusy(true);
    await fetch(`/api/portal/esign/requests/${requestId}/void`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
    setBusy(false); router.refresh();
  }
  return <button type="button" onClick={go} disabled={busy} className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-red-700 hover:border-red-700 disabled:opacity-60">{busy ? '…' : 'Void'}</button>;
}
