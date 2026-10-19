import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          ink: '#0A1330',
          DEFAULT: '#0D1B3E',
          royal: '#16264F',
          slate: '#28375E',
        },
        gold: {
          DEFAULT: '#C9A84C',
          champagne: '#E2CE92',
          antique: '#A8893A',
          tint: '#F6EFD9',
        },
        porcelain: '#F7F8FB',
        mist: '#EDEFF4',
        ink: '#0B1020',
        muted: '#414B63',
        softwhite: '#EAEDF5',
        signal: '#B23A48',
        crimson: '#8E2C38',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Optima', 'Candara', 'system-ui', 'sans-serif'],
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        data: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        brand: ['condor', 'var(--font-display)', 'Optima', 'Candara', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
        wide: '1440px',
        prose: '68ch',
      },
      letterSpacing: {
        eyebrow: '0.06em',
      },
      boxShadow: {
        e1: '0 1px 2px rgba(10,19,48,0.06)',
        e2: '0 8px 24px rgba(10,19,48,0.10)',
        e3: '0 24px 60px -24px rgba(10,19,48,0.35)',
        gold: '0 12px 32px rgba(201,168,76,0.20)',
      },
      borderRadius: {
        card: '0.875rem',
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 1.9rem + 2.9vw, 4.25rem)', { lineHeight: '1.05' }],
        'display-lg': ['clamp(2.25rem, 1.7rem + 2.2vw, 3.5rem)', { lineHeight: '1.08' }],
        'display-md': ['clamp(1.9rem, 1.5rem + 1.4vw, 2.75rem)', { lineHeight: '1.12' }],
        'display-sm': ['clamp(1.5rem, 1.3rem + 0.8vw, 2rem)', { lineHeight: '1.2' }],
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        'fade-rise': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-12deg)' },
          '100%': { transform: 'translateX(220%) skewX(-12deg)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.1s cubic-bezier(0.16,1,0.3,1) forwards',
        drift: 'drift 90s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
