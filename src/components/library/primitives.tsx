import type { ReactNode } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/icons';

/* ---------- Container ---------- */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-container px-6 ${className}`}>{children}</div>;
}

/* ---------- Eyebrow ---------- */
export function Eyebrow({
  children,
  tone = 'gold',
  className = '',
}: {
  children: ReactNode;
  tone?: 'gold' | 'gold-light';
  className?: string;
}) {
  const color = tone === 'gold-light' ? 'text-gold' : 'text-gold-antique';
  return (
    <p className={`text-xs font-semibold uppercase tracking-eyebrow ${color} ${className}`}>
      {children}
    </p>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'dark',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const titleColor = tone === 'light' ? 'text-white' : 'text-ink';
  const introColor = tone === 'light' ? 'text-softwhite/80' : 'text-muted';
  const alignment = align === 'center' ? 'mx-auto text-center' : '';
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && <Eyebrow tone={tone === 'light' ? 'gold-light' : 'gold'} className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${introColor}`}>{intro}</p>}
    </div>
  );
}

/* ---------- Button ---------- */
type ButtonVariant = 'primary' | 'secondary' | 'secondary-light' | 'urgency' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm min-h-[40px]',
  md: 'px-7 py-3.5 text-base min-h-[48px]',
  lg: 'px-8 py-4 text-base min-h-[56px]',
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-gold to-gold-champagne text-navy-ink shadow-e1 hover:-translate-y-0.5 hover:shadow-gold',
  secondary:
    'border border-gold/60 text-gold-antique hover:bg-gold/10',
  'secondary-light':
    'border border-gold/60 text-gold hover:bg-gold/10',
  urgency: 'bg-signal text-white hover:bg-crimson',
  ghost: 'text-gold-antique hover:text-gold',
};

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  shimmer = false,
  className = '',
  type,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  shimmer?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  const cls = `group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg font-semibold transition-all duration-200 ${sizeMap[size]} ${variantMap[variant]} ${className}`;
  const inner = (
    <>
      {shimmer && (
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/40 blur-md animate-shimmer" />
      )}
      {children}
      {withArrow && (
        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );
  if (href) {
    const isInternal = href.startsWith('/') && !href.startsWith('//');
    if (isInternal) {
      return (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      );
    }
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type ?? 'button'} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/* ---------- Section wrapper (handles band tone + vertical rhythm) ---------- */
export function Section({
  children,
  tone = 'white',
  id,
  className = '',
}: {
  children: ReactNode;
  tone?: 'white' | 'porcelain' | 'navy';
  id?: string;
  className?: string;
}) {
  const bg =
    tone === 'navy' ? 'bg-navy-ink' : tone === 'porcelain' ? 'bg-porcelain' : 'bg-white';
  return (
    <section id={id} className={`${bg} py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}
