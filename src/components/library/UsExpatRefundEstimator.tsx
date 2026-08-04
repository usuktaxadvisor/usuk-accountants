'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconCalculator } from '@/components/ui/icons';

/**
 * US Expat Tax Refund Estimator
 *
 * Estimates whether an American in the UK is likely due a US federal tax refund,
 * based on:
 *   - US withholding (W-2, 1099, estimated payments) vs estimated US liability
 *   - The Foreign Tax Credit (Form 1116): UK tax paid generally offsets US tax
 *     dollar-for-dollar, often reducing US liability to zero for UK-rate earners
 *   - The Foreign Earned Income Exclusion (Form 2555): excludes earned income up
 *     to the annual cap (indexed; $130,000 for 2025, $126,500 for 2024)
 *
 * Logic verified against IRS.gov Form 1040 instructions, Publication 514
 * (Foreign Tax Credit), Publication 54 (Tax Guide for US Citizens Abroad), and
 * current 2025/2026 indexed figures.
 *
 * DELIBERATELY NOT MODELLED (to avoid false precision on YMYL data):
 *   - State-level refunds (which vary by "sticky state" residency rules)
 *   - NIIT (3.8% net investment income tax — FTC cannot offset this)
 *   - AMT
 *   - Child Tax Credit, ACTC, other credits
 *   - Self-employment tax (not reduced by FTC or FEIE)
 *   - Currency fluctuation on tax paid in GBP
 *
 * The tool frames its output as "likely", "indicative", and "worth checking" —
 * never as a definitive refund amount. Every result routes to a consultation.
 */

const FEIE_CAP_2025 = 130_000;
const FEIE_CAP_2024 = 126_500;

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

type Relief = 'ftc' | 'feie' | 'none' | 'unsure';

interface Result {
  likelyRefund: boolean;
  likelyBreakEven: boolean;
  likelyOwes: boolean;
  headline: string;
  detail: string;
  warning?: string;
}

