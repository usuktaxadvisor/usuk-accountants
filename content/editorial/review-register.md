# Editorial Review Register — US UK Accountants

This register tracks the editorial sign-off status of every published article. It is the
single source of truth for which articles have been reviewed for tax accuracy and E-E-A-T
compliance by a named, qualified member of the team.

**Status values:** `DRAFTED` (AI-drafted, not yet human-reviewed) · `IN_REVIEW` (reviewer
actively checking) · `SIGNED_OFF` (reviewer has confirmed accuracy and recorded their name +
date) · `NEEDS_REVISION` (reviewer flagged issues to fix).

> IMPORTANT: An article's schema asserts `reviewedBy` a named person. That assertion should be
> treated as a *commitment to review*, not proof it happened. Move an article to `SIGNED_OFF`
> only after the named reviewer has genuinely read it and confirmed the tax statements. Do not
> fabricate sign-off.

## Recommended review order

Review in order of **risk × traffic**: the most technically contested and most-linked articles
first, because an error there propagates furthest and is most likely to be cited by AI engines.

### Priority 1 — contested / high-propagation (review first)
| Article | Assigned reviewer | Status |
|---|---|---|
| is-the-25-percent-uk-lump-sum-taxable-in-the-us | Katie M. | DRAFTED |
| gilti-ncti-rules-americans-uk-companies | Katie M. | DRAFTED |
| section-962-election-explained | Katie M. | DRAFTED |
| check-the-box-election-uk-limited-company | Briana | DRAFTED |
| uk-inheritance-tax-vs-us-estate-tax | Katie M. | DRAFTED |
| us-uk-estate-gift-tax-treaty | Katie M. | DRAFTED |
| section-988-mortgage-currency-gain | Briana | DRAFTED |

### Priority 2 — core technical (review second)
| Article | Assigned reviewer | Status |
|---|---|---|
| form-5471-explained-americans-uk | Briana | DRAFTED |
| do-us-citizens-report-uk-limited-company | Katie M. | DRAFTED |
| uk-corporation-tax-and-us-tax-interact | Kristina | DRAFTED |
| selling-uk-home-as-us-citizen | Briana | DRAFTED |
| uk-cgt-vs-us-capital-gains-tax-property | Kristina | DRAFTED |
| us-tax-on-uk-rental-income | Sarah J. | DRAFTED |
| self-employed-in-uk-us-tax-obligations | Kristina | DRAFTED |
| do-i-pay-us-tax-on-my-uk-pension | Katie M. | DRAFTED |

### Priority 3 — orientation / overview (review third)
| Article | Assigned reviewer | Status |
|---|---|---|
| sole-trader-or-limited-company-american-in-uk | Kristina | DRAFTED |
| running-a-uk-limited-company-as-a-us-citizen | Briana | DRAFTED |
| uk-property-and-us-tax-guide | Kristina | DRAFTED |
| buying-property-uk-as-us-citizen | Sarah J. | DRAFTED |
| holding-uk-property-through-a-company | Kristina | DRAFTED |
| freelancer-contractor-uk-us-tax-forms | Briana | DRAFTED |
| why-is-my-isa-a-problem-for-us-taxes | Briana | DRAFTED |
| feie-or-foreign-tax-credit-uk | Briana | DRAFTED |
| havent-filed-us-taxes-living-in-uk | Katie M. | DRAFTED |
| do-i-need-to-file-an-fbar | Katie M. | DRAFTED |

## How to record a sign-off

When a reviewer completes an article, update its row to `SIGNED_OFF` and append a line to
`content/editorial/signoff-log.md` with: DATE | article-slug | Reviewer Name | SIGNED_OFF | brief accuracy note.

The reviewer's name and date in that log is the auditable record. The website's `reviewedBy`
schema should only be considered substantiated once the matching log entry exists.
