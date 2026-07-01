import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/who-we-help/startups-founders';

export const metadata: Metadata = {
  title: 'US–UK Tax & Accounting for Startups, Founders & Contractors',
  description:
    'Cross-border accounting for founders, startups and contractors: UK limited company set-up, Corporation Tax, and the US side for American owners — Form 5471, GILTI, the check-the-box election and Section 962.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const relevant = services.filter((s) =>
  ['startup-accounting', 'corporation-tax', 'company-accounts', 'form-5471', 'tax-planning', 'payroll']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'I am American and want to run a UK limited company — what is the catch?', a: 'A UK limited company owned by a US citizen is usually a "controlled foreign corporation" for US purposes. That brings Form 5471 reporting (with a penalty starting at $10,000 for non-filing) and potential current US tax on the company\u2019s profits under the GILTI/NCTI rules, even before you take money out. None of this stops you incorporating — but the decision should be modelled across both systems first.' },
  { q: 'Should I be a sole trader or a limited company?', a: 'For a UK-only business the answer turns on profit level and risk. For an American in the UK it is more involved, because a limited company triggers US CFC reporting while a sole trader does not — but a sole trader pays UK National Insurance and may face US self-employment tax considerations. The right answer depends on your numbers and your US status, which is exactly what we model.' },
  { q: 'What is the check-the-box election?', a: 'It lets the owner of a UK company choose how it is treated for US tax — as a corporation or as a "disregarded" pass-through entity. Done deliberately it can simplify a US owner\u2019s position and avoid GILTI complexity; done without modelling it can create self-employment tax exposure and a deemed liquidation. It is powerful and irreversible for five years, so it should never be filed casually.' },
  { q: 'Can you handle both the UK accounts and the US filing?', a: 'Yes — that is the point of working with us. We prepare the UK company accounts, Corporation Tax and payroll, and the US owner\u2019s Form 5471, GILTI calculation and personal return, coordinated so the UK tax credits correctly against the US position. One team, both jurisdictions.' },
];

export default function StartupsFounders() {
  return (
    <PageShell
      url={URL}
      eyebrow="Who we help"
      title="US–UK accounting for startups, founders & contractors"
      answer="Running a company across the US and UK adds a layer most accountants miss: a UK limited company owned by an American is usually a controlled foreign corporation, triggering Form 5471 and potential GILTI tax on profits before they are distributed. We handle the UK accounts, Corporation Tax and payroll alongside the US owner's reporting, so incorporation decisions are modelled across both systems from the start."
      crumbs={[
        { label: 'Who We Help', href: '/who-we-help' },
        { label: 'Startups & Founders', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Building across both countries?"
      ctaIntro="Book a consultation and we'll model your structure across the UK and US before you commit to it."
    >
      <ProseBlock>
        <p>
          The way you structure a cross-border business shapes your tax for years &mdash; and for an American
          founder, a routine UK incorporation can quietly create US reporting obligations and current tax on
          profit you haven&rsquo;t even drawn. The decisions that look purely operational (sole trader vs limited
          company, when to incorporate, how to pay yourself) all have a US dimension.
        </p>
        <p>
          <strong>The goal isn&rsquo;t to avoid incorporating &mdash; it&rsquo;s to incorporate with both systems in view.</strong>{' '}
          Elections like check-the-box and Section 962 can transform the US position of a UK company, but only
          if chosen deliberately and on time. We bring the UK accounting and the US tax together so founders
          make these calls with the full picture.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="We help founders and contractors who are…"
        items={[
          'Americans starting or running a UK limited company',
          'Contractors deciding between sole trader and limited company',
          'Startups with US and UK founders or investors',
          'Founders weighing check-the-box or Section 962 elections',
          'Businesses trading across both countries',
          'Wanting one team for UK accounts and US owner reporting',
        ]}
      />

      <Section tone="white">
        <Container>
          <SectionHeading eyebrow="What you'll likely need" title="The services that fit your situation" />
          <div className="mt-10">
            <ServiceGrid services={relevant} columns={3} />
          </div>
        </Container>
      </Section>

      <RelatedLinks
        title="Related areas"
        links={[
          { label: 'Sole trader or limited company?', href: '/resources/blog/sole-trader-or-limited-company-american-in-uk', description: 'The decision for Americans in the UK.' },
          { label: 'Running a UK company as a US citizen', href: '/resources/blog/running-a-uk-limited-company-as-a-us-citizen', description: 'What it really involves.' },
          { label: 'GILTI / NCTI rules', href: '/resources/glossary/gilti', description: 'US tax on UK company profits.' },
          { label: 'Corporation Tax estimator', href: '/resources/calculators/corporation-tax', description: 'Estimate your UK company tax.' },
          { label: 'Startup accounting', href: '/services/uk-accounting/startup-accounting', description: 'The UK side, set up right.' },
        ]}
      />
    </PageShell>
  );
}
