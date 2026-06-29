# Trust & Authority Activation Guide

The site's trust infrastructure is already built and fabrication-proof. Nothing here needs
to be designed — it needs real data, and the moment you add it, the relevant UI and schema
appear automatically and correctly. This guide is the single checklist of what to populate, and
where, when the data exists.

Golden rule (enforced in code): nothing in these systems is ever invented. Ratings derive from
real reviews; credentials emit only when verified; case studies are labelled illustrative
until real ones replace them. Do not hand-type ratings, credentials, or attributed quotes.

---

## 1. Client reviews / star ratings — src/lib/trust-data.ts

Currently: empty reviews array. All rating UI and AggregateRating schema are gated off —
nothing renders, nothing is faked.

To activate: populate the reviews array with genuine, attributable entries (ideally synced
from Google Business Profile or Trustpilot), and set verifiedReviewSources. Each entry needs
name, rating (1-5), quote, optional context/source/date. The site then shows star ratings and
testimonial blocks automatically, and emits valid AggregateRating schema (rating + count
derived, never hand-set).

You provide: the actual reviews (and ideally a live Google/Trustpilot profile to link as the
verifiable source). Do not invent or paraphrase — use the reviewer's real words.

---

## 2. Case studies — src/lib/authority-data.ts (caseStudies)

Currently: illustrative scenarios, correctly labelled as representative (not specific
clients) on /about/case-studies.

To upgrade to real ones: replace (or add) entries based on genuine, anonymised client
work, with the client's permission. Keep the structure (challenge, approach, outcome,
metrics, services). Once entries are real, soften the "illustrative" framing on the page to
"anonymised real client outcomes."

You provide: real anonymised cases + permission to publish. Metrics must be true.

---

## 3. Team credentials — src/lib/credentials-data.ts

Currently: credentialSchemaFor() emits only verified credentials; placeholders
("Credentials to be verified") are correctly suppressed from schema and display.

To activate: add each team member's real, verifiable professional credentials (e.g. CPA,
EA, ACCA, ACA, ATT, CTA + jurisdiction/registration where applicable). They then appear in the
Person schema (hasCredential) and on team/author bylines — a major E-E-A-T lift.

You provide: the genuine credential names per person. Never add a credential someone
doesn't hold.

---

## 4. Author social profiles (sameAs) — src/lib/entity-data.ts (personProfiles)

Currently: empty arrays per slug — so no sameAs is emitted (honest, not broken).

To activate: drop each person's real LinkedIn (and any professional profile) URL into
their slug's array. Person schema sameAs then links the entity to the wider web — strengthening
entity disambiguation for Google's Knowledge Graph and AI engines.

You provide: the real profile URLs. Format is ready; it's a one-line paste per person.

---

## 5. Professional memberships — src/lib/site-data.ts (credentials)

Currently: credentials empty, with a code comment "Do NOT list unverified bodies."

To activate: add genuine firm-level memberships (e.g. AICPA, ACCA, professional indemnity /
regulated-body registration). These reinforce Organization-level trust.

You provide: real membership/registration details.

---

## 6. Media mentions / publications / speaking — (new, build when first item exists)

There's no module for these yet because there's nothing real to list. When the firm earns its
first genuine press mention, byline, or speaking slot, that's the trigger to add a small
mediaMentions array (with source name + verifiable URL) surfaced on an About/Press page and,
where appropriate, as Organization sameAs / subjectOf. Build at first real item — not before.

---

## Priority order (highest E-E-A-T lift per unit effort)

1. Author LinkedIn URLs (#4) — trivial effort, immediate entity-graph benefit.
2. Real team credentials (#3) — high E-E-A-T lift; needs only the genuine credential names.
3. Google Business Profile + reviews (#1) — biggest trust signal; you've deferred GBP, so
   this waits on that.
4. Real anonymised case studies (#2) — strong, needs client permission.
5. Memberships (#5), media (#6) — as they become real.

Everything above is waiting on your data, not on engineering. The infrastructure is done.
