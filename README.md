<!-- SOT-MANIFEST
federation_release: v2026.09.13
last_verified: 2026-09-13T06:32:00Z
live_commit: b091f33
scope: /root/arif-fazil.com → ariffazil/arif-fazil.com
epistemic_status: OBS
apex_zen: A2A delegates ⊥ MCP equips ⊥ ACT mutates ⊥ arifOS governs ⊥ F13 decides
truth_rule: live git push + Cloudflare deploy beat any static count in prose
doctrine: Satu domain. Satu web surface. Banyak organ, tetap bersempadan.
-->

# 🌐 arif-fazil.com — Unified Federation Web Surface

[![Site Integrity](https://github.com/ariffazil/arif-fazil.com/actions/workflows/audit.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-fazil.com/actions)
[![Build](https://github.com/ariffazil/arif-fazil.com/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-fazil.com/actions)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](./LICENSE)

> **arif-fazil.com is the surface. One domain. Many organs. One truth.**
> **DITEMPA BUKAN DIBERI — Forged, Not Given.**

**arif-fazil.com** is the unified public **human world model** for the arifOS Federation — one entry point for humans, agents, and scrapers.

**Organ domains** (`geox` · `wealth` · `well` · `mcp` · `arifos` …) are **agent doors and MCP edges**, not rival human home pages. Link them from machine footer / Federation / Connect; do not put them on the primary nav. Full map: [`docs/AGENTIC_WEB_WORLD_MODEL.md`](./docs/AGENTIC_WEB_WORLD_MODEL.md). Narrative organ paths stay under the apex (`/arifos/`, `/geox/`, …). Legacy subdomains redirect or serve protocol doors — never delete, never break.

---

## 🏛️ What This Repo Owns

This repo owns the **SURFACE** — the observable face of every federation organ:

```
One domain. One web surface. All federation organs exposed as paths.
```

```mermaid
graph TB
    subgraph EDGE [☁️ Cloudflare Edge]
        CF[Cloudflare Pages<br/>Auto-deploy on git push]
    end
    CF -->|routes| CADDY[🔄 Caddy :443<br/>Reverse Proxy]
    subgraph VPS [🖥️ VPS af-forge]
        CADDY --> ROOT[arif-fazil.com/<br/>React 19 Cockpit]
        CADDY --> ARIFOS[/arifos/ — Observatory]
        CADDY --> AAA[/aaa/ — Control Plane]
        CADDY --> GEOX[/geox/ — Earth Lab]
        CADDY --> WEALTH[/wealth/ — Capital]
        CADDY --> WELL[/well/ — Readiness]
        CADDY --> FORGE[/forge/ — Execution]
        CADDY --> MCP[/mcp/ — Gateway]
        CADDY --> WIKI[/wiki/ — Knowledge]
    end
```

---

## 🌐 Unified Path Structure

Measured 2026-10-22 against live routing (curl, status + redirect target):

```
https://arif-fazil.com/
├── /               ← React 19 Cockpit (SPA)
├── /000/           ← Genesis / Identity                      [200]
├── /999/           ← Seal Verification                        [200]
├── /arifos/        ← Observatory & Proof                      [200, apex path]
├── /aaa/           → 301  https://aaa.arif-fazil.com/         (subdomain serves it)
├── /geox/          → 308  https://geox.arif-fazil.com/        (subdomain serves it)
├── /wealth/        → 308  /vitals/                            (capital pulse lives at /vitals/)
├── /well/          ← Human Readiness                          [200, apex path]
├── /forge/         → 301  https://forge.arif-fazil.com/       (subdomain; MCP edge)
├── /mcp/           → 307  /mcp  (protocol door — GET returns 405; POST JSON-RPC only)
├── /wiki/          → 301  https://wiki.arif-fazil.com/        (subdomain serves it)
├── /world/         ← World hub: Atlas · Keluarga Bayang · Markets (KLCI/USD-MYR) · Oil/Gas/Gold
├── /world/politics/shadow/   ← PM Bayang                      [200, registry live]
├── /world/ai/shadow/         ← AI Labs Bayang                 [200, registry live]
├── /world/petronas/shadow/   ← Kerusi Bayang                  [200, registry live]
├── /oil/ /gas/ /gold/        ← Commodity Dashboards           [200]
├── /earth/         ← Earth Evidence                           [200]
├── /words/writing/ ← Sovereign Essays (canonical — /essays/ 308s here)
├── /doctrine/      ← Doctrine (canonical — /federation/ 301s here)
├── /work/proof/    ← Proof Pack (canonical — /proof/ 308s here)
└── /_shared/       ← Design System & Assets
```

---

## 🔄 Legacy Subdomain Redirects

Organ surfaces live on their own subdomains; apex paths redirect TO them
(direction is subdomain-ward, measured 2026-10-22):

| Apex path | → | Organ home | Status |
|-----------|---|------------|--------|
| `/aaa/` | → | `aaa.arif-fazil.com` | 301 |
| `/geox/` | → | `geox.arif-fazil.com` | 308 |
| `/forge/` | → | `forge.arif-fazil.com` | 301 |
| `/wiki/` | → | `wiki.arif-fazil.com` | 301 |
| `/mcp/` | → | protocol door (POST JSON-RPC; GET 405) | 307 |

Apex-native paths (serve directly, no subdomain): `/arifos/`, `/well/`, `/earth/`,
`/world/*`, `/words/*`, `/work/*`, `/vitals/`, `/oil/`, `/gas/`, `/gold/`, `/000/`, `/999/`.

Subdomain → apex legacy aliases that still resolve (200): `arifos`, `wealth` (→ `/vitals/`),
`well`, `mcp` subdomains all respond; none were broken.

---

## 🏗️ Repository Structure

```
arif-fazil.com/
├── sites/                    # Static frontends
│   ├── arif-fazil.com/       # React 19 + Vite 8 Cockpit
│   ├── aaa.arif-fazil.com/   # Control Plane surface
│   ├── arifos.arif-fazil.com/ # Observatory docs
│   ├── geox.arif-fazil.com/  # Earth Lab GUI
│   ├── wealth.arif-fazil.com/ # Capital surface
│   ├── wiki.arif-fazil.com/  # Constitutional wiki
│   └── shared/               # Design system assets
├── apps/                     # Dynamic product UIs
├── infra/                    # Constitutional manifests, domain routing
├── scripts/                  # Deployment & audit scripts
├── surfaces.json             # ⭐ CANONICAL surface registry (repo root, 2026-10-22) —
│                             #    112 entries (74 live / 37 redirect / 1 gone); sitemap,
│                             #    discovery views and DTI gates generate from this
├── deploy-vps.sh             # VPS deployment script
└── verify-pages.sh           # ⛔ Deploy gate — must pass before seal
```

**Registry rule (2026-10-22):** if a surface is not in `surfaces.json`, it is not
served to machines. Adding a page = register it here first; sitemap and discovery
views regenerate from this one source.

---

## 🏛️ Federation Navigation

| Organ | Role | Port | Repo | MCP | Health | LLMs |
|:---|:---|:---:|:---|:---|:---|:---|
| **⚖️ arifOS** | Constitutional Kernel — judges, seals | 8088 | [repo](https://github.com/ariffazil/arifos) | [mcp](https://mcp.arif-fazil.com/mcp) | [health](https://arifos.arif-fazil.com/health) | [llms.txt](https://arifos.arif-fazil.com/llms.txt) |
| **⚒️ A-FORGE** | Execution Engine — builds, deploys | 7071/72 | [repo](https://github.com/ariffazil/A-FORGE) | [mcp](https://forge.arif-fazil.com/mcp) | [health](https://forge.arif-fazil.com/health) | [llms.txt](https://forge.arif-fazil.com/llms.txt) |
| **🏛️ AAA** | Control Plane — A2A gateway, cockpit | 3001 | [repo](https://github.com/ariffazil/AAA) | — | [health](https://aaa.arif-fazil.com/health) | [llms.txt](https://aaa.arif-fazil.com/llms.txt) |
| **🌍 GEOX** | Earth Intelligence — seismic, wells | 8081 | [repo](https://github.com/ariffazil/GEOX) | [mcp](https://geox.arif-fazil.com/mcp) | [health](https://geox.arif-fazil.com/health) | [llms.txt](https://geox.arif-fazil.com/llms.txt) |
| **💰 WEALTH** | Capital Intelligence — NPV, risk | 18082 | [repo](https://github.com/ariffazil/WEALTH) | [mcp](https://wealth.arif-fazil.com/mcp) | [health](https://wealth.arif-fazil.com/health) | [llms.txt](https://wealth.arif-fazil.com/llms.txt) |
| **🫀 WELL** | Vitality Guard — human readiness | 18083 | [repo](https://github.com/ariffazil/WELL) | [mcp](https://well.arif-fazil.com/mcp) | [health](https://well.arif-fazil.com/health) | [llms.txt](https://well.arif-fazil.com/llms.txt) |
| **🔮 HERMES** | Multi-Modal Bridge — Telegram relay | 8644 | [repo](https://github.com/ariffazil/HERMES) | — | — | — |
| **🌐 arif-fazil.com** | Public Web Surface — one domain | 443 | [repo](https://github.com/ariffazil/arif-fazil.com) | — | [verify](https://arif-fazil.com/999/verify) | — |

---

## 🏛️ Separation of Powers

| Layer | Role | Can | Cannot |
|-------|------|-----|--------|
| **ARIF** | Sovereign | Veto, approve, decide | Be overridden |
| **arifOS** | Judge | Issue SEAL/HOLD/VOID/SABAR | Execute mutations |
| **AAA** | State / Cockpit | Display, route, queue, register | Judge, execute, seal |
| **Domain Organs** | Witnesses | Compute and reflect evidence | Decide alone |
| **A-FORGE** | Executor | Build, deploy, mutate | Self-authorize |
| **arif-fazil.com** | Public Surface | Host surfaces, route domains | Adjudicate, compute |
| **VAULT999** | Ledger | Record immutable seals | Edit or delete history |

> AAA routes and displays. arifOS judges. Domain organs witness. A-FORGE executes. arif-fazil.com hosts the surface. VAULT999 records. ARIF decides.

---

---

## 🛡️ CI Governance (F13 verdict 2026-08-10)

This repo follows the federation's CI governance pattern (replicated from `ariffazil/arifOS` PR #683). The pattern ensures Dependabot PRs receive a real, reproducible unprivileged verdict — no more all-red check rolls from structurally-incompatible gates.

**Per-repo adapter** (see `.github/workflows/` for the actual files):

- `.github/dependabot.yml` — `uv` (Python) / `cargo` (Rust) / `npm` (TypeScript) ecosystem; cooldown 3d; open-PRs 5; constitutional packages un-grouped (no `ignore:` — visibility preserved)
- `.github/workflows/dependabot-ci.yml` — unprivileged gate; runs ONLY on Dependabot PRs; SHA-bound probes
- `.github/workflows/{ci-uv-lock-invariant|cargo-lock-invariant|npm-lock-invariant}.yml` — universal `{uv lock --check && uv sync --frozen | cargo check --locked && cargo build --locked | npm ci}` invariant on every PR + push to main
- `.github/workflows/auto-merge-dependabot.yml` — constitutional package denylist (per-language); F13 review the only merge path
- Privileged workflows gated with `if: github.actor != 'dependabot[bot]' && github.actor != 'app/dependabot'` — so they SKIP for Dependabot PRs where their inputs cannot be satisfied

**Constitutional packages** (denied auto-merge, require F13 review):

| Language | Denylist |
|---|---|
| Python | `protobuf`, `cryptography`, `fastmcp-slim`, `fastmcp`, `caio`, `sentence-transformers`, `pynacl`, `blake3` |
| Rust    | `serde`, `tokio`, `hyper`, `axum`, `reqwest`, `rustls`, `async-trait`, `clap`, `tracing` |
| TypeScript | `zod`, `@modelcontextprotocol/sdk`, `fastmcp`, `mcp-sdk`, `tsx`, `vitest`, `@types/node`, `typescript`, `ts-node` |
| Static site | `vite`, `react`, `react-dom`, `react-router`, `@tanstack/react-query`, `tailwindcss` |

**Reference:** [`/root/AGENTS.md`](/root/AGENTS.md) — canonical federation doctrine. `AAA/docs/ORGAN.md` — topology.

DITEMPA BUKAN DIBERI — governance is forged, not given.

## External Footprint & Discovery

arif-fazil.com is the public ingress and federation web constellation entry point.

- **Discoverable:** YES (Public web domains, Caddy gateway)
- **Installable / Callable:** YES (Web pages, client configs, public `/llms.txt`)
- **Inspectable & Forkable:** YES
- **Independent Validation:** NOT YET ESTABLISHED

Canonical Witness Ledger: [EXTERNAL_WITNESS_LEDGER.md](https://github.com/ariffazil/arifOS/blob/main/docs/EXTERNAL_WITNESS_LEDGER.md)

---

## 📜 Sovereignty & License

- **License:** GNU Affero General Public License v3.0 (**AGPL-3.0**)
- **Sovereign:** **Muhammad Arif bin Fazil** (F13 SOVEREIGN)

> *DITEMPA BUKAN DIBERI — Forged, Not Given.*  
> *Satu domain. Satu web surface. Banyak organ, tetap bersempadan. 999 SEAL ALIVE.*
