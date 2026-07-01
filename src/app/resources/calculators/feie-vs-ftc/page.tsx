import type { Metadata } from 'next';
import { PageShell, Section, Container, FeieVsFtcCalculator, CalculatorRelatedLinks } from '@/components/library';
import { calculatorLinks } from '@/lib/site-data';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/calculators/feie-vs-ftc';

export const metadata: Metadata = {
  title: 'FEIE vs Foreign Tax Credit Calculator — Which Is Better?',
  description:
    'Free FEIE vs Foreign Tax Credit comparison for Americans in the UK. A directional guide to which relief is likely to leave you better off — and why the Foreign Tax Credit usually wins in a high-tax country like the UK.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  {
    q: 'Is the FEIE or the Foreign Tax Credit better for Americans in the UK?',
    a: 'For most Americans living in the UK, the Foreign Tax Credit is the stronger tool. Because UK effective tax rates are typically higher than US rates on the same income, the credit usually offsets the entire US bill on UK-source income and can leave excess credits to carry forward. The Foreign Earned Income Exclusion tends to suit lower-tax jurisdictions or specific circumstances — but the right answer depends on your facts, and it is often a multi-year decision.',
  },
  {
    q: 'Can I use both the FEIE and the Foreign Tax Credit?',
    a: 'In a limited way. You cannot claim a Foreign Tax Credit on income you have already excluded under the FEIE — the same income cannot get both reliefs. Some people exclude earned income up to the cap under the FEIE and then use the credit on income above it, but combining them is intricate and can waste foreign tax, which is why the choice benefits from proper modelling.',
  },
  {
    q: 'Does the FEIE cover investment or rental income?',
    a: 'No. The Foreign Earned Income Exclusion only applies to earned income — salary and self-employment. Dividends, interest, rental income and capital gains are not covered, so if you have meaningful unearned income the Foreign Tax Credit is usually the relief that does the real work.',
  },
  {
    q: 'Is there a catch to switching between them?',
    a: 'Yes. Once you revoke the FEIE, you generally cannot claim it again for five years without IRS permission, so switching is not something to do casually year to year. This is one reason the FEIE-versus-FTC decision should be made with the long term in view rather than optimised for a single year.',
  },
];

export default function FeieVsFtcPage() {
  return (
    <PageShell
      url={URL}
      eyebrow="Calculator"
      title="FEIE vs Foreign Tax Credit"
      answer="For most Americans in the UK, the Foreign Tax Credit is the stronger relief: UK tax rates are usually higher than US rates on the same income, so the credit typically offsets the US bill and can leave excess credits to carry forward, while also covering unearned income the FEIE cannot. The FEIE suits lower-tax situations. This tool gives a directional steer; the right choice depends on your facts and is often a multi-year decision."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
        { label: 'FEIE vs Foreign Tax Credit', href: URL },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-06-30"
      faqs={faqs}
      ctaTitle="Choosing between the FEIE and the FTC?"
      ctaIntro="It's one of the most consequential and long-lasting choices in US expat tax. We'll model both on your real numbers — the first consultation is free."
    >
      <Section tone="white">
        <Container>
          <FeieVsFtcCalculator />
          <CalculatorRelatedLinks {...calculatorLinks['feie-vs-ftc']} />
        </Container>
      </Section>
    </PageShell>
  );
}
