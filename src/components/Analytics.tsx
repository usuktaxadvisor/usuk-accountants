'use client';

import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';
import { useConsent } from '@/components/CookieConsent';

/**
 * Loads GA4 ONLY when (a) NEXT_PUBLIC_GA_ID is set AND (b) the visitor has
 * granted analytics consent. Until consent is granted, no GA script is
 * injected and no analytics cookie is set — satisfying UK GDPR / PECR.
 */
export default function Analytics() {
  const { analytics } = useConsent();
  if (!GA_ID || !analytics) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', { analytics_storage: 'granted' });
          gtag('config', '${GA_ID}', { send_page_view: true, anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
