'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/icons';
import { UK_INCOME_TAX, UK_NI_EMPLOYEE, TAX_YEAR_LABEL } from '@/lib/tax-rates';

function ukTakeHome(gross: number): { tax: number; ni: number; net: number } {
  if (gross <= 0) return { tax: 0, ni: 0, net: 0 };

  let pa = UK_INCOME_TAX.personalAllowance;
  if (gross > UK_INCOME_TAX.paTaperThreshold) {
    pa = Math.max(0, pa - (gross - UK_INCOME_TAX.paTaperThreshold) / 2);
  }

  let tax = 0;
  const taxable = Math.max(0, gross - pa);
  let remaining = taxable;
  let bandStart = pa;
  for (const band of UK_INCOME_TAX.bands) {
    if (remaining <= 0) break;
    const bandWidth = band.upTo === Infinity ? Infinity : band.upTo - bandStart;
    const amountInBand = Math.min(remaining, bandWidth);
    if (amountInBand > 0) {
      tax += amountInBand * band.rate;
      remaining -= amountInBand;
    }
    bandStart = band.upTo;
  }

  let ni = 0;
  const { primaryThreshold, upperEarningsLimit, mainRate, upperRate } = UK_NI_EMPLOYEE;
  if (gross > primaryThreshold) {
    const mainBand = Math.min(gross, upperEarningsLimit) - primaryThreshold;
    if (mainBand > 0) ni += mainBand * mainRate;
    if (gross > upperEarningsLimit) ni += (gross - upperEarningsLimit) * upperRate;
  }

  tax = Math.round(tax);
  ni = Math.round(ni);
  return { tax, ni, net: gross - tax - ni };
}

function usFederalApprox(gross: number): number {
  const bands: { upTo: number; eff: number }[] = [
    { upTo: 11600, eff: 0.10 },
    { upTo: 47150, eff: 0.12 },
    { upTo: 100525, eff: 0.18 },
    { upTo: 191950, eff: 0.24 },
    { upTo: 243725, eff: 0.29 },
    { upTo: Infinity, eff: 0.33 },
  ];
  const band = bands.find((b) => gross <= b.upTo)!;
  return gross * band.eff;
}

function usTakeHome(gross: number, stateRate: number): { fed: number; fica: number; state: number; net: number } {
  if (gross <= 0) return { fed: 0, fica: 0, state: 0, net: 0 };
  const fed = Math.round(usFederalApprox(gross));
  const ssWageBase = 168600;
  const fica = Math.round(Math.min(gross, ssWageBase) * 0.062 + gross * 0.0145);
  const state = Math.round(gross * (stateRate / 100));
  return { fed, fica, state, net: gross - fed - fica - state };
}

export default function TakeHomePayCalculator() {
  const [ukGrossInput, setUkGrossInput] = useState<string>('');
  const [usGrossInput, setUsGrossInput] = useState<string>('');
  const [stateRate, setStateRate] = useState<number>(0);

  const ukGross = Math.max(0, Number(ukGrossInput) || 0);
  const usGross = Math.max(0, Number(usGrossInput) || 0);

  const uk = ukTakeHome(ukGross);
  const us = usTakeHome(usGross, stateRate);

  const ukPct = ukGross > 0 ? Math.round((uk.net / ukGross) * 100) : 0;
  const usPct = usGross > 0 ? Math.round((us.net / usGross) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Compare take-home pay: UK vs US
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter a gross salary in each system to compare the proportion you keep after the main income
          taxes and social contributions. This is a directional comparison for weighing a move — enter
          each salary in its own currency.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-eyebrow text-muted">
              UK gross salary (£)
            </label>
            <div className="mt-2 flex items-center rounded-lg border border-mist bg-porcelain px-3">
              <span className="text-muted">£</span>
              <input
                type="number"
                inputMode="numeric"
                value={ukGrossInput}
                onChange={(e) => setUkGrossInput(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent px-2 py-2.5 text-ink outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-eyebrow text-muted">
              US gross salary ($)
            </label>
            <div className="mt-2 flex items-center rounded-lg border border-mist bg-porcelain px-3">
              <span className="text-muted">$</span>
              <input
                type="number"
                inputMode="numeric"
                value={usGrossInput}
                onChange={(e) => setUsGrossInput(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent px-2 py-2.5 text-ink outline-none"
              />
            </div>
          </div>
        </div>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-eyebrow text-muted">
          US state income tax rate: {stateRate}%
        </label>
        <input
          type="range"
          min={0}
          max={13}
          step={0.5}
          value={stateRate}
          onChange={(e) => setStateRate(Number(e.target.value))}
          className="mt-2 w-full accent-navy"
        />
        <p className="mt-1 text-xs text-muted">
          0% for states like Texas or Florida; ~13% at the top in California. Set to match where you&rsquo;d live.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-navy/15 bg-navy-ink p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">UK take-home</p>
            <p className="mt-1 font-display text-2xl font-semibold">£{uk.net.toLocaleString()}</p>
            <p className="text-sm text-softwhite/80">{ukPct}% of gross</p>
            {ukGross > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-softwhite/70">
                <li>Income tax: £{uk.tax.toLocaleString()}</li>
                <li>National Insurance: £{uk.ni.toLocaleString()}</li>
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-navy/15 bg-navy-ink p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">US take-home</p>
            <p className="mt-1 font-display text-2xl font-semibold">${us.net.toLocaleString()}</p>
            <p className="text-sm text-softwhite/80">{usPct}% of gross</p>
            {usGross > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-softwhite/70">
                <li>Federal (approx): ${us.fed.toLocaleString()}</li>
                <li>FICA: ${us.fica.toLocaleString()}</li>
                <li>State: ${us.state.toLocaleString()}</li>
              </ul>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Indicative only. The UK figures use {TAX_YEAR_LABEL} rates (England/Wales/NI; Scotland differs).
          The US figure is a simplified single-filer estimate — real US tax depends on filing status,
          deductions, and your state. This compares <span className="italic">domestic</span> take-home; it
          does not model the cross-border case where US citizens in the UK file in both systems.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-mist bg-porcelain p-6">
        <p className="font-display text-lg font-semibold text-ink">Planning a move across the Atlantic?</p>
        <p className="mt-2 text-sm text-muted">
          Take-home pay is only part of it — if you&rsquo;re American, you&rsquo;ll likely file in both
          countries. We help you understand the real after-tax picture before you move. The first
          consultation is free.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
          >
            Book a consultation <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/who-we-help/us-citizens-in-uk"
            className="inline-flex items-center gap-2 rounded-lg border border-mist px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            How we help Americans in the UK
          </Link>
        </div>
      </div>
    </div>
  );
}
