import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/uk-accounting/startup-accounting';

export const metadata: Metadata = {
  title: 'Startup Accounting — Set Up Your UK Business the Right Way',
  description:
    'Accounting for startups and new businesses: choosing between sole trader and limited company, registration, getting your books and tax set up correctly, and special considerations for American founders launching in the UK.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'kristina')!;

const faqs = [
  {
    q: 'Should I be a sole trader or a limited company?',
    a: 'It depends on your circumstances. A sole trader is simpler to set up and run, with lighter admin, while a limited company is a separate legal entity that can offer liability protection and, in some cases, tax efficiency — but with more reporting obligations. The right choice depends on your income, risk, plans and personal situation, which is why it is worth deciding deliberately at the start.',
  },
  {
    q: 'What do I need to set up when starting a business?',
    a: 'Typically: choosing your structure, registering appropriately (with Companies House if incorporating, and with HMRC for the relevant taxes), setting up business banking, putting bookkeeping software in place, and understanding which filings and deadlines will apply to you. Getting this foundation right from day one saves expensive corrections later.',
  },
  {
    q: 'When should a startup get an accountant?',
    a: 'Ideally before or at the point of starting, not a year in. Early advice shapes the decisions that are hardest to undo later — your structure, how you take money out, your VAT position and your record-keeping. An accountant involved from the start helps you avoid the common early mistakes rather than fixing them afterwards.',
  },
  {
    q: 'Do I need to register for VAT when I start?',
    a: 'Not necessarily at the start — VAT registration is generally required once your turnover crosses the current threshold, though you can register voluntarily earlier if it benefits you. For a new business, the key is knowing where the threshold sits, tracking your turnover, and registering at the right time rather than too late.',
  },
  {
    q: 'I am a US citizen starting a business in the UK — what should I know?',
    a: 'A great deal, because your structure choice has US consequences as well as UK ones. A UK limited company owned by a US person can trigger US filings such as Form 5471 and rules like GILTI, and how you set things up affects both tax systems. Getting US-UK advice before you incorporate can prevent costly structures that are efficient in one country but punished in the other.',
  },
  {
    q: 'Can you help me choose accounting software?',
    a: 'Yes. We help new businesses set up cloud accounting software such as Xero or QuickBooks from the start, with the right configuration, so your records are clean, Making Tax Digital ready, and easy to build on as you grow — rather than something you have to untangle later.',
  },
];

export default function StartupAccounting() {
  return (
    <PageShell
      url={URL}
      eyebrow="UK Accounting · Startups"
      title="Startup accounting, set up the right way"
      answer="Startup accounting is about getting the foundations right from day one: choosing between sole trader and limited company, registering correctly with Companies House and HMRC, setting up cloud bookkeeping, and understanding which filings and deadlines will apply. The decisions made at the start — structure, how you take money out, VAT timing — are the hardest to undo later. For American founders launching in the UK, structure choice also carries US consequences such as Form 5471 and GILTI, so cross-border advice before incorporating matters."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'UK Accounting', href: '/services/uk-accounting' },
        { label: 'Startup Accounting', href: '/services/uk-accounting/startup-accounting' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-26"
      faqs={faqs}
      service={{
        url: URL,
        name: 'Startup & New Business Accounting',
        description: 'Accounting and advisory for startups and new businesses — structure choice, registration, software setup and ongoing compliance, including for US founders launching in the UK.',
        serviceType: 'Accounting',
      }}
      ctaTitle="Starting a business? Start it set up right."
      ctaIntro="The decisions you make at the start are the ones hardest to undo. Book a free consultation and we'll help you choose the right structure and set up your business cleanly — on both sides of the Atlantic if needed."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                Starting a business is the moment when the right accounting advice is worth the most — because the
                decisions you make now are the <strong>hardest to change later</strong>. The biggest one is your{' '}
                <strong>structure</strong>: trading as a <strong>sole trader</strong> is simple and light on admin,
                while a <strong>limited company</strong> is a separate legal entity that can offer protection and
                efficiency, at the cost of more reporting.
              </p>
              <p>
                Around that sit the practical foundations: <strong>registering</strong> with Companies House and HMRC
                as appropriate, setting up <strong>business banking</strong>, putting <strong>cloud bookkeeping</strong>
                {' '}in place, and knowing which filings and deadlines will apply to you. Get these right at the start
                and everything afterwards is smoother; get them wrong and you spend later money fixing them.
              </p>
              <p>
                And if you are an <strong>American founder</strong> launching in the UK, the stakes are higher still.
                Your structure choice has <strong>US consequences</strong> as well as UK ones — which is exactly the
                kind of decision a US–UK firm should shape <em>before</em> you incorporate, not after.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Starting up at a glance"
                facts={[
                  { label: 'First decision', value: 'Sole trader vs limited company' },
                  { label: 'Register with', value: 'Companies House &/or HMRC' },
                  { label: 'Set up', value: 'Banking, bookkeeping, software' },
                  { label: 'VAT', value: 'Register when threshold met' },
                  { label: 'Best time', value: 'Before you start trading' },
                  { label: 'US founders', value: 'Structure affects US tax too' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who this is for"
        items={[
          'First-time founders deciding how to set up',
          'Sole traders considering incorporating',
          'Freelancers and contractors going limited',
          'Startups wanting clean foundations from day one',
          'American founders launching a UK business',
          'Anyone unsure which structure or registrations they need',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Sole trader or limited company?</h2>
            <p>
              This first choice shapes much of what follows. A <strong>sole trader</strong> setup is quick, with
              simpler reporting through Self Assessment. A <strong>limited company</strong> separates you legally from
              the business, can be more tax-efficient in the right circumstances, and may look more established to
              clients — but brings statutory accounts, a CT600 and more admin. The right answer depends on your
              income, risk and plans, and is worth deciding deliberately rather than by default.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Getting the foundations in place</h2>
            <p>
              Beyond structure, a clean start means <strong>registering correctly</strong>, separating business
              banking, and setting up <strong>cloud bookkeeping</strong> (such as Xero or QuickBooks) so you are{' '}
              <Link href="/services/uk-accounting/bookkeeping" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Making Tax Digital ready</Link>{' '}
              from the outset. We also make sure you understand which deadlines — from{' '}
              <Link href="/services/uk-accounting/self-assessment" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Self Assessment</Link>{' '}
              to <Link href="/services/uk-accounting/corporation-tax" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Corporation Tax</Link>{' '}— will apply to you, so nothing is a surprise.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: <strong>picking a structure by default</strong> rather than by analysis;{' '}
              <strong>mixing personal and business money</strong> from the start; leaving <strong>bookkeeping</strong>
              {' '}until it becomes a mess; <strong>missing registration deadlines</strong> for taxes that now apply;
              and — for American founders — <strong>incorporating a UK company without checking the US side</strong>,
              creating a structure that is efficient in the UK but penalised by the IRS.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">For American founders in the UK</h2>
            <p>
              If you hold US citizenship and are starting a UK business, your structure decision is genuinely
              two-sided. A UK limited company owned by a US person can bring{' '}
              <Link href="/services/us-expat-tax/form-5471" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Form 5471</Link>{' '}
              obligations and GILTI exposure on the US side. Deciding how to set up{' '}
              <em>before</em> you incorporate — with both tax systems in view — can save you from an expensive
              restructure later.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="From idea to set up properly"
        steps={[
          { title: 'Choose the structure', description: 'We weigh sole trader versus limited company for your situation — on both UK and, where relevant, US terms.' },
          { title: 'Register everything', description: 'We handle incorporation and the right HMRC registrations so you start fully compliant.' },
          { title: 'Set up your systems', description: 'We get cloud bookkeeping, banking and processes in place so your admin is clean from day one.' },
          { title: 'Map your obligations', description: 'We give you a clear calendar of which filings and deadlines apply, and support you through the first ones.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping', description: 'Set your books up right from day one' },
          { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts', description: 'What a limited company must file' },
          { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax', description: 'The tax a company pays on profits' },
          { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns', description: 'When and how to register for VAT' },
          { label: 'Form 5471 (US founders)', href: '/services/us-expat-tax/form-5471', description: 'US reporting for your UK company' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen guidance' },
        ]}
      />
    </PageShell>
  );
}
