import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container, ProseBlock, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { OFFICES } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/locations';
const staffed = OFFICES.filter((o) => o.staffed);

export const metadata: Metadata = {
  title: 'Our Offices — US & UK Tax Accountants in London & New York',
  description:
    'US UK Accountants has offices in London and the New York area, providing specialist US–UK cross-border tax and accounting on both sides of the Atlantic — in person and remotely.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  { q: 'Where are your offices?', a: 'We have staffed offices in London (United Kingdom) and the New York area (United States), which lets us serve clients on both sides of the Atlantic during local hours. We also work with clients remotely across the UK, the US and internationally.' },
  { q: 'Do I have to use the office nearest me?', a: 'No. Because we are a single cross-border firm rather than separate national practices, any client gets the full US and UK capability regardless of which office is closest. Many clients work with us entirely remotely.' },
];

export default function LocationsHub() {
  return (
    <PageShell
      url={URL}
      eyebrow="Locations"
      title="Our offices"
      answer="US UK Accountants has staffed offices in London and the New York area, giving us a genuine presence on both sides of the Atlantic for US–UK cross-border tax and accounting. Wherever you are, you get the full US and UK capability of a single firm — in person at either office, or remotely."
      crumbs={[{ label: 'Locations', href: '/locations' }]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Wherever you are, we cover both sides"
      ctaIntro="Book a consultation with our London or New York team, or work with us remotely."
    >
      <ProseBlock>
        <p>
          We deliberately keep a real presence in both countries. An American in London and a Briton in New York
          have mirror-image versions of the same problem &mdash; filing across two tax systems &mdash; and a firm
          with people in both places, working local hours, is far better placed to solve it than one operating
          from a single side.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {staffed.map((o) => (
              <Link
                key={o.id}
                href={`/locations/${o.id}`}
                className="group rounded-2xl border border-mist bg-white p-8 shadow-e1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold"
              >
                <p className="font-display text-2xl font-semibold text-ink group-hover:text-navy">
                  {o.flag} {o.label}
                </p>
                <p className="mt-3 text-muted">
                  {o.street}<br />
                  {o.locality}{o.region ? `, ${o.region}` : ''} {o.postalCode}
                </p>
                <p className="mt-4 text-sm font-semibold text-navy group-hover:text-gold">
                  View {o.label} office →
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <RelatedLinks
        title="Explore"
        links={[
          { label: 'US & UK Tax Services', href: '/services', description: 'Everything we do, both sides.' },
          { label: 'Who We Help', href: '/who-we-help', description: 'Find your situation.' },
          { label: 'Contact us', href: '/contact', description: 'Get in touch directly.' },
        ]}
      />
    </PageShell>
  );
}
