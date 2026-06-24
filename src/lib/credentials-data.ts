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
  | 'ACCA' | 'AICPA' | 'IRS Enrolled Agent' | 'ATT' | 'CIOT' | 'CPA' | 'CTA' | 'Other';

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
  'sam-h': [],
  'katie-m': [],
  'briana': [],
  'sarah-j': [],
  'kristina': [],
  'shezi-r': [],
  'nicola-m': [],
};

/** Only verified credentials for a member. Drives profile display + schema. */
export function verifiedCredentials(slug: string): TeamCredential[] {
  return (teamCredentials[slug] ?? []).filter((c) => c.status === 'verified');
}

/** Schema `hasCredential` value (array of body labels) — verified only. */
export function credentialSchemaFor(slug: string): string[] {
  return verifiedCredentials(slug).map((c) => c.label);
}

/** Whether a member has any verified credential (for display logic). */
export function hasVerifiedCredentials(slug: string): boolean {
  return verifiedCredentials(slug).length > 0;
}
