import Image from 'next/image';
import Link from 'next/link';

const AUDIENCE_IMG: Record<string, [string, string]> = {
  '/who-we-help/us-citizens-in-uk': ['help-uk', 'A quiet cobbled London mews at dawn with one warmly lit window'],
  '/who-we-help/uk-citizens-in-us': ['help-us', 'A Manhattan apartment interior at dusk with city lights beyond'],
  '/who-we-help/dual-citizens': ['help-mobile', 'An airport window at dusk with distant runway lights'],
  '/who-we-help/startups-founders': ['help-founder', 'A founder\'s desk at night under one warm task lamp'],
  '/who-we-help/landlords': ['help-family', 'An elegant home study with evening light from a garden window'],
  '/who-we-help/high-net-worth-individuals': ['help-hnw', 'A private library with a leather armchair and warm reading lamp'],
  '/who-we-help/digital-nomads': ['blog-atlantic', 'An ocean liner mid-Atlantic at dusk beneath a golden sky'],
};
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

/* ---------- Three practice areas: editorial columns, not boxes ---------- */
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
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>
        <Reveal className="rule-cols grid md:grid-cols-3">
          {pillars.map((p) => {
            const Icon = pillarIcons[p.iconKey];
            return (
              <article key={p.title} className="relative px-0 py-8 md:px-8 md:py-2 first:md:pl-0 last:md:pr-0">
                {p.featured && (
                  <span className="absolute left-0 top-0 h-px w-10 bg-gold md:top-2" aria-hidden />
                )}
                <Icon className="h-7 w-7 text-gold-antique" />
                <h3 className="mt-5 font-display text-display-sm text-ink">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-gold-antique">
                        <span aria-hidden className="h-px w-3 bg-gold" /> {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-antique transition-colors hover:text-gold">
                  Explore {p.title}
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------- Who We Help: photographic tiles with the title set on the picture ---------- */
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
        <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => {
            const img = AUDIENCE_IMG[a.href];
            return (
              <Link
                key={a.title}
                href={a.href}
                className="group relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-card bg-navy-ink p-6 text-white shadow-e1 transition-shadow duration-300 hover:shadow-e3"
              >
                {img && (
                  <Image
                    src={`/images/atlantic/${img[0]}.jpg`}
                    alt={img[1]}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="-z-10 object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03]"
                  />
                )}
                <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-ink via-navy-ink/55 to-navy-ink/5" />
                <h3 className="font-display text-display-sm text-white">{a.title}</h3>
                <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-softwhite/85">{a.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-champagne">
                  See how we help
                  <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
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
        <Reveal as="ol" className="grid gap-x-8 gap-y-10 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative border-t border-navy-ink/15 pt-5">
              <span className="font-display text-display-sm text-gold-antique tnum">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
            </li>
          ))}
        </Reveal>
      </Container>

      <Reveal className="mx-auto mt-20 max-w-container px-6">
        <dl className="grid overflow-hidden rounded-card bg-navy-ink sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`p-8 text-center ${i > 0 ? 'border-t border-softwhite/10 sm:border-t-0 sm:border-l' : ''}`}>
              <dd className="font-display text-display-md text-gold-champagne tnum">{s.value}</dd>
              <dt className="mt-2 text-sm text-softwhite/70">{s.label}</dt>
            </div>
          ))}
        </dl>
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
        <Reveal>
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
        <Reveal>
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
    <Section tone="white">
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
