import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/us-tax-returns';

export const metadata: Metadata = {
  title: 'US Tax Returns for Americans in the UK — Federal Filing from Abroad',
  description:
    'US citizens and green card holders must file a US federal tax return on worldwide income wherever they live. Learn who must file, the expat deadlines, how reliefs prevent double tax, and how we handle it.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'Do US citizens living in the UK have to file US tax returns?',
    a: 'Yes. The United States taxes its citizens and green card holders on their worldwide income regardless of where they live, so Americans in the UK must file a US federal return (Form 1040) every year — even if they owe nothing after reliefs such as the Foreign Earned Income Exclusion or the Foreign Tax Credit. This is known as citizenship-based taxation.',
  },
  {
    q: 'Do I still have to file if I owe no US tax?',
    a: 'Usually yes. The filing obligation is separate from whether tax is due. Most Americans in the UK owe little or no US tax once reliefs are applied, but they are still required to file the return — and often FBAR and FATCA reports alongside it.',
  },
  {
    q: 'What is the US tax filing deadline for Americans abroad?',
    a: 'The standard deadline is 15 April, but US persons living abroad receive an automatic extension to 15 June to file. A further extension to 15 October is available on request. Any US tax owed is still due by 15 April, so interest can accrue from then even when the filing deadline is later.',
  },
  {
    q: 'How do I avoid being taxed twice on the same income?',
    a: 'Through the Foreign Earned Income Exclusion, the Foreign Tax Credit and the US–UK tax treaty. Used correctly and in the right combination, these reliefs mean most Americans in the UK are not taxed twice on the same income — but the right approach depends on your income mix.',
  },
  {
    q: 'Do I need to file a US state return as well?',
    a: 'It depends on the state and your ties to it. Some US states continue to consider you a resident for tax purposes after you move abroad, while others do not. We assess your state position as part of preparing your federal return.',
  },
  {
    q: 'What other US filings might I need besides the 1040?',
    a: 'Commonly the FBAR (FinCEN Form 114) for foreign accounts, Form 8938 under FATCA for foreign assets, Form 2555 for the Foreign Earned Income Exclusion, Form 1116 for the Foreign Tax Credit, and — for company owners — Form 5471. Which apply depends on your circumstances, and they should be prepared together so they stay consistent.',
  },
];

