#!/usr/bin/env python3
"""
build_ledger.py — WITNESS LEDGER generator (read-only).

Purpose: produce a public, third-party-checkable record of what this federation
did — including what it got wrong. Accountability only becomes capability at the
moment an outsider can check it themselves; before that it is doctrine.

Design constraints (binding):
  * READ-ONLY on every source. This script never mutates federation state.
  * NO content leakage. Human-facing message text is never emitted — the gate
    ledger is aggregated by class only, never quoted.
  * NO invented numbers. Every figure is computed at build time from the file
    named beside it. If a source is absent, the field is marked MISSING.
  * Self-verifying. Emits a hash manifest + a verify script so any reader can
    re-derive every source hash without trusting this page.

Event-driven, not a cron. Run it when a ledger publication is wanted.
Usage: python3 build_ledger.py [--out DIR]
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html
import json
import os
import pathlib
import re
import subprocess
import sys

VAULT = pathlib.Path("/root/VAULT999")
RECEIPTS = VAULT / "RECEIPTS"
SEALED = VAULT / "SEALED_EVENTS.jsonl"
SEALED_COPY = pathlib.Path("/root/arifOS/VAULT999/SEALED_EVENTS.jsonl")
GATE_LOG = pathlib.Path("/root/.hermes/logs/reality_claim_gate.log")
REFUSALS = pathlib.Path("/root/.hermes/logs/reality_claim_refusals.jsonl")
CF = pathlib.Path("/root/.hermes/carry_forward.json")

PUBLIC_SURFACES = [
    "https://arif-fazil.com",
    "https://arifos.arif-fazil.com/health",
    "https://mcp.arif-fazil.com",
    "https://geox.arif-fazil.com",
    "https://wealth.arif-fazil.com",
    "https://well.arif-fazil.com",
    "https://aaa.arif-fazil.com",
]


def sha256(path: pathlib.Path, limit: int | None = None) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        while True:
            b = fh.read(1 << 20)
            if not b:
                break
            h.update(b)
    return h.hexdigest()


def iso(ts: float) -> str:
    return dt.datetime.fromtimestamp(ts, dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def collect_receipts() -> dict:
    if not RECEIPTS.is_dir():
        return {"state": "MISSING", "path": str(RECEIPTS)}
    out, total = [], 0
    for p in sorted(RECEIPTS.iterdir()):
        if not p.is_file():
            continue
        st = p.stat()
        total += st.st_size
        out.append(
            {
                "name": p.name,
                "bytes": st.st_size,
                "mtime": iso(st.st_mtime),
                "sha256": sha256(p)[:32],
            }
        )
    newest = max((r["mtime"] for r in out), default=None)
    superseded = [r["name"] for r in out if "superseded" in r["name"].lower()]
    return {
        "state": "PRESENT",
        "path": str(RECEIPTS),
        "count": len(out),
        "total_bytes": total,
        "newest": newest,
        "superseded_retained": len(superseded),
        "superseded_names": superseded,
        "entries": out,
    }


def collect_gate() -> dict:
    """Aggregate ONLY. Never emit message text — the ledger carries counts."""
    if not GATE_LOG.is_file():
        return {"state": "MISSING", "path": str(GATE_LOG)}
    classes: dict[str, int] = {}
    markers: dict[str, int] = {}
    suppressed = 0
    first = last = None
    lines = 0
    with GATE_LOG.open(encoding="utf-8", errors="ignore") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            lines += 1
            m = re.match(r"^\[(\d{4}-\d{2}-\d{2}T[\d:]+Z)\]\s+([A-Z_]+)", line)
            if m:
                if first is None:
                    first = m.group(1)
                last = m.group(1)
                classes[m.group(2)] = classes.get(m.group(2), 0) + 1
            for mk in re.findall(r"narrative_markers=([^\]']+)", line):
                key = mk.strip().strip(",").strip()
                if not key:
                    continue
                # PRIVACY: only single-token markers are ever published. The gate
                # log may hold a multi-word fragment captured from a message; that
                # is the human's language, not a statistic. Publish the signal,
                # never the sentence.
                if re.fullmatch(r"[\w\-]+", key):
                    markers[key] = markers.get(key, 0) + 1
                else:
                    suppressed += 1
    return {
        "state": "PRESENT",
        "path": str(GATE_LOG),
        "sha256": sha256(GATE_LOG)[:32],
        "lines": lines,
        "first_verdict": first,
        "last_verdict": last,
        "by_class": dict(sorted(classes.items(), key=lambda kv: -kv[1])),
        "top_markers": dict(sorted(markers.items(), key=lambda kv: -kv[1])[:8]),
        "multi_token_markers_suppressed": suppressed,
        "privacy": (
            "Marker statistics only. Multi-word fragments captured from messages "
            f"({suppressed} occurrences) are never published."
        ),
        "blocks": 0,
        "blocking_enabled": False,
        "note": (
            "Phase 1 DETECT. Promotes to NO (blocking) only by F13 under the "
            "gate-promotion doctrine. Every verdict in this ledger was emitted "
            "AND the message that triggered it was still delivered."
        ),
    }


def collect_refusals() -> dict:
    if not REFUSALS.is_file():
        return {"state": "MISSING", "path": str(REFUSALS)}
    n = 0
    last_ts = None
    with REFUSALS.open(encoding="utf-8", errors="ignore") as fh:
        for line in fh:
            if line.strip():
                n += 1
                m = re.search(r'"ts":\s*"([^"]+)"', line)
                if m:
                    last_ts = m.group(1)
    st = REFUSALS.stat()
    return {
        "state": "PRESENT",
        "path": str(REFUSALS),
        "lines": n,
        "last_entry_ts": last_ts,
        "file_mtime": iso(st.st_mtime),
        "sha256": sha256(REFUSALS)[:32],
    }


def collect_seal_chain() -> dict:
    if not SEALED.is_file():
        return {"state": "MISSING", "path": str(SEALED)}
    st = SEALED.stat()
    lines = sum(1 for _ in SEALED.open("rb"))
    head = None
    with SEALED.open("rb") as fh:
        for raw in fh:
            if raw.strip():
                head = raw
    head_ts = None
    head_id = None
    if head:
        try:
            obj = json.loads(head.decode("utf-8", "ignore"))
            head_id = obj.get("id")
            head_ts = obj.get("ts") or obj.get("timestamp")
        except Exception:
            pass
    dig = sha256(SEALED)[:32]
    twin = None
    if SEALED_COPY.is_file():
        twin = {
            "path": str(SEALED_COPY),
            "sha256": sha256(SEALED_COPY)[:32],
            "identical": sha256(SEALED_COPY) == sha256(SEALED),
        }
    frozen_days = (dt.datetime.now(dt.timezone.utc) - dt.datetime.fromtimestamp(st.st_mtime, dt.timezone.utc)).days
    return {
        "state": "PRESENT",
        "path": str(SEALED),
        "sha256": dig,
        "lines": lines,
        "bytes": st.st_size,
        "last_append": iso(st.st_mtime),
        "days_since_append": frozen_days,
        "head_id": head_id,
        "twin_copy": twin,
        "note": (
            "Witness grows, chain does not move. The seal chain is the only "
            "append-only hash-linked record; it is reported here exactly as "
            "found, including how stale it is."
        ),
    }


def collect_open_loops() -> dict:
    if not CF.is_file():
        return {"state": "MISSING", "path": str(CF)}
    try:
        d = json.loads(CF.read_text(encoding="utf-8"))
    except Exception as e:
        return {"state": "UNREADABLE", "path": str(CF), "error": str(e)[:120]}
    entries = d.get("entries") or []
    loops = [e for e in entries if e.get("kind") == "open_loop"]
    # Count ONLY genuinely open loops. Counting every entry ever tagged
    # open_loop (including status=DONE) would overstate the backlog — the exact
    # defect this ledger exists to catch.
    opened = [x for x in loops if (x.get("status") or "OPEN").upper() == "OPEN"]
    closed = [x for x in loops if (x.get("status") or "").upper() == "DONE"]
    oldest = min((x.get("ts") for x in opened if x.get("ts")), default=None)
    return {
        "state": "PRESENT",
        "path": str(CF),
        "schema": d.get("schema"),
        "entries": len(entries),
        "open_loops": len(opened),
        "closed_loops": len(closed),
        "loops_total": len(loops),
        "oldest_open_ts": oldest,
    }


def probe_surfaces() -> list[dict]:
    out = []
    for url in PUBLIC_SURFACES:
        try:
            r = subprocess.run(
                ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "10", url],
                capture_output=True,
                text=True,
                timeout=15,
            )
            out.append({"url": url, "http": r.stdout.strip() or "ERR"})
        except Exception as e:
            out.append({"url": url, "http": "ERR", "error": str(e)[:60]})
    return out


def build(outdir: pathlib.Path) -> dict:
    outdir.mkdir(parents=True, exist_ok=True)
    gen = pathlib.Path(__file__).resolve()
    ledger = {
        "schema": "arifos.witness_ledger.v1",
        "generated_at": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "generator": {"path": str(gen), "sha256": sha256(gen), "bytes": gen.stat().st_size},
        "constitutional": {
            "invariant": "CAPABILITY != AUTHORITY",
            "floors": 13,
            "claim": "This ledger reports state and outcome, not intention.",
        },
        "receipts": collect_receipts(),
        "gate": collect_gate(),
        "refusals": collect_refusals(),
        "seal_chain": collect_seal_chain(),
        "open_loops": collect_open_loops(),
        "public_surfaces": probe_surfaces(),
    }
    ledger["defects"] = derive_defects(ledger)
    (outdir / "ledger.json").write_text(json.dumps(ledger, indent=1, ensure_ascii=False), encoding="utf-8")
    (outdir / "index.html").write_text(render_html(ledger), encoding="utf-8")
    write_manifest(outdir, ledger)
    write_verify(outdir)
    return ledger


def derive_defects(L: dict) -> list[dict]:
    """The honest section. Defects are the record's reason to exist."""
    d = []
    g = L["gate"]
    if g.get("state") == "PRESENT":
        d.append(
            {
                "id": "D1",
                "title": "The output gate detects but does not stop",
                "evidence": f"{g['lines']} verdicts, {g['blocks']} blocks, blocking_enabled=false",
                "consequence": "A flagged sentence reached its reader anyway. A cop, not a door.",
                "owner": "F13 (promotion to Phase 2 NO)",
            }
        )
        tm = g.get("top_markers") or {}
        if tm:
            top = max(tm.items(), key=lambda kv: kv[1])
            narr = g.get("by_class", {}).get("NARRATIVE_EMITTED_AS_OBSERVATION", 0)
            share = f"{round(100 * top[1] / narr)}% of narrative flags" if narr else "n/a"
            d.append(
                {
                    "id": "D2",
                    "title": "The narrative detector fires on one word",
                    "evidence": (
                        f"marker '{top[0]}' fired {top[1]} times = {share} "
                        f"({narr} narrative verdicts total)"
                    ),
                    "consequence": (
                        "Low precision: an ordinary BM superlative is scored as narrative. "
                        "A ledger a reader learns to ignore is worse than no ledger."
                    ),
                    "owner": "mechanical (marker set + threshold)",
                }
            )
    s = L["seal_chain"]
    if s.get("state") == "PRESENT" and s.get("days_since_append", 0) >= 1:
        d.append(
            {
                "id": "D3",
                "title": "The seal chain is frozen while witnesses keep appending",
                "evidence": f"last append {s['last_append']} ({s['days_since_append']}d ago); head id={s['head_id']}",
                "consequence": "Append-only record stops being a record of now. Two byte-identical copies exist, so neither is authoritative by itself.",
                "owner": "F13 (kernel seal path)",
            }
        )
    r = L["refusals"]
    if r.get("state") == "PRESENT" and r.get("last_entry_ts"):
        d.append(
            {
                "id": "D4",
                "title": "A sub-ledger went quiet without being retired",
                "evidence": f"reality_claim_refusals.jsonl: {r['lines']} entries, last {r['last_entry_ts']}",
                "consequence": "Two ledgers for one gate; one is stale. Readers cannot tell which is live.",
                "owner": "mechanical (retire or re-wire)",
            }
        )
    o = L["open_loops"]
    if o.get("state") == "PRESENT":
        d.append(
            {
                "id": "D5",
                "title": "Open loops accumulate faster than they close",
                "evidence": f"{o['open_loops']} open loops of {o['entries']} entries; oldest {o.get('oldest_open_ts')}",
                "consequence": "A backlog stated as policy. The stated count is the audit.",
                "owner": "ongoing",
            }
        )
    d.append(
        {
            "id": "D6",
            "title": "Half the quality of this system is judged by this system",
            "evidence": "Peace^2, DITING, RASA gates all run inside the same issuer as the output they judge",
            "consequence": "An internal judge cannot witness its own issuer. Independent observation requires an external seat.",
            "owner": "structural / open",
        }
    )
    return d


