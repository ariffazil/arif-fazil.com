#!/usr/bin/env bash
# Phase 9 Disposable Production-Shaped Containment & Rollback Test Suite (Tests A-H).
# Never touches /var/www/html, /etc/caddy, or the dirty primary checkout.
set -euo pipefail

REAL_REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
REPORT_JSON="${ARIF_SITES_TEST_REPORT_JSON:-}"
PRIMARY_REPO="${ARIF_SITES_PRIMARY_REPO_CHECK:-/root/arif-fazil.com}"
PRIMARY_ESSAYS_REL="sites/arif-fazil.com/src/data/essays.json"

TMP="$(mktemp -d "${TMPDIR:-/tmp}/deploy-containment.XXXXXX")"
HTTP_PID=""
cleanup() {
  if [[ -n "$HTTP_PID" ]]; then
    kill "$HTTP_PID" 2>/dev/null || true
    wait "$HTTP_PID" 2>/dev/null || true
  fi
  rm -rf "$TMP"
}
trap cleanup EXIT

PASS=0
FAIL=0
RESULTS_NDJSON="$TMP/results.ndjson"
: >"$RESULTS_NDJSON"

record_case() {
  local case_id="$1" status="$2" detail="$3"
  jq -cn --arg id "$case_id" --arg status "$status" --arg detail "$detail" \
    '{case: $id, status: $status, detail: $detail}' >>"$RESULTS_NDJSON"
  if [[ "$status" == "PASS" ]]; then
    printf '  PASS [%s]: %s\n' "$case_id" "$detail"
    PASS=$((PASS + 1))
  else
    printf '  FAIL [%s]: %s\n' "$case_id" "$detail" >&2
    FAIL=$((FAIL + 1))
  fi
}

# Python helper: snapshot directory state (type, sha256/symlink, mode, uid:gid) + local HTTP test server
HELPER_PY="$TMP/fixture_helper.py"
cat >"$HELPER_PY" <<'PY'
#!/usr/bin/env python3
import hashlib
import http.server
import json
import os
import socketserver
import stat
import sys
from pathlib import Path


def snapshot_tree(root: Path, include_owner: bool = True) -> dict[str, dict]:
    out: dict[str, dict] = {}
    if not root.exists():
        return out
    for dirpath, dirnames, filenames in os.walk(root, followlinks=False):
        dirnames.sort()
        filenames.sort()
        rel_dir = Path(dirpath).relative_to(root)
        for d in dirnames:
            dp = Path(dirpath) / d
            rel = (rel_dir / d).as_posix() if str(rel_dir) != "." else d
            st = os.lstat(dp)
            if stat.S_ISLNK(st.st_mode):
                out[rel] = {
                    "kind": "symlink",
                    "target": os.readlink(dp),
                    "mode": f"{stat.S_IMODE(st.st_mode):04o}",
                    "owner": f"{st.st_uid}:{st.st_gid}" if include_owner else "ignored",
                }
            else:
                out[rel + "/"] = {
                    "kind": "dir",
                    "mode": f"{stat.S_IMODE(st.st_mode):04o}",
                    "owner": f"{st.st_uid}:{st.st_gid}" if include_owner else "ignored",
                }
        for f in filenames:
            fp = Path(dirpath) / f
            rel = (rel_dir / f).as_posix() if str(rel_dir) != "." else f
            st = os.lstat(fp)
            if stat.S_ISLNK(st.st_mode):
                out[rel] = {
                    "kind": "symlink",
                    "target": os.readlink(fp),
                    "mode": f"{stat.S_IMODE(st.st_mode):04o}",
                    "owner": f"{st.st_uid}:{st.st_gid}" if include_owner else "ignored",
                }
            else:
                h = hashlib.sha256()
                with fp.open("rb") as fh:
                    for chunk in iter(lambda: fh.read(65536), b""):
                        h.update(chunk)
                out[rel] = {
                    "kind": "file",
                    "sha256": h.hexdigest(),
                    "mode": f"{stat.S_IMODE(st.st_mode):04o}",
                    "owner": f"{st.st_uid}:{st.st_gid}" if include_owner else "ignored",
                }
    return out


def diff_snapshots(before: dict, after: dict) -> list[str]:
    diffs: list[str] = []
    all_keys = sorted(set(before) | set(after))
    for k in all_keys:
        if k not in before:
            diffs.append(f"+ added: {k} ({after[k]})")
        elif k not in after:
            diffs.append(f"- missing: {k} ({before[k]})")
        elif before[k] != after[k]:
            diffs.append(f"~ changed: {k} before={before[k]} after={after[k]}")
    return diffs


def serve_http(html_root: Path, control_dir: Path, port_file: Path) -> None:
    split_tops = {"human", "institution", "words", "world", "work", "pilot", "earth", "_shared", "connect", "laws", "verify", "discovery", "research", ".well-known"}

    class Handler(http.server.BaseHTTPRequestHandler):
        def log_message(self, fmt, *args):
            pass

        def do_GET(self):
            req_path = self.path.split("?", 1)[0]
            if (control_dir / "force_probe_503").exists() and req_path == "/":
                self.send_response(503)
                self.end_headers()
                self.wfile.write(b"injected probe failure")
                return
            if req_path == "/__non_existent_path_soft200_check__":
                if (control_dir / "force_soft200").exists():
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(b"injected soft 200")
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b"not found")
                return

            clean = req_path.lstrip("/")
            candidates: list[Path] = []
            if clean == "":
                candidates.append(html_root / "arif" / "index.html")
            else:
                first = clean.split("/", 1)[0]
                if first in split_tops:
                    candidates.append(html_root / clean)
                    candidates.append(html_root / clean / "index.html")
                if "/" not in clean:
                    candidates.append(html_root / clean)
                candidates.append(html_root / "arif" / clean)
                candidates.append(html_root / "arif" / clean / "index.html")

            chosen = next((c for c in candidates if c.is_file()), None)
            if chosen is None:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"404 Not Found")
                return

            ctype = "text/html; charset=utf-8"
            if chosen.suffix == ".json":
                ctype = "application/json"
            elif chosen.suffix == ".css":
                ctype = "text/css"
            elif chosen.suffix == ".js":
                ctype = "application/javascript"
            elif chosen.suffix == ".txt":
                ctype = "text/plain; charset=utf-8"

            data = chosen.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

    class ReusableTCPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
        allow_reuse_address = True

    srv = ReusableTCPServer(("127.0.0.1", 0), Handler)
    port_file.write_text(str(srv.server_address[1]), encoding="utf-8")
    srv.serve_forever()


