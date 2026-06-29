# Cluster B — Filing Fundamentals: Complete Architecture

Status: Designed, not drafted. Ready to write when the 2-week indexing window closes and
GSC query data is available to confirm priority order.

Strategic role: The high-volume, top-of-funnel entry layer. Where Clusters A (business) and
C (property) are deep specialist wedges, Cluster B captures the first question every American
abroad asks — "do I even have to file?" — and routes that traffic down into the specialist
clusters. It is the connective tissue of the knowledge graph: nearly every A and C article can
link up to a Cluster B fundamentals page.

Why it's the right next cluster: highest search volume in the niche; lowest topical
difficulty to rank (broad informational intent); maximum internal-linking value (everything
links to it); strong AI-citation potential (these are exactly the questions AI engines answer
most often for expats).

---

## Verified technical foundation (stable as at 2026, sourced from IRS/HMRC)

These are the load-bearing facts every Cluster B article must reflect. All are mechanism
statements or stable thresholds — avoid quoting figures that move annually beyond these.

- Worldwide taxation: US citizens and green card holders file US tax on worldwide income
  regardless of where they live.
- FBAR (FinCEN 114): required when aggregate foreign accounts exceed $10,000 at any
  point in the year. Single fixed threshold — no variation by filing status or residence. Filed
  with FinCEN via BSA E-Filing, separately from the tax return. Due 15 April, automatic
  extension to 15 October (no request needed).
- Form 8938 (FATCA): higher, residency/status-based thresholds — for those living abroad,
  broadly $200,000 (single, year-end) / $300,000 (single, any time) and $400,000 /
  $600,000 (married filing jointly). Filed with the tax return. Independent of FBAR —
  meeting one doesn't satisfy the other.
- Deadlines: expats get an automatic extension to 15 June; Form 4868 extends to 15
  October. (FBAR runs 15 April to 15 October automatically.)
- OBBBA (signed 4 July 2025): despite speculation, it did NOT eliminate or merge FBAR
  and Form 8938 reporting. Both remain mandatory, same thresholds. (This is a GEO edge — many
  sources and users wrongly assume it changed reporting.)
- Catch-up: Streamlined Filing Compliance Procedures for non-willful failures; reasonable
  cause relief for information-return penalties.
- Double-tax relief: FEIE (Form 2555) and Foreign Tax Credit (Form 1116) usually reduce or
  eliminate US tax even when filing is required.

RESEARCH REFRESH RULE: re-verify thresholds and deadlines against irs.gov at drafting time.
Thresholds have been stable since 2011 but always confirm for the active tax year.

---

## The 8 articles — topic map, intent, and anti-cannibalisation

Each owns a distinct question. No two compete.

1. PILLAR — "Do I Have to File US Taxes If I Live in the UK?" — slug: do-i-have-to-file-us-taxes-living-in-uk — owns the umbrella "do I file at all" question — Reviewer: Katie M.
2. "FBAR vs FATCA: What's the Difference?" — slug: fbar-vs-fatca-difference — owns the two-reporting-regimes comparison — Reviewer: Briana
3. "US Tax Deadlines for Americans Abroad" — slug: us-tax-deadlines-americans-abroad — owns dates, extensions, the June 15 rule — Reviewer: Katie M.
4. "Do I Owe US Tax If I Already Pay UK Tax?" — slug: do-i-owe-us-tax-if-i-pay-uk-tax — owns tax owed vs tax filed (FEIE/FTC) — Reviewer: Briana
5. "What Counts Toward the FBAR $10,000 Threshold?" — slug: what-counts-fbar-threshold — owns the aggregate-account mechanics — Reviewer: Katie M.
6. "Form 8938 Thresholds for Americans in the UK" — slug: form-8938-thresholds-uk — owns the FATCA threshold detail — Reviewer: Briana
7. "Your First US Tax Return as an American in the UK" — slug: first-us-tax-return-american-uk — owns the first-year/just-moved checklist — Reviewer: Katie M.
8. "Did OBBBA Change US Expat Filing?" — slug: did-obbba-change-expat-filing — owns the 2025-law myth-buster (GEO edge) — Reviewer: Briana

Cannibalisation guard: pillar (1) owns whether you file; #4 owns whether you owe
(distinct — filing is not owing); #2/#5/#6 split the reporting layer three ways (comparison /
FBAR-mechanics / FATCA-mechanics); #3 owns when; #7 owns first-timer journey; #8 owns the
legislative-change query. Each maps to a different real search.

---

## Internal-linking map

Pillar (1) is the hub — links down to all 7 spokes, and is the primary "link up" target for
Clusters A and C (every "do I have to file?" mention across the site points here).

Cross-cluster links (Cluster B to existing content):
- #4 (owe vs file) to existing feie-or-foreign-tax-credit-uk article + FEIE/FTC services.
- #2/#5 (FBAR) to existing do-i-need-to-file-an-fbar + fbar-filing service.
- #6 (FATCA) to fatca-compliance service.
- #7 (first return) to us-tax-returns service + Cluster A/C as "next steps."
- Pillar to streamlined-filing service (for those who discover they're behind) + existing
  havent-filed-us-taxes-living-in-uk article.

Backlinks INTO Cluster B (add at publish time):
- Every Cluster A and C article's "do I have to file?" mention to pillar.
- us-tax-returns service to pillar + deadlines.
- fbar-filing service to FBAR vs FATCA + what-counts articles.

This makes the pillar one of the most-linked pages on the site — correct, since it's the
top-of-funnel hub.

---

## Service mapping (commercial intent)

- Pillar to US Tax Returns
- FBAR vs FATCA to FBAR Filing
- Deadlines to US Tax Returns
- Owe vs file to Foreign Tax Credit / FEIE
- FBAR $10k to FBAR Filing
- Form 8938 thresholds to FATCA Compliance
- First return to US Tax Returns
- OBBBA myth to US Tax Returns

---

## Reviewer allocation

US-focused cluster to US reviewers throughout. Katie M. x4, Briana x4 (balanced). No UK reviewer
needed since this is US-filing fundamentals, though #4 (owe vs file) touches UK tax and could
take a UK second-check if desired.

---

## Publishing sequence (when greenlit)

Publish in 2 sub-batches of 4, validated and deployed like Clusters A and C:

- Sub-batch B1 (highest volume): Pillar, FBAR vs FATCA, Deadlines, Owe vs File.
- Sub-batch B2 (depth + edge): FBAR $10k, Form 8938 thresholds, First return, OBBBA myth.

Each article: answer-first block, key takeaways, executive summary, FAQs (frontmatter to
FAQPage), related reading, at least 1 service link, at least 1 calculator link
(deadlines to us-expat-deadlines; FBAR to fbar-checker; owe-vs-file to double-tax-estimator),
author + reviewer, full schema stack.

---

## Why NOT to draft now

Drafting before indexing data arrives means guessing at priority order. Two weeks of GSC data
will reveal which fundamentals queries actually surface impressions, letting us (a) confirm or
re-rank the 8, and (b) tune titles to real query language. The architecture above is stable and
ready; only the final title/priority tuning waits on data. This is deliberate, not delay.