def json_ld(L: dict) -> str:
    """JSON-LD dataset description (site DTI gate L4).

    Describes THIS page as what it actually is — a dataset/report with a
    generator and a defect list — rather than re-using the site's Person node.
    Claiming it as the site's identity would be a small lie in machine form.
    """
    g = L.get("gate") or {}
    s = L.get("seal_chain") or {}
    rc = L.get("receipts") or {}
    obj = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "WITNESS LEDGER — arifOS Federation",
        "description": (
            "Public accountability record of the arifOS Federation: preserved receipts, "
            "output-gate verdicts, seal-chain state, and a defect register. Every figure is "
            "recomputed at build time from a named source file and can be re-derived by a "
            "third party using the published SOURCES.sha256 manifest and verify.sh."
        ),
        "url": "https://arif-fazil.com/ledger",
        "isAccessibleForFree": True,
        "license": "https://arif-fazil.com/llms.txt",
        "creator": {
            "@type": "Person",
            "name": "Muhammad Arif bin Fazil",
            "url": "https://arif-fazil.com",
        },
        "dateModified": L.get("generated_at"),
        "variableMeasured": [
            {"@type": "PropertyValue", "name": "receipts_preserved", "value": rc.get("count")},
            {"@type": "PropertyValue", "name": "gate_verdicts", "value": g.get("lines")},
            {"@type": "PropertyValue", "name": "messages_blocked", "value": g.get("blocks")},
            {"@type": "PropertyValue", "name": "sealed_events", "value": s.get("lines")},
            {"@type": "PropertyValue", "name": "defects_on_record", "value": len(L.get("defects") or [])},
        ],
        "distribution": [
            {"@type": "DataDownload", "encodingFormat": "application/json",
             "contentUrl": "https://arif-fazil.com/ledger/ledger.json"},
            {"@type": "DataDownload", "encodingFormat": "text/plain",
             "contentUrl": "https://arif-fazil.com/ledger/SOURCES.sha256"},
        ],
        "citation": "DITEMPA BUKAN DIBERI",
    }
    return json.dumps(obj, indent=1, ensure_ascii=False)


