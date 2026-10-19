import Image from 'next/image';
import Link from 'next/link';

const SERVICE_IMG: Record<string, [string, string]> = {
  '/services/us-expat-tax': ['service-expat', 'A leather travel document wallet beside reading glasses and a brass pen'],
  '/services/us-expat-tax/us-tax-returns': ['service-returns', 'A leather folio and fountain pen on a marble desk in warm light'],
  '/services/us-expat-tax/fbar-filing': ['service-fbar', 'Archival wooden drawers with ribbon-tied document bundles'],
  '/services/us-expat-tax/fatca-compliance': ['service-advisory', 'A dark boardroom table under one warm pendant light'],
  '/services/us-expat-tax/w-8ben-us-withholding-forms': ['service-expat', 'A leather travel document wallet beside reading glasses and a brass pen'],
  '/services/us-expat-tax/streamlined-filing': ['service-streamlined', 'Vintage airmail envelopes tied with twine beside a brass letter opener'],
  '/services/us-expat-tax/foreign-earned-income-exclusion': ['service-planning', 'A brass telescope at a window overlooking a harbour at dusk'],
  '/services/uk-accounting': ['service-accounting', 'Cloth-bound ledgers with a brass ruler and ink pen'],
  '/services/uk-accounting/self-assessment': ['blog-documents', 'Wax-sealed correspondence and a ledger on a mahogany desk'],
  '/services/us-expat-tax/us-uk-tax-treaty': ['blog-instruments', 'Brass drafting instruments on nautical charts in warm lamplight'],
  '/services/uk-accounting/corporation-tax': ['service-advisory', 'A dark boardroom table under one warm pendant light'],
  '/services/uk-accounting/company-accounts': ['service-accounting', 'Cloth-bound ledgers with a brass ruler and ink pen'],
  '/services/cross-border-advisory': ['service-advisory', 'A dark boardroom table under one warm pendant light'],
  '/services/cross-border-advisory/business-structuring': ['service-structuring', 'A walnut chess board mid-game in low warm light'],
  '/services/cross-border-advisory/pensions-401k-sipp': ['service-pensions', 'A stone colonnade receding toward warm golden light'],
  '/services/cross-border-advisory/cross-border-tax-planning': ['service-planning', 'A brass telescope at a window overlooking a harbour at dusk'],
};
import type { ServiceItem } from '@/lib/types';
import { IconArrowRight } from '@/components/ui/icons';

export function ServiceCard({ service }: { service: ServiceItem }) {
  const { icon: Icon, title, description, href } = service;
  const img = SERVICE_IMG[href];
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-card border border-mist bg-white transition-all duration-300 hover:border-gold/70 hover:shadow-e2"
    >
      {img ? (
        <span className="relative block aspect-[16/10] overflow-hidden bg-navy-ink">
          <Image
            src={`/images/atlantic/${img[0]}.jpg`}
            alt={img[1]}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03]"
          />
        </span>
      ) : (
        <span className="flex aspect-[16/10] items-center justify-center bg-porcelain text-gold-antique">
          <Icon className="h-8 w-8" />
        </span>
      )}
      <span className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-display-sm text-ink">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 border-t border-mist pt-4 text-sm font-semibold text-gold-antique transition-colors group-hover:text-gold">
          Learn more
          <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
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
    <div className={`grid gap-6 ${cols}`}>
      {services.map((s) => (
        <ServiceCard key={s.title} service={s} />
      ))}
    </div>
  );
}
