#!/usr/bin/env python3
"""Sync the commodity boards (/oil/, /gas/) from their tracked template.

WHY THIS EXISTS
The commodity boards are runtime pages: their `wealth-reality-packet` JSON-LD is resealed
hourly from the live snapshot API, so the file itself is deliberately git-ignored (a tracked
copy would dirty the tree every hour and block the heal cron). But a git-ignored page had
NO source of truth for its static shell — so when the page was regenerated, whatever the
shell said was silently lost. That is exactly how the institutional-context line
("Institutional context (PETRONAS reserves, dividend, 2027 gates) → /petronas") was lost once.

THE CHAIN
    templates/commodity/<asset>.html   tracked source of truth for the shell
    public/<asset>/index.html           generated runtime copy (git-ignored, cron-resealed)
    dist/<asset>/index.html             build output, deployed to the serving tree

WHAT THIS SCRIPT DOES (per asset, idempotent)
    1. copy the tracked template over the runtime copy;
    2. refresh the wealth-reality-packet from the live snapshot API, reusing the tracked
       reseal logic (no second implementation of the packet merge);
    3. guarantee the institutional-context line, whatever the template says.

It never touches the live webroot, and it never fails a build: a missing API is a warning.
"""
from __future__ import annotations

import importlib.util
import io
import pathlib
import shutil
import sys

HERE = pathlib.Path(__file__).resolve().parent
SITE = HERE.parent
ASSETS = ("oil", "gas", "gold")

CONTEXT_LINE = (
    '      <!-- Institutional context — one quiet line under the price block. Navigation only; no data touched. -->\n'
    '      <p style="margin:14px 0 0;font-family:var(--mono);font-size:.68rem;letter-spacing:.06em;color:var(--dim)">\n'
    '        <a href="/petronas/" style="color:var(--dim);text-decoration:none;border-bottom:1px solid var(--faint)">'
    'Institutional context (PETRONAS reserves, dividend, 2027 gates) → /petronas</a>\n'
    '      </p>\n'
)

ANCHOR = (
    '      <div class="market-answer-unavailable" id="maUnavailable" hidden>'
    'Data unavailable · last verified <span id="maLastVerified">—</span></div>\n'
    '    </div>\n'
)


def load_reseal():
    """Reuse the tracked reseal logic instead of re-implementing the packet merge."""
    spec = importlib.util.spec_from_file_location(
        "reseal_commodity_packets", HERE / "reseal-commodity-packets.py")
    mod = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(mod)
    except Exception as exc:            # pragma: no cover - defensive
        print(f"  reseal module unavailable: {exc}")
        return None
    return mod


def ensure_context_line(html: str) -> tuple[str, bool]:
    """Guarantee the institutional-context line sits under the price block."""
    if "Institutional context (PETRONAS reserves" in html:
        return html, False
    if ANCHOR not in html:
        return html, False
    # ANCHOR ends at the closing </div> of the price block, so the line lands
    # between that block and the section's own </section>.
    return html.replace(ANCHOR, ANCHOR + CONTEXT_LINE, 1), True


def main() -> int:
    reseal = load_reseal()
    for asset in ASSETS:
        template = SITE / "templates" / "commodity" / f"{asset}.html"
        target = SITE / "public" / asset / "index.html"
        if not template.is_file():
            print(f"[commodity-sync] {asset}: no template at {template} — skipped")
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(template, target)
        note = "copied"

        if reseal is not None:
            try:
                snap = reseal.fetch_snapshot(asset)
                reseal.patch_file(target, snap)
                note += f", packet refreshed (price={(snap.get('ticker') or {}).get('price')})"
            except Exception as exc:
                note += f", packet NOT refreshed ({exc})"

        html = io.open(target, encoding="utf-8").read()
        html, added = ensure_context_line(html)
        if added:
            io.open(target, "w", encoding="utf-8").write(html)
            note += ", context line inserted"
        else:
            note += ", context line present"
        print(f"[commodity-sync] {asset}: {note}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
