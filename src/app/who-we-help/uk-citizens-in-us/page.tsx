import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, ServiceGrid,
  ProseBlock, WhoItsFor, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { services } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/who-we-help/uk-citizens-in-us';

export const metadata: Metadata = {
  title: 'UK Tax Accountant for Britons Living in the US',
  description:
    'Specialist help for UK citizens in the US: US federal and state returns, ongoing UK obligations, the US–UK treaty and residency — handled together so nothing falls between the two systems.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sarah-j')!;

const relevant = services.filter((s) =>
  ['us-tax-returns', 'self-assessment', 'us-uk-tax-treaty', 'cross-border', 'fbar-filing']
    .some((k) => s.href?.includes(k)));

const faqs = [
  { q: 'I moved from the UK to the US — do I still have UK tax obligations?', a: 'Possibly. It depends on your UK residence status under the Statutory Residence Test, any UK income you keep (such as rental property or a UK business), and how your departure was handled. Many Britons in the US retain some UK filing requirement, and getting residency right is essential.' },
  { q: 'Do I need to file US taxes as a UK citizen in the US?', a: 'If you are a US tax resident — typically via a green card or the substantial-presence test — you file US federal and usually state returns on worldwide income. The US–UK treaty and foreign tax credits help avoid double taxation.' },
  { q: 'What happens to my UK ISAs and pensions now I live in the US?', a: 'This is a common pitfall. ISAs are not tax-free in US eyes and some UK funds are treated as PFICs with punitive US reporting. UK pensions interact with US tax via the treaty. We plan for these specifically.' },
  { q: 'Can one firm handle both my US and UK sides?', a: 'Yes — that is exactly our model. Rather than a US preparer and a separate UK accountant who never speak, we coordinate both so reliefs line up and you are not taxed twice.' },
];

export default function UkCitizensInUs() {
  return (
    <PageShell
      url={URL}
      eyebrow="Who we help"
      title="Tax help for UK citizens living in the US"
      answer="As a Briton in the US you'll usually file US federal and state returns on worldwide income, while possibly keeping UK obligations on property, investments or pensions left behind. UK ISAs and funds can trigger punitive US reporting if mishandled. We coordinate both sides — US filing, UK residency and the treaty — so nothing falls through the gap."
      crumbs={[
        { label: 'Who We Help', href: '/who-we-help' },
        { label: 'UK Citizens in the US', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-22"
      faqs={faqs}
      ctaTitle="Get both sides handled by one team"
      ctaIntro="Book a free consultation with cross-border specialists."
    >
      <ProseBlock>
        <p>
          Relocating from the UK to the US brings a tax position most general accountants aren&rsquo;t equipped for.
          You step into the US system &mdash; federal and state returns on worldwide income &mdash; while your UK
          affairs don&rsquo;t simply switch off.
        </p>
        <p>
          <strong>The traps are specific and expensive.</strong> UK ISAs lose their tax-free status in US eyes,
          common UK funds are treated as PFICs with heavy reporting, and UK pensions need treaty-aware handling.
          Get residency and these details right from the start and you avoid years of costly correction.
        </p>
      </ProseBlock>

      <WhoItsFor
        title="We help Britons in the US who are…"
        items={[
          'On a work visa or green card in the US',
          'Keeping UK property, investments or pensions',
          'Unsure of their UK residence status after leaving',
          'Holding ISAs or UK funds with US reporting risk',
          'Founders or professionals moving for work',
          'Wanting one team for both countries',
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
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'Your US federal and state filing.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Remaining UK obligations, handled.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'Treaty, pensions and structuring.' },
          { label: 'Dual citizens', href: '/who-we-help/dual-citizens', description: 'Hold both passports? Start here.' },
          { label: 'US citizens in the UK', href: '/who-we-help/us-citizens-in-uk', description: 'The mirror situation.' },
        ]}
      />
    </PageShell>
  );
}
