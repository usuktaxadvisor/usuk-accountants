import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { loadBundle, listEvents, getEvidence } from '@/lib/portal/esign-store';
import { SIG_STATUS_LABEL, SIG_ACTION_LABEL, SIG_DOC_KIND_LABEL, canVoid, verifyChain } from '@/lib/portal/esign';
import VoidRequestButton from '@/components/portal/VoidRequestButton';

export const dynamic = 'force-dynamic';

/** Staff: the signature record — signers, frozen documents, hash-chained event log, evidence downloads. */
export default async function SignatureRecord({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('STAFF');
  const { id } = await params;
  const bundle = await loadBundle(id);
  if (!bundle) notFound();
  const { request, docs, signers, fields } = bundle;
  const [client] = await db.select().from(tables.clients).where(eq(tables.clients.id, request.clientId)).limit(1);
  const events = await listEvents(id);
  const chain = verifyChain(events.map(e => ({ requestId: e.requestId, signerId: e.signerId, actorUserId: e.actorUserId, type: e.type, at: e.at.toISOString(), ip: e.ip, userAgent: e.userAgent, meta: (e.meta as Record<string, unknown> | null) ?? null, prevHash: e.prevHash, hash: e.hash })));
  const evidence = await getEvidence(id);
  const deliveries = await Promise.all(docs.map(async d => { const [dl] = await db.select({ title: tables.deliveries.title }).from(tables.deliveries).where(eq(tables.deliveries.id, d.deliveryId)).limit(1); return { ...d, title: dl?.title ?? '—' }; }));
  const fmt = (d: Date | null | undefined) => d ? d.toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC' : '—';

  return (
    <div>
      <Link href="/portal/admin/esign" className="text-xs font-semibold uppercase tracking-widest text-muted">← Signatures &amp; approvals</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{request.title}</h1>
          <p className="text-sm text-muted">{client?.displayName} ({client?.clientRef}) · {SIG_ACTION_LABEL[request.action]} · {SIG_DOC_KIND_LABEL[request.docKind]} · {request.signingOrder.toLowerCase()} signing</p>
          <p className="mt-1 text-xs text-muted">Request ID {request.id} · created {fmt(request.createdAt)} · sent {fmt(request.sentAt)} · {request.expiresAt ? `expires ${fmt(request.expiresAt)}` : ''}{request.completedAt ? ` · completed ${fmt(request.completedAt)}` : ''}{request.closedAt ? ` · closed ${fmt(request.closedAt)} (${request.closedReason})` : ''}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-muted">{SIG_STATUS_LABEL[request.status]}</span>
          {canVoid(request.status) ? <VoidRequestButton requestId={request.id} /> : null}
        </div>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-mist bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Documents (frozen)</h2>
          {deliveries.map(d => <div key={d.id} className="mt-2 text-sm"><p className="font-semibold text-ink">{d.title} <span className="text-xs font-normal text-muted">v{d.deliveryVersion}{d.requiresSignature ? '' : ' · review only'}</span></p><p className="break-all font-mono text-[11px] text-muted">SHA-256 {d.frozenSha256}</p><p className="text-xs text-muted">{d.frozenSizeBytes} bytes · frozen {fmt(d.frozenAt)} · <a className="underline" href={`/api/portal/esign/requests/${request.id}/file?doc=${d.deliveryId}`} target="_blank" rel="noopener">open original</a></p></div>)}
          {request.sealedSha256 ? <div className="mt-3 rounded-xl bg-porcelain p-3 text-sm"><p className="font-semibold text-ink">Sealed signed PDF</p><p className="break-all font-mono text-[11px] text-muted">SHA-256 {request.sealedSha256}</p><a className="text-xs font-semibold text-navy-ink underline" href={`/api/portal/esign/requests/${request.id}/signed?download=1`}>Download signed PDF</a></div> : null}
        </div>
        <div className="rounded-2xl border border-mist bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Signers</h2>
          {signers.map(s => <div key={s.id} className="mt-2 text-sm"><p className="font-semibold text-ink">{s.sequence}. {s.fullName} <span className="text-xs font-normal text-muted">{s.email} · {s.status.toLowerCase()}</span></p>
            <p className="text-xs text-muted">viewed {fmt(s.viewedAt)} · consent {fmt(s.consentedAt)} ({s.consentVersion ?? '—'}) · code verified {fmt(s.otpVerifiedAt)} · approved {fmt(s.approvedAt)} · signed {fmt(s.signedAt)}{s.signatureMethod ? ` (${s.signatureMethod.toLowerCase()})` : ''}{s.ip ? ` · IP ${s.ip}` : ''}{s.authMethod ? ` · ${s.authMethod}` : ''}{s.identityVerificationId ? ' · identity verification on file' : ''}</p>
            {s.declineReason ? <p className="mt-1 rounded-xl bg-red-50 p-2 text-xs text-red-800">Declined: {s.declineReason}</p> : null}</div>)}
          {fields.length ? <p className="mt-3 text-xs text-muted">{fields.length} field{fields.length === 1 ? '' : 's'} placed: {fields.map(f => `${f.type.toLowerCase()}${f.page === 9999 ? ' (last page)' : f.page === 0 ? ' (signing page)' : ` (p${f.page})`}`).join(', ')}</p> : null}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-mist bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Signature record · event log ({events.length}) · chain {chain.ok ? 'verified' : `BROKEN at #${chain.at + 1}`}</h2>
          <div className="flex gap-2">
            <a href={`/api/portal/esign/requests/${request.id}/evidence`} className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-ink" target="_blank" rel="noopener">View signature record (JSON)</a>
            {evidence ? <a href={`/api/portal/esign/requests/${request.id}/evidence?format=pdf`} className="rounded-lg bg-navy-ink px-3 py-1.5 text-xs font-semibold text-white">Download evidence certificate</a> : null}
          </div>
        </div>
        {evidence ? <p className="mt-2 break-all font-mono text-[11px] text-muted">Certificate SHA-256 {evidence.certificateSha256} · stored {fmt(evidence.createdAt)}</p> : null}
        <ol className="mt-3 space-y-1 text-xs">
          {events.map((e, i) => <li key={e.id} className="rounded-lg bg-porcelain px-3 py-1.5"><span className="font-mono text-muted">{String(i + 1).padStart(3, '0')}</span> <span className="text-muted">{e.at.toISOString()}</span> <span className="font-semibold text-ink">{e.type.replace(/_/g, ' ')}</span>{e.signerId ? ` · ${signers.find(s => s.id === e.signerId)?.fullName ?? 'signer'}` : e.actorUserId ? ' · staff' : ' · system'}{e.ip ? ` · ${e.ip}` : ''}{e.meta ? <span className="ml-1 break-all font-mono text-[10px] text-muted">{JSON.stringify(e.meta)}</span> : null}</li>)}
        </ol>
      </section>
    </div>
  );
}
