import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/us-uk-tax-treaty';

export const metadata: Metadata = {
  title: 'The US–UK Tax Treaty Explained — Pensions, Residency & the Saving Clause',
  description:
    'How the US–UK tax treaty coordinates tax between the two countries: pension provisions, the residency tie-breaker, and the saving clause that keeps US citizens taxable. What it does, and what it does not do.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What does the US–UK tax treaty do?',
    a: 'The US–UK tax treaty is an agreement that coordinates how the two countries tax the same income, with the broad aim of preventing double taxation. It contains rules on residency, pensions, and many specific income types, and it works alongside reliefs such as the Foreign Tax Credit and the Foreign Earned Income Exclusion. It does not, however, remove a US citizen\u2019s obligation to file and be taxed by the US.',
  },
  {
    q: 'Does the treaty mean I do not owe US tax?',
    a: 'No — and this surprises many people. The treaty contains a "saving clause" under which the US reserves the right to tax its citizens and green card holders broadly as if the treaty were not in place. So US citizens in the UK still file US returns and remain subject to US tax; the treaty and the foreign tax reliefs work to prevent the same income being taxed twice, rather than exempting US citizens outright.',
  },
  {
    q: 'How does the treaty treat pensions?',
    a: 'The treaty contains specific provisions dealing with UK and US pensions, generally aimed at preventing the same pension income from being taxed twice and at giving cross-border recognition to certain pension arrangements. How any particular pension is treated depends on its type, how and when it pays out, and your circumstances — so pensions are an area to review individually rather than assume a single rule applies.',
  },
  {
    q: 'What is the residency tie-breaker?',
    a: 'If you are treated as a tax resident of both the US and the UK under each country\u2019s own domestic rules, the treaty provides "tie-breaker" rules to determine, for treaty purposes, which country you are resident in. These rules look at factors such as where you have a permanent home and your centre of vital interests. The tie-breaker matters because it affects how various income types are taxed.',
  },
  {
    q: 'What is the saving clause?',
    a: 'The saving clause is the provision that allows the United States to continue taxing its citizens and green card holders as if the treaty did not exist, with limited exceptions. It is the reason the treaty does not simply switch off US taxation for Americans in the UK, and why citizenship-based taxation still applies despite the treaty.',
  },
  {
    q: 'Do I still need to file if the treaty covers my income?',
    a: 'Almost always yes. Treaty benefits generally have to be claimed and documented on your US return, not assumed — and because of the saving clause, US citizens file regardless. Relying on the treaty without filing, or without claiming the benefit correctly, is a common and avoidable mistake.',
  },
];

