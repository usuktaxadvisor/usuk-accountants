import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Container, SectionHeading, JsonLd } from '@/components/library';
import { IconArrowRight } from '@/components/ui/icons';
import { authors } from '@/lib/authority-data';

/**
 * /resources/compare — index for the side-by-side comparison resources.
 *
 * Previously unbuilt: the route fell through to the [...slug] "Coming Soon"
 * catch-all, so the five comparison pages had no parent and their
 * breadcrumbs were routed through the Guides index. Every card's title and
 * description mirrors the destination page's own metadata — no new tax content.
 */

const SITE = 'https://www.usukaccountants.com';
const URL = `${SITE}/resources/compare`;

export const metadata: Metadata = {
  title: 'Compare US–UK Tax Rules Side by Side: FBAR vs 8938, FEIE vs FTC & More',
  description:
    'Side-by-side comparisons of the US and UK tax rules, reliefs, reports and catch-up routes that Americans in the UK most often confuse — FBAR vs Form 8938, FEIE vs the Foreign Tax Credit, Streamlined vs Delinquent FBAR, and more.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

type Comparison = {
  title: string;
  description: string;
  href: string;
  /** The question a visitor is usually asking when this comparison is the right one. */
  useWhen: string;
};

// Titles and descriptions mirror each destination page's own metadata.
const COMPARISONS: Comparison[] = [
  {
    title: 'FBAR vs Form 8938',
    description: 'FBAR and Form 8938 are two separate US foreign-account reports. Learn who files each, how they differ, and why many Americans in the UK must file both.',
    href: '/resources/compare/fbar-vs-form-8938',
    useWhen: 'You have UK bank, savings or investment accounts and are not sure which US report — or whether both — applies.',
  },
  {
    title: 'FEIE vs Foreign Tax Credit',
    description: 'The Foreign Earned Income Exclusion and the Foreign Tax Credit are two different ways to avoid double taxation. Learn how each mechanism works, who each suits, and how they interact for Americans in the UK.',
    href: '/resources/compare/feie-vs-foreign-tax-credit',
    useWhen: 'You earn in the UK and want to understand which relief to claim on your US return, and what switching between them means.',
  },
  {
    title: 'Streamlined Filing vs Delinquent FBAR',
    description: 'Streamlined Filing and the Delinquent FBAR submission procedures are two different IRS catch-up routes. Learn which fits your situation as an American in the UK.',
    href: '/resources/compare/streamlined-filing-vs-delinquent-fbar',
    useWhen: 'You are behind on US filings and need to know whether you missed only the FBAR, or the returns too.',
  },
  {
    title: 'Foreign Tax Credit vs the US–UK tax treaty',
    description: 'The foreign tax credit and the US–UK tax treaty are different tools for avoiding double taxation. Learn how they work and how they interact for Americans in the UK.',
    href: '/resources/compare/foreign-tax-credit-vs-tax-treaty',
    useWhen: 'You have pension, investment or other income where the treaty and the credit could both apply, and want to see how they fit together.',
  },
  {
    title: 'US tax return vs UK tax return',
    description: 'US and UK tax returns work on different principles — citizenship-based vs residence-based taxation. Learn how the two systems differ for Americans in the UK.',
    href: '/resources/compare/us-tax-return-vs-uk-tax-return',
    useWhen: 'You are new to filing in both countries and want the two systems explained against each other before anything else.',
  },
];

const MORE = [
  { title: 'Guides', description: 'Step-by-step guides that take a single topic from first principles to what to actually do.', href: '/resources/guides' },
  { title: 'Calculators & tools', description: 'Interactive estimators for double taxation, FBAR, residency and more.', href: '/resources/calculators' },
  { title: 'IRS forms library', description: 'Plain-English explanations of the key US information returns for expats and dual filers.', href: '/resources/forms' },
  { title: 'Glossary', description: 'Clear definitions of the US and UK tax terms that matter — FBAR, FEIE, SRT, PFIC and more.', href: '/resources/glossary' },
];

/** CollectionPage + ItemList: tells search and AI systems this URL is the index of the five comparisons it lists. */
const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': URL,
  url: URL,
  name: 'Compare US–UK tax rules side by side',
  description: metadata.description,
  isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website` },
  about: { '@type': 'Thing', name: 'US–UK cross-border taxation' },
  mainEntity: {
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: COMPARISONS.length,
    itemListElement: COMPARISONS.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      url: `${SITE}${c.href}`,
    })),
  },
};

export default function CompareIndex() {
  return (
    <PageShell
      url={URL}
      eyebrow="Resources · Compare"
      title="Compare US–UK tax rules side by side"
      answer="Cross-border tax is full of pairs that sound alike but work differently — two foreign-account reports, two double-tax reliefs, two catch-up routes, two entire tax systems. Each comparison here sets one pair out side by side: what each is for, who it applies to, how they interact, and where people go wrong. Every page links to the guides, calculators and glossary terms behind it."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Compare', href: '/resources/compare' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-09-16"
      ctaTitle="Know which applies to you — but not what to do next?"
      ctaIntro="Comparisons explain the difference; they can't decide it for your facts. Book a £350 30-minute consultation and we'll tell you which route is right for your situation — or email us for a quick question."
    >
      <JsonLd schema={collectionSchema} />

      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Side by side"
            title="The comparisons"
            intro="Five pairs that Americans in the UK most often confuse, each explained against the other."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMPARISONS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col rounded-2xl border border-mist bg-white p-7 shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:bg-navy-ink hover:shadow-gold"
              >
                <h3 className="font-display text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-white">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-softwhite/80">
                  {c.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors duration-300 group-hover:text-gold">
                  Compare
                  <IconArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Start here"
            title="Which comparison do you need?"
            intro="If you know your situation but not the terminology, match it here."
          />
          <dl className="mt-8 divide-y divide-mist rounded-2xl border border-mist bg-white">
            {COMPARISONS.map((c) => (
              <div key={c.href} className="grid gap-2 px-7 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <dt className="text-sm leading-relaxed text-ink">{c.useWhen}</dt>
                <dd>
                  <Link href={c.href} className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">
                    {c.title}
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading eyebrow="Keep going" title="More resources" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MORE.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col rounded-2xl border border-mist bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-e2"
              >
                <h3 className="font-display text-lg font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-antique">
                  Explore <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
