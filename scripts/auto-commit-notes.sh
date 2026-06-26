#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

git add README.md package.json package-lock.json docs scripts .github .gitignore

if git diff --cached --quiet; then
  echo "No note changes to commit."
  exit 0
fi

git commit -m "Update notes $(date '+%Y-%m-%d %H:%M')"

current_branch="$(git branch --show-current)"
if git remote get-url origin >/dev/null 2>&1; then
  git push origin "$current_branch"
else
  echo "Committed locally. No origin remote configured yet."
fi
