import type { Metadata } from 'next';
import { Header, Footer, PolicyPage, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { privacyPolicy } from '@/lib/authority-data';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How US UK Accountants collects, uses and protects your personal and financial data, your rights under UK GDPR, and how we handle sensitive tax identifiers.',
  alternates: { canonical: 'https://www.usukaccountants.com/privacy' },
};

export default function PrivacyPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Privacy', href: '/privacy' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <PolicyPage
          eyebrow="Privacy & data"
          title="Privacy policy"
          lastUpdated="June 2026"
          intro="Tax work involves sensitive personal and financial data. This policy explains what we collect, why, how we protect it, and the rights you have over it."
          sections={privacyPolicy}
        />
      </main>
      <Footer />
    </>
  );
}
