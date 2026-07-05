import type { APIRoute } from 'astro';
import { allCards } from '../data/cards';

// カード検索用の軽量インデックス（クライアントで部分一致フィルタに使う）。
// キーは短縮: n=名前, c=型番, r=レア, p=詳細パス, k=パック名, s=販売, b=買取, i=駿河屋画像ID
export const GET: APIRoute = () => {
  const seen = new Set<string>();
  const items: Array<Record<string, unknown>> = [];
  for (const c of allCards) {
    if (seen.has(c.path)) continue;
    seen.add(c.path);
    const pid = c.image.match(/shinaban=([A-Za-z0-9]+)/)?.[1] ?? '';
    items.push({
      n: c.name,
      c: c.cardNumber,
      r: c.rarity,
      p: c.path,
      k: c.pack,
      s: c.sellPrice,
      b: c.buyPrice,
      i: pid,
    });
  }
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
