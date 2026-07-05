import type { APIRoute } from 'astro';
import { buildSitemapXml, packUrls } from '../lib/sitemap';

// パック一覧＋ページネーション /pack/[slug](/page/[n])
export const GET: APIRoute = () =>
  new Response(buildSitemapXml(packUrls()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
