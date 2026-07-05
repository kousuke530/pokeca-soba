import type { APIRoute } from 'astro';
import { buildSitemapXml, topUrls } from '../lib/sitemap';

// TOP＋主要・静的ページ
export const GET: APIRoute = () =>
  new Response(buildSitemapXml(topUrls()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
