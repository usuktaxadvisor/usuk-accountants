import type { IconType } from '@/lib/types';
import { IconCalculator, IconArrowRight } from '@/components/ui/icons';

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  sampleLabel?: string;
  sampleValue?: string;
  icon?: IconType;
  tone?: 'light' | 'dark';
}

export function CalculatorCard({
  title,
  description,
  href,
  sampleLabel,
  sampleValue,
  icon: Icon = IconCalculator,
  tone = 'light',
}: CalculatorCardProps) {
  const dark = tone === 'dark';
  return (
    <a
      href={href}
      className={`group flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? 'border-navy-slate bg-navy-ink text-white hover:border-gold'
          : 'border-mist bg-white text-ink hover:border-gold hover:shadow-e2'
      }`}
    >
      <span
        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
          dark ? 'bg-gold/15 text-gold' : 'bg-gold/10 text-gold-antique'
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
      <p className={`mt-2 flex-1 text-sm leading-relaxed ${dark ? 'text-softwhite/80' : 'text-muted'}`}>
        {description}
      </p>

      {sampleValue && (
        <div
          className={`mt-5 flex items-center justify-between rounded-lg px-4 py-3 ${
            dark ? 'bg-navy-royal/50' : 'bg-porcelain'
          }`}
        >
          <span className={`text-xs ${dark ? 'text-softwhite/60' : 'text-muted'}`}>
            {sampleLabel ?? 'Example result'}
          </span>
          <span className="font-display text-lg font-semibold text-gold-champagne tnum">
            {sampleValue}
          </span>
        </div>
      )}

      <span
        className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
          dark ? 'text-gold' : 'text-gold-antique'
        }`}
      >
        Try the calculator
        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export function CalculatorGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
