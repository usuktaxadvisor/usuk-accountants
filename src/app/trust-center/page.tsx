import type { Metadata } from 'next';
import { Header, Footer, Section, Container, CTASection, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { trustCenterPillars } from '@/lib/authority-data';
import {
  IconShield, IconPlanning, IconCheck, IconGlobeDoc, IconBank, IconTreaty,
} from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Trust Center',
  description:
    'One place for everything that makes US UK Accountants trustworthy: security, editorial standards, genuine reviews, privacy, regulatory standing and professional conduct.',
  alternates: { canonical: 'https://www.usukaccountants.com/trust-center' },
};

const iconMap = {
  shield: IconShield,
  planning: IconPlanning,
  check: IconCheck,
  globe: IconGlobeDoc,
  bank: IconBank,
  treaty: IconTreaty,
} as const;

export default function TrustCenterPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Trust Center', href: '/trust-center' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <header className="relative overflow-hidden bg-navy-ink py-20 md:py-24">
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-100 320 C 420 100, 1020 100, 1540 320" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.5" />
          </svg>
          <Container>
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">Trust &amp; transparency</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Trust Center
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                When a firm handles your tax filings in two countries, trust is everything. This is where we show our work — how we protect your data, how we write our guidance, and how we hold ourselves accountable.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trustCenterPillars.map((p) => {
                const Icon = iconMap[p.icon as keyof typeof iconMap] ?? IconShield;
                return (
                  <a
                    key={p.title}
                    href={p.href}
                    className="group rounded-2xl border border-mist bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-e2"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold-antique transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 font-display text-xl font-semibold text-ink">{p.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                  </a>
                );
              })}
            </div>
          </Container>
        </Section>

        <CTASection
          title="The specialists behind the standards"
          intro="Every policy here is upheld by named professionals on both sides of the Atlantic. Meet the team who'll handle your filings."
          tone="navy"
          primary={{ label: 'Meet the team', href: '/about/team' }}
          secondary={{ label: 'See our credentials', href: '/credentials' }}
          showRating={false}
        />
      </main>
      <Footer />
    </>
  );
}
