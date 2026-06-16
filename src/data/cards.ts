import type { Card, CardSeries, PricePoint, ShopPrice } from './types';
import { loadHistory } from './history';

/**
 * ダミーの価格履歴を生成するヘルパー。
 * 実データ投入時はこの関数を実APIの戻り値に置き換える。
 * @param days   生成する日数
 * @param endSell 最終日の販売価格
 * @param endBuy  最終日の買取価格
 * @param seed    バリエーションごとの揺らぎ用シード
 */
function genHistory(days: number, endSell: number, endBuy: number, seed = 1): PricePoint[] {
  const points: PricePoint[] = [];
  const end = new Date('2026-06-15');
  // 開始価格は最終価格より低め（右肩上がりトレンド）に設定
  let sell = Math.round(endSell * 0.55);
  let buy = Math.round(endBuy * 0.5);
  const sellStep = (endSell - sell) / days;
  const buyStep = (endBuy - buy) / days;
  for (let i = days; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    // 疑似乱数で上下にノイズを付与
    const wobble = Math.sin((i + seed) * 1.7) * 0.04;
    const sv = Math.round((sell + sellStep * (days - i)) * (1 + wobble) / 100) * 100;
    const bv = Math.round((buy + buyStep * (days - i)) * (1 + wobble) / 100) * 100;
    points.push({
      date: d.toISOString().slice(0, 10),
      sell: Math.max(sv, 100),
      buy: Math.max(bv, 100),
    });
  }
  return points;
}

// ===== リーリエの決心（メガブレイブ収録） =====

const lillieSar: Card = {
  slug: 'lillie-no-kesshin-sar',
  name: 'リーリエの決心',
  rarity: 'SAR',
  category: 'サポート',
  cardNumber: 'M1L-091/063',
  illustrator: 'satoma',
  pack: '拡張パック「メガブレイブ」',
  image: '/images/cards/lillie-sar.svg',
  sellPrice: 37800,
  sellPriceHigh: 39800,
  buyPrice: 25000,
  buyPriceHigh: 35000,
  highDate: '2026-04-16',
  sellShops: [
    { shop: 'カードラッシュ', price: 37800, url: '#aff-cardrush' },
    { shop: 'メルカリ', price: 36500, url: '#aff-mercari' },
    { shop: 'CARDMAX', price: 38200, url: '#aff-cardmax' },
    { shop: '遊々亭', price: 39000, url: '#aff-yuyutei' },
    { shop: 'トレトク', price: 38800, url: '#aff-toretoku' },
    { shop: '駿河屋', price: 35980, url: '#aff-suruga' },
    { shop: 'ふるいち', price: 39800, url: '#aff-furuichi' },
    { shop: 'ウリウリトレカ', price: 37500, url: '#aff-uriuri' },
    { shop: 'カーナベル', price: 38600, url: '#aff-carnabel' },
    { shop: 'Amazon', price: 41200, url: '#aff-amazon' },
  ],
  buyShops: [
    { shop: 'もえたく', price: 25000, url: '#aff-moetaku' },
    { shop: '遊々亭', price: 24000, url: '#aff-yuyutei-buy' },
    { shop: 'ウリウリトレカ', price: 23500, url: '#aff-uriuri-buy' },
    { shop: 'トレトク', price: 22800, url: '#aff-toretoku-buy' },
    { shop: 'カーナベル', price: 21000, url: '#aff-carnabel-buy' },
  ],
  history: genHistory(120, 37800, 25000, 1),
};

const lillieAr: Card = {
  slug: 'lillie-no-kesshin-ar',
  name: 'リーリエの決心',
  rarity: 'AR',
  category: 'サポート',
  cardNumber: 'M1L-075/063',
  illustrator: 'satoma',
  pack: '拡張パック「メガブレイブ」',
  image: '/images/cards/lillie-ar.svg',
  sellPrice: 4800,
  sellPriceHigh: 6200,
  buyPrice: 2800,
  buyPriceHigh: 4500,
  highDate: '2026-04-16',
  sellShops: [
    { shop: 'カードラッシュ', price: 4800, url: '#aff-cardrush' },
    { shop: 'メルカリ', price: 4500, url: '#aff-mercari' },
    { shop: 'CARDMAX', price: 4980, url: '#aff-cardmax' },
    { shop: '遊々亭', price: 5200, url: '#aff-yuyutei' },
    { shop: '駿河屋', price: 4380, url: '#aff-suruga' },
    { shop: 'Amazon', price: 5800, url: '#aff-amazon' },
  ],
  buyShops: [
    { shop: 'もえたく', price: 2800, url: '#aff-moetaku' },
    { shop: '遊々亭', price: 2600, url: '#aff-yuyutei-buy' },
    { shop: 'トレトク', price: 2400, url: '#aff-toretoku-buy' },
  ],
  history: genHistory(120, 4800, 2800, 7),
};

