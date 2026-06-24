import { IconPhone, IconArrowRight } from '@/components/ui/icons';
import Link from 'next/link';

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-mist bg-white/95 p-3 backdrop-blur-md lg:hidden">
      <a
        href="tel:+443330904129"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy/30 py-3 text-sm font-semibold text-navy"
      >
        <IconPhone className="h-4 w-4 text-gold-antique" /> Call
      </a>
      <Link
        href="/book"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-champagne py-3 text-sm font-semibold text-navy-ink"
      >
        Book <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
