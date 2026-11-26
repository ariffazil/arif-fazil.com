# SITE BASELINE — `arif-fazil.com/earth` (Reproduced 2026-11-26)

> Branch: `site/earth-clarity` · Base HEAD: `c81c505e` · Live Host Untouched (888 HOLD preview-first)
> Audited Target: `sites/arif-fazil.com/public/earth/kinabalu-cross-section.html`

## 1. Git History of `kinabalu-cross-section.html` `[OBS]`

- `c81c505e` — `fix(earth): complete 7-fix geodetic, chronostratigraphic & RF Moho reconciliation (T-KIN-XS-833)` (2026-11-26)
- `4e4fe05c` — `fix(earth): physics audit patch for kinabalu-cross-section.html & transects.json (T-KIN-XS-833)` (2026-11-26)
- `02111509` — `style(earth): increase navbar min-height to 56px for touch target a11y`
- `24eb562d` — `feat(earth): clarify kinabalu cross-section and align transects to WGS-84`

## 2. SVG Geometry & Geodesic Scale Verification `[OBS]`

| Parameter | Measured in SVG (`#xs`) | Ground-Truth Anchor (`kinabalu_section_aa.json`) |
|---|---|---|
| `viewBox` | `0 0 1480 960` | — |
| Horizontal scale bar (`#scale-h`) | `165.70 px` per `100 km` = `1.6570 px/km` | — |
| Plotted span (`x=74.0` to `1454.0`, `1380 px`) | `832.83 km` | `832.84 km` (WGS84 Karney geodesic, Δ = 0.01 km) |
| Upper panel VE (`0–15 km`) | `17.25×` | Dual scale break at `15 km` |
| Lower panel VE (`15–60 km`) | `3.22×` | — |

## 3. Claim-by-Claim Reproduction Matrix `[OBS]`

| Claim / Requirement | Found on `HEAD` (`c81c505e`)? (`file:line`) | Fix Needed (Y/N) |
|---|---|---|
| Pixel-as-km labels (`385, 510, 690, 785, 860, 1150, 1454 km`) | **NO** — 0 km-text matches (resolved in `4e4fe05c`/`c81c505e`; only SVG geometry coords remain) | **N** |
| Regressed DRU `15.5–14.2 Ma` / `DRU separates Paleogene` | **NO** — 0 matches (resolved in `4e4fe05c`/`c81c505e`) | **N** |
| Unlocated `Crocker about 60 km` SVG label | **NO** — 0 matches (removed; MTM footnoted only) | **N** |
| Conflicting `230–540 km` Moho gap text | **NO** — 0 matches (standardized to `0–425 km` & `600–832.8 km`) | **N** |
| DRU tagged `diachronous` + NN-zones stated as ranges (not points) | **NO** — `grep diachronous` = 0 matches (`kinabalu-cross-section.html`) | **Y** |
| Trough-flank hard kick: `>=3` rival hypotheses + falsifier each | **PARTIAL** — 2 lithologies mentioned (`L399, L565`), missing 3rd hypothesis + per-hypothesis falsifiers | **Y** |
| Fault-type guard: `"software-default NORMAL is not proof of extension"` | **NO** — `grep software-default` = 0 matches | **Y** |
| Explicit `"Scope"` strip labeling regional-vs-Northern-Sabah bridge as `inferred` | **NO** — prose only in `#e3` (`L587`), no visible Scope strip | **Y** |
| 15-second above-the-fold clarity: 1-sentence question (`What is under Kinabalu: root, slab, or neither?`), 3 verdict chips (`MEASURED / INTERPRETED / UNTESTED`), `"Show what would change my mind"` toggle, true-scale `1:1` toggle, BM/EN toggle, footer build SHA/date/errata | **NO** — `grep "change my mind"` = 0 matches | **Y** |
| `/earth/lifecycle/index.html` observability page from live status JSON | **NO** — file does not exist | **Y** |
| Automated CI check (`scripts/check_earth_site.py`: label-range, forbidden strings, links, SVG) | **NO** — file does not exist | **Y** |
