import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope, Inter } from 'next/font/google';
import Analytics from '@/components/Analytics';
import { ConsentProvider } from '@/components/CookieConsent';
import { JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE = 'https://www.usukaccountants.com';

export const metadata: Metadata = {
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
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${inter.variable}`}>
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
