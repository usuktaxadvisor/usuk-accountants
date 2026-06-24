import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/who-we-help/dual-citizens';

export const metadata: Metadata = {
  title: 'US–UK Dual Citizen Tax Specialists',
  description:
    'Tax help for US–UK dual citizens: a single coordinated strategy across the IRS and HMRC covering returns, FBAR, the treaty, pensions and investments — wherever you live.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'briana')!;

const relevant = services.filter((s) =>
  ['us-tax-returns', 'fbar-filing', 'us-uk-tax-treaty', 'self-assessment', 'streamlined-filing', 'cross-border']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'As a US–UK dual citizen, do I have to file in both countries?', a: 'Generally yes. US citizenship carries a worldwide US filing obligation for life regardless of residence, and you will usually also file in the UK if you live or earn there. The two must be coordinated — that is the whole point of a dual-citizen strategy.' },
  { q: 'Does dual citizenship mean I pay tax twice?', a: 'Rarely, when handled properly. The US–UK treaty, the Foreign Tax Credit and the Foreign Earned Income Exclusion are designed to prevent it. The risk for dual citizens is complexity — multiple income sources across two systems — not double taxation itself.' },
  { q: 'I was born a dual citizen and have never filed US taxes — what now?', a: 'You are far from alone, and the IRS Streamlined programme exists for exactly this. If your non-filing was non-willful, you can typically catch up with three years of returns and six years of FBARs, penalty-free. We handle these cases regularly and discreetly.' },
  { q: 'Should I consider renouncing US citizenship?', a: 'Some dual citizens explore it, but it carries its own tax consequences including a potential exit tax, and is rarely the right first step. We help you understand the full picture before any irreversible decision — usually the filing burden is more manageable than people fear.' },
];

export default function DualCitizens() {
  return (
    <PageShell
      url={URL}
      eyebrow="Who we help"
      title="Tax specialists for US–UK dual citizens"
      answer="Holding both passports means a lifelong US filing obligation alongside your UK position — but with one coordinated strategy it rarely means paying twice. Dual citizens need their IRS and HMRC filings handled together: returns, FBAR, treaty relief, pensions and investments. We give you a single plan across both systems, wherever you live."
      crumbs={[
        { label: 'Who We Help', href: '/who-we-help' },
        { label: 'Dual Citizens', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-22"
      faqs={faqs}
      ctaTitle="One strategy across both citizenships"
      ctaIntro="Book a free consultation and bring order to both sides at once."
    >
      <ProseBlock>
        <p>
          Dual citizenship is a privilege that comes with a uniquely tangled tax position. US citizenship carries a
          worldwide filing obligation for life &mdash; it doesn&rsquo;t lapse because you live in Britain &mdash;
          and your UK affairs run in parallel.
        </p>
        <p>
          <strong>The challenge for dual citizens is coordination, not double tax.</strong> With income, accounts and
          pensions potentially spanning both countries, the value is in a single strategy that sequences reliefs
          correctly across the IRS and HMRC. That&rsquo;s precisely the work we specialise in.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="We help dual citizens who are…"
        items={[
          'US–UK citizens living in either country',
          'Born dual and never filed US returns',
          'Managing income or accounts in both countries',
          'Holding pensions or investments across both',
          'Planning a move in either direction',
          'Weighing long-term options including renunciation',
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
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'The US side of your dual position.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Your UK filings, coordinated.' },
          { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing', description: 'Never filed US returns? Start here.' },
          { label: 'US citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'Living in Britain specifically.' },
          { label: 'Double-Tax Estimator', href: '/resources/calculators/double-tax-estimator', description: 'See your position quickly.' },
        ]}
      />
    </PageShell>
  );
}
