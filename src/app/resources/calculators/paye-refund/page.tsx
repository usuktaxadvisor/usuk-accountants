import type { Metadata } from 'next';
import { PageShell, Section, Container, PayeRefundEstimator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/paye-refund';

export const metadata: Metadata = {
  title: 'UK PAYE Tax Refund Estimator — Have You Overpaid HMRC?',
  description: 'Emergency tax codes, multiple jobs, and mid-year job changes often leave employees overpaying HMRC. Estimate whether you are due a UK income tax refund — and how much HMRC owes you.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const faqs = [
  {
    q: 'Why might I have overpaid UK income tax through PAYE?',
    a: 'Common reasons: an emergency tax code applied when starting a new job; two jobs simultaneously both using the full personal allowance; stopping work part-way through the year; or allowable expenses not included in your tax code.',
  },
  {
    q: 'How do I claim a PAYE overpayment back from HMRC?',
    a: 'HMRC sometimes issues refunds automatically, but you can claim proactively via a P800, R40 form, or Self Assessment return. HMRC allows claims going back four tax years.',
  },
  {
    q: 'What is an emergency tax code and why does it cause overpayment?',
    a: 'An emergency tax code (1257L W1/M1 or 0T) is applied when HMRC lacks your current tax information. It taxes each pay period without the benefit of allowances accumulated earlier in the year, often resulting in over-deduction.',
  },
  {
    q: 'Do I need to file a Self Assessment return to claim a refund?',
    a: 'Sometimes yes. If income exceeds £100,000, untaxed income exceeds £1,000, or other Self Assessment triggers apply, a return is required. For straightforward PAYE employees, HMRC may process the refund without a full return.',
  },
  {
    q: 'If I am a US citizen, does a UK tax refund affect my US return?',
    a: 'Yes. If you claimed a Foreign Tax Credit for the UK tax paid and then receive a refund, that amount is no longer available as a credit. You may need to amend a prior US return or adjust the following year\'s FTC calculation.',
  },
];

export default function PayeRefundPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="UK PAYE Tax Refund Estimator"
      answer="Emergency tax codes, multiple employments, and mid-year job changes frequently leave employees overpaying HMRC through PAYE. This estimator calculates your approximate correct UK income tax bill using 2025/26 rates, compares it to what was actually deducted, and indicates whether a refund is likely. HMRC allows claims for overpaid tax going back four tax years."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'UK PAYE Tax Refund Estimator', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-07-29"
      faqs={faqs}
      ctaTitle="Think HMRC owes you money?"
      ctaIntro="Claiming overpaid tax — especially for prior years or alongside a Self Assessment obligation — is easiest with a specialist. Book a consultation and we will confirm the position and file the claim for you."
    >
      <Section tone="white">
        <Container>
          <PayeRefundEstimator />
          <CalculatorRelatedLinks {...calculatorLinks['paye-refund']} />
        </Container>
      </Section>
    </PageShell>
  );
}
