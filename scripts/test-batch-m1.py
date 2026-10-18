#!/usr/bin/env python3
"""
test-batch-m1.py — Focused Unit / Contract Tests for Batch M1 Mechanical Fixes

Defects tested:
1. MakcikGptArticle.tsx must contain id="main-content"
2. public/earth/index.html and _legacy-globe must NOT contain literal '<a class="go" href="${esc(s.link)}">'
3. Constitution, Charter, Governance pages must NOT link to retired /audit/ (HTTP 410)
"""

import os
import sys

SITE_ROOT = "/root/arif-fazil.com/sites/arif-fazil.com"

def test_makcikgpt_main_content():
    path = os.path.join(SITE_ROOT, "src/pages/MakcikGptArticle.tsx")
    with open(path) as f:
        content = f.read()
    if 'id="main-content"' in content:
        return True, "MakcikGptArticle.tsx has id='main-content'"
    return False, "MakcikGptArticle.tsx missing id='main-content'"

def test_earth_esc_link():
    paths = [
        os.path.join(SITE_ROOT, "public/earth/index.html"),
        os.path.join(SITE_ROOT, "public/earth/_legacy-globe/index.html")
    ]
    for p in paths:
        with open(p) as f:
            content = f.read()
        if '<a class="go" href="${esc(s.link)}">' in content:
            return False, f"Literal '<a class=\"go\" href=\"${{esc(s.link)}}\">' found in {os.path.basename(p)}"
    return True, "No literal '${esc(s.link)}' in anchor href in earth templates"

def test_no_audit_410_links():
    paths = [
        os.path.join(SITE_ROOT, "public/constitution/index.html"),
        os.path.join(SITE_ROOT, "public/words/constitution/index.html"),
        os.path.join(SITE_ROOT, "public/charter/index.html"),
        os.path.join(SITE_ROOT, "public/governance/index.html")
    ]
    for p in paths:
        with open(p) as f:
            content = f.read()
        if 'href="/audit/"' in content or 'href="/audit"' in content:
            return False, f"Dead link to retired 410 /audit/ found in {os.path.basename(p)}"
    return True, "No links to retired 410 /audit/ in constitution/charter/governance pages"

def main():
    print("Running Batch M1 focused defect verification...")
    tests = [
        ("M1.1 MakcikGPT id='main-content'", test_makcikgpt_main_content),
        ("M1.2 Earth template literal esc(s.link)", test_earth_esc_link),
        ("M1.3 Retired /audit/ 410 link removal", test_no_audit_410_links),
    ]

    all_passed = True
    for name, fn in tests:
        passed, msg = fn()
        status = "[PASS]" if passed else "[FAIL]"
        print(f"  {status} {name}: {msg}")
        if not passed:
            all_passed = False

    if all_passed:
        print("\nAll Batch M1 contracts PASS.")
        sys.exit(0)
    else:
        print("\nBatch M1 contracts FAILED (defects reproduced).")
        sys.exit(1)

if __name__ == "__main__":
    main()
