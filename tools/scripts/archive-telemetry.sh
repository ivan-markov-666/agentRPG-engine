#!/usr/bin/env bash
set -euo pipefail
LABEL="scheduled"
HISTORY="docs/analysis/reports/telemetry-history.json"
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --label)
      LABEL="$2"; shift 2 ;;
    --history)
      HISTORY="$2"; shift 2 ;;
    --dry-run)
      DRY_RUN=1; shift ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$PROJECT_ROOT"

if [[ "$DRY_RUN" == "1" ]]; then
  echo "[ARCHIVE][DRY-RUN] npm run archive:telemetry -- --label $LABEL --history $HISTORY"
else
  npm run archive:telemetry -- --label "$LABEL" --history "$HISTORY"
fi
