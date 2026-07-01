import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { JsonLd } from '@/components/library/JsonLd';
import { localBusinessSchema } from '@/lib/schema';
import { authors } from '@/lib/authority-data';
import { services, OFFICES } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/locations/new-york';
const office = OFFICES.find((o) => o.id === 'new-york')!;

export const metadata: Metadata = {
  title: 'US–UK Tax Services New York — Cross-Border Tax Accountants',
  description:
    'Specialist US–UK cross-border tax services from our New York office: US tax for Britons in the US, UK tax and accounting for UK-connected clients, and international tax advisory across both systems.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const nyServices = services.filter((s) =>
  ['us-tax-returns', 'self-assessment', 'us-uk-tax-treaty', 'cross-border-tax-planning', 'business-structuring', 'fbar-filing']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'Where is your New York office?', a: `Our New York-area office is at ${office.street}, ${office.locality}, ${office.region} ${office.postalCode}. We work with clients across the New York metro area and the wider US, in person and remotely, and you can reach the team on ${office.phone}.` },
  { q: 'Can you help UK citizens living in the US?', a: 'Yes. We help Britons and other UK-connected people in the US with their US filing obligations while keeping their UK position — Self Assessment, UK property, pensions and any remaining UK ties — properly handled. Coordinating both sides is exactly what we do.' },
  { q: 'Do you handle UK tax from the US side?', a: 'We do. Having genuine UK accounting capability alongside US expertise means a client in New York with UK income, property or a UK company gets both returns handled by one firm, rather than juggling advisors on two continents.' },
  { q: 'Can we work together remotely?', a: 'Yes — most of our US clients work with us remotely through a secure document process, wherever they are in the country. The New York office is there for those who prefer to meet in person.' },
];

export default function NewYorkLocation() {
  return (
    <PageShell
      url={URL}
      eyebrow="Locations · New York"
      title="US–UK tax services in New York"
      answer={`Our New York-area office provides specialist US–UK cross-border tax and accounting for Britons in the US, dual citizens, and UK-connected businesses. From ${office.locality}, ${office.region}, we handle US tax, UK accounting and HMRC compliance, and international tax advisory — both sides under one firm. Reach the team on ${office.phone}.`}
      crumbs={[
        { label: 'Locations', href: '/locations' },
        { label: 'New York', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Speak to our New York team"
      ctaIntro="Book a consultation with US–UK specialists at our New York office or remotely."
    >
      <JsonLd schema={localBusinessSchema('new-york')!} />

      <ProseBlock>
        <p>
          For UK citizens in the US, dual nationals, and businesses with ties on both sides of the Atlantic, the
          New York area is one of the densest concentrations of cross-border tax need anywhere. A Briton in New
          York still has UK touchpoints &mdash; property, pensions, perhaps a company &mdash; while now filing
          with the IRS. The two systems rarely align on their own.
        </p>
        <p>
          <strong>Our New York office brings both sides together.</strong> Genuine US tax expertise and real UK
          accounting capability in one firm, so clients don&rsquo;t have to coordinate an American accountant and
          a British one who never speak. We handle the US filing, the UK position, and the advisory that joins
          them.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="New York office" title="Find us" />
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-mist bg-white p-8 text-center shadow-e1">
            <p className="font-display text-xl font-semibold text-ink">{office.label} office</p>
            <p className="mt-3 text-muted">
              {office.street}<br />
              {office.locality}, {office.region} {office.postalCode}<br />
              United States
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
          <SectionHeading eyebrow="What we handle from New York" title="Services for US-side clients" />
          <div className="mt-10">
            <ServiceGrid services={nyServices} columns={3} />
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="We help New York clients who are…"
        items={[
          'UK citizens living in the New York area',
          'Dual US–UK citizens in the US',
          'Britons with UK property, pensions or companies',
          'US businesses expanding into the UK',
          'Founders and investors operating across both countries',
          'Anyone in the US with ongoing UK tax obligations',
        ]}
      />

      <RelatedLinks
        title="Related areas"
        links={[
          { label: 'UK citizens in the US', href: '/who-we-help/uk-citizens-in-us', description: 'Built for Britons stateside.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Your UK side, handled from the US.' },
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'US filing for dual filers.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'Treaty, pensions and structuring.' },
          { label: 'London office', href: '/locations/london', description: 'Our UK-side team.' },
        ]}
      />
    </PageShell>
  );
}
