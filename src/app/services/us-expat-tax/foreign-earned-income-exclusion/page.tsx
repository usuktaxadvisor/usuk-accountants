import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/foreign-earned-income-exclusion';

export const metadata: Metadata = {
  title: 'Foreign Earned Income Exclusion (FEIE) for Americans in the UK — Form 2555',
  description:
    'The Foreign Earned Income Exclusion (Form 2555) lets qualifying Americans abroad exclude earned income from US tax. Learn the qualifying tests, the 330-day rule, FEIE vs Foreign Tax Credit, and common mistakes.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What is the Foreign Earned Income Exclusion?',
    a: 'The Foreign Earned Income Exclusion (FEIE) lets qualifying US persons living abroad exclude their foreign earned income from US tax, up to an annually-set limit, by filing IRS Form 2555. It applies only to earned income — wages and self-employment income — not to investment, rental or pension income.',
  },
  {
    q: 'How do I qualify for the FEIE?',
    a: 'You must have foreign earned income, a tax home in a foreign country, and meet one of two tests: the bona fide residence test (being a genuine resident of a foreign country for an uninterrupted period that includes a full tax year), or the physical presence test (being physically present in a foreign country for at least 330 full days during any 12-month period).',
  },
  {
    q: 'What is the 330-day rule?',
    a: 'The physical presence test is met if you are physically present in a foreign country or countries for at least 330 full days during a period of 12 consecutive months. The 330 days do not need to be consecutive, but they must be full days, and the 12-month window can be chosen to your advantage.',
  },
  {
    q: 'Does the FEIE cover investment, rental or pension income?',
    a: 'No. The FEIE applies only to earned income — broadly, pay for services such as wages and self-employment income. Investment income, dividends, rental income and pensions are not earned income and cannot be excluded under the FEIE. The Foreign Tax Credit is usually the relevant relief for those.',
  },
  {
    q: 'Is the FEIE or the Foreign Tax Credit better for Americans in the UK?',
    a: 'For many Americans in the UK the Foreign Tax Credit works better, because UK tax rates are generally higher than US rates and the credit can fully offset the US liability while building carryforwards. The FEIE tends to suit those in lower-tax situations or below the exclusion limit. The right choice depends on your income mix, and combining them requires care.',
  },
  {
    q: 'Can I change my mind after electing the FEIE?',
    a: 'You can revoke a FEIE election, but once revoked you generally cannot elect it again for five years without IRS approval. This is why the FEIE-versus-Foreign-Tax-Credit decision should be made deliberately, ideally with advice, rather than defaulted into.',
  },
];

const feieVsFtc = {
  columns: ['', 'FEIE', 'Foreign Tax Credit'],
  highlightColumn: 2,
  rows: [
    { label: 'Form', values: ['Form 2555', 'Form 1116'] },
    { label: 'How it works', values: ['Excludes earned income up to a set limit', 'Credits foreign tax paid against US tax'] },
    { label: 'Best when', values: ['Foreign tax is low or nil', 'Foreign tax rate is higher (e.g. UK)'] },
    { label: 'Covers investment & rental income', values: [false, true] },
    { label: 'Can create carryforwards', values: [false, true] },
    { label: 'Election can be "sticky"', values: ['Yes — 5-year rule on re-electing', 'No'] },
  ],
};

