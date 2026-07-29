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

const url = '/resources/forms/form-2555';

export const metadata: Metadata = {
  title: 'IRS Form 2555 (Foreign Earned Income Exclusion) | US UK Accountants',
  description:
    'What IRS Form 2555 is, why it exists, who generally files it, and how the Foreign Earned Income Exclusion works for Americans living and working in the UK.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What is Form 2555 used for?',
    a: 'Form 2555 is used to claim the Foreign Earned Income Exclusion, which allows qualifying US taxpayers living abroad to exclude a portion of their foreign earned income from US taxation.',
  },
  {
    q: 'How does Form 2555 differ from Form 1116?',
    a: 'Form 2555 excludes qualifying foreign earned income from US tax, while Form 1116 credits foreign taxes paid against US tax. They are alternative approaches to relieving double taxation, and the better choice depends on your situation.',
  },
  {
    q: 'What are the qualification concepts behind Form 2555?',
    a: 'Eligibility generally rests on being a genuine resident abroad or being physically present abroad for a sufficient period, together with having foreign earned income. These are mechanisms rather than fixed numbers.',
  },
  {
    q: 'Where does Form 2555 fit in the filing process?',
    a: 'It is completed and filed as part of your annual US income tax return, supporting the exclusion you claim.',
  },
];

export default function Page() {
  return (
    <PageShell
      url={url}
      eyebrow="IRS Form"
      title="IRS Form 2555: Foreign Earned Income Exclusion"
      answer="Form 2555 is the US tax form used to claim the Foreign Earned Income Exclusion. It allows qualifying Americans living abroad, including in the UK, to exclude a portion of their foreign earned income from US tax, and is an alternative to claiming the Foreign Tax Credit."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'IRS Forms', href: '/resources/forms' },
        { label: 'Form 2555', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Considering the Foreign Earned Income Exclusion?"
      ctaIntro="We help Americans in the UK determine whether the exclusion or the credit better fits their circumstances, and file accordingly."
    >
      <ProseBlock eyebrow="The short answer" title="What Form 2555 is">
        <p>
          Form 2555 is the US tax form through which individuals claim the
          Foreign Earned Income Exclusion. The exclusion allows qualifying US
          taxpayers who live and work abroad to exclude a portion of their
          foreign earned income from US taxation. For an American employed in the
          UK, it can be a significant tool for reducing exposure to double tax on
          salary and similar earnings.
        </p>
        <p>
          The exclusion applies to earned income, such as wages and
          self-employment income, rather than to passive income like dividends or
          interest.
        </p>
      </ProseBlock>

      <ProseBlock title="Why Form 2555 exists" tone="porcelain">
        <p>
          Because the United States taxes citizens on worldwide income, Americans
          working abroad would otherwise face US tax on income they earn entirely
          overseas. The Foreign Earned Income Exclusion exists to relieve that
          burden for genuine residents abroad, recognising that their earned
          income already has a strong connection to their country of residence.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="Who generally files Form 2555"
        items={[
          'US citizens and residents living abroad with foreign earned income.',
          'Americans employed or self-employed in the UK seeking to exclude qualifying earnings.',
          'Taxpayers weighing the exclusion against the Foreign Tax Credit.',
          'Long-term expatriates whose residence abroad supports an exclusion claim.',
        ]}
      />

      <ProcessSteps
        eyebrow="How it fits"
        title="How Form 2555 fits into the filing process"
        steps={[
          {
            title: 'Confirm foreign earned income',
            description:
              'Identify the earned income arising from your work abroad that could qualify for the exclusion.',
          },
          {
            title: 'Establish qualification',
            description:
              'Determine whether you meet the residence or physical-presence basis for claiming the exclusion.',
          },
          {
            title: 'Complete the exclusion calculation',
            description:
              'Use Form 2555 to calculate the amount of foreign earned income you can exclude.',
          },
          {
            title: 'File with your income tax return',
            description:
              'Submit the form together with your US income tax return so the exclusion is reflected in your liability.',
          },
        ]}
      />

      <KeyFacts
        title="Key facts at a glance"
        facts={[
          { label: 'Form name', value: 'Foreign Earned Income Exclusion' },
          { label: 'Applies to', value: 'Foreign earned income' },
          { label: 'Filed with', value: 'Your US income tax return (IRS)' },
          { label: 'Alternative mechanism', value: 'Foreign Tax Credit (Form 1116)' },
          { label: 'Qualification basis', value: 'Residence or physical presence abroad' },
        ]}
      />

      <ProseBlock title="How Form 2555 relates to other filings">
        <p>
          Form 2555 is most naturally understood alongside Form 1116. Both aim to
          prevent double taxation of foreign income, but the exclusion removes
          qualifying earned income from the US base, while the credit offsets US
          tax with foreign tax paid. Many Americans in the UK need to weigh the
          two, and the interaction with the US–UK tax treaty adds further nuance.
          Our calculator helps illustrate the trade-off.
        </p>
      </ProseBlock>

      <RelatedLinks
        title="Related resources"
        links={[
          { label: 'FEIE (glossary)', href: '/resources/glossary/feie', description: 'A concise definition of the exclusion.' },
          { label: 'FEIE vs FTC calculator', href: '/resources/calculators/feie-vs-ftc', description: 'Explore the exclusion-versus-credit trade-off.' },
          { label: 'Foreign Earned Income Exclusion service', href: '/services/us-expat-tax/foreign-earned-income-exclusion', description: 'How we apply the exclusion for clients.' },
          { label: 'Form 1116 (Foreign Tax Credit)', href: '/resources/forms/form-1116', description: 'The main alternative mechanism.' },
          { label: 'US Tax Returns hub', href: '/services/us-expat-tax/us-tax-returns/hub', description: 'Where the exclusion fits in the wider return.' },
        ]}
      />
    </PageShell>
  );
}