export default function UsUkTaxTreaty() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · US–UK Treaty"
      title="The US–UK tax treaty explained"
      answer="The US–UK tax treaty coordinates how the two countries tax the same income, with the aim of preventing double taxation. Its most important features for Americans in the UK are its pension provisions, the residency tie-breaker rules for people resident in both countries, and the saving clause — which lets the US keep taxing its citizens broadly as if the treaty were not there. The treaty works alongside the Foreign Tax Credit and FEIE to prevent double tax; it does not exempt US citizens from filing or from US tax."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'US–UK Tax Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-25"
      faqs={faqs}
      service={{
        url: URL,
        name: 'US–UK Tax Treaty Planning',
        description: 'Advising US persons in the UK on how the US–UK tax treaty affects their position — including pensions, residency and the saving clause — and claiming treaty benefits correctly.',
        serviceType: 'Tax Planning',
      }}
      ctaTitle="Wondering how the treaty applies to you?"
      ctaIntro="Pensions, dual residency and treaty claims are where cross-border tax gets genuinely intricate. Book a free consultation and we'll explain exactly how the treaty affects your position."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                The <strong>US–UK tax treaty</strong> is the agreement that sits behind almost everything in
                cross-border tax. Its purpose is to <strong>coordinate</strong> how the United States and the United
                Kingdom tax the same income, so that — between the treaty and the foreign tax reliefs — you are not
                taxed twice on the same money.
              </p>
              <p>
                But there is one feature everyone needs to understand first, because it overturns the most common
                assumption. The treaty contains a <strong>&ldquo;saving clause&rdquo;</strong>, under which the US
                keeps the right to tax its <strong>citizens and green card holders broadly as if the treaty did not
                exist</strong>. In other words, the treaty does <em>not</em> switch off US tax for Americans in the
                UK. They still file, and still fall under US tax — the treaty and reliefs simply stop the same income
                being taxed twice.
              </p>
              <p>
                Within that framework, two areas matter most for the people we advise: <strong>pensions</strong>,
                where the treaty has specific provisions, and the <strong>residency tie-breaker</strong>, which
                decides your treaty residence when both countries consider you resident. Both are genuinely
                fact-specific — which is why this is advice territory, not a one-size rule.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="The treaty at a glance"
                facts={[
                  { label: 'Purpose', value: 'Prevent double taxation' },
                  { label: 'Pensions', value: 'Specific provisions' },
                  { label: 'Dual residents', value: 'Tie-breaker rules' },
                  { label: 'Saving clause', value: 'US still taxes its citizens' },
                  { label: 'Works with', value: 'FTC & FEIE' },
                  { label: 'Benefits', value: 'Claimed on your return' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who the treaty matters most for"
        items={[
          'Americans in the UK with UK or US pensions',
          'People treated as tax-resident in both countries',
          'Dual citizens needing to establish treaty residence',
          'Retirees with cross-border pension or investment income',
          'Anyone relying on the treaty to relieve tax on specific income',
          'US persons who assumed the treaty removes US tax (it does not)',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">The three things to understand</h2>
            <p>
              <strong>1. Pensions.</strong> The treaty contains specific provisions for UK and US pensions, broadly
              aimed at preventing the same pension income from being taxed twice and at giving cross-border
              recognition to certain arrangements. How any <em>particular</em> pension is treated depends on its
              type, how and when it pays out, and your wider position — lump sums, employer schemes and personal
              pensions do not all behave the same way. This is the single most common area where people are given
              confident but wrong answers, so we treat each pension on its own facts rather than applying a blanket
              rule.
            </p>
            <p>
              <strong>2. The residency tie-breaker.</strong> Each country has its own rules for who is a tax
              resident, and it is entirely possible to be resident in both at once. When that happens, the treaty&rsquo;s
              tie-breaker rules decide — for treaty purposes — which country you are resident in, looking at factors
              such as where your permanent home and centre of vital interests lie. That answer then shapes how
              different income is taxed.
            </p>
            <p>
              <strong>3. The saving clause.</strong> As above, this is the provision that lets the US keep taxing its
              citizens and green card holders broadly as though the treaty were not there. It is the reason
              citizenship-based taxation survives the treaty, and the reason treaty benefits for Americans have to be
              read carefully rather than assumed.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common misconceptions</h2>
            <p>
              The big one: <strong>&ldquo;the treaty means I don&rsquo;t owe US tax.&rdquo;</strong> The saving clause
              says otherwise. Others we correct often: assuming a <strong>UK pension is automatically US-tax-free</strong>
              {' '}(it depends entirely on the pension and the facts); believing the treaty <strong>replaces the need
              to file</strong> (it does not — and benefits are generally claimed on the return); and treating the
              treaty as a substitute for the <strong>Foreign Tax Credit or FEIE</strong> rather than a framework that
              works alongside them.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">How it works with the reliefs</h2>
            <p>
              The treaty is the framework; the{' '}
              <Link href="/services/us-expat-tax/foreign-tax-credit" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Foreign Tax Credit</Link>{' '}
              and{' '}
              <Link href="/services/us-expat-tax/foreign-earned-income-exclusion" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Foreign Earned Income Exclusion</Link>{' '}
              are the tools used within it. Together with your{' '}
              <Link href="/services/us-expat-tax/us-tax-returns" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">US tax return</Link>, they form the complete picture that keeps you compliant in both countries
              without paying twice.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="The treaty, applied to your facts"
        steps={[
          { title: 'Establish residence', description: 'We work out your residence position in both countries and apply the tie-breaker where both treat you as resident.' },
          { title: 'Review pensions & income', description: 'We look at how the treaty affects your pensions and specific income types on their own facts.' },
          { title: 'Claim benefits correctly', description: 'We claim available treaty benefits on your US return, properly documented — never just assumed.' },
          { title: 'Coordinate the whole', description: 'We align the treaty with the Foreign Tax Credit, FEIE and your UK filings so the full position works.' },
        ]}
      />

      <RelatedLinks
        title="Further reading"
        links={[
          { label: 'Do I pay US tax on my UK pension?', href: '/resources/blog/do-i-pay-us-tax-on-my-uk-pension', description: 'How the IRS treats UK pensions' },
          { label: 'Is the 25% lump sum taxable in the US?', href: '/resources/blog/is-the-25-percent-uk-lump-sum-taxable-in-the-us', description: 'The contested treaty question, explained' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Foreign Tax Credit', href: '/services/us-expat-tax/foreign-tax-credit', description: 'The main relief used within the treaty' },
          { label: 'FEIE', href: '/services/us-expat-tax/foreign-earned-income-exclusion', description: 'Exclude foreign earned income' },
          { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns', description: 'Where treaty benefits are claimed' },
          { label: 'US Citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'How we help Americans abroad' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen tax guidance' },
          { label: 'Double-Tax Estimator', href: '/resources/calculators/double-tax-estimator', description: 'Free tool: are you at risk of double tax?' },
        ]}
      />
    </PageShell>
  );
}
