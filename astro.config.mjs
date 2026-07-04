// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

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

  integrations: [
    sitemap({
      // 旧カード詳細URL（/pack/<slug>/<番号-レア> のリダイレクトページ）はsitemapから除外。
      // ※ /pack/<slug>（パック一覧）と /pack/<slug>/page/<n>（ページネーション）は残す。
      filter: (page) => {
        const seg = new URL(page).pathname.replace(/\/$/, '').match(/^\/pack\/[^/]+\/([^/]+)$/);
        return !(seg && seg[1] !== 'page');
      },
    }),
  ],
});