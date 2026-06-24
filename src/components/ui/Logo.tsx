interface LogoProps {
  variant?: 'light' | 'dark';
  /** Show the "Cross-Border Tax & Advisory" subline (use in footer / large spaces). */
  showSubline?: boolean;
  className?: string;
}

/**
 * US·UK Accountants — Concept A "Transatlantic Arc".
 * Gold arc bridging two terminal nodes (US & UK) with a champagne keystone.
 * Navy/gold private-bank identity. No flags, no patriotic colour.
 */
export default function Logo({
  variant = 'dark',
  showSubline = false,
  className = '',
}: LogoProps) {
  const wordColor = variant === 'light' ? '#0A1330' : '#FFFFFF';
  const subColor = variant === 'light' ? '#414B63' : '#EAEDF5';
  const keystone = variant === 'light' ? '#A8893A' : '#E2CE92';
  const tagline = variant === 'light' ? '#A8893A' : '#C9A84C';

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width="42"
        height="32"
        viewBox="0 0 52 40"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M5 30 C 16 6, 36 6, 47 30"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="5" cy="30" r="4" fill="#C9A84C" />
        <circle cx="47" cy="30" r="4" fill="#C9A84C" />
        <circle cx="26" cy="11.5" r="2.4" fill={keystone} />
      </svg>
      <span className="leading-none">
        <span
          className="block font-display text-lg font-semibold tracking-tight"
          style={{ color: wordColor }}
        >
          US<span style={{ color: '#C9A84C' }}>·</span>UK{' '}
          <span style={{ color: subColor }}>Accountants</span>
        </span>
        {showSubline && (
          <span
            className="mt-1 block text-[9px] font-semibold uppercase"
            style={{ color: tagline, letterSpacing: '0.22em' }}
          >
            Cross-Border Tax &amp; Advisory
          </span>
        )}
      </span>
    </span>
  );
}
