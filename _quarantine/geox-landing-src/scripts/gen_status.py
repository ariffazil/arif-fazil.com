#!/usr/bin/env python3
"""Generate src/lib/status.generated.json — the site's single status truth.

Snapshot from registry.py + a live organ probe, taken at BUILD time on the host
that can reach the organ. The UI renders it with its generated_at stamp and
points operators at /drift. CI cannot reproduce the probe; that is fine — this
file is committed as an honest, dated snapshot, regenerated whenever the
surface or runtime moves. Run: python3 scripts/gen_status.py
"""
import json, subprocess, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, "/root/GEOX/src")

def probe(url, timeout=3.0):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            return json.loads(r.read().decode())
    except Exception:
        return {}

drift = probe("http://127.0.0.1:8081/drift")
health = probe("http://127.0.0.1:8081/health")

from geox_mcp.registry import CANONICAL_PUBLIC_TOOLS, INTERNAL_TOOLS  # noqa: E402

def git(*a):
    try:
        return subprocess.check_output(["git", *a], cwd="/root/GEOX", text=True).strip()[:8]
    except Exception:
        return "unknown"

out = {
    "canonical": len(CANONICAL_PUBLIC_TOOLS),
    "live": drift.get("live_count"),
    "drift_ok": drift.get("ok"),
    "runtime_commit": (health.get("git_version") or "").replace("geox-", "") or None,
    "main_head": git("rev-parse", "--short", "main"),
    "internal": len(INTERNAL_TOOLS),
    "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ"),
    "verify": "operators: /drift on the organ; public: this snapshot is build-time",
}
dest = ROOT / "src" / "lib" / "status.generated.json"
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(json.dumps(out, indent=1) + "\n")

# Real tool inventory for the Platform page — generated from the manifest so a
# hand-typed tile list can never resurrect dead tools (the 42-tile incident).
from geox_mcp.surface_manifest import manifest_tool_map  # noqa: E402

tools = []
for name, entry in sorted(manifest_tool_map().items()):
    if name not in set(CANONICAL_PUBLIC_TOOLS):
        continue
    gov = getattr(entry, "governance", {}) or {}
    tools.append(
        {
            "name": name,
            "desc": (getattr(entry, "description", "") or "").strip() or f"GEOX canonical tool {name}",
            "family": getattr(entry, "family", "") or "evidence",
            "tier": getattr(entry, "tier", ""),
        }
    )
(ROOT / "src" / "lib" / "tools.generated.json").write_text(json.dumps(tools, indent=1) + "\n")
print(f"tools.generated.json: {len(tools)} canonical tools")
print(json.dumps(out))
