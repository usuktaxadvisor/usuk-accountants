import type { Metadata } from 'next';
import { PageShell, Section, Container, ExitTaxEstimator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/exit-tax';

export const metadata: Metadata = {
  title: 'US Exit Tax Calculator — Covered Expatriate Screen (Form 8854)',
  description:
    'Planning to renounce US citizenship or give up your green card? Screen whether you would be a covered expatriate under IRC §877A and understand the exit tax consequences before you act.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const faqs = [
  {
    q: 'What is the US exit tax?',
    a: 'The US exit tax under IRC §877A applies to "covered expatriates" — US citizens who renounce citizenship and long-term green card holders who abandon their status. If you are covered, your worldwide assets are deemed sold at fair market value the day before expatriation, and gains above an indexed exclusion are taxed at capital gains rates. Special rules apply to deferred compensation and trust interests.',
  },
  {
    q: 'Who is a covered expatriate?',
    a: 'You are a covered expatriate if you fail any one of three tests: (1) your worldwide net worth on the date of expatriation is $2,000,000 or more; (2) your average annual net US income tax for the five preceding years is $206,000 or more (2025 indexed amount); or (3) you cannot certify that you have complied with all US tax obligations for the five preceding years. The compliance test is the most commonly overlooked.',
  },
  {
    q: 'What does the compliance certification test mean in practice?',
    a: 'To pass the compliance test, you must certify under penalty of perjury on Form 8854 that you have filed all required US tax returns and paid all taxes due for the five years before expatriation. This includes information returns such as FBARs, Form 8938, and Form 5471. A missed FBAR or foreign company return can make you a covered expatriate even if your income and wealth are below the other thresholds.',
  },
  {
    q: 'Can the exit tax be reduced by planning?',
    a: 'Yes, substantially. The timing of expatriation relative to asset values, the order in which assets are sold or restructured before expatriation, use of the mark-to-market exclusion, and elections on deferred compensation can all reduce the impact. Planning 1–3 years before the intended renunciation date gives the most options.',
  },
  {
    q: 'What happens to heirs and beneficiaries of a covered expatriate?',
    a: 'Under Section 2801, US persons who receive gifts or bequests from a covered expatriate after expatriation pay a covered gift or bequest tax at the highest estate or gift tax rate. This applies even if the covered expatriate has no other US connection — a significant and often overlooked consequence for mixed US/non-US families.',
  },
];

export default function ExitTaxPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="US Exit Tax — Covered Expatriate Screen"
      answer="US citizens who renounce citizenship and long-term green card holders who abandon their status face a potential exit tax under IRC §877A. Whether it applies depends on whether you are a covered expatriate — determined by three independent tests: net worth over $2 million, average annual US tax over an indexed threshold, or inability to certify five years of tax compliance. This screen assesses each test and explains the consequences of covered status."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'US Exit Tax — Covered Expatriate Screen', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-07-29"
      faqs={faqs}
      ctaTitle="Planning to renounce or abandon your green card?"
      ctaIntro="Expatriation is irreversible. The exit tax can be substantially reduced with advance planning — but the options narrow significantly once the process begins. Book a confidential consultation well before taking any steps."
    >
      <Section tone="white">
        <Container>
          <ExitTaxEstimator />
          <CalculatorRelatedLinks {...calculatorLinks['exit-tax']} />
        </Container>
      </Section>
    </PageShell>
  );
}
