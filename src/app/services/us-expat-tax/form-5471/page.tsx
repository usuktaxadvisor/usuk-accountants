import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageShell, Section, Container,
  WhoItsFor, ProcessSteps, KeyFacts, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/us-expat-tax/form-5471';

export const metadata: Metadata = {
  title: 'Form 5471 for Americans Who Own a UK Company — Filing & Penalties',
  description:
    'US persons who own or control a foreign corporation such as a UK limited company may have to file Form 5471 with their US return. Learn who must file, the severe penalties for not filing, and how we handle it.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const faqs = [
  {
    q: 'What is Form 5471?',
    a: 'Form 5471 is the Information Return of US Persons With Respect to Certain Foreign Corporations. It is an information return — not a tax return — filed with your US tax return by US persons who own or control a foreign corporation, such as a UK limited company. It reports the company\u2019s existence, ownership and financial activity to the IRS.',
  },
  {
    q: 'Do I have to file Form 5471 for my UK limited company?',
    a: 'Possibly. If you are a US person who is an officer, director or significant shareholder of a UK limited company, you may fall into one of the Form 5471 filing categories. The requirement is based on your role and level of ownership or control, not on whether the company made a profit. Because the categories are detailed, this is something to confirm with a specialist rather than assume.',
  },
  {
    q: 'What are the penalties for not filing Form 5471?',
    a: 'They are severe. The IRS imposes a $10,000 penalty for each Form 5471 not filed on time, per foreign corporation, per year. If the failure continues after the IRS sends notice, further penalties accrue, up to a maximum of $60,000 per corporation per year. These penalties apply even if the company owed no tax.',
  },
  {
    q: 'Do I still have to file if my UK company made no profit?',
    a: 'Yes. Form 5471 is an information return triggered by your ownership of the entity, not by its profitability. A dormant or loss-making foreign corporation still requires a filing — and the same penalties apply for not filing it.',
  },
  {
    q: 'Why is not filing Form 5471 especially risky?',
    a: 'Beyond the direct penalties, failing to file Form 5471 generally keeps the statute of limitations on your entire US tax return open indefinitely — meaning that year can remain open to IRS review far longer than the usual window. It can also affect your foreign tax credits. This is why it is one of the filings we treat most carefully.',
  },
  {
    q: 'What is GILTI, and does it affect me?',
    a: 'GILTI (global intangible low-taxed income) and Subpart F are US rules that can tax certain income of a foreign corporation in the hands of its US owners, even before it is distributed. They frequently arise alongside Form 5471 for owners of UK companies and can be complex. We assess whether they apply as part of reviewing your position.',
  },
];

