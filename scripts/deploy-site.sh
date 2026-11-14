#!/usr/bin/env bash
# Atomic, registry-governed deployment for arif-sites surfaces.
# Default mode is a read-only dry run. Materializes exact Git commits cleanly;
# never copies dirty working trees into release artifacts.

set -euo pipefail

CANONICAL_REPO_ROOT="/root/arif-fazil.com"
RAW_SCRIPT_PATH="${BASH_SOURCE[0]}"
if [[ "$RAW_SCRIPT_PATH" == *"/ARIF-SITES/"* || "${PWD:-}" == *"/ARIF-SITES"* ]]; then
  echo "ERROR: uppercase /root/ARIF-SITES is retired; use $CANONICAL_REPO_ROOT" >&2
  exit 2
fi
if [[ "$RAW_SCRIPT_PATH" == *"/arif-sites/"* && "$RAW_SCRIPT_PATH" != *"/arif-fazil.com/"* ]] || [[ "${PWD:-}" == *"/arif-sites" && "${PWD:-}" != *"/arif-fazil.com"* ]]; then
  echo "WARNING: lowercase /root/arif-sites is deprecated — canonical repo is $CANONICAL_REPO_ROOT" >&2
fi

REPO_ROOT="$(cd "$(dirname "$RAW_SCRIPT_PATH")/.." && pwd -P)"
HTML_ROOT="${ARIF_SITES_HTML_ROOT:-/var/www/html}"
ALLOW_WORKTREE="${ARIF_SITES_ALLOW_WORKTREE:-0}"

if ! git -C "$REPO_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: deploy-site.sh must run from a Git checkout/worktree (got $REPO_ROOT)" >&2
  exit 2
fi

REGISTRY="${ARIF_SITES_OVERLAY_REGISTRY:-$REPO_ROOT/infra/runtime-overlays.json}"
GATE_REGISTRY="${ARIF_SITES_GATE_REGISTRY:-$REPO_ROOT/infra/deploy-gates.json}"
EXTERNAL_INPUT_MANIFEST="${ARIF_SITES_EXTERNAL_INPUT_MANIFEST:-$REPO_ROOT/infra/external-inputs.json}"
ARCHIVE_BASE="${ARIF_SITES_ARCHIVE_ROOT:-/root/forge_work/deployments}"
STAGING_ROOT="${ARIF_SITES_STAGING_ROOT:-$(dirname "$HTML_ROOT")/.arif-sites-staging}"
BUILD_TMP_ROOT="${ARIF_SITES_BUILD_TMP_ROOT:-${TMPDIR:-/tmp}}"
CADDYFILE="${ARIF_SITES_CADDYFILE:-/etc/caddy/Caddyfile}"
CADDY_BIN="${ARIF_SITES_CADDY_BIN:-caddy}"
CURL_BIN="${ARIF_SITES_CURL_BIN:-curl}"
PYTHON_BIN="${ARIF_SITES_PYTHON_BIN:-python3}"
WEB_OWNER="${ARIF_SITES_WEB_OWNER:-www-data:www-data}"
SKIP_CHOWN="${ARIF_SITES_SKIP_CHOWN:-0}"

# shellcheck source=scripts/lib/deploy-gates.sh
source "$REPO_ROOT/scripts/lib/deploy-gates.sh"

usage() {
  cat >&2 <<'USAGE'
Usage:
  scripts/deploy-site.sh <site> [--dry-run] [--commit <sha>] [--external-inputs <dir>]
  scripts/deploy-site.sh <site> --validate-build [--commit <sha>] [--external-inputs <dir>]
  scripts/deploy-site.sh <site> --apply [--commit <sha>] [--authorized-commit <sha>] [--external-inputs <dir>] [--allow-worktree]
  scripts/deploy-site.sh <site> --restore <tag>
USAGE
}

SITE_NAME="${1:-}"
[[ -n "$SITE_NAME" ]] || { usage; exit 2; }
shift

MODE="dry-run"
RESTORE_TAG=""
MODE_SEEN=0
COMMIT_ARG="${ARIF_SITES_DEPLOY_COMMIT:-}"
EXPLICIT_COMMIT=0
[[ -n "$COMMIT_ARG" ]] && EXPLICIT_COMMIT=1
AUTHORIZED_COMMIT="${ARIF_SITES_AUTHORIZED_COMMIT:-}"
EXTERNAL_INPUTS_DIR="${ARIF_SITES_EXTERNAL_INPUTS_DIR:-}"
EXTRA_MANIFEST_TARGETS="${ARIF_SITES_EXTRA_MANIFEST_TARGETS:-}"
SPLIT_ROOTS_OVERRIDE="${ARIF_SITES_SPLIT_ROOTS:-}"

