#!/usr/bin/env bash
# Exit-status-preserving gate runner library.
# Executes verifiers without masking exit status via pipes or || true.

# shellcheck shell=bash

GATE_RESULTS_NDJSON="${GATE_RESULTS_NDJSON:-}"

gate_registry_lookup() {
  local registry_file="$1"
  local gate_id="$2"

  if [[ ! -f "$registry_file" ]]; then
    jq -n --arg gate_id "$gate_id" '{
      gate_id: $gate_id,
      registered: false,
      blocking: true,
      expected_exit: [0],
      receipt_field: ("gates." + ($gate_id | gsub("[^A-Za-z0-9_]"; "_"))),
      owner: "unknown",
      justification: "Unregistered gate defaults to blocking=true"
    }'
    return 0
  fi

  local found
  found="$(jq -ce --arg gate_id "$gate_id" '.gates[] | select(.gate_id == $gate_id)' "$registry_file" 2>/dev/null || true)"
  if [[ -z "$found" ]]; then
    jq -n --arg gate_id "$gate_id" '{
      gate_id: $gate_id,
      registered: false,
      blocking: true,
      expected_exit: [0],
      receipt_field: ("gates." + ($gate_id | gsub("[^A-Za-z0-9_]"; "_"))),
      owner: "unknown",
      justification: "Unregistered gate defaults to blocking=true"
    }'
    return 0
  fi

  jq -c '
    . + {
      registered: true,
      blocking: (if (.blocking == false) then false else true end),
      expected_exit: (.expected_exit // [0]),
      receipt_field: (.receipt_field // ("gates." + (.gate_id | gsub("[^A-Za-z0-9_]"; "_")))),
      owner: (.owner // "unknown"),
      justification: (.justification // "none")
    }
  ' <<<"$found"
}

gate_applies_to_site() {
  local meta_json="$1"
  local site_name="$2"
  jq -e --arg site "$site_name" '
    (.applies_to_sites // null) == null
    or ((.applies_to_sites | length) == 0)
    or (.applies_to_sites | index($site) != null)
  ' <<<"$meta_json" >/dev/null
}

run_gate_command() {
  local registry_file="$1"
  local gate_id="$2"
  local log_dir="$3"
  local excerpt_lines="$4"
  shift 4

  if (($# == 0)); then
    printf '[gate:%s] ERROR: missing verifier command\n' "$gate_id" >&2
    return 127
  fi

  mkdir -p "$log_dir"
  local safe_id="${gate_id//[^A-Za-z0-9._-]/_}"
  local gate_log="$log_dir/gate-${safe_id}.log"
  local meta_json
  meta_json="$(gate_registry_lookup "$registry_file" "$gate_id")"
  local blocking registered receipt_field owner justification
  blocking="$(jq -r '.blocking' <<<"$meta_json")"
  registered="$(jq -r '.registered' <<<"$meta_json")"
  receipt_field="$(jq -r '.receipt_field' <<<"$meta_json")"
  owner="$(jq -r '.owner' <<<"$meta_json")"
  justification="$(jq -r '.justification' <<<"$meta_json")"

  local cmd_bin="$1"
  local real_rc=0
  local start_ns end_ns duration_ms
  start_ns="$(date +%s%N 2>/dev/null || printf '%s000000000' "$(date +%s)")"

  local missing_exec=false
  if [[ "$cmd_bin" == */* ]]; then
    if [[ ! -e "$cmd_bin" ]]; then
      missing_exec=true
      real_rc=127
      printf 'ERROR: verifier executable not found: %s\n' "$cmd_bin" >"$gate_log"
    elif [[ ! -x "$cmd_bin" ]]; then
      missing_exec=true
      real_rc=126
      printf 'ERROR: verifier executable is not executable: %s\n' "$cmd_bin" >"$gate_log"
    fi
  elif ! command -v "$cmd_bin" >/dev/null 2>&1; then
    missing_exec=true
    real_rc=127
    printf 'ERROR: verifier command not found in PATH: %s\n' "$cmd_bin" >"$gate_log"
  fi

  if [[ "$missing_exec" == "false" ]]; then
    local had_errexit=0
    case $- in
      *e*) had_errexit=1 ;;
    esac
    set +e
    "$@" >"$gate_log" 2>&1
    real_rc=$?
    if ((had_errexit == 1)); then
      set -e
    fi
  fi

  end_ns="$(date +%s%N 2>/dev/null || printf '%s000000000' "$(date +%s)")"
  duration_ms=$(( (end_ns - start_ns) / 1000000 ))
  (( duration_ms >= 0 )) || duration_ms=0

  local terminated_by_signal=false
  local signal_num=0
  if ((real_rc >= 128 && real_rc != 127)); then
    # Wait statuses >= 128 correspond to signal termination (e.g. 137=SIGKILL, 143=SIGTERM);
    # 127 is reserved for command-not-found / missing executable.
    if [[ "$missing_exec" == "false" ]]; then
      terminated_by_signal=true
      signal_num=$((real_rc - 128))
    fi
  fi

  local exit_expected=false
  if jq -e --argjson rc "$real_rc" '.expected_exit | index($rc) != null' <<<"$meta_json" >/dev/null 2>&1; then
    if [[ "$terminated_by_signal" == "false" && "$missing_exec" == "false" ]]; then
      exit_expected=true
    fi
  fi

  local outcome="pass"
  if [[ "$exit_expected" == "false" ]]; then
    if [[ "$blocking" == "true" ]]; then
      outcome="fail"
    else
      outcome="advisory_fail"
    fi
  fi

  local output_bytes line_count excerpt_tail
  output_bytes="$(wc -c <"$gate_log" 2>/dev/null | tr -d ' ')"
  line_count="$(wc -l <"$gate_log" 2>/dev/null | tr -d ' ')"
  excerpt_tail=""
  if [[ -s "$gate_log" ]] && ((excerpt_lines > 0)); then
    excerpt_tail="$(tail -n "$excerpt_lines" "$gate_log" 2>/dev/null || true)"
  fi

  printf '[gate:%s] outcome=%s exit_code=%d blocking=%s log=%s bytes=%s lines=%s\n' \
    "$gate_id" "$outcome" "$real_rc" "$blocking" "$gate_log" "$output_bytes" "$line_count" >&2
  if [[ -n "$excerpt_tail" ]]; then
    printf '%s\n' "$excerpt_tail" | sed "s/^/[gate:${gate_id}:tail] /" >&2
  fi

  if [[ -n "${GATE_RESULTS_NDJSON:-}" ]]; then
    local rec
    rec="$(jq -n -c \
      --arg gate_id "$gate_id" \
      --arg outcome "$outcome" \
      --arg receipt_field "$receipt_field" \
      --arg owner "$owner" \
      --arg justification "$justification" \
      --arg log_path "$gate_log" \
      --arg excerpt_tail "$excerpt_tail" \
      --argjson registered "$registered" \
      --argjson blocking "$blocking" \
      --argjson exit_code "$real_rc" \
      --argjson terminated_by_signal "$terminated_by_signal" \
      --argjson signal_num "$signal_num" \
      --argjson missing_executable "$missing_exec" \
      --argjson duration_ms "$duration_ms" \
      --argjson output_bytes "${output_bytes:-0}" \
      --argjson line_count "${line_count:-0}" \
      '{
        gate_id: $gate_id,
        registered: $registered,
        blocking: $blocking,
        outcome: $outcome,
        exit_code: $exit_code,
        terminated_by_signal: $terminated_by_signal,
        signal: $signal_num,
        missing_executable: $missing_executable,
        duration_ms: $duration_ms,
        output_bytes: $output_bytes,
        line_count: $line_count,
        log_path: $log_path,
        receipt_field: $receipt_field,
        owner: $owner,
        justification: $justification,
        excerpt_tail: $excerpt_tail
      }')"
    printf '%s\n' "$rec" >>"$GATE_RESULTS_NDJSON"
  fi

  if [[ "$outcome" == "fail" ]]; then
    ((real_rc != 0)) && return "$real_rc"
    return 1
  fi
  return 0
}
