import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Header, Footer, Container, ContactForm,
} from '@/components/library';
import { IconPhone, IconArrowRight } from '@/components/ui/icons';
import { SITE } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with US UK Accountants. Offices in London and New York. Email or call our cross-border tax specialists, or send an enquiry and we reply within one business day.',
  alternates: { canonical: 'https://www.usukaccountants.com/contact' },
};

const SITE_URL = 'https://www.usukaccountants.com';
const ORG_ID = `${SITE_URL}/#organization`;

const localBusinessSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${SITE_URL}/contact/#london`,
    name: 'US UK Accountants — London',
    parentOrganization: { '@id': ORG_ID },
    url: SITE_URL,
    email: SITE.email,
    telephone: SITE.phones.uk.number,
    priceRange: '££££',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '70 Queen Road',
      addressLocality: 'London',
      addressRegion: 'England',
      postalCode: 'E17 8QP',
      addressCountry: 'GB',
    },
    areaServed: 'GB',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${SITE_URL}/contact/#new-york`,
    name: 'US UK Accountants — New York',
    parentOrganization: { '@id': ORG_ID },
    url: SITE_URL,
    email: SITE.email,
    telephone: SITE.phones.us.number,
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '49 Mill Lane',
      addressLocality: 'Briarcliff Manor',
      addressRegion: 'NY',
      postalCode: '10510',
      addressCountry: 'US',
    },
    areaServed: 'US',
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ enquiry?: string }>;
}) {
  const { enquiry } = await searchParams;
  const isPrivateClient = enquiry === 'private-client';

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">
                {isPrivateClient ? 'Private Client Advisory' : 'Contact us'}
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {isPrivateClient ? 'Request a confidential conversation' : 'Talk to a cross-border specialist'}
              </h1>
              {isPrivateClient && (
                <p className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm leading-relaxed text-softwhite/90">
                  Private Client Advisory enquiries are handled personally by our senior team, in strict
                  confidence. Tell us broadly what you&rsquo;d like to discuss — estate, exit, restructuring
                  or complex cross-border matters — and we&rsquo;ll arrange a private conversation and quote
                  to scope.
                </p>
              )}
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Tell us a little about your situation and we&rsquo;ll reply within one business day. Or call us directly — we have specialists on both sides of the Atlantic.
              </p>
            </div>
          </Container>
        </header>

        <div className="bg-white py-16 md:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
              {/* Form */}
              <div className="rounded-2xl border border-mist bg-white p-7 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-ink">Send us a message</h2>
                <p className="mt-2 text-sm text-muted">Prefer to book a call? <Link href="/book" className="font-medium text-gold-antique hover:underline">Book a consultation →</Link></p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>

              {/* NAP / offices */}
              <aside className="space-y-5">
                <div className="rounded-2xl border border-mist bg-porcelain p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden>{SITE.phones.uk.flag}</span>
                    <h3 className="font-display text-lg font-semibold text-ink">United Kingdom</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted">London office</p>
                  <a href={`tel:${SITE.phones.uk.tel}`} className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-gold-antique">
                    <IconPhone className="h-4 w-4 text-gold" /> {SITE.phones.uk.number}
                  </a>
                  <a href={`mailto:${SITE.email}`} className="mt-1 block text-sm text-muted hover:text-gold-antique">{SITE.email}</a>
                  <Link href="/locations/london" className="mt-3 block text-sm font-semibold text-navy hover:text-gold">View London office →</Link>
                </div>

                <div className="rounded-2xl border border-mist bg-porcelain p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden>{SITE.phones.us.flag}</span>
                    <h3 className="font-display text-lg font-semibold text-ink">United States</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted">New York office</p>
                  <a href={`tel:${SITE.phones.us.tel}`} className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-gold-antique">
                    <IconPhone className="h-4 w-4 text-gold" /> {SITE.phones.us.number}
                  </a>
                  <a href={`mailto:${SITE.email}`} className="mt-1 block text-sm text-muted hover:text-gold-antique">{SITE.email}</a>
                  <Link href="/locations/new-york" className="mt-3 block text-sm font-semibold text-navy hover:text-gold">View New York office →</Link>
                </div>

                <Link href="/book" className="group flex items-center justify-between rounded-2xl bg-navy-ink p-6 text-white transition-colors hover:bg-navy-royal">
                  <span>
                    <span className="block font-display text-lg font-semibold">Book a consultation</span>
                    <span className="mt-1 block text-sm text-softwhite/70">15 minutes</span>
                  </span>
                  <IconArrowRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-0.5" />
                </Link>
              </aside>
            </div>
          <p className="mt-10 text-center text-xs text-muted">US UK Accountants Ltd · Registered in England &amp; Wales, Company No. 17336015</p>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
