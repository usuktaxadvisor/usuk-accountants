import type { TeamMember } from '@/lib/types';
import { IconArrowRight } from '@/components/ui/icons';

export function TeamCard({ member }: { member: TeamMember }) {
  const { name, role, credentials, jurisdictions, initials, href } = member;
  return (
    <article className="group rounded-card border border-mist bg-white p-7 transition-all duration-300 hover:border-gold/70 hover:shadow-e2">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-navy-ink font-display text-lg text-gold-champagne">
          {initials}
        </span>
        <div>
          <h3 className="font-display text-display-sm text-ink">{name}</h3>
          <p className="text-sm text-muted">{role}</p>
        </div>
      </div>

      {credentials.length > 0 && (
        <p className="mt-5 text-sm font-medium text-gold-antique">{credentials.join(' \u00b7 ')}</p>
      )}

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
