import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/foreign-tax-credit';

export const metadata: Metadata = {
  title: 'Foreign Tax Credit for Americans in the UK — Form 1116 Help',
  description:
    'The US Foreign Tax Credit (Form 1116) offsets your US tax with the UK tax you have already paid, usually eliminating double taxation. Learn how it works, FEIE vs FTC, common mistakes, and how we handle it.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const faqs = [
  {
    q: 'What is the Foreign Tax Credit?',
    a: 'The Foreign Tax Credit (FTC) is a dollar-for-dollar US tax credit for income tax you have already paid to another country, claimed on IRS Form 1116. For Americans in the UK, it offsets your US tax bill with the UK tax you paid on the same income, which usually removes any double taxation.',
  },
  {
    q: 'Why do Americans in the UK often end up owing no US tax?',
    a: 'Because UK income tax rates are generally higher than US rates, the UK tax you pay is often more than the US tax due on the same income. The Foreign Tax Credit lets you offset the US liability with that UK tax, so many Americans in the UK owe little or no US tax — though they must still file.',
  },
  {
    q: 'What are excess foreign tax credits, and can I carry them forward?',
    a: 'If the UK tax you paid exceeds the US tax on that income, the unused portion is an excess credit. These excess credits can generally be carried back one year and carried forward up to ten years, within the same income category, so they are not necessarily lost.',
  },
  {
    q: 'Should I use the Foreign Tax Credit or the Foreign Earned Income Exclusion?',
    a: 'It depends on your situation, and the two are not interchangeable. The FEIE excludes earned income up to an annually-set limit; the FTC credits foreign tax paid against your US tax. For many Americans in higher-tax countries like the UK the FTC works better and preserves credits, but the right choice — and whether to combine them — depends on your income mix and goals. It is worth getting advice before electing, as switching back after revoking the FEIE has restrictions.',
  },
  {
    q: 'Can I claim the FEIE and the Foreign Tax Credit on the same income?',
    a: 'No. You cannot use both reliefs on the same dollar of income. You can use the FEIE on earned income up to the limit and the Foreign Tax Credit on income above it, but they cannot overlap on the same amount. Getting this split right is one of the most common areas where returns go wrong.',
  },
  {
    q: 'Which form is used to claim the Foreign Tax Credit?',
    a: 'IRS Form 1116 for individuals. The credit must be calculated separately by category of income (for example, general income versus passive income), which is one reason the form is easy to get wrong without help.',
  },
];

const feieVsFtc = {
  columns: ['', 'Foreign Tax Credit', 'FEIE'],
  highlightColumn: 1,
  rows: [
    { label: 'Form', values: ['Form 1116', 'Form 2555'] },
    { label: 'How it works', values: ['Credits foreign tax paid against US tax', 'Excludes earned income up to a set limit'] },
    { label: 'Best when', values: ['Foreign tax rate is higher (e.g. UK)', 'Foreign tax is low or nil'] },
    { label: 'Covers investment & rental income', values: [true, false] },
    { label: 'Can create carryforwards', values: [true, false] },
    { label: 'Supports US retirement contributions', values: [true, false] },
  ],
};

