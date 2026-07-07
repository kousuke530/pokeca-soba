// 提携先ショップ（アフィリエイト）。
// 販売/買取の別・提携ASPは Obsidian「Projects/personal/pokeca-affiliate.md」の確定表(2026-07-04)に準拠。
// url は現状「各ショップの公式サイト」。A8.net等の実アフィリエイトリンクが用意でき次第、url を差し替える。
import type { Card } from './types';
import { getPack } from './packs';

/** Amazonアソシエイトのトラッキングタグ */
const AMAZON_ASSOCIATE_TAG = 'pokecasoba-22';
/** メルカリアンバサダーのアフィリエイトID（登録者ごとに固定） */
const MERCARI_AFID = '6278273123';
/** トレトク(A8.net)のプログラム固有トラッキングコード */
const TORETOKU_A8MAT = '4B7UT0+EBLGYY+2QOI+1HKDAR';
/** カーナベル(A8.net)のプログラム固有トラッキングコード */
const KANABERU_A8MAT = '4B7UT0+EMB9UY+49YI+HUD03';

/** A8.net経由の遷移リンク（px.a8.net の計測リダイレクト）を組み立てる */
function a8Redirect(a8mat: string, destUrl: string): string {
  return `https://px.a8.net/svt/ejp?a8mat=${a8mat}&a8ejpredirect=${encodeURIComponent(destUrl)}`;
}

/** application/x-www-form-urlencoded 相当（スペースは%20ではなく+）でエンコード */
function formUrlEncode(s: string): string {
  return encodeURIComponent(s).replace(/%20/g, '+');
}

/**
 * カードごとの商品ページURLは持てない（Amazon/メルカリとも個別商品の対応が取れない・
 * メルカリは個別出品が売り切れると即リンク切れになるため）ので、検索結果ページに
 * アフィリエイトパラメータを付けてリンクする。
 */
export function amazonSearchUrl(card: Pick<Card, 'name' | 'rarity' | 'pack' | 'cardNumber'>): string {
  const q = `${card.name} ${card.rarity} ${card.pack} ${card.cardNumber}`;
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(q)}&tag=${AMAZON_ASSOCIATE_TAG}`;
}

export function mercariSearchUrl(card: Pick<Card, 'name' | 'rarity' | 'cardNumber'>): string {
  const q = `${card.name} ${card.rarity} ${card.cardNumber}`;
  return `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}&afid=${MERCARI_AFID}`;
}

/** トレトク「買える」＝販売の検索結果ページ（A8.net経由）へのアフィリエイトリンク */
export function toretokuUrl(card: Pick<Card, 'packSlug' | 'cardNumber'>): string {
  const setCode = getPack(card.packSlug)?.setCode ?? card.packSlug.toUpperCase();
  const kw = formUrlEncode(`${setCode} ${card.cardNumber}`);
  const dest =
    `https://www.toretoku.jp/item?kw=${kw}&sortIndex=&number=&genre=5&kw=${kw}&stock=1&priceFrom=&priceTo=` +
    `&selectRank1=&selectLanguage1=&selectRank5=&selectLanguage5=&selectRank2=&selectLanguage2=` +
    `&selectRank3=&selectLanguage3=&selectRank8=&selectLanguage8=&selectRank6=&selectLanguage6=` +
    `&selectRank9=&selectLanguage9=&selectRank4=&selectLanguage4=` +
    `&1st1=&1st5=&1st2=&1st3=&1st8=&1st6=&1st9=&1st4=&discount=&selectError2=&selectFoil2=`;
  return a8Redirect(TORETOKU_A8MAT, dest);
}

/**
 * カーナベル「買える」＝販売の検索結果ページ（A8.net経由）へのアフィリエイトリンク。
 * 型番での検索は結果が正しく出ないため、カード名のみで検索する。
 */
export function kanaberuUrl(card: Pick<Card, 'name'>): string {
  const dest = `https://www.ka-nabell.com/ec/sell/pokemon/search?keyword=${encodeURIComponent(card.name)}`;
  return a8Redirect(KANABERU_A8MAT, dest);
}

/** カーナベル「売れる」＝買取のトップページ（A8.net経由）。カードごとの絞り込みはなし */
export const kanaberuBuybackUrl = a8Redirect(KANABERU_A8MAT, 'https://www.ka-nabell.com/ec/buy/pokemon');

export interface AffiliateShop {
  name: string;
  /** 遷移先URL（本番は各提携先のアフィリエイトリンクに差し替え予定） */
  url: string;
  /** 提携ASP（表示はしないが管理用に保持） */
  via: string;
  /** アフィリエイト提携が完了しているか。未指定/false は一旦非表示（データは残す） */
  affiliated?: boolean;
}

// 全ショップ（提携状況に関わらずデータとして保持）。affiliated: true のみ表示。
// 未提携（公式URLのみ）のショップは一旦非表示。提携完了時に affiliated: true を付ければ表示される。
const allPurchaseShops: AffiliateShop[] = [
  { name: '駿河屋', url: 'https://www.suruga-ya.jp/', via: '駿河屋アフィリエイト', affiliated: true },
  { name: 'カードラッシュ', url: 'https://www.cardrush-pokemon.jp/', via: 'A8.net' },
  { name: 'カーナベル', url: 'https://www.ka-nabell.com/', via: 'A8.net', affiliated: true },
  { name: '遊々亭', url: 'https://yuyu-tei.jp/', via: 'A8.net' },
  { name: 'トレトク', url: 'https://www.toretoku.jp/', via: 'A8.net', affiliated: true },
  { name: 'ウリウリトレカ', url: 'https://hanbaiuriuritoreca.com/', via: 'A8.net' },
  { name: 'CARDMAX', url: 'https://www.cardmax.jp/', via: 'A8.net' },
  { name: 'メルカリ', url: 'https://jp.mercari.com/', via: 'メルカリアンバサダー', affiliated: true },
  { name: 'Amazon', url: 'https://www.amazon.co.jp/', via: 'Amazonアソシエイト', affiliated: true },
];

const allBuybackShops: AffiliateShop[] = [
  { name: 'カーナベル', url: kanaberuBuybackUrl, via: 'A8.net', affiliated: true },
  { name: '遊々亭', url: 'https://yuyu-tei.jp/cart/buy', via: 'A8.net' },
  { name: 'トレトク', url: 'https://kaitori-toretoku.jp/', via: 'A8.net', affiliated: true },
  { name: 'ウリウリトレカ', url: 'https://uriuritoreca.com/', via: 'A8.net' },
  { name: 'もえたく！', url: 'https://h.accesstrade.net/sp/cc?rk=0100pu0n00ovb4', via: 'アクセストレード', affiliated: true },
];

/** カードを「買う」＝販売ショップ（提携済みのみ表示） */
export const purchaseShops: AffiliateShop[] = allPurchaseShops.filter((s) => s.affiliated);
/** カードを「売る」＝買取ショップ（提携済みのみ表示） */
export const buybackShops: AffiliateShop[] = allBuybackShops.filter((s) => s.affiliated);
