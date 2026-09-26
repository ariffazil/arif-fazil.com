# arif-fazil.com — Surface Topology Audit
**Date:** 2026-09-27  
**Auditor:** kimi-code FI-008  
**Scope:** Read-only topology reconciliation across declarations, Caddy routes, build artifacts, and live responses. No registry created.

---

## 1) Existing Declared Topology

### `sites/arif-fazil.com/surfaces.json` (v2026-09-20, 776 lines)
- **Doctrine:** "If it is not in surfaces.json, it does not get served to a machine."
- **Surfaces:** 70+ entries with `path`, `title`, `mission`, `status` (`live`/`redirect`/`gone`), `type`, `priority`, `changefreq`.
- **Key live pages:** `/`, `/earth/`, `/pilot/`, `/institution/`, `/economics/`, `/world/`, `/world/makcikgpt/`, `/world/oil/`, `/world/gas/`, `/world/gold/`, `/words/writing/`, `/words/doctrine/`, `/vitals/`, `/human/`, `/machines/`, `/ledger/`, `/000/`, `/999/`.
- **Key redirects:** `/writing/` → `/words/writing/`, `/doctrine/` → `/words/doctrine/`, `/wealth/` → `/vitals/`, `/makcikgpt/` → `/world/makcikgpt/`, `/klci/` and `/usdmyr/` are **not listed** (they appear only in `sitemap.xml`).
- **Machine surfaces:** `/surfaces.json`, `/llms.txt`, `/llms.json`, `/page.json`, `/missions.json`, `/sitemap.xml`, `/feed.xml`, `/robots.txt`, `/rsl.xml`, `/soul.json`.
- **Federation subdomains:** `arifos`, `aaa`, `mcp`, `geox`, `wealth`, `well`, `forge` (declared but hosted on subdomains, not apex paths).

### `canon/sites.yaml` (v3.0.0, 326 lines)
- Older **Trinity IA** registry (ratified 2026-08-01) proposing scopes: `/arif` (sovereign), `/human`, `/institution`, `/earth`, `/laws`.
- Maps organs under `/institution/arifos`, `/institution/aaa`, `/institution/aforge`, `/institution/wealth`, `/earth/geox`, `/earth/hermes`, `/human/well`.
- **Drift:** Several proposed canonical paths (e.g. `/institution/makcikgpt`, `/arif/writings`, `/arif/vitals`) are **not routed** and differ from `surfaces.json`.

### `canon/redirects.yaml` (174 lines)
- Subdomain→apex redirects (e.g. `aaa.arif-fazil.com` → `/institution/aaa/`).
- 8 short aliases (`/makcikgpt`, `/vitals`, `/petronas`, etc.) that mostly **do not match** live Caddy aliases.
- Protocol exemptions for MCP endpoints and tombstones for internal-only hosts.

### `sites/arif-fazil.com/public/sitemap.xml` (370 lines)
- Generated view with manual additions: `/about`, `/human`, `/klci/`, `/usdmyr/`, `/gold/`, `/oil/`, `/gas/`, `/politics/ns-election/playbook/`, `/world/2027/malaysia/`, `/world/2027/receipts/`, `/world/2027/ai-agents-2027-dossier.pdf`.
- Several of these are **not present** in `surfaces.json`.

---

## 2) Actual Served Topology (from `/etc/caddy/vhosts/arif-fazil.com.conf`)

