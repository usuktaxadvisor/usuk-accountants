'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  as?: ElementType;
  id?: string;
}

export default function Reveal({
  children,
  className = '',
  stagger = false,
  as,
  id,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const base = stagger ? 'reveal-stagger' : 'reveal';

  return (
    <Tag
      ref={setRef}
      id={id}
      className={`${base} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
