import type { Metadata, Viewport } from 'next';
import { Belleza, Montserrat, Fraunces } from 'next/font/google';
import Analytics from '@/components/Analytics';
import { ConsentProvider } from '@/components/CookieConsent';
import { JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import './globals.css';

/*
 * Typography — modelled on the reference hierarchy (us-uktax.com):
 *   Display/headings: Belleza 400 — open-licence (OFL) stand-in for the
 *     reference's commercial Adobe Fonts face "Condor" (David Jonathan Ross),
 *     which we are not licensed to use. Single weight, like the reference.
 *   Body/UI: Montserrat (variable, OFL) — the reference's exact body face.
 *   Brand wordmark only: Fraunces 600 — unchanged logo identity.
 */
const display = Belleza({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const brand = Fraunces({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-brand',
  display: 'swap',
});

/*
 * Heading face: Condor (David Jonathan Ross), the reference site's display
 * face, licensed through our own Adobe Fonts web project "US UK Accountants"
 * (project ID hnd0kal: Condor Regular 400 + Bold 700, font-display: swap).
 * Served by Adobe's official embed stylesheet — never self-hosted.
 * The project ID is public (it appears in page source), so it lives in code.
 * NEXT_PUBLIC_ADOBE_FONTS_KIT_ID can override it, or be set to "off" to fall
 * back to Belleza everywhere without a code change (e.g. if the Adobe
 * subscription ever lapses, when Adobe stops serving the fonts).
 */
const ADOBE_KIT_DEFAULT = 'hnd0kal';
const ADOBE_KIT_ENV = (process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID ?? '').trim().toLowerCase();
const ADOBE_KIT_ID =
  ADOBE_KIT_ENV === 'off'
    ? ''
    : /^[a-z0-9]{5,12}$/.test(ADOBE_KIT_ENV)
      ? ADOBE_KIT_ENV
      : ADOBE_KIT_DEFAULT;

const SITE = 'https://www.usukaccountants.com';

export const metadata: Metadata = {
  other: {
    'p:domain_verify': '300d476bbc12cf0707f068bee07ff022',
  },
  metadataBase: new URL(SITE),
  title: {
    default: 'US UK Accountants | Cross-Border Tax & Accounting Specialists',
    template: '%s | US UK Accountants',
  },
  description:
    'Specialist US–UK tax and accounting under one roof. US expat tax, UK accounting, FBAR, FATCA, Streamlined Filing and treaty planning for Americans in the UK, Brits in the US, and dual citizens.',
  keywords: [
    'US UK tax', 'US expat tax', 'UK accountant', 'FBAR filing', 'FATCA',
    'Streamlined Filing', 'US UK tax treaty', 'cross-border tax', 'dual citizen tax',
  ],
  alternates: { canonical: SITE },
  openGraph: {
    type: 'website',
    url: SITE,
    title: 'US UK Accountants | Cross-Border Tax & Accounting Specialists',
    description:
      'The specialist firm for life and business between the US and the UK. US expat tax, UK accounting, and everything cross-border.',
    siteName: 'US UK Accountants',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US UK Accountants | Cross-Border Tax & Accounting',
    description: 'Specialist US–UK tax and accounting under one roof.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0A1330',
  width: 'device-width',
  initialScale: 1,
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${montserrat.variable} ${brand.variable}`}
      data-display-font={ADOBE_KIT_ID ? 'condor' : undefined}
    >
      <head>
        {ADOBE_KIT_ID && (
          <>
            <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://p.typekit.net" />
            <link rel="stylesheet" href={`https://use.typekit.net/${ADOBE_KIT_ID}.css`} />
          </>
        )}
        <JsonLd
          schema={[
            organizationSchema(),
            websiteSchema(),
          ]}
        />
      </head>
      <body className="font-sans antialiased">
        <ConsentProvider>
          {children}
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
