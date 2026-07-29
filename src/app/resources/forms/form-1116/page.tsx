import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import {
  PageShell,
  ProseBlock,
  WhoItsFor,
  ProcessSteps,
  KeyFacts,
  RelatedLinks,
} from '@/components/library';

const url = '/resources/forms/form-1116';

export const metadata: Metadata = {
  title: 'IRS Form 1116 (Foreign Tax Credit) | US UK Accountants',
  description:
    'What IRS Form 1116 is, why it exists, who generally files it, and how it uses foreign taxes paid to relieve double taxation for Americans in the UK.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What is Form 1116 used for?',
    a: 'Form 1116 is used to claim the Foreign Tax Credit, which lets US taxpayers offset US tax with income taxes they have already paid to a foreign country such as the UK, reducing double taxation on the same income.',
  },
  {
    q: 'How does Form 1116 relate to the Foreign Earned Income Exclusion?',
    a: 'They are alternative mechanisms for relieving double tax on foreign income and are often compared. The Foreign Tax Credit on Form 1116 credits foreign taxes paid, while the exclusion on Form 2555 excludes qualifying earned income. Which fits best depends on your circumstances.',
  },
  {
    q: 'Does Form 1116 relate to the US–UK tax treaty?',
    a: 'Both address double taxation, but through different routes. The credit is a domestic US mechanism, while the treaty allocates taxing rights between the countries. They can interact, which is why professional review is valuable.',
  },
  {
    q: 'Where does Form 1116 fit in the filing process?',
    a: 'It is completed as part of your US income tax return, supporting the calculation of any Foreign Tax Credit you claim.',
  },
];

export default function Page() {
  return (
    <PageShell
      url={url}
      eyebrow="IRS Form"
      title="IRS Form 1116: Foreign Tax Credit"
      answer="Form 1116 is the US tax form used to claim the Foreign Tax Credit. It lets US taxpayers offset their US tax with income taxes already paid to a foreign country such as the UK, and is one of the main mechanisms for relieving double taxation on foreign income."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'IRS Forms', href: '/resources/forms' },
        { label: 'Form 1116', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Claiming the Foreign Tax Credit?"
      ctaIntro="We help Americans in the UK apply the Foreign Tax Credit correctly and choose the right relief mechanism for their situation."
    >
      <ProseBlock eyebrow="The short answer" title="What Form 1116 is">
        <p>
          Form 1116 is the US tax form on which individuals claim the Foreign Tax
          Credit. The credit is a mechanism that allows US taxpayers to offset
          their US income tax with income taxes they have already paid to another
          country. For an American living in the UK, that typically means UK
          income tax paid on the same income the US also seeks to tax.
        </p>
        <p>
          Because the United States taxes its citizens on worldwide income, the
          same earnings can fall within both the US and the UK tax systems. The
          Foreign Tax Credit is one of the primary tools for preventing that
          income from being taxed twice.
        </p>
      </ProseBlock>

      <ProseBlock title="Why Form 1116 exists" tone="porcelain">
        <p>
          Form 1116 exists to operationalise the Foreign Tax Credit within the US
          return. Rather than exempting foreign income, the credit recognises the
          tax a taxpayer has already paid abroad and reduces the US liability
          accordingly. This preserves the US worldwide-taxation principle while
          still relieving the double taxation that principle would otherwise
          create.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="Who generally files Form 1116"
        items={[
          'US citizens and residents who have paid or accrued income tax to a foreign country such as the UK.',
          'Americans in the UK seeking to offset US tax with UK tax already paid on the same income.',
          'Taxpayers deciding between the Foreign Tax Credit and the Foreign Earned Income Exclusion.',
          'Dual citizens managing overlapping US and UK tax on investment or employment income.',
        ]}
      />

      <ProcessSteps
        eyebrow="How it fits"
        title="How Form 1116 fits into the filing process"
        steps={[
          {
            title: 'Identify foreign income and foreign tax paid',
            description:
              'Establish which income is foreign-source and what income tax you have paid or accrued to the foreign country on it.',
          },
          {
            title: 'Categorise the income',
            description:
              'Group the foreign income into the categories the credit uses, since the credit is calculated by category.',
          },
          {
            title: 'Calculate the credit',
            description:
              'Use Form 1116 to work out the allowable credit against your US tax, reflecting the foreign tax already paid.',
          },
          {
            title: 'File with your income tax return',
            description:
              'Include the completed form with your US income tax return so the credit is applied to your overall liability.',
          },
        ]}
      />

      <KeyFacts
        title="Key facts at a glance"
        facts={[
          { label: 'Form name', value: 'Foreign Tax Credit' },
          { label: 'Purpose', value: 'Relieve double taxation via a credit' },
          { label: 'Filed with', value: 'Your US income tax return (IRS)' },
          { label: 'Alternative mechanism', value: 'Foreign Earned Income Exclusion (Form 2555)' },
          { label: 'Related concept', value: 'US–UK tax treaty relief' },
        ]}
      />

      <ProseBlock title="How Form 1116 relates to other filings">
        <p>
          Form 1116 sits at the centre of the double-taxation question for
          Americans abroad. It is frequently weighed against the Foreign Earned
          Income Exclusion claimed on Form 2555, and it interacts with the relief
          available under the US–UK tax treaty. Choosing among these mechanisms
          is a planning decision, which is why we cover the comparison in detail
          and provide a calculator to explore the trade-offs.
        </p>
      </ProseBlock>

      <RelatedLinks
        title="Related resources"
        links={[
          { label: 'Foreign Tax Credit vs US–UK Tax Treaty', href: '/resources/compare/foreign-tax-credit-vs-tax-treaty', description: 'When to rely on the credit versus the treaty.' },
          { label: 'Foreign Tax Credit (glossary)', href: '/resources/glossary/foreign-tax-credit', description: 'A concise definition of the credit.' },
          { label: 'FEIE vs FTC calculator', href: '/resources/calculators/feie-vs-ftc', description: 'Explore the exclusion-versus-credit trade-off.' },
          { label: 'Foreign Tax Credit service', href: '/services/us-expat-tax/foreign-tax-credit', description: 'How we apply the credit for clients.' },
          { label: 'Form 2555 (Foreign Earned Income Exclusion)', href: '/resources/forms/form-2555', description: 'The main alternative mechanism.' },
        ]}
      />
    </PageShell>
  );
}
