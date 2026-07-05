import type { APIRoute } from 'astro';
import { buildSitemapXml, cardUrls, getSitemapChunk, CARD_CHUNK, CARD_PARTS, pad2 } from '../lib/sitemap';

// カード詳細ページ /list/[slug]/[番号-レア]（件数が多いためチャンク分割）
export function getStaticPaths() {
  return Array.from({ length: CARD_PARTS }, (_, i) => ({ params: { part: pad2(i + 1) } }));
}

export const GET: APIRoute = ({ params }) => {
  const partNumber = Number(params.part);
  const chunk = getSitemapChunk(cardUrls(), CARD_CHUNK, partNumber, CARD_PARTS);
  return new Response(buildSitemapXml(chunk), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
