'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/icons';
import { FIG_REGIME } from '@/lib/tax-rates';

type Result = 'eligible' | 'likely' | 'not-eligible' | null;

export default function FigRegimeChecker() {
  const [ukResident, setUkResident] = useState<boolean | null>(null);
  const [tenYearsNonResident, setTenYearsNonResident] = useState<boolean | null>(null);
  const [yearsResident, setYearsResident] = useState<string>('');

  let result: Result = null;
  let reason = '';

  const years = Number(yearsResident);
  if (ukResident === false) {
    result = 'not-eligible';
    reason = 'The FIG regime is only available to UK tax residents. If you are not UK resident, this regime does not apply to you.';
  } else if (ukResident && tenYearsNonResident === false) {
    result = 'not-eligible';
    reason = `The regime requires at least ${FIG_REGIME.priorNonResidenceYears} consecutive tax years of non-UK residence immediately before your arrival. If you don't meet that, you are taxed on the arising basis on your worldwide income and gains.`;
  } else if (ukResident && tenYearsNonResident && yearsResident !== '') {
    if (years <= FIG_REGIME.reliefYears) {
      result = 'eligible';
      reason = `You appear to be within your first ${FIG_REGIME.reliefYears} years of UK residence after the required ${FIG_REGIME.priorNonResidenceYears}-year absence, so you may be able to claim FIG relief for the remaining qualifying years. Each year is claimed separately, and claiming costs you that year's personal allowance and CGT annual exempt amount.`;
    } else {
      result = 'not-eligible';
      reason = `The relief covers only the first ${FIG_REGIME.reliefYears} years of UK residence. Beyond that window you are taxed on the arising basis on worldwide income and gains.`;
    }
  } else if (ukResident && tenYearsNonResident) {
    result = 'likely';
    reason = 'You may qualify — confirm exactly how many years you have been UK resident to see whether you are still inside the 4-year window.';
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Could you claim the 4-year FIG regime?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The Foreign Income &amp; Gains (FIG) regime replaced the remittance basis on{' '}
          {FIG_REGIME.fromDate}. Answer three questions for an indicative eligibility check.
        </p>

        <div className="mt-6">
          <p className="text-sm font-semibold text-ink">1. Are you UK tax resident?</p>
          <div className="mt-2 flex gap-2">
            {[
              { label: 'Yes', v: true },
              { label: 'No', v: false },
            ].map((o) => (
              <button
                key={String(o.v)}
                type="button"
                onClick={() => setUkResident(o.v)}
                className={`rounded-lg border px-5 py-2 text-sm font-medium transition-colors ${
                  ukResident === o.v ? 'border-navy bg-navy text-white' : 'border-mist bg-porcelain text-ink hover:border-navy'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-ink">
            2. Were you non-UK resident for the {FIG_REGIME.priorNonResidenceYears} consecutive tax years before arriving?
          </p>
          <div className="mt-2 flex gap-2">
            {[
              { label: 'Yes', v: true },
              { label: 'No', v: false },
            ].map((o) => (
              <button
                key={String(o.v)}
                type="button"
                onClick={() => setTenYearsNonResident(o.v)}
                className={`rounded-lg border px-5 py-2 text-sm font-medium transition-colors ${
                  tenYearsNonResident === o.v ? 'border-navy bg-navy text-white' : 'border-mist bg-porcelain text-ink hover:border-navy'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-ink">3. How many tax years have you been UK resident?</p>
          <div className="mt-2 flex items-center rounded-lg border border-mist bg-porcelain px-3 sm:max-w-[200px]">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={yearsResident}
              onChange={(e) => setYearsResident(e.target.value)}
              placeholder="e.g. 2"
              className="w-full bg-transparent px-2 py-2.5 text-ink outline-none"
            />
            <span className="pr-1 text-sm text-muted">years</span>
          </div>
        </div>

        {result && (
          <div
            className={`mt-6 rounded-xl border p-6 ${
              result === 'eligible'
                ? 'border-gold/30 bg-navy-ink text-white'
                : result === 'not-eligible'
                  ? 'border-mist bg-porcelain'
                  : 'border-gold/30 bg-porcelain'
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-eyebrow ${
                result === 'eligible' ? 'text-gold' : 'text-gold-antique'
              }`}
            >
              {result === 'eligible' ? 'You may be able to claim' : result === 'likely' ? 'Possibly eligible' : 'Likely not eligible'}
            </p>
            <p className={`mt-2 text-sm leading-relaxed ${result === 'eligible' ? 'text-softwhite/90' : 'text-muted'}`}>
              {reason}
            </p>
          </div>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Indicative only. The FIG claim interacts with the Temporary Repatriation Facility, trusts,
          Overseas Workday Relief, and — for Americans — the US tax position, none of which are modelled
          here. The trade-off of losing allowances means claiming is not always worthwhile.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-mist bg-porcelain p-6">
        <p className="font-display text-lg font-semibold text-ink">New to the UK with foreign income?</p>
        <p className="mt-2 text-sm text-muted">
          Whether to claim the FIG regime — and how it interacts with your US filing if you&rsquo;re
          American — is a genuinely fact-specific decision. We model it across both systems. The first
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
            href="/services/uk-accounting/tax-planning"
            className="inline-flex items-center gap-2 rounded-lg border border-mist px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            Tax planning service
          </Link>
        </div>
      </div>
    </div>
  );
}
