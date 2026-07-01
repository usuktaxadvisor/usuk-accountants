import type { Metadata } from 'next';
import {
  Header, Footer, Container, BookingEmbed,
} from '@/components/library';
import { IconCheck, IconShield } from '@/components/ui/icons';
import { SITE } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Book a Consultation',
  description:
    'Book a private 30-minute consultation with a US–UK cross-border tax specialist for £100. Choose an available time slot online. General questions are answered free by email.',
  alternates: { canonical: 'https://www.usukaccountants.com/book' },
};

const reassurances = [
  '30-minute private consultation — £100',
  'Speak directly to a cross-border specialist',
  'Clear next steps for your exact situation',
  'Timezone-friendly slots for US & UK',
  'Quick questions? Email us free instead',
];

export default function BookPage() {
  return (
    <>
      <Header />
      <main>
        <header className="relative overflow-hidden bg-navy-ink py-16 md:py-20">
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-100 320 C 420 100, 1020 100, 1540 320" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.5" />
          </svg>
          <Container>
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">Book a consultation</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Let&rsquo;s simplify your US–UK taxes
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-softwhite/85">
                Choose a time that suits you for a focused 30-minute private consultation with a specialist &mdash; £100, and a clear view of exactly where you stand. Prefer to ask a quick question first? Email us and we&rsquo;ll answer general queries free.
              </p>
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
                    falls between the two systems. Your £100 consultation is a dedicated 30 minutes with a
                    cross-border specialist, focused entirely on your situation.
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
                    General queries are answered free by email &mdash; no booking needed. The £100
                    consultation is for a dedicated, in-depth 30 minutes on your specific situation.
                  </p>
                  <a href={`mailto:${SITE.email}`} className="mt-3 inline-block font-semibold text-navy hover:text-gold">
                    {SITE.email}
                  </a>
                </div>
              </aside>

              {/* Scheduler */}
              <div id="schedule">
                <BookingEmbed source="book_page" />
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