def main() -> int:
    cmd = sys.argv[1]
    if cmd == "snapshot":
        root = Path(sys.argv[2])
        out = Path(sys.argv[3])
        include_owner = sys.argv[4] != "no-owner" if len(sys.argv) > 4 else True
        out.write_text(json.dumps(snapshot_tree(root, include_owner), indent=2, sort_keys=True), encoding="utf-8")
        return 0
    if cmd == "compare":
        b = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
        a = json.loads(Path(sys.argv[3]).read_text(encoding="utf-8"))
        diffs = diff_snapshots(b, a)
        if diffs:
            print("\n".join(diffs[:40]), file=sys.stderr)
            return 1
        return 0
    if cmd == "serve":
        serve_http(Path(sys.argv[2]), Path(sys.argv[3]), Path(sys.argv[4]))
        return 0
    return 2


if __name__ == "__main__":
    sys.exit(main())
PY
chmod +x "$HELPER_PY"

# Build disposable production-shaped repo + html_root + caddy + http server
REPO="$TMP/repo"
HTML_ROOT="$TMP/var_www_html"
STAGING_ROOT="$TMP/staging"
ARCHIVE_ROOT="$TMP/archives"
BUILD_TMP="$TMP/build_tmp"
HTTP_CTRL="$TMP/http_ctrl"
CADDY_DIR="$TMP/caddy"
MOCK_BIN="$TMP/bin"
EXT_DIR="$TMP/external_inputs"
mkdir -p "$REPO" "$HTML_ROOT" "$STAGING_ROOT" "$ARCHIVE_ROOT" "$BUILD_TMP" "$HTTP_CTRL" "$CADDY_DIR" "$MOCK_BIN" "$EXT_DIR"

# Copy pipeline scripts and policies from the isolated worktree under test
mkdir -p "$REPO/scripts" "$REPO/infra"
cp -a "$REAL_REPO/scripts/." "$REPO/scripts/"
cp -a "$REAL_REPO/infra/." "$REPO/infra/"

# Mock caddy CLI that respects failure control flag while exercising real --config check
MOCK_CADDY="$MOCK_BIN/caddy"
cat >"$MOCK_CADDY" <<SH
#!/usr/bin/env bash
set -euo pipefail
sub="\${1:-}"
if [[ -f "$HTTP_CTRL/fail_caddy_\$sub" ]]; then
  echo "injected caddy failure on \$sub" >&2
  exit 1
fi
for a in "\$@"; do
  [[ "\$a" == "/nonexistent" ]] && exit 1
done
exit 0
SH
chmod +x "$MOCK_CADDY"

# Fixture Caddyfile satisfying web_zen.sense checks
cat >"$CADDY_DIR/Caddyfile" <<'CADDY'
arif-fazil.com {
    @root_static path /missions.json /llms.txt /llms.json /robots.txt /surfaces.json
    @spa_routes path /missions* /human* /institution*
}
CADDY

# Fixture runtime-overlays.json shaped like production arif-fazil.com with offline isolated node build
cat >"$REPO/infra/runtime-overlays.json" <<'JSON'
{
  "schema_version": 2,
  "canonical_repo_root": "/root/arif-fazil.com",
  "defaults": {
    "probe_attempts": 2,
    "caddy_attempts": 1,
    "retry_delay_seconds": 0
  },
  "sites": [
    {
      "site": "arif-fazil.com",
      "source": "sites/arif-fazil.com",
      "webroot": "arif",
      "owner": "arif-sites-fixture",
      "batch": true,
      "batch_order": 1,
      "ownership_gate": true,
      "required_artifacts": [
        "index.html",
        "human/index.html",
        "institution/index.html",
        "world/index.html",
        "world-state.json",
        "llms.txt",
        "robots.txt"
      ],
      "build": {
        "kind": "npm",
        "command": ["node", "build.mjs"],
        "output": "dist",
        "pinned": true,
        "version_command": ["node", "-v"],
        "version_contains": "v",
        "output_markers": [
          {"path": "human/index.html", "contains": "<title>Start here — agents</title>"}
        ]
      },
      "probe": {
        "url": "https://arif-fazil.com/",
        "accepted_codes": [200]
      },
      "overlays": [
        {"path": "data/oil", "owner": "oil-cron", "strategy": "preserve-live"},
        {"path": "data/gold", "owner": "gold-cron", "strategy": "preserve-live"},
        {"path": "data/wealth", "owner": "wealth-cron", "strategy": "preserve-live"},
        {"path": "static/wealth.html", "owner": "wealth-cron", "strategy": "preserve-live"}
      ]
    }
  ]
}
JSON

SITE_SRC="$REPO/sites/arif-fazil.com"
mkdir -p "$SITE_SRC/src/data" "$SITE_SRC/public/assets" "$SITE_SRC/public/_shared" \
  "$SITE_SRC/public/human" "$SITE_SRC/public/institution" "$SITE_SRC/public/words" \
  "$SITE_SRC/public/work" "$SITE_SRC/public/world" "$SITE_SRC/public/earth" \
  "$SITE_SRC/public/pilot" "$SITE_SRC/public/connect" "$SITE_SRC/public/laws" \
  "$SITE_SRC/public/verify" "$SITE_SRC/public/discovery" "$SITE_SRC/public/research" \
  "$SITE_SRC/public/.well-known"

cp "$REAL_REPO/sites/arif-fazil.com/src/data/missions.ts" "$SITE_SRC/src/data/missions.ts"
cp "$REAL_REPO/sites/arif-fazil.com/public/missions.json" "$SITE_SRC/public/missions.json"

cat >"$SITE_SRC/package.json" <<'JSON'
{"name": "arif-fazil-fixture", "version": "1.0.0", "private": true}
JSON
cat >"$SITE_SRC/package-lock.json" <<'JSON'
{"name": "arif-fazil-fixture", "version": "1.0.0", "lockfileVersion": 3, "requires": true, "packages": {}}
JSON

cat >"$SITE_SRC/build.mjs" <<'JS'
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const pubDir = path.resolve('public');
const distDir = path.resolve('dist');
fs.rmSync(distDir, { recursive: true, force: true });
fs.cpSync(pubDir, distDir, { recursive: true, verbatimSymlinks: true });

const wsPath = path.join(distDir, 'world-state.json');
if (fs.existsSync(wsPath)) {
  const wsHash = crypto.createHash('sha256').update(fs.readFileSync(wsPath)).digest('hex').slice(0, 12);
  const worldHtml = path.join(distDir, 'world', 'index.html');
  if (fs.existsSync(worldHtml)) {
    const content = fs.readFileSync(worldHtml, 'utf8').replace('__WORLD_STATE_SHA12__', wsHash);
    fs.writeFileSync(worldHtml, content);
  }
}
JS

