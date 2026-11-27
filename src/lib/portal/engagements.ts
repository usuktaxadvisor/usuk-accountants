/**
 * Engagements and statutory deadlines.
 *
 * The rules below produce the standard filing and payment dates for a service and tax year. They are
 * the published statutory dates only (GOV.UK Self Assessment deadlines; IRS individual, FBAR and
 * Form 5472/1120 due dates). US dates that fall on a Saturday or Sunday move to the next Monday, as the
 * IRS does; federal holidays are not modelled. UK dates never move. Anything client-specific (VAT
 * quarters, payroll, advisory work) is added by staff as a manual deadline.
 */

export type ServiceKey =
  | 'UK_SELF_ASSESSMENT' | 'US_1040' | 'FBAR' | 'US_5472_1120' | 'UK_COMPANY'
  | 'US_STREAMLINED' | 'UK_VAT' | 'PAYROLL' | 'ADVISORY' | 'OTHER';

export type YearFormat = 'UK_TAX_YEAR' | 'CALENDAR_YEAR' | 'PERIOD_END' | 'FREE';

export const SERVICES: Record<ServiceKey, { label: string; year: YearFormat; yearHint: string }> = {
  UK_SELF_ASSESSMENT: { label: 'UK Self Assessment return', year: 'UK_TAX_YEAR', yearHint: 'e.g. 2025/26' },
  US_1040: { label: 'US federal return (Form 1040)', year: 'CALENDAR_YEAR', yearHint: 'e.g. 2025' },
  FBAR: { label: 'FBAR (FinCEN Form 114)', year: 'CALENDAR_YEAR', yearHint: 'e.g. 2025' },
  US_5472_1120: { label: 'US LLC Form 5472 with pro forma 1120', year: 'CALENDAR_YEAR', yearHint: 'e.g. 2025' },
  UK_COMPANY: { label: 'UK company accounts and Corporation Tax', year: 'PERIOD_END', yearHint: 'accounting period end, e.g. 2026-03-31' },
  US_STREAMLINED: { label: 'IRS Streamlined filing', year: 'FREE', yearHint: 'e.g. 2022–2024' },
  UK_VAT: { label: 'UK VAT returns', year: 'FREE', yearHint: 'e.g. 2026/27' },
  PAYROLL: { label: 'Payroll', year: 'FREE', yearHint: 'e.g. 2026/27' },
  ADVISORY: { label: 'Advisory or written report', year: 'FREE', yearHint: 'e.g. 2026' },
  OTHER: { label: 'Other work', year: 'FREE', yearHint: 'e.g. 2026' },
};

export const ENGAGEMENT_STATUS: Record<string, string> = {
  PLANNED: 'Planned', IN_PROGRESS: 'In progress', AWAITING_CLIENT: 'Waiting on client', IN_REVIEW: 'In review',
  FILED: 'Filed', COMPLETED: 'Completed', ON_HOLD: 'On hold',
};
export const ENGAGEMENT_STATUSES = Object.keys(ENGAGEMENT_STATUS);
export const isOpenEngagement = (status: string) => !['COMPLETED', 'FILED'].includes(status);

export function isService(v: string): v is ServiceKey { return v in SERVICES; }

