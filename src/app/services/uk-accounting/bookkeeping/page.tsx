import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting/bookkeeping';

export const metadata: Metadata = {
  title: 'Bookkeeping Services — Cloud Bookkeeping with Xero & QuickBooks',
  description:
    'Accurate, up-to-date bookkeeping is the foundation of every other filing. Learn what good bookkeeping involves, how cloud software and Making Tax Digital fit in, common mistakes, and how we handle it — including dual-currency records.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const faqs = [
  {
    q: 'What does bookkeeping actually involve?',
    a: 'Bookkeeping is the ongoing recording and categorising of every financial transaction your business makes — sales, purchases, expenses, payments and receipts — and reconciling them against your bank. It keeps your records accurate and up to date, which is what every other filing (VAT, accounts, tax returns) depends on.',
  },
  {
    q: 'Why is good bookkeeping so important?',
    a: 'Because everything else is built on it. Your VAT returns, year-end accounts, Corporation Tax and Self Assessment are only as accurate as the underlying records. Clean bookkeeping means fewer errors, lower accountancy costs, better decisions during the year, and far less stress at deadlines.',
  },
  {
    q: 'Which bookkeeping software do you use?',
    a: 'We work with leading cloud accounting platforms such as Xero and QuickBooks, which keep your records live, allow bank feeds and digital receipts, and connect directly to Making Tax Digital filing. Cloud software also lets us see the same up-to-date numbers you do, wherever you are.',
  },
  {
    q: 'How does bookkeeping relate to Making Tax Digital?',
    a: 'Making Tax Digital requires digital record-keeping and software-based filing. Keeping your books in compatible cloud software means you are already set up for MTD for VAT, and positioned for MTD for Income Tax Self Assessment as it is rolled out. Good digital bookkeeping is the foundation that makes MTD straightforward.',
  },
  {
    q: 'Can you take over bookkeeping I have fallen behind on?',
    a: 'Yes. We regularly bring neglected or backlogged books up to date, reconcile historic transactions, and then keep them current going forward. Catching up early is far cheaper than letting it compound into a year-end emergency.',
  },
  {
    q: 'Can you handle records in both pounds and dollars?',
    a: 'Yes. For clients trading or living across the US and UK, we keep records that handle both currencies and feed cleanly into both UK and US reporting. Dual-currency bookkeeping done properly avoids reconciliation headaches and conversion errors later.',
  },
];

