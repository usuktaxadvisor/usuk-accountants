import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Container } from '@/components/library';
import { IconCalculator, IconGlobeDoc, IconShield, IconPlanning, IconTreaty, IconBank, IconArrowRight } from '@/components/ui/icons';
import { authors } from '@/lib/authority-data';
import { calculators } from '@/lib/site-data';

const URL = 'https://www.usukaccountants.com/resources/calculators';
const icons = { calculator: IconCalculator, globe: IconGlobeDoc, shield: IconShield, planning: IconPlanning, treaty: IconTreaty, bank: IconBank } as const;

export const metadata: Metadata = {
  title: 'US–UK Tax Calculators & Tools',
  description:
    'Free cross-border tax tools: the US/UK Double-Tax Estimator, FBAR checker, Streamlined eligibility, FEIE vs Foreign Tax Credit, UK residence test and more.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'katie-m')!;

const faqs = [
  { q: 'Are these tax calculators free to use?', a: 'Yes. Every tool here is free and gives an indicative estimate to help you understand your cross-border position. They are educational, not formal advice — for a precise answer we offer a £300 30-minute consultation, and general questions are answered free by email.' },
  { q: 'How accurate are the estimates?', a: 'They use current headline rules and rates to give a directional figure. Real outcomes depend on the full detail of your situation, which is why each tool ends with the option to speak to a specialist.' },
];

export default function CalculatorHub() {
  return (
    <PageShell
      url={URL}
      eyebrow="Resources · Calculators"
      title="Cross-border tax calculators & tools"
      answer="Our free tools help Americans in the UK, Brits in the US and dual citizens understand their cross-border tax position — from whether you'll be taxed twice, to whether you need to file an FBAR, to which US relief leaves you better off. Each gives an indicative estimate, then connects you to a specialist."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Calculators', href: '/resources/calculators' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-22"
      faqs={faqs}
      ctaTitle="Want a precise answer for your situation?"
      ctaIntro="The tools give you a direction. A £300 30-minute consultation gives you certainty — and quick questions are answered free by email."
    >
      <Section tone="white">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((c) => {
              const Icon = icons[c.iconKey];
              const live = c.status === 'live';
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${live ? 'bg-gold/10 text-gold-antique group-hover:bg-gold/20 group-hover:text-gold' : 'bg-mist/60 text-muted'}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    {!live && <span className="rounded-full bg-mist/60 px-2.5 py-1 text-xs font-medium text-muted">Coming soon</span>}
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-white">{c.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-softwhite/80">{c.description}</p>
                  {live && (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-antique transition-colors duration-300 group-hover:text-gold">
                      Open calculator <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </>
              );
              return live ? (
                <Link key={c.slug} href={`/resources/calculators/${c.slug}`} className="group flex flex-col rounded-2xl border border-mist bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-ink hover:bg-navy-ink hover:shadow-e2">
                  {inner}
                </Link>
              ) : (
                <div key={c.slug} className="flex flex-col rounded-2xl border border-mist bg-white p-6 opacity-80">
                  {inner}
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
