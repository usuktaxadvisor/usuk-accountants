import { IconArrowRight } from '@/components/ui/icons';
import Link from 'next/link';

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-mist bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <Link
        href="/portal/login"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy/30 py-3 text-sm font-semibold text-navy"
      >
        Client Login
      </Link>
      <Link
        href="/contact"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-champagne py-3 text-sm font-semibold text-navy-ink"
      >
        Contact us <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
