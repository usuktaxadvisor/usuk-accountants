'use client';

import { useState } from 'react';
import type { PricingTier } from '@/lib/types';
import { IconCheck } from '@/components/ui/icons';

export function PricingCards({ tiers }: { tiers: PricingTier[] }) {
  const [currency, setCurrency] = useState<'GBP' | 'USD'>('GBP');

  return (
    <div>
      {/* Currency toggle */}
      <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-mist bg-white p-1">
        {(['GBP', 'USD'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              currency === c ? 'bg-navy-ink text-white' : 'text-muted hover:text-ink'
            }`}
            aria-pressed={currency === c}
          >
            {c === 'GBP' ? '🇬🇧 GBP' : '🇺🇸 USD'}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => {
          const price = currency === 'GBP' ? tier.priceGBP : tier.priceUSD;
          return (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                tier.featured
                  ? 'border-gold bg-navy-ink text-white shadow-gold'
                  : 'border-mist bg-white text-ink hover:border-gold hover:shadow-e2'
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-gold-champagne px-4 py-1 text-xs font-semibold text-navy-ink">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
              <p className={`mt-2 text-sm ${tier.featured ? 'text-softwhite/80' : 'text-muted'}`}>
                {tier.description}
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tnum">{price}</span>
                {tier.cadence && (
                  <span className={`text-sm ${tier.featured ? 'text-softwhite/60' : 'text-muted'}`}>
                    /{tier.cadence}
                  </span>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className={tier.featured ? 'text-softwhite/90' : 'text-muted'}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.cta.href}
                className={`mt-8 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  tier.featured
                    ? 'bg-gradient-to-r from-gold to-gold-champagne text-navy-ink hover:-translate-y-0.5'
                    : 'border border-gold/60 text-gold-antique hover:bg-gold/10'
                }`}
              >
                {tier.cta.label}
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
