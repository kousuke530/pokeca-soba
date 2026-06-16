# ポケカ販売（アフィリエイトサイト）

ポケモンカードの最新販売価格・買取価格・価格推移をショップ横断でまとめ、各販売サイトへのアフィリエイトリンクから収益化する**価格相場メディア**。

参考サイト: https://premium.gamepedia.jp/pokeca/

## 性質

- **私用プロジェクト**（`project/その他/` 配下）。仕事文脈は持ち込まない。
- Obsidian 記録は `Projects/personal/`・`tags: [personal]` で分離する。

## 方針（決定事項 2026-06-15）

- **SSG（静的サイト生成）で構築**。理由: SEO/LLMO が集客の肝。純HTML出力で Google / LLM系クローラー（GPTBot・ClaudeBot 等）が JS実行なしで全文を読める。
- 各カードに **JSON-LD（ItemList × Product / AggregateOffer）** を埋め、リッチリザルト＋LLM理解度を強化。
- 価格データは**当面ダミー**。`src/data/` の型はそのままに、将来スクレイピング/API の戻り値へ差し替える設計。

## 技術スタック

- **Astro 5系**（`output: 'static'`）
- 素の CSS（コンポーネント scoped + BaseLayout に global）。フレームワーク非依存。
- JS は最小限（モーダル開閉のみ）。コンテンツは全て静的HTMLに含める＝クローラー可読。

## ディレクトリ

```
src/
  data/
    types.ts      … データモデル（ShopPrice / PricePoint / Card / CardSeries）
    cards.ts      … ダミーデータ＋履歴生成ヘルパー genHistory()
  layouts/
    BaseLayout.astro      … head/OGP/JSON-LD/global CSS
  components/
    PriceModal.astro      … カード詳細ポップアップ（<dialog>。中身は静的HTML）
    PriceHistoryChart.astro … 価格推移グラフ（インラインSVG）
    history.ts    … data/history/<slug>.json を読み、カードへ実データ反映
  pages/
    index.astro           … トップ（注目カード）
    card/[series].astro   … カード名ごとの相場一覧＋各バリアントのモーダル
public/images/cards/      … カード画像（現状SVGプレースホルダー）
scripts/scrape/
  types.ts        … 取得層の共通型（CardQuery / ScrapedPrice / ShopAdapter）
  http.ts         … 礼儀正しいfetch（UA明記＋sleep）
  targets.ts      … 取得対象カード（slugはサイト側と一致）
  shops/          … ショップ別アダプタ（surugaya.ts ＝駿河屋）
  run.ts          … オーケストレータ（取得→data/history/へ当日分を追記）
data/history/             … カード別の日次価格履歴（推移グラフの元データ）
input/ work/ output/      … 受け渡し/作業中/最終成果物（共通規約）
```

## スクレイピング（実データ取得）

### 方針・遵守ルール（重要）

- **取得方針＝ハイブリッド**: Amazonは公式API（PA-API、ただし売上実績が必要で当面後回し）、ASPフィードがある所はそれ、無いカードショップだけ直接スクレイピング。メルカリは規約・対ボットが厳しく別扱い。
- **直接スクレイピングは「規約を確認し、明確に禁止されていないサイト」に限る**。事前に各サイトの利用規約・robots.txt を読み、スクレイピング/自動取得/データ収集を名指しで禁止していないことを確認する。明示禁止のサイトはスクレイピングしない（提携経由 or 不採用）。
- **作法を厳守**: ①UAを正体明示（`PokecaPriceBot/0.1`、AIボットUA名は使わない）②低頻度（原則1日1回）＋レート制限＋キャッシュ③ボット対策を偽装突破しない④掲載は事実（価格）＋リンクバックのみ・ページ複製はしない。
- 詳細・判断根拠は Obsidian `Decisions/personal/2026-06-16-scraping-policy.md` と `Knowledge/personal/surugaya-scraping.md`。
- **アダプタ方式**: 各ショップは `ShopAdapter` を実装。横展開は `scripts/scrape/shops/` にアダプタを足し、`run.ts` の `adapters` と `targets.ts` に追加するだけ。
- **履歴は毎日蓄積**: スクレイピングで取れるのは「その日の価格」だけなので、`data/history/<slug>.json` に当日分を追記して推移を作る。**今日から積み上げる**のが前提。
- **礼儀**: robots.txt は一般UAに `Allow:/`／`Content-Signal: search=yes`（AIボットUAはブロック）。UAは `PokecaPriceBot/0.1` を明示、`sleep` でレート制限。低頻度を厳守。
- **毎日更新の自動化（未実装）**: `[定時] scrape → build → deploy` を GitHub Actions 等の cron で回す想定（ホスティング決定後）。

## 開発コマンド

- `npm run dev` … 開発サーバー（http://localhost:4321/）
- `npm run build` … `dist/` に静的出力
- `npm run preview` … ビルド結果のプレビュー
- `npm run scrape` … 駿河屋から価格取得し `data/history/` に当日分を追記（Node 24のTS直実行）

プレビューは `.claude/launch.json` の `pokeca-dev` でも起動可。

## 現状

- **UIプロトタイプ完了**。題材「リーリエの決心」（マスターボール / SAR / AR）。参考サイトのポップアップUI（情報テーブル・買取/販売価格＋過去最高・収録パック・価格履歴・最新販売/買取のショップ一覧・カード一覧CTA）を再現。
- **駿河屋スクレイピングを端から端まで実装・検証済み**（`npm run scrape`）。SARの実販売価格（例: 36,800円）＋実商品URLを取得→`data/history/`に蓄積→サイトに反映（駿河屋行に「実」バッジ、推移グラフは実履歴を読込）。他ショップはダミーのまま、注記で明示。

## 次にやりうること（TODO）

- **スクレイピングの横展開**: カードショップ各社（カードラッシュ/遊々亭/トレトク/ふるいち/カーナベル等）のアダプタ追加。買取価格の取得元も。
- **毎日更新の自動化**: GitHub Actions 等で `scrape → build → deploy` を cron 実行（ホスティング決定後）。
- 対象カードの拡充（`targets.ts` とサイト側データの両方）。
- アフィリエイト実リンク化（`#aff-*` の置換、駿河屋等は実URLにアフィID付与方式を決定）。
- 実カード画像の差し込み（現状はSVGプレースホルダー）。
- カード数・シリーズの拡充、検索・パック別一覧などの導線。
- `@astrojs/sitemap` 導入、`astro.config.mjs` の `site` を本番URLへ。
