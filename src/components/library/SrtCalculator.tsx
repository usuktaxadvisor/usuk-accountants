'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck } from '@/components/ui/icons';

/**
 * UK Statutory Residence Test (SRT) — indicative checker.
 *
 * Logic verified against HMRC RDR3 guidance and the Finance Act 2013 Sch 45
 * thresholds (current for 2025/26). The tool applies the three stages in the
 * legally required order and stops at the first that resolves:
 *
 *  1. Automatic Overseas Tests (establish NON-residence):
 *     - Previously resident (resident in any of prior 3 yrs) & < 16 UK days.
 *     - Not previously resident (resident in none of prior 3 yrs) & < 46 UK days.
 *     - Full-time work overseas, < 91 UK days, < 31 UK workdays. (Asked simply.)
 *  2. Automatic UK Test (establish residence): >= 183 UK days.
 *     (The "only home in UK" and "full-time work in UK" automatic UK tests are
 *      more fact-specific and are flagged for advice rather than auto-decided.)
 *  3. Sufficient Ties Test: day-count vs number of ties, using the statutory
 *     table, split by "arriver" (not resident in prior 3 yrs) vs "leaver"
 *     (resident in >= 1 of prior 3 yrs).
 *
 * A "UK day" = present in the UK at midnight. This is an educational indication,
 * NOT advice and NOT a determination. Edge cases (split-year, deeming rule,
 * exceptional circumstances, the other automatic UK tests) are deliberately
 * routed to a consultation.
 */

type Step = 'days' | 'history' | 'work' | 'ties' | 'result';

interface State {
  ukDays: number | null;
  prevResident: boolean | null; // resident in any of the previous 3 tax years
  fullTimeOverseas: boolean | null;
  ties: number | null;
}

// Sufficient-ties resident thresholds. Value = MINIMUM ties to be UK resident
// at that day band. null = cannot be resident via ties in that band.
function tiesNeededToBeResident(ukDays: number, leaver: boolean): number | null {
  if (leaver) {
    if (ukDays <= 15) return null; // resolved earlier by AOT anyway
    if (ukDays <= 45) return 4;
    if (ukDays <= 90) return 3;
    if (ukDays <= 120) return 2;
    return 1; // 121–182
  } else {
    if (ukDays <= 45) return null;
    if (ukDays <= 90) return 4;
    if (ukDays <= 120) return 3;
    return 2; // 121–182
  }
}

