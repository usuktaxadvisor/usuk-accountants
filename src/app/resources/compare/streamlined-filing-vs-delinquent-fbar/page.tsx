import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import {
  PageShell, ProseBlock, WhoItsFor, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import type { ComparisonTableData } from '@/lib/types';

const url = '/resources/compare/streamlined-filing-vs-delinquent-fbar';

export const metadata: Metadata = {
  title: 'Streamlined Filing vs Delinquent FBAR Procedures | US UK Accountants',
  description:
    'Streamlined Filing and the Delinquent FBAR submission procedures are two different IRS catch-up routes. Learn which fits your situation as an American in the UK.',
  alternates: { canonical: url },
};

const faqs = [
  {
    q: 'What is the difference between Streamlined Filing and the Delinquent FBAR procedures?',
    a: 'Streamlined Filing is for taxpayers who need to correct both unreported income and missed information returns and can certify their conduct was non-willful. The Delinquent FBAR procedures are for taxpayers who reported and paid tax on all income but simply missed the FBAR itself.',
  },
  {
    q: 'Which one do I use if I reported all my income but forgot the FBAR?',
    a: 'That situation typically points to the Delinquent FBAR submission procedures, because the only gap is the missing foreign-account report rather than unreported income.',
  },
  {
    q: 'Which one do I use if I never filed US returns at all?',
    a: 'If you have unfiled returns or unreported income, the Streamlined Filing compliance procedures are usually the relevant route, provided you can certify non-willful conduct.',
  },
  {
    q: 'Do both require a non-willful certification?',
    a: 'Streamlined Filing requires a signed non-willful certification. The Delinquent FBAR procedures ask for a reason for filing late and are used when there is no unreported income and no examination underway.',
  },
];

const comparison: ComparisonTableData = {
  columns: ['', 'Streamlined Filing', 'Delinquent FBAR'],
  rows: [
    { label: 'For unreported income', values: [true, false] },
    { label: 'For missed FBARs only', values: [false, true] },
    { label: 'Amended / back tax returns involved', values: [true, false] },
    { label: 'Non-willful certification', values: [true, false] },
    { label: 'Best when all income was already reported', values: [false, true] },
  ],
};

export default function StreamlinedVsDelinquentPage() {
  const author = authors.find((a) => a.slug === 'sam-h')!;
  const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;
  return (
    <PageShell
      about={[{"name":"Streamlined Filing Compliance Procedures","url":"/resources/glossary/streamlined-filing"},{"name":"Delinquent FBAR Submission Procedures","url":"/resources/glossary/delinquent-fbar"}]}
      mentions={[{"name":"FBAR","url":"/resources/glossary/fbar"},{"name":"Form 14653","url":"/resources/glossary/form-14653"}]}
      url={url}
      eyebrow="Comparison"
      title="Streamlined Filing vs Delinquent FBAR Procedures"
      answer="Streamlined Filing and the Delinquent FBAR submission procedures are two separate IRS catch-up routes. Streamlined Filing corrects unreported income and missed returns with a non-willful certification; the Delinquent FBAR procedures are for people who reported all their income but simply missed the FBAR. The right route depends on whether income was left unreported."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Compare', href: '/resources' },
        { label: 'Streamlined vs Delinquent FBAR', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Not sure which catch-up route fits?"
      ctaIntro="We assess your history and recommend the safest compliant route back."
    >
      <ProseBlock eyebrow="The short answer" title="Two catch-up routes for two different gaps">
        <p className="speakable">
          Both routes bring you back into compliance, but they solve different problems.{' '}
          <Link href="/resources/glossary/streamlined-filing">Streamlined Filing</Link> is built for
          under-reported income and missed returns. The{' '}
          <Link href="/resources/glossary/delinquent-fbar">Delinquent FBAR</Link> procedures exist for the
          narrower case where income was fully reported but the foreign-account report was overlooked.
        </p>
      </ProseBlock>

      <ComparisonTable data={comparison} />

      <ProseBlock title="How to tell which one applies">
        <p>
          The deciding question is usually simple: was any income left off your US returns? If yes, and you can
          certify the omission was <Link href="/resources/glossary/willful-vs-non-willful">non-willful</Link>,
          Streamlined Filing is generally the route. If your income was always reported and paid, and the only
          thing missing was the <Link href="/resources/glossary/fbar">FBAR</Link>, the Delinquent FBAR procedures
          are typically the cleaner fit.
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
          { label: 'Delinquent FBAR', value: 'For missed FBARs where income was reported' },
          { label: 'Deciding factor', value: 'Was any income unreported?' },
          { label: 'Certification', value: 'Streamlined requires a non-willful statement' },
        ]}
      />

      <RelatedLinks
        title="Related resources"
        links={[
          { label: 'Streamlined Filing service', href: '/services/us-expat-tax/streamlined-filing', description: 'Catch up on missed years penalty-free' },
          { label: 'Delinquent FBAR guide', href: '/resources/guides/delinquent-fbar', description: 'The route back when only the FBAR was missed' },
          { label: 'Streamlined eligibility checker', href: '/resources/calculators/streamlined-eligibility', description: 'Free tool: are you eligible?' },
          { label: 'Streamlined Filing (glossary)', href: '/resources/glossary/streamlined-filing', description: 'What the programme is' },
          { label: 'US Tax Returns hub', href: '/services/us-expat-tax/us-tax-returns/hub', description: 'The complete filing guide, in order' },
        ]}
      />
    </PageShell>
  );
}
