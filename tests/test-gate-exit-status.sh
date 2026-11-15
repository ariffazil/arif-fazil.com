#!/usr/bin/env bash
# Phase 4 & Phase 5 regression suite: exit-status integrity + gate policy defaults.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
RUN_GATE="$REPO_ROOT/scripts/run-gate.sh"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/test-gate-exit.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT

PASS=0
FAIL=0

assert_eq() {
  local got="$1" expected="$2" msg="$3"
  if [[ "$got" == "$expected" ]]; then
    printf '  PASS: %s (%s)\n' "$msg" "$got"
    PASS=$((PASS + 1))
  else
    printf '  FAIL: %s (expected=%s got=%s)\n' "$msg" "$expected" "$got" >&2
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Phase 4/5 Gate Exit-Status & Policy Regression Tests ==="

# Fixtures
BIN_OK="$TMP/v_ok.sh"
cat >"$BIN_OK" <<'SH'
#!/usr/bin/env bash
echo "verifier line 1"
echo "verifier line 2 OK"
exit 0
SH
chmod +x "$BIN_OK"

BIN_FAIL="$TMP/v_fail.sh"
cat >"$BIN_FAIL" <<'SH'
#!/usr/bin/env bash
echo "FATAL_MARKER_AT_TOP: page verification broken"
exit 7
SH
chmod +x "$BIN_FAIL"

BIN_LONG="$TMP/v_long.sh"
cat >"$BIN_LONG" <<'SH'
#!/usr/bin/env bash
echo "TOP_FAILURE: /economics expected marker capital missing"
for i in $(seq 1 250); do
  echo "filler line $i"
done
echo "BOTTOM_FAILURE: FAIL verify summary exit=1"
exit 1
SH
chmod +x "$BIN_LONG"

BIN_SIG="$TMP/v_sig.sh"
cat >"$BIN_SIG" <<'SH'
#!/usr/bin/env bash
echo "about to receive SIGTERM"
kill -TERM $$
sleep 2
SH
chmod +x "$BIN_SIG"

BIN_NOEXEC="$TMP/v_noexec.sh"
printf '#!/usr/bin/env bash\necho nope\n' >"$BIN_NOEXEC"
chmod 0644 "$BIN_NOEXEC"

LOGS="$TMP/logs"

# Test 1: verifier exit 0 + tail excerpt -> passes (0)
echo "[Case 1] verifier exit 0 + tail excerpt"
rc=0
"$RUN_GATE" --gate-id "verify.pages" --log-dir "$LOGS/c1" --tail 5 --receipt "$TMP/r1.json" -- "$BIN_OK" >/dev/null 2>&1 || rc=$?
assert_eq "$rc" "0" "exit 0 preserved"
assert_eq "$(jq -r '.outcome' "$TMP/r1.json")" "pass" "receipt outcome=pass"
assert_eq "$(jq -r '.exit_code' "$TMP/r1.json")" "0" "receipt exit_code=0"
assert_eq "$(jq -r '.blocking' "$TMP/r1.json")" "true" "verify.pages is blocking"

# Test 2: verifier exit 7 + tail excerpt -> fails (non-zero, preserves 7)
echo "[Case 2] verifier exit 7 + tail excerpt"
rc=0
"$RUN_GATE" --gate-id "verify.pages" --log-dir "$LOGS/c2" --tail 5 --receipt "$TMP/r2.json" -- "$BIN_FAIL" >/dev/null 2>&1 || rc=$?
assert_eq "$rc" "7" "real exit code 7 preserved despite tail excerpt"
assert_eq "$(jq -r '.outcome' "$TMP/r2.json")" "fail" "receipt outcome=fail"
assert_eq "$(jq -r '.exit_code' "$TMP/r2.json")" "7" "receipt exit_code=7"

# Test 3: verifier produces long output -> full log preserved + receipt carries tail & log_path
echo "[Case 3] long verifier output preserves full failure in log and receipt"
rc=0
stderr_out="$TMP/c3.stderr"
"$RUN_GATE" --gate-id "web_zen.verify" --log-dir "$LOGS/c3" --tail 10 --receipt "$TMP/r3.json" -- "$BIN_LONG" >/dev/null 2>"$stderr_out" || rc=$?
assert_eq "$rc" "1" "long verifier exit 1 preserved"
log_path="$(jq -r '.log_path' "$TMP/r3.json")"
assert_eq "$( [[ -f "$log_path" ]] && echo yes || echo no )" "yes" "full log path exists ($log_path)"
assert_eq "$(grep -c 'TOP_FAILURE' "$log_path")" "1" "full log contains early failure line even with --tail 10"
assert_eq "$(grep -c 'BOTTOM_FAILURE' <<<"$(jq -r '.excerpt_tail' "$TMP/r3.json")")" "1" "receipt excerpt_tail contains trailing failure"
assert_eq "$(jq -r '.line_count' "$TMP/r3.json")" "252" "line_count accurately recorded"
assert_eq "$(grep -c "log=$log_path" "$stderr_out")" "1" "stderr emits full log path"

# Test 4: verifier terminated by signal -> fails + records signal
echo "[Case 4] verifier terminated by SIGTERM"
rc=0
"$RUN_GATE" --gate-id "web_zen.verify" --log-dir "$LOGS/c4" --tail 5 --receipt "$TMP/r4.json" -- "$BIN_SIG" >/dev/null 2>&1 || rc=$?
assert_eq "$rc" "143" "signal exit code 143 (128+15) preserved"
assert_eq "$(jq -r '.outcome' "$TMP/r4.json")" "fail" "signal termination outcome=fail"
assert_eq "$(jq -r '.terminated_by_signal' "$TMP/r4.json")" "true" "terminated_by_signal=true"
assert_eq "$(jq -r '.signal' "$TMP/r4.json")" "15" "signal=15 recorded"

# Test 5: missing / non-executable verifier -> fails
echo "[Case 5] missing & non-executable verifiers"
rc=0
"$RUN_GATE" --gate-id "verify.pages" --log-dir "$LOGS/c5a" --tail 5 --receipt "$TMP/r5a.json" -- "$TMP/does-not-exist-verifier" >/dev/null 2>&1 || rc=$?
assert_eq "$rc" "127" "missing path returns 127"
assert_eq "$(jq -r '.missing_executable' "$TMP/r5a.json")" "true" "missing_executable=true for missing path"

rc=0
"$RUN_GATE" --gate-id "verify.pages" --log-dir "$LOGS/c5b" --tail 5 --receipt "$TMP/r5b.json" -- "$BIN_NOEXEC" >/dev/null 2>&1 || rc=$?
assert_eq "$rc" "126" "non-executable verifier returns 126"
assert_eq "$(jq -r '.missing_executable' "$TMP/r5b.json")" "true" "missing_executable=true for non-executable file"

rc=0
"$RUN_GATE" --gate-id "verify.pages" --log-dir "$LOGS/c5c" --tail 5 --receipt "$TMP/r5c.json" -- "definitely_missing_verifier_bin_xyz" >/dev/null 2>&1 || rc=$?
assert_eq "$rc" "127" "missing PATH command returns 127"

# Test 6: unknown gate defaults to blocking=true
echo "[Case 6] unknown gate defaults to blocking=true"
rc=0
"$RUN_GATE" --gate-id "unknown.unregistered_verifier" --log-dir "$LOGS/c6" --tail 5 --receipt "$TMP/r6.json" -- "$BIN_FAIL" >/dev/null 2>&1 || rc=$?
assert_eq "$rc" "7" "unknown gate blocks on failure"
assert_eq "$(jq -r '.registered' "$TMP/r6.json")" "false" "registered=false"
assert_eq "$(jq -r '.blocking' "$TMP/r6.json")" "true" "unknown gate defaults blocking=true"

# Test 7: explicit advisory gate logs failure without blocking
echo "[Case 7] explicit advisory gate (post_deploy.wealth_render) logs failure without blocking"
rc=0
"$RUN_GATE" --gate-id "post_deploy.wealth_render" --log-dir "$LOGS/c7" --tail 5 --receipt "$TMP/r7.json" -- "$BIN_FAIL" >/dev/null 2>&1 || rc=$?
assert_eq "$rc" "0" "explicit advisory gate exits 0 for caller"
assert_eq "$(jq -r '.outcome' "$TMP/r7.json")" "advisory_fail" "receipt preserves outcome=advisory_fail"
assert_eq "$(jq -r '.exit_code' "$TMP/r7.json")" "7" "receipt preserves real exit_code=7"

# Test 8: web_zen.doctor is explicitly blocking=true in registry
echo "[Case 8] web_zen.doctor registry policy is blocking=true"
doc_blocking="$(jq -r '.gates[] | select(.gate_id=="web_zen.doctor") | .blocking' "$REPO_ROOT/infra/deploy-gates.json")"
assert_eq "$doc_blocking" "true" "web_zen.doctor classified blocking=true in infra/deploy-gates.json"

echo ""
echo "Summary: PASS=$PASS FAIL=$FAIL"
(( FAIL == 0 ))
