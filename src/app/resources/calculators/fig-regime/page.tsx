import type { Metadata } from 'next';
import { PageShell, Section, Container, FigRegimeChecker } from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/fig-regime';

export const metadata: Metadata = {
  title: '4-Year FIG Regime Checker — UK Foreign Income & Gains Relief',
  description:
    'Free checker for the UK\u2019s 4-year Foreign Income & Gains (FIG) regime that replaced the remittance basis on 6 April 2025. See if you qualify for relief on foreign income and gains as a new UK resident.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'kristina')!;

const faqs = [
  {
    q: 'What replaced the remittance basis?',
    a: 'On 6 April 2025 the remittance basis and the domicile-based non-dom regime were abolished and replaced by the 4-year Foreign Income & Gains (FIG) regime. It is a residence-based system: qualifying new residents can claim relief on foreign income and gains for their first four years of UK residence, regardless of whether the money is brought into the UK.',
  },
  {
    q: 'Who qualifies for the FIG regime?',
    a: 'You must be UK tax resident and must not have been UK tax resident in the 10 consecutive tax years immediately before you arrived. If you meet that, you can claim relief for any of your first four years of UK residence. Unlike the old non-dom rules, citizenship and domicile are irrelevant — even returning British citizens can qualify after 10 years abroad.',
  },
  {
    q: 'What does claiming the FIG regime cost you?',
    a: 'For any year you claim, you lose your income tax personal allowance and your capital gains tax annual exempt amount. You must also actively claim each year and report the relevant foreign income and gains. Because of this trade-off, claiming is not automatically worthwhile — it depends on how much foreign income and gains you have that year.',
  },
  {
    q: 'I arrived in the UK before April 2025 — can I still use it?',
    a: 'Possibly. If your first four years of UK residence (after the required 10-year absence) began before 6 April 2025, you can use the FIG regime for whatever years remain in that four-year window from 2025/26 onward. So someone who arrived in 2023/24 may still have qualifying years left.',
  },
];

export default function FigRegimePage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="4-Year FIG Regime Checker"
      answer="The Foreign Income & Gains (FIG) regime replaced the remittance basis on 6 April 2025. Qualifying new UK residents — those not UK-resident for the previous 10 years — can claim relief on foreign income and gains for their first four years. Answer three questions for an indicative eligibility check."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: '4-Year FIG Regime Checker', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="New to the UK with foreign income?"
      ctaIntro="Whether to claim the FIG regime — and how it interacts with your US filing if you're American — is genuinely fact-specific. We model it across both systems."
    >
      <Section tone="white">
        <Container>
          <FigRegimeChecker />
        </Container>
      </Section>
    </PageShell>
  );
}
