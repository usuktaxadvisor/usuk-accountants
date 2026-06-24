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

export function Hero({
  eyebrow = 'International Tax & Accounting Advisors',
  title = 'Tax and accounting expertise for life between the US and the UK.',
  intro = 'One advisory firm for your US tax, your UK accounts, and the cross-border decisions in between — for expats, dual citizens, families and businesses on both sides of the Atlantic.',
  chips = defaultChips,
  primaryCta = { label: 'Book a Free Consultation', href: '/book' },
  secondaryCta = { label: 'Try the Double-Tax Estimator', href: '#calculator' },
}: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-ink">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
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

      <div className="relative mx-auto grid max-w-container items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-rise">
          <p className="mb-4 text-xs font-semibold uppercase tracking-eyebrow text-gold">{eyebrow}</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-softwhite/85">{intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={primaryCta.href}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-gold to-gold-champagne px-7 py-3.5 font-semibold text-navy-ink shadow-e1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/40 blur-md animate-shimmer" />
              {primaryCta.label}
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-lg border border-gold/60 px-7 py-3.5 font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              {secondaryCta.label}
            </a>
          </div>

          {chips.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm text-softwhite/60">I&apos;m a…</p>
              <div className="flex flex-wrap gap-2.5">
                {chips.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="inline-flex items-center gap-2 rounded-full border border-navy-slate bg-navy-royal/40 px-4 py-2 text-sm text-softwhite transition-all duration-200 hover:border-gold hover:bg-navy-royal"
                  >
                    <span aria-hidden>{c.flag}</span> {c.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-softwhite/70">
            <span className="inline-flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-gold" aria-hidden="true" /> US &amp; UK tax under one roof
            </span>
            <span className="inline-flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-gold" aria-hidden="true" /> Offices in London &amp; New York
            </span>
          </div>
        </div>

        <div className="animate-fade-rise [animation-delay:120ms]">
          <div className="rounded-2xl border border-navy-slate bg-navy-royal/50 p-7 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">What we handle, both sides</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {['US Tax Returns', 'UK Self Assessment', 'FBAR & FATCA', 'Company Accounts', 'Streamlined Filing', 'Treaty Planning'].map((item) => (
                <div key={item} className="rounded-lg border border-navy-slate bg-navy-ink/60 px-4 py-3 text-sm font-medium text-softwhite">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-lg bg-navy-ink/80 px-5 py-4">
              <div>
                <p className="text-xs text-softwhite/60">Your first consultation</p>
                <p className="font-display text-2xl font-semibold text-gold-champagne">Free · no obligation</p>
              </div>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">No double tax</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