write_site_version() {
  local ver="$1"
  printf '<!doctype html><html><head><title>Arif Fazil</title><link rel="stylesheet" href="/assets/app.css"></head><body><h1>Main %s</h1><script src="/assets/app.js"></script></body></html>\n' "$ver" >"$SITE_SRC/public/index.html"
  printf '/* app css %s */\n' "$ver" >"$SITE_SRC/public/assets/app.css"
  printf 'console.log("app %s");\n' "$ver" >"$SITE_SRC/public/assets/app.js"
  printf '/* shared shell %s */\n' "$ver" >"$SITE_SRC/public/_shared/shell.css"
  printf '<!doctype html><html><head><title>Start here — agents</title></head><body>human %s</body></html>\n' "$ver" >"$SITE_SRC/public/human/index.html"
  printf '<!doctype html><html><head><title>Briefing — Arif Fazil</title><meta name="description" content="briefing %s"></head><body>institution %s</body></html>\n' "$ver" "$ver" >"$SITE_SRC/public/institution/index.html"
  printf '<!doctype html><html><head><title>Words %s</title></head><body>words %s</body></html>\n' "$ver" "$ver" >"$SITE_SRC/public/words/index.html"
  printf '<!doctype html><html><head><title>Work %s</title></head><body>work %s</body></html>\n' "$ver" "$ver" >"$SITE_SRC/public/work/index.html"
  printf '<!doctype html><html><head><title>Earth %s</title></head><body><a href="/map/#earth">Earth %s</a></body></html>\n' "$ver" "$ver" >"$SITE_SRC/public/earth/index.html"
  printf '<!doctype html><html><head><title>Pilot %s</title></head><body>pilot %s</body></html>\n' "$ver" "$ver" >"$SITE_SRC/public/pilot/index.html"
  for d in connect laws verify discovery research .well-known; do
    printf '<!doctype html><html><head><title>%s %s</title></head><body>%s %s</body></html>\n' "$d" "$ver" "$d" "$ver" >"$SITE_SRC/public/$d/index.html"
  done
  printf 'User-agent: *\nAllow: /\n# version=%s\n' "$ver" >"$SITE_SRC/public/robots.txt"
  printf '# arif-fazil.com — arifOS Ditempa bukan diberi\nDoes not adjudicate (%s)\n' "$ver" >"$SITE_SRC/public/llms.txt"
  printf '{"site":"arif-fazil.com","version":"%s"}\n' "$ver" >"$SITE_SRC/public/llms.json"
  printf '{"surfaces":["kinabalu"],"version":"%s"}\n' "$ver" >"$SITE_SRC/public/surfaces.json"
  printf '{"world":"state","version":"%s","provenance_witness":"sha256","brent_crude_usd":72.5,"seal_status":"UNSEALED"}\n' "$ver" >"$SITE_SRC/public/world-state.json"
  local ws_sha64
  ws_sha64="$(sha256sum "$SITE_SRC/public/world-state.json" | awk '{print $1}')"
  printf '<!doctype html><html><head><title>World %s</title></head><body>world %s <data value="72.5">72.5</data> <footer>integrity sha256:%s</footer></body></html>\n' "$ver" "$ver" "$ws_sha64" >"$SITE_SRC/public/world/index.html"
  printf '<rsl version="%s"><resource>arif-fazil.com sha256</resource></rsl>\n' "$ver" >"$SITE_SRC/public/rsl.xml"
}

git -C "$REPO" init -q
git -C "$REPO" config user.email "test@arif-fazil.com"
git -C "$REPO" config user.name "Containment Tester"

# Commit V1 (Baseline)
write_site_version "V1"
git -C "$REPO" add -A
git -C "$REPO" commit -q -m "fixture baseline V1"

# Commit V2 (Clean Candidate)
write_site_version "V2"
git -C "$REPO" add -A
git -C "$REPO" commit -q -m "fixture candidate V2"
COMMIT_V2="$(git -C "$REPO" rev-parse HEAD)"

# Commit V3 (Expanded split-root diff: adds world/new-v3/index.html, removes earth/stale-v2.html)
write_site_version "V3"
mkdir -p "$SITE_SRC/public/world/new-v3"
printf '<!doctype html><html><body>new v3 world page</body></html>\n' >"$SITE_SRC/public/world/new-v3/index.html"
git -C "$REPO" add -A
git -C "$REPO" commit -q -m "fixture candidate V3"
COMMIT_V3="$(git -C "$REPO" rev-parse HEAD)"

# Commit V_DEV_ENTRY (Blocked by candidate.stale_dev_entries)
write_site_version "V_DEV"
printf '<!doctype html><html><body><script type="module" src="/@vite/client"></script></body></html>\n' >"$SITE_SRC/public/index.html"
git -C "$REPO" add -A
git -C "$REPO" commit -q -m "fixture bad dev-entry"
COMMIT_V_DEV="$(git -C "$REPO" rev-parse HEAD)"

# Commit V_BAD_ASSET (Blocked by candidate.asset_references - TEST H)
write_site_version "V_BAD_ASSET"
printf '<!doctype html><html><head><link rel="stylesheet" href="/assets/missing-does-not-exist.css"></head><body>bad asset</body></html>\n' >"$SITE_SRC/public/index.html"
git -C "$REPO" add -A
git -C "$REPO" commit -q -m "fixture broken asset ref"
COMMIT_V_BAD_ASSET="$(git -C "$REPO" rev-parse HEAD)"

# Point HEAD back to V2 cleanly
git -C "$REPO" checkout -q "$COMMIT_V2"

