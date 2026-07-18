import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, ProcessSteps, InvestmentBand, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/us-uk-tax-services';

export const metadata: Metadata = {
  title: 'US & UK Tax Services — Specialist Cross-Border Tax Advisors',
  description:
    'Specialist US & UK tax services under one roof: US expat tax, UK accounting, cross-border tax planning and international tax advisory for Americans in the UK, Britons in the US, dual citizens and international businesses.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const coreServices = services.filter((s) =>
  ['us-tax-returns', 'fbar-filing', 'self-assessment', 'corporation-tax', 'us-uk-tax-treaty', 'cross-border-tax-planning']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'What are US & UK tax services?', a: 'They are the combined tax and accounting services needed by people and businesses who fall under both the US and UK tax systems at once — US federal and state returns, FBAR and FATCA reporting, UK Self Assessment and company accounts, and the cross-border planning that coordinates the two. The defining feature is that both jurisdictions are handled together, by one firm, rather than by separate US and UK accountants working in isolation.' },
  { q: 'Who needs specialist US–UK tax services?', a: 'Americans living in the UK, British citizens in the US, dual citizens, green card holders, and businesses operating across both countries. Anyone who files — or should be filing — with both the IRS and HMRC benefits from having the two sides coordinated, because that is where double taxation is avoided and reliefs are claimed in the right order.' },
  { q: 'What makes you specialist rather than a general accountant?', a: 'A general UK accountant handles HMRC but typically outsources or avoids the US side; a US preparer rarely understands UK rules. Our entire focus is the intersection — genuine US expertise and real UK accounting capability in one firm — so the two returns are prepared together and actually agree.' },
  { q: 'How does pricing work?', a: 'We offer a £300 consultation, then a paid strategy session for detailed planning that is credited to any work that follows. Service pricing is bespoke and based on complexity, with a fixed-scope quote provided before any work begins — so you always know the cost in advance.' },
  { q: 'Do you only work with people near your offices?', a: 'No. We have offices in London and the New York area, but most clients work with us remotely through a secure process, wherever they are in the UK, the US or internationally.' },
];

export default function UsUkTaxServices() {
  return (
    <PageShell
      url={URL}
      eyebrow="US & UK Tax Services"
      title="Specialist US & UK tax services"
      answer="US & UK tax services cover everything required by people and businesses caught between both tax systems: US expat tax, FBAR and FATCA, UK accounting and Self Assessment, cross-border tax planning and international tax advisory. The defining feature is that both jurisdictions are handled together by one firm. We are a specialist US–UK practice — genuine US and UK expertise under one roof — for Americans in the UK, Britons in the US, dual citizens and international businesses."
      crumbs={[
        { label: 'US & UK Tax Services', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      service={{
        url: URL,
        name: 'US & UK Tax Services',
        description: 'Specialist US and UK cross-border tax and accounting: US expat tax, UK accounting, cross-border tax planning and international tax advisory under one roof.',
        serviceType: 'Tax Services',
      }}
      ctaTitle="Get both sides handled by one firm"
      ctaIntro="Book a consultation with specialist US–UK tax advisors."
    >
      <ProseBlock>
        <p>
          When you fall under two tax systems, the hardest part isn&rsquo;t either return on its own &mdash;
          it&rsquo;s making them work together. A US accountant who doesn&rsquo;t know UK rules and a UK
          accountant who avoids the IRS will each do their half, but nobody owns the join, and that is exactly
          where double taxation and missed reliefs happen.
        </p>
        <p>
          <strong>Specialist US&ndash;UK tax services exist to own that join.</strong> We bring genuine US tax
          expertise and real UK accounting capability into one firm, so your US filing, your UK compliance and
          the cross-border planning between them are handled as a single, coordinated piece of work &mdash;
          whether you are an individual, a family, or a business operating across both countries.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="What's included" title="Our US & UK tax services" />
          <div className="mt-10">
            <ServiceGrid services={coreServices} columns={3} />
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Our US & UK tax services are for…"
        items={[
          'Americans living and working in the UK',
          'British citizens and dual nationals in the US',
          'Green card holders with UK ties',
          'International businesses operating across both countries',
          'Entrepreneurs, founders and high-net-worth individuals',
          'Anyone filing with both the IRS and HMRC',
        ]}
      />

      <ProcessSteps
        steps={[
          { title: 'Book a consultation', description: 'We review your full US and UK position and what you need.' },
          { title: 'Fixed-scope quote', description: 'A clear, complexity-based proposal before any work begins.' },
          { title: 'Coordinated work', description: 'Both returns prepared together by US and UK specialists.' },
          { title: 'Aligned filing', description: 'Filed so reliefs and credits line up and nothing is taxed twice.' },
        ]}
      />

      <InvestmentBand
        fromLabel="Bespoke, complexity-based pricing"
        points={[
          '£300 30-minute consultation',
          'Fixed-scope quote before any work begins',
          'US and UK sides coordinated by specialists',
          'Offices in London and New York, plus remote service worldwide',
        ]}
      />

      <RelatedLinks
        title="Explore our services"
        links={[
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'The full US side for Americans abroad.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Self Assessment, company accounts and more.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'Treaty, pensions and structuring.' },
          { label: 'Pricing', href: '/pricing', description: 'What cross-border tax work typically costs.' },
          { label: 'Who We Help', href: '/who-we-help', description: 'Find your situation.' },
          { label: 'Our offices', href: '/locations', description: 'London and New York.' },
        ]}
      />
    </PageShell>
  );
}
