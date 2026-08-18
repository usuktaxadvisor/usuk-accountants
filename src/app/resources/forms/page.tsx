import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import { PageShell, ProseBlock, RelatedLinks } from '@/components/library';

const url = '/resources/forms';

export const metadata: Metadata = {
  title: 'IRS Forms Explained for US Expats | Knowledge Cluster',
  description:
    'A plain-English guide to the IRS forms US taxpayers abroad encounter most: what each form is, why it exists, who files it, and how it fits within the wider filing process.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const faqs = [
  {
    q: 'What are these IRS forms for?',
    a: 'These are information returns and elections that US taxpayers abroad commonly encounter, covering foreign assets, income exclusions, foreign tax credits, foreign investments, and foreign trusts.',
  },
  {
    q: 'Do I need to file all of them?',
    a: 'No. Each form applies only in specific circumstances. Most people file only the forms relevant to their own situation, which depends on their income, assets, and structures.',
  },
  {
    q: 'How do these forms fit together?',
    a: 'They generally accompany the main US individual tax return, each covering a different aspect of a taxpayer\u2019s cross-border position within one coordinated annual filing.',
  },
];

export default function Page() {
  return (
    <PageShell
      url={url}
      eyebrow="Resources"
      title="IRS Forms Explained for US Taxpayers Abroad"
      answer="This knowledge cluster explains the IRS forms US taxpayers abroad encounter most often. Each guide covers what the form is, why it exists, who generally files it, and how it fits within the wider US filing process, in plain English and evergreen terms."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'IRS Forms', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Not sure which forms apply to you?"
      ctaIntro="Every taxpayer's situation is different. We can help you understand which of these forms are relevant to your own circumstances."
    >
      <ProseBlock eyebrow="Overview" title="Understanding IRS forms for expats">
        <p>
          US taxpayers living abroad often meet a set of specialised IRS forms that go beyond the
          main individual return. These information returns and elections exist to give the US tax
          system visibility over foreign income, foreign assets, foreign investments, and foreign
          trusts.
        </p>
        <p>
          Each guide below explains a single form in plain language: what it is, why it exists, who
          generally files it, and how it connects to the rest of the filing process. The focus is on
          the enduring mechanisms rather than figures that change from year to year.
        </p>
      </ProseBlock>

      <RelatedLinks
        title="Explore the IRS forms"
        links={[
          {
            label: 'Form 8938',
            href: '/resources/forms/form-8938',
            description: 'Statement of specified foreign financial assets.',
          },
          {
            label: 'Form 1116',
            href: '/resources/forms/form-1116',
            description: 'Claiming the foreign tax credit to reduce double taxation.',
          },
          {
            label: 'Form 2555',
            href: '/resources/forms/form-2555',
            description: 'The foreign earned income exclusion for taxpayers abroad.',
          },
          {
            label: 'Form 8621',
            href: '/resources/forms/form-8621',
            description: 'Reporting passive foreign investment company (PFIC) holdings.',
          },
          {
            label: 'Form 3520',
            href: '/resources/forms/form-3520',
            description: 'Foreign trust transactions and large foreign gifts.',
          },
          {
            label: 'Form 3520-A',
            href: '/resources/forms/form-3520-a',
            description: 'Annual information return for a foreign trust with a US owner.',
          },
        ]}
      />

      <ProseBlock title="How these forms relate to your return" tone="porcelain">
        <p>
          These forms generally accompany the main{' '}
          <Link href="/resources/glossary/us-tax-return-1040">US individual tax return</Link>, each
          covering a different facet of a cross-border tax position. They form part of the broader{' '}
          <Link href="/resources/glossary/fatca">foreign asset reporting</Link> framework and connect to
          the wider{' '}
          <Link href="/services/us-tax-returns/hub">US tax returns</Link> service.
        </p>
      </ProseBlock>
    </PageShell>
  );
}
