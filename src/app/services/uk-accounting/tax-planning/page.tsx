import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting/tax-planning';

export const metadata: Metadata = {
  title: 'Tax Planning — Proactive UK & Cross-Border Tax Strategy',
  description:
    'Tax planning is about arranging your affairs efficiently and legitimately, ahead of time. Learn what good planning covers for individuals and businesses, and how cross-border US-UK planning avoids costly mistakes.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const faqs = [
  {
    q: 'What is tax planning?',
    a: 'Tax planning is the proactive, legitimate arrangement of your financial affairs to manage your tax position efficiently — making the most of available allowances, reliefs and timing, within the rules. It is forward-looking, unlike compliance work which reports on what has already happened. Done well, it is about paying the right amount of tax and no more, not avoidance.',
  },
  {
    q: 'How is tax planning different from just filing my tax return?',
    a: 'Filing reports the past; planning shapes the future. A tax return records what already happened and works out the tax due. Planning happens beforehand — deciding how to structure income, investments, a business or major decisions so the eventual tax outcome is as efficient as the rules allow. The biggest savings usually come from decisions made before year-end, not after.',
  },
  {
    q: 'What does tax planning cover for a business?',
    a: 'For companies and their owners it can include profit extraction (the salary-versus-dividend mix), timing of investment to use capital allowances, choosing the right business structure, pension contributions, and planning around year-end. For US-owned UK companies it also means coordinating UK decisions with US rules such as GILTI so one does not undo the other.',
  },
  {
    q: 'Why does cross-border tax planning matter so much?',
    a: 'Because a decision that is efficient in one country can be costly in the other. Investments, pensions, company structures and even how you hold savings can be treated very differently by HMRC and the IRS — UK funds that are PFICs for US purposes are a classic example. Genuine US-UK planning looks at both systems together, so you do not solve one problem by creating another.',
  },
  {
    q: 'Is tax planning the same as tax avoidance?',
    a: 'No. Legitimate tax planning means using the allowances, reliefs and structures that the law provides, as intended. It is not aggressive avoidance schemes, which carry real risk. Our approach is straightforward: claim what you are entitled to, structure decisions sensibly, and keep everything fully compliant in both countries.',
  },
  {
    q: 'When is the best time to do tax planning?',
    a: 'Earlier than most people think. Many of the most effective steps must be taken before the relevant tax year-end, not at the point of filing. Reviewing your position well ahead of deadlines — and before major decisions like selling an asset, taking a dividend or restructuring — is where planning adds the most value.',
  },
];

