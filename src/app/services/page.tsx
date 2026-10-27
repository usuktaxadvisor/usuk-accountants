import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, Container, Section, SectionHeading, CTASection, FAQSection } from '@/components/library';
import { Breadcrumbs } from '@/components/library';
import { JsonLd } from '@/components/library';
import { breadcrumbSchema } from '@/lib/schema';
import { pillars } from '@/lib/site-data';
import { IconBank, IconGlobeDoc, IconTreaty, IconArrowRight } from '@/components/ui/icons';

const URL = 'https://www.usukaccountants.com/services';
const PILLAR_IMG: Record<string, [string, string]> = {
  '/services/uk-accounting': ['service-accounting', 'Cloth-bound ledgers with a brass ruler and ink pen'],
  '/services/us-expat-tax': ['service-expat', 'A leather travel document wallet beside reading glasses and a brass pen'],
  '/services/cross-border-advisory': ['service-advisory', 'A dark boardroom table under one warm pendant light'],
};

const icons = { bank: IconBank, globe: IconGlobeDoc, treaty: IconTreaty } as const;

export const metadata: Metadata = {
  title: 'Services: US & UK Tax and Accounting',
  description:
    'US expat tax, UK accounting and cross-border advisory under one roof, for expats, dual citizens, families and businesses between the US and the UK.',
  alternates: { canonical: URL },
};

const FAQ_TITLE = 'Questions about our services';
const faqs = [
  { q: 'Do you handle both the US and the UK side, or just one?', a: 'Both, in one firm. We prepare US federal and state returns, UK Self Assessment and company filings, and the cross-border reporting that sits between them (FBAR, Form 8938, treaty positions), so the two countries are worked together rather than by two separate advisers.' },
  { q: 'How do you charge?', a: 'Every piece of work is quoted in writing, as a fixed fee, before we start. The quote is based on the years, forms and countries involved, and it does not change unless the scope changes, which we agree with you first.' },
  { q: 'How do we work together?', a: 'By email, with a secure portal for documents. That keeps every figure, question and answer in writing for you to refer back to, and it suits clients in any time zone. We do not deal with the IRS or HMRC on your behalf; we prepare what needs filing and you stay in control of your own affairs.' },
  { q: 'I have missed US filings for several years. Where do I start?', a: 'Start with the Streamlined Foreign Offshore Procedures page, which explains the IRS catch up route for people living outside the US, and the FBAR filing page for the account reports that go with it. If you are not sure which route applies, tell us your situation and we will set out the options in writing.' },
  { q: 'Do you give investment or financial advice?', a: 'No. We are a tax and accounting firm and are not authorised to give investment or financial advice. We explain the tax consequences of a decision; the decision itself stays with you or your financial adviser.' },
];

export default function ServicesHub() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }];
  return (
    <>
      <JsonLd schema={breadcrumbSchema(crumbs)} />
      <Header />
      <main>
        <Breadcrumbs crumbs={crumbs} />
        <header className="page-header py-20 md:py-28">
          <div aria-hidden="true" data-parallax="0.1" className="page-header-art parallax-layer art-us-expat" />
          <Container>
            <div className="max-w-prose">
              <p className="mb-3 kicker kicker-light">Services</p>
              <h1 className="font-display text-display-lg text-white">
                Two tax systems. One advisory firm.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                We bring US tax, UK accounting and cross-border advisory together under one roof, so the people
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
                const art = PILLAR_IMG[p.href];
                return (
                  <a
                    key={p.title}
                    href={p.href}
                    className="group flex flex-col overflow-hidden rounded-card border border-mist bg-white transition-all duration-300 hover:border-gold/70 hover:shadow-e2"
                  >
                    {art && (
                      <span className="relative block aspect-[16/10] overflow-hidden bg-navy-ink">
                        <Image src={`/images/atlantic/${art[0]}.jpg`} alt={art[1]} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03]" />
                      </span>
                    )}
                    <span className="flex flex-1 flex-col p-7">
                      <span className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-gold-antique" />
                        <h2 className="font-display text-display-sm text-ink">{p.title}</h2>
                      </span>
                      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{p.description}</p>
                      <span className="mt-6 inline-flex items-center gap-2 border-t border-mist pt-4 text-sm font-semibold text-gold-antique">
                        Explore {p.title}
                        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
            <p className="mt-8 text-center text-sm text-muted">
              Not sure where you fit, or need both sides handled together? See our{' '}
              <Link href="/us-uk-tax-services" className="font-medium text-navy underline hover:text-gold">
                complete US &amp; UK tax services overview
              </Link>{' '}
              for the full cross-border picture in one place.
            </p>
          </Container>
        </Section>

        <FAQSection faqs={faqs} emitSchema eyebrow="Common questions" title={FAQ_TITLE} />

        <CTASection
          title="Not sure which service you need?"
          intro="Email us a few lines about your situation and we'll point you to the right place, even if that's not us."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
