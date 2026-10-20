import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell,
  Section,
  Container,
  ProseBlock,
  ProcessSteps,
  KeyFacts,
  WhoItsFor,
  RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const url = '/resources/guides/fbar-late-filing-explanation';

export const metadata: Metadata = {
  title: 'FBAR Late Filing Explanation: What to Write (2026)',
  description:
    'There is no FBAR cover letter. The FinCEN form asks why the report is late, with a list of reasons and a 750 character "Other" box. What to choose, what to write, two worked examples, and what to keep on file.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const faqs = [
  {
    q: 'Do I need a cover letter to file a late FBAR?',
    a: 'No. The FBAR is e-filed through the FinCEN BSA E-Filing System and nothing is posted. The form itself asks why the report is late. You pick a reason from a list or choose "Other" and type a short explanation. That box is the only explanation FinCEN receives, so there is no letter to attach.',
  },
  {
    q: 'What are the reasons for late filing on FinCEN Form 114?',
    a: 'The form offers a drop down list of standard reasons, such as not knowing that a report was required, and an "Other" option. The Internal Revenue Manual (IRM 4.26.16.3.11) notes that "Other" opens a text box of up to 750 characters. If one of the listed reasons is accurate for you, choose it. Use "Other" only when none of them describes your facts.',
  },
  {
    q: 'What should the explanation say?',
    a: 'Four things, in plain words: what the accounts are, why the report was not filed on time, how and when you found out, and that you have now filed every year that was due. Keep it to the facts. Do not argue the law, do not overstate, and do not leave out a year.',
  },
  {
    q: 'Is the explanation the same as reasonable cause?',
    a: 'No. The box on the form is a short statement of why the report is late. Reasonable cause is the legal standard the IRS applies if it ever considers a penalty, and it is judged on all the facts. Write a fuller, dated reasonable cause note for your own records at the same time, and keep it with your tax papers. You would produce it only if the IRS asked.',
  },
  {
    q: 'Is this the same as the Streamlined certification?',
    a: 'No. The Streamlined Foreign Offshore Procedures require a separate signed statement, Form 14653, explaining why your conduct was non willful. That is a longer narrative signed under penalties of perjury and it goes to the IRS with three years of returns and six years of FBARs. The box on the FBAR form is a different, much shorter thing. If income from the accounts was never reported, Streamlined is the route, not a late FBAR on its own.',
  },
  {
    q: 'Should I talk to an accountant before I write it?',
    a: 'If the income from the accounts was on your US returns and you simply missed the report, many people write the explanation and file themselves. Take advice first if income was not reported, if balances were large, if you are unsure which UK accounts count (pensions, ISAs, joint or business accounts), or if the IRS or FinCEN has already written to you. The wording is rarely the problem; choosing the wrong route is.',
  },
];

