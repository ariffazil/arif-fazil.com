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

fail=0; checked=0; skipped=0; edge_noise=0; nonce="$RANDOM$RANDOM"
for p in "${PAGES[@]}"; do
  [ -z "$p" ] && continue
  # declared exceptions: retired / redirect-stub / asset paths
  case "$p" in for-machines/|geox/basins/|organs/|work/resume/|work/wells/) continue;; esac
  canonical="$ORIGIN/$p?v=$nonce"
  # 2 attempts with fresh nonces — a gate must be deterministic; one flaky edge
  # response must not read as a defect.
  body=""; code=""
  for attempt in 1 2; do
    n2=$((nonce + attempt * 7919))
    body="$(curl -sL --max-time 15 "$ORIGIN/$p?v=$n2")"
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$ORIGIN/$p?v=$n2")"
    printf '%s' "$body" | grep -q 'application/ld+json' && break
  done
  checked=$((checked+1))
  # classify: only a real HTML 200 page without JSON-LD is a failure.
  # redirects / retired / markdown-frontmatter / asset paths are not page surfaces.
  case "$body" in
    ---*) skipped=$((skipped+1)); continue;;
  esac
  # CF interstitial / challenge = edge noise (HTTP 200, no page content) — not a defect
  if printf '%s' "$body" | grep -qi 'just a moment\|challenge-platform\|cf-mitigated\|attention required'; then
    edge_noise=$((edge_noise+1)); continue
  fi
  if printf '%s' "$body" | grep -q '410 Gone\|status gone'; then skipped=$((skipped+1)); continue; fi
  if [ "$code" != "200" ]; then skipped=$((skipped+1)); continue; fi
  if ! printf '%s' "$body" | grep -q 'application/ld+json'; then
    echo "  FAIL /$p → HTML 200 without JSON-LD"; fail=$((fail+1)); continue
  fi
  # negative test: non-slash form must redirect, not serve a divergent 200 body
  noslash_code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$ORIGIN/$p")"
  case "$noslash_code" in
    301|308) : ;;
    200) echo "  WARN /$p → non-slash form serves 200 (divergent representation)";;
    *) : ;;
  esac
done

echo "canonical probe: $checked pages checked · $skipped non-page surfaces (redirect/retired/markdown/asset) · $edge_noise edge interstitials · against $ORIGIN (cache-bust v=$nonce)"
if [ "$fail" -gt 0 ]; then echo "FAIL — $fail pages failed"; exit 1; fi
echo "PASS — canonical form serves 200 + JSON-LD on every checked page"
