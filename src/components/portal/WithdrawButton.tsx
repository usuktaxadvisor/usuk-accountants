'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Staff: withdraw a delivery so the client can no longer open it. */
export default function WithdrawButton({ deliveryId, clientId }: { deliveryId: string; clientId: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function go() {
    if (!confirm('Withdraw this document from the client? They will no longer be able to open it.')) return;
    setBusy(true);
    await fetch(`/api/portal/deliveries/${deliveryId}/withdraw`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId }) });
    setBusy(false);
    router.refresh();
  }
  return <button type="button" onClick={go} disabled={busy} className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-red-700 hover:border-red-700 disabled:opacity-60">{busy ? '…' : 'Withdraw'}</button>;
}
