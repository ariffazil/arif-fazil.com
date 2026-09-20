#!/usr/bin/env python3
"""Register the WITNESS LEDGER in the canonical surface catalog.

Rule from surfaces.json itself: "If it is not in surfaces.json, it does not get
served to a machine." So a public surface that is not registered here is
half-published — a human can reach it, a machine cannot.

Idempotent. Refuses to write if either path is already registered.
"""
import datetime as dt
import json
import pathlib
import sys

F = pathlib.Path("/root/arif-fazil.com/sites/arif-fazil.com/public/surfaces.json")
# NOTE: generate-discovery.cjs declares its canonical source as
# /root/arif-fazil.com/surfaces.json (`../../surfaces.json` from SITE_ROOT) —
# but that file DOES NOT EXIST, so the canonical sync is skipped and
# public/surfaces.json is copied up to sites/arif-fazil.com/surfaces.json.
# The effective source of truth is therefore public/surfaces.json.
# Dead-canonical-pointer recorded as a defect; do not "fix" it blind.

NEW = [
    {
        "path": "/ledger",
        "title": "WITNESS LEDGER — Public Accountability Record",
        "mission": "remember",
        "status": "live",
        "type": "page",
        "priority": 0.8,
        "changefreq": "weekly",
        "description": (
            "The federation's record of what it did and what it got wrong: receipts "
            "preserved, output-gate verdicts, seal-chain state, and a defect register. "
            "Every figure is recomputed from a named source and re-checkable."
        ),
    },
    {
        "path": "/ledger/ledger.json",
        "title": "WITNESS LEDGER — Machine Record",
        "mission": "remember",
        "status": "live",
        "type": "machine",
        "format": "application/json",
        "priority": 0.7,
        "changefreq": "weekly",
        "description": "Machine-readable form of the witness ledger (schema arifos.witness_ledger.v1)",
    },
]


def main() -> int:
    d = json.loads(F.read_text(encoding="utf-8"))
    have = {s.get("path") for s in d["surfaces"]}
    todo = [e for e in NEW if e["path"] not in have]
    if not todo:
        print("ALREADY_REGISTERED — no change")
        return 0
    for e in todo:
        d["surfaces"].append(e)
    d["version"] = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    d["as_of"] = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    F.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"REGISTERED {len(todo)} surface(s): {[e['path'] for e in todo]}")
    print(f"catalog now {len(d['surfaces'])} surfaces, version {d['version']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