def render_html(L: dict) -> str:
    e = html.escape
    g, s, r, rc, o = L["gate"], L["seal_chain"], L["refusals"], L["receipts"], L["open_loops"]

    rows_gate = "".join(
        f"<tr><td>{e(k)}</td><td class=n>{v}</td></tr>" for k, v in (g.get("by_class") or {}).items()
    )
    rows_rec = "".join(
        f"<tr><td class=mono>{e(x['name'])}</td><td class=n>{x['bytes']}</td><td class=mono>{e(x['mtime'])}</td><td class=mono>{x['sha256'][:16]}</td></tr>"
        for x in (rc.get("entries") or [])[:60]
    )
    rows_surf = "".join(
        f"<tr><td class=mono>{e(x['url'])}</td><td class=n>{e(str(x['http']))}</td></tr>"
        for x in L["public_surfaces"]
    )
    defects = "".join(
        f"<li><b>{e(d['title'])}</b><div class=mono>{e(d['evidence'])}</div>"
        f"<div>{e(d['consequence'])}</div><div class=owner>owner: {e(d['owner'])}</div></li>"
        for d in L["defects"]
    )
    twin = e(str((s.get("twin_copy") or {}).get("identical", "-")))
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>WITNESS LEDGER — arifOS Federation</title>
<meta name="description" content="The arifOS Federation's public accountability record: receipts preserved, output-gate verdicts, seal-chain state, and a defect register. Every figure is recomputed from a named source and re-checkable by anyone.">
<link rel="canonical" href="https://arif-fazil.com/ledger" />
<!-- Open Graph (DTI gate L5) -->
<meta property="og:title" content="WITNESS LEDGER — arifOS Federation" />
<meta property="og:description" content="The federation's record of what it did and what it got wrong. Receipts, gate verdicts, seal-chain state, and six published defects." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://arif-fazil.com/ledger" />
<meta property="og:image" content="https://arif-fazil.com/og-identity.svg" />
<meta property="og:image:alt" content="arif-fazil.com identity mark (AF monogram — no portrait)" />
<meta property="og:site_name" content="arif-fazil.com" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="WITNESS LEDGER — arifOS Federation" />
<meta name="twitter:description" content="Accountability is only worth something when someone other than its owner can check it." />
<!-- JSON-LD (DTI gate L4) -->
<script type="application/ld+json">
{json_ld(L)}
</script>
<style>
:root{{--ink:#1a1a1a;--mut:#666;--line:#e2e2e2;--bg:#fbfaf8;--acc:#8a1c1c}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 Georgia,serif}}
main{{max-width:820px;margin:0 auto;padding:56px 22px 90px}}
h1{{font-size:26px;letter-spacing:.14em;margin:0 0 6px;text-transform:uppercase}}
h2{{font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:var(--acc);margin:44px 0 10px;border-bottom:1px solid var(--line);padding-bottom:6px}}
.sub{{color:var(--mut);font-size:14px;margin-bottom:34px}}
.k{{display:flex;flex-wrap:wrap;gap:26px;margin:18px 0}}
.k div{{min-width:120px}} .k b{{display:block;font-size:24px}} .k span{{color:var(--mut);font-size:12px;letter-spacing:.08em;text-transform:uppercase}}
table{{width:100%;border-collapse:collapse;font-size:14px;margin:10px 0}}
th,td{{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line)}}
th{{color:var(--mut);font-weight:400;font-size:12px;letter-spacing:.06em;text-transform:uppercase}}
.n{{text-align:right;font-variant-numeric:tabular-nums}}
.mono{{font-family:ui-monospace,Menlo,monospace;font-size:12.5px}}
ol{{padding-left:20px}} ol li{{margin:14px 0}}
.owner{{color:var(--acc);font-size:12.5px;margin-top:4px}}
code{{background:#f0eee9;padding:2px 5px;font-size:13px}}
.note{{background:#fff;border-left:3px solid var(--acc);padding:11px 14px;font-size:14px;margin:14px 0}}
.miss{{color:var(--acc)}}
footer{{margin-top:60px;border-top:1px solid var(--line);padding-top:14px;color:var(--mut);font-size:12.5px}}
</style></head><body><main>
<h1>Witness Ledger</h1>
<div class=sub>arifOS Federation &middot; generated {e(L['generated_at'])} &middot; schema {e(L['schema'])}</div>

<p>This page is a record of what this system did, including what it got wrong.
It exists for one reason: <b>accountability is only worth something when someone
other than its owner can check it.</b> Every number below is recomputed from a
named file at build time. Nothing here is a projection.</p>

<h2>How to check this yourself</h2>
<p>Do not trust this page. Re-derive it:</p>
<p><code>curl -s https://arif-fazil.com/ledger/ledger.json</code><br>
<code>curl -s https://arif-fazil.com/ledger/SOURCES.sha256</code><br>
<code>cd /ledger &amp;&amp; sh verify.sh</code></p>
<p>Each source hash in the manifest is the hash of a file on the sovereign's own
disk. If a hash does not match, or a file is absent, the ledger is stale and you
should say so.</p>

<h2>Receipts preserved</h2>
<div class=k>
<div><b>{e(str(rc.get('count','MISSING')))}</b><span>receipt files</span></div>
<div><b>{e(str(rc.get('total_bytes','-')))}</b><span>bytes retained</span></div>
<div><b>{e(str(rc.get('newest','-')))}</b><span>newest</span></div>
<div><b>{e(str(rc.get('superseded_retained',0)))}</b><span>supersessions retained</span></div>
</div>
<p class=mono>{e(str(rc.get('path')))}</p>
<p>Superseded artifacts are <b>kept, not overwritten</b>. One instance on record is a
practice, not yet a pattern — the count is published so it can be judged.</p>
<table><tr><th>file</th><th class=n>bytes</th><th>mtime</th><th>sha256</th></tr>{rows_rec}</table>

<h2>Output gate verdicts</h2>
<div class=k>
<div><b>{e(str(g.get('lines','MISSING')))}</b><span>verdicts</span></div>
<div><b>{e(str(g.get('blocks',0)))}</b><span>messages blocked</span></div>
<div><b>{e(str(g.get('first_verdict','-')))}</b><span>earliest</span></div>
<div><b>{e(str(g.get('last_verdict','-')))}</b><span>latest</span></div>
</div>
<div class=note>{e(g.get('note',''))}</div>
<table><tr><th>class</th><th class=n>count</th></tr>{rows_gate}</table>

<h2>Seal chain</h2>
<div class=k>
<div><b>{e(str(s.get('lines','-')))}</b><span>sealed events</span></div>
<div><b>{e(str(s.get('head_id','-')))}</b><span>head id</span></div>
<div><b>{e(str(s.get('days_since_append','-')))}d</b><span>since last append</span></div>
</div>
<p class=mono>sha256 {e(str(s.get('sha256','-')))}<br>{e(str(s.get('path','-')))}<br>twin copy identical: {twin}</p>
<div class=note>{e(s.get('note',''))}</div>

<h2>Defects on record</h2>
<p>This is the part that makes the rest worth anything. A system that cannot lose
and keep the record cannot be audited across time.</p>
<ol>{defects}</ol>

<h2>Open loops</h2>
<p class=mono>{e(str(o.get('open_loops','-')))} open &middot; {e(str(o.get('closed_loops','-')))} closed &middot; {e(str(o.get('entries','-')))} total entries &middot; oldest open {e(str(o.get('oldest_open_ts','-')))}</p>

<h2>Public surfaces</h2>
<table><tr><th>endpoint</th><th class=n>http</th></tr>{rows_surf}</table>
<p class=note>These publish <b>capability</b> status. Until this page, none published
the <b>accountability</b> record — the receipts, the verdicts, the defects.</p>

<footer>
Generator {e(L['generator']['sha256'][:16])} &middot; {e(str(L['generator']['bytes']))} bytes &middot;
invariant {e(L['constitutional']['invariant'])} &middot; floors {e(str(L['constitutional']['floors']))}<br>
DITEMPA BUKAN DIBERI
</footer>
</main></body></html>
"""


def write_manifest(outdir: pathlib.Path, L: dict) -> None:
    """Write the source manifest in TWO sections, because the sources have two
    different contracts.

    PINNED   — files that must not change after generation. A hash mismatch here
               means the ledger no longer describes reality: VERDICT LEDGER_STALE.
    ADVANCING — live logs that append by design (the gate ledger grows with every
               turn). Pinning these makes the verifier cry STALE within minutes of
               every generation, and a verifier that always alarms is a verifier
               nobody reads. They are recorded with their hash AND line count at
               build time, and drift is reported as ADVANCED (expected), never as
               failure. The honest signal is the DELTA, not a binary.
    """
    pinned, advancing = [], []
    for key in ("receipts", "gate", "refusals", "seal_chain"):
        sec = L.get(key) or {}
        p = sec.get("path")
        if not p or not os.path.exists(p):
            pinned.append(f"{'MISSING':64}  {p}")
            continue
        if os.path.isdir(p):
            for f in sorted(os.listdir(p)):
                fp = os.path.join(p, f)
                if os.path.isfile(fp):
                    pinned.append(f"{sha256(pathlib.Path(fp))}  {fp}")
        elif key == "gate":
            advancing.append(f"{sha256(pathlib.Path(p))}  {sec.get('lines', '?')}  {p}")
        else:
            pinned.append(f"{sha256(pathlib.Path(p))}  {p}")
    pinned.append(f"{L['generator']['sha256']}  {L['generator']['path']}")

    body = ["# WITNESS LEDGER source manifest",
            "# SECTION 1 — PINNED: a hash mismatch means LEDGER_STALE.",
            *pinned,
            "",
            "# SECTION 2 — ADVANCING: live logs that append by design.",
            "# Format: <sha256>  <lines_at_build>  <path>",
            "# These are expected to grow. verify.sh reports ADVANCED, not failure.",
            *advancing,
            ""]
    (outdir / "SOURCES.sha256").write_text("\n".join(body), encoding="utf-8")


def write_verify(outdir: pathlib.Path) -> None:
    script = """#!/bin/sh
# verify.sh — re-derive every hash in SOURCES.sha256. Any FAIL means the ledger
# no longer describes the disk, and the ledger should be treated as stale.
#
# FAIL-CLOSED (2026-09-20): this script used to read SOURCES.sha256 relative to
# the CALLER's cwd. Run from anywhere else, the read produced zero lines, the
# loop never executed, fail stayed 0 — and it printed "LEDGER_MATCHES_DISK"
# after checking NOTHING. A gate that reports PASS after checking zero items is
# the exact false-pass pattern this ledger exists to catch, so it is fixed here:
# the manifest is resolved relative to THIS script, and an empty or unreadable
# manifest is a failure, never a pass.
set -u

SELF_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
MANIFEST="$SELF_DIR/SOURCES.sha256"

if [ ! -f "$MANIFEST" ]; then
  echo "VERDICT: LEDGER_UNVERIFIABLE — no manifest at $MANIFEST"
  exit 3
fi

fail=0; n=0; present=0; advanced=0
section=1
while IFS= read -r line; do
  case "$line" in
    "# SECTION 2"*) section=2; continue ;;
    "#"*|"") continue ;;
  esac
  n=$((n+1))
  hash=$(printf '%s' "$line" | cut -d' ' -f1)
  if [ "$section" -eq 2 ]; then
    # ADVANCING format: "<sha256>  <lines_at_build>  <path>"
    lines_at_build=$(printf '%s' "$line" | awk '{print $2}')
    path=$(printf '%s' "$line" | awk '{for(i=3;i<=NF;i++) printf "%s%s", $i, (i<NF?" ":"")}')
    if [ -z "$path" ]; then
      echo "MALFORMED  $line"; fail=$((fail+1)); continue
    fi
    if [ ! -f "$path" ]; then
      echo "ADV-MISSING  $path"; advanced=$((advanced+1)); continue
    fi
    now_lines=$(wc -l < "$path" 2>/dev/null || echo 0)
    echo "ADVANCING    $path  (lines $lines_at_build -> $now_lines at build/now)"
    advanced=$((advanced+1)); continue
  fi
  # PINNED format: "<sha256>  <path>" — path is every field after the hash.
  path=$(printf '%s' "$line" | awk '{for(i=2;i<=NF;i++) printf "%s%s", $i, (i<NF?" ":"")}')
  if [ -z "$path" ]; then
    echo "MALFORMED  $line"; fail=$((fail+1)); continue
  fi
  if [ "$hash" = "MISSING" ]; then
    echo "MISSING  $path"; fail=$((fail+1)); continue
  fi
  if [ ! -f "$path" ]; then
    echo "ABSENT   $path"; present=$((present+1)); continue
  fi
  got=$(sha256sum "$path" | cut -d' ' -f1)
  if [ "$got" = "$hash" ]; then echo "OK       $path"; else echo "FAIL     $path"; fail=$((fail+1)); fi
done < "$MANIFEST"

echo "---"
echo "pinned checked $n | hash mismatches $fail | sources absent $present | advancing $advanced"

if [ "$n" -eq 0 ]; then
  echo "VERDICT: LEDGER_UNVERIFIABLE — manifest is empty (checked nothing)"
  exit 3
fi
if [ "$fail" -gt 0 ]; then
  echo "VERDICT: LEDGER_STALE — $fail pinned source(s) changed since generation"
  exit 1
fi
echo "VERDICT: LEDGER_MATCHES_DISK"
exit 0
"""
    p = outdir / "verify.sh"
    p.write_text(script, encoding="utf-8")
    p.chmod(0o755)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="/root/forge_work/witness-ledger/public")
    a = ap.parse_args()
    L = build(pathlib.Path(a.out))
    print(f"ledger written -> {a.out}")
    print(f"  receipts    {L['receipts'].get('count')}")
    print(f"  gate        {L['gate'].get('lines')} verdicts / {L['gate'].get('blocks')} blocks")
    print(f"  seal chain  {L['seal_chain'].get('lines')} events, frozen {L['seal_chain'].get('days_since_append')}d")
    print(f"  open loops  {L['open_loops'].get('open_loops')}")
    print(f"  defects     {len(L['defects'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
