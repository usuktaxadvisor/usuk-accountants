import { JsonLd } from '@/components/library';
import { faqSchema } from '@/lib/schema';
import { faqs as siteFaqs } from '@/lib/site-data';
import {
  Header, Footer, MobileBar,
  Hero, TrustBar, Pillars, Calculator, ServicesSection,
  WhoWeHelp, ProcessStats, TestimonialsSection, FAQSection, CTASection,
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
        <ProcessStats />
        <TestimonialsSection />
        <FAQSection />
        <CTASection
          title="Ready to simplify your US–UK taxes?"
          intro="Book a free 15-minute consultation. No obligation, no jargon — just a clear view of where you stand and what comes next."
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
