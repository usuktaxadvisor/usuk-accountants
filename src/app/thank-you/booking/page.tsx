import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, Container, Button } from '@/components/library';
import { IconCheck } from '@/components/ui/icons';
import { CONSULTATION_TIERS } from '@/lib/site-data';
import BookingConversionTracker from '@/components/library/BookingConversionTracker';

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Your consultation with US UK Accountants is confirmed.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.usukaccountants.com/thank-you/booking' },
};

export default async function BookingThankYou({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; tier?: string }>;
}) {
  const { source, tier: tierParam } = await searchParams;
  const isPaidBooking = source === 'calcom';
  const tier =
    CONSULTATION_TIERS.find((t) => t.id === tierParam && t.id !== 'private') ??
    CONSULTATION_TIERS.find((t) => t.id === 'individual')!;

  return (
    <>
      <Header />
      {isPaidBooking && (
        <BookingConversionTracker tier={tier.id === 'business' ? 'business' : 'individual'} />
      )}
      <main className="bg-white py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-prose text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-antique">
              <IconCheck className="h-8 w-8" />
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink">
              {isPaidBooking ? 'Your consultation is confirmed' : 'Request received'}
            </h1>
            {isPaidBooking ? (
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Thank you — your {tier.name.toLowerCase()} is booked and paid. A calendar invite with
                your private video link is on its way to your inbox, along with a payment receipt. We&rsquo;ll
                send a short note before the session so your specialist arrives fully briefed. Your fee is
                credited against your first engagement if you go on to instruct us.
              </p>
            ) : (
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Thank you — we&rsquo;ve received your request. A cross-border specialist will email you shortly with available times and a secure link to confirm and pay for your consultation. Prefer a quick answer at no charge? Just reply to that email with your question.
              </p>
            )}
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
