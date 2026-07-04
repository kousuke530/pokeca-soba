// 提携先ショップ（アフィリエイト）。
// 販売/買取の別・提携ASPは Obsidian「Projects/personal/pokeca-affiliate.md」の確定表(2026-07-04)に準拠。
// url は現状「各ショップの公式サイト」。A8.net等の実アフィリエイトリンクが用意でき次第、url を差し替える。
export interface AffiliateShop {
  name: string;
  /** 遷移先URL（本番は各提携先のアフィリエイトリンクに差し替え予定） */
  url: string;
  /** 提携ASP（表示はしないが管理用に保持） */
  via: string;
}

/** カードを「買う」＝販売ショップ */
export const purchaseShops: AffiliateShop[] = [
  { name: '駿河屋', url: 'https://www.suruga-ya.jp/', via: '駿河屋アフィリエイト' },
  { name: 'カードラッシュ', url: 'https://www.cardrush-pokemon.jp/', via: 'A8.net' },
  { name: 'カーナベル', url: 'https://www.ka-nabell.com/', via: 'A8.net' },
  { name: '遊々亭', url: 'https://yuyu-tei.jp/', via: 'A8.net' },
  { name: 'トレトク', url: 'https://www.toretoku.jp/', via: 'A8.net' },
  { name: 'ウリウリトレカ', url: 'https://hanbaiuriuritoreca.com/', via: 'A8.net' },
  { name: 'CARDMAX', url: 'https://www.cardmax.jp/', via: 'A8.net' },
  { name: 'メルカリ', url: 'https://jp.mercari.com/', via: 'メルカリアンバサダー' },
  { name: 'Amazon', url: 'https://www.amazon.co.jp/', via: 'Amazonアソシエイト' },
];

/** カードを「売る」＝買取ショップ */
export const buybackShops: AffiliateShop[] = [
  { name: 'カーナベル', url: 'https://www.ka-nabell.com/', via: 'A8.net' },
  { name: '遊々亭', url: 'https://yuyu-tei.jp/cart/buy', via: 'A8.net' },
  { name: 'トレトク', url: 'https://kaitori-toretoku.jp/', via: 'A8.net' },
  { name: 'ウリウリトレカ', url: 'https://uriuritoreca.com/', via: 'A8.net' },
  { name: 'ふるいち', url: 'https://www.furu1.net/kaitori.html', via: 'A8.net' },
  { name: 'もえたく！', url: 'https://www.netoff.co.jp/moetaku/', via: 'アクセストレード' },
];
