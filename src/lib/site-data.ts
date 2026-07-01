import type {
  MegaMenuPanel, MegaMenuFeature, NavColumn, LinkItem,
  ServiceItem, AudienceItem, ProcessStep, StatItem, FaqItem,
  Testimonial, TeamMember, PricingTier, ComparisonTableData,
} from '@/lib/types';
import {
  IconGlobeDoc, IconShield, IconPlanning, IconBank, IconCalculator, IconTreaty,
} from '@/components/ui/icons';

export const PHONE_UK = '+44 333 090 4129';
export const PHONE_US = '+1 914 953 7475';

export interface Office {
  id: 'london' | 'new-york' | 'virginia';
  label: string;
  flag: string;
  street: string;
  locality: string;
  region: string;
  postalCode: string;
  country: 'GB' | 'US';
  phone: string;
  tel: string;
  email: string;
  /** Genuinely staffed & operational. Drives LocalBusiness schema + GBP eligibility. */
  staffed: boolean;
  /** Eligible for a Google Business Profile (requires genuine staffed presence). */
  gbpEligible: boolean;
}

/** Three genuine offices — basis for NAP + LocalBusiness schema. */
export const OFFICES: Office[] = [
  {
    id: 'london',
    label: 'London',
    flag: '🇬🇧',
    street: '70 Queen Road',
    locality: 'London',
    region: 'England',
    postalCode: 'E17 8QP',
    country: 'GB',
    phone: '+44 333 090 4129',
    tel: '+443330904129',
    email: 'hello@usukaccountants.com',
    staffed: true,
    gbpEligible: true,
  },
  {
    id: 'new-york',
    label: 'New York',
    flag: '🇺🇸',
    street: '49 Mill Lane',
    locality: 'Briarcliff Manor',
    region: 'NY',
    postalCode: '10510',
    country: 'US',
    phone: '+1 914 953 7475',
    tel: '+19149537475',
    email: 'hello@usukaccountants.com',
    staffed: true,
    gbpEligible: true,
  },
  {
    id: 'virginia',
    label: 'Virginia',
    flag: '🇺🇸',
    street: '211 N Union St, Suite 100',
    locality: 'Alexandria',
    region: 'VA',
    postalCode: '22314',
    country: 'US',
    phone: '+1 914 408 5788',
    tel: '+19144085788',
    email: 'hello@usukaccountants.com',
    staffed: false,
    gbpEligible: false,
  },
];

/** Genuinely staffed, operational offices — use for NAP, schema, and "our offices" displays. */
export const staffedOffices = OFFICES.filter((o) => o.staffed);
/** Offices eligible for a Google Business Profile (staffed presence required). */
export const gbpEligibleOffices = OFFICES.filter((o) => o.gbpEligible);

/** Structured site contact/identity object for pages that prefer a single import. */
export const SITE = {
  name: 'US UK Accountants',
  legalName: 'US UK Accountants',
  url: 'https://www.usukaccountants.com',
  email: 'hello@usukaccountants.com',
  rating: null,
  /** sameAs profiles — REPLACE '#' with real URLs as accounts go live (critical for GEO entity). */
  sameAs: [
    { label: 'LinkedIn', href: '#' },
    { label: 'Google Business Profile', href: '#' },
    { label: 'Trustpilot', href: '#' },
  ],
  offices: OFFICES,
  phones: {
    uk: { label: 'London', number: PHONE_UK, tel: PHONE_UK.replace(/[^+\d]/g, ''), flag: '🇬🇧' },
    us: { label: 'New York', number: PHONE_US, tel: PHONE_US.replace(/[^+\d]/g, ''), flag: '🇺🇸' },
  },
} as const;

export const primaryNav: LinkItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Who We Help', href: '/who-we-help' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about/team' },
  { label: 'Contact', href: '/contact' },
];

