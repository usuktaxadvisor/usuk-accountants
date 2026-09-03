import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Client Portal — US UK Accountants',
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-softwhite">
      <header className="border-b border-mist bg-navy-ink">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-display text-lg font-semibold text-white">
            US UK <span className="text-gold">Accountants</span>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-softwhite/60">Client Portal</span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      <footer className="mx-auto max-w-5xl px-6 pb-8 text-xs text-muted">
        Documents you upload here are transmitted over an encrypted connection and stored privately for your engagement.
      </footer>
    </div>
  );
}
