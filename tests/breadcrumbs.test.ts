import { describe, it, expect } from 'vitest';
import { normaliseCrumbs } from '@/lib/breadcrumbs';

describe('breadcrumb normalisation (site-wide standard)', () => {
  it('prepends Home when a page omits it', () => {
    expect(normaliseCrumbs([{ label: 'Resources', href: '/resources' }, { label: 'Guides', href: '/resources/guides' }]))
      .toEqual([{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: 'Guides', href: '/resources/guides' }]);
  });
  it('does not duplicate Home when a page already includes it', () => {
    const out = normaliseCrumbs([{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }]);
    expect(out.filter(c => c.href === '/')).toHaveLength(1);
    expect(out[0]).toEqual({ label: 'Home', href: '/' });
  });
  it('collapses consecutive levels that point at the same URL, keeping the more specific label', () => {
    expect(normaliseCrumbs([{ label: 'About', href: '/about/team' }, { label: 'Team', href: '/about/team' }]))
      .toEqual([{ label: 'Home', href: '/' }, { label: 'Team', href: '/about/team' }]);
  });
  it('leaves an already-correct trail untouched apart from Home', () => {
    const trail = [{ label: 'Resources', href: '/resources' }, { label: 'Forms', href: '/resources/forms' }, { label: 'Form 8938', href: '/resources/forms/form-8938' }];
    expect(normaliseCrumbs(trail).slice(1)).toEqual(trail);
  });
  it('yields a contiguous ordered trail suitable for 1-based ListItem positions', () => {
    const out = normaliseCrumbs([{ label: 'Resources', href: '/resources' }, { label: 'Guides', href: '/resources/guides' }]);
    expect(out.map(c => c.label)).toEqual(['Home', 'Resources', 'Guides']);
    expect(out.map(c => c.href)).toEqual(['/', '/resources', '/resources/guides']);
  });
});