export default function TaxPlanning() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting · Tax Planning"
      title="Proactive tax planning, across both systems"
      answer="Tax planning is the legitimate, forward-looking arrangement of your affairs to manage tax efficiently — using available allowances, reliefs and timing within the rules. Unlike filing, which reports the past, planning shapes future outcomes, and the biggest savings usually come from decisions made before year-end. For individuals and businesses connected to both the US and UK, effective planning means coordinating both tax systems together, so an efficient move in one country does not create a costly problem in the other."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
        { label: 'Tax Planning', href: '/services/uk-accounting/tax-planning' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-26"
      faqs={faqs}
      service={{
        url: URL,
        name: 'Tax Planning & Advisory',
        description: 'Proactive UK and cross-border US-UK tax planning for individuals and businesses, focused on legitimate efficiency and avoiding costly cross-border mistakes.',
        serviceType: 'Tax Planning',
      }}
      ctaTitle="Plan ahead, instead of paying for hindsight"
      ctaIntro="The best tax decisions are made before year-end, not after. Book a consultation and we'll review your position across both the UK and US and map the efficient, compliant path forward."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                <strong>Tax planning</strong> is the part of accountancy that looks <strong>forward</strong>. Where a
                tax return records what already happened, planning is about arranging your affairs{' '}
                <strong>ahead of time</strong> — making the most of the allowances, reliefs and timing the rules
                provide, so your eventual tax position is as efficient as it legitimately can be.
              </p>
              <p>
                The crucial point is timing: most of the meaningful steps have to be taken{' '}
                <strong>before the year-end</strong>, not at the point of filing. By the time a return is being
                prepared, the opportunities for that year have largely passed. Planning is what turns tax from a bill
                you react to into an outcome you have shaped.
              </p>
              <p>
                And for anyone connected to both countries, it is where a US–UK firm matters most. A move that saves
                tax in the UK can <strong>trigger a problem in the US</strong> — and vice versa. Real cross-border
                planning weighs <strong>both systems together</strong>, which is exactly what we do.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Tax planning at a glance"
                facts={[
                  { label: 'Nature', value: 'Forward-looking, not reactive' },
                  { label: 'Goal', value: 'Legitimate efficiency' },
                  { label: 'Best timing', value: 'Before year-end' },
                  { label: 'Covers', value: 'Income, business, investments' },
                  { label: 'Cross-border', value: 'UK & US weighed together' },
                  { label: 'Not', value: 'Aggressive avoidance' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who benefits from tax planning"
        items={[
          'Business owners deciding how to extract profit efficiently',
          'Higher earners and those with complex income',
          'Investors and landlords with capital gains exposure',
          'US citizens and dual nationals living in the UK',
          'Owners of US-connected UK companies',
          'Anyone facing a major decision — a sale, a dividend, a move',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">What planning covers</h2>
            <p>
              For businesses and their owners, planning often centres on <strong>profit extraction</strong> — the
              balance of salary and dividends — alongside the timing of investment to make use of{' '}
              <strong>capital allowances</strong>, choice of <strong>business structure</strong>, and pension
              contributions. For individuals it can mean using <strong>allowances and reliefs</strong> fully, timing
              the realisation of gains, and structuring savings and investments sensibly.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Where cross-border planning earns its keep</h2>
            <p>
              This is the part generic accountants miss. A UK-efficient choice can be penalised under US rules:{' '}
              <Link href="/services/us-expat-tax/fatca-compliance" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">UK funds and ISAs can be PFICs</Link>{' '}
              for US tax; a UK company&rsquo;s profits can be caught by GILTI and{' '}
              <Link href="/services/us-expat-tax/form-5471" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Form 5471</Link>;
              and pensions are treated differently on each side of the Atlantic. We plan with{' '}
              <Link href="/services/us-expat-tax/us-uk-tax-treaty" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">the US–UK treaty</Link>{' '}
              and both tax systems in view, so one country&rsquo;s saving is not another&rsquo;s liability.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: <strong>leaving planning until the return</strong>, when the year&rsquo;s
              opportunities have gone; making a <strong>UK-efficient decision that backfires in the US</strong> (or
              the reverse); <strong>not using allowances and reliefs</strong> before they reset at year-end;
              confusing legitimate planning with risky <strong>avoidance schemes</strong>; and making big moves —
              selling an asset, taking a large dividend — <strong>without modelling the tax first</strong>.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Planning, not avoidance</h2>
            <p>
              To be clear about our approach: this is <strong>legitimate planning</strong> — using the allowances,
              reliefs and structures the law intends — not aggressive avoidance. The aim is simply to pay the right
              amount of tax and not a penny more, with everything fully compliant in <strong>both</strong> countries.
              That is a more durable kind of efficiency than any scheme.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="Planning that looks ahead"
        steps={[
          { title: 'Review your position', description: 'We look at your income, business, investments and plans across both the UK and US.' },
          { title: 'Identify opportunities', description: 'We pinpoint allowances, reliefs and timing decisions available before year-end.' },
          { title: 'Model both systems', description: 'We check that any UK move stands up on the US side too — and vice versa.' },
          { title: 'Act in good time', description: 'We help you implement the steps while they still count, not after the window has closed.' },
        ]}
      />

      <RelatedLinks
        title="Further reading"
        links={[
          { label: 'UK property & US tax for Americans', href: '/resources/blog/uk-property-and-us-tax-guide', description: 'The full cross-border property landscape' },
          { label: 'UK inheritance tax vs US estate tax', href: '/resources/blog/uk-inheritance-tax-vs-us-estate-tax', description: 'Cross-border estate planning after 2025' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax', description: 'Plan the company tax bill early' },
          { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment', description: 'Personal tax, planned ahead' },
          { label: 'Cross-Border Planning', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'Treaty-aware US-UK strategy' },
          { label: 'Form 5471 (US owners)', href: '/services/us-expat-tax/form-5471', description: 'US rules for your UK company' },
          { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts', description: 'Year-end accounts and filing' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen guidance' },
        ]}
      />
    </PageShell>
  );
}
