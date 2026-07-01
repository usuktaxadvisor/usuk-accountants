import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { JsonLd } from '@/components/library/JsonLd';
import { localBusinessSchema } from '@/lib/schema';
import { authors } from '@/lib/authority-data';
import { services, OFFICES } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/locations/london';
const office = OFFICES.find((o) => o.id === 'london')!;

export const metadata: Metadata = {
  title: 'US & UK Tax Services in London — American Tax Accountants',
  description:
    'Specialist US–UK tax services in London for Americans in the UK, dual citizens and cross-border businesses: US expat tax, FBAR, FATCA, UK accounting and international tax advisory, from our London office.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const londonServices = services.filter((s) =>
  ['us-tax-returns', 'fbar-filing', 'self-assessment', 'streamlined-filing', 'us-uk-tax-treaty', 'cross-border-tax-planning']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'Do you have a London office?', a: `Yes. Our London office is at ${office.street}, ${office.locality} ${office.postalCode}. We work with clients across London and the wider UK, in person and remotely, and you can reach the London team on ${office.phone}.` },
  { q: 'Are you American tax accountants based in London?', a: 'We are a specialist US–UK cross-border firm with a London office, working with US tax for Americans in the UK alongside UK accounting and HMRC compliance. That dual capability — genuine US expertise and UK accounting under one roof — is what distinguishes us from a UK accountant who outsources the US side or a US preparer with no UK knowledge.' },
  { q: 'Can you help Americans living in London with US taxes?', a: 'Yes — this is core to what we do. We prepare US federal returns, FBAR and FATCA filings, Streamlined catch-up filings and treaty positions for Americans in London, coordinated with their UK Self Assessment so reliefs line up and they are not taxed twice.' },
  { q: 'Do I need to come to the London office in person?', a: 'No. Many London clients work with us entirely remotely through our secure document process, and others prefer to meet at the office. Both work — the quality of the advice is the same either way.' },
];

export default function LondonLocation() {
  return (
    <PageShell
      url={URL}
      eyebrow="Locations · London"
      title="US & UK tax services in London"
      answer={`Our London office provides specialist US–UK cross-border tax and accounting for Americans in the UK, dual citizens, and international businesses. From ${office.street}, ${office.locality} ${office.postalCode}, we handle US expat tax, FBAR and FATCA, UK accounting and HMRC compliance, and international tax advisory — both US and UK expertise under one roof. Reach the London team on ${office.phone}.`}
      crumbs={[
        { label: 'Locations', href: '/locations' },
        { label: 'London', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Speak to our London team"
      ctaIntro="Book a free consultation with US–UK specialists at our London office or remotely."
    >
      <JsonLd schema={localBusinessSchema('london')!} />

      <ProseBlock>
        <p>
          London is home to one of the largest communities of Americans, dual citizens and
          internationally-connected businesses in the world &mdash; and to a tax problem most accountants
          aren&rsquo;t built for. A US citizen in London files with both the IRS and HMRC; a UK business with
          US owners or operations sits across two systems at once. That intersection is our entire focus.
        </p>
        <p>
          <strong>From our London office, we provide genuine US and UK expertise under one roof.</strong> Not a
          UK accountant outsourcing the American side, nor a US preparer guessing at UK rules &mdash; one team
          that handles US expat tax, UK accounting, and the cross-border advisory that connects them, for
          clients across London and the wider UK.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="London office" title="Find us" />
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-mist bg-white p-8 text-center shadow-e1">
            <p className="font-display text-xl font-semibold text-ink">{office.label} office</p>
            <p className="mt-3 text-muted">
              {office.street}<br />
              {office.locality} {office.postalCode}<br />
              United Kingdom
            </p>
            <p className="mt-4 text-sm">
              <a href={`tel:${office.tel}`} className="font-semibold text-navy hover:text-gold">{office.phone}</a>
              <span className="mx-2 text-mist">·</span>
              <a href={`mailto:${office.email}`} className="font-semibold text-navy hover:text-gold">{office.email}</a>
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading eyebrow="What we handle in London" title="Services for London clients" />
          <div className="mt-10">
            <ServiceGrid services={londonServices} columns={3} />
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="We help London clients who are…"
        items={[
          'Americans living and working in London',
          'Dual US–UK citizens in the capital',
          'London businesses with US owners or operations',
          'High-net-worth individuals with cross-border wealth',
          'Founders and contractors trading on both sides',
          'Anyone in London who files with both the IRS and HMRC',
        ]}
      />

      <RelatedLinks
        title="Related areas"
        links={[
          { label: 'US citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'Built for Americans in Britain.' },
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'The full US side, handled.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Your UK compliance, coordinated.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'Treaty, pensions and structuring.' },
          { label: 'New York office', href: '/locations/new-york', description: 'Our US-side team.' },
        ]}
      />
    </PageShell>
  );
}
