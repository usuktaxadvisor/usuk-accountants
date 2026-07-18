import type { Metadata } from 'next';
import { PageShell, Section, Container, SelfAssessmentPenaltyCalculator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/self-assessment-deadline';

export const metadata: Metadata = {
  title: 'Self Assessment Deadline & Penalty Calculator — HMRC Late Filing',
  description:
    'Free UK Self Assessment tool: see your filing and payment deadlines and estimate HMRC late-filing penalties — the £200 fixed penalty, daily penalties, and the 6 and 12-month charges.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const faqs = [
  {
    q: 'When is the Self Assessment deadline?',
    a: 'For online returns, the deadline is 31 January following the end of the tax year (which runs to 5 April). Paper returns are due earlier, by 31 October. Any tax owed is also due by 31 January, with a possible second payment on account on 31 July.',
  },
  {
    q: 'What is the penalty for filing Self Assessment late?',
    a: 'You get an automatic £200 penalty the moment you miss the deadline, even if you owe no tax or have nothing to pay. After 3 months, daily penalties of £10 apply for up to 90 days (a maximum of £900). After 6 months and again after 12 months, a further penalty of the greater of 5% of the tax due or £300 is charged.',
  },
  {
    q: 'Are late-payment penalties different from late-filing penalties?',
    a: 'Yes — they are separate. Late-filing penalties apply for submitting the return late; late-payment penalties (broadly 5% of the unpaid tax at 30 days, 6 months and 12 months, plus interest) apply for paying the tax late. You can be charged both.',
  },
  {
    q: 'Can HMRC penalties be cancelled?',
    a: 'Sometimes. If you have a reasonable excuse for filing or paying late, HMRC may cancel or reduce the penalty on appeal. What counts as a reasonable excuse is fact-specific, so it is worth getting advice before assuming you must pay.',
  },
];

export default function SelfAssessmentDeadlinePage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="Self Assessment Deadline & Penalty"
      answer="Find your UK Self Assessment deadlines and estimate HMRC's late-filing penalties. The online deadline is 31 January, and missing it triggers an immediate £200 penalty — then daily charges after 3 months and percentage penalties at 6 and 12 months. Pick your tax year and how late you'll be to see the figures."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'Self Assessment Deadline & Penalty', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Behind on Self Assessment?"
      ctaIntro="We file cross-border Self Assessment returns and can often reduce penalties with a reasonable-excuse claim."
    >
      <Section tone="white">
        <Container>
          <SelfAssessmentPenaltyCalculator />
          <CalculatorRelatedLinks {...calculatorLinks['self-assessment-deadline']} />
        </Container>
      </Section>
    </PageShell>
  );
}
