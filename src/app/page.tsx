import Link from 'next/link';
import { JsonLd } from '@/components/library';
import { faqSchema } from '@/lib/schema';
import { faqs as siteFaqs } from '@/lib/site-data';
import {
  Header, Footer, MobileBar,
  Hero, TrustBar, Pillars, Calculator, ServicesSection,
  WhoWeHelp, ProcessStats, TestimonialsSection, FAQSection, CTASection,
  Section, Container, ConsultationTiers, AtlanticStrip, Eyebrow,
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
              <Eyebrow className="mb-4">What we prepare and file</Eyebrow>
              <h2 className="font-display text-display-md text-ink">Tax returns and compliance, US and UK, under one roof</h2>
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">Most of our clients come to us for the filings themselves. These are the returns and reports we prepare every year, each quoted in writing, case by case, before we start.</p>
              <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
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
                  <li key={s.href} className="border-t border-navy-ink/15 pt-4">
                    <Link href={s.href} className="group block">
                      <span className="font-display text-xl text-ink transition-colors group-hover:text-gold-antique">{s.label}</span>
                      <span className="mt-2 block text-sm leading-relaxed text-muted">{s.detail}</span>
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
        <AtlanticStrip />
        <WhoWeHelp />
        <Section tone="white">
          <Container>
            <ConsultationTiers />
          </Container>
        </Section>
        <ProcessStats />
        <TestimonialsSection />
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
