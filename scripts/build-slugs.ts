// カード名 → URLスラッグ（/list/<slug>）を生成し data/name-slugs.json に保存する。
//   ポケモン種は Bulbapedia準拠の英語名（data/pokemon-ja-en.json）、
//   辞書に無い名前（最新種・トレーナーズ・特殊フォルム等）はローマ字へフォールバック。
//   日英対応: https://bulbapedia.bulbagarden.net/ の英語名に準拠（sindresorhus/pokemon 由来）。
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = path.resolve(__dirname, '../data/cards');
const MAP_JSON = path.resolve(__dirname, '../data/pokemon-ja-en.json');
const OUT = path.resolve(__dirname, '../data/name-slugs.json');

// ===== かな→ローマ字（Hepburn簡易） =====
const KANA: Record<string, string> = {
  キャ: 'kya', キュ: 'kyu', キョ: 'kyo', シャ: 'sha', シュ: 'shu', ショ: 'sho',
  チャ: 'cha', チュ: 'chu', チョ: 'cho', ニャ: 'nya', ニュ: 'nyu', ニョ: 'nyo',
  ヒャ: 'hya', ヒュ: 'hyu', ヒョ: 'hyo', ミャ: 'mya', ミュ: 'myu', ミョ: 'myo',
  リャ: 'rya', リュ: 'ryu', リョ: 'ryo', ギャ: 'gya', ギュ: 'gyu', ギョ: 'gyo',
  ジャ: 'ja', ジュ: 'ju', ジョ: 'jo', ビャ: 'bya', ビュ: 'byu', ビョ: 'byo',
  ピャ: 'pya', ピュ: 'pyu', ピョ: 'pyo', シェ: 'she', チェ: 'che', ジェ: 'je',
  ティ: 'ti', ディ: 'di', トゥ: 'tu', ドゥ: 'du', ファ: 'fa', フィ: 'fi',
  フェ: 'fe', フォ: 'fo', ウィ: 'wi', ウェ: 'we', ウォ: 'wo', ヴァ: 'va',
  ヴィ: 'vi', ヴェ: 've', ヴォ: 'vo',
  ア: 'a', イ: 'i', ウ: 'u', エ: 'e', オ: 'o', カ: 'ka', キ: 'ki', ク: 'ku',
  ケ: 'ke', コ: 'ko', サ: 'sa', シ: 'shi', ス: 'su', セ: 'se', ソ: 'so',
  タ: 'ta', チ: 'chi', ツ: 'tsu', テ: 'te', ト: 'to', ナ: 'na', ニ: 'ni',
  ヌ: 'nu', ネ: 'ne', ノ: 'no', ハ: 'ha', ヒ: 'hi', フ: 'fu', ヘ: 'he',
  ホ: 'ho', マ: 'ma', ミ: 'mi', ム: 'mu', メ: 'me', モ: 'mo', ヤ: 'ya',
  ユ: 'yu', ヨ: 'yo', ラ: 'ra', リ: 'ri', ル: 'ru', レ: 're', ロ: 'ro',
  ワ: 'wa', ヲ: 'wo', ン: 'n', ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge',
  ゴ: 'go', ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo', ダ: 'da',
  ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do', バ: 'ba', ビ: 'bi', ブ: 'bu',
  ベ: 'be', ボ: 'bo', パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po',
  ヴ: 'vu', ァ: 'a', ィ: 'i', ゥ: 'u', ェ: 'e', ォ: 'o', ャ: 'ya', ュ: 'yu', ョ: 'yo',
};

/** ひらがな→カタカナ */
function toKatakana(s: string): string {
  return s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
}

function toRomaji(input: string): string {
  const s = toKatakana(input);
  let out = '';
  let sokuon = false;
  for (let i = 0; i < s.length; i++) {
    const two = s.slice(i, i + 2);
    let r: string | undefined;
    if (KANA[two]) {
      r = KANA[two];
      i++;
    } else if (s[i] === 'ッ') {
      sokuon = true;
      continue;
    } else if (s[i] === 'ー') {
      continue; // 長音は省略
    } else if (KANA[s[i]]) {
      r = KANA[s[i]];
    } else if (/[a-zA-Z0-9]/.test(s[i])) {
      r = s[i].toLowerCase();
    } else {
      continue; // 漢字等は無視
    }
    if (sokuon && r) {
      out += r[0];
      sokuon = false;
    }
    out += r;
  }
  return out;
}

