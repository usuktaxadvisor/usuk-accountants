import type { MetadataRoute } from 'next';
import { authors, caseStudies } from '@/lib/authority-data';
import { getAllPostsMeta } from '@/lib/blog';

const base = 'https://www.usukaccountants.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    '', '/book', '/contact',
    '/services', '/services/uk-accounting',
    '/services/uk-accounting/company-accounts',
    '/services/uk-accounting/corporation-tax',
    '/services/uk-accounting/vat-returns',
    '/services/uk-accounting/payroll',
    '/services/uk-accounting/bookkeeping',
    '/services/uk-accounting/self-assessment',
    '/services/uk-accounting/tax-planning', '/services/us-expat-tax',
    '/services/us-expat-tax/streamlined-filing',
    '/services/us-expat-tax/fbar-filing',
    '/services/us-expat-tax/foreign-tax-credit',
    '/services/us-expat-tax/foreign-earned-income-exclusion',
    '/services/us-expat-tax/fatca-compliance',
    '/services/us-expat-tax/us-tax-returns',
    '/services/us-expat-tax/form-5471',
    '/services/us-expat-tax/us-uk-tax-treaty',
    '/who-we-help', '/who-we-help/us-citizens-in-uk',
    '/who-we-help/uk-citizens-in-us', '/who-we-help/dual-citizens',
    '/resources', '/resources/calculators',
    '/resources/calculators/double-tax-estimator',
    '/resources/calculators/fbar-checker',
    '/resources/calculators/srt-residence',
    '/resources/calculators/us-expat-deadlines',
    '/resources/calculators/streamlined-eligibility',
    '/resources/blog',
    '/about/team', '/about/case-studies', '/reviews',
    '/trust-center', '/security', '/credentials', '/compliance',
    '/editorial-policy', '/review-policy', '/privacy',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority:
      path === '' ? 1
      : path === '/book' || path === '/contact' ? 0.9
      : path.startsWith('/services/') ? 0.9
      : 0.7,
  }));

  const authorPages = authors.map((a) => ({
    url: `${base}/about/team/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const casePages = caseStudies.map((c) => ({
    url: `${base}/about/case-studies/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogPages = getAllPostsMeta().map((p) => ({
    url: `${base}/resources/blog/${p.slug}`,
    lastModified: p.updated ? new Date(p.updated) : (p.date ? new Date(p.date) : now),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...authorPages, ...casePages, ...blogPages];
}
