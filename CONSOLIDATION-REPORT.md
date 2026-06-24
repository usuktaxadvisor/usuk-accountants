# Component System Consolidation — Report

The homepage now runs entirely on the reusable `library/` system. The legacy `sections/` directory is deleted. `site-data.ts` is the single source of truth.

## 1. Files removed (13)

Entire `src/components/sections/` directory deleted — all were hardcoded, single-use duplicates of library capability:

| Removed | Replaced by |
|---|---|
| `sections/Header.tsx` | `library/Header.tsx` (data-driven nav) |
| `sections/Footer.tsx` | `library/Footer.tsx` (data-driven, wired newsletter) |
| `sections/Hero.tsx` | `library/Hero.tsx` (props + `heroChips`) |
| `sections/TrustBar.tsx` | `library/TrustBar.tsx` (`credentials` from data) |
| `sections/Pillars.tsx` | `library/HomeSections.tsx → Pillars` (`pillars` data) |
| `sections/Services.tsx` | `library/HomeSections.tsx → ServicesSection` (wraps `ServiceGrid`) |
| `sections/WhoWeHelp.tsx` | `library/HomeSections.tsx → WhoWeHelp` (`audiences` data) |
| `sections/Process.tsx` | `library/HomeSections.tsx → ProcessStats` (`processSteps`+`stats`) |
| `sections/Testimonials.tsx` | `library/HomeSections.tsx → TestimonialsSection` (wraps `TestimonialGrid`) |
| `sections/FAQ.tsx` | `library/HomeSections.tsx → FAQSection` (wraps `FAQAccordion`) |
| `sections/FinalCTA.tsx` | `library/CTASection.tsx` (already existed) |
| `sections/Calculator.tsx` | `library/Calculator.tsx` (migrated + wired to funnel) |
| `sections/MobileBar.tsx` | `library/MobileBar.tsx` (migrated) |

## 2. Files migrated / created (4)

- **`library/Hero.tsx`** — new, props-driven, sources `heroChips`, `RATING`, `REVIEW_COUNT`.
- **`library/HomeSections.tsx`** — new, houses 6 section compositions (Pillars, WhoWeHelp, ProcessStats, ServicesSection, TestimonialsSection, FAQSection), each reusing existing library cards and pulling defaults from `site-data.ts`.
- **`library/Calculator.tsx`** — migrated from sections; now fires `analytics.calculatorUsed` and posts its email capture to `/api/lead` (previously a dead-end success state).
- **`library/MobileBar.tsx`** — migrated; uses real `/book` route.

Data added to the single source of truth: `heroChips`, `pillars` (+ `PillarItem`, `HeroChip` types). The `services`, `audiences`, `processSteps`, `stats`, `testimonials`, `faqs` arrays already existed and are now actually consumed.

## 3. New architecture

```
src/lib/
  site-data.ts      ← SINGLE SOURCE OF TRUTH (nav, footer, pillars, services,
                       audiences, process, stats, testimonials, faqs, chips, phones, rating)
  types.ts          ← all shared interfaces
  analytics.ts      ← funnel events + submitLead()
  authority-data.ts ← EEAT content (press, reviews, cases, authors, policies)

src/components/
  ui/               ← primitives only (Logo, Reveal, icons)
  library/          ← THE component system (26 files)
      primitives    Section, Container, SectionHeading, Eyebrow, Button
      navigation    Header, Footer, MegaMenu, MobileBar
      sections      Hero, HomeSections (Pillars/WhoWeHelp/ProcessStats/
                    ServicesSection/TestimonialsSection/FAQSection), Calculator,
                    CTASection, TrustBar
      cards         ServiceCard, CalculatorCard, TeamCard, Testimonials,
                    PricingCards, CaseStudies
      authority     Press, Reviews, Authors, PolicyPage
      forms         FormFields, Forms, BookingEmbed
      data display  FAQAccordion, ComparisonTable
      index.ts      ← single barrel; every page imports from '@/components/library'

src/app/            ← 18 pages, all composed from library + data
```

**Data flow:** `site-data.ts` → library component (default prop) → page. Every page imports from one barrel; every component is props-driven with data defaults.

## 4. Single-source-of-truth verification (task 5)

- `RATING` is read by `Hero`, `TrustBar`, `CTASection`, `/book` — change once, updates all four.
- `pillars` → `Pillars` section → homepage. `services` → `ServiceGrid` → homepage **and** any future service page. `faqs` → `FAQSection` (home) and reusable on any page via `FAQAccordion`.
- No component hardcodes content that lives in `site-data.ts`. Verified by sweep: every `default*` reference is an import from `site-data`, not an inline copy.

## 5. Scalability for 500+ pages

- New pages compose existing library sections with page-specific data — no new components needed for standard layouts.
- A service page = `Header` + `Hero` (props) + `ServicesSection`/`FAQSection` (page data) + `CTASection` + `Footer`. Zero new code.
- Programmatic pages (location × service) pass generated data objects into the same components.
- One barrel import, one data file, one type file — bulk changes stay tractable at scale.

## 6. Remaining technical debt (honest)

1. **`HomeSections.tsx` bundles 6 sections in one file.** Fine now; if any one grows complex, split into its own file. Low priority.
2. **Hero's right-hand "what we handle" panel is still hardcoded** inside `Hero.tsx` (not data-driven). Acceptable — it's presentational, but could move to `site-data` if it needs to vary per page.
3. **Two FAQ schema sources exist** — the root `layout.tsx` emits site-wide FAQ JSON-LD, and `FAQAccordion` can emit its own. The homepage `FAQSection` defaults `emitSchema={false}` to avoid duplication, but this is a convention to remember, not an enforced guard.
4. **`ui/Reveal` is the only animation primitive**; if pages need richer scroll choreography, it'll need extending.
5. **Placeholder content** (rating, stats, testimonials, credentials) still lives in `site-data.ts`/`authority-data.ts` — must be replaced with verified data before launch. Unchanged by this task.
6. **The `[...slug]` coming-soon catch-all** remains until real service/audience/location pages exist (by design).

None of the above blocks building the next pages.
