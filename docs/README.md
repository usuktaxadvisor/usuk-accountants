# Operational Notes

## Two rules that matter most

1. Never publish a tax figure without verifying against IRS.gov or GOV.UK.
   A competitor site is never a source. Contested positions need documented
   CPA/CTA sign-off BEFORE publishing.

2. Website and Cal.com must agree on price and duration. Change one, change
   both, same day. Also update GA4 values in src/lib/analytics.ts.

## Outstanding (not engineering)

- CPA sign-off: pension article PCLS position, Streamlined figures, Form 8833
  and treaty thresholds
- Client reviews: zero currently, biggest conversion constraint
- Seven team LinkedIn URLs (personProfiles arrays empty)
- Google Business Profile, Pinterest verify, Bing, Apple

## Recurring

- UK figures each Budget (Mar/Apr) - CTA
- US figures each IRS adjustment (Q4) - CPA
- Calculator and deadline review (Jan) - both

## Deploy

npm run build (expect clean page count) then git push. Vercel auto-deploys.
Fire IndexNow after. Rollback: Vercel dashboard, promote last good build.

## Gotchas

- Articles live in content/blog/ not src/content/blog/
- Internal links must use <Link> not <a> (ESLint enforces)
- ComparisonTable: no leading empty string in columns array
- mailto links need the address visible as text alongside
