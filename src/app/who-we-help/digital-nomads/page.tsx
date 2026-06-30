import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/who-we-help/digital-nomads';

export const metadata: Metadata = {
  title: 'US–UK Tax for Digital Nomads & Remote Workers',
  description:
    'Cross-border tax help for digital nomads and location-independent workers with US or UK ties: residency, the Statutory Residence Test, the FEIE physical-presence test, treaty relief and worldwide income.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const relevant = services.filter((s) =>
  ['foreign-earned-income-exclusion', 'us-tax-returns', 'tax-planning', 'self-assessment', 'us-uk-tax-treaty', 'foreign-tax-credit']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'If I am a digital nomad, where do I pay tax?', a: 'Residence, not location, usually decides it. The US taxes its citizens on worldwide income wherever they roam, so an American nomad keeps filing regardless. UK liability depends on the Statutory Residence Test — day counts and ties — rather than where you happen to be working from. Many nomads wrongly assume that having no fixed home means no tax home; in practice both systems still reach you.' },
  { q: 'Can I use the Foreign Earned Income Exclusion as a nomad?', a: 'Possibly, via the physical presence test — 330 full days in foreign countries during a 12-month period. But the FEIE needs a foreign "tax home", which constant movement can complicate, and it excludes only earned income, not investment income. For nomads with US ties the Foreign Tax Credit is sometimes the better tool. The right choice depends on your travel pattern and income mix.' },
  { q: 'How does the UK Statutory Residence Test affect me?', a: 'The SRT decides whether you are UK tax resident in a given year, based on days in the UK and connecting factors like work, home and family. If you spend significant time in the UK between trips, you can become UK resident without intending to — pulling your worldwide income into UK tax and, since April 2025, starting the long-term-resident inheritance tax clock. We help nomads track and plan this deliberately.' },
  { q: 'Do I still need to file if I owe nothing?', a: 'Usually yes. US citizens must file a federal return even when reliefs reduce the tax to zero, and FBAR and FATCA reporting can apply to the foreign accounts nomads accumulate. Filing is how you claim the exclusions and credits in the first place — skipping it is what creates problems later.' },
];

export default function DigitalNomads() {
  return (
    <PageShell
      url={URL}
      eyebrow="Who we help"
      title="US–UK tax for digital nomads & remote workers"
      answer="Being location-independent doesn't make you tax-independent. The US taxes its citizens on worldwide income wherever they are, and UK residence turns on the Statutory Residence Test — day counts and ties — not on having a fixed home. For nomads with US or UK connections, the work is getting residency, the FEIE physical-presence test, treaty relief and reporting right across a moving life. We do exactly that."
      crumbs={[
        { label: 'Who We Help', href: '/who-we-help' },
        { label: 'Digital Nomads', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Working from everywhere, taxed by someone?"
      ctaIntro="Book a free consultation to get your residency, reliefs and reporting straight — wherever you are."
    >
      <ProseBlock>
        <p>
          A location-independent life is freeing, but tax systems are stubbornly territorial about people they
          consider theirs. For Americans, citizenship-based taxation follows you across every border. For anyone
          with UK ties, residence is decided by a day-counting test that doesn&rsquo;t care that you call nowhere
          home &mdash; spend enough time in Britain and you are UK tax resident, intended or not.
        </p>
        <p>
          <strong>The nomad&rsquo;s real risk is assuming movement equals exemption.</strong> It rarely does.
          What movement actually changes is which reliefs fit &mdash; the physical-presence FEIE, the Foreign
          Tax Credit, treaty positions &mdash; and how carefully you need to track days and accounts. We help
          you plan it deliberately rather than discover it at filing time.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="We help nomads and remote workers who are…"
        items={[
          'US citizens working remotely while travelling',
          'Splitting time between the UK and elsewhere',
          'Unsure whether they have triggered UK residence',
          'Relying on the FEIE physical-presence test',
          'Accumulating foreign accounts across countries',
          'Wanting certainty about where and what they owe',
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
          { label: 'FEIE or Foreign Tax Credit?', href: '/resources/blog/feie-or-foreign-tax-credit-uk', description: 'Which relief fits your situation.' },
          { label: 'UK Statutory Residence Test', href: '/resources/calculators/srt-residence', description: 'Check your UK residence status.' },
          { label: 'Statutory Residence Test', href: '/resources/glossary/statutory-residence-test', description: 'How UK residence is decided.' },
          { label: 'US expat tax deadlines', href: '/resources/calculators/us-expat-deadlines', description: 'Your filing dates abroad.' },
          { label: 'US citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'Settled rather than roaming?' },
        ]}
      />
    </PageShell>
  );
}
