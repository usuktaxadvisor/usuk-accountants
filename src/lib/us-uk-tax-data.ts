/**
 * US–UK TAX DATA — single source of truth for the Knowledge Centre.
 *
 * EVERY figure here carries its tax year and an official primary source. These
 * are the numbers AI engines and journalists cite, so accuracy is non-negotiable.
 *
 * MAINTENANCE: US figures are indexed annually by the IRS (usually announced
 * Oct–Nov for the following tax year). UK figures change at fiscal events.
 * Update once a year and everything that imports this stays correct.
 *
 * Last reviewed: 2026.
 */

export interface TaxFigure {
  label: string;
  value: string;
  taxYear: string;
  note?: string;
  source: { name: string; url: string };
  status: 'verified' | 'stable' | 'pending';
  checkedDate?: string;
}

/* ============================ US FEDERAL — EXPAT ============================ */

export const US_FEIE: TaxFigure = {
  label: 'Foreign Earned Income Exclusion (FEIE) maximum',
  value: '$130,000',
  taxYear: '2025',
  note: 'The maximum foreign earned income a qualifying US taxpayer can exclude under IRC §911. Indexed annually for inflation. For 2024 the figure was $126,500.',
  source: { name: 'IRS — Foreign Earned Income Exclusion', url: 'https://www.irs.gov/individuals/international-taxpayers/foreign-earned-income-exclusion' },
  status: 'pending',
};

export const US_FBAR: TaxFigure = {
  label: 'FBAR (FinCEN 114) reporting threshold',
  value: '$10,000',
  taxYear: 'All years',
  note: 'An FBAR is required if the aggregate value of all your foreign financial accounts exceeds $10,000 at any point in the calendar year. This threshold is fixed, not indexed.',
  source: { name: 'FinCEN / IRS — Report of Foreign Bank and Financial Accounts (FBAR)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar' },
  status: 'stable',
};

export const US_FATCA_8938: TaxFigure[] = [
  {
    label: 'FATCA Form 8938 — living abroad, single',
    value: '$200,000 / $300,000',
    taxYear: '2025',
    note: 'Taxpayers living abroad file Form 8938 if specified foreign financial assets exceed $200,000 on the last day of the year, or $300,000 at any point during the year (single or married-filing-separately).',
    source: { name: 'IRS — Do I need to file Form 8938?', url: 'https://www.irs.gov/businesses/corporations/do-i-need-to-file-form-8938-statement-of-specified-foreign-financial-assets' },
    status: 'stable',
  },
  {
    label: 'FATCA Form 8938 — living abroad, married filing jointly',
    value: '$400,000 / $600,000',
    taxYear: '2025',
    note: 'Married-filing-jointly taxpayers living abroad file if assets exceed $400,000 on the last day of the year, or $600,000 at any point during the year.',
    source: { name: 'IRS — Do I need to file Form 8938?', url: 'https://www.irs.gov/businesses/corporations/do-i-need-to-file-form-8938-statement-of-specified-foreign-financial-assets' },
    status: 'stable',
  },
];

export const US_STANDARD_DEDUCTION: TaxFigure[] = [
  {
    label: 'US standard deduction — single',
    value: '$15,000',
    taxYear: '2025',
    note: 'Indexed annually. Married filing jointly is double the single amount.',
    source: { name: 'IRS — Standard deduction', url: 'https://www.irs.gov/credits-deductions/individuals/standard-deduction' },
    status: 'pending',
  },
  {
    label: 'US standard deduction — married filing jointly',
    value: '$30,000',
    taxYear: '2025',
    source: { name: 'IRS — Standard deduction', url: 'https://www.irs.gov/credits-deductions/individuals/standard-deduction' },
    status: 'pending',
  },
];

export const US_FILING_DEADLINES: TaxFigure[] = [
  {
    label: 'US return — standard deadline',
    value: '15 April',
    taxYear: 'Annual',
    note: 'The standard filing and payment deadline for the prior tax year.',
    source: { name: 'IRS — When to file', url: 'https://www.irs.gov/filing/individuals/when-to-file' },
    status: 'stable',
  },
  {
    label: 'US return — automatic expat extension',
    value: '15 June',
    taxYear: 'Annual',
    note: 'US citizens and residents living abroad receive an automatic two-month extension to file (though tax owed still accrues interest from 15 April). A further extension to 15 October is available on request.',
    source: { name: 'IRS — U.S. citizens and resident aliens abroad', url: 'https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-resident-aliens-abroad' },
    status: 'stable',
  },
  {
    label: 'FBAR deadline',
    value: '15 April (auto-extended to 15 October)',
    taxYear: 'Annual',
    note: 'The FBAR is due with the tax return but receives an automatic extension to 15 October, with no separate request required.',
    source: { name: 'FinCEN — BSA E-Filing', url: 'https://bsaefiling.fincen.treas.gov/main.html' },
    status: 'stable',
  },
];

/* ============================ US–UK TAX TREATY ============================ */

export interface TreatyArticle {
  article: string;
  title: string;
  summary: string;
}

export const TREATY_ARTICLES: TreatyArticle[] = [
  { article: 'Article 4', title: 'Residence', summary: 'Determines treaty residence and provides tie-breaker rules where a person is resident in both countries under domestic law.' },
  { article: 'Article 17', title: 'Pensions', summary: 'Governs the taxation of pensions and similar remuneration. The interaction with the US "saving clause" makes some UK pension positions contested — professional advice is essential.' },
  { article: 'Article 18', title: 'Pension schemes', summary: 'Provides for cross-border recognition of certain pension contributions and the tax treatment of pension scheme growth.' },
  { article: 'Article 23', title: 'Elimination of double taxation', summary: 'The core relief mechanism, allowing credit for tax paid in the other country so the same income is not taxed twice.' },
  { article: 'Article 24', title: 'Non-discrimination', summary: 'Prevents either country from taxing nationals of the other more heavily than its own in comparable circumstances.' },
  { article: 'Saving clause', title: 'US saving clause', summary: 'The US reserves the right to tax its citizens as if parts of the treaty did not exist. This is why US citizens in the UK cannot simply rely on the treaty to exempt income, and why some treaty positions require Form 8833 disclosure.' },
];

export const TREATY_SOURCE = {
  name: 'US–UK Income Tax Treaty (2001) & Technical Explanation',
  url: 'https://www.irs.gov/businesses/international-businesses/united-kingdom-uk-tax-treaty-documents',
};

/* ============================ CATEGORY GROUPING ============================ */

export const US_FIGURES: TaxFigure[] = [
  US_FEIE,
  US_FBAR,
  ...US_FATCA_8938,
  ...US_STANDARD_DEDUCTION,
];
