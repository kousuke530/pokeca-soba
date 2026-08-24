#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
review_file="$repo_root/work/column-review-ready.md"

if [[ ! -f "$review_file" ]] || ! grep -qE '^status:[[:space:]]*pending[[:space:]]*$' "$review_file"; then
  echo "レビュー待ちの記事はありません。work/column-review-ready.md を status: pending で更新してください。"
  exit 0
fi

codex_bin="$(command -v codex || true)"
if [[ -z "$codex_bin" ]]; then
  for candidate in "/Applications/ChatGPT.app/Contents/Resources/codex" "$HOME/.codex/bin/codex"; do
    if [[ -x "$candidate" ]]; then codex_bin="$candidate"; break; fi
  done
fi
if [[ -z "$codex_bin" ]]; then
  echo "codex コマンドが見つかりません。Codex CLI のパスを確認してください。" >&2
  exit 1
fi

exec "$codex_bin" exec \
  --dangerously-bypass-approvals-and-sandbox \
  --cd "$repo_root" \
  --add-dir "/Users/kosuke/Desktop/Automation" \
  '作業ディレクトリは /Users/kosuke/pokeca-soba。work/column-review-ready.md のfrontmatterで status: pending と articles を読み、列挙された output/column/*.md だけを対象にする。

各対象記事を /Users/kosuke/Desktop/Automation/work/seo-contents-creator_プロンプト最適化版.md の§6「5パス＋定量チェック」に沿って品質確認し、必要な修正を行う。事実・日程・カード情報は一次情報で確認する。各記事にはアイキャッチ1枚と本文用2枚以上、合計3〜5枚のオリジナル画像を public/images/columns/<slug>/ に用意する。既存画像が記事内容に適合していれば再生成しない。装飾画像の下に定型キャプションは表示しない。新記事は src/data/columns.ts に記事情報を追加し、/column/<slug>/ の静的ページとして公開可能にする。

修正後に npm run build を実行する。成功した場合のみ、今回の対象記事（output/column は明示的にforce add）、その記事の画像、コラム表示に必要となった関連srcファイル、Claude Code向け設定変更だけをgit addする。data/name-slugs.jsonや他の無関係な未コミット変更は絶対にstageしない。必要ならcommitし、origin/mainへgit pushする。梅津さんへの確認は不要。

pushが成功したら work/column-review-ready.md の status を processed にし、日時とcommit IDを記録する。品質確認・ビルド・commit・pushのいずれかが失敗した場合はpushせず、status を blocked にして理由を記録する。正常・失敗いずれの場合も実施内容を簡潔に報告する。'
