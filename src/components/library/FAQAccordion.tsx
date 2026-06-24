'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/types';

interface FAQAccordionProps {
  items: FaqItem[];
  /** Emit FAQPage JSON-LD. Set false if the page already emits it elsewhere to avoid duplicates. */
  emitSchema?: boolean;
  defaultOpen?: number | null;
}

export function FAQAccordion({
  items,
  emitSchema = true,
  defaultOpen = 0,
}: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      {emitSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <div className="divide-y divide-mist overflow-hidden rounded-2xl border border-mist bg-white">
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="font-display text-lg font-semibold text-ink">{f.q}</span>
                <span
                  className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                  aria-hidden
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                className="grid px-6 transition-all duration-300 ease-premium"
                style={{
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  opacity: isOpen ? 1 : 0,
                  paddingBottom: isOpen ? '1.25rem' : 0,
                }}
              >
                <div className="overflow-hidden">
                  <p className="text-[15px] leading-relaxed text-muted">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
