import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting/company-accounts';

export const metadata: Metadata = {
  title: 'Company Accounts for UK Limited Companies — Year-End Accounts & Filing',
  description:
    'UK limited companies must file annual statutory accounts with Companies House and a Company Tax Return with HMRC. Learn what is involved, the deadlines, common mistakes, and how we handle it — including for US-owned UK companies.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const faqs = [
  {
    q: 'What are statutory company accounts?',
    a: 'Statutory company accounts (also called annual accounts or year-end accounts) are the formal financial statements a UK limited company must prepare each year. They are filed with Companies House, and the figures also support the Company Tax Return (CT600) filed with HMRC. They typically include a balance sheet, and depending on company size, a profit and loss account and notes.',
  },
  {
    q: 'Do I have to file accounts even if my company is dormant or made no profit?',
    a: 'Yes. Every UK limited company on the register must file annual accounts with Companies House, even if it is dormant or made no profit. Dormant companies can usually file simpler dormant accounts, but the filing obligation itself does not go away. Missing it leads to automatic penalties.',
  },
  {
    q: 'What is the difference between Companies House accounts and the HMRC tax return?',
    a: 'They are two separate filings. The annual accounts go to Companies House and are placed on the public register. The Company Tax Return (CT600), together with accounts in a specific format, goes to HMRC to calculate Corporation Tax. Most companies must do both each year, and the two have different deadlines.',
  },
  {
    q: 'When are company accounts due?',
    a: 'The deadlines run from your company\u2019s accounting year-end. Accounts are normally due at Companies House within nine months of the year-end for a private company, and the Company Tax Return is normally due to HMRC within twelve months of the year-end — though any Corporation Tax owed is payable earlier. We confirm your exact dates and keep you ahead of them.',
  },
  {
    q: 'I am a US citizen who owns a UK limited company — is there anything extra?',
    a: 'Yes, potentially a great deal. Alongside UK statutory accounts, a US owner of a UK company may have to file IRS Form 5471 and consider rules such as GILTI. The UK and US obligations are separate but interact, and handling them together — as we do — avoids both UK penalties and severe US ones.',
  },
  {
    q: 'Can you prepare small or micro-entity accounts?',
    a: 'Yes. Smaller companies may qualify to file simpler accounts under the small-company or micro-entity regimes, reducing what is placed on the public record. We assess whether you qualify and prepare the appropriate format, while still giving you the full management picture for your own use.',
  },
];

