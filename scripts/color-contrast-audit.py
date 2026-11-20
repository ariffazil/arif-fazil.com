#!/usr/bin/env python3
"""WCAG 2.1 contrast audit for arif-fazil.com functional color tokens.

Reads token values directly from the design-system files so the audit can
never drift from the files. Exit 0 = every text-consumed accent passes its
threshold on every background; exit 1 = at least one FAIL.
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
FILES = {
    "shared": REPO / "sites/shared/design-system/tokens.css",
    "site": REPO / "sites/arif-fazil.com/public/_shared/design-system/tokens.css",
    "organ": REPO / "sites/arif-fazil.com/public/arifos/_shared/design-system/tokens.css",
}
BACKGROUNDS = {"#0A0B0D": "homepage/site", "#1A0A0A": "soul", "#12121A": "organ"}
TEXT_TOKENS = {
    "shared": ["--state-danger", "--state-pending", "--state-hold",
               "--state-operational", "--state-info", "--state-void"],
    "organ": ["--color-verdict-seal", "--color-verdict-partial",
              "--color-verdict-hold", "--color-verdict-void",
              "--color-verdict-sabar", "--color-verdict-unknown"],
}
REPORT_TOKENS = ["--soul-primary", "--soul-secondary", "--soul-accent"]
THRESHOLD = 4.5


def rel_lum(hexcolor: str) -> float:
    h = hexcolor.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(fg: str, bg: str) -> float:
    la, lb = sorted((rel_lum(fg), rel_lum(bg)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def parse_tokens(path: Path) -> dict:
    out = {}
    if not path.exists():
        return out
    for m in re.finditer(r"^\s*(--[a-z-]+)\s*:\s*(#[0-9A-Fa-f]{6})\b",
                         path.read_text(errors="replace"), re.M):
        out.setdefault(m.group(1), m.group(2).upper())
    return out


def main() -> int:
    toks = {k: parse_tokens(p) for k, p in FILES.items()}
    rows, failed = [], False
    for scope, names in TEXT_TOKENS.items():
        for name in names:
            hexv = toks[scope].get(name)
            if hexv is None:
                rows.append((f"{scope}:{name}", "MISSING", "-", "-", THRESHOLD, "FAIL"))
                failed = True
                continue
            for bg, bgname in BACKGROUNDS.items():
                ratio = contrast(hexv, bg)
                ok = ratio >= THRESHOLD
                failed |= not ok
                rows.append((f"{scope}:{name}", hexv, bgname, f"{ratio:.2f}", THRESHOLD,
                             "PASS" if ok else "FAIL"))
    for name in REPORT_TOKENS:
        hexv = toks["shared"].get(name)
        if hexv is None:
            continue
        ratios = [contrast(hexv, b) for b in BACKGROUNDS]
        rows.append((f"shared:{name}", hexv, "all", f"min {min(ratios):.2f}", "REPORT", "REPORT"))
    # Badge pairs: colored background + foreground text (from tokens.css badge rules)
    danger = toks["shared"].get("--state-danger", "#D50000")
    void = toks["shared"].get("--state-void", "#616161")
    badges = [("#00C853", "#000", "badge-seal"), ("#FFD600", "#000", "badge-sabar"),
              ("#FF9500", "#000", "badge-hold"), (void, "#000", "badge-void"),
              (danger, "#000", "badge-breach")]  # fg values mirror the CSS (AA fix 2026-11-21)
    for bg, fg, label in badges:
        ratio = contrast(fg, bg)
        ok = ratio >= THRESHOLD
        failed |= not ok
        rows.append((f"badge:{label}", f"{fg} on {bg}", "-", f"{ratio:.2f}", THRESHOLD,
                     "PASS" if ok else "FAIL"))
    w = max(len(r[0]) for r in rows)
    print(f"{'token':<{w}}  hex      background    ratio  thr    verdict")
    for t, hx, bg, ratio, thr, v in rows:
        print(f"{t:<{w}}  {hx:<8} {bg:<12} {ratio:>5}  {thr!s:<5}  {v}")
    print(f"\n{len(rows)} rows examined; exit {'1 (FAIL)' if failed else '0 (PASS)'}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
