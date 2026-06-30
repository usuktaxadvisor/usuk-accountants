import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/icons';

export interface RelatedLink {
  label: string;
  href: string;
}

export interface CalculatorRelatedLinksProps {
  services?: RelatedLink[];
  glossary?: RelatedLink[];
  calculators?: RelatedLink[];
  articles?: RelatedLink[];
}

function LinkColumn({ title, links }: { title: string; links?: RelatedLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-navy underline-offset-4 hover:text-gold hover:underline"
            >
              {l.label}
              <IconArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CalculatorRelatedLinks({
  services,
  glossary,
  calculators,
  articles,
}: CalculatorRelatedLinksProps) {
  const hasAny =
    (services && services.length) ||
    (glossary && glossary.length) ||
    (calculators && calculators.length) ||
    (articles && articles.length);
  if (!hasAny) return null;

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-mist bg-porcelain p-7">
      <p className="font-display text-lg font-semibold text-ink">Keep going</p>
      <p className="mt-1 text-sm text-muted">
        Explore the services, definitions and tools related to this calculator.
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <LinkColumn title="Our services" links={services} />
        <LinkColumn title="Related tools" links={calculators} />
        <LinkColumn title="In the glossary" links={glossary} />
        <LinkColumn title="Read more" links={articles} />
      </div>
    </div>
  );
}
