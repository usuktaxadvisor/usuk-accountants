# Conversion Path — Status & Wiring

The full lead funnel is built and internally tested. Below is what exists, how it's wired, and what to configure before launch.

## Task scorecard (all 10)

| # | Task | Status |
|---|------|--------|
| 1 | `/book` page | ✅ Built with scheduler + reassurance rail + trust signals |
| 2 | Real booking system | ✅ `BookingEmbed` — Cal.com **or** Calendly via env, in-house multi-step form fallback |
| 3 | All "Book" buttons point correctly | ✅ Homepage CTAs rewired `#book`→`/book`, `#contact`→`/contact`; header/footer swapped to library versions |
| 4 | `/contact` page | ✅ Built with form, dual-office NAP, LocalBusiness schema |
| 5 | Forms → real endpoint | ✅ Contact, Booking, Lead-capture, Footer newsletter all POST `/api/lead` |
| 6 | Email notifications | ✅ Resend integration in `/api/lead` (logs in dev if unconfigured) |
| 7 | Success + thank-you pages | ✅ `/thank-you/booking`, `/thank-you/contact` (noindex), inline success fallbacks |
| 8 | Event tracking | ✅ `lib/analytics.ts` — booking_started, booking_step, cta_click, calculator_used, phone_click |
| 9 | GA4 conversion events | ✅ `generate_lead` fired on every submission; GA4 loaded via `next/script` (afterInteractive) |
| 10 | Eliminate dead links / 404s | ✅ Full audit; conversion links all resolve; `[...slug]` coming-soon catch-all keeps unbuilt nav links in-funnel |

## How the funnel flows

1. Any **Book** CTA → `/book` → `BookingEmbed`
   - If `NEXT_PUBLIC_CALCOM_LINK` or `NEXT_PUBLIC_CALENDLY_URL` set → real scheduler
   - Otherwise → in-house 3-step `BookingForm`
2. Form submit → `submitLead()` (`lib/analytics.ts`) → `POST /api/lead`
   - Server validates, emails via Resend, returns `{ ok }`
   - Client fires `generate_lead` GA4 event, redirects to the matching `/thank-you/*`
3. Newsletter / lead-magnet captures → same endpoint, `newsletter` / `lead` type.

## Configure before launch (`.env.local` — see `.env.example`)

- **Email:** `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`
- **Booking:** one of `NEXT_PUBLIC_CALCOM_LINK` / `NEXT_PUBLIC_CALENDLY_URL`
- **Analytics:** `NEXT_PUBLIC_GA_ID`
- In GA4, mark `generate_lead` as a **Key event (conversion)**.

Everything degrades gracefully: with nothing configured, forms still validate, submit, log server-side, and show success — so the funnel is testable end-to-end in dev.

## Tested
- API validation: 8/8 cases pass (valid contact/booking/newsletter/lead; rejects bad email, missing name, bad type, empty email).
- Full-site link audit: all conversion-critical routes resolve; only intentionally-unbuilt content routes fall through to the coming-soon catch-all.

## Known follow-ups (deferred, not conversion-blocking)
- The catch-all is a temporary bridge; real `/services/*`, `/who-we-help/*`, etc. replace it as they're built (Next prefers the specific route automatically).
- Client portal `/login` currently points to `/contact` until a portal exists.
- Old `components/sections/` Header & Footer are now orphaned (homepage uses library versions); safe to delete during the full consolidation.
