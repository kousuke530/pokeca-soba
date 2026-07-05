// @ts-check
import { defineConfig } from 'astro/config';

// サイトマップは種類別に分割した独自実装（src/pages/sitemap*.xml.ts）を使用。
// @astrojs/sitemap は使わない（TOP/ポケモン/パック/カード詳細で分け、lastmod/priority を付与）。

// SSG（静的サイト生成）構成。
// 純粋な静的HTMLを出力するため、Google/LLM系クローラーがJS実行なしで全文を読める。
//
// ★公開前に必須: site を本番の独自ドメイン（XServerで取得しGitHub Pagesに向けるドメイン）へ差し替える。
//   canonical / OGP / JSON-LD / sitemap の絶対URL生成に使われるため、誤ると検索評価に影響する。
//   独自ドメイン＝ルート公開なので base は不要（'/'のまま）。
export default defineConfig({
  site: 'https://pokeca-soba.com',
  output: 'static',
  trailingSlash: 'ignore',

  build: {
    format: 'directory',
  },

  integrations: [],
});