import type { Metadata } from 'next';
import { Header, Footer, Container, Button } from '@/components/library';
import { IconCheck } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Thank You — Message Received',
  description: 'Your message has been received. A US–UK tax specialist will reply within one business day.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.usukaccountants.com/thank-you/contact' },
};

export default function ContactThankYou() {
  return (
    <>
      <Header />
      <main className="bg-white py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-prose text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-antique">
              <IconCheck className="h-8 w-8" />
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink">
              Message received
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Thank you for getting in touch. A cross-border specialist will reply within one business day. In the meantime, feel free to explore our free resources.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/book">Book a free consultation</Button>
              <Button href="/trust-center" variant="secondary">Why clients trust us</Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
