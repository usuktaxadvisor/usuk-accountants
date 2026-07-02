import type { Author } from '@/lib/types';
import { IconCheck, IconArrowRight } from '@/components/ui/icons';
import { credentialCodesFor } from '@/lib/credentials-data';
import { personSchema } from '@/lib/schema';
import { JsonLd } from '@/components/library/JsonLd';

/**
 * Compact author byline for articles/service pages.
 * Reinforces EEAT: named, credentialed, reviewed-by.
 */
export function AuthorByline({
  author,
  date,
  reviewedBy,
}: {
  author: Author;
  date?: string;
  reviewedBy?: Author;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-mist bg-porcelain p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-ink font-display text-sm font-semibold text-gold-champagne">
        {author.initials}
      </span>
      <div className="text-sm">
        <p>
          <span className="text-muted">By </span>
          <a href={`/about/team/${author.slug}`} className="font-semibold text-ink hover:text-gold-antique">{author.name}</a>
          <span className="text-muted">, {author.role}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {credentialCodesFor(author.slug).length > 0 && (
            <>{credentialCodesFor(author.slug).join(' · ')}
              {reviewedBy ? ' · ' : ''}</>
          )}
          {reviewedBy ? (
            <>Reviewed by{' '}
              <a href={`/about/team/${reviewedBy.slug}`} className="font-medium text-ink hover:text-gold-antique">
                {reviewedBy.name}
              </a>
            </>
          ) : author.reviewedBy ? (
            <> · Reviewed by {author.reviewedBy}</>
          ) : null}
          {date && <> · {date}</>}
        </p>
      </div>
    </div>
  );
}

/** Full author/team-member profile page body with Person + sameAs schema. */
export function AuthorProfile({ author }: { author: Author }) {
  const schema = personSchema({
    slug: author.slug,
    name: author.name,
    role: author.role,
    credentials: author.credentials,
    expertise: author.expertise,
    description: author.bio,
    sameAs: author.sameAs,
  });

  return (
    <article className="mx-auto max-w-prose">
      <JsonLd schema={schema} />

      <div className="flex items-center gap-5">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-navy-ink font-display text-2xl font-semibold text-gold-champagne">
          {author.initials}
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{author.name}</h1>
          <p className="mt-1 text-muted">{author.role}</p>
          {credentialCodesFor(author.slug).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {credentialCodesFor(author.slug).map((c) => (
                <span key={c} className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-antique">{c}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-lg leading-relaxed text-ink">{author.bio}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">Areas of expertise</p>
          <ul className="mt-3 space-y-2">
            {author.expertise.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-muted">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {e}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">At a glance</p>
          <dl className="mt-3 space-y-2 text-sm">
            {credentialCodesFor(author.slug).length > 0 && (
              <div className="flex justify-between border-b border-mist pb-2">
                <dt className="text-muted">Qualifications</dt>
                <dd className="font-medium text-ink">{credentialCodesFor(author.slug).join(', ')}</dd>
              </div>
            )}
            <div className="flex justify-between border-b border-mist pb-2">
              <dt className="text-muted">Jurisdictions</dt>
              <dd className="font-medium text-ink">{author.jurisdictions.join(', ')}</dd>
            </div>
            {author.reviewedBy && (
              <div className="flex justify-between border-b border-mist pb-2">
                <dt className="text-muted">Reviews work with</dt>
                <dd className="font-medium text-ink">{author.reviewedBy.split(',')[0]}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {author.sameAs && author.sameAs.filter((s) => s.href && s.href !== '#').length > 0 && (
        <div className="mt-8 border-t border-mist pt-6">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">Verify &amp; connect</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {author.sameAs.filter((s) => s.href && s.href !== '#').map((s) => (
              <a key={s.label} href={s.href} className="inline-flex items-center gap-1.5 rounded-full bg-porcelain px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-gold/10">
                {s.label} <IconArrowRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
