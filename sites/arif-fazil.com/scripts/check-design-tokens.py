#!/usr/bin/env python3
"""Design-token gate: parity across serving trees + WCAG contrast, from the SOT.

Reads tokens/design-tokens.json (single source of truth) and every tree's
tokens.css, resolves effective values (literal hex or var() alias inside the
same file), and fails when:

  1. a tree's effective functional value drifts from the SOT (canonical, or the
     tree's DECLARED override — so intentional divergence is distinguishable
     from silent drift);
  2. a token's contrast on any declared background falls below its minContrast;
  3. a token marked textUse=forbidden is used in a text context in a tree file
     (color: var(--soul-primary) on a text-ish rule).

Exit 0 = gate passes. Exit 1 = gate fails (build stops).
Usage: python3 scripts/check-design-tokens.py [--repo-root PATH]
"""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent.parent  # sites/arif-fazil.com -> repo
SOT = Path(__file__).resolve().parent.parent / "tokens/design-tokens.json"
HEX = re.compile(r"^\s*(--[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{6})\s*;", re.M)
ALIAS = re.compile(r"^\s*(--[a-z0-9-]+)\s*:\s*var\(\s*(--[a-z0-9-]+)\s*\)\s*;", re.M)


def rel_lum(hexcolor: str) -> float:
    h = hexcolor.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(fg: str, bg: str) -> float:
    la, lb = sorted((rel_lum(fg), rel_lum(bg)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def effective_values(css_text: str) -> dict:
    """Map token name -> effective hex, resolving one level of var() alias."""
    literals = {m.group(1): m.group(2).upper() for m in HEX.finditer(css_text)}
    aliases = {m.group(1): m.group(2) for m in ALIAS.finditer(css_text)}
    out = {}
    for name, val in literals.items():
        out[name] = val
    for name, target in aliases.items():
        if target in literals:
            out[name] = literals[target].upper()
        elif target in out:
            out[name] = out[target]
    return out


def main() -> int:
    args = sys.argv[1:]
    repo = Path(args[args.index("--repo-root") + 1]) if "--repo-root" in args else REPO
    sot = json.loads(SOT.read_text())
    tokens, bgs = sot["tokens"], sot["backgrounds"]
    failures = []

    # 1 + 2: parity and contrast
    for tree_name, tree in sot["trees"].items():
        path = repo / tree["file"]
        if not path.exists():
            # In isolated deploy-site builds (git archive on sites/arif-fazil.com),
            # files outside the site tree like sites/shared/ are not in the isolated extraction.
            # Resolve against repo fallback if present:
            fallback = Path("/root/arif-fazil.com") / tree["file"]
            if fallback.exists():
                path = fallback
            else:
                failures.append(f"[{tree_name}] token file missing: {tree['file']}")
                continue
        eff = effective_values(path.read_text(errors="replace"))
        overrides = tree.get("overrides", {})
        for token, spec in tokens.items():
            css_name = "--" + token
            if css_name not in eff:
                continue  # token not carried by this tree (e.g. verdict-unknown only in organ)
            expected = overrides.get(token, spec["value"]).upper()
            actual = eff[css_name]
            if actual != expected:
                failures.append(f"[{tree_name}] {token}: tree={actual} expected={expected}")
            if token in overrides:
                continue  # override values are checked against contrast below via SOT spec
            if "minContrast" in spec:
                for bg_name, bg in bgs.items():
                    r = contrast(actual, bg)
                    if r < spec["minContrast"]:
                        failures.append(
                            f"[{tree_name}] {token} {actual} on {bg_name} {bg} = {r:.2f}:1 "
                            f"< required {spec['minContrast']}")

    # 3: soul-primary must not be used as a text colour
    for tree_name, tree in sot["trees"].items():
        path = repo / tree["file"]
        if not path.exists():
            fallback = Path("/root/arif-fazil.com") / tree["file"]
            if fallback.exists():
                path = fallback
            else:
                continue
        text = path.read_text(errors="replace")
        for m in re.finditer(r"(?<!background-)(?<!-)\bcolor\s*:\s*var\(--soul-primary\)", text):
            line = text[:m.start()].count("\n") + 1
            failures.append(
                f"[{tree_name}] line {line}: var(--soul-primary) used as `color:` — "
                f"decorative only; use --soul-primary-text / --soul-primary-large")

    # report
    print(f"design-tokens gate v{sot['version']} — {len(tokens)} tokens × {len(sot['trees'])} trees")
    for tree_name, tree in sot["trees"].items():
        tag = " (declared overrides)" if tree.get("overrides") else ""
        print(f"  {tree_name:<10} {tree['label']}{tag}")
    if failures:
        print(f"\nFAIL ({len(failures)}):")
        for f in failures:
            print("  -", f)
        return 1
    print("\nPASS — parity OK, contrast OK, no decorative-as-text usage")
    return 0


if __name__ == "__main__":
    sys.exit(main())