# Seed production-shaped baseline $HTML_ROOT from V1 + overlays + out-of-scope protected roots + symlinks/modes
populate_baseline_html_root() {
  rm -rf "$HTML_ROOT"
  mkdir -p "$HTML_ROOT/arif/data/oil" "$HTML_ROOT/arif/data/gold" "$HTML_ROOT/arif/data/wealth" "$HTML_ROOT/arif/static"
  mkdir -p "$HTML_ROOT/arif/assets" "$HTML_ROOT/arif/_shared" \
    "$HTML_ROOT/arif/human" "$HTML_ROOT/arif/institution" "$HTML_ROOT/arif/words" \
    "$HTML_ROOT/arif/work" "$HTML_ROOT/arif/world" "$HTML_ROOT/arif/earth" "$HTML_ROOT/arif/pilot" \
    "$HTML_ROOT/arif/connect" "$HTML_ROOT/arif/laws" "$HTML_ROOT/arif/verify" \
    "$HTML_ROOT/arif/discovery" "$HTML_ROOT/arif/research" "$HTML_ROOT/arif/.well-known"
  mkdir -p "$HTML_ROOT/human" "$HTML_ROOT/institution" "$HTML_ROOT/words" "$HTML_ROOT/work" \
    "$HTML_ROOT/world" "$HTML_ROOT/earth" "$HTML_ROOT/pilot" "$HTML_ROOT/_shared" \
    "$HTML_ROOT/connect" "$HTML_ROOT/laws" "$HTML_ROOT/verify" "$HTML_ROOT/discovery" \
    "$HTML_ROOT/research" "$HTML_ROOT/.well-known"
  mkdir -p "$HTML_ROOT/arifos" "$HTML_ROOT/unrelated-domain"

  printf '<!doctype html><html><head><title>Arif Fazil</title><link rel="stylesheet" href="/assets/app.css"></head><body><h1>Main V1</h1><script src="/assets/app.js"></script></body></html>\n' >"$HTML_ROOT/arif/index.html"
  printf '/* app css V1 */\n' >"$HTML_ROOT/arif/assets/app.css"
  printf 'console.log("app V1");\n' >"$HTML_ROOT/arif/assets/app.js"
  printf '/* shared shell V1 */\n' >"$HTML_ROOT/arif/_shared/shell.css"
  cp "$HTML_ROOT/arif/_shared/shell.css" "$HTML_ROOT/_shared/shell.css"
  printf '<!doctype html><html><head><title>Start here — agents</title></head><body>human V1</body></html>\n' >"$HTML_ROOT/arif/human/index.html"
  cp "$HTML_ROOT/arif/human/index.html" "$HTML_ROOT/human/index.html"
  printf '<!doctype html><html><head><title>Briefing — Arif Fazil</title><meta name="description" content="briefing V1"></head><body>institution V1</body></html>\n' >"$HTML_ROOT/arif/institution/index.html"
  cp "$HTML_ROOT/arif/institution/index.html" "$HTML_ROOT/institution/index.html"
  for d in words work world pilot connect laws verify discovery research .well-known; do
    printf '<!doctype html><html><body>%s V1</body></html>\n' "$d" >"$HTML_ROOT/arif/$d/index.html"
    cp "$HTML_ROOT/arif/$d/index.html" "$HTML_ROOT/$d/index.html"
  done
  printf '<!doctype html><html><body><a href="/map/#earth">Earth V1</a></body></html>\n' >"$HTML_ROOT/arif/earth/index.html"
  cp "$HTML_ROOT/arif/earth/index.html" "$HTML_ROOT/earth/index.html"
  printf 'stale earth file removed by delete mirror\n' >"$HTML_ROOT/earth/legacy-stale.html"
  printf 'extra file in merge-only split root human\n' >"$HTML_ROOT/human/custom-agent-note.txt"
  printf '{"oil":"live-keep"}\n' >"$HTML_ROOT/arif/data/oil/oil.json"
  printf '{"gold":"live-keep"}\n' >"$HTML_ROOT/arif/data/gold/gold.json"
  printf '{"wealth":"live-v1"}\n' >"$HTML_ROOT/arif/data/wealth/latest.json"
  printf '<html>wealth-live</html>\n' >"$HTML_ROOT/arif/static/wealth.html"

  cp "$REAL_REPO/sites/arif-fazil.com/public/missions.json" "$HTML_ROOT/arif/missions.json"
  printf 'User-agent: *\nAllow: /\n# version=V1\n' >"$HTML_ROOT/arif/robots.txt"
  printf '# arif-fazil.com\nDoes not adjudicate (V1)\n' >"$HTML_ROOT/arif/llms.txt"
  printf '{"site":"arif-fazil.com","version":"V1"}\n' >"$HTML_ROOT/arif/llms.json"
  printf '{"surfaces":["kinabalu"],"version":"V1"}\n' >"$HTML_ROOT/arif/surfaces.json"
  for f in missions.json robots.txt llms.txt llms.json surfaces.json; do
    cp "$HTML_ROOT/arif/$f" "$HTML_ROOT/$f"
  done

  # Pre-existing symlink + custom permissions + non-root ownership to verify full restoration
  ln -s "index.html" "$HTML_ROOT/human/legacy-link"
  chmod 0640 "$HTML_ROOT/words/index.html"
  chown www-data:www-data "$HTML_ROOT/words/index.html" "$HTML_ROOT/arif/human/index.html"
  chown -R www-data:www-data "$HTML_ROOT/earth/legacy-stale.html"

  # Protected out-of-scope roots
  printf 'arifos-sovereign-sentinel\n' >"$HTML_ROOT/arifos/index.html"
  printf 'unrelated-domain-sentinel\n' >"$HTML_ROOT/unrelated-domain/keep.txt"
}

# Declare valid external input fixture (wealth latest.json)
mkdir -p "$EXT_DIR/public/data/wealth"
printf '{"wealth":"external-runtime-v2","ts":"2026-11-15T00:00:00Z"}\n' >"$EXT_DIR/public/data/wealth/latest.json"

# Start ephemeral local HTTP server
PORT_FILE="$TMP/http_port"
"$HELPER_PY" serve "$HTML_ROOT" "$HTTP_CTRL" "$PORT_FILE" &
HTTP_PID=$!
for _ in $(seq 1 50); do
  [[ -s "$PORT_FILE" ]] && break
  sleep 0.05
done
HTTP_PORT="$(cat "$PORT_FILE")"
BASE_URL="http://127.0.0.1:${HTTP_PORT}"

latest_receipt() {
  find "$ARCHIVE_ROOT/arif-fazil.com" -maxdepth 2 -name receipt.json -printf '%T@ %p\n' | sort -rn | awk 'NR==1{print $2}'
}

run_deploy() {
  ARIF_SITES_HTML_ROOT="$HTML_ROOT" \
  ARIF_SITES_STAGING_ROOT="$STAGING_ROOT" \
  ARIF_SITES_BUILD_TMP_ROOT="$BUILD_TMP" \
  ARIF_SITES_ARCHIVE_ROOT="$ARCHIVE_ROOT" \
  ARIF_SITES_CADDYFILE="$CADDY_DIR/Caddyfile" \
  ARIF_SITES_CADDY_BIN="$MOCK_CADDY" \
  ARIF_SITES_PROBE_URL_OVERRIDE="${BASE_URL}/" \
  ARIF_SITES_PROBE_ATTEMPTS=1 \
  ARIF_SITES_CADDY_ATTEMPTS=1 \
  ARIF_SITES_RETRY_DELAY=0 \
  ARIF_SITES_SKIP_CHOWN=0 \
  ARIF_SITES_WEB_OWNER="www-data:www-data" \
  ARIF_SITES_SKIP_DOCTOR="${ARIF_SITES_SKIP_DOCTOR:-1}" \
  bash "$REPO/scripts/deploy-site.sh" "$@"
}

echo "=== Phase 9 Deploy-Path Containment Test Suite (A-H) ==="

