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
  title: 'Tax Advisor in Manchester for US and UK Tax',
  description:
    'Looking for a tax advisor in Manchester who handles both US and UK tax? US UK Accountants prepares US expat returns, FBAR and FATCA, UK Self Assessment and cross-border advice for clients across Greater Manchester, by email.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const manchesterServices = services.filter((s) =>
  ['us-tax-returns', 'fbar-filing', 'self-assessment', 'streamlined-filing', 'us-uk-tax-treaty', 'cross-border-tax-planning']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'What does a tax advisor in Manchester do that a general accountant does not?', a: 'A general accountant handles UK returns. A cross-border tax advisor handles the UK return and the US return together, so the Foreign Tax Credit, the treaty and the account reporting line up and you are not taxed twice. If you or your business has any US connection, that second half is the part that matters.' },
  { q: 'Do you have a Manchester office?', a: `Yes. Our Manchester office is on ${office.street}, ${office.locality} ${office.postalCode}. Most Manchester clients work with us by email and through our secure portal, and you can reach the team on ${office.phone}.` },
  { q: 'Can you help Americans living in Manchester with US taxes?', a: 'Yes, this is core to what we do. We prepare US federal returns, FBAR and FATCA filings, Streamlined catch up filings and treaty positions for Americans across Greater Manchester, coordinated with their UK Self Assessment so reliefs line up.' },
  { q: 'Do you help Manchester businesses with US owners or US customers?', a: 'Yes. UK companies with US shareholders, US companies with staff or sales in the North West, and the owners themselves: Form 5471, GILTI, UK accounts and Corporation Tax, VAT and sales tax, and the structuring questions that connect them.' },
  { q: 'Why is the Manchester listing named "US UK Expats Tax Specialist"?', a: 'Our Manchester branch operates under the Google Business Profile name "US UK Expats Tax Specialist". It is the same firm, US UK Accountants Ltd, and the same specialist US and UK service; the local listing name reflects how North West clients most often search for cross-border expat tax help.' },
  { q: 'How do I get started?', a: 'Email us a few lines about your situation. We reply in writing with what applies to you and, where work is needed, a fixed fee quoted before anything starts. There is no need to visit the office.' },
];

export default function ManchesterLocation() {
  return (
    <PageShell
      url={URL}
      eyebrow="Locations · Manchester"
      title="Tax advisor in Manchester for US and UK tax"
      answer={`US UK Accountants is a Manchester tax advisor for people and businesses with a foot in both countries: Americans in the North West, dual citizens, Britons with US income, and companies with US owners or operations. From ${office.street}, ${office.locality} ${office.postalCode}, we prepare US expat returns, FBAR and FATCA reports, UK Self Assessment and company filings, and give the cross-border advice in between, all by email with a fixed fee agreed first.`}
      crumbs={[
        { label: 'Locations', href: '/locations' },
        { label: 'Manchester', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-08-11"
      dateModified="2026-10-27"
      faqs={faqs}
      ctaTitle="Email our Manchester team"
      ctaIntro="A few lines about your situation is enough. We reply in writing with what applies to you."
    >
      <JsonLd schema={localBusinessSchema('manchester')!} />

      <ProseBlock>
        <p>
          Most people searching for a tax advisor in Manchester need one of two things: a UK return done
          properly, or help with a US connection their current accountant cannot handle. We do both, in one
          firm. A US citizen in Didsbury or Altrincham files with the IRS and HMRC every year. A Manchester
          company with an American shareholder has Form 5471 and GILTI to think about on top of its UK
          accounts. A British consultant with US clients has withholding forms and treaty positions to get
          right. That intersection is our entire focus.
        </p>
        <p>
          <strong>What you get from us:</strong> US federal and state returns, UK Self Assessment, FBAR and
          Form 8938 reporting, Streamlined catch up filings for missed years, UK company accounts and
          Corporation Tax, and written cross-border advice on pensions, property, the US UK treaty and
          business structure. Every piece of work is quoted as a fixed fee in writing before it starts.
        </p>
        <p>
          Manchester is one of the UK&rsquo;s most internationally connected cities, with media at MediaCityUK,
          a fast growing technology sector, and universities drawing staff and researchers from the US. Many of
          the Americans here work remotely or in hybrid roles for employers on both sides of the Atlantic. Our
          secure document process is built for exactly that, so the whole engagement runs by email and you
          never need to come into the office unless you want to.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="Manchester office" title="Find us" />
          <div className="mx-auto mt-8 max-w-xl rounded-card border border-mist bg-white p-8 text-center shadow-e1">
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
              <a href={`tel:${office.tel}`} className="font-semibold text-navy hover:text-gold">{office.display ?? office.phone}</a>
              <span className="mx-2 text-mist">·</span>
              <a href={`mailto:${office.email}`} className="font-semibold text-navy hover:text-gold">{office.email.split('@')[0]}@<wbr />{office.email.split('@')[1]}</a>
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
          'Anyone in Greater Manchester who needs a tax advisor for both US and UK tax',
          'Americans living and working across Greater Manchester',
          'Dual US–UK citizens in the North West',
          'Manchester media, tech and digital businesses with US owners or operations',
          'Remote and hybrid workers employed on both sides of the Atlantic',
          'University staff, researchers and postgraduates from the US',
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
