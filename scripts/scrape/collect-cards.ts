// カードのマスター情報（名前・型番・レアリティ・種別）を駿河屋から収集する。
//   価格スクレイパー(run.ts)とは別物。カタログ(=サイトに載せるカード一覧)を作るための収集。
//   出力: data/cards/<packSlug>.json
// 駿河屋は規約確認済み・利用OK（Decisions/personal/2026-06-16-scraping-policy）。
// 収集するのは「事実（カード名・公式型番・レアリティ）」のみ。UA明示＋ページ間sleepで低負荷。
import * as cheerio from 'cheerio';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { politeGet, sleep } from './http.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../data/cards');
const HISTORY_DIR = path.resolve(__dirname, '../../data/history');
const PACKS_JSON = path.resolve(__dirname, '../../data/packs.json');
const TODAY = new Date().toISOString().slice(0, 10);
const SEARCH = 'https://www.suruga-ya.jp/search';
const MAX_PAGES = 40; // 安全上限

interface PackDef {
  slug: string;
  setCode: string;
  name: string;
  shortName: string;
  keyword: string; // 駿河屋検索語
  match: string; // このパックと判定する語
}

/** data/packs.json から収集対象を読む。引数でslug指定があればそれだけ */
async function loadTargets(): Promise<PackDef[]> {
  const all = JSON.parse(await readFile(PACKS_JSON, 'utf-8')) as PackDef[];
  const args = process.argv.slice(2);
  return args.length ? all.filter((p) => args.includes(p.slug)) : all;
}

const RARITIES = ['SAR', 'SR', 'AR', 'RRR', 'RR', 'UR', 'MUR', 'SSR', 'HR', 'CHR', 'CSR', 'PR', 'ACE', 'K', 'U', 'C'];
// 駿河屋の condition は「ポケモンカードゲーム/<レア>/<種別 or エネルギータイプ>/<弾>」
const TRAINER_TYPES = ['サポート', 'グッズ', 'スタジアム', 'どうぐ', 'ポケモンのどうぐ', 'トレーナーズ'];
const ENERGY_TYPES = ['草', '炎', '水', '雷', '闘', '悪', '超', '鋼', '竜', 'ドラゴン', 'フェアリー', '無色', '無'];

interface MasterCard {
  name: string;
  cardNumber: string;
  rarity: string;
  /** カード種別（ポケモン / サポート / グッズ / スタジアム / エネルギー） */
  category: string;
  /** ポケモンの場合のエネルギータイプ（草/炎/水…）。トレーナーズは空 */
  energyType: string;
  surugayaUrl: string;
  /** 駿河屋の販売価格スナップショット（収集時点の中古価格・円）。取れなければ null */
  surugayaPrice: number | null;
  /** 駿河屋で品切れ中か */
  surugayaSoldOut: boolean;
}

/** "￥9,980" 等から数値 */
function parsePrice(text: string): number | null {
  const m = text.replace(/[,，\s]/g, '').match(/(\d{2,})\s*円|￥\s*(\d{2,})/);
  if (!m) return null;
  const n = Number(m[1] ?? m[2]);
  return Number.isFinite(n) ? n : null;
}

// 日本語レアリティ→URL用スラッグ
const RARITY_SLUG: Record<string, string> = { マスターボール: 'mb', ミラー: 'mirror', ノーマル: 'n' };
function raritySlug(r: string): string {
  return RARITY_SLUG[r] ?? (r.toLowerCase().replace(/[^a-z0-9]/g, '') || 'n');
}

/** 名前の括弧内の仕様（治療）からレアリティを推定。無ければ '' */
function rarityFromName(name: string): string {
  if (/マスターボールミラー/.test(name)) return 'マスターボール';
  if (/ミラー/.test(name)) return 'ミラー';
  if (/ノーマル仕様/.test(name)) return 'ノーマル';
  return '';
}

