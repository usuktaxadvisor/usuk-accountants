import { Button } from '@/components/library/primitives';
import { IconPhone, IconStar, IconArrowRight } from '@/components/ui/icons';
import { hasReviews, ratingValue, reviewCount } from '@/lib/trust-data';

interface CTAAction {
  label: string;
  href: string;
}

interface CTASectionProps {
  title: string;
  intro?: string;
  primary?: CTAAction;
  secondary?: CTAAction;
  showRating?: boolean;
  showPhone?: boolean;
  tone?: 'navy' | 'gold' | 'porcelain';
  id?: string;
}

/**
 * Full-width closing CTA band. Reusable on every page.
 * - tone="navy"     → dark band over the consultation-room photograph (parallax art layer)
 * - tone="gold"     → gold band, navy text (high-emphasis landing pages)
 * - tone="porcelain"→ light band (mid-page soft CTA)
 */
export function CTASection({
  title,
  intro,
  primary = { label: 'Contact us', href: '/contact' },
  secondary = primary.href === '/contact' ? { label: 'Book a paid consultation', href: '/book' } : undefined,
  showRating = true,
  showPhone = false,
  tone = 'navy',
  id,
}: CTASectionProps) {
  const isNavy = tone === 'navy';
  const isGold = tone === 'gold';

  const bg = isNavy ? 'bg-navy-ink' : isGold ? 'bg-gold' : 'bg-porcelain';
  const titleColor = isGold ? 'text-navy-ink' : isNavy ? 'text-white' : 'text-ink';
  const introColor = isGold ? 'text-navy-ink/80' : isNavy ? 'text-softwhite/85' : 'text-muted';

  return (
    <section id={id} className={`relative isolate overflow-hidden ${bg} py-24 md:py-32`}>
      {isNavy && (
        <>
          <div
            aria-hidden="true"
            data-parallax="0.1"
            className="parallax-layer bg-cta-chairs pointer-events-none absolute -inset-y-10 inset-x-0 -z-10"
          />
          <svg
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-30"
            viewBox="0 0 1440 400"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path d="M-100 320 C 420 100, 1020 100, 1540 320" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.5" />
          </svg>
        </>
      )}

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className={`font-display text-display-lg ${titleColor}`}>
          {title}
        </h2>
        {intro && <p className={`mt-6 text-lg leading-relaxed ${introColor}`}>{intro}</p>}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {isGold ? (
            <a
              href={primary.href}
              className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-md bg-navy-ink px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-navy-royal"
            >
              {primary.label}
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <Button href={primary.href} size="lg" withArrow>
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button
              href={secondary.href}
              variant={isNavy ? 'secondary-light' : 'secondary'}
              size="lg"
            >
              {showPhone && <IconPhone className="h-4 w-4" />}
              {secondary.label}
            </Button>
          )}
        </div>

        {showRating && hasReviews && ratingValue != null && (
          <div className={`mt-6 flex items-center justify-center gap-2 text-sm ${introColor}`}>
            <span className="flex text-gold" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} className="h-4 w-4" />
              ))}
            </span>
            Rated {ratingValue}/5 by {reviewCount} cross-border client{reviewCount === 1 ? '' : 's'}
          </div>
        )}
      </div>
    </section>
  );
}
