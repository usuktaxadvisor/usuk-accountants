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
import RequestCard from '@/components/portal/classic/RequestCard';
import { EmptyNote, PageTitle, Pill, SectionTitle, btn, fileSize, shortDate } from '@/components/portal/classic/ui';
import { nestFiles } from '@/lib/portal/request-view';

export const dynamic = 'force-dynamic';


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

  const items = nestFiles(requests, docs);
  const needed = items.filter(i => i.status === 'REQUESTED' || i.status === 'UNDER_REVIEW');
  const withUs = items.filter(i => i.status === 'UPLOADED' || i.status === 'RECEIVED');
  const complete = items.filter(i => i.status === 'COMPLETED');
  const receivedCount = items.length - open.length;
  const pct = items.length ? Math.round((receivedCount / items.length) * 100) : 0;
  const reviewsDue = mayApprove ? awaiting.length : 0;
  const actionCount = open.length + reviewsDue + sigOpen.length;
  const firstName = client ? client.displayName.split(' ')[0] : '';
  const fileHref = (fileId: string) => `/api/portal/documents/${fileId}/file`;

  return (
    <div>
      <PageTitle title={`Welcome${firstName ? `, ${firstName}` : ''}`}
        meta={actionCount
          ? [open.length ? `${open.length} document${open.length === 1 ? '' : 's'} to upload` : null, reviewsDue ? `${reviewsDue} document${reviewsDue === 1 ? '' : 's'} to review` : null, sigOpen.length ? `${sigOpen.length} to approve or sign` : null].filter(Boolean).join(' · ') + '.'
          : 'Nothing is waiting on you right now. We will email you when we need anything.'}>
        <form action={doLogout}><button className={btn.secondary}>Log out</button></form>
      </PageTitle>

      {items.length ? (
        <div className="mt-8 rounded-md border border-mist bg-white px-6 py-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink"><span className="font-brand text-2xl text-navy-ink">{receivedCount}</span> of {items.length} requested documents received</p>
            <p className="text-xs text-muted">{complete.length} checked and complete</p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Documents received">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-antique to-gold" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ) : null}

      {sigOpen.length || sigWaiting.length || sigOtherOpen.length ? (
        <section className="mt-12">
          <SectionTitle title="To approve or sign" count={sigOpen.length} note="Please read each document carefully before you approve or sign it." />
          <div className="mt-4 space-y-3">
            {sigOpen.map(r => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gold/50 bg-white px-5 py-4">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-navy-ink">{r.title}</p>
                  <p className="mt-1 text-xs text-muted">Sent {shortDate(r.sentAt)}{r.dueAt ? <> · please complete by <span className="font-semibold text-ink">{shortDate(r.dueAt)}</span></> : null}</p>
                </div>
                <a href={`/portal/sign/${r.id}`} className={btn.primary}>{SIG_ACTION_LABEL[r.action]}</a>
              </div>
            ))}
            {sigWaiting.map(r => {
              const who = waitingOn(r);
              const done = signersOf(r.id).find(s => s.userId === session.uid && signerIsComplete(r.action, s.status));
              return (
                <div key={r.id} className="rounded-md border border-mist bg-white px-5 py-4 text-sm">
                  <p className="font-semibold text-navy-ink">{r.title}</p>
                  <p className="mt-1 text-xs text-muted">{done ? 'You have completed your part. Waiting for the other signer.' : who ? `Waiting for ${who} to complete their part first. We will email you when it is your turn.` : 'Not yet your turn.'}</p>
                </div>
              );
            })}
            {sigOtherOpen.map(r => (
              <div key={r.id} className="rounded-md border border-mist bg-white px-5 py-4 text-sm">
                <p className="font-semibold text-navy-ink">{r.title}</p>
                <p className="mt-1 text-xs text-muted">Being handled by another person on your account · {SIG_STATUS_LABEL[r.status]}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {deliveries.length ? (
        <section className="mt-12">
          <SectionTitle title="Prepared for you" count={deliveries.length} note="Documents our team has prepared. Open each one, then let us know it looks right or what should change." />
          <div className="mt-4 space-y-3">
            {deliveries.map(d => {
              const resp = myResponse(d.id);
              const due = canClientRespond(d.status);
              return (
                <div key={d.id} className={`rounded-md border bg-white px-5 py-4 ${due && mayApprove ? 'border-gold/50' : 'border-mist'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-navy-ink">{d.title}</p>
                      <p className="mt-1 text-xs text-muted">{shortDate(d.sentAt)}{d.category ? ` · ${d.category}` : ''} · {fileSize(d.sizeBytes)}</p>
                      {d.note ? <p className="mt-2 text-sm leading-relaxed text-ink">{d.note}</p> : null}
                    </div>
                    <Pill tone={due ? 'action' : d.status === 'APPROVED' ? 'done' : 'neutral'}>{DELIVERY_STATUS_LABEL[d.status]}</Pill>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={`/api/portal/deliveries/${d.id}/file`} target="_blank" rel="noopener" className={btn.primary}>View document</a>
                    <a href={`/api/portal/deliveries/${d.id}/file?download=1`} className={btn.secondary}>Download</a>
                  </div>
                  {due ? (mayApprove ? <DeliveryResponseForm deliveryId={d.id} /> : <p className="mt-3 text-xs text-muted">Awaiting the account holder&apos;s response. Your access is view only.</p>) : resp ? (
                    <p className="mt-3 text-xs text-muted">{resp.respondedById === session.uid ? 'You' : 'Another person on your account'} {resp.decision === 'APPROVED' ? 'approved this' : 'requested changes'} on {shortDate(resp.createdAt)}.{resp.comment ? ` “${resp.comment}”` : ''}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <SectionTitle title="Documents we need from you" count={needed.length}
          note={needed.length ? 'Upload each item against its request. You can select several files at once.' : undefined} />
        <div className="mt-4 grid items-start gap-3 lg:grid-cols-2">
          {needed.length === 0 ? <EmptyNote>{items.length ? 'Thank you. We have everything we asked for so far.' : 'No document requests yet. When our team needs something from you, it will appear here.'}</EmptyNote> : needed.map(i => (
            <RequestCard key={i.id} item={i} audience="client" fileHref={fileHref}
              actions={<div className="flex w-full flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted">{i.status === 'UNDER_REVIEW' ? 'We have your upload and may need a little more. Add anything extra here.' : 'PDF, photos, Word or Excel, up to 25 MB each.'}</span>
                <UploadButton requestId={i.id} />
              </div>} />
          ))}
        </div>
      </section>

      {withUs.length ? (
        <section className="mt-12">
          <SectionTitle title="With our team" count={withUs.length} note="Received and being checked. You can still add a missing page." />
          <div className="mt-4 grid items-start gap-3 lg:grid-cols-2">
            {withUs.map(i => (
              <RequestCard key={i.id} item={i} audience="client" fileHref={fileHref} collapsedAfter={3}
                actions={i.status === 'UPLOADED' ? <UploadButton requestId={i.id} /> : undefined} />
            ))}
          </div>
        </section>
      ) : null}

      {complete.length || sigDone.length ? (
        <section className="mt-12">
          <details className="group">
            <summary className="cursor-pointer list-none marker:hidden">
              <SectionTitle title="Completed" count={complete.length + sigDone.length}>
                <span className="text-xs font-semibold text-navy-ink"><span className="group-open:hidden">Show</span><span className="hidden group-open:inline">Hide</span></span>
              </SectionTitle>
            </summary>
            <div className="mt-4 space-y-3">
              {sigDone.map(r => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-mist bg-white px-5 py-3 text-sm">
                  <p><span className="font-semibold text-navy-ink">{r.title}</span> <span className="text-xs text-muted">· completed {shortDate(r.completedAt)}</span></p>
                  <div className="flex gap-2">
                    {r.sealedDriveFileId ? <a href={`/api/portal/esign/requests/${r.id}/signed?download=1`} className={btn.small}>{r.action === 'APPROVAL' ? 'Approved copy' : 'Signed copy'}</a> : null}
                    <a href={`/api/portal/esign/requests/${r.id}/evidence?format=pdf`} className={btn.small}>{r.action === 'APPROVAL' ? 'Approval record' : 'Signature record'}</a>
                  </div>
                </div>
              ))}
              <div className="grid items-start gap-3 lg:grid-cols-2">
                {complete.map(i => <RequestCard key={i.id} item={i} audience="client" fileHref={fileHref} collapsedAfter={3} />)}
              </div>
            </div>
          </details>
        </section>
      ) : null}
    </div>
  );
}
