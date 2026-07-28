import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell,
  Section,
  Container,
  WhoItsFor,
  ProcessSteps,
  KeyFacts,
  RelatedLinks,
  ProseBlock,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const url = '/services/us-expat-tax/us-tax-returns/hub';

export const metadata: Metadata = {
  title: 'US Tax Returns for Americans in the UK - Complete Hub',
  description:
    'The complete resource hub for US tax returns from the UK: Form 1040, FBAR, delinquent-FBAR catch-up, Streamlined Filing, calculators and glossary.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'Do I still need to file a US tax return if I live in the UK?',
    a: 'Yes. US citizens and green-card holders file a Form 1040 on worldwide income every year, even when foreign tax credits or the FEIE reduce US tax to zero.',
  },
  {
    q: 'What is the difference between a tax return and an FBAR?',
    a: 'A tax return (Form 1040) reports income and calculates tax. An FBAR (FinCEN Form 114) is a separate information report of foreign financial accounts, filed with FinCEN.',
  },
  {
    q: 'I have missed several years - where do I start?',
    a: 'It depends whether income was reported. If income was reported but FBARs were missed, the Delinquent FBAR procedures usually apply. If income was unreported, Streamlined Filing is often the right route.',
  },
];

export default function UsTaxReturnsHubPage() {
  return (
    <PageShell
      url={url}
      eyebrow="US Tax Returns"
      title="US Tax Returns from the UK - the complete hub"
      answer="Everything an American in the UK needs to file correctly: annual Form 1040, foreign-account reporting, catching up on missed years, and the tools to plan it."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns' },
        { label: 'Hub', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      service={{
        url,
        name: 'US Tax Return Preparation for UK Residents',
        description: 'Preparation and review of US federal tax returns (Form 1040) and related foreign-account reporting for US persons living in the UK.',
        serviceType: 'Tax return preparation',
      }}
      ctaTitle="Not sure which route applies to you?"
      ctaIntro="Book a consultation and we'll map your filing position in one call."
    >
      <Section>
        <Container>
          <ProseBlock eyebrow="Start here" title="Filing US taxes from the UK, without the guesswork">
            <p>
              This hub brings together the core building blocks of US tax compliance for Americans
              in the UK.{' '}
              <Link href="/services/us-expat-tax/us-tax-returns">See our core US Tax Returns service</Link>.
            </p>
          </ProseBlock>
        </Container>
      </Section>
      <Section>
        <Container>
          <WhoItsFor
            title="Who this hub is for"
            items={[
              'Americans in the UK filing a US return for the first time',
              'Long-term expats who want to sanity-check their annual filing',
              'People who have missed one or more years and need a catch-up route',
              'Dual citizens balancing HMRC and IRS obligations',
            ]}
          />
        </Container>
      </Section>
      <Section>
        <Container>
          <ProcessSteps
            eyebrow="The building blocks"
            title="Work through US tax returns in order"
            steps={[
              { title: '1. File your annual Form 1040', description: 'Report worldwide income and apply the FEIE or foreign tax credit to avoid double taxation.' },
              { title: '2. Report foreign accounts (FBAR / Form 8938)', description: 'Separate information reports triggered by foreign account balances over the thresholds.' },
              { title: '3. Catch up on any missed years', description: 'Use the Delinquent FBAR procedures or Streamlined Filing depending on whether income was reported.' },
              { title: '4. Plan forward', description: 'Set up a repeatable annual process so future filings are simple and penalty-free.' },
            ]}
          />
        </Container>
      </Section>
      <Section>
        <Container>
          <KeyFacts
            title="At a glance"
            facts={[
              { label: 'Annual return', value: 'Form 1040 (worldwide income)' },
              { label: 'Account report', value: 'FBAR - FinCEN Form 114' },
              { label: 'Catch-up (income reported)', value: 'Delinquent FBAR procedures' },
              { label: 'Catch-up (income unreported)', value: 'Streamlined Filing' },
            ]}
          />
        </Container>
      </Section>
      <Section>
        <Container>
          <RelatedLinks
            title="Explore the US Tax Returns cluster"
            links={[
              { label: 'US Tax Returns service', href: '/services/us-expat-tax/us-tax-returns', description: 'Our core return-preparation service page.' },
              { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing', description: 'Reporting foreign financial accounts to FinCEN.' },
              { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing', description: 'Penalty-reduced catch-up for non-willful cases.' },
              { label: 'Delinquent FBAR Guide', href: '/resources/guides/delinquent-fbar', description: 'How to file late FBARs the right way.' },
              { label: 'Delinquent FBAR Penalty Estimator', href: '/resources/calculators/delinquent-fbar-penalty', description: 'Estimate exposure by scenario.' },
              { label: 'Glossary: US Tax Return (Form 1040)', href: '/resources/glossary/us-tax-return-1040', description: 'Plain-English definition.' },
            ]}
          />
        </Container>
      </Section>
    </PageShell>
  );
}
