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
    # 2026-10-05: narrative redesign carries 1 consolidated WebPage block; floor = 1 (all must parse).
    if [ -n "$okcount" ] && [ "$okcount" -ge 1 ]; then
        echo -e "  ${GREEN}✅${NC} B11-E: $url JSON-LD blocks parse ($okcount blocks)"
    else
        echo -e "  ${RED}❌ B11-E: $url JSON-LD parse count = $okcount (expected ≥1)${NC}"
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

echo -e "${CYAN}═══ CONTENT ASSERTIONS — /vitals/ (rewritten 2026-10-05: asserts the 27-Sep narrative page + 5-Okt reality-align; every needle verified to FRA 1H26 / IR2023-25 / Utusan-BH 2-3 Okt)${NC}"

# ── Alert (addendum 3 Okt, disemak 5 Okt) ──
assert_present "/vitals/"  "Alert: RM48B BIMB"              "RM48 bilion FY2026"
assert_present "/vitals/"  "Alert: RM20B baseline"          "Baseline Bajet 2026: <b>RM20B</b>"
assert_present "/vitals/"  "Alert: +140% delta"             "+RM28B (+140%)"
assert_present "/vitals/"  "Alert: 105.7% extraction"       "105.7% vs PAT FY2025"
assert_present "/vitals/"  "Alert: budget date"             "9 Oktober 2026"
assert_present "/vitals/"  "Alert: BIMB forward path"       "Laluan BIMB: RM32B (2027), RM25B (2028)"
assert_present "/vitals/"  "Alert: computed countdown"      'id="budget-countdown"'

# ── Hero cards ──
assert_present "/vitals/"  "Wallet: RM193.6B"               "RM193.6 bilion"
assert_present "/vitals/"  "Wallet: as-at 30 Jun 2026"      "30 Jun 2026"
assert_present "/vitals/"  "Wallet: drawdown chip"          "−RM10.8B sejak Dis 2025"
assert_present "/vitals/"  "Tank: 7.92 boe"                 "7.92 bilion tong"
assert_present "/vitals/"  "Tank: as-at 1 Jan 2026"         "Posisi 1 Jan 2026"

# ── Tank chart (IR2023/24/25, posisi 1 Januari) ──
assert_present "/vitals/"  "Chart: 2024 = 9.35"             "9.35"
assert_present "/vitals/"  "Chart: 2025 = 8.64"             "8.64"
assert_present "/vitals/"  "Chart: 2026 = 7.92"             "7.92"
assert_present "/vitals/"  "Chart: declines labelled -8%"   "−8%"
assert_present "/vitals/"  "Chart: next review microtext"   "semakan pertengahan 2027"
assert_present "/vitals/"  "Chart: positions are 1 Jan"     "Posisi setiap 1 Januari"

# ── Wallet vs tank answer dates (duit Feb 2027, tong pertengahan 2027) ──
assert_present "/vitals/"  "Answers: wallet Feb 2027"       "Duit dijawab Februari 2027"
assert_present "/vitals/"  "Answers: tank mid-2027"         "Tong dijawab pertengahan 2027"

# ── Deep layer: printed numbers (FRA 1H26 + FY2025, IR) ──
assert_present "/vitals/"  "Facts: cash Dec 2025"           "RM204.4"
assert_present "/vitals/"  "Facts: group debt"              "RM126.8"
assert_present "/vitals/"  "Facts: gearing 21.2%"           "21.2"
assert_present "/vitals/"  "Facts: H1 PAT RM27.2B"          "RM27.2"
assert_present "/vitals/"  "Facts: Searah gain RM5.0B"      "RM5.0"
assert_present "/vitals/"  "Facts: RM8B paid by 30 Jun"     "RM8 bilion"
assert_present "/vitals/"  "Facts: RM32B paid 2025"         "RM32 bilion"
assert_present "/vitals/"  "Facts: FY2025 PAT RM45.4B"      "RM45.4"
assert_present "/vitals/"  "Facts: Brent 1H26 avg"          'US$92.31'
assert_present "/vitals/"  "Facts: reserves as-at chain"    "1 Januari 2024"
assert_present "/vitals/"  "Facts: EnQuest not yet done"    "belum siap"

# ── Stale content stays out ──
assert_absent "/vitals/"   "Old: DIVIDEND STOP removed"     "DIVIDEND STOP EFFECTIVE"
assert_absent "/vitals/"   "Old: human override removed"    "No human override"
assert_absent "/vitals/"   "Old: tripwire cells removed"    "tripcell"
assert_absent "/vitals/"   "Old: pacemaker removed"         "pacemaker"
assert_absent "/vitals/"   "Old: 0.59 score removed"        "0.59/1.00"
assert_absent "/vitals/"   "Old: 83.78 removed"             "83.78"
assert_absent "/vitals/"   "Old: RM3.5B removed"            "RM3.5B"
assert_absent "/vitals/"   "B11-E: no '48 HOLD' marker"     "48 HOLD"
assert_absent "/data/wealth/petronas_vitals.json" "B11-E: source JSON no '48 HOLD'" "48 HOLD" || true

# ── JSON-LD integrity ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — JSON-LD${NC}"
assert_jsonld_parses "/vitals/"
assert_present "/vitals/"  "JSON-LD: WebPage dated"         "dateModified"

# ── Room pages: static truth since 2026-10-05 (no longer SPA shells) ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — commodity rooms (static)${NC}"
assert_present "/oil/"    "Oil: real h1"        "<h1"
assert_present "/oil/"    "Oil: og graph"       "og:title"
assert_present "/gas/"    "Gas: real h1"        "<h1"
assert_present "/gas/"    "Gas: og graph"       "og:title"
assert_present "/gold/"   "Gold: real h1"       "<h1"
assert_present "/gold/"   "Gold: og graph"      "og:title"

# ── SPA-rendered routes: /klci/ /usdmyr/ resolve into the world room (2026-10-05 truth) ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — SPA routes integrity${NC}"
for page in /klci/ /usdmyr/; do
    assert_present "$page" "$page serves real content in raw HTML" '<h1'
done

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
