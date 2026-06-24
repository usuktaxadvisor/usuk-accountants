import type { PressItem } from '@/lib/types';

/**
 * Press / featured-in section. Greyscale outlet strip + optional quote cards.
 * Reusable on home, about, and trust pages.
 */
export function PressStrip({
  items,
  heading = 'As featured in',
  tone = 'light',
}: {
  items: PressItem[];
  heading?: string;
  tone?: 'light' | 'dark';
}) {
  const labelColor = tone === 'dark' ? 'text-softwhite/60' : 'text-muted';
  const outletColor = tone === 'dark' ? 'text-softwhite/80' : 'text-ink/70';
  return (
    <div className="text-center">
      <p className={`text-xs font-semibold uppercase tracking-eyebrow ${labelColor}`}>{heading}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {items.map((p) => {
          const content = (
            <span className={`font-display text-lg font-semibold tracking-tight ${outletColor} transition-opacity hover:opacity-100`}>
              {p.outlet}
            </span>
          );
          return p.href ? (
            <a key={p.outlet} href={p.href} className="opacity-70 transition-opacity hover:opacity-100">{content}</a>
          ) : (
            <span key={p.outlet} className="opacity-70">{content}</span>
          );
        })}
      </div>
    </div>
  );
}

export function PressQuotes({ items }: { items: PressItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((p) => (
        <figure key={p.outlet} className="rounded-2xl border border-mist bg-white p-7">
          <blockquote className="font-display text-lg font-medium leading-relaxed text-ink">
            &ldquo;{p.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-2 text-sm text-muted">
            <span className="font-semibold text-gold-antique">{p.outlet}</span>
            {p.date && <span>· {p.date}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
