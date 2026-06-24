'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconShield } from '@/components/ui/icons';

/**
 * Streamlined Filing Eligibility Checker
 *
 * Logic verified against the IRS Streamlined Filing Compliance Procedures pages
 * (irs.gov) and multiple current 2026 sources. The program is active as of 2026.
 *
 * Hard gates (ALL must hold to be eligible at all):
 *   - US person (citizen / green card holder / resident) with an SSN or ITIN.
 *   - Conduct was NON-WILLFUL (negligence, inadvertence, mistake, or good-faith
 *     misunderstanding — not intentional concealment / evasion).
 *   - NOT under IRS civil examination or criminal investigation, and the IRS has
 *     not already contacted you about the delinquency.
 *
 * Routing once eligible:
 *   - SFOP (foreign, 0% Title 26 penalty): in at least one of the most recent 3
 *     years (with a passed due date), no US abode AND physically outside the US
 *     >= 330 full days.
 *   - SDOP (domestic, 5% penalty): the US-resident track for those who do not
 *     meet the non-residency test.
 *
 * This is YMYL territory. The tool is deliberately conservative: it gives an
 * INDICATIVE path only, treats any willfulness signal as disqualifying for a
 * confident "eligible" result, and routes every outcome to a specialist. It is
 * not advice, not a determination, and not the non-willful certification itself.
 */

type Step = 'usPerson' | 'contacted' | 'willful' | 'residency' | 'result';

interface State {
  usPerson: boolean | null;
  contacted: boolean | null; // under exam / criminal investigation / IRS already made contact
  willfulConcern: boolean | null; // any willfulness red flag present
  metNonResidency: boolean | null; // 330+ days abroad & no US abode in one of last 3 yrs
}

