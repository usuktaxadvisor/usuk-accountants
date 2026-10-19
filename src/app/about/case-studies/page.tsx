import type { Metadata } from 'next';
import {
  Header, Footer, Section, Container, CTASection, CaseStudyGrid, Breadcrumbs, JsonLd,
} from '@/components/library';
import { caseStudies } from '@/lib/authority-data';
import { breadcrumbSchema } from '@/lib/schema';

const crumbs = [{ label: 'Case studies', href: '/about/case-studies' }];

export const metadata: Metadata = {
  title: 'Case Studies: Real US-UK Client Matters',
  description:
    'Anonymised client matters: catching up on missed US returns, dual-citizen company structuring, and a US to UK relocation. Real engagements, with every identifying detail removed.',
  alternates: { canonical: 'https://www.usukaccountants.com/about/case-studies' },
};

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(crumbs)} />
      <Header />
      <main>
        <Breadcrumbs crumbs={crumbs} />
        <header className="page-header py-20 md:py-28">
          <div aria-hidden="true" data-parallax="0.1" className="page-header-art parallax-layer art-about" />
          <Container>
            <div className="max-w-2xl">
              <p className="kicker kicker-light">Client matters</p>
              <h1 className="mt-3 font-display text-display-lg text-white">
                How we approach cross-border problems
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Real engagements, written up with every identifying detail removed. They show the cross-border
                situations we specialise in and how we worked through them. Each one turned on its own facts, so
                nothing here is a prediction of what another case would produce.
              </p>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <Container>
            <CaseStudyGrid studies={caseStudies} />
          </Container>
        </Section>

        <CTASection
          title="Your situation could be our next case study"
          intro="Book a consultation and we will map the route through your cross-border tax."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
