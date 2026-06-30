import type { Metadata } from 'next';
import { PageShell, Section, Container, TakeHomePayCalculator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/take-home-pay';

export const metadata: Metadata = {
  title: 'US vs UK Take-Home Pay Calculator — Compare Net Salary',
  description:
    'Free US vs UK take-home pay comparison. See what proportion of a salary you keep after income tax and social contributions in each country — a directional tool for weighing a transatlantic move.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'Do you keep more of your salary in the US or the UK?',
    a: 'It depends on income level and, in the US, your state. At many income levels US take-home as a percentage of gross is higher than the UK\u2019s, largely because UK National Insurance and income tax bands bite earlier — but US state taxes, healthcare costs, and the cross-border filing obligations for Americans complicate a simple comparison. This tool gives a directional percentage rather than a precise figure.',
  },
  {
    q: 'Why does the calculator ask for a US state tax rate?',
    a: 'Because US state income tax varies enormously — from 0% in states like Texas and Florida to around 13% at the top in California. There is no single US rate, so rather than guess, the tool lets you set the state rate to match where you would actually live.',
  },
  {
    q: 'Does this account for US citizens filing in both countries?',
    a: 'No — this compares domestic take-home in each system separately, which is the right comparison when weighing where to live. If you are a US citizen living in the UK you file in both countries, and foreign tax credits usually prevent double taxation but the picture is more complex. That is a case to model individually.',
  },
  {
    q: 'How accurate is the estimate?',
    a: 'The UK figures are computed from current-year income tax and National Insurance rules. The US figure is a simplified single-filer estimate using an approximate federal effective rate plus FICA, so it is directional rather than exact. For a precise after-tax comparison tailored to your situation, a short consultation is the better route.',
  },
];

export default function TakeHomePayPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="US vs UK Take-Home Pay"
      answer="Compare how much of a salary you keep in the US versus the UK after the main income taxes and social contributions. Enter a gross salary in each system to see your take-home pay and the percentage you retain — a directional comparison for anyone weighing a transatlantic move."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'US vs UK Take-Home Pay', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Planning a move across the Atlantic?"
      ctaIntro="If you're American, you'll likely file in both countries. We help you understand the real after-tax picture before you move."
    >
      <Section tone="white">
        <Container>
          <TakeHomePayCalculator />
          <CalculatorRelatedLinks {...calculatorLinks['take-home-pay']} />
        </Container>
      </Section>
    </PageShell>
  );
}
