import fs from 'node:fs';
import path from 'node:path';
import type { Card, CardSeries, PricePoint, ShopPrice } from './types';
import { allPacks } from './packs';
import { cardSellHistory } from './history';
import nameSlugs from '../../data/name-slugs.json';

const SLUGS = nameSlugs as Record<string, string>;

/** 処理仕様の括弧（ミラー/パラレル/ランク等）を除去して種名へ正規化。build-slugs.ts と一致させること。 */
function normalizeName(name: string): string {
  return name
    .replace(/【[^】]*】/g, '') // 【ランクB】等の状態表記
    .replace(/[（(][^）)]*(ミラー|パラレル|ランク)[^）)]*[)）]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// data/cards/<packSlug>.json（collect-cards.ts が生成するマスター）の型
interface MasterCard {
  name: string;
  cardNumber: string;
  rarity: string;
  raritySlug: string;
  category: string;
  energyType?: string;
  surugayaUrl: string;
  surugayaPrice: number | null;
  surugayaBuyPrice?: number | null;
  surugayaSoldOut?: boolean;
}
interface MasterFile {
  pack: string;
  packSlug: string;
  cards: MasterCard[];
}

const CARDS_DIR = path.resolve(process.cwd(), 'data/cards');
const PLACEHOLDER = '/images/cards/placeholder.svg';

/** カードID（＝個別ページURL slug）。例: M1L + 091/063 + sar → m1l-091-063-sar */
function makeId(setCode: string, cardNumber: string, raritySlug: string): string {
  return `${setCode.toLowerCase()}-${cardNumber.replace(/\//g, '-')}-${raritySlug}`;
}

/**
 * 駿河屋の実カード画像URL。商品URL末尾の商品ID(例 GU362717)から photo.php を組み立てる。
 * 駿河屋がCDN画像へ302リダイレクトする（出典明記＋リンクバックで掲載）。取れなければプレースホルダー。
 */
const SURUGAYA_ORIGIN = 'https://www.suruga-ya.jp';

// size=m … 139×192(一覧/サムネ用) / size=l … 740×1024(詳細ページ用の高解像度)
function surugayaImage(surugayaUrl: string, size: 'm' | 'l' = 'm'): string {
  const pid = surugayaUrl.split('?')[0].match(/([A-Za-z]+\d+)$/)?.[1];
  return pid ? `${SURUGAYA_ORIGIN}/database/photo.php?shinaban=${pid}&size=${size}` : PLACEHOLDER;
}

/** 駿河屋の商品URLを絶対URL化（データは相対パス `/product/...` で保存されている） */
function surugayaProductUrl(surugayaUrl: string): string {
  if (!surugayaUrl) return SURUGAYA_ORIGIN;
  try {
    return new URL(surugayaUrl, SURUGAYA_ORIGIN).href;
  } catch {
    return SURUGAYA_ORIGIN;
  }
}

/** パック別履歴から PricePoint[] に変換（買取は未取得＝0） */
function historyPoints(packSlug: string, id: string): PricePoint[] {
  return cardSellHistory(packSlug, id).map((p) => ({ date: p.date, sell: p.sell, buy: 0 }));
}

function buildCards(): Card[] {
  if (!fs.existsSync(CARDS_DIR)) return [];
  const files = fs.readdirSync(CARDS_DIR).filter((f) => f.endsWith('.json'));
  const out: Card[] = [];
  const seenIds = new Set<string>();

  for (const f of files) {
    const mf = JSON.parse(fs.readFileSync(path.join(CARDS_DIR, f), 'utf-8')) as MasterFile;
    const pack = allPacks.find((p) => p.slug === mf.packSlug);
    const setCode = pack?.setCode ?? mf.packSlug;

    for (const m of mf.cards) {
      const id = makeId(setCode, m.cardNumber, m.raritySlug);
      if (seenIds.has(id)) continue; // ID重複はスキップ（getStaticPaths重複回避）
      seenIds.add(id);
      const history = historyPoints(mf.packSlug, id);
      const name = normalizeName(m.name);
      const cardParam = `${m.cardNumber.replace(/\//g, '-')}-${m.raritySlug}`;
      const nameSlug = SLUGS[name] ?? id;

      // 現在価格: 履歴があれば最新、なければ駿河屋スナップショット
      const sellPrice = history.length ? history[history.length - 1].sell : m.surugayaPrice;

      // 販売ショップ: 当面は駿河屋のみ（実データ）。履歴に他ショップがあれば将来マージ。
      const sellShops: ShopPrice[] =
        m.surugayaPrice != null
          ? [
              {
                shop: '駿河屋',
                price: m.surugayaPrice,
                url: surugayaProductUrl(m.surugayaUrl),
                real: true,
                note: m.surugayaSoldOut ? '品切れ' : undefined,
              },
            ]
          : [];

      out.push({
        id,
        slug: id,
        path: `/list/${nameSlug}/${cardParam}/`,
        nameSlug,
        name,
        rarity: m.rarity,
        raritySlug: m.raritySlug,
        category: m.category,
        energyType: m.energyType ?? '',
        cardNumber: m.cardNumber,
        illustrator: '',
        pack: mf.pack,
        packSlug: mf.packSlug,
        image: surugayaImage(m.surugayaUrl),
        imageLarge: surugayaImage(m.surugayaUrl, 'l'),
        sellPrice,
        sellPriceHigh: null,
        buyPrice: m.surugayaBuyPrice ?? null,
        buyPriceHigh: null,
        highDate: '',
        soldOut: m.surugayaSoldOut ?? false,
        sellShops,
        buyShops: [],
        history,
      });
    }
  }
  return out;
}

export const allCards: Card[] = buildCards();

