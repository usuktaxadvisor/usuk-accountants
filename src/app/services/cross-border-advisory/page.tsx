import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, ProcessSteps, InvestmentBand, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/services/cross-border-advisory';

export const metadata: Metadata = {
  title: 'US–UK Cross-Border Tax Advisory — Treaty, Pensions & Structuring',
  description:
    'Specialist cross-border tax advisory for life and business between the US and UK: treaty planning, pensions (401k & SIPP), business structuring and the decisions that only matter when you file in both countries at once.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const advisoryServices = services.filter((s) =>
  ['cross-border-tax-planning', 'business-structuring', 'pensions-401k-sipp', 'us-uk-tax-treaty']
    .some((k) => s.href?.includes(k)),
);

const faqs = [
  {
    q: 'What is cross-border tax advisory?',
    a: 'It is the planning layer that sits above annual compliance — deciding how income, pensions, businesses and assets should be structured when two tax systems apply at once. Rather than simply filing US and UK returns, cross-border advisory works out the positions, elections and timing that keep the two systems working together: claiming treaty benefits, coordinating pensions, structuring companies, and sequencing reliefs so you are not taxed twice.',
  },
  {
    q: 'How is this different from your US expat tax or UK accounting services?',
    a: 'Those services handle the returns themselves — your US filing, your UK Self Assessment, your company accounts. Cross-border advisory is the strategy that connects them: the treaty position behind a pension decision, the election that changes how a UK company is taxed in the US, the order in which reliefs are claimed. Most clients need both the compliance and the advisory, and we provide them together.',
  },
  {
    q: 'When should I get cross-border advice rather than just file?',
    a: 'Before anything structural changes: moving country, taking a pension, starting or restructuring a company, selling property, or planning your estate. Advice taken before the event is almost always worth more than the same advice afterwards, because many cross-border positions — treaty elections, entity classifications, pension decisions — are far harder or impossible to fix once a return has been filed.',
  },
  {
    q: 'Do you work alongside my existing advisors?',
    a: 'Yes. We frequently provide the specialist US–UK tax layer alongside wealth managers, solicitors and financial planners, coordinating positions across your wider professional team rather than replacing them.',
  },
];

export default function CrossBorderAdvisoryPillar() {
  return (
    <PageShell
      url={URL}
      eyebrow="Cross-Border Advisory"
      title="Cross-border tax advisory between the US and UK"
      answer="Cross-border advisory is the planning layer above annual filing: treaty positions, pensions, business structuring and the timing decisions that only matter when the US and UK tax systems apply to you at once. It is where the real money is saved or lost — through reliefs claimed in the right order, elections made on time, and structures chosen with both systems in view. We provide it alongside the compliance work, so strategy and filing stay joined up."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      service={{
        url: URL,
        name: 'US–UK Cross-Border Tax Advisory',
        description: 'Treaty planning, pensions (401k & SIPP), business structuring and cross-border tax planning for individuals and businesses between the US and UK.',
        serviceType: 'Tax Advisory',
      }}
      ctaTitle="Plan it before you file it"
      ctaIntro="Book a consultation to get the cross-border strategy right before the decisions are locked in."
    >
      <ProseBlock>
        <p>
          Most tax problems between the US and UK are not filing errors &mdash; they are planning gaps. The
          return simply records a decision that was already made: how a company was set up, when a pension was
          drawn, whether a treaty position was claimed. By the time the return is due, the expensive choices
          have usually been taken.
        </p>
        <p>
          <strong>Cross-border advisory moves the thinking upstream.</strong> It is the work of deciding how
          income, pensions, businesses and assets should sit across two systems before the event &mdash; so the
          treaty is used where it helps, elections are made on time, and reliefs line up rather than collide.
          We provide this alongside the compliance, because strategy that isn&rsquo;t connected to the actual
          filings rarely survives contact with reality.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="What we advise on" title="Cross-border advisory services" />
          <div className="mt-10">
            <ServiceGrid services={advisoryServices} columns={3} />
          </div>
        </Container>
      </Section>

      <WhoItsFor
        items={[
          'Individuals moving between the US and UK',
          'Americans with UK pensions or UK pensions with US members',
          'Founders structuring a company across both countries',
          'Families planning gifts, succession or estate exposure',
          'Anyone taking a decision that touches both tax systems',
          'Clients whose existing advisors need a US–UK specialist',
        ]}
      />

      <ProcessSteps
        steps={[
          { title: 'Book a consultation', description: 'We map your situation and the cross-border decisions ahead.' },
          { title: 'Position review', description: 'We model the treaty, pension, structuring or planning options.' },
          { title: 'Clear recommendation', description: 'A written position you can act on, with the reasoning and risks set out.' },
          { title: 'Coordinated execution', description: 'We carry it through into your actual US and UK filings.' },
        ]}
      />

      <InvestmentBand
        fromLabel="Bespoke, complexity-based pricing"
        points={[
          '£100 30-minute consultation',
          'Paid strategy session for detailed planning, credited to later work',
          'Written positions with reasoning, risks and reporting set out',
          'Advice coordinated into your real US and UK filings',
        ]}
        note="Where a treaty position carries audit or disclosure considerations, we explain them plainly and recommend the conservative course unless your facts justify otherwise."
      />

      <RelatedLinks
        title="Explore related areas"
        links={[
          { label: 'Cross-Border Tax Planning', href: '/services/cross-border-advisory/cross-border-tax-planning', description: 'Coordinate income and reliefs across both systems.' },
          { label: 'Business Structuring', href: '/services/cross-border-advisory/business-structuring', description: 'Set up companies the right way on both sides.' },
          { label: 'Pensions (401k / SIPP)', href: '/services/cross-border-advisory/pensions-401k-sipp', description: 'How pensions are taxed across the Atlantic.' },
          { label: 'US–UK tax treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'What the treaty does, and does not, do.' },
          { label: 'High-net-worth individuals', href: '/who-we-help/high-net-worth-individuals', description: 'Complex cross-border wealth, planned.' },
        ]}
      />
    </PageShell>
  );
}
