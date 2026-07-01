import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Container } from '@/components/library';
import { JsonLd } from '@/components/library/JsonLd';
import { definedTermSetSchema } from '@/lib/schema';
import { glossaryTerms, glossaryByCategory } from '@/lib/glossary';
import { authors } from '@/lib/authority-data';

const URL = 'https://www.usukaccountants.com/resources/glossary';

export const metadata: Metadata = {
  title: 'US–UK Cross-Border Tax Glossary',
  description:
    'Plain-English definitions of the US and UK tax terms that matter for expats, dual citizens and cross-border businesses — FBAR, FATCA, GILTI, PFIC, the saving clause, Section 121, and more.',
  alternates: { canonical: URL },
};

const faqs = [
  {
    q: 'What is the difference between FBAR and FATCA?',
    a: 'The FBAR (FinCEN Form 114) reports foreign financial accounts when their combined balance exceeds $10,000 at any point in the year, and is filed with FinCEN. FATCA reporting is done on Form 8938, filed with your tax return, covers a broader set of assets, and has much higher thresholds. They are independent — meeting one does not satisfy the other.',
  },
  {
    q: 'Why do US tax terms matter if I live in the UK?',
    a: 'The US taxes its citizens and green card holders on worldwide income regardless of where they live, so US terms like FBAR, FATCA, GILTI and PFIC apply to Americans in the UK alongside UK concepts like Self Assessment and Private Residence Relief. Cross-border tax sits at the intersection of both systems, which is why both sets of terms appear here.',
  },
];

export default function GlossaryIndex() {
  const grouped = glossaryByCategory();
  const setSchema = definedTermSetSchema(
    glossaryTerms.map((t) => ({ slug: t.slug, term: t.term, definition: t.short })),
  );

  return (
    <PageShell
      url={URL}
      eyebrow="Resources · Glossary"
      title="US–UK cross-border tax glossary"
      answer="Clear definitions of the US and UK tax terms that matter most for expats, dual citizens and cross-border businesses — from FBAR and FATCA to GILTI, PFIC, the saving clause and Private Residence Relief. Each term links to the guides that cover it in depth."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Glossary', href: '/resources/glossary' },
      ]}
      author={authors.find((a) => a.slug === 'sam-h')!}
      reviewedBy={authors.find((a) => a.slug === 'katie-m')!}
      faqs={faqs}
      ctaTitle="Came across a term that applies to you?"
      ctaIntro="If one of these touches your situation, a short conversation will tell you exactly where you stand. The first consultation is £100 for a focused 30 minutes."
    >
      <JsonLd schema={setSchema} />
      <Section tone="white">
        <Container>
          <div className="space-y-14">
            {grouped.map(([category, terms]) => (
              <div key={category}>
                <h2 className="mb-6 font-display text-2xl font-semibold text-ink">
                  {category}
                  <span className="ml-3 align-middle text-sm font-normal text-muted">
                    {terms.length} {terms.length === 1 ? 'term' : 'terms'}
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {terms.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/resources/glossary/${t.slug}`}
                      className="group rounded-2xl border border-mist bg-white p-6 shadow-e1 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-ink hover:shadow-gold"
                    >
                      <h3 className="font-display text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-white">
                        {t.term}
                      </h3>
                      {t.expansion && (
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gold-antique transition-colors duration-300 group-hover:text-gold">
                          {t.expansion}
                        </p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-softwhite/80">
                        {t.short}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
