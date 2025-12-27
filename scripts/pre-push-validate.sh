#!/usr/bin/env bash
set -euo pipefail
GAME=${ARPG_GAME:-demo}
RUN_ID=${ARPG_RUN_ID:-"dev-prepush-$(date +%Y%m%d%H%M%S)"}
ARGS=("--game" "$GAME" "--run-id" "$RUN_ID" "--auto-archive" "50")
if [[ -n "${ARPG_LIMIT:-}" ]]; then
  ARGS+=("--limit" "$ARPG_LIMIT")
fi
npm run validate:metrics -- "${ARGS[@]}"
