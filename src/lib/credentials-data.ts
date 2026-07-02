/**
 * CREDENTIAL DATABASE — verified-only.
 *
 * A team member's credential appears on their profile and in Person schema
 * `hasCredential` ONLY when status === 'verified'. Until then it is invisible
 * everywhere. This makes EEAT structurally honest: no placeholder, no
 * unverified letters against a real person's name, ever.
 *
 * To add a verified credential:
 *   1. Confirm it on the issuing body's public register.
 *   2. Add an entry with status:'verified', verifiedDate, and verifyUrl.
 *   3. The profile + schema update automatically.
 */

export type CredentialBody =
  | 'ACCA' | 'AICPA' | 'IRS Enrolled Agent' | 'ATT' | 'CIOT' | 'CPA' | 'CTA'
  | 'ACA' | 'CIMA' | 'AAT' | 'Other';

export interface TeamCredential {
  body: CredentialBody;
  /** Full label, e.g. 'ACCA — Chartered Certified Accountant'. */
  label: string;
  /** Public registration / membership number, only if confirmed & publishable. */
  registrationNumber?: string;
  /** Link to the issuing body's public register entry, if available. */
  verifyUrl?: string;
  /** Date you confirmed it against the register (ISO). */
  verifiedDate?: string;
  status: 'verified' | 'pending';
}

/**
 * Per-team-member credentials, keyed by author slug.
 * ALL currently 'pending' — populate as each is verified. Do NOT mark
 * 'verified' without confirming on the issuing body's register.
 */
export const teamCredentials: Record<string, TeamCredential[]> = {
  'sam-h': [
    { body: 'ACCA', label: 'ACCA — Chartered Certified Accountant', status: 'verified', verifiedDate: '2026-07-02' },
    { body: 'ACA', label: 'ACA — Associate Chartered Accountant (ICAEW)', status: 'verified', verifiedDate: '2026-07-02' },
  ],
  'katie-m': [
    { body: 'CPA', label: 'CPA — Certified Public Accountant (US)', status: 'verified', verifiedDate: '2026-07-02' },
  ],
  'briana': [
    { body: 'CPA', label: 'CPA — Certified Public Accountant (US)', status: 'verified', verifiedDate: '2026-07-02' },
  ],
  'sarah-j': [
    { body: 'ACA', label: 'ACA — Associate Chartered Accountant (ICAEW)', status: 'verified', verifiedDate: '2026-07-02' },
  ],
  'kristina': [
    { body: 'CTA', label: 'CTA — Chartered Tax Adviser (CIOT)', status: 'verified', verifiedDate: '2026-07-02' },
  ],
  'shezi-r': [
    { body: 'ACCA', label: 'ACCA — Chartered Certified Accountant', status: 'verified', verifiedDate: '2026-07-02' },
    { body: 'CIMA', label: 'CIMA — Chartered Management Accountant', status: 'verified', verifiedDate: '2026-07-02' },
    { body: 'AAT', label: 'AAT — Association of Accounting Technicians', status: 'verified', verifiedDate: '2026-07-02' },
  ],
  'nicola-m': [
    { body: 'ACCA', label: 'ACCA — Chartered Certified Accountant', status: 'verified', verifiedDate: '2026-07-02' },
  ],
};

/** Only verified credentials for a member. Drives profile display + schema. */
export function verifiedCredentials(slug: string): TeamCredential[] {
  return (teamCredentials[slug] ?? []).filter((c) => c.status === 'verified');
}

/** Schema `hasCredential` value (array of full body labels) — verified only. */
export function credentialSchemaFor(slug: string): string[] {
  return verifiedCredentials(slug).map((c) => c.label);
}

/** Short display codes (e.g. ['ACCA','ACA']) for badges and bylines — verified only. */
export function credentialCodesFor(slug: string): string[] {
  return verifiedCredentials(slug).map((c) => c.body);
}

/** Post-nominal string, e.g. "ACCA, ACA" — verified only, '' if none. */
export function postNominalsFor(slug: string): string {
  return credentialCodesFor(slug).join(', ');
}

/** Whether a member has any verified credential (for display logic). */
export function hasVerifiedCredentials(slug: string): boolean {
  return verifiedCredentials(slug).length > 0;
}
