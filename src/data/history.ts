// ビルド時に data/history/<slug>.json（スクレイパーが蓄積）を読むヘルパー。
// 実データが無いカードは null を返し、呼び出し側はダミーにフォールバックする。
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export interface ScrapedShop {
  shop: string;
  sell: number | null;
  buy: number | null;
  url: string;
  fetchedAt: string;
}
export interface DailyPoint {
  date: string;
  shops: ScrapedShop[];
}
export interface History {
  slug: string;
  points: DailyPoint[];
}

const HISTORY_DIR = path.resolve(process.cwd(), 'data/history');

/** カードの蓄積履歴を読む（無ければ null） */
export function loadHistory(slug: string): History | null {
  const f = path.join(HISTORY_DIR, `${slug}.json`);
  if (!existsSync(f)) return null;
  try {
    const h = JSON.parse(readFileSync(f, 'utf-8')) as History;
    return h.points?.length ? h : null;
  } catch {
    return null;
  }
}
