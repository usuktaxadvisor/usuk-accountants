# Booking & Payment Setup — USUKAccountants.com

Operational runbook for the paid consultation system. The code is production-ready;
these steps connect your external accounts. **Time once you have accounts: ~45 min.**

---

## The model (built into the site)

- **Free:** general questions answered by email (hello@usukaccountants.com).
- **Individual Consultation:** £100, 30 min, credited to first engagement.
- **Business & Cross-Border Strategy Session:** £300, 60 min, credited.
- **Private Client Advisory:** enquiry-only (routes to contact form, no payment).

Each paid tier routes to its OWN scheduler event via `?tier=individual` / `?tier=business`.

---

## STEP 1 — Cal.com (create TWO events)

Create an account at https://cal.com, then two event types:

**Event A — Individual Consultation:** Title "US-UK Tax Consultation", Duration 30 min,
Slug consultation-30, Location = your video tool.

**Event B — Business & Cross-Border Strategy Session:** Title "Business & Cross-Border
Strategy Session", Duration 60 min, Slug strategy-60, Location = your video tool.

For BOTH: set Availability (Cal.com handles client timezones automatically), turn on
reminders (Workflows -> email 24h + 1h before), add buffers + a minimum notice.

(Private Client Advisory is enquiry-only and needs no event.)

## STEP 2 — Stripe (payment) inside Cal.com

1. Create a Stripe account at https://stripe.com
2. Cal.com -> Apps -> Stripe -> Connect -> authorise.
3. Event A -> Payments -> require payment -> £100 GBP.
4. Event B -> Payments -> require payment -> £300 GBP.
5. Test in Stripe test mode (card 4242 4242 4242 4242), then switch to live.

## STEP 3 — Activate on the website

Add these in Vercel -> Settings -> Environment Variables (Production + Preview), redeploy:

    NEXT_PUBLIC_CALCOM_INDIVIDUAL = yourname/consultation-30
    NEXT_PUBLIC_CALCOM_BUSINESS   = yourname/strategy-60

The /book page routes each tier to its matching event automatically. (Calendly
alternative: NEXT_PUBLIC_CALENDLY_INDIVIDUAL / NEXT_PUBLIC_CALENDLY_BUSINESS. A single
legacy NEXT_PUBLIC_CALCOM_LINK still works as a fallback for both tiers.)

## STEP 4 — Resend (lead-notification emails)

Not required for paid bookings (Cal.com emails those), but recommended so free email
enquiries and fallback submissions reach you.

1. Create an account at https://resend.com
2. Verify the domain usukaccountants.com (add the DNS records Resend gives you).
3. Add in Vercel:

    RESEND_API_KEY   = re_xxxxxxxx
    LEAD_NOTIFY_TO   = hello@usukaccountants.com
    LEAD_NOTIFY_FROM = US UK Accountants <hello@usukaccountants.com>

(Without these, the API still returns success and logs the lead — never breaks the funnel.)

---

## Environment variables — full reference

| Variable | Required for | Notes |
|---|---|---|
| NEXT_PUBLIC_CALCOM_INDIVIDUAL | £100 individual scheduler | e.g. yourname/consultation-30 |
| NEXT_PUBLIC_CALCOM_BUSINESS | £300 business scheduler | e.g. yourname/strategy-60 |
| NEXT_PUBLIC_CALCOM_LINK | Legacy single-event fallback (optional) | used for both tiers if the two above are unset |
| NEXT_PUBLIC_CALENDLY_INDIVIDUAL / _BUSINESS | Calendly alternative (per tier) | full https Calendly URLs |
| RESEND_API_KEY | Lead emails | from resend.com |
| LEAD_NOTIFY_TO | Lead emails | inbox that receives leads |
| LEAD_NOTIFY_FROM | Lead emails | verified sender |
| NEXT_PUBLIC_GA_ID | Analytics | already set (G-SPFXN0D975) |

---

## Go-live checklist

- [ ] Two Cal.com events created (30-min £100, 60-min £300)
- [ ] Stripe connected in Cal.com; £100 on Event A, £300 on Event B
- [ ] Tested both tiers in Stripe test mode (card 4242...)
- [ ] Switched Stripe to live mode
- [ ] NEXT_PUBLIC_CALCOM_INDIVIDUAL + NEXT_PUBLIC_CALCOM_BUSINESS set in Vercel
- [ ] Redeployed; /book?tier=individual and /book?tier=business open the right paid event
- [ ] Resend domain verified; RESEND_* vars set
- [ ] One real end-to-end test booking on EACH tier (calendar invite + Stripe receipt)
- [ ] Confirmed reminder emails fire (24h / 1h)
- [ ] Confirmed reschedule + cancel behave per policy

---

## Analytics (already wired)

- booking_started fires on booking page load (with tier).
- booking_step fires as the fallback form advances.
- generate_lead (bookingCompleted) fires on submit, tier-aware:
  value 100 (individual) or 300 (business), currency GBP, consultation_type set.
- For Cal.com paid completions, optionally add a GA4 event via Cal.com Workflows.

---

## Cancellation & refund policy (published on /book)

- Reschedule/cancel free up to 24h before -> full refund.
- Within 24h -> covers reserved specialist time, non-refundable; we try to move you.
- Set the same rule in each Cal.com event so the platform enforces it.

---

## Future enhancements (ranked)

1. Consultation-credited-to-engagement automation.
2. Cal.com -> GA4 completed-booking conversion event.
3. CRM sync (Cal.com webhook) for lead tracking + follow-up sequences.
4. Durable rate-limit store (Upstash / Vercel KV) if abuse appears.
5. Secure document upload / client portal (post-consultation).