function assess(
  usTaxableIncome: number,
  ukTaxPaid: number,
  usWithheld: number,
  relief: Relief,
): Result {
  function roughUsTax(income: number): number {
    if (income <= 0) return 0;
    if (income <= 11_925) return income * 0.10;
    if (income <= 48_475) return 1_192.5 + (income - 11_925) * 0.12;
    if (income <= 103_350) return 5_578.5 + (income - 48_475) * 0.22;
    if (income <= 197_300) return 17_650.5 + (income - 103_350) * 0.24;
    if (income <= 250_525) return 40_198.5 + (income - 197_300) * 0.32;
    if (income <= 626_350) return 57_231.5 + (income - 250_525) * 0.35;
    return 188_769.75 + (income - 626_350) * 0.37;
  }

  let estimatedUsTax = roughUsTax(usTaxableIncome);

  if (relief === 'feie') {
    const excluded = Math.min(usTaxableIncome, FEIE_CAP_2025);
    const stackedTax = roughUsTax(usTaxableIncome) - roughUsTax(excluded);
    estimatedUsTax = Math.max(0, stackedTax);
  } else if (relief === 'ftc') {
    const creditAvailable = Math.min(ukTaxPaid, estimatedUsTax);
    estimatedUsTax = Math.max(0, estimatedUsTax - creditAvailable);
  } else if (relief === 'unsure') {
    const ftcResult = Math.max(0, estimatedUsTax - Math.min(ukTaxPaid, estimatedUsTax));
    estimatedUsTax = (estimatedUsTax + ftcResult) / 2;
  }

  const netPosition = usWithheld - estimatedUsTax;

  if (relief === 'unsure') {
    return {
      likelyRefund: netPosition > 200,
      likelyBreakEven: Math.abs(netPosition) <= 200,
      likelyOwes: netPosition < -200,
      headline: 'Result depends on which relief you claim',
      detail: 'With the Foreign Tax Credit applied, your estimated US liability drops significantly — often to near zero for UK-rate earners. Without relief, the picture is very different. With ' + fmt(usWithheld) + ' withheld and an estimated pre-relief liability of ' + fmt(roughUsTax(usTaxableIncome)) + ', the right relief choice could mean the difference between a refund and owing tax. This is exactly the calculation we do in a consultation.',
      warning: 'Because the relief choice has not been made, this estimate has wide uncertainty.',
    };
  }

  if (netPosition > 200) {
    return {
      likelyRefund: true,
      likelyBreakEven: false,
      likelyOwes: false,
      headline: 'You may be owed a US refund of around ' + fmt(netPosition),
      detail: 'You had ' + fmt(usWithheld) + ' withheld or paid in estimated tax. After ' + (relief === 'ftc' ? 'the Foreign Tax Credit' : 'the Foreign Earned Income Exclusion') + ', your estimated US liability is around ' + fmt(estimatedUsTax) + '. Filing correctly — and claiming the right relief — is how you recover that overpayment. A refund is not automatic: it is only paid after the return is filed.',
    };
  }

  if (netPosition >= -200) {
    return {
      likelyRefund: false,
      likelyBreakEven: true,
      likelyOwes: false,
      headline: 'You are likely close to break-even',
      detail: 'With ' + fmt(usWithheld) + ' withheld and an estimated liability of ' + fmt(estimatedUsTax) + ', the position is roughly neutral. Small differences in the actual numbers — income mix, passive vs earned, self-employment income — could push you either way. Even at break-even you still need to file.',
    };
  }

  return {
    likelyRefund: false,
    likelyBreakEven: false,
    likelyOwes: true,
    headline: 'You may owe around ' + fmt(Math.abs(netPosition)) + ' to the IRS',
    detail: 'After ' + (relief === 'ftc' ? 'the Foreign Tax Credit' : 'the FEIE') + ', your estimated liability of ' + fmt(estimatedUsTax) + ' exceeds the ' + fmt(usWithheld) + ' you have already paid or had withheld. Interest accrues from the April filing deadline even if a return extension is in place. The right structuring — choosing between FEIE and the FTC, or electing to file jointly — can affect this figure.',
    warning: 'If you have not filed and have a balance due, acting promptly limits interest and late-filing penalties.',
  };
}

