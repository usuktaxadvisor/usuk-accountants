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
    credentials: ['ACCA', 'ACA'],
    jurisdictions: ['US Federal', 'UK', 'US-UK Treaty'],
    yearsExperience: 3,
    bio: 'Sam is the founder and lead advisor of US UK Accountants, and sets the direction for how the firm handles tax on both sides of the Atlantic. Dual-qualified as an ACCA and ACA accountant, Sam leads the most complex cross-border engagements personally \u2014 from Streamlined Filing and treaty positions to the structuring questions that arise when someone is taxable in both the US and the UK. Sam works most closely with founders, high-net-worth individuals and dual citizens who need a single advisor able to see the whole picture rather than one side of it, and oversees the standards every other member of the team works to.',
    expertise: ['US-UK cross-border strategy', 'Streamlined Filing', 'US-UK treaty planning', 'high-net-worth advisory', 'business structuring'],
    sameAs: [
      { label: 'LinkedIn', href: '#' },
    ],
    reviewedBy: 'Nicola M., ACCA',
  },
  {
    slug: 'katie-m',
    name: 'Katie M.',
    role: 'US Accountant',
    initials: 'KM',
    credentials: ['CPA'],
    jurisdictions: ['US Federal', 'US State'],
    yearsExperience: 2,
    bio: 'Katie is a US Certified Public Accountant (CPA) who focuses on the US side of cross-border life: federal and state returns for Americans living in the UK and further afield. Her day-to-day work covers FBAR and FATCA reporting, the Foreign Earned Income Exclusion and Foreign Tax Credit, and the practical judgement calls that decide how much US tax an expat actually pays. Katie works mainly with individual US citizens and Green Card holders \u2014 employees, remote workers and families \u2014 who want their US filing done correctly and their double-tax relief claimed in full.',
    expertise: ['US expat returns', 'FBAR & FATCA reporting', 'Foreign Tax Credit', 'Foreign Earned Income Exclusion', 'US state returns'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Briana, CPA',
  },
  {
    slug: 'briana',
    name: 'Briana',
    role: 'Senior US Accountant',
    initials: 'BR',
    credentials: ['CPA'],
    jurisdictions: ['US Federal', 'US State'],
    yearsExperience: 3,
    bio: 'Briana is a Senior US Accountant and CPA who handles the firm\u2019s more complex US filings \u2014 the cases where a straightforward return isn\u2019t enough. She leads on Streamlined Filing catch-up submissions, Form 5471 for US owners of UK companies, GILTI and Subpart F analysis, and the US side of dual-citizen returns where business and personal tax intersect. Briana typically works with founders, company owners and long-term expats who have fallen behind or whose affairs have outgrown a simple 1040, and she is a key reviewer of the US work produced across the team.',
    expertise: ['Streamlined Filing', 'Form 5471', 'GILTI & Subpart F', 'complex US expat returns', 'dual-citizen taxation'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Sam H., ACCA ACA',
  },
  {
    slug: 'sarah-j',
    name: 'Sarah J.',
    role: 'UK Accountant',
    initials: 'SJ',
    credentials: ['ACA'],
    jurisdictions: ['UK', 'HMRC'],
    yearsExperience: 2,
    bio: 'Sarah is a UK Chartered Accountant (ACA) who runs the compliance backbone of the UK practice: statutory company accounts, Self Assessment, VAT returns and payroll. She makes sure the numbers are right and filed on time \u2014 the unglamorous work that a good firm has to get flawlessly correct. Sarah supports UK limited companies, contractors and individuals, including the many who also have US reporting obligations, and works closely with the US team so both sides of a client\u2019s filings line up rather than contradict each other.',
    expertise: ['UK company accounts', 'Self Assessment', 'VAT returns', 'payroll', 'UK compliance'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Kristina, CTA',
  },
  {
    slug: 'kristina',
    name: 'Kristina',
    role: 'UK Tax Accountant',
    initials: 'KR',
    credentials: ['CTA'],
    jurisdictions: ['UK', 'HMRC'],
    yearsExperience: 2,
    bio: 'Kristina is a Chartered Tax Adviser (CTA) \u2014 the UK\u2019s senior tax qualification \u2014 and leads the firm\u2019s UK tax planning and advisory work. She focuses on Corporation Tax, Self Assessment for complex cases, and the residence and domicile questions that decide how much UK tax someone actually owes. Kristina advises company directors, landlords and internationally mobile individuals, and is often the person who works out how a UK position should be framed so that it also holds up against the client\u2019s US filing.',
    expertise: ['Corporation Tax', 'UK tax planning', 'residence & domicile (SRT)', 'landlord & property tax', 'Self Assessment (complex)'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Sarah J., ACA',
  },
  {
    slug: 'shezi-r',
    name: 'Shezi R.',
    role: 'Finance Manager',
    initials: 'SR',
    credentials: ['ACCA', 'CIMA', 'AAT'],
    jurisdictions: ['UK', 'US'],
    yearsExperience: 2,
    bio: 'Shezi is the firm\u2019s Finance Manager, qualified across three bodies (ACCA, CIMA and AAT), and oversees financial operations and client account management for both the US and UK practices. He keeps the firm\u2019s own reporting, billing and bookkeeping oversight running smoothly, and is often a client\u2019s first point of contact for questions about engagements and accounts. Shezi\u2019s combined accounting and management-accounting background means he brings a commercial eye to the way client work is scoped and delivered.',
    expertise: ['practice finance', 'management accounting', 'client account management', 'bookkeeping oversight', 'billing & engagements'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Sam H., ACCA ACA',
  },
  {
    slug: 'nicola-m',
    name: 'Nicola M.',
    role: 'Audit Officer',
    initials: 'NM',
    credentials: ['ACCA'],
    jurisdictions: ['UK', 'US'],
    yearsExperience: 3,
    bio: 'Nicola is an ACCA-qualified accountant responsible for quality assurance and internal review across the firm\u2019s cross-border work. Before a filing leaves the firm, it is checked against professional standards on both the US and UK sides \u2014 and that review process is Nicola\u2019s remit. She focuses on documentation, regulatory compliance and consistency, making sure that the position taken on a client\u2019s US return and their UK return are coherent and defensible. It is the assurance layer that lets the firm stand behind the work it delivers.',
    expertise: ['quality assurance', 'regulatory compliance', 'file & peer review', 'documentation standards', 'cross-border consistency'],
    sameAs: [{ label: 'LinkedIn', href: '#' }],
    reviewedBy: 'Sam H., ACCA ACA',
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
