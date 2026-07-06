#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PORT=9000

if [[ "${1:-}" =~ ^[0-9]+$ ]]; then
  PORT="$1"
  shift
fi

cd "$SCRIPT_DIR"

if command -v quasar >/dev/null 2>&1; then
  exec quasar serve -p "$PORT" . -i umd-test.html "$@"
fi

if command -v pnpm >/dev/null 2>&1; then
  exec pnpm exec quasar serve -p "$PORT" . -i umd-test.html "$@"
fi

echo "Quasar CLI not found in PATH and pnpm is unavailable." >&2
exit 1