export default function FbarLateFilingExplanationPage() {
  return (
    <PageShell
      url={url}
      eyebrow="Guide · October 2026"
      title="FBAR late filing explanation: what to write in the reason box"
      answer="There is no cover letter for a late FBAR. When you e-file FinCEN Form 114 late, the form asks why. You choose a reason from a list, or select Other and type an explanation of up to 750 characters. Keep it factual, cover every year, and keep a fuller reasonable cause note for your own file."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Guides', href: '/resources/guides' },
        { label: 'FBAR late filing explanation', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-10-20"
      faqs={faqs}
      ctaTitle="Not sure what your explanation should say?"
      ctaIntro="Email us which years are missing and whether the income was on your US returns. We will tell you which route applies and what the statement needs to cover, and quote in writing before any work begins."
    >
      <ProseBlock eyebrow="The form itself" title="Where the explanation goes">
        <p>
          People search for an &ldquo;FBAR cover letter&rdquo; or a &ldquo;late filing sample letter&rdquo; because the
          old IRS procedure talked about giving a reason. Since July 2026 that IRS page no longer exists, and the
          mechanics have not changed in any case: the explanation lives <strong>inside the FBAR form</strong>, not in a
          letter. When you file FinCEN Form 114 through the BSA E-Filing System after the due date, page one asks for
          the reason the report is late. You select one of the listed reasons, or you select &ldquo;Other&rdquo; and
          type your own. The Internal Revenue Manual (IRM 4.26.16.3.11) describes the &ldquo;Other&rdquo; option as a
          750 character text box.
        </p>
        <p>
          That box is the only explanation FinCEN receives with the report. The same manual section tells IRS examiners
          that a penalty will not be asserted for an account where the failure to report it on time was not willful,
          was due to reasonable cause, and the account was properly reported on the delinquent FBAR. The manual is
          internal guidance and can change; it is not a promise. But it tells you what the explanation is for: to show,
          briefly and truthfully, that the lateness was a genuine mistake and that you have now put it right.
        </p>
      </ProseBlock>

      <Section>
        <Container>
          <WhoItsFor
            title="This guide is for you if"
            items={[
              'You have worked out that you should have filed an FBAR for one or more past years and are about to file them',
              'The income from those accounts was on your US returns, so your problem is the missing report, not unreported income',
              'You are filing through the FinCEN system yourself, or you want to understand what we will write on your behalf',
            ]}
          />
        </Container>
      </Section>

      <ProseBlock eyebrow="Choosing a reason" title="Pick a listed reason if one is true" tone="porcelain">
        <p>
          The list on the form covers the ordinary reasons a report is missed, including not knowing that you had to file,
          believing the accounts were under the threshold, or not realising that a particular account counted as foreign.
          If one of those describes your situation accurately, select it. A listed reason needs no extra wording, and an
          accurate short answer is better than a long one.
        </p>
        <p>
          Choose &ldquo;Other&rdquo; when your facts do not fit the list, or when more than one reason applies and you
          want the record to be complete. Two situations where &ldquo;Other&rdquo; is usually right: you relied on an
          adviser who never raised the FBAR, or you only learned that UK pensions, ISAs or a joint account counted when
          you changed accountant.
        </p>
      </ProseBlock>

      <ProseBlock eyebrow="What to write" title="The four things a good explanation contains">
        <p>
          <strong>1. What the accounts are.</strong> Ordinary UK current and savings accounts, an ISA, a workplace pension,
          a joint account with a non US spouse. One line.
        </p>
        <p>
          <strong>2. Why the report was missed.</strong> The real reason, in one or two sentences. You did not know a
          report was required. You believed the combined balances were under $10,000. Your previous adviser did not raise
          it. You did not realise a UK pension counted.
        </p>
        <p>
          <strong>3. How and when you found out.</strong> The event that changed things, with a month and year. You
          engaged a cross border accountant in a given month. You read about it when applying for a mortgage. A bank
          asked for a US tax form.
        </p>
        <p>
          <strong>4. What you have done about it.</strong> That you have now filed every year that was due, that the
          income from the accounts was reported on your US returns, and that you will file on time from now on.
        </p>
        <p>
          Written out, that is three to five sentences and comfortably inside 750 characters. It should read like a
          person explaining what happened, not like a legal submission.
        </p>
      </ProseBlock>

      <ProseBlock eyebrow="Worked examples" title="Two examples of the shape, not a template to copy" tone="porcelain">
        <p>
          These show the structure. The facts are invented. Yours must be your own, and if a sentence here is not true of
          you, it does not belong in your statement.
        </p>
        <p>
          <em>Example A, did not know.</em> &ldquo;I am a US citizen living in the UK since 2019. The accounts are my UK
          current and savings accounts and an ISA. I did not know that non US accounts had to be reported to FinCEN
          until my new accountant explained the requirement in September 2026. The interest from the accounts was
          included on my US returns for each year. I have now filed the FBARs for 2020 to 2025 and will file on time in
          future.&rdquo;
        </p>
        <p>
          <em>Example B, pension and joint account not counted.</em> &ldquo;I filed FBARs for my UK bank accounts each
          year but did not include my UK workplace pension or the joint account I hold with my British wife, because I
          understood neither counted. I learned otherwise in August 2026 when I changed accountant. I have filed amended
          FBARs for 2021 to 2025 including all accounts. All income from the accounts was reported on my US returns.&rdquo;
        </p>
        <p>
          Each is under 600 characters, names the accounts, gives the reason and the date of discovery, and confirms
          that the gap is closed.
        </p>
      </ProseBlock>

      <ProseBlock eyebrow="What to leave out" title="Five things that make a statement worse">
        <p>
          <strong>Arguing the law.</strong> The box is for facts. Citing cases or the Bank Secrecy Act does not help and
          reads as if you had something to defend.
        </p>
        <p>
          <strong>Blaming others at length.</strong> Saying an adviser never raised it is a fact worth stating. A
          paragraph about how unreasonable that was is not.
        </p>
        <p>
          <strong>Saying more than you know.</strong> Do not state that balances were under a threshold unless you have
          checked. An inaccurate statement is far more damaging than a late one.
        </p>
        <p>
          <strong>Leaving a year out</strong> to make the picture tidier. File every year that was due and say so.
        </p>
        <p>
          <strong>Copying a template.</strong> Most sample letters online were written for the old IRS procedure and
          describe someone else&rsquo;s facts. A statement that does not match your own records is the one thing that
          can turn a routine late filing into a question.
        </p>
      </ProseBlock>

      <ProseBlock eyebrow="Your own file" title="Write a fuller reasonable cause note and keep it" tone="porcelain">
        <p>
          The 750 characters on the form are a summary. On the same day, write a dated note for your own records that
          tells the whole story: the accounts and their highest balances by year, when and how you learned of the
          requirement, who advised you and what they said, which years were filed and when, and that the income was on
          your returns. Store it with your tax papers. This is the document you would produce if the IRS ever asked why
          the reports were late, and the reasonable cause standard is judged on exactly these facts. Nobody can promise
          that a late report escapes a penalty, but a clear, contemporaneous record is the strongest position you can
          hold.
        </p>
      </ProseBlock>

      <Section>
        <Container>
          <ProcessSteps
            eyebrow="In order"
            title="Writing and filing the late FBAR"
            steps={[
              { title: '1. Confirm the income was reported', description: 'Check that interest, dividends and any pension growth from each account appeared on your US returns. If not, stop: the Streamlined Foreign Offshore Procedures are the route, and the statement you need is Form 14653, not this box.' },
              { title: '2. List the years and accounts', description: 'For each missed year, every non US account you owned, co owned or could sign on, with its highest balance converted to dollars at the Treasury year end rate. An FBAR was due for any year the combined total exceeded $10,000.' },
              { title: '3. Draft the explanation', description: 'Four elements, three to five sentences, under 750 characters. Read it back against your records.' },
              { title: '4. Write the reasonable cause note', description: 'The fuller, dated version for your own file.' },
              { title: '5. E-file each year through FinCEN', description: 'One FinCEN Form 114 per missed year, selecting the reason or entering the explanation on each. Keep every confirmation number.' },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <KeyFacts
            title="At a glance"
            facts={[
              { label: 'Cover letter', value: 'None. The explanation is a box on the form' },
              { label: 'Where', value: 'FinCEN Form 114, page one, reason for filing late' },
              { label: 'Options', value: 'Listed reasons, or "Other" with a text box' },
              { label: 'Length', value: 'Up to 750 characters (IRM 4.26.16.3.11)' },
              { label: 'Keep on file', value: 'A dated reasonable cause note with the full facts' },
              { label: 'If income unreported', value: 'Streamlined route and Form 14653 instead' },
            ]}
          />
        </Container>
      </Section>

      <ProseBlock eyebrow="Sources" title="Primary sources used for this guide">
        <ul className="list-disc space-y-2 pl-5 text-[15px]">
          <li>IRS, <a href="https://www.irs.gov/irm/part4/irm_04-026-016" rel="noopener" target="_blank">Internal Revenue Manual 4.26.16</a>, Report of Foreign Bank and Financial Accounts (manual transmittal 26 August 2025), section 4.26.16.3.11 on delinquent FBAR filing and the reason for late filing.</li>
          <li>IRS, <a href="https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar" rel="noopener" target="_blank">Report of Foreign Bank and Financial Accounts (FBAR)</a>, last updated 30 July 2026.</li>
          <li>IRS, <a href="https://www.irs.gov/individuals/international-taxpayers/us-taxpayers-residing-outside-the-united-states" rel="noopener" target="_blank">Streamlined Foreign Offshore Procedures</a>, updated 11 July 2026, and Form 14653.</li>
          <li>FinCEN, BSA E-Filing System and the FinCEN Form 114 instructions.</li>
        </ul>
        <p className="text-sm">
          This guide is general information for US persons living in the UK, written on 20 October 2026. It is not
          advice on your circumstances and the examples are illustrations of structure, not statements to copy.
        </p>
      </ProseBlock>

      <Section>
        <Container>
          <RelatedLinks
            title="Related guides and services"
            links={[
              { label: 'Delinquent FBAR guide', href: '/resources/guides/delinquent-fbar', description: 'The three routes after the IRS removed its procedures page, penalties, and which UK accounts count.' },
              { label: 'FBAR filing service', href: '/services/us-expat-tax/fbar-filing', description: 'Preparation and e-filing of current, late and amended FBARs.' },
              { label: 'Streamlined Filing service', href: '/services/us-expat-tax/streamlined-filing', description: 'For non willful cases where income was also unreported.' },
              { label: 'How to amend an FBAR', href: '/resources/blog/how-to-amend-an-fbar', description: 'When an account was left off a report you did file.' },
              { label: 'FBAR checker', href: '/resources/calculators/fbar-checker', description: 'Work through the $10,000 threshold test.' },
            ]}
          />
        </Container>
      </Section>
    </PageShell>
  );
}
