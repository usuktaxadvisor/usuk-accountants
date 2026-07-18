'use client';

import { useEffect, useState } from 'react';
import { BookingForm } from '@/components/library/Forms';
import { analytics } from '@/lib/analytics';
import { CONSULTATION_TIERS, SITE } from '@/lib/site-data';

type TierId = 'individual' | 'business';

function tierFor(id?: TierId) {
  return CONSULTATION_TIERS.find((t) => t.id === id) ?? CONSULTATION_TIERS.find((t) => t.id === 'individual')!;
}

const EMBED_TIMEOUT_MS = 8000;

function normalize(value?: string): string | undefined {
  if (!value) return undefined;
  return value.startsWith('http') ? value : `https://cal.com/${value}`;
}

function bookingUrlFor(tierId: TierId): string | undefined {
  const envOverride =
    tierId === 'business'
      ? process.env.NEXT_PUBLIC_CALCOM_BUSINESS ?? process.env.NEXT_PUBLIC_CALENDLY_BUSINESS
      : process.env.NEXT_PUBLIC_CALCOM_INDIVIDUAL ?? process.env.NEXT_PUBLIC_CALENDLY_INDIVIDUAL;
  const legacy = process.env.NEXT_PUBLIC_CALCOM_LINK ?? process.env.NEXT_PUBLIC_CALENDLY_URL;
  return normalize(envOverride) ?? tierFor(tierId).bookingUrl ?? normalize(legacy);
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
    <div className="flex min-h-[560px] items-center justify-center rounded-2xl border border-mist bg-white" role="status" aria-live="polite">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-mist border-t-navy" aria-hidden />
        <p className="mt-3 text-sm text-muted">Loading available times...</p>
      </div>
    </div>
  );
}

function DirectBookingPanel({ url, tierId }: { url: string; tierId: TierId }) {
  const tier = tierFor(tierId);
  return (
    <div className="flex min-h-[560px] items-center justify-center rounded-2xl border border-mist bg-porcelain/60 px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-xl font-semibold text-ink">Book on our secure scheduling page</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The inline calendar is taking longer than usual to load. Your {tier.durationLabel} session is available on our secure Cal.com booking page with the same times and secure payment.
        </p>
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => analytics.bookingOutboundClick(tierId, 'timeout_fallback')} className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy-ink transition hover:bg-gold-champagne">
          Open the booking page
        </a>
        <p className="mt-4 text-xs text-muted">Opens in a new tab · payment taken securely at booking</p>
      </div>
    </div>
  );
}

export default function BookingEmbed({
  source = 'book_page',
  tierId = 'individual',
}: {
  source?: string;
  tierId?: TierId;
}) {
  const bookingUrl = bookingUrlFor(tierId);
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const tier = tierFor(tierId);

  useEffect(() => {
    analytics.bookingStarted(`${source}:${tierId}`);
  }, [source, tierId]);

  useEffect(() => {
    if (loaded || !bookingUrl) return;
    const t = setTimeout(() => setTimedOut(true), EMBED_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [loaded, bookingUrl]);

  if (bookingUrl) {
    const embedSrc = `${bookingUrl}${bookingUrl.includes('?') ? '&' : '?'}embed=true&layout=month_view`;
    return (
      <div>
        <ConsultationSummary tierId={tierId} />
        <div className="relative">
          {!loaded && !timedOut && <SchedulerSkeleton />}
          {!loaded && timedOut && <DirectBookingPanel url={bookingUrl} tierId={tierId} />}
          <iframe
            title={`Book: ${tier.name} (${tier.durationLabel})`}
            src={embedSrc}
            className={`h-[680px] w-full overflow-hidden rounded-2xl border border-mist bg-white ${loaded ? 'block' : 'hidden'}`}
            loading="lazy"
            onLoad={() => { setLoaded(true); analytics.bookingEmbedLoaded(tierId); }}
          />
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          Payment is taken securely at booking and your fee is credited to your first engagement.{' '}
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => analytics.bookingOutboundClick(tierId, 'inline_link')} className="font-medium text-navy hover:text-gold">
            Prefer a full page? Book in a new tab
          </a>
          <br />
          Just a quick question?{' '}
          <a href={`mailto:${SITE.email}`} className="font-medium text-navy hover:text-gold">Email us free</a> at <span className="font-medium text-navy">{SITE.email}</span>.
        </p>
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
