import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Client Portal — US UK Accountants',
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-porcelain">
      <header className="bg-navy-ink">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/portal" className="group flex items-baseline gap-3" aria-label="US UK Accountants client portal home">
            <span className="font-brand text-xl tracking-wide text-white sm:text-2xl">
              US UK <span className="text-gold">Accountants</span>
            </span>
          </Link>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-champagne/80 sm:block">
            Private Client Portal
          </span>
        </div>
        <div aria-hidden className="h-[3px] bg-gradient-to-r from-gold-antique via-gold to-gold-antique" />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-12">{children}</main>

      <footer className="border-t border-mist bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="flex max-w-xl items-start gap-2">
            <svg aria-hidden viewBox="0 0 20 20" className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-current text-gold-antique"><path d="M10 1.5 3.5 4v5.2c0 4.1 2.8 7.8 6.5 9.3 3.7-1.5 6.5-5.2 6.5-9.3V4L10 1.5Z" /></svg>
            Encrypted in transit and stored privately for your engagement. Only your advisers can see your documents.
          </p>
          <p className="flex flex-wrap gap-x-3 gap-y-1 sm:justify-end">
            <a href="mailto:hello@usukaccountants.com" className="hover:text-navy-ink">hello@usukaccountants.com</a>
            <span className="whitespace-nowrap">US UK Accountants Ltd · Company No. 17336015</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
