import type { APIRoute } from 'astro';
import { SITE_URL, LASTMOD, CARD_PARTS, pad2, buildSitemapIndexXml } from '../lib/sitemap';

// サイトマップインデックス（種類別サブサイトマップを束ねる）
export const GET: APIRoute = () => {
  const sitemaps = [
    { loc: `${SITE_URL}/sitemap-top.xml`, lastmod: LASTMOD },
    { loc: `${SITE_URL}/sitemap-pokemon.xml`, lastmod: LASTMOD },
    { loc: `${SITE_URL}/sitemap-packs.xml`, lastmod: LASTMOD },
    ...Array.from({ length: CARD_PARTS }, (_, i) => ({
      loc: `${SITE_URL}/sitemap-cards-${pad2(i + 1)}.xml`,
      lastmod: LASTMOD,
    })),
  ];
  return new Response(buildSitemapIndexXml(sitemaps), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