export default function Form5471() {
  return (
    <PageShell
      url={URL}
      eyebrow="US Expat Tax · Form 5471"
      title="Form 5471: Americans who own a foreign company"
      answer="Form 5471 is an information return that US persons who own or control a foreign corporation — such as a UK limited company — may have to file with their US tax return. The requirement is based on your role and ownership, not on whether the company made a profit, and the penalties for not filing are severe: a $10,000 base penalty per company per year, rising to as much as $60,000. Because the filing categories and related rules (including GILTI) are complex, this is specialist territory."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'Form 5471', href: '/services/us-expat-tax/form-5471' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-25"
      faqs={faqs}
      service={{
        url: URL,
        name: 'Form 5471 Preparation for US Owners of Foreign Companies',
        description: 'Assessing the Form 5471 filing obligation and preparing the return for US persons who own or control a UK or other foreign corporation.',
        serviceType: 'Tax Compliance',
      }}
      ctaTitle="Own a UK company and hold US citizenship?"
      ctaIntro="Form 5471 is one of the most heavily penalised filings in the US tax code — and easy to miss. Book a consultation and we'll confirm whether you need to file and protect you from the penalties."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
              <p>
                If you are a US citizen or green card holder who <strong>owns or controls a UK limited company</strong>
                {' '}— or sits as an officer or director of one — you may be required to file{' '}
                <strong>Form 5471</strong> with your US tax return. It is the{' '}
                <em>Information Return of US Persons With Respect to Certain Foreign Corporations</em>, and it is one
                of the filings American business owners abroad most often miss.
              </p>
              <p>
                The crucial point is that Form 5471 is an <strong>information return, not a tax return</strong>. You
                file it to report the company&rsquo;s existence, ownership and finances — regardless of whether the
                business made a penny of profit. The obligation is driven by your <strong>role and ownership</strong>,
                not by the company&rsquo;s performance. A dormant UK Ltd can still trigger it.
              </p>
              <p>
                And this is the filing where getting it wrong hurts most. The penalties are among the{' '}
                <strong>harshest in the US tax code</strong> — starting at $10,000 per company per year and climbing
                from there — and they apply <strong>even if no US tax was ever owed</strong>. That combination of
                low awareness and high penalty is exactly why it deserves specialist attention.
              </p>
            </div>
            <div className="lg:pt-2">
              <KeyFacts
                title="Form 5471 at a glance"
                facts={[
                  { label: 'Form', value: 'Form 5471' },
                  { label: 'Type', value: 'Information return' },
                  { label: 'Who', value: 'US owners/officers of a foreign co.' },
                  { label: 'Filed with', value: 'Your US tax return' },
                  { label: 'Base penalty', value: '$10,000 per co. per year' },
                  { label: 'Maximum', value: 'Up to $60,000 per co. per year' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        title="Who may need to file Form 5471"
        items={[
          'American founders and owners of UK limited companies',
          'Dual citizens who hold shares in a non-US company',
          'US persons who are directors or officers of a foreign corporation',
          'Green card holders with a significant stake in a UK or overseas business',
          'Anyone whose foreign company is dormant but still in existence',
          'US shareholders of a controlled foreign corporation (CFC)',
        ]}
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Why the penalties are so serious</h2>
            <p>
              The IRS imposes a <strong>$10,000 penalty for each Form 5471 not filed on time</strong>, per foreign
              corporation, per year. If the failure continues after the IRS sends a notice, further penalties accrue
              for each 30-day period — up to a maximum of <strong>$60,000 per corporation per year</strong>. Own two
              companies, or miss two years, and the exposure multiplies quickly.
            </p>
            <p>
              There is a quieter risk too: failing to file Form 5471 generally keeps the{' '}
              <strong>statute of limitations on your entire tax return open indefinitely</strong>. A year you would
              normally expect to &ldquo;close&rdquo; after the usual review window can stay open to the IRS for far
              longer — simply because one information form was missing.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">When it is triggered</h2>
            <p>
              Form 5471 has <strong>several filing categories</strong>, and which one applies depends on your exact
              role — officer, director or shareholder — and your level of ownership or control. The categories are
              detailed and overlapping, and the related rules (including <strong>GILTI</strong> and Subpart F, which
              can tax company income in your hands before it is even distributed) add real complexity. We deliberately
              do not try to reduce that to a checklist here: the right answer depends on your specific facts, and this
              is precisely the kind of filing where a confident DIY guess is dangerous. The sensible step is a short
              assessment of your position.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <div className="mx-auto max-w-prose space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            <h2 className="font-display text-2xl font-semibold text-ink">Common mistakes we see</h2>
            <p>
              The recurring ones: assuming a <strong>small or dormant UK Ltd doesn&rsquo;t count</strong> (it can);
              not filing because the company <strong>made no profit or owed no tax</strong> (irrelevant to an
              information return); <strong>overlooking the form entirely</strong> because a UK accountant, focused on
              UK filings, was never asked about US obligations; and being caught out by{' '}
              <strong>GILTI or Subpart F</strong> income that was never planned for. Each of these is avoidable with
              the right review.
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink">How it fits your wider US filing</h2>
            <p>
              Form 5471 sits alongside your{' '}
              <Link href="/services/us-expat-tax/us-tax-returns" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">US tax return</Link>, and often alongside{' '}
              <Link href="/services/us-expat-tax/fbar-filing" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">FBAR</Link>{' '}
              and{' '}
              <Link href="/services/us-expat-tax/fatca-compliance" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">FATCA</Link>{' '}
              reporting if the company or its accounts cross those thresholds. If you have already missed filings,{' '}
              <Link href="/services/us-expat-tax/streamlined-filing" className="font-semibold text-gold-antique underline underline-offset-2 hover:text-gold">Streamlined Filing</Link>{' '}
              is often the route to put it right without the full penalties.
            </p>
          </div>
        </Container>
      </Section>

      <ProcessSteps
        eyebrow="How we handle it"
        title="The obligation, assessed and handled properly"
        steps={[
          { title: 'Assess', description: 'We review your role, ownership and the company to determine whether — and under which category — you must file.' },
          { title: 'Check GILTI/Subpart F', description: 'We assess whether company income is taxable to you under GILTI or Subpart F, so there are no surprises.' },
          { title: 'Prepare', description: 'We prepare Form 5471 with the required schedules, filed with your US return and kept consistent with your other filings.' },
          { title: 'Fix the past if needed', description: 'If filings were missed, we advise on Streamlined or delinquent-return routes to limit or remove penalties.' },
        ]}
      />

      <RelatedLinks
        title="Further reading"
        links={[
          { label: 'Form 5471 explained for Americans', href: '/resources/blog/form-5471-explained-americans-uk', description: 'Filer categories, schedules and penalties' },
          { label: 'GILTI/NCTI rules for UK companies', href: '/resources/blog/gilti-ncti-rules-americans-uk-companies', description: 'Tax on your company\u2019s retained profits' },
        ]}
      />

      <RelatedLinks
        title="Related areas we handle"
        links={[
          { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns', description: 'The return Form 5471 attaches to' },
          { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing', description: 'Behind on 5471? The route back' },
          { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing', description: 'Report the company\u2019s foreign accounts' },
          { label: 'FATCA Compliance', href: '/services/us-expat-tax/fatca-compliance', description: 'Foreign-asset reporting on Form 8938' },
          { label: 'Dual Citizens', href: '/who-we-help/dual-citizens', description: 'US/UK dual-citizen tax guidance' },
          { label: 'US Citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'How we help Americans abroad' },
        ]}
      />
    </PageShell>
  );
}
