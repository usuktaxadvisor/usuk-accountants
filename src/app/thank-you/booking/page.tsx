import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, Container, Button } from '@/components/library';
import { IconCheck } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Thank You — Consultation Booked',
  description: 'Your consultation request has been received. A US–UK tax specialist will be in touch shortly.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.usukaccountants.com/thank-you/booking' },
};

export default function BookingThankYou() {
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
              You&rsquo;re booked in
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Thank you — we&rsquo;ve received your request and sent a confirmation to your email. A cross-border specialist will be in touch shortly to confirm your time.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/reviews">Read client reviews</Button>
              <Button href="/" variant="secondary">Back to home</Button>
            </div>
            <p className="mt-8 text-sm text-muted">
              Didn&rsquo;t get a confirmation email? Check your spam folder, or <Link href="/contact" className="font-medium text-gold-antique hover:underline">contact us</Link>.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
