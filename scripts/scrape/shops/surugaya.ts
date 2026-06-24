// 駿河屋（suruga-ya.jp）アダプタ。
// 検索結果ページから対象カードの販売価格（中古・最安）と商品URLを取得する。
// 駿河屋は販売（中古/新品）が主。買取価格は別系統のため当面 null。
import * as cheerio from 'cheerio';
import { politeGet } from '../http.ts';
import type { CardQuery, ScrapedPrice, ShopAdapter } from '../types.ts';

const SEARCH_URL = 'https://www.suruga-ya.jp/search';

/** "￥9,980" 等から数値を取り出す */
function parsePrice(text: string): number | null {
  const m = text.replace(/[,，\s]/g, '').match(/(\d+)\s*円|￥\s*(\d+)|(\d{3,})/);
  if (!m) return null;
  const n = Number(m[1] ?? m[2] ?? m[3]);
  return Number.isFinite(n) ? n : null;
}

export const surugaya: ShopAdapter = {
  shop: '駿河屋',

  async fetchPrice(card: CardQuery): Promise<ScrapedPrice | null> {
    const q = card.surugaya;
    if (!q) return null;

    const url = `${SEARCH_URL}?category=&search_word=${encodeURIComponent(card.name)}`;
    const html = await politeGet(url);
    const $ = cheerio.load(html);

    let best: ScrapedPrice | null = null;

    // 商品コンテナ .item ごと（品切れ時に隣の価格を誤取得しないようコンテナ内で完結）
    $('.item').each((_, el) => {
      const $el = $(el);
      const name = $el.find('.product-name').text().trim();
      if (!name) return;

      // 鑑定品（PSA等）・オリパは除外（生カード相場を採る）
      if (/PSA|MINT|鑑定|オリパ|オリジナルパック/i.test(name)) return;
      // 型番一致
      if (!name.includes(q.number)) return;
      // レアリティ一致（指定時）
      if (q.rarity && !new RegExp(`\\[${q.rarity}\\]`).test(name)) return;

      const href = $el.find('.title a').attr('href') ?? '';
      // 価格は中古価格の専用要素 .text-red から（.item_price 全体には送料案内が混じるため）
      const priceText = $el.find('.item_price .text-red').first().text();
      const sell = parsePrice(priceText);
      if (sell == null) return;

      // 最安の中古を採用
      if (best == null || best.sell == null || sell < best.sell) {
        best = {
          shop: '駿河屋',
          sell,
          buy: null,
          url: href,
          fetchedAt: new Date().toISOString(),
        };
      }
    });

    return best;
  },
};
