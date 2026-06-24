import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Header, Footer, Container, CTASection, AuthorProfile,
} from '@/components/library';
import { authors } from '@/lib/authority-data';

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
      <Header />
      <main>
        <nav aria-label="Breadcrumb" className="border-b border-mist bg-porcelain">
          <Container>
            <ol className="flex gap-2 py-4 text-sm text-muted">
              <li><Link href="/about/team" className="hover:text-gold-antique">Team</Link></li>
              <li aria-hidden>/</li>
              <li className="text-ink">{author.name}</li>
            </ol>
          </Container>
        </nav>

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
