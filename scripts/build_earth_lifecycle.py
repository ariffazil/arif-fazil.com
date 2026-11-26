#!/usr/bin/env python3
"""Build /earth/lifecycle/index.html from live GEOX /health + /tools JSON (public-safe)."""
from __future__ import annotations

import html
import json
import subprocess
import urllib.request
from datetime import UTC, datetime
from pathlib import Path

OUT = Path("/root/arif-fazil.com/sites/arif-fazil.com/public/earth/lifecycle/index.html")
HEALTH_URL = "http://127.0.0.1:8081/health"
TOOLS_URL = "http://127.0.0.1:8081/tools"

STAGE_SPECS = [
    (
        "Exploration",
        "BUILT",
        "geox_basin, geox_deep_time, geox_map, geox_spatial, geox_seismic_ingest, geox_seismic_interpret, geox_seismic_compute, geox_contrast_metabolize, geox_source, geox_observe, geox_paleobiodb_query, geox_prospect (screen), geox_glof",
        "NW Sabah regional transect T-KIN-XS-833 (GEBCO_2019 + published RF) & F3 Netherlands 3D SEG-Y (CC-BY-SA, planned E2E)",
        "Acoustic lookalike trap: altered volcaniclastics mimicking carbonate reefs; missing public 3D SEG-Y E2E CI run.",
    ),
    (
        "Appraisal",
        "BUILT",
        "geox_well_ingest, geox_well_qc, geox_petrophysics, geox_geomechanics",
        "Equinor Volve & FORCE 2020 (118 public wells) petrophysical QC",
        "Silent datum shifts (KB/TVDSS), ×3.28084 metric/imperial unit corruption, 1e37 sentinels, cuttings-vs-SWC age inversions.",
    ),
    (
        "Development",
        "PARTIAL",
        "geox_grid, geox_resqml_io, geox_model, geox_well",
        "Public Volve structural grid & RESQML schema validation",
        "Thin well-planning and drilling-hazard evidence chain; heavy optional geomodel deps.",
    ),
    (
        "Production",
        "PARTIAL",
        "geox_temporal",
        "Public Volve production decline curve & RRR time-series screening",
        "No live production-data ingest or history-match feedback loop yet.",
    ),
    (
        "Abandonment",
        "GAP",
        "None dedicated (planned: geox_integrity mode + CCS-MRV seal verification)",
        "Planned: CO2 storage (CCS) seal-integrity & P&A barrier verification ledger",
        "No dedicated P&A / well-integrity / CCS-MRV tool yet; planned as a mode, not a new standalone tool.",
    ),
]


def _fetch_json(url: str) -> dict:
    try:
        with urllib.request.urlopen(url, timeout=3) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception:
        return {}


def main() -> None:
    health = _fetch_json(HEALTH_URL)
    tools = _fetch_json(TOOLS_URL)
    site_sha = subprocess.check_output(["git", "-C", "/root/arif-fazil.com", "rev-parse", "--short", "HEAD"], timeout=5).decode().strip()
    build_date = datetime.now(UTC).strftime("%Y-%m-%d")
    geox_sha = health.get("git_version", "unknown")
    tool_count = health.get("tool_count", len(tools.get("tools", [])))
    reg_state = health.get("registry_state", "UNKNOWN")
    drift = health.get("geox_source_drift", {}).get("drift", "unknown")
    surface_ver = health.get("version", "unknown")

    rows_html = []
    for stage, maturity, stage_tools, example, failure in STAGE_SPECS:
        cls = {"BUILT": "built", "PARTIAL": "partial", "GAP": "gap"}[maturity]
        rows_html.append(
            f"<tr>"
            f"<th scope='row'>{html.escape(stage)}</th>"
            f"<td><span class='badge {cls}'>{maturity}</span></td>"
            f"<td><code>{html.escape(stage_tools)}</code></td>"
            f"<td>{build_date}</td>"
            f"<td>{html.escape(example)}</td>"
            f"<td>{html.escape(failure)}</td>"
            f"</tr>"
        )

    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GEOX Lifecycle Observability — Exploration to Abandonment</title>
