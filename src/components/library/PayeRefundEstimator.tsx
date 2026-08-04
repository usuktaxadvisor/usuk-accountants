'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconShield } from '@/components/ui/icons';

/**
 * UK PAYE Overpayment / Tax Refund Estimator
 * UK 2025/26 rates: PA £12,570, basic 20% to £50,270, higher 40% to £125,140, additional 45%.
 * PA tapers above £100,000. HMRC allows refund claims 4 years back.
 * NOT MODELLED: Scottish rates, NI, student loans.
 */

const PA = 12_570;
const BASIC_LIMIT = 50_270;
const HIGHER_LIMIT = 125_140;
const TAPERING_STARTS = 100_000;

const fmt = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

function computeIncomeTax(income: number, pensionContribs: number = 0): number {
  const adjustedIncome = Math.max(0, income - pensionContribs);
  let pa = PA;
  if (adjustedIncome > TAPERING_STARTS) {
    pa = Math.max(0, PA - Math.floor((adjustedIncome - TAPERING_STARTS) / 2));
  }
  const taxable = Math.max(0, adjustedIncome - pa);
  if (taxable <= 0) return 0;
  const basicBand = BASIC_LIMIT - PA;
  if (taxable <= basicBand) return taxable * 0.20;
  const higherBand = HIGHER_LIMIT - BASIC_LIMIT;
  if (taxable <= basicBand + higherBand) return basicBand * 0.20 + (taxable - basicBand) * 0.40;
  return basicBand * 0.20 + higherBand * 0.40 + (taxable - basicBand - higherBand) * 0.45;
}

