import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting/vat-returns';

export const metadata: Metadata = {
  title: 'VAT Returns & VAT Registration — UK VAT for Businesses',
  description:
    'UK businesses over the VAT threshold must register, charge VAT, and file VAT returns under Making Tax Digital. Learn when to register, how returns work, common mistakes, and how we handle VAT — including cross-border issues.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const faqs = [
  {
    q: 'When do I have to register for VAT?',
    a: 'You must register for VAT once your VAT-taxable turnover exceeds the current registration threshold over a rolling twelve-month period, or if you expect to exceed it within the next thirty days. The threshold is set by HMRC and can change, so it is worth tracking your turnover rather than assuming. You can also register voluntarily below the threshold if it benefits you.',
  },
  {
    q: 'How often do I file VAT returns?',
    a: 'Most VAT-registered businesses file a VAT return every quarter, showing the VAT charged on sales and the VAT reclaimable on purchases, with the difference paid to or refunded by HMRC. Returns must be filed digitally under Making Tax Digital, using compatible software.',
  },
  {
    q: 'What is Making Tax Digital for VAT?',
    a: 'Making Tax Digital (MTD) is HMRC\u2019s requirement that VAT-registered businesses keep digital records and submit VAT returns through MTD-compatible software rather than manually. It applies to VAT-registered businesses, and using the right software setup is part of staying compliant.',
  },
  {
    q: 'Should I register for VAT voluntarily?',
    a: 'Sometimes it helps. If you sell mainly to other VAT-registered businesses, voluntary registration lets you reclaim VAT on your own costs while your customers reclaim the VAT you charge them. If you sell to the public, it may simply add cost. It is a decision worth modelling for your specific business.',
  },
  {
    q: 'Which VAT scheme is right for my business?',
    a: 'There are several — standard VAT accounting, the Flat Rate Scheme, cash accounting and annual accounting among them — each suiting different business types and cash-flow patterns. The right choice depends on your margins, customers and admin capacity. We assess which scheme leaves you better off.',
  },
  {
    q: 'Do I charge VAT on sales to US or overseas customers?',
    a: 'Often the treatment differs for overseas sales — the place-of-supply rules determine whether UK VAT applies, and many exports of goods or services to customers outside the UK are zero-rated or outside the scope of UK VAT. The rules are detailed and depend on what you sell and to whom, so cross-border sales are worth reviewing carefully.',
  },
];

