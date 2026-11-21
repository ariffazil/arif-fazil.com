#!/usr/bin/env python3
"""P0-2b test — the deploying site may write into its OWN webroot; nobody else's.

Two-sided proof (read-only; touches no production file):
  CASE-OWN-ROOT   webroot=/var/www/html/arifos -> target under it is ALLOWED
  CASE-OTHER-SITE webroot=/var/www/html/arif    -> target under arifos is REJECTED
  CASE-SIBLING     webroot=/var/www/html/aaa     -> target under arifos is REJECTED

Run: python3 tests/test-deploy-containment-owner-webroot.py
"""
import importlib.util
import os
import sys
from pathlib import Path

LIB = Path(os.environ.get(
    "MM_LIB",
    str(Path(__file__).resolve().parents[1] / "scripts" / "lib" / "mutation-manifest.py"),
))
spec = importlib.util.spec_from_file_location("mutation_manifest", LIB)
mm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mm)

HTML_ROOT = Path("/var/www/html")
ARIFOS = Path("/var/www/html/arifos")
TARGET = Path("/var/www/html/arifos/index.html")

results = []


def case(cid, should_pass, webroot, target, note):
    try:
        mm.check_target_allowed(
            target,
            HTML_ROOT,
            Path("/var/www/html"),
            [webroot],          # approved_dirs[0] == the deploying site's own webroot
            [],
        )
        outcome = "ALLOWED"
        ok = should_pass
    except ValueError as e:
        outcome = f"REJECTED ({e})"
        ok = not should_pass
    results.append(ok)
    verdict = "PASS" if ok else "FAIL"
    print(f"  {verdict} [{cid}]: {outcome} — {note}")
    return ok


print("P0-2b — own-webroot scoping of the mutation-manifest forbidden roots")
case("CASE-OWN-ROOT", True, ARIFOS, TARGET,
     "the arifos site (owner arif-sites) may write into its own webroot")
case("CASE-OTHER-SITE", False, Path("/var/www/html/arif"), TARGET,
     "the main arif site is still blocked from writing into /var/www/html/arifos")
case("CASE-SIBLING", False, Path("/var/www/html/aaa"), TARGET,
     "a sibling site is still blocked from writing into /var/www/html/arifos")

# The sibling-root protection must also survive for the mirror path.
try:
    mm.check_target_allowed(
        Path("/var/www/html/arif/arifos/index.html"),
        HTML_ROOT,
        Path("/var/www/html"),
        [Path("/var/www/html/arif")],
        [],
    )
    results.append(False)
    print("  FAIL [CASE-MIRROR]: ALLOWED — the arif/arifos mirror must stay forbidden")
except ValueError as e:
    results.append(True)
    print(f"  PASS [CASE-MIRROR]: REJECTED ({str(e)[:80]}) — the arif/arifos mirror stays forbidden")

total = len(results)
passed = sum(1 for r in results if r)
print(f"\n{passed}/{total} cases PASS")
sys.exit(0 if passed == total else 1)
