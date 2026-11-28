import { ContactForm } from '@/components/library/Forms';
import { Container } from '@/components/library/primitives';
import { SITE } from '@/lib/site-data';

/**
 * Closing enquiry band for service pages: the enquiry form sits on the page itself,
 * so a visitor who has just read about a filing can ask about it without another click.
 * `source` is sent with the enquiry so the team can see which service prompted it.
 */
export function EnquirySection({
  title,
  intro,
  source,
}: {
  title: string;
  intro: string;
  source: string;
}) {
  return (
    <section id="enquire" className="relative isolate scroll-mt-24 overflow-hidden bg-navy-ink py-20 md:py-28">
      <div aria-hidden="true" data-parallax="0.1" className="parallax-layer bg-cta-chairs pointer-events-none absolute -inset-y-10 inset-x-0 -z-10" />
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="max-w-xl">
            <p className="kicker kicker-light">Enquire about this service</p>
            <h2 className="mt-3 font-display text-display-md text-white">{title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-softwhite/85">{intro}</p>

            <h3 className="mt-9 text-sm font-semibold text-gold-champagne">What to tell us</h3>
            <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-softwhite/85">
              {[
                'Where you live, and your citizenship or visa status',
                'Which returns or forms you need, and for which tax years',
                'Your sources of income, in every country',
                'Whether you have filed before, in the US and in the UK',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-softwhite/70">
              You do not need to send any documents at this stage. We reply by email with what we would need and a
              written quote. Prefer to write directly? Email{' '}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-gold-champagne underline underline-offset-2 hover:text-white">{SITE.email}</a>.
            </p>
          </div>

          <div className="rounded-card border border-mist bg-white p-6 shadow-e2 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-ink">Send us your enquiry</h3>
            <p className="mt-2 text-sm text-muted">A few lines is enough to start.</p>
            <div className="mt-6">
              <ContactForm source={source} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
