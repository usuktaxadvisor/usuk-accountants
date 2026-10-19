'use client';

import { useEffect } from 'react';

/**
 * Restrained parallax for decorative layers only. Each `[data-parallax]`
 * element gets a CSS variable --py set to a small vertical offset
 * (default strength 0.12, clamped to ±28px) based on how far its parent
 * has scrolled through the viewport. Content is never moved, only art.
 *
 * Off entirely under prefers-reduced-motion, on coarse-pointer phones
 * (saves battery and keeps text steady), and when IntersectionObserver
 * is unavailable. Mounted once in the root layout.
 */
export default function ParallaxObserver() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phone = window.matchMedia('(max-width: 767px)').matches;
    const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    if (reduced || phone || layers.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const active = new Set<HTMLElement>();
    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      active.forEach((el) => {
        const host = el.parentElement ?? el;
        const r = host.getBoundingClientRect();
        // progress: 0 when the host's top enters at the bottom, 1 when its bottom leaves at the top
        const progress = (vh - r.top) / (vh + r.height);
        const strength = Number(el.dataset.parallax || '0.12');
        const raw = (progress - 0.5) * r.height * strength;
        const py = Math.max(-28, Math.min(28, raw));
        el.style.setProperty('--py', `${py.toFixed(1)}px`);
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) active.add(el);
        else active.delete(el);
      });
      onScroll();
    }, { rootMargin: '10% 0px' });

    layers.forEach((el) => io.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return null;
}
