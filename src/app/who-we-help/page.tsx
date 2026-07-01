import type { Metadata } from 'next';
import { Header, Footer, Container, Section, SectionHeading, CTASection, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { audiences } from '@/lib/site-data';
import { IconArrowRight } from '@/components/ui/icons';

const URL = 'https://www.usukaccountants.com/who-we-help';

export const metadata: Metadata = {
  title: 'Who We Help — US & UK Cross-Border Clients',
  description:
    'Specialist tax and accounting for Americans in the UK, Britons in the US, dual citizens, cross-border families, business owners and high-net-worth individuals.',
  alternates: { canonical: URL },
};

export default function WhoWeHelpHub() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Who We Help', href: '/who-we-help' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <main>
        <Breadcrumbs crumbs={crumbs} />
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-prose">
              <p className="mb-3 text-xs font-semibold uppercase tracking-eyebrow text-gold">Who we help</p>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Specialists for your exact cross-border situation
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Whether you hold one passport or two, live on either side of the Atlantic, or run a business across
                it, your tax position is specific. Find the help built for you.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <SectionHeading eyebrow="Find your situation" title="We work with" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {audiences.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="group flex items-start gap-4 rounded-2xl border border-mist bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-e2"
                >
                  <span className="text-2xl" aria-hidden="true">{a.flag}</span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-ink">{a.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{a.description}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-antique">
                      Learn more <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </Container>
        </Section>

        <CTASection
          title="Not sure which describes you?"
          intro="Book a consultation and we'll point you to the right approach for your situation."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
