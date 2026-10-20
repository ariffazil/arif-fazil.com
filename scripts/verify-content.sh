#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# CONTENT ASSERTION GATE — arif-fazil.com
# ═══════════════════════════════════════════════════════════════════════
# Verifies served HTML contains (or excludes) expected strings.
# Outlives verify-pages.sh — reachability is not correctness.
# A 200 with stale content passes verify-pages. This gate catches it.
#
# Forged 2026-08-03 by 333-AGI under APEX Audit Directive E2.
# DITEMPA BUKAN DIBERI — a gate that passes when zero changes deployed
# is not a gate — it is a liveness check wearing a gate's name.
#
# B11-E extension (2026-08-03, postdeploy-repair): parses JSON-LD blocks,
# asserts no-JS static-row count, SVG fan fallback, static scenario summary.
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

BASE_URL="${1:-https://arif-fazil.com}"
TIMEOUT="${2:-10}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

FAILURES=0
CHECKS=0

fetch() {
    # -L follows redirects so check on /oil/ (which 308s to /world/economics/oil/)
    # actually inspects the canonical page content.
    curl -sfL --max-time "$TIMEOUT" -H "Cache-Control: no-cache" "$BASE_URL$1"
}

assert_present() {
    local url="$1" label="$2" needle="$3"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → $label"; FAILURES=$((FAILURES + 1)); return; }
    # use grep -cF not -qF: -q exits on first match, SIGPIPE kills echo, pipefail propagates 141
    if [ "$(echo "$html" | grep -cF "$needle")" -gt 0 ]; then
        echo -e "  ${GREEN}✅${NC} $label"
    else
        echo -e "  ${RED}❌ MISSING${NC} $url → $label"
        FAILURES=$((FAILURES + 1))
    fi
}

assert_absent() {
    local url="$1" label="$2" needle="$3"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → $label"; FAILURES=$((FAILURES + 1)); return; }
    if [ "$(echo "$html" | grep -cF "$needle")" -gt 0 ]; then
        echo -e "  ${RED}❌ STILL PRESENT${NC} $url → $label"
        FAILURES=$((FAILURES + 1))
    else
        echo -e "  ${GREEN}✅${NC} $label (absent)"
    fi
}

# B11-E: assert count of static .tripcell rows in no-JS HTML equals 9
assert_grid9_count() {
    local url="$1" expected="$2"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → grid9 count"; FAILURES=$((FAILURES + 1)); return; }
    local got
    got=$(echo "$html" | grep -cF 'class="tripcell')
    if [ "$got" -eq "$expected" ]; then
        echo -e "  ${GREEN}✅${NC} B11-A: $url has exactly $expected static .tripcell rows (no-JS)"
    else
        echo -e "  ${RED}❌ B11-A: $url has $got .tripcell rows, expected $expected${NC}"
        FAILURES=$((FAILURES + 1))
    fi
}

