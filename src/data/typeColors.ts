// ポケモンのタイプ（エネルギー）別のチップ配色。
// データ上の energyType 値: 炎/水/草/雷/超/闘/悪/鋼/ドラゴン（空文字=非ポケモン）。
const TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  炎: { bg: '#e84c30', fg: '#ffffff' },
  水: { bg: '#2b8ae0', fg: '#ffffff' },
  草: { bg: '#3fa44e', fg: '#ffffff' },
  雷: { bg: '#f2b71c', fg: '#4a3800' },
  超: { bg: '#a24fc4', fg: '#ffffff' },
  闘: { bg: '#cc6a2b', fg: '#ffffff' },
  悪: { bg: '#40485a', fg: '#ffffff' },
  鋼: { bg: '#6f8195', fg: '#ffffff' },
  ドラゴン: { bg: '#b88a1e', fg: '#ffffff' },
};

/** タイプに対応する配色を返す。非ポケモン/未知タイプは null（=既定色のまま） */
export function typeColor(type: string | null | undefined): { bg: string; fg: string } | null {
  if (!type) return null;
  return TYPE_COLORS[type] ?? null;
}

/** タイプチップ用の inline style 文字列（null のときは undefined を返す） */
export function typeChipStyle(type: string | null | undefined): string | undefined {
  const c = typeColor(type);
  return c ? `background:${c.bg};color:${c.fg};border-color:${c.bg}` : undefined;
}
