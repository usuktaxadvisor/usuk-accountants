import type { Testimonial } from '@/lib/types';
import { IconStar } from '@/components/ui/icons';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, role, flag, rating = 5 } = testimonial;
  return (
    <figure className="flex flex-col rounded-2xl border border-mist bg-porcelain p-7">
      <span className="font-display text-5xl leading-none text-gold/40" aria-hidden>“</span>
      <div className="mb-3 flex text-gold" aria-hidden>
        {Array.from({ length: rating }).map((_, i) => (
          <IconStar key={i} className="h-4 w-4" />
        ))}
      </div>
      <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">{quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-2 border-t border-mist pt-4">
        {flag && <span className="text-lg" aria-hidden>{flag}</span>}
        <span>
          <span className="block text-sm font-semibold text-ink">{name}</span>
          <span className="block text-xs text-muted">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {testimonials.map((t) => (
        <TestimonialCard key={t.name} testimonial={t} />
      ))}
    </div>
  );
}
