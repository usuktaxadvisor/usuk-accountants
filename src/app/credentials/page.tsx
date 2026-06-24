import type { Metadata } from 'next';
import { Header, Footer, Section, Container, CTASection, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { IconCheck } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Credentials',
  description:
    'The professional bodies that govern US and UK tax and accountancy — ACCA, AICPA, IRS Enrolled Agent, ATT and CIOT — and what each one means for cross-border clients.',
  alternates: { canonical: 'https://www.usukaccountants.com/credentials' },
};

const bodies = [
  { abbr: 'ACCA', name: 'Association of Chartered Certified Accountants', jurisdiction: 'UK', what: 'Globally recognised chartered certified accountancy qualification governing UK accounting standards and ethics.' },
  { abbr: 'AICPA', name: 'American Institute of Certified Public Accountants', jurisdiction: 'US', what: 'The professional body for US Certified Public Accountants, setting US auditing and ethics standards.' },
  { abbr: 'IRS EA', name: 'IRS Enrolled Agent', jurisdiction: 'US', what: 'A federally-authorised tax practitioner empowered to represent taxpayers before the IRS in all 50 states.' },
  { abbr: 'ATT', name: 'Association of Taxation Technicians', jurisdiction: 'UK', what: 'The leading UK body for tax compliance professionals.' },
  { abbr: 'CIOT', name: 'Chartered Institute of Taxation', jurisdiction: 'UK', what: 'The UK\u2019s premier body for chartered tax advisers, governing advanced UK tax expertise.' },
];

export default function CredentialsPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Credentials', href: '/credentials' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">Professional standards</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Credentials that matter in cross-border tax
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Cross-border work demands genuine qualifications on both sides of the Atlantic. These are the
                professional bodies that govern US and UK tax and accountancy, and what each one means. Individual
                team members&rsquo; qualifications are listed and verifiable on their profiles.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <div className="space-y-4">
              {bodies.map((b) => (
                <div key={b.abbr} className="flex flex-col gap-4 rounded-2xl border border-mist bg-white p-7 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-navy-ink font-display text-base font-semibold text-gold-champagne">
                    {b.abbr}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-lg font-semibold text-ink">{b.name}</h2>
                      <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold-antique">{b.jurisdiction}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.what}</p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted sm:inline-flex">
                    <IconCheck className="h-4 w-4 text-gold" /> {b.jurisdiction} body
                  </span>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-prose text-center text-sm text-muted">
              Individual membership and registration numbers are published on each professional&rsquo;s profile and can be checked directly with the relevant body.
            </p>
          </Container>
        </Section>

        <CTASection
          title="Meet the people behind the badges"
          tone="navy"
          primary={{ label: 'Meet the team', href: '/about/team' }}
          showRating={false}
        />
      </main>
      <Footer />
    </>
  );
}