export default function CompanyAccounts() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting · Company Accounts"
      title="Company accounts for UK limited companies"
      answer="UK limited companies must prepare annual statutory accounts each year, file them with Companies House, and file a Company Tax Return (CT600) with HMRC. The accounts are due at Companies House normally within nine months of your year-end, and the tax return within twelve months. Every company must file — even dormant or loss-making ones — and missing the Companies House deadline brings automatic penalties. For US-owned UK companies, these filings sit alongside US obligations such as Form 5471."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
        { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-26"
      faqs={faqs}
      service={{
        url: URL,
        name: 'UK Company Accounts Preparation',
        description: 'Preparation and filing of annual statutory accounts with Companies House and the Company Tax Return with HMRC for UK limited companies, including US-owned companies.',
        serviceType: 'Accounting',
      }}
      ctaTitle="Need your company accounts prepared and filed?"
      ctaIntro="Whether you run a UK company or own one as a US person, book a free consultation and we'll make sure your accounts are accurate, on time, and coordinated across both tax systems."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                Every UK limited company has to prepare <strong>annual statutory accounts</strong> — the formal
                year-end financial statements that record how the company performed. These accounts do two jobs:
                they are filed with <strong>Companies House</strong> for the public register, and they underpin the{' '}
                <strong>Company Tax Return (CT600)</strong> filed with <strong>HMRC</strong> to work out Corporation
                Tax.
              </p>
              <p>
                The point that trips people up is that these are <strong>two separate filings</strong>, to two
                different bodies, with two different deadlines. Filing one does not satisfy the other. Most companies
                must do both, every year — and the Companies House deadline in particular carries an{' '}
                <strong>automatic penalty</strong> if missed, with no need for HMRC to chase you first.
              </p>
              <p>
                The obligation applies even if your company is <strong>dormant or made no profit</strong>. A company
                that exists on the register must account for itself. Smaller companies may qualify to file simpler{' '}
                <strong>small-company or micro-entity accounts</strong>, which we handle where they apply.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Company accounts at a glance"
                facts={[
                  { label: 'Filed with', value: 'Companies House + HMRC' },
                  { label: 'Tax return', value: 'CT600' },
                  { label: 'Companies House', value: '~9 months after year-end' },
                  { label: 'Tax return', value: '~12 months after year-end' },
                  { label: 'Dormant companies', value: 'Still must file' },
                  { label: 'Smaller companies', value: 'Simpler accounts possible' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who needs company accounts"
        items={[
          'Directors of UK limited companies of any size',
          'Contractors and freelancers operating through a limited company',
          'SMEs and owner-managed businesses',
          'US citizens and green card holders who own a UK company',
          'Startups that have recently incorporated',
          'Dormant companies that still sit on the register',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">The two filings explained</h2>
            <p>
              <strong>Companies House accounts.</strong> These go on the public register. Depending on your
              company&rsquo;s size, they range from full accounts to abridged or micro-entity formats — the smaller
              the company, the less detail that has to be made public.
            </p>
            <p>
              <strong>HMRC Company Tax Return (CT600).</strong> This calculates the Corporation Tax your company
              owes, supported by accounts in HMRC&rsquo;s required format. It is a different submission from the
              Companies House filing, with its own deadline — and any tax due is payable on its own timetable, which
              for most companies falls <em>before</em> the return itself is due.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Deadlines and penalties</h2>
            <p>
              For a private company, accounts are normally due at Companies House within <strong>nine months</strong>
              {' '}of the accounting year-end, and the tax return within <strong>twelve months</strong>. Companies
              House penalties for late accounts are <strong>automatic and escalate</strong> the longer you are late,
              so the single most valuable thing an accountant does here is simply keep you comfortably ahead of the
              dates.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: <strong>missing the Companies House deadline</strong> and triggering an automatic
              penalty; assuming the <strong>tax return and the accounts are the same filing</strong>; forgetting that{' '}
              <strong>dormant companies still file</strong>; leaving Corporation Tax payment to the return deadline
              when it is actually due earlier; and — for US owners — handling the UK side well while{' '}
              <strong>overlooking the US filings</strong> that run alongside it.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">For US owners of UK companies</h2>
            <p>
              This is where being a US–UK firm matters. If you are a US person who owns a UK limited company, your UK
              statutory accounts are only half the picture — you may also need{' '}
              <Link href="/services/us-expat-tax/form-5471" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Form 5471</Link>{' '}
              and to consider GILTI on the US side. We prepare both together, so the two systems line up and nothing
              falls through the gap between them.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="Accounts prepared, filed, and coordinated"
        steps={[
          { title: 'Gather & reconcile', description: 'We pull together your records and reconcile the year, flagging anything that needs attention.' },
          { title: 'Prepare accounts', description: 'We prepare statutory accounts in the right format for your company size — full, small or micro-entity.' },
          { title: 'File both sides', description: 'We file with Companies House and prepare the CT600 for HMRC, keeping the two consistent.' },
          { title: 'Coordinate cross-border', description: 'For US owners, we align the UK accounts with US filings such as Form 5471 so both systems agree.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax', description: 'The tax your CT600 calculates' },
          { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping', description: 'Clean records make accounts simple' },
          { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns', description: 'If your company is VAT registered' },
          { label: 'Startup Accounting', href: '/services/uk-accounting/startup-accounting', description: 'Just incorporated? Start here' },
          { label: 'Form 5471 (US owners)', href: '/services/us-expat-tax/form-5471', description: 'US reporting for your UK company' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen guidance' },
        ]}
      />
    </PageShell>
  );
}
