import { notFound, redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { requireRole } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { audit } from '@/lib/portal/audit';
import { notifyClientOfRequest, requestBase } from '@/lib/portal/notify';
import { createInvitation } from '@/lib/portal/invite';
import { sendPortalEmail, resetEmailHtml } from '@/lib/portal/email';
import { DELIVERY_CATEGORIES, DELIVERY_STATUS_LABEL, listDeliveriesForClient, listResponsesForClient, canReplace, canWithdraw } from '@/lib/portal/deliveries';
import DeliveryUploadForm from '@/components/portal/DeliveryUploadForm';
import WithdrawButton from '@/components/portal/WithdrawButton';
import SignatureRequestForm from '@/components/portal/SignatureRequestForm';
import IdvForm from '@/components/portal/IdvForm';
import MembersPanel from '@/components/portal/MembersPanel';
import ClientActionsMenu from '@/components/portal/ClientActionsMenu';
import { listMembers, listSigningMembers } from '@/lib/portal/members';
import { listRequestsForClient, latestIdentityVerification } from '@/lib/portal/esign-store';
import { SIG_ACTION_LABEL, SIG_STATUS_LABEL } from '@/lib/portal/esign';
import Link from 'next/link';
import RequestCard from '@/components/portal/classic/RequestCard';
import { EmptyNote, PageTitle, Panel, Pill, SectionTitle, Stat, REQUEST_STATUS, REQUEST_STATUS_ORDER, btn, fileSize, shortDate } from '@/components/portal/classic/ui';
import { nestFiles, setRequestStatus } from '@/lib/portal/request-view';

export const dynamic = 'force-dynamic';

export default async function ClientDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ email?: string; reset?: string }> }) {
  await requireRole('STAFF');
  const { id } = await params;
  const { email, reset } = await searchParams;

  const [client] = await db.select().from(tables.clients).where(eq(tables.clients.id, id)).limit(1);
  if (!client) notFound();

  const requests = await db.select().from(tables.documentRequests)
    .where(eq(tables.documentRequests.clientId, id)).orderBy(desc(tables.documentRequests.requestedAt));
  const docs = await db.select().from(tables.documents)
    .where(eq(tables.documents.clientId, id)).orderBy(desc(tables.documents.createdAt));
  const deliveries = await listDeliveriesForClient(id);
  const responses = await listResponsesForClient(id);
  const latestResponse = (deliveryId: string) => responses.find(r => r.deliveryId === deliveryId) ?? null;
  const sigRequests = await listRequestsForClient(id);
  const idv = await latestIdentityVerification(id, client.userId);
  const hasIdv = !!idv && (!idv.validUntil || idv.validUntil > new Date());
  const members = await listMembers(id);
  const signingMembers = await listSigningMembers(id);

  async function createRequest(formData: FormData) {
    'use server';
    const s = await requireRole('STAFF');
    const title = String(formData.get('title') ?? '').trim();
    if (!title) return;
    const description = String(formData.get('description') ?? '').trim() || null;
    const [r] = await db.insert(tables.documentRequests).values({ clientId: id, title, description }).returning({ id: tables.documentRequests.id });
    const emailed = await notifyClientOfRequest(id, title);
    await audit(s.uid, 'REQUEST_CREATED', { targetType: 'request', targetId: r.id, meta: { clientId: id, clientEmailed: emailed } });
    redirect(`/portal/admin/clients/${id}${emailed ? '' : '?email=failed'}#requests`);
  }

  async function sendResetLink() {
    'use server';
    const s = await requireRole('STAFF');
    const [row] = await db.select({ userId: tables.users.id, email: tables.users.email, firstName: tables.users.firstName, displayName: tables.clients.displayName })
      .from(tables.clients).innerJoin(tables.users, eq(tables.users.id, tables.clients.userId)).where(eq(tables.clients.id, id)).limit(1);
    if (!row) return;
    const raw = await createInvitation(row.userId, 1); // 24h
    const base = await requestBase();
    const sent = await sendPortalEmail(row.email, 'Reset your portal password — US UK Accountants', resetEmailHtml(row.firstName ?? row.displayName.split(' ')[0], `${base}/portal/invite/${raw}`));
    await audit(s.uid, 'RESET_LINK_SENT', { targetType: 'user', targetId: row.userId, meta: { sent } });
    redirect(`/portal/admin/clients/${id}?reset=${sent ? 'sent' : 'failed'}`);
  }

  async function setStatus(formData: FormData) {
    'use server';
    const s = await requireRole('STAFF');
    await setRequestStatus(s.uid, id, String(formData.get('requestId') ?? ''), String(formData.get('status') ?? ''), 'client-page');
    redirect(`/portal/admin/clients/${id}#requests`);
  }


  const items = nestFiles(requests, docs);
  const byStatus = (st: string) => items.filter(i => i.status === st);
  const waiting = byStatus('REQUESTED');
  const withTeam = items.filter(i => i.status === 'UPLOADED' || i.status === 'RECEIVED' || i.status === 'UNDER_REVIEW');
  const complete = byStatus('COMPLETED');
  const loose = docs.filter(d => !d.requestId || !requests.some(r => r.id === d.requestId));
  const primary = members.find(m => m.userId === client.userId);
  const fileHref = (fileId: string) => `/api/portal/documents/${fileId}/file?client=${id}`;
  const statusForm = (requestId: string, status: string) => (
    <form action={setStatus} className="flex items-center gap-2">
      <input type="hidden" name="requestId" value={requestId} />
      <label className="sr-only" htmlFor={`st-${requestId}`}>Status</label>
      <select id={`st-${requestId}`} name="status" defaultValue={status} className="rounded-md border border-mist bg-white px-2.5 py-1.5 text-xs text-ink">
        {REQUEST_STATUS_ORDER.map(st => <option key={st} value={st}>{REQUEST_STATUS[st].staff}</option>)}
      </select>
      <button className={btn.small}>Save</button>
    </form>
  );
  const sections = [['people', 'People'], ['requests', 'Document requests'], ['work', 'Work for client review'], ['signatures', 'Signatures']] as const;

  return (
    <div>
      <Link href="/portal/admin" className="text-xs font-semibold text-muted hover:text-navy-ink">← All clients</Link>
      <div className="mt-3">
        <PageTitle
          title={<>{client.displayName} <span className="ml-1 align-middle font-sans text-sm font-semibold text-muted tnum">{client.clientRef}</span></>}
          meta={<span className="flex flex-wrap items-center gap-2">
            {client.archivedAt ? <Pill tone="action">Archived</Pill> : <Pill tone="neutral">Active</Pill>}
            {primary ? <span>{primary.fullName} · {primary.email}</span> : null}
            <span>Client since {shortDate(client.createdAt)}</span>
          </span>}>
          {!client.archivedAt ? <form action={sendResetLink}><button className={btn.secondary}>Send password-reset link</button></form> : null}
          <ClientActionsMenu clientId={id} archived={!!client.archivedAt} suspendedMembers={members.filter(m => m.userStatus === 'SUSPENDED' && m.status === 'ACTIVE').map(m => ({ userId: m.userId, name: m.fullName }))} />
        </PageTitle>
      </div>
      {email === 'failed' ? <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">The email to the client could not be sent. The record was saved; use “Send password-reset link” or contact them directly.</p> : null}
      {reset === 'sent' ? <p role="status" className="mt-4 rounded-md border border-mist bg-white px-4 py-3 text-sm text-ink">Password-reset link emailed to the client (valid 24 hours).</p> : null}
      {reset === 'failed' ? <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Reset link created but the email could not be sent. Check the server logs.</p> : null}

      <Panel className="mt-8 grid grid-cols-2 sm:grid-cols-5 sm:divide-x sm:divide-mist">
        <Stat label="Waiting on client" value={waiting.length} />
        <Stat label="Awaiting review" value={byStatus('UPLOADED').length} emphasis={byStatus('UPLOADED').length > 0} href={byStatus('UPLOADED').length ? '/portal/admin/review' : undefined} />
        <Stat label="Needs follow-up" value={byStatus('UNDER_REVIEW').length} />
        <Stat label="Complete" value={complete.length} />
        <Stat label="Documents received" value={docs.length} />
      </Panel>

      <nav aria-label="Client sections" className="sticky top-0 z-10 -mx-5 mt-8 flex gap-5 overflow-x-auto border-b border-mist bg-porcelain/95 px-5 py-3 text-sm font-semibold backdrop-blur sm:-mx-8 sm:px-8">
        {sections.map(([anchor, label]) => <a key={anchor} href={`#${anchor}`} className="shrink-0 text-muted hover:text-navy-ink">{label}</a>)}
      </nav>

      <div id="people" className="mt-10 scroll-mt-20">
        <MembersPanel clientId={id} members={members.map(m => ({ id: m.id, userId: m.userId, fullName: m.fullName, email: m.email, role: m.role, canSign: m.canSign === 1, status: m.status, userStatus: m.userStatus, isPrimary: m.userId === client.userId }))} />
      </div>

      <section className="mt-14">
        <SectionTitle id="requests" title="Document requests" count={items.length}
          note="Each upload sits under the request it answers. Open a file to check it, then save the outcome. The client sees friendly wording and is not emailed about status changes." />
        {!client.archivedAt ? (
          <form action={createRequest} className="mt-5 grid gap-2 rounded-md border border-mist bg-white p-4 sm:grid-cols-[1fr_1.4fr_auto]">
            <label className="sr-only" htmlFor="req-title">Document needed</label>
            <input id="req-title" name="title" required placeholder="Document needed, e.g. 2025 UK P60" className={btn.field} />
            <label className="sr-only" htmlFor="req-desc">Instructions</label>
            <input id="req-desc" name="description" placeholder="Short instructions for the client (optional)" className={btn.field} />
            <button className={btn.primary}>Request and email client</button>
          </form>
        ) : null}

        <h3 className="mt-8 text-sm font-semibold text-navy-ink">Waiting on the client <span className="font-normal text-muted">({waiting.length})</span></h3>
        <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
          {waiting.length === 0 ? <EmptyNote>Nothing outstanding from the client.</EmptyNote> : waiting.map(i => <RequestCard key={i.id} item={i} audience="staff" fileHref={fileHref} actions={statusForm(i.id, i.status)} />)}
        </div>

        <h3 className="mt-8 text-sm font-semibold text-navy-ink">With our team <span className="font-normal text-muted">({withTeam.length})</span></h3>
        <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
          {withTeam.length === 0 ? <EmptyNote>No uploads waiting on us.</EmptyNote> : withTeam.map(i => <RequestCard key={i.id} item={i} audience="staff" fileHref={fileHref} actions={statusForm(i.id, i.status)} />)}
        </div>

        <details className="group mt-8" open={complete.length > 0 && waiting.length + withTeam.length === 0}>
          <summary className="cursor-pointer list-none text-sm font-semibold text-navy-ink marker:hidden">
            <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span> Complete <span className="font-normal text-muted">({complete.length})</span>
          </summary>
          <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
            {complete.map(i => <RequestCard key={i.id} item={i} audience="staff" fileHref={fileHref} actions={statusForm(i.id, i.status)} collapsedAfter={3} />)}
          </div>
        </details>

        {loose.length ? (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-navy-ink">Other uploads <span className="font-normal text-muted">({loose.length})</span></h3>
            <Panel className="mt-3 divide-y divide-mist">
              {loose.map(d => (
                <div key={d.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <a href={fileHref(d.id)} target="_blank" rel="noopener" className="truncate text-navy-ink underline decoration-mist underline-offset-4 hover:decoration-gold">{d.originalName}</a>
                  <span className="shrink-0 text-xs text-muted">{shortDate(d.createdAt)} · {fileSize(d.sizeBytes)}</span>
                </div>
              ))}
            </Panel>
          </div>
        ) : null}
      </section>

      <section className="mt-14">
        <SectionTitle id="work" title="Work for client review"
          note="Send a prepared document to the client. It is filed in their Processed Documents folder and they are emailed to review it in the portal." />
        <div className="mt-5 rounded-md border border-mist bg-white p-5">
          <DeliveryUploadForm clientId={id} categories={DELIVERY_CATEGORIES} />
          <SignatureRequestForm clientId={id} hasIdv={hasIdv} deliveries={deliveries.filter(d => d.status !== 'WITHDRAWN').map(d => ({ id: d.id, title: d.title, version: d.version, mimeType: d.mimeType }))}
            signers={signingMembers.map(m => ({ userId: m.userId, fullName: m.fullName, email: m.email, role: m.role, userStatus: m.userStatus }))} />
          <IdvForm clientId={id} />
          {idv ? <p className="mt-2 text-xs text-muted">Identity verification on file: {idv.method.replace(/_/g, ' ').toLowerCase()} · {idv.verifiedAt.toLocaleDateString('en-GB')}{idv.validUntil ? ` · valid to ${idv.validUntil.toLocaleDateString('en-GB')}` : ''}</p> : null}
        </div>
        <div className="mt-4 space-y-3">
          {deliveries.length === 0 ? <EmptyNote>Nothing sent for review yet.</EmptyNote> : deliveries.map(d => {
            const resp = latestResponse(d.id);
            return (
              <div key={d.id} className={`rounded-md border border-mist bg-white px-5 py-4 ${d.status === 'WITHDRAWN' ? 'opacity-60' : ''}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-navy-ink">{d.title} <span className="ml-1 text-xs font-normal text-muted">v{d.version}{d.category ? ` · ${d.category}` : ''}</span></p>
                    <p className="mt-1 text-xs text-muted">Sent {shortDate(d.sentAt)} · {fileSize(d.sizeBytes)}{d.viewedAt ? ` · viewed ${shortDate(d.viewedAt)}` : ' · not yet viewed'}</p>
                  </div>
                  <Pill tone={d.status === 'APPROVED' ? 'done' : d.status === 'CHANGES_REQUESTED' ? 'attention' : d.status === 'WITHDRAWN' ? 'muted' : 'waiting'}>{DELIVERY_STATUS_LABEL[d.status]}</Pill>
                </div>
                {resp ? (
                  <div className="mt-3 rounded-md border-l-2 border-gold bg-porcelain px-4 py-3 text-sm">
                    <p className="text-xs text-muted">Client response · {resp.createdAt.toLocaleString('en-GB')}</p>
                    <p className="mt-1 font-semibold text-ink">{resp.decision === 'APPROVED' ? 'Approved' : 'Requested changes'}</p>
                    {resp.comment ? <p className="mt-1 whitespace-pre-wrap text-ink">{resp.comment}</p> : null}
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a href={`/api/portal/deliveries/${d.id}/file?client=${id}`} target="_blank" rel="noopener" className={btn.small}>View</a>
                  {canWithdraw(d.status) ? <WithdrawButton deliveryId={d.id} clientId={id} /> : null}
                </div>
                {canReplace(d.status) ? <DeliveryUploadForm clientId={id} categories={DELIVERY_CATEGORIES} supersedesId={d.id} compact /> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle id="signatures" title="Signatures and approvals" count={sigRequests.length} />
        <div className="mt-4 space-y-2">
          {sigRequests.length === 0 ? <EmptyNote>No signature or approval requests for this client.</EmptyNote> : sigRequests.map(r => (
            <a key={r.id} href={`/portal/admin/esign/${r.id}`} className="block rounded-md border border-mist bg-white px-5 py-3 transition-colors hover:border-navy-ink">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy-ink">{r.title} <span className="text-xs font-normal text-muted">· {SIG_ACTION_LABEL[r.action]} · sent {shortDate(r.sentAt)}</span></p>
                <Pill tone={r.status === 'COMPLETED' ? 'done' : ['DECLINED', 'VOIDED', 'EXPIRED', 'SUPERSEDED'].includes(r.status) ? 'muted' : 'waiting'}>{SIG_STATUS_LABEL[r.status]}</Pill>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
