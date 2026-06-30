import type { Metadata } from 'next';
import {
  PageShell, Section, Container,
  ProseBlock, WhoItsFor, ProcessSteps, KeyFacts, InvestmentBand, RelatedLinks,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/services/cross-border-advisory/pensions-401k-sipp';

export const metadata: Metadata = {
  title: 'US–UK Pension Tax — 401(k), SIPP & the 25% Lump Sum',
  description:
    'How US and UK pensions are taxed across the Atlantic: 401(k)s, IRAs, UK workplace pensions and SIPPs, the treaty pension provisions, and the contested US treatment of the UK 25% tax-free lump sum.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'How are UK and US pensions taxed across the two countries?',
    a: 'Broadly, the US–UK treaty contains specific provisions designed to stop the same pension income being taxed twice and to give cross-border recognition to certain pension arrangements. But the detail matters enormously: the treatment depends on the type of pension (workplace, SIPP, 401(k), IRA), how and when it pays out, your residence, and the saving clause that preserves US taxing rights over its citizens. Pensions are an area to review individually rather than assume a single rule applies.',
  },
  {
    q: 'Is the UK 25% tax-free lump sum taxable in the US?',
    a: 'This is genuinely contested. The conservative, IRS-aligned view is that the saving clause overrides the treaty\u2019s pension article, so the lump sum is US-taxable despite being tax-free in the UK. A minority position argues a specific treaty article exempts it — but relying on it requires disclosure on Form 8833 and carries audit risk. The correct answer depends on your facts, and we set out both positions plainly so you can decide with the risks understood.',
  },
  {
    q: 'Can my SIPP or workplace pension create US reporting?',
    a: 'Potentially. Depending on how a UK pension is structured and treated, it can raise questions around foreign trust and PFIC reporting as well as the income-tax treatment of contributions and growth. Most common workplace arrangements are manageable, but the answer is not automatic, which is why a US owner of a UK pension should have the position reviewed rather than assumed.',
  },
  {
    q: 'Should I move my pension when I move country?',
    a: 'Not without advice. Transfers between pension systems can trigger tax, reporting and charges that are easy to overlook and hard to reverse, and the right answer depends on your age, plans and where you will be resident when you draw it. We model the options before anything is moved.',
  },
];

export default function Pensions401kSipp() {
  return (
    <PageShell
      url={URL}
      eyebrow="Cross-Border Advisory"
      title="US–UK pension tax: 401(k), SIPP & the 25% lump sum"
      answer="Pensions are one of the most error-prone areas of US–UK tax. The treaty aims to prevent the same pension income being taxed twice, but the treatment of a 401(k), IRA, UK workplace pension or SIPP depends on its type, how it pays out, and the saving clause. The US treatment of the UK 25% tax-free lump sum is genuinely contested — we set out the conservative and minority positions plainly so you decide with the risks understood."
      crumbs={[
        { label: 'Services', href: '/services' },
        { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory' },
        { label: 'Pensions (401k / SIPP)', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      service={{
        url: URL,
        name: 'US–UK Pension Tax Advisory',
        description: 'Cross-border pension tax advice on 401(k)s, IRAs, UK workplace pensions, SIPPs, the treaty pension provisions and the 25% lump sum.',
        serviceType: 'Tax Advisory',
      }}
      ctaTitle="Get your cross-border pension position right"
      ctaIntro="Book a free consultation before you draw, transfer or rely on a pension across the Atlantic."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <ProseBlock>
              <p>
                Pensions sit at the hardest intersection of US and UK tax. The treaty offers real protection
                against double taxation, but it is detailed and qualified &mdash; and the saving clause means a
                US citizen cannot simply assume a UK pension is treated the way the UK treats it. The same
                arrangement can be straightforward or surprisingly complex depending on its type and how it pays.
              </p>
              <p>
                <strong>The 25% tax-free lump sum is the clearest example.</strong> Tax-free in the UK, its US
                treatment is genuinely disputed: the conservative reading taxes it, a minority position exempts
                it via the treaty, and the difference turns on the saving clause and a disclosure on Form 8833.
                We do not pretend this is settled &mdash; we explain both positions, the audit and reporting
                implications, and help you choose the course your facts support.
              </p>
            </ProseBlock>
            <div className="lg:pt-2">
              <KeyFacts
                title="Pensions at a glance"
                facts={[
                  { label: 'Treaty', value: 'Specific pension provisions' },
                  { label: 'Saving clause', value: 'Limits US-citizen benefit' },
                  { label: '25% lump sum', value: 'US treatment contested' },
                  { label: 'Disclosure', value: 'Often Form 8833' },
                  { label: 'Covers', value: '401(k), IRA, SIPP, workplace' },
                  { label: 'Approach', value: 'Both positions, plainly' },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <WhoItsFor
        items={[
          'Americans in the UK with a 401(k) or IRA',
          'US citizens with UK workplace pensions or a SIPP',
          'Anyone approaching the UK 25% tax-free lump sum',
          'People considering a cross-border pension transfer',
          'Retirees drawing pensions across two countries',
          'Anyone told different things by different advisors',
        ]}
      />

      <ProcessSteps
        steps={[
          { title: 'Free consultation', description: 'We review your pensions and what you plan to do with them.' },
          { title: 'Position the treatment', description: 'We set out how the treaty and US rules apply to each arrangement.' },
          { title: 'Explain the choices', description: 'Where the law is contested, we give you both positions and the risks.' },
          { title: 'Report it correctly', description: 'We handle the reporting, including Form 8833 where a position requires it.' },
        ]}
      />

      <InvestmentBand
        fromLabel="Bespoke, complexity-based pricing"
        points={[
          'Free 15–20 minute initial consultation',
          'Paid strategy session for pension positions, credited to later work',
          'Conservative and alternative positions explained plainly',
          'Reporting handled, including Form 8833 where required',
        ]}
        note="Where a position is contested, we recommend the conservative, IRS-aligned course unless your specific facts justify otherwise — and we always explain the audit and disclosure implications first."
      />

      <RelatedLinks
        title="Explore related areas"
        links={[
          { label: 'Do I pay US tax on my UK pension?', href: '/resources/blog/do-i-pay-us-tax-on-my-uk-pension', description: 'The full cross-border picture.' },
          { label: 'Is the 25% lump sum US-taxable?', href: '/resources/blog/is-the-25-percent-uk-lump-sum-taxable-in-the-us', description: 'Both positions, set out plainly.' },
          { label: 'Saving clause', href: '/resources/glossary/saving-clause', description: 'Why being American limits the treaty.' },
          { label: 'US–UK tax treaty', href: '/services/us-expat-tax/us-uk-tax-treaty', description: 'What the treaty does, and does not, do.' },
          { label: 'Cross-Border Advisory', href: '/services/cross-border-advisory', description: 'The full advisory picture.' },
        ]}
      />
    </PageShell>
  );
}
