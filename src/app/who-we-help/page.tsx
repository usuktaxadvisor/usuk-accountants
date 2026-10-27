import type { Metadata } from 'next';
import { Header, Footer, Container, Section, SectionHeading, CTASection, Breadcrumbs, JsonLd, FAQSection } from '@/components/library';
import { breadcrumbSchema } from '@/lib/schema';
import { audiences } from '@/lib/site-data';
import { IconArrowRight } from '@/components/ui/icons';

const URL = 'https://www.usukaccountants.com/who-we-help';

export const metadata: Metadata = {
  title: 'Who We Help: US & UK Cross-Border Clients',
  description:
    'Specialist tax and accounting for Americans in the UK, Britons in the US, dual citizens, cross-border families, business owners and high-net-worth individuals.',
  alternates: { canonical: URL },
};

const FAQ_TITLE = 'Questions about who we help';
const faqs = [
  { q: 'I am an American living in the UK. Do I still have to file US tax returns?', a: 'Yes. US citizens and green card holders file a US return every year wherever they live, and report their non US accounts once they pass the thresholds. UK tax already paid is usually taken into account through the Foreign Tax Credit or the Foreign Earned Income Exclusion, so most people pay little or nothing twice, but the return still has to be filed.' },
  { q: 'I am British and moved to the US. What changes?', a: 'Once you are US resident you file US federal and state returns on your worldwide income, including UK income such as rent, pensions and interest. Your UK position depends on the Statutory Residence Test and may involve a split year and a final Self Assessment return. We prepare both sides together.' },
  { q: 'Do you work with businesses as well as individuals?', a: 'Yes. We act for UK companies with US owners, US companies with UK operations, and the owners themselves, including Form 5471, GILTI, company accounts and Corporation Tax, and the structuring questions that connect them.' },
  { q: 'What if my situation does not fit one of these groups?', a: 'Most clients sit across two or three of them, for example a dual citizen who owns a company and holds a UK pension. Tell us your facts by email and we will set out what applies to you in writing.' },
  { q: 'Do you give investment or financial advice?', a: 'No. We are a tax and accounting firm and are not authorised to give investment or financial advice. We explain the tax consequences; the investment decisions stay with you or your financial adviser.' },
];

export default function WhoWeHelpHub() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Who We Help', href: '/who-we-help' }];
  return (
    <>
      <JsonLd schema={breadcrumbSchema(crumbs)} />
      <Header />
      <main>
        <Breadcrumbs crumbs={crumbs} />
        <header className="page-header py-20 md:py-28">
          <div aria-hidden="true" data-parallax="0.1" className="page-header-art parallax-layer art-who" />
          <Container>
            <div className="max-w-prose">
              <p className="mb-3 kicker kicker-light">Who we help</p>
              <h1 className="font-display text-display-lg text-white">
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
                  className="group flex items-start gap-4 rounded-card border border-mist bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-e2"
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

        <FAQSection faqs={faqs} emitSchema eyebrow="Common questions" title={FAQ_TITLE} />

        <CTASection
          title="Not sure which describes you?"
          intro="Email us a few lines about your situation and we'll point you to the right approach."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
