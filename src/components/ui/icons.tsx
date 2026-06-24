import type { SVGProps } from 'react';

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

type IconProps = SVGProps<SVGSVGElement>;

export function IconTreaty(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M3 18c3-7 15-7 18 0" />
      <circle cx="3" cy="18" r="1.6" />
      <circle cx="21" cy="18" r="1.6" />
      <path d="M9 12l3 2 3-2" />
    </svg>
  );
}

export function IconGlobeDoc(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <circle cx="9" cy="9" r="6" />
      <path d="M3 9h12M9 3c2.5 2.5 2.5 9.5 0 12M9 3c-2.5 2.5-2.5 9.5 0 12" />
      <path d="M15 13h6v8h-8v-4" />
    </svg>
  );
}

export function IconBank(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M3 9l9-5 9 5" />
      <path d="M4 9v10M9 9v10M15 9v10M20 9v10" />
      <path d="M2 21h20" />
    </svg>
  );
}

export function IconCalculator(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconPlanning(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 16l4-5 3 3 5-7" />
    </svg>
  );
}

export function IconPassport(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M9 16h6" />
    </svg>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none" aria-hidden="true">
      <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}
