# Pre-Launch Operational Checklists

These are the data/account items the website is built and waiting for. The code
is honest by construction — nothing fabricated renders, and each system
activates automatically when you supply real data.

---

## Google Business Profile — information required per office

GBP applies to **staffed offices only**: London and New York. Virginia is
excluded until genuinely staffed (`gbpEligible: false`).

For **each** of London and New York, you'll need:

- [ ] Exact business name: **US UK Accountants** (no mid-dot — matches schema)
- [ ] Exact address (must match `site-data.ts` byte-for-byte):
  - London: 70 Queen Road, London E17 8QP, UK
  - New York: 49 Mill Lane, Briarcliff Manor, NY 10510, USA
- [ ] Local phone (matches site):
  - London: +44 333 090 4129
  - New York: +1 914 953 7475
- [ ] Primary category: **Accountant** (secondary: Tax preparation service, Tax consultant)
- [ ] Business hours
- [ ] Service list (UK Accounting, US Expat Tax, Cross-Border Advisory, etc.)
- [ ] Website URL: https://www.usukaccountants.com
- [ ] A short business description (reuse the homepage positioning line)
- [ ] Verification method (postcard / phone / video) — **start early, weeks of lead time**

**After each profile is verified:**
1. Copy its public URL.
2. In `src/lib/entity-data.ts`, find the matching GBP entry, set `url` and `status: 'live'`.
3. The URL flows into Organization `sameAs` and the office's LocalBusiness schema automatically.

---

## Team credential activation — information required per person

Credentials render **only when verified**. Until then, profiles show role +
expertise only (honest, never a placeholder claim).

For **each** team member with a professional qualification, collect:

- [ ] Issuing body (ACCA / AICPA / IRS Enrolled Agent / ATT / CIOT / CPA / CTA / other)
- [ ] Full credential label (e.g. "ACCA — Chartered Certified Accountant")
- [ ] Registration / membership / PTIN number
- [ ] Public register URL where it can be independently checked
- [ ] Date you confirmed it against that register

**To activate (per credential):**
1. Confirm the number on the issuing body's public register.
2. In `src/lib/credentials-data.ts`, add a `TeamCredential` under the person's slug with
   `status: 'verified'`, `verifiedDate`, and `verifyUrl`.
3. The badge appears on their profile and `hasCredential` enters their Person schema automatically.

Team slugs: `sam-h`, `katie-m`, `briana`, `sarah-j`, `kristina`, `shezi-r`, `nicola-m`.

---

## LinkedIn (company page exists)

- [ ] Paste the company page URL into `src/lib/entity-data.ts` (the boxed LinkedIn entry),
      set `status: 'live'`. It then appears in Organization `sameAs`.
- [ ] As individual LinkedIn profiles go live, add their URLs to `personProfiles` in the
      same file (keyed by slug) — they feed each person's Person-schema `sameAs`.

---

## Reviews (none yet — engine ready)

- [ ] When genuine reviews arrive, add them to `reviews` in `src/lib/trust-data.ts`.
- [ ] Rating, count, star displays and `aggregateRating` schema all activate automatically
      and derive from the real data. Do **not** hand-type a rating.
