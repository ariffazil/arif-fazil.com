#!/usr/bin/env bash
# sync-serving-roots.sh — Split-root serving sync (2026-08-25 root-cause fix)
#
# Mirrors split-served directories and root-static files from DIST into TOP
# (default /var/www/html) and verifies local bytes on disk. Supports
# parameterized --html-root / --backup-dir / --verify-only for fail-closed
# pre-mutation staging and fixture testing.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd -P)"

DIST="${ARIF_SITES_DIST:-$REPO_ROOT/sites/arif-fazil.com/dist}"
TOP="${ARIF_SITES_HTML_ROOT:-/var/www/html}"
TS="$(date +%Y%m%d-%H%M%S)"
BK=""
VERIFY_ONLY=0
SKIP_BACKUP=0
ALLOW_EMPTY_SPLIT=0
POSITIONAL_DIST=""

while (($#)); do
  case "$1" in
    --html-root)
      TOP="${2:-}"
      shift 2
      ;;
    --webroot|--dist)
      DIST="${2:-}"
      shift 2
      ;;
    --backup-dir)
      BK="${2:-}"
      shift 2
      ;;
    --verify-only)
      VERIFY_ONLY=1
      shift
      ;;
    --skip-backup)
      SKIP_BACKUP=1
      shift
      ;;
    --allow-missing-optional)
      ALLOW_EMPTY_SPLIT=1
      shift
      ;;
    -h|--help)
      cat >&2 <<'USAGE'
Usage: scripts/sync-serving-roots.sh [DIST] [--html-root DIR] [--webroot DIR] [--backup-dir DIR] [--verify-only]
USAGE
      exit 0
      ;;
    *)
      if [[ -z "$POSITIONAL_DIST" ]]; then
        POSITIONAL_DIST="$1"
        shift
      else
        echo "ERROR: unknown argument: $1" >&2
        exit 2
      fi
      ;;
  esac
done

[[ -n "$POSITIONAL_DIST" ]] && DIST="$POSITIONAL_DIST"
TOP="$(realpath -m "$TOP")"
DIST="$(realpath -m "$DIST")"
[[ -n "$BK" ]] || BK="/root/backups/arif-sites/split-roots-backup-$TS"
LOG_PREFIX="[split-roots]"

# Root-static files served by @root_static (Caddy vhosts/arif-fazil.com.conf).
ROOT_STATIC_FILES=(
  surfaces.json llms.json llms.txt page.json llms-full.txt sitemap.xml floors.json
  human.md AGENTS.md robots.txt rsl.xml soul.json feed.xml
)

fail_if_injected() {
  local completed_stage="$1"
  if [[ -n "${ARIF_SITES_FAIL_AFTER_SPLIT_DIR:-}" && "$ARIF_SITES_FAIL_AFTER_SPLIT_DIR" == "$completed_stage" ]]; then
    echo "$LOG_PREFIX INJECTED_FAILURE after updating '$completed_stage'" >&2
    return 1
  fi
  return 0
}

snapshot_existing_dir() {
  local dir_name="$1"
  if ((SKIP_BACKUP == 0)) && [ -d "$TOP/$dir_name" ]; then
    mkdir -p "$BK"
    cp -a "$TOP/$dir_name" "$BK/$dir_name"
  fi
}

echo "$LOG_PREFIX dist=$DIST top=$TOP verify_only=$VERIFY_ONLY"

