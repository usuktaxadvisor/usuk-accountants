/**
 * TAX RATE CONSTANTS — single source of truth for calculator figures.
 *
 * IMPORTANT: These are the headline UK figures used by the indicative calculators.
 * They change at fiscal events. Update them here once a year (Budget / new tax year)
 * and every calculator that imports them stays correct.
 *
 * Each block is dated. Calculators state "based on <TAX_YEAR_LABEL> rates" and end
 * with a recommendation to confirm current figures with a specialist.
 *
 * Last reviewed: 2026 (for the 2025/26 UK tax year).
 */

export const TAX_YEAR_LABEL = '2025/26';

/* ---------------- UK income tax (England, Wales & NI; rUK) ---------------- */
export const UK_INCOME_TAX = {
  personalAllowance: 12570,
  paTaperThreshold: 100000,
  bands: [
    { name: 'Basic rate', rate: 0.2, upTo: 50270 },
    { name: 'Higher rate', rate: 0.4, upTo: 125140 },
    { name: 'Additional rate', rate: 0.45, upTo: Infinity },
  ],
};

/* ---------------- UK National Insurance (employee, Class 1) ---------------- */
export const UK_NI_EMPLOYEE = {
  primaryThreshold: 12570,
  upperEarningsLimit: 50270,
  mainRate: 0.08,
  upperRate: 0.02,
};

/* ---------------- UK Corporation Tax ---------------- */
export const UK_CORP_TAX = {
  smallProfitsRate: 0.19,
  mainRate: 0.25,
  lowerLimit: 50000,
  upperLimit: 250000,
  marginalReliefFraction: 3 / 200,
};

/* ---------------- HMRC Self Assessment late-filing penalties ---------------- */
export const SA_PENALTIES = {
  initialLateFiling: 100,
  dailyPenalty: 10,
  dailyPenaltyMaxDays: 90,
  sixMonthPenaltyPct: 0.05,
  sixMonthPenaltyMin: 300,
  twelveMonthPenaltyPct: 0.05,
  twelveMonthPenaltyMin: 300,
  latePaymentPct: 0.05,
};

/* ---------------- FIG regime (replaced remittance basis 6 Apr 2025) ---------------- */
export const FIG_REGIME = {
  fromDate: '6 April 2025',
  reliefYears: 4,
  priorNonResidenceYears: 10,
};