/** カード名から (キラ)(ミラー)(マスターボールミラー)(ノーマル仕様)(色違い) 等の仕様表記を除去 */
function cleanName(name: string): string {
  return name
    .replace(/[（(](キラ|ミラー|マスターボールミラー|ノーマル仕様|色違い)[)）]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** 検索結果1ページからシングルを抽出 */
function parsePage(html: string, packMatch: string): { cards: MasterCard[]; raw: number } {
  const $ = cheerio.load(html);
  const raw = $('.item').length; // 結果ページの商品数（シングル以外含む）
  const out: MasterCard[] = [];
  // 商品コンテナ .item ごとに処理（品切れ時に隣の価格を誤取得しないようコンテナ内で完結）
  $('.item').each((_, el) => {
    const $el = $(el);
    const raw = $el.find('.product-name').text().replace(/\s+/g, ' ').trim();
    if (!raw) return;
    // 型番始まりのシングルのみ。鑑定品・オリパ除外
    const numM = raw.match(/^(\d{2,3}\/\d{2,3})/);
    if (!numM) return;
    if (/PSA|MINT|鑑定|オリパ|オリジナルパック/i.test(raw)) return;

    const condition = $el.find('.condition').text().replace(/\s+/g, ' ').trim();
    // このパックの収録カードに限定
    if (packMatch && !condition.includes(packMatch)) return;

    const cardNumber = numM[1];
    const namePart = raw.split(/[：:]/).slice(1).join('：').trim() || raw;
    // レアリティ: ①タイトルの[XXX] ②名前の仕様(ミラー/マスターボール等) ③condition のトークン ④ノーマル
    let rarity = (raw.match(/\[([^\]]+)\]/)?.[1] ?? '').trim();
    if (!rarity) rarity = rarityFromName(namePart);
    if (!rarity) {
      const tks = condition.split(/[\/／]/).map((t) => t.trim());
      rarity = tks.find((t) => RARITIES.includes(t)) ?? 'ノーマル';
    }
    // カード名: 仕様表記を除去
    const name = cleanName(namePart);
    // 種別・エネルギータイプ
    const tokens = condition.split(/[\/／]/).map((t) => t.trim());
    let category = '';
    let energyType = '';
    const tr = tokens.find((t) => TRAINER_TYPES.includes(t));
    if (tr) {
      category = tr;
    } else {
      const en = tokens.find((t) => ENERGY_TYPES.includes(t));
      if (en) {
        category = 'ポケモン';
        energyType = en;
      } else if (tokens.some((t) => t.includes('エネルギー'))) {
        category = 'エネルギー';
      } else {
        category = 'ポケモン';
      }
    }

    const href = $el.find('.title a').attr('href') ?? '';
    // 価格は中古価格の専用要素 .text-red から（.item_price 全体には送料案内が混じるため）
    const surugayaPrice = parsePrice($el.find('.item_price .text-red').first().text());
    const surugayaSoldOut = /品切れ/.test($el.find('.item_price').text());
    out.push({
      name, cardNumber, rarity, category, energyType,
      surugayaUrl: href, surugayaPrice, surugayaSoldOut,
    });
  });
  return { cards: out, raw };
}

async function collectPack(p: PackDef): Promise<void> {
  const seen = new Set<string>();
  const cards: MasterCard[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${SEARCH}?category=&search_word=${encodeURIComponent(p.keyword)}&page=${page}`;
    let html: string;
    try {
      html = await politeGet(url);
    } catch (e) {
      // 末尾を超えると駿河屋は404を返す → ページ終端として扱う
      console.log(`  page ${page}: 取得終了 (${(e as Error).message})`);
      break;
    }
    const { cards: items, raw } = parsePage(html, p.match);
    if (raw === 0) break; // 結果ページ終端（これ以上ページ無し）

    let added = 0;
    for (const c of items) {
      const key = `${c.cardNumber}__${raritySlug(c.rarity)}`; // ID基準で一意化
      if (seen.has(key)) continue;
      seen.add(key);
      cards.push(c);
      added++;
    }
    // シングルが0でも結果(raw)が続く限りページを進める（封入品等が混在する弾への対応）
    console.log(`  page ${page}: raw${raw} 該当${items.length} 新規${added} (累計${cards.length})`);
    await sleep(1500); // 礼儀的レート制限
  }

  if (cards.length === 0) {
    console.log(`- ${p.name}: シングル0件（スキップ）`);
    return;
  }

  // 型番→レアリティ順で整列
  cards.sort((a, b) => a.cardNumber.localeCompare(b.cardNumber) || a.rarity.localeCompare(b.rarity));

  await mkdir(OUT_DIR, { recursive: true });
  const data = {
    pack: p.name,
    packSlug: p.slug,
    source: 'surugaya',
    collectedAt: new Date().toISOString(),
    count: cards.length,
    cards: cards.map((c) => ({ ...c, raritySlug: raritySlug(c.rarity) })),
  };
  await writeFile(path.join(OUT_DIR, `${p.slug}.json`), JSON.stringify(data, null, 2) + '\n');

  // 当日の価格をパック別履歴に追記（=価格推移の蓄積。全カードに毎日貯まる）
  await appendPackHistory(p, data.cards);

  console.log(`✓ ${p.name}: ${cards.length}件 → data/cards/${p.slug}.json`);
}

interface PackHistory {
  packSlug: string;
  points: { date: string; prices: Record<string, number> }[];
}

/** 当日価格を data/history/<packSlug>.json に追記（同日は上書き） */
async function appendPackHistory(
  p: PackDef,
  cards: (MasterCard & { raritySlug: string })[],
): Promise<void> {
  await mkdir(HISTORY_DIR, { recursive: true });
  const f = path.join(HISTORY_DIR, `${p.slug}.json`);
  let h: PackHistory = { packSlug: p.slug, points: [] };
  if (existsSync(f)) h = JSON.parse(await readFile(f, 'utf-8')) as PackHistory;

  const prices: Record<string, number> = {};
  for (const c of cards) {
    if (c.surugayaPrice == null) continue;
    const id = `${p.setCode.toLowerCase()}-${c.cardNumber.replace(/\//g, '-')}-${c.raritySlug}`;
    prices[id] = c.surugayaPrice;
  }

  h.points = h.points.filter((pt) => pt.date !== TODAY);
  h.points.push({ date: TODAY, prices });
  h.points.sort((a, b) => a.date.localeCompare(b.date));
  await writeFile(f, JSON.stringify(h, null, 2) + '\n');
}

async function main(): Promise<void> {
  const targets = await loadTargets();
  console.log(`対象 ${targets.length} パックを収集します`);
  for (const p of targets) {
    console.log(`== ${p.name} (${p.setCode}) を収集 ==`);
    try {
      await collectPack(p);
    } catch (e) {
      console.error(`✗ ${p.name}: ${(e as Error).message}`);
    }
  }
  console.log('カードマスター収集 完了');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