# ──────────────────────────────────────────────────────────────────────────────
# TEST A: Clean success + full root parity + exact source identity
# ──────────────────────────────────────────────────────────────────────────────
echo "[TEST A] clean success + full root parity"
populate_baseline_html_root
out_a="$TMP/test_a.out"
if receipt_a="$(run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --authorized-commit "$COMMIT_V2" --external-inputs "$EXT_DIR" 2>"$out_a")"; then
  st_a="$(jq -r '.status' "$receipt_a")"
  sc_a="$(jq -r '.source_commit' "$receipt_a")"
  ext_cnt="$(jq '.external_input_manifest.inputs | length' "$receipt_a")"
  ext_excl="$(jq -r '.external_input_manifest.exclude_from_source_identity' "$receipt_a")"
  if [[ "$st_a" == "live" && "$sc_a" == "$COMMIT_V2" && "$ext_cnt" == "1" && "$ext_excl" == "true" ]]; then
    if grep -Fq "Main V2" "$HTML_ROOT/arif/index.html" \
      && grep -Fq "human V2" "$HTML_ROOT/human/index.html" \
      && grep -Fq "institution V2" "$HTML_ROOT/institution/index.html" \
      && grep -Fq "words V2" "$HTML_ROOT/words/index.html" \
      && grep -Fq "work V2" "$HTML_ROOT/work/index.html" \
      && grep -Fq "world V2" "$HTML_ROOT/world/index.html" \
      && grep -Fq "Earth V2" "$HTML_ROOT/earth/index.html" \
      && grep -Fq "shared shell V2" "$HTML_ROOT/_shared/shell.css" \
      && grep -Fq "Does not adjudicate (V2)" "$HTML_ROOT/llms.txt" \
      && [[ ! -e "$HTML_ROOT/earth/legacy-stale.html" ]] \
      && grep -Fq "extra file in merge-only split root human" "$HTML_ROOT/human/custom-agent-note.txt" \
      && grep -Fq "arifos-sovereign-sentinel" "$HTML_ROOT/arifos/index.html" \
      && grep -Fq "unrelated-domain-sentinel" "$HTML_ROOT/unrelated-domain/keep.txt" \
      && grep -Fq "live-keep" "$HTML_ROOT/arif/data/oil/oil.json" \
      && grep -Fq "live-v1" "$HTML_ROOT/arif/data/wealth/latest.json"; then
      record_case "TEST_A" "PASS" "primary + all split roots + _shared + root_static promoted; overlays & out-of-scope untouched (receipt=$receipt_a)"
    else
      record_case "TEST_A" "FAIL" "one or more serving roots or isolation guards drifted"
    fi
  else
    record_case "TEST_A" "FAIL" "unexpected receipt status=$st_a commit=$sc_a ext_cnt=$ext_cnt"
  fi
else
  record_case "TEST_A" "FAIL" "clean deploy failed unexpectedly: $(cat "$out_a")"
fi

# ──────────────────────────────────────────────────────────────────────────────
# TEST B: Candidate gate failures (including web_zen.doctor blocking) -> zero mutation
# ──────────────────────────────────────────────────────────────────────────────
echo "[TEST B] candidate & pre-mutation gate failures leave all roots byte-identical"
populate_baseline_html_root
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_b_before.json"

rc_b1=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V_DEV" >/dev/null 2>&1 || rc_b1=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_b1_after.json"
receipt_b1="$(latest_receipt)"
gate_b1="$(jq -r '.gates[] | select(.gate_id=="candidate.stale_dev_entries") | .outcome' "${receipt_b1:-/dev/null}" 2>/dev/null || echo missing)"
if ((rc_b1 != 0)) && [[ "$gate_b1" == "fail" ]] && "$HELPER_PY" compare "$TMP/snap_b_before.json" "$TMP/snap_b1_after.json"; then
  record_case "TEST_B1" "PASS" "stale /@vite/client dev entry blocked pre-mutation (candidate.stale_dev_entries=fail); zero root bytes changed"
else
  record_case "TEST_B1" "FAIL" "stale dev entry wrong failure or mutated filesystem (rc=$rc_b1 gate=$gate_b1)"
fi

rc_b2=0
ARIF_SITES_CANDIDATE_VERIFY_CMD="echo INJECTED_CANDIDATE_VERIFY_FAIL && exit 1" \
  run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" >/dev/null 2>&1 || rc_b2=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_b2_after.json"
receipt_b2="$(latest_receipt)"
gate_b2="$(jq -r '.gates[] | select(.gate_id=="candidate.custom_verifier") | .outcome' "${receipt_b2:-/dev/null}" 2>/dev/null || echo missing)"
if ((rc_b2 != 0)) && [[ "$gate_b2" == "fail" ]] && "$HELPER_PY" compare "$TMP/snap_b_before.json" "$TMP/snap_b2_after.json"; then
  record_case "TEST_B2" "PASS" "custom blocking candidate verifier halted pre-mutation (candidate.custom_verifier=fail); roots byte-identical"
else
  record_case "TEST_B2" "FAIL" "candidate verifier failure wrong gate or mutated roots (rc=$rc_b2 gate=$gate_b2)"
fi

# Prove web_zen.doctor blocks pre-mutation when executed (no || true bypass)
cat >"$TMP/fake_web_zen_fail_doctor.py" <<'PY'
import json, sys
mode = sys.argv[1]
if mode == "doctor":
    print(json.dumps({"mode": "doctor", "ok": False, "reason": "simulated doctor fail"}))
    sys.exit(1)
print(json.dumps({"mode": mode, "ok": True}))
sys.exit(0)
PY
cp "$REPO/scripts/web-zen/web_zen.py" "$TMP/web_zen.py.orig"
cp "$TMP/fake_web_zen_fail_doctor.py" "$REPO/scripts/web-zen/web_zen.py"
rc_b3=0
ARIF_SITES_SKIP_DOCTOR=0 run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" >/dev/null 2>&1 || rc_b3=$?
cp "$TMP/web_zen.py.orig" "$REPO/scripts/web-zen/web_zen.py"
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_b3_after.json"
receipt_b3="$(latest_receipt)"
gate_b3="$(jq -r '.gates[] | select(.gate_id=="web_zen.doctor") | .outcome' "${receipt_b3:-/dev/null}" 2>/dev/null || echo missing)"
if ((rc_b3 != 0)) && [[ "$gate_b3" == "fail" ]] && "$HELPER_PY" compare "$TMP/snap_b_before.json" "$TMP/snap_b3_after.json"; then
  record_case "TEST_B3" "PASS" "failing web_zen.doctor halted deployment pre-mutation (web_zen.doctor=fail, || true removed); roots byte-identical"
else
  record_case "TEST_B3" "FAIL" "failing web_zen.doctor did not hit expected gate cleanly (rc=$rc_b3 gate=$gate_b3)"
fi

