import type { CaseStudy } from '@/lib/types';
import { IconArrowRight, IconCheck } from '@/components/ui/icons';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <a
      href={`/about/case-studies/${study.slug}`}
      className="group flex flex-col rounded-2xl border border-mist bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-e2"
    >
      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        {study.flag && <span className="text-lg" aria-hidden>{study.flag}</span>}
        {study.client}
      </div>
      <h3 className="font-display text-xl font-semibold leading-snug text-ink">{study.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{study.challenge}</p>
      <div className="mt-5 flex flex-wrap gap-4 border-t border-mist pt-5">
        {study.metrics.map((m) => (
          <div key={m.label}>
            <p className="font-display text-xl font-semibold text-gold-antique tnum">{m.value}</p>
            <p className="text-xs text-muted">{m.label}</p>
          </div>
        ))}
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-antique">
        Read the full story
        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export function CaseStudyGrid({ studies }: { studies: CaseStudy[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {studies.map((s) => (
        <CaseStudyCard key={s.slug} study={s} />
      ))}
    </div>
  );
}

/** Full case-study detail layout for the individual page. */
export function CaseStudyDetail({ study }: { study: CaseStudy }) {
  return (
    <article className="mx-auto max-w-prose">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted">
        {study.flag && <span className="text-lg" aria-hidden>{study.flag}</span>}
        {study.client}
      </div>

      <div className="mb-10 grid grid-cols-3 gap-4 rounded-2xl border border-mist bg-porcelain p-6">
        {study.metrics.map((m) => (
          <div key={m.label} className="text-center">
            <p className="font-display text-3xl font-semibold text-gold-antique tnum">{m.value}</p>
            <p className="mt-1 text-xs text-muted">{m.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl font-semibold text-ink">The challenge</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{study.challenge}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink">Our approach</h2>
      <ul className="mt-4 space-y-3">
        {study.approach.map((step) => (
          <li key={step} className="flex items-start gap-2.5 text-[15px] text-muted">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {step}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink">The outcome</h2>
      <p className="mt-3 rounded-xl border border-gold/30 bg-gold/[0.06] p-5 text-[15px] leading-relaxed text-ink">
        {study.outcome}
      </p>

      <div className="mt-10 border-t border-mist pt-6">
        <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">Services used</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {study.services.map((s) => (
            <a key={s.href} href={s.href} className="rounded-full bg-porcelain px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-gold/10">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-muted">
        Anonymised and shared with client permission. Outcomes depend on individual circumstances and are not a guarantee of future results.
      </p>
    </article>
  );
}
