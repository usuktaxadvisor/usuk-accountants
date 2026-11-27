import Link from 'next/link';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { computeNextAction, loadOverview, type Section } from '@/lib/portal/client-overview';
import { formatIsoDate } from '@/lib/portal/engagements';
import { shortDate } from '@/components/portal/classic/ui';

export const dynamic = 'force-dynamic';

type Line = { text: string; strong?: boolean; tone?: 'urgent' | 'action' };
type Card = { section: Section; title: string; lines: Line[]; empty: string; tone?: 'urgent' | 'action' };

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Client overview: the next action, then one card per area. Each card opens its own section. */
export default async function ClientOverview({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const c = await loadOverview(id);
  const next = computeNextAction(c, formatIsoDate);

  const cards: Card[] = [
    {
      section: 'people', title: 'People & contact details', empty: 'No people linked yet',
      lines: [
        { text: plural(c.people.active, 'person', 'people') + ' with portal access', strong: true },
        ...(c.people.joint ? [{ text: plural(c.people.joint, 'joint client') }] : []),
        ...(c.people.contacts ? [{ text: plural(c.people.contacts, 'authorised contact or director', 'authorised contacts or directors') }] : []),
        ...(c.people.notActive ? [{ text: `${plural(c.people.notActive, 'login')} not yet activated`, tone: 'action' as const }] : []),
      ],
    },
    {
      section: 'requests', title: 'Document requests', empty: 'No document requests',
      tone: c.requests.overdue ? 'urgent' : c.requests.awaitingReview || c.requests.followUp ? 'action' : undefined,
      lines: [
        ...(c.requests.outstanding ? [{ text: `${plural(c.requests.outstanding, 'document')} outstanding`, strong: true }] : []),
        ...(c.requests.overdue ? [{ text: `${c.requests.overdue} past due`, tone: 'urgent' as const }] : []),
        ...(c.requests.awaitingReview ? [{ text: `${plural(c.requests.awaitingReview, 'upload')} to review`, tone: 'action' as const }] : []),
        ...(c.requests.followUp ? [{ text: `${plural(c.requests.followUp, 'item')} need follow-up`, tone: 'action' as const }] : []),
        ...(c.requests.accepted + c.requests.received ? [{ text: `${c.requests.accepted + c.requests.received} received or accepted` }] : []),
      ],
    },
    {
      section: 'files', title: 'Documents & files', empty: 'No files held yet',
      lines: [
        ...(c.files.uploads ? [{ text: `${plural(c.files.uploads, 'file')} from the client`, strong: true }] : []),
        ...(c.files.prepared ? [{ text: `${plural(c.files.prepared, 'document')} prepared by us` }] : []),
        ...(c.files.signed ? [{ text: `${plural(c.files.signed, 'signed copy', 'signed copies')}` }] : []),
      ],
    },
    {
      section: 'work', title: 'Work for client review', empty: 'Nothing shared for review',
      tone: c.work.changesRequested ? 'action' : undefined,
      lines: [
        ...(c.work.changesRequested ? [{ text: `${plural(c.work.changesRequested, 'change request')} from the client`, tone: 'action' as const, strong: true }] : []),
        ...(c.work.awaitingFeedback ? [{ text: `${c.work.awaitingFeedback} awaiting client feedback`, strong: !c.work.changesRequested }] : []),
        ...(c.work.approved ? [{ text: `${c.work.approved} approved` }] : []),
      ],
    },
    {
      section: 'signatures', title: 'Signatures & approvals', empty: 'No signature requests',
      lines: [
        ...(c.signatures.pending ? [{ text: `${plural(c.signatures.pending, 'signature')} pending`, strong: true }] : []),
        ...(c.signatures.nextDue ? [{ text: `Next due ${shortDate(c.signatures.nextDue)}` }] : []),
        ...(c.signatures.completed ? [{ text: `${c.signatures.completed} completed` }] : []),
      ],
    },
    {
      section: 'engagements', title: 'Engagements & deadlines', empty: c.engagements.ready ? 'No engagements recorded yet' : 'Not set up yet',
      tone: c.engagements.overdue ? 'urgent' : c.engagements.dueSoon ? 'action' : undefined,
      lines: [
        ...(c.engagements.open ? [{ text: `${plural(c.engagements.open, 'engagement')} in progress`, strong: true }] : []),
        ...(c.engagements.overdue ? [{ text: `${plural(c.engagements.overdue, 'deadline')} overdue`, tone: 'urgent' as const }] : []),
        ...(c.engagements.dueSoon ? [{ text: `${c.engagements.dueSoon} due in the next 30 days`, tone: 'action' as const }] : []),
        ...(c.engagements.nextDeadline && !c.engagements.overdue ? [{ text: `Next: ${formatIsoDate(c.engagements.nextDeadline.dueDate)}` }] : []),
      ],
    },
    {
      section: 'activity', title: 'Notes & activity', empty: '',
      lines: [{ text: 'Dated history of requests, uploads, reviews and signatures', strong: true }, { text: 'Internal notes, visible to staff only' }],
    },
  ];

  const toneBar = { urgent: 'border-l-crimson', action: 'border-l-gold', waiting: 'border-l-navy-royal', calm: 'border-l-[#2F5D46]' }[next.tone];

  return (
    <div>
      <div className={`rounded-md border border-mist border-l-4 ${toneBar} bg-white px-5 py-4 sm:px-6`}>
        <p className="text-xs font-semibold text-muted">Next action</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <p className="text-base font-semibold text-navy-ink sm:text-lg">{next.text}</p>
          {next.section ? <Link href={`/portal/admin/clients/${id}/${next.section}`} className="inline-flex items-center rounded-md bg-navy-ink px-4 py-2 text-sm font-semibold text-white hover:bg-navy-royal">Open</Link> : null}
        </div>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(card => (
          <li key={card.section}>
            <Link href={`/portal/admin/clients/${id}/${card.section}`}
              className={`group flex h-full flex-col rounded-md border bg-white px-5 py-5 transition-colors hover:border-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${card.tone === 'urgent' ? 'border-crimson/40' : card.tone === 'action' ? 'border-gold/60' : 'border-mist'}`}>
              <span aria-hidden className="mb-3 block h-px w-8 bg-gold transition-all group-hover:w-12" />
              <span className="font-brand text-lg text-navy-ink">{card.title}</span>
              <span className="mt-3 flex-1 space-y-1">
                {card.lines.length === 0 ? <span className="block text-sm text-muted">{card.empty}</span> : card.lines.map((l, i) => (
                  <span key={i} className={`block text-sm ${l.tone === 'urgent' ? 'font-semibold text-crimson' : l.tone === 'action' ? 'font-semibold text-gold-antique' : l.strong ? 'font-semibold text-ink' : 'text-muted'}`}>{l.text}</span>
                ))}
              </span>
              <span className="mt-4 text-xs font-semibold text-navy-ink group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">Open</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
