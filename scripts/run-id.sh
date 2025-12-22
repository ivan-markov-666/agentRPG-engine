#!/usr/bin/env bash

run_id() {
  local persona="${1:-dev}"
  local include_branch="${2:-false}"
  local stamp
  stamp="$(date +%Y%m%d-%H%M%S)"
  if [[ "$include_branch" == "true" || "$include_branch" == "1" ]]; then
    local branch
    branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" || branch="no-git"
    [[ -z "$branch" ]] && branch="unknown-branch"
    printf "%s-%s-%s\n" "$persona" "$branch" "$stamp"
  else
    printf "%s-%s\n" "$persona" "$stamp"
  fi
}

export -f run_id
