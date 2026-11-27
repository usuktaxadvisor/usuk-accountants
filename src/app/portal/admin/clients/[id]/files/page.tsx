import { notFound } from 'next/navigation';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { desc, eq } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { clientExists } from '@/lib/portal/client-overview';
import { inferTaxYear } from '@/lib/portal/engagements';
import { listDeliveriesForClient, DELIVERY_STATUS_LABEL } from '@/lib/portal/deliveries';
import { listRequestsForClient } from '@/lib/portal/esign-store';
import { EmptyNote, FileMark, Panel, Pill, btn, fileSize, shortDate } from '@/components/portal/classic/ui';
import { SectionHead, SubHead } from '@/components/portal/classic/sections';

export const dynamic = 'force-dynamic';

type FileRow = { id: string; name: string; size: number; at: Date; request: string };

/** Everything held for this client: their uploads grouped by tax year, our prepared documents, and signed copies. */
export default async function FilesSection({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ q?: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const { q } = await searchParams;
  const client = await clientExists(id);
  if (!client) notFound();

  const rows = await db.select({ d: tables.documents, title: tables.documentRequests.title })
    .from(tables.documents).leftJoin(tables.documentRequests, eq(tables.documentRequests.id, tables.documents.requestId))
    .where(eq(tables.documents.clientId, id)).orderBy(desc(tables.documents.createdAt));
  const needle = (q ?? '').trim().toLowerCase();
  const uploads: FileRow[] = rows.map(r => ({ id: r.d.id, name: r.d.originalName, size: r.d.sizeBytes, at: r.d.createdAt, request: r.title ?? 'Other uploads' }))
    .filter(f => !needle || f.name.toLowerCase().includes(needle) || f.request.toLowerCase().includes(needle));

  // Group by tax year (from the request title, then the file name), then by request.
  const years = new Map<string, Map<string, FileRow[]>>();
  for (const f of uploads) {
    const y = inferTaxYear(f.request) ?? inferTaxYear(f.name) ?? 'Not tied to a year';
    const g = years.get(y) ?? new Map<string, FileRow[]>();
    g.set(f.request, [...(g.get(f.request) ?? []), f]);
    years.set(y, g);
  }
  const yearOrder = [...years.keys()].sort((a, b) => (a === 'Not tied to a year' ? 1 : b === 'Not tied to a year' ? -1 : b.localeCompare(a)));

  const deliveries = (await listDeliveriesForClient(id)).filter(d => !needle || d.title.toLowerCase().includes(needle) || d.originalName.toLowerCase().includes(needle));
  const signed = (await listRequestsForClient(id)).filter(r => r.status === 'COMPLETED');

  return (
    <div>
      <SectionHead clientId={id} title="Documents & files" note="Files held for this client. Open shows the file in a new tab; Download saves a copy. Every open is recorded in the audit trail.">
        <form className="relative">
          <label className="sr-only" htmlFor="file-q">Search files</label>
          <input id="file-q" name="q" defaultValue={q ?? ''} placeholder="Search file or request" className="w-64 rounded-md border border-mist bg-white px-3 py-2 text-sm text-ink outline-none focus:border-navy-ink" />
        </form>
      </SectionHead>

      <SubHead title="From the client" count={uploads.length} />
      {uploads.length === 0 ? <div className="mt-3"><EmptyNote>{needle ? 'No uploaded files match that search.' : 'The client has not uploaded any files yet.'}</EmptyNote></div> : yearOrder.map(y => (
        <section key={y} className="mt-5">
          <h4 className="font-brand text-lg text-navy-ink">{y === 'Not tied to a year' ? y : `Tax year ${y}`}</h4>
          <div className="mt-2 space-y-3">
            {[...years.get(y)!.entries()].map(([request, files]) => (
              <Panel key={request}>
                <p className="border-b border-mist px-5 py-3 text-sm font-semibold text-navy-ink">{request} <span className="font-normal text-muted">· {files.length} file{files.length === 1 ? '' : 's'}</span></p>
                <ul className="divide-y divide-mist/70 px-5">
                  {files.map(f => (
                    <li key={f.id} className="flex flex-wrap items-center gap-3 py-2.5">
                      <FileMark name={f.name} />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm text-ink">{f.name}</p><p className="text-[11px] text-muted">{shortDate(f.at)} · {fileSize(f.size)}</p></div>
                      <a href={`/api/portal/documents/${f.id}/file?client=${id}`} target="_blank" rel="noopener" className={btn.small}>Open</a>
                      <a href={`/api/portal/documents/${f.id}/file?client=${id}&download=1`} className={btn.small}>Download</a>
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        </section>
      ))}

      <SubHead title="Prepared by us" count={deliveries.length} />
      <div className="mt-3">
        {deliveries.length === 0 ? <EmptyNote>Nothing has been shared with the client yet.</EmptyNote> : (
          <Panel><ul className="divide-y divide-mist px-5">
            {deliveries.map(d => (
              <li key={d.id} className="flex flex-wrap items-center gap-3 py-3">
                <FileMark name={d.originalName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-ink">{d.title} <span className="font-normal text-muted">v{d.version}</span></p>
                  <p className="text-[11px] text-muted">{d.originalName} · sent {shortDate(d.sentAt)} · {fileSize(d.sizeBytes)}</p>
                </div>
                <Pill tone={d.status === 'APPROVED' ? 'done' : d.status === 'WITHDRAWN' ? 'muted' : d.status === 'CHANGES_REQUESTED' ? 'attention' : 'waiting'}>{DELIVERY_STATUS_LABEL[d.status]}</Pill>
                <a href={`/api/portal/deliveries/${d.id}/file?client=${id}`} target="_blank" rel="noopener" className={btn.small}>Open</a>
                <a href={`/api/portal/deliveries/${d.id}/file?client=${id}&download=1`} className={btn.small}>Download</a>
              </li>
            ))}
          </ul></Panel>
        )}
      </div>

      <SubHead title="Signed and approved copies" count={signed.length} />
      <div className="mt-3">
        {signed.length === 0 ? <EmptyNote>No completed signatures or approvals yet.</EmptyNote> : (
          <Panel><ul className="divide-y divide-mist px-5">
            {signed.map(r => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-navy-ink">{r.title}</p><p className="text-[11px] text-muted">Completed {shortDate(r.completedAt)}</p></div>
                {r.sealedDriveFileId ? <a href={`/api/portal/esign/requests/${r.id}/signed?download=1`} className={btn.small}>{r.action === 'APPROVAL' ? 'Approved copy' : 'Signed copy'}</a> : null}
                <a href={`/api/portal/esign/requests/${r.id}/evidence?format=pdf`} className={btn.small}>Evidence record</a>
              </li>
            ))}
          </ul></Panel>
        )}
      </div>
    </div>
  );
}
