#!/bin/zsh

set -e

commit_message="${1:-}"

if [[ -z "$commit_message" ]]; then
  echo "Usage: $0 \"commit message\"" >&2
  exit 1
fi

cd "$HOME/Sites/signal"
git add .
git commit -m "$commit_message"
git push
