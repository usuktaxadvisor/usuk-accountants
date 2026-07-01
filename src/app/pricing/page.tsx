import type { Metadata } from 'next';
import {
  PageShell, Section, Container, SectionHeading, InvestmentBand,
  ProseBlock, RelatedLinks, ConsultationTiers, JsonLd,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { CONSULTATION, CONSULTATION_TIERS } from '@/lib/site-data';

const offerCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'US–UK Tax Consultations',
  url: 'https://www.usukaccountants.com/pricing',
  itemListElement: CONSULTATION_TIERS.filter((t) => t.priceValue > 0).map((t) => ({
    '@type': 'Offer',
    name: t.name,
    description: t.tagline,
    price: String(t.priceValue),
    priceCurrency: 'GBP',
    category: 'Consultation',
    availability: 'https://schema.org/InStock',
    url: `https://www.usukaccountants.com${t.bookHref}`,
  })),
};

const URL = 'https://www.usukaccountants.com/pricing';

export const metadata: Metadata = {
  title: 'How Much Does a US–UK Tax Accountant Cost? (2026 Pricing Guide)',
  description:
    'Honest, transparent guidance on what US–UK cross-border tax and accounting costs: US expat tax returns, FBAR, Streamlined Filing, UK Self Assessment, company accounts and cross-border planning. Typical price ranges and exactly what drives the fee.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const bands: { service: string; from: string; drivers: string }[] = [
  {
    service: 'US federal tax return (expat)',
    from: 'from £450',
    drivers: 'Number of income sources, self-employment, rental property, and the forms triggered (e.g. Schedule C, Schedule E).',
  },
  {
    service: 'FBAR (FinCEN 114)',
    from: 'from £100',
    drivers: 'Number of foreign accounts to report. Often bundled with the federal return.',
  },
  {
    service: 'Streamlined Filing (catch-up)',
    from: 'from £1,200',
    drivers: 'Three years of returns plus six years of FBARs, so the fee reflects the number of years and the complexity of each.',
  },
  {
    service: 'Form 5471 (US owner of a UK company)',
    from: 'from £750',
    drivers: 'Category of filer, whether GILTI/Subpart F applies, and the company\u2019s size and records quality.',
  },
  {
    service: 'UK Self Assessment return',
    from: 'from £300',
    drivers: 'Employment vs self-employment, rental income, capital gains, and whether foreign income and reliefs are involved.',
  },
  {
    service: 'UK company accounts + Corporation Tax',
    from: 'from £900',
    drivers: 'Company size, transaction volume, bookkeeping quality, and payroll/VAT if required.',
  },
  {
    service: 'Cross-border tax planning',
    from: 'bespoke',
    drivers: 'Scope of the question — residency, treaty positions, pensions, business structuring or estate planning.',
  },
];

const faqs = [
  {
    q: 'How much does a US–UK tax accountant cost?',
    a: 'For most individuals, a US expat federal tax return starts from around £450 and a UK Self Assessment return from around £300, with the exact fee depending on complexity — the number of income sources, whether you have self-employment or rental property, and which forms are triggered. Catch-up Streamlined Filing typically starts from around £1,200 because it covers three years of returns and six years of FBARs. Business and cross-border planning work is quoted bespoke. Every engagement is given a fixed-scope quote before any work begins, so the price is agreed in advance.',
  },
  {
    q: 'Why don\u2019t you publish a single fixed price?',
    a: 'Because cross-border situations vary enormously, and an honest fee has to reflect real complexity. Two Americans in London can have wildly different returns — one a straightforward employee, the other with a UK company, rental property and a pension transfer. A single headline price would either overcharge simple cases or under-scope complex ones. Instead we give indicative "from" ranges here, then a fixed-scope quote for your actual situation, so you never face open-ended billing.',
  },
  {
    q: 'What makes a US–UK tax return more expensive?',
    a: 'The main cost drivers are: multiple income sources, self-employment, rental property, ownership of a foreign (UK) company triggering forms like 5471 and GILTI, PFIC reporting on funds or ISAs, pension planning, and years of catch-up filing. The forms your situation triggers — not the firm\u2019s hourly rate alone — are what move the fee.',
  },
  {
    q: 'Is the consultation fee separate from the work?',
    a: `The ${CONSULTATION.durationLabel} consultation is ${CONSULTATION.price}, and it is credited against your first engagement if you go on to instruct us — so for clients who proceed, it is effectively part of the work, not an extra cost. General questions are answered free by email.`,
  },
  {
    q: 'Are you cheaper than US-only expat tax firms?',
    a: 'We are not positioned as the cheapest option, and for a purely simple US return a high-volume US-only firm may quote less. Where we deliver better value is the cross-border case: because we handle both the US and UK sides in one firm, you avoid paying two separate accountants who don\u2019t coordinate, and you avoid the costly mistakes that happen when the two returns are prepared in isolation and don\u2019t agree.',
  },
  {
    q: 'How do I get an exact price?',
    a: 'Email us a short description of your situation for a free general steer, or book the consultation for detailed advice. Either way, before any work starts you receive a written, fixed-scope quote — no surprises and no open-ended hourly billing.',
  },
];