# ──────────────────────────────────────────────────────────────────────────────
# TEST C: Mid-promotion failure inside split-root sync -> full rollback
# ──────────────────────────────────────────────────────────────────────────────
echo "[TEST C] mid-promotion split-root failure rolls back primary + all split roots atomically"
populate_baseline_html_root
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_c_before.json"

rc_c=0
ARIF_SITES_FAIL_AFTER_SPLIT_DIR="world" \
  run_deploy arif-fazil.com --apply --commit "$COMMIT_V3" >"$TMP/rc_c.out" 2>"$TMP/rc_c.err" || rc_c=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_c_after.json"
receipt_c="$(latest_receipt)"
status_c="$(jq -r '.status' "$receipt_c")"
rb_ok_c="$(jq -r '.rollback.ok' "$receipt_c")"
if ((rc_c != 0)) && [[ "$status_c" == "rolled_back" && "$rb_ok_c" == "true" ]] \
  && "$HELPER_PY" compare "$TMP/snap_c_before.json" "$TMP/snap_c_after.json"; then
  record_case "TEST_C" "PASS" "failure after 'world' split-root rolled back primary+earth+words+world+symlinks+modes+owner byte-identically"
else
  record_case "TEST_C" "FAIL" "mid-split failure left drift (rc=$rc_c status=$status_c rb_ok=$rb_ok_c)"
fi

# ──────────────────────────────────────────────────────────────────────────────
# TEST D: Post-promotion verifier/probe failures -> full rollback (files, symlinks, modes, owner)
# ──────────────────────────────────────────────────────────────────────────────
echo "[TEST D] post-promotion probe & soft200 failures trigger full rollback across all roots"
populate_baseline_html_root
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_d_before.json"

touch "$HTTP_CTRL/force_probe_503"
rc_d1=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V3" >/dev/null 2>"$TMP/rc_d1.err" || rc_d1=$?
rm -f "$HTTP_CTRL/force_probe_503"
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_d1_after.json"
receipt_d1="$(latest_receipt)"
if ((rc_d1 != 0)) && [[ "$(jq -r '.status' "$receipt_d1")" == "rolled_back" ]] \
  && "$HELPER_PY" compare "$TMP/snap_d_before.json" "$TMP/snap_d1_after.json"; then
  record_case "TEST_D1" "PASS" "post-deploy HTTP 503 probe rolled back all serving roots byte-identically (incl. symlinks, 0640 mode, www-data owner)"
else
  record_case "TEST_D1" "FAIL" "HTTP 503 post-deploy rollback failed parity check"
fi

touch "$HTTP_CTRL/force_soft200"
rc_d2=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V3" >/dev/null 2>"$TMP/rc_d2.err" || rc_d2=$?
rm -f "$HTTP_CTRL/force_soft200"
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_d2_after.json"
receipt_d2="$(latest_receipt)"
if ((rc_d2 != 0)) && [[ "$(jq -r '.status' "$receipt_d2")" == "rolled_back" ]] \
  && "$HELPER_PY" compare "$TMP/snap_d_before.json" "$TMP/snap_d2_after.json"; then
  record_case "TEST_D2" "PASS" "post-deploy live.soft200_guard failure rolled back all serving roots byte-identically"
else
  record_case "TEST_D2" "FAIL" "soft200 rollback failed parity check"
fi

# Save TEST D2's manifest & pre-mutation snapshot for TEST G immediately (without re-populating)
MANIFEST_FOR_G="$(jq -r '.mutation_manifest.path' "$receipt_d2")"
SNAPSHOT_FOR_G="$(jq -r '.mutation_manifest.snapshot_dir' "$receipt_d2")"

echo "[TEST G] rollback idempotency and visible failure on non-restorable target (immediately post-D2)"
if [[ -z "$MANIFEST_FOR_G" || "$MANIFEST_FOR_G" == "null" || ! -f "$MANIFEST_FOR_G" ]]; then
  record_case "TEST_G1" "FAIL" "missing manifest from TEST D2 ($MANIFEST_FOR_G)"
  record_case "TEST_G2" "FAIL" "skipped due to missing manifest from TEST D2"
else
  rb_g1_out="$TMP/rb_g1.json"
  rb_g2_out="$TMP/rb_g2.json"
  if python3 "$REAL_REPO/scripts/lib/mutation-manifest.py" rollback --manifest "$MANIFEST_FOR_G" --result "$rb_g1_out" >/dev/null \
    && python3 "$REAL_REPO/scripts/lib/mutation-manifest.py" rollback --manifest "$MANIFEST_FOR_G" --result "$rb_g2_out" >/dev/null; then
    clean_2="$(jq -r '.already_clean' "$rb_g2_out")"
    fail_2="$(jq -r '.failed' "$rb_g2_out")"
    "$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_g_after.json"
    if [[ "$fail_2" == "0" ]] && ((clean_2 > 0)) && "$HELPER_PY" compare "$TMP/snap_d_before.json" "$TMP/snap_g_after.json"; then
      record_case "TEST_G1" "PASS" "second rollback is idempotent (failed=0, already_clean=$clean_2) and roots remain byte-identical"
    else
      record_case "TEST_G1" "FAIL" "idempotent rollback reported drift (failed=$fail_2, already_clean=$clean_2)"
    fi
  else
    record_case "TEST_G1" "FAIL" "repeated rollback failed unexpectedly"
  fi

  # G2: Corrupt a snapshot binary to prove non-restorable condition fails loudly & writes per-target failed status
  first_snap="$(find "$SNAPSHOT_FOR_G/items" -name '*.bin' | sort | head -1)"
  rm -f "$first_snap"
  printf 'tampered-for-g2\n' >"$HTML_ROOT/arif/index.html"
  rb_g3_out="$TMP/rb_g3.json"
  rc_g2=0
  python3 "$REAL_REPO/scripts/lib/mutation-manifest.py" rollback --manifest "$MANIFEST_FOR_G" --result "$rb_g3_out" >/dev/null 2>&1 || rc_g2=$?
  g2_failed="$(jq -r '.failed' "$rb_g3_out")"
  if ((rc_g2 != 0)) && ((g2_failed >= 1)); then
    record_case "TEST_G2" "PASS" "un-restorable target failed visibly (exit=$rc_g2, failed=$g2_failed, per-target failure logged)"
  else
    record_case "TEST_G2" "FAIL" "un-restorable target did not fail visibly (rc=$rc_g2, failed=$g2_failed)"
  fi
fi

# ──────────────────────────────────────────────────────────────────────────────
# TEST E: Dirty tree rejection + exact commit isolation (+ real Amodei repo check)
# ──────────────────────────────────────────────────────────────────────────────
echo "[TEST E] dirty working tree & untracked files never enter candidate build"
populate_baseline_html_root
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_e_before.json"

