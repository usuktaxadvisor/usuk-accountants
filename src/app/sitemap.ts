import type { MetadataRoute } from 'next';
import { authors, caseStudies } from '@/lib/authority-data';
import { getAllPostsMeta } from '@/lib/blog';
import { getAllGlossarySlugs } from '@/lib/glossary';

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
    '/services/uk-accounting/tax-planning',
    '/services/uk-accounting/startup-accounting', '/services/us-expat-tax',
    '/services/us-expat-tax/streamlined-filing',
    '/services/us-expat-tax/fbar-filing',
    '/services/us-expat-tax/foreign-tax-credit',
    '/services/cross-border-advisory',
    '/services/cross-border-advisory/cross-border-tax-planning',
    '/services/cross-border-advisory/business-structuring',
    '/services/cross-border-advisory/pensions-401k-sipp',
    '/services/us-expat-tax/foreign-earned-income-exclusion',
    '/services/us-expat-tax/fatca-compliance',
    '/services/us-expat-tax/us-tax-returns',
    '/services/us-expat-tax/form-5471',
    '/services/us-expat-tax/us-uk-tax-treaty',
    '/us-uk-tax-services',
    '/locations', '/locations/london', '/locations/new-york',
    '/who-we-help', '/who-we-help/us-citizens-in-uk',
    '/who-we-help/uk-citizens-in-us', '/who-we-help/dual-citizens',
    '/who-we-help/startups-founders', '/who-we-help/digital-nomads',
    '/who-we-help/high-net-worth-individuals', '/who-we-help/landlords',
    '/resources', '/resources/calculators',
    '/resources/calculators/double-tax-estimator',
    '/resources/calculators/fbar-checker',
    '/resources/calculators/srt-residence',
    '/resources/calculators/us-expat-deadlines',
    '/resources/calculators/streamlined-eligibility',
    '/resources/calculators/self-assessment-deadline',
    '/resources/calculators/corporation-tax',
    '/resources/calculators/take-home-pay',
    '/resources/calculators/feie-vs-ftc',
    '/resources/calculators/fig-regime',
    '/resources/blog', '/resources/glossary',
    '/resources/guides/tax-deadlines-calendar',
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

  const glossaryPages = getAllGlossarySlugs().map((slug) => ({
    url: `${base}/resources/glossary/${slug}`,
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

  return [...staticPages, ...authorPages, ...casePages, ...blogPages, ...glossaryPages];
}
