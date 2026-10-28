#!/usr/bin/python3
"""LIVE_OWNERSHIP_PRESERVATION gate — fail-closed pre-deploy check.

Answers one question: if source is rsync'd over the webroot with only the
registry's preserve-live overlays excluded, which live artifacts disappear?

Every live-only artifact is classified:
  preserve_live_retained  — covered by an overlay path (kept by the deploy)
  regenerated_at_deploy   — listed in site.deploy_generated (deploy rewrites it)
  would_delete_obsolete   — matches site.obsolete_patterns (stale backups)
  would_delete_known      — source-owned class that is NOT in source (a real loss)
  would_delete_unknown    — no rule explains it (never safe to delete)

PASS  (exit 0): would_delete_known == 0 and would_delete_unknown == 0
FAIL  (exit 1): anything else, or the registry/site cannot be resolved

Usage:
  deploy-ownership-gate.py --registry infra/runtime-overlays.json --site wealth
                           [--repo-root DIR] [--html-root DIR] [--json]

Read-only. Never mutates source, webroot, or registry.
"""
from __future__ import annotations

import argparse
import fnmatch
import hashlib
import json
import os
import sys


def sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def walk(root: str) -> dict[str, str]:
    """Return {relative_path: abs_path} for regular files AND symlinks under root.

    Symlinks are included deliberately: a webroot can be a symlink farm into live
    runtime state (e.g. /var/www/html/aaa/index.html -> /root/AAA/state/*.html).
    rsync -a --delete replaces a symlink with a regular file or removes it, so an
    unnoticed symlink is a silent functional regression. Skipping them would be a
    gate blind spot.
    """
    out: dict[str, str] = {}
    if not os.path.isdir(root):
        return out
    for dirpath, _dirnames, filenames in os.walk(root):
        for name in filenames:
            abs_path = os.path.join(dirpath, name)
            if not (os.path.isfile(abs_path) or os.path.islink(abs_path)):
                continue
            rel = os.path.relpath(abs_path, root).replace(os.sep, "/")
            out[rel] = abs_path
    return out


def is_symlink(path: str) -> bool:
    return os.path.islink(path)


def covered_by_overlay(rel: str, overlays: list[str]) -> str | None:
    """rsync --exclude semantics: exact path or anything under it."""
    for ov in overlays:
        if rel == ov or rel.startswith(ov + "/"):
            return ov
    return None


def matches_any(rel: str, patterns: list[str]) -> bool:
    base = rel.rsplit("/", 1)[-1]
    return any(fnmatch.fnmatch(rel, p) or fnmatch.fnmatch(base, p) for p in patterns)


