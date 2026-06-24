import type { Metadata } from 'next';
import { Header, Footer, Section, Container, CTASection, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { securityMeasures } from '@/lib/authority-data';
import { IconShield, IconCheck } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'How US UK Accountants protects your data: encryption in transit and at rest, secure document portal, access controls, vendor due diligence and incident response.',
  alternates: { canonical: 'https://www.usukaccountants.com/security' },
};

export default function SecurityPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Security', href: '/security' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <IconShield className="h-6 w-6" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-eyebrow text-gold">Security</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Your data, protected
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Tax work means trusting us with your most sensitive information. Here is how we keep it safe — and what we will never ask you to do.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <div className="grid gap-5 md:grid-cols-2">
              {securityMeasures.map((m) => (
                <div key={m.title} className="flex gap-4 rounded-2xl border border-mist bg-white p-7">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold-antique">
                    <IconCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">{m.title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section tone="porcelain">
          <Container>
            <div className="mx-auto max-w-prose rounded-2xl border border-signal/30 bg-signal/[0.04] p-7">
              <h2 className="font-display text-xl font-semibold text-ink">How to spot a scam in our name</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                We will never ask for your Social Security number, ITIN, passwords or full bank details by email or text. We never request payment to a personal account. Sensitive documents are only ever exchanged through our secure portal. If anything claiming to be from us looks off, contact us directly using the number on this site before responding.
              </p>
            </div>
          </Container>
        </Section>

        <CTASection
          title="Security questions before you share anything?"
          intro="Ask us. We'd rather you felt completely confident before sending a single document."
          tone="navy"
          secondary={{ label: 'Visit the Trust Center', href: '/trust-center' }}
        />
      </main>
      <Footer />
    </>
  );
}