// ===== 価格の基準日（履歴データの最新日付を採用。ハードコードしない） =====
/** 全履歴中の最新日付 (YYYY-MM-DD)。履歴が無ければ空文字 */
export const latestHistoryDate: string = (() => {
  let max = '';
  for (const c of allCards) {
    const last = c.history[c.history.length - 1]?.date;
    if (last && last > max) max = last;
  }
  return max;
})();
/** 表示用の基準日（例: 2026年6月18日）。履歴が無ければ「調査中」 */
export const priceAsOf: string = latestHistoryDate
  ? `${latestHistoryDate.slice(0, 4)}年${Number(latestHistoryDate.slice(5, 7))}月${Number(
      latestHistoryDate.slice(8, 10),
    )}日`
  : '調査中';

// ===== カード名でグルーピング（シリーズ） =====
// series.slug ＝ ポケモン名スラッグ（/list/[slug] のパラメータ）
export const series: CardSeries[] = (() => {
  const map = new Map<string, Card[]>();
  for (const c of allCards) {
    const arr = map.get(c.name) ?? [];
    arr.push(c);
    map.set(c.name, arr);
  }
  return [...map.entries()].map(([name, variants]) => ({
    slug: variants[0].nameSlug,
    name,
    variants: variants.sort((a, b) => a.cardNumber.localeCompare(b.cardNumber)),
  }));
})();

// ===== 取得ヘルパー =====

/** nameSlug からシリーズを取得（/list/[slug]） */
export function getSeriesBySlug(slug: string): CardSeries | undefined {
  return series.find((s) => s.slug === slug);
}

export function getSeriesByName(name: string): CardSeries | undefined {
  return series.find((s) => s.name === name);
}

/** ポケモンのシリーズのみ（/list 一覧用）。50音/型番順は呼び出し側で */
export function pokemonSeries(): CardSeries[] {
  return series.filter((s) => s.variants[0]?.category === 'ポケモン');
}

/** パックに属するシリーズ（variantsをそのパックのものだけに絞る） */
export function seriesByPack(packSlug: string): CardSeries[] {
  return series
    .map((s) => ({ ...s, variants: s.variants.filter((v) => v.packSlug === packSlug) }))
    .filter((s) => s.variants.length > 0);
}

/** パックページ1ページあたりの表示枚数 */
export const PACK_PAGE_SIZE = 100;

/** パック内の全カード（型番順・フラット）。パックページのページネーション用 */
export function packVariants(packSlug: string): Card[] {
  return allCards
    .filter((c) => c.packSlug === packSlug)
    .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber) || a.raritySlug.localeCompare(b.raritySlug));
}

/** 価格が取得済みのカードを高い順に（個別カード単位のランキング） */
export function topByPrice(n = 50): Card[] {
  return allCards
    .filter((c) => c.sellPrice != null)
    .sort((a, b) => (b.sellPrice ?? 0) - (a.sellPrice ?? 0))
    .slice(0, n);
}

// ===== 関連リンク用（各ポケモン名につき最高値の1枚に集約して前計算） =====
// カード詳細/ポケモン別ページごとに全カード走査すると重いので、モジュール初期化で1度だけ作る。
/** 価格取得済みカードを高額順に */
const pricedDesc: Card[] = allCards
  .filter((c) => c.sellPrice != null)
  .sort((a, b) => (b.sellPrice ?? 0) - (a.sellPrice ?? 0));
/** 各カード名につき最高値の1枚（高額順）。関連リンクで同名の重複を避ける */
const distinctByName: Card[] = (() => {
  const seen = new Set<string>();
  const out: Card[] = [];
  for (const c of pricedDesc) {
    if (seen.has(c.name)) continue;
    seen.add(c.name);
    out.push(c);
  }
  return out;
})();
/** 同上を価格の昇順に（同価格帯検索の二分探索用） */
const distinctByNameAsc: Card[] = distinctByName.slice().sort((a, b) => (a.sellPrice ?? 0) - (b.sellPrice ?? 0));
/** タイプ（エネルギー）別の高額順リスト（名前重複除去済み） */
const byType = new Map<string, Card[]>();
for (const c of distinctByName) {
  if (!c.energyType) continue;
  const arr = byType.get(c.energyType) ?? [];
  arr.push(c);
  byType.set(c.energyType, arr);
}

/** 人気カード＝価格の高いカード（名前重複除去）。関連リンク用 */
export function popularByName(limit = 6, excludeName?: string): Card[] {
  return distinctByName.filter((c) => c.name !== excludeName).slice(0, limit);
}

/** 同じタイプ（エネルギー）のカードを高額順で（名前重複除去）。関連リンク用 */
export function sameTypeByName(energyType: string | undefined, limit = 6, excludeName?: string): Card[] {
  if (!energyType) return [];
  return (byType.get(energyType) ?? []).filter((c) => c.name !== excludeName).slice(0, limit);
}

/** 指定価格に近い順のカード（名前重複除去）。二分探索で近傍を収集。関連リンク用 */
export function similarPriceByName(price: number | null, limit = 6, excludeName?: string): Card[] {
  if (price == null) return [];
  const arr = distinctByNameAsc;
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if ((arr[mid].sellPrice ?? 0) < price) lo = mid + 1;
    else hi = mid;
  }
  let i = lo - 1;
  let j = lo;
  const out: Card[] = [];
  while (out.length < limit && (i >= 0 || j < arr.length)) {
    const di = i >= 0 ? Math.abs((arr[i].sellPrice ?? 0) - price) : Infinity;
    const dj = j < arr.length ? Math.abs((arr[j].sellPrice ?? 0) - price) : Infinity;
    const pick = di <= dj ? arr[i--] : arr[j++];
    if (pick.name === excludeName) continue;
    out.push(pick);
  }
  return out;
}
