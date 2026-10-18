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
  ComparisonTable,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const url = '/resources/guides/delinquent-fbar';

export const metadata: Metadata = {
  title: 'Delinquent FBAR Guide — How to File Late FBARs (2026)',
  description:
    'How to file late FBARs from the UK after the IRS withdrew the Delinquent FBAR Submission Procedures in July 2026: your three routes, reasonable cause, penalties and what the reason for late filing should say.',
  alternates: { canonical: url },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

const faqs = [
  {
    q: 'Do the Delinquent FBAR Submission Procedures still exist?',
    a: 'No. The IRS removed the Delinquent FBAR Submission Procedures from its website on 1 July 2026 without announcement. Its FBAR page (last updated 30 July 2026) now says that filing an FBAR late or not at all is a violation that may attract penalties, and that anyone who has not been contacted by the IRS should file late FBARs as soon as possible. Reasonable-cause relief and the Streamlined procedures remain available.',
  },
  {
    q: 'What should I do if I have missed FBARs but reported all my income?',
    a: 'File the missed FBARs electronically through the FinCEN BSA E-Filing System, choose the reason for filing late on the form, and keep a dated, factual reasonable-cause note on file. A penalty is not automatic: the IRS assesses FBAR penalties only after an examination, and its own manual says a non-willful penalty should not be imposed where there was reasonable cause and accurate late FBARs are filed. Take advice first if balances were large, the accounts were not on your returns, or the IRS has already written to you.',
  },
  {
    q: 'What if I also failed to report the income from the accounts?',
    a: 'Then simply filing late FBARs is not enough. Where your conduct was non-willful and you meet the non-residency requirement, the Streamlined Foreign Offshore Procedures let you file three years of returns and six years of FBARs with a signed non-willful certification (Form 14653), and the IRS states it will not assert FBAR or late-filing penalties on a qualifying submission.',
  },
  {
    q: 'Is there an FBAR late-filing cover letter or sample letter?',
    a: 'There is no cover letter to post. The FinCEN e-filing form asks why the report is late, with a list of reasons or an "Other" box for a short written explanation. That explanation, plus a reasonable-cause note you keep on file, is the written record. We do not recommend copying a template: the statement must describe your own facts accurately.',
  },
  {
    q: 'How many years of late FBARs should I file?',
    a: 'Every year for which an FBAR was required and not filed, within the six-year statute of limitations for FBAR penalties. Under the Streamlined procedures the look-back is fixed at the six most recent years whose due dates have passed. Which years are "required" depends on whether your combined non-US account balances exceeded $10,000 at any point in each year.',
  },
  {
    q: 'What are the FBAR penalties?',
    a: 'For penalties assessed from 17 January 2025, the inflation-adjusted maximum is $16,536 per non-willful violation and, for willful violations, the greater of $165,353 or 50% of the account balance at the time of the violation (31 CFR 1010.821). Following the Supreme Court decision in Bittner v United States (2023), a non-willful penalty applies per late report, not per account. Criminal penalties are possible for willful cases.',
  },
  {
    q: 'Should I talk to an accountant before filing a late FBAR?',
    a: 'If the only issue is a missed report and the income was on your returns, many people file themselves. Speak to a cross-border specialist first if income was unreported, you are unsure which UK accounts count (pensions, ISAs, joint accounts, business accounts you can sign on), balances were large, or the IRS or FinCEN has contacted you. Choosing the wrong route is the mistake that costs money, not the filing itself.',
  },
];

const routesTable = {
  columns: ['File late with reasonable cause', 'Streamlined Foreign Offshore', 'Voluntary Disclosure Practice'],
  rows: [
    { label: 'Who it suits', values: ['Income reported and tax paid; only the FBAR was missed', 'Income or forms also missed; conduct non-willful; lived outside the US', 'Conduct may have been willful; possible criminal exposure'] },
    { label: 'What you file', values: ['Late FBARs via FinCEN with the reason for late filing', '3 years of returns, 6 years of FBARs, Form 14653 certification, tax and interest', 'Pre-clearance to IRS Criminal Investigation, then full disclosure'] },
    { label: 'Penalty position', values: ['No automatic penalty; relief depends on reasonable cause and the facts', 'No FBAR, failure-to-file, failure-to-pay or accuracy penalties on a qualifying submission', 'Negotiated penalties, typically significant'] },
    { label: 'Primary source', values: ['IRS FBAR page; IRM 4.26.16', 'IRS Streamlined Foreign Offshore page (updated 11 Jul 2026)', 'IRS Voluntary Disclosure Practice'] },
  ],
};

export default function DelinquentFbarGuidePage() {
  return (
    <PageShell
      url={url}
      eyebrow="Guide · Updated October 2026"
      title="Delinquent FBAR: how to file late FBARs the right way"
      answer="The IRS withdrew its Delinquent FBAR Submission Procedures on 1 July 2026. Late FBARs can still be filed through FinCEN, and reasonable-cause relief and the Streamlined procedures remain — but the route you choose now matters more than it did."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Guides', href: '/resources/guides' },
        { label: 'Delinquent FBAR', href: url },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2025-01-15"
      dateModified="2026-10-18"
      faqs={faqs}
      ctaTitle="Not sure which route applies to you?"
      ctaIntro="Tell us by email which years you think are missing and whether the income was on your US returns. We will say which route fits and quote in writing before any work begins."
    >
      <ProseBlock eyebrow="What changed" title="The July 2026 change, in plain English">
        <p>
          For twelve years the IRS published a short page called the <em>Delinquent FBAR Submission Procedures</em>.
          It told taxpayers who had reported all their income and paid the tax, but simply never filed the FBAR, that
          they could e-file the missed reports with a brief explanation and the IRS would not impose a penalty. On
          1 July 2026 that page was removed from irs.gov without a press release. The IRS FBAR page, last updated on
          30 July 2026, now says only that filing late or not at all &ldquo;is a violation and may subject you to
          penalties,&rdquo; that assertion of penalties &ldquo;depends on facts and circumstances,&rdquo; and that if
          the IRS has not contacted you, you should file late FBARs as soon as possible to keep potential penalties to
          a minimum.
        </p>
        <p>
          <strong>What has not changed:</strong> the FBAR itself (FinCEN Form 114), the $10,000 aggregate threshold,
          the 15 April due date with an automatic extension to 15 October, the FinCEN e-filing form&rsquo;s box for
          the reason a report is late, the statutory reasonable-cause defence to a non-willful penalty, and the
          Streamlined Filing Compliance Procedures. The Internal Revenue Manual (IRM 4.26.16) still instructs
          examiners not to assert a penalty where a late report was non-willful, due to reasonable cause, and the
          account was properly reported on the late FBAR.
        </p>
        <p>
          <strong>What it means in practice:</strong> the written assurance of &ldquo;no penalty&rdquo; is gone. Filing
          late FBARs is still the right thing to do, and a penalty is not automatic, but your reasonable-cause
          position now has to stand on its own. That makes the explanation you give, and the record you keep, more
          important than before.
        </p>
      </ProseBlock>

      <Section>
        <Container>
          <WhoItsFor
            title="This guide is for you if"
            items={[
              'You are a US citizen or green card holder in the UK who has just learned that UK accounts must be reported on an FBAR',
              'Your combined non-US accounts — current accounts, savings, ISAs, some pensions, joint and business accounts — exceeded $10,000 in a past year',
              'You want to become compliant before the IRS or FinCEN contacts you, and you want to choose the right route first time',
            ]}
          />
        </Container>
      </Section>

      <ProseBlock eyebrow="Your options" title="The three routes that remain" tone="porcelain">
        <p>
          Which route applies turns on one question: <strong>was the income from these accounts on your US returns,
          and was the tax paid?</strong> If yes, your problem is a missing information report. If no, you have a
          tax problem as well as a reporting problem, and a different procedure applies.
        </p>
        <div className="not-prose">
          <ComparisonTable data={routesTable} />
        </div>
        <p className="text-sm">
          The Streamlined Foreign Offshore route is only available to people who meet the IRS non-residency requirement:
          in at least one of the three most recent years whose return due date has passed, you had no US abode and were
          physically outside the US for at least 330 full days. Most Americans settled in the UK meet it. It is not
          available once the IRS has opened an examination of any year or you are under criminal investigation.
        </p>
      </ProseBlock>

      <ProseBlock eyebrow="Reasonable cause" title="What the 'reason for late filing' should say">
        <p>
          There is no separate cover letter to post. When a late FBAR is e-filed through FinCEN&rsquo;s BSA E-Filing
          System, the form itself asks for the reason it is late: you choose from a list (for example, that you did not
          know you had to file) or select &ldquo;Other&rdquo; and give a short written explanation. That box is the
          only explanation FinCEN sees. Searches for a &ldquo;delinquent FBAR cover letter&rdquo; or &ldquo;sample
          letter&rdquo; usually end in templates written for the old procedure; we do not recommend copying one.
        </p>
        <p>
          Keep the explanation factual and short: what the accounts are, why the filing was missed, and that you have
          now filed every year that was due. Separately, write and date a fuller <strong>reasonable-cause note</strong>
          for your own file, which you would produce only if the IRS ever asked. Reasonable cause is about your facts:
          when and how you learned of the requirement, whether you relied on an adviser who did not raise it, that the
          income was on your returns, and that you acted promptly once you knew. Do not argue the law, do not overstate,
          and do not leave out a year to make the picture look tidier. An inaccurate statement is far more damaging than
          a late one.
        </p>
      </ProseBlock>

      <ProseBlock eyebrow="A common question" title="Should you talk to an accountant before filing a late FBAR?" tone="porcelain">
        <p>
          If your only issue is missed FBARs and your returns reported all the income, many people file the late
          reports themselves using the steps below. Speak to a cross-border specialist first if any of these apply:
          income from the accounts was not on your returns (late FBARs alone will not fix that and{' '}
          <Link href="/services/us-expat-tax/streamlined-filing">Streamlined Filing</Link> is the usual route);
          you are unsure which UK accounts count &mdash; workplace pensions and SIPPs, ISAs, joint accounts with a
          non-US spouse, or a company account you can sign on; the balances were large; or the IRS or FinCEN has
          already written to you. Since July 2026 the cost of choosing the wrong route is higher, because there is no
          longer a published safe harbour to fall back on.
        </p>
      </ProseBlock>

      <Section>
        <Container>
          <ProcessSteps
            eyebrow="The process"
            title="Filing late FBARs step by step"
            steps={[
              { title: '1. Check the income was reported', description: 'Confirm that interest, dividends, pension growth and other income from each account appeared on your US returns for the years concerned. If it did not, stop here and read the Streamlined section below.' },
              { title: '2. Identify the years and accounts', description: 'For each year, list every non-US account you owned, co-owned or could sign on, with its highest balance in that year converted to US dollars at the Treasury year-end rate. An FBAR was due for any year the combined total exceeded $10,000.' },
              { title: '3. Write the reasonable-cause note', description: 'Date it, keep it factual, and store it with your tax records. It is your evidence if a question is ever raised.' },
              { title: '4. E-file through FinCEN', description: 'File one FinCEN Form 114 per missed year through the BSA E-Filing System, selecting the reason for late filing on each. Keep the confirmation numbers.' },
              { title: '5. Stay current', description: 'Diarise 15 April (automatic extension to 15 October) for every future year, and review Form 8938 as well: it is a separate report with higher thresholds.' },
            ]}
          />
        </Container>
      </Section>

      <ProseBlock eyebrow="If income was unreported" title="When Streamlined Filing is the right route">
        <p>
          If any of the accounts produced income that was not on your US returns, or you never filed US returns at all,
          the IRS Streamlined Foreign Offshore Procedures are designed for exactly that situation, provided your conduct
          was non-willful: negligence, inadvertence, mistake or a good-faith misunderstanding of the law. You file the
          three most recent years of returns (or amended returns) with any missing information returns such as Forms
          8938, 3520 or 5471, the six most recent years of FBARs, a signed Form 14653 certifying non-willful conduct,
          and the tax and interest due. The IRS states that a qualifying submission is not subject to failure-to-file,
          failure-to-pay, accuracy-related, information-return or FBAR penalties. The procedures remain open as of
          October 2026, but the IRS can change or end them at any time, which is a reason not to wait. Our{' '}
          <Link href="/services/us-expat-tax/streamlined-filing">Streamlined Filing service</Link> explains what we
          prepare and how the engagement runs.
        </p>
      </ProseBlock>

      <ProseBlock eyebrow="Penalties" title="What is actually at stake" tone="porcelain">
        <p>
          FBAR penalties are civil penalties under 31 U.S.C. 5321, assessed by the IRS after an examination; they are not
          triggered automatically by a late filing. For penalties assessed from 17 January 2025 the inflation-adjusted
          maximums are <strong>$16,536 per non-willful violation</strong> and, for willful violations, the greater of
          <strong> $165,353 or 50% of the account balance</strong> at the time of the violation (31 CFR 1010.821). In
          <em> Bittner v United States</em> (2023) the Supreme Court held that the non-willful penalty applies per late
          report, not per account. The statute gives the IRS six years from the violation date to assess a penalty.
          Willful failures can also be prosecuted. For a late report filed voluntarily, with the income reported and a
          genuine reason, the realistic exposure is low; the exposure rises with unreported income, large balances and
          any sign that the omission was a choice.
        </p>
      </ProseBlock>

      <ProseBlock eyebrow="UK accounts" title="Which UK accounts go on an FBAR">
        <p>
          The FBAR covers financial accounts held outside the US: UK current and savings accounts, cash ISAs and stocks
          and shares ISAs, brokerage and investment accounts, premium bonds held in an NS&amp;I account, cash-value life
          policies, and accounts you do not own but can sign on, such as an employer&rsquo;s or a relative&rsquo;s.
          Joint accounts with a non-US spouse are reported in full. UK workplace pensions and SIPPs are widely treated as
          reportable accounts in practice, and we report them; the alternative view is not one we recommend relying on.
          Each balance is converted at the US Treasury year-end exchange rate for the year reported. Our{' '}
          <Link href="/resources/calculators/fbar-checker">FBAR checker</Link> walks through the threshold test.
        </p>
      </ProseBlock>

      <Section>
        <Container>
          <KeyFacts
            title="At a glance"
            facts={[
              { label: 'Form', value: 'FinCEN Form 114 (FBAR)' },
              { label: 'Filed with', value: 'FinCEN BSA E-Filing System' },
              { label: 'Threshold', value: 'Combined non-US accounts over $10,000 at any time in the year' },
              { label: 'Due date', value: '15 April; automatic extension to 15 October' },
              { label: 'Old safe harbour', value: 'Delinquent FBAR Submission Procedures — withdrawn 1 July 2026' },
              { label: 'If income unreported', value: 'Streamlined Foreign Offshore Procedures' },
              { label: 'Non-willful penalty', value: 'Up to $16,536 per report (2025 adjustment)' },
            ]}
          />
        </Container>
      </Section>

      <ProseBlock eyebrow="Sources" title="Primary sources used for this guide">
        <ul className="list-disc space-y-2 pl-5 text-[15px]">
          <li>IRS, <a href="https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar" rel="noopener" target="_blank">Report of Foreign Bank and Financial Accounts (FBAR)</a> — page last reviewed or updated 30 July 2026.</li>
          <li>IRS, <a href="https://www.irs.gov/individuals/international-taxpayers/us-taxpayers-residing-outside-the-united-states" rel="noopener" target="_blank">US taxpayers residing outside the United States (Streamlined Foreign Offshore Procedures)</a> — updated 11 July 2026.</li>
          <li>IRS, <a href="https://www.irs.gov/irm/part4/irm_04-026-016" rel="noopener" target="_blank">Internal Revenue Manual 4.26.16</a>, Report of Foreign Bank and Financial Accounts, in particular 4.26.16.3.11 and 4.26.16.5.4.</li>
          <li>US Treasury, <a href="https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1010/subpart-H/section-1010.821" rel="noopener" target="_blank">31 CFR 1010.821</a>, penalty adjustment table (penalties assessed on or after 17 January 2025).</li>
          <li>FinCEN, BSA E-Filing System and the FinCEN Form 114 instructions (reason for late filing).</li>
          <li><em>Bittner v United States</em>, 598 U.S. 85 (2023).</li>
        </ul>
        <p className="text-sm">
          This guide is general information for US persons living in the UK, written on 18 October 2026. It is not
          advice on your circumstances. US tax years are calendar years; FBAR penalty amounts are adjusted for inflation
          and should be checked against the current table before relying on them.
        </p>
      </ProseBlock>

      <Section>
        <Container>
          <RelatedLinks
            title="Related tools and pages"
            links={[
              { label: 'FBAR filing service', href: '/services/us-expat-tax/fbar-filing', description: 'Preparation and e-filing of current and late FBARs.' },
              { label: 'Streamlined Filing service', href: '/services/us-expat-tax/streamlined-filing', description: 'For non-willful cases with unreported income.' },
              { label: 'FBAR checker', href: '/resources/calculators/fbar-checker', description: 'Check whether you need to file an FBAR at all.' },
              { label: 'Streamlined Filing vs late FBAR filing', href: '/resources/compare/streamlined-filing-vs-delinquent-fbar', description: 'The two catch-up routes, side by side.' },
              { label: 'FBAR vs Form 8938', href: '/resources/compare/fbar-vs-form-8938', description: 'Two separate reports with different thresholds.' },
              { label: 'All US–UK tax guides', href: '/resources/guides', description: 'Every step-by-step guide and comparison in one place.' },
            ]}
          />
        </Container>
      </Section>
    </PageShell>
  );
}