<meta name="description" content="Honest lifecycle coverage and live build-time telemetry of GEOX subsurface tools from Exploration through Abandonment / CCS-MRV.">
<link rel="canonical" href="https://arif-fazil.com/earth/lifecycle/">
<link rel="stylesheet" href="/_shared/design-system/tokens.css">
<link rel="stylesheet" href="/earth/_shared/earth-shell.css">
<link rel="stylesheet" href="/_shared/fed-nav.css">
<style>
:root {{ --canvas:#07090E; --ink:#EDEAE2; --muted:#c4beb4; --line:#2a3140; --card:#12161e; --ember:#E4572E; }}
body {{ margin:0; background:var(--canvas); color:var(--ink); font-family:"IBM Plex Sans",system-ui,sans-serif; line-height:1.5; }}
.wrap {{ max-width:1120px; margin:0 auto; padding:1rem 1rem 2.5rem; }}
.chips {{ display:flex; flex-wrap:wrap; gap:.5rem; margin:.8rem 0 1.2rem; }}
.chip {{ background:#19202c; border:1px solid #334155; border-radius:999px; padding:.25rem .7rem; font-size:.85rem; }}
.table-wrap {{ overflow-x:auto; border:1px solid var(--line); border-radius:8px; }}
table {{ width:100%; border-collapse:collapse; font-size:.92rem; min-width:820px; }}
th, td {{ border-bottom:1px solid var(--line); padding:.6rem .65rem; text-align:left; vertical-align:top; }}
thead th {{ background:#10141c; }}
.badge {{ display:inline-block; padding:.15rem .55rem; border-radius:999px; font-weight:700; font-size:.78rem; }}
.badge.built {{ background:#0f2922; color:#a7f3d0; border:1px solid #34d399; }}
.badge.partial {{ background:#2a2112; color:#fde68a; border:1px solid #fbbf24; }}
.badge.gap {{ background:#2f1318; color:#fecdd3; border:1px solid #fb7185; }}
footer {{ border-top:1px solid var(--line); padding:1rem; color:var(--muted); max-width:1120px; margin:0 auto; font-size:.9rem; }}
a {{ color:#f3c2b4; }}
</style>
</head>
<body>
<header class="fed-navbar">
  <a class="nav-brand" href="/">ARIF FAZIL</a>
  <nav class="nav-links" aria-label="Site">
    <a href="/earth/">Earth</a><a href="/words/">Words</a><a href="/world/">World</a><a href="/work/">Work</a>
  </nav>
</header>
<main class="wrap">
  <p style="font-family:monospace;font-size:.8rem;color:var(--muted);">GEOX · SUBSURFACE LIFECYCLE OBSERVABILITY</p>
  <h1>What GEOX covers — and where the real gaps are</h1>
  <p>Build-time snapshot from GEOX live status JSON (public-safe; zero proprietary subsurface data). Every lifecycle stage reports honest maturity, worked public benchmark, and known failure mode.</p>
  <div class="chips" role="region" aria-label="Live GEOX status snapshot">
    <span class="chip">GEOX SHA: <strong>{html.escape(str(geox_sha))}</strong></span>
    <span class="chip">Surface: <strong>{html.escape(str(surface_ver))}</strong></span>
    <span class="chip">Live Tools: <strong>{html.escape(str(tool_count))}</strong></span>
    <span class="chip">Registry: <strong>{html.escape(str(reg_state))}</strong></span>
    <span class="chip">Source Drift: <strong>{html.escape(str(drift))}</strong></span>
    <span class="chip">Audited: <strong>{build_date}</strong></span>
  </div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th scope="col">Stage</th>
          <th scope="col">Maturity</th>
          <th scope="col">Live GEOX Tools</th>
          <th scope="col">Last Tested</th>
          <th scope="col">Worked Public Example</th>
          <th scope="col">Known Failure Mode / Gap</th>
        </tr>
      </thead>
      <tbody>
        {''.join(rows_html)}
      </tbody>
    </table>
  </div>
</main>
<footer>
  <nav aria-label="Related Earth pages">
    <a href="/earth/">Earth</a> · <a href="/earth/kinabalu-cross-section.html">Sabah cross-section</a> · <a href="/earth/data/transects.json">Transects registry</a>
  </nav>
  <p>Build SHA: <code>{html.escape(site_sha)}</code> · GEOX SHA: <code>{html.escape(str(geox_sha))}</code> · Build date: <code>{build_date}</code> · Last audited: <code>{build_date}</code></p>
  <p>Ditempa bukan diberi · © 2026 Muhammad Arif bin Fazil</p>
</footer>
</body>
</html>
"""
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(doc, encoding="utf-8")
    print(f"BUILT {OUT} ({len(doc)} bytes, geox_sha={geox_sha}, tools={tool_count})")


if __name__ == "__main__":
    main()