export default function Bookkeeping() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting · Bookkeeping"
      title="Bookkeeping that everything else relies on"
      answer="Bookkeeping is the ongoing recording, categorising and bank-reconciling of every transaction your business makes. It is the foundation beneath your VAT returns, year-end accounts and tax returns — all of which are only as accurate as the books behind them. We work with cloud platforms such as Xero and QuickBooks, keeping records live and Making-Tax-Digital ready, and can maintain dual-currency records for clients operating across the US and UK."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
        { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-26"
      faqs={faqs}
      service={{
        url: URL,
        name: 'Cloud Bookkeeping Services',
        description: 'Ongoing cloud bookkeeping with Xero and QuickBooks for UK businesses, including catch-up work and dual-currency records for cross-border clients.',
        serviceType: 'Bookkeeping',
      }}
      ctaTitle="Want your books accurate and always up to date?"
      ctaIntro="Whether you are starting fresh, switching software, or catching up on a backlog, book a consultation and we'll get your bookkeeping clean and keep it that way."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                <strong>Bookkeeping</strong> is the quiet engine of everything else. It is the ongoing work of{' '}
                <strong>recording and categorising every transaction</strong> — sales, purchases, expenses, receipts
                — and <strong>reconciling</strong> them against your bank, so your numbers are always accurate and
                current.
              </p>
              <p>
                It matters because <strong>every other filing depends on it</strong>. Your VAT returns, year-end
                accounts, Corporation Tax and Self Assessment are only as reliable as the books underneath them.
                Messy records mean errors, higher fees and deadline panic; clean records mean the opposite — and
                better decisions all year round.
              </p>
              <p>
                We run bookkeeping on <strong>cloud platforms like Xero and QuickBooks</strong>, with bank feeds and
                digital receipts, so everything stays live and <strong>Making Tax Digital</strong> ready. And for
                clients living or trading across the US and UK, we keep <strong>dual-currency records</strong> that
                feed cleanly into both countries&rsquo; reporting.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Bookkeeping at a glance"
                facts={[
                  { label: 'What it is', value: 'Recording & reconciling transactions' },
                  { label: 'Software', value: 'Xero, QuickBooks' },
                  { label: 'Keeps you', value: 'Making Tax Digital ready' },
                  { label: 'Feeds', value: 'VAT, accounts, tax returns' },
                  { label: 'Catch-up', value: 'Backlogs brought up to date' },
                  { label: 'Cross-border', value: 'Dual-currency records' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who benefits from managed bookkeeping"
        items={[
          'Limited companies and sole traders alike',
          'Busy owners who would rather not do the books themselves',
          'VAT-registered businesses needing MTD-ready records',
          'Anyone who has fallen behind and needs catching up',
          'Businesses switching to or setting up cloud software',
          'Cross-border clients needing dual-currency records',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Cloud bookkeeping and Making Tax Digital</h2>
            <p>
              Keeping your books in <strong>cloud software</strong> does more than tidy the admin. Bank feeds pull
              transactions in automatically, receipts can be captured digitally, and the records connect straight to{' '}
              <strong>Making Tax Digital</strong> filing. That means you are already set up for MTD for VAT, and
              positioned for <strong>MTD for Income Tax Self Assessment</strong> as it rolls out — no scramble when
              the rules tighten.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Catching up a backlog</h2>
            <p>
              If your books have slipped, that is common and fixable. We bring backlogged records up to date,
              reconcile historic transactions, and then keep them current. The key is acting <strong>early</strong> —
              a backlog caught mid-year is routine; the same backlog discovered at a deadline is an emergency.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: <strong>letting records fall behind</strong> until year-end; mixing{' '}
              <strong>business and personal transactions</strong>; <strong>miscategorising</strong> expenses so the
              tax position is wrong; not <strong>reconciling to the bank</strong>, so errors go unnoticed; and
              keeping records in a way that is <strong>not MTD-compatible</strong>, forcing rework later.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Why it pays for itself</h2>
            <p>
              Good bookkeeping is rarely the most glamorous service, but it is the one that quietly saves the most.
              Accurate, current books reduce your year-end accountancy time, cut the risk of errors and penalties
              across VAT and tax, and — most valuably — give you real numbers to make decisions on during the year,
              not just a verdict after it.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="Books kept clean, all year"
        steps={[
          { title: 'Set up software', description: 'We set up or migrate you to Xero or QuickBooks with bank feeds and the right chart of accounts.' },
          { title: 'Record & reconcile', description: 'We keep transactions recorded, categorised and reconciled to the bank on a regular cycle.' },
          { title: 'Keep you MTD-ready', description: 'Your records stay digital and compatible, ready for VAT and future MTD requirements.' },
          { title: 'Feed the bigger picture', description: 'Clean books flow into your VAT, accounts and tax — and into dual-currency reporting where needed.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns', description: 'Books feed your VAT filing' },
          { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts', description: 'Year-end accounts and filing' },
          { label: 'Payroll', href: '/services/uk-accounting/payroll', description: 'PAYE, RTI and auto-enrolment' },
          { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment', description: 'Personal and director tax returns' },
          { label: 'Startup Accounting', href: '/services/uk-accounting/startup-accounting', description: 'Set your books up right from day one' },
          { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax', description: 'Accurate books, accurate tax' },
        ]}
      />
    </PageShell>
  );
}
