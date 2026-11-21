#!/usr/bin/env bash
# Deploy envelope gate — NO rsync without an explicit 888 sign-off.
#
# An envelope is a JSON file (deploy-envelope.json) at the repo root carrying:
#   approver      : string  — the sovereign who signed off (non-empty, not "none")
#   sha           : string  — the exact commit being deployed (must equal HEAD)
#   targets       : array   — webroot trees the rsync will touch
#   rollback      : string  — the exact command that undoes the deploy
#   negative_tests: array   — checks that must be run BEFORE the rsync
#   signed_at     : string  — ISO timestamp of the sign-off
#
# Usage: bash scripts/require-deploy-envelope.sh [envelope-path]
# Exit 0 = envelope valid (rsync permitted). Exit 1 = REFUSED (no side effects).
set -uo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$REPO/deploy-envelope.json}"

if [ ! -f "$ENV_FILE" ]; then
  echo "DEPLOY REFUSED — no envelope at $ENV_FILE"
  echo "  Required before any rsync: approver, sha (=HEAD), targets[], rollback, negative_tests[], signed_at"
  exit 1
fi

python3 - "$ENV_FILE" "$REPO" <<'PY'
import json, subprocess, sys
env_path, repo = sys.argv[1], sys.argv[2]
try:
    env = json.load(open(env_path))
except Exception as e:
    print(f"DEPLOY REFUSED — envelope is not valid JSON: {e}"); sys.exit(1)
problems = []
approver = str(env.get("approver", "")).strip()
if not approver or approver.lower() in ("none", "tbd", "?"):
    problems.append("approver is empty/placeholder — 888 sign-off missing")
sha = str(env.get("sha", ""))
head = subprocess.run(["git", "-C", repo, "rev-parse", "HEAD"],
                      capture_output=True, text=True).stdout.strip()
if not sha:
    problems.append("sha missing")
elif sha != head:
    problems.append(f"sha {sha[:12]} != HEAD {head[:12]} — envelope is for a different commit")
targets = env.get("targets")
if not isinstance(targets, list) or not targets:
    problems.append("targets[] missing/empty")
rollback = str(env.get("rollback", "")).strip()
if not rollback:
    problems.append("rollback command missing")
neg = env.get("negative_tests")
if not isinstance(neg, list) or not neg:
    problems.append("negative_tests[] missing — a deploy with no falsification plan is not verifiable")
signed = str(env.get("signed_at", "")).strip()
if not signed:
    problems.append("signed_at missing")
if problems:
    print("DEPLOY REFUSED:")
    for p in problems:
        print("  -", p)
    sys.exit(1)
print("DEPLOY ENVELOPE VALID")
print(f"  approver : {approver}")
print(f"  sha      : {sha[:12]} (== HEAD)")
print(f"  targets  : {', '.join(map(str, targets))}")
print(f"  rollback : {rollback}")
print(f"  negative : {len(neg)} checks to run before rsync")
sys.exit(0)
PY
