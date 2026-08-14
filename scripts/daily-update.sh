#!/bin/bash
# ポケカ相場ドットコム 日次価格更新（自宅Macの launchd から実行）
#
# 背景: 駿河屋は GitHub Actions のデータセンターIPを弾くため、クラウドからは価格を取得できない。
#       住宅IP（このMac）で収集し、data/ を commit→push すると、GitHub 側が build & deploy する
#       （ワークフローの push トリガーは収集をスキップし、ビルド＆デプロイのみ実行）。
#
# 手動実行: bash scripts/daily-update.sh
# launchd:  ~/Library/LaunchAgents/com.pokeca.dailyupdate.plist （毎日実行）
set -uo pipefail

# launchd は最小環境で起動するため、node/npm(/usr/local/bin)・git(/usr/bin) を明示的にPATHへ
export PATH="/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:$PATH"

REPO="/Users/kosuke/pokeca-soba"
cd "$REPO" || { echo "リポジトリが見つかりません: $REPO"; exit 1; }

mkdir -p "$REPO/work"
LOG="$REPO/work/daily-update.log"
: > "$LOG"   # 毎回上書き（最新実行のみ保持）

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

log "===== 日次価格更新 開始 ====="
log "node $(node -v) / git $(git --version)"

# 当日分をすでに取得済みならスキップ（RunAtLoad＝起動時実行での多重実行を防ぐ）。
# 収集は履歴の日付を UTC で記録するため、判定も UTC 基準で行う。
TODAY_UTC=$(date -u '+%Y-%m-%d')
if grep -rq "\"${TODAY_UTC}\"" "$REPO/data/history/" 2>/dev/null; then
  log "本日分（${TODAY_UTC} UTC）は取得済みのためスキップします。"
  log "===== 日次価格更新 終了 ====="
  exit 0
fi

# 収集は必ず collect → collect:buy の順（collect が data/cards を再生成し買取価格を消すため、
# 直後に collect:buy で買取を復元する）。
log "販売価格を収集 (collect) ..."
npm run collect      >> "$LOG" 2>&1 || log "collect が異常終了（部分取得の可能性・続行）"
log "買取価格を収集 (collect:buy) ..."
npm run collect:buy  >> "$LOG" 2>&1 || log "collect:buy が異常終了（部分取得の可能性・続行）"

# --- カタログ縮小ガード（安全網）---
# collect の和集合マージで消失は基本起きないが、万一カード総数がHEADより減っていたら
# 取りこぼしの可能性が高いので commit/push を中止し、ライブからカードが消えるのを防ぐ。
CATALOG_CNT=$(node -e '
const {execSync}=require("child_process"); const fs=require("fs");
const dir="data/cards";
let head=0, wt=0;
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(".json"))){
  try{ head += (JSON.parse(execSync("git show HEAD:data/cards/"+f,{encoding:"utf8",stdio:["pipe","pipe","ignore"]})).cards||[]).length; }catch(e){}
  try{ wt += (JSON.parse(fs.readFileSync(dir+"/"+f,"utf8")).cards||[]).length; }catch(e){}
}
console.log(head+" "+wt);
' 2>/dev/null)
HEAD_CNT=${CATALOG_CNT% *}; WT_CNT=${CATALOG_CNT#* }
if [ -n "$HEAD_CNT" ] && [ -n "$WT_CNT" ] && [ "$WT_CNT" -lt "$HEAD_CNT" ]; then
  log "異常: カタログが縮小 (HEAD ${HEAD_CNT}枚 → 現在 ${WT_CNT}枚)。取りこぼしの可能性が高いため commit/push を中止します。"
  log "  git diff data/cards で差分を確認してください。復元するには: git checkout -- data/cards"
  log "===== 日次価格更新 終了（中止）====="
  exit 1
fi
log "カタログ健全性OK (HEAD ${HEAD_CNT:-?}枚 → 現在 ${WT_CNT:-?}枚)"

# データ差分があれば commit & push（push で GitHub が build & deploy）
git add data/cards data/history
if git diff --staged --quiet; then
  log "価格データの変更なし（commit/pushはスキップ）"
else
  git commit -m "chore: 価格更新 ($(date '+%Y-%m-%d'))" >> "$LOG" 2>&1
  if git push >> "$LOG" 2>&1; then
    log "push 成功（GitHub Actions が build & deploy します）"
  else
    log "push 失敗（ネットワーク/認証を確認）"
  fi
fi

log "===== 日次価格更新 終了 ====="
