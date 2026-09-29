import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/portal/auth';
import { assessClient } from '@/lib/portal/client-lifecycle';
import ClientDeleteForm from '@/components/portal/ClientDeleteForm';

export const dynamic = 'force-dynamic';

const fmt = (d: Date | null) => d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '—';

/** Staff: review page before archiving or deleting a client — the system's decision, in plain English, then confirmation. */
export default async function DeleteClientPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string }> }) {
  await requireRole('STAFF');
  const { id } = await params;
  const { mode } = await searchParams;
  const a = await assessClient(id);
  if (!a) notFound();
  const archiveMode = mode === 'archive';
  const headline = archiveMode ? 'Archive client'
    : a.decision === 'FULL_DELETE_ALLOWED' ? 'Permanent deletion is available'
    : a.decision === 'ARCHIVE_ONLY' ? 'Deletion unavailable while legal hold is active'
    : 'Permanent deletion is not available — protected records must be retained';
  const c = a.counts;
  const rows: Array<[string, string]> = [
    ['Client', `${a.client.name} · ${a.client.ref}`], ['Primary email', a.client.primaryEmail],
    ['Status', a.client.archivedAt ? `Archived ${fmt(a.client.archivedAt)}${a.client.dataMinimisedAt ? ' · removable data deleted' : ''}` : 'Active'],
    ['People / active logins', `${c.members} / ${c.activeLogins}`],
    ['Engagements (document requests)', `${c.documentRequests} (${c.openDocumentRequests} open)`],
    ['Documents', `${c.uploads} uploaded by the client · ${c.deliveries} sent for review`],
    ['Signature & approval records', `${c.signatureRequests} (${c.openSignatureRequests} open, ${c.completedSignatures} completed, ${c.evidenceCertificates} evidence certificates)`],
    ['Identity-verification records', String(c.identityVerifications)],
    ['Legal hold', a.legalHold ? 'YES — active' : 'No'],
    ['Retention', a.retainUntil ? `${a.retentionActive ? 'Active until' : 'Ended'} ${fmt(a.retainUntil)}` : c.signatureRequests ? 'Applies (date not yet set)' : 'None'],
    ['Drive files', String(c.driveFiles)],
  ];
  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/portal/admin/clients/${id}`} className="text-xs font-semibold uppercase tracking-widest text-muted">← {a.client.name}</Link>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{headline}</h1>
      <p className="mt-2 text-sm text-ink">{archiveMode ? 'Archiving hides the client from the working list, removes portal access for its people and voids any open signing requests. Everything else — documents, signature evidence, audit trail, Drive files — stays exactly as it is, and the client can be restored later.' : a.reason}</p>

      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 rounded-2xl border border-mist bg-white p-5 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {rows.map(([k, v]) => (<div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="text-ink">{v}</dd></div>))}
      </dl>

      {!archiveMode ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-mist bg-porcelain p-4 text-sm"><p className="font-semibold text-ink">Will be kept</p><ul className="mt-2 list-disc pl-5 text-xs text-ink">{a.retained.map(x => <li key={x}>{x}</li>)}</ul></div>
          <div className="rounded-2xl border border-mist bg-porcelain p-4 text-sm"><p className="font-semibold text-ink">Will be removed</p>{a.deletable.length ? <ul className="mt-2 list-disc pl-5 text-xs text-ink">{a.deletable.map(x => <li key={x}>{x}</li>)}</ul> : <p className="mt-2 text-xs text-muted">Nothing — archive only.</p>}</div>
        </div>
      ) : null}

      <div className="mt-6">
        <ClientDeleteForm a={JSON.parse(JSON.stringify(a))} mode={archiveMode ? 'archive' : 'delete'} />
      </div>
      {!archiveMode && a.decision !== 'ARCHIVE_ONLY' && !a.client.archivedAt ? (
        <p className="mt-4 text-xs text-muted">Not sure? <Link href={`/portal/admin/clients/${id}/delete?mode=archive`} className="font-semibold text-navy-ink underline">Archive the client instead</Link> — it can be restored at any time.</p>
      ) : null}
    </div>
  );
}
