# US UK Accountants — Homepage

Production-ready homepage for USUKAccountants.com. Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS. Built on the approved navy/gold premium design system.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

Deploy to Vercel: push to a Git repo and import, or run `vercel`. Zero config needed.

## What's included

Single page (`/`) only — no other routes, as scoped. All links are anchor links to on-page sections or placeholders ready to be wired to real routes later.

### Sections (in order)
1. **Header** — sticky, shrink-on-scroll, Services mega-menu, dual-jurisdiction utility bar, mobile drawer
2. **Hero** — animated transatlantic arc motif, audience self-select chips, dual CTA, gold-shimmer primary button
3. **Trust bar** — credentials + 4.9/5 rating
4. **Pillars** — UK Accounting | US Expat Tax split
5. **Calculator** — interactive US–UK double-tax estimator with live results + email capture (the flagship conversion asset)
6. **Services** — 6-card grid
7. **Who We Help** — 6 audience cards
8. **Process + Stats** — 4-step timeline and outcomes band
9. **Testimonials** — 3 client cards
10. **FAQ** — answer-first accordion (GEO-optimised)
11. **Final CTA** — navy band, free-consultation close
12. **Footer** — 6-column mega-footer, dual NAP, newsletter
13. **Mobile bar** — sticky Call · Book

## Design system

- **Colour:** navy (`#0A1330`/`#0D1B3E`) foundation, gold (`#C9A84C`) accents, red (`#B23A48`) signal only. Tokens in `tailwind.config.ts`.
- **Type:** Fraunces (display) · Manrope (UI/body) · Inter (data/numerals), loaded via `next/font` (self-hosted, zero layout shift).
- **Motion:** scroll-reveal via IntersectionObserver, gold shimmer on primary CTA, hover lifts. All gated behind `prefers-reduced-motion`.

## Performance & SEO (built for 95+ Lighthouse)

- `next/font` self-hosting → no render-blocking font requests, no CLS
- Server Components by default; only Header, Calculator, FAQ, Reveal are client components
- No image files — brand visuals are inline SVG (instant, crisp, weightless)
- JSON-LD: `AccountingService`, `WebSite` (+ SearchAction), `FAQPage` in `layout.tsx`
- `sitemap.ts`, `robots.ts`, `manifest.ts`, security headers in `next.config.js`
- Semantic HTML, labelled controls, visible focus states, AA contrast

## Notes

- The calculator is an illustrative directional estimate to drive consultations — not tax advice. Wire the email capture and booking CTAs to your CRM / scheduler before launch.
- Phone numbers, addresses, ratings and stats are placeholders — replace with verified figures (never publish unverified credentials).
