import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/who-we-help/high-net-worth-individuals';

export const metadata: Metadata = {
  title: 'US–UK Tax Advisors for High-Net-Worth Individuals',
  description:
    'Discreet cross-border tax and estate planning for high-net-worth individuals with US and UK exposure: treaty planning, the UK long-term-resident IHT rules, the US estate tax, trusts, PFICs and worldwide income coordination.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const relevant = services.filter((s) =>
  ['tax-planning', 'us-uk-tax-treaty', 'us-tax-returns', 'fatca', 'foreign-tax-credit', 'form-5471']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'How does the UK 2025 inheritance tax reform affect me?', a: 'From 6 April 2025 the UK moved from a domicile-based inheritance tax system to one based on long-term residence. If you have been UK-resident for 10 of the previous 20 years you are a "long-term resident", exposed to UK inheritance tax on your worldwide estate, with a tail of 3 to 10 years after leaving. For internationally mobile wealth this significantly widened exposure, and it interacts with the separate US estate tax.' },
  { q: 'Can I be exposed to both UK inheritance tax and US estate tax?', a: 'Potentially, yes — they are separate regimes with different thresholds and rules. A 1980 US–UK estate and gift tax treaty (distinct from the income tax treaty) allocates taxing rights and provides relief, but it does not remove all exposure, and UK real estate generally stays within UK inheritance tax regardless. Coordinated planning across both is essential at this level of wealth.' },
  { q: 'Why are my investments a US tax problem?', a: 'Most non-US pooled investments — funds, ETFs, investment trusts, many wrappers — are Passive Foreign Investment Companies (PFICs) under US rules, which carry a punitive default tax regime and complex Form 8621 reporting. For HNW portfolios this can quietly erode returns and create significant filing burden unless structured with US tax in mind.' },
  { q: 'Do you work discreetly with existing advisors?', a: 'Yes. We frequently coordinate with private banks, wealth managers, family offices and solicitors, providing the specialist US–UK tax layer alongside your existing relationships. Engagements are confidential and structured around your wider professional team.' },
];

export default function HighNetWorthIndividuals() {
  return (
    <PageShell
      url={URL}
      eyebrow="Who we help"
      title="US–UK tax advisory for high-net-worth individuals"
      answer="At significant levels of wealth, US–UK exposure stops being about annual returns and becomes about structure: the UK's 2025 long-term-resident inheritance tax rules, the US estate tax, the interaction of the two treaties, PFIC-laden portfolios, trusts and worldwide income. We provide the specialist cross-border tax layer, working discreetly alongside your wealth managers and solicitors."
      crumbs={[
        { label: 'Who We Help', href: '/who-we-help' },
        { label: 'High-Net-Worth Individuals', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="A discreet, specialist cross-border review"
      ctaIntro="Book a confidential consultation to understand your US–UK exposure and the structure that fits it."
    >
      <ProseBlock>
        <p>
          For high-net-worth individuals, the cost of getting US&ndash;UK tax wrong is measured in estate
          exposure and lost compounding, not late-filing penalties. The questions that matter are structural:
          where your worldwide estate sits for inheritance and estate tax, how your portfolio is treated under
          the PFIC rules, and how trusts and gifts are seen on both sides of the Atlantic.
        </p>
        <p>
          <strong>The UK&rsquo;s 2025 move to a residence-based inheritance tax system changed the landscape.</strong>{' '}
          Long-standing assumptions built on domicile no longer hold, and the interaction with the US estate tax
          and the 1980 estate and gift tax treaty now needs revisiting for many internationally mobile families.
          We provide that review, and the ongoing coordination, with the discretion this work demands.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="We advise high-net-worth individuals who are…"
        items={[
          'US citizens or green card holders with substantial UK ties',
          'Long-term UK residents now within the new IHT rules',
          'Holding complex portfolios, trusts or business interests',
          'Planning gifts, succession or a change of residence',
          'Concerned about combined UK inheritance and US estate tax',
          'Wanting a specialist US–UK layer alongside existing advisors',
        ]}
      />

      <Section tone="white">
        <Container>
          <SectionHeading eyebrow="Where we help" title="The services that fit your situation" />
          <div className="mt-10">
            <ServiceGrid services={relevant} columns={3} />
          </div>
        </Container>
      </Section>

      <RelatedLinks
        title="Related areas"
        links={[
          { label: 'UK inheritance tax vs US estate tax', href: '/resources/blog/uk-inheritance-tax-vs-us-estate-tax', description: 'How the two regimes interact.' },
          { label: 'US–UK estate & gift tax treaty', href: '/resources/blog/us-uk-estate-gift-tax-treaty', description: 'The treaty that survived 2025.' },
          { label: 'Long-term resident IHT', href: '/resources/glossary/long-term-resident-iht', description: 'The post-2025 residence test.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'Treaty, structuring and planning.' },
          { label: 'Dual citizens', href: '/who-we-help/dual-citizens', description: 'Hold both passports? Start here.' },
        ]}
      />
    </PageShell>
  );
}
