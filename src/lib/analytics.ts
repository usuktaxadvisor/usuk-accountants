/**
 * Analytics helper. Wraps GA4 (gtag) with typed conversion events so the
 * conversion funnel is measurable end-to-end. Safe to call on the server or
 * before gtag loads — calls are no-ops until GA is ready.
 */

type GtagArgs =
  | ['event', string, Record<string, unknown>?]
  | ['config', string, Record<string, unknown>?]
  | ['js', Date];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') {
    // Queue into dataLayer if gtag hasn't initialised yet.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    return;
  }
  window.gtag('event', event, params);
}

/* ---- Named conversion events (one place, consistent naming) ---- */

export const analytics = {
  bookingStarted: (source: string) =>
    track('booking_started', { source }),

  bookingStep: (step: number, label: string) =>
    track('booking_step', { step, label }),

  bookingCompleted: (situation?: string) =>
    track('generate_lead', { lead_type: 'booking', situation, value: 100, currency: 'GBP' }),

  contactSubmitted: (situation?: string) =>
    track('generate_lead', { lead_type: 'contact', situation, value: 1, currency: 'GBP' }),

  leadCaptured: (source: string) =>
    track('generate_lead', { lead_type: 'lead_magnet', source }),

  newsletterSubscribed: (source: string) =>
    track('newsletter_subscribe', { source }),

  ctaClicked: (label: string, location: string) =>
    track('cta_click', { cta_label: label, cta_location: location }),

  calculatorUsed: (calculator: string) =>
    track('calculator_used', { calculator }),

  phoneClicked: (region: 'uk' | 'us') =>
    track('phone_click', { region }),
};

/**
 * POST a lead to the API and fire the matching conversion event.
 * Returns { ok } — callers update UI to the success state on ok.
 */
export async function submitLead(payload: {
  type: 'contact' | 'booking' | 'lead' | 'newsletter';
  name?: string;
  email?: string;
  phone?: string;
  situation?: string;
  message?: string;
  source?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({ ok: false }));

    if (data.ok) {
      if (payload.type === 'booking') analytics.bookingCompleted(payload.situation);
      else if (payload.type === 'contact') analytics.contactSubmitted(payload.situation);
      else if (payload.type === 'lead') analytics.leadCaptured(payload.source ?? 'unknown');
      else if (payload.type === 'newsletter') analytics.newsletterSubscribed(payload.source ?? 'footer');
    }
    return { ok: !!data.ok, error: data.error };
  } catch {
    return { ok: false, error: 'Network error. Please try again.' };
  }
}
