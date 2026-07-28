import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell,
  Section,
  Container,
  ProseBlock,
  ProcessSteps,
  KeyFacts,
  WhoItsFor,
  RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const url = '/resources/guides/delinquent-fbar';

export const metadata: Metadata = {
  title: 'Delinquent FBAR Guide: How to File Late FBARs the Right Way',
  description:
    'A step-by-step guide to catching up on missed FBARs from the UK: the Delinquent FBAR Submission Procedures, reasonable cause, and when Streamlined Filing is a better fit.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What are the Delinquent FBAR Submission Procedures?',
    a: 'An IRS pathway for taxpayers who did not file required FBARs but correctly reported and paid tax on the related income. Late FBARs are e-filed with a statement explaining the lateness, generally without penalty.',
  },
  {
    q: 'What if I also failed to report the income?',
    a: 'Then the Delinquent FBAR route usually does not apply. The Streamlined Filing Compliance Procedures are typically the correct path for non-willful cases with unreported income.',
  },
  {
    q: 'How many years of FBARs do I need to file?',
    a: 'The FBAR look-back period differs from the tax-return look-back. Confirm the exact number of years for your situation with a professional.',
  },
];

export default function DelinquentFbarGuidePage() {
  return (
    <PageShell
      url={url}
      eyebrow="Guide"
      title="Delinquent FBAR: how to file late FBARs the right way"
      answer="If you missed one or more FBARs but reported your income, the Delinquent FBAR Submission Procedures usually let you catch up without penalty."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Guides', href: '/resources' },
        { label: 'Delinquent FBAR', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Need help catching up?"
      ctaIntro="We handle delinquent-FBAR submissions for Americans in the UK end to end."
    >
      <Section>
        <Container>
          <ProseBlock eyebrow="Overview" title="What 'delinquent FBAR' actually means">
            <p>
              An FBAR (FinCEN Form 114) reports your foreign financial accounts. If you were
              required to file one in a past year and did not, that FBAR is{' '}
              <Link href="/resources/glossary/delinquent-fbar">delinquent</Link>. Where your income
              was reported and tax paid, the IRS provides a usually penalty-free way to catch up.
            </p>
          </ProseBlock>
        </Container>
      </Section>
      <Section>
        <Container>
          <WhoItsFor
            title="This guide is for you if"
            items={[
              'You reported your income but forgot or did not know to file FBARs',
              'You have foreign accounts that exceeded the reporting threshold',
              'You want to become compliant before the IRS contacts you',
            ]}
          />
        </Container>
      </Section>
      <Section>
        <Container>
          <ProcessSteps
            eyebrow="The process"
            title="Filing delinquent FBARs step by step"
            steps={[
              { title: '1. Confirm you qualify', description: 'You must have reported the income and paid any tax due, and not be under IRS examination.' },
              { title: '2. Identify the years', description: 'Determine each year an FBAR was required based on your account balances.' },
              { title: '3. Prepare a reasonable-cause statement', description: 'Explain clearly and honestly why the FBARs were late.' },
              { title: '4. E-file through FinCEN', description: 'Submit the late FBARs electronically with the explanation attached.' },
            ]}
          />
        </Container>
      </Section>
      <Section>
        <Container>
          <KeyFacts
            title="At a glance"
            facts={[
              { label: 'Form', value: 'FinCEN Form 114 (FBAR)' },
              { label: 'Filed with', value: 'FinCEN (electronically)' },
              { label: 'Typical outcome', value: 'No penalty if income was reported' },
              { label: 'If income unreported', value: 'Use Streamlined Filing instead' },
            ]}
          />
        </Container>
      </Section>
      <Section>
        <Container>
          <RelatedLinks
            title="Related tools and pages"
            links={[
              { label: 'Delinquent FBAR Penalty Estimator', href: '/resources/calculators/delinquent-fbar-penalty', description: 'See which procedure applies to you.' },
              { label: 'FBAR Checker', href: '/resources/calculators/fbar-checker', description: 'Check whether you need to file an FBAR at all.' },
              { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing', description: 'For non-willful cases with unreported income.' },
              { label: 'US Tax Returns Hub', href: '/services/us-expat-tax/us-tax-returns/hub', description: 'The full US-returns resource hub.' },
            ]}
          />
        </Container>
      </Section>
    </PageShell>
  );
}
