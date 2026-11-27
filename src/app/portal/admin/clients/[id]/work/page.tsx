import Link from 'next/link';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { notFound } from 'next/navigation';
import { eq, inArray } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { clientExists } from '@/lib/portal/client-overview';
import { DELIVERY_CATEGORIES, DELIVERY_STATUS_LABEL, canReplace, canWithdraw, listDeliveriesForClient, listResponsesForClient, type DeliveryRow } from '@/lib/portal/deliveries';
import { SIG_STATUS_LABEL } from '@/lib/portal/esign';
import DeliveryUploadForm from '@/components/portal/DeliveryUploadForm';
import WithdrawButton from '@/components/portal/WithdrawButton';
import { EmptyNote, Pill, btn, fileSize, shortDate } from '@/components/portal/classic/ui';
import { SectionHead, SubHead } from '@/components/portal/classic/sections';

export const dynamic = 'force-dynamic';

/** Work shared with the client: grouped by where it stands, newest version first, with its signature step if any. */
export default async function WorkSection({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const client = await clientExists(id);
  if (!client) notFound();
  const all = await listDeliveriesForClient(id);
  const responses = await listResponsesForClient(id);
  const byId = new Map(all.map(d => [d.id, d]));
  const superseded = new Set(all.map(d => d.supersedesId).filter(Boolean) as string[]);
  const chainOf = (d: DeliveryRow) => { const out: DeliveryRow[] = []; let cur = d.supersedesId ? byId.get(d.supersedesId) : undefined; while (cur && out.length < 50) { out.push(cur); cur = cur.supersedesId ? byId.get(cur.supersedesId) : undefined; } return out; };
  const latest = all.filter(d => !superseded.has(d.id));

  const links = all.length ? await db.select({ deliveryId: tables.signatureRequestDocuments.deliveryId, requestId: tables.signatureRequests.id, status: tables.signatureRequests.status, title: tables.signatureRequests.title })
    .from(tables.signatureRequestDocuments).innerJoin(tables.signatureRequests, eq(tables.signatureRequests.id, tables.signatureRequestDocuments.requestId))
    .where(inArray(tables.signatureRequestDocuments.deliveryId, all.map(d => d.id))) : [];
  const sigFor = (d: DeliveryRow) => links.filter(l => l.deliveryId === d.id || chainOf(d).some(o => o.id === l.deliveryId));
  const lastResponse = (did: string) => responses.find(r => r.deliveryId === did) ?? null;

  const groups: Array<[string, DeliveryRow[], string]> = [
    ['Awaiting client feedback', latest.filter(d => d.status === 'READY_FOR_REVIEW' || d.status === 'VIEWED'), 'Nothing is waiting for the client to review.'],
    ['Changes requested', latest.filter(d => d.status === 'CHANGES_REQUESTED'), 'No change requests from the client.'],
    ['Approved', latest.filter(d => d.status === 'APPROVED'), 'Nothing approved yet.'],
  ];
  const withdrawn = latest.filter(d => d.status === 'WITHDRAWN');

  const item = (d: DeliveryRow) => {
    const resp = lastResponse(d.id);
    const older = chainOf(d);
    const sigs = sigFor(d);
    return (
      <article key={d.id} id={`w-${d.id}`} className={`scroll-mt-24 rounded-md border bg-white ${d.status === 'CHANGES_REQUESTED' ? 'border-gold/60' : 'border-mist'} ${d.status === 'WITHDRAWN' ? 'opacity-70' : ''}`}>
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0">
            <h4 className="text-[15px] font-semibold text-navy-ink">{d.title} <span className="ml-1 text-xs font-normal text-muted">version {d.version}{d.category ? ` · ${d.category}` : ''}</span></h4>
            <p className="mt-1 text-xs text-muted">Sent {shortDate(d.sentAt)} · {fileSize(d.sizeBytes)} · {d.viewedAt ? `opened by the client ${shortDate(d.viewedAt)}` : 'not opened yet'}</p>
            {d.note ? <p className="mt-2 text-sm text-ink">{d.note}</p> : null}
          </div>
          <Pill tone={d.status === 'APPROVED' ? 'done' : d.status === 'CHANGES_REQUESTED' ? 'attention' : d.status === 'WITHDRAWN' ? 'muted' : 'waiting'}>{DELIVERY_STATUS_LABEL[d.status]}</Pill>
        </div>
        {resp ? (
          <div className="mx-5 mb-3 rounded-md border-l-2 border-gold bg-porcelain px-4 py-3 text-sm">
            <p className="text-xs text-muted">Client response · {resp.createdAt.toLocaleString('en-GB')}</p>
            <p className="mt-1 font-semibold text-ink">{resp.decision === 'APPROVED' ? 'Approved' : 'Requested changes'}</p>
            {resp.comment ? <p className="mt-1 whitespace-pre-wrap text-ink">{resp.comment}</p> : null}
          </div>
        ) : null}
        {sigs.length ? (
          <div className="mx-5 mb-3 text-xs text-muted">
            Signature step: {sigs.map(s => <Link key={s.requestId} href={`/portal/admin/clients/${id}/signatures#s-${s.requestId}`} className="font-semibold text-navy-ink underline decoration-mist underline-offset-4 hover:decoration-gold">{s.title} ({SIG_STATUS_LABEL[s.status]})</Link>)}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2 border-t border-mist bg-porcelain/60 px-5 py-3">
          <a href={`/api/portal/deliveries/${d.id}/file?client=${id}`} target="_blank" rel="noopener" className={btn.small}>Open version {d.version}</a>
          <a href={`/api/portal/deliveries/${d.id}/file?client=${id}&download=1`} className={btn.small}>Download</a>
          {canWithdraw(d.status) ? <WithdrawButton deliveryId={d.id} clientId={id} /> : null}
          {older.length ? (
            <details className="w-full text-xs text-muted">
              <summary className="cursor-pointer font-semibold text-navy-ink">Earlier versions ({older.length})</summary>
              <ul className="mt-2 space-y-1">{older.map(o => (
                <li key={o.id}>Version {o.version} · {shortDate(o.sentAt)} · {DELIVERY_STATUS_LABEL[o.status]} · <a href={`/api/portal/deliveries/${o.id}/file?client=${id}`} target="_blank" rel="noopener" className="font-semibold text-navy-ink underline decoration-mist underline-offset-4">Open</a></li>
              ))}</ul>
            </details>
          ) : null}
        </div>
        {canReplace(d.status) && !client.archivedAt ? <div className="px-5 pb-4"><DeliveryUploadForm clientId={id} categories={DELIVERY_CATEGORIES} supersedesId={d.id} compact /></div> : null}
      </article>
    );
  };

  return (
    <div>
      <SectionHead clientId={id} title="Work for client review" note="Draft returns, reports and letters shared with the client. Each item shows its newest version; earlier versions stay available." />
      {!client.archivedAt ? (
        <div className="mt-6 rounded-md border border-mist bg-white p-5">
          <p className="text-sm font-semibold text-navy-ink">Share a document for review</p>
          <p className="mt-1 text-xs text-muted">It is filed in the client&apos;s Processed Documents folder and they are emailed to review it.</p>
          <DeliveryUploadForm clientId={id} categories={DELIVERY_CATEGORIES} />
        </div>
      ) : null}
      {groups.map(([title, list, empty]) => (
        <div key={title}>
          <SubHead title={title} count={list.length} />
          <div className="mt-3 space-y-3">{list.length === 0 ? <EmptyNote>{empty}</EmptyNote> : list.map(item)}</div>
        </div>
      ))}
      {withdrawn.length ? (
        <details className="mt-10"><summary className="cursor-pointer text-sm font-semibold text-navy-ink">Withdrawn ({withdrawn.length})</summary>
          <div className="mt-3 space-y-3">{withdrawn.map(item)}</div></details>
      ) : null}
    </div>
  );
}
