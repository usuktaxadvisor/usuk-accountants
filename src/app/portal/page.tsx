import { redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import { portalSession, signOut } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import UploadButton from '@/components/portal/UploadButton';
import DeliveryResponseForm from '@/components/portal/DeliveryResponseForm';
import { DELIVERY_STATUS_LABEL, canClientAccess, canClientRespond, listDeliveriesForClient, listResponsesForClient } from '@/lib/portal/deliveries';
import { listRequestsForClient } from '@/lib/portal/esign-store';
import { canClientApprove } from '@/lib/portal/members';
import { SIG_ACTION_LABEL, SIG_STATUS_LABEL, isOpen, signerIsComplete, signerMayAct, type SigAction } from '@/lib/portal/esign';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: 'Awaiting your upload',
  UPLOADED: 'Uploaded — with our team',
  RECEIVED: 'Received',
  UNDER_REVIEW: 'Under review',
  COMPLETED: 'Completed',
};

export default async function Dashboard() {
  const session = await portalSession();
  if (!session) redirect('/portal/login');
  if (session.role !== 'CLIENT') redirect('/portal/admin');
  if (!session.clientId) redirect('/portal/login');

  const [client] = await db.select({ displayName: tables.clients.displayName })
    .from(tables.clients).where(eq(tables.clients.id, session.clientId)).limit(1);

  const requests = await db.select()
    .from(tables.documentRequests)
    .where(eq(tables.documentRequests.clientId, session.clientId))
    .orderBy(desc(tables.documentRequests.requestedAt));

  const open = requests.filter(r => r.status === 'REQUESTED');

  const deliveries = (await listDeliveriesForClient(session.clientId)).filter(d => canClientAccess(d.status));
  const awaiting = deliveries.filter(d => canClientRespond(d.status));
  const responses = await listResponsesForClient(session.clientId);
  const mayApprove = await canClientApprove(session.clientId, session.uid); // view-only contacts see status only
  const myResponse = (deliveryId: string) => responses.find(r => r.deliveryId === deliveryId) ?? null;
  const sigRequests = await listRequestsForClient(session.clientId);
  // All signer rows for this client's requests (same client → same isolation boundary), so a sequential
  // request only shows an action button to the signer whose turn it is.
  const signerRows = await db.select({ requestId: tables.signatureSigners.requestId, userId: tables.signatureSigners.userId, fullName: tables.signatureSigners.fullName, sequence: tables.signatureSigners.sequence, status: tables.signatureSigners.status })
    .from(tables.signatureSigners).where(eq(tables.signatureSigners.clientId, session.clientId));
  const signersOf = (requestId: string) => signerRows.filter(s => s.requestId === requestId);
  const mine = new Set(signerRows.filter(s => s.userId === session.uid).map(s => s.requestId));
  const myTurn = (r: { id: string; signingOrder: string; action: SigAction }) => {
    const me = signersOf(r.id).find(s => s.userId === session.uid);
    return !!me && !signerIsComplete(r.action, me.status) && signerMayAct(r.signingOrder as 'PARALLEL' | 'SEQUENTIAL', r.action, me, signersOf(r.id));
  };
  /** Who a sequential request is waiting on before this user may act (first incomplete earlier signer). */
  const waitingOn = (r: { id: string; action: SigAction }) => {
    const me = signersOf(r.id).find(s => s.userId === session.uid);
    return signersOf(r.id).filter(s => me && s.sequence < me.sequence && !signerIsComplete(r.action, s.status)).sort((a, b) => a.sequence - b.sequence)[0]?.fullName ?? null;
  };
  const sigOpenAll = sigRequests.filter(r => isOpen(r.status) && mine.has(r.id));
  const sigOpen = sigOpenAll.filter(r => myTurn(r));
  const sigWaiting = sigOpenAll.filter(r => !myTurn(r)); // I am a signer, but it is not (yet / any longer) my turn
  const sigOtherOpen = sigRequests.filter(r => isOpen(r.status) && !mine.has(r.id)); // another member's request — visible, not actionable
  const sigDone = sigRequests.filter(r => r.status === 'COMPLETED' && mine.has(r.id));

  const docs = await db.select()
    .from(tables.documents)
    .where(eq(tables.documents.clientId, session.clientId))
    .orderBy(desc(tables.documents.createdAt));

  async function doLogout() {
    'use server';
    await signOut({ redirectTo: '/portal/login' });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Welcome{client ? `, ${client.displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {open.length === 0 && awaiting.length === 0 && sigOpen.length === 0
              ? 'Nothing is waiting on you right now.'
              : [open.length ? `${open.length} document${open.length === 1 ? '' : 's'} to upload` : null, awaiting.length && mayApprove ? `${awaiting.length} document${awaiting.length === 1 ? '' : 's'} to review` : null, sigOpen.length ? `${sigOpen.length} document${sigOpen.length === 1 ? '' : 's'} to approve or sign` : null].filter(Boolean).join(' · ') + '.'}
          </p>
        </div>
        <form action={doLogout}>
          <button className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">
            Log out
          </button>
        </form>
      </div>

      {sigOpen.length || sigDone.length || sigOtherOpen.length || sigWaiting.length ? (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Documents requiring your action</h2>
          <div className="mt-3 space-y-2">
            {sigOpen.length === 0 ? <p className="rounded-2xl border border-mist bg-white p-5 text-sm text-muted">Nothing to approve or sign right now.</p> : sigOpen.map(r => (
              <div key={r.id} className="rounded-2xl border border-gold/40 bg-white px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.title}</p>
                    <p className="text-xs text-muted">Sent {r.sentAt?.toLocaleDateString('en-GB') ?? ''} · {SIG_STATUS_LABEL[r.status]}{r.dueAt ? ` · please complete by ${r.dueAt.toLocaleDateString('en-GB')}` : ''}</p>
                  </div>
                  <a href={`/portal/sign/${r.id}`} className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink">{SIG_ACTION_LABEL[r.action]}</a>
                </div>
              </div>
            ))}
            {sigWaiting.map(r => {
              const who = waitingOn(r);
              const done = signersOf(r.id).find(s => s.userId === session.uid && signerIsComplete(r.action, s.status));
              return (
                <div key={r.id} className="rounded-2xl border border-mist bg-white px-5 py-4 text-sm">
                  <p className="font-semibold text-ink">{r.title}</p>
                  <p className="text-xs text-muted">{done ? 'You have completed your part · waiting for the other signer(s)' : who ? `Waiting for ${who} to complete their part first — we will email you when it is your turn` : 'Not yet your turn'} · {SIG_STATUS_LABEL[r.status]}</p>
                </div>
              );
            })}
            {sigOtherOpen.map(r => (
              <div key={r.id} className="rounded-2xl border border-mist bg-white px-5 py-4 text-sm">
                <p className="font-semibold text-ink">{r.title}</p>
                <p className="text-xs text-muted">Being handled by another person on your account · {SIG_STATUS_LABEL[r.status]}</p>
              </div>
            ))}
            {sigDone.map(r => (
              <div key={r.id} className="rounded-2xl border border-mist bg-white px-5 py-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p><span className="font-semibold text-ink">{r.title}</span> <span className="text-xs text-muted">· completed {r.completedAt?.toLocaleDateString('en-GB') ?? ''}</span></p>
                  <div className="flex gap-2">
                    {r.sealedDriveFileId ? <a href={`/api/portal/esign/requests/${r.id}/signed?download=1`} className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-ink hover:border-navy-ink">{r.action === 'APPROVAL' ? 'Approved copy' : 'Signed copy'}</a> : null}
                    <a href={`/api/portal/esign/requests/${r.id}/evidence?format=pdf`} className="rounded-lg border border-mist px-3 py-1.5 text-xs font-semibold text-ink hover:border-navy-ink">{r.action === 'APPROVAL' ? 'Approval record' : 'Signature record'}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted">Documents requested</h2>
      <div className="mt-3 space-y-3">
        {requests.length === 0 ? (
          <p className="rounded-2xl border border-mist bg-white p-7 text-sm text-muted">
            No document requests yet. When our team needs something from you, it will appear here.
          </p>
        ) : requests.map(r => (
          <div key={r.id} className="flex items-center justify-between gap-4 rounded-2xl border border-mist bg-white p-6">
            <div>
              <p className="font-semibold text-ink">{r.title}</p>
              {r.description ? <p className="mt-0.5 text-sm text-muted">{r.description}</p> : null}
              {r.deadline ? <p className="mt-1 text-xs text-muted">Needed by {r.deadline.toLocaleDateString('en-GB')}</p> : null}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.status === 'REQUESTED' ? 'bg-gold/10 text-gold-antique' : 'bg-mist text-muted'}`}>
                {STATUS_LABEL[r.status] ?? r.status}
              </span>
              {(r.status === 'REQUESTED' || r.status === 'UPLOADED') ? <UploadButton requestId={r.id} /> : null}
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted">Documents for your review</h2>
      <div className="mt-3 space-y-2">
        {deliveries.length === 0 ? (
          <p className="rounded-2xl border border-mist bg-white p-6 text-sm text-muted">Nothing for you to review yet. When we&apos;ve prepared something for you, it will appear here and we&apos;ll email you.</p>
        ) : deliveries.map(d => {
          const resp = myResponse(d.id);
          return (
            <div key={d.id} className="rounded-2xl border border-mist bg-white px-6 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{d.title}</p>
                  <p className="text-xs text-muted">{d.sentAt.toLocaleDateString('en-GB')}{d.category ? ` · ${d.category}` : ''} · {(d.sizeBytes / 1024 / 1024).toFixed(1)} MB</p>
                  {d.note ? <p className="mt-2 text-sm text-ink">{d.note}</p> : null}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${canClientRespond(d.status) ? 'bg-gold/10 text-gold-antique' : 'bg-mist text-muted'}`}>{DELIVERY_STATUS_LABEL[d.status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={`/api/portal/deliveries/${d.id}/file`} target="_blank" rel="noopener" className="rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink">View document</a>
                <a href={`/api/portal/deliveries/${d.id}/file?download=1`} className="rounded-xl border border-mist px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-navy-ink">Download</a>
              </div>
              {canClientRespond(d.status) ? (mayApprove ? <DeliveryResponseForm deliveryId={d.id} /> : <p className="mt-3 text-xs text-muted">Awaiting the account holder&apos;s response. Your access is view-only.</p>) : resp ? (
                <p className="mt-3 text-xs text-muted">You {resp.decision === 'APPROVED' ? 'approved this' : 'requested changes'} on {resp.createdAt.toLocaleDateString('en-GB')}.{resp.comment ? ` “${resp.comment}”` : ''}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted">Documents submitted</h2>
      <div className="mt-3 space-y-2">
        {docs.length === 0 ? (
          <p className="rounded-2xl border border-mist bg-white p-6 text-sm text-muted">Nothing submitted yet.</p>
        ) : docs.map(d => (
          <div key={d.id} className="flex items-center justify-between gap-4 rounded-2xl border border-mist bg-white px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-ink">{d.originalName}</p>
              <p className="text-xs text-muted">{d.createdAt.toLocaleDateString('en-GB')} · {(d.sizeBytes/1024/1024).toFixed(1)} MB</p>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-muted">{STATUS_LABEL[d.status] ?? d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
