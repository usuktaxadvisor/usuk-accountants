import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, InvestmentBand, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/streamlined-filing';

export const metadata: Metadata = {
  title: 'IRS Streamlined Filing for Americans in the UK — Catch Up Penalty-Free',
  description:
    "Behind on US taxes? The IRS Streamlined Filing Compliance Procedures let non-willful Americans abroad catch up — typically 3 years of returns and 6 years of FBARs — without penalties. We handle the whole process.",
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const faqs = [
  {
    q: 'Who qualifies for the Streamlined Filing Compliance Procedures?',
    a: 'US taxpayers whose failure to file was non-willful — meaning a genuine misunderstanding rather than deliberate evasion. Americans living abroad use the Streamlined Foreign Offshore Procedures, which carry no penalty when filed correctly and the eligibility conditions are met.',
  },
  {
    q: 'How many years do I need to file under Streamlined?',
    a: 'Typically the last three years of US federal tax returns and the last six years of FBARs (FinCEN Form 114), plus a signed statement certifying that your previous non-compliance was non-willful.',
  },
  {
    q: 'Will I have to pay penalties?',
    a: 'For Americans living abroad who qualify under the Streamlined Foreign Offshore Procedures, the penalty is waived — you pay any tax due plus interest, but not the failure-to-file or FBAR penalties that would otherwise apply. Getting the non-willful certification right is essential.',
  },
  {
    q: 'What happens if I keep ignoring it?',
    a: 'The Streamlined programme is a voluntary disclosure route and may not stay open, or available to you, indefinitely. If the IRS contacts you first, you generally lose access to it. Coming forward proactively is almost always the better position — and the sooner the better.',
  },
  {
    q: 'Can you handle the whole Streamlined process for me?',
    a: 'Yes. We assess your eligibility, prepare the required returns and FBARs, draft the non-willful certification, and file the complete package — handled by a US specialist and independently reviewed. Most clients find it far less daunting than expected.',
  },
];

export default function StreamlinedFiling() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · Streamlined Filing"
      title="Catch up on US taxes — without penalties"
      answer="The IRS Streamlined Filing Compliance Procedures let Americans abroad whose non-compliance was non-willful catch up penalty-free — typically three years of tax returns and six years of FBARs, plus a non-willful certification. It is the standard route back into compliance, and we handle the entire process for you."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-20"
      faqs={faqs}
      service={{
        url: URL,
        name: 'IRS Streamlined Filing Compliance Procedures',
        description: 'Penalty-free US tax catch-up for non-willful Americans abroad — returns, FBARs and non-willful certification.',
        serviceType: 'Tax Compliance',
      }}
      ctaTitle="Come into compliance with confidence"
      ctaIntro="Book a free, confidential consultation. We'll tell you honestly whether Streamlined is right for you and what it involves."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                If you&rsquo;ve realised you should have been filing US taxes from the UK and haven&rsquo;t, you are
                not alone — and you are not in trouble yet. Thousands of Americans abroad simply didn&rsquo;t know
                the rules. The IRS created the <strong>Streamlined Filing Compliance Procedures</strong> for
                exactly this situation.
              </p>
              <p>
                For people living outside the US whose oversight was genuine, the programme lets you get current
                <strong> without the penalties</strong> that would otherwise apply — and put the worry behind you
                for good. The key is doing it properly: the right years, the right forms, and a well-drafted
                non-willful certification.
              </p>
              <p>
                <strong>We handle Streamlined cases regularly</strong> and will give you a straight answer about
                whether it fits your situation before you commit to anything.
              </p>
            </div>
            <KeyFacts
              title="Streamlined at a glance"
              facts={[
                { label: 'Who', value: 'Non-willful US persons abroad' },
                { label: 'Tax returns', value: 'Last 3 years' },
                { label: 'FBARs', value: 'Last 6 years' },
                { label: 'Certification', value: 'Non-willful statement' },
                { label: 'Penalty (foreign)', value: 'Waived if eligible' },
                { label: 'Best time to act', value: 'Before the IRS contacts you' },
              ]}
            />
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="This is for you if…"
        items={[
          'You\u2019re a US citizen or green card holder living in the UK',
          'You haven\u2019t filed US returns for several years',
          'Your non-compliance was a genuine misunderstanding',
          'You want to fix it before the IRS reaches you first',
          'You have foreign bank accounts you haven\u2019t reported',
          'You want it handled discreetly and correctly',
        ]}
      />

      <ProcessSteps
        title="How we bring you into compliance"
        steps={[
          { title: 'Eligibility review', description: 'A confidential assessment of whether Streamlined fits and what it will involve.' },
          { title: 'Prepare the package', description: 'Three years of returns, six years of FBARs, and your non-willful certification.' },
          { title: 'Independent review', description: 'Every file checked by a second US specialist before anything is submitted.' },
          { title: 'File & resolve', description: 'We submit the complete package and guide you through to a clean, current status.' },
        ]}
      />

      <InvestmentBand
        fromLabel="Fixed-package pricing, quoted upfront"
        points={[
          'Free, confidential eligibility consultation',
          'One fixed price for the full Streamlined package',
          'Returns, FBARs and certification included',
          'Specialist preparation with independent review',
        ]}
        note="Because Streamlined is a defined scope, we quote it as a single fixed fee after your free consultation — no open-ended billing."
      />

      <RelatedLinks
        title="Explore related areas"
        links={[
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'The full picture of US filing from abroad.' },
          { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing', description: 'Reporting foreign accounts over $10,000.' },
          { label: 'Americans in the UK', href: '/who-we-help/americans-in-the-uk', description: 'Built for US citizens living in the UK.' },
        ]}
      />
    </PageShell>
  );
}
