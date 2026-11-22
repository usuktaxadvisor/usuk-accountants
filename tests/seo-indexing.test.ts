import { describe, expect, it } from 'vitest';
import {
  glossaryTerms,
  listedGlossaryTerms,
  getListedGlossarySlugs,
  siblingGlossaryTerms,
} from '@/lib/glossary';
import { caseStudies } from '@/lib/authority-data';
import sitemap from '@/app/sitemap';

// The root layout appends " | US UK Accountants" (20 characters); the full
// <title> must stay within 70, so a page title may be 50 at most.
const MAX_PAGE_TITLE = 50;

describe('search titles', () => {
  it('keeps every case study title within the limit', () => {
    for (const c of caseStudies) {
      expect((c.metaTitle ?? c.title).length, c.slug).toBeLessThanOrEqual(MAX_PAGE_TITLE);
    }
  });
});

describe('glossary', () => {
  it('lists one entry per term', () => {
    const names = listedGlossaryTerms().map((t) => t.term.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });

  it('points duplicate entries at a real main entry', () => {
    for (const t of glossaryTerms.filter((x) => x.canonicalSlug)) {
      expect(getListedGlossarySlugs(), t.slug).toContain(t.canonicalSlug);
    }
  });

  it('links every listed term from at least three other term pages', () => {
    const inbound = new Map<string, number>();
    for (const t of listedGlossaryTerms()) {
      for (const s of siblingGlossaryTerms(t.slug)) {
        inbound.set(s.slug, (inbound.get(s.slug) ?? 0) + 1);
      }
    }
    const byCategory = new Map<string, number>();
    for (const t of listedGlossaryTerms()) {
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + 1);
    }
    for (const t of listedGlossaryTerms()) {
      const expected = Math.min(3, (byCategory.get(t.category) ?? 1) - 1);
      expect(inbound.get(t.slug) ?? 0, t.slug).toBeGreaterThanOrEqual(expected);
    }
  });

  it('never suggests a term as related to itself', () => {
    for (const t of glossaryTerms) {
      expect(siblingGlossaryTerms(t.slug).map((s) => s.slug)).not.toContain(t.slug);
    }
  });
});

describe('sitemap', () => {
  const urls = sitemap().map((e) => e.url);

  it('has no duplicates and only canonical www URLs', () => {
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) {
      expect(u.startsWith('https://www.usukaccountants.com')).toBe(true);
      expect(u === 'https://www.usukaccountants.com' || !u.endsWith('/')).toBe(true);
    }
  });

  it('leaves out glossary entries that canonicalise elsewhere', () => {
    for (const t of glossaryTerms.filter((x) => x.canonicalSlug)) {
      expect(urls).not.toContain(`https://www.usukaccountants.com/resources/glossary/${t.slug}`);
    }
  });
});
