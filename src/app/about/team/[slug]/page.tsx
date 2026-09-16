import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Header, Footer, Container, CTASection, AuthorProfile, JsonLd, Breadcrumbs,
} from '@/components/library';
import { authors } from '@/lib/authority-data';
import { breadcrumbSchema } from '@/lib/schema';

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  if (!author) return { title: 'Team member not found' };
  return {
    title: `${author.name} — ${author.role}`,
    description: author.bio,
    alternates: { canonical: `https://www.usukaccountants.com/about/team/${author.slug}` },
  };
}

export default async function AuthorPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  if (!author) notFound();

  return (
    <>
      <JsonLd schema={breadcrumbSchema([
        { label: 'Our team', href: '/about/team' },
        { label: author.name, href: `/about/team/${author.slug}` },
      ])} />
      <Header />
      <main>
        <Breadcrumbs crumbs={[
          { label: 'Our team', href: '/about/team' },
          { label: author.name, href: `/about/team/${author.slug}` },
        ]} />

        <div className="bg-white py-16 md:py-20">
          <Container>
            <AuthorProfile author={author} />
          </Container>
        </div>

        <CTASection
          title="Work with specialists who know both systems"
          tone="navy"
          secondary={{ label: 'Meet the full team', href: '/about/team' }}
          showRating={false}
        />
      </main>
      <Footer />
    </>
  );
}
