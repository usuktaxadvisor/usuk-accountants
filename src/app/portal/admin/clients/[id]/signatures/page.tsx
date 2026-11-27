import Link from 'next/link';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { notFound } from 'next/navigation';
import { eq, inArray } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { clientExists } from '@/lib/portal/client-overview';
import { listDeliveriesForClient } from '@/lib/portal/deliveries';
import { listRequestsForClient, latestIdentityVerification } from '@/lib/portal/esign-store';
import { SIG_ACTION_LABEL, SIG_STATUS_LABEL } from '@/lib/portal/esign';
import { listSigningMembers } from '@/lib/portal/members';
import SignatureRequestForm from '@/components/portal/SignatureRequestForm';
import IdvForm from '@/components/portal/IdvForm';
import { EmptyNote, Pill, btn, shortDate } from '@/components/portal/classic/ui';
import { SectionHead, SubHead } from '@/components/portal/classic/sections';

export const dynamic = 'force-dynamic';

const OPEN = ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED', 'DRAFT'];
const SIGNER: Record<string, string> = { PENDING: 'Not opened yet', VIEWED: 'Opened', CONSENTED: 'Agreed to sign electronically', APPROVED: 'Approved', SIGNED: 'Signed', DECLINED: 'Declined' };

/** Signature and approval requests: who still needs to act, who has, when, and the documents involved. */
export default async function SignaturesSection({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const client = await clientExists(id);
  if (!client) notFound();
  const reqs = await listRequestsForClient(id);
  const ids = reqs.map(r => r.id);
  const signers = ids.length ? await db.select().from(tables.signatureSigners).where(inArray(tables.signatureSigners.requestId, ids)) : [];
  const docs = ids.length ? await db.select({ requestId: tables.signatureRequestDocuments.requestId, deliveryId: tables.deliveries.id, title: tables.deliveries.title, version: tables.deliveries.version })
    .from(tables.signatureRequestDocuments).innerJoin(tables.deliveries, eq(tables.deliveries.id, tables.signatureRequestDocuments.deliveryId))
    .where(inArray(tables.signatureRequestDocuments.requestId, ids)) : [];
  const deliveries = await listDeliveriesForClient(id);
  const signingMembers = await listSigningMembers(id);
  const idv = await latestIdentityVerification(id, client.userId);
  const hasIdv = !!idv && (!idv.validUntil || idv.validUntil > new Date());

  const pending = reqs.filter(r => OPEN.includes(r.status));
  const completed = reqs.filter(r => r.status === 'COMPLETED');
  const closed = reqs.filter(r => !OPEN.includes(r.status) && r.status !== 'COMPLETED');

  const card = (r: typeof reqs[number]) => {
    const who = signers.filter(s => s.requestId === r.id).sort((a, b) => a.sequence - b.sequence);
    const linked = docs.filter(d => d.requestId === r.id);
    const overdue = r.dueAt && r.dueAt < new Date() && OPEN.includes(r.status);
    return (
      <article key={r.id} id={`s-${r.id}`} className={`scroll-mt-24 rounded-md border bg-white ${overdue ? 'border-crimson/40' : 'border-mist'}`}>
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0">
            <h4 className="text-[15px] font-semibold text-navy-ink">{r.title}</h4>
            <p className="mt-1 text-xs text-muted">{SIG_ACTION_LABEL[r.action]} · sent {shortDate(r.sentAt)}{r.dueAt ? <> · due <span className={overdue ? 'font-semibold text-crimson' : ''}>{shortDate(r.dueAt)}</span></> : ''}{r.completedAt ? ` · completed ${shortDate(r.completedAt)}` : ''}</p>
          </div>
          <Pill tone={r.status === 'COMPLETED' ? 'done' : OPEN.includes(r.status) ? 'waiting' : 'muted'}>{SIG_STATUS_LABEL[r.status]}</Pill>
        </div>
        <ul className="divide-y divide-mist/70 border-t border-mist px-5">
          {who.map(s => {
            const doneAt = s.signedAt ?? s.approvedAt ?? s.declinedAt;
            const finished = ['SIGNED', 'APPROVED', 'DECLINED'].includes(s.status);
            return (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <span><span className="font-semibold text-ink">{s.fullName}</span> <span className="text-xs text-muted">· {s.role.toLowerCase()}{who.length > 1 && r.signingOrder === 'SEQUENTIAL' ? ` · step ${s.sequence}` : ''}</span></span>
                <span className={`text-xs ${finished ? (s.status === 'DECLINED' ? 'font-semibold text-crimson' : 'font-semibold text-[#2F5D46]') : 'text-muted'}`}>{SIGNER[s.status] ?? s.status}{doneAt ? ` · ${shortDate(doneAt)}` : ''}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center gap-2 border-t border-mist bg-porcelain/60 px-5 py-3 text-xs">
          {linked.map(d => <Link key={d.deliveryId} href={`/portal/admin/clients/${id}/work#w-${d.deliveryId}`} className={btn.small}>{d.title} v{d.version}</Link>)}
          {r.status === 'COMPLETED' && r.sealedDriveFileId ? <a href={`/api/portal/esign/requests/${r.id}/signed?download=1`} className={btn.small}>{r.action === 'APPROVAL' ? 'Approved copy' : 'Signed copy'}</a> : null}
          <Link href={`/portal/admin/esign/${r.id}`} className={btn.small}>Full record and actions</Link>
        </div>
      </article>
    );
  };

  return (
    <div>
      <SectionHead clientId={id} title="Signatures & approvals" note="Formal approvals and e-signatures for this client. Engagement letters signed through DocuSign are held in Drive and are not listed here." />
      {!client.archivedAt ? (
        <div className="mt-6 rounded-md border border-mist bg-white p-5">
          <p className="text-sm font-semibold text-navy-ink">Ask for an approval or signature</p>
          <SignatureRequestForm clientId={id} hasIdv={hasIdv} deliveries={deliveries.filter(d => d.status !== 'WITHDRAWN').map(d => ({ id: d.id, title: d.title, version: d.version, mimeType: d.mimeType }))}
            signers={signingMembers.map(m => ({ userId: m.userId, fullName: m.fullName, email: m.email, role: m.role, userStatus: m.userStatus }))} />
          <IdvForm clientId={id} />
          {idv ? <p className="mt-2 text-xs text-muted">Identity verification on file: {idv.method.replace(/_/g, ' ').toLowerCase()} · {shortDate(idv.verifiedAt)}{idv.validUntil ? ` · valid to ${shortDate(idv.validUntil)}` : ''}</p> : null}
        </div>
      ) : null}
      <SubHead title="Waiting on the client" count={pending.length} />
      <div className="mt-3 space-y-3">{pending.length === 0 ? <EmptyNote>No signatures or approvals pending.</EmptyNote> : pending.map(card)}</div>
      <SubHead title="Completed" count={completed.length} />
      <div className="mt-3 space-y-3">{completed.length === 0 ? <EmptyNote>Nothing completed yet.</EmptyNote> : completed.map(card)}</div>
      {closed.length ? (
        <details className="mt-10"><summary className="cursor-pointer text-sm font-semibold text-navy-ink">Declined, withdrawn or expired ({closed.length})</summary>
          <div className="mt-3 space-y-3">{closed.map(card)}</div></details>
      ) : null}
    </div>
  );
}
