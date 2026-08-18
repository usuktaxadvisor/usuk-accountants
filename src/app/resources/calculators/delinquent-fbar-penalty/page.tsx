import type { Metadata } from 'next';
import {
  PageShell,
  Section,
  Container,
  DelinquentFbarPenaltyCalculator,
  CalculatorRelatedLinks,
} from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const url = '/resources/calculators/delinquent-fbar-penalty';

export const metadata: Metadata = {
  title: 'Delinquent FBAR Penalty Estimator',
  description:
    'Estimate potential FBAR penalty exposure and see which IRS catch-up procedure likely applies to your situation.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const faqs = [
  {
    q: 'Does a late FBAR always mean a penalty?',
    a: 'No. Where foreign income was reported and tax paid, late FBARs can usually be filed under the Delinquent FBAR Submission Procedures without penalty.',
  },
  {
    q: 'Is this estimator advice?',
    a: 'No. It is a general routing tool. Confirm your position with a qualified US-UK tax professional before acting.',
  },
];

export default function DelinquentFbarPenaltyPage() {
  return (
    <PageShell
      url={url}
      eyebrow="Calculator"
      title="Delinquent FBAR Penalty Estimator"
      answer="Answer up to two quick questions to see which IRS catch-up procedure typically applies to missed FBARs."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'Delinquent FBAR Penalty', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Ready to catch up correctly?"
      ctaIntro="Book a confidential consultation and we'll confirm the right route for you."
    >
      <Section>
        <Container>
          <DelinquentFbarPenaltyCalculator />
        </Container>
      </Section>
      <Section>
        <Container>
          <CalculatorRelatedLinks {...calculatorLinks['delinquent-fbar-penalty']} />
        </Container>
      </Section>
    </PageShell>
  );
}