# Introduce uncommitted modification and untracked file in fixture repo
printf '<!doctype html><html><head><title>DIRTY</title></head><body>DIRTY_UNCOMMITTED_SENTINEL</body></html>\n' >"$SITE_SRC/public/human/index.html"
printf '<!doctype html><html><body>ROGUE_UNTRACKED_FILE</body></html>\n' >"$SITE_SRC/public/rogue-untracked.html"

rc_e1=0
run_deploy arif-fazil.com --apply >/dev/null 2>&1 || rc_e1=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_e1_after.json"
if ((rc_e1 != 0)) && "$HELPER_PY" compare "$TMP/snap_e_before.json" "$TMP/snap_e1_after.json"; then
  record_case "TEST_E1" "PASS" "implicit deploy on dirty repo refused pre-mutation"
else
  record_case "TEST_E1" "FAIL" "dirty working tree allowed implicit deploy"
fi

rc_e2=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --authorized-commit "$COMMIT_V3" >/dev/null 2>&1 || rc_e2=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_e2_after.json"
if ((rc_e2 != 0)) && "$HELPER_PY" compare "$TMP/snap_e_before.json" "$TMP/snap_e2_after.json"; then
  record_case "TEST_E2" "PASS" "mismatched --commit vs --authorized-commit rejected pre-mutation"
else
  record_case "TEST_E2" "FAIL" "commit mismatch not rejected"
fi

# Exact --commit bypasses dirty working files safely via git archive
if receipt_e3="$(run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --authorized-commit "$COMMIT_V2" 2>"$TMP/e3.err")"; then
  if ! grep -Fq "DIRTY_UNCOMMITTED_SENTINEL" "$HTML_ROOT/human/index.html" \
    && ! grep -Fq "DIRTY_UNCOMMITTED_SENTINEL" "$HTML_ROOT/arif/human/index.html" \
    && grep -Fq "human V2" "$HTML_ROOT/human/index.html" \
    && [[ ! -e "$HTML_ROOT/arif/rogue-untracked.html" ]] \
    && grep -Fq "DIRTY_UNCOMMITTED_SENTINEL" "$SITE_SRC/public/human/index.html"; then
    record_case "TEST_E3" "PASS" "explicit --commit V2 built clean commit only, excluded dirty human edit & rogue untracked file, preserved workspace diff (receipt=$receipt_e3)"
  else
    record_case "TEST_E3" "FAIL" "dirty or untracked source leaked into build or workspace was altered"
  fi
else
  record_case "TEST_E3" "FAIL" "explicit clean commit deploy failed on dirty checkout: $(cat "$TMP/e3.err")"
fi

# Undeclared external input rejected
mkdir -p "$TMP/bad_ext/public/rogue"
printf 'rogue external\n' >"$TMP/bad_ext/public/rogue/secret.json"
rc_e4=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --external-inputs "$TMP/bad_ext" >/dev/null 2>&1 || rc_e4=$?
if ((rc_e4 != 0)); then
  record_case "TEST_E4" "PASS" "undeclared external input file rejected fail-closed"
else
  record_case "TEST_E4" "FAIL" "undeclared external input was accepted"
fi

# Real dirty primary repo read-only isolation proof (Amodei essays.json HOLD verification)
if [[ -d "$PRIMARY_REPO/.git" && -f "$PRIMARY_REPO/$PRIMARY_ESSAYS_REL" ]]; then
  essays_sha_before="$(sha256sum "$PRIMARY_REPO/$PRIMARY_ESSAYS_REL" | awk '{print $1}')"
  rc_e5_imp=0
  python3 "$REAL_REPO/scripts/lib/materialize-source.py" inspect \
    --repo-root "$PRIMARY_REPO" --source-rel "sites/arif-fazil.com" --site "arif-fazil.com" \
    --external-manifest "$REAL_REPO/infra/external-inputs.json" >/dev/null 2>&1 || rc_e5_imp=$?
  real_mat="$TMP/real_amodei_mat"
  python3 "$REAL_REPO/scripts/lib/materialize-source.py" materialize \
    --repo-root "$PRIMARY_REPO" --source-rel "sites/arif-fazil.com" --site "arif-fazil.com" \
    --dest-dir "$real_mat" --commit "origin/main" --explicit-commit \
    --external-manifest "$REAL_REPO/infra/external-inputs.json" >/dev/null
  essays_sha_after="$(sha256sum "$PRIMARY_REPO/$PRIMARY_ESSAYS_REL" | awk '{print $1}')"
  mat_seal="$(jq -r '.essays[] | select(.slug=="amodei-flight-recorder" or .slug=="dario-amodei-pentagon-flight-recorder" or .id=="amodei-flight-recorder") | .seal' "$real_mat/$PRIMARY_ESSAYS_REL" 2>/dev/null || jq -r '[.. | objects | select(.title? and (.title | test("Amodei"; "i"))) | .seal][0]' "$real_mat/$PRIMARY_ESSAYS_REL")"
  if ((rc_e5_imp != 0)) && [[ "$essays_sha_before" == "$essays_sha_after" && "$mat_seal" != "999" ]]; then
    record_case "TEST_E5" "PASS" "primary dirty checkout fails without --commit; origin/main materialization excludes dirty essays.json seal='999' (seal=$mat_seal) and leaves primary untouched ($essays_sha_after)"
  else
    record_case "TEST_E5" "FAIL" "Amodei contamination or primary mutation (rc_imp=$rc_e5_imp mat_seal=$mat_seal)"
  fi
fi

# Reset fixture repo working tree to clean V2 for subsequent tests
git -C "$REPO" reset --hard -q "$COMMIT_V2"
git -C "$REPO" clean -fdq

# ──────────────────────────────────────────────────────────────────────────────
# TEST F: Manifest containment & symlink escape rejection BEFORE mutation
# ──────────────────────────────────────────────────────────────────────────────
echo "[TEST F] forbidden target roots & symlink escapes rejected pre-mutation"
populate_baseline_html_root
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_f_before.json"

cat >"$TMP/f_var_arifos.json" <<'JSON'
[{"target": "/var/www/html/arifos/evil.html"}]
JSON
rc_f1=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --extra-manifest-targets "$TMP/f_var_arifos.json" >/dev/null 2>&1 || rc_f1=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_f1_after.json"
receipt_f1="$(latest_receipt)"
gate_f1="$(jq -r '.gates[] | select(.gate_id=="manifest.containment") | .outcome' "${receipt_f1:-/dev/null}" 2>/dev/null || echo missing)"
if ((rc_f1 != 0)) && [[ "$gate_f1" == "fail" ]] && "$HELPER_PY" compare "$TMP/snap_f_before.json" "$TMP/snap_f1_after.json"; then
  record_case "TEST_F1" "PASS" "/var/www/html/arifos rejected pre-mutation (manifest.containment=fail); roots byte-identical"
