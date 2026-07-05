import type { APIRoute } from 'astro';
import { buildSitemapXml, pokemonUrls } from '../lib/sitemap';

// ポケモン別ページ /list/[slug]
export const GET: APIRoute = () =>
  new Response(buildSitemapXml(pokemonUrls()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
