import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting/corporation-tax';

export const metadata: Metadata = {
  title: 'UK Corporation Tax — CT600 Filing, Deadlines & Planning',
  description:
    'UK companies pay Corporation Tax on their profits and file a CT600 with HMRC. Learn how it works, why payment is due before filing, common mistakes, and how we handle it — including for US-owned UK companies facing GILTI.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'kristina')!;

const faqs = [
  {
    q: 'What is UK Corporation Tax?',
    a: 'Corporation Tax is the tax a UK limited company pays on its taxable profits — broadly its trading profits, investment income and chargeable gains. It is reported to HMRC on a Company Tax Return (CT600), supported by the company\u2019s accounts. The rate is set by the government and can change between Budgets.',
  },
  {
    q: 'When is Corporation Tax due?',
    a: 'This catches many directors out: the payment deadline falls before the filing deadline. For most companies, Corporation Tax is payable within nine months and one day of the accounting year-end, while the CT600 return itself is not due until twelve months after the year-end. So you often have to pay the tax before the return is even filed.',
  },
  {
    q: 'How is the amount of Corporation Tax calculated?',
    a: 'It is charged on taxable profits, which start from your accounting profit and are then adjusted for tax purposes — for example adding back disallowable costs and applying capital allowances on qualifying assets. The applicable rate is then applied. Because the rate and the reliefs can change, the calculation should be done on current rules each year.',
  },
  {
    q: 'What happens if I file or pay late?',
    a: 'HMRC charges penalties for filing the CT600 late and interest on tax paid late, both of which escalate over time. Because the payment deadline comes first, it is possible to be late on payment even while still preparing the return — which is exactly why we plan the numbers early.',
  },
  {
    q: 'Can I reduce my Corporation Tax bill?',
    a: 'Legitimately, yes — through claiming all available reliefs and allowances, such as capital allowances on qualifying purchases, allowable expenses, and reliefs relevant to your sector. Effective planning is about claiming what you are entitled to and timing decisions well, not aggressive schemes. We focus on the former.',
  },
  {
    q: 'I am a US owner of a UK company — does Corporation Tax interact with US tax?',
    a: 'Yes. Paying UK Corporation Tax does not remove US obligations. Rules such as GILTI can tax your UK company\u2019s profits in your hands on the US side, even before they are distributed, and Form 5471 reporting applies. The UK and US sides must be coordinated, which is the core of what we do.',
  },
];

export default function CorporationTax() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting · Corporation Tax"
      title="UK Corporation Tax and the CT600"
      answer="Corporation Tax is the tax a UK limited company pays on its taxable profits, reported to HMRC on a Company Tax Return (CT600). A key quirk catches directors out: the tax is normally payable within nine months and one day of your year-end, while the return itself is not due until twelve months after — so you usually pay before you file. The rate is set by the government and changes between Budgets. For US-owned UK companies, Corporation Tax interacts with US rules such as GILTI and Form 5471."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
        { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-26"
      faqs={faqs}
      service={{
        url: URL,
        name: 'UK Corporation Tax Services',
        description: 'Preparation of the Company Tax Return (CT600) and Corporation Tax planning for UK limited companies, coordinated with US obligations for US-owned companies.',
        serviceType: 'Tax Preparation',
      }}
      ctaTitle="Get your Corporation Tax right — and on time"
      ctaIntro="From the CT600 to planning the bill in advance, book a free consultation and we'll make sure you pay what you owe, claim what you can, and never miss the payment deadline."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                <strong>Corporation Tax</strong> is the tax your UK limited company pays on its{' '}
                <strong>taxable profits</strong> — trading profits, investment income and gains. You report it to{' '}
                <strong>HMRC</strong> on a <strong>Company Tax Return (CT600)</strong>, supported by your company
                accounts. The rate is set by the government and can move between Budgets, so the calculation is done
                on current rules each year.
              </p>
              <p>
                The single most important thing to understand is the timing, because it is counter-intuitive: the{' '}
                <strong>tax is due before the return is</strong>. For most companies, payment falls{' '}
                <strong>nine months and one day after the year-end</strong>, while the CT600 itself is not due until{' '}
                <strong>twelve months after</strong>. Plenty of directors discover too late that they owed the tax
                months before they expected to file.
              </p>
              <p>
                Getting it right is partly accuracy and partly planning — claiming every relief and allowance you are
                entitled to, and knowing the number early enough to set the cash aside. That is the difference
                between Corporation Tax being a shock and being managed.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Corporation Tax at a glance"
                facts={[
                  { label: 'Charged on', value: 'Taxable company profits' },
                  { label: 'Return', value: 'CT600 to HMRC' },
                  { label: 'Payment due', value: '~9 months + 1 day after year-end' },
                  { label: 'Return due', value: '~12 months after year-end' },
                  { label: 'Quirk', value: 'Pay before you file' },
                  { label: 'Rate', value: 'Set by government; can change' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who pays Corporation Tax"
        items={[
          'All UK limited companies with taxable profits',
          'Contractors and consultants operating through a company',
          'SMEs and owner-managed businesses',
          'US citizens and green card holders owning a UK company',
          'Startups that have moved into profit',
          'Companies with investment income or chargeable gains',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">How the tax is worked out</h2>
            <p>
              Corporation Tax starts from your <strong>accounting profit</strong> and is then adjusted for tax: adding
              back costs that are not tax-deductible, and applying <strong>capital allowances</strong> on qualifying
              assets instead of accounting depreciation. The applicable rate is then applied to the resulting taxable
              profit. Because both the rate and the available reliefs can change, this is done on current rules each
              year rather than from memory.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Pay first, file later</h2>
            <p>
              It bears repeating because it is where companies slip up. Your <strong>payment</strong> is normally due
              nine months and one day after the year-end; your <strong>return</strong> twelve months after. HMRC
              charges <strong>interest on late payment</strong> and <strong>penalties on late filing</strong>, both
              escalating. We work the figure out early so the payment is planned, not panicked.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: assuming the <strong>payment deadline is the same as the filing deadline</strong>{' '}
              (it is earlier); <strong>not setting cash aside</strong> for the bill; missing legitimate{' '}
              <strong>capital allowances and reliefs</strong>; relying on last year&rsquo;s rate when it has changed;
              and — for US owners — paying UK Corporation Tax while <strong>overlooking the US side</strong> entirely.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">For US owners: GILTI and Form 5471</h2>
            <p>
              Paying UK Corporation Tax does not settle your US position. Under rules such as <strong>GILTI</strong>,
              the US can tax your UK company&rsquo;s profits in your hands even before they are paid out to you, and{' '}
              <Link href="/services/us-expat-tax/form-5471" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Form 5471</Link>{' '}
              reporting applies. The two systems have to be planned together — exactly the cross-border work we
              specialise in.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="Corporation Tax, planned and filed"
        steps={[
          { title: 'Calculate early', description: 'We work out the taxable profit and the tax due well before the payment deadline, so there are no surprises.' },
          { title: 'Claim reliefs', description: 'We capture every capital allowance and relief you are entitled to, on current rules.' },
          { title: 'File the CT600', description: 'We prepare and file an accurate Company Tax Return with HMRC, consistent with your accounts.' },
          { title: 'Coordinate US side', description: 'For US owners, we align the UK position with GILTI and Form 5471 so nothing is double-counted or missed.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts', description: 'The accounts behind your CT600' },
          { label: 'Tax Planning', href: '/services/uk-accounting/tax-planning', description: 'Plan the bill before year-end' },
          { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping', description: 'Accurate records, accurate tax' },
          { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns', description: 'If your company is VAT registered' },
          { label: 'Form 5471 (US owners)', href: '/services/us-expat-tax/form-5471', description: 'US reporting for your UK company' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen guidance' },
        ]}
      />
    </PageShell>
  );
}
