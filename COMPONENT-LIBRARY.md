# Component Library

Reusable, props-driven components for every page of USUKAccountants.com. Import everything from one place:

```tsx
import {
  Header, Footer, Section, Container, SectionHeading, Button,
  ServiceGrid, CalculatorCard, CalculatorGrid, TrustBar,
  CTASection, FAQAccordion, TestimonialGrid, TeamGrid,
  PricingCards, ComparisonTable,
  ContactForm, LeadCaptureForm, BookingForm,
} from '@/components/library';
```

Data and types live in `src/lib/site-data.ts` and `src/lib/types.ts`. Components never hardcode content — pass it in, or import the ready-made arrays from `site-data`.

## Layout primitives

| Component | Purpose | Key props |
|---|---|---|
| `Section` | Full-width band with vertical rhythm | `tone: 'white' \| 'porcelain' \| 'navy'`, `id` |
| `Container` | Max-width 1280px wrapper | `className` |
| `SectionHeading` | Eyebrow + H2 + intro | `eyebrow`, `title`, `intro`, `align`, `tone` |
| `Eyebrow` | Gold uppercase label | `tone: 'gold' \| 'gold-light'` |
| `Button` | All button variants | `variant`, `size`, `withArrow`, `shimmer`, `href`/`onClick` |

`Button` variants: `primary` (gold gradient), `secondary`, `secondary-light` (on navy), `urgency` (red), `ghost`.

## Navigation

- **`Header`** — sticky, shrink-on-scroll, mega-menu, mobile drawer. Driven by `primaryNav`, `megaMenuPanels`, `megaMenuFeature` in `site-data`. Drop on every page; no props.
- **`Footer`** — 6-column mega-footer, dual NAP, newsletter. Driven by `footerColumns`, `legalLinks`. No props.
- **`MegaMenu`** — used internally by `Header`; reusable if you build alternate nav.

## Cards

```tsx
<ServiceGrid services={services} columns={3} />
<CalculatorGrid>
  <CalculatorCard title="…" description="…" href="…" sampleValue="£4,820" tone="dark" />
</CalculatorGrid>
<TeamGrid members={team} />
<TestimonialGrid testimonials={testimonials} />
<PricingCards tiers={pricingTiers} />   {/* currency toggle built in */}
```

Each card type also exports a single-item version (`ServiceCard`, `TeamCard`, `TestimonialCard`) for custom layouts.

## Sections

```tsx
<TrustBar />                                   {/* credentials + rating */}
<FAQAccordion items={faqs} />                  {/* emits FAQPage JSON-LD by default */}
<ComparisonTable data={dueDiligenceComparison} />  {/* us vs competitors */}
<CTASection
  title="Ready to simplify your US–UK taxes?"
  intro="Free 15-minute consultation. No obligation."
  tone="navy"                                  {/* navy | gold | porcelain */}
  secondary={{ label: 'Call us', href: 'tel:…' }}
  showPhone
/>
```

`FAQAccordion` emits its own schema — pass `emitSchema={false}` if the page `<head>` already includes FAQ schema, to avoid duplicates.

`ComparisonTable` renders a real table on desktop and stacks per-option on mobile. Use `highlightColumn` (1-indexed across the option columns) to emphasise the US UK Accountants column.

## Forms

Three ready compositions plus the field primitives they're built from.

```tsx
<ContactForm />                       {/* full enquiry: name, email, situation, message, consent */}
<LeadCaptureForm cta="Get the guide" />   {/* inline email capture for guides/calculators */}
<BookingForm />                       {/* 3-step consultation form with progress bar */}
```

All forms include inline validation, accessible labels/errors, success states, and `tone="dark"` variants for navy backgrounds. Field primitives (`Field`, `TextInput`, `Select`, `Textarea`, `Checkbox`) are exported for building bespoke forms; `JURISDICTION_OPTIONS` provides the standard audience dropdown.

> Forms currently resolve to success states client-side. Wire `onSubmit` / the submit handlers to your CRM, email service, or booking API before launch.

## Conventions

- **Server by default.** Only components needing interactivity (`Header`, `PricingCards`, `FAQAccordion`, `Forms`, `FormFields`) are client components.
- **Tokens, not hex.** Every colour uses the Tailwind brand tokens (`navy`, `gold`, `signal`, …) from `tailwind.config.ts`.
- **One source of truth.** Nav, services, pricing, FAQs, etc. live in `site-data.ts`. Change once, every page updates.
- **Accessibility built in.** Labelled controls, `aria-expanded`, visible focus, AA contrast, `prefers-reduced-motion` respected.
