import type { Review } from '@/lib/types';
import { IconStar } from '@/components/ui/icons';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex text-gold" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStar key={i} className={`h-4 w-4 ${i < rating ? '' : 'text-mist'}`} />
      ))}
    </span>
  );
}

/** Aggregate review summary with rating breakdown bars. */
export function ReviewSummary({
  average,
  count,
  breakdown,
}: {
  average: number;
  count: number;
  breakdown: { stars: number; pct: number }[];
}) {
  return (
    <div className="grid items-center gap-8 rounded-2xl border border-mist bg-porcelain p-8 sm:grid-cols-[auto_1fr]">
      <div className="text-center sm:border-r sm:border-mist sm:pr-8">
        <p className="font-display text-5xl font-semibold text-ink tnum">{average.toFixed(1)}</p>
        <div className="mt-2 flex justify-center"><Stars rating={Math.round(average)} /></div>
        <p className="mt-2 text-sm text-muted">{count.toLocaleString()}+ reviews</p>
      </div>
      <div className="space-y-2">
        {breakdown.map((b) => (
          <div key={b.stars} className="flex items-center gap-3 text-sm">
            <span className="w-12 shrink-0 text-muted">{b.stars} star</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-mist">
              <span className="block h-full rounded-full bg-gold" style={{ width: `${b.pct}%` }} />
            </span>
            <span className="w-10 shrink-0 text-right tnum text-muted">{b.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex flex-col rounded-2xl border border-mist bg-white p-6">
      <div className="mb-3 flex items-center justify-between">
        <Stars rating={review.rating} />
        {review.source && (
          <span className="rounded-full bg-porcelain px-2.5 py-1 text-xs font-medium text-muted">{review.source}</span>
        )}
      </div>
      <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">{review.body}</blockquote>
      <figcaption className="mt-5 flex items-center gap-2 border-t border-mist pt-4">
        {review.flag && <span className="text-lg" aria-hidden>{review.flag}</span>}
        <span>
          <span className="block text-sm font-semibold text-ink">{review.author}</span>
          {review.role && <span className="block text-xs text-muted">{review.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

export function ReviewGrid({
  reviews,
  emitSchema = true,
  orgName = 'US UK Accountants',
}: {
  reviews: Review[];
  emitSchema?: boolean;
  orgName?: string;
}) {
  const schema = emitSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: orgName,
        review: reviews.map((r) => ({
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
          author: { '@type': 'Person', name: r.author },
          reviewBody: r.body,
        })),
      }
    : null;

  return (
    <>
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <ReviewCard key={r.author + r.date} review={r} />
        ))}
      </div>
    </>
  );
}
