#!/usr/bin/env bash
# weekly-site-check.sh — one line PASS/FAIL to /root/work/tasks.json (UPGRADE-PLAN P3)
# Runs the two machine gates that catch what dashboards miss:
#   1. verify-pages  — every dist page reachable live (200)
#   2. mobile-check  — iPhone-viewport overflow sweep, browser UA (human lane)
# Output: ONE line appended to /root/work/tasks.json (not a dashboard).
set -u
REPO=/root/arif-fazil.com
SITE=$REPO/sites/arif-fazil.com
OUT=/root/work/tasks.json
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

declare -a FAILNOTES=()

if ! (cd "$REPO" && make verify-pages > /tmp/weekly-verify-pages.log 2>&1); then
  FAILNOTES+=("verify-pages: $(grep -m1 'GAPS DETECTED\|VERDICT' /tmp/weekly-verify-pages.log | tr -d '\n')")
fi

if ! python3 "$SITE/scripts/mobile-check.py" --all > /tmp/weekly-mobile-check.log 2>&1; then
  BAD=$(python3 -c "import json;print(len(json.load(open('/tmp/mobile-check-last.json'))['bad']))" 2>/dev/null || echo '?')
  FAILNOTES+=("mobile-sweep: ${BAD} bad pages (see /tmp/mobile-check-last.json)")
fi

STATUS=PASS; [ ${#FAILNOTES[@]} -gt 0 ] && STATUS=FAIL
LINE="{\"ts\":\"$TS\",\"check\":\"weekly-site-check\",\"status\":\"$STATUS\""
[ ${#FAILNOTES[@]} -gt 0 ] && LINE="$LINE,\"notes\":\"${FAILNOTES[*]}\""
LINE="$LINE}"

mkdir -p /root/work
echo "$LINE" >> "$OUT"
echo "$LINE"
[ "$STATUS" = "PASS" ]
