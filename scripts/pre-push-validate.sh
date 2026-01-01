#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

GAME=${ARPG_GAME:-demo}
RUN_ID=${ARPG_RUN_ID:-"dev-prepush-$(date +%Y%m%d%H%M%S)"}
AUTO_ARCHIVE=${ARPG_AUTO_ARCHIVE:-50}
ARGS=("--game" "$GAME" "--run-id" "$RUN_ID" "--auto-archive" "$AUTO_ARCHIVE")

if [[ -n "${ARPG_LIMIT:-}" ]]; then
  ARGS+=("--limit" "$ARPG_LIMIT")
fi

npm run validate:metrics -- "${ARGS[@]}"
