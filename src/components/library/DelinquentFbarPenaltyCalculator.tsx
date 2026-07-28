'use client';

import { useState } from 'react';
import Link from 'next/link';

type IncomeReported = 'yes' | 'no' | null;
type Willful = 'non-willful' | 'unsure' | 'willful' | null;

interface Outcome {
  route: string;
  routeHref: string;
  exposure: string;
  summary: string;
  tone: 'good' | 'caution' | 'warning';
}

function assess(income: IncomeReported, willful: Willful): Outcome | null {
  if (!income) return null;
  if (income === 'yes') {
    return {
      route: 'Delinquent FBAR Submission Procedures',
      routeHref: '/resources/guides/delinquent-fbar',
      exposure: 'Typically no penalty where income was properly reported and tax paid.',
      summary:
        'Because your foreign income was reported and tax was paid, late FBARs can usually be e-filed with a reasonable-cause statement, generally without penalty.',
      tone: 'good',
    };
  }
  if (!willful) return null;
  if (willful === 'non-willful') {
    return {
      route: 'Streamlined Filing Compliance Procedures',
      routeHref: '/services/us-expat-tax/streamlined-filing',
      exposure: 'Reduced or nil offshore penalty for those who qualify as non-willful and reside abroad.',
      summary:
        'Unreported income plus non-willful conduct usually points to the Streamlined route, which requires a non-willfulness certification (Form 14653 for those abroad).',
      tone: 'caution',
    };
  }
  return {
    route: 'Speak to a specialist before acting',
    routeHref: '/book',
    exposure: 'Willful cases can carry substantially higher exposure and may require the Voluntary Disclosure Practice.',
    summary:
      'Where conduct may have been willful, or you are unsure, do not self-file. The right programme is highly fact-specific. Book a confidential consultation first.',
    tone: 'warning',
  };
}

export default function DelinquentFbarPenaltyCalculator() {
  const [income, setIncome] = useState<IncomeReported>(null);
  const [willful, setWillful] = useState<Willful>(null);
  const outcome = assess(income, willful);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 font-display text-2xl font-semibold leading-snug text-ink">Estimate your FBAR penalty exposure</h2>
      <p className="mb-4 text-sm text-slate-500">
        Answer up to two questions to see which IRS catch-up procedure typically applies.
      </p>
      <fieldset className="mb-6">
        <legend className="mb-2 font-medium text-slate-800">
          1. Was the income from your foreign accounts reported on your US tax returns?
        </legend>
        <div className="flex flex-wrap gap-2">
          {([['yes', 'Yes - income was reported'], ['no', 'No - income was not reported']] as [Exclude<IncomeReported, null>, string][]).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setIncome(val)}
              className={income === val ? 'rounded-lg border border-navy bg-navy px-4 py-2 text-sm text-white' : 'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:border-navy'}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      {income === 'no' && (
        <fieldset className="mb-6">
          <legend className="mb-2 font-medium text-slate-800">2. How would you describe the failure to report?</legend>
          <div className="flex flex-wrap gap-2">
            {([['non-willful', 'Non-willful (unaware)'], ['unsure', 'Not sure'], ['willful', 'Possibly willful']] as [Exclude<Willful, null>, string][]).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setWillful(val)}
                className={willful === val ? 'rounded-lg border border-navy bg-navy px-4 py-2 text-sm text-white' : 'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:border-navy'}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {outcome && (
        <div className={outcome.tone === 'good' ? 'mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5' : outcome.tone === 'caution' ? 'mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5' : 'mt-4 rounded-xl border border-red-200 bg-red-50 p-5'}>
          <h3 className="mb-1 font-semibold text-slate-900">Recommended route: {outcome.route}</h3>
          <p className="mb-2 text-sm text-slate-700">{outcome.summary}</p>
          <p className="mb-3 text-sm font-medium text-slate-800">{outcome.exposure}</p>
          <Link href={outcome.routeHref} className="inline-block rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Learn more
          </Link>
        </div>
      )}
      <p className="mt-5 text-xs text-slate-400">
        Estimates only. Every situation is fact-specific — speak to a specialist before acting.
      </p>
    </div>
  );
}
