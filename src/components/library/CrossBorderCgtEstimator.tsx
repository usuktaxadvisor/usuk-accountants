'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconPlanning } from '@/components/ui/icons';

/**
 * UK vs US Capital Gains Estimator
 * UK CGT 2025/26: AEA £3,000, 18%/24% all assets (post-Oct 2024 budget).
 * US LTCG 2025: 0%/15%/20%. S121: $250k/$500k MFJ.
 * NOT MODELLED: NIIT, depreciation recapture, state CGT, currency gain.
 */

const fmt = (n: number, currency: 'GBP' | 'USD' = 'USD') =>
  n.toLocaleString('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });

type AssetType = 'property_main' | 'property_other' | 'shares' | 'other';
type UkTaxBand = 'basic' | 'higher';
type UsIncomeLevel = 'low' | 'mid' | 'high';
type HeldPeriod = 'short' | 'long';

const UK_CGT = {
  property: { basic: 0.18, higher: 0.24 },
  other: { basic: 0.18, higher: 0.24 },
  annualExempt: 3_000,
};

const US_LTCG = { low: 0, mid: 0.15, high: 0.20 };
const SECTION_121_SINGLE = 250_000;
const SECTION_121_MFJ = 500_000;

function computeUkCgt(gainGbp: number, assetType: AssetType, band: UkTaxBand, prrPct: number) {
  const prrRelief = assetType === 'property_main' ? gainGbp * (prrPct / 100) : 0;
  const gainAfterPrr = Math.max(0, gainGbp - prrRelief);
  const taxableGain = Math.max(0, gainAfterPrr - UK_CGT.annualExempt);
  const rate = assetType === 'property_main' || assetType === 'property_other'
    ? UK_CGT.property[band] : UK_CGT.other[band];
  return { taxableGain, ukCgt: taxableGain * rate, prrApplied: prrRelief };
}

function computeUsGain(gainGbp: number, gbpUsd: number, assetType: AssetType, heldPeriod: HeldPeriod, filingStatus: 'single' | 'mfj', incomeLevel: UsIncomeLevel, section121: boolean) {
  const gainUsd = gainGbp * gbpUsd;
  const exclusion = section121 && assetType === 'property_main'
    ? (filingStatus === 'mfj' ? SECTION_121_MFJ : SECTION_121_SINGLE) : 0;
  const usGainUsd = Math.max(0, gainUsd - exclusion);
  let usTax = 0;
  if (heldPeriod === 'short') {
    const ordRates = { low: 0.12, mid: 0.22, high: 0.32 };
    usTax = usGainUsd * ordRates[incomeLevel];
  } else {
    usTax = usGainUsd * US_LTCG[incomeLevel];
  }
  return { usGainUsd, usTax, s121Applied: exclusion };
}

export default function CrossBorderCgtEstimator() {
  const [gainGbp, setGainGbp] = useState('');
  const [assetType, setAssetType] = useState<AssetType | ''>('');
  const [band, setBand] = useState<UkTaxBand | ''>('');
  const [heldPeriod, setHeldPeriod] = useState<HeldPeriod | ''>('');
  const [incomeLevel, setIncomeLevel] = useState<UsIncomeLevel | ''>('');
  const [filingStatus, setFilingStatus] = useState<'single' | 'mfj' | ''>('');
  const [prrPct, setPrrPct] = useState('100');
  const [section121, setSection121] = useState(true);
  const [gbpUsd, setGbpUsd] = useState('1.27');
  const [show, setShow] = useState(false);

  const canCalc = gainGbp && assetType && band && heldPeriod && incomeLevel && filingStatus;
  const gainNum = Number(gainGbp.replace(/[^0-9.]/g, '')) || 0;
  const gbpUsdNum = Number(gbpUsd) || 1.27;
  const prrNum = Math.min(100, Math.max(0, Number(prrPct) || 0));

  const uk = canCalc ? computeUkCgt(gainNum, assetType as AssetType, band as UkTaxBand, prrNum) : null;
  const us = canCalc ? computeUsGain(gainNum, gbpUsdNum, assetType as AssetType, heldPeriod as HeldPeriod, filingStatus as 'single' | 'mfj', incomeLevel as UsIncomeLevel, section121) : null;
  const ukCgtUsd = uk ? uk.ukCgt * gbpUsdNum : 0;
  const netUsTaxAfterFtc = us ? Math.max(0, us.usTax - ukCgtUsd) : 0;
  const totalTax = uk && us ? uk.ukCgt + netUsTaxAfterFtc : 0;
  const doubleLayerRisk = us ? netUsTaxAfterFtc > 500 : false;

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
          <IconPlanning className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
          UK vs US capital gains — estimate your position
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The US and UK calculate the same capital gain differently — different exemptions, different
          rates, and different cost-basis rules. This estimates your likely UK CGT and US federal
          capital gains tax on the same disposal, and whether the Foreign Tax Credit will cover the
          overlap.
        </p>

        <div className="mt-7 space-y-6">
          <div>
            <label htmlFor="gain" className={labelClass}>Capital gain (GBP)</label>
            <input id="gain" inputMode="decimal" value={gainGbp} onChange={(e) => setGainGbp(e.target.value)} placeholder="e.g. 120,000" className={inputClass} />
            <p className={hintClass}>Sale proceeds minus original cost (in GBP, before any reliefs).</p>
          </div>

          <div>
            <label className={labelClass}>What did you sell?</label>
            <RadioGroup<AssetType> name="assetType" value={assetType} onChange={setAssetType} options={[
              { value: 'property_main', label: 'My main home (UK residential property)', hint: 'UK PRR and US Section 121 exclusion may both apply' },
              { value: 'property_other', label: 'Other UK residential property (buy-to-let, second home)', hint: 'No PRR; UK 18%/24% and US gains tax both likely apply' },
              { value: 'shares', label: 'UK shares or funds', hint: 'UK CGT annual exempt amount applies; US may tax differently' },
              { value: 'other', label: 'Other asset', hint: 'Business assets, crypto, other property' },
            ]} />
          </div>

          {assetType === 'property_main' && (
            <div>
              <label htmlFor="prr" className={labelClass}>Principal Private Residence Relief — % of gain covered (%)</label>
              <input id="prr" inputMode="decimal" value={prrPct} onChange={(e) => setPrrPct(e.target.value)} placeholder="e.g. 100" className={inputClass} />
              <p className={hintClass}>100% if it was always your main home. Less if you rented it out or had periods of absence. PRR does not apply for US purposes.</p>
            </div>
          )}

          <div>
            <label className={labelClass}>UK income tax band (in the year of disposal)</label>
            <RadioGroup<UkTaxBand> name="band" value={band} onChange={setBand} options={[
              { value: 'basic', label: 'Basic rate taxpayer (income up to ~£50,270)', hint: 'CGT rates: 18% (all assets post-Oct 2024 budget)' },
              { value: 'higher', label: 'Higher / additional rate taxpayer', hint: 'CGT rates: 24% (all assets post-Oct 2024 budget)' },
            ]} />
          </div>

          <div>
            <label className={labelClass}>How long did you hold the asset?</label>
            <RadioGroup<HeldPeriod> name="held" value={heldPeriod} onChange={setHeldPeriod} options={[
              { value: 'long', label: 'More than 1 year', hint: 'Qualifies for US long-term capital gains rates (0%, 15%, or 20%)' },
              { value: 'short', label: '1 year or less', hint: 'US taxes short-term gains as ordinary income' },
            ]} />
          </div>

          <div>
            <label className={labelClass}>US income level (for long-term CGT rate)</label>
            <RadioGroup<UsIncomeLevel> name="income" value={incomeLevel} onChange={setIncomeLevel} options={[
              { value: 'low', label: 'Under ~$48,000 (0% LTCG rate)', hint: '0% US long-term capital gains rate applies' },
              { value: 'mid', label: '~$48,000 – $533,000 (15% LTCG rate)', hint: 'Most expats in this range' },
              { value: 'high', label: 'Over ~$533,000 (20% LTCG rate)', hint: '20% rate plus potential NIIT exposure' },
            ]} />
          </div>

          <div>
            <label className={labelClass}>US filing status</label>
            <RadioGroup<'single' | 'mfj'> name="filing" value={filingStatus} onChange={setFilingStatus} options={[
              { value: 'single', label: 'Single / Married Filing Separately' },
              { value: 'mfj', label: 'Married Filing Jointly' },
            ]} />
          </div>

          {assetType === 'property_main' && (
            <div className="flex items-start gap-3 rounded-xl border border-mist bg-porcelain p-4">
              <input type="checkbox" id="s121" checked={section121} onChange={(e) => setSection121(e.target.checked)} className="mt-0.5 accent-navy" />
              <label htmlFor="s121" className="cursor-pointer text-sm text-ink">
                Apply US Section 121 exclusion ({filingStatus === 'mfj' ? '$500,000' : '$250,000'} on main home)
                <span className="block text-xs text-muted mt-0.5">Requires 2 of last 5 years as your principal residence.</span>
              </label>
            </div>
          )}

          <div>
            <label htmlFor="fx" className={labelClass}>GBP/USD exchange rate</label>
            <input id="fx" inputMode="decimal" value={gbpUsd} onChange={(e) => setGbpUsd(e.target.value)} placeholder="1.27" className={inputClass} />
            <p className={hintClass}>Used to convert the gain to USD for US tax.</p>
          </div>

          <button
            onClick={() => setShow(true)}
            disabled={!canCalc}
            className="w-full rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Estimate my tax position
          </button>
        </div>

        {show && uk && us && (
          <div className="mt-8 border-t border-mist pt-7">
            <h3 className="font-display text-xl font-semibold text-ink">Your estimated position</h3>
            <div className="mt-5 space-y-3 rounded-xl bg-porcelain p-5 text-sm">
              <p className="flex justify-between text-ink"><span>Capital gain (before reliefs)</span><span className="font-semibold">{fmt(gainNum, 'GBP')}</span></p>
              {uk.prrApplied > 0 && <p className="flex justify-between text-muted"><span>Less: PRR relief</span><span>({fmt(uk.prrApplied, 'GBP')})</span></p>}
              <p className="flex justify-between text-ink"><span>UK taxable gain</span><span className="font-semibold">{fmt(uk.taxableGain, 'GBP')}</span></p>
              <p className="flex justify-between font-semibold text-ink border-t border-mist pt-2"><span>Estimated UK CGT</span><span>{fmt(uk.ukCgt, 'GBP')}</span></p>
              <div className="border-t border-mist pt-2">
                <p className="flex justify-between text-ink"><span>Gain in USD (at {gbpUsd})</span><span>{fmt(us.usGainUsd)}</span></p>
                {us.s121Applied > 0 && <p className="flex justify-between text-muted"><span>Less: Section 121 exclusion</span><span>({fmt(us.s121Applied)})</span></p>}
                <p className="flex justify-between text-ink"><span>Gross US federal tax</span><span>{fmt(us.usTax)}</span></p>
                <p className="flex justify-between text-muted"><span>Less: Foreign Tax Credit (UK CGT in USD)</span><span>({fmt(ukCgtUsd)})</span></p>
                <p className="flex justify-between font-semibold text-ink border-t border-mist pt-2"><span>Net US federal tax after FTC</span><span>{fmt(netUsTaxAfterFtc)}</span></p>
              </div>
              <p className="flex justify-between font-bold text-ink border-t border-mist pt-2 text-base">
                <span>Estimated total (UK + residual US)</span>
                <span>{fmt(uk.ukCgt, 'GBP')} + {fmt(netUsTaxAfterFtc)}</span>
              </p>
            </div>

            {doubleLayerRisk && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <strong>Double-tax layer likely.</strong> The UK CGT does not fully offset the US liability — residual US tax of {fmt(netUsTaxAfterFtc)} is estimated. Planning the timing and structure of the disposal can affect this.
              </div>
            )}

            <div className="mt-4 space-y-2 rounded-xl bg-porcelain p-4 text-sm">
              <p className="flex items-start gap-2 text-ink"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span>Currency movement between purchase and sale creates a separate US taxable gain or loss — not captured above.</span></p>
              <p className="flex items-start gap-2 text-ink"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span>The 3.8% NIIT may apply to investment gains even after the FTC.</span></p>
              {assetType === 'property_other' && <p className="flex items-start gap-2 text-ink"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" /><span>US depreciation recapture (Section 1250) on rental property can increase US tax — not modelled here.</span></p>}
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted">
              Educational estimate only. Uses 2025/26 UK CGT rates and 2025 US federal rates. Excludes state tax, NIIT, AMT, depreciation recapture, and precise currency gain calculations. Not tax advice.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/resources/glossary/foreign-tax-credit" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Foreign Tax Credit</Link>
              <Link href="/resources/glossary/section-121-exclusion" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Section 121 exclusion</Link>
              <Link href="/resources/glossary/private-residence-relief" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">UK Private Residence Relief</Link>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">
                Plan this disposal properly
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={() => { setShow(false); setGainGbp(''); setAssetType(''); setBand(''); setHeldPeriod(''); setIncomeLevel(''); setFilingStatus(''); }} className="rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
