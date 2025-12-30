#!/usr/bin/env bash
set -euo pipefail
run_id_generate() {
  local prefix=${1:-"dev"}
  local uuid
  if command -v uuidgen >/dev/null 2>&1; then
    uuid=$(uuidgen | tr '[:upper:]' '[:lower:]')
  else
    uuid=$(node -e "console.log(require('crypto').randomUUID())")
  fi
  printf "%s-%s\n" "$prefix" "$uuid"
}

run_id() {
  local prefix=${1:-"dev"}
  run_id_generate "$prefix"
}

if [[ "${BASH_SOURCE[0]}" != "$0" ]]; then
  export -f run_id_generate
  export -f run_id
  return 0
fi

PREFIX="dev"
COPY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prefix|-p)
      PREFIX="$2"
      shift 2
      ;;
    --copy|-c)
      COPY=1
      shift
      ;;
    --help|-h)
      cat <<'EOF'
Usage: run-id.sh [--prefix dev] [--copy]
Sourceable helper:
  source tools/scripts/run-id.sh
  run_id_generate dev
EOF
      return 0 2>/dev/null || exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      return 1 2>/dev/null || exit 1
      ;;
  esac
done

RUN_ID=$(run_id_generate "$PREFIX")
echo "$RUN_ID"

if [[ $COPY -eq 1 ]]; then
  if command -v pbcopy >/dev/null 2>&1; then
    echo -n "$RUN_ID" | pbcopy
    echo "[run-id] Copied to clipboard" >&2
  elif command -v clip.exe >/dev/null 2>&1; then
    echo -n "$RUN_ID" | clip.exe
    echo "[run-id] Copied to clipboard" >&2
  fi
fi
