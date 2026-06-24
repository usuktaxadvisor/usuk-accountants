'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck } from '@/components/ui/icons';

/**
 * US Expat Tax Deadlines — date generator.
 *
 * Rules verified against the IRS (citizens & resident aliens abroad) and major
 * expat-tax sources for the standard calendar-year filer. These dates recur
 * each year and are derived from the selected tax year, so the tool stays
 * correct over time rather than hard-coding a single year:
 *
 *   - Tax PAYMENT due: 15 April of (taxYear + 1). Interest runs from this date
 *     on unpaid balances even when filing is extended.
 *   - Automatic expat FILING extension: 15 June (tax home & abode abroad on 15
 *     April; no form required).
 *   - Form 4868 extension to 15 October (must be filed by 15 June for expats).
 *   - Discretionary further extension to 15 December (written request only).
 *   - FBAR (FinCEN 114): 15 April with automatic extension to 15 October.
 *
 * This is general information, not advice. State deadlines, Form 2350 (FEIE
 * qualification), combat-zone/disaster relief and business returns are not
 * modelled and are flagged for a consultation.
 */

interface Deadline {
  date: string;
  title: string;
  detail: string;
  emphasis?: boolean;
}

function buildDeadlines(taxYear: number): Deadline[] {
  const y = taxYear + 1; // filing year
  return [
    {
      date: `15 April ${y}`,
      title: 'Tax payment due',
      detail: `Any US tax owed for ${taxYear} must be paid by this date. Interest accrues from here on unpaid balances even if you file later. Q1 estimated tax for ${y} is also due.`,
      emphasis: true,
    },
    {
      date: `15 April ${y}`,
      title: 'FBAR due (with automatic extension)',
      detail: 'FinCEN Form 114 is technically due now, but an automatic extension to 15 October applies with no action needed.',
    },
    {
      date: `15 June ${y}`,
      title: 'Automatic expat filing deadline',
      detail: 'If your tax home and abode are outside the US on 15 April, you get an automatic two-month extension to file — no form required. To extend further, file Form 4868 by this date.',
      emphasis: true,
    },
    {
      date: `15 October ${y}`,
      title: 'Extended filing deadline (Form 4868)',
      detail: 'If you filed Form 4868, your return is due now. This is also the final FBAR deadline. Missing this date triggers late-filing penalties even with an extension on file.',
      emphasis: true,
    },
    {
      date: `15 December ${y}`,
      title: 'Discretionary final extension',
      detail: 'A further two-month extension may be granted on written request (a letter to the IRS, by 15 October, explaining the reasonable cause). Not automatic and used only for genuinely complex cases.',
    },
  ];
}

export default function UsDeadlinesCalculator() {
  const currentYear = new Date().getFullYear();
  // Default to the most recent completed tax year.
  const defaultTaxYear = new Date().getMonth() >= 3 ? currentYear - 1 : currentYear - 2;
  const [taxYear, setTaxYear] = useState<number>(defaultTaxYear);
  const [abroad, setAbroad] = useState<boolean | null>(null);

  const yearOptions = [currentYear - 1, currentYear - 2, currentYear];
  const deadlines = buildDeadlines(taxYear);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <h2 className="font-display text-2xl font-semibold text-ink">Your US filing dates as an American abroad</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Choose the tax year you are filing for. These are the standard dates for a calendar-year US filer living overseas.
        </p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-eyebrow text-muted">Tax year</label>
        <div className="mt-2 flex gap-2">
          {yearOptions.sort((a, b) => b - a).map((y) => (
            <button
              key={y}
              onClick={() => setTaxYear(y)}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                taxYear === y ? 'border-navy-ink bg-navy-ink text-white' : 'border-mist text-ink hover:bg-porcelain'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {abroad === null && (
          <div className="mt-8 rounded-xl bg-porcelain p-5">
            <p className="text-sm font-medium text-ink">Were your tax home and abode outside the US on 15 April?</p>
            <p className="mt-1 text-sm text-muted">This is what gives you the automatic expat extension to 15 June.</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setAbroad(true)} className="flex-1 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">Yes</button>
              <button onClick={() => setAbroad(false)} className="flex-1 rounded-xl border border-mist px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white">No / not sure</button>
            </div>
          </div>
        )}

        {abroad !== null && (
          <>
            {abroad === false && (
              <p className="mt-6 rounded-xl bg-gold/10 p-4 text-sm leading-relaxed text-ink">
                If you were not abroad on 15 April, the automatic expat extension to 15 June may not apply — your filing deadline would be 15 April, extendable to 15 October via Form 4868. The dates below show the expat timeline for reference; your situation is worth confirming.
              </p>
            )}
            <ol className="mt-8 space-y-4">
              {deadlines.map((d, i) => (
                <li key={i} className={`relative rounded-xl border p-5 ${d.emphasis ? 'border-gold/40 bg-gold/[0.04]' : 'border-mist'}`}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-lg font-semibold text-ink">{d.title}</span>
                    <span className="shrink-0 text-sm font-semibold text-gold-antique">{d.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{d.detail}</p>
                </li>
              ))}
            </ol>

            <p className="mt-4 flex items-start gap-2 text-sm text-muted">
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
              <span>Extensions give more time to <strong className="text-ink">file</strong>, never more time to <strong className="text-ink">pay</strong>. Interest runs from 15 April on anything owed.</span>
            </p>

            <p className="mt-6 border-t border-mist pt-5 text-xs leading-relaxed text-muted">
              These are the standard federal dates for a calendar-year US filer abroad and are provided for general information, not as advice. They do not cover US state deadlines, Form 2350 (where you need more time to qualify for the Foreign Earned Income Exclusion), business or trust returns, or combat-zone and disaster relief. Confirm your own dates with a specialist.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">
                Get help meeting these deadlines
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={() => setAbroad(null)} className="rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">Start over</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
