import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Header, Footer, Container, CTASection, CaseStudyDetail, JsonLd, Breadcrumbs,
} from '@/components/library';
import { caseStudies, authors } from '@/lib/authority-data';
import { breadcrumbSchema, articleSchema } from '@/lib/schema';

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return { title: 'Case study not found' };
  return {
    title: study.title,
    description: study.challenge,
    alternates: { canonical: `https://www.usukaccountants.com/about/case-studies/${study.slug}` },
  };
}

export default async function CaseStudyPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) notFound();

  return (
    <>
      <JsonLd schema={breadcrumbSchema([
        { label: 'Case studies', href: '/about/case-studies' },
        { label: study.title, href: `/about/case-studies/${study.slug}` },
      ])} />
      <JsonLd schema={articleSchema({
        url: `/about/case-studies/${study.slug}`,
        headline: study.title,
        description: study.challenge,
        author: authors.find((a) => a.slug === 'sam-h')!,
        reviewedBy: authors.find((a) => a.slug === 'sal-t')!,
        datePublished: '2026-06-24',
        dateModified: '2026-10-19',
        about: study.services.map((l) => ({ name: l.label, url: l.href })),
      })} />
      <Header />
      <main>
        <Breadcrumbs crumbs={[
          { label: 'Case studies', href: '/about/case-studies' },
          { label: study.title, href: `/about/case-studies/${study.slug}` },
        ]} />

        <header className="page-header py-20 md:py-28">
          <div aria-hidden="true" data-parallax="0.1" className="page-header-art parallax-layer art-about" />
          <Container>
            <p className="mx-auto mb-3 max-w-prose kicker kicker-light kicker-center">
              Client matter
            </p>
            <h1 className="mx-auto max-w-prose font-display text-display-md text-white">
              {study.title}
            </h1>
            <p className="mx-auto mt-4 max-w-prose text-sm leading-relaxed text-softwhite/70">
              An anonymised client engagement. Identifying details have been removed.
            </p>
          </Container>
        </header>

        <div className="bg-white py-16 md:py-20">
          <Container>
            <CaseStudyDetail study={study} />
          </Container>
        </div>

        <CTASection
          title="Facing something similar?"
          intro="A consultation from £350 is the focused way to find out where you stand."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
