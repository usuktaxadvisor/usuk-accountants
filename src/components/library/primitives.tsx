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

/* ---------- Eyebrow (kicker) ----------
   A short gold rule and a sentence-case label. The rule is the brand's
   arc reduced to a line; the label says what the section is, nothing more. */
export function Eyebrow({
  children,
  tone = 'gold',
  align = 'left',
  className = '',
}: {
  children: ReactNode;
  tone?: 'gold' | 'gold-light';
  align?: 'left' | 'center';
  className?: string;
}) {
  const color = tone === 'gold-light' ? 'kicker-light' : '';
  const centre = align === 'center' ? 'kicker-center w-full' : '';
  return (
    <p className={`kicker ${color} ${centre} ${className}`}>
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
  size = 'md',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  size?: 'md' | 'lg';
  className?: string;
}) {
  const titleColor = tone === 'light' ? 'text-white' : 'text-ink';
  const introColor = tone === 'light' ? 'text-softwhite/80' : 'text-muted';
  const alignment = align === 'center' ? 'mx-auto text-center' : '';
  const scale = size === 'lg' ? 'text-display-lg' : 'text-display-md';
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <Eyebrow tone={tone === 'light' ? 'gold-light' : 'gold'} align={align} className="mb-4">
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className={`font-display ${scale} ${titleColor}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${introColor}`}>{intro}</p>}
    </div>
  );
}

/* ---------- Button ---------- */
type ButtonVariant = 'primary' | 'secondary' | 'secondary-light' | 'urgency' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm min-h-[40px]',
  md: 'px-7 py-3.5 text-[15px] min-h-[48px]',
  lg: 'px-8 py-4 text-base min-h-[56px]',
};

const variantMap: Record<ButtonVariant, string> = {
  primary: 'btn-gold',
  secondary:
    'border border-navy-ink/25 text-navy-ink hover:border-navy-ink hover:bg-navy-ink/[0.04]',
  'secondary-light':
    'border border-softwhite/35 text-white hover:border-gold-champagne hover:text-gold-champagne',
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
  /** Retained for call-site compatibility; the primary button no longer shimmers. */
  shimmer?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  void shimmer;
  const cls = `group relative inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 ${sizeMap[size]} ${variantMap[variant]} ${className}`;
  const inner = (
    <>
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
    <section id={id} className={`${bg} py-20 md:py-28 lg:py-32 ${className}`}>
      {children}
    </section>
  );
}
