import type { Metadata } from 'next';
import { PageShell, Section, Container, LateFilingPenaltyEstimator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/late-filing-penalty';

export const metadata: Metadata = {
  title: 'US Late-Filing Penalty Estimator — Failure-to-File and Failure-to-Pay',
  description: 'Estimate the headline IRS penalties on a late US tax return: the 5% per month failure-to-file penalty and 0.5% per month failure-to-pay penalty, both capped at 25%. See how Streamlined and delinquent-FBAR routes can remove them.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const faqs = [
  { q: 'What is the penalty for filing a US tax return late?', a: 'The main civil penalty is the failure-to-file penalty: 5% of unpaid tax per month or part-month late, capped at 25%. A separate failure-to-pay penalty of 0.5% per month, also capped at 25%, applies to tax paid late. In months where both apply, the combined charge is 5% per month for the first five months, then 0.5% per month. Interest accrues separately.' },
  { q: 'Do Americans abroad get extra time to file?', a: 'Yes. US citizens and residents living outside the United States receive an automatic extension to 15 June, and can request a further extension to 15 October. Any tax owed still accrues interest from the original April deadline.' },
  { q: 'Can late-filing penalties be reduced or removed?', a: 'Often, yes. Penalty relief may be available through First-Time Abate or reasonable-cause arguments. For expats who fell behind non-wilfully, the Streamlined Filing Compliance Procedures can remove penalties entirely. The delinquent-FBAR route may also carry no penalty where tax returns were otherwise correct.' },
  { q: 'What if my US tax is zero after reliefs?', a: 'The failure-to-file and failure-to-pay penalties are a percentage of unpaid tax. If the Foreign Tax Credit or FEIE reduces your US tax to zero, these percentage penalties are generally zero too. The return must still be filed, and separate flat-rate penalties apply to missed information returns.' },
  { q: 'How accurate is this estimator?', a: 'It gives an indicative maximum using headline statutory rates. It excludes interest, the reduced failure-to-pay rate once an instalment agreement is in place, and any penalty abatement. It is educational, not a penalty determination.' },
];

export default function LateFilingPenaltyPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="US Late-Filing Penalty Estimator"
      answer="Filed your US return late, or not yet at all? The IRS charges a failure-to-file penalty of 5% of unpaid tax per month (capped at 25%) and a failure-to-pay penalty of 0.5% per month (also capped at 25%). This tool gives an indicative maximum — and shows why the penalty is often zero when reliefs cancel your US tax, and how catch-up routes can remove them entirely."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'US Late-Filing Penalty Estimator', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-07-28"
      faqs={faqs}
      ctaTitle="Facing a penalty notice — or worried about one?"
      ctaIntro="Late-filing penalties can often be reduced or removed entirely through the right catch-up route or a reasonable-cause claim. Book a consultation and we will map the safest, lowest-cost way back into compliance."
    >
      <Section tone="white">
        <Container>
          <LateFilingPenaltyEstimator />
          <CalculatorRelatedLinks {...(calculatorLinks['late-filing-penalty'] ?? {})} />
        </Container>
      </Section>
    </PageShell>
  );
}
