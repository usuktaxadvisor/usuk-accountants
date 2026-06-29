import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell, Section, Container } from '@/components/library';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';

const BASE = 'https://www.usukaccountants.com/resources/blog';

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article not found' };
  const url = `${BASE}/${slug}`;
  const ogImage = 'https://www.usukaccountants.com/brand/logo-horizontal-dark.svg';
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      siteName: 'US UK Accountants',
      publishedTime: post.date || undefined,
      modifiedTime: post.updated || post.date || undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      section: post.category || undefined,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const url = `${BASE}/${slug}`;

  return (
    <PageShell
      url={url}
      eyebrow={post.category ? `Insights · ${post.category}` : 'Insights'}
      title={post.title}
      answer={post.description}
      crumbs={[
        { label: 'Resources', href: '/resources' },
        { label: 'Insights', href: '/resources/blog' },
        { label: post.title, href: url },
      ]}
      author={post.author}
      reviewedBy={post.reviewedBy}
      datePublished={post.date || undefined}
      dateModified={post.updated || post.date || undefined}
      faqs={post.faqs}
      ctaTitle="Need this applied to your own situation?"
      ctaIntro="Articles explain the rules; a consultation gives you the answer for your circumstances. Your first call is free."
    >
      <Section tone="white">
        <Container>
          <article
            className="article-prose speakable mx-auto"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </Container>
      </Section>
    </PageShell>
  );
}
