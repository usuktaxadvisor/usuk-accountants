/**
 * Classic portal UI primitives. Pure, server-safe presentational pieces shared
 * by the client dashboard and the staff area so the whole portal reads as one
 * system: navy and gold, Condor headings, hairline rules, quiet surfaces.
 */
import Link from 'next/link';

export type RequestStatus = 'REQUESTED' | 'UPLOADED' | 'RECEIVED' | 'UNDER_REVIEW' | 'COMPLETED';

type Tone = 'action' | 'waiting' | 'neutral' | 'attention' | 'done' | 'muted' | 'danger';

/** One source of truth for status wording, for both audiences. */
export const REQUEST_STATUS: Record<RequestStatus, { client: string; staff: string; tone: Tone }> = {
  REQUESTED: { client: 'Awaiting your upload', staff: 'Requested', tone: 'action' },
  UPLOADED: { client: 'With our team', staff: 'Awaiting review', tone: 'waiting' },
  RECEIVED: { client: 'Received', staff: 'Received', tone: 'neutral' },
  UNDER_REVIEW: { client: 'Under review', staff: 'Needs follow-up', tone: 'attention' },
  COMPLETED: { client: 'Complete', staff: 'Complete', tone: 'done' },
};

export const REQUEST_STATUS_ORDER: RequestStatus[] = ['REQUESTED', 'UPLOADED', 'RECEIVED', 'UNDER_REVIEW', 'COMPLETED'];

const TONE: Record<Tone, string> = {
  action: 'border-gold/50 bg-gold-tint text-gold-antique',
  waiting: 'border-navy/15 bg-navy/[0.04] text-navy',
  neutral: 'border-mist bg-porcelain text-muted',
  attention: 'border-crimson/25 bg-crimson/[0.05] text-crimson',
  done: 'border-[#2F5D46]/25 bg-[#2F5D46]/[0.06] text-[#2F5D46]',
  muted: 'border-mist bg-white text-muted',
  danger: 'border-red-200 bg-red-50 text-red-700',
};

export function Pill({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TONE[tone]}`}>
      {children}
    </span>
  );
}

export function StatusPill({ status, audience }: { status: RequestStatus; audience: 'client' | 'staff' }) {
  const s = REQUEST_STATUS[status];
  return <Pill tone={s.tone}>{s[audience]}</Pill>;
}

/** Page title block: Condor display heading with an optional eyebrow line and actions. */
export function PageTitle({ title, meta, children }: { title: React.ReactNode; meta?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-mist pb-6">
      <div className="min-w-0">
        <h1 className="font-brand text-[2rem] font-normal leading-tight text-navy-ink sm:text-[2.4rem]">{title}</h1>
        {meta ? <div className="mt-2 text-sm text-muted">{meta}</div> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

/** Section heading with a short gold rule, used for every block in the portal. */
export function SectionTitle({ id, title, note, count, children }: { id?: string; title: string; note?: React.ReactNode; count?: number; children?: React.ReactNode }) {
  return (
    <div id={id} className="flex scroll-mt-28 flex-wrap items-end justify-between gap-3">
      <div>
        <span aria-hidden className="mb-3 block h-px w-10 bg-gold" />
        <h2 className="font-brand text-xl font-normal text-navy-ink">
          {title}
          {typeof count === 'number' ? <span className="ml-2 align-middle font-sans text-xs font-semibold text-muted">{count}</span> : null}
        </h2>
        {note ? <p className="mt-1 max-w-prose text-sm text-muted">{note}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-md border border-mist bg-white ${className}`}>{children}</div>;
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed border-mist bg-white px-6 py-8 text-center text-sm text-muted">{children}</p>;
}

/** A single figure with its label, for the summary strips. */
export function Stat({ label, value, href, emphasis }: { label: string; value: number | string; href?: string; emphasis?: boolean }) {
  const body = (
    <>
      <span className={`block font-brand text-3xl leading-none ${emphasis ? 'text-gold-antique' : 'text-navy-ink'}`}>{value}</span>
      <span className="mt-2 block text-xs font-medium text-muted">{label}</span>
    </>
  );
  const cls = 'block px-5 py-4';
  return href
    ? <Link href={href} className={`${cls} transition-colors hover:bg-porcelain`}>{body}</Link>
    : <div className={cls}>{body}</div>;
}

export const btn = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-md bg-navy-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-royal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60',
  secondary: 'inline-flex items-center justify-center gap-2 rounded-md border border-navy/20 bg-white px-4 py-2 text-sm font-semibold text-navy-ink transition-colors hover:border-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60',
  small: 'inline-flex items-center justify-center rounded-md border border-mist bg-white px-3 py-1.5 text-xs font-semibold text-navy-ink transition-colors hover:border-navy-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold',
  field: 'w-full rounded-md border border-mist bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-navy-ink',
};

export function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function shortDate(d: Date | null | undefined) {
  return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
}

/** Lightweight file-type mark so long lists of statements scan quickly. */
export function FileMark({ name }: { name: string }) {
  const ext = (name.split('.').pop() ?? '').toLowerCase();
  const label = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'csv'].includes(ext) ? (ext === 'jpeg' ? 'jpg' : ext) : 'file';
  return (
    <span aria-hidden className="inline-flex h-7 w-9 shrink-0 items-center justify-center rounded-sm border border-mist bg-porcelain text-[9px] font-bold uppercase tracking-wide text-muted">
      {label}
    </span>
  );
}
