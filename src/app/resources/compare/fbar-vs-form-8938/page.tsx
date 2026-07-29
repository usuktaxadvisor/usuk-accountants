import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import {
  PageShell, ProseBlock, WhoItsFor, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import type { ComparisonTableData } from '@/lib/types';

const url = '/resources/compare/fbar-vs-form-8938';

export const metadata: Metadata = {
  title: 'FBAR vs Form 8938: What Is the Difference? | US UK Accountants',
  description:
    'FBAR and Form 8938 are two separate US foreign-account reports. Learn who files each, how they differ, and why many Americans in the UK must file both.',
  alternates: { canonical: url },
};

const faqs = [
  {
    q: 'Do I have to file both FBAR and Form 8938?',
    a: 'Often, yes. They are separate reports filed with different agencies. Many Americans in the UK meet the trigger for both, so filing one does not remove the obligation to file the other when its own conditions are met.',
  },
  {
    q: 'What is the core difference between FBAR and Form 8938?',
    a: 'The FBAR (FinCEN Form 114) reports foreign financial accounts to the Treasury. Form 8938 reports specified foreign financial assets to the IRS with your tax return. They overlap but cover different assets and are filed separately.',
  },
  {
    q: 'Which agency receives each form?',
    a: 'The FBAR is filed electronically with FinCEN through the BSA E-Filing system. Form 8938 is attached to your Form 1040 and filed with the IRS.',
  },
  {
    q: 'Does filing FBAR satisfy Form 8938?',
    a: 'No. The two obligations are independent. Reporting an account on the FBAR does not remove the requirement to also report it on Form 8938 if the Form 8938 conditions apply, and vice versa.',
  },
];

const comparison: ComparisonTableData = {
  columns: ['', 'FBAR (FinCEN 114)', 'Form 8938'],
  rows: [
    { label: 'Filed with', values: ['FinCEN (Treasury)', 'IRS (with Form 1040)'] },
    { label: 'What it reports', values: ['Foreign financial accounts', 'Specified foreign financial assets'] },
    { label: 'Filed separately from tax return', values: [true, false] },
    { label: 'Covers non-account assets', values: [false, true] },
    { label: 'Common for Americans in the UK', values: [true, true] },
  ],
};

export default function FbarVsForm8938Page() {
  const author = authors.find((a) => a.slug === 'sam-h')!;
  const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;
  return (
    <PageShell
      about={[{"name":"FBAR (FinCEN Form 114)","url":"/resources/glossary/fbar"},{"name":"Form 8938 (Statement of Specified Foreign Financial Assets)","url":"/resources/glossary/form-8938"}]}
      mentions={[{"name":"Form 8938","url":"/resources/forms/form-8938"},{"name":"FATCA","url":"/resources/glossary/fatca"}]}
      url={url}
      eyebrow="Comparison"
      title="FBAR vs Form 8938"
      answer="FBAR and Form 8938 are two separate US foreign-asset reports. The FBAR reports foreign financial accounts to FinCEN; Form 8938 reports specified foreign financial assets to the IRS with your tax return. They overlap, but filing one does not satisfy the other, and many Americans in the UK must file both."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Compare', href: '/resources' },
        { label: 'FBAR vs Form 8938', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Not sure which reports apply to you?"
      ctaIntro="We work out your full US filing picture — including FBAR and Form 8938 — so nothing is missed."
    >
      <ProseBlock eyebrow="The short answer" title="Two reports, two agencies, one taxpayer">
        <p className="speakable">
          The <Link href="/resources/glossary/fbar">FBAR</Link> and{' '}
          <Link href="/resources/glossary/form-8938">Form 8938</Link> are frequently confused because both
          concern foreign holdings. They are, however, entirely separate filings with different rules, different
          scopes and different destinations. Understanding the split is the first step to staying compliant.
        </p>
      </ProseBlock>

      <ComparisonTable data={comparison} />

      <ProseBlock title="How the two reports differ in practice">
        <p>
          The FBAR is an information report sent to FinCEN about foreign <em>accounts</em> — think current
          accounts, savings, and certain pooled or pension-style arrangements. Form 8938 is broader in the
          <em> types</em> of asset it captures (it can reach beyond accounts to certain other financial assets),
          and it travels with your <Link href="/resources/glossary/us-tax-return-1040">Form 1040</Link> to the IRS.
        </p>
        <p>
          Because the two use different definitions and are read by different agencies, the same account can appear
          on both, on one, or on neither, depending on your circumstances. That is why we assess each obligation
          independently rather than assuming one covers the other.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="You may need to look at both if you"
        items={[
          'Are a US person living in the UK with UK bank, savings or investment accounts',
          'Hold UK financial assets alongside everyday accounts',
          'Have previously filed only one of the two reports',
          'Are catching up through Streamlined Filing or the Delinquent FBAR procedures',
        ]}
      />

      <KeyFacts
        title="At a glance"
        facts={[
          { label: 'FBAR filed with', value: 'FinCEN (Treasury), via BSA E-Filing' },
          { label: 'Form 8938 filed with', value: 'IRS, attached to Form 1040' },
          { label: 'Relationship', value: 'Independent — one does not satisfy the other' },
          { label: 'Typical UK situation', value: 'Both often apply' },
        ]}
      />

      <RelatedLinks
        title="Related resources"
        links={[
          { label: 'FBAR (glossary)', href: '/resources/glossary/fbar', description: 'What the FBAR is and who files it' },
          { label: 'Form 8938 (glossary)', href: '/resources/glossary/form-8938', description: 'Specified foreign financial assets, explained' },
          { label: 'FBAR Filing service', href: '/services/us-expat-tax/fbar-filing', description: 'How we handle FBARs for UK-based Americans' },
          { label: 'FBAR Checker', href: '/resources/calculators/fbar-checker', description: 'Free tool: do you need to file?' },
          { label: 'US Tax Returns hub', href: '/services/us-expat-tax/us-tax-returns/hub', description: 'The complete filing guide, in order' },
        ]}
      />
    </PageShell>
  );
}
