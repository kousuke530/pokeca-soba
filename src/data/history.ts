// ビルド時に data/history/<packSlug>.json（パック単位の日次価格履歴）を読むヘルパー。
// 1カード1ファイルだと数千ファイルになるため、パック単位で全カードの価格をまとめて蓄積する。
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export interface PackHistory {
  packSlug: string;
  /** 日次ポイント。prices は { カードID: 販売価格(円) } */
  points: { date: string; prices: Record<string, number> }[];
}

const HISTORY_DIR = path.resolve(process.cwd(), 'data/history');
const cache = new Map<string, PackHistory | null>();

export function loadPackHistory(packSlug: string): PackHistory | null {
  if (cache.has(packSlug)) return cache.get(packSlug) ?? null;
  const f = path.join(HISTORY_DIR, `${packSlug}.json`);
  let h: PackHistory | null = null;
  if (existsSync(f)) {
    try {
      const parsed = JSON.parse(readFileSync(f, 'utf-8')) as PackHistory;
      h = parsed.points?.length ? parsed : null;
    } catch {
      h = null;
    }
  }
  cache.set(packSlug, h);
  return h;
}

/** カードID の日次販売価格系列（古い順） */
export function cardSellHistory(packSlug: string, id: string): { date: string; sell: number }[] {
  const h = loadPackHistory(packSlug);
  if (!h) return [];
  return h.points
    .filter((p) => p.prices[id] != null)
    .map((p) => ({ date: p.date, sell: p.prices[id] }));
}