export default function VatReturns() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting · VAT"
      title="VAT returns and VAT registration"
      answer="UK businesses must register for VAT once their VAT-taxable turnover exceeds the current HMRC threshold over a rolling twelve months (or is expected to within thirty days). Registered businesses charge VAT, reclaim VAT on costs, and file VAT returns — usually quarterly — digitally under Making Tax Digital. The threshold and standard rate are set by HMRC and can change. Choosing the right VAT scheme, and handling cross-border sales correctly, can make a real difference to what you pay."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
        { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-26"
      faqs={faqs}
      service={{
        url: URL,
        name: 'UK VAT Returns & Registration',
        description: 'VAT registration, scheme selection, and preparation and filing of VAT returns under Making Tax Digital for UK businesses, including cross-border sales.',
        serviceType: 'Tax Preparation',
      }}
      ctaTitle="VAT registered, or about to cross the threshold?"
      ctaIntro="From choosing the right scheme to filing under Making Tax Digital, book a free consultation and we'll keep your VAT accurate, efficient and on time."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                <strong>VAT</strong> is the tax businesses charge on most goods and services. Once your{' '}
                <strong>VAT-taxable turnover</strong> passes the <strong>current registration threshold</strong> —
                measured over a rolling twelve months — you must register with HMRC, start charging VAT, and file{' '}
                <strong>VAT returns</strong>. You can also register voluntarily below the threshold where it works in
                your favour.
              </p>
              <p>
                Registered businesses normally file <strong>quarterly</strong>, reporting the VAT charged on sales
                against the VAT reclaimable on purchases, and paying HMRC the difference (or receiving a refund). All
                of this must now be done digitally under <strong>Making Tax Digital</strong>, using compatible
                software — manual returns are no longer permitted.
              </p>
              <p>
                VAT is also where the right <strong>scheme</strong> and correct <strong>cross-border treatment</strong>
                {' '}genuinely change the numbers. The threshold and standard rate are set by HMRC and can change at
                Budgets, so both registration timing and scheme choice are worth reviewing rather than assuming.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="VAT at a glance"
                facts={[
                  { label: 'Register when', value: 'Turnover over current threshold' },
                  { label: 'Threshold & rate', value: 'Set by HMRC; can change' },
                  { label: 'Returns', value: 'Usually quarterly' },
                  { label: 'Filing', value: 'Digital, via Making Tax Digital' },
                  { label: 'Voluntary', value: 'Possible below threshold' },
                  { label: 'Schemes', value: 'Standard, Flat Rate, cash & more' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who needs to think about VAT"
        items={[
          'Businesses approaching or over the VAT registration threshold',
          'Limited companies and sole traders alike',
          'Businesses selling mainly to other VAT-registered businesses',
          'Companies selling goods or services to overseas customers',
          'Contractors and consultants weighing voluntary registration',
          'Anyone unsure which VAT scheme suits them',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Registration and Making Tax Digital</h2>
            <p>
              Registration is triggered by turnover, not profit, on a <strong>rolling twelve-month</strong> basis —
              which means it can creep up on a growing business mid-year. Once registered, you keep{' '}
              <strong>digital records</strong> and file through <strong>MTD-compatible software</strong>. Getting the
              software and process right from the start saves a great deal of correction later.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Choosing the right scheme</h2>
            <p>
              The <strong>standard</strong> method suits many businesses, but the <strong>Flat Rate Scheme</strong>,{' '}
              <strong>cash accounting</strong> and <strong>annual accounting</strong> can each be better depending on
              your margins, customer base and cash flow. The wrong scheme quietly costs money every quarter; the
              right one can ease both the bill and the admin.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: <strong>registering late</strong> after turnover quietly crossed the threshold;
              choosing the <strong>wrong scheme</strong> and overpaying every quarter; <strong>reclaiming VAT
              incorrectly</strong> on costs that do not qualify; missing the <strong>digital record-keeping</strong>{' '}
              requirements of MTD; and mishandling <strong>VAT on overseas sales</strong> where the place-of-supply
              rules change the treatment.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Cross-border and overseas sales</h2>
            <p>
              If you sell to customers outside the UK, VAT gets more involved. The <strong>place-of-supply</strong>{' '}
              rules decide whether UK VAT applies at all, and many exports are zero-rated or outside its scope.
              Getting this right matters for businesses trading between the UK and the US — and it is exactly the kind
              of cross-border detail we are built to handle.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="VAT, set up and run properly"
        steps={[
          { title: 'Assess registration', description: 'We track your turnover against the current threshold and advise when — or whether — to register.' },
          { title: 'Choose the scheme', description: 'We model the schemes for your business and pick the one that leaves you better off.' },
          { title: 'Set up MTD', description: 'We get your digital records and compatible software working so filing is clean.' },
          { title: 'File every quarter', description: 'We prepare and submit accurate VAT returns on time, handling any cross-border treatment correctly.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping', description: 'Clean records make VAT painless' },
          { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts', description: 'Year-end accounts and filing' },
          { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax', description: 'The CT600 and company tax' },
          { label: 'Startup Accounting', href: '/services/uk-accounting/startup-accounting', description: 'Getting VAT right from day one' },
          { label: 'Payroll', href: '/services/uk-accounting/payroll', description: 'PAYE and employment taxes' },
          { label: 'Business Advisory', href: '/services/uk-accounting', description: 'All our UK accounting services' },
        ]}
      />
    </PageShell>
  );
}
