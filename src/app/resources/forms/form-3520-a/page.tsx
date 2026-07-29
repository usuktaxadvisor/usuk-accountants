import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import { PageShell, ProseBlock, WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks } from '@/components/library';

const url = '/resources/forms/form-3520-a';

export const metadata: Metadata = {
  title: 'IRS Form 3520-A (Foreign Trust Annual Return) Explained | US Expat Tax',
  description:
    'What IRS Form 3520-A is, why it exists for foreign trusts with a US owner, who generally files it, and how it pairs with Form 3520 in the US expat filing process.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What is IRS Form 3520-A?',
    a: 'Form 3520-A is the annual information return for a foreign trust that has a US owner. It reports the trust\u2019s activity and provides statements to the US owner and beneficiaries.',
  },
  {
    q: 'Why does Form 3520-A exist?',
    a: 'It exists so the IRS can see the annual activity of a foreign trust treated as owned by a US person, complementing the individual-level reporting on Form 3520.',
  },
  {
    q: 'Who generally files Form 3520-A?',
    a: 'The foreign trust itself is generally responsible for filing, but a US owner may need to ensure it is filed and may take steps to complete it where the trust does not.',
  },
  {
    q: 'How does Form 3520-A relate to Form 3520?',
    a: 'They are a pair. Form 3520-A reports the trust\u2019s annual activity, while Form 3520 reports the US person\u2019s transactions with the trust and other foreign gifts.',
  },
];

export default function Page() {
  return (
    <PageShell
      url={url}
      eyebrow="IRS Form"
      title="IRS Form 3520-A: Annual Return for a Foreign Trust"
      answer="IRS Form 3520-A is the annual information return for a foreign trust that has a US owner. It reports the trust's activity and pairs with Form 3520, which covers the US person's own transactions with the trust and foreign gifts."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'IRS Forms', href: '/resources/forms' },
        { label: 'Form 3520-A', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="US owner of a foreign trust?"
      ctaIntro="The pairing of Form 3520 and Form 3520-A can be confusing. We can help you understand the annual reporting obligations."
    >
      <ProseBlock eyebrow="Overview" title="What Form 3520-A is">
        <p>
          Form 3520-A is the annual information return for a foreign trust that is treated as owned
          by a US person. It reports the trust&rsquo;s income, distributions, and financial position
          for the year, and it produces statements that flow through to the US owner and to
          beneficiaries.
        </p>
        <p>
          Where Form 3520 looks at the arrangement from the individual&rsquo;s perspective, Form
          3520-A looks at it from the trust&rsquo;s perspective. It is the trust-level counterpart in
          a two-part reporting structure.
        </p>
      </ProseBlock>

      <ProseBlock title="Why it exists" tone="porcelain">
        <p>
          When a foreign trust is treated as owned by a US person under the grantor trust rules, the
          income of that trust is generally attributed to the owner. For the US tax system to apply
          that treatment properly, it needs a clear annual picture of what the trust did.
        </p>
        <p>
          Form 3520-A provides that picture. It ensures the trust&rsquo;s annual activity is visible
          and that the US owner and beneficiaries receive the information they need to report their
          own positions accurately, complementing the individual-level disclosure on Form 3520.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="Who generally files it"
        items={[
          'Foreign trusts that have a US owner under the grantor trust rules.',
          'US owners who must ensure the annual trust return is filed on time.',
          'US owners who may complete a substitute return where the trust does not file.',
          'Arrangements where trust-level and owner-level reporting must be coordinated.',
        ]}
      />

      <ProcessSteps
        eyebrow="Process"
        title="How it fits into the filing process"
        steps={[
          {
            title: 'Confirm US-owner status',
            description:
              'Establish whether the foreign trust is treated as owned by a US person, which triggers this annual return.',
          },
          {
            title: 'Gather trust-level data',
            description:
              'Assemble the trust\u2019s income, distributions, and balance sheet information for the year.',
          },
          {
            title: 'Produce owner and beneficiary statements',
            description:
              'The return generates statements that the US owner and beneficiaries use for their own reporting.',
          },
          {
            title: 'Coordinate with Form 3520',
            description:
              'The trust-level return is prepared in step with the individual-level Form 3520 for a complete picture.',
          },
        ]}
      />

      <KeyFacts
        title="Key facts"
        facts={[
          { label: 'Form type', value: 'Annual information return' },
          { label: 'Covers', value: 'A foreign trust with a US owner' },
          { label: 'Paired with', value: 'Form 3520 (individual-level reporting)' },
          { label: 'Perspective', value: 'Trust level rather than individual level' },
        ]}
      />

      <ProseBlock title="How it relates to other filings">
        <p>
          Form 3520-A is the natural companion to{' '}
          <Link href="/resources/forms/form-3520">Form 3520</Link>. One reports the trust&rsquo;s annual
          activity and the other reports the US person&rsquo;s transactions with the trust. Together
          they sit within the broader landscape of{' '}
          <Link href="/resources/glossary/fatca">foreign asset reporting</Link> that supports the main{' '}
          <Link href="/resources/glossary/us-tax-return-1040">US individual tax return</Link> for taxpayers
          with cross-border connections.
        </p>
      </ProseBlock>

      <RelatedLinks
        title="Related guidance"
        links={[
          {
            label: 'Form 3520',
            href: '/resources/forms/form-3520',
            description: 'The paired individual-level foreign trust and gift return.',
          },
          {
            label: 'FATCA',
            href: '/resources/glossary/fatca',
            description: 'The wider foreign asset transparency framework.',
          },
          {
            label: 'US Tax Returns hub',
            href: '/services/us-tax-returns/hub',
            description: 'Where foreign trust reporting fits in your annual filing.',
          },
          {
            label: 'US individual tax return',
            href: '/resources/glossary/us-tax-return-1040',
            description: 'The main return this reporting ultimately supports.',
          },
        ]}
      />
    </PageShell>
  );
}
