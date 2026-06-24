# US·UK Accountants — Logo Asset Guide

Concept A, "The Transatlantic Arc." A gold arc bridging two terminal nodes (US & UK) with a champagne keystone at the apex — bridge, connection, two jurisdictions under one firm. Navy/gold private-bank identity. No flags, no patriotic colour.

## Files

| File | Use |
|---|---|
| `logo-horizontal-dark.svg` | Primary lockup on navy/dark backgrounds (site header) |
| `logo-horizontal-light.svg` | Primary lockup on white/light backgrounds |
| `logo-stacked-dark.svg` | Square/footer/mobile spaces |
| `logo-mark.svg` | Icon-only (arc) — avatars, client portal, watermark |
| `logo-horizontal-mono-navy.svg` | Single-colour (documents, stamps, fax, embossing) |
| `favicon.svg` | Browser tab / PWA (navy rounded square + gold arc) |
| `icon-maskable.svg` | Android/PWA maskable (extra navy safe-zone) |

The live site renders the logo via the React `Logo` component (`src/components/ui/Logo.tsx`) for crispness and theming; these SVGs are for everything off-site (email signatures, documents, social avatars, letterhead, decks).

## Colours
- Arc & nodes: Heritage Gold `#C9A84C`
- Keystone: Champagne `#E2CE92` (on dark) / Antique Gold `#A8893A` (on light)
- Wordmark: White `#FFFFFF` (dark) / Ink Navy `#0A1330` (light)
- Mid-dot (US·UK): always gold `#C9A84C` — the brand signature
- Subline: gold, uppercase, 0.22em tracking

## Rules
- **Clear space:** keep clear space equal to the height of the arc on all sides.
- **Minimum size:** 120px wide (horizontal lockup); 24px (icon/favicon).
- **Never:** recolour outside the palette, add flags/effects/shadows, stretch, place gold-on-mid-tone, or rebuild the dot as a hyphen. The mid-dot is fixed.
- **Backgrounds:** gold mark only on navy or white — never on photography or mid-tones.

## Typography
Wordmark: Fraunces (display serif), weight 500. Subline: Manrope, uppercase.

## Brand-name consistency (important for SEO/GEO entity)
The wordmark renders **US·UK Accountants**. For machine-readable contexts — schema `name`, Google Business Profile, directories, `<title>` — use the plain form **US UK Accountants** consistently (the dot is a visual flourish, not part of the legal/searchable name). Pick one and never vary it; entity consistency directly affects the AI-search recommendation goal.

## Production note
These are clean, production-grade SVGs. For print/embroidery you may also want outlined-text versions (so Fraunces isn't required on the target system) and PNG exports at 1×/2×/3× — generate from these masters when needed.
