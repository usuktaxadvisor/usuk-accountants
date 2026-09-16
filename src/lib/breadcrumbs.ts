import type { Crumb } from './schema';

/**
 * Site-wide breadcrumb standard: Home → Section → Sub-section → Page.
 * Applied identically to the visible trail and the BreadcrumbList JSON-LD so
 * the two can never diverge. Rules:
 *  - Home ('/') is always the first item, added if a page omits it.
 *  - Consecutive items that resolve to the same URL collapse to one (keeping
 *    the more specific, later label), so no page can show a duplicate level.
 */
export function normaliseCrumbs(crumbs: Crumb[]): Crumb[] {
  const out: Crumb[] = [{ label: 'Home', href: '/' }];
  for (const c of crumbs) {
    if (c.href === '/') continue;
    const prev = out[out.length - 1];
    if (prev.href === c.href) out[out.length - 1] = c;
    else out.push(c);
  }
  return out;
}