| Route pattern | Handler | Document root / target | Caddy line |
|---|---|---|---|
| `/` | static | `/var/www/html/arif/index.html` | 1089–1098 |
| `/pilot/*` | static | `/var/www/html/pilot/` (outside build tree) | 398–408 |
| `/human/*` | static | `/var/www/html/` | 412–422 |
| `/institution/*` | static | `/var/www/html/` | 424–434 |
| `/laws/*` | static | `/var/www/html/` | 436–446 |
| `/arif/*` | static | `/var/www/html/` | 448–458 |
| `/earth*` | static | `/var/www/html/` | 1862–1876 |
| `/world/*` | static | `/var/www/html/arif` (SPA fallback to `/world/index.html`) | 908–912 |
| `/world/politics/*` | static | `/var/www/html/` | 1058–1066 |
| `/words/*`, `/work/*` | static SPA | `/var/www/html/arif` | 918–940 |
| `/economics/*` | static | `/var/www/html/arif` | 628–632 |
| `/klci/*` | static | `/var/www/html/arif/klci` | 1582–1602 |
| `/usdmyr/*` | static | `/var/www/html/arif/usdmyr` | 1606–1626 |
| `/oil/*` | static + API proxy | `/var/www/html/oil/` + `localhost:3457` | 1422–1466 |
| `/gas/*` | static + API proxy | `/var/www/html/gas/` + `localhost:3458` | 1502–1546 |
| `/gold/*` | static + API proxy | `/var/www/html/gold/` + `localhost:3456` | 1468–1500 |
| `/vitals/*` | static | `/var/www/html/arif/static/wealth.html` | 85–89, 540 |
| `/wealth/` | static | `/var/www/html/arif/wealth/index.html` | 2013–2023 |
| `/map`, `/map/` | static | `/var/www/html/arif/map/index.html` | 1634–1652 |
| `/machine`, `/machine/` | static | `/var/www/html/arif/machine/index.html` | 1654–1672 |
| `/machines*`, `/for-machines*` | static | `/var/www/html/arif` | 1933–1955 |
| `/000/*` | static | `/var/www/html/arif/000` | 319–345 |
| `/999/*` | static / proxy | `/var/www/html/arif/999` + kernel proxy for `/999/verify`, `/999/health`, `/999/vault`, `/999/flow` | 333–1778 |
| `/ledger*` | static | `/var/www/html/arif/ledger` | 2257–2279 |
| `/health`, `/ready`, `/api/*`, `/mcp*`, `/sse*` | reverse_proxy | `127.0.0.1:8088` / local ports | 164–317 |
| `/.well-known/*` | static / redirect | `/var/www/html/.well-known` or subdomains | 92–150 |
| SPA catch-all `@spa_routes` | SPA fallback | `/var/www/html/arif/index.html` | 2313–2331 |
| Unknown paths | 404 | — | 2369–2372 |

---

## 3) Reconciliation

### Declared in `surfaces.json` but not routed as declared
- `/wealth/` — declared as **308 redirect** to `/vitals/`, but Caddy serves `/wealth/index.html` with **200**. **Drifted.**
- `/oil/`, `/gas/`, `/gold/` — declared as `/world/oil/`, `/world/gas/`, `/world/gold/` in `surfaces.json`, but Caddy serves standalone `/oil/`, `/gas/`, `/gold/` from `/var/www/html/{oil,gas,gold}/`. Paths are live but **source and canonical location mismatch**.

### Served but not declared in `surfaces.json`
- `/about` (sitemap only)
- `/laws/`, `/arif/` (canon/sites.yaml only)
- `/commodity/` (SPA catch-all only)
- `/politics/ns-election/playbook/`, `/world/2027/malaysia/`, `/world/2027/receipts/`, `/world/2027/ai-agents-2027-dossier.pdf` (sitemap only)
- `/health`, `/ready`, `/api/*`, `/mcp*`, `/sse*`, `/999/health`, `/999/vault`, `/999/flow`, `/.well-known/*` (machine/operator surfaces)

### Built in `dist/` but not routed (or routed via SPA fallback only)
- `/commodity/` exists in `dist/` and is reachable via `@spa_routes`, but is not declared.
- Most `dist/` contents are mirrored identically to `/var/www/html/arif` (top-level `comm` diff empty).

### External source overlays (live content outside build tree)
- `/pilot/` → `/var/www/html/pilot/index.html` (file mtime 2026-09-19)
- `/oil/`, `/gas/`, `/gold/` → `/var/www/html/{oil,gas,gold}/`
- `/world/politics/shadow/` → `/var/www/html/world/politics/shadow/`
- `/human/`, `/institution/`, `/laws/`, `/arif/` → `/var/www/html/` (Trinity scope pages)

---

## 4) Classification

