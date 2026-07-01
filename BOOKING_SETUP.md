# Booking & Payment Setup — USUKAccountants.com

This is the operational runbook for the £100 paid consultation system. Everything
in the codebase is ready; the steps below connect the three external accounts.
**Estimated time once you have the accounts: ~30–45 minutes.**

---

## The model (already built into the site)

- **Free route:** general questions answered by email (hello@usukaccountants.com).
- **Paid route:** a private **30-minute** consultation for **£100**, self-booked into
  an available slot, **paid at booking**.
- Single source of truth for all consultation copy/price: `src/lib/site-data.ts` ->
  `export const CONSULTATION`. Change the price or duration there and it updates
  everywhere (Hero, CTAs, booking page, scheduler summary bar).

---

## What the site does RIGHT NOW (before you connect anything)

`src/components/library/BookingEmbed.tsx` chooses one of three states:

1. `NEXT_PUBLIC_CALCOM_LINK` set -> renders the **Cal.com** paid scheduler.
2. `NEXT_PUBLIC_CALENDLY_URL` set -> renders the **Calendly** paid scheduler.
3. Neither set -> **fallback enquiry form** (collects details, emails you, tells the
   visitor a payment link will follow). No payment is taken in this state.

Until the steps below are done, the site is in **state 3**. Copy has been written
so state 3 is honest (it never claims a booking is confirmed or paid).

---

## STEP 1 — Cal.com (scheduling + payment) — RECOMMENDED

1. Create an account at https://cal.com
2. Create an **Event Type**:
   - Title: US–UK Tax Consultation
   - Duration: **30 min**
   - Location: your video tool (Cal Video / Google Meet / Zoom)
   - Slug: consultation  (gives you yourname/consultation)
3. Set your **Availability** (real hours; Cal.com handles client timezones automatically).
4. Turn on **reminders** (Workflows -> email 24h before + 1h before).
5. Add buffers (e.g. 10 min after) and a minimum notice (e.g. 12 hours).

## STEP 2 — Stripe (payment) inside Cal.com

1. Create a **Stripe** account at https://stripe.com (business details + bank account).
2. In Cal.com: **Apps -> Stripe -> Install/Connect** -> authorise your Stripe account.
3. On the consultation Event Type -> **Payments** -> require payment -> **£100 GBP**.
   Now the slot cannot be booked without paying £100. Payment is captured at booking.
4. Test in Stripe **test mode** first (card 4242 4242 4242 4242), then go live.

## STEP 3 — Activate the scheduler on the website

Add ONE env var in **Vercel -> Project -> Settings -> Environment Variables**
(Production + Preview), then redeploy:

    NEXT_PUBLIC_CALCOM_LINK = yourname/consultation

(Or for Calendly: NEXT_PUBLIC_CALENDLY_URL = https://calendly.com/yourname/consultation)

Redeploy. The booking page now shows the paid calendar with the £100 summary bar.
**Done — payment is live.**

## STEP 4 — Resend (lead-notification emails)

The enquiry and contact forms email you via Resend. Not required for paid bookings
(Cal.com emails those), but recommended so free email enquiries reach you.

1. Create an account at https://resend.com
2. **Verify the domain** usukaccountants.com (add the DNS records Resend gives you).
3. Add these env vars in Vercel:

    RESEND_API_KEY   = re_xxxxxxxx
    LEAD_NOTIFY_TO   = hello@usukaccountants.com
    LEAD_NOTIFY_FROM = US UK Accountants <hello@usukaccountants.com>

Redeploy. (Without these, the API still returns success and logs the lead — it
never breaks the funnel.)

---

## Environment variables — full reference

| Variable | Required for | Notes |
|---|---|---|
| NEXT_PUBLIC_CALCOM_LINK | Paid scheduler (Cal.com) | e.g. usukaccountants/consultation |
| NEXT_PUBLIC_CALENDLY_URL | Paid scheduler (Calendly) | Use instead of Cal.com, not both |
| RESEND_API_KEY | Lead emails | From resend.com |
| LEAD_NOTIFY_TO | Lead emails | Inbox that receives leads |
| LEAD_NOTIFY_FROM | Lead emails | Verified sender |
| NEXT_PUBLIC_GA_ID | Analytics | Already set (G-SPFXN0D975) |

---

## Go-live checklist

- [ ] Cal.com event type created (30 min, consultation slug)
- [ ] Availability + timezone + reminders configured
- [ ] Stripe connected in Cal.com, £100 GBP required on the event
- [ ] Test booking completed in Stripe test mode (card 4242...)
- [ ] Switched Stripe to live mode
- [ ] NEXT_PUBLIC_CALCOM_LINK set in Vercel (Production)
- [ ] Redeployed; /book shows the paid calendar with £100 summary bar
- [ ] Resend domain verified; RESEND_* vars set
- [ ] Placed one real £100 test booking end-to-end (calendar invite + Stripe receipt)
- [ ] Confirmed reminder emails fire (24h / 1h)
- [ ] Confirmed reschedule + cancel flows work and refund behaves per policy

---

## Conversion tracking (already wired)

- analytics.bookingStarted fires when the booking page loads.
- analytics.bookingStep fires as the fallback form advances.
- analytics.bookingCompleted fires on submit (value: 100, currency: GBP).
- For Cal.com completions, add a GA4 event via Cal.com Workflows if you want the
  paid booking itself counted.

---

## Cancellation & refund policy (as published on /book)

- Reschedule/cancel **free up to 24 hours** before -> full refund.
- Within 24 hours -> fee covers reserved specialist time, non-refundable; we try to
  move you where possible.
- Configure this same rule in Cal.com (Event Type -> cancellation/reschedule limits)
  so the platform enforces it automatically.

---

## Future enhancements (ranked by ROI)

1. Consultation-credited-to-engagement automation (already promised in copy).
2. Cal.com -> GA4 completed-booking conversion event.
3. Business £250 strategy-session tier (individuals vs businesses).
4. Durable rate-limit store (Upstash / Vercel KV) if abuse appears.
5. CRM sync (Cal.com webhook -> your CRM) for lead tracking + follow-up sequences.
6. Secure document upload / client portal (post-consultation).
