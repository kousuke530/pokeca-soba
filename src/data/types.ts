// ポケカ販売サイトのデータモデル定義。
// 現状はダミーデータ用だが、将来の実データ取得（スクレイピング/API）でも同じ型を使う想定。

/** ショップ1件分の価格＋アフィリエイトリンク */
export interface ShopPrice {
  /** ショップ名（例: カードラッシュ） */
  shop: string;
  /** 価格（円）。在庫なし等で不明な場合は null */
  price: number | null;
  /** アフィリエイトリンク先URL（実データ投入時に差し替え） */
  url: string;
  /** 在庫状況などの補足ラベル（任意。例: 「在庫なし」） */
  note?: string;
  /** スクレイピング等で取得した実データなら true（UIでバッジ表示） */
  real?: boolean;
}

/** 価格履歴の1点（1日分） */
export interface PricePoint {
  /** ISO 日付 (YYYY-MM-DD) */
  date: string;
  /** その日の販売価格（円） */
  sell: number;
  /** その日の買取価格（円） */
  buy: number;
}

/** カード1枚（1レアリティ＝1型番）の情報 */
export interface Card {
  /** URLスラッグ（型番ベースの一意キー） */
  slug: string;
  /** カード名（例: リーリエの決心） */
  name: string;
  /** レアリティ（例: SAR / AR / SR / RR ...） */
  rarity: string;
  /** カード種別（例: サポート / ポケモン / グッズ） */
  category: string;
  /** 型番（例: M1L-091/063） */
  cardNumber: string;
  /** イラストレーター名 */
  illustrator: string;
  /** 収録パック名（例: 拡張パック「メガブレイブ」） */
  pack: string;
  /** カード画像パス（public/ 配下 or 外部URL） */
  image: string;

  /** 現在の販売価格（円） */
  sellPrice: number;
  /** 販売価格の過去最高（円） */
  sellPriceHigh: number;
  /** 現在の買取価格（円） */
  buyPrice: number;
  /** 買取価格の過去最高（円） */
  buyPriceHigh: number;
  /** 過去最高を記録した日付 (YYYY-MM-DD) */
  highDate: string;

  /** 最新販売価格（ショップ別） */
  sellShops: ShopPrice[];
  /** 最新買取価格（ショップ別） */
  buyShops: ShopPrice[];

  /** 価格履歴（古い順） */
  history: PricePoint[];
}

/** カード名でグルーピングしたシリーズ（例: リーリエの決心 全11種） */
export interface CardSeries {
  /** URLスラッグ（カード名ベース） */
  slug: string;
  /** カード名 */
  name: string;
  /** 同名カードのバリエーション一覧 */
  variants: Card[];
}
