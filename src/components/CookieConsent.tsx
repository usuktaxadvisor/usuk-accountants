'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

/**
 * Cookie consent (UK GDPR / PECR compliant).
 *
 * Non-essential cookies (analytics) must NOT load until the visitor grants
 * consent. State persists in localStorage. Visitors can accept or reject, and
 * rejection is honoured permanently until they change it. Analytics reads
 * `useConsent().analytics` and only mounts the GA scripts when true.
 *
 * Essential cookies (needed to run the site) are never gated — we only gate
 * analytics here, which is the only non-essential category in use.
 */

type ConsentValue = 'granted' | 'denied' | null;
const STORAGE_KEY = 'usuk-consent-v1';

interface ConsentCtx {
  analytics: boolean;        // true only when granted
  decided: boolean;          // has the visitor made a choice yet
  accept: () => void;
  reject: () => void;
  reopen: () => void;        // let visitors change their mind (e.g. from footer)
}

const Ctx = createContext<ConsentCtx>({
  analytics: false, decided: false, accept: () => {}, reject: () => {}, reopen: () => {},
});

export function useConsent() {
  return useContext(Ctx);
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<ConsentValue>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ConsentValue;
      if (stored === 'granted' || stored === 'denied') setValue(stored);
    } catch { /* localStorage unavailable — treat as undecided */ }
    setHydrated(true);
  }, []);

  const persist = useCallback((v: Exclude<ConsentValue, null>) => {
    setValue(v);
    try { localStorage.setItem(STORAGE_KEY, v); } catch { /* ignore */ }
  }, []);

  const accept = useCallback(() => persist('granted'), [persist]);
  const reject = useCallback(() => persist('denied'), [persist]);
  const reopen = useCallback(() => setValue(null), []);

  const analytics = value === 'granted';
  const decided = value !== null;

  return (
    <Ctx.Provider value={{ analytics, decided, accept, reject, reopen }}>
      {children}
      {hydrated && !decided && <ConsentBanner onAccept={accept} onReject={reject} />}
    </Ctx.Provider>
  );
}

function ConsentBanner({ onAccept, onReject }: { onAccept: () => void; onReject: () => void }) {
  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-mist bg-white/95 p-5 shadow-e2 backdrop-blur md:flex-row md:items-center md:justify-between md:p-6">
        <p className="text-sm leading-relaxed text-muted">
          We use essential cookies to run this site. With your consent we also use analytics to understand how the
          site is used and improve it. You can change your choice anytime. See our{' '}
          <Link href="/privacy" className="font-medium text-gold-antique underline-offset-4 hover:underline">privacy policy</Link>.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={onReject}
            className="rounded-lg border border-mist px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-porcelain"
          >
            Reject analytics
          </button>
          <button
            onClick={onAccept}
            className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
