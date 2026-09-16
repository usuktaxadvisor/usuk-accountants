import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Container, SectionHeading, JsonLd } from '@/components/library';
import { IconArrowRight } from '@/components/ui/icons';
import { authors } from '@/lib/authority-data';

/**
 * /resources/guides — index for the site's long-form guides.
 *
 * Previously unbuilt: the route fell through to the [...slug] "Coming Soon"
 * catch-all (noindex, canonical → homepage) even though two guide pages
 * already lived beneath it and were linked from the glossary, tax-data and
 * comparison pages. This index lists those guides and the comparison guides
 * using each page's own published title/description — no new tax content.
 */

const URL = 'https://www.usukaccountants.com/resources/guides';

export const metadata: Metadata = {
  title: 'US–UK Tax Guides for Expats & Dual Citizens',
  description:
    'Step-by-step guides and side-by-side comparisons for people who file in both the US and the UK — deadlines, late FBARs, FBAR vs Form 8938, FEIE vs the Foreign Tax Credit, and more. Written and reviewed by our cross-border team.',
  alternates: { canonical: URL },
};

const author = authors.find((a) => a.slug === 'sam-h')!;
const reviewedBy = authors.find((a) => a.slug === 'sal-t')!;

type Card = { title: string; description: string; href: string; kicker?: string };

// Titles and descriptions mirror each destination page's own metadata.
const GUIDES: Card[] = [
  {
    title: 'US–UK tax deadlines calendar',
    kicker: 'Deadlines',
    description:
      'The key US and UK tax deadlines in one place: IRS filing and the automatic expat extension, FBAR, UK Self Assessment, payments on account and Corporation Tax — for anyone filing on both sides of the Atlantic.',
    href: '/resources/guides/tax-deadlines-calendar',
  },
  {
    title: 'Delinquent FBAR: how to file late FBARs the right way',
    kicker: 'Catching up',
    description:
      'A step-by-step guide to catching up on missed FBARs from the UK: the Delinquent FBAR Submission Procedures, reasonable cause, and when Streamlined Filing is a better fit.',
    href: '/resources/guides/delinquent-fbar',
  },
];

const COMPARISONS: Card[] = [
  {
    title: 'FBAR vs Form 8938',
    description: 'FBAR and Form 8938 are two separate US foreign-account reports. Learn who files each, how they differ, and why many Americans in the UK must file both.',
    href: '/resources/compare/fbar-vs-form-8938',
  },
  {
    title: 'FEIE vs Foreign Tax Credit',
    description: 'The Foreign Earned Income Exclusion and the Foreign Tax Credit are two different ways to avoid double taxation. Learn how each mechanism works, who each suits, and how they interact for Americans in the UK.',
    href: '/resources/compare/feie-vs-foreign-tax-credit',
  },
  {
    title: 'Streamlined Filing vs Delinquent FBAR',
    description: 'Streamlined Filing and the Delinquent FBAR submission procedures are two different IRS catch-up routes. Learn which fits your situation as an American in the UK.',
    href: '/resources/compare/streamlined-filing-vs-delinquent-fbar',
  },
  {
    title: 'Foreign Tax Credit vs the US–UK tax treaty',
    description: 'The foreign tax credit and the US–UK tax treaty are different tools for avoiding double taxation. Learn how they work and how they interact for Americans in the UK.',
    href: '/resources/compare/foreign-tax-credit-vs-tax-treaty',
  },
  {
    title: 'US tax return vs UK tax return',
    description: 'US and UK tax returns work on different principles — citizenship-based vs residence-based taxation. Learn how the two systems differ for Americans in the UK.',
    href: '/resources/compare/us-tax-return-vs-uk-tax-return',
  },
];

const MORE: Card[] = [
  { title: 'Insights & articles', description: 'Plain-English articles on US expat tax, UK accounting and cross-border planning.', href: '/resources/blog' },
  { title: 'IRS forms library', description: 'Plain-English explanations of the key US information returns for expats and dual filers.', href: '/resources/forms' },
  { title: 'Calculators & tools', description: 'Interactive estimators for double taxation, FBAR, residency and more.', href: '/resources/calculators' },
  { title: 'Glossary', description: 'Clear definitions of the US and UK tax terms that matter — FBAR, FEIE, SRT, PFIC and more.', href: '/resources/glossary' },
];

const SITE = 'https://www.usukaccountants.com';

/** CollectionPage + ItemList: tells search and AI systems this URL is the index of the guides it lists, and in what order. */
const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': URL,
  url: URL,
  name: 'US–UK tax guides',
  description: metadata.description,
  isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website` },
  about: { '@type': 'Thing', name: 'US–UK cross-border taxation' },
  mainEntity: {
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: GUIDES.length,
    itemListElement: GUIDES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      url: `${SITE}${c.href}`,
    })),
  },
};

function GuideCard({ card, cta }: { card: Card; cta: string }) {
  return (
    <Link
      href={card.href}
      className="group flex flex-col rounded-2xl border border-mist bg-white p-7 shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:bg-navy-ink hover:shadow-gold"
    >
      {card.kicker ? (
        <span className="mb-3 text-xs font-semibold uppercase tracking-eyebrow text-gold-antique transition-colors duration-300 group-hover:text-gold">
          {card.kicker}
        </span>
      ) : null}
      <h3 className="font-display text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-white">
        {card.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-softwhite/80">
        {card.description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors duration-300 group-hover:text-gold">
        {cta}
        <IconArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export default function GuidesIndex() {
  return (
    <PageShell
      url={URL}
      eyebrow="Resources · Guides"
      title="US–UK tax guides"
      answer="Longer-form, step-by-step guides for people who file in both the US and the UK, alongside side-by-side comparisons of the reliefs, reports and routes that most often get confused. Each guide is written by our team and reviewed for IRS or HMRC accuracy, and links to the calculators, forms and glossary terms it relies on."
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Guides', href: '/resources/guides' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-09-16"
      ctaTitle="Need an answer for your own situation?"
      ctaIntro="Guides explain the rules; they can't apply them to your facts. Book a £350 30-minute consultation and we'll give you a clear answer for yours — or email us for a quick question."
    >
      <JsonLd schema={collectionSchema} />
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Step-by-step"
            title="Guides"
            intro="Worked-through explanations of a single topic, from first principles to what to actually do."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {GUIDES.map((c) => <GuideCard key={c.href} card={c} cta="Read the guide" />)}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="From our Compare section"
            title="Related comparisons"
            intro="Two things that sound alike, set out next to each other so you can see which one applies to you. These live in their own section — browse all of them at Compare."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMPARISONS.map((c) => <GuideCard key={c.href} card={c} cta="Compare" />)}
          </div>
          <p className="mt-6">
            <Link href="/resources/compare" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 hover:text-gold hover:underline">
              Browse the full Compare section
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </p>
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
