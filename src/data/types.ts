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

/** ワザ1つ分 */
export interface CardAttack {
  /** エネルギーコスト（タイプ記号の配列。例: ['鋼','鋼','無']） */
  cost: string[];
  /** ワザ名 */
  name: string;
  /** ダメージ表記（例: '150'。無い場合は省略） */
  damage?: string;
  /** 効果テキスト（任意） */
  text?: string;
}

/** タイプ＋倍率/補正の組（弱点・抵抗力用。例: { type:'炎', value:'×2' }） */
export interface TypeModifier {
  type: string;
  value: string;
}

/**
 * カードのバトル情報（HP・ワザ・弱点・抵抗力・にげる等）。
 * 価格スクレイピングでは取得できないため、手動サイドデータ（data/card-details.json、キー=Card.id）で管理する。
 */
export interface CardDetail {
  /** 進化段階（例: たね / 1進化 / 2進化）。トレーナーズ等は省略 */
  stage?: string;
  /** HP */
  hp?: number;
  /** ポケモンのタイプ（例: 鋼）。未指定時は Card.energyType を使う */
  type?: string;
  /** 特性（任意） */
  ability?: { name: string; text: string };
  /** ワザ一覧 */
  attacks?: CardAttack[];
  /** 弱点（例: { type:'炎', value:'×2' }） */
  weakness?: TypeModifier;
  /** 抵抗力（例: { type:'草', value:'−30' }） */
  resistance?: TypeModifier;
  /** にげるコスト（無エネルギーの数） */
  retreat?: number;
}

/** カード1枚（1レアリティ＝1型番）の情報 */
export interface Card {
  /** 一意ID（履歴/検索のキー。例: m1l-091-063-sar） */
  id: string;
  /** 後方互換: id と同値 */
  slug: string;
  /** カード詳細ページのURL（例: /list/lillie/091-063-sar） */
  path: string;
  /** ポケモン名(正規化)のURLスラッグ（例: tropius）。/list/[slug] のキー */
  nameSlug: string;
  /** カード名（例: リーリエの決心） */
  name: string;
  /** レアリティ（例: SAR / AR / SR / RR ...） */
  rarity: string;
  /** URL用レアリティスラッグ（例: sar / ar） */
  raritySlug: string;
  /** カード種別（例: サポート / ポケモン / グッズ） */
  category: string;
  /** ポケモンのエネルギータイプ（草/炎/水…）。トレーナーズ等は空 */
  energyType: string;
  /** 型番（例: 091/063） */
  cardNumber: string;
  /** イラストレーター名（未取得は空） */
  illustrator: string;
  /** 収録パック名（例: 拡張パック「メガブレイブ」） */
  pack: string;
  /** 収録パックのスラッグ（packs.ts の Pack.slug と一致） */
  packSlug: string;
  /** カード画像パス（public/ 配下 or 外部URL）。一覧/サムネ用の中サイズ */
  image: string;
  /** 高解像度画像URL（詳細ページのメイン表示用） */
  imageLarge: string;

  /** 現在の販売価格（円）。未取得は null */
  sellPrice: number | null;
  /** 販売価格の過去最高（円）。未取得は null */
  sellPriceHigh: number | null;
  /** 現在の買取価格（円）。未取得は null */
  buyPrice: number | null;
  /** 買取価格の過去最高（円）。未取得は null */
  buyPriceHigh: number | null;
  /** 過去最高を記録した日付 (YYYY-MM-DD)。未取得は空 */
  highDate: string;
  /** 駿河屋で品切れ中か */
  soldOut?: boolean;

  /** 最新販売価格（ショップ別） */
  sellShops: ShopPrice[];
  /** 最新買取価格（ショップ別） */
  buyShops: ShopPrice[];

  /** 価格履歴（古い順）。未蓄積は空配列 */
  history: PricePoint[];

  /** バトル情報（HP・ワザ・弱点等）。手動サイドデータがあるカードのみ設定される */
  detail?: CardDetail;
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

/** 収録パック（拡張パック等） */
export interface Pack {
  /** URLスラッグ（例: mega-brave） */
  slug: string;
  /** 型番の弾コード（例: M1L）。カードIDの接頭辞に使う */
  setCode: string;
  /** 表示名（例: 拡張パック「メガブレイブ」） */
  name: string;
  /** 短縮名（例: メガブレイブ） */
  shortName: string;
  /** 発売日 (YYYY-MM-DD) */
  releaseDate: string;
}
