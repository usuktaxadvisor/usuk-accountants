# Final Project Report

## Status

Build complete. The site is a working lead-generation and knowledge asset,
drawing qualified enquiries from sophisticated prospects.

Delivered: Next.js 15.5 / TypeScript / Tailwind on Vercel, ~153 pages.
Service architecture across US expat tax, UK accounting, cross-border
advisory. 20+ articles. Glossary with schema. Nine calculators, contextually
linked. Organization / Article / FAQPage / breadcrumb schema. Canonicals,
sitemap, IndexNow on deploy, zero orphan pages. Booking flow with tier
qualification. Company registration in footer, schema, and Contact page.

Assessment: engineering, content architecture, technical SEO and AI-readiness
are substantially complete. Further additions risk being filler.

## Outstanding — none of it is engineering

### Blocking: CPA / CTA review

Technical tax positions are live without documented sign-off. Risk to reduce,
not a feature to add.

- Pension article (PCLS position) — contested area, published on assumed approval
- Streamlined figures (5% penalty, residency test, exclusions) — obtain written confirmation
- Form 8833 and treaty articles — thresholds and article references

### Highest commercial value: business owner

- Client reviews. Zero currently. A prospect said in writing this nearly cost
  the engagement. Largest single conversion constraint.
- Team LinkedIn URLs (7) — personProfiles arrays are empty
- Google Business Profile — draft description ready, listings need claiming
- Pinterest / Bing / Apple verification

### Recurring: content governance

- UK figures each Budget (March/April) — CTA
- US figures each IRS adjustment (Q4) — CPA
- Calculator and deadline review (January) — both

### Requires production access

Core Web Vitals, real-device mobile rendering, GA4 event verification, Search
Console coverage, screen-reader accessibility, actual AI citation behaviour.

## Roadmap

### Next 3 months — proof and verification

1. CPA sign-off on the four flagged items. Blocking.
2. First 5 client reviews. Highest commercial return available.
3. Publish and verify Google Business Profile.
4. Supply the seven LinkedIn URLs.
5. Verify GA4 events fire and values match current pricing.
6. Add Microsoft Clarity.
7. Live Core Web Vitals and accessibility check.

Success: a prospect who searches the firm finds verified listings, real
reviews, named credentialed advisers, and content with genuine review signals.

### Months 4-6 — measurement and qualification

1. Analyse which content produces enquiries, and which become clients
2. Enquiry categorisation and lead scoring
3. First nurture sequence for the best-converting segment
4. Reach 10+ reviews; add Review schema once genuine
5. Content review calendar as working routine

Success: the firm can answer "which content produces our clients" with data.

### Months 7-12 — scale what works

1. Expand content only where analytics show demand
2. CRM integration once volume justifies it
3. Referral partnerships with adjacent professionals
4. Webinar on the topic producing most enquiries
5. Annual full content audit

Success: growth driven by evidence, not assumption.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Published tax content wrong or stale | High | Governance calendar; CPA sign-off; primary sources only |
| Zero reviews continues costing engagements | High | Review acquisition process |
| Website and Cal.com prices diverge | Medium | Change one, change both, same day |
| GA4 values drift from actual prices | Medium | Update analytics.ts alongside site-data.ts |
| AI content published unverified | High | AI governance policy; inline verification flags |
| Key-person dependency | Medium | This documentation |

## Assumptions

1. Team credentials (CPA, ACA, ACCA, CTA) accurate as supplied
2. Company registration 17336015 correct and current
3. Office addresses and phone numbers accurate and staffed
4. Codebase pricing matches Cal.com — requires periodic verification
5. Content marked reviewedBy was genuinely reviewed by that person
6. The practice can service the enquiry volume the site generates

## Maintenance

Weekly: monitor and respond to enquiries; check for new reviews.
Monthly: Search Console review; GBP post; test the booking flow end to end.
Quarterly: calculator spot-check; review top articles; analytics against KPIs.
Annually: full content audit; update all tax figures; review pricing.

On every code change: build passes clean, no lint suppressions, update
CHANGELOG for substantive changes.

On every pricing change: update site-data.ts, analytics.ts, AND Cal.com.

## Engineering phase complete

No further high-value engineering can be identified that does not require
external input. Modifying stable code now would add risk without value.

The project transitions to operations: verification, proof, measurement,
disciplined maintenance. Those are business activities.

The highest-value action available is not on any technical roadmap: obtain
CPA sign-off on the flagged content, and ask satisfied clients for reviews.
