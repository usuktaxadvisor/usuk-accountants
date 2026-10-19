# Premium visual design round, 19 October 2026

Branch `feat/premium-design-2026-10`, based on `f20beef` (main after PR #52). Backup tag `backup/pre-premium-design` created in the working clone before any edit. Pull request #53.

## Brief

Owner authorised a full visual round on 19 October 2026: refine typography, spacing, hierarchy, navigation, imagery, the homepage hero, service pages and enquiry journeys; add tasteful slow motion (drifting image strips, restrained parallax, subtle reveals); keep tax content, case studies, pricing policy, URLs, redirects, SEO work, analytics and forms as they are; respect reduced motion; keep performance.

## Design decisions

- Palette unchanged (navy #0A1330 / #0D1B3E, gold #C9A84C, champagne #E2CE92, porcelain). Typefaces unchanged (Condor headings via Adobe Fonts, Montserrat body).
- One fluid display scale, `text-display-xl/lg/md/sm` (clamp values in `tailwind.config.ts`), replaces the mixed `text-3xl/4xl/5xl` utilities on every page title and section heading. Headings stay at one weight.
- The uppercase tracked eyebrow is replaced by a sentence-case gold "kicker" with a 28 px rule (`.kicker`, `.kicker-light`, `.kicker-center` in `globals.css`; `<Eyebrow>` renders it). Page-level eyebrows across `src/app` were converted; calculator form labels and the consultation "most popular" badge were left as they were.
- Buttons: solid gold with navy text (`.btn-gold`), no gradient or shimmer; secondary buttons are hairline outlines. Card radius 14 px (`rounded-card`). Hover no longer flips cards to navy on the homepage, service grids, team or case studies.
- The single bold element is the Atlantic strip (`AtlanticStrip.tsx`): seven frames from the firm's own Atlantic Collection (Westminster, Brooklyn Bridge, Manchester canal, Tower Bridge, SoHo, the City, the ocean) in one continuous row that drifts left at roughly 25 px per second and loops without a seam (two identical tracks, translate by half the width). It pauses on hover, on keyboard focus within, and from a Pause/Play control (`StripControls.tsx`). Under `prefers-reduced-motion` the animation is removed, the duplicate track is hidden, the control is hidden and the row becomes a static horizontal scroller. Without JavaScript it renders as a static row. Captions name the place only; nothing implies an office.
- Parallax (`ParallaxObserver.tsx`): decorative layers marked `data-parallax` get a `--py` offset of at most 28 px from a scroll-driven, rAF-throttled calculation. Applied to the hero skyline, every page-header photograph and the closing CTA photograph. Off on viewports under 768 px, under reduced motion, and when IntersectionObserver is missing. Content never moves.
- Reveals: the existing `Reveal` system kept but slowed (0.9 s, 10 px rise) and reduced to one reveal per section on the homepage instead of staggered grids.
- Page headers: `PageShell` and the hand-built headers on services, who-we-help, resources, case studies, contact, credentials, reviews, compliance, security and team now carry one section photograph (`.page-header-art` with `.art-*` classes) behind a navy wash at 42% opacity, masked toward the copy column. Locations keep their existing city backdrops. The author byline was restyled for the dark ground.
- Enquiry journey: `KeyFacts` (the "at a glance" sidebar on every service page) ends with "Not sure how this applies to you? Email us a few lines about your situation" linking to `/contact`; the contact form card explains what to send and the reply time; inputs gained a gold focus ring.
- Homepage composition: hero (larger headline, quieter filings panel as a hairline list), trust bar, filings list as hairline columns, three practice areas as editorial columns divided by hairlines, calculator, image-led service cards, Atlantic strip, photographic who-we-help tiles, consultation tiers, process as an ordered list with stats as a definition list, FAQ, closing CTA. The old two-figure London / New York band was removed because the strip replaces it.

## Imagery and licensing

All photographs are from the Atlantic Collection: original artwork generated for US UK Accountants through the firm's own Higgsfield account in August 2026 (see `/areas/usukaccountants-website` notes and PR #24). They are owned by the firm and used under that account's licence; no stock library or third-party photograph was added in this round. Six header backdrops were derived from existing collection files and saved as WebP at 1200 px wide (22 to 45 KB each): `bd-us-expat`, `bd-uk-accounting`, `bd-advisory`, `bd-resources`, `bd-about`, `bd-who`. Grid and strip images go through `next/image` (responsive sizes, lazy below the fold, WebP/AVIF by Vercel). The hero skyline remains the original SVG artwork with its three preloads.

## Checks before opening the PR

- `npx tsc --noEmit` clean; `npm run lint` clean; `npm test` 67 passed (34 skipped, as before); `npm run build` 231 static pages.
- Playwright (Chromium) on 11 representative pages at 390 px and 1440 px: no horizontal overflow, one H1 per page, no broken images, no page errors (the only console messages are blocked external font requests in the sandbox).
- `prefers-reduced-motion: reduce`: strip `animation-name: none`, duplicate frames `display: none`, pause control not rendered, hero art `transform: none`, every reveal at opacity 1.
- JavaScript disabled: all reveal sections visible, strip rendered as a static row of 14 frames.
- Pause control: sets `data-paused="true"` and the track's `animation-play-state` reads `paused`.

## Stripe key (carried over from the previous scope)

Re-read in the Stripe dashboard on 19 October 2026 (Developers, API keys): no restricted keys; one publishable key (public by design, last used 15 October); one secret key created 23 August with last used "–" (never). No Stripe variable exists in the Vercel project, `.env.example` or the repository history, and the site makes no Stripe call (payments run inside Cal.com's Stripe app). There is no evidence a secret was exposed or used, so no rotation was performed; rolling the secret key remains available at the owner's discretion and would break nothing. No key value is recorded here.

## Deployment and verification record

- Preview: Vercel preview for PR #53 reviewed in Chrome with the real Condor and Montserrat fonts loaded (homepage hero, services hub, a service page, contact, team). Hero, kicker, button and strip rendered as designed; no layout faults found.
- Merge: PR #53 squash-merged by the owner on 19 October 2026 into `main` at `a77fc88`. Vercel production build "Ready".
- Production: `https://www.usukaccountants.com` served `a77fc88`; homepage, services, US expat tax, UK accounting, contact and team pages checked in Chrome at desktop width. Cookie banner, header, mobile bar, forms and Cal.com links unchanged in behaviour. The strip pause control works on the live site.
- PageSpeed Insights, mobile, homepage, 19 October 2026 09:33 (UTC+5): Performance 94, Accessibility 97, Best Practices 100, SEO 100. FCP 2.4 s, LCP 2.4 s, TBT 10 ms, CLS 0, Speed Index 3.0 s.
- Baseline measured the same day before the round (00:43 to 00:45): Performance 94, Accessibility 95, Best Practices 94, SEO 100; FCP 2.4 s, LCP 2.4 to 2.6 s, Speed Index 2.4 to 2.9 s, TBT 0 to 10 ms, CLS 0. Net: Performance held, Accessibility and Best Practices up, Speed Index within run-to-run noise.

## Left as it was (explicitly)

- Resource index cards still use the older navy hover treatment.
- Calculator form labels keep their uppercase style.
- Team photographs are still initials, not portraits.
- LinkedIn work deferred; business address unchanged; no Stripe key rotation.
