import Link from 'next/link';
import { CONSULTATION_TIERS } from '@/lib/site-data';
import { IconCheck } from '@/components/ui/icons';

/**
 * Renders the three consultation products as premium cards. The middle
 * (business) tier is visually featured as the value anchor. The private tier
 * is deliberately unpriced and routes to a confidential enquiry, not a booking.
 */
export function ConsultationTiers({ heading = true }: { heading?: boolean }) {
  return (
    <div>
      {heading && (
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">Consultations</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Choose the right conversation
          </h2>
          <p className="mt-4 text-muted">
            Every paid consultation is credited against your first engagement. Prefer to ask a quick question
            first? General queries are answered free by email.
          </p>
        </div>
      )}

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {CONSULTATION_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={[
              'flex flex-col rounded-2xl border p-7',
              tier.featured
                ? 'border-gold bg-navy-ink text-white shadow-xl lg:-mt-3 lg:mb-3'
                : 'border-mist bg-white',
            ].join(' ')}
          >
            {tier.featured && (
              <span className="mb-4 inline-flex w-fit rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow text-gold">
                Most popular for businesses
              </span>
            )}

            <h3 className={`font-display text-xl font-semibold ${tier.featured ? 'text-white' : 'text-ink'}`}>
              {tier.name}
            </h3>

            <div className="mt-4 flex items-baseline gap-2">
              <span className={`font-display text-3xl font-semibold ${tier.featured ? 'text-gold-champagne' : 'text-navy'}`}>
                {tier.price}
              </span>
              <span className={`text-sm ${tier.featured ? 'text-softwhite/70' : 'text-muted'}`}>
                {tier.durationLabel}
              </span>
            </div>

            {tier.credited ? (
              <p className={`mt-1 text-xs ${tier.featured ? 'text-softwhite/60' : 'text-muted'}`}>
                Credited to your first engagement
              </p>
            ) : (
              <p className={`mt-1 text-xs ${tier.featured ? 'text-softwhite/60' : 'text-muted'}`}>
                Confidential · quoted to scope
              </p>
            )}

            <p className={`mt-4 text-sm leading-relaxed ${tier.featured ? 'text-softwhite/85' : 'text-muted'}`}>
              {tier.tagline}
            </p>

            <ul className="mt-5 space-y-2.5">
              {tier.idealFor.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <IconCheck className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? 'text-gold' : 'text-gold-antique'}`} />
                  <span className={tier.featured ? 'text-softwhite/90' : 'text-ink'}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 pt-1">
              <Link
                href={tier.bookHref}
                className={[
                  'inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition',
                  tier.featured
                    ? 'bg-gold text-navy-ink hover:bg-gold-champagne'
                    : 'border border-navy text-navy hover:bg-navy hover:text-white',
                ].join(' ')}
              >
                {tier.ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
