import type { Metadata } from 'next';
import { Header, Footer, Section, Container, SectionHeading, CTASection, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { authors } from '@/lib/authority-data';
import { credentialSchemaFor } from '@/lib/credentials-data';
import { IconArrowRight } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the cross-border tax specialists at US UK Accountants — a named team covering both US and UK tax, with every filing prepared and dual-reviewed across jurisdictions.',
  alternates: { canonical: 'https://www.usukaccountants.com/about/team' },
};

export default function TeamPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'About', href: '/about/team' }, { label: 'Team', href: '/about/team' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">Our team</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Led by cross-border tax specialists
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Real, named people on both sides of the Atlantic. Every filing is prepared and independently reviewed across our US and UK teams before it goes out.
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
                  className="group rounded-2xl border border-mist bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-e2"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-ink font-display text-lg font-semibold text-gold-champagne">
                    {a.initials}
                  </span>
                  <h2 className="mt-5 font-display text-lg font-semibold text-ink">{a.name}</h2>
                  <p className="text-sm text-muted">{a.role}</p>
                  {credentialSchemaFor(a.slug).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {credentialSchemaFor(a.slug).map((c) => (
                        <span key={c} className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-antique">{c}</span>
                      ))}
                    </div>
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