while (($#)); do
  case "$1" in
    --dry-run)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="dry-run"
      MODE_SEEN=1
      shift
      ;;
    --validate-build)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="validate-build"
      MODE_SEEN=1
      shift
      ;;
    --apply)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="apply"
      MODE_SEEN=1
      shift
      ;;
    --restore)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      [[ $# -ge 2 ]] || { echo "ERROR: --restore requires a backup tag" >&2; exit 2; }
      MODE="restore"
      RESTORE_TAG="$2"
      MODE_SEEN=1
      shift 2
      ;;
    --commit)
      [[ $# -ge 2 ]] || { echo "ERROR: --commit requires a SHA" >&2; exit 2; }
      COMMIT_ARG="$2"
      EXPLICIT_COMMIT=1
      shift 2
      ;;
    --authorized-commit)
      [[ $# -ge 2 ]] || { echo "ERROR: --authorized-commit requires a SHA" >&2; exit 2; }
      AUTHORIZED_COMMIT="$2"
      shift 2
      ;;
    --external-inputs)
      [[ $# -ge 2 ]] || { echo "ERROR: --external-inputs requires a directory" >&2; exit 2; }
      EXTERNAL_INPUTS_DIR="$2"
      shift 2
      ;;
    --extra-manifest-targets)
      [[ $# -ge 2 ]] || { echo "ERROR: --extra-manifest-targets requires a JSON file" >&2; exit 2; }
      EXTRA_MANIFEST_TARGETS="$2"
      shift 2
      ;;
    --allow-worktree)
      ALLOW_WORKTREE=1
      shift
      ;;
    --split-roots)
      SPLIT_ROOTS_OVERRIDE=1
      shift
      ;;
    --no-split-roots)
      SPLIT_ROOTS_OVERRIDE=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

LOG_PREFIX="[deploy:${SITE_NAME}]"
LOG_FILE=""
log() {
  local line
  line="$LOG_PREFIX $*"
  if [[ -n "$LOG_FILE" ]]; then
    printf '%s\n' "$line" >>"$LOG_FILE"
    printf '%s\n' "$line" >&2
  else
    printf '%s\n' "$line" >&2
  fi
}
die() {
  log "ERROR: $*"
  exit 1
}

command -v jq >/dev/null 2>&1 || die "jq is required"
command -v rsync >/dev/null 2>&1 || die "rsync is required"
command -v "$PYTHON_BIN" >/dev/null 2>&1 || die "python3 is required"
[[ -f "$REGISTRY" ]] || die "overlay registry not found: $REGISTRY"

# Refuse production /var/www/html writes from arbitrary worktrees unless explicitly allowed.
if [[ "$MODE" == "apply" || "$MODE" == "restore" ]]; then
  HTML_NORM="$(realpath -m "$HTML_ROOT")"
  if [[ "$HTML_NORM" == "/var/www/html" && "$REPO_ROOT" != "$CANONICAL_REPO_ROOT" && "$REPO_ROOT" != "/root/arif-sites" && "$ALLOW_WORKTREE" != "1" ]]; then
    die "refusing production --apply to /var/www/html from non-canonical worktree $REPO_ROOT (pass --allow-worktree only with explicit authorization)"
  fi
fi

validate_registry() {
  jq -e '
    (.schema_version == 1 or .schema_version == 2) and
    (.canonical_repo_root == "/root/arif-fazil.com" or .canonical_repo_root == "/root/arif-sites") and
    (.sites | type == "array" and length > 0) and
    (all(.sites[];
      (.site | type == "string" and test("^[a-z0-9._-]+$")) and
      (.source | type == "string" and length > 0 and (startswith("/") | not) and (test("(^|/)\\.\\.(/|$)") | not)) and
      (.webroot | type == "string" and test("^[a-z0-9_-]+$")) and
      (.owner | type == "string" and length > 0) and
      (.batch | type == "boolean") and
      (.batch_order | type == "number") and
      (.required_artifacts | type == "array") and
      (all(.required_artifacts[]; type == "string" and length > 0 and (startswith("/") | not) and (test("(^|/)\\.\\.(/|$)") | not))) and
      (.probe.url | type == "string" and startswith("https://")) and
      (.probe.accepted_codes | type == "array" and length > 0 and all(.[]; type == "number")) and
      (.overlays | type == "array") and
      (all(.overlays[];
        (.path | type == "string" and length > 0 and (startswith("/") | not) and (test("(^|/)\\.\\.(/|$)") | not)) and
        (.owner | type == "string" and length > 0) and
        (.strategy == "preserve-live" or .strategy == "merge-source-wins")
      )) and
      ((.build // null) == null or (
        (.build.kind | type == "string") and
        (.build.command | type == "array" and length > 0 and all(.[]; type == "string" and length > 0)) and
        (.build.output | type == "string" and length > 0 and (startswith("/") | not) and (test("(^|/)\\.\\.(/|$)") | not))
      ))
    )) and
    (([.sites[].site] | length) == ([.sites[].site] | unique | length)) and
    (([.sites[].webroot] | length) == ([.sites[].webroot] | unique | length)) and
    (all(.sites[]; (([.overlays[].path] | length) == ([.overlays[].path] | unique | length))))
  ' "$REGISTRY" >/dev/null || die "invalid or ambiguous runtime overlay registry: $REGISTRY"
}
validate_registry

MATCH_COUNT="$(jq --arg site "$SITE_NAME" '[.sites[] | select(.site == $site)] | length' "$REGISTRY")"
if [[ "$MATCH_COUNT" != "1" ]]; then
  die "unknown or ambiguously owned site '$SITE_NAME' (registry matches: $MATCH_COUNT)"
fi
ENTRY="$(jq -ce --arg site "$SITE_NAME" '.sites[] | select(.site == $site)' "$REGISTRY")"
SOURCE_REL="$(jq -r '.source' <<<"$ENTRY")"
WEBROOT_NAME="$(jq -r '.webroot' <<<"$ENTRY")"
SITE_OWNER="$(jq -r '.owner' <<<"$ENTRY")"
SOURCE_DIR="$REPO_ROOT/$SOURCE_REL"
WEBROOT="$HTML_ROOT/$WEBROOT_NAME"
ARCHIVE_ROOT="$ARCHIVE_BASE/$SITE_NAME"
PROBE_URL="${ARIF_SITES_PROBE_URL_OVERRIDE:-$(jq -r '.probe.url' <<<"$ENTRY")}"
PROBE_ATTEMPTS="${ARIF_SITES_PROBE_ATTEMPTS:-$(jq -r '.defaults.probe_attempts' "$REGISTRY")}"
CADDY_ATTEMPTS="${ARIF_SITES_CADDY_ATTEMPTS:-$(jq -r '.defaults.caddy_attempts' "$REGISTRY")}"
RETRY_DELAY="${ARIF_SITES_RETRY_DELAY:-$(jq -r '.defaults.retry_delay_seconds' "$REGISTRY")}"

SPLIT_ROOTS=0
if [[ -n "$SPLIT_ROOTS_OVERRIDE" ]]; then
  SPLIT_ROOTS="$SPLIT_ROOTS_OVERRIDE"
elif [[ "$WEBROOT_NAME" == "arif" ]]; then
  SPLIT_ROOTS=1
fi

for numeric_value in "$PROBE_ATTEMPTS" "$CADDY_ATTEMPTS"; do
  [[ "$numeric_value" =~ ^[1-9][0-9]*$ ]] || die "retry attempts must be positive integers"
done
[[ "$RETRY_DELAY" =~ ^[0-9]+([.][0-9]+)?$ ]] || die "retry delay must be non-negative"

SOURCE_REAL="$(realpath -m "$SOURCE_DIR")"
case "$SOURCE_REAL/" in
  "$REPO_ROOT"/*) ;;
  *) die "source escapes repository: $SOURCE_DIR" ;;
esac

HTML_ROOT="$(realpath -m "$HTML_ROOT")"
ARCHIVE_BASE="$(realpath -m "$ARCHIVE_BASE")"
STAGING_ROOT="$(realpath -m "$STAGING_ROOT")"
BUILD_TMP_ROOT="$(realpath -m "$BUILD_TMP_ROOT")"
WEBROOT="$HTML_ROOT/$WEBROOT_NAME"
ARCHIVE_ROOT="$ARCHIVE_BASE/$SITE_NAME"
case "$STAGING_ROOT/" in
  "$HTML_ROOT/"*) die "staging root must not be inside the Caddy webroot: $STAGING_ROOT" ;;
esac
case "$BUILD_TMP_ROOT/" in
  "$HTML_ROOT/"*) die "build temp root must not be inside the Caddy webroot: $BUILD_TMP_ROOT" ;;
esac
case "$ARCHIVE_BASE/" in
  "$HTML_ROOT/"*) die "archive root must not be inside the Caddy webroot: $ARCHIVE_BASE" ;;
esac

mapfile -t OVERLAY_PATHS < <(jq -r '.overlays[].path' <<<"$ENTRY")
mapfile -t OVERLAY_OWNERS < <(jq -r '.overlays[].owner' <<<"$ENTRY")
mapfile -t OVERLAY_STRATEGIES < <(jq -r '.overlays[].strategy' <<<"$ENTRY")
mapfile -t REQUIRED_ARTIFACTS < <(jq -r '.required_artifacts[]' <<<"$ENTRY")

for ((i = 0; i < ${#OVERLAY_PATHS[@]}; i++)); do
  for ((j = i + 1; j < ${#OVERLAY_PATHS[@]}; j++)); do
    left="${OVERLAY_PATHS[$i]}"
    right="${OVERLAY_PATHS[$j]}"
    if [[ "$left" == "$right"/* || "$right" == "$left"/* ]]; then
      die "ambiguous overlay ownership: '$left' (${OVERLAY_OWNERS[$i]}) overlaps '$right' (${OVERLAY_OWNERS[$j]})"
    fi
  done
done

collect_required_tracked() {
  local build_kind
  build_kind="$(jq -r '.build.kind // empty' <<<"$ENTRY")"
  REQUIRED_TRACKED=()
  if [[ -z "$build_kind" ]]; then
    REQUIRED_TRACKED=("${REQUIRED_ARTIFACTS[@]}")
  elif [[ "$build_kind" == "npm" ]]; then
    REQUIRED_TRACKED=("package.json" "package-lock.json")
  elif [[ "$build_kind" == "mkdocs" ]]; then
    REQUIRED_TRACKED=("mkdocs.yml")
  fi
}
collect_required_tracked

TEMP_DIRS=()
SWAP_ACTIVE=0
MUTATION_STARTED=0
ROLLBACK_DONE=0
OLD_STAGE=""
DEPLOY_DIR=""
TS=""
MANIFEST_PATH=""
ROLLBACK_RESULT_PATH=""
GATE_RESULTS_FILE=""
LOCK_FD=""

SOURCE_COMMIT=""
SOURCE_COMMIT_SHORT=""
SOURCE_TREE_HASH=""
EXTERNAL_MANIFEST_JSON="{}"
ARTIFACT_HASHES_JSON="{}"
ROLLBACK_INFO_JSON='{"performed":false,"ok":null,"result_path":null}'

safe_remove_temp() {
  local path="$1"
  [[ -e "$path" || -L "$path" ]] || return 0
  case "$path/" in
    "$BUILD_TMP_ROOT"/*|"$STAGING_ROOT"/*) ;;
    *) log "refusing cleanup outside temporary roots: $path"; return 1 ;;
  esac
  if [[ "$(readlink -f -- "$path" 2>/dev/null || true)" == "$(readlink -f -- "$WEBROOT" 2>/dev/null || true)" ]]; then
    log "refusing cleanup: $path aliases the live webroot"
    return 0
  fi
  if ! find -P "$path" -depth -delete 2>/dev/null; then
    log "cleanup retained (undeletable files, evidence kept): $path"
    return 0
  fi
}

run_manifest_rollback() {
  local rb_skip=()
  [[ "$SKIP_CHOWN" == "1" ]] && rb_skip+=(--skip-chown)
  if [[ -n "$MANIFEST_PATH" && -f "$MANIFEST_PATH" ]]; then
    ROLLBACK_RESULT_PATH="$DEPLOY_DIR/rollback-result.json"
    if "$PYTHON_BIN" "$REPO_ROOT/scripts/lib/mutation-manifest.py" rollback \
      --manifest "$MANIFEST_PATH" \
      --result "$ROLLBACK_RESULT_PATH" \
      "${rb_skip[@]}" >/dev/null 2>&1; then
      ROLLBACK_DONE=1
      ROLLBACK_INFO_JSON="$(jq -c '{performed:true, ok:.ok, result_path:$rp, targets_total:.targets_total, restored:.restored, removed:.removed, already_clean:.already_clean, failed:.failed}' --arg rp "$ROLLBACK_RESULT_PATH" "$ROLLBACK_RESULT_PATH")"
      return 0
    else
      ROLLBACK_DONE=1
      if [[ -f "$ROLLBACK_RESULT_PATH" ]]; then
        ROLLBACK_INFO_JSON="$(jq -c '{performed:true, ok:false, result_path:$rp, targets_total:.targets_total, restored:.restored, removed:.removed, already_clean:.already_clean, failed:.failed}' --arg rp "$ROLLBACK_RESULT_PATH" "$ROLLBACK_RESULT_PATH" 2>/dev/null || printf '{"performed":true,"ok":false,"result_path":"%s"}' "$ROLLBACK_RESULT_PATH")"
      else
        ROLLBACK_INFO_JSON='{"performed":true,"ok":false,"result_path":null}'
      fi
      return 1
    fi
  fi
  # Fallback only if failure happened between mv NEW_STAGE and manifest (unreachable after barrier)
  if ((SWAP_ACTIVE == 1)) && [[ -n "$OLD_STAGE" && ( -e "$OLD_STAGE" || -L "$OLD_STAGE" ) ]]; then
    local failed_stage="$STAGING_ROOT/${WEBROOT_NAME}.failed-unexpected.${TS}.$$"
    [[ -e "$WEBROOT" || -L "$WEBROOT" ]] && mv -- "$WEBROOT" "$failed_stage"
    mv -- "$OLD_STAGE" "$WEBROOT"
    ROLLBACK_INFO_JSON='{"performed":true,"ok":true,"result_path":null,"fallback":"old_stage"}'
    return 0
  fi
  return 0
}

emergency_rollback() {
  ((MUTATION_STARTED == 1 || SWAP_ACTIVE == 1)) || return 0
  ((ROLLBACK_DONE == 0)) || return 0
  set +e
  if run_manifest_rollback; then
    log "emergency manifest rollback restored all target roots"
  else
    log "EMERGENCY ROLLBACK FAILED ON ONE OR MORE TARGETS — manual inspection required ($ROLLBACK_RESULT_PATH)"
  fi
  SWAP_ACTIVE=0
  MUTATION_STARTED=0
  set -e
}

on_exit() {
  local status=$?
  set +e
  if ((status != 0)); then
    emergency_rollback
  fi
  for path in "${TEMP_DIRS[@]:-}"; do
    [[ -n "$path" ]] && safe_remove_temp "$path"
  done
  if [[ -n "$LOCK_FD" ]]; then
    eval "exec ${LOCK_FD}>&-" 2>/dev/null || true
  fi
  exit "$status"
}
trap on_exit EXIT

copy_path() {
  local from_root="$1"
  local to_root="$2"
  local rel="$3"
  local source_path="$from_root/$rel"
  local target_path="$to_root/$rel"

  [[ -e "$source_path" || -L "$source_path" ]] || return 1
  mkdir -p "$(dirname "$target_path")"
  if [[ -d "$source_path" && ! -L "$source_path" ]]; then
    mkdir -p "$target_path"
    rsync -a "$source_path/" "$target_path/"
  else
    cp -a -- "$source_path" "$target_path"
  fi
}

validate_artifacts() {
  local root="$1"
  local artifact
  for artifact in "${REQUIRED_ARTIFACTS[@]}"; do
    [[ -e "$root/$artifact" || -L "$root/$artifact" ]] || die "required artifact missing: $root/$artifact"
  done
}

hash_tree() {
  local root="$1"
  find "$root" -type f -print0 \
    | sort -z \
    | xargs -0 sha256sum 2>/dev/null \
    | sha256sum \
    | cut -c1-16
}

compute_artifact_hashes_json() {
  local root="$1"
  local build_hash="$2"
  local files_json
  files_json="$("$PYTHON_BIN" -c '
import hashlib, json, sys
from pathlib import Path
root = Path(sys.argv[1])
req = sys.argv[2:]
out = {}
for rel in req:
    p = root / rel
    if p.is_file():
        h = hashlib.sha256()
        with p.open("rb") as fh:
            for chunk in iter(lambda: fh.read(65536), b""):
                h.update(chunk)
        out[rel] = h.hexdigest()
print(json.dumps(out))
' "$root" "${REQUIRED_ARTIFACTS[@]}")"
  jq -n -c --arg build_hash "$build_hash" --argjson required "$files_json" '{build_hash:$build_hash, required_artifacts:$required}'
}

run_build_command() {
  local cwd="$1"
  shift
  local build_log="$BUILD_WORK/build.log"
  local rc=0
  set +e
  (cd "$cwd" && "$@") >>"$build_log" 2>&1
  rc=$?
  set -e
  if [[ -n "$LOG_FILE" && -f "$build_log" ]]; then
    cat "$build_log" >>"$LOG_FILE"
  fi
  if ((rc != 0)); then
    log "build command failed (exit $rc); tail of $build_log:"
    tail -n 20 "$build_log" >&2 || true
  fi
  return "$rc"
}

materialize_exact_source() {
  local mat_cmd_args mat_json
  mkdir -p "$BUILD_TMP_ROOT"
  BUILD_WORK="$(mktemp -d "$BUILD_TMP_ROOT/arif-sites-build.${SITE_NAME}.XXXXXX")"
  TEMP_DIRS+=("$BUILD_WORK")

  mat_cmd_args=(
    --repo-root "$REPO_ROOT"
    --source-rel "$SOURCE_REL"
    --site "$SITE_NAME"
    --dest-dir "$BUILD_WORK/repo"
    --commit "$COMMIT_ARG"
    --authorized-commit "$AUTHORIZED_COMMIT"
    --external-manifest "$EXTERNAL_INPUT_MANIFEST"
  )
  ((EXPLICIT_COMMIT == 1)) && mat_cmd_args+=(--explicit-commit)
  [[ -n "$EXTERNAL_INPUTS_DIR" ]] && mat_cmd_args+=(--external-dir "$EXTERNAL_INPUTS_DIR")
  for req in "${REQUIRED_TRACKED[@]}"; do
    mat_cmd_args+=(--required-tracked "$req")
  done

  if ! mat_json="$("$PYTHON_BIN" "$REPO_ROOT/scripts/lib/materialize-source.py" materialize "${mat_cmd_args[@]}")"; then
    die "exact-commit materialization failed closed"
  fi

  SOURCE_COMMIT="$(jq -r '.source_commit' <<<"$mat_json")"
  SOURCE_COMMIT_SHORT="$(jq -r '.source_commit_short' <<<"$mat_json")"
  SOURCE_TREE_HASH="$(jq -r '.tree_hash' <<<"$mat_json")"
  EXTERNAL_MANIFEST_JSON="$(jq -c '.external_input_manifest' <<<"$mat_json")"
  MATERIALIZED_SRC="$(jq -r '.materialized_source' <<<"$mat_json")"
  if [[ -n "$DEPLOY_DIR" ]]; then
    if ! invoke_gate "candidate.source_clean" \
      "$PYTHON_BIN" "$REPO_ROOT/scripts/lib/materialize-source.py" verify-clean \
      --repo-root "$REPO_ROOT" --source-rel "$SOURCE_REL" \
      --commit "$SOURCE_COMMIT" --materialized-source "$MATERIALIZED_SRC" \
      --external-manifest "$EXTERNAL_INPUT_MANIFEST" --site "$SITE_NAME"; then
      die "candidate.source_clean verification failed closed"
    fi
  fi
  log "materialized exact commit=$SOURCE_COMMIT_SHORT tree=$SOURCE_TREE_HASH dir=$MATERIALIZED_SRC"
}

DEPLOY_SOURCE=""
BUILD_WORK=""
MATERIALIZED_SRC=""
prepare_build() {
  local build_kind build_output version_expected version_output marker_path marker_text
  local -a install_command build_command version_command

  materialize_exact_source

  if [[ -f "$BUILD_WORK/repo/$SOURCE_REL/.git" ]] || [[ -d "$BUILD_WORK/repo/$SOURCE_REL/.git" ]]; then
    die "unexpected .git inside materialized candidate"
  fi

  if ! jq -e '.build != null' <<<"$ENTRY" >/dev/null; then
    DEPLOY_SOURCE="$MATERIALIZED_SRC"
    validate_artifacts "$DEPLOY_SOURCE"
    return 0
  fi

  build_kind="$(jq -r '.build.kind' <<<"$ENTRY")"
  build_output="$(jq -r '.build.output' <<<"$ENTRY")"
  if [[ "$build_kind" == "npm" ]]; then
    [[ -f "$MATERIALIZED_SRC/package-lock.json" ]] || die "npm build requires a pinned package-lock.json"
  fi

  if jq -e '.build.pinned == true' <<<"$ENTRY" >/dev/null; then
    mapfile -t version_command < <(jq -r '.build.version_command[]' <<<"$ENTRY")
    version_expected="$(jq -r '.build.version_contains' <<<"$ENTRY")"
    ((${#version_command[@]} > 0)) || die "pinned build is missing version_command"
    if ! version_output="$(cd "$MATERIALIZED_SRC" && "${version_command[@]}" 2>&1)"; then
      die "pinned build tool is unavailable: ${version_command[*]}"
    fi
    [[ "$version_output" == *"$version_expected"* ]] || die "pinned build version mismatch: expected '$version_expected', got '$version_output'"
  fi

  if jq -e '.build.install != null' <<<"$ENTRY" >/dev/null; then
    mapfile -t install_command < <(jq -r '.build.install[]' <<<"$ENTRY")
    log "running isolated dependency install for $SITE_NAME"
    run_build_command "$MATERIALIZED_SRC" "${install_command[@]}" || die "isolated dependency install failed"
  fi

  mapfile -t build_command < <(jq -r '.build.command[]' <<<"$ENTRY")
  log "running isolated $build_kind build for $SITE_NAME"
  run_build_command "$MATERIALIZED_SRC" "${build_command[@]}" || die "isolated build failed"

  DEPLOY_SOURCE="$MATERIALIZED_SRC/$build_output"
  [[ -d "$DEPLOY_SOURCE" ]] || die "build succeeded without output directory: $DEPLOY_SOURCE"
  validate_artifacts "$DEPLOY_SOURCE"

  while IFS=$'\t' read -r marker_path marker_text; do
    [[ -n "$marker_path" ]] || continue
    [[ -f "$DEPLOY_SOURCE/$marker_path" ]] || die "pinned build marker file missing: $marker_path"
    grep -Fq -- "$marker_text" "$DEPLOY_SOURCE/$marker_path" || die "pinned build marker mismatch in $marker_path"
  done < <(jq -r '.build.output_markers[]? | [.path, .contains] | @tsv' <<<"$ENTRY")
}

stage_tree() {
  local source_root="$1"
  local current_root="$2"
  local target_root="$3"
  local restore_overlays="$4"
  local -a rsync_args=(-a --delete)
  local rel strategy owner

  for rel in "${OVERLAY_PATHS[@]}"; do
    rsync_args+=("--exclude=/$rel")
  done
  rsync "${rsync_args[@]}" "$source_root/" "$target_root/"

  if [[ "$SKIP_CHOWN" != "1" ]]; then
    chown -R "$WEB_OWNER" "$target_root"
  fi

  for ((i = 0; i < ${#OVERLAY_PATHS[@]}; i++)); do
    rel="${OVERLAY_PATHS[$i]}"
    owner="${OVERLAY_OWNERS[$i]}"
    strategy="${OVERLAY_STRATEGIES[$i]}"
    if [[ -d "$current_root" ]] && copy_path "$current_root" "$target_root" "$rel"; then
      log "preserved overlay $rel (owner=$owner, strategy=$strategy)"
    fi
    if [[ "$restore_overlays" != "1" && "$strategy" == "merge-source-wins" ]]; then
      copy_path "$source_root" "$target_root" "$rel" || true
    fi
  done
  validate_artifacts "$target_root"
}

retry_command() {
  local description="$1"
  local attempts="$2"
  local delay="$3"
  shift 3
  local attempt
  for ((attempt = 1; attempt <= attempts; attempt++)); do
    if "$@"; then
      return 0
    fi
    log "$description failed (attempt $attempt/$attempts)"
    if ((attempt < attempts)) && [[ "$delay" != "0" ]]; then
      sleep "$delay"
    fi
  done
  return 1
}

LAST_PROBE_CODE="not_run"
probe_once() {
  local code
  if ! code="$("$CURL_BIN" -sS -o /dev/null -w '%{http_code}' --max-time 10 "$PROBE_URL")"; then
    LAST_PROBE_CODE="000"
    return 1
  fi
  LAST_PROBE_CODE="$code"
  jq -e --argjson code "$code" '.probe.accepted_codes | index($code) != null' <<<"$ENTRY" >/dev/null
}

write_build_info() {
  local target="$1"
  local build_hash="$2"
  local source_commit="$3"
  local output="$target/build-info.json"
  local tmp="$target/.build-info.json.tmp.$$"
  jq -n \
    --arg built_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    --arg surface "$SITE_NAME" \
    --arg deploy_tag "$TS" \
    --arg source_commit "$source_commit" \
    --arg tree_hash "$SOURCE_TREE_HASH" \
    --arg build_hash "$build_hash" \
    '{
      built_at: $built_at,
      surface: $surface,
      deployed_by: "scripts/deploy-site.sh",
      deploy_tag: $deploy_tag,
      source_commit: $source_commit,
      tree_hash: $tree_hash,
      build_hash: $build_hash
    }' >"$tmp"
  jq -e . "$tmp" >/dev/null
  mv -- "$tmp" "$output"
  if [[ "$SKIP_CHOWN" != "1" ]]; then
    chown "$WEB_OWNER" "$output"
  fi
}

RECEIPT=""
write_receipt() {
  local status="$1"
  local probe_ok="$2"
  local caddy_ok="$3"
  local build_hash="$4"
  local source_commit="$5"
  local backup_path="$6"
  local reason="$7"
  local tmp="$RECEIPT.tmp.$$"
  local overlays_json gates_json manifest_meta_json

  overlays_json="$(jq -c '[.overlays[] | {path, owner, strategy}]' <<<"$ENTRY")"
  if [[ -n "$GATE_RESULTS_FILE" && -s "$GATE_RESULTS_FILE" ]]; then
    gates_json="$(jq -s '.' "$GATE_RESULTS_FILE")"
  else
    gates_json="[]"
  fi
  if [[ -n "$MANIFEST_PATH" && -f "$MANIFEST_PATH" ]]; then
    manifest_meta_json="$(jq -c '{path:$mp, counts:.counts, snapshot_dir:.snapshot_dir}' --arg mp "$MANIFEST_PATH" "$MANIFEST_PATH")"
  else
    manifest_meta_json="null"
  fi

  jq -n \
    --arg schema "arif-sites.deploy-receipt.v1" \
    --arg site "$SITE_NAME" \
    --arg owner "$SITE_OWNER" \
    --arg mode "$MODE" \
    --arg webroot "$WEBROOT" \
    --arg deploy_tag "$TS" \
    --arg status "$status" \
    --arg source_commit "$source_commit" \
    --arg source_commit_short "$SOURCE_COMMIT_SHORT" \
    --arg tree_hash "$SOURCE_TREE_HASH" \
    --arg build_hash "$build_hash" \
    --arg backup_path "$backup_path" \
    --arg probe_url "$PROBE_URL" \
    --arg probe_code "$LAST_PROBE_CODE" \
    --arg reason "$reason" \
    --argjson probe_ok "$probe_ok" \
    --argjson caddy_ok "$caddy_ok" \
    --argjson split_roots "$SPLIT_ROOTS" \
    --argjson overlays "$overlays_json" \
    --argjson external_input_manifest "$EXTERNAL_MANIFEST_JSON" \
    --argjson artifact_hashes "$ARTIFACT_HASHES_JSON" \
    --argjson gates "$gates_json" \
    --argjson mutation_manifest "$manifest_meta_json" \
    --argjson rollback "$ROLLBACK_INFO_JSON" \
    '{
      schema: $schema,
      site: $site,
      owner: $owner,
      mode: $mode,
      webroot: $webroot,
      split_roots: ($split_roots == 1),
      deploy_tag: $deploy_tag,
      status: $status,
      source_commit: $source_commit,
      source_commit_short: $source_commit_short,
      tree_hash: $tree_hash,
      build_hash: $build_hash,
      external_input_manifest: $external_input_manifest,
      artifact_hashes: $artifact_hashes,
      backup_path: $backup_path,
      overlays: $overlays,
      gates: $gates,
      mutation_manifest: $mutation_manifest,
      rollback: $rollback,
      caddy: {ok: $caddy_ok},
      probe: {url: $probe_url, code: $probe_code, ok: $probe_ok},
      reason: $reason
    }' >"$tmp"
  jq -e . "$tmp" >/dev/null
  mv -- "$tmp" "$RECEIPT"
}

rollback_after_failure() {
  local reason="$1"
  local status="$2"
  local build_hash="$3"
  local source_commit="$4"
  local caddy_ok="$5"
  local probe_ok="$6"

  local rb_status=0
  if ! run_manifest_rollback; then
    rb_status=1
    log "rollback failed for one or more targets in manifest ($ROLLBACK_RESULT_PATH)"
  fi

  if [[ -e "$OLD_STAGE" || -L "$OLD_STAGE" ]]; then
    safe_remove_temp "$OLD_STAGE"
  fi
  SWAP_ACTIVE=0
  MUTATION_STARTED=0

  if ! retry_command "Caddy reload after rollback" "$CADDY_ATTEMPTS" "$RETRY_DELAY" \
    "$CADDY_BIN" reload --config "$CADDYFILE" >/dev/null 2>&1; then
    log "Caddy reload also failed after filesystem rollback"
  fi

  local final_status="$status"
  ((rb_status != 0)) && final_status="rollback_partial_failure"
  if ! write_receipt "$final_status" "$probe_ok" "$caddy_ok" "$build_hash" "$source_commit" "$DEPLOY_DIR/snapshot" "$reason"; then
    log "rollback finished but receipt creation failed"
    return 2
  fi
  log "deployment failed closed ($final_status): $reason; receipt=$RECEIPT"
  return 1
}

invoke_gate() {
  local gate_id="$1"
  shift
  local meta_json
  meta_json="$(gate_registry_lookup "$GATE_REGISTRY" "$gate_id")"
  if ! gate_applies_to_site "$meta_json" "$SITE_NAME"; then
    return 0
  fi
  run_gate_command "$GATE_REGISTRY" "$gate_id" "$DEPLOY_DIR/logs" 25 "$@"
}

if [[ "$MODE" == "dry-run" ]]; then
  inspect_args=(
    --repo-root "$REPO_ROOT"
    --source-rel "$SOURCE_REL"
    --site "$SITE_NAME"
    --commit "$COMMIT_ARG"
    --authorized-commit "$AUTHORIZED_COMMIT"
    --external-manifest "$EXTERNAL_INPUT_MANIFEST"
  )
  ((EXPLICIT_COMMIT == 1)) && inspect_args+=(--explicit-commit)
  [[ -n "$EXTERNAL_INPUTS_DIR" ]] && inspect_args+=(--external-dir "$EXTERNAL_INPUTS_DIR")
  for req in "${REQUIRED_TRACKED[@]}"; do
    inspect_args+=(--required-tracked "$req")
  done
  inspect_json="$("$PYTHON_BIN" "$REPO_ROOT/scripts/lib/materialize-source.py" inspect "${inspect_args[@]}")" \
    || die "commit/source verification failed in dry-run"
  SOURCE_COMMIT="$(jq -r '.source_commit' <<<"$inspect_json")"
  SOURCE_COMMIT_SHORT="$(jq -r '.source_commit_short' <<<"$inspect_json")"
  SOURCE_TREE_HASH="$(jq -r '.tree_hash' <<<"$inspect_json")"
  EXTERNAL_MANIFEST_JSON="$(jq -c '.external_input_manifest' <<<"$inspect_json")"

  jq -n \
    --arg mode "$MODE" \
    --arg site "$SITE_NAME" \
    --arg source "$SOURCE_DIR" \
    --arg webroot "$WEBROOT" \
    --arg owner "$SITE_OWNER" \
    --arg registry "$REGISTRY" \
    --arg source_commit "$SOURCE_COMMIT" \
    --arg source_commit_short "$SOURCE_COMMIT_SHORT" \
    --arg tree_hash "$SOURCE_TREE_HASH" \
    --argjson split_roots "$SPLIT_ROOTS" \
    --argjson build "$(jq -c '.build // null' <<<"$ENTRY")" \
    --argjson overlays "$(jq -c '[.overlays[] | {path, owner, strategy}]' <<<"$ENTRY")" \
    --argjson external_input_manifest "$EXTERNAL_MANIFEST_JSON" \
    '{mode: $mode, site: $site, source: $source, webroot: $webroot, split_roots: ($split_roots == 1), owner: $owner, registry: $registry, source_commit: $source_commit, source_commit_short: $source_commit_short, tree_hash: $tree_hash, build: $build, overlays: $overlays, external_input_manifest: $external_input_manifest, mutation: false}'
  exit 0
fi

if [[ "$MODE" == "validate-build" ]]; then
  prepare_build
  candidate_log_dir="$(mktemp -d "$BUILD_TMP_ROOT/arif-sites-gate-logs.${SITE_NAME}.XXXXXX")"
  TEMP_DIRS+=("$candidate_log_dir")
  run_gate_command "$GATE_REGISTRY" "candidate.asset_references" "$candidate_log_dir" 25 \
    "$PYTHON_BIN" "$REPO_ROOT/scripts/lib/verify-dist-assets.py" "$DEPLOY_SOURCE" \
    || die "candidate asset reference check failed"
  log "isolated build validation passed for commit=$SOURCE_COMMIT_SHORT tree=$SOURCE_TREE_HASH"
  exit 0
fi

TS="$(date -u +%Y%m%dT%H%M%S%NZ)"
DEPLOY_DIR="$ARCHIVE_ROOT/$TS"
mkdir -p "$DEPLOY_DIR/logs" "$STAGING_ROOT"
LOG_FILE="$DEPLOY_DIR/deploy.log"
RECEIPT="$DEPLOY_DIR/receipt.json"
GATE_RESULTS_FILE="$DEPLOY_DIR/gate-results.ndjson"
export GATE_RESULTS_NDJSON="$GATE_RESULTS_FILE"
: >"$LOG_FILE"
: >"$GATE_RESULTS_FILE"

exec {LOCK_FD}>"$STAGING_ROOT/.deploy.${SITE_NAME}.lock"
flock -x "$LOCK_FD" || die "failed to acquire deploy lock for $SITE_NAME"

# ── Phase 1 & 2: Materialize exact commit / restore snapshot + Build ────────
if [[ "$MODE" == "restore" ]]; then
  [[ "$RESTORE_TAG" =~ ^[A-Za-z0-9._-]+$ ]] || die "invalid restore tag: $RESTORE_TAG"
  DEPLOY_SOURCE="$ARCHIVE_ROOT/$RESTORE_TAG/previous"
  [[ -d "$DEPLOY_SOURCE" ]] || die "backup not found: $DEPLOY_SOURCE"
  validate_artifacts "$DEPLOY_SOURCE"
  SOURCE_COMMIT="restore:${RESTORE_TAG}"
  SOURCE_COMMIT_SHORT="restore"
  SOURCE_TREE_HASH="restore"
  RESTORE_OVERLAYS=1
else
  prepare_build
  RESTORE_OVERLAYS=0
fi

BUILD_HASH="$(hash_tree "$DEPLOY_SOURCE")"
ARTIFACT_HASHES_JSON="$(compute_artifact_hashes_json "$DEPLOY_SOURCE" "$BUILD_HASH")"

# ── Phase 3: Verify Candidate (ALL blocking candidate gates BEFORE mutation) ──
if ! invoke_gate "candidate.asset_references" \
  "$PYTHON_BIN" "$REPO_ROOT/scripts/lib/verify-dist-assets.py" "$DEPLOY_SOURCE"; then
  write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "candidate.asset_references failed"
  die "candidate asset reference verification failed; zero roots mutated"
fi

if ! invoke_gate "candidate.stale_dev_entries" \
  grep -rE 'src="/src/[^"]*"|src="/@vite/|src="/@id/' "$DEPLOY_SOURCE"; then
  write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "candidate.stale_dev_entries found dev-only script URLs"
  die "dev-only script entries found in candidate output; zero roots mutated"
fi

if [[ "$(jq -r '.ownership_gate // false' <<<"$ENTRY")" == "true" ]]; then
  OWNER_PY="${ARIF_SITES_PYTHON_BIN:-python3}"
  if ! invoke_gate "ownership.gate" \
    "$OWNER_PY" "$REPO_ROOT/scripts/deploy-ownership-gate.py" \
    --registry "$REGISTRY" --site "$SITE_NAME" \
    --repo-root "$REPO_ROOT" --source-dir "$DEPLOY_SOURCE" --html-root "$HTML_ROOT"; then
    write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "ownership.gate failed"
    die "ownership.gate FAILED; zero roots mutated"
  fi
fi

if [[ "$MODE" != "restore" && -n "$BUILD_WORK" ]]; then
  if ! ARIF_SITES_REPO="$BUILD_WORK/repo" ARIF_SITES_HTML_ARIF="$WEBROOT" invoke_gate "web_zen.preflight" \
    "$PYTHON_BIN" "$REPO_ROOT/scripts/web-zen/web_zen.py" preflight --json --no-receipt; then
    write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "web_zen.preflight failed"
    die "web_zen.preflight failed closed before mutation"
  fi
fi

if ! ARIF_SITES_REPO="$REPO_ROOT" ARIF_SITES_HTML_ARIF="$WEBROOT" invoke_gate "web_zen.sense" \
  "$PYTHON_BIN" "$REPO_ROOT/scripts/web-zen/web_zen.py" sense --json --no-receipt; then
  write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "web_zen.sense failed"
  die "web_zen.sense failed closed before mutation"
fi

if [[ "${ARIF_SITES_SKIP_DOCTOR:-0}" != "1" ]]; then
  if ! ARIF_SITES_REPO="$REPO_ROOT" ARIF_SITES_HTML_ARIF="$WEBROOT" invoke_gate "web_zen.doctor" \
    "$PYTHON_BIN" "$REPO_ROOT/scripts/web-zen/web_zen.py" doctor --json --no-receipt; then
    write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "web_zen.doctor failed"
    die "web_zen.doctor failed closed before mutation (|| true bypass removed)"
  fi
fi

if [[ -n "${ARIF_SITES_CANDIDATE_VERIFY_CMD:-}" ]]; then
  if ! invoke_gate "candidate.custom_verifier" bash -c "$ARIF_SITES_CANDIDATE_VERIFY_CMD"; then
    write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "candidate.custom_verifier failed"
    die "candidate verifier failed closed before mutation"
  fi
fi

if ! invoke_gate "caddy.validate" \
  retry_command "Caddy validation" "$CADDY_ATTEMPTS" "$RETRY_DELAY" \
  "$CADDY_BIN" validate --config "$CADDYFILE"; then
  LAST_PROBE_CODE="not_run"
  write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "Caddy validation failed"
  die "Caddy validation failed closed; no swap performed"
fi

# ── Phase 4 & 5: Stage Complete Release + Pre-Compute Manifest + Snapshot ───
NEW_STAGE="$(mktemp -d "$STAGING_ROOT/${WEBROOT_NAME}.new.${TS}.XXXXXX")"
chmod 755 "$NEW_STAGE"
TEMP_DIRS+=("$NEW_STAGE")
stage_tree "$DEPLOY_SOURCE" "$WEBROOT" "$NEW_STAGE" "$RESTORE_OVERLAYS"
write_build_info "$NEW_STAGE" "$BUILD_HASH" "$SOURCE_COMMIT"

MANIFEST_PATH="$DEPLOY_DIR/mutation-manifest.json"
SNAPSHOT_DIR="$DEPLOY_DIR/snapshot"
manifest_args=(
  --stage-dir "$NEW_STAGE"
  --html-root "$HTML_ROOT"
  --webroot "$WEBROOT"
  --manifest "$MANIFEST_PATH"
  --snapshot-dir "$SNAPSHOT_DIR"
)
((SPLIT_ROOTS == 1)) && manifest_args+=(--split-roots)
[[ -n "$EXTRA_MANIFEST_TARGETS" ]] && manifest_args+=(--extra-targets "$EXTRA_MANIFEST_TARGETS")

if ! invoke_gate "manifest.containment" \
  "$PYTHON_BIN" "$REPO_ROOT/scripts/lib/mutation-manifest.py" plan "${manifest_args[@]}"; then
  write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "mutation manifest containment/snapshot rejected before mutation"
  die "manifest containment gate rejected targets before mutation"
fi

# ── Final Pre-Mutation Barrier ──────────────────────────────────────────────
[[ -f "$MANIFEST_PATH" ]] || die "pre-mutation barrier: manifest absent"
jq -e '.schema == "arif-sites.mutation-manifest.v1"' "$MANIFEST_PATH" >/dev/null \
  || die "pre-mutation barrier: invalid manifest"

# ── Promote Primary + Split Roots ───────────────────────────────────────────
OLD_STAGE="$STAGING_ROOT/${WEBROOT_NAME}.old.${TS}.$$"
MUTATION_STARTED=1
if [[ -e "$WEBROOT" || -L "$WEBROOT" ]]; then
  mv -- "$WEBROOT" "$OLD_STAGE"
fi
mv -- "$NEW_STAGE" "$WEBROOT"
SWAP_ACTIVE=1

if ! validate_artifacts "$WEBROOT"; then
  rollback_after_failure "post-swap required artifact verification failed" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" false false || exit 1
fi

if ((SPLIT_ROOTS == 1)); then
  if ! invoke_gate "live.split_roots_local" \
    bash "$REPO_ROOT/scripts/sync-serving-roots.sh" \
    --html-root "$HTML_ROOT" --webroot "$WEBROOT" --skip-backup --allow-missing-optional "$WEBROOT"; then
    rollback_after_failure "split-roots sync or local verification failed" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" false false || exit 1
  fi
fi

# ── Verify Live ─────────────────────────────────────────────────────────────
if ! retry_command "Caddy reload" "$CADDY_ATTEMPTS" "$RETRY_DELAY" \
  "$CADDY_BIN" reload --config "$CADDYFILE"; then
  rollback_after_failure "Caddy reload failed" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" false false || exit 1
fi

if ! invoke_gate "live.http_probe" \
  retry_command "site probe" "$PROBE_ATTEMPTS" "$RETRY_DELAY" probe_once; then
  rollback_after_failure "probe failed after retries (last code $LAST_PROBE_CODE)" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" true false || exit 1
fi

# shellcheck disable=SC2016
if ! invoke_gate "live.soft200_guard" \
  bash -c 'code="$("$1" -s -o /dev/null -w "%{http_code}" --max-time 10 "$2" || echo 000)"; echo "soft200_probe_http=$code"; [[ "$code" != "200" ]]' \
  _ "$CURL_BIN" "${PROBE_URL%/}/__non_existent_path_soft200_check__"; then
  rollback_after_failure "live.soft200_guard failed: garbage path returned HTTP 200" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" true true || exit 1
fi

if [[ "$SPLIT_ROOTS" == "1" ]] || [[ "${ARIF_SITES_RUN_POST_LIVE_GATES:-0}" == "1" ]]; then
  if [[ "$HTML_ROOT" == "/var/www/html" || "${ARIF_SITES_RUN_POST_LIVE_GATES:-0}" == "1" ]]; then
    if ! ARIF_SITES_REPO="$REPO_ROOT" ARIF_SITES_HTML_ARIF="$WEBROOT" invoke_gate "web_zen.verify" \
      "$PYTHON_BIN" "$REPO_ROOT/scripts/web-zen/web_zen.py" verify --json --no-receipt; then
      rollback_after_failure "web_zen.verify failed after promotion" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" true false || exit 1
    fi
    if ! invoke_gate "verify.pages" \
      bash "$REPO_ROOT/scripts/verify-pages.sh" "${ARIF_SITES_VERIFY_BASE_URL:-https://arif-fazil.com}" "$WEBROOT"; then
      rollback_after_failure "verify.pages failed after promotion" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" true false || exit 1
    fi
  fi
fi

# ── Advisory post-deploy hook (policy controlled via infra/deploy-gates.json) ─
if [[ "$WEBROOT_NAME" == "arif" && -f "$WEBROOT/data/wealth/latest.json" ]]; then
  mkdir -p "$WEBROOT/static"
  if ! invoke_gate "post_deploy.wealth_render" \
    "$PYTHON_BIN" /root/scripts/wealth-static-render.py \
    "$WEBROOT/data/wealth/latest.json" "$WEBROOT/static/wealth.html"; then
    rollback_after_failure "post_deploy.wealth_render failed (blocking policy active)" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" true false || exit 1
  fi
fi

# ── Accept & Archive Previous ───────────────────────────────────────────────
BACKUP_PREVIOUS="$DEPLOY_DIR/previous"
if [[ -e "$OLD_STAGE" || -L "$OLD_STAGE" ]]; then
  mkdir -p "$BACKUP_PREVIOUS"
  rsync -a --delete "$OLD_STAGE/" "$BACKUP_PREVIOUS/" || die "failed to archive previous tree"
fi

SUCCESS_STATUS="live"
[[ "$MODE" == "restore" ]] && SUCCESS_STATUS="restored"
MUTATION_STARTED=0
SWAP_ACTIVE=0
write_receipt "$SUCCESS_STATUS" true true "$BUILD_HASH" "$SOURCE_COMMIT" "$BACKUP_PREVIOUS" ""

if [[ -e "$OLD_STAGE" || -L "$OLD_STAGE" ]]; then
  safe_remove_temp "$OLD_STAGE"
fi
log "receipt: $RECEIPT (status=$SUCCESS_STATUS)"
printf '%s\n' "$RECEIPT"
