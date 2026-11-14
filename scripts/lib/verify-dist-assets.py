#!/usr/bin/env python3
"""Verify every local /assets/* reference in candidate HTML resolves cleanly."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ASSET_RE = re.compile(
    r"""(?:href|src)\s*=\s*["'](/assets/[^"'?#\s]+)["']""",
    re.IGNORECASE,
)


def verify_root(dist_root: Path) -> tuple[bool, dict]:
    dist_root = dist_root.resolve()
    if not dist_root.is_dir():
        return False, {"ok": False, "error": f"dist root missing: {dist_root}", "broken": []}

    html_files = sorted(dist_root.rglob("*.html"))
    checked_refs = 0
    broken: list[dict[str, str]] = []

    for html_path in html_files:
        if html_path.is_symlink():
            continue
        text = html_path.read_text(encoding="utf-8", errors="replace")
        rel_html = html_path.relative_to(dist_root).as_posix()
        for ref in ASSET_RE.findall(text):
            checked_refs += 1
            rel_asset = ref.lstrip("/")
            candidate = (dist_root / rel_asset).resolve()
            if not str(candidate).startswith(str(dist_root) + "/"):
                broken.append({"html": rel_html, "ref": ref, "reason": "path_escape"})
            elif not candidate.is_file():
                broken.append({"html": rel_html, "ref": ref, "reason": "missing_asset"})
            elif candidate.stat().st_size == 0:
                broken.append({"html": rel_html, "ref": ref, "reason": "empty_asset"})

    report = {
        "ok": len(broken) == 0,
        "dist_root": str(dist_root),
        "html_files_checked": len(html_files),
        "asset_refs_checked": checked_refs,
        "broken_count": len(broken),
        "broken": broken[:50],
    }
    return report["ok"], report


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify local /assets/* references in HTML")
    parser.add_argument("dist_root", help="Candidate dist or serving webroot directory")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    ok, report = verify_root(Path(args.dist_root))
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(
            f"[asset-ref-gate] ok={ok} html={report.get('html_files_checked', 0)} "
            f"refs={report.get('asset_refs_checked', 0)} broken={report.get('broken_count', 0)}"
        )
        for item in report.get("broken", []):
            print(f"  BROKEN {item['html']} -> {item['ref']} ({item['reason']})", file=sys.stderr)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