const REGION: Record<string, string> = {
  ガラル: 'galarian', アローラ: 'alolan', ヒスイ: 'hisuian', パルデア: 'paldean',
};

/** 処理仕様の括弧（ミラー/パラレル/ランク等）を除去して種名へ正規化。cards.ts と一致させること。 */
export function normalizeName(name: string): string {
  return name
    .replace(/【[^】]*】/g, '') // 【ランクB】等の状態表記
    .replace(/[（(][^）)]*(ミラー|パラレル|ランク)[^）)]*[)）]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function slugify(name: string, ja2en: Record<string, string>): string {
  // 括弧・ランク表記を除去
  let s = name.replace(/【[^】]*】/g, '').replace(/[（(][^）)]*[)）]/g, '').trim();

  const parts: string[] = [];
  // メガ
  let mega = false;
  if (/^メガ/.test(s)) { mega = true; s = s.replace(/^メガ/, ''); }
  // 地方フォルム（先頭、スペース区切りもあり）
  let region = '';
  const rm = s.match(/^(ガラル|アローラ|ヒスイ|パルデア)\s*/);
  if (rm) { region = REGION[rm[1]]; s = s.slice(rm[0].length); }
  // 接尾辞（ex/V/VMAX/VSTAR/GX）
  let suffix = '';
  const sm = s.match(/(ex|EX|GX|V|VMAX|VSTAR)$/);
  if (sm) { suffix = sm[1].toLowerCase(); s = s.slice(0, s.length - sm[1].length).trim(); }

  // 種名の解決（「◯◯の△△」=トレーナー所有 にも対応）
  let owner = '';
  let speciesEn = '';
  if (ja2en[s]) {
    speciesEn = ja2en[s];
  } else {
    const om = s.match(/^(.+?)の(.+)$/);
    if (om && ja2en[om[2]]) {
      owner = toRomaji(om[1]);
      speciesEn = ja2en[om[2]];
    }
  }

  if (mega) parts.push('mega');
  if (owner) parts.push(owner);
  if (region) parts.push(region);
  parts.push(speciesEn ? speciesEn.toLowerCase() : toRomaji(s));
  if (suffix) parts.push(suffix);

  let slug = parts.join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'card';
}

async function main(): Promise<void> {
  const ja2en = JSON.parse(await readFile(MAP_JSON, 'utf-8')) as Record<string, string>;
  const names = new Set<string>();
  for (const f of (await readdir(CARDS_DIR)).filter((f) => f.endsWith('.json'))) {
    const mf = JSON.parse(await readFile(path.join(CARDS_DIR, f), 'utf-8')) as {
      cards: { name: string }[];
    };
    for (const c of mf.cards) names.add(normalizeName(c.name));
  }

  const used = new Map<string, number>();
  const map: Record<string, string> = {};
  let romajiCount = 0;
  for (const name of [...names].sort()) {
    let slug = slugify(name, ja2en);
    // 一意化
    if (used.has(slug)) {
      const n = used.get(slug)! + 1;
      used.set(slug, n);
      slug = `${slug}-${n}`;
    } else {
      used.set(slug, 1);
    }
    map[name] = slug;
  }
  // 英語辞書に載らずローマ字化された数（参考）
  for (const name of names) {
    const base = name.replace(/【[^】]*】/g, '').replace(/[（(][^）)]*[)）]/g, '').replace(/^メガ/, '').replace(/(ex|EX|GX|V|VMAX|VSTAR)$/, '').trim();
    if (!ja2en[base] && !ja2en[name]) romajiCount++;
  }

  await writeFile(OUT, JSON.stringify(map, null, 0) + '\n');
  console.log(`name-slugs.json 生成: ${names.size}名（英語名ベース ${names.size - romajiCount} / ローマ字 ~${romajiCount}）`);
  console.log('例:', Object.entries(map).filter(([n]) => /トロピウス|フシギバナ|メガフシギバナ|リーリエの決心|ピカチュウ/.test(n)).slice(0, 6));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
