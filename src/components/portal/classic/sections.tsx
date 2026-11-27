import Link from 'next/link';

/** Heading for a client section, with the way back to the overview. */
export function SectionHead({ clientId, title, note, children }: { clientId: string; title: string; note?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-mist pb-5">
      <div className="min-w-0">
        <Link href={`/portal/admin/clients/${clientId}`} className="text-xs font-semibold text-muted hover:text-navy-ink">← Overview</Link>
        <h2 className="mt-2 font-brand text-[1.7rem] font-normal leading-tight text-navy-ink">{title}</h2>
        {note ? <p className="mt-1 max-w-prose text-sm text-muted">{note}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

const FLASH: Record<string, [string, 'ok' | 'bad']> = {
  saved: ['Saved.', 'ok'], requested: ['Request added and the client has been emailed.', 'ok'], reminded: ['Reminder emailed to the primary contact.', 'ok'],
  'reset-sent': ['Password-reset link emailed (valid 24 hours).', 'ok'], 'engagement-added': ['Engagement added with its statutory deadlines.', 'ok'],
  'note-added': ['Note saved. Notes are visible to staff only.', 'ok'],
  'email-failed': ['Saved, but the email could not be sent. Contact the client directly or try again.', 'bad'],
  failed: ['That could not be saved. Refresh the page and try again.', 'bad'], missing: ['Please fill in the required field.', 'bad'],
  nothing: ['There is nothing outstanding to remind the client about.', 'bad'], duplicate: ['This client already has that service for that year.', 'bad'],
  'bad-year': ['That tax year is not in the expected format for this service.', 'bad'], archived: ['This client is archived. Restore the client before making changes.', 'bad'],
};

export function Flash({ done }: { done?: string }) {
  const f = done ? FLASH[done] : null;
  if (!f) return null;
  return (
    <p role={f[1] === 'ok' ? 'status' : 'alert'}
      className={`mt-5 rounded-md border px-4 py-2.5 text-sm ${f[1] === 'ok' ? 'border-[#2F5D46]/25 bg-[#2F5D46]/[0.06] text-[#2F5D46]' : 'border-red-200 bg-red-50 text-red-700'}`}>
      {f[0]}
    </p>
  );
}

/** Hidden fields every client-section form carries so actions return to the right place. */
export function Ctx({ clientId, section }: { clientId: string; section: string }) {
  return <><input type="hidden" name="clientId" value={clientId} /><input type="hidden" name="section" value={section} /></>;
}

export function SubHead({ title, count, children }: { title: string; count?: number; children?: React.ReactNode }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-semibold text-navy-ink">{title}{typeof count === 'number' ? <span className="ml-1.5 font-normal text-muted">({count})</span> : null}</h3>
      {children}
    </div>
  );
}
