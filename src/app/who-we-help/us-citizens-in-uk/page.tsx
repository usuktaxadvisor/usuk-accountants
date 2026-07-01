import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/who-we-help/us-citizens-in-uk';

export const metadata: Metadata = {
  title: 'US Tax Accountant for Americans Living in the UK',
  description:
    'Specialist US and UK tax help for Americans in the UK: federal returns, FBAR, FATCA, Streamlined Filing and Self Assessment — coordinated to help you avoid being taxed twice.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const relevant = services.filter((s) =>
  ['us-tax-returns', 'fbar-filing', 'streamlined-filing', 'self-assessment', 'fatca', 'us-uk-tax-treaty']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'Do Americans living in the UK have to file US taxes?', a: 'Yes. US citizens must file a US federal return on worldwide income every year regardless of where they live. Living in the UK does not end this — but the Foreign Earned Income Exclusion, Foreign Tax Credit and US–UK treaty usually prevent double taxation when claimed correctly.' },
  { q: 'Do I need to report my UK bank accounts to the US?', a: 'Often yes. If your foreign accounts together exceed $10,000 at any point in the year you must file an FBAR (FinCEN 114), and larger balances may also require FATCA Form 8938. We handle both alongside your return.' },
  { q: 'I have a UK pension — how is it taxed by the US?', a: 'UK pensions including workplace schemes and SIPPs interact with US tax and the treaty in specific ways. This is one of the most common areas Americans in the UK get wrong, and one we plan for directly.' },
  { q: "I haven't filed US taxes since moving — am I in trouble?", a: 'Usually not, if it was a genuine oversight. The IRS Streamlined Filing programme lets non-willful Americans abroad catch up — typically three years of returns and six years of FBARs — without penalties. We handle these regularly.' },
];

export default function UsCitizensInUk() {
  return (
    <PageShell
      url={URL}
      eyebrow="Who we help"
      title="US tax help for Americans living in the UK"
      answer="As a US citizen in the UK you file with both the IRS and HMRC, but you rarely owe tax twice. You'll typically have a US federal return, possibly an FBAR for UK accounts over $10,000, and a UK Self Assessment — all of which should be coordinated. We handle both sides so your reliefs line up and nothing is missed."
      crumbs={[
        { label: 'Who We Help', href: '/who-we-help' },
        { label: 'US Citizens in the UK', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-22"
      faqs={faqs}
      ctaTitle="Get your US–UK position handled by specialists"
      ctaIntro="Book a consultation with a team that does this every day."
    >
      <ProseBlock>
        <p>
          Moving to the UK doesn&rsquo;t end your relationship with the IRS. The US is one of the only countries that
          taxes its citizens on worldwide income wherever they live — so as an American in Britain you have an
          annual US filing obligation on top of anything HMRC expects.
        </p>
        <p>
          <strong>The good news: being taxed twice is usually avoidable.</strong> Between the Foreign Tax Credit,
          the Foreign Earned Income Exclusion and the US–UK treaty, most of our clients legally owe tax on a given
          income source in only one country. The risk isn&rsquo;t double tax — it&rsquo;s missed filings, mishandled
          pensions, and reliefs claimed in the wrong order. That&rsquo;s what we get right.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="We help Americans in the UK who are…"
        items={[
          'Working for a UK employer or your own UK company',
          'Self-employed or contracting in the UK',
          'Holding UK bank accounts, ISAs or pensions',
          'Behind on US filing and wanting to catch up',
          'Recently arrived and getting it right from year one',
          'Long-settled and wanting a cleaner, coordinated approach',
        ]}
      />

      <Section tone="white">
        <Container>
          <SectionHeading eyebrow="What you'll likely need" title="The services that fit your situation" />
          <div className="mt-10">
            <ServiceGrid services={relevant} columns={3} />
          </div>
        </Container>
      </Section>

      <RelatedLinks
        title="Related areas"
        links={[
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'The full US side of what you need.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Your UK Self Assessment and beyond.' },
          { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing', description: 'Behind on filing? Catch up penalty-free.' },
          { label: 'Dual citizens', href: '/who-we-help/dual-citizens', description: 'Hold both passports? Start here.' },
          { label: 'Double-Tax Estimator', href: '/resources/calculators/double-tax-estimator', description: 'See your position in under a minute.' },
        ]}
      />
    </PageShell>
  );
}
