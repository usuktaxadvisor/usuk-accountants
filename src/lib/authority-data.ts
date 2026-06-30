import type {
  PressItem, Review, CaseStudy, Author, PolicySection,
} from '@/lib/types';

/* ------------------------------------------------------------
   IMPORTANT: All names, credentials, quotes, ratings and metrics
   below are PLACEHOLDERS. Replace with verified information only.
   Never publish unverified credentials or fabricated reviews —
   doing so breaks EEAT and, for reviews, may breach FTC/CMA rules.
   ------------------------------------------------------------ */

/** Press logos — EMPTY until the firm has genuine, verifiable coverage. Do NOT invent outlets. */
export const pressItems: PressItem[] = [];

/** Press quotes — EMPTY until real, attributable coverage exists. Do NOT invent quotes or outlets. */
export const pressFeatures: PressItem[] = [];

export const reviews: Review[] = []; // GENUINE reviews only — empty until verified reviews exist. Do NOT invent.

export const reviewSummary = {
  average: null as number | null,
  count: 0,
  breakdown: [] as { stars: number; pct: number }[],
}; // Derived from real reviews only.

export const caseStudies: CaseStudy[] = [
  {
    slug: 'streamlined-filing-six-years',
    title: 'Six years of missed US returns, resolved penalty-free',
    client: 'US citizen, 12 years in the UK',
    flag: '\u{1F1FA}\u{1F1F8}',
    challenge: 'A US citizen living in London discovered they had never filed US returns or FBARs, and feared substantial penalties on years of unreported UK income and accounts.',
    approach: [
      'Assessed eligibility for the IRS Streamlined Foreign Offshore Procedure',
      'Prepared three years of amended returns and six years of FBARs',
      'Applied the Foreign Tax Credit to offset UK tax already paid',
      'Drafted the non-wilful certification statement',
    ],
    outcome: 'Brought fully compliant with zero penalties, and no additional US tax owed thanks to treaty and FTC positions.',
    metrics: [
      { value: '\u00A30', label: 'Penalties paid' },
      { value: '6 yrs', label: 'FBARs filed' },
      { value: '100%', label: 'Compliant' },
    ],
    services: [
      { label: 'Streamlined Filing', href: '/services/us-expat-tax/streamlined-filing' },
      { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing' },
    ],
  },
  {
    slug: 'dual-citizen-company-structuring',
    title: 'A dual citizen UK company, structured for both tax systems',
    client: 'Dual US-UK citizen, SaaS founder',
    flag: '\u{1F310}',
    challenge: 'A founder with a UK limited company faced potential GILTI exposure and Form 5471 obligations on the US side, with no coordination between their UK accountant and US preparer.',
    approach: [
      'Reviewed the UK company structure against US CFC rules',
      'Prepared Form 5471 and modelled GILTI exposure',
      'Coordinated UK Corporation Tax and US filings on one timeline',
      'Planned remuneration to balance both systems',
    ],
    outcome: 'A single coordinated filing position across both jurisdictions, with GILTI minimised legally and full Form 5471 compliance.',
    metrics: [
      { value: '1', label: 'Coordinated team' },
      { value: '2', label: 'Jurisdictions aligned' },
      { value: 'Form 5471', label: 'Filed correctly' },
    ],
    services: [
      { label: 'Form 5471', href: '/services/us-expat-tax/form-5471' },
      { label: 'International Structuring', href: '/services/cross-border-advisory/business-structuring' },
    ],
  },
  {
    slug: 'us-to-uk-relocation',
    title: 'A clean first-year transition from New York to Edinburgh',
    client: 'UK national returning from the US',
    flag: '\u{1F1EC}\u{1F1E7}',
    challenge: 'A returning UK national needed to manage a split tax year, residual US filing obligations, and UK residency from the same point of contact.',
    approach: [
      'Applied the UK Statutory Residence Test and split-year treatment',
      'Coordinated the final US return with treaty tie-breaker positions',
      'Handled FBAR for the transition year',
      'Set up UK Self Assessment going forward',
    ],
    outcome: 'A seamless first year with no double taxation and every deadline met on both sides of the Atlantic.',
    metrics: [
      { value: '0', label: 'Double-taxed income' },
      { value: '100%', label: 'Deadlines met' },
      { value: '1 yr', label: 'Transition handled' },
    ],
    services: [
      { label: 'Cross-Border Planning', href: '/services/cross-border-advisory/cross-border-tax-planning' },
      { label: 'UK Self Assessment', href: '/services/uk-accounting/self-assessment' },
    ],
  },
];

export const authors: Author[] = [
  {
    slug: 'sam-h',
    name: 'Sam H.',
    role: 'Founder & Lead Advisor',
    initials: 'SH',
    credentials: ['Credentials to be verified'],
    jurisdictions: ['US Federal', 'UK', 'US-UK Treaty'],
    yearsExperience: 0,
    bio: 'Founder and lead advisor of US UK Accountants. Leads cross-border strategy across the US and UK, from expat returns and Streamlined Filing to treaty planning for individuals, businesses and high-net-worth clients.',
    expertise: ['US-UK cross-border tax', 'Streamlined Filing', 'treaty planning', 'high-net-worth advisory'],
    sameAs: [
      { label: 'LinkedIn', href: '#' },
    ],
    reviewedBy: 'Nicola M., Audit Officer',
  },
  {
    slug: 'katie-m',
    name: 'Katie M.',
    role: 'US Accountant',
    initials: 'KM',
    credentials: ['Credentials to be verified'],
    jurisdictions: ['US Federal', 'US State'],
    yearsExperience: 0,
    bio: 'US accountant focused on federal and state returns for Americans abroad, including FBAR, FATCA and foreign tax credit work for clients living in the UK and beyond.',
    expertise: ['US expat returns', 'FBAR & FATCA', 'Foreign Tax Credit', 'FEIE'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Briana, Senior US Accountant',
  },
  {
    slug: 'briana',
    name: 'Briana',
    role: 'Senior US Accountant',
    initials: 'BR',
    credentials: ['Credentials to be verified'],
    jurisdictions: ['US Federal', 'US State'],
    yearsExperience: 0,
    bio: 'Senior US accountant handling complex expat and cross-border filings, including Streamlined Filing cases, Form 5471 and the US side of dual-citizen returns.',
    expertise: ['Streamlined Filing', 'Form 5471', 'GILTI', 'complex US expat returns'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Sam H., Founder & Lead Advisor',
  },
  {
    slug: 'sarah-j',
    name: 'Sarah J.',
    role: 'UK Accountant',
    initials: 'SJ',
    credentials: ['Credentials to be verified'],
    jurisdictions: ['UK', 'HMRC'],
    yearsExperience: 0,
    bio: 'UK accountant covering company accounts, Self Assessment, VAT and payroll for UK businesses and individuals, including those with US connections.',
    expertise: ['UK Self Assessment', 'Company Accounts', 'VAT', 'Payroll'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Kristina, UK Tax Accountant',
  },
  {
    slug: 'kristina',
    name: 'Kristina',
    role: 'UK Tax Accountant',
    initials: 'KR',
    credentials: ['Credentials to be verified'],
    jurisdictions: ['UK', 'HMRC'],
    yearsExperience: 0,
    bio: 'UK tax accountant specialising in Corporation Tax, tax planning and residency questions for company directors, landlords and individuals with cross-border affairs.',
    expertise: ['Corporation Tax', 'UK tax planning', 'Residency (SRT)', 'landlord tax'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Sarah J., UK Accountant',
  },
  {
    slug: 'shezi-r',
    name: 'Shezi R.',
    role: 'Finance Manager',
    initials: 'SR',
    credentials: ['Credentials to be verified'],
    jurisdictions: ['UK', 'US'],
    yearsExperience: 0,
    bio: 'Finance manager overseeing the firm\u2019s financial operations and client account management across the US and UK practices.',
    expertise: ['practice finance', 'client account management', 'bookkeeping oversight'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Sam H., Founder & Lead Advisor',
  },
  {
    slug: 'nicola-m',
    name: 'Nicola M.',
    role: 'Audit Officer',
    initials: 'NM',
    credentials: ['Credentials to be verified'],
    jurisdictions: ['UK', 'US'],
    yearsExperience: 0,
    bio: 'Audit officer responsible for quality control and review across cross-border filings, ensuring work meets professional standards on both sides of the Atlantic.',
    expertise: ['quality control', 'file review', 'compliance oversight'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Sam H., Founder & Lead Advisor',
  },
]

export const editorialPolicy: PolicySection[] = [
  { heading: 'Why this policy exists', body: ['Our content covers tax - a Your Money or Your Life topic where accuracy directly affects people\u2019s finances and legal standing. This policy sets out how we research, write, review and maintain everything we publish so readers can trust it.'] },
  { heading: 'Who writes our content', body: ['Every article is written or directed by a member of our cross-border team and is named on the piece, linking to a full author profile. US content is reviewed by our US specialists and UK content by our UK specialists, so both sides of any cross-border topic are checked by the right people.'] },
  { heading: 'How we research', body: ['We rely on primary sources: IRS and HMRC guidance, the US-UK tax treaty text, statute, and official forms. Where a source could change (rates, thresholds, deadlines), we cite the tax year it applies to and date the article.'] },
  { heading: 'Review and fact-checking', body: ['Before publication, every piece is reviewed by a second specialist in the relevant jurisdiction. Cross-border articles are reviewed on both the US and UK side. We record who wrote and who reviewed each article.'] },
  { heading: 'Keeping content current', body: ['Tax rules change every year. We review published content at least annually and after major legislative changes, and show a \u201Clast reviewed\u201D date so you know how current it is. Outdated content is updated or withdrawn.'] },
  { heading: 'Corrections', body: ['If we get something wrong, we fix it promptly and note material corrections. To report an error, contact our editorial team and we will review it.'] },
  { heading: 'Independence', body: ['Our guidance is not influenced by advertisers or third parties. We do not publish sponsored content disguised as editorial. General guidance is educational and is not a substitute for advice on your specific circumstances.'] },
];

export const reviewPolicy: PolicySection[] = [
  { heading: 'Our commitment to genuine reviews', body: ['Every review we display comes from a real, verified client. We never write, buy, incentivise or edit reviews for sentiment, in line with FTC and UK CMA guidance on consumer reviews.'] },
  { heading: 'How reviews are collected', body: ['We invite clients to review us after their work is completed, through independent platforms such as Google and Trustpilot, and through a verified-client process. Invitations go to all eligible clients, not only those we expect to be positive.'] },
  { heading: 'Verification', body: ['Reviews shown on this site are matched to genuine engagements. Where a review is sourced from a third-party platform, it remains hosted there and can be independently verified.'] },
  { heading: 'Negative and critical reviews', body: ['We do not suppress critical reviews. Negative feedback is published alongside positive feedback and is used to improve our service. We may respond publicly to provide context, within client confidentiality limits.'] },
  { heading: 'No incentives', body: ['We do not offer discounts, gifts or any benefit in exchange for a review, and we do not condition any service on leaving one.'] },
  { heading: 'Editing and removal', body: ['We do not edit the substance of a review. A review may only be removed if it breaches platform rules, contains confidential or personal data, or is shown not to relate to a genuine client.'] },
];

export const privacyPolicy: PolicySection[] = [
  { heading: 'Who we are', body: ['US UK Accountants provides cross-border tax and accounting services. This policy explains what personal data we collect, why, and your rights over it. We act as a data controller under UK GDPR and the Data Protection Act 2018.'] },
  { heading: 'What we collect', body: ['Contact details you provide (name, email, phone); information needed to prepare your tax filings (income, accounts, residency, identifiers such as SSN/ITIN/NINO where required); and limited technical data from your visit (such as analytics, where consented).'] },
  { heading: 'Why we process it', body: ['To respond to enquiries, deliver our services, meet our own legal and regulatory obligations (including anti-money-laundering and tax filing requirements), and, where you consent, to send you updates.'] },
  { heading: 'Legal bases', body: ['We rely on: performance of a contract; legal obligation; legitimate interests (running and improving our practice); and consent (for marketing and non-essential cookies). You can withdraw consent at any time.'] },
  { heading: 'Sensitive identifiers', body: ['Tax work requires sensitive identifiers and financial data. We hold these only as long as necessary for the engagement and our legal retention obligations, and protect them with the safeguards described in our Security page.'] },
  { heading: 'Sharing', body: ['We share data only as needed to deliver services (e.g. secure filing with HMRC and the IRS) and with vetted processors under contract. We do not sell your data. Cross-border transfers use appropriate safeguards.'] },
  { heading: 'Retention', body: ['We keep records for the periods required by US and UK tax and professional rules, then securely delete or anonymise them.'] },
  { heading: 'Your rights', body: ['You may request access, correction, deletion, restriction, portability, or object to processing. To exercise any right, contact us. You can also complain to the UK ICO.'] },
  { heading: 'Cookies', body: ['We use essential cookies to run the site and, with your consent, analytics to improve it. You control non-essential cookies through our cookie banner and your browser.'] },
];

export const trustCenterPillars = [
  { icon: 'shield', title: 'Security', desc: 'Encryption, secure document exchange and access controls protect your data.', href: '/security' },
  { icon: 'planning', title: 'Editorial standards', desc: 'Qualified authors, independent review and dated, sourced content.', href: '/editorial-policy' },
  { icon: 'check', title: 'Genuine reviews', desc: 'Verified-client reviews only, collected per FTC and CMA guidance.', href: '/review-policy' },
  { icon: 'globe', title: 'Privacy & data', desc: 'UK GDPR-aligned handling of your personal and financial data.', href: '/privacy' },
  { icon: 'bank', title: 'Professional standards', desc: 'How US and UK tax credentials work, and what they mean for you.', href: '/credentials' },
  { icon: 'treaty', title: 'Professional conduct', desc: 'Engagement terms, AML compliance and confidentiality.', href: '/compliance' },
] as const;

export const securityMeasures = [
  { title: 'Encryption in transit and at rest', desc: 'All data is transmitted over TLS and stored encrypted. Document exchange uses a secure portal, never plain email.' },
  { title: 'Access controls', desc: 'Client data is accessible only to the professionals working on your engagement, on a least-privilege basis.' },
  { title: 'Secure document portal', desc: 'You upload sensitive documents through an encrypted portal with authentication - we never ask for IDs or account numbers by email.' },
  { title: 'Vendor due diligence', desc: 'Any third-party processor is vetted and bound by contract to equivalent security and data-protection standards.' },
  { title: 'Retention and disposal', desc: 'Data is retained only as long as legally required, then securely deleted or anonymised.' },
  { title: 'Incident response', desc: 'We maintain a process to detect, contain and notify you of any data incident in line with UK GDPR timelines.' },
];

export const complianceItems = [
  { title: 'Professional registration', desc: 'Where a team member holds a professional credential, it is listed and independently verifiable on their individual profile. We publish credentials only once verified against the issuing body\u2019s register.' },
  { title: 'Anti-money-laundering (AML)', desc: 'We are subject to AML obligations and carry out client due diligence and identity verification as required by law before beginning work.' },
  { title: 'Engagement terms', desc: 'Every client receives a written engagement letter setting out scope, fees, responsibilities and limitations before work begins.' },
  { title: 'Confidentiality', desc: 'Client information is treated as confidential and shared only as needed to deliver services or where legally required.' },
  { title: 'Professional indemnity', desc: 'We carry professional indemnity cover appropriate to the services we provide.' },
  { title: 'Complaints', desc: 'We have a clear complaints procedure and, where applicable, clients may escalate to the relevant professional body.' },
];
