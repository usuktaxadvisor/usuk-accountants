import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import {
  PageShell, ProseBlock, WhoItsFor, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import type { ComparisonTableData } from '@/lib/types';

const url = '/resources/compare/us-tax-return-vs-uk-tax-return';

export const metadata: Metadata = {
  title: 'US Tax Return vs UK Tax Return: How They Differ | US UK Accountants',
  description:
    'US and UK tax returns work on different principles — citizenship-based vs residence-based taxation. Learn how the two systems differ for Americans in the UK.',
  alternates: { canonical: url },
};

const faqs = [
  {
    q: 'Do Americans in the UK have to file both a US and a UK tax return?',
    a: 'Frequently, yes. The US taxes its citizens on worldwide income regardless of where they live, while the UK taxes based on residence. Many Americans in the UK therefore have obligations in both systems.',
  },
  {
    q: 'What is the fundamental difference between the two systems?',
    a: 'The US uses citizenship-based taxation: US citizens and green-card holders file US returns wherever they live. The UK uses residence-based taxation, focused on where you are resident and, in some cases, your domicile.',
  },
  {
    q: 'Does filing a UK return remove the need to file a US return?',
    a: 'No. The two systems are independent. Filing in the UK does not discharge a US filing obligation, though mechanisms such as the foreign tax credit and the treaty help prevent the same income being taxed twice.',
  },
  {
    q: 'How is double taxation avoided?',
    a: 'Through relief mechanisms rather than exemption from filing — chiefly the foreign tax credit, the foreign earned income exclusion, and provisions of the US–UK tax treaty.',
  },
];

const comparison: ComparisonTableData = {
  columns: ['', 'US Tax Return', 'UK Tax Return'],
  rows: [
    { label: 'Basis of taxation', values: ['Citizenship', 'Residence'] },
    { label: 'Filed by non-residents (citizens abroad)', values: [true, false] },
    { label: 'Reports worldwide income', values: [true, 'Depends on residence/domicile'] },
    { label: 'Tax authority', values: ['IRS', 'HMRC'] },
    { label: 'Common for Americans in the UK', values: [true, true] },
  ],
};

export default function UsVsUkReturnPage() {
  const author = authors.find((a) => a.slug === 'sam-h')!;
  const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;
  return (
    <PageShell
      url={url}
      eyebrow="Comparison"
      title="US Tax Return vs UK Tax Return"
      answer="A US tax return and a UK tax return follow different principles. The US taxes citizens on worldwide income wherever they live (citizenship-based), while the UK taxes on the basis of residence. Americans in the UK often file both, using the foreign tax credit and the US–UK treaty to avoid being taxed twice on the same income."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Compare', href: '/resources' },
        { label: 'US vs UK tax return', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Filing on both sides of the Atlantic?"
      ctaIntro="We coordinate your US and UK filings so they work together and you never pay twice."
    >
      <ProseBlock eyebrow="The short answer" title="Two systems, two logics">
        <p className="speakable">
          The defining difference is what triggers the filing. The US return follows the{' '}
          <em>person</em> — a US citizen files wherever they live. The UK return follows{' '}
          <Link href="/resources/glossary/statutory-residence-test">residence</Link>, and sometimes{' '}
          <Link href="/resources/glossary/domicile">domicile</Link>. For an American in the UK, both can apply
          at once.
        </p>
      </ProseBlock>

      <ComparisonTable data={comparison} />

      <ProseBlock title="Why filing both does not mean paying twice">
        <p>
          Filing in two systems sounds like double taxation, but the mechanisms exist precisely to prevent that.
          The <Link href="/resources/glossary/foreign-tax-credit">foreign tax credit</Link> lets UK tax offset US
          tax on the same income, the{' '}
          <Link href="/resources/glossary/feie">foreign earned income exclusion</Link> can remove qualifying
          earned income from US tax, and the{' '}
          <Link href="/resources/glossary/us-uk-tax-treaty">US–UK tax treaty</Link> allocates taxing rights for
          particular income types.
        </p>
        <p>
          The returns still have to be filed; the relief happens inside them. Coordinating the two is where most
          of the value — and most of the risk — sits.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="This helps if you"
        items={[
          'Are a US citizen or green-card holder living in the UK',
          'Are new to filing in two countries',
          'Want to understand why both returns are needed',
          'Are worried about being taxed twice',
        ]}
      />

      <KeyFacts
        title="At a glance"
        facts={[
          { label: 'US basis', value: 'Citizenship — worldwide income' },
          { label: 'UK basis', value: 'Residence (and sometimes domicile)' },
          { label: 'Authorities', value: 'IRS and HMRC' },
          { label: 'Double-tax relief', value: 'Foreign tax credit, FEIE, treaty' },
        ]}
      />

      <RelatedLinks
        title="Related resources"
        links={[
          { label: 'US Tax Returns hub', href: '/services/us-expat-tax/us-tax-returns/hub', description: 'The complete filing guide, in order' },
          { label: 'Foreign Tax Credit', href: '/services/us-expat-tax/foreign-tax-credit', description: 'How UK tax offsets US tax' },
          { label: 'US–UK Tax Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'How the treaty allocates taxing rights' },
          { label: 'Self Assessment', href: '/resources/glossary/self-assessment', description: 'The UK return, explained' },
          { label: 'US Expat Tax service', href: '/services/us-expat-tax', description: 'Our full US tax service for the UK' },
        ]}
      />
    </PageShell>
  );
}