else
  record_case "TEST_F1" "FAIL" "/var/www/html/arifos not rejected at manifest.containment (rc=$rc_f1 gate=$gate_f1)"
fi

cat >"$TMP/f_var_arif_arifos.json" <<'JSON'
[{"target": "/var/www/html/arif/arifos/evil.html"}]
JSON
rc_f2=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --extra-manifest-targets "$TMP/f_var_arif_arifos.json" >/dev/null 2>&1 || rc_f2=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_f2_after.json"
receipt_f2="$(latest_receipt)"
gate_f2="$(jq -r '.gates[] | select(.gate_id=="manifest.containment") | .outcome' "${receipt_f2:-/dev/null}" 2>/dev/null || echo missing)"
if ((rc_f2 != 0)) && [[ "$gate_f2" == "fail" ]] && "$HELPER_PY" compare "$TMP/snap_f_before.json" "$TMP/snap_f2_after.json"; then
  record_case "TEST_F2" "PASS" "/var/www/html/arif/arifos rejected pre-mutation (manifest.containment=fail); roots byte-identical"
else
  record_case "TEST_F2" "FAIL" "/var/www/html/arif/arifos not rejected at manifest.containment (rc=$rc_f2 gate=$gate_f2)"
fi

cat >"$TMP/f_unrelated.json" <<JSON
[{"target": "$HTML_ROOT/unrelated-domain/pwned.html"}]
JSON
rc_f3=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --extra-manifest-targets "$TMP/f_unrelated.json" >/dev/null 2>&1 || rc_f3=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_f3_after.json"
receipt_f3="$(latest_receipt)"
gate_f3="$(jq -r '.gates[] | select(.gate_id=="manifest.containment") | .outcome' "${receipt_f3:-/dev/null}" 2>/dev/null || echo missing)"
if ((rc_f3 != 0)) && [[ "$gate_f3" == "fail" ]] && "$HELPER_PY" compare "$TMP/snap_f_before.json" "$TMP/snap_f3_after.json"; then
  record_case "TEST_F3" "PASS" "unrelated domain target rejected pre-mutation (manifest.containment=fail); roots byte-identical"
else
  record_case "TEST_F3" "FAIL" "unrelated domain target not rejected at manifest.containment (rc=$rc_f3 gate=$gate_f3)"
fi

# Ancestor symlink escape inside fixture serving root
mkdir -p "$TMP/outside_secret"
printf 'secret-outside\n' >"$TMP/outside_secret/key.txt"
ln -s "$TMP/outside_secret" "$HTML_ROOT/words/escape"
cat >"$TMP/f_sym_ancestor.json" <<JSON
[{"target": "$HTML_ROOT/words/escape/overwrite.html"}]
JSON
rc_f4=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --extra-manifest-targets "$TMP/f_sym_ancestor.json" >/dev/null 2>&1 || rc_f4=$?
rm -f "$HTML_ROOT/words/escape"
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_f4_after.json"
receipt_f4="$(latest_receipt)"
gate_f4="$(jq -r '.gates[] | select(.gate_id=="manifest.containment") | .outcome' "${receipt_f4:-/dev/null}" 2>/dev/null || echo missing)"
if ((rc_f4 != 0)) && [[ "$gate_f4" == "fail" ]] && "$HELPER_PY" compare "$TMP/snap_f_before.json" "$TMP/snap_f4_after.json" && [[ ! -e "$TMP/outside_secret/overwrite.html" ]]; then
  record_case "TEST_F4" "PASS" "ancestor symlink escape rejected pre-mutation (manifest.containment=fail); outside dir untouched"
else
  record_case "TEST_F4" "FAIL" "ancestor symlink escape not rejected at manifest.containment (rc=$rc_f4 gate=$gate_f4)"
fi

# Candidate symlink escaping outside approved roots
cat >"$TMP/f_sym_cand.json" <<JSON
[{"target": "$HTML_ROOT/human/badlink.html", "symlink_target": "../../arifos/index.html"}]
JSON
rc_f5=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V2" --extra-manifest-targets "$TMP/f_sym_cand.json" >/dev/null 2>&1 || rc_f5=$?
receipt_f5="$(latest_receipt)"
gate_f5="$(jq -r '.gates[] | select(.gate_id=="manifest.containment") | .outcome' "${receipt_f5:-/dev/null}" 2>/dev/null || echo missing)"
if ((rc_f5 != 0)) && [[ "$gate_f5" == "fail" ]]; then
  record_case "TEST_F5" "PASS" "candidate symlink escaping into forbidden arifos root rejected pre-mutation (manifest.containment=fail)"
else
  record_case "TEST_F5" "FAIL" "escaping candidate symlink not rejected at manifest.containment (rc=$rc_f5 gate=$gate_f5)"
fi

# (TEST G already verified idempotent & partial-failure rollback immediately post-TEST_D2)

# ──────────────────────────────────────────────────────────────────────────────
# TEST H: Broken /assets/* reference caught pre-mutation (or post-verify parity)
# ──────────────────────────────────────────────────────────────────────────────
echo "[TEST H] broken asset reference blocked before any root mutation"
populate_baseline_html_root
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_h_before.json"

rc_h=0
run_deploy arif-fazil.com --apply --commit "$COMMIT_V_BAD_ASSET" >/dev/null 2>"$TMP/rc_h.err" || rc_h=$?
"$HELPER_PY" snapshot "$HTML_ROOT" "$TMP/snap_h_after.json"
receipt_h="$(latest_receipt)"
gate_h_outcome="$(jq -r '.gates[] | select(.gate_id=="candidate.asset_references") | .outcome' "$receipt_h")"
if ((rc_h != 0)) && [[ "$gate_h_outcome" == "fail" ]] \
  && "$HELPER_PY" compare "$TMP/snap_h_before.json" "$TMP/snap_h_after.json"; then
  record_case "TEST_H" "PASS" "broken /assets/missing-does-not-exist.css blocked pre-mutation (candidate.asset_references=fail); roots byte-identical"
else
  record_case "TEST_H" "FAIL" "broken asset ref was not caught cleanly (rc=$rc_h, outcome=$gate_h_outcome)"
fi

if [[ -n "$REPORT_JSON" ]]; then
  mkdir -p "$(dirname "$REPORT_JSON")"
  jq -s --argjson pass "$PASS" --argjson fail "$FAIL" \
    '{schema:"arif-sites.containment-test-report.v1", pass:$pass, fail:$fail, cases:.}' \
    "$RESULTS_NDJSON" >"$REPORT_JSON"
fi

echo ""
echo "Summary: PASS=$PASS FAIL=$FAIL"
(( FAIL == 0 ))
