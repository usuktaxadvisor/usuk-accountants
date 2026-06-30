import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ProseBlock, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/guides/tax-deadlines-calendar';

export const metadata: Metadata = {
  title: 'US–UK Tax Deadlines Calendar — Key Dates for Cross-Border Filers',
  description:
    'The key US and UK tax deadlines in one place: IRS filing and the automatic expat extension, FBAR, UK Self Assessment, payments on account and Corporation Tax — for anyone filing on both sides of the Atlantic.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'What are the main US tax deadlines for Americans abroad?',
    a: 'The US return is due 15 April, but Americans living abroad get an automatic extension to 15 June, and can request a further extension to 15 October. The FBAR is due 15 April with an automatic extension to 15 October. Importantly, any US tax owed still accrues interest from 15 April even when the filing deadline is extended.',
  },
  {
    q: 'What are the main UK tax deadlines?',
    a: 'The UK tax year runs 6 April to 5 April. Paper Self Assessment returns are due by 31 October, online returns and the balancing payment by the following 31 January, with a second payment on account due 31 July where applicable. Company Corporation Tax is generally due nine months and one day after the accounting period ends, with the return due twelve months after.',
  },
  {
    q: 'How do the US and UK tax years line up?',
    a: 'They do not — and that is a common source of confusion. The US uses the calendar year (1 January to 31 December) while the UK year runs 6 April to 5 April. This mismatch affects how income is apportioned, when foreign tax is considered paid for credit purposes, and how a move mid-year is handled, which is why cross-border returns need the two timelines reconciled.',
  },
  {
    q: 'What happens if I miss a deadline?',
    a: 'It depends which one. HMRC charges an automatic £100 for a late Self Assessment return plus escalating penalties and interest; the IRS charges failure-to-file and failure-to-pay penalties plus interest, and information returns like the FBAR and Form 5471 carry their own steep penalties. Where a deadline has been missed, acting quickly — and, for missed US filings, considering the Streamlined programme — usually limits the damage.',
  },
];

const usDates = [
  { date: '15 April', label: 'US return due (interest on tax owed starts now, even if filing is extended)' },
  { date: '15 April', label: 'FBAR (FinCEN 114) due — automatically extended to 15 October' },
  { date: '15 June', label: 'Automatic filing extension for Americans abroad' },
  { date: '15 October', label: 'Final US return extension deadline (if requested) and FBAR extension deadline' },
];

const ukDates = [
  { date: '6 April', label: 'New UK tax year begins' },
  { date: '31 July', label: 'Second payment on account due (if applicable)' },
  { date: '5 October', label: 'Deadline to register for Self Assessment for the previous tax year' },
  { date: '31 October', label: 'Paper Self Assessment return deadline' },
  { date: '31 January', label: 'Online Self Assessment return and balancing payment due' },
];

function DateTable({ title, rows }: { title: string; rows: { date: string; label: string }[] }) {
  return (
    <div className="rounded-2xl border border-mist bg-white p-7 shadow-e1">
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      <ul className="mt-5 space-y-4">
        {rows.map((r) => (
          <li key={r.date + r.label} className="flex gap-4 border-t border-mist pt-4 first:border-0 first:pt-0">
            <span className="min-w-[90px] shrink-0 text-sm font-semibold text-gold-antique">{r.date}</span>
            <span className="text-sm leading-relaxed text-muted">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TaxDeadlinesCalendar() {
  return (
    <PageShell
      url={URL}
      eyebrow="Guides"
      title="US–UK tax deadlines calendar"
      answer="If you file on both sides of the Atlantic, the key dates are: the US return on 15 April (automatically extended to 15 June for Americans abroad, then 15 October on request), the FBAR on 15 April (extended to 15 October), and on the UK side the online Self Assessment return and payment by 31 January, with a payment on account on 31 July. US tax owed accrues interest from 15 April even when filing is extended."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Guides', href: '/resources/blog' },
        { label: 'Tax Deadlines Calendar', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Never miss a cross-border deadline"
      ctaIntro="We track both calendars for our clients and file on time on both sides. Book a free consultation."
    >
      <ProseBlock>
        <p>
          Filing in two countries means tracking two sets of deadlines that don&rsquo;t line up. The US runs on
          the calendar year; the UK year runs 6 April to 5 April. Miss the overlap and you can face penalties
          from both tax authorities for the same period &mdash; so here are the dates that matter, in one place.
        </p>
        <p>
          <strong>One trap worth highlighting:</strong> the automatic extensions that Americans abroad receive
          push back the <em>filing</em> deadline, not the <em>payment</em> deadline. US tax owed still accrues
          interest from 15 April, so an extension is not a reason to delay paying.
        </p>
      </ProseBlock>

      <Section tone="porcelain">
        <Container>
          <SectionHeading eyebrow="Key dates" title="The two calendars side by side" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <DateTable title="United States" rows={usDates} />
            <DateTable title="United Kingdom" rows={ukDates} />
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted">
            Dates reflect the standard deadlines and automatic expat extensions. Where a deadline falls on a
            weekend or public holiday it may shift to the next working day, and some dates depend on your
            circumstances. Always confirm the current year&rsquo;s deadlines for your specific filings.
          </p>
        </Container>
      </Section>

      <RelatedLinks
        title="Plan around these dates"
        links={[
          { label: 'US Expat Tax Deadlines calculator', href: '/resources/calculators/us-expat-deadlines', description: 'Your US dates for the chosen tax year.' },
          { label: 'Self Assessment penalty calculator', href: '/resources/calculators/self-assessment-deadline', description: 'Estimate HMRC late-filing penalties.' },
          { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns', description: 'Filed on time, every year.' },
          { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment', description: 'Your UK return, handled.' },
        ]}
      />
    </PageShell>
  );
}
