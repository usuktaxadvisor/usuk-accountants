/**
 * GLOSSARY — US–UK cross-border tax terms.
 *
 * Each entry is a definitional surface optimised for AI citation and featured
 * snippets: a tight short answer plus a longer explanation. Terms cross-link to
 * the articles and services that cover them in depth, feeding the knowledge graph.
 *
 * RULE: definitions describe stable mechanisms, not figures that move annually.
 */

export interface GlossaryTerm {
  slug: string;
  term: string;
  expansion?: string;
  short: string;
  long: string;
  category: 'US Tax' | 'UK Tax' | 'Cross-Border' | 'Reporting' | 'Entity & Business' | 'Property & Estate';
  related?: { label: string; href: string }[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'fbar',
    term: 'FBAR',
    expansion: 'Report of Foreign Bank and Financial Accounts (FinCEN Form 114)',
    short:
      'The FBAR is an annual US report of foreign financial accounts, required when the combined balance of all your non-US accounts exceeds $10,000 at any point in the year. It is filed with FinCEN, separately from your tax return.',
    long:
      'A US person — citizen, green card holder, or resident — must file an FBAR (FinCEN Form 114) when their foreign accounts together exceed $10,000 at any moment during the calendar year. It is an aggregate test, not per-account, and includes accounts you have signature authority over even if you do not own them. The FBAR is filed electronically with the Financial Crimes Enforcement Network through the BSA E-Filing System, not with the IRS, and is due 15 April with an automatic extension to 15 October.',
    category: 'Reporting',
    related: [
      { label: 'Do I need to file an FBAR?', href: '/resources/blog/do-i-need-to-file-an-fbar' },
      { label: 'FBAR filing service', href: '/services/us-expat-tax/fbar-filing' },
    ],
  },
  {
    slug: 'fatca',
    term: 'FATCA',
    expansion: 'Foreign Account Tax Compliance Act',
    short:
      'FATCA is a US law requiring US taxpayers to report specified foreign financial assets on Form 8938, and requiring foreign financial institutions to report US-held accounts to the IRS. Its individual reporting thresholds are higher than the FBAR threshold.',
    long:
      'FATCA has two arms: individuals report specified foreign financial assets (accounts plus assets like foreign stock and partnership interests) on Form 8938 when they exceed residency-based thresholds, and foreign banks report their US account holders to the IRS. For Americans living abroad the Form 8938 thresholds are much higher than the FBAR threshold of $10,000 — broadly starting at $200,000 for a single filer at year-end. FATCA and FBAR are independent: meeting one does not satisfy the other.',
    category: 'Reporting',
    related: [
      { label: 'FATCA compliance service', href: '/services/us-expat-tax/fatca-compliance' },
      { label: 'Do I need to file an FBAR?', href: '/resources/blog/do-i-need-to-file-an-fbar' },
    ],
  },
  {
    slug: 'form-8938',
    term: 'Form 8938',
    expansion: 'Statement of Specified Foreign Financial Assets',
    short:
      'Form 8938 is the IRS form used to report specified foreign financial assets under FATCA. It is filed with your tax return when your foreign assets exceed thresholds that depend on your filing status and whether you live abroad.',
    long:
      'Form 8938 captures a broader range of assets than the FBAR — not just accounts, but also directly held foreign stock, partnership interests, and similar. For Americans abroad the thresholds are broadly $200,000 (single, year-end) or $300,000 (single, any time), and $400,000 / $600,000 for married couples filing jointly. It is filed with your annual Form 1040, unlike the FBAR which goes to FinCEN. Some assets must be reported on both.',
    category: 'Reporting',
    related: [
      { label: 'FATCA compliance service', href: '/services/us-expat-tax/fatca-compliance' },
    ],
  },
  {
    slug: 'feie',
    term: 'FEIE',
    expansion: 'Foreign Earned Income Exclusion (Form 2555)',
    short:
      'The Foreign Earned Income Exclusion lets qualifying Americans abroad exclude a capped amount of foreign earned income from US tax. It is claimed on Form 2555 and requires meeting either the bona fide residence or physical presence test.',
    long:
      'The FEIE allows US citizens and residents living abroad to exclude foreign earned income (wages and self-employment income, not investment income) up to an annually-adjusted cap. You qualify by meeting either the bona fide residence test or the physical presence test (330 full days abroad in a 12-month period). The FEIE often competes with the Foreign Tax Credit; in a high-tax country like the UK, the Foreign Tax Credit is frequently the better choice, and the two interact in ways that need modelling.',
    category: 'US Tax',
    related: [
      { label: 'FEIE or Foreign Tax Credit?', href: '/resources/blog/feie-or-foreign-tax-credit-uk' },
      { label: 'FEIE service', href: '/services/us-expat-tax/foreign-earned-income-exclusion' },
    ],
  },
  {
    slug: 'foreign-tax-credit',
    term: 'Foreign Tax Credit',
    expansion: 'FTC (Form 1116)',
    short:
      'The Foreign Tax Credit gives US taxpayers a dollar-for-dollar credit against US tax for income tax paid to another country, preventing double taxation. It is claimed on Form 1116 and is often the best relief for Americans in high-tax countries like the UK.',
    long:
      'The FTC credits foreign income tax you have paid against the US tax on the same income, so the same income is not fully taxed twice. For Americans in the UK — where tax rates are often comparable to or higher than US rates — the FTC frequently reduces US tax to little or nothing, and can generate excess credits that carry to other years. It is usually contrasted with the FEIE; the right choice depends on income type, level, and future plans.',
    category: 'US Tax',
    related: [
      { label: 'FEIE or Foreign Tax Credit?', href: '/resources/blog/feie-or-foreign-tax-credit-uk' },
      { label: 'Foreign Tax Credit service', href: '/services/us-expat-tax/foreign-tax-credit' },
    ],
  },
  {
    slug: 'streamlined-filing',
    term: 'Streamlined Filing Compliance Procedures',
    short:
      'The Streamlined Procedures are an IRS amnesty programme letting US taxpayers who failed to file returns or FBARs non-wilfully catch up — typically penalty-free — by filing a limited number of back years and a certification of non-wilful conduct.',
    long:
      'Designed for taxpayers whose failure to file was non-wilful (they simply did not know), the Streamlined Procedures require filing three years of amended/late returns and six years of FBARs, plus a certification explaining the non-wilful conduct. The offshore version (for those living abroad) generally carries no penalties; the domestic version carries a reduced penalty. Coming forward before the IRS makes contact preserves eligibility.',
    category: 'US Tax',
    related: [
      { label: 'Havent filed US taxes living in the UK?', href: '/resources/blog/havent-filed-us-taxes-living-in-uk' },
      { label: 'Streamlined Filing service', href: '/services/us-expat-tax/streamlined-filing' },
    ],
  },
  {
    slug: 'gilti',
    term: 'GILTI',
    expansion: 'Global Intangible Low-Taxed Income',
    short:
      'GILTI is a US anti-deferral rule that can tax a US owner currently on the profits of a controlled foreign corporation, rather than only when distributed. It commonly affects Americans who own UK limited companies.',
    long:
      'GILTI was introduced to discourage shifting profit into low-taxed foreign companies. For a US citizen owning a UK limited company (a controlled foreign corporation), it can mean US tax on the company profits even if nothing is paid out. Elections such as Section 962 and high-tax exclusions can mitigate it. Note that under recent US legislation the GILTI regime is being renamed and revised (to NCTI) for tax years beginning after 31 December 2025 — the mechanism persists under the new label.',
    category: 'Entity & Business',
    related: [
      { label: 'GILTI / NCTI for Americans with UK companies', href: '/resources/blog/gilti-ncti-rules-americans-uk-companies' },
      { label: 'Section 962 election explained', href: '/resources/blog/section-962-election-explained' },
    ],
  },
  {
    slug: 'ncti',
    term: 'NCTI',
    expansion: 'Net CFC Tested Income',
    short:
      'NCTI is the renamed and revised successor to GILTI for US tax years beginning after 31 December 2025. It continues to tax US owners on a controlled foreign corporation income, with adjusted mechanics.',
    long:
      'Under the One Big Beautiful Bill Act, the GILTI regime is being relabelled as Net CFC Tested Income (NCTI) and revised for tax years beginning after 31 December 2025. The core idea — current US taxation of a controlled foreign corporation tested income — survives, but some of the calculation changes. Americans with UK companies should plan on current-year inclusion continuing under the new name.',
    category: 'Entity & Business',
    related: [
      { label: 'GILTI / NCTI for Americans with UK companies', href: '/resources/blog/gilti-ncti-rules-americans-uk-companies' },
    ],
  },
  {
    slug: 'cfc',
    term: 'CFC',
    expansion: 'Controlled Foreign Corporation',
    short:
      'A CFC is a foreign company more than 50% owned by US persons. US owners of a CFC face anti-deferral rules (like GILTI/NCTI and Subpart F) and information reporting on Form 5471. A US-owned UK limited company is usually a CFC.',
    long:
      'When US persons own more than half of a foreign corporation, it is a controlled foreign corporation, and the US applies anti-deferral rules so its owners can be taxed currently on certain income rather than only on distribution. For an American running a UK limited company, CFC status typically brings Form 5471 filing and GILTI/NCTI exposure, which is why incorporation decisions must be modelled across both tax systems.',
    category: 'Entity & Business',
    related: [
      { label: 'Running a UK limited company as a US citizen', href: '/resources/blog/running-a-uk-limited-company-as-a-us-citizen' },
      { label: 'Form 5471 explained', href: '/resources/blog/form-5471-explained-americans-uk' },
    ],
  },
  {
    slug: 'form-5471',
    term: 'Form 5471',
    expansion: 'Information Return of US Persons With Respect to Certain Foreign Corporations',
    short:
      'Form 5471 is an IRS information return that US owners, officers, or directors of certain foreign corporations must file. Failure to file carries a penalty starting at $10,000 per form per year.',
    long:
      'Form 5471 reports a US person interest in a foreign corporation, including a US-owned UK limited company. It is detailed, with several schedules depending on the filer category, and its non-filing penalty starts at $10,000 per form per year — among the steepest information-return penalties. It is informational, but it carries the GILTI/NCTI and Subpart F calculations that can create actual tax.',
    category: 'Entity & Business',
    related: [
      { label: 'Form 5471 explained', href: '/resources/blog/form-5471-explained-americans-uk' },
      { label: 'Form 5471 service', href: '/services/us-expat-tax/form-5471' },
    ],
  },
  {
    slug: 'check-the-box',
    term: 'Check-the-Box Election',
    expansion: 'Entity Classification Election (Form 8832)',
    short:
      'The check-the-box election lets the owner of an eligible foreign entity choose how it is treated for US tax — as a corporation or as a disregarded/pass-through entity. It can simplify or worsen a US owner position depending on the facts.',
    long:
      'By filing Form 8832, an eligible entity such as a UK limited company can elect to be disregarded for US purposes, so its income flows directly onto the owner return rather than being taxed under the corporate/CFC rules. This can avoid GILTI complexity but creates other consequences — self-employment tax exposure, a deemed liquidation on election, and a 60-month lock-in. It is a powerful but double-edged tool that should be modelled before filing.',
    category: 'Entity & Business',
    related: [
      { label: 'Check-the-box election for a UK company', href: '/resources/blog/check-the-box-election-uk-limited-company' },
    ],
  },
  {
    slug: 'section-962-election',
    term: 'Section 962 Election',
    short:
      'A Section 962 election lets an individual US shareholder of a controlled foreign corporation be taxed on GILTI/Subpart F income at corporate rates, and claim a credit for foreign corporate tax — often reducing the US tax on a UK company profits.',
    long:
      'Individuals are not normally entitled to the corporate-level foreign tax credit on a CFC income, which can make GILTI expensive. A Section 962 election lets the individual be taxed as if a corporation for that income, accessing the lower corporate rate and a deemed-paid foreign tax credit for the UK corporation tax already paid. It often reduces or eliminates the US GILTI charge for Americans with profitable UK companies, but adds complexity and a second layer of tax on later distributions.',
    category: 'Entity & Business',
    related: [
      { label: 'Section 962 election explained', href: '/resources/blog/section-962-election-explained' },
    ],
  },
  {
    slug: 'pfic',
    term: 'PFIC',
    expansion: 'Passive Foreign Investment Company',
    short:
      'A PFIC is a foreign pooled investment — most non-US mutual funds, ETFs, and many investment-style accounts. US owners face punitive tax and complex Form 8621 reporting, which is why non-US funds (including many held in ISAs) are problematic for Americans.',
    long:
      'The PFIC rules impose a harsh default tax regime (with interest charges) and onerous Form 8621 reporting on US owners of foreign pooled investments. Because most UK funds, investment trusts, and fund-based ISAs are PFICs, Americans in the UK are frequently caught — a UK-tax-efficient ISA can be a US tax problem. Elections (QEF or mark-to-market) can soften the treatment but require information UK funds rarely provide.',
    category: 'US Tax',
    related: [
      { label: 'Why is my ISA a problem for US taxes?', href: '/resources/blog/why-is-my-isa-a-problem-for-us-taxes' },
    ],
  },
  {
    slug: 'totalization-agreement',
    term: 'Totalization Agreement',
    short:
      'The US–UK Totalization Agreement prevents you paying social security taxes to both countries on the same earnings. It assigns your social security liability to one country, generally based on where you work, evidenced by a certificate of coverage.',
    long:
      'Without coordination, a cross-border worker could owe US Social Security/Medicare and UK National Insurance on the same income. The Totalization Agreement assigns coverage to one system — generally the country where you physically work, with exceptions for detached/posted workers — and a certificate of coverage proves which applies. For the self-employed, liability usually follows the country of residence, so a US citizen self-employed in the UK typically pays UK National Insurance, not US self-employment tax.',
    category: 'Cross-Border',
    related: [
      { label: 'Self-employed in the UK: US tax obligations', href: '/resources/blog/self-employed-in-uk-us-tax-obligations' },
    ],
  },
  {
    slug: 'us-uk-tax-treaty',
    term: 'US–UK Income Tax Treaty',
    short:
      'The US–UK income tax treaty allocates taxing rights over cross-border income (wages, pensions, dividends, business profits) between the two countries and provides mechanisms to relieve double taxation. It is separate from the estate and gift tax treaty.',
    long:
      'The income tax treaty sets rules for which country taxes particular income first and how relief is given, covering pensions, dividends, interest, royalties, employment, and business profits. For US citizens, the treaty saving clause preserves the US right to tax its citizens on worldwide income, which limits some treaty benefits and is why claims often require Form 8833. A separate 1980 treaty governs estate and gift tax.',
    category: 'Cross-Border',
    related: [
      { label: 'US–UK tax treaty service', href: '/services/us-expat-tax/us-uk-tax-treaty' },
      { label: 'Do I pay US tax on my UK pension?', href: '/resources/blog/do-i-pay-us-tax-on-my-uk-pension' },
    ],
  },
  {
    slug: 'saving-clause',
    term: 'Saving Clause',
    short:
      'The saving clause in the US–UK tax treaty preserves the US right to tax its citizens and residents as if much of the treaty did not exist. It is why being American limits many treaty benefits that would otherwise reduce US tax.',
    long:
      'Most US tax treaties contain a saving clause stating the US may tax its citizens and residents on worldwide income regardless of the treaty, subject to specific exceptions. In practice this means a US citizen in the UK often cannot use treaty provisions to escape US tax on items the treaty would otherwise assign to the UK — the citizenship-based US tax system reaches through. Exceptions exist, and claiming them typically requires disclosure on Form 8833.',
    category: 'Cross-Border',
    related: [
      { label: 'Is the 25% UK lump sum taxable in the US?', href: '/resources/blog/is-the-25-percent-uk-lump-sum-taxable-in-the-us' },
    ],
  },
  {
    slug: 'form-8833',
    term: 'Form 8833',
    expansion: 'Treaty-Based Return Position Disclosure',
    short:
      'Form 8833 discloses to the IRS that you are taking a tax position based on a treaty. It is required for certain treaty claims, and failing to file it when required can carry a $1,000 penalty for individuals.',
    long:
      'When a taxpayer relies on a treaty to reduce or modify their US tax in specified situations, the position must be disclosed on Form 8833. Not every treaty benefit requires it, but where it does and the form is omitted, a penalty (generally $1,000 for individuals) can apply. Because the saving clause complicates US-citizen treaty claims, Form 8833 frequently appears in cross-border returns taking less-conservative positions.',
    category: 'Cross-Border',
    related: [
      { label: 'Is the 25% UK lump sum taxable in the US?', href: '/resources/blog/is-the-25-percent-uk-lump-sum-taxable-in-the-us' },
    ],
  },
  {
    slug: 'section-121-exclusion',
    term: 'Section 121 Exclusion',
    expansion: 'Main Home Sale Exclusion',
    short:
      'Section 121 lets a US taxpayer exclude up to $250,000 of gain ($500,000 for a married couple) on the sale of a main home. It applies to a foreign home but is capped — unlike UK Private Residence Relief, which can be unlimited.',
    long:
      'The Section 121 exclusion shelters gain on the sale of a main residence if you owned and used it as your main home for at least two of the five years before sale. It applies to a US citizen UK home, but the cap ($250,000 single / $500,000 married) means a large gain the UK exempts fully under Private Residence Relief can still be partly US-taxable — and if no UK tax was due, there may be no foreign tax credit to offset it.',
    category: 'Property & Estate',
    related: [
      { label: 'Selling a UK home as a US citizen', href: '/resources/blog/selling-uk-home-as-us-citizen' },
    ],
  },
  {
    slug: 'private-residence-relief',
    term: 'Private Residence Relief',
    expansion: 'PRR',
    short:
      'Private Residence Relief is a UK relief that can exempt the entire gain on your main home from UK Capital Gains Tax, with no monetary cap. Its US counterpart, the Section 121 exclusion, is capped — creating a common cross-border mismatch.',
    long:
      'PRR removes UK Capital Gains Tax on the gain from a property that has been your only or main residence throughout ownership, often exempting the whole gain. Because there is no cap, a UK main-home sale can be entirely UK-tax-free. For an American, the US Section 121 exclusion is capped, so the same sale can produce US tax above the cap with no UK tax to credit — the single most common UK-property surprise for US citizens.',
    category: 'Property & Estate',
    related: [
      { label: 'Selling a UK home as a US citizen', href: '/resources/blog/selling-uk-home-as-us-citizen' },
      { label: 'UK CGT vs US capital gains tax', href: '/resources/blog/uk-cgt-vs-us-capital-gains-tax-property' },
    ],
  },
  {
    slug: 'section-988',
    term: 'Section 988 Currency Gain',
    short:
      'Section 988 can tax the foreign-exchange gain when you repay or refinance a non-dollar mortgage. If the dollar strengthened since you borrowed, repaying a sterling mortgage can create a US-taxable gain as ordinary income — with no UK equivalent.',
    long:
      'Under Section 988, a foreign-currency mortgage is treated as a dollar liability fixed when taken out. If the dollar strengthens against the pound, you settle that dollar debt for fewer dollars and the IRS taxes the difference as ordinary income — even on a home sale otherwise covered by Section 121, and even on a simple remortgage. A currency loss on a personal-residence mortgage is generally non-deductible, making the rule one-directional against the taxpayer.',
    category: 'Property & Estate',
    related: [
      { label: 'The Section 988 mortgage currency-gain trap', href: '/resources/blog/section-988-mortgage-currency-gain' },
    ],
  },
  {
    slug: 'depreciation-recapture',
    term: 'Depreciation Recapture',
    short:
      'Depreciation recapture is US tax on the depreciation previously claimed (or claimable) on a rental property, charged at up to 25% when you sell. It applies even if the Section 121 exclusion shelters the rest of the gain.',
    long:
      'US rules require residential rental property to be depreciated, reducing taxable rental income each year. On sale, that depreciation is recaptured and taxed at up to 25%, separately from other relief. Because US rules treat depreciation as taken whether or not it was claimed, a landlord who never knowingly depreciated can still face recapture — getting neither the yearly deduction nor an escape from the charge.',
    category: 'Property & Estate',
    related: [
      { label: 'US tax on UK rental income', href: '/resources/blog/us-tax-on-uk-rental-income' },
    ],
  },
  {
    slug: 'long-term-resident-iht',
    term: 'Long-Term Resident (UK IHT)',
    short:
      'From 6 April 2025 the UK bases inheritance tax on long-term residence rather than domicile. Someone UK-resident for 10 of the previous 20 years is a long-term resident, exposed to UK inheritance tax on worldwide assets, with a 3–10 year tail after leaving.',
    long:
      'The UK replaced the domicile-based inheritance tax system with a residence-based one on 6 April 2025. A long-term resident — broadly UK-resident for 10 of the last 20 tax years — is within UK inheritance tax on worldwide assets, and a tail of between 3 and 10 years can keep that exposure running after departure. UK real estate remains within UK inheritance tax regardless of residence. The change significantly widened exposure for long-staying Americans.',
    category: 'Property & Estate',
    related: [
      { label: 'UK inheritance tax vs US estate tax', href: '/resources/blog/uk-inheritance-tax-vs-us-estate-tax' },
    ],
  },
  {
    slug: 'us-uk-estate-gift-tax-treaty',
    term: 'US–UK Estate and Gift Tax Treaty',
    short:
      'A separate 1980 treaty (distinct from the income tax treaty) that allocates estate, gift, and inheritance tax rights between the US and UK using treaty-domicile tie-breakers. It survived the UK 2025 inheritance tax reforms.',
    long:
      'This treaty governs death and gift taxes, not income. It uses a treaty-specific concept of domicile to assign primary taxing rights and provide credits, preventing the same estate being fully taxed by both countries. For a US citizen who is not also a UK national, it can limit UK exposure and even shorten the post-2025 departure tail, though UK real estate generally stays within UK inheritance tax.',
    category: 'Property & Estate',
    related: [
      { label: 'The US–UK estate and gift tax treaty', href: '/resources/blog/us-uk-estate-gift-tax-treaty' },
    ],
  },
  {
    slug: 'domicile',
    term: 'Domicile',
    short:
      'Domicile is a general-law concept of your permanent home, historically central to UK tax. The UK moved inheritance tax off domicile to a residence test from 6 April 2025, though domicile still matters for the US–UK estate and gift tax treaty.',
    long:
      'Distinct from residence or nationality, domicile broadly reflects the country you regard as your permanent home. It long determined UK inheritance tax and the old non-dom income tax regime, both of which the UK reformed in 2025 in favour of residence-based tests. Domicile remains relevant for the US–UK estate and gift tax treaty, which uses its own treaty-domicile tie-breakers.',
    category: 'UK Tax',
    related: [
      { label: 'UK inheritance tax vs US estate tax', href: '/resources/blog/uk-inheritance-tax-vs-us-estate-tax' },
    ],
  },
  {
    slug: 'statutory-residence-test',
    term: 'Statutory Residence Test',
    expansion: 'SRT',
    short:
      'The Statutory Residence Test is the UK set of rules for deciding whether you are UK tax resident in a given tax year, based on days spent in the UK and connecting factors like work, home, and family ties.',
    long:
      'The SRT determines UK residence through automatic overseas tests, automatic UK tests, and a sufficient-ties test that weighs day-count against connections to the UK. Residence drives UK income tax, capital gains tax, and — since April 2025 — the inheritance tax long-term-resident clock. Because the outcome turns on precise day-counting and ties, it is easy to get wrong without care.',
    category: 'UK Tax',
    related: [
      { label: 'UK residence test calculator', href: '/resources/calculators/srt-residence' },
    ],
  },
  {
    slug: 'self-assessment',
    term: 'Self Assessment',
    short:
      'Self Assessment is the UK system for reporting income not taxed at source — including self-employment, rental, and foreign income — by filing an annual tax return with HMRC. The online deadline is 31 January following the tax year.',
    long:
      'UK taxpayers with income outside PAYE — the self-employed, landlords, higher earners, and those with foreign or investment income — report it through Self Assessment. The UK tax year runs 6 April to 5 April, and the online return and payment are due by the following 31 January. Americans in the UK often file both Self Assessment and a US return, coordinating the two via foreign tax credits.',
    category: 'UK Tax',
    related: [
      { label: 'Self Assessment service', href: '/services/uk-accounting/self-assessment' },
    ],
  },
  {
    slug: 'national-insurance',
    term: 'National Insurance',
    expansion: 'NI',
    short:
      'National Insurance is the UK social security contribution system, funding the state pension and certain benefits. For cross-border workers, the US–UK Totalization Agreement decides whether NI or US Social Security applies.',
    long:
      'NI is paid by employees, employers, and the self-employed to build entitlement to the UK state pension and some benefits. For someone working across both countries, the Totalization Agreement prevents double social-security charges by assigning liability to one system. A US citizen self-employed in the UK generally pays UK NI rather than US self-employment tax, evidenced by a certificate of coverage. (Class 2 self-employed NI was abolished from April 2024.)',
    category: 'UK Tax',
    related: [
      { label: 'Self-employed in the UK: US tax obligations', href: '/resources/blog/self-employed-in-uk-us-tax-obligations' },
    ],
  },
  {
    slug: 'corporation-tax',
    term: 'Corporation Tax',
    short:
      'UK Corporation Tax is the tax a UK limited company pays on its profits. For an American owner, the company profits may also be exposed to US tax under the CFC/GILTI rules, with the UK tax available as a credit.',
    long:
      'A UK limited company pays Corporation Tax on its trading profits, chargeable gains, and investment income. For a US-citizen owner, the same company is usually a controlled foreign corporation, so its profits can also trigger US tax under GILTI/NCTI — with the UK Corporation Tax generally creditable (especially via a Section 962 election). Coordinating the two regimes is essential to avoid surprise US tax on UK-retained profit.',
    category: 'Entity & Business',
    related: [
      { label: 'How UK corporation tax and US tax interact', href: '/resources/blog/uk-corporation-tax-and-us-tax-interact' },
      { label: 'Corporation Tax service', href: '/services/uk-accounting/corporation-tax' },
    ],
  },
  {
    slug: 'vat',
    term: 'VAT',
    expansion: 'Value Added Tax',
    short:
      'VAT is a UK consumption tax charged on most goods and services. Businesses must register once taxable turnover crosses the current registration threshold, then charge VAT and file periodic returns with HMRC.',
    long:
      'VAT is added at each stage of supply, with registered businesses collecting it on sales and reclaiming it on purchases. Registration becomes mandatory once taxable turnover exceeds the current threshold, though voluntary registration is possible. VAT is a UK matter with no US equivalent, but it is a core compliance obligation for cross-border businesses trading in the UK.',
    category: 'UK Tax',
    related: [
      { label: 'VAT returns service', href: '/services/uk-accounting/vat-returns' },
    ],
  },
  {
    slug: 'green-card-holder',
    term: 'Green Card Holder',
    short:
      'A US lawful permanent resident (green card holder) is taxed by the US on worldwide income just like a citizen, even while living in the UK — and keeps US filing and FBAR/FATCA obligations until the green card is properly relinquished.',
    long:
      'Holding a green card makes you a US tax resident regardless of where you live, with the same worldwide-income filing and foreign-account reporting duties as a citizen. Many green card holders living abroad wrongly assume the card immigration lapse ends US tax — it does not; the tax status continues until formally abandoned, which itself can trigger exit-tax considerations. The treaty tie-breaker can sometimes help, but with disclosure consequences.',
    category: 'US Tax',
    related: [
      { label: 'Who we help: US citizens in the UK', href: '/who-we-help/us-citizens-in-uk' },
    ],
  },
  {
    slug: 'accidental-american',
    term: 'Accidental American',
    short:
      'An accidental American is someone who is a US citizen — usually by birth in the US or to US-citizen parents — but has lived their life elsewhere and may be unaware of US tax and reporting obligations that nonetheless apply to them.',
    long:
      'Because the US taxes by citizenship, people who acquired US citizenship at birth but never really lived there still owe US tax filing and FBAR/FATCA reporting. Many discover this only when a foreign bank asks for US tax information under FATCA. Routes back into compliance (such as the Streamlined Procedures) and, for some, renunciation with its exit-tax rules, are the typical paths considered.',
    category: 'US Tax',
    related: [
      { label: 'Havent filed US taxes living in the UK?', href: '/resources/blog/havent-filed-us-taxes-living-in-uk' },
    ],
  },
  {
    slug: 'subpart-f',
    term: 'Subpart F Income',
    short:
      'Subpart F is an older US anti-deferral regime that taxes US owners currently on certain passive or mobile income of a controlled foreign corporation, regardless of distribution. It operates alongside GILTI/NCTI.',
    long:
      'Subpart F targets specific categories — mainly passive income (dividends, interest, rents, royalties) and certain related-party sales/services income — earned inside a CFC, taxing the US owner immediately. It predates GILTI and still applies; together they form the US framework for taxing a US-owned UK company profits before they are paid out.',
    category: 'Entity & Business',
    related: [
      { label: 'Do US citizens report a UK limited company?', href: '/resources/blog/do-us-citizens-report-uk-limited-company' },
    ],
  },
  {
    slug: 'form-3520',
    term: 'Form 3520',
    expansion: 'Annual Return To Report Transactions With Foreign Trusts and Receipt of Certain Foreign Gifts',
    short:
      'Form 3520 reports transactions with foreign trusts and large foreign gifts or inheritances to the IRS. Some UK arrangements, including certain pensions and trusts, can trigger it, and penalties for missing it are severe.',
    long:
      'Form 3520 (with its companion 3520-A) reports a US person dealings with foreign trusts and the receipt of substantial foreign gifts or bequests. Certain UK structures — some pensions, family trusts, and large inheritances from non-US relatives — can require it. Penalties are notably harsh (often a percentage of the amount involved), so identifying a filing obligation early matters.',
    category: 'Reporting',
    related: [
      { label: 'Do I pay US tax on my UK pension?', href: '/resources/blog/do-i-pay-us-tax-on-my-uk-pension' },
    ],
  },
  {
    slug: 'exit-tax',
    term: 'Exit Tax',
    expansion: 'Expatriation Tax',
    short:
      'The US exit tax can apply when a long-term green card holder or citizen gives up that status and meets certain wealth or income thresholds. It treats worldwide assets as sold at fair market value on the day before expatriation.',
    long:
      'When a covered expatriate — broadly someone above set net-worth or tax-liability thresholds, or not certifying tax compliance — renounces citizenship or abandons a long-held green card, the US can impose a mark-to-market exit tax, deeming their worldwide assets sold the day before exit. It is a significant consideration for anyone weighing renunciation, and careful planning can affect whether and how it applies.',
    category: 'US Tax',
    related: [
      { label: 'Who we help: dual citizens', href: '/who-we-help/dual-citizens' },
    ],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
  return glossaryTerms.map((t) => t.slug);
}

export function glossaryByCategory(): [string, GlossaryTerm[]][] {
  const order = ['US Tax', 'UK Tax', 'Cross-Border', 'Reporting', 'Entity & Business', 'Property & Estate'];
  const groups = new Map<string, GlossaryTerm[]>();
  for (const t of glossaryTerms) {
    if (!groups.has(t.category)) groups.set(t.category, []);
    groups.get(t.category)!.push(t);
  }
  for (const list of groups.values()) list.sort((a, b) => a.term.localeCompare(b.term));
  return [...groups.entries()].sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
}
