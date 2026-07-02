'use client';

import { useEffect, useRef } from 'react';
import { analytics } from '@/lib/analytics';

/**
 * Fires the paid-booking conversion event exactly once when the thank-you page
 * is reached via a Cal.com success redirect (?source=calcom&tier=…).
 * The fallback enquiry form fires its own bookingCompleted BEFORE redirecting
 * (without these params), so this never double-counts.
 */
export default function BookingConversionTracker({ tier }: { tier: 'individual' | 'business' }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    analytics.bookingCompleted(undefined, tier);
  }, [tier]);
  return null;
}
