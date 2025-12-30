#!/usr/bin/env bash
set -euo pipefail

TOOLS_RUN_ID_SH="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/../tools/scripts/run-id.sh"

if [[ "${BASH_SOURCE[0]}" != "$0" ]]; then
  # shellcheck source=/dev/null
  source "$TOOLS_RUN_ID_SH"
  run_id() {
    local prefix="${1:-dev}"
    run_id_generate "$prefix"
  }
  export -f run_id
  return 0
fi

bash "$TOOLS_RUN_ID_SH" "$@"
