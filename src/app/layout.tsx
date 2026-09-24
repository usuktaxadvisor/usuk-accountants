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
    <html lang="en" className={`${display.variable} ${montserrat.variable} ${brand.variable}`}>
      <head>
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
