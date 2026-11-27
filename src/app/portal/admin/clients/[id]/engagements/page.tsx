import Link from 'next/link';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { notFound } from 'next/navigation';
import { and, eq, inArray, isNotNull } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { clientExists } from '@/lib/portal/client-overview';
import { listEngagementsForClient } from '@/lib/portal/engagement-store';
import { CONDITIONAL_KINDS, ENGAGEMENT_STATUS, SERVICES, daysBetween, deadlineState, formatIsoDate, isOpenEngagement, type DeadlineState, type ServiceKey } from '@/lib/portal/engagements';
import { EmptyNote, Pill, btn, shortDate } from '@/components/portal/classic/ui';
import { Ctx, Flash, SectionHead, SubHead } from '@/components/portal/classic/sections';
import { addDeadlineAction, addEngagementAction, toggleDeadlineAction, updateEngagementAction } from '../actions';

export const dynamic = 'force-dynamic';

const STATE: Record<DeadlineState, { label: (days: number) => string; cls: string }> = {
  overdue: { label: d => `${Math.abs(d)} day${Math.abs(d) === 1 ? '' : 's'} overdue`, cls: 'font-semibold text-crimson' },
  'due-soon': { label: d => d === 0 ? 'due today' : `due in ${d} day${d === 1 ? '' : 's'}`, cls: 'font-semibold text-gold-antique' },
  upcoming: { label: d => `in ${d} days`, cls: 'text-muted' },
  done: { label: () => 'done', cls: 'text-[#2F5D46]' },
};

