import type { Metadata } from 'next';
import { PageShell, Section, Container, SrtCalculator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/srt-residence';

export const metadata: Metadata = {
  title: 'UK Statutory Residence Test Calculator — Are You UK Tax Resident?',
  description:
    'Free UK Statutory Residence Test (SRT) checker. Work through the automatic overseas, automatic UK and sufficient ties tests to estimate your UK tax-residence status for the year.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const faqs = [
  {
    q: 'What is the Statutory Residence Test?',
    a: 'The SRT is HMRC\u2019s mechanical test for whether you are UK tax resident in a given tax year. It applies three stages in order: the automatic overseas tests (which can establish non-residence), the automatic UK tests (which can establish residence, including the 183-day rule), and — if neither is conclusive — the sufficient ties test, which weighs your UK days against your UK connections.',
  },
  {
    q: 'How is a "UK day" counted?',
    a: 'Generally, a UK day is any day on which you are present in the UK at midnight (the end of the day). Arriving in the morning and leaving late the same night counts as zero days. There are separate rules for workdays and for days spent in transit, and a deeming rule can catch frequent day-trips.',
  },
  {
    q: 'How many days can I spend in the UK without becoming resident?',
    a: 'It depends on your history and ties. If you were UK resident in the last three years, as few as 16 days can matter; if you were not, the floor is higher. Once neither automatic test resolves your position, the sufficient ties test sets your limit — more ties means fewer days before you become resident. 183 days or more is always automatic UK residence.',
  },
  {
    q: 'Does this tool give a definitive answer?',
    a: 'No. It applies the headline thresholds to give an indication. It does not model split-year treatment, the deeming rule, exceptional circumstances, the "only home" or full-time-UK-work automatic tests, or treaty tie-breakers — all of which can change the outcome. Residence is self-assessed and can be reviewed by HMRC, so confirm borderline cases with a specialist.',
  },
];

export default function SrtPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="UK Statutory Residence Test"
      answer="Whether you are UK tax resident is decided by HMRC's Statutory Residence Test, applied in a fixed order: automatic overseas tests, then automatic UK tests, then the sufficient ties test. This checker walks you through your UK days, your residence history and your ties to give an indicative result — and shows which test decided it."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'UK Statutory Residence Test', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-24"
      faqs={faqs}
      ctaTitle="Residence position borderline?"
      ctaIntro="If your day count or ties put you near a threshold, the detail matters. Book a consultation and we'll confirm your exact residence position and plan around it."
    >
      <Section tone="white">
        <Container>
          <SrtCalculator />
          <CalculatorRelatedLinks {...calculatorLinks['srt-residence']} />
        </Container>
      </Section>
    </PageShell>
  );
}
