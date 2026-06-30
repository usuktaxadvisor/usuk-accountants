import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  ProseBlock, WhoItsFor, ProcessSteps, KeyFacts, InvestmentBand, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/cross-border-advisory/cross-border-tax-planning';

export const metadata: Metadata = {
  title: 'Cross-Border Tax Planning — US & UK Income, Reliefs & Timing',
  description:
    'Coordinated US–UK tax planning: sequencing the Foreign Tax Credit, FEIE and treaty positions, timing income and gains across two systems, and avoiding double taxation before you file rather than after.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const faqs = [
  {
    q: 'What does cross-border tax planning actually involve?',
    a: 'It means deciding, before the tax year closes, how your income and gains should be reported across the US and UK so the two systems work together. In practice that covers which relief to use and in what order — the Foreign Tax Credit, the Foreign Earned Income Exclusion, treaty positions — plus the timing of income, bonuses, gains and pension draws, and how foreign accounts and investments are handled. The aim is a coordinated position rather than two returns prepared in isolation.',
  },
  {
    q: 'Why does the order of reliefs matter?',
    a: 'Because using one relief can reduce or waste another. Claiming the Foreign Earned Income Exclusion, for example, can leave less income for the Foreign Tax Credit to work against and can affect credit carryovers. In a high-tax country like the UK the Foreign Tax Credit is often the better primary tool, but the right combination depends on your income mix and future plans — which is why it is a planning decision, not a default.',
  },
  {
    q: 'Can timing really change my tax?',
    a: 'Often, yes. The US and UK tax years run on different dates, treat some income differently, and recognise gains at different points. Decisions like when to realise a gain, take a bonus, or draw a pension can change which country taxes it first and whether relief is available — so the timing of an event, not just the event itself, affects the final bill.',
  },
  {
    q: 'Is this the same as filing my returns?',
    a: 'No — planning comes first, filing follows. We can prepare the returns too, but the value of planning is in the decisions made before the year closes. Tax planning sets the position; the return simply records it.',
  },
];

export default function CrossBorderTaxPlanning() {
  return (
    <PageShell
      url={URL}
      eyebrow="Cross-Border Advisory"
      title="Cross-border tax planning"
      answer="Cross-border tax planning coordinates how your income and gains are taxed across the US and UK before the year closes — sequencing the Foreign Tax Credit, FEIE and treaty positions, and timing income, gains and pension draws so the two systems work together rather than against each other. Done early, it prevents double taxation and wasted reliefs; done late, the options have usually already gone."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory' },
        { label: 'Cross-Border Tax Planning', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      service={{
        url: URL,
        name: 'Cross-Border Tax Planning',
        description: 'Coordinated US–UK tax planning: sequencing reliefs, timing income and gains, and avoiding double taxation across two systems.',
        serviceType: 'Tax Advisory',
      }}
      ctaTitle="Plan your position before the year closes"
      ctaIntro="Book a free consultation to coordinate your US and UK tax before the decisions are locked in."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <ProseBlock>
              <p>
                When two tax systems apply to the same person, the difference between a good outcome and an
                expensive one is rarely the return itself &mdash; it is the planning behind it. The same income
                can be taxed efficiently or twice depending on which relief is claimed, in what order, and when
                the income was recognised.
              </p>
              <p>
                <strong>Cross-border planning is about making those choices deliberately.</strong> We model how
                the Foreign Tax Credit, the Foreign Earned Income Exclusion and the treaty interact for your
                specific income mix, and we plan the timing of gains, bonuses and pension decisions around the
                two tax years. The result is a coordinated position that holds up when both returns are filed.
              </p>
            </ProseBlock>
            <div className="lg:pt-2">
              <KeyFacts
                title="Planning at a glance"
                facts={[
                  { label: 'Core tools', value: 'FTC, FEIE & treaty' },
                  { label: 'Key variable', value: 'Order & timing' },
                  { label: 'UK reality', value: 'FTC often primary' },
                  { label: 'Tax years', value: 'US and UK differ' },
                  { label: 'Best done', value: 'Before year-end' },
                  { label: 'Outcome', value: 'Taxed once, not twice' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        items={[
          'Americans in the UK with mixed income sources',
          'Anyone facing a large gain, bonus or pension decision',
          'Clients moving between the US and UK mid-year',
          'People who have been claiming reliefs without modelling them',
          'Dual filers wanting their two returns to agree',
          'Higher earners where relief order materially changes tax',
        ]}
      />

      <ProcessSteps
        steps={[
          { title: 'Free consultation', description: 'We review your income mix and the decisions ahead.' },
          { title: 'Model the options', description: 'We test relief combinations and timing against your numbers.' },
          { title: 'Written plan', description: 'A clear position with the reasoning, risks and reporting set out.' },
          { title: 'Carry it through', description: 'We align the plan with your actual US and UK filings.' },
        ]}
      />

      <InvestmentBand
        fromLabel="Bespoke, complexity-based pricing"
        points={[
          'Free 15–20 minute initial consultation',
          'Paid strategy session for detailed modelling, credited to later work',
          'Relief sequencing and timing modelled to your figures',
          'A written, defensible position you can act on',
        ]}
      />

      <RelatedLinks
        title="Explore related areas"
        links={[
          { label: 'FEIE or Foreign Tax Credit?', href: '/resources/blog/feie-or-foreign-tax-credit-uk', description: 'Which relief fits your situation.' },
          { label: 'US–UK Double-Tax Estimator', href: '/resources/calculators/double-tax-estimator', description: 'See your exposure in under a minute.' },
          { label: 'Foreign Tax Credit', href: '/resources/glossary/foreign-tax-credit', description: 'The relief that often does the work.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'The full advisory picture.' },
          { label: 'US–UK tax treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'What the treaty does, and does not, do.' },
        ]}
      />
    </PageShell>
  );
}
