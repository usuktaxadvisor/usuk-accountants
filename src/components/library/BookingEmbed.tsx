'use client';

import { useEffect, useState } from 'react';
import { BookingForm } from '@/components/library/Forms';
import { analytics } from '@/lib/analytics';
import { CONSULTATION_TIERS, SITE } from '@/lib/site-data';

type TierId = 'individual' | 'business';

function tierFor(id?: TierId) {
  return CONSULTATION_TIERS.find((t) => t.id === id) ?? CONSULTATION_TIERS.find((t) => t.id === 'individual')!;
}

/**
 * Booking scheduler embed — PER-TIER aware.
 *
 * Each paid tier maps to its OWN scheduler event (different duration + price):
 *   NEXT_PUBLIC_CALCOM_INDIVIDUAL   e.g. "usukaccountants/consultation-30"
 *   NEXT_PUBLIC_CALCOM_BUSINESS     e.g. "usukaccountants/strategy-60"
 *   (legacy single link fallback: NEXT_PUBLIC_CALCOM_LINK)
 *   Calendly: NEXT_PUBLIC_CALENDLY_INDIVIDUAL / _BUSINESS (fallback _URL)
 *
 * Payment (£100 / £300) is collected inside the scheduler via Stripe — see
 * BOOKING_SETUP.md. If nothing is configured for a tier, the in-house enquiry
 * form is shown, so the funnel never dead-ends.
 */

function calcomLinkFor(tierId: TierId): string | undefined {
  const individual = process.env.NEXT_PUBLIC_CALCOM_INDIVIDUAL;
  const business = process.env.NEXT_PUBLIC_CALCOM_BUSINESS;
  const legacy = process.env.NEXT_PUBLIC_CALCOM_LINK;
  if (tierId === 'business') return business ?? legacy;
  return individual ?? legacy;
}

function calendlyLinkFor(tierId: TierId): string | undefined {
  const individual = process.env.NEXT_PUBLIC_CALENDLY_INDIVIDUAL;
  const business = process.env.NEXT_PUBLIC_CALENDLY_BUSINESS;
  const legacy = process.env.NEXT_PUBLIC_CALENDLY_URL;
  if (tierId === 'business') return business ?? legacy;
  return individual ?? legacy;
}

function ConsultationSummary({ tierId }: { tierId?: TierId }) {
  const tier = tierFor(tierId);
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-mist bg-porcelain px-5 py-4">
      <div>
        <p className="font-display text-lg font-semibold text-ink">{tier.name}</p>
        <p className="text-sm text-muted">{tier.durationLabel} · specialist-led · secure payment</p>
      </div>
      <div className="text-right">
        <p className="font-display text-2xl font-semibold text-navy">{tier.price}</p>
        <p className="text-xs text-muted">{tier.credited ? 'credited to first engagement' : 'paid at booking'}</p>
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

function FreeEmailNote() {
  return (
    <p className="mt-3 text-center text-xs text-muted">
      Payment is taken securely at booking. Just a quick question?{' '}
      <a href={`mailto:${SITE.email}`} className="font-medium text-navy hover:text-gold">Email us free</a>.
    </p>
  );
}

export default function BookingEmbed({
  source = 'book_page',
  tierId = 'individual',
}: {
  source?: string;
  tierId?: TierId;
}) {
  const calcom = calcomLinkFor(tierId);
  const calendly = calendlyLinkFor(tierId);
  const [loaded, setLoaded] = useState(false);
  const tier = tierFor(tierId);

  useEffect(() => {
    analytics.bookingStarted(`${source}:${tierId}`);
  }, [source, tierId]);

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
        <ConsultationSummary tierId={tierId} />
        <div className="relative">
          {!loaded && <SchedulerSkeleton />}
          <iframe
            title={`Book a ${tier.durationLabel} consultation`}
            src={`https://cal.com/${calcom}?embed=true&layout=month_view`}
            className={`h-[640px] w-full overflow-hidden rounded-2xl border border-mist bg-white ${loaded ? 'block' : 'hidden'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
        <FreeEmailNote />
      </div>
    );
  }

  if (calendly) {
    return (
      <div>
        <ConsultationSummary tierId={tierId} />
        <div className="relative">
          {!loaded && <SchedulerSkeleton />}
          <iframe
            title={`Book a ${tier.durationLabel} consultation`}
            src={calendly}
            className={`h-[640px] w-full overflow-hidden rounded-2xl border border-mist bg-white ${loaded ? 'block' : 'hidden'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
        <FreeEmailNote />
      </div>
    );
  }

  return (
    <div>
      <ConsultationSummary tierId={tierId} />
      <BookingForm tierId={tierId} />
      <p className="mt-3 text-center text-xs text-muted">
        {SITE.email && `General questions are answered free by email at ${SITE.email}.`}
      </p>
    </div>
  );
}
