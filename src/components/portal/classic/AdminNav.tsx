'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Staff navigation with a clear active state and the review count always in view. */
export default function AdminNav({ reviewCount }: { reviewCount: number }) {
  const path = usePathname() ?? '';
  const items = [
    { href: '/portal/admin', label: 'Clients', active: path === '/portal/admin' || path.startsWith('/portal/admin/clients') },
    { href: '/portal/admin/review', label: 'Review queue', active: path.startsWith('/portal/admin/review'), count: reviewCount },
    { href: '/portal/admin/esign', label: 'Signatures & approvals', active: path.startsWith('/portal/admin/esign') },
  ];
  return (
    <nav aria-label="Staff navigation" className="-mx-1 flex gap-1 overflow-x-auto">
      {items.map(i => (
        <Link key={i.href} href={i.href} aria-current={i.active ? 'page' : undefined}
          className={`relative flex shrink-0 items-center gap-2 px-3 pb-3 pt-1 text-sm font-semibold transition-colors ${i.active ? 'text-navy-ink' : 'text-muted hover:text-navy-ink'}`}>
          {i.label}
          {i.count ? <span className="rounded-full bg-gold px-1.5 py-px text-[10px] font-bold text-navy-ink">{i.count}</span> : null}
          <span aria-hidden className={`absolute inset-x-3 -bottom-px h-0.5 ${i.active ? 'bg-gold' : 'bg-transparent'}`} />
        </Link>
      ))}
    </nav>
  );
}
