import Link from 'next/link';

const SERVICE_IMG: Record<string, [string, string]> = {
  '/services/us-expat-tax': ['service-expat', 'A leather travel document wallet beside reading glasses and a brass pen'],
  '/services/us-expat-tax/us-tax-returns': ['service-returns', 'A leather folio and fountain pen on a marble desk in warm light'],
  '/services/us-expat-tax/fbar-filing': ['service-fbar', 'Archival wooden drawers with ribbon-tied document bundles'],
  '/services/us-expat-tax/fatca-compliance': ['service-accounting', 'Cloth-bound ledgers with a brass ruler and ink pen'],
  '/services/us-expat-tax/streamlined-filing': ['service-streamlined', 'Vintage airmail envelopes tied with twine beside a brass letter opener'],
  '/services/us-expat-tax/foreign-earned-income-exclusion': ['service-planning', 'A brass telescope at a window overlooking a harbour at dusk'],
  '/services/uk-accounting': ['service-accounting', 'Cloth-bound ledgers with a brass ruler and ink pen'],
  '/services/uk-accounting/corporation-tax': ['service-advisory', 'A dark boardroom table under one warm pendant light'],
  '/services/uk-accounting/company-accounts': ['service-returns', 'A leather folio and fountain pen on a marble desk in warm light'],
  '/services/cross-border-advisory': ['service-planning', 'A brass telescope at a window overlooking a harbour at dusk'],
  '/services/cross-border-advisory/business-structuring': ['service-structuring', 'A walnut chess board mid-game in low warm light'],
  '/services/cross-border-advisory/pensions-401k-sipp': ['service-pensions', 'A stone colonnade receding toward warm golden light'],
  '/services/cross-border-advisory/cross-border-tax-planning': ['service-planning', 'A brass telescope at a window overlooking a harbour at dusk'],
};
import type { ServiceItem } from '@/lib/types';
import { IconArrowRight } from '@/components/ui/icons';

export function ServiceCard({ service }: { service: ServiceItem }) {
  const { icon: Icon, title, description, href } = service;
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-mist bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-navy-ink hover:bg-navy-ink hover:shadow-e2"
    >
      {SERVICE_IMG[href] && (
        <img src={`/images/atlantic/${SERVICE_IMG[href][0]}.jpg`} alt={SERVICE_IMG[href][1]} width={1200} height={900} loading="lazy" className="img-card-banner" />
      )}
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold-antique transition-all duration-300 group-hover:scale-105 group-hover:bg-gold/20 group-hover:text-gold">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-softwhite/80">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-antique transition-colors duration-300 group-hover:text-gold">
        Learn more
        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function ServiceGrid({
  services,
  columns = 3,
}: {
  services: ServiceItem[];
  columns?: 2 | 3;
}) {
  const cols = columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid gap-5 ${cols}`}>
      {services.map((s) => (
        <ServiceCard key={s.title} service={s} />
      ))}
    </div>
  );
}