export default function Feie() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · FEIE"
      title="The Foreign Earned Income Exclusion explained"
      answer="The Foreign Earned Income Exclusion (FEIE), claimed on Form 2555, lets qualifying Americans abroad exclude their foreign earned income from US tax up to an annually-set limit. You qualify by having a foreign tax home and meeting either the bona fide residence test or the physical presence test (at least 330 full days abroad in a 12-month period). It applies only to earned income — not investment, rental or pension income — and for many Americans in the UK the Foreign Tax Credit is the better choice."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'FEIE', href: '/services/us-expat-tax/foreign-earned-income-exclusion' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-25"
      faqs={faqs}
      service={{
        url: URL,
        name: 'Foreign Earned Income Exclusion (Form 2555)',
        description: 'Advising on and claiming the Foreign Earned Income Exclusion for qualifying Americans abroad, and comparing it with the Foreign Tax Credit.',
        serviceType: 'Tax Planning',
      }}
      ctaTitle="Is the FEIE actually your best option?"
      ctaIntro="For many Americans in the UK it isn't — and the election is hard to undo. Book a free consultation and we'll model the FEIE against the Foreign Tax Credit for your situation."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                The <strong>Foreign Earned Income Exclusion</strong> is one of the two main ways Americans abroad
                avoid double taxation. Claimed on <strong>IRS Form 2555</strong>, it lets you{' '}
                <strong>exclude your foreign earned income from US tax</strong> up to a limit that is set annually and
                rises with inflation.
              </p>
              <p>
                The crucial word is <strong>earned</strong>. The FEIE only covers pay for services — wages and
                self-employment income. It does <strong>not</strong> cover investment income, dividends, rental
                income or pensions; for those, the <strong>Foreign Tax Credit</strong> is usually the relevant
                relief.
              </p>
              <p>
                To qualify, you need a tax home in a foreign country and you must meet one of two tests — the{' '}
                <strong>bona fide residence test</strong> or the <strong>physical presence test</strong>. And there
                is an important catch for people in the UK: because UK tax rates are generally higher than US rates,
                the FEIE is often <strong>not</strong> the best choice here. The Foreign Tax Credit frequently does
                more — which is why the decision deserves real thought before you elect.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="FEIE at a glance"
                facts={[
                  { label: 'Form', value: 'Form 2555' },
                  { label: 'Excludes', value: 'Foreign earned income' },
                  { label: 'Limit', value: 'Set annually (inflation-linked)' },
                  { label: 'Covers', value: 'Wages & self-employment only' },
                  { label: 'Qualify via', value: 'Bona fide residence OR 330 days' },
                  { label: 'Re-electing', value: '5-year rule after revoking' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who the FEIE typically suits"
        items={[
          'Americans in lower-tax countries or situations',
          'Those whose earned income is below the annual exclusion limit',
          'Self-employed people working abroad',
          'New arrivals before Foreign Tax Credit carryforwards build up',
          'People without significant investment, rental or pension income',
          'Those who clearly meet the bona fide residence or 330-day test',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">The two qualifying tests</h2>
            <p>
              <strong>Bona fide residence test.</strong> You are a genuine, settled resident of a foreign country for
              an uninterrupted period that includes an entire US tax year. This is about the substance of your life
              abroad, not just day-counting.
            </p>
            <p>
              <strong>Physical presence test.</strong> You are physically present in a foreign country or countries
              for at least <strong>330 full days during any 12 consecutive months</strong>. The days need not be
              consecutive, but they must be full days — and the 12-month window can be chosen to your best advantage.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">FEIE vs the Foreign Tax Credit</h2>
            <p>
              This is the decision that matters most. For Americans in the UK the comparison usually favours the
              Foreign Tax Credit — but not always, and the two can sometimes be combined across different slices of
              income.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <ComparisonTable data={feieVsFtc} />
          </div>
          <div className="mx-auto mt-6 max-w-prose text-[15px] leading-relaxed text-muted">
            <p>
              Read the other side in full on our{' '}
              <Link href="/services/us-expat-tax/foreign-tax-credit" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Foreign Tax Credit guide</Link>, or{' '}
              <Link href="/resources/calculators/double-tax-estimator" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">estimate your double-tax position</Link>.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring errors: treating <strong>investment or rental income as earned</strong> and trying to
              exclude it; <strong>miscounting the 330 days</strong> (part-days and travel days catch people out);
              defaulting to the FEIE in the UK when the <strong>Foreign Tax Credit would have left them better
              off</strong>; and <strong>revoking the election</strong> without realising they then cannot re-elect for
              five years without IRS approval.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Related forms and reliefs</h2>
            <p>
              The FEIE (Form 2555) sits alongside the <strong>Foreign Tax Credit</strong> (Form 1116) and the{' '}
              <strong>US–UK tax treaty</strong>. Used together correctly, they ensure you are not taxed twice — and
              that you keep as many future credits as possible.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="The right election, made deliberately"
        steps={[
          { title: 'Check eligibility', description: 'We confirm whether you meet the bona fide residence or physical presence test, and that your income qualifies.' },
          { title: 'Model the options', description: 'We compare the FEIE against the Foreign Tax Credit — and combinations — for your specific income mix.' },
          { title: 'Elect & file', description: 'We make the election correctly on Form 2555, or advise the Foreign Tax Credit instead where it serves you better.' },
          { title: 'Plan ahead', description: 'We keep the multi-year picture in view, so an election today does not cost you in future years.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Foreign Tax Credit', href: '/services/us-expat-tax/foreign-tax-credit', description: 'Often the stronger option in the UK' },
          { label: 'US–UK Tax Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'How the treaty fits with the FEIE' },
          { label: 'Double-Tax Estimator', href: '/resources/calculators/double-tax-estimator', description: 'Free tool: are you at risk of double tax?' },
          { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns', description: 'Federal filing for Americans abroad' },
          { label: 'US Citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'How we help Americans abroad' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen tax guidance' },
        ]}
      />
    </PageShell>
  );
}
