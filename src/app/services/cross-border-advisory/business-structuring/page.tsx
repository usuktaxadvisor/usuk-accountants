import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  ProseBlock, WhoItsFor, ProcessSteps, KeyFacts, InvestmentBand, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/cross-border-advisory/business-structuring';

export const metadata: Metadata = {
  title: 'US–UK Business Structuring — CFCs, GILTI & Entity Elections',
  description:
    'Cross-border business structuring for US owners of UK companies: controlled foreign corporation rules, Form 5471, GILTI/NCTI, the check-the-box election and Section 962 — chosen with both tax systems in view.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const faqs = [
  {
    q: 'Why does business structure matter so much for US owners of UK companies?',
    a: 'Because a UK limited company owned by a US person is usually a controlled foreign corporation, which brings Form 5471 reporting and can subject the company\u2019s profits to US tax under the GILTI/NCTI rules before any distribution. The structure you choose — and the elections you make — determine how heavy that US layer is. Get it right and the UK tax largely credits against the US; get it wrong and you can face US tax on profit you never drew.',
  },
  {
    q: 'What is the check-the-box election and when does it help?',
    a: 'The check-the-box election lets the owner choose whether a UK company is treated for US tax as a corporation or as a "disregarded" pass-through entity. Disregarding the company can avoid the corporate-level CFC and GILTI machinery and simplify reporting, but it can also create self-employment tax exposure and a deemed liquidation on election. It is genuinely useful in the right case and damaging in the wrong one, so it should always be modelled before filing.',
  },
  {
    q: 'What does a Section 962 election do?',
    a: 'A Section 962 election lets an individual US shareholder be taxed on GILTI and Subpart F income at corporate rates and claim a credit for the foreign corporate tax the company has already paid. For an American with a profitable UK company it often reduces or removes the US GILTI charge, because the UK Corporation Tax becomes creditable — though it adds a second layer of tax when profits are later distributed. Whether it helps depends on your numbers.',
  },
  {
    q: 'Can you set up the structure and handle the filings?',
    a: 'Yes. We advise on the structure, make and document the elections on time, and then handle both the UK company accounts and Corporation Tax and the US owner\u2019s Form 5471 and personal return — so the structure is actually carried through correctly rather than just recommended.',
  },
];

export default function BusinessStructuring() {
  return (
    <PageShell
      url={URL}
      eyebrow="Cross-Border Advisory"
      title="US–UK business structuring"
      answer="For a US owner, the way a UK company is structured decides how heavy the US tax layer is. A UK limited company is usually a controlled foreign corporation, bringing Form 5471 and potential GILTI tax on profits before they are distributed — but elections like check-the-box and Section 962 can transform that position. We model the structure across both systems, make the elections on time, and carry them through into the actual filings."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory' },
        { label: 'Business Structuring', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      service={{
        url: URL,
        name: 'US–UK Business Structuring',
        description: 'Cross-border business structuring for US owners of UK companies: CFC rules, Form 5471, GILTI, check-the-box and Section 962 elections.',
        serviceType: 'Tax Advisory',
      }}
      ctaTitle="Structure it right before you incorporate"
      ctaIntro="Book a consultation to model your company across the UK and US before the structure is set."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <ProseBlock>
              <p>
                A UK company is straightforward to set up &mdash; and that is exactly the trap for American
                owners. The same incorporation that is routine for a British founder quietly creates US
                reporting and, potentially, current US tax on profits the company has not even distributed,
                because the US treats most US-owned UK companies as controlled foreign corporations.
              </p>
              <p>
                <strong>The structure and the elections are where this is won or lost.</strong> Check-the-box
                and Section 962 can each transform how a UK company is taxed in the US &mdash; for better or
                worse &mdash; and both are time-sensitive and hard to unwind. We model the options against your
                numbers, make the elections deliberately, and then handle both sides of the resulting filings.
              </p>
            </ProseBlock>
            <div className="lg:pt-2">
              <KeyFacts
                title="Structuring at a glance"
                facts={[
                  { label: 'UK company', value: 'Usually a CFC' },
                  { label: 'Reporting', value: 'Form 5471' },
                  { label: 'Profit tax', value: 'GILTI / NCTI' },
                  { label: 'Key elections', value: 'Check-the-box, §962' },
                  { label: 'Timing', value: 'Often irreversible' },
                  { label: 'Goal', value: 'UK tax credits in US' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        items={[
          'Americans about to incorporate a UK company',
          'US owners of existing UK limited companies',
          'Founders weighing check-the-box or Section 962',
          'Contractors deciding between sole trader and limited',
          'Businesses with US and UK ownership',
          'Anyone facing Form 5471 or GILTI for the first time',
        ]}
      />

      <ProcessSteps
        steps={[
          { title: 'Book a consultation', description: 'We review your business, ownership and plans.' },
          { title: 'Model the structure', description: 'We test entity options and elections against your numbers.' },
          { title: 'Elect on time', description: 'We make and document the elections before the deadlines bite.' },
          { title: 'Handle both sides', description: 'UK accounts and Corporation Tax plus US Form 5471 and personal return.' },
        ]}
      />

      <InvestmentBand
        fromLabel="Bespoke, complexity-based pricing"
        points={[
          '£300 30-minute consultation',
          'Paid strategy session for structuring, credited to later work',
          'Entity and election options modelled to your figures',
          'Elections made on time and carried into both filings',
        ]}
      />

      <RelatedLinks
        title="Explore related areas"
        links={[
          { label: 'Running a UK company as a US citizen', href: '/resources/blog/running-a-uk-limited-company-as-a-us-citizen', description: 'What it really involves.' },
          { label: 'Check-the-box election', href: '/resources/glossary/check-the-box', description: 'The election that changes everything.' },
          { label: 'Section 962 election', href: '/resources/blog/section-962-election-explained', description: 'Corporate-rate treatment for individuals.' },
          { label: 'Founders & contractors', href: '/who-we-help/startups-founders', description: 'Built for cross-border founders.' },
          { label: 'Form 5471', href: '/services/us-expat-tax/form-5471', description: 'The reporting we handle for you.' },
        ]}
      />
    </PageShell>
  );
}
