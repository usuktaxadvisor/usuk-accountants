import type { Metadata } from 'next';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';
import { PageShell, ProseBlock, WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks } from '@/components/library';

const url = '/resources/forms/form-8621';

export const metadata: Metadata = {
  title: 'IRS Form 8621 (PFIC Reporting) Explained | US Expat Tax',
  description:
    'What IRS Form 8621 is, why it exists for passive foreign investment companies, who generally files it, and how it fits within the wider US expat filing process.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What is IRS Form 8621?',
    a: 'Form 8621 is the information return US taxpayers use to report interests in a passive foreign investment company (PFIC) and to make or reflect certain elections about how that investment is taxed.',
  },
  {
    q: 'Why does Form 8621 exist?',
    a: 'It exists so the IRS can apply the PFIC regime, a set of rules designed to prevent US taxpayers from deferring tax by holding passive investments through foreign entities such as non-US pooled funds.',
  },
  {
    q: 'Who generally files Form 8621?',
    a: 'US persons who hold shares in a foreign corporation that meets the PFIC income or asset tests generally file it, commonly those holding non-US mutual funds, investment trusts, or similar pooled vehicles.',
  },
  {
    q: 'How does Form 8621 relate to other filings?',
    a: 'It sits alongside the main Form 1040 and can interact with other information returns. Many UK-resident US taxpayers encounter it because common UK investment funds are treated as PFICs.',
  },
];

export default function Page() {
  return (
    <PageShell
      url={url}
      eyebrow="IRS Form"
      title="IRS Form 8621: Passive Foreign Investment Company Reporting"
      answer="IRS Form 8621 is the information return US taxpayers use to report interests in a passive foreign investment company (PFIC) and to make elections about how that investment is taxed. It applies the PFIC regime, which targets deferral through foreign pooled investments."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'IRS Forms', href: '/resources/forms' },
        { label: 'Form 8621', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      faqs={faqs}
      ctaTitle="Holding non-US investment funds?"
      ctaIntro="PFIC reporting is one of the most technical areas of US expat tax. We can help you understand how it applies to your portfolio."
    >
      <ProseBlock eyebrow="Overview" title="What Form 8621 is">
        <p>
          Form 8621 is an information return that reports a US person&rsquo;s interest in a passive
          foreign investment company, known as a PFIC. It is the mechanism through which the PFIC
          rules are applied to an individual investment, and it is where certain elections about the
          tax treatment of that investment are recorded.
        </p>
        <p>
          The form is not a tax in itself. Instead, it channels a foreign investment into one of
          several possible tax treatments under the PFIC regime, which then determines how income and
          gains from that investment are reported on the wider return.
        </p>
      </ProseBlock>

      <ProseBlock title="Why the PFIC regime exists" tone="porcelain">
        <p>
          The PFIC rules were introduced to remove a perceived advantage. Without them, a US taxpayer
          could hold passive investments inside a foreign corporation and defer US tax on the income
          and growth accumulating inside that structure. The regime is designed to discourage that
          deferral by applying less favourable treatment to investments that meet the PFIC tests.
        </p>
        <p>
          Because the definition turns on the nature of the underlying income and assets rather than
          the label of the vehicle, many ordinary non-US pooled investments fall within it. This is
          why the topic is so significant for US taxpayers living abroad.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="Who generally files it"
        items={[
          'US persons who hold shares in a foreign corporation that meets the PFIC income or asset tests.',
          'US taxpayers abroad who own non-US mutual funds, investment trusts, or similar pooled vehicles.',
          'Investors who need to make or maintain a PFIC election for a particular holding.',
          'Anyone whose foreign investment structure channels passive income in a way that triggers the regime.',
        ]}
      />

      <ProcessSteps
        eyebrow="Process"
        title="How it fits into the filing process"
        steps={[
          {
            title: 'Identify PFIC holdings',
            description:
              'Review foreign investments to determine which entities meet the PFIC income or asset tests for the period.',
          },
          {
            title: 'Determine the treatment',
            description:
              'Establish which PFIC method or election applies to each holding, as this drives how income and gains are reported.',
          },
          {
            title: 'Complete a form per holding',
            description:
              'The reporting generally applies on a per-investment basis, so multiple holdings can mean multiple forms.',
          },
          {
            title: 'Integrate with the main return',
            description:
              'The results flow through to the wider individual return alongside other income and information reporting.',
          },
        ]}
      />

      <KeyFacts
        title="Key facts"
        facts={[
          { label: 'Form type', value: 'Information return and election vehicle' },
          { label: 'Regime', value: 'Passive foreign investment company (PFIC) rules' },
          { label: 'Common trigger', value: 'Non-US pooled investment funds' },
          { label: 'Filed with', value: 'The main US individual income tax return' },
        ]}
      />

      <ProseBlock title="How it relates to other filings">
        <p>
          Form 8621 does not stand alone. It works with the main{' '}
          <Link href="/resources/glossary/us-tax-return-1040">US individual tax return</Link> and can
          interact with other information reporting for foreign assets, such as{' '}
          <Link href="/resources/glossary/fatca">FATCA</Link> disclosures. For US taxpayers in the UK, it
          frequently arises because common UK investment vehicles meet the{' '}
          <Link href="/resources/glossary/pfic">PFIC</Link> definition, making it a central part of
          managing an investment portfolio across two tax systems.
        </p>
      </ProseBlock>

      <RelatedLinks
        title="Related guidance"
        links={[
          {
            label: 'PFIC explained',
            href: '/resources/glossary/pfic',
            description: 'The underlying concept behind Form 8621 reporting.',
          },
          {
            label: 'FATCA',
            href: '/resources/glossary/fatca',
            description: 'How foreign asset reporting interacts with PFIC holdings.',
          },
          {
            label: 'US Tax Returns hub',
            href: '/services/us-tax-returns/hub',
            description: 'Where PFIC reporting fits within your annual US filing.',
          },
          {
            label: 'Form 8938',
            href: '/resources/forms/form-8938',
            description: 'A related foreign asset information return.',
          },
        ]}
      />
    </PageShell>
  );
}
