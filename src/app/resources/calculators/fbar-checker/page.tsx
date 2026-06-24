import type { Metadata } from 'next';
import { PageShell, Section, Container, FbarChecker } from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/fbar-checker';

export const metadata: Metadata = {
  title: 'FBAR Requirement Checker — Do You Need to File FinCEN 114?',
  description:
    'Free FBAR checker for US persons abroad and dual citizens. Answer three questions to see whether you must file FinCEN Form 114 this year, plus the deadline and how to file.',
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
    q: 'I have missed FBARs in previous years — what should I do?',
    a: 'Do not simply back-file without advice. The IRS Streamlined Filing Compliance Procedures exist for non-willful filers who have fallen behind and, handled correctly, can bring you current without penalties. This is exactly the kind of situation worth a consultation before you act.',
  },
  {
    q: 'Does signature authority count even if I do not own the money?',
    a: 'Yes. If you can direct transactions on a foreign account — for example an employer, family or business account — that account can create an FBAR obligation for you once your reportable accounts cross the $10,000 aggregate, even though the funds are not yours.',
  },
];

export default function FbarCheckerPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="FBAR Requirement Checker"
      answer="If you are a US person with money in non-US accounts, you may be required to file an FBAR (FinCEN Form 114). The rule: a US person with a financial interest in or signature authority over foreign accounts whose combined value exceeded US$10,000 at any point in the year must file. This checker walks you through the three triggers in under a minute."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'FBAR Requirement Checker', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-24"
      faqs={faqs}
      ctaTitle="Not sure where you stand?"
      ctaIntro="If your FBAR position is borderline — or you have missed prior years — book a free consultation and we'll confirm exactly what you need to file."
    >
      <Section tone="white">
        <Container>
          <FbarChecker />
        </Container>
      </Section>
    </PageShell>
  );
}
