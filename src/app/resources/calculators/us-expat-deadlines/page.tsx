import type { Metadata } from 'next';
import { PageShell, Section, Container, UsDeadlinesCalculator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/us-expat-deadlines';

export const metadata: Metadata = {
  title: 'US Expat Tax Deadlines Calculator — Your Filing Dates Abroad',
  description:
    'Free US expat tax deadline tool. See your filing and payment dates as an American abroad: the automatic June extension, Form 4868 to October, the December extension and the FBAR deadline.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'When are US taxes due if I live abroad?',
    a: 'Any US tax owed is due 15 April. If your tax home and abode are outside the US on that date you get an automatic two-month extension to file until 15 June, with no form required. You can extend filing further to 15 October by submitting Form 4868 by 15 June, and a discretionary extension to 15 December is available on written request.',
  },
  {
    q: 'Does the extension also extend the time to pay?',
    a: 'No. Every US filing extension extends the time to file, not the time to pay. Interest accrues on any unpaid balance from 15 April regardless of which extension you use, so it is usually best to pay an estimate by 15 April even if you file later.',
  },
  {
    q: 'When is the FBAR due?',
    a: 'The FBAR (FinCEN Form 114) is due 15 April with an automatic extension to 15 October — no request needed. It is filed separately from your tax return through the FinCEN BSA E-Filing System.',
  },
  {
    q: 'What if I have not met the Foreign Earned Income Exclusion residency test yet?',
    a: 'If you moved abroad recently and will not meet the bona fide residence or physical presence test by your filing deadline, Form 2350 is a special extension designed for that situation. It is different from Form 4868, so this is worth confirming with a specialist before relying on it.',
  },
];

export default function UsDeadlinesPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="US Expat Tax Deadlines"
      answer="As an American abroad your US deadlines differ from those at home: tax owed is due 15 April, but filing is automatically extended to 15 June, then to 15 October via Form 4868, with a discretionary 15 December extension and a 15 October FBAR deadline. Pick your tax year to see your dates laid out."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'US Expat Tax Deadlines', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-24"
      faqs={faqs}
      ctaTitle="Stay ahead of every deadline"
      ctaIntro="We track the US and UK calendars for our clients so nothing is missed. Book a free consultation to get your filings on a clear schedule."
    >
      <Section tone="white">
        <Container>
          <UsDeadlinesCalculator />
          <CalculatorRelatedLinks {...calculatorLinks['us-expat-deadlines']} />
        </Container>
      </Section>
    </PageShell>
  );
}
