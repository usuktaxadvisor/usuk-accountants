'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconPassport } from '@/components/ui/icons';

/**
 * Exit Tax / Covered Expatriate Estimator (Form 8854)
 * Tests: (1) net worth >= $2M, (2) avg tax >= $206k (2025), (3) compliance.
 * MTM exclusion ~$866k (2025, indexed). NOT MODELLED: actual exit tax calc.
 */

const NET_WORTH_THRESHOLD = 2_000_000;
const AVG_TAX_THRESHOLD_2025 = 206_000;
const MTM_EXCLUSION_2025 = 866_000;

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

type ExpatType = 'citizen' | 'long_term_gc' | 'neither';

interface CoveredResult {
  covered: boolean;
  triggers: string[];
  safeTests: string[];
  unknown: boolean;
}

function assess(expatType: ExpatType, netWorth: number, avgTax: number, compliant: boolean | null): CoveredResult | null {
  if (expatType === 'neither') return null;
  const triggers: string[] = [];
  const safeTests: string[] = [];
  let unknown = false;

  if (netWorth >= NET_WORTH_THRESHOLD) {
    triggers.push('Net worth (' + fmt(netWorth) + ') meets or exceeds the $2,000,000 threshold');
  } else if (netWorth > 0) {
    safeTests.push('Net worth (' + fmt(netWorth) + ') is below the $2,000,000 threshold');
  } else { unknown = true; }

  if (avgTax >= AVG_TAX_THRESHOLD_2025) {
    triggers.push('Average annual net income tax (' + fmt(avgTax) + ') meets or exceeds the 2025 threshold of ' + fmt(AVG_TAX_THRESHOLD_2025));
  } else if (avgTax > 0) {
    safeTests.push('Average annual net income tax (' + fmt(avgTax) + ') is below the 2025 threshold');
  } else { unknown = true; }

  if (compliant === false) {
    triggers.push('You cannot certify 5 years of US tax compliance — this alone makes you a covered expatriate regardless of wealth');
  } else if (compliant === true) {
    safeTests.push('You can certify 5 years of US tax compliance');
  } else { unknown = true; }

  return { covered: triggers.length > 0, triggers, safeTests, unknown };
}

