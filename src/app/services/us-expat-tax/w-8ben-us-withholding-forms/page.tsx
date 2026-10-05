import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/w-8ben-us-withholding-forms';

export const metadata: Metadata = {
  title: 'W-8BEN Help UK — US Withholding Forms for UK Residents and Companies',
  description:
    'Receiving US income in the UK? We complete Form W-8BEN, W-8BEN-E and W-9 correctly, apply the US–UK treaty rate where it applies, and tell you which form you actually need. For UK residents, UK companies and US citizens living in the UK.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const faqs = [
  {
    q: 'What is Form W-8BEN?',
    a: 'Form W-8BEN is the IRS certificate a non-US individual gives to a US payer — a broker, a client, a publisher or a platform — to confirm that they are not a US person and, where the US–UK tax treaty allows, to claim a reduced rate of US withholding tax on US-source income such as dividends, interest and royalties. It is kept by the payer, not filed with the IRS.',
  },
  {
    q: 'Who should NOT use Form W-8BEN?',
    a: 'US citizens and green card holders, wherever they live. A US person gives Form W-9 instead, even when living in the UK. Giving a W-8BEN as a US citizen is a false certification. Companies and other entities use Form W-8BEN-E, not W-8BEN.',
  },
  {
    q: 'What is the difference between W-8BEN and W-8BEN-E?',
    a: 'W-8BEN is for individuals. W-8BEN-E is for entities such as a UK limited company, and it also asks the company to classify itself under FATCA. A UK company receiving US-source royalties or service fees normally gives a W-8BEN-E and claims the treaty article that applies to that income.',
  },
  {
    q: 'What US withholding rate applies to a UK resident?',
    a: 'Without a valid form, a US payer generally withholds 30% on US-source dividends, interest and royalties. With a valid W-8BEN and a treaty claim, the US–UK treaty reduces the rate on most dividends to 15% (0% in some pension cases), and on most interest and royalties to 0%. Income from services performed outside the US is generally not subject to this withholding at all.',
  },
  {
    q: 'How long is a W-8BEN valid?',
    a: 'A W-8BEN is valid from the date it is signed until the end of the third following calendar year, unless a change in circumstances makes it incorrect sooner — for example moving to the US or becoming a US person. A form signed in 2026 is generally valid until 31 December 2029.',
  },
  {
    q: 'Does a W-8BEN mean I have no US tax to pay?',
    a: 'Not necessarily. It governs withholding at source. Whether any US return or further US tax applies depends on the type of income and where the work was performed. Treaty-reduced withholding is usually final for dividends, interest and royalties, but US-source service income may require a US return. We check this before the form is given.',
  },
];

const formsCompared = {
  columns: ['W-8BEN', 'W-8BEN-E', 'W-9'],
  highlightColumn: 0,
  rows: [
    { label: 'Who gives it', values: ['Non-US individual', 'Non-US entity (e.g. UK Ltd)', 'US person or entity'] },
    { label: 'US citizen in the UK', values: [false, false, true] },
    { label: 'Claims treaty rate', values: [true, true, false] },
    { label: 'FATCA classification', values: [false, true, false] },
    { label: 'Validity', values: ['To end of 3rd year after signing', 'To end of 3rd year after signing', 'Until details change'] },
    { label: 'Sent to', values: ['The US payer', 'The US payer', 'The US payer'] },
  ],
};

