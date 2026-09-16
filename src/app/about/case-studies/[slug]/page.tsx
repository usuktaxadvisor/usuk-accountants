import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Header, Footer, Container, CTASection, CaseStudyDetail, JsonLd, Breadcrumbs,
} from '@/components/library';
import { caseStudies } from '@/lib/authority-data';
import { breadcrumbSchema } from '@/lib/schema';

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
      <Header />
      <main>
        <Breadcrumbs crumbs={[
          { label: 'Case studies', href: '/about/case-studies' },
          { label: study.title, href: `/about/case-studies/${study.slug}` },
        ]} />

        <header className="bg-navy-ink py-14 md:py-16">
          <Container>
            <p className="mx-auto mb-3 max-w-prose text-xs font-semibold uppercase tracking-eyebrow text-gold">
              Illustrative scenario
            </p>
            <h1 className="mx-auto max-w-prose font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              {study.title}
            </h1>
            <p className="mx-auto mt-4 max-w-prose text-sm leading-relaxed text-softwhite/70">
              A representative example of how we approach this situation &mdash; not a specific client.
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
