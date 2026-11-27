'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  ['', 'Overview'], ['people', 'People'], ['requests', 'Requests'], ['files', 'Files'],
  ['work', 'Work for review'], ['signatures', 'Signatures'], ['engagements', 'Engagements'], ['activity', 'Notes & activity'],
] as const;

/** Section switcher for one client. The overview is always one click away. */
export default function ClientTabs({ clientId }: { clientId: string }) {
  const path = usePathname() ?? '';
  const base = `/portal/admin/clients/${clientId}`;
  const current = path === base ? '' : path.slice(base.length + 1).split('/')[0];
  if (current === 'delete') return null;
  return (
    <nav aria-label="Client sections" className="-mx-5 mt-6 overflow-x-auto border-b border-mist px-5 sm:-mx-8 sm:px-8">
      <ul className="flex min-w-max gap-1">
        {TABS.map(([slug, label]) => {
          const active = current === slug;
          return (
            <li key={slug}>
              <Link href={slug ? `${base}/${slug}` : base} aria-current={active ? 'page' : undefined}
                className={`relative block px-3 pb-3 pt-1 text-sm font-semibold transition-colors ${active ? 'text-navy-ink' : 'text-muted hover:text-navy-ink'}`}>
                {label}
                <span aria-hidden className={`absolute inset-x-3 -bottom-px h-0.5 ${active ? 'bg-gold' : 'bg-transparent'}`} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