/** Services in scope, their tax years, statutory and own deadlines, progress and next actions. */
export default async function EngagementsSection({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ done?: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const { done } = await searchParams;
  const client = await clientExists(id);
  if (!client) notFound();
  const { engagements, deadlines, ready } = await listEngagementsForClient(id);
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const archived = !!client.archivedAt;

  // Dates already set elsewhere in the portal, shown here automatically.
  const reqDates = await db.select({ id: tables.documentRequests.id, title: tables.documentRequests.title, deadline: tables.documentRequests.deadline })
    .from(tables.documentRequests)
    .where(and(eq(tables.documentRequests.clientId, id), inArray(tables.documentRequests.status, ['REQUESTED', 'UNDER_REVIEW']), isNotNull(tables.documentRequests.deadline)));
  const sigDates = await db.select({ id: tables.signatureRequests.id, title: tables.signatureRequests.title, dueAt: tables.signatureRequests.dueAt })
    .from(tables.signatureRequests)
    .where(and(eq(tables.signatureRequests.clientId, id), inArray(tables.signatureRequests.status, ['AWAITING_CLIENT', 'VIEWED', 'PARTIALLY_SIGNED']), isNotNull(tables.signatureRequests.dueAt)));
  const linked = [
    ...reqDates.map(r => ({ key: `r${r.id}`, label: `Document: ${r.title}`, date: r.deadline!.toISOString().slice(0, 10), href: `/portal/admin/clients/${id}/requests#r-${r.id}` })),
    ...sigDates.map(s => ({ key: `s${s.id}`, label: `Signature: ${s.title}`, date: s.dueAt!.toISOString().slice(0, 10), href: `/portal/admin/clients/${id}/signatures#s-${s.id}` })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const open = engagements.filter(e => isOpenEngagement(e.status));
  const finished = engagements.filter(e => !isOpenEngagement(e.status));
  const overdueAll = deadlines.filter(d => !CONDITIONAL_KINDS.includes(d.kind) && open.some(e => e.id === d.engagementId) && deadlineState(d.dueDate, d.doneAt, today) === 'overdue');

  const engagementCard = (e: typeof engagements[number]) => {
    const list = deadlines.filter(d => d.engagementId === e.id);
    const doneCount = list.filter(d => d.doneAt).length;
    const pct = list.length ? Math.round((doneCount / list.length) * 100) : (isOpenEngagement(e.status) ? 0 : 100);
    return (
      <article key={e.id} className="rounded-md border border-mist bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0">
            <h4 className="text-[15px] font-semibold text-navy-ink">{e.title}</h4>
            <p className="mt-1 text-xs text-muted">{SERVICES[e.service as ServiceKey]?.label ?? e.service} · tax year {e.taxYear}{e.recurring ? ' · recurs every year' : ''}{e.rolledFromId ? ' · added automatically from last year' : ''}</p>
            {e.nextAction ? <p className="mt-2 text-sm text-ink"><span className="text-xs text-muted">Next action: </span>{e.nextAction}</p> : null}
          </div>
          <Pill tone={e.status === 'COMPLETED' || e.status === 'FILED' ? 'done' : e.status === 'AWAITING_CLIENT' ? 'action' : e.status === 'ON_HOLD' ? 'muted' : 'waiting'}>{ENGAGEMENT_STATUS[e.status] ?? e.status}</Pill>
        </div>
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between text-[11px] text-muted"><span>Progress</span><span>{doneCount} of {list.length} deadlines met</span></div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${e.title} progress`}>
            <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ul className="divide-y divide-mist/70 border-t border-mist px-5">
          {list.length === 0 ? <li className="py-3 text-xs text-muted">No fixed statutory dates for this service. Add your own below.</li> : list.map(d => {
            const st = deadlineState(d.dueDate, d.doneAt, today);
            const passedRegistration = CONDITIONAL_KINDS.includes(d.kind) && st === 'overdue';
            return (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <p className={`text-sm ${st === 'done' ? 'text-muted line-through' : 'text-ink'}`}>{d.label}</p>
                  <p className="text-[11px]"><span className="font-semibold text-ink">{formatIsoDate(d.dueDate)}</span> · {passedRegistration ? <span className="text-muted">date passed; only applies in that case</span> : <span className={STATE[st].cls}>{STATE[st].label(daysBetween(todayIso, d.dueDate))}</span>}{d.source === 'RULE' ? <span className="text-muted"> · statutory</span> : <span className="text-muted"> · added by staff</span>}</p>
                </div>
                {!archived ? (
                  <form action={toggleDeadlineAction}>
                    <Ctx clientId={id} section="engagements" /><input type="hidden" name="deadlineId" value={d.id} />
                    <button className={btn.small}>{d.doneAt ? 'Reopen' : 'Mark done'}</button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
        {!archived ? (
          <details className="border-t border-mist bg-porcelain/60 px-5 py-3">
            <summary className="cursor-pointer text-xs font-semibold text-navy-ink">Update status, next action or add a deadline</summary>
            <form action={updateEngagementAction} className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center">
              <Ctx clientId={id} section="engagements" /><input type="hidden" name="engagementId" value={e.id} />
              <select name="status" defaultValue={e.status} aria-label="Status" className="rounded-md border border-mist bg-white px-2.5 py-2 text-sm">{Object.entries(ENGAGEMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              <input name="nextAction" defaultValue={e.nextAction ?? ''} maxLength={300} placeholder="Next action" aria-label="Next action" className={btn.field} />
              <label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" name="recurring" defaultChecked={!!e.recurring} /> Recurs every year</label>
              <button className={btn.small}>Save</button>
            </form>
            <form action={addDeadlineAction} className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <Ctx clientId={id} section="engagements" /><input type="hidden" name="engagementId" value={e.id} />
              <input name="label" required maxLength={200} placeholder="Own deadline, e.g. Send draft to client" aria-label="Deadline" className={btn.field} />
              <input name="dueDate" type="date" required aria-label="Due date" className="rounded-md border border-mist bg-white px-2.5 py-2 text-sm" />
              <button className={btn.small}>Add deadline</button>
            </form>
          </details>
        ) : null}
      </article>
    );
  };

  return (
    <div>
      <SectionHead clientId={id} title="Engagements & deadlines"
        note="Each engagement is one service for one tax year. Statutory deadlines are added automatically from GOV.UK and IRS rules; US dates that fall at a weekend move to the Monday. Recurring engagements roll into the next year automatically once that year closes." />
      <Flash done={done} />
      {!ready ? <div className="mt-6"><EmptyNote>Engagements are not set up on this database yet. They will appear here once the update has been applied.</EmptyNote></div> : (
        <>
          {overdueAll.length ? <p role="alert" className="mt-6 rounded-md border border-crimson/30 bg-crimson/[0.05] px-4 py-3 text-sm font-semibold text-crimson">{overdueAll.length} deadline{overdueAll.length === 1 ? ' is' : 's are'} overdue. Mark each one done if it has been met, or act on it today.</p> : null}
          {!archived ? (
            <form action={addEngagementAction} className="mt-6 grid gap-2 rounded-md border border-mist bg-white p-4 md:grid-cols-[1.3fr_0.7fr_1.3fr_auto_auto] md:items-center">
              <Ctx clientId={id} section="engagements" />
              <select name="service" required aria-label="Service" className="rounded-md border border-mist bg-white px-3 py-2.5 text-sm text-ink">
                {Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <input name="taxYear" required maxLength={40} placeholder="Tax year, e.g. 2025/26 or 2025" aria-label="Tax year or period end" className={btn.field} />
              <input name="nextAction" maxLength={300} placeholder="Next action (optional)" aria-label="Next action" className={btn.field} />
              <label className="flex items-center gap-2 whitespace-nowrap text-xs text-muted"><input type="checkbox" name="recurring" /> Recurs yearly</label>
              <button className={btn.primary}>Add engagement</button>
            </form>
          ) : null}
          <p className="mt-2 text-xs text-muted">Formats: UK Self Assessment 2025/26 · US returns, FBAR and LLC filings 2025 · UK company the period end date, 2026-03-31.</p>

          <SubHead title="In progress" count={open.length} />
          <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">{open.length === 0 ? <EmptyNote>No engagements in progress. Add the services in scope above.</EmptyNote> : open.map(engagementCard)}</div>

          <SubHead title="Other dates from this client's records" count={linked.length} />
          <div className="mt-3">
            {linked.length === 0 ? <EmptyNote>No due dates set on open document requests or signature requests.</EmptyNote> : (
              <ul className="divide-y divide-mist rounded-md border border-mist bg-white px-5">
                {linked.map(l => {
                  const st = deadlineState(l.date, null, today);
                  return (
                    <li key={l.key} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                      <Link href={l.href} className="text-navy-ink underline decoration-mist underline-offset-4 hover:decoration-gold">{l.label}</Link>
                      <span className="text-xs"><span className="font-semibold text-ink">{formatIsoDate(l.date)}</span> · <span className={STATE[st].cls}>{STATE[st].label(daysBetween(todayIso, l.date))}</span></span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {finished.length ? (
            <details className="mt-10"><summary className="cursor-pointer text-sm font-semibold text-navy-ink">Filed or completed ({finished.length})</summary>
              <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">{finished.map(engagementCard)}</div></details>
          ) : null}
          <p className="mt-8 text-xs text-muted">Last checked {shortDate(today)}. Deadlines are reminders for the team; the client is not emailed about them.</p>
        </>
      )}
    </div>
  );
}
