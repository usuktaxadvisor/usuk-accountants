/**
 * TRUST DATA — single source of truth for review/rating/testimonial signals.
 *
 * RULE: nothing here is ever invented. Rating and counts are DERIVED from the
 * `reviews` array — they cannot be set independently. While `reviews` is empty,
 * `hasReviews` is false and every consumer (aggregateRating schema, star
 * displays, testimonial sections) renders nothing. The moment real, verified
 * reviews are added here, all of it appears automatically and correctly.
 *
 * To go live with reviews: populate `reviews` with genuine, attributable
 * entries (ideally synced from Google Business Profile / Trustpilot), set
 * `verifiedSource`, and the site updates itself. Do not hand-type ratings.
 */

export interface Review {
  /** Reviewer's name as publicly shown on the source platform. */
  name: string;
  /** 1–5. */
  rating: number;
  /** The review text. */
  quote: string;
  /** Optional short descriptor, e.g. 'US citizen in London'. */
  context?: string;
  /** Where it came from — for the "verified" label and link. */
  source?: 'Google' | 'Trustpilot';
  /** Optional ISO date. */
  date?: string;
}

/**
 * GENUINE reviews only. EMPTY until real reviews are collected.
 * Do NOT add placeholder or sample entries here.
 */
export const reviews: Review[] = [];

/** Where reviews are independently verifiable (set when profiles exist). */
export const verifiedReviewSources: { label: 'Google' | 'Trustpilot'; href: string }[] = [];

/** True only when at least one genuine review exists. Gates ALL rating UI + schema. */
export const hasReviews = reviews.length > 0;

/** Derived rating — null while there are no reviews (never hard-coded). */
export const ratingValue: number | null = hasReviews
  ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
  : null;

/** Derived count — 0 while there are no reviews. */
export const reviewCount: number = reviews.length;

/**
 * Returns aggregateRating schema ONLY when backed by genuine reviews.
 * Returns null otherwise — so fabricated structured data can never ship.
 */
export function aggregateRatingSchema(): object | null {
  if (!hasReviews || ratingValue == null) return null;
  return {
    '@type': 'AggregateRating',
    ratingValue: String(ratingValue),
    reviewCount: String(reviewCount),
    bestRating: '5',
  };
}
