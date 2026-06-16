// スクレイピング層の共通型。
// 各ショップは ShopAdapter を実装する＝横展開時はアダプタを増やすだけ。

/** 取得対象カード1件の指定（ショップごとの突き合わせ情報を持つ） */
export interface CardQuery {
  /** サイト側カードのslug（履歴ファイル名・突き合わせキー） */
  slug: string;
  /** 検索語（カード名） */
  name: string;
  /** 駿河屋用の突き合わせ情報 */
  surugaya?: {
    /** 型番（例: "091/063"） */
    number: string;
    /** レアリティ（例: "SAR"）。指定時は [SAR] を含む商品のみ採用 */
    rarity?: string;
  };
}

/** 1ショップ・1カードの取得結果 */
export interface ScrapedPrice {
  /** ショップ名（例: 駿河屋） */
  shop: string;
  /** 販売価格（円）。取得できなければ null */
  sell: number | null;
  /** 買取価格（円）。取得できなければ null */
  buy: number | null;
  /** 商品ページURL（アフィリエイトリンクのベース） */
  url: string;
  /** 取得時刻 (ISO) */
  fetchedAt: string;
}

/** ショップごとの取得アダプタ。横展開はこのIFを実装して追加する。 */
export interface ShopAdapter {
  shop: string;
  fetchPrice(card: CardQuery): Promise<ScrapedPrice | null>;
}
