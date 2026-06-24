'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import MegaMenu from '@/components/library/MegaMenu';
import { IconPhone } from '@/components/ui/icons';
import {
  primaryNav, megaMenuPanels, megaMenuFeature, PHONE_UK, PHONE_US,
} from '@/lib/site-data';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <div className="hidden bg-navy-ink text-softwhite md:block">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE_UK.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-gold">
              <span aria-hidden>🇬🇧</span> {PHONE_UK}
            </a>
            <a href={`tel:${PHONE_US.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-gold">
              <span aria-hidden>🇺🇸</span> {PHONE_US}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gold">US &amp; UK cross-border specialists · London &amp; New York offices</span>
            <Link href="/contact" className="transition-colors hover:text-gold">Client Login</Link>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? 'border-mist bg-white/95 shadow-e1 backdrop-blur-md' : 'border-transparent bg-white'
        }`}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
          <Link href="/" aria-label="US UK Accountants home">
            <Logo variant="light" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {primaryNav.map((item) => {
              const hasMega = item.label === 'Services';
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-gold-antique"
                  onMouseEnter={() => setMenuOpen(hasMega)}
                  onFocus={() => setMenuOpen(hasMega)}
                  aria-expanded={hasMega ? menuOpen : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-gold-antique md:inline-flex"
            >
              <IconPhone className="h-4 w-4 text-gold" /> Call
            </Link>
            <Link
              href="/book"
              className="hidden rounded-lg bg-gradient-to-r from-gold to-gold-champagne px-5 py-2.5 text-sm font-semibold text-navy-ink shadow-e1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold sm:inline-block"
            >
              Book a Consultation
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-mist lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0 h-0.5 w-5 bg-ink transition-all ${open ? 'top-1.5 rotate-45' : ''}`} />
                <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-ink transition-all ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 top-3 h-0.5 w-5 bg-ink transition-all ${open ? 'top-1.5 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <MegaMenu
            panels={megaMenuPanels}
            feature={megaMenuFeature}
            onMouseEnter={() => setMenuOpen(true)}
          />
        )}
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-navy-ink/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white p-6 shadow-e2 transition-transform duration-300 ease-premium ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <Logo variant="light" />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="h-9 w-9 text-2xl text-muted">×</button>
          </div>
          <nav className="flex flex-col" aria-label="Mobile">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-mist py-3.5 text-base font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-lg bg-gradient-to-r from-gold to-gold-champagne py-3.5 text-center font-semibold text-navy-ink"
          >
            Book a Consultation
          </Link>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2"><span aria-hidden>🇬🇧</span> {PHONE_UK}</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden>🇺🇸</span> {PHONE_US}</span>
          </div>
        </div>
      </div>
    </>
  );
}
