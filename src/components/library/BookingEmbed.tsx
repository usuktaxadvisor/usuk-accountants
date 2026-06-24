'use client';

import { useEffect } from 'react';
import { BookingForm } from '@/components/library/Forms';
import { analytics } from '@/lib/analytics';

/**
 * Booking scheduler embed.
 *
 * Configure ONE of these public env vars to activate a real scheduler:
 *   NEXT_PUBLIC_CALCOM_LINK    e.g. "usukaccountants/consultation"
 *   NEXT_PUBLIC_CALENDLY_URL   e.g. "https://calendly.com/usukaccountants/consultation"
 *
 * If neither is set, falls back to the in-house multi-step BookingForm,
 * which posts to /api/lead — so the funnel works regardless.
 */
export default function BookingEmbed({ source = 'book_page' }: { source?: string }) {
  const calcom = process.env.NEXT_PUBLIC_CALCOM_LINK;
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL;

  useEffect(() => {
    analytics.bookingStarted(source);
  }, [source]);

  // Cal.com embed
  useEffect(() => {
    if (!calcom) return;
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, [calcom]);

  // Calendly embed
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
      <div
        data-cal-link={calcom}
        data-cal-config='{"layout":"month_view"}'
        className="min-h-[640px] overflow-hidden rounded-2xl border border-mist bg-white"
        aria-label="Booking calendar"
      >
        <iframe
          title="Book a consultation"
          src={`https://cal.com/${calcom}?embed=true&layout=month_view`}
          className="h-[640px] w-full"
          loading="lazy"
        />
      </div>
    );
  }

  if (calendly) {
    return (
      <div
        className="calendly-inline-widget min-h-[640px] overflow-hidden rounded-2xl border border-mist bg-white"
        data-url={calendly}
        style={{ minWidth: '320px', height: '640px' }}
        aria-label="Booking calendar"
      />
    );
  }

  // Fallback: in-house multi-step form (still a complete, working funnel)
  return <BookingForm />;
}