| Class | Definition | Examples |
|---|---|---|
| **Canonical** | Declared in `surfaces.json`, routed, live, source matches intent | `/`, `/earth/`, `/world/`, `/world/makcikgpt/`, `/words/writing/`, `/vitals/`, `/map/`, `/machine/`, `/machines/`, `/ledger/`, `/000/`, `/999/` |
| **Alias** | Declared redirect in `surfaces.json`, routed as redirect | `/writing/`, `/doctrine/`, `/essays/`, `/read/`, `/makcikgpt/`, `/genesis/`, `/rss/`, `/canon/`, `/for-machines/` |
| **Legacy** | Old naming still routed, often via 301 | `/federation/` → `/doctrine`, `/discoveries/` → `/earth/`, `/constellation/` → `/doctrine`, `/wealth/article/` |
| **Experimental** | Live and routed, but **not** in `surfaces.json` | `/about`, `/laws/`, `/arif/`, `/commodity/`, `/politics/ns-election/playbook/`, `/world/2027/malaysia/`, `/world/2027/receipts/`, `/world/2027/ai-agents-2027-dossier.pdf` |
| **Hidden** | Machine/operator surfaces not in `surfaces.json` | `/health`, `/ready`, `/api/*`, `/mcp*`, `/sse*`, `/999/health`, `/999/vault`, `/999/flow`, `/.well-known/oauth-*` |
| **Drifted** | Declared state and live behavior mismatch | `/pilot/` (stale file outside build tree), `/wealth/` (returns 200 instead of 308) |

---

## 5) Published vs Build Reality

`/var/www/html/arif` is a byte-identical top-level mirror of `sites/arif-fazil.com/dist/` (`comm` diff empty). However, the following live surfaces are served from **outside** the build pipeline:

| Path | Live source | Build-pipeline source? |
|---|---|---|
| `/pilot/` | `/var/www/html/pilot/index.html` | No |
| `/oil/`, `/gas/`, `/gold/` | `/var/www/html/{oil,gas,gold}/` | No |
| `/world/politics/shadow/`, `/world/politics/shadow/anwar-ibrahim/` | `/var/www/html/world/politics/shadow/` | No |
| `/human/`, `/institution/`, `/laws/`, `/arif/` | `/var/www/html/` | No |
| Everything under `/var/www/html/arif/` | `sites/arif-fazil.com/dist/` | Yes |

---

## 6) Drift Table

| Path | Declared | Routed | Built | Live | Verdict | Recommended action |
|---|---|---|---|---|---|---|
| `/` | live page | static root | yes | 200 | Canonical | — |
| `/pilot/` | live page | static `/var/www/html/pilot/` | no | 200 | **Drifted** | Move into build tree or mark legacy; stale file outside repo |
| `/human/` | live page | static `/var/www/html/` | no | 200 | Canonical-external | Decide if Trinity page stays or merges into `/` |
| `/institution/` | live page | static `/var/www/html/` | no | 200 | Canonical-external | Add to build pipeline or document overlay |
| `/laws/` | not declared | static `/var/www/html/` | no | 200 | **Experimental** | Add to `surfaces.json` or retire |
| `/arif/` | not declared | static `/var/www/html/` | no | 200 | **Experimental** | Add to `surfaces.json` or retire |
| `/earth/` | live page | static `/var/www/html/` | yes | 200 | Canonical | — |
| `/economics/` | live page | static `/var/www/html/arif` | yes | 200 | Canonical | — |
| `/world/` | live page | static SPA fallback | yes | 200 | Canonical | — |
| `/world/makcikgpt/` | live page | dual lane (bot/human) | yes | 200 | Canonical | — |
| `/world/politics/shadow/` | live page | static `/var/www/html/world/politics/shadow/` | no | 200 | Canonical-external | Move into build pipeline |
| `/words/writing/` | live page | static SPA | yes | 200 | Canonical | — |
| `/words/doctrine/` | live page | static SPA | yes | 200 | Canonical | — |
| `/vitals/` | live page | static wealth deck | yes | 200 | Canonical | — |
| `/wealth/` | redirect → `/vitals/` | static `/wealth/index.html` | yes | 200 | **Drifted** | Enforce 308 redirect or update `surfaces.json` |
| `/oil/`, `/gas/`, `/gold/` | live page (`/world/...`) | static `/var/www/html/{oil,gas,gold}/` | no | 200 | Canonical-external | Reconcile canonical path vs standalone route |
| `/klci/`, `/usdmyr/` | not declared | static `/var/www/html/arif/...` | yes | 200 | **Alias** | Add to `surfaces.json` as aliases |
| `/commodity/` | not declared | SPA catch-all | yes | 200 | **Experimental** | Add to `surfaces.json` or remove from `@spa_routes` |
| `/about` | not declared | static SPA | yes | 200 | **Experimental** | Add to `surfaces.json` or remove |
| `/map/`, `/machine/`, `/machines/` | live pages | static | yes | 200 | Canonical | — |
| `/ledger/` | live page | static | yes | 200 | Canonical | — |
| `/000/`, `/999/` | live pages | static | yes | 200 | Canonical | — |
| `/999/health`, `/999/vault`, `/999/flow` | not declared | proxy / static | partial | 200 | **Hidden** | Add to `surfaces.json` as machine surfaces |
| `/health`, `/ready`, `/api/*`, `/mcp*`, `/sse*` | not declared | reverse_proxy | no | 200 | **Hidden** | Document in machine catalog |
| `/politics/ns-election/playbook/` | sitemap only | static SPA | yes | 200 | **Experimental** | Add to `surfaces.json` |
| `/world/2027/malaysia/`, `/world/2027/receipts/`, `/world/2027/ai-agents-2027-dossier.pdf` | sitemap only | static | yes | 200 | **Experimental** | Add to `surfaces.json` |
| `/pulse/` | gone | 410 | yes | 410 | Canonical-tombstone | — |

