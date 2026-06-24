import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { authors } from '@/lib/authority-data';
import type { Author } from '@/lib/types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: Author;
  reviewedBy?: Author;
  category?: string;
  readingMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

function resolveAuthor(slug: string | undefined, fallback = 'sam-h'): Author {
  const found = authors.find((a) => a.slug === (slug ?? fallback));
  return found ?? authors.find((a) => a.slug === fallback)!;
}

function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((slug) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
      const { data } = matter(raw);
      return data.draft !== true;
    });
}

export function getAllPostsMeta(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ''),
        date: String(data.date ?? ''),
        updated: data.updated ? String(data.updated) : undefined,
        author: resolveAuthor(data.author),
        reviewedBy: data.reviewedBy ? resolveAuthor(data.reviewedBy) : undefined,
        category: data.category ? String(data.category) : undefined,
        readingMinutes: estimateReadingMinutes(content),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  if (data.draft === true) return null;

  const processed = await remark().use(remarkGfm).use(html).process(content);

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    updated: data.updated ? String(data.updated) : undefined,
    author: resolveAuthor(data.author),
    reviewedBy: data.reviewedBy ? resolveAuthor(data.reviewedBy) : undefined,
    category: data.category ? String(data.category) : undefined,
    readingMinutes: estimateReadingMinutes(content),
    contentHtml: processed.toString(),
  };
}
