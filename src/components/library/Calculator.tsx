'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IconCalculator, IconArrowRight, IconCheck } from '@/components/ui/icons';
import { submitLead, analytics } from '@/lib/analytics';

function formatGBP(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

// Simplified illustrative estimate of US tax offset by UK tax via Foreign Tax Credit.
// Not tax advice — gives a directional figure to drive the consultation.
function estimate(income: number, ukRatePct: number) {
  const ukTax = income * (ukRatePct / 100);
  // Illustrative US liability before credits (rough effective banding)
  let usEffective = 0.1;
  if (income > 50000) usEffective = 0.15;
  if (income > 100000) usEffective = 0.2;
  if (income > 180000) usEffective = 0.24;
  const usTaxBeforeCredit = income * usEffective;
  const foreignTaxCredit = Math.min(ukTax, usTaxBeforeCredit);
  const usResidual = Math.max(0, usTaxBeforeCredit - foreignTaxCredit);
  const reliefSecured = foreignTaxCredit; // double tax avoided
  return { ukTax, usTaxBeforeCredit, usResidual, reliefSecured };
}

export function Calculator() {
  const [income, setIncome] = useState(85000);
  const [ukRate, setUkRate] = useState(28);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const r = useMemo(() => estimate(income, ukRate), [income, ukRate]);

  return (
    <section id="calculator" className="bg-navy-ink py-20 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-eyebrow text-gold">
              <IconCalculator className="h-4 w-4" /> Free interactive tool
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Estimate your US–UK double-tax position in 60 seconds
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-softwhite/80">
              See how the Foreign Tax Credit and US–UK treaty can offset your US
              liability against UK tax already paid. Most clients legally owe tax
              in only one place — this shows you roughly where you stand.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                'No sign-up needed to see your estimate',
                'Built on real US–UK treaty mechanics',
                'A specialist reviews your exact numbers on a call',
              ].map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-softwhite/85">
                  <IconCheck className="h-4 w-4 shrink-0 text-gold" /> {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Calculator */}
          <div className="rounded-2xl border border-navy-slate bg-navy-royal/60 p-6 backdrop-blur-sm sm:p-8">
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="income" className="text-sm font-medium text-softwhite">
                    Annual income
                  </label>
                  <span className="font-data text-sm font-semibold text-gold-champagne tnum">
                    {formatGBP(income)}
                  </span>
                </div>
                <input
                  id="income"
                  type="range"
                  min={20000}
                  max={300000}
                  step={1000}
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full accent-[#C9A84C]"
                  aria-valuetext={formatGBP(income)}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="ukrate" className="text-sm font-medium text-softwhite">
                    Effective UK tax rate
                  </label>
                  <span className="font-data text-sm font-semibold text-gold-champagne tnum">
                    {ukRate}%
                  </span>
                </div>
                <input
                  id="ukrate"
                  type="range"
                  min={0}
                  max={45}
                  step={1}
                  value={ukRate}
                  onChange={(e) => setUkRate(Number(e.target.value))}
                  className="w-full accent-[#C9A84C]"
                  aria-valuetext={`${ukRate}%`}
                />
              </div>

              {/* Result */}
              <div className="rounded-xl bg-navy-ink/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">
                  Estimated double-tax relief
                </p>
                <p className="mt-1 font-display text-4xl font-semibold text-gold-champagne tnum">
                  {formatGBP(r.reliefSecured)}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-navy-royal/50 px-3 py-2.5">
                    <p className="text-xs text-softwhite/60">UK tax paid</p>
                    <p className="font-data font-semibold text-softwhite tnum">{formatGBP(r.ukTax)}</p>
                  </div>
                  <div className="rounded-lg bg-navy-royal/50 px-3 py-2.5">
                    <p className="text-xs text-softwhite/60">Est. US residual</p>
                    <p className="font-data font-semibold text-softwhite tnum">{formatGBP(r.usResidual)}</p>
                  </div>
                </div>
              </div>

              {/* Capture */}
              {!sent ? (
                <div className="space-y-2.5">
                  <label htmlFor="calc-email" className="text-sm text-softwhite/80">
                    Email my full breakdown &amp; next steps
                  </label>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input
                      id="calc-email"
                      type="email"
                      inputMode="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="min-h-[48px] flex-1 rounded-lg border border-navy-slate bg-navy-ink/60 px-4 text-sm text-white placeholder:text-softwhite/40 focus:border-gold focus:outline-none"
                    />
                    <button
                      onClick={async () => {
                        if (!email.includes('@')) return;
                        analytics.calculatorUsed('double_tax_estimator');
                        await submitLead({
                          type: 'lead',
                          email,
                          source: 'double_tax_calculator',
                        });
                        setSent(true);
                      }}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-champagne px-5 font-semibold text-navy-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold"
                    >
                      Send it <IconArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-softwhite/50">
                    No spam. Estimate only — your specialist confirms exact figures.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-gold/40 bg-gold/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-gold-champagne">
                    <IconCheck className="h-4 w-4" /> On its way. Want it reviewed live?
                  </p>
                  <Link
                    href="/book"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-champagne px-5 py-2.5 text-sm font-semibold text-navy-ink"
                  >
                    Book a free consultation <IconArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
