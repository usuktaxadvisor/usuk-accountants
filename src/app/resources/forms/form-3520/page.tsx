import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import { PageShell, ProseBlock, WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks } from '@/components/library';

const url = '/resources/forms/form-3520';

export const metadata: Metadata = {
  title: 'IRS Form 3520 (Foreign Trusts & Gifts) Explained | US Expat Tax',
  description:
    'What IRS Form 3520 is, why it exists for foreign trusts and large foreign gifts, who generally files it, and how it fits within the wider US expat filing process.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What is IRS Form 3520?',
    a: 'Form 3520 is an information return US persons use to report certain transactions with foreign trusts and the receipt of large gifts or bequests from foreign persons.',
  },
  {
    q: 'Why does Form 3520 exist?',
    a: 'It exists to give the IRS visibility over foreign trust arrangements and substantial foreign gifts, areas that would otherwise be difficult to monitor and that carry a risk of untaxed transfers.',
  },
  {
    q: 'Who generally files Form 3520?',
    a: 'US persons who create, transfer to, or receive distributions from a foreign trust, and US persons who receive large gifts or inheritances from foreign individuals or estates, generally file it.',
  },
  {
    q: 'How does Form 3520 relate to other filings?',
    a: 'It is an information return that accompanies the wider US filing and is closely paired with Form 3520-A, which covers the annual reporting for certain foreign trusts.',
  },
];

export default function Page() {
  return (
    <PageShell
      about={[{"name":"Form 3520","url":"/resources/glossary/form-3520"}]}
      mentions={[{"name":"Form 3520-A","url":"/resources/forms/form-3520-a"}]}
      url={url}
      eyebrow="IRS Form"
      title="IRS Form 3520: Foreign Trusts and Large Foreign Gifts"
      answer="IRS Form 3520 is the information return US persons use to report transactions with foreign trusts and the receipt of large gifts or bequests from foreign persons. It gives the IRS visibility over cross-border trust arrangements and substantial foreign transfers."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'IRS Forms', href: '/resources/forms' },
        { label: 'Form 3520', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Involved with a foreign trust or large gift?"
      ctaIntro="Foreign trust and gift reporting is nuanced. We can help you understand whether Form 3520 applies to your situation."
    >
      <ProseBlock eyebrow="Overview" title="What Form 3520 is">
        <p>
          Form 3520 is an information return that reports certain dealings between US persons and
          foreign trusts, as well as the receipt of large gifts or bequests from foreign individuals
          and estates. It is a disclosure document rather than a calculation of tax owed on the
          transactions it describes.
        </p>
        <p>
          Its purpose is transparency. By requiring these events to be reported, the form gives the
          IRS a window into arrangements that cross borders and that might otherwise be invisible to
          the US tax system.
        </p>
      </ProseBlock>

      <ProseBlock title="Why it exists" tone="porcelain">
        <p>
          Foreign trusts and large foreign gifts sit at the edge of the US tax system. A trust
          established under another country&rsquo;s law, or a substantial gift from a person outside
          the United States, involves value moving across a border in a way that ordinary income
          reporting would not capture.
        </p>
        <p>
          Form 3520 exists to close that gap. It ensures that the creation of, transfers to, and
          distributions from foreign trusts are visible, and that significant gifts and inheritances
          from abroad are on record, supporting the wider framework of foreign asset transparency.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="Who generally files it"
        items={[
          'US persons who create or transfer assets to a foreign trust.',
          'US persons who receive distributions from a foreign trust.',
          'US persons treated as owners of a foreign trust under the grantor trust rules.',
          'US persons who receive large gifts or bequests from foreign individuals or estates.',
        ]}
      />

      <ProcessSteps
        eyebrow="Process"
        title="How it fits into the filing process"
        steps={[
          {
            title: 'Identify the reportable event',
            description:
              'Determine whether a foreign trust transaction or a large foreign gift has occurred during the period.',
          },
          {
            title: 'Establish your role',
            description:
              'Clarify whether you are a grantor, transferor, beneficiary, or recipient, as this shapes what is reported.',
          },
          {
            title: 'Coordinate with Form 3520-A',
            description:
              'Where a foreign trust with a US owner is involved, the annual trust return is prepared alongside this filing.',
          },
          {
            title: 'File with the wider return',
            description:
              'The completed information return accompanies the individual US filing for the year.',
          },
        ]}
      />

      <KeyFacts
        title="Key facts"
        facts={[
          { label: 'Form type', value: 'Information return' },
          { label: 'Covers', value: 'Foreign trusts and large foreign gifts' },
          { label: 'Paired with', value: 'Form 3520-A for certain foreign trusts' },
          { label: 'Purpose', value: 'Transparency over cross-border transfers' },
        ]}
      />

      <ProseBlock title="How it relates to other filings">
        <p>
          Form 3520 is closely tied to{' '}
          <Link href="/resources/forms/form-3520-a">Form 3520-A</Link>, which is the annual information
          return for certain foreign trusts with a US owner. Together they form a pair: one reports
          the individual&rsquo;s side of the arrangement, and the other reports the trust&rsquo;s
          annual activity. Both sit within the wider ecosystem of{' '}
          <Link href="/resources/glossary/fatca">foreign asset reporting</Link> that accompanies the main{' '}
          <Link href="/resources/glossary/us-tax-return-1040">US individual tax return</Link>.
        </p>
      </ProseBlock>

      <RelatedLinks
        title="Related guidance"
        links={[
          {
            label: 'Form 3520-A',
            href: '/resources/forms/form-3520-a',
            description: 'The paired annual return for certain foreign trusts.',
          },
          {
            label: 'FATCA',
            href: '/resources/glossary/fatca',
            description: 'The wider foreign asset transparency framework.',
          },
          {
            label: 'US Tax Returns hub',
            href: '/services/us-tax-returns/hub',
            description: 'Where trust and gift reporting fits in your annual filing.',
          },
          {
            label: 'US individual tax return',
            href: '/resources/glossary/us-tax-return-1040',
            description: 'The main return this information return accompanies.',
          },
        ]}
      />
    </PageShell>
  );
}
