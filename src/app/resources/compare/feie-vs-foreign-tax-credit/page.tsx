import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import {
  PageShell, ProseBlock, WhoItsFor, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import type { ComparisonTableData } from '@/lib/types';

const url = '/resources/compare/feie-vs-foreign-tax-credit';

export const metadata: Metadata = {
  title: 'FEIE vs Foreign Tax Credit: Which Should You Use? | US UK Accountants',
  description:
    'The Foreign Earned Income Exclusion and the Foreign Tax Credit are two different ways to avoid double taxation. Learn how each mechanism works, who each suits, and how they interact for Americans in the UK.',
  alternates: { canonical: url },
};

const faqs = [
  {
    q: 'Can I use both the FEIE and the Foreign Tax Credit?',
    a: 'You can use both in the same return, but not on the same income. Income excluded under the FEIE cannot also generate a foreign tax credit. Many people apply the exclusion to some income and the credit to the rest, which is why the interaction needs modelling.',
  },
  {
    q: 'What is the core difference between the FEIE and the Foreign Tax Credit?',
    a: 'The FEIE removes qualifying foreign earned income from US taxation entirely. The Foreign Tax Credit instead reduces your US tax dollar-for-dollar by the foreign tax you have already paid. One excludes income; the other credits tax.',
  },
  {
    q: 'Which is better for Americans living in the UK?',
    a: 'It depends on your income mix and the UK tax you pay, but because the UK is a relatively high-tax country, the Foreign Tax Credit is frequently the stronger choice for many people. The right answer is specific to your circumstances and should be modelled.',
  },
  {
    q: 'Does choosing the FEIE affect me in future years?',
    a: 'It can. The exclusion involves an election that carries consequences if later revoked, and switching between mechanisms is not always free of restrictions. This is one reason the decision is best made with the whole picture in view.',
  },
];

const comparison: ComparisonTableData = {
  columns: ['', 'FEIE (Form 2555)', 'Foreign Tax Credit (Form 1116)'],
  rows: [
    { label: 'How it works', values: ['Excludes qualifying foreign earned income', 'Credits foreign tax against US tax'] },
    { label: 'Applies to', values: ['Foreign earned income (wages, self-employment)', 'Most categories of foreign-taxed income'] },
    { label: 'Best where foreign tax is high', values: [false, true] },
    { label: 'Best where foreign tax is low', values: [true, false] },
    { label: 'Can create carryover', values: [false, true] },
    { label: 'Involves a formal election', values: [true, false] },
    { label: 'Common for Americans in the UK', values: [true, true] },
  ],
};

export default function FeieVsForeignTaxCreditPage() {
  const author = authors.find((a) => a.slug === 'sam-h')!;
  const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

  return (
    <PageShell
      about={[{"name":"Foreign Earned Income Exclusion","url":"/resources/glossary/foreign-earned-income-exclusion"},{"name":"Foreign Tax Credit","url":"/resources/glossary/foreign-tax-credit"}]}
      mentions={[{"name":"Form 2555","url":"/resources/forms/form-2555"},{"name":"Form 1116","url":"/resources/forms/form-1116"}]}
      url={url}
      eyebrow="Comparison"
      title="FEIE vs Foreign Tax Credit"
      answer="The Foreign Earned Income Exclusion and the Foreign Tax Credit are two different ways to prevent double taxation. The FEIE excludes qualifying foreign earned income from US tax; the Foreign Tax Credit reduces US tax by the foreign tax you have already paid. They can be combined, but not on the same income."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Compare', href: '/resources' },
        { label: 'FEIE vs Foreign Tax Credit', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Not sure which mechanism fits your situation?"
      ctaIntro="The choice between the FEIE and the Foreign Tax Credit depends on your income mix and the foreign tax you pay. We can model both for you."
    >
      <ProseBlock eyebrow="Overview" title="Two routes to the same goal: avoiding double tax">
        <p>
          If you are a US person living and working abroad, you may pay tax to the country you live in
          and still face a US filing obligation on the same income. US tax law offers two main
          mechanisms to stop that income being taxed twice: the{' '}
          <Link href="/resources/glossary/feie">Foreign Earned Income Exclusion</Link> (FEIE) and the{' '}
          <Link href="/resources/glossary/foreign-tax-credit">Foreign Tax Credit</Link> (FTC).
        </p>
        <p>
          They achieve a similar aim by very different means. The FEIE <em>excludes</em> qualifying
          foreign earned income from US tax altogether. The Foreign Tax Credit instead <em>credits</em>{' '}
          the foreign tax you have already paid against your US tax bill. Understanding which lever to
          pull &mdash; or how to combine them &mdash; is one of the most consequential decisions in an
          expat return.
        </p>
      </ProseBlock>

      <ComparisonTable data={comparison} />

      <ProseBlock title="How to think about the choice" tone="porcelain">
        <p>
          The two mechanisms suit different situations. The exclusion tends to help most where foreign
          tax on your earnings is low, because it removes income from US tax without needing foreign
          tax to offset it. The credit tends to help most where foreign tax is high, because it can
          fully absorb your US liability on that income and may even generate a carryover for future
          years.
        </p>
        <p>
          Because the UK is a relatively high-tax jurisdiction, the Foreign Tax Credit is frequently
          the stronger choice for Americans in the UK &mdash; but this is a general pattern, not a
          rule. The mechanisms also interact: they can be used together across different slices of
          income, and the FEIE involves an election with lasting consequences. This is exactly the
          kind of decision our{' '}
          <Link href="/resources/calculators/feie-vs-ftc">FEIE vs FTC calculator</Link> is designed to
          illustrate.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="Which mechanism tends to suit whom"
        items={[
          'FEIE often suits those in lower-tax locations or with foreign earned income below the exclusion.',
          'The Foreign Tax Credit often suits those in higher-tax countries such as the UK.',
          'People with investment or passive income usually rely on the credit, since the FEIE covers earned income only.',
          'Many returns use a blend, applying each mechanism to the income it fits best.',
        ]}
      />

      <KeyFacts
        title="Key facts"
        facts={[
          { label: 'FEIE mechanism', value: 'Excludes qualifying foreign earned income' },
          { label: 'FTC mechanism', value: 'Credits foreign tax against US tax' },
          { label: 'Combinable', value: 'Yes, but not on the same income' },
          { label: 'Typical UK pattern', value: 'Foreign Tax Credit often stronger' },
        ]}
      />

      <RelatedLinks
        title="Related guidance and tools"
        links={[
          { label: 'FEIE vs FTC calculator', href: '/resources/calculators/feie-vs-ftc', description: 'Model both mechanisms against your numbers' },
          { label: 'FEIE (glossary)', href: '/resources/glossary/feie', description: 'What the exclusion is and how to qualify' },
          { label: 'Foreign Tax Credit (glossary)', href: '/resources/glossary/foreign-tax-credit', description: 'How the credit reduces double tax' },
          { label: 'Form 2555 explained', href: '/resources/forms/form-2555', description: 'The IRS form behind the FEIE' },
          { label: 'Form 1116 explained', href: '/resources/forms/form-1116', description: 'The IRS form behind the Foreign Tax Credit' },
          { label: 'FEIE service', href: '/services/us-expat-tax/foreign-earned-income-exclusion', description: 'How we handle the exclusion for UK-based Americans' },
          { label: 'Foreign Tax Credit service', href: '/services/us-expat-tax/foreign-tax-credit', description: 'How we apply the credit in practice' },
        ]}
      />
    </PageShell>
  );
}
