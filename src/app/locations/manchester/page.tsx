import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { JsonLd } from '@/components/library/JsonLd';
import { localBusinessSchema } from '@/lib/schema';
import { authors } from '@/lib/authority-data';
import { services, OFFICES } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/locations/manchester';
const office = OFFICES.find((o) => o.id === 'manchester')!;

export const metadata: Metadata = {
  title: 'US & UK Tax Services in Manchester — American Tax Accountants',
  description:
    'Specialist US–UK tax services in Manchester for Americans in the North West, dual citizens and cross-border businesses: US expat tax, FBAR, FATCA, UK accounting and international tax advisory, from our Manchester office.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const manchesterServices = services.filter((s) =>
  ['us-tax-returns', 'fbar-filing', 'self-assessment', 'streamlined-filing', 'us-uk-tax-treaty', 'cross-border-tax-planning']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'Do you have a Manchester office?', a: `Yes. Our Manchester office is on ${office.street}, ${office.locality} ${office.postalCode}. We work with clients across Greater Manchester and the wider North West, in person and remotely, and you can reach the team on ${office.phone}.` },
  { q: 'Why is the Manchester listing named "US UK Expats Tax Specialist"?', a: 'Our Manchester branch operates under the Google Business Profile name "US UK Expats Tax Specialist". It is the same firm — US UK Accountants Ltd — and the same specialist US–UK service; the local listing name simply reflects how North West clients most often search for cross-border expat tax help.' },
  { q: 'Can you help Americans living in Manchester with US taxes?', a: 'Yes — this is core to what we do. We prepare US federal returns, FBAR and FATCA filings, Streamlined catch-up filings and treaty positions for Americans across Greater Manchester, coordinated with their UK Self Assessment so reliefs line up and they are not taxed twice.' },
  { q: 'Do I need to come to the Manchester office in person?', a: 'No. Many North West clients work with us entirely remotely through our secure document process, which suits Manchester\u2019s large population of remote and hybrid workers. Others prefer to meet in the city centre — both work, and the advice is the same either way.' },
];

export default function ManchesterLocation() {
  return (
    <PageShell
      url={URL}
      eyebrow="Locations · Manchester"
      title="US & UK tax services in Manchester"
      answer={`Our Manchester office provides specialist US–UK cross-border tax and accounting for Americans in the North West, dual citizens, and international businesses. From ${office.street}, ${office.locality} ${office.postalCode}, we handle US expat tax, FBAR and FATCA, UK accounting and HMRC compliance, and international tax advisory — both US and UK expertise under one roof. Reach the Manchester team on ${office.phone}.`}
      crumbs={[
        { label: 'Locations', href: '/locations' },
        { label: 'Manchester', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-08-11"
      faqs={faqs}
      ctaTitle="Speak to our Manchester team"
      ctaIntro="Book a consultation with US–UK specialists at our Manchester office or remotely."
    >
      <JsonLd schema={localBusinessSchema('manchester')!} />

      <ProseBlock>
        <p>
          Manchester has become one of the UK&rsquo;s most internationally-connected cities &mdash; a hub for
          media at MediaCityUK, a fast-growing technology and digital sector, and a student and research
          population drawn from the University of Manchester, Manchester Metropolitan and Salford. With that
          global pull comes a tax problem most accountants aren&rsquo;t built for: a US citizen in the North West
          files with both the IRS and HMRC, and a Manchester business with US owners or operations sits across
          two systems at once. That intersection is our entire focus.
        </p>
        <p>
          <strong>From our Manchester office, we provide genuine US and UK expertise under one roof.</strong> Not a
          UK accountant outsourcing the American side, nor a US preparer guessing at UK rules &mdash; one team
          that handles US expat tax, UK accounting, and the cross-border advisory that connects them, for
          Americans, dual citizens and businesses across Greater Manchester and the wider North West.
        </p>
        <p>
          Much of the North West&rsquo;s American community works remotely or in hybrid roles for employers on
          both sides of the Atlantic. Our secure, fully remote document process is built for exactly that &mdash;
          so whether you prefer to meet in the city centre or handle everything online, the service and the
          quality of advice are identical.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="Manchester office" title="Find us" />
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-mist bg-white p-8 text-center shadow-e1">
            <p className="font-display text-xl font-semibold text-ink">{office.label} office</p>
            {office.gbpName && (
              <p className="mt-1 text-sm text-muted">{office.gbpName}</p>
            )}
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
          <SectionHeading eyebrow="What we handle in Manchester" title="Services for Manchester clients" />
          <div className="mt-10">
            <ServiceGrid services={manchesterServices} columns={3} />
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="We help Manchester clients who are…"
        items={[
          'Americans living and working across Greater Manchester',
          'Dual US–UK citizens in the North West',
          'Manchester media, tech and digital businesses with US owners or operations',
          'Remote and hybrid workers employed on both sides of the Atlantic',
          'University staff, researchers and postgraduates from the US',
          'Anyone in the North West who files with both the IRS and HMRC',
        ]}
      />

      <RelatedLinks
        title="Related areas"
        links={[
          { label: 'US citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'Built for Americans in Britain.' },
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'The full US side, handled.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Your UK compliance, coordinated.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'Treaty, pensions and structuring.' },
          { label: 'London office', href: '/locations/london', description: 'Our other UK team.' },
          { label: 'New York office', href: '/locations/new-york', description: 'Our US-side team.' },
        ]}
      />
    </PageShell>
  );
}