if ((VERIFY_ONLY == 0)); then
  [[ -d "$DIST" ]] || { echo "$LOG_PREFIX ERROR: DIST missing: $DIST" >&2; exit 1; }

  # 1. earth tree
  if [ -d "$DIST/earth" ]; then
    snapshot_existing_dir "earth"
    mkdir -p "$TOP/earth"
    rsync -ac --delete "$DIST/earth/" "$TOP/earth/"
    echo "$LOG_PREFIX synced earth/ ($(find "$TOP/earth" -type f | wc -l) files)"
    fail_if_injected "earth" || exit 1
  elif ((ALLOW_EMPTY_SPLIT == 0)); then
    echo "$LOG_PREFIX WARN: no earth/ in dist — skipping (build first?)" >&2
  fi

  # 1d. words / world / work / pilot trees
  for d in words world work pilot; do
    if [ -d "$DIST/$d" ]; then
      snapshot_existing_dir "$d"
      mkdir -p "$TOP/$d"
      rsync -ac --delete "$DIST/$d/" "$TOP/$d/"
      echo "$LOG_PREFIX synced $d/ ($(find "$TOP/$d" -type f | wc -l) files)"
      fail_if_injected "$d" || exit 1
    elif ((ALLOW_EMPTY_SPLIT == 0)); then
      echo "$LOG_PREFIX WARN: no $d/ in dist — skipping (build first?)" >&2
    fi
  done

  # 1b. _shared tree
  if [ -d "$DIST/_shared" ]; then
    snapshot_existing_dir "_shared"
    mkdir -p "$TOP/_shared"
    rsync -ac "$DIST/_shared/" "$TOP/_shared/"
    echo "$LOG_PREFIX synced _shared/ ($(find "$TOP/_shared" -type f | wc -l) files)"
    fail_if_injected "_shared" || exit 1
  fi

  # 1c. trinity static tops + discovery (merge-only, never delete pre-existing extras)
  for d in human institution connect laws verify discovery research .well-known; do
    if [ -d "$DIST/$d" ]; then
      snapshot_existing_dir "$d"
      mkdir -p "$TOP/$d"
      rsync -ac "$DIST/$d/" "$TOP/$d/"
      if [ "$DIST" != "$TOP/arif" ]; then
        mkdir -p "$TOP/arif/$d"
        rsync -ac "$DIST/$d/" "$TOP/arif/$d/"
      fi
      echo "$LOG_PREFIX synced $d/ ($(find "$TOP/$d" -type f | wc -l) files)"
      fail_if_injected "$d" || exit 1
    elif ((ALLOW_EMPTY_SPLIT == 0)); then
      echo "$LOG_PREFIX WARN: no $d/ in dist — skipping" >&2
    fi
  done

  # 2. root-static files (@root_static handler)
  synced=0
  for f in "${ROOT_STATIC_FILES[@]}"; do
    if [ -f "$DIST/$f" ]; then
      if ((SKIP_BACKUP == 0)) && [ -f "$TOP/$f" ]; then
        mkdir -p "$BK"
        cp -a "$TOP/$f" "$BK/${f}.bak"
      fi
      cp -a "$DIST/$f" "$TOP/$f"
      if [ "$DIST" != "$TOP/arif" ]; then
        mkdir -p "$TOP/arif"
        cp -a "$DIST/$f" "$TOP/arif/$f"
      fi
      synced=$((synced + 1))
    fi
  done
  echo "$LOG_PREFIX synced $synced root-static files (to $TOP and $TOP/arif)"
  fail_if_injected "root_static" || exit 1
fi

# 3. F2 local-byte verification (no pipeline masking!)
fail=0
probe_local() {
  local target_file="$1"
  local marker="$2"
  local label="$3"
  if [ -f "$target_file" ] && grep -qF -- "$marker" "$target_file"; then
    echo "$LOG_PREFIX   PASS $label"
  else
    echo "$LOG_PREFIX   FAIL $label — MARKER MISSING in $target_file" >&2
    fail=1
  fi
}
probe_local "$TOP/surfaces.json" "kinabalu" "surfaces.json carries earth dossiers"
probe_local "$TOP/earth/index.html" "/map/#earth" "earth page links to canonical /map/#earth"
probe_local "$TOP/llms.json" "arif-fazil.com" "llms.json serves"
probe_local "$TOP/llms.txt" "Does not adjudicate" "llms.txt is the compact professional map"
probe_local "$TOP/human/index.html" "<title>Start here — agents</title>" "human/ is agent start-here (M1.3 SPA shell, canonical title intact)"
probe_local "$TOP/institution/index.html" "<title>Briefing — Arif Fazil</title>" "institution/ is briefing (M1.3 SPA shell, canonical title intact)"
probe_local "$TOP/institution/index.html" "name=\"description\"" "institution/ shell carries meta description"

if [ "$fail" -ne 0 ]; then
  echo "$LOG_PREFIX FAILED local verification" >&2
  exit 1
fi
echo "$LOG_PREFIX OK serving roots aligned with dist"