export const megaMenuPanels: MegaMenuPanel[] = [
  {
    heading: 'UK Accounting',
    links: [
      { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts' },
      { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax' },
      { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns' },
      { label: 'Payroll', href: '/services/uk-accounting/payroll' },
      { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping' },
      { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment' },
      { label: 'Tax Planning', href: '/services/uk-accounting/tax-planning' },
      { label: 'Startup Accounting', href: '/services/uk-accounting/startup-accounting' },
    ],
  },
  {
    heading: 'US & Cross-Border',
    links: [
      { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns' },
      { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing' },
      { label: 'FATCA Compliance', href: '/services/us-expat-tax/fatca-compliance' },
      { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing' },
      { label: 'FEIE', href: '/services/us-expat-tax/foreign-earned-income-exclusion' },
      { label: 'Foreign Tax Credit', href: '/services/us-expat-tax/foreign-tax-credit' },
      { label: 'US–UK Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty' },
      { label: 'Form 5471', href: '/services/us-expat-tax/form-5471' },
    ],
  },
];

export const megaMenuFeature: MegaMenuFeature = {
  eyebrow: 'Most popular',
  title: 'IRS Streamlined Filing',
  description: 'Catch up on missed US returns penalty-free. The most common path for newly-aware filers.',
  href: '/services/us-expat-tax/streamlined-filing',
};

/** Professional-body memberships — EMPTY until verified. Do NOT list unverified bodies. */
export const credentials: string[] = [];

export const footerColumns: NavColumn[] = [
  {
    title: 'UK Services',
    links: [
      { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts' },
      { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax' },
      { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns' },
      { label: 'Payroll', href: '/services/uk-accounting/payroll' },
      { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment' },
      { label: 'Bookkeeping', href: '/services/uk-accounting/bookkeeping' },
    ],
  },
  {
    title: 'US & Cross-Border',
    links: [
      { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns' },
      { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing' },
      { label: 'FATCA', href: '/services/us-expat-tax/fatca-compliance' },
      { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing' },
      { label: 'FEIE', href: '/services/us-expat-tax/foreign-earned-income-exclusion' },
      { label: 'US–UK Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty' },
    ],
  },
  {
    title: 'Who We Help',
    links: [
      { label: 'US in UK', href: '/who-we-help/us-citizens-in-uk' },
      { label: 'UK in US', href: '/who-we-help/uk-citizens-in-us' },
      { label: 'Dual Citizens', href: '/who-we-help/dual-citizens' },
      { label: 'Founders', href: '/who-we-help/startups-founders' },
      { label: 'Landlords', href: '/who-we-help/landlords' },
      { label: 'HNW Individuals', href: '/who-we-help/high-net-worth-individuals' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Calculators', href: '/resources/calculators' },
      { label: 'Guides', href: '/resources/blog' },
      { label: 'Blog', href: '/resources/blog' },
      { label: 'Glossary', href: '/resources/glossary' },
      { label: 'Tax Deadlines', href: '/resources/guides/tax-deadlines-calendar' },
      { label: 'Case Studies', href: '/about/case-studies' },
    ],
  },
  {
    title: 'Firm',
    links: [
      { label: 'About', href: '/about/team' },
      { label: 'Team', href: '/about/team' },
      { label: 'Credentials', href: '/credentials' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Locations', href: '/locations' },
      { label: 'Trust Center', href: '/trust-center' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export const legalLinks: LinkItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Security', href: '/security' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
  { label: 'Review Policy', href: '/review-policy' },
  { label: 'Compliance', href: '/compliance' },
];

/* ============================================================
   Sample content data for library components.
   Pages import these or supply their own matching the same types.
   ============================================================ */
export const services: ServiceItem[] = [
  { icon: IconGlobeDoc, title: 'US Tax Returns', description: 'Federal and state filing for Americans abroad, done right and on time.', href: '/services/us-expat-tax/us-tax-returns' },
  { icon: IconShield, title: 'FBAR & FATCA', description: 'Foreign account and asset reporting kept fully compliant.', href: '/services/us-expat-tax/fbar-filing' },
  { icon: IconPlanning, title: 'Streamlined Filing', description: 'Catch up on missed US returns penalty-free.', href: '/services/us-expat-tax/streamlined-filing' },
  { icon: IconBank, title: 'UK Self Assessment', description: 'Self-employed, landlord and high-earner returns to HMRC.', href: '/services/uk-accounting/self-assessment' },
  { icon: IconCalculator, title: 'Company Accounts', description: 'Year-end accounts, Corporation Tax and Companies House filing.', href: '/services/uk-accounting/company-accounts' },
  { icon: IconTreaty, title: 'Treaty & Tax Planning', description: 'Structure income and assets to avoid double taxation.', href: '/services/us-expat-tax/us-uk-tax-treaty' },
  { icon: IconTreaty, title: 'Cross-Border Tax Planning', description: 'Coordinate income and reliefs across both systems before you file.', href: '/services/cross-border-advisory/cross-border-tax-planning' },
  { icon: IconPlanning, title: 'Business Structuring', description: 'Set up UK companies the right way for US owners.', href: '/services/cross-border-advisory/business-structuring' },
  { icon: IconBank, title: 'Pensions (401k / SIPP)', description: 'How pensions are taxed across the Atlantic.', href: '/services/cross-border-advisory/pensions-401k-sipp' },
];

export const audiences: AudienceItem[] = [
  { flag: '🇺🇸', title: 'US citizens in the UK', description: 'Stay IRS-compliant while living and working in Britain.', href: '/who-we-help/us-citizens-in-uk' },
  { flag: '🇬🇧', title: 'UK citizens in the US', description: 'Navigate US filing, visas and UK obligations together.', href: '/who-we-help/uk-citizens-in-us' },
  { flag: '🌐', title: 'Dual citizens', description: 'One coordinated strategy across both tax systems.', href: '/who-we-help/dual-citizens' },
  { flag: '💼', title: 'Founders & contractors', description: 'Structure your company the right way on both sides.', href: '/who-we-help/startups-founders' },
  { flag: '🏛️', title: 'High-net-worth individuals', description: 'Protect and plan complex cross-border wealth.', href: '/who-we-help/high-net-worth-individuals' },
  { flag: '✈️', title: 'Digital nomads', description: 'Sort residency, treaty relief and worldwide income.', href: '/who-we-help/digital-nomads' },
];

export const processSteps: ProcessStep[] = [
  { title: 'Free consultation', description: 'A no-obligation call to understand your situation on both sides.' },
  { title: 'Tailored plan', description: 'A clear, fixed-fee plan covering exactly what you need filed.' },
  { title: 'We file & optimise', description: 'We prepare, review and submit — minimising tax legally.' },
  { title: 'Year-round support', description: 'Deadlines tracked and questions answered all year.' },
];

export const stats: StatItem[] = [
  { value: '2', label: 'Staffed offices: London & New York' },
  { value: 'US + UK', label: 'Both tax systems, one firm' },
  { value: '7', label: 'Named specialists on your side' },
  { value: 'Worldwide', label: 'Cross-border clients supported' },
];

export const faqs: FaqItem[] = [
  { q: 'Do US citizens living in the UK have to file a US tax return?', a: 'Yes. US citizens and green card holders must file a US federal tax return every year regardless of where they live, reporting worldwide income. Living in the UK does not remove this obligation — but reliefs like the Foreign Earned Income Exclusion and Foreign Tax Credit usually prevent you from being taxed twice.' },
  { q: 'Can I be taxed twice on the same income in the US and the UK?', a: 'Generally no. The US–UK tax treaty, combined with the Foreign Tax Credit and Foreign Earned Income Exclusion, is designed to prevent double taxation. Most clients legally owe tax in only one jurisdiction on a given income source when their filings are structured correctly.' },
  { q: 'What is the IRS Streamlined Filing Procedure?', a: 'The Streamlined Filing Compliance Procedure lets US taxpayers who were unaware of their obligations catch up penalty-free. It typically requires three years of tax returns and six years of FBARs, plus a statement certifying the failure to file was non-wilful.' },
  { q: 'Do I need to file an FBAR if I live in the UK?', a: 'If you are a US person and the combined balance of your non-US financial accounts exceeds $10,000 at any point in the year, you must file an FBAR (FinCEN Form 114). This includes UK current accounts, ISAs, pensions and joint accounts.' },
  { q: 'Can one firm really handle both my US and UK taxes?', a: 'Yes — that is exactly what we specialise in. Rather than coordinating a UK accountant and a US preparer who never speak to each other, our team handles both sides together, so your treaty positions, credits and filings line up across jurisdictions.' },
];

/** GENUINE testimonials only. Empty until real, attributable testimonials exist. Do NOT invent. */
export const testimonials: Testimonial[] = [];

export const team: TeamMember[] = [
  { name: 'Sam', role: 'Founder & Lead Advisor', credentials: [], jurisdictions: ['US', 'UK', 'Cross-Border'], initials: 'S', href: '/about/team/sam-h' },
  { name: 'Katie', role: 'US Accountant', credentials: [], jurisdictions: ['US Federal', 'US State'], initials: 'K', href: '/about/team/katie-m' },
  { name: 'Briana', role: 'Senior US Accountant', credentials: [], jurisdictions: ['US Federal', 'US State'], initials: 'B', href: '/about/team/briana' },
  { name: 'Sarah', role: 'UK Accountant', credentials: [], jurisdictions: ['UK', 'HMRC'], initials: 'S', href: '/about/team/sarah-j' },
  { name: 'Kristina', role: 'UK Tax Accountant', credentials: [], jurisdictions: ['UK', 'HMRC'], initials: 'K', href: '/about/team/kristina' },
  { name: 'Shezi', role: 'Finance Manager', credentials: [], jurisdictions: ['US', 'UK'], initials: 'S', href: '/about/team/shezi-r' },
  { name: 'Nicola M.', role: 'Audit Officer', credentials: [], jurisdictions: ['US', 'UK'], initials: 'NM', href: '/about/team/nicola-m' },
];

/**
 * Pricing tiers — INTENTIONALLY EMPTY.
 *
 * The firm's locked pricing model is: free discovery call → paid strategy
 * session "from £350 / $450" (credited against engagement) → bespoke,
 * complexity-based engagement ("from £X", always premium). It deliberately
 * does NOT use fixed annual packages. Do not populate this with fixed-price
 * tiers — that contradicts the positioning and creates binding price claims.
 * Build a /pricing page from the InvestmentBand model when ready.
 */
export const pricingTiers: PricingTier[] = [];

export const dueDiligenceComparison: ComparisonTableData = {
  columns: ['US UK Accountants', 'US-only firms', 'DIY software'],
  highlightColumn: 1,
  rows: [
    { label: 'US federal & state returns', values: [true, true, true] },
    { label: 'UK accounting & Self Assessment', values: [true, false, false] },
    { label: 'Coordinated US–UK treaty planning', values: [true, false, false] },
    { label: 'One team for both jurisdictions', values: [true, false, false] },
    { label: 'FBAR & FATCA included', values: [true, true, 'Add-on'] },
    { label: 'Named specialist review', values: [true, 'Sometimes', false] },
  ],
};

import type { PillarItem, HeroChip } from '@/lib/types';

export const heroChips: HeroChip[] = [
  { flag: '\u{1F1FA}\u{1F1F8}', label: 'US citizen in the UK', href: '/who-we-help/us-citizens-in-uk' },
  { flag: '\u{1F1EC}\u{1F1E7}', label: 'UK citizen in the US', href: '/who-we-help/uk-citizens-in-us' },
  { flag: '\u{1F310}', label: 'Dual citizen', href: '/who-we-help/dual-citizens' },
  { flag: '\u{1F3E2}', label: 'Business owner', href: '/who-we-help/startups-founders' },
];

export const pillars: PillarItem[] = [
  {
    iconKey: 'bank',
    title: 'UK Accounting',
    description: 'Full-service accounting for UK companies, contractors and the self-employed — compliant, optimised, and stress-free.',
    href: '/services/uk-accounting',
    links: [
      { label: 'Company Accounts', href: '/services/uk-accounting/company-accounts' },
      { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax' },
      { label: 'VAT Returns', href: '/services/uk-accounting/vat-returns' },
      { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment' },
    ],
  },
  {
    iconKey: 'globe',
    title: 'US Expat Tax',
    description: 'Specialist US tax for Americans abroad and cross-border families — FBAR, FATCA, Streamlined Filing and treaty planning.',
    href: '/services/us-expat-tax',
    links: [
      { label: 'US Tax Returns', href: '/services/us-expat-tax/us-tax-returns' },
      { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing' },
      { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing' },
      { label: 'US\u2013UK Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty' },
    ],
    featured: true,
  },
  {
    iconKey: 'treaty',
    title: 'Cross-Border Advisory',
    description: 'Treaty planning, pensions, structuring and the decisions that only matter when you file in both countries at once.',
    href: '/services/cross-border-advisory',
    links: [
      { label: 'Cross-Border Tax Planning', href: '/services/cross-border-advisory/cross-border-tax-planning' },
      { label: 'US\u2013UK Tax Treaty', href: '/services/us-expat-tax/us-uk-tax-treaty' },
      { label: 'Business Structuring', href: '/services/cross-border-advisory/business-structuring' },
      { label: 'Pensions (401k / SIPP)', href: '/services/cross-border-advisory/pensions-401k-sipp' },
    ],
  },
];

import type { CalculatorMeta } from '@/lib/types';

/** Calculator suite. Flagship is live; others ship over Phase 2–4. */
export const calculators: CalculatorMeta[] = [
  { slug: 'double-tax-estimator', title: 'US/UK Double-Tax Estimator', description: 'See whether your income is at risk of being taxed twice — and roughly how much relief the Foreign Tax Credit and treaty could provide.', iconKey: 'globe', status: 'live', sampleLabel: 'Typical relief identified', sampleValue: 'Most pay tax once' },
  { slug: 'fbar-checker', title: 'FBAR Requirement Checker', description: 'Answer three questions to find out whether you need to file an FBAR (FinCEN 114) this year.', iconKey: 'shield', status: 'live', sampleLabel: 'Takes under a minute', sampleValue: '3 quick questions' },
  { slug: 'streamlined-eligibility', title: 'Streamlined Filing Eligibility', description: 'Check whether you may qualify for the IRS Streamlined programme to catch up penalty-free.', iconKey: 'shield', status: 'live', sampleLabel: 'Indicative path', sampleValue: 'Foreign or domestic' },
  { slug: 'feie-vs-ftc', title: 'FEIE vs Foreign Tax Credit', description: 'See which relief is likely to leave you better off as an American in the UK.', iconKey: 'planning', status: 'coming-soon' },
  { slug: 'srt-residence', title: 'UK Statutory Residence Test', description: 'Work through the SRT to estimate your UK tax-residence status for the year.', iconKey: 'planning', status: 'live', sampleLabel: 'Indicative result', sampleValue: 'In about a minute' },
  { slug: 'self-assessment-deadline', title: 'Self Assessment Deadline & Penalty', description: 'Find your filing deadlines and estimate HMRC late penalties.', iconKey: 'calculator', status: 'live', sampleLabel: 'HMRC penalties', sampleValue: 'Estimated instantly' },
  { slug: 'us-expat-deadlines', title: 'US Expat Tax Deadlines', description: 'Your US filing dates as an American abroad, including the automatic extension.', iconKey: 'calculator', status: 'live', sampleLabel: 'Key dates', sampleValue: 'For your tax year' },
  { slug: 'fig-regime', title: '4-Year FIG Regime Checker', description: 'Check if you qualify for the Foreign Income & Gains regime that replaced the remittance basis in April 2025.', iconKey: 'treaty', status: 'live', sampleLabel: 'Eligibility check', sampleValue: '3 quick questions' },
  { slug: 'corporation-tax', title: 'UK Corporation Tax Estimator', description: 'Estimate your UK company\u2019s Corporation Tax, including marginal relief.', iconKey: 'bank', status: 'live', sampleLabel: 'With marginal relief', sampleValue: 'Current-year rates' },
  { slug: 'take-home-pay', title: 'US vs UK Take-Home Pay', description: 'Compare net pay across the two systems when considering a move.', iconKey: 'planning', status: 'live', sampleLabel: 'Side-by-side', sampleValue: 'Take-home %' },
];


export interface CalculatorLinks {
  services?: { label: string; href: string }[];
  glossary?: { label: string; href: string }[];
  calculators?: { label: string; href: string }[];
  articles?: { label: string; href: string }[];
}

export const calculatorLinks: Record<string, CalculatorLinks> = {
  'double-tax-estimator': {
    services: [
      { label: 'Foreign Tax Credit', href: '/services/us-expat-tax/foreign-tax-credit' },
      { label: 'US\u2013UK tax treaty', href: '/services/us-expat-tax/us-uk-tax-treaty' },
    ],
    glossary: [
      { label: 'Foreign Tax Credit', href: '/resources/glossary/foreign-tax-credit' },
      { label: 'US\u2013UK Income Tax Treaty', href: '/resources/glossary/us-uk-tax-treaty' },
      { label: 'Saving Clause', href: '/resources/glossary/saving-clause' },
    ],
    calculators: [
      { label: 'US vs UK Take-Home Pay', href: '/resources/calculators/take-home-pay' },
      { label: 'US Expat Tax Deadlines', href: '/resources/calculators/us-expat-deadlines' },
    ],
  },
  'fbar-checker': {
    services: [
      { label: 'FBAR filing', href: '/services/us-expat-tax/fbar-filing' },
      { label: 'FATCA compliance', href: '/services/us-expat-tax/fatca-compliance' },
    ],
    glossary: [
      { label: 'FBAR', href: '/resources/glossary/fbar' },
      { label: 'FATCA', href: '/resources/glossary/fatca' },
      { label: 'Form 8938', href: '/resources/glossary/form-8938' },
    ],
    calculators: [
      { label: 'Streamlined Filing Eligibility', href: '/resources/calculators/streamlined-eligibility' },
    ],
    articles: [
      { label: 'Do I need to file an FBAR?', href: '/resources/blog/do-i-need-to-file-an-fbar' },
    ],
  },
  'streamlined-eligibility': {
    services: [
      { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing' },
      { label: 'US tax returns', href: '/services/us-expat-tax/us-tax-returns' },
    ],
    glossary: [
      { label: 'Streamlined Filing Procedures', href: '/resources/glossary/streamlined-filing' },
      { label: 'Accidental American', href: '/resources/glossary/accidental-american' },
    ],
    calculators: [
      { label: 'FBAR Requirement Checker', href: '/resources/calculators/fbar-checker' },
    ],
    articles: [
      { label: 'Havent filed US taxes living in the UK?', href: '/resources/blog/havent-filed-us-taxes-living-in-uk' },
    ],
  },
  'srt-residence': {
    services: [
      { label: 'Tax planning', href: '/services/uk-accounting/tax-planning' },
      { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment' },
    ],
    glossary: [
      { label: 'Statutory Residence Test', href: '/resources/glossary/statutory-residence-test' },
      { label: 'Domicile', href: '/resources/glossary/domicile' },
      { label: 'Long-Term Resident (IHT)', href: '/resources/glossary/long-term-resident-iht' },
    ],
    calculators: [
      { label: '4-Year FIG Regime Checker', href: '/resources/calculators/fig-regime' },
    ],
  },
  'us-expat-deadlines': {
    services: [
      { label: 'US tax returns', href: '/services/us-expat-tax/us-tax-returns' },
      { label: 'FBAR filing', href: '/services/us-expat-tax/fbar-filing' },
    ],
    glossary: [
      { label: 'FBAR', href: '/resources/glossary/fbar' },
      { label: 'FEIE', href: '/resources/glossary/feie' },
    ],
    calculators: [
      { label: 'Self Assessment Deadline & Penalty', href: '/resources/calculators/self-assessment-deadline' },
    ],
  },
  'self-assessment-deadline': {
    services: [
      { label: 'Self Assessment', href: '/services/uk-accounting/self-assessment' },
    ],
    glossary: [
      { label: 'Self Assessment', href: '/resources/glossary/self-assessment' },
      { label: 'National Insurance', href: '/resources/glossary/national-insurance' },
    ],
    calculators: [
      { label: 'US Expat Tax Deadlines', href: '/resources/calculators/us-expat-deadlines' },
    ],
  },
  'corporation-tax': {
    services: [
      { label: 'Corporation Tax', href: '/services/uk-accounting/corporation-tax' },
      { label: 'Startup accounting', href: '/services/uk-accounting/startup-accounting' },
    ],
    glossary: [
      { label: 'Corporation Tax', href: '/resources/glossary/corporation-tax' },
      { label: 'GILTI', href: '/resources/glossary/gilti' },
      { label: 'Controlled Foreign Corporation', href: '/resources/glossary/cfc' },
    ],
    articles: [
      { label: 'How UK corporation tax and US tax interact', href: '/resources/blog/uk-corporation-tax-and-us-tax-interact' },
    ],
  },
  'take-home-pay': {
    services: [
      { label: 'US tax returns', href: '/services/us-expat-tax/us-tax-returns' },
      { label: 'Tax planning', href: '/services/uk-accounting/tax-planning' },
    ],
    glossary: [
      { label: 'National Insurance', href: '/resources/glossary/national-insurance' },
      { label: 'Totalization Agreement', href: '/resources/glossary/totalization-agreement' },
    ],
    calculators: [
      { label: 'US/UK Double-Tax Estimator', href: '/resources/calculators/double-tax-estimator' },
    ],
  },
  'fig-regime': {
    services: [
      { label: 'Tax planning', href: '/services/uk-accounting/tax-planning' },
    ],
    glossary: [
      { label: 'Domicile', href: '/resources/glossary/domicile' },
      { label: 'Statutory Residence Test', href: '/resources/glossary/statutory-residence-test' },
    ],
    calculators: [
      { label: 'UK Statutory Residence Test', href: '/resources/calculators/srt-residence' },
    ],
  },
};
