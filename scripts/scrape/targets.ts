import type { CardQuery } from './types.ts';

// 価格スクレイピング対象カード。slug は data/history/<slug>.json のキー＝サイト側 Card.id と一致させる。
// 横展開時はここに追加（将来は data/cards から自動生成も可）。
export const targets: CardQuery[] = [
  {
    slug: 'm1l-091-063-sar',
    name: 'リーリエの決心',
    surugaya: { number: '091/063', rarity: 'SAR' },
  },
];
