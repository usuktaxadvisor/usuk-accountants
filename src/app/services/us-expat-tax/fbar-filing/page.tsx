import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks, ComparisonTable,
} from '@/components/library';
import Link from 'next/link';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/fbar-filing';

export const metadata: Metadata = {
  title: 'FBAR Filing for Americans in the UK — FinCEN Form 114 Help',
  description:
    'US persons in the UK with foreign accounts over $10,000 must file an FBAR (FinCEN Form 114). Learn who must file, the deadline, common mistakes, and how we handle it — including back-filing missed years.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'Who has to file an FBAR?',
    a: 'Any US person — a US citizen (including dual citizens living abroad), green card holder, or someone meeting the substantial-presence test, as well as US entities — who has a financial interest in or signature authority over one or more foreign financial accounts, where the combined maximum value exceeded US$10,000 at any point during the calendar year.',
  },
  {
    q: 'Is the $10,000 threshold per account or in total?',
    a: 'In total. It is the aggregate of the highest balance each foreign account reached during the year, converted to US dollars. If the combined figure crossed $10,000 at any single moment — even briefly — every foreign account must be reported, including small ones.',
  },
  {
    q: 'When is the FBAR due?',
    a: 'The FBAR is due on 15 April, with an automatic extension to 15 October. You do not need to request the extension. It is filed electronically as FinCEN Form 114 through the BSA E-Filing System, separately from your federal tax return.',
  },
  {
    q: 'Does signature authority count even if I do not own the money?',
    a: 'Yes. If you can direct transactions on a foreign account — for example an employer, family or business account — that account can create an FBAR obligation for you once your reportable accounts cross the $10,000 aggregate, even though the funds are not yours.',
  },
  {
    q: 'What is the difference between the FBAR and Form 8938?',
    a: 'They are separate filings. The FBAR (FinCEN Form 114) goes to the US Treasury\u2019s Financial Crimes Enforcement Network and has a $10,000 aggregate threshold. Form 8938 is filed with the IRS as part of your tax return under FATCA and has higher thresholds that vary by filing status and whether you live abroad. Many Americans in the UK have to file both.',
  },
  {
    q: 'I have missed FBARs in previous years — what should I do?',
    a: 'Do not simply back-file without advice. The IRS Streamlined Filing Compliance Procedures exist for non-willful filers who have fallen behind and, handled correctly, can bring you current without penalties. This is exactly the kind of situation worth a consultation before you act.',
  },
];

const fbarVs8938 = {
  columns: ['', 'FBAR (FinCEN 114)', 'Form 8938 (FATCA)'],
  highlightColumn: 1,
  rows: [
    { label: 'Filed with', values: ['US Treasury (FinCEN)', 'IRS, with your tax return'] },
    { label: 'Threshold', values: ['$10,000 aggregate, any point in year', 'Higher; varies by status & residence'] },
    { label: 'How it is filed', values: ['Electronically via BSA E-Filing', 'Attached to Form 1040'] },
    { label: 'Deadline', values: ['15 Apr (auto-extends to 15 Oct)', 'With your return (incl. extensions)'] },
    { label: 'Counts signature authority', values: [true, false] },
    { label: 'Many UK-based Americans file', values: ['Yes', 'Often both'] },
  ],
};