export default function UsExpatRefundEstimator() {
  const [income, setIncome] = useState('');
  const [ukTax, setUkTax] = useState('');
  const [withheld, setWithheld] = useState('');
  const [relief, setRelief] = useState<Relief | ''>('');
  const [show, setShow] = useState(false);

  const incomeNum = Number(income.replace(/[^0-9.]/g, '')) || 0;
  const ukTaxNum = Number(ukTax.replace(/[^0-9.]/g, '')) || 0;
  const withheldNum = Number(withheld.replace(/[^0-9.]/g, '')) || 0;

  const canCalculate = incomeNum > 0 && relief !== '';
  const result = show && canCalculate
    ? assess(incomeNum, ukTaxNum, withheldNum, relief as Relief)
    : null;

  const inputClass =
    'w-full rounded-xl border border-mist bg-porcelain px-4 py-3 text-ink outline-none transition-colors focus:border-gold';
  const labelClass = 'mb-1.5 block text-sm font-medium text-ink';
  const hintClass = 'mt-1.5 text-xs text-muted';

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-antique">
          <IconCalculator className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
          Are you owed a US tax refund?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Americans in the UK often overpay US tax through withholding or estimated payments, then
          fail to claim it back on their return. Enter your figures and we&apos;ll estimate whether a
          refund is likely — and how much.
        </p>

        <div className="mt-7 space-y-5">
          <div>
            <label htmlFor="income" className={labelClass}>
              Total US-taxable income for the year (USD)
            </label>
            <input
              id="income"
              inputMode="decimal"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 85,000"
              className={inputClass}
            />
            <p className={hintClass}>
              Your worldwide income in USD: UK salary, freelance income, investment income. Convert
              GBP at the average rate for the year.
            </p>
          </div>

          <div>
            <label htmlFor="ukTax" className={labelClass}>
              UK income tax paid for the year (USD equivalent)
            </label>
            <input
              id="ukTax"
              inputMode="decimal"
              value={ukTax}
              onChange={(e) => setUkTax(e.target.value)}
              placeholder="e.g. 21,000"
              className={inputClass}
            />
            <p className={hintClass}>
              PAYE deducted or Self Assessment paid to HMRC, converted to USD. Used to estimate your
              Foreign Tax Credit.
            </p>
          </div>

          <div>
            <label htmlFor="withheld" className={labelClass}>
              US tax already paid (withholding + estimated payments, USD)
            </label>
            <input
              id="withheld"
              inputMode="decimal"
              value={withheld}
              onChange={(e) => setWithheld(e.target.value)}
              placeholder="e.g. 5,000"
              className={inputClass}
            />
            <p className={hintClass}>
              US federal tax withheld on any US-source income (W-2, 1099) plus any quarterly
              estimated payments you made. Leave blank or enter 0 if none.
            </p>
          </div>

          <div>
            <label className={labelClass}>Which relief are you planning to claim?</label>
            <div className="mt-2 space-y-2">
              {[
                { value: 'ftc', label: 'Foreign Tax Credit (Form 1116)', hint: 'Most common for UK earners — offsets US tax with UK tax paid' },
                { value: 'feie', label: 'Foreign Earned Income Exclusion (Form 2555)', hint: 'Excludes earned income up to ~$130k; better for some lower earners' },
                { value: 'unsure', label: "I'm not sure yet", hint: "We'll show you why the choice matters" },
                { value: 'none', label: 'Neither (no relief claimed)', hint: 'Worst-case scenario — shows full US liability' },
              ].map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-mist bg-porcelain p-3 transition-colors hover:border-gold">
                  <input
                    type="radio"
                    name="relief"
                    value={opt.value}
                    checked={relief === opt.value}
                    onChange={() => setRelief(opt.value as Relief)}
                    className="mt-0.5 accent-navy"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">{opt.label}</p>
                    <p className="text-xs text-muted">{opt.hint}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShow(true)}
            disabled={!canCalculate}
            className="w-full rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Estimate my refund position
          </button>
        </div>

        {result && (
          <div className="mt-8 border-t border-mist pt-7">
            <h3 className={"font-display text-xl font-semibold " + (result.likelyRefund ? 'text-ink' : result.likelyOwes ? 'text-red-700' : 'text-ink')}>
              {result.headline}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{result.detail}</p>

            {result.warning && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {result.warning}
              </div>
            )}

            <div className="mt-5 space-y-2 rounded-xl bg-porcelain p-5 text-sm">
              <p className="flex items-start gap-2 text-ink">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                <span>A refund is only paid after you file your return — it doesn&apos;t happen automatically.</span>
              </p>
              <p className="flex items-start gap-2 text-ink">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                <span>Choosing between the FTC and FEIE — and switching between them — has multi-year consequences.</span>
              </p>
              <p className="flex items-start gap-2 text-ink">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                <span>Self-employment tax and the 3.8% NIIT are not reduced by these reliefs and are not included above.</span>
              </p>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-muted">
              This is an educational estimate using simplified 2025 US federal tax brackets and
              standard relief mechanics. It excludes state tax, NIIT, AMT, self-employment tax,
              passive income limitations, and currency-movement effects. It is not tax advice and
              not a determination of the amount owed or refundable. Confirm your exact position
              with a qualified cross-border specialist before filing.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/resources/glossary/foreign-tax-credit" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Foreign Tax Credit explained</Link>
              <Link href="/resources/glossary/feie" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">FEIE explained</Link>
              <Link href="/resources/blog/feie-or-foreign-tax-credit-uk" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">FEIE or FTC — which wins?</Link>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
              >
                {result.likelyRefund ? 'Claim my refund — book a consultation' : 'Review my US tax position'}
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => { setShow(false); setIncome(''); setUkTax(''); setWithheld(''); setRelief(''); }}
                className="rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain"
              >
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
