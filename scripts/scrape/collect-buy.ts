// 駿河屋の「買取価格」を収集する（商品別ページ kaitori_detail から）。
//   販売(collect-cards.ts)は検索一覧から一括取得できるが、買取は商品単位ページのみ。
//   全カードは重いので、販売価格が閾値以上の高額カードに限定して取得する。
//   既存の data/cards/<pack>.json を読み、surugayaBuyPrice を追記して上書き保存。
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { politeGet, sleep, HttpError } from './http.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = path.resolve(__dirname, '../../data/cards');
const BUY_THRESHOLD = 1000; // この販売価格(円)以上のカードだけ買取価格を取得
const KAITORI = 'https://www.suruga-ya.jp/kaitori/kaitori_detail';

interface MasterCard {
  name: string;
  cardNumber: string;
  surugayaUrl: string;
  surugayaPrice: number | null;
  surugayaBuyPrice?: number | null;
  [k: string]: unknown;
}
interface MasterFile {
  packSlug: string;
  cards: MasterCard[];
  [k: string]: unknown;
}

/** 商品URLから駿河屋の商品ID（例 GU362717）を取り出す */
function productId(url: string): string | null {
  const m = url.split('?')[0].match(/([A-Za-z]+\d+)$/);
  return m ? m[1] : null;
}

/** kaitori_detail から買取価格を取得。買取停止/該当なしは null */
async function fetchBuyPrice(pid: string): Promise<number | null> {
  let html: string;
  try {
    html = await politeGet(`${KAITORI}/${pid}`);
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) return null;
    throw e;
  }
  // 買取価格は <font class="text-price-custom">22,000円</font> のようにタグが挟まるため、
  // 先にタグを除去してテキスト化してから「買取価格 … 円」を拾う。
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const m = text.match(/買取価格[^0-9]{0,12}([0-9,]+)\s*円/);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const files = (await readdir(CARDS_DIR))
    .filter((f) => f.endsWith('.json'))
    .filter((f) => args.length === 0 || args.includes(f.replace('.json', '')));

  let totalFetched = 0;
  for (const f of files) {
    const fp = path.join(CARDS_DIR, f);
    const mf = JSON.parse(await readFile(fp, 'utf-8')) as MasterFile;
    const targets = mf.cards.filter((c) => (c.surugayaPrice ?? 0) >= BUY_THRESHOLD);
    if (targets.length === 0) {
      console.log(`- ${mf.packSlug}: 対象0`);
      continue;
    }
    console.log(`== ${mf.packSlug}: 買取取得 ${targets.length}枚 ==`);
    let got = 0;
    for (const c of targets) {
      const pid = productId(c.surugayaUrl);
      if (!pid) {
        c.surugayaBuyPrice = null;
        continue;
      }
      try {
        c.surugayaBuyPrice = await fetchBuyPrice(pid);
        if (c.surugayaBuyPrice != null) got++;
      } catch (e) {
        console.error(`  ✗ ${c.cardNumber} ${c.name}: ${(e as Error).message}`);
        c.surugayaBuyPrice = null;
      }
      await sleep(1500); // 礼儀的レート制限
    }
    await writeFile(fp, JSON.stringify(mf, null, 2) + '\n');
    totalFetched += got;
    console.log(`✓ ${mf.packSlug}: 買取あり ${got}/${targets.length}`);
  }
  console.log(`買取収集 完了（買取価格あり 合計 ${totalFetched}枚）`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
