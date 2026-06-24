# Authority & EEAT Assets

The trust layer for YMYL (Your Money or Your Life) financial content. Built before further page development so every future page can plug into named authors, verified reviews, and a documented trust system.

## What was built

### Pages (`src/app/`)
| Route | Purpose |
|---|---|
| `/trust-center` | Hub linking every trust asset |
| `/security` | Data protection + scam-awareness |
| `/credentials` | ACCA, AICPA, IRS EA, ATT, CIOT explained |
| `/compliance` | Registration, AML, engagement terms, indemnity, complaints |
| `/editorial-policy` | How content is researched, written, reviewed, updated |
| `/review-policy` | How reviews are collected & verified (FTC/CMA-aligned) |
| `/privacy` | UK GDPR data handling for sensitive tax data |
| `/reviews` | Aggregate summary + verified review grid |
| `/about/team` | Team hub |
| `/about/team/[slug]` | Author/expert profile (SSG, Person schema) |
| `/about/case-studies` | Case study hub |
| `/about/case-studies/[slug]` | Full case study (SSG) |

### Reusable components (`src/components/library/`)
- `PolicyPage` — shared layout for any legal/policy page (navy header, last-reviewed date, prose sections)
- `Press` — `PressStrip` (logo row) + `PressQuotes` (featured quote cards)
- `Reviews` — `ReviewSummary` (rating breakdown), `ReviewCard`, `ReviewGrid` (+ Review schema)
- `CaseStudies` — `CaseStudyCard`, `CaseStudyGrid`, `CaseStudyDetail`
- `Authors` — `AuthorByline` (for articles) + `AuthorProfile` (full page, + Person/sameAs schema)

All are server components, so their JSON-LD renders server-side for crawlers and AI engines.

### Data (`src/lib/authority-data.ts`)
Single source of truth for press, reviews, case studies, authors, and all policy copy. Types live in `src/lib/types.ts`.

## How this makes the site EEAT-ready

- **Experience** — quantified case studies (penalties avoided, deadlines met), anonymised with a results-not-guaranteed disclaimer.
- **Expertise** — every author is named with credentials, expertise areas, years of experience, and a "reviewed by" a second professional.
- **Authoritativeness** — credentials page tied to real bodies, press section, Person schema with `sameAs` verification links, Organization linkage.
- **Trustworthiness** — Trust Center, documented editorial/review/privacy/security/compliance policies, verified-only reviews, transparent data handling.

## Schema emitted
- `Person` (+ `sameAs`) on author profiles
- `Review` / rating on the review grid
- `FAQPage` (from the existing FAQ accordion)
- `AccountingService` + `WebSite` (from root layout)

If two components on one page could emit overlapping schema, pass `emitSchema={false}` to the secondary one.

## Before launch — replace placeholders
Everything in `authority-data.ts` is a clearly-marked placeholder. **Do not publish as-is.** Replace with:
- Real team names, photos, and verifiable credential/registration numbers
- Genuine reviews (or embed live Google/Trustpilot widgets) — never fabricate
- Real case studies, anonymised with client permission
- Actual press features (remove the section until you have them)
- Legal review of the privacy, compliance, and editorial policies for your jurisdictions

Fabricated credentials or reviews don't just fail EEAT — for reviews they can breach FTC (US) and CMA (UK) rules.

## Wiring
The footer now links to the new trust pages. Drop `<AuthorByline>` on articles and service pages, and `<PressStrip>` / `<CaseStudyGrid>` / `<ReviewGrid>` onto the homepage and landing pages as you build them.