export default function ExitTaxEstimator() {
  const [expatType, setExpatType] = useState<ExpatType | ''>('');
  const [netWorth, setNetWorth] = useState('');
  const [avgTax, setAvgTax] = useState('');
  const [compliant, setCompliant] = useState<'yes' | 'no' | 'unsure' | ''>('');
  const [show, setShow] = useState(false);

  const netWorthNum = Number(netWorth.replace(/[^0-9.]/g, '')) || 0;
  const avgTaxNum = Number(avgTax.replace(/[^0-9.]/g, '')) || 0;
  const compliantBool = compliant === 'yes' ? true : compliant === 'no' ? false : null;
  const canCalculate = expatType !== '' && (netWorth !== '' || avgTax !== '' || compliant !== '');
  const result = show && canCalculate ? assess(expatType as ExpatType, netWorthNum, avgTaxNum, compliantBool) : null;

  const inputClass = 'w-full rounded-xl border border-mist bg-porcelain px-4 py-3 text-ink outline-none transition-colors focus:border-gold';
  const labelClass = 'mb-1.5 block text-sm font-medium text-ink';
  const hintClass = 'mt-1.5 text-xs text-muted';

  function RadioGroup<T extends string>({ name, value, onChange, options }: { name: string; value: T | ''; onChange: (v: T) => void; options: { value: T; label: string; hint?: string }[] }) {
    return (
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-mist bg-porcelain p-3 transition-colors hover:border-gold">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="mt-0.5 accent-navy" />
            <div>
              <p className="text-sm font-medium text-ink">{o.label}</p>
              {o.hint && <p className="text-xs text-muted">{o.hint}</p>}
            </div>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-antique">
          <IconPassport className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
          Exit tax — would you be a covered expatriate?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          US citizens who renounce citizenship and long-term green card holders who abandon their
          status may face an exit tax under IRC §877A. Whether it applies depends on whether you
          are a covered expatriate. This screen checks the three tests.
        </p>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Important:</strong> Renouncing US citizenship is irreversible. This tool is for
          educational planning only. Do not take any steps toward renunciation without specialist advice.
        </div>

        <div className="mt-7 space-y-6">
          <div>
            <label className={labelClass}>What status are you giving up?</label>
            <RadioGroup<ExpatType> name="expatType" value={expatType} onChange={setExpatType} options={[
              { value: 'citizen', label: 'US citizenship (renunciation)', hint: 'Covers those born with US citizenship or who naturalised' },
              { value: 'long_term_gc', label: 'Long-term green card (abandonment)', hint: 'Long-term = held a green card in at least 8 of the last 15 years' },
              { value: 'neither', label: 'Neither — I am researching', hint: 'We will show you the framework for planning purposes' },
            ]} />
          </div>

          {expatType && expatType !== 'neither' && (
            <>
              <div>
                <label htmlFor="nw" className={labelClass}>Estimated net worth on the date of expatriation (USD)</label>
                <input id="nw" inputMode="decimal" value={netWorth} onChange={(e) => setNetWorth(e.target.value)} placeholder="e.g. 1,500,000" className={inputClass} />
                <p className={hintClass}>Include all worldwide assets: property (market value), investments, pensions, business interests, cash. Threshold: $2,000,000.</p>
              </div>

              <div>
                <label htmlFor="avgtax" className={labelClass}>Average annual US net income tax for the last 5 years (USD)</label>
                <input id="avgtax" inputMode="decimal" value={avgTax} onChange={(e) => setAvgTax(e.target.value)} placeholder="e.g. 90,000" className={inputClass} />
                <p className={hintClass}>Net income tax = federal income tax + self-employment tax minus credits (like FTC). Average the last 5 completed years. 2025 threshold: $206,000.</p>
              </div>

              <div>
                <label className={labelClass}>Can you certify 5 years of full US tax compliance?</label>
                <RadioGroup<'yes' | 'no' | 'unsure'> name="compliant" value={compliant} onChange={setCompliant} options={[
                  { value: 'yes', label: 'Yes — I have filed all required returns and paid all tax due for the last 5 years', hint: 'Includes FBARs, Form 8938, and all information returns' },
                  { value: 'no', label: 'No — I have missed returns, FBARs, or have unpaid tax', hint: 'Non-compliance alone makes you a covered expatriate regardless of net worth' },
                  { value: 'unsure', label: "I'm not certain", hint: 'Common — many people are unsure about information return filings (FBAR, 5471, 3520 etc.)' },
                ]} />
              </div>
            </>
          )}

          <button
            onClick={() => setShow(true)}
            disabled={!canCalculate}
            className="w-full rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Screen my covered-expatriate status
          </button>
        </div>

        {show && result === null && expatType === 'neither' && (
          <div className="mt-8 border-t border-mist pt-7">
            <h3 className="font-display text-xl font-semibold text-ink">The three covered-expatriate tests</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              You are a covered expatriate if you fail <strong>any one</strong> of:
            </p>
            <div className="mt-4 space-y-3 rounded-xl bg-porcelain p-5 text-sm">
              {[
                { title: 'Test 1 — Net worth', body: 'Worldwide net worth on the date of expatriation at or above $2,000,000. This threshold has never been inflation-adjusted.' },
                { title: 'Test 2 — Average annual tax', body: 'Average net US income tax for the 5 preceding years at or above ' + fmt(AVG_TAX_THRESHOLD_2025) + ' (2025 indexed amount).' },
                { title: 'Test 3 — Compliance certification', body: 'Failure to certify 5 years of full US tax compliance on Form 8854. This is the most commonly missed trigger — it does not require high income or wealth.' },
              ].map((t) => (
                <p key={t.title} className="flex items-start gap-2 text-ink">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                  <span><strong>{t.title}:</strong> {t.body}</span>
                </p>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">If covered, worldwide assets are deemed sold at FMV the day before expatriation. Gains above {fmt(MTM_EXCLUSION_2025)} (2025) are taxed. Planning well before renunciation can significantly reduce the impact.</p>
            <Link href="/book" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">
              Discuss exit planning <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {show && result && (
          <div className="mt-8 border-t border-mist pt-7">
            <h3 className={"font-display text-xl font-semibold " + (result.covered ? 'text-red-700' : result.unknown ? 'text-ink' : 'text-ink')}>
              {result.covered
                ? 'You are likely a covered expatriate'
                : result.unknown
                ? 'Cannot determine without more information'
                : 'You may not be a covered expatriate'}
            </h3>

            {result.triggers.length > 0 && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 space-y-2 text-sm text-red-800">
                <p className="font-semibold">Covered triggers identified:</p>
                {result.triggers.map((t, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">✗</span>
                    <span>{t}</span>
                  </p>
                ))}
              </div>
            )}

            {result.safeTests.length > 0 && (
              <div className="mt-4 space-y-2 rounded-xl bg-porcelain p-4 text-sm">
                {result.safeTests.map((t, i) => (
                  <p key={i} className="flex items-start gap-2 text-ink">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                    <span>{t}</span>
                  </p>
                ))}
              </div>
            )}

            {result.covered && (
              <div className="mt-4 rounded-xl bg-porcelain p-5 text-sm space-y-2">
                <p className="font-semibold text-ink">What covered status means:</p>
                <p className="flex items-start gap-2 text-muted"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span>Worldwide assets are deemed sold at FMV the day before expatriation. Gains above {fmt(MTM_EXCLUSION_2025)} (2025) are taxed at capital gains rates.</span></p>
                <p className="flex items-start gap-2 text-muted"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span>Eligible deferred compensation (401k, IRA) is subject to 30% withholding.</span></p>
                <p className="flex items-start gap-2 text-muted"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span>US persons who later receive gifts or bequests from you may face a Section 2801 heir tax at the highest estate/gift rate.</span></p>
                <p className="flex items-start gap-2 text-muted"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span>Planning well before renouncing can substantially reduce these consequences.</span></p>
              </div>
            )}

            {result.unknown && (
              <p className="mt-4 text-sm text-muted">Complete all three sections for a more definitive screen. Even one unknown test can change the outcome significantly.</p>
            )}

            <p className="mt-5 text-xs leading-relaxed text-muted">
              Educational screen only. Uses 2025 indexed thresholds. Does not model the actual exit tax calculation, deferred compensation elections, or dual-citizen exceptions. Renouncing US citizenship is irreversible — always take specialist advice before proceeding.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/resources/glossary/exit-tax" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Exit tax explained</Link>
              <Link href="/resources/glossary/green-card-holder" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Green card abandonment</Link>
              <Link href="/resources/glossary/form-8854" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Form 8854</Link>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">
                Plan my expatriation properly
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={() => { setShow(false); setExpatType(''); setNetWorth(''); setAvgTax(''); setCompliant(''); }} className="rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