export default function StreamlinedChecker() {
  const [step, setStep] = useState<Step>('usPerson');
  const [s, setS] = useState<State>({ usPerson: null, contacted: null, willfulConcern: null, metNonResidency: null });

  function reset() {
    setS({ usPerson: null, contacted: null, willfulConcern: null, metNonResidency: null });
    setStep('usPerson');
  }

  type Outcome =
    | { kind: 'sfop' }
    | { kind: 'sdop' }
    | { kind: 'not-us-person' }
    | { kind: 'contacted' }
    | { kind: 'willful' };

  function outcome(): Outcome {
    if (s.usPerson === false) return { kind: 'not-us-person' };
    if (s.contacted === true) return { kind: 'contacted' };
    if (s.willfulConcern === true) return { kind: 'willful' };
    return s.metNonResidency ? { kind: 'sfop' } : { kind: 'sdop' };
  }

  const order: Step[] = ['usPerson', 'contacted', 'willful', 'residency', 'result'];
  const progress = Math.round((order.indexOf(step) / (order.length - 1)) * 100);

  function Choice({ onYes, onNo, yesLabel = 'Yes', noLabel = 'No' }: { onYes: () => void; onNo: () => void; yesLabel?: string; noLabel?: string }) {
    return (
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button onClick={onYes} className="flex-1 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">{yesLabel}</button>
        <button onClick={onNo} className="flex-1 rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">{noLabel}</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span>{step === 'result' ? 'Complete' : `Question ${order.indexOf(step) + 1} of 4`}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        {step === 'usPerson' && (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink">Are you a US person with an SSN or ITIN?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">A US citizen (including dual citizens), green card holder, or US tax resident. A valid Social Security Number or ITIN is needed to use the Streamlined procedures.</p>
            <Choice onYes={() => { setS({ ...s, usPerson: true }); setStep('contacted'); }} onNo={() => { setS({ ...s, usPerson: false }); setStep('result'); }} noLabel="No / not sure" />
          </>
        )}

        {step === 'contacted' && (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink">Has the IRS already contacted you about this?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">For example, you are under a civil examination or audit, under criminal investigation, or you have received an IRS notice about the unfiled returns or FBARs. The Streamlined programme is only for taxpayers who come forward <em>before</em> the IRS makes contact.</p>
            <Choice onYes={() => { setS({ ...s, contacted: true }); setStep('result'); }} onNo={() => { setS({ ...s, contacted: false }); setStep('willful'); }} yesLabel="Yes" noLabel="No" />
          </>
        )}

        {step === 'willful' && (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink">Was your failure to file genuinely non-willful?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Non-willful means it came from not knowing, a misunderstanding, or an honest mistake. Choose &ldquo;there may be a concern&rdquo; if any of these apply: you knowingly hid accounts, moved money to stay under reporting thresholds, used accounts in other names, or kept not filing after you learned you had to.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => { setS({ ...s, willfulConcern: false }); setStep('residency'); }} className="flex-1 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">It was non-willful</button>
              <button onClick={() => { setS({ ...s, willfulConcern: true }); setStep('result'); }} className="flex-1 rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">There may be a concern</button>
            </div>
            <button onClick={() => setStep('contacted')} className="mt-6 text-sm font-medium text-muted transition-colors hover:text-gold-antique">← Back</button>
          </>
        )}

        {step === 'residency' && (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink">In any one of the last three years, were you outside the US for 330+ full days with no US home?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">Specifically: in at least one of the most recent three tax years whose due date has passed, you had no US abode <em>and</em> were physically outside the United States for at least 330 full days. This decides the foreign (0% penalty) versus domestic (5% penalty) track.</p>
            <Choice onYes={() => { setS({ ...s, metNonResidency: true }); setStep('result'); }} onNo={() => { setS({ ...s, metNonResidency: false }); setStep('result'); }} yesLabel="Yes" noLabel="No / not sure" />
            <button onClick={() => setStep('willful')} className="mt-6 text-sm font-medium text-muted transition-colors hover:text-gold-antique">← Back</button>
          </>
        )}

        {step === 'result' && (() => {
          const o = outcome();
          const positive = o.kind === 'sfop' || o.kind === 'sdop';
          return (
            <>
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${positive ? 'bg-gold/10 text-gold-antique' : 'bg-mist text-muted'}`}>
                <IconShield className="h-6 w-6" />
              </span>

              {o.kind === 'sfop' && (
                <>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-ink">You may qualify — Foreign Offshore track</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    Based on your answers, the Streamlined <strong>Foreign</strong> Offshore Procedures (SFOP) look like the likely path. For eligible non-residents this carries <strong>no</strong> Title 26 offshore penalty — typically you file three years of returns and six years of FBARs, paying any tax and interest due.
                  </p>
                </>
              )}
              {o.kind === 'sdop' && (
                <>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-ink">You may qualify — Domestic Offshore track</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    Based on your answers, the Streamlined <strong>Domestic</strong> Offshore Procedures (SDOP) look like the likely path, because you do not appear to meet the non-residency test. This route involves a one-time 5% miscellaneous offshore penalty alongside the back filings.
                  </p>
                </>
              )}
              {o.kind === 'not-us-person' && (
                <>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-ink">The Streamlined procedures may not apply</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">The programme is for US persons (with an SSN or ITIN). If your status is unclear — for example you may be an &ldquo;accidental American&rdquo; — it is worth confirming, as your filing position could be different from what you assume.</p>
                </>
              )}
              {o.kind === 'contacted' && (
                <>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-ink">Streamlined is likely closed to you — but you still have options</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">Once the IRS has opened an examination, started a criminal investigation, or contacted you about the delinquency, the Streamlined programme is generally no longer available. This does <strong>not</strong> mean you are out of options — there are other resolution paths — but it is important to get advice before responding to the IRS.</p>
                </>
              )}
              {o.kind === 'willful' && (
                <>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-ink">This needs professional judgement before any filing</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    You flagged a possible willfulness concern. The Streamlined programme requires you to certify non-willful conduct under penalty of perjury, so this is exactly the situation where you should <strong>not</strong> file anything before taking advice. Where conduct may have been willful, the Voluntary Disclosure Practice is often the safer route. Whether your facts are truly willful is a judgement call a specialist should make with you.
                  </p>
                </>
              )}

              {(o.kind === 'sfop' || o.kind === 'sdop') && (
                <div className="mt-6 space-y-3 rounded-xl bg-porcelain p-5 text-sm">
                  <p className="flex items-start gap-2 text-ink"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span><strong>Returns:</strong> the most recent 3 years for which the due date has passed.</span></p>
                  <p className="flex items-start gap-2 text-ink"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span><strong>FBARs:</strong> the most recent 6 years for which the FBAR due date has passed.</span></p>
                  <p className="flex items-start gap-2 text-ink"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span><strong>Certification:</strong> a signed non-willful statement (Form 14653 for foreign, 14654 for domestic) is central — getting the narrative right matters.</span></p>
                </div>
              )}

              <p className="mt-6 border-t border-mist pt-5 text-xs leading-relaxed text-muted">
                This is an educational screening tool based on the headline Streamlined eligibility rules and your answers. It is not tax or legal advice, not a determination of eligibility, and not the non-willful certification itself. Willfulness in particular is a fact-specific judgement with serious consequences. The IRS can also change or end these procedures. Please speak with a qualified cross-border specialist before making any submission.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/book" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">
                  Discuss my situation in confidence
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
