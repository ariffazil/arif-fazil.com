#!/usr/bin/env python3
"""P0-2c — a site may REFERENCE a DECLARED shared root; without the declaration it may not.

Drives the REAL path (plan_and_snapshot), not the helper, so the declaration is what
decides. Fixture mirrors the arifos topology exactly:
  html_root/.well-known/ai-catalog.json            <- the shared tree
  html_root/arifos/.well-known/ai-catalog.json     -> symlink into the shared tree
  html_root/arifos/index.html                     <- a normal site file
  stage/.well-known/ai-catalog.json               -> the same symlink, as the candidate
  stage/index.html                                <- the candidate page

  CASE-SHARED-DECLARED   approved_shared_roots=['.well-known'] -> plan succeeds
  CASE-SHARED-UNDECLARED no declaration                       -> ValueError (the blocker)

Read-only against production: everything lives under a temp dir.
Run: python3 tests/test-deploy-containment-shared-roots.py
"""
import importlib.util
import os
import shutil
import sys
import tempfile
from pathlib import Path

LIB = Path(os.environ.get(
    "MM_LIB",
    str(Path(__file__).resolve().parents[1] / "scripts" / "lib" / "mutation-manifest.py"),
))
spec = importlib.util.spec_from_file_location("mutation_manifest", LIB)
mm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mm)

results = []


def build_fixture(root: Path):
    html_root = root / "html"
    webroot = html_root / "arifos"
    shared = html_root / ".well-known"
    stage = root / "stage"
    for d in (webroot / ".well-known", shared, stage / ".well-known"):
        d.mkdir(parents=True, exist_ok=True)
    (shared / "ai-catalog.json").write_text('{"catalog":true}\n')
    # live symlink into the shared tree
    (webroot / ".well-known" / "ai-catalog.json").symlink_to(shared / "ai-catalog.json")
    # candidate carries the same symlink
    (stage / ".well-known" / "ai-catalog.json").symlink_to(shared / "ai-catalog.json")
    (webroot / "index.html").write_text("<html>old</html>\n")
    (stage / "index.html").write_text("<html>new</html>\n")
    return html_root, webroot, stage


def case(cid, should_pass, declared):
    root = Path(tempfile.mkdtemp(prefix="shared-roots-"))
    try:
        html_root, webroot, stage = build_fixture(root)
        try:
            mm.plan_and_snapshot(
                stage,
                html_root,
                webroot,
                False,                       # split_roots off
                root / "mutation-manifest.json",
                root / "snapshot",
                extra_targets_file=None,
                approved_shared_roots=declared,
            )
            outcome = "PLAN OK"
            ok = should_pass
        except ValueError as e:
            outcome = f"REFUSED ({str(e)[:90]})"
            ok = not should_pass
        results.append(ok)
        print(f"  {'PASS' if ok else 'FAIL'} [{cid}]: {outcome}")
    finally:
        shutil.rmtree(root, ignore_errors=True)


print("P0-2c — declared shared roots (reference-only, never mutated)")
case("CASE-SHARED-DECLARED", True, [".well-known"])
case("CASE-SHARED-UNDECLARED", False, None)

total = len(results)
passed = sum(1 for r in results if r)
print(f"\n{passed}/{total} cases PASS")
sys.exit(0 if passed == total else 1)
