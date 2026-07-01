import type { Metadata } from 'next';
import { Header, Footer, Container, Section, SectionHeading, CTASection, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { IconCalculator, IconGlobeDoc, IconPlanning, IconArrowRight } from '@/components/ui/icons';

const URL = 'https://www.usukaccountants.com/resources';

export const metadata: Metadata = {
  title: 'Resources — US–UK Tax Guides, Calculators & Glossary',
  description:
    'Free cross-border tax resources: interactive calculators, plain-English guides, and a glossary of US and UK tax terms for expats, dual citizens and businesses.',
  alternates: { canonical: URL },
};

const sections = [
  { icon: IconCalculator, title: 'Calculators & Tools', description: 'Interactive estimators for double taxation, FBAR, residency and more.', href: '/resources/calculators', live: true },
  { icon: IconGlobeDoc, title: 'Insights & Guides', description: 'Plain-English articles on US expat tax, UK accounting and cross-border planning — written and reviewed by our team.', href: '/resources/blog', live: true },
  { icon: IconPlanning, title: 'Glossary', description: 'Clear definitions of the US and UK tax terms that matter — FBAR, FEIE, SRT, PFIC and more.', href: '/resources/glossary', live: true },
];

export default function ResourcesHub() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <main>
        <Breadcrumbs crumbs={crumbs} />
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-prose">
              <p className="mb-3 text-xs font-semibold uppercase tracking-eyebrow text-gold">Resources</p>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Free tools and guides for life between two tax systems
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Cross-border tax is complex. These resources help you understand your position in plain English —
                no jargon.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <SectionHeading eyebrow="Explore" title="Where to start" />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {sections.map((s) => {
                const inner = (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.live ? 'bg-gold/10 text-gold-antique' : 'bg-mist/60 text-muted'}`}>
                        <s.icon className="h-5 w-5" />
                      </span>
                      {!s.live && <span className="rounded-full bg-mist/60 px-2.5 py-1 text-xs font-medium text-muted">Coming soon</span>}
                    </div>
                    <h2 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.description}</p>
                    {s.live && (
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-antique">
                        Explore <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </>
                );
                return s.live ? (
                  <a key={s.href} href={s.href} className="group flex flex-col rounded-2xl border border-mist bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-e2">
                    {inner}
                  </a>
                ) : (
                  <div key={s.href} className="flex flex-col rounded-2xl border border-mist bg-white p-6 opacity-80">
                    {inner}
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        <CTASection
          title="Prefer to just ask a specialist?"
          intro="Book a consultation and get answers specific to your situation."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