export default function ForeignTaxCredit() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · Foreign Tax Credit"
      title="The Foreign Tax Credit for Americans in the UK"
      answer="The US Foreign Tax Credit (claimed on Form 1116) gives you a dollar-for-dollar credit for income tax you have already paid to the UK, offsetting your US tax on the same income. Because UK tax rates are generally higher than US rates, the credit usually eliminates double taxation — and often leaves Americans in the UK with excess credits to carry forward. You must still file a US return to claim it."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'Foreign Tax Credit', href: '/services/us-expat-tax/foreign-tax-credit' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-25"
      faqs={faqs}
      service={{
        url: URL,
        name: 'Foreign Tax Credit (Form 1116)',
        description: 'Claiming the US Foreign Tax Credit for Americans in the UK to offset US tax with UK tax paid and avoid double taxation.',
        serviceType: 'Tax Planning',
      }}
      ctaTitle="Make sure you are claiming the right relief"
      ctaIntro="Choosing the Foreign Tax Credit over the FEIE — or combining them correctly — can change what you owe. Book a free consultation and we'll model your position."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                The <strong>Foreign Tax Credit</strong> is the most powerful tool most Americans in the UK have for
                avoiding double taxation. It is a <strong>dollar-for-dollar credit</strong> — not a deduction — for
                income tax you have already paid to the UK, claimed on <strong>IRS Form 1116</strong> and set against
                the US tax on the same income.
              </p>
              <p>
                Here is why it matters so much in the UK specifically: <strong>UK income tax rates are generally
                higher than US rates</strong>. So the UK tax you have already paid is often more than the US tax due
                on that income. The credit offsets your US liability with that UK tax — which is why so many
                Americans in the UK end up owing little or no US tax, even though they must still file a return every
                year.
              </p>
              <p>
                When the UK tax exceeds the US tax on the same income, the unused portion becomes an{' '}
                <strong>excess credit</strong>. These are not necessarily lost — they can generally be carried back
                one year and carried forward up to ten, within the same income category. Used well, they can shelter
                future US tax.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Foreign Tax Credit at a glance"
                facts={[
                  { label: 'Form', value: 'Form 1116' },
                  { label: 'Type', value: 'Credit, not deduction' },
                  { label: 'Offsets', value: 'US tax with UK tax paid' },
                  { label: 'Carryback', value: '1 year' },
                  { label: 'Carryforward', value: 'Up to 10 years' },
                  { label: 'Calculated by', value: 'Income category' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who benefits from the Foreign Tax Credit"
        items={[
          'Americans in the UK with UK-taxed employment income',
          'Dual citizens earning above the earned-income exclusion limit',
          'Those with UK investment, dividend or rental income (which the FEIE cannot exclude)',
          'Anyone wanting to keep contributing to US retirement accounts',
          'People building carryforward credits to shelter future US tax',
          'Higher earners for whom the FEIE alone leaves US tax still owing',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Foreign Tax Credit vs the FEIE</h2>
            <p>
              This is the most important decision in most American-in-the-UK returns. The{' '}
              <strong>Foreign Earned Income Exclusion (FEIE)</strong> excludes earned income up to an annually-set
              limit; the <strong>Foreign Tax Credit</strong> credits the foreign tax you paid against your US tax.
              They are not interchangeable, and the wrong choice can cost you — both now and in future years, because
              revoking a FEIE election carries restrictions on switching back.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <ComparisonTable data={feieVsFtc} />
          </div>
          <div className="mx-auto mt-6 max-w-prose text-[15px] leading-relaxed text-muted">
            <p>
              Want to see the FEIE side in full? Read our{' '}
              <Link href="/services/us-expat-tax/foreign-earned-income-exclusion" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Foreign Earned Income Exclusion guide</Link>, or{' '}
              <Link href="/resources/calculators/double-tax-estimator" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">estimate your double-tax position</Link>{' '}
              in under a minute.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The errors that cost people most are: trying to claim the FEIE and the Foreign Tax Credit on the{' '}
              <strong>same income</strong> (you cannot — they can only apply to different amounts); putting income in
              the <strong>wrong category</strong> on Form 1116, which distorts the credit; <strong>ignoring
              carryforwards</strong> and leaving usable credits on the table; and electing the FEIE in an early year
              without realising the Foreign Tax Credit would have served better — then facing restrictions on
              switching.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Related forms and reliefs</h2>
            <p>
              The Foreign Tax Credit (Form 1116) sits alongside the <strong>FEIE</strong> (Form 2555) and the{' '}
              <strong>US–UK tax treaty</strong>. The art is using them in the right combination and order for your
              income mix — which is exactly what coordinated US–UK advice provides.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="The right relief, claimed correctly"
        steps={[
          { title: 'Review', description: 'We map your income by type and source, and your UK tax paid, to see where the credit applies.' },
          { title: 'Compare', description: 'We model the Foreign Tax Credit against the FEIE — and combinations — to find your best position.' },
          { title: 'Claim', description: 'We prepare Form 1116 correctly by income category, capturing any carrybacks and carryforwards.' },
          { title: 'Coordinate', description: 'We align it with your UK filings and the treaty so the whole picture works together.' },
        ]}
      />

      <RelatedLinks
        title="Further reading"
        links={[
          { label: 'FEIE or Foreign Tax Credit in the UK?', href: '/resources/blog/feie-or-foreign-tax-credit-uk', description: 'Which method usually wins in the UK' },
          { label: 'Do I pay US tax on my UK pension?', href: '/resources/blog/do-i-pay-us-tax-on-my-uk-pension', description: 'Where the credit does most of its work' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Foreign Earned Income Exclusion', href: '/services/us-expat-tax/foreign-earned-income-exclusion', description: 'The other main double-tax relief' },
          { label: 'US–UK Tax Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'How the treaty fits with the FTC' },
          { label: 'Double-Tax Estimator', href: '/resources/calculators/double-tax-estimator', description: 'Free tool: are you at risk of double tax?' },
          { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns', description: 'Federal filing for Americans abroad' },
          { label: 'US Citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'How we help Americans abroad' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen tax guidance' },
        ]}
      />
    </PageShell>
  );
}