const lillieMaster: Card = {
  slug: 'lillie-no-kesshin-mb',
  name: 'リーリエの決心',
  rarity: 'マスターボール',
  category: 'サポート',
  cardNumber: 'M1L-091/063',
  illustrator: 'satoma',
  pack: '拡張パック「メガブレイブ」',
  image: '/images/cards/lillie-mb.svg',
  sellPrice: 128000,
  sellPriceHigh: 145000,
  buyPrice: 95000,
  buyPriceHigh: 120000,
  highDate: '2026-04-16',
  sellShops: [
    { shop: 'カードラッシュ', price: 128000, url: '#aff-cardrush' },
    { shop: 'メルカリ', price: 119800, url: '#aff-mercari' },
    { shop: '遊々亭', price: 132000, url: '#aff-yuyutei' },
    { shop: '駿河屋', price: 124800, url: '#aff-suruga' },
    { shop: 'Amazon', price: 145000, url: '#aff-amazon' },
  ],
  buyShops: [
    { shop: 'もえたく', price: 95000, url: '#aff-moetaku' },
    { shop: '遊々亭', price: 90000, url: '#aff-yuyutei-buy' },
    { shop: 'ウリウリトレカ', price: 88000, url: '#aff-uriuri-buy' },
  ],
  history: genHistory(120, 128000, 95000, 3),
};

/**
 * スクレイパーが蓄積した実データ（data/history/<slug>.json）をカードへ反映する。
 * - 取得済みショップの販売価格・URLを実値へ差し替え（real:true でバッジ表示）
 * - 価格推移グラフを実履歴に置換、ヘッドライン販売価格を実最安に更新
 * 実データが無いカードはダミーのまま（フォールバック）。
 */
function applyLive(card: Card): void {
  const h = loadHistory(card.slug);
  if (!h) return;

  const latest = h.points[h.points.length - 1];
  for (const sp of latest.shops) {
    if (sp.sell == null) continue;
    const entry: ShopPrice = { shop: sp.shop, price: sp.sell, url: sp.url, real: true };
    const idx = card.sellShops.findIndex((s) => s.shop === sp.shop);
    if (idx >= 0) card.sellShops[idx] = entry;
    else card.sellShops.unshift(entry);
  }

  const real: PricePoint[] = h.points
    .map((p) => {
      const sells = p.shops.map((s) => s.sell).filter((v): v is number => v != null);
      const buys = p.shops.map((s) => s.buy).filter((v): v is number => v != null);
      return sells.length
        ? { date: p.date, sell: Math.min(...sells), buy: buys.length ? Math.max(...buys) : 0 }
        : null;
    })
    .filter((x): x is PricePoint => x !== null);

  if (real.length) {
    card.history = real;
    card.sellPrice = real[real.length - 1].sell;
  }
}

[lillieMaster, lillieSar, lillieAr].forEach(applyLive);

export const series: CardSeries[] = [
  {
    slug: 'lillie-no-kesshin',
    name: 'リーリエの決心',
    variants: [lillieMaster, lillieSar, lillieAr],
  },
];

/** 全カードをフラットに取得（個別ページ生成用） */
export const allCards: Card[] = series.flatMap((s) => s.variants);

/** スラッグからカードを取得 */
export function getCard(slug: string): Card | undefined {
  return allCards.find((c) => c.slug === slug);
}

/** スラッグからシリーズを取得 */
export function getSeries(slug: string): CardSeries | undefined {
  return series.find((s) => s.slug === slug);
}
