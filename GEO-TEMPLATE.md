# GEO-Ready Page Template (PageShell)

Every content page is built by wrapping its body in `<PageShell>`. This makes the AI-search contract automatic — no page can forget a schema requirement.

## What every PageShell page emits (the 7 requirements)

1. **Organization** schema — sitewide, all 3 offices, knowsAbout, aggregateRating
2. **WebSite** schema — with SearchAction, publisher → Organization @id
3. **BreadcrumbList** schema + a visible breadcrumb nav (they match)
4. **Author entity** — a real team Person (worksFor → Organization @id)
5. **Reviewed-by entity** — a second real team Person (Article reviewedBy)
6. **FAQPage** schema — from the page's `faqs` (also rendered visibly)
7. **Speakable** schema — marks the `.speakable` answer-first lead for AI/voice

Plus **Article** schema linking authorship + review, optional **Service** schema, internal entity links (breadcrumb, byline → team profiles), and a closing booking CTA.

## Usage

```tsx
import { PageShell } from '@/components/library';
import { authors } from '@/lib/authority-data';

export default function FbarPage() {
  const author = authors.find(a => a.slug === 'katie-m')!;
  const reviewedBy = authors.find(a => a.slug === 'briana')!;

  return (
    <PageShell
      url="https://www.usukaccountants.com/services/us-expat-tax/fbar-filing"
      eyebrow="US Expat Tax"
      title="FBAR Filing for Americans in the UK"
      answer="An FBAR (FinCEN Form 114) reports foreign bank accounts when your combined balances exceed $10,000 at any point in the year. Americans in the UK must file it annually, separately from their tax return, or face significant penalties. We handle current and back-filing."
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'US Expat Tax', href: '/services/us-expat-tax' },
        { label: 'FBAR Filing', href: '/services/us-expat-tax/fbar-filing' },
      ]}
      author={author}
      reviewedBy={reviewedBy}
      datePublished="2026-01-15"
      faqs={[
        { question: 'What is the FBAR threshold?', answer: '...' },
        { question: 'What are the penalties for not filing?', answer: '...' },
      ]}
      service={{
        name: 'FBAR Filing',
        description: 'FBAR / FinCEN 114 preparation for US persons abroad.',
        url: 'https://www.usukaccountants.com/services/us-expat-tax/fbar-filing',
      }}
    >
      {/* page body */}
    </PageShell>
  );
}
```

## The answer-first rule (critical for AI extraction)

The `answer` prop must be a **40–60 word direct answer** to the page's core question, written so an AI engine or voice assistant can quote it standalone. It renders in the `.speakable` block at the top. Lead with the answer, not a preamble — Perplexity / AI Overviews extract the first direct, self-contained answer they find.

## Author ↔ reviewer pairing (current)

Authored by → reviewed by (from `authority-data.ts`):
- Sam H. (Founder) → Nicola M. (Audit)
- Katie M. (US) → Briana (Senior US)
- Briana (Senior US) → Sam H.
- Sarah J. (UK) → Kristina (UK Tax)
- Kristina (UK Tax) → Sarah J.

Pick the author whose expertise matches the page topic. The reviewer should be a different, qualified person.

## BEFORE LAUNCH — blockers in this layer

- **Credentials are placeholders** (`"Credentials to be verified"`). Real ACCA/AICPA/IRS EA/ATT/CTA numbers must replace these before publishing — Person `hasCredential` on a YMYL page must be true.
- **`sameAs` is empty** until LinkedIn/GBP/Trustpilot URLs exist (schema filters out `#` placeholders, so it's honest now — just thin). These URLs are what let AI engines corroborate the entity.
- **`datePublished`/`dateModified`** should reflect real authored/review dates.
