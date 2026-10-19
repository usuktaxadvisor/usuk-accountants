import type { Metadata } from 'next';
import { Header, Footer, Section, Container, SectionHeading, CTASection, Breadcrumbs, JsonLd, AtlanticStrip } from '@/components/library';
import { breadcrumbSchema } from '@/lib/schema';
import { authors } from '@/lib/authority-data';
import { credentialCodesFor } from '@/lib/credentials-data';
import { IconArrowRight } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Our Team | US & UK Tax Specialists',
  description:
    'Meet the cross-border tax specialists at US UK Accountants: a named team covering both US and UK tax, with every filing prepared and reviewed across both jurisdictions.',
  alternates: { canonical: 'https://www.usukaccountants.com/about/team' },
};

export default function TeamPage() {
  const crumbs = [{ label: 'Our team', href: '/about/team' }];
  return (
    <>
      <JsonLd schema={breadcrumbSchema(crumbs)} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <header className="page-header py-20 md:py-28">
          <div aria-hidden="true" data-parallax="0.1" className="page-header-art parallax-layer art-about" />
          <Container>
            <div className="max-w-3xl">
              <p className="kicker kicker-light">Our team</p>
              <h1 className="mt-5 font-display text-display-lg text-white">
                Led by cross-border tax specialists
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Real, named people on both sides of the Atlantic, qualified across the UK and US
                professional bodies, including ACCA, ACA, CPA, CTA, CIMA and AAT. Every filing is prepared and
                independently reviewed across our US and UK teams before it goes out.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {authors.map((a) => (
                <a
                  key={a.slug}
                  href={`/about/team/${a.slug}`}
                  className="group rounded-card border border-mist bg-white p-7 transition-all duration-300 hover:border-gold/70 hover:shadow-e2"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-navy-ink font-display text-lg text-gold-champagne">
                    {a.initials}
                  </span>
                  <h2 className="mt-5 font-display text-display-sm text-ink">{a.name}</h2>
                  <p className="text-sm text-muted">{a.role}</p>
                  {credentialCodesFor(a.slug).length > 0 && (
                    <p className="mt-3 text-sm font-medium text-gold-antique">{credentialCodesFor(a.slug).join(' \u00b7 ')}</p>
                  )}
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{a.bio}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-antique">
                    View profile
                    <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </Container>
        </Section>

        <AtlanticStrip tone="white" eyebrow="Where our clients are" title="Between London, Manchester and New York" intro="Our clients live on both sides of the Atlantic. The team prepares the US and UK sides together, and every filing is reviewed by a second specialist before it goes out." />

        <CTASection
          title="Work with specialists who know both systems"
          tone="navy"
          secondary={{ label: 'See our credentials', href: '/credentials' }}
        />
      </main>
      <Footer />
    </>
  );
}
