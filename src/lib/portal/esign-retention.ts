import type { SigDocKind } from './esign';

/**
 * Retention model for signature records (original, sealed PDF, evidence certificate, event chain).
 *
 * Nothing in the application deletes evidence. These rules only (a) label every completed request with a
 * retention class and a computed `retain_until`, and (b) decide whether the documented administrative purge
 * procedure MAY touch a record. A legal hold always wins. Periods are the longest applicable requirement plus a
 * safety margin; sources re-verified 28 Sep 2026 (see docs/client-portal-esign.md §8).
 *
 *   - IRS Forms 8878/8879: ERO must keep them "for three years from the return due date or the IRS received
 *     date, whichever is later" (Pub. 1345 Rev. Dec 2025; Form 8879/8878 instructions).
 *   - UK MLR 2017 reg. 40: CDD records and engagement evidence for five years after the relationship ends
 *     (not more than ten years unless another enactment or legal proceedings require it).
 *   - HMRC record-keeping: 22 months (employees), 5 years after 31 Jan (self-employed), 6 years (companies);
 *     longer when an enquiry or compliance check is open.
 *   - UK GDPR Art. 5(1)(e): keep no longer than necessary and be able to justify the period.
 *
 * The firm's operational default is 7 years from completion (covers every period above with margin); it is a
 * policy choice, not a statutory minimum, and is reviewable per class below without a schema change.
 */
export type RetentionClass = 'STANDARD_7Y' | 'IRS_EFILE_AUTH_7Y' | 'ENGAGEMENT_10Y' | 'ADVISORY_7Y';

export const RETENTION_POLICY: Record<RetentionClass, { years: number; basis: string }> = {
  STANDARD_7Y: { years: 7, basis: 'Firm default: exceeds HMRC 6-year company / 5-year self-employed record periods and UK GDPR justification is documented (defence of claims, professional-body expectations).' },
  IRS_EFILE_AUTH_7Y: { years: 7, basis: 'IRS Pub. 1345 requires 3 years from the return due date or IRS received date (later of); firm keeps 7 to align with the standard class.' },
  ENGAGEMENT_10Y: { years: 10, basis: 'MLR 2017 reg. 40 five years after the relationship ends (end date unknown at signing, so the ten-year statutory ceiling is used) and limitation periods for contract claims.' },
  ADVISORY_7Y: { years: 7, basis: 'Professional advice records; limitation period for claims plus margin.' },
};

export function retentionClassFor(kind: SigDocKind): RetentionClass {
  switch (kind) {
    case 'IRS_8879': case 'IRS_8878': return 'IRS_EFILE_AUTH_7Y';
    case 'ENGAGEMENT_LETTER': return 'ENGAGEMENT_10Y';
    case 'ADVISORY': return 'ADVISORY_7Y';
    default: return 'STANDARD_7Y';
  }
}

export function retainUntilFor(kind: SigDocKind, completedAt: Date): { retentionClass: RetentionClass; retainUntil: Date } {
  const retentionClass = retentionClassFor(kind);
  const retainUntil = new Date(completedAt); retainUntil.setUTCFullYear(retainUntil.getUTCFullYear() + RETENTION_POLICY[retentionClass].years);
  return { retentionClass, retainUntil };
}

/**
 * Whether the administrative purge procedure may consider this record. Never true while a legal hold is set,
 * before retain_until, or when retain_until was never computed (uncompleted / unknown records are kept).
 */
export function mayPurge(row: { retainUntil: Date | null; legalHoldAt: Date | null; status: string }, now: Date = new Date()): { ok: true } | { ok: false; reason: string } {
  if (row.legalHoldAt) return { ok: false, reason: 'legal hold' };
  if (!row.retainUntil) return { ok: false, reason: 'no retention date computed' };
  if (now.getTime() < row.retainUntil.getTime()) return { ok: false, reason: 'within retention period' };
  return { ok: true };
}
