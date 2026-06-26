import { NextRequest, NextResponse } from 'next/server';
import { submitToIndexNow } from '@/lib/indexnow';
import sitemap from '@/app/sitemap';

export async function POST(req: NextRequest) {
  const token = process.env.INDEXNOW_ADMIN_TOKEN;
  const auth = req.headers.get('authorization');

  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ ok: false, message: 'Unauthorized.' }, { status: 401 });
  }

  let body: { urls?: string[]; all?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // empty/invalid body treated as no-op below
  }

  let urls: string[] = [];
  if (body.all) {
    const entries = sitemap();
    urls = entries.map((e) => (typeof e.url === 'string' ? e.url : String(e.url)));
  } else if (Array.isArray(body.urls)) {
    urls = body.urls;
  }

  if (urls.length === 0) {
    return NextResponse.json(
      { ok: false, message: 'Provide { all: true } or { urls: [...] }.' },
      { status: 400 },
    );
  }

  const result = await submitToIndexNow(urls);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
