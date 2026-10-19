import { IconArrowRight, IconCheck } from '@/components/ui/icons';
import { heroChips as defaultChips } from '@/lib/site-data';
import type { HeroChip } from '@/lib/types';

interface HeroProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  chips?: HeroChip[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const FILINGS = [
  'US tax returns (Form 1040)',
  'UK Self Assessment',
  'FBAR and Form 8938',
  'Streamlined Foreign Offshore filings',
  'W-8BEN and US withholding forms',
  'Cross-border returns, both countries together',
];

export function Hero({
  eyebrow = 'US and UK tax return specialists',
  title = 'US and UK tax returns, prepared by one team.',
  intro = 'US tax returns, UK Self Assessment, FBAR and Form 8938 reporting, Streamlined catch-up filings and W-8BEN forms, all prepared and filed by one firm, with the cross-border advice in between. For Americans in the UK, Britons with US ties, dual citizens and businesses on both sides of the Atlantic.',
  chips = defaultChips,
  primaryCta = { label: 'Book a Consultation', href: '/book' },
  secondaryCta = { label: 'Try the Double-Tax Estimator', href: '#calculator' },
}: HeroProps) {
  return (
    <section id="top" className="hero-transatlantic relative overflow-hidden bg-navy-ink">
      {/*
        The skyline is a CSS background and is the largest element on phones, so the
        browser only discovers it after CSS has been parsed. Preloading the right
        variant for the viewport brings the LCP request forward. React hoists these
        into <head>.
      */}
      <link rel="preload" as="image" href="/images/hero/transatlantic-skyline-mobile.svg" media="(max-width: 639px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/images/hero/transatlantic-skyline-tablet.svg" media="(min-width: 640px) and (max-width: 1023px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/images/hero/transatlantic-skyline.svg" media="(min-width: 1024px)" fetchPriority="high" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.3]"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
            <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-100 560 C 400 180, 1040 180, 1540 560" fill="none" stroke="url(#heroArc)" strokeWidth="1.5" />
        <path d="M-100 620 C 420 280, 1020 280, 1540 620" fill="none" stroke="url(#heroArc)" strokeWidth="1" opacity="0.5" />
        <circle cx="250" cy="430" r="3" fill="#C9A84C" />
        <circle cx="1190" cy="430" r="3" fill="#C9A84C" />
      </svg>

      {/* Decorative skyline (original artwork): English Gothic × American neoclassical, evening light.
          Presentational only; drifts a few pixels on scroll (ParallaxObserver), never on phones. */}
      <div aria-hidden="true" className="hero-art parallax-layer pointer-events-none absolute" data-parallax="0.08" />

      <div className="hero-content relative mx-auto grid max-w-container items-start gap-12 px-6 pt-10 md:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        {/* No entrance animation on the headline column: it is the LCP element and must paint immediately. */}
        <div>
          <p className="kicker kicker-light mb-5">{eyebrow}</p>
          <h1 className="font-display text-display-xl text-white">
            {title}
          </h1>
          <p className="mt-7 max-w-[56ch] text-lg leading-relaxed text-softwhite/85">{intro}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={primaryCta.href}
              className="btn-gold group inline-flex min-h-[52px] items-center gap-2 rounded-md px-7 py-3.5 text-[15px] font-semibold"
            >
              {primaryCta.label}
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={secondaryCta.href}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-md border border-softwhite/30 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-gold-champagne hover:text-gold-champagne"
            >
              {secondaryCta.label}
            </a>
          </div>

          {chips.length > 0 && (
            <div className="mt-10">
              <p className="mb-3 text-sm text-softwhite/60">I&apos;m a&hellip;</p>
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="inline-flex items-center gap-2 rounded-full border border-softwhite/20 px-4 py-2 text-sm text-softwhite transition-colors hover:border-gold-champagne hover:text-gold-champagne"
                  >
                    <span aria-hidden>{c.flag}</span> {c.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-softwhite/70">
            <span className="inline-flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-gold" aria-hidden="true" /> US &amp; UK tax under one roof
            </span>
            <span className="inline-flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-gold" aria-hidden="true" /> London, Manchester &amp; New York
            </span>
          </div>
        </div>

        <aside className="animate-fade-rise [animation-delay:120ms] lg:mt-6" aria-label="What we prepare and file">
          <div className="rounded-card border border-softwhite/15 bg-navy-ink/55 p-7 backdrop-blur-sm sm:p-8">
            <p className="kicker kicker-light">What we prepare and file</p>
            <ul className="mt-5 divide-y divide-softwhite/10">
              {FILINGS.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3 text-[15px] text-softwhite">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-end justify-between gap-4 border-t border-softwhite/10 pt-5">
              <div>
                <p className="text-xs text-softwhite/60">Fees</p>
                <p className="mt-1 font-display text-display-sm text-gold-champagne">Quoted in writing, case by case</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
