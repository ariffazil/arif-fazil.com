#!/bin/sh
# verify.sh — re-derive every hash in SOURCES.sha256. Fail-closed verifier.
#
# Exit classes (audit P0B 2026-11-19, ARIF):
#   0  VERIFIED              every pinned source present and hash-matching
#  10  REQUIRED_SOURCE_MISSING  manifest missing/empty, or pinned source absent
#  11  HASH_MISMATCH          pinned source changed since generation
#  12  SCHEMA_INVALID         malformed manifest line
#  14  UNPINNED_SOURCE        MISSING marker or advancing source absent on disk
#
# History: 2026-09-20 first fail-closed fix (relative-cwd zero-check pass).
# 2026-11-19 second closure: ABSENT pinned sources and ADV-MISSING advancing
# sources previously counted but did NOT fail the exit — the verifier could
# print LEDGER_MATCHES_DISK while inputs were missing. A missing input is now
# a failure, never a pass. (External audit F-3, ARIF-prescribed.)
set -u

SELF_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
MANIFEST="$SELF_DIR/SOURCES.sha256"

fail_hash=0; missing=0; unpinned=0; malformed=0; n=0; advanced=0
section=1

if [ ! -f "$MANIFEST" ]; then
  echo "VERDICT: REQUIRED_SOURCE_MISSING — no manifest at $MANIFEST"
  exit 10
fi

while IFS= read -r line; do
  case "$line" in
    "# SECTION 2"*) section=2; continue ;;
    "#"*|"") continue ;;
  esac
  n=$((n+1))
  hash=$(printf '%s' "$line" | cut -d' ' -f1)
  if [ "$section" -eq 2 ]; then
    # ADVANCING format: "<sha256>  <lines_at_build>  <path>" — expected to move.
    lines_at_build=$(printf '%s' "$line" | awk '{print $2}')
    path=$(printf '%s' "$line" | awk '{for(i=3;i<=NF;i++) printf "%s%s", $i, (i<NF?" ":"")}')
    if [ -z "$path" ]; then
      echo "SCHEMA_INVALID  $line"; malformed=$((malformed+1)); continue
    fi
    if [ ! -f "$path" ]; then
      echo "UNPINNED-ABSENT  $path"; unpinned=$((unpinned+1)); advanced=$((advanced+1)); continue
    fi
    now_lines=$(wc -l < "$path" 2>/dev/null || echo 0)
    echo "ADVANCING    $path  (lines $lines_at_build -> $now_lines at build/now)"
    advanced=$((advanced+1)); continue
  fi
  # PINNED format: "<sha256>  <path>"
  path=$(printf '%s' "$line" | awk '{for(i=2;i<=NF;i++) printf "%s%s", $i, (i<NF?" ":"")}')
  if [ -z "$path" ]; then
    echo "SCHEMA_INVALID  $line"; malformed=$((malformed+1)); continue
  fi
  if [ "$hash" = "MISSING" ]; then
    echo "UNPINNED    $path"; unpinned=$((unpinned+1)); continue
  fi
  if [ ! -f "$path" ]; then
    echo "SOURCE_MISSING  $path"; missing=$((missing+1)); continue
  fi
  got=$(sha256sum "$path" | cut -d' ' -f1)
  if [ "$got" = "$hash" ]; then echo "OK       $path"; else echo "HASH_MISMATCH  $path"; fail_hash=$((fail_hash+1)); fi
done < "$MANIFEST"

echo "---"
echo "pinned checked $n | hash mismatches $fail_hash | sources missing $missing | unpinned $unpinned | malformed $malformed | advancing $advanced"

if [ "$n" -eq 0 ]; then
  echo "VERDICT: REQUIRED_SOURCE_MISSING — manifest is empty (checked nothing)"
  exit 10
fi
if [ "$fail_hash" -gt 0 ]; then
  echo "VERDICT: HASH_MISMATCH — $fail_hash pinned source(s) changed since generation"
  exit 11
fi
if [ "$missing" -gt 0 ]; then
  echo "VERDICT: REQUIRED_SOURCE_MISSING — $missing pinned source(s) absent from disk"
  exit 10
fi
if [ "$malformed" -gt 0 ]; then
  echo "VERDICT: SCHEMA_INVALID — $malformed malformed manifest line(s)"
  exit 12
fi
if [ "$unpinned" -gt 0 ]; then
  echo "VERDICT: UNPINNED_SOURCE — $unpinned source(s) unpinned or advancing-absent (reported, not proven)"
  exit 14
fi
echo "VERDICT: VERIFIED — every pinned input present and hash-matching"
exit 0
