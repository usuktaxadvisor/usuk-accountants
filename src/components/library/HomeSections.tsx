import Link from 'next/link';
import { Section, Container, SectionHeading } from '@/components/library/primitives';
import { IconBank, IconGlobeDoc, IconTreaty, IconArrowRight } from '@/components/ui/icons';
import Reveal from '@/components/ui/Reveal';
import {
  pillars as defaultPillars,
  audiences as defaultAudiences,
  processSteps as defaultSteps,
  stats as defaultStats,
  services as defaultServices,
  testimonials as defaultTestimonials,
  faqs as defaultFaqs,
} from '@/lib/site-data';
import type { PillarItem, AudienceItem, ProcessStep, StatItem } from '@/lib/types';
import { ServiceGrid } from '@/components/library/ServiceCard';
import { TestimonialGrid } from '@/components/library/Testimonials';
import { FAQAccordion } from '@/components/library/FAQAccordion';
import type { ServiceItem, Testimonial, FaqItem } from '@/lib/types';

const pillarIcons = { bank: IconBank, globe: IconGlobeDoc, treaty: IconTreaty } as const;

/* ---------- Dual-pillar split ---------- */
export function Pillars({
  pillars = defaultPillars,
  eyebrow = 'Two specialisms, one firm',
  title = 'Everything you need, both sides of the Atlantic',
}: {
  pillars?: PillarItem[];
  eyebrow?: string;
  title?: string;
}) {
  return (
    <Section tone="white">
      <Container>
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>
        <Reveal stagger className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => {
            const Icon = pillarIcons[p.iconKey];
            return (
              <article
                key={p.title}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-e1 transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-ink hover:bg-navy-ink hover:shadow-e2 ${
                  p.featured ? 'border-gold ring-1 ring-gold/30' : 'border-mist'
                }`}
              >
                {p.featured && (
                  <>
                    <span className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />
                    <span className="absolute right-5 top-5 rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-antique transition-colors duration-300 group-hover:bg-gold/20 group-hover:text-gold">Most popular</span>
                  </>
                )}
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-antique transition-all duration-300 group-hover:bg-gold/20 group-hover:text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-white">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted transition-colors duration-300 group-hover:text-softwhite/80">{p.description}</p>
                <ul className="mt-6 space-y-2">
                  {p.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-gold-antique group-hover:text-softwhite/90 group-hover:hover:text-gold">
                        <span className="text-gold">·</span> {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-antique transition-colors duration-300 group-hover:text-gold">
                  Explore {p.title}
                  <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------- Who We Help ---------- */
export function WhoWeHelp({
  audiences = defaultAudiences,
  eyebrow = 'Who we help',
  title = 'Specialists for your exact situation',
}: {
  audiences?: AudienceItem[];
  eyebrow?: string;
  title?: string;
}) {
  return (
    <Section tone="white" id="who">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="group flex items-start gap-4 rounded-2xl border border-mist bg-porcelain p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-ink hover:bg-navy-ink hover:shadow-e2"
            >
              <span className="text-2xl" aria-hidden>{a.flag}</span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-white">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-softwhite/80">{a.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-antique transition-colors duration-300 group-hover:text-gold">
                  See how we help
                  <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------- Process + Stats ---------- */
export function ProcessStats({
  steps = defaultSteps,
  stats = defaultStats,
  eyebrow = 'How it works',
  title = 'A simple path through a complex system',
}: {
  steps?: ProcessStep[];
  stats?: StatItem[];
  eyebrow?: string;
  title?: string;
}) {
  return (
    <Section tone="porcelain">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <Reveal stagger className="grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              {i < steps.length - 1 && (
                <span className="absolute right-0 top-6 hidden h-px w-1/2 translate-x-1/2 bg-gradient-to-r from-gold/50 to-transparent md:block" />
              )}
              <span className="font-display text-2xl font-semibold text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
            </div>
          ))}
        </Reveal>
      </Container>

      <Reveal className="mx-auto mt-16 max-w-container px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-navy-slate bg-navy-slate sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-navy-ink p-8 text-center">
              <p className="font-display text-4xl font-semibold text-gold-champagne tnum">{s.value}</p>
              <p className="mt-2 text-sm text-softwhite/70">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------- Services grid section ---------- */
export function ServicesSection({
  services = defaultServices,
  eyebrow = 'Our services',
  title = 'Specialist help for every cross-border situation',
}: {
  services?: ServiceItem[];
  eyebrow?: string;
  title?: string;
}) {
  return (
    <Section tone="porcelain" id="services">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <Reveal stagger>
          <ServiceGrid services={services} columns={3} />
        </Reveal>
      </Container>
    </Section>
  );
}

export function TestimonialsSection({
  testimonials = defaultTestimonials,
  eyebrow = 'Client results',
  title = 'Trusted by people living between two tax systems',
}: {
  testimonials?: Testimonial[];
  eyebrow?: string;
  title?: string;
}) {
  // Honest: render nothing when there are no genuine testimonials.
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <Section tone="white">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <Reveal stagger>
          <TestimonialGrid testimonials={testimonials} />
        </Reveal>
      </Container>
    </Section>
  );
}

export function FAQSection({
  faqs = defaultFaqs,
  eyebrow = 'Questions, answered',
  title = 'US–UK tax questions, answered',
  emitSchema = false,
}: {
  faqs?: FaqItem[];
  eyebrow?: string;
  title?: string;
  emitSchema?: boolean;
}) {
  return (
    <Section tone="porcelain">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-12 text-center">
            <SectionHeading eyebrow={eyebrow} title={title} align="center" />
          </Reveal>
          <Reveal>
            <FAQAccordion items={faqs} emitSchema={emitSchema} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
