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
  {
    slug: 'meta-deck', keyword: 'メタデッキ',
    title: 'メタデッキとは？ポケカ環境の読み方と対策の組み方を解説',
    description: 'メタデッキの意味、環境を読むための材料、対策カードの選び方を解説します。大会結果と自分の対戦環境を分けて読み、構築を調整する手順を整理します。',
    summary: 'メタデッキは固定された正解ではありません。大会結果と身近な対戦環境を分け、苦手な相手を具体化してから対策を選びましょう。',
    images: images('meta-deck', ['3つの構築が相互に影響するカードゲームの対戦卓', '相性関係を示す抽象的な戦略マップ', '大会結果とカードを照らし合わせる戦略ノート']),
    sources: [
      { label: 'チャンピオンシップシリーズ（公式）', href: 'https://www.pokemon-card.com/event/championshipseries/' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'wcs2024-results', keyword: 'WCS2024 ポケカ',
    title: 'WCS2024ポケカの結果まとめ｜優勝デッキと上位入賞デッキを解説',
    description: 'WCS2024のポケカ部門について、開催概要、優勝者、上位入賞デッキ、当時の環境と現在のレギュレーションでの扱いを一次情報をもとに解説します。',
    summary: 'WCS2024の結果は当時のカードプールで生まれた記録です。現在の対戦に取り入れる前に、使えるカードと現環境の分布を確認しましょう。',
    images: images('wcs2024-results', ['ホノルルの世界大会を想起させるカードゲームのステージ', '世界大会の組み合わせを表すトーナメント演出', '大会結果を読み解くカードゲームの分析風景']),
    sources: [
      { label: 'ポケモンWCS2024カードゲーム部門ライブ配信（公式）', href: 'https://www.pokemon-card.com/info/004568.html' },
      { label: 'ポケモンワールドチャンピオンシップス（公式）', href: 'https://www.pokemon.com/us/play-pokemon/pokemon-events/pokemon-tournaments/pokemon-world-championships/' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'recommended-cards', keyword: 'ポケカ おすすめカード',
    title: 'ポケカのおすすめカードの選び方｜対戦・コレクション別に解説',
    description: 'ポケカのおすすめカードを、対戦用・コレクション用・予算別の目的から選ぶ方法を解説します。公式大会の記録、レギュレーション、価格比較の確認順も整理します。',
    summary: 'おすすめの基準は目的で変わります。対戦なら使用可否と役割、コレクションなら収録情報と状態、購入前には価格を比べる順に確認しましょう。',
    images: images('recommended-cards', ['目的別に選ばれた架空のトレーディングカードとチェックリスト', '用途ごとに整理したカードとスリーブの俯瞰', 'カード価格と購入条件を比べる手元']),
    sources: [
      { label: 'チャンピオンシップシリーズ（公式）', href: 'https://www.pokemon-card.com/event/championshipseries/' },
      { label: 'カード検索（公式）', href: 'https://www.pokemon-card.com/card-search/' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'goodra-deck', keyword: 'ヌメルゴン デッキ',
    title: 'ヌメルゴンデッキとは？耐久の仕組みと現在の使い方を解説',
    description: 'ヒスイ ヌメルゴンVSTARを軸にしたヌメルゴンデッキの効果、耐久の仕組み、回し方、苦手な相手、現在のレギュレーションでの扱いを解説します。',
    summary: 'ヒスイ ヌメルゴンVSTARはHP270、アイアンローリングのダメージ軽減、モイストスターの回復を組み合わせる構築です。使う場のルールを先に確認しましょう。',
    images: images('goodra-deck', ['防御的な架空のドラゴンとカードゲームのエネルギー', '回復と防御を表す戦略トークンの配置', '防御の光をまとう架空のドラゴンのイメージ']),
    sources: [
      { label: 'ヒスイ ヌメルゴンVSTARのカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/44891' },
      { label: '強化拡張パック「ダークファンタズマ」（公式）', href: 'https://www.pokemon-card.com/products/s/s10a.html' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'alpha-card-oripa', keyword: 'アルファカード オリパ',
    title: 'アルファカードのオリパとは？仕組みと利用前の確認点を解説',
    description: 'アルファカードで扱われるオリパの仕組み、還元率表示の読み方、利用前に確認したい項目、カードの価値を自分で判断する手順を解説します。',
    summary: 'オリパの表示だけで価値を判断せず、販売条件、在庫表示、発送条件、カードの相場を分けて確認しましょう。',
    images: images('alpha-card-oripa', ['未開封の架空カードパックと確認用の小物', 'オリパの購入条件を確認するための抽象的な俯瞰', '価格と内容を比較する抽象的なカードゲーム演出']),
    sources: [
      { label: 'Card Shop ALPHA公式サイト', href: 'https://cardshop-alpha.com/' },
      { label: '通信販売の申込み段階における表示（消費者庁）', href: 'https://www.caa.go.jp/policies/policy/consumer_transaction/specified_commercial_transactions/notice/online/' },
    ],
  },
  {
    slug: 'tcg-metagame', keyword: 'TCG 環境',
    title: 'TCGの環境とは？Tier表の読み方と変化の追い方を解説',
    description: 'TCGで使われる「環境」の意味、Tier表の読み方、環境が変わる要因、公式大会結果を使った確認手順を解説します。ポケカのデッキ選びにも役立ちます。',
    summary: '環境は全国と身近な対戦場所で異なります。Tier表を結論にせず、大会結果、自分が通う場の分布、採用カードを分けて見ましょう。',
    images: images('tcg-metagame', ['3つの構築の相性を表す抽象的なカードゲーム盤面', '文字を使わない階層データを表す戦略トークン', '大会傾向を分析するカードゲームのノート']),
    sources: [
      { label: 'チャンピオンシップシリーズ（公式）', href: 'https://www.pokemon-card.com/event/championshipseries/' },
      { label: 'ポケモンカードゲームの遊びかた・ルール（公式）', href: 'https://www.pokemon-card.com/rules/' },
    ],
  },
  {
    slug: 'champions-league-winners', keyword: 'ポケカ CL 優勝デッキ',
    title: 'ポケカのCL優勝デッキまとめ｜公式記録の読み方と活かし方を解説',
    description: 'ポケカのCL優勝デッキについて、チャンピオンズリーグ2026の公式記録、部門別の結果の読み方、構築への活かし方、次シーズンの日程を解説します。',
    summary: '優勝デッキは大会・部門・カードプールをそろえて読むことが前提です。デッキ名だけでなく、公式の結果とレシピを確認してから採用を検討しましょう。',
    images: images('champions-league-winners', ['全国規模のカードゲーム大会と優勝トロフィーの演出', '大会の組み合わせとデッキマーカーを表す抽象図', '優勝構築を分析するカードとノート']),
    sources: [
      { label: 'チャンピオンズリーグ2026大阪 大会賞品・詳細（公式）', href: 'https://www.pokemon-card.com/info/005392.html' },
      { label: 'チャンピオンシップシリーズ（公式）', href: 'https://www.pokemon-card.com/event/championshipseries/' },
      { label: 'チャンピオンシップシリーズ2027について（公式）', href: 'https://www.pokemon-card.com/info/005597.html' },
    ],
  },
  {
    slug: 'volcanion-deck', keyword: 'ボルケニオン デッキ',
    title: 'ボルケニオンデッキとは？やけどを絡めた回し方と組み方を解説',
    description: 'ボルケニオンexを軸に、やけどとエネルギー移動を使うデッキのカード性能、特殊状態のルール、回し方、相性のよいカードを解説します。',
    summary: 'ボルケニオンexの特性「やけつくじょうき」は相手をやけどにし、ワザ「ヒートサイクロン」は160ダメージとエネルギーのつけ替えを行います。',
    images: images('volcanion-deck', ['蒸気と炎をまとう架空生物がいるカードゲームの盤面', '炎のエネルギーをベンチへ動かす抽象的な戦略図', '熱を帯びた架空生物とカードゲームの演出']),
    sources: [
      { label: '拡張パック「バトルパートナーズ」（公式）', href: 'https://www.pokemon-card.com/ex/sv9/index.html' },
      { label: 'ポケモンカードゲームの遊びかた・ルール（公式）', href: 'https://www.pokemon-card.com/rules/' },
      { label: 'ポケカ四天王直伝のデッキレシピ（公式）', href: 'https://www.pokemon-card.com/info/004811.html' },
    ],
  },
  {
    slug: 'wcs-results', keyword: 'WCS 結果 ポケカ',
    title: 'WCSの結果まとめ｜ポケカ世界大会の優勝者と結果の追い方を解説',
    description: 'WCSのポケカ部門について、直近大会の優勝者と開催地、部門ごとの見方、公式結果の確認先、国内環境へ生かす手順を解説します。',
    summary: 'WCSの結果を読むときは、年度・種目・部門をそろえることが出発点です。公式の大会ページで記録を確認し、国内のカードプールとは分けて判断しましょう。',
    images: images('wcs-results', ['世界大会を表すカードゲーム会場と地球儀の光', '世界規模の組み合わせを表す抽象的なトーナメント図', '国際大会の結果を確認するカードゲームの手元']),
    sources: [
      { label: 'ポケモンワールドチャンピオンシップス（公式）', href: 'https://www.pokemon.com/us/play-pokemon/pokemon-events/pokemon-tournaments/pokemon-world-championships/' },
      { label: 'チャンピオンシップシリーズとは（公式）', href: 'https://www.pokemon-card.com/event/championshipseries/about/' },
    ],
  },
  {
    slug: 'tsujido-card-shop', keyword: '辻堂 カードショップ',
    title: '辻堂のカードショップの探し方｜店選びの基準と買取前の確認点',
    description: '辻堂でカードショップを探す方法、公式の取扱店舗検索、店選びの確認項目、買う・売る・遊ぶ目的別の選び方、買取前の相場確認を解説します。',
    summary: '店舗情報は変動します。公式の取扱店舗検索で候補を挙げ、各店舗の公式情報で営業時間・在庫・買取受付を確認してから訪問しましょう。',
    images: images('tsujido-card-shop', ['駅近くのカードショップを探す街並みのイメージ', '明るいホビー店のカード販売コーナー', '来店前にカード価格を比べる手元']),
    sources: [
      { label: 'ポケモンカードゲーム取扱店舗検索（公式）', href: 'https://map.pokemon-card.com/' },
      { label: 'KaBoS藤沢店（公式）', href: 'https://www.kabos.jp/tenpo/fujisawa/' },
      { label: 'JR東日本 辻堂駅（公式）', href: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=1013' },
    ],
  },
  {
    slug: 'weakness-resistance', keyword: 'ポケカ 相性表',
    title: 'ポケカに相性表はある？弱点と抵抗力の仕組みと確認方法を解説',
    description: 'ポケカにはゲーム本編のようなタイプ相性表がなく、弱点と抵抗力はカードごとに決まります。弱点2倍と抵抗力の計算、ダメージ計算の順番、ベンチの扱いまで解説します。',
    summary: '弱点と抵抗力はカードごとの表記を確認するのが出発点です。バトル場とベンチでは計算が異なるため、ワザの処理順も公式ルールで確認しましょう。',
    images: images('weakness-resistance', ['弱点と抵抗力を表す架空のカードゲーム盤面', 'ダメージと抵抗力を計算する抽象的な戦略トークン', 'バトル場とベンチを表すカードゲームの盤面']),
    sources: [
      { label: '基本ルールをおぼえよう！ポケモンカードゲームのあそびかた（公式）', href: 'https://www.pokemon-card.com/howtoplay/' },
      { label: 'ポケモンカードゲームQ&A：弱点（公式）', href: 'https://www.pokemon-card.com/rules/faq/search.php?freeword=%E5%BC%B1%E7%82%B9&regulation_faq_main_item1=XY' },
    ],
  },
  {
    slug: 'bouffalant-deck', keyword: 'バッフロン デッキ',
    title: 'バッフロンデッキとは？アフロガードを活かす組み方と回し方を解説',
    description: 'バッフロンデッキはバッフロンexの特性アフロガードとポケモンexへの追加ダメージを軸にした構築です。カード性能、回し方、弱点と対策、揃え方を解説します。',
    summary: 'バッフロンexは相手のバトルポケモンがポケモンexなら200ダメージを狙えます。相手のサイドプランと、受けるダメージを30減らす特性を分けて考えましょう。',
    images: images('bouffalant-deck', ['防御を意識した架空の角を持つ生き物とカードゲーム', '防御エネルギーをまとう架空の生き物', '手札とコインを使うカードゲームの戦略盤面']),
    sources: [
      { label: 'バッフロンexのカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/47697/regu/all' },
      { label: 'メガガルーラexのカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/50172' },
      { label: 'スタートデッキ100 バトルコレクション：デッキ088（公式）', href: 'https://www.pokemon-card.com/ex/mc/list/088' },
    ],
  },
  {
    slug: 'ancient-deck', keyword: '古代 デッキ',
    title: '古代デッキとは？サポートカードの役割と組み方を解説',
    description: '古代デッキは「古代」の分類を持つポケモンを軸にした構築です。オーリム博士の気迫やブーストエナジー 古代の役割、トドロクツキexの性能、回し方を解説します。',
    summary: '古代デッキでは、オーリム博士の気迫でトラッシュからエネルギーをつける手順と、ブーストエナジー 古代の耐久・特殊状態対策を一緒に考えます。',
    images: images('ancient-deck', ['古代遺跡を思わせる架空のカードゲーム戦略盤面', 'エネルギーを加速する抽象的なカードゲームの演出', '古代の護符と架空のドラゴンを表すイラスト']),
    sources: [
      { label: 'オーリム博士の気迫のカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/44444' },
      { label: 'ブーストエナジー 古代のカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/45211/regu/all' },
      { label: 'トドロクツキexのカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/47139/regu/all' },
    ],
  },
  {
    slug: 'champions-league-tokyo', keyword: 'CL 東京',
    title: 'CL東京とは？直近の優勝デッキと近年の開催状況を解説',
    description: 'CL東京の結果と日程をまとめました。チャンピオンズリーグ2025東京の優勝者と使用デッキ、近年の開催地、2027シリーズの日程、参加準備を解説します。',
    summary: 'CL東京の直近記録は2024年9月開催のCL2025東京です。次の大型大会は公式告知の開催地・日程・参加条件を基準に確認しましょう。',
    images: images('champions-league-tokyo', ['大規模な架空のカードゲーム大会会場', '大会結果を分析するカードゲームのノート', '大会参加の準備をするカードゲームプレイヤー']),
    sources: [
      { label: 'チャンピオンズリーグ2025 東京 優勝者インタビュー（公式）', href: 'https://www.pokemon-card.com/info/004630.html' },
      { label: 'チャンピオンシップシリーズ2027について（公式）', href: 'https://www.pokemon-card.com/info/005597.html' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'tatsugiri-ex', keyword: 'シャリタツex',
    title: 'シャリタツexとは？特性と2つのワザの使い分けを解説',
    description: 'シャリタツexはベンチでワザのダメージを受けない特性と、相手の効果を計算しない100ダメージ、山札から展開するワザを持つカードです。性能と使い方を解説します。',
    summary: 'シャリタツexは、ベンチにいるかぎりワザのダメージを受けません。ふいうちポンプとシナバールアーは、相手の盤面と自分のベンチ枠で使い分けましょう。',
    images: images('tatsugiri-ex', ['水辺の架空生物とカードゲームの戦略盤面', '山札からポケモンを展開する抽象的な盤面', '防御効果を越える水の攻撃を表すイラスト']),
    sources: [
      { label: 'シャリタツexのカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/46421' },
      { label: '基本ルールをおぼえよう！ポケモンカードゲームのあそびかた（公式）', href: 'https://www.pokemon-card.com/howtoplay/' },
    ],
  },
  {
    slug: 'starter-deck-upgrade', keyword: 'ポケカ スタートデッキ 改造',
    title: 'ポケカのスタートデッキ改造ガイド｜抜く順番と入れる順番を解説',
    description: 'ポケカのスタートデッキ改造の手順をまとめました。守るべき構築ルール、抜くカードと入れるカードの決め方、役割ごとの枚数の数え方、予算別の進め方を解説します。',
    summary: '改造は、まず勝ち筋を1つ決めてから不要なカードを抜きます。60枚の枚数と使用可能なレギュレーションを確認し、対戦で引けない場面を記録して調整しましょう。',
    images: images('starter-deck-upgrade', ['カードデッキを改造するための整理された机', '役割別にカードを仕分ける俯瞰イラスト', 'デッキ構築用品とカードを並べた作業机']),
    sources: [
      { label: 'スタートデッキ100 バトルコレクション（公式）', href: 'https://www.pokemon-card.com/ex/mc/' },
      { label: 'ポケモンカードゲームのあそびかた（公式）', href: 'https://www.pokemon-card.com/howtoplay/' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'gholdengo-ex', keyword: 'サーフゴーex',
    title: 'サーフゴーのポケカ解説｜ゴールドラッシュの仕組みと組み方',
    description: 'サーフゴーexは手札の基本エネルギーをトラッシュして打点に変えるポケカのカードです。特性ボーナスコインとゴールドラッシュの仕組み、打点計算、組み方を解説します。',
    summary: 'ゴールドラッシュは、手札からトラッシュした基本エネルギー1枚につき50ダメージです。必要な打点から枚数を逆算し、次の番の手札も残しましょう。',
    images: images('gholdengo-ex', ['黄金色の架空生物とエネルギーを表すカードゲーム', '手札のエネルギーを攻撃へ変える抽象的な演出', '山札から手札を増やすカードゲームの戦略盤面']),
    sources: [
      { label: 'サーフゴーexのカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/46778' },
      { label: 'ポケカ四天王直伝のデッキレシピ（公式）', href: 'https://www.pokemon-card.com/info/004124.html' },
      { label: 'レギュレーション（公式）', href: 'https://www.pokemon-card.com/rules/regulation/' },
    ],
  },
  {
    slug: 'return-to-hand', keyword: 'ポケカ 手札に戻す',
    title: 'ポケカで手札に戻す効果とは？種類と使いどころを解説',
    description: 'ポケカの「手札に戻す」効果を種類ごとに整理しました。ポケモンを戻す効果とエネルギーを戻す効果の違い、代表的なグッズ、戻したときに起きることを解説します。',
    summary: '場のポケモンを手札に戻すと、進化前やついているカードも一緒に戻る効果があります。カード本文とQ&Aを確認して、バトル場を空にする場合の処理まで考えましょう。',
    images: images('return-to-hand', ['場のカードを手札へ戻すカードゲームの抽象表現', '進化ラインとエネルギーが手札に戻る戦略盤面', '盤面を戻すか残すかを考えるカードゲームの演出']),
    sources: [
      { label: 'ポケモン回収サイクロンのカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/46810/' },
      { label: 'ポケモン回収サイクロンのQ&A（公式）', href: 'https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E5%9B%9E%E5%8F%8E%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AD%E3%83%B3&regulation_faq_main_item1=all' },
      { label: 'スーパーポケモン回収のQ&A（公式）', href: 'https://www.pokemon-card.com/rules/faq/search.php?freeword=%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E5%9B%9E%E5%8F%8E&page=2&regulation_faq_main=' },
    ],
  },
  {
    slug: 'persian', keyword: 'ポケカ ペルシアン',
    title: 'ポケカのペルシアン解説｜歴代カードと現行exの使い方',
    description: 'ポケカのペルシアンは世代ごとに別カードとして登場しています。ロケット団のペルシアンexの性能、相手のワザを使うこうまんしれい、こんらんの仕組みを解説します。',
    summary: 'ロケット団のペルシアンexのこうまんしれいは、相手の山札の上から10枚にあるポケモンのワザを選んで使う効果です。使えるワザがあるかを先に確認しましょう。',
    images: images('persian', ['銀色の架空の猫科生物とカードゲームの戦略盤面', '相手の山札を観察するカードゲームの演出', 'こんらんを表す紫色の抽象的なカードゲーム表現']),
    sources: [
      { label: 'ロケット団のペルシアンexのカード情報（公式）', href: 'https://www.pokemon-card.com/card-search/details.php/card/49276' },
      { label: 'スタートデッキ100 バトルコレクション（公式）', href: 'https://www.pokemon-card.com/ex/mc/' },
      { label: 'ポケモンカードゲームのあそびかた（公式）', href: 'https://www.pokemon-card.com/howtoplay/' },
    ],
  },
  {
    slug: 'kumamoto-card-shop', keyword: '熊本 カードショップ',
    title: '熊本のトレカショップの探し方｜店選びの基準と買取前の確認点',
    description: '熊本でトレカショップを探す方法をまとめました。公式の取扱店舗検索とイベント検索の使い方、店選びの確認項目、買う・売る・遊ぶ目的別の選び方を解説します。',
    summary: '熊本でポケカを扱う店は、公式の取扱店舗・イベント検索で候補を挙げ、各店舗の公式情報で営業時間や取扱内容を確認してから訪問しましょう。',
    images: images('kumamoto-card-shop', ['明るい架空のトレーディングカード専門店', '店舗を探して比較するカードゲームプレイヤー', 'カードゲームの対戦スペースを表す店内イラスト']),
    sources: [
      { label: 'ポケモンカードゲーム取扱店舗検索（公式）', href: 'https://map.pokemon-card.com/' },
      { label: 'カードラボ熊本店：プレイヤーズクラブ店舗情報（公式）', href: 'https://players.pokemon-card.com/event/search/19962/list' },
      { label: 'イベント検索：ポケモンカードゲーム プレイヤーズクラブ（公式）', href: 'https://players.pokemon-card.com/event/search' },
    ],
  },
];

export const columnBySlug = new Map(columns.map((column) => [column.slug, column]));