export default function FbarFiling() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · FBAR Filing"
      title="FBAR filing for Americans in the UK"
      answer="If you are a US person living in the UK and the combined value of your non-US financial accounts exceeded US$10,000 at any point in the year, you must file an FBAR (FinCEN Form 114) with the US Treasury. It is an information report, not a tax — filed separately from your tax return, due 15 April with an automatic extension to 15 October. We handle current-year FBARs and help you catch up on missed years."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-25"
      faqs={faqs}
      service={{
        url: URL,
        name: 'FBAR Filing (FinCEN Form 114)',
        description: 'Preparation and e-filing of the FBAR for US persons in the UK, including back-filing of missed years.',
        serviceType: 'Tax Compliance',
      }}
      ctaTitle="Need to file an FBAR — or catch up on missed years?"
      ctaIntro="Book a confidential consultation. We'll confirm whether you need to file, for which years, and handle the whole submission."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                The <strong>FBAR</strong> — the Report of Foreign Bank and Financial Accounts, filed on{' '}
                <strong>FinCEN Form 114</strong> — catches a lot of Americans in the UK by surprise. The most
                important thing to understand is that it is <strong>not a tax form</strong>. You do not pay anything
                when you file it; it is an information report filed with the US Treasury&rsquo;s Financial Crimes
                Enforcement Network (FinCEN), separately from your federal tax return.
              </p>
              <p>
                You generally must file if you are a US person — a US citizen, including dual citizens, a green card
                holder, or a US tax resident — and the <strong>combined value of your foreign financial accounts
                exceeded US$10,000 at any point</strong> during the calendar year. The threshold is an aggregate
                figure, not per account, and it is measured at the highest balance each account reached during the
                year.
              </p>
              <p>
                For Americans in the UK, the accounts that trigger this are usually ordinary ones: current and
                savings accounts, cash ISAs, UK investment accounts, and many UK pensions. Joint accounts held with
                a non-US spouse, and accounts you can merely operate — such as an employer or family account — can
                count too.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="FBAR at a glance"
                facts={[
                  { label: 'Form', value: 'FinCEN 114' },
                  { label: 'Threshold', value: '$10,000 aggregate' },
                  { label: 'Measured', value: 'Highest balance, any point' },
                  { label: 'Deadline', value: '15 Apr \u2192 15 Oct' },
                  { label: 'Filed with', value: 'US Treasury (FinCEN)' },
                  { label: 'A tax?', value: 'No \u2014 information report' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who needs to file an FBAR"
        items={[
          'US citizens living in the UK, including "accidental Americans" and dual citizens',
          'Green card holders and others who are US tax residents',
          'Anyone with UK accounts — current, savings, ISAs, investments — over $10,000 combined',
          'People with signature authority over an employer, family or business account',
          'Those who hold joint UK accounts with a non-US spouse',
          'US persons who have missed FBARs in prior years and need to catch up',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">When it is required, and the deadline</h2>
            <p>
              The FBAR is an annual report covering the previous calendar year. It is due on <strong>15 April</strong>,
              with an <strong>automatic extension to 15 October</strong> — you do not need to request the extension or
              file any form to receive it. It is submitted electronically through the BSA E-Filing System, never with
              your tax return.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The most frequent errors are assuming only large accounts count (the $10,000 test is the{' '}
              <strong>combined</strong> total, so several small accounts can cross it); forgetting accounts you only
              have <strong>signature authority</strong> over; overlooking accounts that were closed mid-year; and
              assuming that filing a US tax return somehow covers the FBAR — it does not, as the two are entirely
              separate filings.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">FBAR vs Form 8938 (FATCA)</h2>
            <p>
              These are the two most commonly confused filings. Many Americans in the UK have to file{' '}
              <strong>both</strong>, because they serve different agencies and have different thresholds.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <ComparisonTable data={fbarVs8938} />
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="From uncertainty to filed, without the stress"
        steps={[
          { title: 'Assess', description: 'We confirm whether you need to file, for the current year and any missed years, and which accounts are reportable.' },
          { title: 'Gather', description: 'We help you identify every reportable account and its highest balance, converted to US dollars correctly.' },
          { title: 'Prepare', description: 'We prepare the FBAR — and, where needed, Form 8938 — accurately and consistently with your tax return.' },
          { title: 'File & record', description: 'We e-file through the BSA system and give you a clean record of what was filed and when.' },
        ]}
      />

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Behind on past years?</h2>
            <p>
              If you should have been filing FBARs and have not, <strong>do not simply back-file</strong> on your own.
              The IRS <strong>Streamlined Filing Compliance Procedures</strong> exist for non-willful taxpayers who
              have fallen behind and, handled correctly, can bring you current — typically three years of returns and
              six years of FBARs — without penalties. The right route depends on your specific facts, which is exactly
              why it is worth a conversation before you act.
            </p>
            <p className="text-[15px]">
              Not sure if you even need to file?{' '}
              <Link href="/resources/calculators/fbar-checker" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Use our free FBAR checker</Link>{' '}
              to walk through the triggers in under a minute.
            </p>
          </div>
        </Container>
      </Section>

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'FBAR Checker', href: '/resources/calculators/fbar-checker', description: 'Free tool: do you need to file?' },
          { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing', description: 'Catch up on missed years penalty-free' },
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'Our full US tax service for the UK' },
          { label: 'US Citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'How we help Americans abroad' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen tax guidance' },
          { label: 'US Tax Deadlines', href: '/resources/calculators/us-expat-deadlines', description: 'Your key dates this year' },
        ]}
      />
    </PageShell>
  );
}
