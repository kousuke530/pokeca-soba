export type ColumnImage = {
  src: string;
  alt: string;
};

export type Column = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  summary: string;
  images: ColumnImage[];
  sources: { label: string; href: string }[];
};

const images = (slug: string, alt: [string, string, string]): ColumnImage[] => [
  { src: `/images/columns/${slug}/hero.png`, alt: alt[0] },
  { src: `/images/columns/${slug}/point-01.png`, alt: alt[1] },
  { src: `/images/columns/${slug}/point-02.png`, alt: alt[2] },
];

export const columns: Column[] = [
  {
    slug: 'arceus-giratina', keyword: 'アルギラ',
    title: 'アルギラとは？アルセウスギラティナの強さと今の使い道を解説',
    description: 'アルギラはアルセウスVSTARとギラティナVSTARを組み合わせたポケカのデッキです。2枚の役割と回し方、現在遊べるレギュレーション、集める際の優先順位を整理します。',
    summary: 'アルギラは現在のスタンダードでは使えません。遊ぶ場のレギュレーションを先に確認してから、必要なカードをそろえるのが安全です。',
    images: images('arceus-giratina', ['光をまとう伝説級の架空のドラゴンとトレーディングカードの対戦卓', 'カードゲームのエネルギー配分を象徴する光のコマと戦略ノート', '対戦終盤の盤面を見つめるプレイヤーと幻想的なカードゲーム演出']),
    sources: [
      { label: 'アルセウスVSTARのカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/40986/regu/BW' },
      { label: '拡張パック「ロストアビス」公式ページ', href: 'https://www.pokemon-card.com/ex/s11/index.html' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'naic-pokemon-tcg', keyword: 'NAIC ポケカ',
    title: 'NAICとは？ポケカ北米国際選手権の仕組みと2026年の結果を解説',
    description: 'NAICはポケモンカードの北アメリカ国際選手権です。大会の位置づけ、部門、2026年大会の概要、結果をデッキ選びに生かす手順を解説します。',
    summary: 'NAICの結果は、そのまま国内環境の正解ではありません。使用率・採用カード・自分の対戦環境を分けて読むことが大切です。',
    images: images('naic-pokemon-tcg', ['国際トレーディングカード大会の大きなステージと観客席', '大会結果を分析するプレイヤーのノートとカードゲームの小物', '世界地図とトーナメントブラケットを想起させるカードゲームの演出']),
    sources: [
      { label: 'Pokémon International Championships（公式）', href: 'https://www.pokemon.com/us/play-pokemon/pokemon-events/pokemon-tournaments/international-championships/' },
      { label: 'チャンピオンシップシリーズとは（公式）', href: 'https://www.pokemon-card.com/event/championshipseries/about/' },
    ],
  },
  {
    slug: 'oshinagasu', keyword: 'ポケカ おしながす',
    title: 'ポケカの「おしながす」とは？効果と使えるポケモン・活用法を解説',
    description: 'ポケカの「おしながす」はベンチのエネルギーをバトル場へつけ替える特性です。効果の読み方、代表的なカード、組み込み方と注意点を解説します。',
    summary: '「おしながす」で動かせるのは、テキストどおりベンチからバトル場へのエネルギーです。移動方向と使用条件を先に確認しましょう。',
    images: images('oshinagasu', ['水辺を思わせる青いエネルギーがトレーディングカードの間を流れる抽象表現', 'カードゲームのベンチとバトル場を示す青い戦略コマの俯瞰', '水属性を想起させる架空の生き物とエネルギー移動のイメージ']),
    sources: [
      { label: 'ジュゴンのカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/49652' },
      { label: 'カメックスのカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/25447/regu/DP' },
      { label: 'ヌオーのカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/35906' },
    ],
  },
  {
    slug: 'unown-deck', keyword: 'アンノーン デッキ',
    title: 'アンノーンデッキとは？特殊勝利の仕組みと今組める構築を解説',
    description: 'アンノーンデッキは特殊勝利型とアンノーンVSTAR型に分かれます。勝利条件、公式大会での使用可否、組み方と集め方を整理します。',
    summary: '特殊勝利を狙うHAND・DAMAGEは公式レギュレーションで使用できません。購入前に、遊ぶ場と使用可能カードを必ず確認してください。',
    images: images('unown-deck', ['古代文字のような架空の記号が浮かぶミステリアスなカードゲームの世界', '手札とカウンターを使った特殊勝利条件を連想させる抽象的な対戦卓', '超能力的な紫の光と戦略カードを組み合わせたイメージ']),
    sources: [
      { label: 'アンノーン（HAND）のカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/35334/regu/all' },
      { label: 'アンノーンVSTARのカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/44931' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'inferno-x-deck', keyword: 'インフェルノ デッキ',
    title: 'インフェルノデッキとは？メガリザードンXexの組み方と回し方を解説',
    description: 'インフェルノデッキはメガリザードンXexのワザ「インフェルノX」で高打点を狙う炎デッキです。打点計算、回し方、弱点と必要カードを解説します。',
    summary: 'インフェルノXは自分の場のエネルギーをトラッシュした枚数で打点が決まります。攻撃前に、次のアタッカーまで準備できるかを数えましょう。',
    images: images('inferno-x-deck', ['炎のエネルギーと架空の火竜が描かれた、赤と黒を基調にしたカードゲームの対戦卓', '炎のエネルギーコマを数えて高打点を計算する戦略ノート', '熱気のあるカード大会で攻撃のタイミングを見極めるプレイヤー']),
    sources: [
      { label: '拡張パック「インフェルノX」公式ページ', href: 'https://www.pokemon-card.com/ex/m2/' },
      { label: 'メガリザードンXexのカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/48353/regu/all' },
      { label: 'ポケカ四天王直伝のデッキレシピ', href: 'https://www.pokemon-card.com/info/005231.html' },
    ],
  },
  {
    slug: 'highlander', keyword: 'ポケカ ハイランダー',
    title: 'ポケカのハイランダーとは？ルールと組み方のコツを解説',
    description: 'ポケカのハイランダーは同じ名前のカードを1枚ずつしか入れない構築の遊び方です。公式ルールとの違い、組み方、事前に確認する点を解説します。',
    summary: 'ハイランダーは公式の対戦形式ではありません。基本エネルギーや使用可能カードを含め、細かなルールは参加する場で事前に合意しましょう。',
    images: images('highlander', ['異なるデザインの架空カードが一枚ずつ並ぶ、コレクション性の高い対戦卓', '重複しないカードを分類してデッキを組む俯瞰のフラットレイ', '多彩なエネルギーとカードを組み合わせる創造的な戦略シーン']),
    sources: [
      { label: 'ポケモンカードゲームの遊びかた・ルール', href: 'https://www.pokemon-card.com/rules/' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'championship-season', keyword: 'ポケカ シーズン',
    title: 'ポケカのシーズンとは？2027シリーズの日程と大会の区切りを解説',
    description: 'ポケカのシーズンはチャンピオンシップシリーズの年度区切りです。2027シリーズの開催日程、シティリーグの区分、参加ルールと準備を解説します。',
    summary: '2027シリーズは2026年9月に始まります。日程・エントリー・レギュレーションは変わり得るため、申込前に公式告知を確認してください。',
    images: images('championship-season', ['カードゲームの大会日程を示すカレンダーとトロフィーの洗練されたビジュアル', '会場マップとトーナメントの予定を確認するプレイヤーの机', '競技会場へ向かうカードゲームプレイヤーを表す明るいイメージ']),
    sources: [
      { label: 'チャンピオンシップシリーズ2027について', href: 'https://www.pokemon-card.com/info/005597.html' },
      { label: '2027シリーズの開催日程（公式）', href: 'https://www.pokemon-card.com/event/championshipseries/?information=trainers' },
    ],
  },
  {
    slug: 'lurantis', keyword: 'ラランテス ポケカ',
    title: 'ラランテスのポケカまとめ｜exの効果と使い方・価格の見方を解説',
    description: 'ラランテスexの効果、回復を絡めた使い方、デッキに入れる考え方、過去カードとの違い、価格を比べる手順を解説します。',
    summary: 'ラランテスexの「はつらつカッター」は、その番にHPを回復していると追加ダメージを出せます。回復手段と攻撃順をセットで考えましょう。',
    images: images('lurantis', ['植物と朝露を思わせる緑の架空クリーチャーが彩るカードゲームの世界', '回復マーカーと草のエネルギーを使ったカードゲーム戦略の俯瞰', '植物園のような光の中でカードを選ぶプレイヤーの手元']),
    sources: [
      { label: 'ラランテスexのカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/50223' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'cardboard-reinforcement', keyword: 'トレカ 厚紙 補強',
    title: 'トレカの厚紙補強のやり方｜折れを防ぐ手順と発送前の確認点',
    description: 'トレカの厚紙補強は折れと水濡れを防ぐ基本の梱包です。用意するもの、4ステップの手順、発送方法ごとの厚みの確認点を解説します。',
    summary: 'カードはスリーブ・防水袋・厚紙の順で保護し、厚紙に直接テープを貼らないのが基本です。発送前には厚さと封の状態を確認しましょう。',
    images: images('cardboard-reinforcement', ['スリーブ、透明袋、厚紙、封筒を整然と並べたトレーディングカード梱包のフラットレイ', 'カードを防水袋と厚紙で挟む手元を写した実用的な梱包シーン', '定規で封筒の厚みを測る発送前チェックのクローズアップ']),
    sources: [
      { label: '定形郵便物の厚さ（日本郵便）', href: 'https://www.post.japanpost.jp/question/602.html' },
      { label: 'ゆうパケットポスト・mini（日本郵便）', href: 'https://www.post.japanpost.jp/service/send/domestic/delivery/e-shipping/yu-packetpost.html' },
    ],
  },
  {
    slug: 'mega-rayquaza-ex-deck', keyword: 'メガ レックウザ ex デッキ レシピ',
    title: 'メガレックウザexのデッキレシピと回し方｜組み方の考え方を解説',
    description: 'メガレックウザexの特性「はしゃのほうこう」とワザ「ストームエメラルダ」の仕組み、公式レシピ、打点計算、対策を解説します。',
    summary: 'ストームエメラルダは自分のポケモン全員のエネルギー数でダメージが決まります。高打点だけでなく、倒されたときにサイドを3枚取られる点も計画に入れましょう。',
    images: images('mega-rayquaza-ex-deck', ['雲海を駆ける架空の緑色の龍とカードゲームのエネルギーを描いた壮大なビジュアル', '複数のエネルギーコマを盤面全体に配分するカードゲーム戦略の俯瞰', '空をテーマにしたトレーディングカード大会で盤面を読むプレイヤー']),
    sources: [
      { label: 'メガレックウザexのカード情報', href: 'https://www.pokemon-card.com/card-search/details.php/card/50396/regu/XY' },
      { label: '拡張パック「ストームエメラルダ」公式ページ', href: 'https://www.pokemon-card.com/ex/m6/' },
    ],
  },
];

export const columnBySlug = new Map(columns.map((column) => [column.slug, column]));
