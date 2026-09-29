# SEO/GEO refresh — 29 September 2026 (before/after record)

Baseline (Search Console, sc-domain:usukaccountants.com, read 29 Sep 2026): last 28 days 217 clicks / 13.4k impressions / 1.6% CTR / avg position 31.5; last 3 months 402 / 35.8k / 1.1% / 42.8 (visibility began late July 2026). Indexed 190; not indexed 25 (13 noindex portal/private, 4 redirects, 1 404, 4 discovered-not-indexed, 3 crawled-not-indexed of which one real page: /resources/blog/uk-property-and-us-tax-guide). Sitemap: 200 URLs, last read 28 Sep, success. Breadcrumbs: 40 valid items, 0 invalid. Core Web Vitals: insufficient CrUX data.

Key findings: brand query drives clicks; two clusters show at ~2,000+ impressions each with 0 clicks — "streamlined" (6 competing URLs, avg position 28.6; blog post 1,026 impr vs service page 318) and "fbar" (11 URLs, avg position 44.3; service 851, guide 650). Top zero-click queries: streamlined filing service (337), fbar late filing help (304), delinquent fbar streamlined (286), should i talk to my accountant about my late-filed fbar (266), delinquent fbar reasonable cause (221), expat tax accountant uk (198), cpa streamlined filing (169), tax advisor manchester (100), delinquent fbar cover letter (86).

| Page | Old | New | Reason |
|---|---|---|---|
| /services/us-expat-tax/streamlined-filing title | IRS Streamlined Filing for Americans in the UK — Catch Up Penalty-Free | Streamlined Filing Service for Americans in the UK — IRS Catch-Up, Fixed Fee | Target the commercial query "streamlined filing service" (337 impr, 0 clicks) and remove an outcome promise on a YMYL page |
| same, H1 | Catch up on US taxes — without penalties | Streamlined Filing service for Americans in the UK | Same; H1 now names the service |
| same, meta description + lead + FAQ + body | "penalty-free" wording | Factual: the procedure waives penalties where conditions are met | Accuracy; no outcome promises |
| /resources/blog/streamlined-filing-explained description | "often penalty-free" | "without the usual late-filing penalties, where they qualify" | Accuracy |
| /resources/guides/delinquent-fbar | — | Two answer-first sections: "What the 'reason for late filing' should say" and "Should you talk to an accountant before filing a late FBAR?" | Page already shown for these exact queries (reasonable cause 221, cover letter 86, talk to accountant 266) at zero CTR |
| /about/team title | Our Team | Our Team — US & UK Tax Specialists, Enrolled Agents and ACCA Accountants | 339 impr, 4 clicks; generic title |
| /contact | no BreadcrumbList | BreadcrumbList added | Consistency; every other content page has one |

Not changed (deliberately): URLs, canonicals, robots, sitemap, navigation, homepage title, Manchester/London titles (Manchester is the best-performing non-home page), glossary/compare pages (already link to the service page).

Monitoring: 7 days — indexing errors only; 28 days — CTR/position on the streamlined service page and the FBAR guide against this baseline; 6–8 weeks — clicks on the two clusters.

## Deployment record — 29 September 2026

- PR #41 (`feat/seo-geo-refresh-2026`, rebased onto main as a single commit, 6 files), squash-merged to main as `e542add` on 29 Sep 2026. Security hardening (#39) and client deletion (#40) were already on main; `middleware.ts` and `next.config.js` were untouched by this change.
- Preview checks passed: all four pages 200, new titles/H1s, canonicals unchanged, `index, follow`, BreadcrumbList valid (Contact now has one), no invalid JSON-LD, 64 internal links all 200, no console/CSP/hydration/font errors, no horizontal overflow at 390 px, contact form validation and the three office maps working. The Preview's `x-robots-tag: noindex` is Vercel's standard Preview header and is absent on production.
- Production checks passed: the same four URLs live with the intended changes, no `x-robots-tag`, robots.txt unchanged, sitemap still 200 URLs including all four, 20 sampled sitemap URLs 200 and indexable, homepage canonical/robots unchanged.
- Search Console (sc-domain:usukaccountants.com) URL Inspection: all four were already indexed; indexing requested on 29 Sep 2026 for /services/us-expat-tax/streamlined-filing, /resources/guides/delinquent-fbar, /about/team and /contact only (content changed on each). No other URLs requested.
- 28-day review: 27 October 2026 — compare clicks, impressions, CTR, average position and query mix for the Streamlined Filing service page and the Delinquent FBAR guide against the baseline above; check branded/entity visibility after the Team title change.
