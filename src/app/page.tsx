import { JsonLd } from '@/components/library';
import { faqSchema } from '@/lib/schema';
import { faqs as siteFaqs } from '@/lib/site-data';
import {
  Header, Footer, MobileBar,
  Hero, TrustBar, Pillars, Calculator, ServicesSection,
  WhoWeHelp, ProcessStats, TestimonialsSection, FAQSection, CTASection,
  Section, Container, ConsultationTiers,
} from '@/components/library';

export default function Home() {
  return (
    <>
      <JsonLd schema={[faqSchema(siteFaqs)]} />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Pillars />
        <Calculator />
        <ServicesSection />
        <WhoWeHelp />
        <Section tone="white">
          <Container>
            <ConsultationTiers />
          </Container>
        </Section>
        <ProcessStats />
        <TestimonialsSection />
        <section className="bg-navy-ink py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl">
              <img src="/images/atlantic/bridge-london.jpg" alt="Tower Bridge in London at dusk, its walkways traced in warm golden light" width={1800} height={1013} loading="lazy" className="h-64 w-full object-cover sm:h-80" />
              <figcaption className="mt-3 text-sm font-semibold tracking-wide text-softwhite/70">LONDON</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl">
              <img src="/images/atlantic/loc-newyork.jpg" alt="Brooklyn Bridge at dusk with the warm lights of Lower Manhattan beyond" width={1800} height={1013} loading="lazy" className="h-64 w-full object-cover sm:h-80" />
              <figcaption className="mt-3 text-sm font-semibold tracking-wide text-softwhite/70">NEW YORK</figcaption>
            </figure>
          </div>
        </section>
        <FAQSection />
        <CTASection
          title="Ready to simplify your US–UK taxes?"
          intro="Book a £350 30-minute consultation — a clear view of where you stand and what comes next. Quick questions? Email us free."
          tone="navy"
          secondary={{ label: 'Call us', href: 'tel:+443330904129' }}
          showPhone
        />
      </main>
      <Footer />
      <MobileBar />
      <div className="h-16 lg:hidden" aria-hidden />
    </>
  );
}
