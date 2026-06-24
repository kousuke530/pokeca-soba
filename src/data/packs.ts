import fs from 'node:fs';
import path from 'node:path';
import type { Pack } from './types';

// パック登録簿（data/packs.json）。collect-cards.ts と共通の出典。
// setCode はカードID（個別ページURL）の接頭辞。例: M1L + 091/063 + sar → m1l-091-063-sar
const REGISTRY = path.resolve(process.cwd(), 'data/packs.json');
const CARDS_DIR = path.resolve(process.cwd(), 'data/cards');

interface PackEntry extends Pack {
  keyword?: string;
  match?: string;
}

const registry: Pack[] = (JSON.parse(fs.readFileSync(REGISTRY, 'utf-8')) as PackEntry[]).map((p) => ({
  slug: p.slug,
  setCode: p.setCode,
  name: p.name,
  shortName: p.shortName,
  releaseDate: p.releaseDate,
}));

/** 全登録パック（未収集含む） */
export const allPacks: Pack[] = registry;

/** 収集済み（data/cards/<slug>.json が存在）パックのみ。発売日の新しい順 */
export const packs: Pack[] = registry
  .filter((p) => fs.existsSync(path.join(CARDS_DIR, `${p.slug}.json`)))
  .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

export function getPack(slug: string): Pack | undefined {
  return registry.find((p) => p.slug === slug);
}
