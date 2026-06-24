import type { ComponentType, SVGProps } from 'react';

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface LinkItem {
  label: string;
  href: string;
}

export interface NavColumn {
  title: string;
  links: LinkItem[];
}

export interface MegaMenuPanel {
  heading: string;
  links: LinkItem[];
}

export interface MegaMenuFeature {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

export interface ServiceItem {
  icon: IconType;
  title: string;
  description: string;
  href: string;
}

export interface AudienceItem {
  flag: string;
  title: string;
  description: string;
  href: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  flag?: string;
  rating?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  credentials: string[];
  jurisdictions?: string[];
  initials: string;
  href?: string;
}

export interface PricingTier {
  name: string;
  priceGBP: string;
  priceUSD: string;
  cadence?: string;
  description: string;
  features: string[];
  cta: LinkItem;
  featured?: boolean;
}

export interface ComparisonRow {
  label: string;
  values: (string | boolean)[];
}

export interface ComparisonTableData {
  columns: string[];
  rows: ComparisonRow[];
  highlightColumn?: number;
}

export interface CredentialItem {
  label: string;
}

/* ============================================================
   Authority / EEAT types
   ============================================================ */

export interface PressItem {
  outlet: string;
  quote?: string;
  href?: string;
  date?: string;
}

export interface Review {
  author: string;
  role?: string;
  flag?: string;
  rating: number;
  body: string;
  source?: 'Google' | 'Trustpilot' | 'Verified client';
  date?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  flag?: string;
  challenge: string;
  approach: string[];
  outcome: string;
  metrics: { value: string; label: string }[];
  services: LinkItem[];
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  initials: string;
  credentials: string[];
  jurisdictions: string[];
  bio: string;
  expertise: string[];
  yearsExperience: number;
  sameAs?: { label: string; href: string }[];
  reviewedBy?: string;
}

export interface PolicySection {
  heading: string;
  body: string[];
}

export interface PillarItem {
  iconKey: 'bank' | 'globe' | 'treaty';
  title: string;
  description: string;
  href: string;
  links: LinkItem[];
  featured?: boolean;
}

export interface HeroChip {
  flag: string;
  label: string;
  href: string;
}

export interface CalculatorMeta {
  slug: string;
  title: string;
  description: string;
  iconKey: 'calculator' | 'globe' | 'shield' | 'planning' | 'treaty' | 'bank';
  status: 'live' | 'coming-soon';
  sampleLabel?: string;
  sampleValue?: string;
}
