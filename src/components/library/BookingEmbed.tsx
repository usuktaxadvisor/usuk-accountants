'use client';

import { useEffect, useState } from 'react';
import { BookingForm } from '@/components/library/Forms';
import { analytics } from '@/lib/analytics';
import { CONSULTATION, SITE } from '@/lib/site-data';

/**
 * Booking scheduler embed.
 *
 * Configure ONE of these public env vars to activate a real paid scheduler:
 *   NEXT_PUBLIC_CALCOM_LINK    e.g. "usukaccountants/consultation"
 *   NEXT_PUBLIC_CALENDLY_URL   e.g. "https://calendly.com/usukaccountants/consultation"
 *
 * The scheduler itself (Cal.com / Calendly) is where the £100 payment is
 * collected via Stripe — see BOOKING_SETUP.md. If neither var is set, this
 * falls back to the in-house enquiry form, so the funnel always works.
 */

function ConsultationSummary() {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-mist bg-porcelain px-5 py-4">
      <div>
        <p className="font-display text-lg font-semibold text-ink">Private consultation</p>
        <p className="text-sm text-muted">{CONSULTATION.durationLabel} · specialist-led · secure payment</p>
      </div>
      <div className="text-right">
        <p className="font-display text-2xl font-semibold text-navy">{CONSULTATION.price}</p>
        <p className="text-xs text-muted">paid at booking</p>
      </div>
    </div>
  );
}

function SchedulerSkeleton() {
  return (
    <div
      className="flex min-h-[560px] items-center justify-center rounded-2xl border border-mist bg-white"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-mist border-t-navy" aria-hidden />
        <p className="mt-3 text-sm text-muted">Loading available times…</p>
      </div>
    </div>
  );
}

export default function BookingEmbed({ source = 'book_page' }: { source?: string }) {
  const calcom = process.env.NEXT_PUBLIC_CALCOM_LINK;
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    analytics.bookingStarted(source);
  }, [source]);

  useEffect(() => {
    if (!calcom) return;
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, [calcom]);

  useEffect(() => {
    if (!calendly) return;
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, [calendly]);

  if (calcom) {
    return (
      <div>
        <ConsultationSummary />
        <div className="relative">
          {!loaded && <SchedulerSkeleton />}
          <iframe
            title={`Book a ${CONSULTATION.durationLabel} consultation`}
            src={`https://cal.com/${calcom}?embed=true&layout=month_view`}
            className={`h-[640px] w-full overflow-hidden rounded-2xl border border-mist bg-white ${loaded ? 'block' : 'hidden'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          Payment is taken securely at booking. Just a quick question?{' '}
          <a href={`mailto:${SITE.email}`} className="font-medium text-navy hover:text-gold">Email us free</a>.
        </p>
      </div>
    );
  }

  if (calendly) {
    return (
      <div>
        <ConsultationSummary />
        <div className="relative">
          {!loaded && <SchedulerSkeleton />}
          <iframe
            title={`Book a ${CONSULTATION.durationLabel} consultation`}
            src={calendly}
            className={`h-[640px] w-full overflow-hidden rounded-2xl border border-mist bg-white ${loaded ? 'block' : 'hidden'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          Payment is taken securely at booking. Just a quick question?{' '}
          <a href={`mailto:${SITE.email}`} className="font-medium text-navy hover:text-gold">Email us free</a>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ConsultationSummary />
      <BookingForm />
      <p className="mt-3 text-center text-xs text-muted">
        {CONSULTATION.freeEmailLine}
      </p>
    </div>
  );
}
