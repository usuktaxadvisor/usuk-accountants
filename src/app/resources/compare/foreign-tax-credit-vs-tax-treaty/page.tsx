import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import {
  PageShell, ProseBlock, WhoItsFor, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import type { ComparisonTableData } from '@/lib/types';

const url = '/resources/compare/foreign-tax-credit-vs-tax-treaty';

export const metadata: Metadata = {
  title: 'Foreign Tax Credit vs US–UK Tax Treaty | US UK Accountants',
  description:
    'The foreign tax credit and the US–UK tax treaty are different tools for avoiding double taxation. Learn how they work and how they interact for Americans in the UK.',
  alternates: { canonical: url },
};

const faqs = [
  {
    q: 'What is the difference between the foreign tax credit and the tax treaty?',
    a: 'The foreign tax credit is a mechanism in US domestic law that offsets US tax with foreign tax already paid. The US–UK tax treaty is an agreement between the two countries that allocates taxing rights over particular types of income.',
  },
  {
    q: 'Can I use both at the same time?',
    a: 'They operate at different levels and are often considered together. The treaty can determine which country has the primary right to tax an item of income; the foreign tax credit then relieves double taxation on income that remains taxable in both.',
  },
  {
    q: 'Which one prevents double taxation?',
    a: 'Both contribute. The treaty allocates rights and can reduce or eliminate tax on certain income; the foreign tax credit relieves double tax where the same income is taxable in both countries.',
  },
  {
    q: 'Does the treaty override the foreign tax credit?',
    a: 'They are complementary rather than competing. Because US citizens are affected by the treaty\u2019s saving clause, the foreign tax credit often remains the workhorse for relieving double taxation, with the treaty applying to specific income types.',
  },
];

const comparison: ComparisonTableData = {
  columns: ['', 'Foreign Tax Credit', 'US–UK Treaty'],
  rows: [
    { label: 'Source', values: ['US domestic law', 'Bilateral agreement'] },
    { label: 'Function', values: ['Offsets US tax with UK tax paid', 'Allocates taxing rights'] },
    { label: 'Applies to specific income types', values: ['Broadly', 'By article'] },
    { label: 'Affected by the saving clause', values: [false, true] },
    { label: 'Commonly used by Americans in the UK', values: [true, true] },
  ],
};

export default function FtcVsTreatyPage() {
  const author = authors.find((a) => a.slug === 'sam-h')!;
  const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;
  return (
    <PageShell
      about={[{"name":"Foreign Tax Credit","url":"/resources/glossary/foreign-tax-credit"},{"name":"US–UK Tax Treaty","url":"/resources/glossary/us-uk-tax-treaty"}]}
      mentions={[{"name":"Form 1116","url":"/resources/forms/form-1116"},{"name":"Form 8833","url":"/resources/glossary/form-8833"}]}
      url={url}
      eyebrow="Comparison"
      title="Foreign Tax Credit vs US–UK Tax Treaty"
      answer="The foreign tax credit and the US–UK tax treaty are two different tools for avoiding double taxation. The foreign tax credit is US domestic law that offsets US tax with UK tax already paid. The treaty is a bilateral agreement that allocates taxing rights over particular income types. They work together rather than competing."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Compare', href: '/resources' },
        { label: 'Foreign Tax Credit vs Treaty', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Getting relief the right way?"
      ctaIntro="We combine the credit and the treaty correctly so you claim every relief you are entitled to."
    >
      <ProseBlock eyebrow="The short answer" title="A mechanism and an agreement">
        <p className="speakable">
          The <Link href="/resources/glossary/foreign-tax-credit">foreign tax credit</Link> and the{' '}
          <Link href="/resources/glossary/us-uk-tax-treaty">US–UK tax treaty</Link> are easy to conflate because
          both reduce double taxation. But one is a credit built into US law, and the other is a treaty that
          decides which country taxes what. They solve the same problem from different directions.
        </p>
      </ProseBlock>

      <ComparisonTable data={comparison} />

      <ProseBlock title="How they interact in practice">
        <p>
          The treaty can say which country has the first or sole right to tax a given item of income. Where income
          remains taxable in both countries, the foreign tax credit steps in to offset the US liability with UK tax
          paid. For US citizens, the treaty\u2019s{' '}
          <Link href="/resources/glossary/saving-clause">saving clause</Link> limits some treaty benefits, which is
          why the credit tends to do much of the heavy lifting.
        </p>
        <p>
          The practical skill is knowing which tool to reach for on which income — and documenting the position on
          the right forms, such as{' '}
          <Link href="/resources/glossary/form-8833">Form 8833</Link> for treaty-based positions.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="This helps if you"
        items={[
          'Have UK income also taxable in the US',
          'Are unsure whether to rely on the credit or the treaty',
          'Have heard of the saving clause and want to understand it',
          'Want to make sure you are not paying more than necessary',
        ]}
      />

      <KeyFacts
        title="At a glance"
        facts={[
          { label: 'Foreign tax credit', value: 'US law — offsets US tax with UK tax' },
          { label: 'Treaty', value: 'Bilateral — allocates taxing rights' },
          { label: 'Saving clause', value: 'Limits some treaty benefits for US citizens' },
          { label: 'Relationship', value: 'Complementary, often used together' },
        ]}
      />

      <RelatedLinks
        title="Related resources"
        links={[
          { label: 'Foreign Tax Credit service', href: '/services/us-expat-tax/foreign-tax-credit', description: 'How UK tax offsets US tax' },
          { label: 'US–UK Tax Treaty service', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'How the treaty allocates taxing rights' },
          { label: 'Saving clause (glossary)', href: '/resources/glossary/saving-clause', description: 'Why US citizens get limited treaty benefits' },
          { label: 'Form 8833 (glossary)', href: '/resources/glossary/form-8833', description: 'Disclosing a treaty-based position' },
          { label: 'US Tax Returns hub', href: '/services/us-expat-tax/us-tax-returns/hub', description: 'The complete filing guide, in order' },
        ]}
      />
    </PageShell>
  );
}
