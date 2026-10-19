import type { Metadata } from 'next';
import { metaDescription } from '@/lib/seo-text';
import { notFound, permanentRedirect } from 'next/navigation';
import { PageShell, Section, Container } from '@/components/library';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';

const BASE = 'https://www.usukaccountants.com/resources/blog';

/**
 * Retired post slugs and where they now live. This route matches before the
 * site-wide catch-all, so consolidated articles have to redirect from here.
 */
const RETIRED: Record<string, string> = {
  // Consolidated 19 Oct 2026: duplicated the 25% lump-sum article.
  'uk-pension-lump-sum-us-tax': '/resources/blog/is-the-25-percent-uk-lump-sum-taxable-in-the-us',
};

export function generateStaticParams() {
  // Retired slugs are pre-rendered too, so the redirect below is served
  // instead of a 404 for links and bookmarks that still point at them.
  return [...getAllPostSlugs(), ...Object.keys(RETIRED)].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (RETIRED[slug]) return { alternates: { canonical: `https://www.usukaccountants.com${RETIRED[slug]}` } };
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article not found' };
  const url = `${BASE}/${slug}`;
  // Social crawlers do not render SVG: use the generated 1200x630 PNG.
  const ogImage = 'https://www.usukaccountants.com/opengraph-image';
  return {
    title: post.seoTitle ?? post.title,
    description: metaDescription(post.description),
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
      images: [{ url: ogImage, width: 1200, height: 630 }],
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
  if (RETIRED[slug]) permanentRedirect(RETIRED[slug]);
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
      ctaIntro="Articles explain the rules; your facts decide the answer. Email us a short description of your situation and a US–UK specialist will reply with what we would need and a written quote. Detailed personal advice is available through a paid 30-minute consultation (£350 individual, £550 business)."
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
