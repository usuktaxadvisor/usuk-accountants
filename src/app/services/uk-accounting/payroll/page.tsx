import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting/payroll';

export const metadata: Metadata = {
  title: 'UK Payroll Services — PAYE, RTI & Auto-Enrolment',
  description:
    'Running UK payroll means operating PAYE, reporting to HMRC in real time (RTI), and meeting pension auto-enrolment duties. Learn what is involved, common mistakes, and how we run payroll for UK and cross-border employers.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'kristina')!;

const faqs = [
  {
    q: 'What does running UK payroll involve?',
    a: 'It means operating PAYE (Pay As You Earn) — calculating each employee\u2019s income tax and National Insurance, deducting them from pay, and paying them to HMRC. You must report each pay run to HMRC in real time under RTI, provide payslips, and meet pension auto-enrolment duties. It runs every pay period, not just at year-end.',
  },
  {
    q: 'What is RTI (Real Time Information)?',
    a: 'RTI is HMRC\u2019s requirement that employers report payroll information on or before each payday, rather than once a year. Every pay run generates a submission to HMRC showing pay, tax and National Insurance. Late or missing RTI submissions can trigger penalties, so payroll has to be both accurate and punctual.',
  },
  {
    q: 'What is pension auto-enrolment?',
    a: 'Employers must automatically enrol eligible employees into a workplace pension and contribute to it, unless the employee opts out. There are duties at each pay run and at set re-enrolment points. The contribution rates and eligibility thresholds are set by the government and can change, so the scheme must be operated on current rules.',
  },
  {
    q: 'Do I need to run payroll if I am the only director?',
    a: 'Often yes. If you take a salary from your own limited company, that salary generally goes through PAYE and is reported via RTI, even if you are the sole director and employee. Many director-only companies run a small regular payroll, and how salary and dividends are combined is worth planning.',
  },
  {
    q: 'What happens at payroll year-end?',
    a: 'At the end of the tax year you finalise the year\u2019s payroll, issue each employee a P60 summarising their pay and deductions, and report any taxable benefits. It is a defined process with its own deadlines, on top of the regular pay-run reporting throughout the year.',
  },
  {
    q: 'Can you handle payroll for employees working across the US and UK?',
    a: 'Yes — and this is where it gets technical. Employees who move between or work across the US and UK can raise questions of where tax and social security are due, including totalization considerations. These situations need care to avoid double withholding or missed obligations, and are exactly the cross-border cases we are set up to handle.',
  },
];

export default function Payroll() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting · Payroll"
      title="UK payroll, PAYE and auto-enrolment"
      answer="Running UK payroll means operating PAYE — calculating and deducting income tax and National Insurance from employees' pay and paying it to HMRC — while reporting every pay run in real time under RTI and meeting pension auto-enrolment duties. It runs each pay period, with a defined year-end process (P60s and benefit reporting). Rates and thresholds are set by the government and change yearly. Cross-border employees working across the US and UK raise additional tax and social-security questions we handle."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
        { label: 'Payroll', href: '/services/uk-accounting/payroll' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-26"
      faqs={faqs}
      service={{
        url: URL,
        name: 'UK Payroll Services',
        description: 'Fully managed UK payroll — PAYE, RTI reporting, auto-enrolment and year-end — for employers including those with cross-border US/UK employees.',
        serviceType: 'Payroll',
      }}
      ctaTitle="Want payroll handled, accurately and on time?"
      ctaIntro="From a single director's salary to a growing team, book a free consultation and we'll run your payroll, RTI and auto-enrolment so nothing is late and nobody is overpaid or underpaid."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                Running payroll in the UK means operating <strong>PAYE</strong> — working out each employee&rsquo;s{' '}
                <strong>income tax and National Insurance</strong>, deducting them from pay, and passing them to{' '}
                <strong>HMRC</strong>. Unlike most tax tasks, it does not wait for year-end: it happens every single
                pay period, and it has to be right every time.
              </p>
              <p>
                Two things make it more than just arithmetic. First, <strong>RTI</strong> — you must report every pay
                run to HMRC <strong>on or before payday</strong>, not annually. Second, <strong>auto-enrolment</strong>
                {' '}— you must enrol eligible staff into a workplace pension and contribute, with duties at each pay
                run. Miss either and penalties follow.
              </p>
              <p>
                Even a <strong>single-director company</strong> usually runs payroll for the director&rsquo;s salary,
                and how that salary combines with dividends is worth planning. And where employees work{' '}
                <strong>across the US and UK</strong>, payroll stops being routine — which is precisely the kind of
                case we are built for.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Payroll at a glance"
                facts={[
                  { label: 'System', value: 'PAYE' },
                  { label: 'Reporting', value: 'RTI — on or before payday' },
                  { label: 'Pensions', value: 'Auto-enrolment duties' },
                  { label: 'Frequency', value: 'Every pay period' },
                  { label: 'Year-end', value: 'P60s + benefit reporting' },
                  { label: 'Rates', value: 'Set by government; change yearly' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who needs payroll"
        items={[
          'Limited companies paying directors a salary',
          'Employers with one or more employees',
          'Growing businesses taking on their first staff',
          'Companies with auto-enrolment pension duties',
          'Employers with staff working across the US and UK',
          'Businesses wanting payroll fully off their plate',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">PAYE, RTI and the pay run</h2>
            <p>
              Each pay run, payroll calculates gross-to-net for every employee — tax, National Insurance, pension and
              any other deductions — produces <strong>payslips</strong>, and files the <strong>RTI submission</strong>
              {' '}to HMRC on or before payday. The amounts are then paid over to HMRC on the required schedule. Doing
              this on <strong>current rates</strong> each year is essential, because thresholds shift annually.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Auto-enrolment and year-end</h2>
            <p>
              Alongside the pay run sit <strong>auto-enrolment</strong> duties — assessing eligibility, enrolling
              staff, contributing, and handling opt-outs and re-enrolment. At <strong>year-end</strong>, payroll is
              finalised, <strong>P60s</strong> are issued, and taxable benefits are reported. We keep all of this
              running so it is never a scramble.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: <strong>late or missed RTI submissions</strong> triggering penalties; overlooking{' '}
              <strong>auto-enrolment</strong> duties; using <strong>last year&rsquo;s thresholds</strong> after they
              changed; mishandling the <strong>salary-versus-dividend</strong> mix for director-only companies; and
              treating <strong>cross-border employees</strong> as ordinary UK staff when their situation needs
              specific handling.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Cross-border employees</h2>
            <p>
              When someone works across the US and UK, payroll has to consider <strong>where tax and social security
              are actually due</strong>, including totalization questions between the two countries. Get it wrong and
              you risk double withholding or missed obligations. This is the cross-border depth that sets a US–UK firm
              apart from a purely domestic payroll bureau.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="Payroll, run end to end"
        steps={[
          { title: 'Set up', description: 'We register your PAYE scheme if needed and set up employees, pensions and pay schedules correctly.' },
          { title: 'Run each period', description: 'We process every pay run, produce payslips, and file RTI to HMRC on time.' },
          { title: 'Manage pensions', description: 'We handle auto-enrolment assessment, contributions, opt-outs and re-enrolment.' },
          { title: 'Close the year', description: 'We finalise year-end, issue P60s, report benefits, and handle any cross-border complications.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts', description: 'Year-end accounts and filing' },
          { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax', description: 'The CT600 and company tax' },
          { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping', description: 'Records that feed clean payroll' },
          { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment', description: 'Director and personal tax returns' },
          { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns', description: 'VAT registration and filing' },
          { label: 'UK Citizens in the US', href: '/who-we-help/uk-citizens-in-us', description: 'Cross-border employment guidance' },
        ]}
      />
    </PageShell>
  );
}
