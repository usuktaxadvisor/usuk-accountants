import type { Metadata } from 'next';
import { PageShell, Section, Container, CorporationTaxCalculator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/corporation-tax';

export const metadata: Metadata = {
  title: 'UK Corporation Tax Estimator — Including Marginal Relief',
  description:
    'Free UK Corporation Tax calculator. Estimate your company\u2019s Corporation Tax including the small-profits rate, main rate, and marginal relief between the limits — plus the US angle for American owners.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'kristina')!;

const faqs = [
  {
    q: 'How much is UK Corporation Tax?',
    a: 'It depends on your profit level. Profits up to the lower limit are taxed at the small-profits rate, profits above the upper limit at the main rate, and profits in between are taxed at the main rate reduced by marginal relief — so the effective rate rises gradually across that band rather than jumping.',
  },
  {
    q: 'What is marginal relief?',
    a: 'Marginal relief smooths the transition between the small-profits rate and the main rate. For profits between the lower and upper limits, you start from the main rate and subtract a relief amount, which means your effective rate sits somewhere between the two headline rates. It prevents a sudden cliff-edge as profits grow.',
  },
  {
    q: 'Do associated companies affect Corporation Tax?',
    a: 'Yes. The lower and upper limits are divided by the number of associated companies, so a group of companies reaches the main rate at lower individual profit levels. This calculator assumes a single standalone company, so if you control other companies the thresholds will be lower than shown.',
  },
  {
    q: 'Does a US owner pay US tax on a UK company\u2019s profits too?',
    a: 'Often, yes. A UK company owned by a US citizen is usually a controlled foreign corporation, so its profits can be taxed in the US under the GILTI/NCTI rules even before they are distributed — with the UK Corporation Tax generally available as a credit. The two systems need to be coordinated to avoid overpaying.',
  },
];

export default function CorporationTaxPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="UK Corporation Tax Estimator"
      answer="Estimate your UK company's Corporation Tax, including marginal relief. Profits up to the lower limit are taxed at the small-profits rate, profits above the upper limit at the main rate, and profits in between are tapered by marginal relief. Enter your taxable profit to see the figure and your effective rate."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'UK Corporation Tax Estimator', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Own a UK company as a US citizen?"
      ctaIntro="UK Corporation Tax is only half the picture — we coordinate it with the US GILTI/NCTI rules so you don't overpay."
    >
      <Section tone="white">
        <Container>
          <CorporationTaxCalculator />
          <CalculatorRelatedLinks {...calculatorLinks['corporation-tax']} />
        </Container>
      </Section>
    </PageShell>
  );
}
