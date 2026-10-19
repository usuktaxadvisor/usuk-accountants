'use client';

import { useEffect, useState } from 'react';

/**
 * Pause / play control for a drifting image strip. Toggles data-paused on
 * the target element; the CSS does the rest. Hidden when the visitor has
 * asked for reduced motion, because the strip is static for them anyway.
 */
export default function StripControls({ target, dark = true }: { target: string; dark?: boolean }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = document.getElementById(target);
    if (el) el.setAttribute('data-paused', paused ? 'true' : 'false');
  }, [paused, target]);

  if (reduced) return null;

  const cls = dark
    ? 'border-softwhite/25 text-softwhite/80 hover:border-gold-champagne hover:text-gold-champagne'
    : 'border-navy-ink/20 text-muted hover:border-navy-ink hover:text-ink';

  return (
    <button
      type="button"
      onClick={() => setPaused((p) => !p)}
      aria-pressed={paused}
      aria-controls={target}
      className={`inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-md border px-4 text-sm font-medium transition-colors ${cls}`}
    >
      <span aria-hidden className="inline-block w-3 text-center">{paused ? '▶' : '‖'}</span>
      {paused ? 'Play' : 'Pause'}
    </button>
  );
}
