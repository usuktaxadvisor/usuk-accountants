'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/icons';
import { SA_PENALTIES } from '@/lib/tax-rates';

interface PenaltyLine {
  label: string;
  amount: number;
  note: string;
}

function ukTaxYearLabel(startYear: number): string {
  return `${startYear}/${String((startYear + 1) % 100).padStart(2, '0')}`;
}

function buildPenalties(monthsLate: number, taxOwed: number): PenaltyLine[] {
  const lines: PenaltyLine[] = [];
  if (monthsLate <= 0) return lines;

  lines.push({
    label: 'Immediate fixed penalty',
    amount: SA_PENALTIES.initialLateFiling,
    note: 'Charged the moment you miss the deadline — even if you owe no tax.',
  });

  if (monthsLate >= 3) {
    const days = Math.min(SA_PENALTIES.dailyPenaltyMaxDays, (monthsLate - 3) * 30);
    const daily = days * SA_PENALTIES.dailyPenalty;
    if (daily > 0) {
      lines.push({
        label: `Daily penalties (${days} days)`,
        amount: daily,
        note: `£${SA_PENALTIES.dailyPenalty}/day from 3 months late, up to 90 days (max £900).`,
      });
    }
  }

  if (monthsLate >= 6) {
    const sixMonth = Math.max(SA_PENALTIES.sixMonthPenaltyMin, taxOwed * SA_PENALTIES.sixMonthPenaltyPct);
    lines.push({
      label: '6-month penalty',
      amount: Math.round(sixMonth),
      note: `The greater of 5% of tax due or £${SA_PENALTIES.sixMonthPenaltyMin}.`,
    });
  }

  if (monthsLate >= 12) {
    const twelveMonth = Math.max(SA_PENALTIES.twelveMonthPenaltyMin, taxOwed * SA_PENALTIES.twelveMonthPenaltyPct);
    lines.push({
      label: '12-month penalty',
      amount: Math.round(twelveMonth),
      note: `A further greater of 5% of tax due or £${SA_PENALTIES.twelveMonthPenaltyMin}.`,
    });
  }

  return lines;
}

export default function SelfAssessmentPenaltyCalculator() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const defaultStart = now.getMonth() >= 3 ? currentYear - 1 : currentYear - 2;

  const [startYear, setStartYear] = useState<number>(defaultStart);
  const [monthsLate, setMonthsLate] = useState<number>(0);
  const [taxOwed, setTaxOwed] = useState<string>('');

  const owed = Math.max(0, Number(taxOwed) || 0);
  const penalties = buildPenalties(monthsLate, owed);
  const total = penalties.reduce((s, p) => s + p.amount, 0);

  const filingYear = startYear + 1;
  const yearOptions = [defaultStart + 1, defaultStart, defaultStart - 1];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Your Self Assessment deadlines &amp; penalty estimate
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Choose the tax year and how late you expect to be. Penalty amounts use HMRC&rsquo;s
          standard structure and are indicative.
        </p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-eyebrow text-muted">
          Tax year
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {yearOptions.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setStartYear(y)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                startYear === y
                  ? 'border-navy bg-navy text-white'
                  : 'border-mist bg-porcelain text-ink hover:border-navy'
              }`}
            >
              {ukTaxYearLabel(y)}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-mist bg-porcelain p-5">
          <p className="text-sm font-semibold text-ink">Key dates for {ukTaxYearLabel(startYear)}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><span className="font-medium text-ink">31 October {filingYear}</span> — paper return deadline.</li>
            <li><span className="font-medium text-ink">31 January {filingYear}</span> — online return deadline and balancing payment due.</li>
            <li><span className="font-medium text-ink">31 July {filingYear}</span> — second payment on account (if applicable).</li>
          </ul>
        </div>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-eyebrow text-muted">
          How late is the return?
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: 'On time', v: 0 },
            { label: '1–2 months', v: 1 },
            { label: '3–5 months', v: 3 },
            { label: '6–11 months', v: 6 },
            { label: '12+ months', v: 12 },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setMonthsLate(o.v)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                monthsLate === o.v
                  ? 'border-navy bg-navy text-white'
                  : 'border-mist bg-porcelain text-ink hover:border-navy'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-eyebrow text-muted">
          Tax owed (optional — improves the 6 &amp; 12-month estimate)
        </label>
        <div className="mt-2 flex items-center rounded-lg border border-mist bg-porcelain px-3">
          <span className="text-muted">£</span>
          <input
            type="number"
            inputMode="numeric"
            value={taxOwed}
            onChange={(e) => setTaxOwed(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent px-2 py-2.5 text-ink outline-none"
          />
        </div>

        <div className="mt-6 rounded-xl border border-navy/15 bg-navy-ink p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">
            Estimated late-filing penalties
          </p>
          {penalties.length === 0 ? (
            <p className="mt-2 text-lg font-semibold">No filing penalty — you&rsquo;re on time.</p>
          ) : (
            <>
              <p className="mt-1 font-display text-3xl font-semibold">£{total.toLocaleString()}</p>
              <ul className="mt-4 space-y-3">
                {penalties.map((p) => (
                  <li key={p.label} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium text-softwhite">{p.label}</span>
                      <span className="text-sm font-semibold text-gold">£{p.amount.toLocaleString()}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-softwhite/70">{p.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-softwhite/70">
                Late-<span className="italic">payment</span> penalties (5% of unpaid tax at 30 days, 6 months
                and 12 months) are charged separately, plus interest.
              </p>
            </>
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Indicative only, based on HMRC&rsquo;s standard penalty structure. A reasonable excuse can
          reduce or cancel penalties, and partnership returns differ. We can check your exact position.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-mist bg-porcelain p-6">
        <p className="font-display text-lg font-semibold text-ink">Behind on a return, or facing penalties?</p>
        <p className="mt-2 text-sm text-muted">
          We file Self Assessment returns for cross-border clients and can often reduce penalties with a
          reasonable-excuse claim. The first consultation is free.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
          >
            Book a free consultation <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services/uk-accounting/self-assessment"
            className="inline-flex items-center gap-2 rounded-lg border border-mist px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            Self Assessment service
          </Link>
        </div>
      </div>
    </div>
  );
}