/** Normalises and validates the tax year for a service. Returns null when the format is wrong. */
export function normaliseTaxYear(service: ServiceKey, raw: string): string | null {
  const v = raw.trim();
  switch (SERVICES[service].year) {
    case 'UK_TAX_YEAR': {
      const m = v.match(/^(20\d\d)\s*[\/-]\s*(\d\d|20\d\d)$/);
      if (!m) return null;
      const start = Number(m[1]); const end = Number(m[2].length === 2 ? `20${m[2]}` : m[2]);
      return end === start + 1 ? `${start}/${String(end).slice(2)}` : null;
    }
    case 'CALENDAR_YEAR': return /^20\d\d$/.test(v) ? v : null;
    case 'PERIOD_END': {
      if (!/^20\d\d-\d\d-\d\d$/.test(v)) return null;
      const d = new Date(`${v}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v ? v : null; // rejects 30 February
    }
    default: return v.length > 0 && v.length <= 40 ? v : null;
  }
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const utc = (y: number, m: number, day: number) => new Date(Date.UTC(y, m - 1, day));
/** IRS: a due date on a weekend moves to the following Monday. */
function irs(d: Date): Date {
  const wd = d.getUTCDay();
  return wd === 6 ? new Date(d.getTime() + 2 * 86_400_000) : wd === 0 ? new Date(d.getTime() + 86_400_000) : d;
}
function addMonths(d: Date, months: number): Date {
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + months, day = d.getUTCDate();
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(day, last)));
}

export type RuleDeadline = { ruleKey: string; label: string; dueDate: string; kind: 'FILING' | 'PAYMENT' | 'REGISTRATION' | 'PAPER' };

/** Dates that only apply in some cases (first-year registration, paper filing): shown, but never raised as overdue. */
export const CONDITIONAL_KINDS = ['REGISTRATION', 'PAPER'];

/** Statutory deadlines for one service and (normalised) tax year. Empty for services with no fixed dates. */
export function ruleDeadlines(service: ServiceKey, taxYear: string): RuleDeadline[] {
  switch (service) {
    case 'UK_SELF_ASSESSMENT': {
      const end = Number(taxYear.slice(0, 4)) + 1; // 2025/26 ends 5 April 2026
      return [
        { ruleKey: 'sa_register', label: 'Register for Self Assessment, if not already registered', dueDate: iso(utc(end, 10, 5)), kind: 'REGISTRATION' },
        { ruleKey: 'sa_paper', label: 'Paper return deadline, if filing on paper', dueDate: iso(utc(end, 10, 31)), kind: 'PAPER' },
        { ruleKey: 'sa_online', label: 'Online return and tax payment due', dueDate: iso(utc(end + 1, 1, 31)), kind: 'FILING' },
        { ruleKey: 'sa_poa2', label: 'Second payment on account, if payments on account apply', dueDate: iso(utc(end + 1, 7, 31)), kind: 'PAYMENT' },
      ];
    }
    case 'US_1040': {
      const y = Number(taxYear) + 1;
      return [
        { ruleKey: 'us_pay', label: 'Tax payment due (interest runs from this date)', dueDate: iso(irs(utc(y, 4, 15))), kind: 'PAYMENT' },
        { ruleKey: 'us_abroad', label: 'Filing deadline for taxpayers living abroad (automatic 2-month extension)', dueDate: iso(irs(utc(y, 6, 15))), kind: 'FILING' },
        { ruleKey: 'us_extended', label: 'Extended filing deadline, if Form 4868 was filed', dueDate: iso(irs(utc(y, 10, 15))), kind: 'FILING' },
      ];
    }
    case 'FBAR': {
      const y = Number(taxYear) + 1;
      return [
        { ruleKey: 'fbar_due', label: 'FBAR due', dueDate: iso(irs(utc(y, 4, 15))), kind: 'FILING' },
        { ruleKey: 'fbar_ext', label: 'FBAR automatic extension deadline', dueDate: iso(irs(utc(y, 10, 15))), kind: 'FILING' },
      ];
    }
    case 'US_5472_1120': {
      const y = Number(taxYear) + 1;
      return [
        { ruleKey: 'llc_due', label: 'Form 5472 with pro forma 1120 due', dueDate: iso(irs(utc(y, 4, 15))), kind: 'FILING' },
        { ruleKey: 'llc_ext', label: 'Extended deadline, if Form 7004 was filed', dueDate: iso(irs(utc(y, 10, 15))), kind: 'FILING' },
      ];
    }
    case 'UK_COMPANY': {
      const end = new Date(`${taxYear}T00:00:00Z`);
      const plus9m1d = new Date(addMonths(end, 9).getTime() + 86_400_000);
      return [
        { ruleKey: 'co_accounts', label: 'Annual accounts due at Companies House (private company)', dueDate: iso(addMonths(end, 9)), kind: 'FILING' },
        { ruleKey: 'co_ct_pay', label: 'Corporation Tax payment due', dueDate: iso(plus9m1d), kind: 'PAYMENT' },
        { ruleKey: 'co_ct600', label: 'Company Tax Return (CT600) due', dueDate: iso(addMonths(end, 12)), kind: 'FILING' },
      ];
    }
    default: return [];
  }
}

/** The following year's tax year for a recurring service, or null if the service has no fixed cycle. */
export function nextTaxYear(service: ServiceKey, taxYear: string): string | null {
  switch (SERVICES[service].year) {
    case 'UK_TAX_YEAR': { const s = Number(taxYear.slice(0, 4)) + 1; return `${s}/${String(s + 1).slice(2)}`; }
    case 'CALENDAR_YEAR': return String(Number(taxYear) + 1);
    case 'PERIOD_END': return iso(addMonths(new Date(`${taxYear}T00:00:00Z`), 12));
    default: return null;
  }
}

/** True once the tax year or accounting period has ended, i.e. the work for it has become due. */
export function periodClosed(service: ServiceKey, taxYear: string, today: Date): boolean {
  const t = iso(today);
  switch (SERVICES[service].year) {
    case 'UK_TAX_YEAR': return t > iso(utc(Number(taxYear.slice(0, 4)) + 1, 4, 5));
    case 'CALENDAR_YEAR': return t > `${taxYear}-12-31`;
    case 'PERIOD_END': return t > taxYear;
    default: return false;
  }
}

export type DeadlineState = 'done' | 'overdue' | 'due-soon' | 'upcoming';
export const DUE_SOON_DAYS = 30;
/** How a deadline should be shown today. */
export function deadlineState(dueDate: string, doneAt: Date | null, today: Date): DeadlineState {
  if (doneAt) return 'done';
  const t = iso(today);
  if (dueDate < t) return 'overdue';
  const soon = iso(new Date(today.getTime() + DUE_SOON_DAYS * 86_400_000));
  return dueDate <= soon ? 'due-soon' : 'upcoming';
}

export function daysBetween(fromIso: string, toIso: string) {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86_400_000);
}

/** "15 Jun 2026" from a yyyy-mm-dd date string, without timezone drift. */
export function formatIsoDate(d: string) {
  return new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** Best-effort tax year from a request or file title, used to group files ("2025", "2024/25"). */
export function inferTaxYear(text: string): string | null {
  const uk = text.match(/\b(20\d\d)\s*[\/-]\s*(\d\d)\b(?!\d)/);
  if (uk && Number(uk[2]) === (Number(uk[1]) + 1) % 100) return `${uk[1]}/${uk[2]}`;
  const years = [...text.matchAll(/\b(20[0-4]\d)\b/g)].map(m => m[1]);
  return years.length === 1 ? years[0] : null;
}
