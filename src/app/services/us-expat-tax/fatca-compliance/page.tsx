import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/fatca-compliance';

export const metadata: Metadata = {
  title: 'FATCA Compliance & Form 8938 for Americans in the UK',
  description:
    'FATCA requires US persons with foreign financial assets above set thresholds to file Form 8938 with their tax return. Learn what counts, how it differs from the FBAR, common mistakes, and how we handle it.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const faqs = [
  {
    q: 'What is FATCA, and what is Form 8938?',
    a: 'FATCA (the Foreign Account Tax Compliance Act) requires US persons to report specified foreign financial assets to the IRS on Form 8938, filed with your federal tax return, once the total value of those assets exceeds the relevant threshold. It reports assets, not just bank accounts, and is separate from the FBAR.',
  },
  {
    q: 'How is Form 8938 different from the FBAR?',
    a: 'They are separate filings. The FBAR (FinCEN Form 114) goes to the US Treasury and reports foreign accounts once their combined value tops $10,000. Form 8938 goes to the IRS with your tax return, reports a broader range of foreign financial assets, and has higher thresholds that vary by filing status and whether you live abroad. Many Americans in the UK have to file both.',
  },
  {
    q: 'What are the Form 8938 thresholds?',
    a: 'The reporting thresholds are higher than the FBAR\u2019s $10,000 and vary by your filing status and whether you live inside or outside the United States — they are notably higher for those living abroad. Because the exact figures depend on your circumstances and can change, it is worth confirming your specific threshold rather than assuming. We will tell you whether you cross it.',
  },
  {
    q: 'What counts as a specified foreign financial asset?',
    a: 'Broadly, foreign financial accounts plus other foreign financial assets held for investment — such as foreign stocks or securities not held in an account, interests in foreign entities, and certain foreign financial instruments. UK investment accounts, certain pensions and holdings can fall within scope.',
  },
  {
    q: 'Do I file Form 8938 instead of the FBAR, or as well?',
    a: 'Often as well. The two have different agencies, thresholds and definitions, and filing one does not satisfy the other. A large number of Americans in the UK are required to file both, which is why they should be prepared together and kept consistent.',
  },
  {
    q: 'I hold UK funds or an ISA — is there anything else to watch?',
    a: 'Possibly. Many UK pooled investments — including funds held within ISAs — can be treated as PFICs (passive foreign investment companies) for US tax, which carries its own complex reporting and punitive default tax treatment. This is a common and costly trap, and well worth reviewing with a specialist before you invest or file.',
  },
];

const fbarVs8938 = {
  columns: ['', 'Form 8938 (FATCA)', 'FBAR (FinCEN 114)'],
  highlightColumn: 1,
  rows: [
    { label: 'Filed with', values: ['IRS, with your tax return', 'US Treasury (FinCEN)'] },
    { label: 'Reports', values: ['Foreign financial assets', 'Foreign financial accounts'] },
    { label: 'Threshold', values: ['Higher; varies by status & residence', '$10,000 aggregate'] },
    { label: 'How it is filed', values: ['Attached to Form 1040', 'Electronically via BSA E-Filing'] },
    { label: 'Covers non-account assets', values: [true, false] },
    { label: 'Many UK-based Americans file', values: ['Often both', 'Often both'] },
  ],
};

