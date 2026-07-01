'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/icons';

const FEIE_CAP = 126500;

function usFederalApprox(income: number): number {
  const bands: { upTo: number; eff: number }[] = [
    { upTo: 11600, eff: 0.10 },
    { upTo: 47150, eff: 0.12 },
    { upTo: 100525, eff: 0.18 },
    { upTo: 191950, eff: 0.24 },
    { upTo: 243725, eff: 0.29 },
    { upTo: Infinity, eff: 0.33 },
  ];
  return income * bands.find((b) => income <= b.upTo)!.eff;
}

type Result = {
  recommendation: 'FTC likely' | 'FEIE worth modelling' | 'Depends — model both';
  reason: string;
  usTaxApprox: number;
  ukTaxApprox: number;
  excessCredit: number;
  overCap: boolean;
  hasUnearned: boolean;
};

function evaluate(earned: number, unearned: number, ukEffRate: number): Result {
  const usTax = Math.round(usFederalApprox(earned + unearned));
  const ukTax = Math.round((earned + unearned) * (ukEffRate / 100));
  const excessCredit = Math.max(0, ukTax - usTax);
  const overCap = earned > FEIE_CAP;
  const hasUnearned = unearned > 0;

  let recommendation: Result['recommendation'];
  let reason: string;

  if (ukEffRate >= 20 && excessCredit > 0) {
    recommendation = 'FTC likely';
    reason =
      'The UK tax on this income looks higher than the US tax on it, so the Foreign Tax Credit would generally offset your US bill and may leave excess credits to carry forward. The FEIE would waste that UK tax and do nothing for any unearned income.';
  } else if (earned > 0 && ukEffRate < 15 && !hasUnearned && !overCap) {
    recommendation = 'FEIE worth modelling';
    reason =
      'With relatively low foreign tax on earned income under the exclusion cap and no unearned income, the FEIE could remove US tax on your salary. The Foreign Tax Credit may still compete, so both are worth modelling.';
  } else {
    recommendation = 'Depends — model both';
    reason =
      'Your mix of earned and unearned income, the UK rate, and the exclusion cap make this a genuine toss-up that should be modelled on your actual figures rather than estimated.';
  }

  return { recommendation, reason, usTaxApprox: usTax, ukTaxApprox: ukTax, excessCredit, overCap, hasUnearned };
}

export default function FeieVsFtcCalculator() {
  const [earnedInput, setEarnedInput] = useState<string>('');
  const [unearnedInput, setUnearnedInput] = useState<string>('');
  const [ukEffRate, setUkEffRate] = useState<number>(25);

  const earned = Math.max(0, Number(earnedInput) || 0);
  const unearned = Math.max(0, Number(unearnedInput) || 0);
  const hasInput = earned > 0 || unearned > 0;
  const r = hasInput ? evaluate(earned, unearned, ukEffRate) : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <h2 className="font-display text-2xl font-semibold text-ink">
          FEIE vs Foreign Tax Credit
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A directional guide to which relief is likely to suit an American in the UK. Enter your income
          in US dollars and set an approximate UK effective tax rate. This is a planning aid, not a tax
          calculation.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-eyebrow text-muted">
              Earned income ($ — salary, self-employment)
            </label>
            <div className="mt-2 flex items-center rounded-lg border border-mist bg-porcelain px-3">
              <span className="text-muted">$</span>
              <input
                type="number"
                inputMode="numeric"
                value={earnedInput}
                onChange={(e) => setEarnedInput(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent px-2 py-2.5 text-ink outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-eyebrow text-muted">
              Unearned income ($ — dividends, rent, gains)
            </label>
            <div className="mt-2 flex items-center rounded-lg border border-mist bg-porcelain px-3">
              <span className="text-muted">$</span>
              <input
                type="number"
                inputMode="numeric"
                value={unearnedInput}
                onChange={(e) => setUnearnedInput(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent px-2 py-2.5 text-ink outline-none"
              />
            </div>
          </div>
        </div>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-eyebrow text-muted">
          Approximate UK effective tax rate: {ukEffRate}%
        </label>
        <input
          type="range"
          min={0}
          max={45}
          step={1}
          value={ukEffRate}
          onChange={(e) => setUkEffRate(Number(e.target.value))}
          className="mt-2 w-full accent-navy"
        />
        <p className="mt-1 text-xs text-muted">
          Your UK tax as a share of total income. Most UK higher-rate taxpayers sit around 25–40%.
        </p>

        {r && (
          <div className="mt-6 rounded-xl border border-navy/15 bg-navy-ink p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">
              Indicative direction
            </p>
            <p className="mt-1 font-display text-2xl font-semibold">{r.recommendation}</p>
            <p className="mt-2 text-sm leading-relaxed text-softwhite/85">{r.reason}</p>
            <ul className="mt-4 space-y-1 border-t border-white/15 pt-4 text-xs text-softwhite/70">
              <li>Approx US tax on this income: ${r.usTaxApprox.toLocaleString()}</li>
              <li>Approx UK tax on this income: ${r.ukTaxApprox.toLocaleString()}</li>
              {r.excessCredit > 0 && (
                <li>Potential excess foreign tax credit: ${r.excessCredit.toLocaleString()} (may carry forward)</li>
              )}
              {r.overCap && (
                <li>Earned income exceeds the ~${FEIE_CAP.toLocaleString()} FEIE cap — the excess isn&rsquo;t excludable.</li>
              )}
              {r.hasUnearned && (
                <li>The FEIE does not cover your unearned income — only the FTC can relieve that.</li>
              )}
            </ul>
          </div>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Indicative only, using coarse effective-rate assumptions and the 2024 FEIE cap. It does not model
          the interaction with the child tax credit, the FEIE&rsquo;s five-year revocation rule, housing
          exclusions, state tax, or self-employment tax. The right choice — and it is often a multi-year
          decision, not a single-year one — depends on your specific facts. Treat this as a prompt for advice,
          not the answer.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-mist bg-porcelain p-6">
        <p className="font-display text-lg font-semibold text-ink">This is one of the most consequential choices you&rsquo;ll make</p>
        <p className="mt-2 text-sm text-muted">
          The FEIE and FTC interact in ways that play out over years, and switching between them has rules and
          costs. Before you choose, it&rsquo;s worth modelling both on your real numbers. The first
          consultation is free.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
          >
            Book a free consultation <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/resources/blog/feie-or-foreign-tax-credit-uk"
            className="inline-flex items-center gap-2 rounded-lg border border-mist px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            Read the full comparison
          </Link>
        </div>
      </div>
    </div>
  );
}
