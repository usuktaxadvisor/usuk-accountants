import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, ProcessSteps, InvestmentBand, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting';

export const metadata: Metadata = {
  title: 'UK Accounting Services for Internationally-Connected Individuals & Businesses',
  description:
    'Specialist UK accounting — company accounts, Corporation Tax, VAT, payroll and Self Assessment — for businesses and individuals with US and cross-border connections. Coordinated with your US tax position.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const ukServices = services.filter((s) =>
  ['self-assessment', 'company-accounts', 'corporation-tax', 'vat-returns', 'payroll', 'bookkeeping']
    .some((k) => s.href?.includes(k)),
);

const faqs = [
  {
    q: 'Do I need a UK accountant if I already have a US tax preparer?',
    a: 'Usually yes. A US preparer files your US return but cannot file your UK Self Assessment, company accounts or VAT, or advise on HMRC obligations. Cross-border clients need both sides handled and coordinated so reliefs line up and nothing is double-counted.',
  },
  {
    q: 'What UK accounting services do you provide?',
    a: 'Company accounts and Corporation Tax for limited companies, VAT registration and returns, payroll and PAYE, bookkeeping, and Self Assessment for individuals, directors, landlords and the self-employed — all handled with your US position in mind where relevant.',
  },
  {
    q: 'Can you coordinate my UK accounts with my US tax return?',
    a: 'Yes — that coordination is the core of what we do. We make sure UK and US filings are consistent, foreign tax credits and treaty positions are claimed correctly, and you are not taxed twice on the same income.',
  },
  {
    q: 'How much do UK accounting services cost?',
    a: 'Fees are based on the complexity of your situation rather than a fixed template. After a £300 consultation we provide a clear, fixed-scope quote so you know exactly what you are paying before any work begins.',
  },
];

export default function UkAccountingPillar() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting"
      title="UK accounting for internationally-connected individuals and businesses"
      answer="UK accounting covers your Self Assessment, company accounts, Corporation Tax, VAT and payroll obligations to HMRC. For people and businesses with US connections, these need handling alongside your US filings so reliefs align and income is never taxed twice. We do both, under one roof."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-20"
      faqs={faqs}
      service={{
        url: URL,
        name: 'UK Accounting Services',
        description: 'UK company accounts, Corporation Tax, VAT, payroll and Self Assessment for internationally-connected clients.',
        serviceType: 'Accounting',
      }}
      ctaTitle="Get your UK accounting handled properly"
      ctaIntro="Book a consultation with a specialist who understands both UK accounting and your US obligations."
    >
      <ProseBlock>
        <p>
          Most accountants handle UK compliance in isolation. But if you are a US citizen running a UK company,
          a dual citizen with rental income on both sides, or a business trading across the Atlantic, your UK
          accounts and your US tax return are connected — decisions on one side change the outcome on the other.
        </p>
        <p>
          <strong>We handle the UK side properly and coordinate it with your US position</strong>, so you stay
          compliant with HMRC and the IRS at once, claim the reliefs you are entitled to, and avoid the
          double-counting that catches people who use two disconnected advisers.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="What we handle" title="Full-service UK accounting" />
          <div className="mt-10">
            <ServiceGrid services={ukServices} columns={3} />
          </div>
        </Container>
      </Section>

      <WhoItsFor
        items={[
          'US citizens running a UK limited company',
          'Dual citizens with UK and US income or property',
          'UK businesses with US owners, customers or operations',
          'Self-employed professionals and contractors in the UK',
          'Landlords with cross-border tax exposure',
          'Directors needing Self Assessment and planning',
        ]}
      />

      <ProcessSteps
        steps={[
          { title: 'Book a consultation', description: 'A short call to understand your UK and US position and what you need.' },
          { title: 'Fixed-scope quote', description: 'A clear proposal priced to your complexity — no surprises.' },
          { title: 'We do the work', description: 'Accounts, returns and filings prepared, reviewed and coordinated across both jurisdictions.' },
          { title: 'Ongoing partnership', description: 'Proactive planning and support through every deadline, both sides of the Atlantic.' },
        ]}
      />

      <InvestmentBand
        fromLabel="Bespoke, complexity-based pricing"
        points={[
          '£300 30-minute consultation',
          'Fixed-scope quote before any work begins',
          'Coordinated UK + US handling',
          'Premium advisory, not budget compliance',
        ]}
        note="Most clients start with a £300 30-minute consultation, then a fixed quote based on their situation. Quick questions are answered free by email."
      />

      <RelatedLinks
        title="Explore related areas"
        links={[
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'Your US filing obligations, handled alongside your UK accounts.' },
          { label: 'US–UK tax treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'Treaty, pensions and structuring across both systems.' },
          { label: 'Startup accounting', href: '/services/uk-accounting/startup-accounting', description: 'For founders and directors trading across borders.' },
          { label: 'Dual citizens', href: '/who-we-help/dual-citizens', description: 'For those filing in both the UK and the US.' },
        ]}
      />
    </PageShell>
  );
}
