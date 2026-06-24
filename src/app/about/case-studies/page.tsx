import type { Metadata } from 'next';
import {
  Header, Footer, Section, Container, CTASection, CaseStudyGrid,
} from '@/components/library';
import { caseStudies } from '@/lib/authority-data';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Illustrative cross-border scenarios: Streamlined Filing without penalties, dual-citizen company structuring, and clean US–UK relocations — representative examples of how we work.',
  alternates: { canonical: 'https://www.usukaccountants.com/about/case-studies' },
};

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        <header className="bg-navy-ink py-16 md:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">Illustrative scenarios</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                How we approach cross-border problems
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Illustrative examples of the cross-border situations we specialise in and how we work through them.
                These are representative scenarios, not specific clients &mdash; we&rsquo;ll publish real,
                anonymised client outcomes here as our practice grows.
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
          intro="Book a free consultation and let's map the path through your cross-border tax."
          tone="navy"
        />
      </main>
      <Footer />
    </>
  );
}
