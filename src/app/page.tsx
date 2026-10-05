import Link from 'next/link';
import { JsonLd } from '@/components/library';
import { faqSchema } from '@/lib/schema';
import { faqs as siteFaqs } from '@/lib/site-data';
import {
  Header, Footer, MobileBar,
  Hero, TrustBar, Pillars, Calculator, ServicesSection,
  WhoWeHelp, ProcessStats, TestimonialsSection, FAQSection, CTASection,
  Section, Container, ConsultationTiers,
} from '@/components/library';

export default function Home() {
  return (
    <>
      <JsonLd schema={[faqSchema(siteFaqs)]} />
      <Header />
      <main>
        <Hero primaryCta={{ label: 'Contact us', href: '/contact' }} />
        <TrustBar />
        <Section tone="white">
          <Container>
            <div className="mx-auto max-w-6xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">What we prepare and file</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Tax returns and compliance, US and UK, under one roof</h2>
              <p className="mt-4 max-w-prose text-muted">Most of our clients come to us for the filings themselves. These are the returns and reports we prepare every year, each with a fixed fee quoted in writing before we start.</p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'US tax returns (Form 1040)', detail: 'Federal and state returns for US citizens and green card holders living in the UK.', href: '/services/us-expat-tax/us-tax-returns' },
                  { label: 'UK Self Assessment', detail: 'HMRC returns for the self-employed, landlords, high earners and people with US income.', href: '/services/uk-accounting/self-assessment' },
                  { label: 'US–UK cross-border returns', detail: 'Both countries prepared together so credits, treaty positions and dates line up.', href: '/services/us-expat-tax/us-tax-returns/hub' },
                  { label: 'Streamlined Foreign Offshore filings', detail: 'Three years of returns and six years of FBARs to catch up on missed US filings.', href: '/services/us-expat-tax/streamlined-filing' },
                  { label: 'FBAR (FinCEN Form 114)', detail: 'Annual reporting of UK accounts, ISAs and pensions over $10,000 combined.', href: '/services/us-expat-tax/fbar-filing' },
                  { label: 'FATCA / Form 8938', detail: 'Foreign financial asset reporting filed with your US return above the thresholds.', href: '/services/us-expat-tax/fatca-compliance' },
                  { label: 'W-8BEN, W-8BEN-E and W-9', detail: 'The right US withholding form, with treaty rates applied where they apply.', href: '/services/us-expat-tax/w-8ben-us-withholding-forms' },
                  { label: 'Late and catch-up US filings', detail: 'Delinquent FBARs and late returns where the Streamlined route does not apply.', href: '/resources/guides/delinquent-fbar' },
                ].map((s) => (
                  <li key={s.href} className="rounded-2xl border border-mist bg-white p-5 transition-colors hover:border-navy-ink">
                    <Link href={s.href} className="block">
                      <span className="font-semibold text-ink">{s.label}</span>
                      <span className="mt-2 block text-sm text-muted">{s.detail}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
        <Pillars />
        <Calculator />
        <ServicesSection />
        <WhoWeHelp />
        <Section tone="white">
          <Container>
            <ConsultationTiers />
          </Container>
        </Section>
        <ProcessStats />
        <TestimonialsSection />
        <section className="bg-navy-ink py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:grid-cols-2">
            <figure>
              <img src="/images/atlantic/bridge-london.jpg" alt="Tower Bridge in London at dusk, its walkways traced in warm golden light" width={1800} height={1013} loading="lazy" className="h-64 w-full rounded-2xl object-cover sm:h-80" />
              <figcaption className="mt-3 text-sm font-semibold tracking-wide text-softwhite/70">LONDON</figcaption>
            </figure>
            <figure>
              <img src="/images/atlantic/loc-newyork.jpg" alt="Brooklyn Bridge at dusk with the warm lights of Lower Manhattan beyond" width={1800} height={1013} loading="lazy" className="h-64 w-full rounded-2xl object-cover sm:h-80" />
              <figcaption className="mt-3 text-sm font-semibold tracking-wide text-softwhite/70">NEW YORK</figcaption>
            </figure>
          </div>
        </section>
        <FAQSection />
        <CTASection
          title="Ready to simplify your US–UK taxes?"
          intro="Tell us about your situation by email and we'll come back with a clear view of where you stand and what comes next."
          tone="navy"
          primary={{ label: 'Contact us', href: '/contact' }}
        />
      </main>
      <Footer />
      <MobileBar />
      <div className="h-16 lg:hidden" aria-hidden />
    </>
  );
}