export default function PricingPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Pricing"
      title="How much does a US–UK tax accountant cost?"
      answer="For most individuals, a US expat federal return starts from around £450 and a UK Self Assessment from around £300, with the fee depending on complexity — income sources, self-employment, rental property, company ownership and the forms triggered. Streamlined catch-up filing typically starts from around £1,200 (three years of returns plus six years of FBARs). Business and cross-border planning is quoted bespoke. Every engagement receives a fixed-scope quote before work begins, so the price is agreed in advance, and the £100 consultation is credited to your first engagement."
      crumbs={[{ label: 'Pricing', href: URL }]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-07-01"
      faqs={faqs}
      ctaTitle="Want an exact quote for your situation?"
      ctaIntro="Email us a short description for a free steer, or book a £100 consultation — credited to your first engagement. You'll always get a fixed-scope quote before any work begins."
    >
      <JsonLd schema={offerCatalogSchema} />
      <Section tone="porcelain">
        <Container>
          <ConsultationTiers />
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Typical price ranges"
            title="Indicative fees by service"
            align="center"
          />
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            These are honest starting points, not binding quotes. Your fixed fee is confirmed in writing
            before any work begins and reflects the real complexity of your situation.
          </p>
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-mist">
            <table className="w-full text-left text-sm">
              <thead className="bg-porcelain">
                <tr>
                  <th className="px-5 py-4 font-display font-semibold text-ink">Service</th>
                  <th className="px-5 py-4 font-display font-semibold text-ink">Typically</th>
                  <th className="hidden px-5 py-4 font-display font-semibold text-ink sm:table-cell">
                    What drives the fee
                  </th>
                </tr>
              </thead>
              <tbody>
                {bands.map((b, i) => (
                  <tr key={b.service} className={i % 2 ? 'bg-white' : 'bg-porcelain/40'}>
                    <td className="px-5 py-4 font-medium text-ink">{b.service}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-navy">{b.from}</td>
                    <td className="hidden px-5 py-4 text-muted sm:table-cell">{b.drivers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted">
            Prices shown in GBP and indicative for the 2025/26 period. US-side fees may be quoted in USD.
            Ranges are guidance only and do not constitute a binding offer.
          </p>
        </Container>
      </Section>

      <ProseBlock eyebrow="How we price" title="Fixed-scope quotes, never open-ended billing" tone="porcelain">
        <p>
          Cross-border tax is complex, but your fee shouldn&rsquo;t be a mystery. We work to a simple
          principle: understand your situation first, then quote a fixed scope in writing before any work
          begins. You approve the number up front, so there are no surprise hourly bills and no open-ended
          engagements.
        </p>
        <p>
          The reason we don&rsquo;t publish one flat price is that it would be dishonest. A straightforward
          employee&rsquo;s US return and a return involving a UK company, rental property, PFIC-laden ISAs and
          a pension transfer are not the same job — and pretending they cost the same would mean overcharging
          the first client to subsidise the second. The ranges above reflect where each service genuinely
          starts; your quote reflects your actual facts.
        </p>
        <p>
          {CONSULTATION.freeEmailLine} For anything requiring detailed, personalised advice, the {CONSULTATION.price}{' '}
          consultation is credited to your first engagement — so for clients who proceed, it forms part of the
          work rather than an additional cost.
        </p>
      </ProseBlock>

      <InvestmentBand
        fromLabel="Bespoke, complexity-based pricing"
        points={[
          'Fixed-scope quote in writing before any work begins',
          'US and UK sides coordinated by one firm',
          '£100 consultation credited to your first engagement',
          'No open-ended hourly billing, ever',
        ]}
        note="Streamlined catch-up filing and company work are quoted as fixed packages after your consultation."
      />

      <RelatedLinks
        title="Explore our services"
        links={[
          { label: 'US Expat Tax', href: '/services/us-expat-tax', description: 'Federal and state returns, FBAR, FATCA and Streamlined Filing.' },
          { label: 'UK Accounting', href: '/services/uk-accounting', description: 'Self Assessment, company accounts, Corporation Tax and payroll.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'Treaty planning, pensions, structuring and estate coordination.' },
          { label: 'Book a consultation', href: '/book', description: 'A £100 30-minute session, credited to your first engagement.' },
        ]}
      />
    </PageShell>
  );
}
