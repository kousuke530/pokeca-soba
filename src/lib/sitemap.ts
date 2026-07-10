// サイトマップ生成ヘルパー。
// 参照: Business/orb/税理士検索サイト制作 の lib/sitemap.ts（種類別インデックス＋チャンク分割）。
// pokeca では TOP/静的・ポケモン・パック・カード詳細(チャンク) に分けて出力する。
import { allCards, series, latestHistoryDate, PACK_PAGE_SIZE, packVariants } from '../data/cards';
import { allPacks } from '../data/packs';

export const SITE_URL = 'https://pokeca-soba.com';
// 価格データの最新日を lastmod に採用（無ければビルド日）
export const LASTMOD = latestHistoryDate || new Date().toISOString().slice(0, 10);

export interface UrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function buildSitemapXml(urls: UrlEntry[]): string {
  const entries = urls
    .map(({ loc, lastmod, changefreq, priority }) => {
      const lines = [`    <loc>${loc}</loc>`];
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
      if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
      if (priority !== undefined) lines.push(`    <priority>${priority.toFixed(1)}</priority>`);
      return `  <url>\n${lines.join('\n')}\n  </url>`;
    })
    .join('\n');

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries +
    '\n</urlset>\n'
  );
}

export function buildSitemapIndexXml(sitemaps: Array<{ loc: string; lastmod?: string }>): string {
  const entries = sitemaps
    .map(({ loc, lastmod }) => {
      const lines = [`    <loc>${loc}</loc>`];
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
      return `  <sitemap>\n${lines.join('\n')}\n  </sitemap>`;
    })
    .join('\n');

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries +
    '\n</sitemapindex>\n'
  );
}

/**
 * items を chunkSize ごとに分割し、partNumber 番目（1始まり）の範囲を返す。
 * 最終パート（partNumber === totalParts）は残り全件を含む（データ増加時もURLを欠落させない）。
 */
export function getSitemapChunk<T>(
  items: T[],
  chunkSize: number,
  partNumber: number,
  totalParts: number,
): T[] {
  const start = (partNumber - 1) * chunkSize;
  if (partNumber >= totalParts) return items.slice(start);
  return items.slice(start, start + chunkSize);
}

const abs = (path: string) => `${SITE_URL}${path}`;

/** TOP＋主要・静的ページ */
export function topUrls(): UrlEntry[] {
  return [
    { loc: abs('/'), lastmod: LASTMOD, changefreq: 'daily', priority: 1.0 },
    { loc: abs('/list/'), lastmod: LASTMOD, changefreq: 'weekly', priority: 0.8 },
    { loc: abs('/packs/'), lastmod: LASTMOD, changefreq: 'weekly', priority: 0.8 },
    { loc: abs('/ranking/'), lastmod: LASTMOD, changefreq: 'daily', priority: 0.8 },
    { loc: abs('/search/'), lastmod: LASTMOD, changefreq: 'monthly', priority: 0.5 },
    { loc: abs('/sitemap/'), lastmod: LASTMOD, changefreq: 'monthly', priority: 0.3 },
    { loc: abs('/about/'), lastmod: LASTMOD, changefreq: 'yearly', priority: 0.3 },
    { loc: abs('/terms/'), lastmod: LASTMOD, changefreq: 'yearly', priority: 0.3 },
    { loc: abs('/privacy/'), lastmod: LASTMOD, changefreq: 'yearly', priority: 0.3 },
  ];
}

/** ポケモン別ページ /list/[slug] */
export function pokemonUrls(): UrlEntry[] {
  return series.map((s) => ({
    loc: abs(`/list/${s.slug}/`),
    lastmod: LASTMOD,
    changefreq: 'weekly',
    priority: 0.6,
  }));
}

/** パック一覧＋ページネーション /pack/[slug](/page/[n]) */
export function packUrls(): UrlEntry[] {
  const urls: UrlEntry[] = [];
  for (const p of allPacks) {
    const total = Math.max(1, Math.ceil(packVariants(p.slug).length / PACK_PAGE_SIZE));
    urls.push({ loc: abs(`/pack/${p.slug}/`), lastmod: LASTMOD, changefreq: 'weekly', priority: 0.6 });
    for (let n = 2; n <= total; n++) {
      urls.push({
        loc: abs(`/pack/${p.slug}/page/${n}/`),
        lastmod: LASTMOD,
        changefreq: 'weekly',
        priority: 0.4,
      });
    }
  }
  return urls;
}

/** カード詳細ページ /list/[slug]/[番号-レア]（重複URLは除去） */
export function cardUrls(): UrlEntry[] {
  const seen = new Set<string>();
  const urls: UrlEntry[] = [];
  for (const c of allCards) {
    if (seen.has(c.path)) continue;
    seen.add(c.path);
    urls.push({ loc: abs(c.path), lastmod: LASTMOD, changefreq: 'weekly', priority: 0.5 });
  }
  return urls;
}

// カード詳細は件数が多いためチャンク分割（1ファイル上限5万件に対し余裕を持たせる）
export const CARD_CHUNK = 2500;
export const CARD_PARTS = Math.max(1, Math.ceil(cardUrls().length / CARD_CHUNK));
export const pad2 = (n: number) => String(n).padStart(2, '0');
