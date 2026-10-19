import type { ReactNode } from 'react';
import Header from '@/components/library/Header';
import Footer from '@/components/library/Footer';
import { Breadcrumbs } from '@/components/library/Breadcrumbs';
import { JsonLd } from '@/components/library/JsonLd';
import { FAQAccordion } from '@/components/library/FAQAccordion';
import { AuthorByline } from '@/components/library/Authors';
import { CTASection } from '@/components/library/CTASection';
import { Container, Eyebrow } from '@/components/library/primitives';
import {
  breadcrumbSchema, faqSchema,
  personSchema, articleSchema, speakableSchema, serviceSchema,
  type Crumb, type FaqEntry, type PersonInput, type ServiceSchemaInput, type SchemaEntity,
  howToSchema, type HowToInput,
} from '@/lib/schema';
import type { Author } from '@/lib/types';

export interface PageShellProps {
  /** Page identity */
  url: string;
  eyebrow?: string;
  title: string;
  /** Answer-first lead, 40–60 words. Marked .speakable for AI/voice extraction. */
  answer: string;
  crumbs: Crumb[];

  /** EEAT entities (REQUIRED for GEO contract) */
  author: Author;
  reviewedBy?: Author;
  datePublished?: string;
  dateModified?: string;

  /** Optional schema add-ons */
  faqs?: FaqEntry[];
  service?: ServiceSchemaInput;
  howTo?: HowToInput;
  about?: SchemaEntity[];
  mentions?: SchemaEntity[];

  /** Page body */
  children: ReactNode;

  /** Closing CTA (defaults to book) */
  ctaTitle?: string;
  ctaIntro?: string;
}

/** Picks the section photograph for the page header from the breadcrumb trail (or a location title). */
function artClass(crumbs: Crumb[], title: string): string {
  if (/manchester/i.test(title)) return 'art-manchester';
  if (/new york/i.test(title)) return 'art-newyork';
  if (/london/i.test(title)) return 'art-london';
  const hrefs = crumbs.map((c) => c.href);
  const has = (p: string) => hrefs.some((h) => h.startsWith(p));
  if (has('/services/us-expat-tax')) return 'art-us-expat';
  if (has('/services/uk-accounting')) return 'art-uk-accounting';
  if (has('/services/cross-border-advisory')) return 'art-advisory';
  if (has('/services')) return 'art-us-expat';
  if (has('/who-we-help')) return 'art-who';
  if (has('/about')) return 'art-about';
  if (has('/resources')) return 'art-resources';
  return 'art-about';
}

function toPersonInput(a: Author): PersonInput {
  return {
    slug: a.slug,
    name: a.name,
    role: a.role,
    credentials: a.credentials,
    expertise: a.expertise,
    description: a.bio,
    sameAs: a.sameAs,
  };
}

/**
 * GEO-ready page template. Every content page wraps its body in <PageShell>
 * and automatically inherits the full AI-search contract:
 *   Organization + WebSite + Breadcrumb + FAQ + Author + Reviewed-by +
 *   Article (authorship/review) + Speakable + (optional) Service schema,
 *   plus answer-first lead, visible breadcrumbs, byline, and FAQ section.
 */
export function PageShell({
  url, eyebrow, title, answer, crumbs,
  author, reviewedBy, datePublished, dateModified,
  faqs, service,
  children, ctaTitle, ctaIntro,
  howTo,
  about,
  mentions,
}: PageShellProps) {
  // Organization + WebSite are emitted once, sitewide, from the root layout.
  const schemas: object[] = [
    breadcrumbSchema(crumbs),
    personSchema(toPersonInput(author)),
    articleSchema({
      url,
      headline: title,
      description: answer,
      author: toPersonInput(author),
      reviewedBy: reviewedBy ? toPersonInput(reviewedBy) : undefined,
      datePublished,
      dateModified,
      about,
      mentions,
    }),
    speakableSchema(url, ['.speakable']),
  ];
  if (reviewedBy) schemas.push(personSchema(toPersonInput(reviewedBy)));
  if (faqs?.length) schemas.push(faqSchema(faqs));
  if (service) schemas.push(serviceSchema(service));
  if (howTo?.steps?.length) schemas.push(howToSchema(howTo));

  return (
    <>
      <JsonLd schema={schemas} />
      <Header />
      <main>
        <Breadcrumbs crumbs={crumbs} />

        {/* Answer-first hero: one photograph per section behind a navy wash, title set large. */}
        <header className="page-header py-20 md:py-28">
          <div aria-hidden="true" data-parallax="0.1" className={`page-header-art parallax-layer ${artClass(crumbs, title)}`} />
          <Container>
            <div className="max-w-3xl">
              {eyebrow && <div className="mb-5"><Eyebrow tone="gold-light">{eyebrow}</Eyebrow></div>}
              <h1 className="font-display text-display-lg text-white">
                {title}
              </h1>
              <p className="speakable mt-7 max-w-[62ch] text-lg leading-relaxed text-softwhite/85">
                {answer}
              </p>
              <div className="mt-9">
                <AuthorByline author={author} date={dateModified ?? datePublished} reviewedBy={reviewedBy} />
              </div>
            </div>
          </Container>
        </header>

        {/* Page body */}
        <div className="bg-white py-16 md:py-20">
          <Container>{children}</Container>
        </div>

        {/* FAQ (visible + already in schema above) */}
        {faqs?.length ? (
          <div className="bg-porcelain py-16 md:py-20">
            <Container>
              <div className="mx-auto max-w-3xl">
                <h2 className="mb-10 text-center font-display text-display-md text-ink">
                  Frequently asked questions
                </h2>
                <FAQAccordion items={faqs} emitSchema={false} />
              </div>
            </Container>
          </div>
        ) : null}

        <CTASection
          title={ctaTitle ?? 'Tell us about your situation'}
          intro={ctaIntro ?? 'Email us a short description of your circumstances (which country you file in, what has prompted the question and the years involved) and a US–UK specialist will reply with what we would need and a written quote. Work of this kind is handled by email, so every answer is documented. If you want detailed personal advice first, a 30-minute consultation can be booked (£350 individual, £550 business).'}
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
