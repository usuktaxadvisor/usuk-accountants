/**
 * ENTITY AUTHORITY FRAMEWORK
 *
 * Canonical identity + sameAs wiring for GEO/AI-search.
 *
 * Every external profile (GBP, LinkedIn, Bing, Crunchbase, Trustpilot) is
 * registered here ONCE. Organization and Person schema read from this module,
 * so the day a profile goes live you set `url` here and the entire schema graph
 * updates — no schema edits, no hunting through files.
 *
 * RULE: a profile contributes to schema ONLY when its `url` is set (not '').
 * Placeholder entries are inert until filled — the entity stays honest.
 */

/* ---------- Canonical NAP (must match every external listing byte-for-byte) ---------- */

export const CANONICAL = {
  /** Machine/searchable name — NO mid-dot. Use everywhere external. */
  name: 'US UK Accountants',
  email: 'hello@usukaccountants.com',
  url: 'https://www.usukaccountants.com',
} as const;

/* ---------- Organization-level external profiles ---------- */

export interface EntityProfile {
  platform: 'LinkedIn' | 'Google Business Profile' | 'Bing Places' | 'Crunchbase' | 'Trustpilot';
  /** Which office a GBP belongs to (GBP only). */
  office?: 'london' | 'new-york';
  /** Live URL. EMPTY until the profile exists. */
  url: string;
  /** Status for internal tracking / dashboards. */
  status: 'live' | 'pending' | 'not-started';
  /** Whether this profile should be emitted in Organization sameAs when live. */
  sameAs: boolean;
}

/**
 * Organization profiles. Fill `url` + flip `status` to 'live' as each goes up.
 * Order reflects priority (GBP London first).
 */
export const orgProfiles: EntityProfile[] = [
  { platform: 'Google Business Profile', office: 'london', url: '', status: 'not-started', sameAs: true },
  { platform: 'Google Business Profile', office: 'new-york', url: '', status: 'not-started', sameAs: true },
  // ┌─────────────────────────────────────────────────────────────────────┐
  // │ LINKEDIN COMPANY PAGE — PASTE URL BELOW TO ACTIVATE                    │
  // │ The page exists. Replace url:'' with the real URL and set             │
  // │ status:'live'. Example:                                               │
  // │   url: 'https://www.linkedin.com/company/usukaccountants',            │
  // │   status: 'live',                                                     │
  // │ Once saved, orgSameAs() includes it and Organization schema emits it. │
  // │ No other file needs changing.                                         │
  // └─────────────────────────────────────────────────────────────────────┘
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/usukaccountants', status: 'live', sameAs: true },
  { platform: 'Bing Places', url: '', status: 'not-started', sameAs: true },
  { platform: 'Crunchbase', url: '', status: 'not-started', sameAs: true },
  { platform: 'Trustpilot', url: '', status: 'not-started', sameAs: true },
];

/** Live org sameAs URLs — feeds Organization schema. Empty until profiles go live. */
export function orgSameAs(): string[] {
  return orgProfiles
    .filter((p) => p.sameAs && p.status === 'live' && p.url)
    .map((p) => p.url);
}

/* ---------- Person-level profiles (per team member) ---------- */

/** Map of author slug → their live external profile URLs (LinkedIn, register pages). */
export const personProfiles: Record<string, string[]> = {
  'sam-h': [],      // e.g. 'https://www.linkedin.com/in/...'
  'katie-m': [],
  'briana': [],
  'sarah-j': [],
  'kristina': [],
  'shezi-r': [],
  'nicola-m': [],
};

/** Live sameAs URLs for a given person. */
export function personSameAs(slug: string): string[] {
  return (personProfiles[slug] ?? []).filter(Boolean);
}
