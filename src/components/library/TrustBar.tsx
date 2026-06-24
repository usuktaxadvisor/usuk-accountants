import { IconBank, IconGlobeDoc, IconShield, IconCheck } from '@/components/ui/icons';
import { credentials as defaultCreds } from '@/lib/site-data';
import { hasReviews, ratingValue, reviewCount, verifiedReviewSources } from '@/lib/trust-data';
import { IconStar } from '@/components/ui/icons';

interface TrustBarProps {
  tone?: 'porcelain' | 'white';
  /** Optional verified professional-body memberships. Renders only if non-empty. */
  credentials?: string[];
}

/**
 * Honest trust bar. Shows genuine, verifiable signals only:
 * both tax systems, two staffed offices, named specialists, secure process.
 * Star rating renders ONLY when real reviews exist (trust-data gated).
 * Professional-body badges render ONLY if verified credentials are supplied.
 */
export function TrustBar({ tone = 'porcelain', credentials = defaultCreds }: TrustBarProps) {
  const bg = tone === 'white' ? 'bg-white' : 'bg-porcelain';

  const signals = [
    { icon: IconGlobeDoc, label: 'US & UK tax, one firm' },
    { icon: IconBank, label: 'Offices in London & New York' },
    { icon: IconCheck, label: 'Named specialists, not call centres' },
    { icon: IconShield, label: 'Secure & confidential process' },
  ];

  return (
    <section className={`border-b border-mist ${bg}`}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-5 px-6 py-7 md:flex-row md:justify-center md:gap-x-10">
        {/* Rating — only when genuine reviews exist */}
        {hasReviews && ratingValue != null && (
          <div className="flex items-center gap-2">
            <span className="flex text-gold" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} className="h-4 w-4" />)}
            </span>
            <span className="text-sm font-medium text-ink">{ratingValue}/5</span>
            <span className="text-sm text-muted">
              · {reviewCount} review{reviewCount === 1 ? '' : 's'}
              {verifiedReviewSources[0] ? ` on ${verifiedReviewSources[0].label}` : ''}
            </span>
          </div>
        )}

        {/* Genuine differentiators */}
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {signals.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-2 text-sm font-medium text-muted">
              <s.icon className="h-4 w-4 text-gold" aria-hidden="true" />
              {s.label}
            </span>
          ))}
        </div>

        {/* Verified professional bodies — only if supplied */}
        {credentials.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {credentials.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted">
                <IconCheck className="h-4 w-4 text-gold" aria-hidden="true" />
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