export default function W8BenForms() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · W-8BEN & US Withholding Forms"
      title="W-8BEN and US withholding forms for UK residents"
      answer="If a US company, broker or client asks you for a W-8BEN, W-8BEN-E or W-9, the right form depends on one question: are you a US person? UK residents who are not US citizens or green card holders give Form W-8BEN (individuals) or W-8BEN-E (companies) to claim the US–UK treaty rate on US-source income. US citizens living in the UK give Form W-9 instead. We tell you which form applies, complete it correctly, and confirm whether any US return follows."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'W-8BEN & US Forms', href: '/services/us-expat-tax/w-8ben-us-withholding-forms' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-10-05"
      faqs={faqs}
      service={{
        url: URL,
        name: 'W-8BEN, W-8BEN-E and W-9 Preparation',
        description: 'Completion of US withholding certificates for UK residents, UK companies and US citizens in the UK, with treaty claims applied where the US–UK treaty allows.',
        serviceType: 'Tax Compliance',
      }}
      ctaTitle="Been asked for a W-8BEN, W-8BEN-E or W-9?"
      ctaIntro="Tell us who is asking and what the income is. We confirm the right form, complete it with the correct treaty claim, and tell you whether anything else follows — by email, with a written record."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                A <strong>W-8BEN</strong> request usually arrives from a US broker, a US client, a publisher or an online
                platform. It is not a tax return. It is a certificate the payer keeps on file so that it withholds US tax
                at the right rate, or not at all, on the income it pays you.
              </p>
              <p>
                The form that applies depends on who you are, not where you live. A <strong>UK resident who is not a US
                person</strong> gives a W-8BEN as an individual, or a <strong>W-8BEN-E</strong> for a UK company, and can
                claim the US–UK treaty rate on dividends, interest and royalties. A <strong>US citizen or green card holder
                living in the UK</strong> is still a US person and gives a <strong>W-9</strong>; a W-8BEN in their hands is
                a false certification.
              </p>
              <p>
                Getting it wrong costs money in both directions: 30% withheld that need not have been, or a treaty rate
                claimed on income it does not cover. We confirm the right form, complete the treaty article and
                limitation-on-benefits sections correctly, and check whether the income also needs a US return.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="W-8BEN at a glance"
                facts={[
                  { label: 'For', value: 'Non-US individuals' },
                  { label: 'Companies use', value: 'W-8BEN-E' },
                  { label: 'US persons use', value: 'W-9' },
                  { label: 'Default withholding', value: '30%' },
                  { label: 'Treaty rate, dividends', value: 'Usually 15%' },
                  { label: 'Valid until', value: 'End of 3rd year' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who needs this"
        items={[
          'UK residents with US brokerage accounts or US shares paying dividends',
          'UK freelancers, consultants and authors paid by US companies or platforms',
          'UK limited companies invoicing US customers or licensing IP to the US',
          'US citizens in the UK who have been sent a W-8BEN by mistake and need a W-9',
          'Beneficiaries of US estates, trusts or retirement accounts who are not US persons',
          'Anyone who has had 30% withheld and wants to know whether it was correct',
        ]}
      />

      <Section tone="white">
        <Container>
          <ComparisonTable data={formsCompared} />
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="From request to completed form"
        steps={[
          { title: 'Confirm your status', description: 'US person or not, individual or entity, and what the income is. This decides the form.' },
          { title: 'Apply the treaty', description: 'We identify the US–UK treaty article and rate that applies to that income, and complete the limitation-on-benefits section where required.' },
          { title: 'Complete and return', description: 'You receive the completed form to sign and give to the payer, with a note of when it expires.' },
          { title: 'Check what follows', description: 'We tell you whether the income also needs a US return or a UK disclosure, so nothing is missed later.' },
        ]}
      />

      <RelatedLinks
        title="Related services and guides"
        links={[
          { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns', description: 'For US citizens who need Form W-9 and a US return' },
          { label: 'US–UK Tax Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'The treaty articles behind the reduced rates' },
          { label: 'FATCA Compliance', href: '/services/us-expat-tax/fatca-compliance', description: 'Why a W-8BEN-E asks about FATCA' },
          { label: 'W-8BEN explained', href: '/resources/blog/w-8ben-explained-for-uk-residents', description: 'A plain-English guide to the form' },
        ]}
      />

      <Section tone="porcelain">
        <Container>
          <p className="max-w-prose text-sm text-muted">
            Withholding rates and treaty eligibility depend on the type of income and your circumstances; the figures above
            are the usual outcomes under the US–UK treaty, not a guarantee. If you are unsure whether you are a US person,
            read our guide to <Link href="/services/us-expat-tax/us-tax-returns" className="font-semibold text-navy-ink underline">US tax returns for Americans in the UK</Link> first.
          </p>
        </Container>
      </Section>
    </PageShell>
  );
}
