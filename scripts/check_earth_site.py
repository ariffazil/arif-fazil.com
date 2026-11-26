#!/usr/bin/env python3
"""CI verification for arif-fazil.com/earth (label-range, forbidden strings, SVG XML, footer, links)."""
from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path("/root/arif-fazil.com/sites/arif-fazil.com/public/earth")
KIN = ROOT / "kinabalu-cross-section.html"
LIFE = ROOT / "lifecycle" / "index.html"

FORBIDDEN = [
    r"\bPekaka\b", r"\bBuluh\b", r"\bRotan\b", r"\bBunga\s+Lili\b", r"\bMaligan\b",
    r"\bBarton\b", r"\bSugut\b", r"\bSolisip\b", r"\bTepat\b", r"\bLimbayong\b",
    r"PETRONAS\s+well", r"\bOpenWorks\b", r"\bKL2\b", r"\bBlock\s+H\b",
    r"[UP]:\\", r"DSGLINK", r"E5_KB_",
]


def main() -> int:
    errors: list[str] = []

    for page in (KIN, LIFE):
        if not page.exists():
            errors.append(f"MISSING: {page}")
            continue
        txt = page.read_text(encoding="utf-8")
        # 1. Forbidden-string scan
        for pat in FORBIDDEN:
            if re.search(pat, txt, flags=re.I):
                errors.append(f"FORBIDDEN_MATCH ({pat}) in {page.name}")
        # 2. Footer build metadata check
        for req in ("Build SHA:", "Build date:", "Last audited:"):
            if req not in txt:
                errors.append(f"MISSING_FOOTER_FIELD ({req}) in {page.name}")

    # 3. Label-range check [0, 832.84] on kinabalu-cross-section.html
    kin_txt = KIN.read_text(encoding="utf-8")
    # Strip <style> and <script> before checking visible km labels
    body = re.sub(r"<(style|script)\b[^>]*>.*?</\1>", "", kin_txt, flags=re.S | re.I)
    # Check domain chainage labels like "(0–242 km)" or "715.6–832.8 km"
    for m in re.finditer(r"(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*km", body):
        lo, hi = float(m.group(1)), float(m.group(2))
        if lo < 0 or hi > 833.0:
            errors.append(f"KM_RANGE_OUT_OF_BOUNDS: {m.group(0)}")
    for bad in ("15.5–14.2 Ma", "230–540 km", "230 to 540", "Crocker about 60 km", "1454 km"):
        if bad in kin_txt:
            errors.append(f"REGRESSION_STRING: {bad}")

    # 4. SVG XML validity + alt/title accessibility
    svgs = re.findall(r"<svg\b[^>]*>.*?</svg>", kin_txt, flags=re.S)
    if len(svgs) != 4:
        errors.append(f"EXPECTED_4_SVGS got {len(svgs)}")
    for i, s in enumerate(svgs, 1):
        try:
            ET.fromstring(s)
        except ET.ParseError as exc:
            errors.append(f"SVG_{i}_XML_ERROR: {exc}")
        if "<title" not in s or "<desc" not in s:
            errors.append(f"SVG_{i}_MISSING_A11Y_TITLE_OR_DESC")

    # 5. Internal /earth/ link check (excluding root /earth/ SPA index)
    for page in (KIN, LIFE):
        txt = page.read_text(encoding="utf-8")
        for href in re.findall(r'href="(/earth/[^"#?]+)"', txt):
            rel = href.removeprefix("/earth/")
            if not rel:
                continue
            target = ROOT / rel
            if not (target.exists() or (target / "index.html").exists()):
                # Check /var/www/html/earth fallback for static pages built elsewhere
                if not (Path("/var/www/html/earth") / rel).exists():
                    errors.append(f"BROKEN_LINK ({href}) in {page.name}")

    if errors:
        print("CI_FAIL:")
        for e in errors:
            print("  -", e)
        return 1
    print("CI_PASS: forbidden_scan=0, km_range=[0..832.84] OK, svgs=4/4 XML+a11y OK, footers=OK, links=OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