---

## 7) Proposed Canonical Tree

This is a **proposal** mapping current live surfaces onto the sovereign's layered model. Surfaces with no natural home are flagged below.

```
arif-fazil.com
├── HUMAN
│   └── /human/
├── INSTITUTION / AGENT
│   ├── /institution/
│   ├── /institution/arifos/   (currently /arifos/)
│   ├── /institution/aforge/   (currently redirects to subdomain)
│   ├── /institution/aaa/      (currently /aaa/)
│   └── /institution/wealth/   (currently /wealth/malaysia/ etc.)
├── EARTH
│   ├── /earth/
│   └── /earth/hermes/
├── WORLD
│   ├── /world/
│   ├── /world/makcikgpt/
│   ├── /world/politics/
│   ├── /world/2027/
│   └── /malaysia/ → /world/malaysia/
├── WORDS
│   ├── /words/writing/
│   └── /words/doctrine/
├── WORK
│   └── /work/missions/        (currently /missions)
├── ARIFOS
│   ├── /arifos/
│   ├── /000/
│   └── /999/
└── MACHINE / VITALS / VERIFY / STATUS
    ├── /machine/  (+ /machines/ → /machine/)
    ├── /map/
    ├── /vitals/
    ├── /verify/
    ├── /status/  (currently redirects to geox)
    └── /ledger/
```

### Surfaces with no home in the proposed tree
- `/pilot/` — commercial offer surface; does not fit HUMAN/INSTITUTION/EARTH/WORLD/WORDS/WORK/ARIFOS/MACHINE.
- `/about` — orphan about page; should merge into `/` or `/human/`.
- `/economics/`, `/oil/`, `/gas/`, `/gold/`, `/klci/`, `/usdmyr/` — capital/commodity dashboards; currently overlap WORLD and standalone routes. Suggest nest under `/world/economics/` or `/institution/wealth/markets/`.
- `/commodity/` — SPA-only route not declared anywhere.

---

## 8) Summary Counts

| Classification | Count |
|---|---|
| Canonical | ~28 |
| Alias | ~14 |
| Legacy | ~6 |
| Experimental | ~12 |
| Hidden | ~10 |
| Drifted | 2 (`/pilot/`, `/wealth/`) |

**Critical drift:** `/wealth/` returns 200 where `surfaces.json` declares 308 → `/vitals/`. `/pilot/` is a stale file outside the build tree (mtime 2026-09-19).
