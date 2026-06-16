import type { CardQuery } from './types.ts';

// 取得対象カード。サイト側カードの slug と一致させること。
// 横展開時はここに追加し、各 surugaya.number/rarity を埋める。
export const targets: CardQuery[] = [
  {
    slug: 'lillie-no-kesshin-sar',
    name: 'リーリエの決心',
    surugaya: { number: '091/063', rarity: 'SAR' },
  },
];
