import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Header, Footer, Container, BookingEmbed, JsonLd,
} from '@/components/library';
import { IconCheck, IconShield } from '@/components/ui/icons';
import { SITE, CONSULTATION_TIERS } from '@/lib/site-data';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Book a Consultation',
  description:
    'Book a private consultation with a US–UK cross-border tax specialist. Individual tax consultation (£200) or business & cross-border strategy session (£300), credited to your first engagement. General questions answered free by email.',
  alternates: { canonical: 'https://www.usukaccountants.com/book' },
};

function resolveTier(tierParam?: string) {
  return (
    CONSULTATION_TIERS.find((t) => t.id === tierParam && t.id !== 'private') ??
    CONSULTATION_TIERS.find((t) => t.id === 'individual')!
  );
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const { tier: tierParam } = await searchParams;
  const tier = resolveTier(tierParam);
  const isBusiness = tier.id === 'business';

  const reassurances = [
    `${tier.durationLabel} private consultation — ${tier.price}`,
    'Speak directly to a cross-border specialist',
    'Clear next steps for your exact situation',
    'Credited to your first engagement',
    'Quick questions? Email us free instead',
  ];

  const bookingSchema = breadcrumbSchema([
    { label: 'Home', href: '/' },
    { label: 'Book a Consultation', href: '/book' },
  ]);

  const consultationOfferSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'US–UK Cross-Border Tax Consultation',
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: ['GB', 'US'],
    description:
      'Private consultations with a US–UK cross-border tax specialist, credited to your first engagement.',
    offers: CONSULTATION_TIERS.filter((t) => t.id !== 'private').map((t) => ({
      '@type': 'Offer',
      name: t.name,
      price: t.id === 'business' ? '300' : '100',
      priceCurrency: 'GBP',
      url: `${SITE.url}${t.bookHref}`,
    })),
  };

  return (
    <>
      <JsonLd schema={bookingSchema} />
      <JsonLd schema={consultationOfferSchema} />
      <Header />
      <main>
        <header className="relative overflow-hidden bg-navy-ink py-16 md:py-20">
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-100 320 C 420 100, 1020 100, 1540 320" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.5" />
          </svg>
          <Container>
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">{tier.name}</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {isBusiness ? 'Plan your cross-border position with confidence' : 'Let\u2019s simplify your US–UK taxes'}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                {isBusiness
                  ? `A ${tier.durationLabel} working session (${tier.price}, credited to your first engagement) on structure, exposure and strategy for your business across both tax systems. Prefer to ask a quick question first? Email us and we\u2019ll answer general queries free.`
                  : `Choose a time that suits you for a focused ${tier.durationLabel} private consultation with a specialist \u2014 ${tier.price}, credited to your first engagement, and a clear view of exactly where you stand. Prefer to ask a quick question first? Email us and we\u2019ll answer general queries free.`}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                {CONSULTATION_TIERS.filter((t) => t.id !== 'private').map((t) => (
                  <Link
                    key={t.id}
                    href={t.bookHref}
                    className={[
                      'rounded-full px-4 py-2 font-medium transition',
                      t.id === tier.id ? 'bg-gold text-navy-ink' : 'border border-softwhite/30 text-softwhite/80 hover:border-gold hover:text-white',
                    ].join(' ')}
                  >
                    {t.name.replace(' & Cross-Border Strategy Session', ' Strategy').replace(' Tax Consultation', '')} · {t.price}
                  </Link>
                ))}
                <Link href="/contact?enquiry=private-client" className="rounded-full border border-softwhite/30 px-4 py-2 font-medium text-softwhite/80 transition hover:border-gold hover:text-white">
                  Private Client · by arrangement
                </Link>
              </div>
            </div>
          </Container>
        </header>

        <div className="bg-white py-16 md:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
              {/* Reassurance rail */}
              <aside>
                <ul className="space-y-3">
                  {reassurances.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-[15px] text-ink">
                      <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> {r}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl border border-mist bg-porcelain p-6">
                  <p className="text-sm font-medium text-ink">Specialists in both tax systems, not generalists</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    One team handles your US and UK position together &mdash; so your reliefs line up and nothing
                    falls between the two systems. Your {tier.price} {isBusiness ? 'strategy session' : 'consultation'} is a
                    dedicated {tier.durationLabel} with a cross-border specialist, focused entirely on your situation.
                  </p>
                </div>

                <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
                  <IconShield className="h-3.5 w-3.5 text-gold" /> Secure &amp; confidential. We never share your details.
                </p>

                <div className="mt-6 rounded-xl border border-mist p-5 text-sm">
                  <p className="font-medium text-ink">Prefer to talk now?</p>
                  <a href={`tel:${SITE.phones.uk.tel}`} className="mt-2 block text-muted hover:text-gold-antique">
                    {SITE.phones.uk.flag} {SITE.phones.uk.number}
                  </a>
                  <a href={`tel:${SITE.phones.us.tel}`} className="mt-1 block text-muted hover:text-gold-antique">
                    {SITE.phones.us.flag} {SITE.phones.us.number}
                  </a>
                </div>

                <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-5 text-sm">
                  <p className="font-medium text-ink">Just a quick question?</p>
                  <p className="mt-2 leading-relaxed text-muted">
                    General queries are answered free by email &mdash; no booking needed. The {tier.price}{' '}
                    {isBusiness ? 'strategy session' : 'consultation'} is for a dedicated, in-depth {tier.durationLabel} on your specific situation.
                  </p>
                  <a href={`mailto:${SITE.email}`} className="mt-3 inline-block font-semibold text-navy hover:text-gold">
                    {SITE.email}
                  </a>
                </div>
              </aside>

              {/* Scheduler */}
              <div id="schedule">
                <BookingEmbed source="book_page" tierId={tier.id === 'business' ? 'business' : 'individual'} />
              </div>
            </div>
          </Container>
        </div>

        <div className="border-t border-mist bg-porcelain py-16 md:py-20">
          <Container>
            <div className="mx-auto max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">What to expect</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
                Your consultation, end to end
              </h2>

              <div className="mt-10 grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <p className="font-display text-lg font-semibold text-ink">Before</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    You&rsquo;ll pick a time, pay securely, and receive a calendar invite with a private video
                    link. We&rsquo;ll ask a few short questions in advance so the specialist arrives already
                    briefed on your situation &mdash; no time wasted on background.
                  </p>
                </div>
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <p className="font-display text-lg font-semibold text-ink">During</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    A focused {tier.durationLabel} with a cross-border specialist who understands both
                    systems. We&rsquo;ll address your specific questions, flag the risks that matter, and give you
                    a clear view of your US&ndash;UK position &mdash; in plain English.
                  </p>
                </div>
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <p className="font-display text-lg font-semibold text-ink">After</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    You&rsquo;ll leave knowing your next steps. If you&rsquo;d like us to handle the work,
                    we&rsquo;ll follow up with a clear, fixed-scope quote &mdash; and the consultation fee is
                    credited against your first engagement.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <div className="flex items-center gap-2">
                    <IconShield className="h-4 w-4 text-gold" aria-hidden />
                    <p className="font-display text-base font-semibold text-ink">Cancellation &amp; refunds</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Reschedule or cancel free up to 24 hours before your slot for a full refund. Within 24 hours,
                    the fee covers the reserved specialist time and isn&rsquo;t refundable, though we&rsquo;ll
                    always try to move you to another time where we can.
                  </p>
                </div>
                <div className="rounded-2xl border border-mist bg-white p-6">
                  <div className="flex items-center gap-2">
                    <IconShield className="h-4 w-4 text-gold" aria-hidden />
                    <p className="font-display text-base font-semibold text-ink">Confidential &amp; secure</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Everything you share is treated in strict confidence and handled in line with UK GDPR.
                    Payment is processed securely by our payment provider &mdash; we never see or store your card
                    details. Read our{' '}
                    <Link href="/privacy" className="font-medium text-navy hover:text-gold">privacy policy</Link>.
                  </p>
                </div>
              </div>

              <p className="mx-auto mb-4 max-w-2xl text-sm leading-relaxed text-muted">For most enquiries, we recommend contacting us by email. Our team aims to respond to all email enquiries within 3 business hours during business days. If your matter requires personalised tax advice or a detailed discussion, please book a consultation with one of our specialists.</p>
              <p className="mt-8 text-center text-sm text-muted">
                Not sure you need a full consultation yet?{' '}
                <a href={`mailto:${SITE.email}`} className="font-medium text-navy hover:text-gold">
                  Email us your question free
                </a>{' '}at{' '}<span className="font-medium text-navy">{SITE.email}</span>{' '}
                &mdash; we answer general queries at no charge.
              </p>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
