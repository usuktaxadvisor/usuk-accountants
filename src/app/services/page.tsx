import type { Metadata } from 'next';
import { Header, Footer, Container, Section, SectionHeading, CTASection } from '@/components/library';
import { Breadcrumbs } from '@/components/library';
import { JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { pillars } from '@/lib/site-data';
import { IconBank, IconGlobeDoc, IconTreaty, IconArrowRight } from '@/components/ui/icons';

const URL = 'https://www.usukaccountants.com/services';
const icons = { bank: IconBank, globe: IconGlobeDoc, treaty: IconTreaty } as const;

export const metadata: Metadata = {
  title: 'Services — US & UK Tax and Accounting',
  description:
    'US expat tax, UK accounting and cross-border advisory under one roof — for expats, dual citizens, families and businesses between the US and the UK.',
  alternates: { canonical: URL },
};

export default function ServicesHub() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <main>
        <Breadcrumbs crumbs={crumbs} />
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-prose">
              <p className="mb-3 text-xs font-semibold uppercase tracking-eyebrow text-gold">Services</p>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Two tax systems. One advisory firm.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                We bring US tax, UK accounting and cross-border advisory together under one roof — so the people
                and businesses living between the US and the UK have a single team that sees the whole picture.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <SectionHeading eyebrow="Our practice areas" title="Where we help" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {pillars.map((p) => {
                const Icon = icons[p.iconKey];
                return (
                  <a
                    key={p.title}
                    href={p.href}
                    className="group flex flex-col rounded-2xl border border-mist bg-porcelain p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-e2"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-antique">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 font-display text-xl font-semibold text-ink">{p.title}</h2>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{p.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-antique">
                      Explore {p.title}
                      <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                );
              })}
            </div>
          </Container>
        </Section>

        <CTASection
          title="Not sure which service you need?"
          intro="Book a consultation and we'll point you to the right place — even if that's not us."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
