import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import {
  PageShell, ProseBlock, WhoItsFor, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import type { ComparisonTableData } from '@/lib/types';

const url = '/resources/compare/streamlined-filing-vs-delinquent-fbar';

export const metadata: Metadata = {
  title: 'Streamlined Filing vs Late FBAR: Which Route?',
  description:
    'Streamlined Filing or simply filing late FBARs with reasonable cause? The IRS removed the Delinquent FBAR Submission Procedures page in July 2026. Which route fits an American in the UK.',
  alternates: { canonical: url },
};

const faqs = [
  {
    q: 'What is the difference between Streamlined Filing and filing late FBARs on their own?',
    a: 'Streamlined Filing is for taxpayers who need to correct unreported income or missed returns and can certify non-willful conduct; a qualifying submission carries no FBAR or late-filing penalties. Filing late FBARs on their own, with the reason for late filing and a reasonable-cause record, is for taxpayers who reported and paid tax on all the income and only missed the report. The IRS removed its published Delinquent FBAR Submission Procedures page in early July 2026, so that second route now rests on reasonable cause rather than a written safe harbour.',
  },
  {
    q: 'Which one do I use if I reported all my income but forgot the FBAR?',
    a: 'That situation typically points to filing the late FBARs through FinCEN with the reason for late filing, and keeping a dated reasonable-cause note. A penalty is not automatic; the IRS assesses FBAR penalties only after an examination and its manual says a non-willful penalty should not be imposed where there was reasonable cause and accurate late FBARs are filed.',
  },
  {
    q: 'Which one do I use if I never filed US returns at all?',
    a: 'If you have unfiled returns or unreported income, the Streamlined Filing compliance procedures are usually the relevant route, provided you can certify non-willful conduct.',
  },
  {
    q: 'Do both require a non-willful certification?',
    a: 'Streamlined Filing requires a signed non-willful certification (Form 14653). Filing late FBARs on their own asks only for the reason for late filing on the FinCEN form, but you should keep a fuller reasonable-cause note on file in case the IRS asks.',
  },
];

const comparison: ComparisonTableData = {
  columns: ['Streamlined Filing', 'Late FBAR with reasonable cause'],
  rows: [
    { label: 'For unreported income', values: [true, false] },
    { label: 'For missed FBARs only', values: [false, true] },
    { label: 'Amended / back tax returns involved', values: [true, false] },
    { label: 'Non-willful certification', values: [true, false] },
    { label: 'Best when all income was already reported', values: [false, true] },
    { label: 'Written IRS no-penalty assurance', values: [true, false] },
  ],
};

export default function StreamlinedVsDelinquentPage() {
  const author = authors.find((a) => a.slug === 'sam-h')!;
  const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;
  return (
    <PageShell
      url={url}
      eyebrow="Comparison"
      title="Streamlined Filing vs filing late FBARs on their own"
      answer="Two routes bring a missed FBAR back into compliance. Streamlined Filing corrects unreported income and missed returns with a non-willful certification; filing late FBARs on their own, with reasonable cause, is for people who reported all their income but missed the report. The IRS removed its Delinquent FBAR Submission Procedures page from irs.gov in early July 2026, so the second route no longer carries a written no-penalty assurance. The deciding question is whether any income was left unreported."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Compare', href: '/resources/compare' },
        { label: 'Streamlined vs Delinquent FBAR', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      dateModified="2026-10-18"
      faqs={faqs}
      ctaTitle="Not sure which catch-up route fits?"
      ctaIntro="We assess your history and recommend the safest compliant route back."
    >
      <ProseBlock eyebrow="The short answer" title="Two catch-up routes for two different gaps">
        <p className="speakable">
          Both routes bring you back into compliance, but they solve different problems.{' '}
          <Link href="/resources/glossary/streamlined-filing">Streamlined Filing</Link> is built for
          under-reported income and missed returns. Filing a{' '}
          <Link href="/resources/glossary/delinquent-fbar">delinquent FBAR</Link> on its own, with the reason for
          late filing and a reasonable-cause record, is for the narrower case where income was fully reported but
          the foreign-account report was overlooked. Until mid-2026 the IRS published Delinquent FBAR Submission
          Procedures promising no penalty in that case; that page has been withdrawn, and the IRS now says a late
          FBAR may attract a penalty depending on the facts.
        </p>
      </ProseBlock>

      <ComparisonTable data={comparison} />

      <ProseBlock title="How to tell which one applies">
        <p>
          The deciding question is usually simple: was any income left off your US returns? If yes, and you can
          certify the omission was <Link href="/resources/glossary/willful-vs-non-willful">non-willful</Link>,
          Streamlined Filing is generally the route. If your income was always reported and paid, and the only
          thing missing was the <Link href="/resources/glossary/fbar">FBAR</Link>, filing the late reports with a
          documented reasonable cause is typically the proportionate fix — see our{' '}
          <Link href="/resources/guides/delinquent-fbar">delinquent FBAR guide</Link> for the current position.
        </p>
        <p>
          Because the facts matter, we look at your full history before recommending a path — the wrong route can
          create more work or expose you unnecessarily.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="This comparison helps if you"
        items={[
          'Have missed US filings while living in the UK',
          'Are unsure whether your situation involves unreported income',
          'Filed returns but never filed an FBAR',
          'Want to understand your options before speaking to an advisor',
        ]}
      />

      <KeyFacts
        title="At a glance"
        facts={[
          { label: 'Streamlined Filing', value: 'For unreported income + missed returns' },
          { label: 'Late FBAR with reasonable cause', value: 'For missed FBARs where income was reported' },
          { label: 'Deciding factor', value: 'Was any income unreported?' },
          { label: 'Certification', value: 'Streamlined requires a non-willful statement' },
        ]}
      />

      <RelatedLinks
        title="Related resources"
        links={[
          { label: 'Streamlined Filing service', href: '/services/us-expat-tax/streamlined-filing', description: 'Catch up on missed years under the IRS procedures' },
          { label: 'Delinquent FBAR guide', href: '/resources/guides/delinquent-fbar', description: 'How to file late FBARs after the July 2026 change' },
          { label: 'Streamlined eligibility checker', href: '/resources/calculators/streamlined-eligibility', description: 'Free tool: are you eligible?' },
          { label: 'Streamlined Filing (glossary)', href: '/resources/glossary/streamlined-filing', description: 'What the programme is' },
          { label: 'US Tax Returns hub', href: '/services/us-expat-tax/us-tax-returns/hub', description: 'The complete filing guide, in order' },
          { label: 'All comparisons', href: '/resources/compare', description: 'Every side-by-side comparison in one place' },
        ]}
      />
    </PageShell>
  );
}
