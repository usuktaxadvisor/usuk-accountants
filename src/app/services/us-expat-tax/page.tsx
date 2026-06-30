import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, ProcessSteps, InvestmentBand, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax';

export const metadata: Metadata = {
  title: 'US Expat Tax Services for Americans in the UK & Abroad',
  description:
    'Specialist US tax for Americans abroad: federal returns, FBAR, FATCA, Streamlined Filing, FEIE and Foreign Tax Credit — coordinated with your UK position so you never pay twice.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const usServices = services.filter((s) =>
  ['us-tax-returns', 'fbar-filing', 'fatca', 'streamlined-filing', 'feie', 'foreign-tax-credit', 'us-uk-tax-treaty']
    .some((k) => s.href?.includes(k)),
);

const faqs = [
  {
    q: 'Do Americans living in the UK still have to file US taxes?',
    a: 'Yes. The US taxes its citizens on worldwide income regardless of where they live, so Americans in the UK must file a US federal return every year — even if they owe nothing after reliefs like the Foreign Earned Income Exclusion or Foreign Tax Credit. Many also have to file an FBAR.',
  },
  {
    q: 'What is the difference between FBAR and FATCA?',
    a: 'FBAR (FinCEN Form 114) reports foreign bank accounts when their combined value tops $10,000 at any point in the year. FATCA (Form 8938) reports foreign financial assets above higher thresholds and is filed with your tax return. Many expats must file both.',
  },
  {
    q: 'Will I be taxed twice on the same income?',
    a: 'Usually not, if it is handled correctly. The Foreign Tax Credit, the Foreign Earned Income Exclusion and the US–UK tax treaty exist to prevent double taxation. The key is claiming the right relief in the right order — which is exactly what coordinated US–UK advice ensures.',
  },
  {
    q: "I haven't filed US taxes in years. What can I do?",
    a: 'If your failure to file was non-willful, the IRS Streamlined Filing Compliance Procedures let you catch up — typically three years of returns and six years of FBARs — without penalties. We handle Streamlined cases regularly and can bring you back into compliance.',
  },
];

export default function UsExpatTaxPillar() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax"
      title="US tax for Americans in the UK and abroad"
      answer="US citizens and green card holders must file a US federal tax return on worldwide income wherever they live, and often an FBAR for foreign accounts over $10,000. Reliefs like the FEIE, Foreign Tax Credit and the US–UK treaty prevent double taxation — when claimed correctly. We handle it all, coordinated with your UK filings."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-20"
      faqs={faqs}
      service={{
        url: URL,
        name: 'US Expat Tax Services',
        description: 'US federal tax returns, FBAR, FATCA, Streamlined Filing, FEIE and Foreign Tax Credit for Americans abroad.',
        serviceType: 'Tax Preparation',
      }}
      ctaTitle="Bring your US taxes into order"
      ctaIntro="Book a free consultation with a US tax specialist who also understands your UK position."
    >
      <ProseBlock>
        <p>
          Being American doesn&rsquo;t stop at the border. The US taxes its citizens on their worldwide income, so
          whether you moved to London last year or have lived in the UK for a decade, you still have annual US
          filing obligations — returns, and often foreign-account reporting on top.
        </p>
        <p>
          <strong>We specialise in getting this right for people who live between two systems.</strong> That means
          claiming the correct reliefs, filing FBAR and FATCA where required, and coordinating with your UK
          Self Assessment so the two returns agree and you don&rsquo;t pay tax twice on the same pound or dollar.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="What we handle" title="Complete US expat tax support" />
          <div className="mt-10">
            <ServiceGrid services={usServices} columns={3} />
          </div>
        </Container>
      </Section>

      <WhoItsFor
        items={[
          'Americans living and working in the UK',
          'Green card holders outside the US',
          'Dual US–UK citizens',
          'US citizens who have fallen behind on filing',
          'Self-employed Americans abroad',
          'US business owners with foreign companies',
        ]}
      />

      <ProcessSteps
        steps={[
          { title: 'Free consultation', description: 'We review your situation, filing history and any catch-up needs.' },
          { title: 'Fixed-scope quote', description: 'A clear proposal priced to your complexity before any work starts.' },
          { title: 'We prepare & review', description: 'Returns, FBAR and FATCA prepared by a US specialist and reviewed for accuracy.' },
          { title: 'Coordinated filing', description: 'Filed and aligned with your UK position so reliefs and credits line up.' },
        ]}
      />

      <InvestmentBand
        fromLabel="Bespoke, complexity-based pricing"
        points={[
          'Free 15–20 minute initial consultation',
          'Fixed-scope quote before any work begins',
          'US filing coordinated with your UK return',
          'Specialist preparation and independent review',
        ]}
        note="Streamlined catch-up filing is quoted as a fixed package after your free consultation."
      />

      <RelatedLinks
        title="Explore related areas"
        links={[
          { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing', description: 'Behind on filing? Catch up penalty-free.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Your UK Self Assessment and company accounts, coordinated.' },
          { label: 'US–UK tax treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'Treaty positions, pensions and double-tax relief.' },
          { label: 'Americans in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'Built for US citizens living in the UK.' },
        ]}
      />
    </PageShell>
  );
}
