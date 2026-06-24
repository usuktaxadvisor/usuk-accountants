import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Container } from '@/components/library';
import { IconArrowRight } from '@/components/ui/icons';
import { authors } from '@/lib/authority-data';
import { getAllPostsMeta } from '@/lib/blog';

const URL = 'https://www.usukaccountants.com/resources/blog';

export const metadata: Metadata = {
  title: 'US–UK Tax Insights & Guides',
  description:
    'Plain-English guides to cross-border tax for Americans in the UK, Brits in the US and dual citizens — FBAR, FATCA, the US–UK treaty, Streamlined filing, residence and more.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

function formatDate(d: string): string {
  if (!d) return '';
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

const faqs = [
  {
    q: 'How often do you publish new articles?',
    a: 'We publish guidance as cross-border rules change and as the questions our clients ask evolve. Every article is written by our team and reviewed for US (IRS) or UK (HMRC) accuracy before it goes live.',
  },
  {
    q: 'Is the information here a substitute for advice?',
    a: 'No. Our articles explain how the rules generally work, but cross-border tax turns on the detail of your individual situation. Use them to understand your position, then book a free consultation for advice specific to you.',
  },
];

export default function BlogIndex() {
  const posts = getAllPostsMeta();

  return (
    <PageShell
      url={URL}
      eyebrow="Resources · Insights"
      title="Cross-border tax insights & guides"
      answer="Clear, reviewed guidance on US–UK tax for expats, dual citizens and cross-border businesses. Each article is written by our team and checked for IRS or HMRC accuracy — written to answer the real questions people ask before they pick up the phone."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Insights', href: '/resources/blog' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-24"
      faqs={faqs}
      ctaTitle="Have a question an article didn't answer?"
      ctaIntro="Every situation is different. Book a free, no-obligation consultation and we'll give you a clear answer for yours."
    >
      <Section tone="white">
        <Container>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-mist bg-porcelain p-10 text-center">
              <p className="text-muted">New articles are on the way — check back shortly.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/resources/blog/${p.slug}`}
                  className="group flex flex-col rounded-2xl border border-mist bg-white p-7 shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:bg-navy-ink hover:shadow-gold"
                >
                  {p.category && (
                    <span className="inline-flex w-fit rounded-full bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold-antique transition-colors duration-300 group-hover:bg-gold/20 group-hover:text-gold">
                      {p.category}
                    </span>
                  )}
                  <h2 className="mt-4 font-display text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-white">
                    {p.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-softwhite/80">
                    {p.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-mist pt-4 text-xs text-muted transition-colors duration-300 group-hover:border-white/15 group-hover:text-softwhite/70">
                    <span>{formatDate(p.date)}</span>
                    <span>{p.readingMinutes} min read</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors duration-300 group-hover:text-gold">
                    Read article
                    <IconArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </PageShell>
  );
}
