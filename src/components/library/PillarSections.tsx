import type { ReactNode } from 'react';
import Link from 'next/link';
import { Section, Container, SectionHeading, Button } from '@/components/library/primitives';
import { IconCheck, IconArrowRight } from '@/components/ui/icons';

/* ---------- Prose intro block ---------- */
export function ProseBlock({
  eyebrow, title, children, tone = 'white',
}: { eyebrow?: string; title?: string; children: ReactNode; tone?: 'white' | 'porcelain' }) {
  return (
    <Section tone={tone}>
      <Container>
        <div className="mx-auto max-w-prose">
          {title && <SectionHeading eyebrow={eyebrow} title={title} />}
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted [&_strong]:text-ink">
            {children}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Who it's for ---------- */
export function WhoItsFor({
  items, title = 'Who this is for',
}: { items: string[]; title?: string }) {
  return (
    <Section tone="porcelain">
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={title} align="center" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {items.map((it) => (
              <li key={it} className="flex items-start gap-3 rounded-card border border-mist bg-white p-4 text-[15px] text-ink">
                <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> {it}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Process steps ---------- */
export function ProcessSteps({
  steps, eyebrow = 'How it works', title = 'A clear path, start to finish',
}: { steps: { title: string; description: string }[]; eyebrow?: string; title?: string }) {
  return (
    <Section tone="white">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <ol className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative border-t border-navy-ink/15 pt-5">
              <span className="font-display text-display-sm text-gold-antique tnum">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* ---------- Investment band (premium pricing framing) ---------- */
export function InvestmentBand({
  fromLabel, points, note,
}: { fromLabel: string; points: string[]; note?: string }) {
  return (
    <Section tone="navy">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="kicker kicker-light kicker-center">Investment</p>
          <p className="mt-4 font-display text-display-md text-white">{fromLabel}</p>
          <p className="mt-3 text-softwhite/75">Fees reflect the complexity of your situation, never a one-size template.</p>
          <ul className="mx-auto mt-8 grid max-w-xl gap-2 text-left sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-softwhite/90">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {p}
              </li>
            ))}
          </ul>
          {note && <p className="mt-6 text-sm text-softwhite/60">{note}</p>}
          <div className="mt-8">
            <Button href="/book" variant="primary">Book a consultation <IconArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Key-facts box (AI-extractable) ---------- */
export function KeyFacts({
  title = 'At a glance', facts,
}: { title?: string; facts: { label: string; value: string }[] }) {
  return (
    <div className="rounded-card border border-mist bg-porcelain p-6">
      <p className="kicker">{title}</p>
      <dl className="mt-4 space-y-3">
        {facts.map((f) => (
          <div key={f.label} className="flex justify-between gap-4 border-b border-mist pb-3 last:border-0 last:pb-0">
            <dt className="text-sm text-muted">{f.label}</dt>
            <dd className="text-right text-sm font-semibold text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 border-t border-navy-ink/10 pt-4">
        <p className="text-sm text-muted">Not sure how this applies to you?</p>
        <Link href="/contact" className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-antique transition-colors hover:text-gold">
          Email us a few lines about your situation
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/* ---------- Related links (lateral + audience cross-linking for SEO/GEO) ---------- */
export function RelatedLinks({
  title = 'Related areas we handle',
  links,
}: { title?: string; links: { label: string; href: string; description?: string }[] }) {
  return (
    <Section tone="white">
      <Container>
        <SectionHeading title={title} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-4 rounded-card border border-mist bg-porcelain p-5 transition-all duration-200 hover:border-gold hover:shadow-e1"
            >
              <span>
                <span className="block font-display text-lg text-ink">{l.label}</span>
                {l.description && <span className="mt-1 block text-sm text-muted">{l.description}</span>}
              </span>
              <IconArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
