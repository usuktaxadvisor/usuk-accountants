import type { TeamMember } from '@/lib/types';
import { IconArrowRight } from '@/components/ui/icons';

export function TeamCard({ member }: { member: TeamMember }) {
  const { name, role, credentials, jurisdictions, initials, href } = member;
  return (
    <article className="group rounded-2xl border border-mist bg-white p-7 transition-all duration-300 hover:border-gold hover:shadow-e2">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-ink font-display text-lg font-semibold text-gold-champagne">
          {initials}
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
          <p className="text-sm text-muted">{role}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {credentials.map((c) => (
          <span
            key={c}
            className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-antique"
          >
            {c}
          </span>
        ))}
      </div>

      {jurisdictions && jurisdictions.length > 0 && (
        <p className="mt-4 text-sm text-muted">
          <span className="font-medium text-ink">Handles:</span> {jurisdictions.join(' · ')}
        </p>
      )}

      {href && (
        <a
          href={href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-antique"
        >
          View profile
          <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      )}
    </article>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <TeamCard key={m.name} member={m} />
      ))}
    </div>
  );
}
