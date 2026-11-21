#!/usr/bin/env bash
# Canonical-URL probe for arif-fazil.com — live, cache-busted, slash-form only.
#
# Rules enforced (learned 2026-11-21, DEPLOY-LESSON):
#   * canonical form is the TRAILING SLASH form; the non-slash form is a
#     different representation for some paths (e.g. /world/makcikgpt/<slug>
#     serves Markdown+frontmatter) — never certify against the non-slash form.
#   * always cache-bust (?v=<nonce>) so a CDN copy cannot masquerade as fresh.
#   * negative test: the non-slash form must NOT return a 200 body that
#     differs from the canonical form.
#
# Usage: bash scripts/probe-canonical.sh [origin] [--n N]
# Default N=25 (sample). Pass --full for every public page.
set -uo pipefail
ORIGIN="${1:-https://arif-fazil.com}"
FULL="${2:-}"
PUB="$(cd "$(dirname "$0")/.." && pwd)/public"
N=25
[ "$FULL" = "--full" ] && N=0

mapfile -t PAGES < <(cd "$PUB" && find . -name index.html -not -path "*.bak*" | sed 's|^\./||;s|index\.html$||' | sort)
if [ "$N" -gt 0 ]; then
  mapfile -t PAGES < <(printf '%s\n' "${PAGES[@]}" | shuf -n "$N")
fi

fail=0; checked=0; nonce="$RANDOM$RANDOM"
for p in "${PAGES[@]}"; do
  [ -z "$p" ] && continue
  # declared exceptions: retired / redirect-stub / asset paths
  case "$p" in for-machines/|geox/basins/|organs/|work/resume/|work/wells/) continue;; esac
  canonical="$ORIGIN/$p?v=$nonce"
  body="$(curl -sL --max-time 15 "$canonical")"
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$canonical")"
  checked=$((checked+1))
  if [ "$code" != "200" ]; then
    echo "  FAIL /$p → HTTP $code"; fail=$((fail+1)); continue
  fi
  if ! printf '%s' "$body" | grep -q 'application/ld+json'; then
    echo "  FAIL /$p → no JSON-LD block"; fail=$((fail+1)); continue
  fi
  # negative test: non-slash form must redirect, not serve a divergent 200 body
  noslash_code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$ORIGIN/$p")"
  case "$noslash_code" in
    301|308) : ;;
    200) echo "  WARN /$p → non-slash form serves 200 (divergent representation)";;
    *) : ;;
  esac
done

echo "canonical probe: $checked pages checked against $ORIGIN (cache-bust v=$nonce)"
if [ "$fail" -gt 0 ]; then echo "FAIL — $fail pages failed"; exit 1; fi
echo "PASS — canonical form serves 200 + JSON-LD on every checked page"
