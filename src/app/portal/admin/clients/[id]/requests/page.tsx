import { notFound } from 'next/navigation';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { clientExists } from '@/lib/portal/client-overview';
import { listMembers } from '@/lib/portal/members';
import { canRemoveRequest, requestItemsForClient } from '@/lib/portal/request-view';
import RequestCard, { type RequestItem } from '@/components/portal/classic/RequestCard';
import { EmptyNote, REQUEST_STATUS, REQUEST_STATUS_ORDER, btn, shortDate } from '@/components/portal/classic/ui';
import { Ctx, Flash, SectionHead, SubHead } from '@/components/portal/classic/sections';
import { createRequestAction, remindAction, removeRequestAction, setRequestDeadlineAction, setRequestStatusAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function RequestsSection({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ done?: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const { done } = await searchParams;
  const client = await clientExists(id);
  if (!client) notFound();
  const items = await requestItemsForClient(id);
  const members = (await listMembers(id)).filter(m => m.status === 'ACTIVE');
  const reminders = items.length ? await db.select({ targetId: tables.auditLogs.targetId, at: tables.auditLogs.createdAt })
    .from(tables.auditLogs)
    .where(and(eq(tables.auditLogs.action, 'REQUEST_REMINDER_SENT'), inArray(tables.auditLogs.targetId, items.map(i => i.id))))
    .orderBy(desc(tables.auditLogs.createdAt)) : [];
  const lastReminded = (rid: string) => reminders.find(r => r.targetId === rid)?.at ?? null;
  const now = new Date();
  const archived = !!client.archivedAt;

  /** Who should provide it: a person named at the start of the title ("Adam: P60"), otherwise anyone on the account. */
  const provider = (title: string) => {
    const m = members.find(p => { const first = p.fullName.split(' ')[0]; return first && new RegExp(`^${first.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(:|’s|'s)`, 'i').test(title); });
    return m ? m.fullName : members.length > 1 ? 'Anyone on the account' : (members[0]?.fullName ?? client.displayName);
  };

  const outstanding = items.filter(i => i.status === 'REQUESTED' || i.status === 'UNDER_REVIEW');
  const received = items.filter(i => i.status === 'UPLOADED' || i.status === 'RECEIVED');
  const accepted = items.filter(i => i.status === 'COMPLETED');
  const fileHref = (fid: string) => `/api/portal/documents/${fid}/file?client=${id}`;

  const statusForm = (i: RequestItem) => (
    <form action={setRequestStatusAction} className="flex items-center gap-2">
      <Ctx clientId={id} section="requests" />
      <input type="hidden" name="requestId" value={i.id} />
      <label className="sr-only" htmlFor={`st-${i.id}`}>Status</label>
      <select id={`st-${i.id}`} name="status" defaultValue={i.status} className="rounded-md border border-mist bg-white px-2.5 py-1.5 text-xs text-ink">
        {REQUEST_STATUS_ORDER.map(st => <option key={st} value={st}>{REQUEST_STATUS[st].staff}</option>)}
      </select>
      <button className={btn.small}>Save</button>
    </form>
  );
  const accept = (i: RequestItem) => (
    <form action={setRequestStatusAction}>
      <Ctx clientId={id} section="requests" />
      <input type="hidden" name="requestId" value={i.id} /><input type="hidden" name="status" value="COMPLETED" />
      <button className={btn.primary}>Accept</button>
    </form>
  );
  const meta = (i: RequestItem) => {
    const overdue = i.deadline && i.deadline < now;
    const reminded = lastReminded(i.id);
    return (
      <p className="w-full text-xs text-muted">
        From <span className="font-semibold text-ink">{provider(i.title)}</span>
        {i.deadline ? <> · due <span className={overdue ? 'font-semibold text-crimson' : 'font-semibold text-ink'}>{shortDate(i.deadline)}{overdue ? ' (past due)' : ''}</span></> : ' · no due date'}
        {reminded ? ` · last reminded ${shortDate(reminded)}` : ''}
      </p>
    );
  };

  return (
    <div>
      <SectionHead clientId={id} title="Document requests"
        note="What we have asked for, what has arrived and what is accepted. Each upload sits under the request it answers.">
        {!archived && outstanding.length ? (
          <form action={remindAction}>
            <Ctx clientId={id} section="requests" />
            <input type="hidden" name="requestId" value="all" />
            <button className={btn.secondary}>Remind about all outstanding ({outstanding.length})</button>
          </form>
        ) : null}
      </SectionHead>
      <Flash done={done} />

      {!archived ? (
        <form action={createRequestAction} className="mt-6 grid gap-2 rounded-md border border-mist bg-white p-4 md:grid-cols-[1.2fr_1.5fr_auto_auto]">
          <Ctx clientId={id} section="requests" />
          <label className="sr-only" htmlFor="req-title">Document needed</label>
          <input id="req-title" name="title" required maxLength={200} placeholder="Document needed, e.g. 2025 UK P60" className={btn.field} />
          <label className="sr-only" htmlFor="req-desc">Instructions</label>
          <input id="req-desc" name="description" maxLength={1000} placeholder="Short instructions for the client (optional)" className={btn.field} />
          <label className="flex items-center gap-2 text-xs text-muted"><span className="whitespace-nowrap">Due</span>
            <input name="deadline" type="date" className="rounded-md border border-mist bg-white px-2.5 py-2 text-sm text-ink" /></label>
          <button className={btn.primary}>Request and email client</button>
        </form>
      ) : null}

      <SubHead title="Outstanding" count={outstanding.length} />
      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        {outstanding.length === 0 ? <EmptyNote>No outstanding document requests.</EmptyNote> : outstanding.map(i => (
          <div key={i.id} id={`r-${i.id}`} className="scroll-mt-24">
            <RequestCard item={i} audience="staff" fileHref={fileHref} actions={<>
              {meta(i)}
              {!archived ? (
                <form action={remindAction}>
                  <Ctx clientId={id} section="requests" /><input type="hidden" name="requestId" value={i.id} />
                  <button className={btn.small}>Send reminder</button>
                </form>
              ) : null}
              {!archived ? (
                <form action={setRequestDeadlineAction} className="flex items-center gap-1.5">
                  <Ctx clientId={id} section="requests" /><input type="hidden" name="requestId" value={i.id} />
                  <label className="sr-only" htmlFor={`dl-${i.id}`}>Due date</label>
                  <input id={`dl-${i.id}`} name="deadline" type="date" defaultValue={i.deadline ? i.deadline.toISOString().slice(0, 10) : ''} className="rounded-md border border-mist bg-white px-2 py-1 text-xs text-ink" />
                  <button className={btn.small}>Set due date</button>
                </form>
              ) : null}
              {statusForm(i)}
              {!archived && canRemoveRequest(i) ? (
                <details className="w-full">
                  <summary className="cursor-pointer text-xs text-muted underline decoration-dotted underline-offset-2">Remove this request</summary>
                  <form action={removeRequestAction} className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Ctx clientId={id} section="requests" /><input type="hidden" name="requestId" value={i.id} />
                    <label className="sr-only" htmlFor={`rm-${i.id}`}>Reason</label>
                    <input id={`rm-${i.id}`} name="reason" maxLength={200} placeholder="Reason, e.g. duplicate of another request"
                      className="min-w-0 flex-1 rounded-md border border-mist bg-white px-2 py-1 text-xs text-ink" />
                    <button className={btn.small}>Yes, remove it</button>
                  </form>
                  <p className="mt-1 text-xs text-muted">For a request made by mistake or twice. Nothing has been uploaded to it. The client is not emailed, and the removal stays in Notes &amp; activity.</p>
                </details>
              ) : null}
            </>} />
          </div>
        ))}
      </div>

      <SubHead title="Received, to check" count={received.length} />
      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        {received.length === 0 ? <EmptyNote>No uploads waiting to be checked.</EmptyNote> : received.map(i => (
          <div key={i.id} id={`r-${i.id}`} className="scroll-mt-24">
            <RequestCard item={i} audience="staff" fileHref={fileHref} actions={<>{meta(i)}{accept(i)}{statusForm(i)}</>} />
          </div>
        ))}
      </div>

      <details className="group mt-10" open={accepted.length > 0 && outstanding.length + received.length === 0}>
        <summary className="cursor-pointer list-none text-sm font-semibold text-navy-ink marker:hidden">
          <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span> Accepted <span className="font-normal text-muted">({accepted.length})</span>
        </summary>
        <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
          {accepted.length === 0 ? <EmptyNote>Nothing accepted yet.</EmptyNote> : accepted.map(i => (
            <div key={i.id} id={`r-${i.id}`} className="scroll-mt-24"><RequestCard item={i} audience="staff" fileHref={fileHref} collapsedAfter={3} actions={statusForm(i)} /></div>
          ))}
        </div>
      </details>
    </div>
  );
}
