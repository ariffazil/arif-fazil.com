#!/usr/bin/env bash
# ═════════════════════════════════════════════════════════════════════
# CONTENT CONFIDENTIALITY GATE — arif-fazil.com deploy chain (v2)
# ═════════════════════════════════════════════════════════════════════
# Scope: /earth/ confidentiality corridor (both fabric copies).
# 1. Scans HTML+SVG+JSON for partner-confidential strings (hard).
# 2. Well-name hyphenated shapes ("Megah-1", "Zoisit Deep-1") — allowlist tepat.
#    Ordinals ("Block 1", "Tier 2") pass by design. All-caps IDs (BGR01) pass.
# 3. Reserve/volume figures allowed ONLY on lines citing Bait 2003 (public).
# 4. Fetches LIVE URL the real-user path (no cache-buster) and re-greps.
#
# Fail-closed: any FAIL → exit 1 → deploy chain HALTS before verify-pages.
# Forged 2026-10-06 · 333-AGI (auditor fixes #2–#4, session SEAL-57418458d48343e1)
# Companion to GEOX SVG gate (geox_mcp/tools/model_physics.py).
# DITEMPA BUKAN DIBERI
# ═════════════════════════════════════════════════════════════════════
set -euo pipefail

TARGETS=("/var/www/html/earth" "/root/arif-fazil.com/sites/arif-fazil.com/dist/earth")
LIVE_URLS=("https://arif-fazil.com/earth/kinabalu-cross-section.html" "https://arif-fazil.com/earth/kinabalu-basin/" "https://arif-fazil.com/earth/case-study.html")

# Unique internal tokens only (substring, hard fail).
# megah/nuri/rotan are common Malay words AND megah-1 is PUBLIC (Upstream/NST 2026
# FPSO tender) — they are matched by WELL shape + allowlist, never bare substring.
STRINGS=(zoisit pekaka "ll-1")
WELL_PAT='\b[A-Z][a-z]{2,}-[0-9]\b|\b[A-Z][a-z]{2,} Deep-[0-9]\b'
# Public wells (adjudicated, provenance in comments):
#  Tepat-1  → Banerjee & Salim 2020 (JNGSE 83)
#  Emas-1   → PETRONAS media release: Lebah Emas-1 discovery, 2025
#  Megah-1  → Upstream/NST 2026: FPSO tender for Megah-1 discovery
WELL_ALLOW="(tepatt?|emas-[0-9]|megah-[0-9])"
VOL_PAT='[0-9]+(\.[0-9]+)? ?(MMbbl|MMstb|Tcf|Bcf|bboe)'
RESERVE_PAT='\bOOIP\b|\bGIIP\b|\bSTOIIP\b'
CITED_VOLUME="Bait 2003" # public provenance: Bait (2003), GSM Bull 47

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
FAILS=0
TS=$(date -u +'%Y-%m-%dT%H:%M:%SZ')

echo "┌─ CONTENT CONFIDENTIALITY GATE v2 — $TS"
echo "│  targets: ${TARGETS[*]}"

for D in "${TARGETS[@]}"; do
	[ -d "$D" ] || continue
	while IFS= read -r -d '' f; do
		rel="${f#$D/}"
		for s in "${STRINGS[@]}"; do
			if grep -qi "$s" "$f" 2>/dev/null; then
				echo -e "${RED}│  ✗ FAIL${NC} string '$s' in $D/$rel"
				FAILS=$((FAILS + 1))
			fi
		done
		case "$f" in
			*.svg) WELLS="" ;;  # SVG font-weight tokens (Bold-3) are noise; unique strings still scanned
			*) WELLS=$((grep -oE "$WELL_PAT" "$f" 2>/dev/null || true) | grep -ivE "$WELL_ALLOW" || true | sort -u || true | tr '\n' ',' || true) ;;
		esac
		if [ -n "$WELLS" ]; then
			echo -e "${RED}│  ✗ FAIL${NC} well-name shape in $D/$rel: $WELLS"
			FAILS=$((FAILS + 1))
		fi
		if grep -qiE "$RESERVE_PAT|$VOL_PAT" "$f" 2>/dev/null; then
			while IFS= read -r line; do
				if ! grep -q "$CITED_VOLUME" <<<"$line"; then
					echo -e "${RED}│  ✗ FAIL${NC} uncited reserve/volume in $D/$rel: $(grep -oE "$VOL_PAT|$RESERVE_PAT" <<<"$line" | head -2 | tr '\n' ' ')"
					FAILS=$((FAILS + 1))
				fi
			done < <(grep -iE "$RESERVE_PAT|$VOL_PAT" "$f" 2>/dev/null)
		fi
	done < <(find "$D" \( -name "*.html" -o -name "*.svg" -o -name "*.json" \) -print0 2>/dev/null)
done
echo "│  corridor scan complete"

# ── LIVE page checks (real user path, no cache-buster) ────────────
LIVE_VERDICT=""
for LU in "${LIVE_URLS[@]}"; do
  LIVE_TMP=$(mktemp)
  HTTP=$(curl -s -w "%{http_code}" -o "$LIVE_TMP" "$LU" || echo 000)
  HITS=""
  for s2 in "${STRINGS[@]}"; do
    grep -qi "$s2" "$LIVE_TMP" 2>/dev/null && HITS="$HITS $s2"
  done
  grep -oE "$WELL_PAT" "$LIVE_TMP" 2>/dev/null | grep -ivE "$WELL_ALLOW" | sort -u | { grep -q . && HITS="$HITS well-shape" || true; } || true
  rm -f "$LIVE_TMP"
  if [ "$HTTP" = "200" ] && [ -z "$HITS" ]; then
    LIVE_VERDICT="$LIVE_VERDICT CLEAN($LU)"
    echo -e "│  live $LU → HTTP $HTTP ${GREEN}CLEAN${NC}"
  else
    LIVE_VERDICT="$LIVE_VERDICT FAIL($LU http=$HTTP hits=$HITS)"
    echo -e "${RED}│  ✗ FAIL live $LU → HTTP $HTTP hits:$HITS${NC}"
    FAILS=$((FAILS+1))
  fi
done

VERDICT=$([ "$FAILS" -eq 0 ] && echo PASS || echo BLOCKED)
echo "│  strings=${#STRINGS[@]} patterns=3 allowlist=tepat|emas-#|megah-# cited_volume='$CITED_VOLUME'"
echo "└─ $VERDICT · fails=$FAILS"
printf '{"gate":"scan-confidential","version":3,"ts":"%s","targets":"%s","live":"%s","live_verdict":"%s","fails":%s,"verdict":"%s"}\n' \
	"$TS" "${TARGETS[*]}" "$LIVE_VERDICT" "$FAILS" "$VERDICT"
[ "$FAILS" -eq 0 ] || exit 1
