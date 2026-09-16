import { Container } from '@/components/library/primitives';
import { normaliseCrumbs, type Crumb } from '@/lib/schema';

/** Visual breadcrumb trail. Pairs with breadcrumbSchema() for the structured data — both run the same normaliser. */
export function Breadcrumbs({ crumbs: raw }: { crumbs: Crumb[] }) {
  if (raw.length === 0) return null;
  const crumbs = normaliseCrumbs(raw);
  return (
    <nav aria-label="Breadcrumb" className="border-b border-mist bg-porcelain">
      <Container>
        <ol className="flex flex-wrap items-center gap-2 py-4 text-sm text-muted">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-2">
                {last ? (
                  <span className="text-ink" aria-current="page">{c.label}</span>
                ) : (
                  <a href={c.href} className="transition-colors hover:text-gold-antique">{c.label}</a>
                )}
                {!last && <span aria-hidden className="text-mist">/</span>}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
