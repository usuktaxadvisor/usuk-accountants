import type { Metadata } from 'next';
import { PageShell, Section, Container, PayeRefundEstimator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/paye-refund';

export const metadata: Metadata = {
  title: 'UK PAYE Tax Refund Estimator — Have You Overpaid HMRC?',
  description:
    'Emergency tax codes, multiple jobs, and mid-year job changes often leave employees overpaying HMRC. Estimate whether you are due a UK income tax refund — and how much HMRC owes you.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const faqs = [
  {
    q: 'Why might I have overpaid UK income tax through PAYE?',
    a: 'Several common reasons: an emergency tax code (W1, M1 or 0T) applied when you started a new job and did not use your full personal allowance from the start of the year; you had two jobs simultaneously but both employers used the full personal allowance; you stopped work part-way through the year and your employer kept deducting tax at the normal rate; or allowable expenses were not included in your tax code.',
  },
  {
    q: 'How do I claim a PAYE overpayment back from HMRC?',
    a: 'HMRC does sometimes automatically issue a refund after the end of the tax year if their records show an overpayment — but this is not guaranteed. You can claim proactively using a P800 (if HMRC writes to you), an R40 form, or by filing a Self Assessment return. If you stopped work and are not returning to employment, a P50 can accelerate the refund. HMRC allows claims for overpaid tax going back four tax years.',
  },
  {
    q: 'What is an emergency tax code and why does it cause overpayment?',
    a: 'An emergency tax code (typically 1257L W1/M1, or 0T) is applied when HMRC does not have your up-to-date tax information — for example when you start a new job without a P45. It taxes you as if you earn the same amount every pay period without the

cat > src/app/resources/calculators/uk-us-cgt/page.tsx << 'ENDFILE'
import type { Metadata } from 'next';
import { PageShell, Section, Container, CrossBorderCgtEstimator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/uk-us-cgt';

export const metadata: Metadata = {
  title: 'UK vs US Capital Gains Tax Estimator — Cross-Border CGT Calculator',
  description:
    'The US and UK calculate capital gains differently. Estimate your UK CGT and US federal capital gains tax on the same disposal — property, shares, or other assets — and see whether the Foreign Tax Credit covers the overlap.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'Do I pay capital gains tax in both the UK and the US if I sell a UK property?',
    a: 'Potentially yes, but the Foreign Tax Credit usually prevents true double taxation. As a US citizen, you report the gain to the IRS on your Form 1040. You also report it to HMRC. The US generally allows a credit for UK CGT paid, which offsets your US federal capital gains tax on the same gain. However, differences in how each country measures the gain — cost basis, reliefs, currency movement — can mean residual tax arises in one jurisdiction.',
  },
  {
    q: 'Does the US Section 121 exclusion apply to a US citizen selling their UK home?',
    a: "The US Section 121 exclusion ($250,000 for single filers, $500,000 for married filing jointly) can apply to a US citizen's principal residence even if it is outside the US, provided they meet the 2-of-5-years ownership and use test. The UK's equivalent, Principal Private Residence Relief, operates separately and under different rules. Both can apply to the same sale, but they are calculated independently.",
  },
  {
    q: 'Why might I still owe US tax even after using the Foreign Tax Credit?',
    a: 'Several reasons. The UK and US may measure the gain differently — the US uses a USD cost basis, so currency movement since purchase can create a US gain even when the GBP gain is the same or smaller. The UK annual exempt amount does not apply for US purposes. The 3.8% NIIT cannot be offset by the FTC. And different timing of when tax is paid can affect the credit calculation.',
  },
  {
    q: 'What changed with UK CGT rates after October 2024?',
    a: 'The October 2024 UK Budget unified CGT rates for most assets. From October 30 2024, the rates became 18% (basic rate) and 24% (higher rate) for residential property and other assets. The annual exempt amount was cut to £3,000. This estimator uses the current 2025/26 rates.',
  },
  {
    q: 'Should I plan the timing of a disposal with both US and UK tax in mind?',
    a: 'Yes — timing can make a meaningful difference. The tax year mismatch (UK April–April vs US calendar year), your income level in the year of disposal, the USD/GBP rate, and whether you have FTC carryforwards from prior years all affect the combined bill. Planning a disposal 6–12 months ahead gives time to optimise.',
  },
];

export default function UkUsCgtPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="UK vs US Capital Gains Tax Estimator"
      answer="When a US citizen sells a UK property, shares, or other asset, both the UK and the US may tax the gain — but they measure it differently, apply different reliefs, and use different currency bases. This estimator calculates the indicative UK CGT and US federal capital gains tax on the same disposal, applies the Foreign Tax Credit offset, and shows whether a double-tax layer is likely after relief."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'UK vs US Capital Gains Estimator', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-07-29"
      faqs={faqs}
      ctaTitle="Planning a property or share disposal?"
      ctaIntro="The timing and structure of a disposal can meaningfully change the combined US and UK tax bill. Book a consultation before you sell and we will model the position across both systems."
    >
      <Section tone="white">
        <Container>
          <CrossBorderCgtEstimator />
          <CalculatorRelatedLinks {...calculatorLinks['uk-us-cgt']} />
        </Container>
      </Section>
    </PageShell>
  );
}
