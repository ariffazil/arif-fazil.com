#!/bin/sh
# verify.sh — re-derive every hash in SOURCES.sha256. Any FAIL means the ledger
# no longer describes the disk, and the ledger should be treated as stale.
#
# FAIL-CLOSED (2026-09-20): this script used to read SOURCES.sha256 relative to
# the CALLER's cwd. Run from anywhere else, the read produced zero lines, the
# loop never executed, fail stayed 0 — and it printed "LEDGER_MATCHES_DISK"
# after checking NOTHING. A gate that reports PASS after checking zero items is
# the exact false-pass pattern this ledger exists to catch, so it is fixed here:
# the manifest is resolved relative to THIS script, and an empty or unreadable
# manifest is a failure, never a pass.
set -u

SELF_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
MANIFEST="$SELF_DIR/SOURCES.sha256"

if [ ! -f "$MANIFEST" ]; then
  echo "VERDICT: LEDGER_UNVERIFIABLE — no manifest at $MANIFEST"
  exit 3
fi

fail=0; n=0; present=0; advanced=0
section=1
while IFS= read -r line; do
  case "$line" in
    "# SECTION 2"*) section=2; continue ;;
    "#"*|"") continue ;;
  esac
  n=$((n+1))
  hash=$(printf '%s' "$line" | cut -d' ' -f1)
  if [ "$section" -eq 2 ]; then
    # ADVANCING format: "<sha256>  <lines_at_build>  <path>"
    lines_at_build=$(printf '%s' "$line" | awk '{print $2}')
    path=$(printf '%s' "$line" | awk '{for(i=3;i<=NF;i++) printf "%s%s", $i, (i<NF?" ":"")}')
    if [ -z "$path" ]; then
      echo "MALFORMED  $line"; fail=$((fail+1)); continue
    fi
    if [ ! -f "$path" ]; then
      echo "ADV-MISSING  $path"; advanced=$((advanced+1)); continue
    fi
    now_lines=$(wc -l < "$path" 2>/dev/null || echo 0)
    echo "ADVANCING    $path  (lines $lines_at_build -> $now_lines at build/now)"
    advanced=$((advanced+1)); continue
  fi
  # PINNED format: "<sha256>  <path>" — path is every field after the hash.
  path=$(printf '%s' "$line" | awk '{for(i=2;i<=NF;i++) printf "%s%s", $i, (i<NF?" ":"")}')
  if [ -z "$path" ]; then
    echo "MALFORMED  $line"; fail=$((fail+1)); continue
  fi
  if [ "$hash" = "MISSING" ]; then
    echo "MISSING  $path"; fail=$((fail+1)); continue
  fi
  if [ ! -f "$path" ]; then
    echo "ABSENT   $path"; present=$((present+1)); continue
  fi
  got=$(sha256sum "$path" | cut -d' ' -f1)
  if [ "$got" = "$hash" ]; then echo "OK       $path"; else echo "FAIL     $path"; fail=$((fail+1)); fi
done < "$MANIFEST"

echo "---"
echo "pinned checked $n | hash mismatches $fail | sources absent $present | advancing $advanced"

if [ "$n" -eq 0 ]; then
  echo "VERDICT: LEDGER_UNVERIFIABLE — manifest is empty (checked nothing)"
  exit 3
fi
if [ "$fail" -gt 0 ]; then
  echo "VERDICT: LEDGER_STALE — $fail pinned source(s) changed since generation"
  exit 1
fi
echo "VERDICT: LEDGER_MATCHES_DISK"
exit 0
