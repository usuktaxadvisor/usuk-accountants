import type { ElementType, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  as?: ElementType;
  id?: string;
}

/**
 * Scroll-reveal wrapper. Server component: it only emits markup and a
 * data attribute. A single client-side observer (RevealObserver, mounted in
 * the root layout) adds `is-visible` when the element scrolls into view.
 * Without JavaScript the content stays visible (see globals.css: the hidden
 * state only applies under `html.js`).
 */
export default function Reveal({ children, className = '', stagger = false, as, id }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const base = stagger ? 'reveal-stagger' : 'reveal';
  return (
    <Tag id={id} data-reveal="" className={`${base} ${className}`}>
      {children}
    </Tag>
  );
}
