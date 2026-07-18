import type { Metadata } from 'next';
import {
  PageShell, Section, Container, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import {
  US_FEIE, US_FBAR, US_FATCA_8938, US_STANDARD_DEDUCTION,
  US_FILING_DEADLINES, TREATY_ARTICLES, TREATY_SOURCE, type TaxFigure, UK_ALLOWANCES } from '@/lib/us-uk-tax-data';
import {
  TAX_YEAR_LABEL, UK_INCOME_TAX, UK_CORP_TAX,
} from '@/lib/tax-rates';

const URL = 'https://www.usukaccountants.com/resources/tax-data';

export const metadata: Metadata = {
  title: 'US–UK Tax Data Centre — Limits, Rates, Thresholds & Deadlines',
  description:
    'The definitive reference for US–UK cross-border tax figures: FEIE, FBAR and FATCA thresholds, US and UK tax rates, treaty articles and filing deadlines — each with the official IRS, HMRC or Treasury source.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

function FigureRow({ f }: { f: TaxFigure }) {
  return (
    <tr id={f.id} className="border-t border-mist align-top">
      <td className="px-4 py-4 font-medium text-ink">{f.label}</td>
      <td className="px-4 py-4 whitespace-nowrap font-semibold text-navy">
        {f.value}
        {f.status === 'pending' && (
          <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-amber-800" title="Year-indexed figure — confirm against the official source before relying on it.">
            confirm
          </span>
        )}
      </td>
      <td className="px-4 py-4 text-xs text-muted">{f.taxYear}</td>
      <td className="hidden px-4 py-4 text-sm text-muted md:table-cell">
        {f.note}{' '}
        <a href={f.source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-navy underline hover:text-gold">
          Source: {f.source.name}
        </a>
      </td>
    </tr>
  );
}

function DataTable({ title, figures, id }: { title: string; figures: TaxFigure[]; id: string }) {
  return (
    <div id={id} className="mt-12 scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-mist">
        <table className="w-full text-left text-sm">
          <thead className="bg-porcelain">
            <tr>
              <th className="px-4 py-3 font-display font-semibold text-ink">Figure</th>
              <th className="px-4 py-3 font-display font-semibold text-ink">Amount</th>
              <th className="px-4 py-3 font-display font-semibold text-ink">Year</th>
              <th className="hidden px-4 py-3 font-display font-semibold text-ink md:table-cell">Detail &amp; official source</th>
            </tr>
          </thead>
          <tbody>
            {figures.map((f) => <FigureRow key={f.label} f={f} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: 'What is the FBAR filing threshold?',
    a: 'An FBAR (FinCEN Form 114) is required when the combined value of all your foreign financial accounts exceeds $10,000 at any point during the calendar year. This threshold is fixed and not adjusted for inflation. It is filed with FinCEN, separately from your federal tax return, and is due 15 April with an automatic extension to 15 October.',
  },
  {
    q: 'What is the Foreign Earned Income Exclusion for 2025?',
    a: 'For the 2025 tax year the maximum Foreign Earned Income Exclusion is $130,000 (up from $126,500 in 2024). It is indexed annually for inflation and applies only to earned income — salary and self-employment — not to investment, rental or pension income. Qualifying requires meeting either the bona fide residence or physical presence test.',
  },
  {
    q: 'When are US and UK tax returns due?',
    a: 'US returns are due 15 April, with an automatic extension to 15 June for citizens and residents living abroad and a further extension to 15 October available on request. UK Self Assessment returns are due by 31 January following the end of the tax year (which runs 6 April to 5 April). Because the two systems use different tax years and deadlines, cross-border taxpayers must track both.',
  },
  {
    q: 'Are these figures official?',
    a: 'Yes. Every figure on this page is drawn from the official source — the IRS, FinCEN, HM Revenue & Customs or the US Treasury — and each is linked directly. Amounts that are indexed annually are marked with their tax year, so you can see exactly which year they apply to. For reliance on a specific filing, always confirm the current-year figure against the linked source or with a specialist.',
  },
];

export default function TaxDataCentre() {
  const ukRates: TaxFigure[] = [
    {
      label: 'UK personal allowance',
      value: `£${UK_INCOME_TAX.personalAllowance.toLocaleString()}`,
      taxYear: TAX_YEAR_LABEL,
      note: 'The tax-free personal allowance, tapered away for income over £200,000.',
      source: { name: 'HMRC — Income Tax rates and allowances', url: 'https://www.gov.uk/income-tax-rates' },
      status: 'stable',
    },
    {
      label: 'UK basic rate',
      value: '20%',
      taxYear: TAX_YEAR_LABEL,
      note: `Applies to taxable income up to £${UK_INCOME_TAX.bands[0].upTo.toLocaleString()} (England, Wales & NI; Scotland differs).`,
      source: { name: 'HMRC — Income Tax rates and allowances', url: 'https://www.gov.uk/income-tax-rates' },
      status: 'stable',
    },
    {
      label: 'UK higher rate',
      value: '40%',
      taxYear: TAX_YEAR_LABEL,
      note: `Applies to income between £${UK_INCOME_TAX.bands[0].upTo.toLocaleString()} and £${UK_INCOME_TAX.bands[1].upTo.toLocaleString()}.`,
      source: { name: 'HMRC — Income Tax rates and allowances', url: 'https://www.gov.uk/income-tax-rates' },
      status: 'stable',
    },
    {
      label: 'UK additional rate',
      value: '45%',
      taxYear: TAX_YEAR_LABEL,
      note: `Applies to income above £${UK_INCOME_TAX.bands[1].upTo.toLocaleString()}.`,
      source: { name: 'HMRC — Income Tax rates and allowances', url: 'https://www.gov.uk/income-tax-rates' },
      status: 'stable',
    },
    {
      label: 'UK Corporation Tax — main rate',
      value: '25%',
      taxYear: TAX_YEAR_LABEL,
      note: `Applies to profits above £${UK_CORP_TAX.upperLimit.toLocaleString()}; a 19% small profits rate applies below £${UK_CORP_TAX.lowerLimit.toLocaleString()}, with marginal relief between.`,
      source: { name: 'HMRC — Corporation Tax rates', url: 'https://www.gov.uk/corporation-tax-rates' },
      status: 'stable',
    },
    {
      label: 'UK Self Assessment deadline',
      value: '31 January',
      taxYear: 'Annual',
      note: 'Online filing and payment deadline, following the end of the UK tax year on 5 April.',
      source: { name: 'HMRC — Self Assessment deadlines', url: 'https://www.gov.uk/self-assessment-tax-returns/deadlines' },
      status: 'stable',
    },
  ];

  return (
    <PageShell
      url={URL}
      eyebrow="Tax Data Centre"
      title="US–UK tax data: limits, rates & deadlines"
      answer="This is a sourced reference for the figures that matter in US–UK cross-border tax. For 2025, the Foreign Earned Income Exclusion is $130,000 and the FBAR threshold is $10,000 (any point in the year). US returns are due 15 April (auto-extended to 15 June for those abroad); UK Self Assessment is due 31 January. UK rates for 2025/26: 20% basic, 40% higher, 45% additional, with a £12,570 personal allowance and a 25% Corporation Tax main rate. Every figure below links to its official IRS, FinCEN or HMRC source."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Tax Data Centre', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-07-01"
      faqs={faqs}
      ctaTitle="Need these figures applied to your situation?"
      ctaIntro="The numbers are the easy part — how they interact for your specific US–UK position is where advice matters. Email us a question free, or book a consultation."
    >
      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-4xl">
            <p className="rounded-xl border border-gold/30 bg-gold/5 p-5 text-sm leading-relaxed text-muted">
              <strong className="text-ink">How to use this page.</strong> Every figure is drawn from the
              official source and linked directly. Amounts indexed annually are marked with their tax year.
              A figure tagged <span className="rounded bg-amber-100 px-1 text-[10px] font-semibold uppercase text-amber-800">confirm</span> is
              inflation-indexed and should be checked against the linked official source for the current year
              before you rely on it. This is a reference, not advice — for a specific filing, confirm the
              figure against the source or with a specialist.
            </p>

            <DataTable id="us-expat" title="US federal figures (expat)" figures={[US_FEIE, US_FBAR, ...US_FATCA_8938, ...US_STANDARD_DEDUCTION]} />
            <DataTable id="us-deadlines" title="US filing deadlines" figures={US_FILING_DEADLINES} />
            <DataTable id="uk-rates" title={`UK rates & deadlines (${TAX_YEAR_LABEL})`} figures={ukRates} />
            <DataTable id="uk-allowances" title="UK allowances & thresholds" figures={UK_ALLOWANCES} />

            <div id="treaty" className="mt-12 scroll-mt-24">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Key US–UK tax treaty articles
              </h2>
              <div className="mt-5 space-y-3">
                {TREATY_ARTICLES.map((a) => (
                  <div key={a.article} className="rounded-xl border border-mist bg-white p-5">
                    <p className="font-display font-semibold text-ink">
                      <span className="text-gold-antique">{a.article}</span> — {a.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.summary}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                Full text:{' '}
                <a href={TREATY_SOURCE.url} target="_blank" rel="noopener noreferrer" className="font-medium text-navy underline hover:text-gold">
                  {TREATY_SOURCE.name}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <RelatedLinks
        title="Put these figures to work"
        links={[
          { label: 'Calculators', href: '/resources/calculators', description: 'Estimate your position using these rates.' },
          { label: 'Tax glossary', href: '/resources/glossary', description: 'Plain-English definitions of every term here.' },
          { label: 'Filing deadlines calendar', href: '/resources/guides/tax-deadlines-calendar', description: 'Every US and UK date in one place.' },
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'How we handle the US side.' },
        ]}
      />
    </PageShell>
  );
}
