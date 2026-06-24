import fs from 'node:fs';
import path from 'node:path';
import type { Card, CardSeries, PricePoint, ShopPrice } from './types';
import { allPacks } from './packs';
import { cardSellHistory } from './history';

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
function surugayaImage(surugayaUrl: string): string {
  const pid = surugayaUrl.split('?')[0].match(/([A-Za-z]+\d+)$/)?.[1];
  return pid ? `https://www.suruga-ya.jp/database/photo.php?shinaban=${pid}&size=m` : PLACEHOLDER;
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

      // 現在価格: 履歴があれば最新、なければ駿河屋スナップショット
      const sellPrice = history.length ? history[history.length - 1].sell : m.surugayaPrice;

      // 販売ショップ: 当面は駿河屋のみ（実データ）。履歴に他ショップがあれば将来マージ。
      const sellShops: ShopPrice[] =
        m.surugayaPrice != null
          ? [
              {
                shop: '駿河屋',
                price: m.surugayaPrice,
                url: m.surugayaUrl,
                real: true,
                note: m.surugayaSoldOut ? '品切れ' : undefined,
              },
            ]
          : [];

      out.push({
        id,
        slug: id,
        name: m.name,
        rarity: m.rarity,
        raritySlug: m.raritySlug,
        category: m.category,
        energyType: m.energyType ?? '',
        cardNumber: m.cardNumber,
        illustrator: '',
        pack: mf.pack,
        packSlug: mf.packSlug,
        image: surugayaImage(m.surugayaUrl),
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

// ===== カード名でグルーピング（シリーズ） =====
// series.slug ＝ カード名（/card/[name] のパラメータ。日本語URLはエンコードされる）
export const series: CardSeries[] = (() => {
  const map = new Map<string, Card[]>();
  for (const c of allCards) {
    const arr = map.get(c.name) ?? [];
    arr.push(c);
    map.set(c.name, arr);
  }
  return [...map.entries()].map(([name, variants]) => ({
    slug: name,
    name,
    variants: variants.sort((a, b) => a.cardNumber.localeCompare(b.cardNumber)),
  }));
})();

// ===== 取得ヘルパー =====

export function getCardByCode(code: string): Card | undefined {
  return allCards.find((c) => c.id === code);
}

export function getSeriesByName(name: string): CardSeries | undefined {
  return series.find((s) => s.name === name);
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
