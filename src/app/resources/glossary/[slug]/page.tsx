import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell, Section, Container } from '@/components/library';
import { JsonLd } from '@/components/library/JsonLd';
import { definedTermSchema } from '@/lib/schema';
import { getGlossaryTerm, getAllGlossarySlugs, glossaryTerms } from '@/lib/glossary';
import { authors } from '@/lib/authority-data';

const BASE = 'https://www.usukaccountants.com/resources/glossary';

export function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getGlossaryTerm(slug);
  if (!t) return { title: 'Term not found' };
  const url = `${BASE}/${slug}`;
  const title = `${t.term}${t.expansion ? ` (${t.expansion})` : ''} — Definition`;
  return {
    title,
    description: t.short,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: t.short,
      type: 'article',
      url,
      siteName: 'US UK Accountants',
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getGlossaryTerm(slug);
  if (!t) notFound();

  const url = `${BASE}/${slug}`;

  const siblings = glossaryTerms
    .filter((x) => x.category === t.category && x.slug !== t.slug)
    .slice(0, 4);

  return (
    <PageShell
      url={url}
      eyebrow={`Glossary · ${t.category}`}
      title={t.term}
      answer={t.short}
      author={authors.find((a) => a.slug === 'sam-h')!}
      reviewedBy={authors.find((a) => a.slug === 'katie-m')!}
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Glossary', href: '/resources/glossary' },
        { label: t.term, href: `/resources/glossary/${t.slug}` },
      ]}
      ctaTitle={`Does ${t.term} apply to your situation?`}
      ctaIntro="Cross-border tax turns on the detail of your circumstances. Book a free consultation and we'll tell you exactly where you stand."
    >
      <JsonLd schema={definedTermSchema({ slug: t.slug, term: t.term, definition: t.short })} />
      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-3xl">
            {t.expansion && (
              <p className="mb-6 text-sm font-medium uppercase tracking-wide text-gold-antique">
                {t.expansion}
              </p>
            )}

            <h2 className="mb-3 font-display text-xl font-semibold text-ink">In more detail</h2>
            <p className="text-base leading-relaxed text-ink">{t.long}</p>

            {t.related && t.related.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 font-display text-xl font-semibold text-ink">Read more</h2>
                <ul className="space-y-2">
                  {t.related.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="inline-flex items-center gap-1.5 font-semibold text-navy underline-offset-4 hover:text-gold hover:underline"
                      >
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {siblings.length > 0 && (
              <div className="mt-10 border-t border-mist pt-8">
                <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                  Related terms
                </h2>
                <div className="flex flex-wrap gap-2">
                  {siblings.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/resources/glossary/${s.slug}`}
                      className="rounded-full border border-mist bg-porcelain px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-navy"
                    >
                      {s.term}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <Link
                href="/resources/glossary"
                className="text-sm font-semibold text-navy hover:text-gold"
              >
                ← Back to the full glossary
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
