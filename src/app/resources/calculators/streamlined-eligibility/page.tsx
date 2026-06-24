import type { Metadata } from 'next';
import { PageShell, Section, Container, StreamlinedChecker } from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/streamlined-eligibility';

export const metadata: Metadata = {
  title: 'Streamlined Filing Eligibility Checker — IRS Amnesty for Expats',
  description:
    'Free checker for the IRS Streamlined Filing Compliance Procedures. See whether you may qualify to catch up on US taxes and FBARs penalty-free, and whether the foreign or domestic track applies.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const faqs = [
  {
    q: 'What are the IRS Streamlined Filing Compliance Procedures?',
    a: 'They are an IRS programme that lets US taxpayers whose failure to file was non-willful catch up — typically three years of tax returns and six years of FBARs — with reduced or no penalties. There are two tracks: the Foreign Offshore Procedures (for those who meet the non-residency test, with no offshore penalty) and the Domestic Offshore Procedures (for US residents, with a 5% penalty).',
  },
  {
    q: 'What does "non-willful" mean?',
    a: 'The IRS defines non-willful conduct as negligence, inadvertence, mistake, or a good-faith misunderstanding of the law — not intentional concealment or evasion. You certify non-willfulness under penalty of perjury on Form 14653 (foreign) or 14654 (domestic), so an honest, well-supported narrative is essential. Whether facts are truly non-willful is a judgement best made with a specialist.',
  },
  {
    q: 'Who qualifies for the foreign (0% penalty) track?',
    a: 'Broadly, in at least one of the most recent three tax years for which the due date has passed, you had no US abode and were physically outside the United States for at least 330 full days. Meeting that non-residency test points to the Streamlined Foreign Offshore Procedures; not meeting it points to the domestic track.',
  },
  {
    q: 'What if the IRS has already contacted me?',
    a: 'If you are under examination or criminal investigation, or the IRS has already contacted you about the delinquency, the Streamlined programme is generally no longer available. You are not out of options, but you should take advice before responding — other resolution routes, such as the Voluntary Disclosure Practice, may apply.',
  },
  {
    q: 'Is this checker a determination of eligibility?',
    a: 'No. It is an educational screen using the headline rules. It does not assess willfulness for you, does not file anything, and is not the certification. Because the consequences of getting this wrong are serious, confirm your eligibility and your track with a qualified cross-border specialist before making any submission.',
  },
];

export default function StreamlinedPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="Streamlined Filing Eligibility"
      answer="If you are a US person who has fallen behind on returns or FBARs and it was not deliberate, the IRS Streamlined Filing Compliance Procedures may let you catch up penalty-free (foreign track) or with a 5% penalty (domestic track). This checker screens the key eligibility gates — US-person status, no prior IRS contact, non-willful conduct, and the non-residency test — and indicates the likely path."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'Streamlined Filing Eligibility', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-24"
      faqs={faqs}
      ctaTitle="Behind on US filings?"
      ctaIntro="Catching up correctly — especially the non-willful certification — is where expert help matters most. Book a free, confidential consultation and we'll map your safest route back into compliance."
    >
      <Section tone="white">
        <Container>
          <StreamlinedChecker />
        </Container>
      </Section>
    </PageShell>
  );
}
