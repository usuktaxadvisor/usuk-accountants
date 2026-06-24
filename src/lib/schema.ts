import { SITE, OFFICES } from '@/lib/site-data';
import { aggregateRatingSchema } from '@/lib/trust-data';
import { orgSameAs, personSameAs } from '@/lib/entity-data';
import { credentialSchemaFor } from '@/lib/credentials-data';

/**
 * Centralized schema (JSON-LD) engine — the GEO spine.
 *
 * Every builder returns a plain object. Pages/templates emit them via the
 * <JsonLd> component. Entities are linked by @id so Google and AI engines
 * resolve one coherent knowledge graph:
 *   Organization #organization  ←  WebSite #website (publisher)
 *   Person/author  worksFor  →  #organization
 *   Service/Article  provider/publisher  →  #organization
 *   Breadcrumb / FAQ / Speakable attach per page.
 */

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** Only genuinely staffed offices appear as operational locations in schema. */
const STAFFED_OFFICES = OFFICES.filter((o) => o.staffed);

/* ---------- Organization (sitewide, staffed offices only in schema) ---------- */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    image: `${SITE.url}/brand/favicon.svg`,
    logo: `${SITE.url}/brand/favicon.svg`,
    description:
      'Specialist US–UK cross-border tax and accounting firm serving Americans in the UK, Brits in the US, dual citizens, green card holders and international businesses.',
    areaServed: ['GB', 'US'],
    knowsAbout: [
      'US expat tax', 'UK accounting', 'FBAR', 'FATCA', 'Streamlined Filing',
      'US-UK tax treaty', 'Foreign Earned Income Exclusion', 'Foreign Tax Credit',
      'Self Assessment', 'Corporation Tax', 'cross-border tax planning',
    ],
    ...(orgSameAs().length ? { sameAs: orgSameAs() } : {}),
    address: STAFFED_OFFICES.map((o) => ({
      '@type': 'PostalAddress',
      ...(o.street ? { streetAddress: o.street } : {}),
      addressLocality: o.locality,
      addressRegion: o.region,
      ...(o.postalCode ? { postalCode: o.postalCode } : {}),
      addressCountry: o.country,
    })),
    contactPoint: STAFFED_OFFICES.map((o) => ({
      '@type': 'ContactPoint',
      telephone: o.phone,
      contactType: 'customer service',
      areaServed: o.country,
      availableLanguage: 'English',
    })),
    ...(aggregateRatingSchema()
      ? { aggregateRating: aggregateRatingSchema() }
      : {}),
  };
}

/* ---------- Per-office LocalBusiness (for /locations pages) ---------- */
export function localBusinessSchema(officeId: string) {
  const o = OFFICES.find((x) => x.id === officeId);
  if (!o) return null;
  // Never emit LocalBusiness for an unstaffed/future office.
  if (!o.staffed) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${SITE.url}/locations/${o.id}/#localbusiness`,
    name: `${SITE.name} — ${o.label}`,
    parentOrganization: { '@id': ORG_ID },
    url: `${SITE.url}/locations/${o.id}`,
    telephone: o.phone,
    email: o.email,
    address: {
      '@type': 'PostalAddress',
      ...(o.street ? { streetAddress: o.street } : {}),
      addressLocality: o.locality,
      addressRegion: o.region,
      ...(o.postalCode ? { postalCode: o.postalCode } : {}),
      addressCountry: o.country,
    },
    areaServed: o.country,
  };
}

/* ---------- WebSite (sitewide, with SearchAction) ---------- */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/search?q={query}` },
      'query-input': 'required name=query',
    },
  };
}

/* ---------- BreadcrumbList ---------- */
export interface Crumb {
  label: string;
  href: string;
}
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href.startsWith('http') ? c.href : `${SITE.url}${c.href}`,
    })),
  };
}

/* ---------- FAQPage ---------- */
export interface FaqEntry {
  q: string;
  a: string;
}
export function faqSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/* ---------- Person (author / reviewed-by) ---------- */
export interface PersonInput {
  slug: string;
  name: string;
  role: string;
  credentials: string[];
  expertise?: string[];
  sameAs?: { label: string; href: string }[];
}
export function personSchema(p: PersonInput) {
  const sameAs = personSameAs(p.slug);
  const verifiedCreds = credentialSchemaFor(p.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/about/team/${p.slug}/#person`,
    name: p.name,
    jobTitle: p.role,
    worksFor: { '@id': ORG_ID },
    ...(verifiedCreds.length ? { hasCredential: verifiedCreds } : {}),
    ...(p.expertise?.length ? { knowsAbout: p.expertise } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/* ---------- Article / page authorship + review (the EEAT signal) ---------- */
export interface ArticleSchemaInput {
  url: string;
  headline: string;
  description: string;
  author: PersonInput;
  reviewedBy?: PersonInput;
  datePublished?: string;
  dateModified?: string;
}
export function articleSchema(a: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}${a.url}` },
    headline: a.headline,
    description: a.description,
    author: {
      '@type': 'Person',
      '@id': `${SITE.url}/about/team/${a.author.slug}/#person`,
      name: a.author.name,
    },
    ...(a.reviewedBy
      ? {
          reviewedBy: {
            '@type': 'Person',
            '@id': `${SITE.url}/about/team/${a.reviewedBy.slug}/#person`,
            name: a.reviewedBy.name,
          },
        }
      : {}),
    publisher: { '@id': ORG_ID },
    ...(a.datePublished ? { datePublished: a.datePublished } : {}),
    dateModified: a.dateModified ?? a.datePublished ?? undefined,
  };
}

/* ---------- Service ---------- */
export interface ServiceSchemaInput {
  url: string;
  name: string;
  description: string;
  serviceType?: string;
}
export function serviceSchema(s: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    ...(s.serviceType ? { serviceType: s.serviceType } : {}),
    provider: { '@id': ORG_ID },
    areaServed: ['GB', 'US'],
    url: `${SITE.url}${s.url}`,
  };
}

/* ---------- Speakable (attach to the answer-first block by CSS selector) ---------- */
export function speakableSchema(url: string, cssSelectors: string[] = ['.speakable']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${SITE.url}${url}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };
}
