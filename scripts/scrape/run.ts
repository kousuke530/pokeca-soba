// 毎日のスクレイピング・オーケストレータ。
//   取得 → data/history/<slug>.json に当日分を追記（=価格推移の蓄積）
// 横展開: adapters に各ショップアダプタを足すだけ。
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { targets } from './targets.ts';
import { surugaya } from './shops/surugaya.ts';
import { sleep } from './http.ts';
import type { ScrapedPrice, ShopAdapter } from './types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_DIR = path.resolve(__dirname, '../../data/history');

// 有効なショップアダプタ（ここに足すと横展開）
const adapters: ShopAdapter[] = [surugaya];

const today = new Date().toISOString().slice(0, 10);

interface DailyPoint {
  date: string;
  shops: ScrapedPrice[];
}
interface History {
  slug: string;
  points: DailyPoint[];
}

async function loadHistory(slug: string): Promise<History> {
  const f = path.join(HISTORY_DIR, `${slug}.json`);
  if (existsSync(f)) return JSON.parse(await readFile(f, 'utf-8')) as History;
  return { slug, points: [] };
}

async function main(): Promise<void> {
  await mkdir(HISTORY_DIR, { recursive: true });

  for (const card of targets) {
    const results: ScrapedPrice[] = [];

    for (const ad of adapters) {
      try {
        const r = await ad.fetchPrice(card);
        if (r) {
          results.push(r);
          console.log(`✓ ${card.slug} @ ${ad.shop}: 販売 ${r.sell?.toLocaleString()}円  ${r.url}`);
        } else {
          console.log(`- ${card.slug} @ ${ad.shop}: 該当なし`);
        }
      } catch (e) {
        console.error(`✗ ${card.slug} @ ${ad.shop}: ${(e as Error).message}`);
      }
      await sleep(1500); // 礼儀的レート制限
    }

    // 当日分を追記（同日再実行は上書き）
    const hist = await loadHistory(card.slug);
    hist.points = hist.points.filter((p) => p.date !== today);
    hist.points.push({ date: today, shops: results });
    hist.points.sort((a, b) => a.date.localeCompare(b.date));
    await writeFile(
      path.join(HISTORY_DIR, `${card.slug}.json`),
      JSON.stringify(hist, null, 2) + '\n',
    );
  }

  console.log('スクレイピング完了');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
