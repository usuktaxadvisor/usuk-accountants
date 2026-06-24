import type { Metadata } from 'next';
import { Header, Footer, Section, Container, CTASection, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { complianceItems } from '@/lib/authority-data';
import { IconShield } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Compliance',
  description:
    'Professional registration, anti-money-laundering, engagement terms, confidentiality, professional indemnity and complaints — how US UK Accountants operates.',
  alternates: { canonical: 'https://www.usukaccountants.com/compliance' },
};

export default function CompliancePage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Compliance', href: '/compliance' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">Professional conduct</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Compliance &amp; professional standards
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                We handle regulated financial work across two jurisdictions. These are the standards and obligations we operate under.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <div className="grid gap-5 md:grid-cols-2">
              {complianceItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-mist bg-white p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold-antique">
                    <IconShield className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 font-display text-xl font-semibold text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-prose text-center text-sm text-muted">
              Specific registration numbers and regulatory details are listed on each professional&rsquo;s profile and provided in your engagement letter.
            </p>
          </Container>
        </Section>

        <CTASection
          title="Questions about how we work?"
          intro="We're happy to walk you through our engagement terms and professional standing before you commit to anything."
          tone="navy"
          secondary={{ label: 'Read our editorial policy', href: '/editorial-policy' }}
        />
      </main>
      <Footer />
    </>
  );
}
