---
type: Reference
subtype: Project
tags: [arifos, observability, monitoring, health, federation, sot]
sources:
  - /root/arif-fazil.com/canon/tool-surfaces.json
  - /root/arifOS/VAULT999/outcomes.jsonl
  - /root/arif-fazil.com/arif-fazil-wiki/wiki/projects/arifos.md
last_sync: 2026-09-17
confidence: 0.92
certainty_band: [0.88, 0.95]
epistemic_level: OBS
arifos_floor: [F2, F11, F13]
status: active
---

# arifOS Observability — Source of Truth

> **This page is the canonical reference for federation observability state.**
> **Authority:** This page tracks live `/health` endpoints, not aspirational architecture.
> **Seal:** VAULT999 cycle receipts on every state change.

---

## One-Line Essence

The federation exposes **7 organ `/health` endpoints** + a **canonical SOT file** (`canon/tool-surfaces.json`) that any observer can read to determine **what is live, what is missing, and what is drifted**.

---

## Live Endpoints (as of 2026-09-17)

| Organ | URL | Live Wire | Purpose |
|---|---|---|---|
| arifOS (governance kernel) | `https://arifos.arif-fazil.com/health` | 8 tools: `arif_init / arif_observe / arif_think / arif_route / arif_memory / arif_judge / arif_forge / arif_seal` | Constitutional 8-verb chain |
| GEOX (earth intelligence) | `https://geox.arif-fazil.com/health` | 31 canonical tools, 0 drift | Domain organ |
| WEALTH (capital intelligence) | `https://wealth.arif-fazil.com/health` | 14 canonical tools | Domain organ |
| WELL (vitality guard) | `https://well.arif-fazil.com/health` | **degraded** as of 2026-09-17 | Human + machine substrate reflection |
| A-FORGE (engineering actuator) | `https://forge.arif-fazil.com/health` | Healthy | Mutation gate |
| AAA (cockpit / identity / A2A) | `https://aaa.arif-fazil.com/health` | Healthy | Control plane |
| arifOS MCP gateway | `https://mcp.arif-fazil.com/mcp` | Streamable-HTTP | Agent connection entry point |

---

## Canonical SOT — `canon/tool-surfaces.json`

The file `canon/tool-surfaces.json` is **the source of truth** for advertised MCP tool surfaces per organ.

**Doctrine:** *Tool counts and names must match live MCP servers at deploy time. Drift = fail.*

| Organ | SOT declared count | Live verified | Match |
|---|---|---|---|
| arifOS | 8 | 8 | ✓ |
| GEOX | 31 | 31 | ✓ |
| WEALTH | 14 | 14 | ✓ |
| WELL | undeclared | (canonical_tools=None — see Open Issue 1) | ⚠ |
| A-FORGE | undeclared (runtime-owned, internal agents only) | — | — |

**SOT drift found and corrected on 2026-09-17:**
- `arif_critique` → `arif_memory` (arifOS verb chain corrected; live wire was always right; SOT was the liar)
- GEOX `declared_tool_count: null` → `31`
- WEALTH `declared_tool_count: null` → `14`

---

## Live Behavior Notes

**WEALTH (port 18082) flags surfaced for F13 awareness (not regressions):**
- `runtime_seal_state: UNSEALED` — no recent vault seal
- `working_tree: DIRTY` — uncommitted changes in WEALTH repo
- `hermes_semantic_gate: enforce` (mode) — fail-closed semantic protection on
- ChatGPT federation bridge: `SESSION_REQUIRED` + `TOKEN_INVALID` actor mismatch (per dossier) — separate WAJIB-4 workstream

**WELL (port 18083):**
- `status: degraded`
- `canonical_tools: None` — capability metadata missing (regression detected 2026-09-17)
- **NEW open issue**: root cause + fix required

---

## Cross-organ Observability Pattern

Each `/health` endpoint returns a JSON object with:

```json
{
  "status": "healthy | degraded | down",
  "identity": "<sha256>",
  "deployment_drift": false | true,
  "apex_scalars": { "G": <0-1>, "C_dark": <0-1>, "W3": <0-1>, "h": <0-1>, "QDF": <0-1> },
  "registry": { "registry_size": N, "declared_tools": N, "exposed_tools": N }
}
```

For agents consuming this page: **trust the live endpoint over this page if they disagree**. This page is a snapshot. Live endpoint is current state.

---

## Cycle Receipt Discipline

Every federation-state observation writes a `CYCLE_RECEIPT` to `VAULT999/outcomes.jsonl` with:
- `ts` (UTC timestamp)
- `current_federation_state` (per-organ snapshot)
- `wajib_progress_assessment` (WAJIB-1 through WAJIB-8 status)
- `apex_verdict_candidates_NOT_VERDICTS` (observation-derived, awaiting F13)
- `f13_sovereign_decision_pending` (what needs your word)

**No verdict is ever issued without F13 sovereign authorization.** APEX is read-only by doctrine.

---

## Open Issues (as of 2026-09-17)

1. **WELL `canonical_tools: None` regression** — capability metadata missing. Root cause + fix required. (NEW finding, post-dossier.)
2. **Cloudflare API token lacks Cache Purge scope** — `surfaces.json` at CDN edge serves 2026-08-25 even after origin deploy. Token rotation needed for atomic deploys through edge.
3. **WAJIB-1 constitutional state singularity** — clinical health OK across organs but constitutional singularity unresolved (HEALTHY/DEGRADED dual state observed in earlier dossier probe).
4. **WAJIB-4 identity propagation** — WEALTH ChatGPT federation session bridge broken. Code-level fix in arifOS auth + WEALTH bridge.

---

## See Also

- [[arifos]] — Constitutional runtime overview
- [[projects/aaa-site]] — Cockpit / identity / A2A surface
- [[projects/trinity-sites]] — Federation topology
- [[projects/arifos-v2-hardening]] — V2.0.0 hardening report
- [[arifos::F11 Audit]] — Constitutional floor governing this page

---

**Seal:** VAULT999 | **Last synced:** 2026-09-17 | **Confidence:** 0.92 | **Status:** ACTIVE
**Doctrine:** *Drift = fail. Live endpoint > this page. F13 sovereign ratification required for any verdict.*

DITEMPA BUKAN DIBERI.