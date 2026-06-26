import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting/self-assessment';

export const metadata: Metadata = {
  title: 'Self Assessment Tax Returns — UK Personal Tax Return Help',
  description:
    'Who needs to file a UK Self Assessment tax return, the 31 January deadline, payments on account, common mistakes, and how we handle it — including for those with US filing obligations alongside.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'kristina')!;

const faqs = [
  {
    q: 'Who needs to file a Self Assessment tax return?',
    a: 'You generally need to file if you are self-employed, a partner in a partnership, a company director with untaxed income, a landlord with rental income, or have significant income from savings, investments, dividends or abroad — or other income not fully taxed at source. HMRC also requires returns in various other situations, so if you are unsure it is worth checking rather than assuming.',
  },
  {
    q: 'What is the Self Assessment deadline?',
    a: 'For online returns, the deadline is 31 January following the end of the tax year, which runs to 5 April. So the return for a tax year ending 5 April is due online by the following 31 January. Paper returns have an earlier deadline. Any tax owed is also generally due by 31 January.',
  },
  {
    q: 'What are payments on account?',
    a: 'Payments on account are advance payments towards your next tax bill, each normally half of your previous year\u2019s liability, due on 31 January and 31 July. They catch many first-time filers out, because the first 31 January payment can include both the balance for the year just gone and the first payment on account for the year ahead.',
  },
  {
    q: 'What happens if I file or pay late?',
    a: 'HMRC charges an automatic penalty for filing late, even by a day, with further penalties and interest the longer it goes on, plus interest on tax paid late. Because the penalties are automatic, the simplest protection is preparing the return well before the 31 January deadline.',
  },
  {
    q: 'Can you help reduce my Self Assessment bill?',
    a: 'We make sure you claim every allowance, relief and allowable expense you are entitled to — from pension contributions to legitimate business costs and reliefs relevant to your situation — so you pay the right amount and nothing more. Good preparation is about accuracy and entitlement, not aggressive schemes.',
  },
  {
    q: 'I am a US citizen in the UK — how does Self Assessment fit with my US return?',
    a: 'You may need to file both a UK Self Assessment return and a US federal return on the same income. The two systems interact through the Foreign Tax Credit, the Foreign Earned Income Exclusion and the US–UK treaty. Preparing them together — as we do — is what keeps you compliant in both countries without paying twice.',
  },
];

export default function SelfAssessment() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting · Self Assessment"
      title="Self Assessment tax returns"
      answer="Self Assessment is how individuals report income to HMRC that is not fully taxed at source — covering the self-employed, company directors, landlords, and those with significant investment or foreign income. The online filing deadline is 31 January following the 5 April tax-year-end, and tax owed is generally due the same day, with payments on account due 31 January and 31 July. For US citizens in the UK, the UK return often sits alongside a US return on the same income, coordinated through the Foreign Tax Credit and treaty."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
        { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-26"
      faqs={faqs}
      service={{
        url: URL,
        name: 'UK Self Assessment Tax Returns',
        description: 'Preparation and filing of UK Self Assessment tax returns for individuals, directors and landlords, coordinated with US returns for those with cross-border obligations.',
        serviceType: 'Tax Preparation',
      }}
      ctaTitle="Need your Self Assessment done properly?"
      ctaIntro="Beat the 31 January rush. Book a free consultation and we'll prepare your return accurately, claim everything you're entitled to, and coordinate it with any US filing."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                <strong>Self Assessment</strong> is the system HMRC uses to collect tax on income that is not already
                taxed at source. If you are <strong>self-employed</strong>, a <strong>company director</strong>, a{' '}
                <strong>landlord</strong>, or have meaningful income from savings, dividends, investments or abroad,
                you will usually need to file a return each year.
              </p>
              <p>
                The dates are fixed and worth knowing. The UK tax year ends on <strong>5 April</strong>, and the{' '}
                <strong>online return is due by the following 31 January</strong>, along with any tax owed. On top of
                that, many people make <strong>payments on account</strong> — advance instalments due{' '}
                <strong>31 January and 31 July</strong> — which can make a first bill larger than expected.
              </p>
              <p>
                Penalties for late filing are <strong>automatic</strong>, so the real value is in preparing early and
                accurately. And if you are a <strong>US citizen in the UK</strong>, your Self Assessment rarely
                stands alone — it usually has to be coordinated with a US return on the same income, which is exactly
                where a US–UK firm earns its keep.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Self Assessment at a glance"
                facts={[
                  { label: 'Tax year ends', value: '5 April' },
                  { label: 'Online deadline', value: '31 January' },
                  { label: 'Tax due', value: '31 January' },
                  { label: 'Payments on account', value: '31 Jan & 31 Jul' },
                  { label: 'Late filing', value: 'Automatic penalty' },
                  { label: 'US citizens', value: 'Often file UK + US' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who needs to file Self Assessment"
        items={[
          'Self-employed people and sole traders',
          'Company directors with untaxed income',
          'Landlords with rental income',
          'People with significant savings, dividend or investment income',
          'Anyone with foreign income, including US citizens in the UK',
          'Higher earners and those with more complex tax affairs',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Deadlines and payments on account</h2>
            <p>
              The <strong>31 January</strong> online deadline is the one everyone knows — but{' '}
              <strong>payments on account</strong> are what surprise people. Each is normally half of your previous
              year&rsquo;s tax bill, paid in advance on <strong>31 January and 31 July</strong>. That means a
              first-time filer can face the balance for the year just ended <em>and</em> the first instalment toward
              the next, all on the same January date. Knowing this in advance turns a shock into a plan.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Claiming what you are entitled to</h2>
            <p>
              A good return is not just submitted on time — it claims every <strong>allowance, relief and allowable
              expense</strong> you are due, from pension contributions to legitimate business costs. The aim is
              simple: pay the correct amount, and not a penny more, on <strong>current rules</strong> for the year.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: <strong>leaving it to January</strong> and rushing; being caught out by{' '}
              <strong>payments on account</strong>; <strong>missing allowable expenses</strong> and overpaying;
              forgetting to declare <strong>all sources of income</strong>, including foreign income; and — for US
              citizens — filing the UK return well while <strong>overlooking the US return</strong> that needs to
              align with it.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">For US citizens in the UK</h2>
            <p>
              If you hold US citizenship or a green card while living in the UK, the same income often has to appear
              on both a UK Self Assessment return and a US federal return. The two are reconciled through the{' '}
              <strong>Foreign Tax Credit</strong>, the <strong>Foreign Earned Income Exclusion</strong> and the{' '}
              <strong>US–UK treaty</strong>. Handling them together is the only reliable way to stay compliant in both
              systems without being taxed twice.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="Self Assessment, done early and right"
        steps={[
          { title: 'Gather', description: 'We collect your income, expenses and relevant documents and identify everything that must be declared.' },
          { title: 'Prepare & optimise', description: 'We prepare the return on current rules, claiming every allowance and relief you are entitled to.' },
          { title: 'File & plan payments', description: 'We file with HMRC ahead of 31 January and make sure you know what to pay, including payments on account.' },
          { title: 'Coordinate US side', description: 'For US citizens, we align the UK return with the US return so the two systems agree.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping', description: 'Records that make returns easy' },
          { label: 'Tax Planning', href: '/services/uk-accounting/tax-planning', description: 'Plan ahead, not just report back' },
          { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns', description: 'The US return that runs alongside' },
          { label: 'Foreign Tax Credit', href: '/services/us-expat-tax/foreign-tax-credit', description: 'Avoid double tax across US & UK' },
          { label: 'US Citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'How we help Americans abroad' },
          { label: 'Payroll', href: '/services/uk-accounting/payroll', description: 'PAYE for directors and staff' },
        ]}
      />
    </PageShell>
  );
}
