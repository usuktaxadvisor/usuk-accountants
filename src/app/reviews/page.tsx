import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, Section, Container, CTASection, ReviewSummary, ReviewGrid, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { reviews, reviewSummary } from '@/lib/authority-data';

export const metadata: Metadata = {
  title: 'Client Reviews',
  description:
    'Verified reviews from US UK Accountants clients — Americans in the UK, Brits in the US, and dual citizens. Genuine, verified-client feedback only.',
  alternates: { canonical: 'https://www.usukaccountants.com/reviews' },
};

export default function ReviewsPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">Client reviews</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                What our clients say
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Real feedback from people living between two tax systems. Every review is from a verified client — see our{' '}
                <Link href="/review-policy" className="text-gold underline-offset-4 hover:underline">review policy</Link>.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            {reviews.length > 0 && reviewSummary.average != null ? (
              <>
                <div className="mx-auto mb-12 max-w-3xl">
                  <ReviewSummary
                    average={reviewSummary.average}
                    count={reviewSummary.count}
                    breakdown={[...reviewSummary.breakdown]}
                  />
                </div>
                <ReviewGrid reviews={reviews} />
              </>
            ) : (
              <div className="mx-auto max-w-2xl rounded-2xl border border-mist bg-porcelain p-10 text-center">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  We&rsquo;re building our public review profile
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">
                  As a specialist cross-border firm, we ask every client for honest feedback once their work is
                  complete. We publish reviews here only when they come from genuine, verified clients — so this
                  page reflects real experiences, never invented ones. Verified reviews will appear here as they
                  are collected.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">
                  Already a client? You can leave feedback in line with our{' '}
                  <Link href="/review-policy" className="text-gold-antique underline-offset-4 hover:underline">review policy</Link>.
                </p>
              </div>
            )}
          </Container>
        </Section>

        <CTASection
          title="Experience the cross-border difference"
          intro="Book a consultation with specialists who handle both your US and UK tax under one roof."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