export default function FatcaCompliance() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · FATCA"
      title="FATCA compliance and Form 8938"
      answer="FATCA (the Foreign Account Tax Compliance Act) requires US persons to report specified foreign financial assets to the IRS on Form 8938, filed with their tax return, once those assets exceed the relevant threshold. Form 8938 reports assets — not just bank accounts — and its thresholds are higher than the FBAR's and vary by filing status and whether you live abroad. Many Americans in the UK have to file both Form 8938 and the FBAR."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'FATCA Compliance', href: '/services/us-expat-tax/fatca-compliance' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-25"
      faqs={faqs}
      service={{
        url: URL,
        name: 'FATCA Compliance (Form 8938)',
        description: 'Preparation of Form 8938 for US persons in the UK, coordinated with FBAR reporting and reviewed for accuracy.',
        serviceType: 'Tax Compliance',
      }}
      ctaTitle="Not sure if you cross the FATCA threshold?"
      ctaIntro="The thresholds depend on your status and where you live — and UK funds can carry hidden traps. Book a free consultation and we'll tell you exactly what you need to file."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                <strong>FATCA</strong> — the Foreign Account Tax Compliance Act — is the rule behind{' '}
                <strong>Form 8938</strong>. If you are a US person and your <strong>specified foreign financial
                assets</strong> exceed the relevant threshold, you must report them to the IRS on Form 8938, filed{' '}
                <strong>with your tax return</strong>.
              </p>
              <p>
                The key thing that catches people out is the difference from the FBAR. The FBAR reports{' '}
                <strong>accounts</strong> to the US Treasury at a $10,000 threshold. Form 8938 reports a broader set
                of <strong>assets</strong> to the IRS, at <strong>higher thresholds that vary by your filing status
                and whether you live abroad</strong>. They overlap, but they are not the same — and many Americans in
                the UK have to file <strong>both</strong>.
              </p>
              <p>
                FATCA is also why UK banks and investment providers ask whether you are a US person: they report
                US-owned accounts under the same law. So even accounts you think of as purely &ldquo;British&rdquo;
                are visible to the US system.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="FATCA / Form 8938 at a glance"
                facts={[
                  { label: 'Form', value: 'Form 8938' },
                  { label: 'Filed with', value: 'IRS, with your return' },
                  { label: 'Reports', value: 'Foreign financial assets' },
                  { label: 'Threshold', value: 'Higher; varies by status' },
                  { label: 'vs FBAR', value: 'Often file both' },
                  { label: 'Watch', value: 'UK funds / PFIC traps' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who needs to think about FATCA"
        items={[
          'Americans in the UK whose foreign assets exceed the Form 8938 threshold',
          'Dual citizens with UK investments, pensions or securities',
          'Green card holders holding UK financial assets',
          'Anyone already filing an FBAR with a larger asset base',
          'People holding UK funds or ISAs (potential PFIC exposure)',
          'Those unsure whether their UK holdings are reportable assets',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">FATCA (Form 8938) vs the FBAR</h2>
            <p>
              These are the two reports Americans abroad most often confuse — and frequently must file together.
              They serve different agencies, use different thresholds, and define what is reportable differently.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <ComparisonTable data={fbarVs8938} />
          </div>
          <div className="mx-auto mt-6 max-w-prose text-[15px] leading-relaxed text-muted">
            <p>
              See the FBAR side in full on our{' '}
              <Link href="/services/us-expat-tax/fbar-filing" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">FBAR filing guide</Link>, or{' '}
              <Link href="/resources/calculators/fbar-checker" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">check your FBAR position</Link>{' '}
              in under a minute.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The usual errors: assuming filing the <strong>FBAR covers FATCA</strong> (or vice versa) when both may
              be required; missing assets that are not held in an &ldquo;account&rdquo; — such as directly held
              foreign securities or interests in entities; applying the <strong>wrong threshold</strong> for your
              residence status; and overlooking that many <strong>UK funds and ISAs can be PFICs</strong>, which
              brings separate, punitive US reporting.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">The UK fund / PFIC trap</h2>
            <p>
              This deserves a specific warning. Many ordinary UK pooled investments — including funds held inside an{' '}
              <strong>ISA</strong> — can be treated as <strong>PFICs</strong> (passive foreign investment companies)
              for US tax. PFICs carry complex reporting and a punitive default tax treatment that can erode returns.
              If you hold UK funds, or are about to, this is worth reviewing with a specialist <em>before</em> you
              file or invest — not after.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="FATCA and FBAR, prepared together"
        steps={[
          { title: 'Map your assets', description: 'We identify every foreign financial asset and account, and whether you cross the relevant thresholds.' },
          { title: 'Check for traps', description: 'We flag PFIC exposure in UK funds and ISAs, and any assets easy to overlook.' },
          { title: 'Prepare', description: 'We prepare Form 8938 with your return and the FBAR in parallel, kept fully consistent.' },
          { title: 'File & review', description: 'Filed by a US specialist and independently reviewed, with a clear record of what was reported.' },
        ]}
      />

      <RelatedLinks
        title="Further reading"
        links={[
          { label: 'Why is my ISA a problem for US taxes?', href: '/resources/blog/why-is-my-isa-a-problem-for-us-taxes', description: 'PFIC rules on UK investments' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing', description: 'The companion foreign-account report' },
          { label: 'FBAR Checker', href: '/resources/calculators/fbar-checker', description: 'Free tool: do you need to file?' },
          { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns', description: 'Federal filing for Americans abroad' },
          { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing', description: 'Behind on FBAR/FATCA? Catch up safely' },
          { label: 'US Citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'How we help Americans abroad' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen tax guidance' },
        ]}
      />
    </PageShell>
  );
}
