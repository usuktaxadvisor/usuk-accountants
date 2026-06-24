import type { ReactNode } from 'react';
import type { PolicySection } from '@/lib/types';
import { Container, Eyebrow } from '@/components/library/primitives';

/**
 * Reusable layout for all legal / policy / trust pages.
 * Renders a navy header band + readable prose column + optional intro/children.
 */
export function PolicyPage({
  eyebrow = 'Trust & transparency',
  title,
  lastUpdated,
  intro,
  sections,
  children,
}: {
  eyebrow?: string;
  title: string;
  lastUpdated?: string;
  intro?: string;
  sections?: PolicySection[];
  children?: ReactNode;
}) {
  return (
    <>
      <header className="bg-navy-ink py-16 md:py-20">
        <Container>
          <div className="max-w-prose">
            <Eyebrow tone="gold-light">{eyebrow}</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            {lastUpdated && (
              <p className="mt-4 text-sm text-softwhite/60">Last reviewed: {lastUpdated}</p>
            )}
            {intro && <p className="mt-5 text-lg leading-relaxed text-softwhite/85">{intro}</p>}
          </div>
        </Container>
      </header>

      <div className="bg-white py-16 md:py-20">
        <Container>
          <div className="max-w-prose">
            {children}
            {sections?.map((s) => (
              <section key={s.heading} className="mb-10 last:mb-0">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 text-[15px] leading-relaxed text-muted">{p}</p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
