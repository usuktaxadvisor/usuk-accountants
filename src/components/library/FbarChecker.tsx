'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconShield } from '@/components/ui/icons';

/**
 * FBAR Requirement Checker
 *
 * Pure-logic tool. The rules below are stable and were verified against IRS
 * guidance (irs.gov FBAR page) and FinCEN for the 2025 tax year / 2026 filing
 * season:
 *   - Trigger: a US person with a financial interest in OR signature/other
 *     authority over one or more foreign financial accounts whose AGGREGATE
 *     maximum value exceeded US$10,000 at ANY point during the calendar year.
 *   - The $10,000 threshold is aggregate across all accounts, not per account,
 *     and is tested at the highest point in the year, not the year-end balance.
 *   - Deadline: April 15, with an automatic extension to October 15 (no request
 *     needed).
 *   - Filed electronically on FinCEN Form 114 via the BSA E-Filing System —
 *     separate from the federal tax return.
 *
 * This is an educational screening tool, NOT advice and NOT a determination.
 * It deliberately avoids storing answers and always routes the user to a
 * consultation for confirmation.
 */

type Answer = 'yes' | 'no' | null;

interface StepDef {
  id: string;
  question: string;
  helper: string;
}

const STEPS: StepDef[] = [
  {
    id: 'usPerson',
    question: 'Are you a US person?',
    helper:
      'A US person includes a US citizen (including dual citizens living abroad), a green card holder, or someone who meets the US substantial-presence test. It also includes US entities such as corporations, partnerships, LLCs, trusts and estates.',
  },
  {
    id: 'hasAccounts',
    question:
      'Do you have a financial interest in, or signature authority over, one or more foreign financial accounts?',
    helper:
      'Foreign financial accounts include non-US bank, savings, brokerage and certain pension or investment accounts. Signature authority counts even without ownership — for example, the ability to direct transactions on an employer, family or business account.',
  },
  {
    id: 'overThreshold',
    question:
      'Did the combined maximum value of all those accounts exceed US$10,000 at any single point during the year?',
    helper:
      'This is the aggregate of every account\u2019s highest balance during the year, converted to US dollars — not the year-end balance. Even a brief spike over $10,000 (a property sale, a payroll deposit) crosses the threshold for the whole year.',
  },
];

export default function FbarChecker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [done, setDone] = useState(false);

  const current = STEPS[step];

  function answer(value: Answer) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);

    // Early-exit logic: a "no" on any gating question ends the path.
    if (value === 'no') {
      setDone(true);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setDone(false);
  }

  // Result: only "likely required" when all three are yes.
  const likelyRequired =
    answers.usPerson === 'yes' &&
    answers.hasAccounts === 'yes' &&
    answers.overThreshold === 'yes';

  // Determine the reason for a "not required" result, for a clearer explanation.
  let notRequiredReason = '';
  if (!likelyRequired && done) {
    if (answers.usPerson === 'no') {
      notRequiredReason =
        'The FBAR applies to US persons. Based on your answer, the US FBAR rules may not apply to you — though your home country may have its own reporting rules.';
    } else if (answers.hasAccounts === 'no') {
      notRequiredReason =
        'The FBAR reports foreign financial accounts. If you hold no foreign accounts and have no signature authority over any, there is generally nothing to report this year.';
    } else if (answers.overThreshold === 'no') {
      notRequiredReason =
        'The FBAR is only triggered when your combined foreign accounts exceed US$10,000 at some point in the year. If you stayed under that aggregate at all times, an FBAR is generally not required for the year — but keep an eye on the threshold, as a single large deposit can cross it.';
    }
  }

  const progress = done ? 100 : Math.round((step / STEPS.length) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span>{done ? 'Complete' : `Question ${step + 1} of ${STEPS.length}`}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {!done && (
        <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
          <h2 className="font-display text-2xl font-semibold leading-snug text-ink">
            {current.question}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{current.helper}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => answer('yes')}
              className="flex-1 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
            >
              Yes
            </button>
            <button
              onClick={() => answer('no')}
              className="flex-1 rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain"
            >
              No / Not sure
            </button>
          </div>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 text-sm font-medium text-muted transition-colors hover:text-gold-antique"
            >
              ← Back
            </button>
          )}
        </div>
      )}

      {done && (
        <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
          {likelyRequired ? (
            <>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-antique">
                <IconShield className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
                You likely need to file an FBAR
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Based on your answers, you appear to meet all three FBAR triggers: you are a US
                person, you hold or control foreign financial accounts, and their combined value
                crossed US$10,000 during the year. That generally means a FinCEN Form 114 is due.
              </p>
              <div className="mt-6 space-y-3 rounded-xl bg-porcelain p-5 text-sm">
                <p className="flex items-start gap-2 text-ink">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                  <span><strong>Deadline:</strong> 15 April, with an automatic extension to 15 October — no request needed.</span>
                </p>
                <p className="flex items-start gap-2 text-ink">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                  <span><strong>How:</strong> filed electronically as FinCEN Form 114 through the BSA E-Filing System — separately from your tax return.</span>
                </p>
                <p className="flex items-start gap-2 text-ink">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                  <span><strong>Report all accounts:</strong> once over the threshold, every foreign account must be listed, even small ones.</span>
                </p>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                If you have missed FBARs in prior years, do not simply back-file without advice —
                the IRS Streamlined Filing programme exists for exactly this and can avoid
                penalties when handled correctly.
              </p>
            </>
          ) : (
            <>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-muted">
                <IconShield className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
                An FBAR is probably not required this year
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{notRequiredReason}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                This is a quick screen, not a determination — the rules around signature authority,
                joint accounts and account types have edge cases. If anything about your situation
                is borderline, it is worth a short conversation to be certain.
              </p>
            </>
          )}

          {/* Honest disclaimer */}
          <p className="mt-6 border-t border-mist pt-5 text-xs leading-relaxed text-muted">
            This tool provides general information based on headline FBAR rules and your answers. It
            is not tax advice, not a filing, and not a determination of your obligations. Your actual
            requirement depends on the full facts of your situation. Please confirm with a qualified
            cross-border specialist before acting.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
            >
              Book a consultation
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={reset}
              className="rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
