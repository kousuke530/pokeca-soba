import type { APIRoute } from 'astro';
import { buildSitemapXml, columnUrls } from '../lib/sitemap';

// コラム記事 /column/[slug]
export const GET: APIRoute = () =>
  new Response(buildSitemapXml(columnUrls()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