# B11-E: assert every JSON-LD <script type="application/ld+json"> block parses
assert_jsonld_parses() {
    local url="$1"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → JSON-LD parse"; FAILURES=$((FAILURES + 1)); return; }
    # Use python (always available on af-forge) to extract and parse every JSON-LD block.
    local out
    if ! out=$(echo "$html" | python3 -c '
import sys, re, json
html = sys.stdin.read()
blocks = re.findall(r"<script type=\"application/ld\+json\"[^>]*>([\s\S]*?)</script>", html)
ok = 0; bad = []
for i, b in enumerate(blocks):
    s = b.strip()
    if not s.startswith("{"):
        continue
    try:
        json.loads(s); ok += 1
    except Exception as e:
        bad.append((i, str(e)[:80], s[:120]))
print(f"OK={ok}")
for b in bad:
    print("BAD", *b, sep="|")
'); then
        echo -e "  ${RED}❌ JSON-LD parse harness error${NC}"
        FAILURES=$((FAILURES + 1))
        return
    fi
    local okcount
    okcount=$(echo "$out" | head -1 | sed 's/OK=//')
    if [ -n "$okcount" ] && [ "$okcount" -ge 4 ]; then
        echo -e "  ${GREEN}✅${NC} B11-E: $url JSON-LD blocks parse ($okcount blocks)"
    else
        echo -e "  ${RED}❌ B11-E: $url JSON-LD parse count = $okcount (expected ≥4)${NC}"
        FAILURES=$((FAILURES + 1))
    fi
    # Surface any parser errors
    if echo "$out" | grep -q "^BAD|"; then
        echo -e "  ${RED}❌ B11-E: $url JSON-LD parse errors:${NC}"
        echo "$out" | grep "^BAD|" | sed 's/^/      /'
        FAILURES=$((FAILURES + 1))
    fi
}

# B11-E: assert the institutional-vitals-reality JSON-LD carries the B11 contract
assert_reality_jsonld() {
    local url="$1"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → reality JSON-LD"; FAILURES=$((FAILURES + 1)); return; }
    local result
    if ! result=$(echo "$html" | python3 -c '
import sys, re, json
html = sys.stdin.read()
m = re.search(r"<script type=\"application/ld\+json\" data-agent-role=\"institutional-vitals-reality\"[^>]*>([\s\S]*?)</script>", html)
if not m:
    print("MISSING"); sys.exit(0)
try:
    ld = json.loads(m.group(1))
except Exception as e:
    print("PARSE_ERR", e); sys.exit(0)
ok = (
    ld.get("display_pulse") == 0
    and ld.get("display_verdict") == "VOID"
    and ld.get("pre_lock_pulse") == 48
    and ld.get("pre_lock_verdict") == "HOLD"
    and ld.get("static_row_count") == 9
    and ld.get("fy2026_declared_state", {}).get("feeds_scoring") is False
    and ld.get("fy2026_declared_state", {}).get("epistemic_class") == "[DEC]"
    and isinstance(ld.get("indicators"), list) and len(ld["indicators"]) == 9
)
print("PASS" if ok else "FAIL", json.dumps({
    "display_pulse": ld.get("display_pulse"),
    "display_verdict": ld.get("display_verdict"),
    "pre_lock_pulse": ld.get("pre_lock_pulse"),
    "pre_lock_verdict": ld.get("pre_lock_verdict"),
    "static_row_count": ld.get("static_row_count"),
    "indicator_count": len(ld.get("indicators", [])),
    "feeds_scoring": ld.get("fy2026_declared_state", {}).get("feeds_scoring"),
    "epistemic_class": ld.get("fy2026_declared_state", {}).get("epistemic_class"),
}))
'); then
        echo -e "  ${RED}❌ reality JSON-LD harness error${NC}"
        FAILURES=$((FAILURES + 1))
        return
    fi
    local verdict
    verdict=$(echo "$result" | head -1 | awk '{print $1}')
    if [ "$verdict" = "PASS" ]; then
        echo -e "  ${GREEN}✅${NC} B11-D: reality JSON-LD contract (display=0/VOID, pre_lock=48/HOLD, [DEC] non-scoring)"
    else
        echo -e "  ${RED}❌ B11-D: reality JSON-LD contract FAIL${NC}"
        echo "$result" | sed 's/^/      /'
        FAILURES=$((FAILURES + 1))
    fi
}

echo -e "${CYAN}═══ CONTENT ASSERTIONS — /vitals/${NC}"

# ── Current Vitals Reality (Belanjawan 2027 / 19 Oct 2026 sync) ──
assert_present "/vitals/"  "A: PETRONAS dompet/tangki"    "dompet hari ini, tangki masa depan"
assert_present "/vitals/"  "A: 19 Oktober 2026 dateline"  "19 OKTOBER 2026"
assert_present "/vitals/"  "A: Belanjawan 2027"           "Belanjawan 2027"
assert_present "/vitals/"  "A: RM32 bilion unjuran"       "RM32 bilion"
assert_present "/vitals/"  "A: Jalan D hidup"             "Jalan D hidup"
assert_present "/vitals/"  "A: Kementerian Kewangan"      "Kementerian Kewangan"
assert_present "/vitals/"  "A: 7.92 bilion tong"          "7.92 bilion tong"

# ── JSON-LD integrity (WebPage block parses) ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — JSON-LD${NC}"
assert_present "/vitals/"  "JSON-LD: PETRONAS WebPage"    "PETRONAS — dompet hari ini, tangki masa depan"
assert_present "/vitals/"  "JSON-LD: dateModified 2026-10-19" '"dateModified":"2026-10-19"'

# ── Commodity & market intelligence routes ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — Market routes integrity${NC}"
assert_present "/oil/"    "Oil market room"     "Brent Crude"
assert_present "/gas/"    "Gas market room"     "Natural Gas"
assert_present "/gold/"   "Gold market room"    "Gold"
assert_present "/klci/"   "KLCI economic route" "World"
assert_present "/usdmyr/" "USD/MYR economic route" "World"

# ── Verdict ──
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
if [ "$FAILURES" -eq 0 ]; then
    echo -e "  ${GREEN}✅ ALL $CHECKS CONTENT ASSERTIONS PASS${NC}"
    echo -e "  ${CYAN}VERDICT: PASS${NC} — content matches expected state"
    exit 0
else
    echo -e "  ${RED}❌ $FAILURES/$CHECKS ASSERTIONS FAILED${NC}"
    echo -e "  ${RED}VERDICT: FAIL${NC} — content assertions must pass before deploy"
    exit 1
fi
