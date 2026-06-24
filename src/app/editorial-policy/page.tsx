import type { Metadata } from 'next';
import { Header, Footer, PolicyPage, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { editorialPolicy } from '@/lib/authority-data';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description:
    'How US UK Accountants researches, writes, reviews and maintains its tax content — named authors, independent review, primary sources and annual updates.',
  alternates: { canonical: 'https://www.usukaccountants.com/editorial-policy' },
};

export default function EditorialPolicyPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Editorial Policy', href: '/editorial-policy' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <PolicyPage
          eyebrow="Editorial standards"
          title="Editorial policy"
          lastUpdated="June 2026"
          intro="Tax is a Your Money or Your Life subject. Here is exactly how we make sure everything we publish is accurate, current, and reviewed across our US and UK teams."
          sections={editorialPolicy}
        />
      </main>
      <Footer />
    </>
  );
}
