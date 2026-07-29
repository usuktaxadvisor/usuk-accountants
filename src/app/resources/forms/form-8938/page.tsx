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

const url = '/resources/forms/form-8938';

export const metadata: Metadata = {
  title: 'IRS Form 8938 (Statement of Specified Foreign Financial Assets) | US UK Accountants',
  description:
    'What IRS Form 8938 is, why it exists under FATCA, who generally files it, and how it relates to the FBAR and your US tax return for Americans in the UK.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'Is Form 8938 the same as the FBAR?',
    a: 'No. Form 8938 is filed with your income tax return and reports specified foreign financial assets to the IRS under FATCA. The FBAR is a separate report filed with FinCEN. Many people with UK accounts must file both, because they serve different agencies and have different scopes.',
  },
  {
    q: 'Does filing Form 8938 replace the FBAR?',
    a: 'No. The two reports coexist. Filing one does not satisfy the other, and the assets they cover overlap only partially.',
  },
  {
    q: 'What kinds of assets does Form 8938 concern?',
    a: 'It concerns specified foreign financial assets, which broadly include foreign financial accounts and certain other foreign financial instruments and interests held for investment, such as interests in foreign entities.',
  },
  {
    q: 'Where does Form 8938 fit in the filing process?',
    a: 'It is attached to and filed together with your annual US income tax return, rather than submitted separately.',
  },
];

export default function Page() {
  return (
    <PageShell
      about={[{"name":"Form 8938","url":"/resources/glossary/form-8938"}]}
      mentions={[{"name":"FATCA compliance","url":"/services/us-expat-tax/fatca-compliance"}]}
      url={url}
      eyebrow="IRS Form"
      title="IRS Form 8938: Statement of Specified Foreign Financial Assets"
      answer="Form 8938 is a US tax form that reports specified foreign financial assets to the IRS under the FATCA regime. It is filed with your income tax return and is separate from the FBAR, though many Americans in the UK must file both because the two reports serve different agencies and scopes."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'IRS Forms', href: '/resources/forms' },
        { label: 'Form 8938', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Not sure whether Form 8938 applies to you?"
      ctaIntro="We help Americans in the UK understand their FATCA and foreign-asset reporting obligations and file accurately."
    >
      <ProseBlock eyebrow="The short answer" title="What Form 8938 is">
        <p>
          Form 8938, the Statement of Specified Foreign Financial Assets, is the
          US tax form through which individuals report certain foreign financial
          assets to the Internal Revenue Service. It exists because of the
          Foreign Account Tax Compliance Act (FATCA), which was designed to
          improve transparency around assets that US taxpayers hold outside the
          United States.
        </p>
        <p>
          The form is informational: it reports the existence and nature of
          qualifying assets rather than calculating a tax on them directly. It is
          attached to your annual income tax return.
        </p>
      </ProseBlock>

      <ProseBlock title="Why Form 8938 exists" tone="porcelain">
        <p>
          FATCA introduced a reporting framework intended to reduce the use of
          offshore accounts and entities to conceal income from US tax. Form 8938
          is the individual taxpayer component of that framework, complementing
          the separate reporting that foreign financial institutions themselves
          provide. For Americans living in the UK, this means UK-based holdings
          can fall within the scope of US reporting even though they are held
          entirely outside the United States.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="Who generally files Form 8938"
        items={[
          'US citizens and certain residents who hold specified foreign financial assets above the applicable reporting thresholds.',
          'Americans in the UK holding UK investment accounts, certain pensions, or interests in foreign entities.',
          'Dual citizens and long-term residents with financial ties on both sides of the Atlantic.',
          'Taxpayers who already file an FBAR and need to determine whether Form 8938 also applies.',
        ]}
      />

      <ProcessSteps
        eyebrow="How it fits"
        title="How Form 8938 fits into the filing process"
        steps={[
          {
            title: 'Identify specified foreign financial assets',
            description:
              'Review your foreign accounts and financial interests to determine which qualify as specified foreign financial assets for reporting purposes.',
          },
          {
            title: 'Determine whether a reporting obligation applies',
            description:
              'Assess whether your circumstances bring you within the scope of Form 8938 reporting, considering your filing status and where you live.',
          },
          {
            title: 'Report on the form',
            description:
              'Summarise the qualifying assets on Form 8938, describing their nature and the entities involved.',
          },
          {
            title: 'File with your income tax return',
            description:
              'Attach Form 8938 to your annual US income tax return so the two are submitted together, rather than filing it separately.',
          },
        ]}
      />

      <KeyFacts
        title="Key facts at a glance"
        facts={[
          { label: 'Form name', value: 'Statement of Specified Foreign Financial Assets' },
          { label: 'Governing regime', value: 'FATCA' },
          { label: 'Filed with', value: 'Your US income tax return (IRS)' },
          { label: 'Relationship to FBAR', value: 'Separate report; both may be required' },
          { label: 'Purpose', value: 'Informational reporting of foreign assets' },
        ]}
      />

      <ProseBlock title="How Form 8938 relates to other filings">
        <p>
          Form 8938 is most often discussed alongside the FBAR because both
          concern foreign holdings, but they are distinct: the FBAR goes to
          FinCEN, while Form 8938 goes to the IRS with your return. Understanding
          the difference is central to staying compliant, which is why we cover
          it in detail on our comparison page. It also connects to the wider
          FATCA compliance work and to the US tax return process as a whole.
        </p>
      </ProseBlock>

      <RelatedLinks
        title="Related resources"
        links={[
          { label: 'FBAR vs Form 8938', href: '/resources/compare/fbar-vs-form-8938', description: 'How the two foreign-asset reports differ and why both may be required.' },
          { label: 'Form 8938 (glossary)', href: '/resources/glossary/form-8938', description: 'A concise definition of the form and its role.' },
          { label: 'FATCA (glossary)', href: '/resources/glossary/fatca', description: 'The regime behind Form 8938.' },
          { label: 'FATCA compliance service', href: '/services/us-expat-tax/fatca-compliance', description: 'How we help with FATCA obligations.' },
          { label: 'US Tax Returns hub', href: '/services/us-expat-tax/us-tax-returns/hub', description: 'Where Form 8938 fits in the wider return.' },
        ]}
      />
    </PageShell>
  );
}