export default function UsTaxReturns() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · US Tax Returns"
      title="US tax returns for Americans in the UK"
      answer="US citizens and green card holders must file a US federal tax return (Form 1040) on their worldwide income every year, wherever they live — this is citizenship-based taxation. Americans in the UK get an automatic filing extension to 15 June, and reliefs such as the Foreign Earned Income Exclusion, the Foreign Tax Credit and the US–UK treaty usually mean little or no US tax is actually owed. You must still file, often alongside FBAR and FATCA reports."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-25"
      faqs={faqs}
      service={{
        url: URL,
        name: 'US Federal Tax Returns for Americans Abroad',
        description: 'Preparation of US federal (and where needed state) tax returns for US citizens and green card holders living in the UK, coordinated with UK filings.',
        serviceType: 'Tax Preparation',
      }}
      ctaTitle="Need to file your US return from the UK?"
      ctaIntro="Whether you are up to date or just realising you should have been filing, book a free consultation and we'll map exactly what you need to file — and make sure you are not taxed twice."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                The United States is one of the very few countries that taxes its citizens on their{' '}
                <strong>worldwide income regardless of where they live</strong>. This is called{' '}
                <strong>citizenship-based taxation</strong>, and it means that if you are a US citizen or green card
                holder living in the UK, you must file a <strong>US federal tax return (Form 1040) every year</strong>
                — even if all your income is British and you have not set foot in the US.
              </p>
              <p>
                The part that reassures most people: filing a return is <strong>not</strong> the same as owing tax.
                Because of the Foreign Earned Income Exclusion, the Foreign Tax Credit and the US–UK treaty, the
                majority of Americans in the UK end up owing <strong>little or no US tax</strong>. But the obligation
                to <em>file</em> remains — and often comes with FBAR and FATCA reports alongside.
              </p>
              <p>
                There is also a timing point worth knowing: Americans abroad get an <strong>automatic extension to
                15 June</strong> to file, with a further extension to 15 October available on request. Any tax owed is
                still due by 15 April, but the filing date is more generous than many expats realise.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="US tax returns at a glance"
                facts={[
                  { label: 'Form', value: 'Form 1040' },
                  { label: 'Taxed on', value: 'Worldwide income' },
                  { label: 'File even if', value: '$0 US tax owed' },
                  { label: 'Expat deadline', value: '15 Jun (auto)' },
                  { label: 'Further extension', value: '15 Oct on request' },
                  { label: 'Payment due', value: '15 Apr' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who must file a US return"
        items={[
          'US citizens living in the UK, including dual citizens',
          '"Accidental Americans" who acquired citizenship by birth or parentage',
          'Green card holders, even after leaving the US',
          'Self-employed Americans and freelancers working in the UK',
          'Anyone who has not filed and has realised they should have',
          'US persons with UK income, investments, property or a business',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">How it all fits together</h2>
            <p>
              Your US return rarely stands alone. It is the centre of a small set of filings and reliefs that work
              together, and getting them coordinated is what keeps you compliant and prevents double taxation:
            </p>
            <p>
              The <Link href="/services/us-expat-tax/foreign-tax-credit" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Foreign Tax Credit</Link>{' '}
              and the{' '}
              <Link href="/services/us-expat-tax/feie" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Foreign Earned Income Exclusion</Link>{' '}
              are the two main ways to avoid paying tax twice — the choice between them matters, and the{' '}
              <Link href="/services/us-expat-tax/us-uk-tax-treaty" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">US–UK tax treaty</Link>{' '}
              sits alongside them for pensions and specific income types.
            </p>
            <p>
              Separately, you may need to report foreign accounts on the{' '}
              <Link href="/services/us-expat-tax/fbar-filing" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">FBAR</Link>{' '}
              and foreign assets under{' '}
              <Link href="/services/us-expat-tax/fatca-compliance" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">FATCA on Form 8938</Link>. If you own a non-US company, there is also{' '}
              <Link href="/services/us-expat-tax/form-5471" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Form 5471</Link>{' '}
              to consider. And if you have fallen behind on any of this,{' '}
              <Link href="/services/us-expat-tax/streamlined-filing" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Streamlined Filing</Link>{' '}
              is usually the route back.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The big ones: not filing at all because &ldquo;I don&rsquo;t owe anything&rdquo; (the obligation is to
              file, not just to pay); missing the <strong>FBAR or FATCA</strong> reports that go alongside the return;
              choosing the <strong>wrong relief</strong> and leaving money on the table; forgetting a{' '}
              <strong>US state return</strong> where one is still due; and assuming the deadline is 15 April when
              expats actually have until 15 June to file.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="One coordinated US filing, done properly"
        steps={[
          { title: 'Understand', description: 'We review your income, residency, accounts and assets to see exactly what you must file.' },
          { title: 'Optimise reliefs', description: 'We apply the FEIE, Foreign Tax Credit and treaty in the right combination so you are not taxed twice.' },
          { title: 'Prepare everything', description: 'Federal return, any state return, and FBAR/FATCA where needed — prepared together and kept consistent.' },
          { title: 'Review & file', description: 'Prepared by a US specialist and independently reviewed, then filed with a clear record for you.' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'Foreign Tax Credit', href: '/services/us-expat-tax/foreign-tax-credit', description: 'Offset US tax with UK tax paid' },
          { label: 'FEIE', href: '/services/us-expat-tax/feie', description: 'Exclude foreign earned income' },
          { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing', description: 'Report foreign accounts over $10,000' },
          { label: 'FATCA Compliance', href: '/services/us-expat-tax/fatca-compliance', description: 'Report foreign assets on Form 8938' },
          { label: 'US–UK Tax Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'Treaty relief for pensions and more' },
          { label: 'US Tax Deadlines', href: '/resources/calculators/us-expat-deadlines', description: 'Free tool: your key dates this year' },
        ]}
      />
    </PageShell>
  );
}
