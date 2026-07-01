import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, Container, Button } from '@/components/library';

/**
 * Catch-all for planned routes that aren't built yet. Instead of a hard 404
 * on links that appear in the nav/footer (services, who-we-help, locations,
 * resources, pricing, about), this renders a branded "in progress" page that
 * keeps the visitor in the conversion funnel.
 *
 * As real pages are added at their routes, Next.js prefers the specific route
 * over this catch-all automatically. Genuinely unknown URLs still 404 via the
 * notFound() guard below.
 */

const KNOWN_PREFIXES = [
  'services', 'who-we-help', 'locations', 'resources', 'pricing', 'about',
];

function titleFromSlug(slug: string[]) {
  const last = slug[slug.length - 1] ?? '';
  return last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${titleFromSlug(slug)} — Coming Soon`,
    robots: { index: false, follow: true },
  };
}

export default async function ComingSoon(
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const title = titleFromSlug(slug);
  const isKnown = KNOWN_PREFIXES.includes(slug[0] ?? '');

  // Genuinely unknown URLs return a true 404 (not a soft-404 with HTTP 200).
  if (!isKnown) notFound();

  return (
    <>
      <Header />
      <main className="bg-white py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-prose text-center">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">
              Page in progress
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              We&rsquo;re putting the finishing touches on this page. In the meantime, the fastest way to get
              answers about your US&ndash;UK tax situation is a £100 30-minute consultation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/book">Book a consultation</Button>
              <Button href="/contact" variant="secondary">Contact us</Button>
            </div>

            <div className="mt-12 border-t border-mist pt-8">
              <p className="text-sm font-medium text-muted">Available now</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  { label: 'Reviews', href: '/reviews' },
                  { label: 'Our team', href: '/about/team' },
                  { label: 'Case studies', href: '/about/case-studies' },
                  { label: 'Trust Center', href: '/trust-center' },
                  { label: 'Credentials', href: '/credentials' },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-full bg-porcelain px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold/10">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
