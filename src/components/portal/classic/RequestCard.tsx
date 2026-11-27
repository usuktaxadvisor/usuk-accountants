import { FileMark, StatusPill, fileSize, shortDate, type RequestStatus } from './ui';

export type RequestFile = { id: string; name: string; sizeBytes: number; createdAt: Date };
export type RequestItem = {
  id: string; title: string; description: string | null; status: RequestStatus;
  requestedAt: Date; deadline?: Date | null; files: RequestFile[];
};

/**
 * One document request with the files that answer it, nested underneath.
 * Used by the review queue, the staff client page and the client dashboard,
 * so a request always looks the same wherever it appears.
 */
export default function RequestCard({ item, audience, fileHref, actions, collapsedAfter = 6 }: {
  item: RequestItem;
  audience: 'client' | 'staff';
  fileHref?: (fileId: string) => string;
  actions?: React.ReactNode;
  collapsedAfter?: number;
}) {
  const many = item.files.length > collapsedAfter;
  const first = many ? item.files.slice(0, collapsedAfter) : item.files;
  const rest = many ? item.files.slice(collapsedAfter) : [];
  const fileRow = (f: RequestFile) => (
    <li key={f.id} className="flex items-center gap-3 py-2">
      <FileMark name={f.name} />
      <div className="min-w-0 flex-1">
        {fileHref
          ? <a href={fileHref(f.id)} target="_blank" rel="noopener" className="block truncate text-sm text-navy-ink underline decoration-mist underline-offset-4 hover:decoration-gold">{f.name}</a>
          : <p className="truncate text-sm text-ink">{f.name}</p>}
        <p className="text-[11px] text-muted">{shortDate(f.createdAt)} · {fileSize(f.sizeBytes)}</p>
      </div>
    </li>
  );

  return (
    <article className="rounded-md border border-mist bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-3 pt-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold leading-snug text-navy-ink">{item.title}</h3>
          {item.description ? <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p> : null}
          <p className="mt-1.5 text-[11px] text-muted">
            Requested {shortDate(item.requestedAt)}
            {item.deadline ? <> · needed by <span className="font-semibold text-ink">{shortDate(item.deadline)}</span></> : null}
            {item.files.length ? ` · ${item.files.length} file${item.files.length === 1 ? '' : 's'}` : ''}
          </p>
        </div>
        <StatusPill status={item.status} audience={audience} />
      </div>
      {item.files.length ? (
        <div className="border-t border-mist px-5">
          <ul className="divide-y divide-mist/70">{first.map(fileRow)}</ul>
          {rest.length ? (
            <details className="group border-t border-mist/70">
              <summary className="cursor-pointer list-none py-2 text-xs font-semibold text-navy-ink marker:hidden hover:text-gold-antique">
                <span className="group-open:hidden">Show {rest.length} more file{rest.length === 1 ? '' : 's'}</span>
                <span className="hidden group-open:inline">Show fewer</span>
              </summary>
              <ul className="divide-y divide-mist/70">{rest.map(fileRow)}</ul>
            </details>
          ) : null}
        </div>
      ) : null}
      {actions ? <div className="flex flex-wrap items-center gap-2 border-t border-mist bg-porcelain/60 px-5 py-3">{actions}</div> : null}
    </article>
  );
}
