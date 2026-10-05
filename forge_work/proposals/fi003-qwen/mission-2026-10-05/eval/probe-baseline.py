#!/usr/bin/env python3
"""
probe-baseline.py — Reproducible baseline probe for arif-fazil.com (2026-10-05).

Walks every entry in /root/arif-fazil.com/sites/arif-fazil.com/surfaces.json,
hits the live URL, records status / content-type / bytes / title / first meta
description. Writes JSON + Markdown summary. Re-runnable on demand.

This is the T0 measurement for slice 1. Future slices must be measured
against this file with the same script (not a new one) to keep the
method identical.

USAGE:
    python3 probe-baseline.py [--out-dir /tmp/baseline-YYYY-MM-DD]

OUTPUTS:
    <out-dir>/probes.json   — structured probe data
    <out-dir>/probes.md     — human-readable summary
    <out-dir>/non-200.txt   — list of surfaces not returning 200
"""
import argparse
import json
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

SOT = Path("/root/arif-fazil.com/sites/arif-fazil.com/surfaces.json")
UA = "Mozilla/5.0 baseline-probe fi003-qwen 2026-10-05"
TIMEOUT = 10  # seconds per surface


def probe(url, follow_redirects=True):
    """Probe a single URL. Returns a dict with status, type, bytes, title, meta."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        r = urllib.request.urlopen(req, timeout=TIMEOUT)
        body = r.read()
        text = body[:8000].decode("utf-8", errors="replace")
        # crude title + first meta description
        title = ""
        meta = ""
        try:
            t_start = text.find("<title>")
            t_end = text.find("</title>")
            if t_start != -1 and t_end != -1:
                title = text[t_start + 7 : t_end].strip()[:200]
        except Exception:
            pass
        try:
            m_start = text.find('name="description"')
            if m_start != -1:
                m_content = text.find('content="', m_start)
                if m_content != -1:
                    m_end = text.find('"', m_content + 9)
                    if m_end != -1:
                        meta = text[m_content + 9 : m_end].strip()[:300]
        except Exception:
            pass
        return {
            "status": r.status,
            "type": r.headers.get("Content-Type", ""),
            "bytes": len(body),
            "title": title,
            "meta_description": meta,
            "redirect_url": r.geturl() if r.geturl() != url else "",
        }
    except urllib.error.HTTPError as e:
        return {
            "status": e.code,
            "type": e.headers.get("Content-Type", "") if e.headers else "",
            "bytes": 0,
            "title": "",
            "meta_description": "",
            "error": f"HTTP {e.code}",
        }
    except Exception as e:
        return {
            "status": 0,
            "type": "",
            "bytes": 0,
            "title": "",
            "meta_description": "",
            "error": str(e)[:120],
        }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--out-dir", default=None)
    p.add_argument("--only", default=None, help="comma-separated substrings to filter")
    args = p.parse_args()

    if not SOT.exists():
        print(f"FATAL: SOT not found: {SOT}", file=sys.stderr)
        sys.exit(2)

    surfaces = json.loads(SOT.read_text()).get("surfaces", [])
    print(f"Loaded {len(surfaces)} surfaces from {SOT}")

    out_dir = Path(
        args.out_dir
        or f"/tmp/baseline-{datetime.now(timezone.utc).strftime('%Y-%m-%d')}"
    )
    out_dir.mkdir(parents=True, exist_ok=True)

    only_filter = (
        [s.strip() for s in args.only.split(",")] if args.only else None
    )

    results = []
    for s in surfaces:
        path = s.get("path", "")
        if not path.startswith("/"):
            continue
        if only_filter and not any(f in path for f in only_filter):
            continue
        url = f"https://arif-fazil.com{path}"
        r = probe(url)
        r["path"] = path
        r["surface_status"] = s.get("status", "?")
        r["surface_type"] = s.get("type", "?")
        results.append(r)
        print(
            f"  [{r['status']:>3}] {r['bytes']:>7}B {path}  ({r.get('title','')[:50]})"
        )

    # structured
    payload = {
        "ts_utc": datetime.now(timezone.utc).isoformat(),
        "actor": "fi003-qwen",
        "script_version": "1.0.0",
        "sot_path": str(SOT),
        "sot_surfaces_count": len(surfaces),
        "probed_count": len(results),
        "results": results,
    }
    (out_dir / "probes.json").write_text(json.dumps(payload, indent=1))

    # markdown summary
    md = ["# Baseline probe — arif-fazil.com", ""]
    md.append(f"- ts: {payload['ts_utc']}")
    md.append(f"- actor: {payload['actor']}")
    md.append(f"- surfaces probed: {len(results)}")
    md.append(
        f"- 200 OK: {sum(1 for r in results if r.get('status') == 200)}"
    )
    md.append(
        f"- non-200: {sum(1 for r in results if r.get('status') != 200)}"
    )
    md.append("")
    md.append("## Non-200 surfaces")
    md.append("")
    for r in results:
        if r.get("status") != 200:
            md.append(
                f"- `{r['path']}` → {r.get('status')} ({r.get('error', r.get('type',''))})"
            )
    md.append("")
    md.append("## Sample (first 20)")
    md.append("")
    md.append("| path | status | bytes | type | title |")
    md.append("|------|-------:|------:|------|-------|")
    for r in results[:20]:
        title = (r.get("title") or "").replace("|", "/")[:60]
        md.append(
            f"| `{r['path']}` | {r.get('status')} | {r.get('bytes',0)} | {r.get('type','')[:30]} | {title} |"
        )
    (out_dir / "probes.md").write_text("\n".join(md))

    # non-200 list
    non200 = [r for r in results if r.get("status") != 200]
    (out_dir / "non-200.txt").write_text(
        "\n".join(f"{r['path']}\t{r.get('status')}\t{r.get('error','')}" for r in non200)
    )

    print(f"\nWrote:")
    print(f"  {out_dir / 'probes.json'}")
    print(f"  {out_dir / 'probes.md'}")
    print(f"  {out_dir / 'non-200.txt'}")
    print(
        f"\n200 OK: {sum(1 for r in results if r.get('status') == 200)} / {len(results)}"
    )


if __name__ == "__main__":
    main()
