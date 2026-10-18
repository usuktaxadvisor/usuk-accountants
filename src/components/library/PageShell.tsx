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
  /** Answer-first lead — 40–60 words. Marked .speakable for AI/voice extraction. */
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

        {/* Answer-first hero */}
        <header className={`bg-navy-ink bg-atlantic py-16 md:py-20 ${/manchester/i.test(title) ? "bg-loc-manchester" : /new york/i.test(title) ? "bg-loc-newyork" : /london/i.test(title) ? "bg-loc-london" : ""}`}>
          <Container>
            <div className="max-w-prose">
              {eyebrow && <div className="mb-3"><Eyebrow tone="gold-light">{eyebrow}</Eyebrow></div>}
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                {title}
              </h1>
              <p className="speakable mt-6 text-lg leading-relaxed text-softwhite/85">
                {answer}
              </p>
              <div className="mt-8">
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
                <h2 className="mb-8 text-center font-display text-3xl font-semibold tracking-tight text-ink">
                  Frequently asked questions
                </h2>
                <FAQAccordion items={faqs} emitSchema={false} />
              </div>
            </Container>
          </div>
        ) : null}

        <CTASection
          title={ctaTitle ?? 'Tell us about your situation'}
          intro={ctaIntro ?? 'Email us a short description of your circumstances — which country you file in, what has prompted the question and the years involved — and a US–UK specialist will reply with what we would need and a written quote. Work of this kind is handled by email, so every answer is documented. If you want detailed personal advice first, a 30-minute consultation can be booked (£350 individual, £550 business).'}
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
