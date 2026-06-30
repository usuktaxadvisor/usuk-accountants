import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/who-we-help/landlords';

export const metadata: Metadata = {
  title: 'US–UK Tax Accountant for Landlords & Property Investors',
  description:
    'Cross-border tax help for landlords with UK or US rental property: UK Self Assessment, US Schedule E, depreciation recapture, Section 988 currency gains and double-tax relief — coordinated across both systems.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const relevant = services.filter((s) =>
  ['self-assessment', 'us-tax-returns', 'tax-planning', 'fbar-filing', 'us-uk-tax-treaty', 'foreign-tax-credit']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'How is UK rental income taxed if I am a US citizen?', a: 'It is taxed in both systems, but rarely twice. You report the rent to HMRC through Self Assessment and to the IRS on Schedule E, then the Foreign Tax Credit generally offsets the US tax with the UK tax already paid. The complication is that the US requires you to depreciate the property and applies its own rules for allowable expenses, so the taxable figures rarely match between the two returns.' },
  { q: 'What is depreciation recapture and why does it matter?', a: 'US rules require you to depreciate a rental property each year, reducing your taxable rental income. When you sell, that depreciation is "recaptured" and taxed at up to 25% — even if you never knowingly claimed it, because the US treats it as taken regardless. Many landlords are caught out because the UK has no equivalent, so there is often no UK tax to credit against the US recapture charge.' },
  { q: 'Do I have to report my UK rental account on an FBAR?', a: 'If rent flows through a UK bank account and your foreign accounts together exceed $10,000 at any point in the year, that account is reportable on the FBAR. Property held through a UK company adds further US reporting, which is why structure matters before you buy.' },
  { q: 'Can a currency gain on my mortgage be taxed?', a: 'Yes. Under Section 988, repaying or refinancing a sterling mortgage can create a US-taxable foreign-exchange gain if the dollar strengthened since you borrowed — taxed as ordinary income, with no UK equivalent. It is one of the least-known traps for US-citizen landlords in the UK, and one we plan for directly.' },
];

export default function Landlords() {
  return (
    <PageShell
      url={URL}
      eyebrow="Who we help"
      title="Cross-border tax for landlords & property investors"
      answer="If you own rental property and have a foot in both the US and UK tax systems, your rent is reportable on both sides — to HMRC through Self Assessment and to the IRS on Schedule E — but double taxation is usually avoidable through the Foreign Tax Credit. The real risks are US depreciation recapture, Section 988 mortgage currency gains, and mismatched expense rules. We coordinate both returns so nothing is missed."
      crumbs={[
        { label: 'Who We Help', href: '/who-we-help' },
        { label: 'Landlords', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Own property across the Atlantic?"
      ctaIntro="Book a free consultation and we'll map your UK and US property tax position in one conversation."
    >
      <ProseBlock>
        <p>
          Rental property is one of the most common reasons a cross-border tax position turns complicated.
          The same property is taxed by HMRC and the IRS, but on different figures, under different rules,
          and on different timelines &mdash; and the two systems do not automatically talk to each other.
        </p>
        <p>
          <strong>Double taxation is usually avoidable; the surprises are not, unless you plan for them.</strong>{' '}
          US depreciation that the UK doesn&rsquo;t recognise, a recapture charge on sale with no UK tax to
          credit against it, a Section 988 currency gain on a remortgage &mdash; these are the issues that
          catch landlords out, and the ones we get right by handling both returns together.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="We help landlords who are…"
        items={[
          'US citizens letting UK residential or buy-to-let property',
          'Brits in the US still holding a UK rental',
          'Holding property personally or through a UK limited company',
          'Facing a sale and worried about US capital gains or recapture',
          'Remortgaging and unsure about currency-gain exposure',
          'Wanting one team for the UK and US sides of the same property',
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
          { label: 'US tax on UK rental income', href: '/resources/blog/us-tax-on-uk-rental-income', description: 'How the two systems treat your rent.' },
          { label: 'Selling a UK home as a US citizen', href: '/resources/blog/selling-uk-home-as-us-citizen', description: 'The §121 cap and PRR mismatch.' },
          { label: 'Section 988 currency-gain trap', href: '/resources/glossary/section-988', description: 'The mortgage gain few expect.' },
          { label: 'Depreciation recapture', href: '/resources/glossary/depreciation-recapture', description: 'The charge on sale, explained.' },
          { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment', description: 'Your UK rental reporting, handled.' },
        ]}
      />
    </PageShell>
  );
}
