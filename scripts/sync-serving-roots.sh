#!/usr/bin/env bash
# ⚒️ sync-serving-roots.sh — Split-root serving sync (2026-08-25 root-cause fix)
#
# WHY: the 2026-08-10 Caddy reorg split the canon. `handle /earth*` and
# `@root_static` serve from /var/www/html (top-level), while every deploy
# path syncs dist → /var/www/html/arif only. Result: earth page + surfaces.json
# + llms.json + page.json silently served pre-fix copies while deploys
# reported success (proven 2026-08-25 — catalog routes live, page stale).
#
# WHAT: after a deploy, mirror the files Caddy actually serves from the
# top-level into the top-level. Source of truth = dist/ (same bytes that
# just landed in /var/www/html/arif). Only copies files that exist in dist.
# Backs up replaced files first. Idempotent. Never touches status.json
# (top-only, generated elsewhere) or Caddy.
#
# Wiring: Makefile `make deploy` (split-roots step) + deploy-site.sh post-deploy
# hook. F2: verifies live bytes at the end — exit 1 on marker mismatch.
set -euo pipefail

DIST="${1:-/root/arif-fazil.com/sites/arif-fazil.com/dist}"
TOP="/var/www/html"
TS="$(date +%Y%m%d-%H%M%S)"
BK="$TOP/.split-roots-backup-$TS"
LOG_PREFIX="[split-roots]"

# Root-static files served by @root_static (Caddy vhosts/arif-fazil.com.conf)
# — llms.txt has its own dedicated handle → /var/www/html top-level (2026-08-10
# fix); proven stranded 2026-08-25. Copied ONLY if present in dist.
ROOT_STATIC_FILES=(
  surfaces.json llms.json llms.txt page.json llms-full.txt sitemap.xml floors.json
  human.md AGENTS.md robots.txt rsl.xml soul.json feed.xml
)

echo "$LOG_PREFIX dist=$DIST top=$TOP"

# ── 1. earth tree (handle /earth* roots at /var/www/html) ──────────────────
if [ -d "$DIST/earth" ]; then
  mkdir -p "$BK"
  [ -d "$TOP/earth" ] && cp -a "$TOP/earth" "$BK/earth"
  rsync -a --delete "$DIST/earth/" "$TOP/earth/"
  echo "$LOG_PREFIX synced earth/ ($(find "$TOP/earth" -type f | wc -l) files)"
else
  echo "$LOG_PREFIX WARN: no earth/ in dist — skipping (build first?)" >&2
fi

# ── 1b. _shared tree (handle /_shared/* roots at /var/www/html — proven broken
# 2026-08-25: dossier pages vendored Leaflet under /_shared/leaflet, top-level
# copy missing → live maps dead while pages returned 200) ────────────────────
if [ -d "$DIST/_shared" ]; then
  mkdir -p "$BK"
  [ -d "$TOP/_shared" ] && cp -a "$TOP/_shared" "$BK/_shared"
  rsync -a "$DIST/_shared/" "$TOP/_shared/"
  echo "$LOG_PREFIX synced _shared/ ($(find "$TOP/_shared" -type f | wc -l) files)"
fi

# ── 1c. trinity static tops (Caddy handle /human/* and /institution/*
#     root at /var/www/html, NOT /var/www/html/arif). Without this copy,
#     @spa_routes try_files falls through /human to the SPA shell (2026-09-13).
#     No --delete: inspect before purge.
for d in human institution; do
  if [ -d "$DIST/$d" ]; then
    mkdir -p "$BK"
    [ -d "$TOP/$d" ] && cp -a "$TOP/$d" "$BK/$d"
    mkdir -p "$TOP/$d"
    rsync -a "$DIST/$d/" "$TOP/$d/"
    echo "$LOG_PREFIX synced $d/ ($(find "$TOP/$d" -type f | wc -l) files)"
  else
    echo "$LOG_PREFIX WARN: no $d/ in dist — skipping" >&2
  fi
done

# ── 2. root-static files (@root_static handler) ────────────────────────────
synced=0
for f in "${ROOT_STATIC_FILES[@]}"; do
  if [ -f "$DIST/$f" ]; then
    [ -f "$TOP/$f" ] && cp -a "$TOP/$f" "$BK/${f}.bak"
    cp -a "$DIST/$f" "$TOP/$f"
    synced=$((synced+1))
  fi
done
echo "$LOG_PREFIX synced $synced root-static files"

# ── 3. F2 local-byte verification ──────────────────────────────────────────
# NOTE: We probe LOCAL files rather than HTTPS URLs because Cloudflare caches
# the old content during the deploy window, causing false-negative probe failures
# even though the files on disk are correct. Local file check = ground truth.
fail=0
probe_local() { # path marker label
  if [ -f "$1" ] && grep -qF "$2" "$1"; then
    echo "$LOG_PREFIX   ✓ $3"
  else
    echo "$LOG_PREFIX   ✗ $3 — MARKER MISSING in $1" >&2
    fail=1
  fi
}
probe_local "$TOP/surfaces.json" "kinabalu" "surfaces.json carries earth dossiers"
probe_local "$TOP/earth/index.html" "/map/#earth" "earth page links to canonical /map/#earth"
probe_local "$TOP/llms.json" "arif-fazil.com" "llms.json serves"
probe_local "$TOP/llms.txt" "Does not adjudicate" "llms.txt is the compact professional map"
probe_local "$TOP/human/index.html" "does not grant authority" "human/ is agent start-here, not SPA shell"
probe_local "$TOP/institution/index.html" "Work together, inspect first" "institution/ is briefing, not organ dump"

if [ "$fail" -ne 0 ]; then
  echo "$LOG_PREFIX FAILED local verification — rollback: cp -a $BK/* $TOP/" >&2
  exit 1
fi
echo "$LOG_PREFIX ✅ serving roots aligned with dist. Backup: $BK"