export default function PayeRefundEstimator() {
  const [grossIncome, setGrossIncome] = useState('');
  const [taxPaid, setTaxPaid] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [pensionContribs, setPensionContribs] = useState('');
  const [emergencyCode, setEmergencyCode] = useState(false);
  const [stoppedWork, setStoppedWork] = useState(false);
  const [allowableExpenses, setAllowableExpenses] = useState('');
  const [show, setShow] = useState(false);

  const grossNum = Number(grossIncome.replace(/[^0-9.]/g, '')) || 0;
  const taxNum = Number(taxPaid.replace(/[^0-9.]/g, '')) || 0;
  const otherNum = Number(otherIncome.replace(/[^0-9.]/g, '')) || 0;
  const pensionNum = Number(pensionContribs.replace(/[^0-9.]/g, '')) || 0;
  const expensesNum = Number(allowableExpenses.replace(/[^0-9.]/g, '')) || 0;

  const totalIncome = grossNum + otherNum;
  const correctTax = computeIncomeTax(totalIncome - expensesNum, pensionNum);
  const difference = taxNum - correctTax;
  const likelyRefund = difference > 100;
  const likelyOwes = difference < -100;
  const needsSelfAssessment = totalIncome > 100_000 || otherNum > 1_000 || (otherNum > 0 && otherNum <= 1_000);
  const canCalculate = grossNum > 0 && taxNum >= 0;

  const inputClass = 'w-full rounded-xl border border-mist bg-porcelain px-4 py-3 text-ink outline-none transition-colors focus:border-gold';
  const labelClass = 'mb-1.5 block text-sm font-medium text-ink';
  const hintClass = 'mt-1.5 text-xs text-muted';

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-antique">
          <IconShield className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
          Have you overpaid UK income tax?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Emergency tax codes, multiple jobs, allowable expenses and mid-year job changes can all
          leave you overpaying HMRC. Enter your figures and we&apos;ll estimate whether a UK tax refund
          is likely. HMRC allows you to reclaim overpayments going back four tax years.
        </p>

        <div className="mt-7 space-y-5">
          <div>
            <label htmlFor="gross" className={labelClass}>Total UK gross employment income (£)</label>
            <input id="gross" inputMode="decimal" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} placeholder="e.g. 55,000" className={inputClass} />
            <p className={hintClass}>Your total gross salary from all UK employers in the tax year. Check your P60 or payslips.</p>
          </div>

          <div>
            <label htmlFor="taxPaid" className={labelClass}>Total UK income tax deducted through PAYE (£)</label>
            <input id="taxPaid" inputMode="decimal" value={taxPaid} onChange={(e) => setTaxPaid(e.target.value)} placeholder="e.g. 14,500" className={inputClass} />
            <p className={hintClass}>From your P60 or payslips for the year.</p>
          </div>

          <div>
            <label htmlFor="other" className={labelClass}>Other UK income not taxed through PAYE (£)</label>
            <input id="other" inputMode="decimal" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} placeholder="e.g. 2,000" className={inputClass} />
            <p className={hintClass}>Freelance income, rental income, savings interest above your PSA, dividends. Leave blank if none.</p>
          </div>

          <div>
            <label htmlFor="pension" className={labelClass}>Pension contributions (employer + employee, £)</label>
            <input id="pension" inputMode="decimal" value={pensionContribs} onChange={(e) => setPensionContribs(e.target.value)} placeholder="e.g. 3,500" className={inputClass} />
            <p className={hintClass}>Leave blank if contributions are via salary sacrifice (already deducted from gross).</p>
          </div>

          <div>
            <label htmlFor="expenses" className={labelClass}>Allowable employment expenses (£)</label>
            <input id="expenses" inputMode="decimal" value={allowableExpenses} onChange={(e) => setAllowableExpenses(e.target.value)} placeholder="e.g. 1,200" className={inputClass} />
            <p className={hintClass}>Professional subscriptions, work equipment, uniform/PPE. Not commuting costs.</p>
          </div>

          <div className="space-y-3">
            <p className={labelClass}>Does any of the following apply?</p>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-mist bg-porcelain p-3">
              <input type="checkbox" checked={emergencyCode} onChange={(e) => setEmergencyCode(e.target.checked)} className="mt-0.5 accent-navy" />
              <span className="text-sm text-ink">I was put on an emergency tax code (W1, M1, or 0T) at some point this year</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-mist bg-porcelain p-3">
              <input type="checkbox" checked={stoppedWork} onChange={(e) => setStoppedWork(e.target.checked)} className="mt-0.5 accent-navy" />
              <span className="text-sm text-ink">I stopped working part-way through the tax year</span>
            </label>
          </div>

          <button
            onClick={() => setShow(true)}
            disabled={!canCalculate}
            className="w-full rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check my refund position
          </button>
        </div>

        {show && canCalculate && (
          <div className="mt-8 border-t border-mist pt-7">
            <h3 className={"font-display text-xl font-semibold " + (likelyRefund ? 'text-ink' : likelyOwes ? 'text-red-700' : 'text-ink')}>
              {likelyRefund
                ? 'You may be owed around ' + fmt(difference) + ' from HMRC'
                : likelyOwes
                ? 'You may owe HMRC around ' + fmt(Math.abs(difference))
                : 'Your PAYE looks broadly correct'}
            </h3>

            <div className="mt-5 space-y-2 rounded-xl bg-porcelain p-5 text-sm">
              <p className="flex justify-between text-ink"><span>Total income</span><span className="font-semibold">{fmt(totalIncome)}</span></p>
              {expensesNum > 0 && <p className="flex justify-between text-muted"><span>Less: allowable expenses</span><span>({fmt(expensesNum)})</span></p>}
              {pensionNum > 0 && <p className="flex justify-between text-muted"><span>Less: pension contributions</span><span>({fmt(pensionNum)})</span></p>}
              <p className="flex justify-between text-ink border-t border-mist pt-2"><span>Estimated correct tax</span><span className="font-semibold">{fmt(correctTax)}</span></p>
              <p className="flex justify-between text-ink"><span>Tax actually paid through PAYE</span><span className="font-semibold">{fmt(taxNum)}</span></p>
              <p className={"flex justify-between font-bold border-t border-mist pt-2 text-base " + (likelyRefund ? 'text-ink' : likelyOwes ? 'text-red-700' : 'text-ink')}>
                <span>{likelyRefund ? 'Estimated overpayment (refund due)' : likelyOwes ? 'Estimated underpayment' : 'Estimated difference'}</span>
                <span>{fmt(Math.abs(difference))}</span>
              </p>
            </div>

            {(emergencyCode || stoppedWork) && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <strong>Emergency code / partial year flag.</strong> {emergencyCode ? 'Emergency tax codes often over-deduct tax in the early months of a job. ' : ''}{stoppedWork ? 'Stopping work mid-year typically results in overpaid PAYE that HMRC does not automatically refund. ' : ''}A Self Assessment return or P50 claim is the standard way to reclaim.
              </div>
            )}

            {needsSelfAssessment && (
              <div className="mt-4 rounded-xl border border-mist bg-porcelain p-4 text-sm text-ink">
                <strong>Self Assessment likely required.</strong> {totalIncome > 100_000 ? 'Income over £100,000 requires a Self Assessment return. ' : ''}{otherNum > 1_000 ? 'Untaxed income over £1,000 is a Self Assessment trigger. ' : ''}A return needs to be filed rather than a simple informal refund claim.
              </div>
            )}

            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-start gap-2 text-muted">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                <span>HMRC allows overpayment claims going back 4 tax years — you may have more to reclaim than just this year.</span>
              </p>
              <p className="flex items-start gap-2 text-muted">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                <span>As a US citizen, a UK tax refund does not reduce your US filing obligation — you still file Form 1040 and may need to adjust your Foreign Tax Credit.</span>
              </p>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted">
              Estimate uses 2025/26 UK income tax rates and the standard personal allowance. Excludes Scottish income tax, National Insurance, student loans, Marriage Allowance. Not HMRC advice. Verify with a qualified UK accountant before filing or claiming.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/services/uk-accounting/self-assessment" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Self Assessment service</Link>
              <Link href="/resources/glossary/self-assessment" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Self Assessment explained</Link>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
              >
                {likelyRefund ? 'Reclaim my overpayment' : 'Review my UK tax position'}
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => { setShow(false); setGrossIncome(''); setTaxPaid(''); setOtherIncome(''); setPensionContribs(''); setAllowableExpenses(''); setEmergencyCode(false); setStoppedWork(false); }}
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
