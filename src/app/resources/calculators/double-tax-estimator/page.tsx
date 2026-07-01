import type { Metadata } from 'next';
import { PageShell, Section, Container, Calculator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/double-tax-estimator';

export const metadata: Metadata = {
  title: 'US/UK Double-Tax Estimator — Will You Be Taxed Twice?',
  description:
    'Free estimator for Americans in the UK and dual citizens: see whether your income risks being taxed twice and how much relief the Foreign Tax Credit and US–UK treaty may provide.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  { q: 'Will I really be taxed twice on the same income?', a: 'Usually not. The US–UK tax treaty, the Foreign Tax Credit and the Foreign Earned Income Exclusion are designed to prevent double taxation. Most people legally owe tax on a given income source in only one country once their filings are structured correctly. This tool gives you an indicative picture.' },
  { q: 'Does this replace professional advice?', a: 'No. It is an educational estimate using headline rules to show the general shape of your position. Your actual outcome depends on the full detail of your income, residency and filings — which is what a consultation covers.' },
  { q: 'What does the estimator need from me?', a: 'Just a rough income figure and your UK tax rate band. It does not store personal data to produce the estimate, and you only share an email if you choose to receive the full breakdown.' },
];

export default function DoubleTaxEstimator() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="US/UK Double-Tax Estimator"
      answer="If you're an American living in the UK, your income is reported to both the IRS and HMRC — but that rarely means paying twice. This estimator shows whether your income is at risk of double taxation and roughly how much relief the Foreign Tax Credit and US–UK treaty could provide. It takes under a minute."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'Double-Tax Estimator', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-22"
      faqs={faqs}
      ctaTitle="Turn your estimate into a plan"
      ctaIntro="Book a consultation and we'll confirm your exact position across both tax systems."
    >
      <Section tone="white">
        <Container>
          <Calculator />
          <CalculatorRelatedLinks {...calculatorLinks['double-tax-estimator']} />
        </Container>
      </Section>
    </PageShell>
  );
}
