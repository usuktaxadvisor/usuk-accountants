'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconShield } from '@/components/ui/icons';

/**
 * US Late-Filing Penalty Estimator (educational)
 * FTF: 5%/mo capped 25%. FTP: 0.5%/mo capped 25%.
 * Overlap rule: FTF reduced by FTP = 4.5% + 0.5% = 5%/mo combined for first 5 months.
 * NOT MODELLED: interest, instalment-agreement FTP reduction, abatement.
 */

const FTP_RATE = 0.005;
const CAP = 0.25;

function estimate(taxOwed: number, monthsLate: number) {
  const m = Math.max(0, Math.ceil(monthsLate));
  const overlapMonths = Math.min(m, 5);
  const ftfRate = Math.min(overlapMonths * (0.05 - FTP_RATE), CAP);
  const ftpRate = Math.min(m * FTP_RATE, CAP);
  return {
    ftf: taxOwed * ftfRate,
    ftp: taxOwed * ftpRate,
    combined: taxOwed * (ftfRate + ftpRate),
    ftfCapped: ftfRate >= CAP - 0.001,
    ftpCapped: ftpRate >= CAP,
  };
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function LateFilingPenaltyEstimator() {
  const [tax, setTax] = useState('');
  const [months, setMonths] = useState('');
  const [show, setShow] = useState(false);

  const taxNum = Number(tax.replace(/[^0-9.]/g, '')) || 0;
  const monthsNum = Number(months.replace(/[^0-9.]/g, '')) || 0;
  const r = estimate(taxNum, monthsNum);
  const zeroTax = show && taxNum <= 0;

  const inputCls = 'w-full rounded-xl border border-mist bg-porcelain px-4 py-3 text-ink outline-none transition-colors focus:border-gold';
  const labelCls = 'mb-1.5 block text-sm font-medium text-ink';

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-mist bg-white p-8 shadow-e1">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-antique">
          <IconShield className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
          Estimate your US late-filing penalties
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter the US tax you still owe and how many months late the return is. This gives an
          indicative maximum of the two main IRS civil penalties — it does not include interest,
          and assumes US tax is actually due after reliefs.
        </p>
        <div className="mt-7 space-y-5">
          <div>
            <label htmlFor="tax" className={labelCls}>US tax owed for the year (USD)</label>
            <input id="tax" inputMode="decimal" value={tax} onChange={e => setTax(e.target.value)}
              placeholder="e.g. 4,000" className={inputCls} />
            <p className="mt-1.5 text-xs text-muted">
              The unpaid balance — not your income. If the Foreign Tax Credit or FEIE eliminates your US tax, enter 0.
            </p>
          </div>
          <div>
            <label htmlFor="months" className={labelCls}>Months the return is late</label>
            <input id="months" inputMode="decimal" value={months} onChange={e => setMonths(e.target.value)}
              placeholder="e.g. 8" className={inputCls} />
            <p className="mt-1.5 text-xs text-muted">
              Counted from the deadline that applies to you. Americans abroad get an automatic extension to 15 June.
            </p>
          </div>
          <button onClick={() => setShow(true)}
            className="w-full rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">
            Estimate penalties
          </button>
        </div>

        {show && (
          <div className="mt-8 border-t border-mist pt-7">
            {zeroTax ? (
              <>
                <h3 className="font-display text-xl font-semibold text-ink">
                  With no US tax owed, these penalties are generally zero
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  The failure-to-file and failure-to-pay penalties are calculated as a percentage of unpaid tax.
                  If reliefs reduce your US tax to zero, these penalties are generally zero too. The return must
                  still be filed, and separate flat-rate penalties apply to missed information returns such as the FBAR.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-display text-xl font-semibold text-ink">
                  Indicative maximum: {fmt(r.combined)}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  On {fmt(taxNum)} of unpaid tax, roughly {monthsNum} month{monthsNum === 1 ? '' : 's'} late.
                </p>
                <div className="mt-5 space-y-3 rounded-xl bg-porcelain p-5 text-sm">
                  <p className="flex items-start gap-2 text-ink">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                    <span><strong>Failure-to-file:</strong> {fmt(r.ftf)}{r.ftfCapped ? ' (at the 25% cap)' : ''}</span>
                  </p>
                  <p className="flex items-start gap-2 text-ink">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-antique" />
                    <span><strong>Failure-to-pay:</strong> {fmt(r.ftp)}{r.ftpCapped ? ' (at the 25% cap)' : ''}</span>
                  </p>
                </div>
              </>
            )}
            <p className="mt-6 text-xs leading-relaxed text-muted">
              Educational estimate using headline IRS penalty rates. Excludes interest (which compounds daily),
              any reduction once an instalment agreement is in place, and penalty relief such as First-Time Abate
              or reasonable cause — all of which can change the real figure. Penalties also interact with the
              Streamlined and delinquent-FBAR routes, which can remove them for those who qualify.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/resources/glossary/streamlined-filing" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Streamlined Filing</Link>
              <Link href="/resources/blog/delinquent-fbar-vs-streamlined-filing" className="font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">Delinquent FBAR vs Streamlined</Link>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/book"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-ink">
                Discuss reducing my penalties
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={() => { setShow(false); setTax(''); setMonths(''); }}
                className="rounded-xl border border-mist px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-porcelain">
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
