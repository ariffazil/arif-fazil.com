#!/usr/bin/env bash
# CLI wrapper around scripts/lib/deploy-gates.sh so verifiers run without
# pipeline masking and always preserve real exit status and full log output.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd -P)"
# shellcheck source=scripts/lib/deploy-gates.sh
source "$SCRIPT_DIR/lib/deploy-gates.sh"

GATE_ID=""
REGISTRY="${ARIF_SITES_GATE_REGISTRY:-$REPO_ROOT/infra/deploy-gates.json}"
LOG_DIR="${ARIF_SITES_GATE_LOG_DIR:-${TMPDIR:-/tmp}/arif-sites-gate-logs}"
EXCERPT_LINES=20
RECEIPT_FILE=""

usage() {
  cat >&2 <<'USAGE'
Usage:
  scripts/run-gate.sh --gate-id <id> [--registry <json>] [--log-dir <dir>] [--tail <lines>] [--receipt <json>] -- <cmd...>
USAGE
}

while (($#)); do
  case "$1" in
    --gate-id) GATE_ID="${2:-}"; shift 2 ;;
    --registry) REGISTRY="${2:-}"; shift 2 ;;
    --log-dir) LOG_DIR="${2:-}"; shift 2 ;;
    --tail) EXCERPT_LINES="${2:-20}"; shift 2 ;;
    --receipt) RECEIPT_FILE="${2:-}"; shift 2 ;;
    --) shift; break ;;
    -h|--help) usage; exit 0 ;;
    *) echo "ERROR: unknown argument: $1" >&2; usage; exit 2 ;;
  esac
done

[[ -n "$GATE_ID" ]] || { echo "ERROR: --gate-id is required" >&2; usage; exit 2; }
(($# > 0)) || { echo "ERROR: command after -- is required" >&2; usage; exit 2; }

tmp_ndjson="$(mktemp "${TMPDIR:-/tmp}/gate-res.XXXXXX")"
trap 'rm -f "$tmp_ndjson"' EXIT
export GATE_RESULTS_NDJSON="$tmp_ndjson"

rc=0
if run_gate_command "$REGISTRY" "$GATE_ID" "$LOG_DIR" "$EXCERPT_LINES" "$@"; then
  rc=0
else
  rc=$?
fi

if [[ -n "$RECEIPT_FILE" ]]; then
  mkdir -p "$(dirname "$RECEIPT_FILE")"
  cp "$tmp_ndjson" "$RECEIPT_FILE"
fi

exit "$rc"
