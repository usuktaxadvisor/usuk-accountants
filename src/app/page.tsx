import {
  Header, Footer, MobileBar,
  Hero, TrustBar, Pillars, Calculator, ServicesSection,
  WhoWeHelp, ProcessStats, TestimonialsSection, FAQSection, CTASection,
} from '@/components/library';

export default function Home() {
  return (
    <>
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
          secondary={{ label: 'Call us', href: 'tel:+442045250000' }}
          showPhone
        />
      </main>
      <Footer />
      <MobileBar />
      <div className="h-16 lg:hidden" aria-hidden />
    </>
  );
}
