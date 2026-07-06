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

# 収集は必ず collect → collect:buy の順（collect が data/cards を再生成し買取価格を消すため、
# 直後に collect:buy で買取を復元する）。
log "販売価格を収集 (collect) ..."
npm run collect      >> "$LOG" 2>&1 || log "collect が異常終了（部分取得の可能性・続行）"
log "買取価格を収集 (collect:buy) ..."
npm run collect:buy  >> "$LOG" 2>&1 || log "collect:buy が異常終了（部分取得の可能性・続行）"

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
