import type { Metadata } from 'next';
import { Header, Footer, PolicyPage, Breadcrumbs, JsonLd } from '@/components/library';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/schema';
import { reviewPolicy } from '@/lib/authority-data';

export const metadata: Metadata = {
  title: 'Review Policy',
  description:
    'How US UK Accountants collects, verifies and displays client reviews — genuine, verified-client reviews only, in line with FTC and UK CMA guidance.',
  alternates: { canonical: 'https://www.usukaccountants.com/review-policy' },
};

export default function ReviewPolicyPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Review Policy', href: '/review-policy' }];
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema(), breadcrumbSchema(crumbs)]} />
      <Header />
      <Breadcrumbs crumbs={crumbs} />
      <main>
        <PolicyPage
          eyebrow="Genuine reviews"
          title="Review policy"
          lastUpdated="June 2026"
          intro="Every review we show is from a real, verified client. We never write, buy or incentivise reviews. Here is how our process works."
          sections={reviewPolicy}
        />
      </main>
      <Footer />
    </>
  );
}