def main() -> int:
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument("--registry", required=True)
    ap.add_argument("--site", required=True)
    ap.add_argument("--repo-root", default=None)
    ap.add_argument("--html-root", default="/var/www/html")
    ap.add_argument("--json", action="store_true", help="emit machine-readable JSON only")
    args = ap.parse_args()

    if not os.path.isfile(args.registry):
        print(f"HOLD: registry not found: {args.registry}", file=sys.stderr)
        return 1
    with open(args.registry, encoding="utf-8") as f:
        reg = json.load(f)

    entry = next((s for s in reg.get("sites", []) if s.get("site") == args.site), None)
    if entry is None:
        print(f"HOLD: site '{args.site}' not in registry", file=sys.stderr)
        return 1

    repo_root = args.repo_root or reg.get("canonical_repo_root") or os.getcwd()
    repo_root = os.path.abspath(repo_root)
    source_dir = os.path.join(repo_root, entry["source"])
    webroot = os.path.join(args.html_root, entry["webroot"])

    overlays = [o["path"] for o in entry.get("overlays", [])]
    obsolete = entry.get("obsolete_patterns", [])
    generated = entry.get("deploy_generated", [])

    if not os.path.isdir(source_dir):
        print(f"HOLD: source dir missing: {source_dir}", file=sys.stderr)
        return 1
    if not os.path.isdir(webroot):
        print(f"HOLD: webroot missing: {webroot}", file=sys.stderr)
        return 1

    src = walk(source_dir)
    live = walk(webroot)

    preserve_live_retained: list[dict] = []
    regenerated: list[str] = []
    would_delete_obsolete: list[str] = []
    would_delete_known: list[str] = []
    would_delete_unknown: list[str] = []

    for rel in sorted(set(live) - set(src)):
        ov = covered_by_overlay(rel, overlays)
        if ov is not None:
            preserve_live_retained.append({"path": rel, "overlay": ov})
        elif matches_any(rel, generated):
            regenerated.append(rel)
        elif matches_any(rel, obsolete):
            would_delete_obsolete.append(rel)
        elif rel in generated:
            regenerated.append(rel)
        else:
            would_delete_unknown.append(rel)

    source_owned_added = sorted(set(src) - set(live))
    source_owned_changed = []
    type_mismatch = []
    for rel in sorted(set(src) & set(live)):
        if is_symlink(src[rel]) != is_symlink(live[rel]):
            type_mismatch.append(
                {
                    "path": rel,
                    "source_kind": "symlink" if is_symlink(src[rel]) else "file",
                    "live_kind": "symlink" if is_symlink(live[rel]) else "file",
                }
            )
        elif not is_symlink(live[rel]):
            if sha256(src[rel]) != sha256(live[rel]):
                source_owned_changed.append(rel)

    live_symlinks = sorted(
        [{"path": rel, "target": os.readlink(live[rel])} for rel in live if is_symlink(live[rel])],
        key=lambda d: d["path"],
    )

    # A live symlink replaced by a source regular file is a functional regression
    # even though no file "disappears" — fail closed on that direction.
    broken_symlinks = [t for t in type_mismatch if t["live_kind"] == "symlink"]

    ok = not would_delete_known and not would_delete_unknown and not broken_symlinks
    report = {
        "gate": "LIVE_OWNERSHIP_PRESERVATION",
        "site": args.site,
        "source": source_dir,
        "webroot": webroot,
        "overlays": overlays,
        "verdict": "PASS" if ok else "HOLD",
        "counts": {
            "source_owned_added": len(source_owned_added),
            "source_owned_changed": len(source_owned_changed),
            "preserve_live_retained": len(preserve_live_retained),
            "regenerated_at_deploy": len(regenerated),
            "would_delete_obsolete": len(would_delete_obsolete),
            "would_delete_known": len(would_delete_known),
            "would_delete_unknown": len(would_delete_unknown),
            "live_symlinks": len(live_symlinks),
            "would_break_symlink": len(broken_symlinks),
            "type_mismatch": len(type_mismatch),
        },
        "source_owned_added": source_owned_added,
        "source_owned_changed": source_owned_changed,
        "preserve_live_retained": preserve_live_retained,
        "regenerated_at_deploy": regenerated,
        "would_delete_obsolete": would_delete_obsolete,
        "would_delete_known": would_delete_known,
        "would_delete_unknown": would_delete_unknown,
        "live_symlinks": live_symlinks,
        "would_break_symlink": broken_symlinks,
        "type_mismatch": type_mismatch,
    }

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"[ownership-gate:{args.site}] {report['verdict']}")
        print(f"  source={source_dir}")
        print(f"  webroot={webroot}")
        print(f"  overlays={len(overlays)}")
        for key, val in report["counts"].items():
            print(f"  {key:24} {val}")
        for s in report["live_symlinks"]:
            print(f"  SYMLINK {s['path']} -> {s['target']}")
        for t in report["would_break_symlink"]:
            print(
                f"  BREAK[would_break_symlink] {t['path']} "
                f"(live {t['live_kind']} <-> source {t['source_kind']})"
            )
        for label in ("would_delete_known", "would_delete_unknown"):
            for rel in report[label]:
                print(f"  LOSS[{label}] {rel}")
        for label in ("would_delete_obsolete", "regenerated_at_deploy"):
            for rel in report[label]:
                print(f"  ALLOWED[{label}] {rel}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
