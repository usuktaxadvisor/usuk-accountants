import type { Metadata } from 'next';
import { PageShell, Section, Container, UsExpatRefundEstimator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/us-expat-refund';

export const metadata: Metadata = {
  title: 'US Expat Tax Refund Estimator — Are You Owed a US Refund?',
  description:
    'Americans in the UK often overpay US tax through withholding or estimated payments. Estimate whether you are owed a US federal tax refund after applying the Foreign Tax Credit or FEIE — and how much.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const faqs = [
  {
    q: 'Can Americans living in the UK get a US tax refund?',
    a: 'Yes. If you had US federal tax withheld on US-source income, or made estimated tax payments, and your actual US liability is lower — often because the Foreign Tax Credit wipes out most or all of it — you are entitled to a refund of the difference. The refund is only paid after you file your Form 1040; it does not happen automatically.',
  },
  {
    q: 'Why might my US tax liability be lower than the tax withheld?',
    a: 'Most Americans in the UK pay UK income tax at rates equal to or above the US federal rate. The Foreign Tax Credit gives a dollar-for-dollar reduction in US tax for each dollar of UK tax paid on the same income, frequently reducing the US bill to zero. Any withholding or estimated payments above zero then become a refund.',
  },
  {
    q: 'What is the difference between the Foreign Tax Credit and the FEIE for a refund?',
    a: 'The Foreign Tax Credit (Form 1116) directly offsets US tax with UK tax paid — and can generate a refund if you overpaid. The Foreign Earned Income Exclusion (Form 2555) excludes earned income from US tax up to an indexed cap, which can also reduce your liability to zero, but works differently and cannot generate a refund of tax that was not owed. The better choice depends on your income type, level, and future plans.',
  },
  {
    q: 'How far back can I claim a US tax refund?',
    a: 'Generally three years from the original filing deadline of the return, or two years from when the tax was paid, whichever is later. For most people this means three years of refundable returns. If you have not filed, filing late can still generate the refund — but the window is strictly enforced.',
  },
  {
    q: 'Does this estimator account for self-employment tax or the NIIT?',
    a: 'No — deliberately. Both self-employment tax and the 3.8% Net Investment Income Tax are not reduced by the Foreign Tax Credit or FEIE, so they are separate calculations that require your specific facts. The estimator covers the standard income tax position only, which is where most refunds arise.',
  },
];

export default function UsExpatRefundPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="US Expat Tax Refund Estimator"
      answer="If you are a US citizen in the UK and had tax withheld on US-source income, or made estimated payments, you may be owed a US federal tax refund. The Foreign Tax Credit often reduces the US tax bill to zero for UK-rate earners — meaning the withholding or estimated payments come back as a refund. This estimator uses your income, UK tax paid, and relief choice to indicate whether a refund is likely and roughly how much."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'US Expat Tax Refund Estimator', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-07-29"
      faqs={faqs}
      ctaTitle="Think you are owed a US refund?"
      ctaIntro="Claiming it requires a correctly filed Form 1040 with the right relief election. Book a consultation and we will confirm the position, calculate the exact refund, and file for you."
    >
      <Section tone="white">
        <Container>
          <UsExpatRefundEstimator />
          <CalculatorRelatedLinks {...calculatorLinks['us-expat-refund']} />
        </Container>
      </Section>
    </PageShell>
  );
}
