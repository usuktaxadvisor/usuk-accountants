'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/icons';
import { UK_CORP_TAX, TAX_YEAR_LABEL } from '@/lib/tax-rates';

function computeCorpTax(profits: number): { tax: number; effectiveRate: number; basis: string } {
  const { smallProfitsRate, mainRate, lowerLimit, upperLimit, marginalReliefFraction } = UK_CORP_TAX;
  if (profits <= 0) return { tax: 0, effectiveRate: 0, basis: 'No taxable profit' };

  let tax: number;
  let basis: string;

  if (profits <= lowerLimit) {
    tax = profits * smallProfitsRate;
    basis = `Small-profits rate (${smallProfitsRate * 100}%)`;
  } else if (profits >= upperLimit) {
    tax = profits * mainRate;
    basis = `Main rate (${mainRate * 100}%)`;
  } else {
    tax = profits * mainRate - marginalReliefFraction * (upperLimit - profits);
    basis = `Main rate with marginal relief`;
  }

  return {
    tax: Math.round(tax),
    effectiveRate: profits > 0 ? Math.round((tax / profits) * 1000) / 10 : 0,
    basis,
  };
}

export default function CorporationTaxCalculator() {
  const [profitsInput, setProfitsInput] = useState<string>('');
  const profits = Math.max(0, Number(profitsInput) || 0);
  const { tax, effectiveRate, basis } = computeCorpTax(profits);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Estimate your UK Corporation Tax
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter your company&rsquo;s taxable profit for the year. This uses the {TAX_YEAR_LABEL} rates,
          including marginal relief between the lower and upper limits.
        </p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-eyebrow text-muted">
          Taxable profit for the year
        </label>
        <div className="mt-2 flex items-center rounded-lg border border-mist bg-porcelain px-3">
          <span className="text-muted">£</span>
          <input
            type="number"
            inputMode="numeric"
            value={profitsInput}
            onChange={(e) => setProfitsInput(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent px-2 py-2.5 text-ink outline-none"
          />
        </div>

        <div className="mt-6 rounded-xl border border-navy/15 bg-navy-ink p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">
            Estimated Corporation Tax
          </p>
          <p className="mt-1 font-display text-3xl font-semibold">£{tax.toLocaleString()}</p>
          {profits > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-softwhite/85">
              <span>Effective rate: <span className="font-semibold text-gold">{effectiveRate}%</span></span>
              <span>Basis: {basis}</span>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-xl border border-mist bg-porcelain p-5 text-sm text-muted">
          <p className="font-semibold text-ink">How the rate works</p>
          <ul className="mt-2 space-y-1.5">
            <li>Profits up to £{UK_CORP_TAX.lowerLimit.toLocaleString()}: small-profits rate ({UK_CORP_TAX.smallProfitsRate * 100}%).</li>
            <li>Profits over £{UK_CORP_TAX.upperLimit.toLocaleString()}: main rate ({UK_CORP_TAX.mainRate * 100}%).</li>
            <li>In between: main rate tapered down by marginal relief.</li>
          </ul>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Indicative only, for a single standalone company on {TAX_YEAR_LABEL} rates. The limits are
          shared between associated companies and short/long accounting periods adjust them — and for a
          US owner, the same profit can also face US tax under the GILTI/NCTI rules. We model both sides.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-mist bg-porcelain p-6">
        <p className="font-display text-lg font-semibold text-ink">Own a UK company as a US citizen?</p>
        <p className="mt-2 text-sm text-muted">
          UK Corporation Tax is only half the picture — the same profits can trigger US tax under
          GILTI/NCTI. We coordinate both so you don&rsquo;t overpay. The first consultation is free.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
          >
            Book a free consultation <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services/uk-accounting/corporation-tax"
            className="inline-flex items-center gap-2 rounded-lg border border-mist px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            Corporation Tax service
          </Link>
        </div>
      </div>
    </div>
  );
}