export default function SrtCalculator() {
  const [step, setStep] = useState<Step>('days');
  const [s, setS] = useState<State>({ ukDays: null, prevResident: null, fullTimeOverseas: null, ties: null });

  function update(patch: Partial<State>) {
    setS((prev) => ({ ...prev, ...patch }));
  }

  function reset() {
    setS({ ukDays: null, prevResident: null, fullTimeOverseas: null, ties: null });
    setStep('days');
  }

  // ---- Determination ----
  type Outcome = {
    status: 'resident' | 'non-resident' | 'ties-needed';
    headline: string;
    reason: string;
    viaTies?: { needed: number; have: number };
  };

  function determine(): Outcome {
    const days = s.ukDays ?? 0;

    // Automatic UK test (183+)
    if (days >= 183) {
      return {
        status: 'resident',
        headline: 'Likely UK resident',
        reason: 'Spending 183 or more days in the UK in the tax year is an automatic UK residence test — you are UK resident regardless of ties or work pattern.',
      };
    }

    // Automatic Overseas tests
    if (s.fullTimeOverseas && days < 91) {
      return {
        status: 'non-resident',
        headline: 'Likely UK non-resident',
        reason: 'You work full-time overseas, spent fewer than 91 days in the UK, and (on the basis given) worked in the UK on fewer than 31 days — this meets the third automatic overseas test, so you are non-resident for the year.',
      };
    }
    if (s.prevResident === true && days < 16) {
      return {
        status: 'non-resident',
        headline: 'Likely UK non-resident',
        reason: 'You were UK resident in one or more of the previous three tax years but spent fewer than 16 days in the UK this year — this meets the automatic overseas test, so you are non-resident.',
      };
    }
    if (s.prevResident === false && days < 46) {
      return {
        status: 'non-resident',
        headline: 'Likely UK non-resident',
        reason: 'You were not UK resident in any of the previous three tax years and spent fewer than 46 days in the UK this year — this meets the automatic overseas test, so you are non-resident.',
      };
    }

    // Sufficient ties test
    const leaver = s.prevResident === true;
    const needed = tiesNeededToBeResident(days, leaver);
    const have = s.ties ?? 0;
    if (needed === null) {
      return {
        status: 'non-resident',
        headline: 'Likely UK non-resident',
        reason: 'At your day count, the sufficient ties test cannot make you UK resident for the year.',
      };
    }
    if (have >= needed) {
      return {
        status: 'resident',
        headline: 'Likely UK resident',
        reason: `Under the sufficient ties test, at ${days} UK days a ${leaver ? '"leaver"' : '"arriver"'} becomes UK resident with ${needed} or more ties. You indicated ${have}.`,
        viaTies: { needed, have },
      };
    }
    return {
      status: 'non-resident',
      headline: 'Likely UK non-resident',
      reason: `Under the sufficient ties test, at ${days} UK days a ${leaver ? '"leaver"' : '"arriver"'} would need ${needed} ties to be UK resident. You indicated ${have}, so you fall below the threshold.`,
      viaTies: { needed, have },
    };
  }

  const stepIndex = { days: 0, history: 1, work: 2, ties: 3, result: 4 }[step];
  const progress = Math.round((stepIndex / 4) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span>{step === 'result' ? 'Complete' : `Step ${stepIndex + 1} of 4`}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        {step === 'days' && (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink">How many days will you spend in the UK this tax year?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Count any day you are in the UK at midnight (the end of the day). The UK tax year runs 6 April to 5 April.
            </p>
            <input
              type="number"
              min={0}
              max={366}
              value={s.ukDays ?? ''}
              onChange={(e) => update({ ukDays: e.target.value === '' ? null : Math.max(0, Math.min(366, Number(e.target.value))) })}
              placeholder="e.g. 60"
              className="mt-6 w-full rounded-xl border border-mist px-4 py-3.5 text-lg text-ink outline-none transition-colors focus:border-gold"
            />
            <button
              onClick={() => setStep('history')}
              disabled={s.ukDays === null}
              className="mt-6 w-full rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </>
        )}

        {step === 'history' && (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink">Were you UK tax resident in any of the previous three tax years?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This decides whether you are treated as a &ldquo;leaver&rdquo; (recently resident) or an &ldquo;arriver&rdquo;, which changes the day thresholds.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => { update({ prevResident: true }); setStep('work'); }} className="flex-1 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">Yes</button>
              <button onClick={() => { update({ prevResident: false }); setStep('work'); }} className="flex-1 rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">No</button>
            </div>
            <button onClick={() => setStep('days')} className="mt-6 text-sm font-medium text-muted transition-colors hover:text-gold-antique">← Back</button>
          </>
        )}

        {step === 'work' && (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink">Do you work full-time overseas this tax year?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Broadly: averaging 35+ hours a week of overseas work across the year, with no significant break, fewer than 91 UK days, and UK work on fewer than 31 days. Choose &ldquo;No / not sure&rdquo; if this does not clearly describe you.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => { update({ fullTimeOverseas: true }); setStep('ties'); }} className="flex-1 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">Yes</button>
              <button onClick={() => { update({ fullTimeOverseas: false }); setStep('ties'); }} className="flex-1 rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">No / not sure</button>
            </div>
            <button onClick={() => setStep('history')} className="mt-6 text-sm font-medium text-muted transition-colors hover:text-gold-antique">← Back</button>
          </>
        )}

        {step === 'ties' && (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink">How many UK ties do you have?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">Count how many of these apply to you:</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li className="flex gap-2"><span className="text-gold">·</span> <strong className="text-ink">Family</strong> — spouse, civil partner, cohabiting partner or minor child is UK resident.</li>
              <li className="flex gap-2"><span className="text-gold">·</span> <strong className="text-ink">Accommodation</strong> — a place to live available in the UK for 91+ continuous days, used at least once.</li>
              <li className="flex gap-2"><span className="text-gold">·</span> <strong className="text-ink">Work</strong> — 40 or more UK workdays (3+ hours of work) in the year.</li>
              <li className="flex gap-2"><span className="text-gold">·</span> <strong className="text-ink">90-day</strong> — 90+ UK days in either of the two previous tax years.</li>
              <li className="flex gap-2"><span className="text-gold">·</span> <strong className="text-ink">Country</strong> — the UK is where you are present most (only counts if you were UK resident in one of the last three years).</li>
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => { update({ ties: n }); setStep('result'); }}
                  className="rounded-xl border border-mist px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-navy-ink hover:bg-navy-ink hover:text-white"
                >
                  {n}
                </button>
              ))}
            </div>
            <button onClick={() => setStep('work')} className="mt-6 text-sm font-medium text-muted transition-colors hover:text-gold-antique">← Back</button>
          </>
        )}

        {step === 'result' && (() => {
          const o = determine();
          const resident = o.status === 'resident';
          return (
            <>
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${resident ? 'bg-navy-ink text-gold' : 'bg-gold/10 text-gold-antique'}`}>
                <IconCheck className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">{o.headline}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{o.reason}</p>

              <div className="mt-6 rounded-xl bg-porcelain p-5 text-sm">
                <p className="flex items-start gap-2 text-ink">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                  <span>{s.ukDays} UK days · {s.prevResident ? 'resident in the last 3 years (leaver)' : 'not resident in the last 3 years (arriver)'}{s.ties != null ? ` · ${s.ties} ties` : ''}</span>
                </p>
              </div>

              <p className="mt-6 border-t border-mist pt-5 text-xs leading-relaxed text-muted">
                This is an indicative result based on the headline Statutory Residence Test rules and the answers you gave. It is not tax advice or a determination of your residence. Several real-world factors are not modelled here — split-year treatment, the deeming rule, exceptional circumstances, the &ldquo;only home&rdquo; and full-time-UK-work automatic tests, and treaty tie-breakers. Residence is self-assessed and HMRC can review it, so please confirm your position with a specialist before relying on it.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/book" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">
                  Confirm my residence position
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <button onClick={reset} className="rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">Start over</button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
