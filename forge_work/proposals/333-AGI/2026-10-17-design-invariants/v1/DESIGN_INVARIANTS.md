# DESIGN_INVARIANTS — arif-fazil.com Ψ Human Surface

> **STATUS:** PROPOSAL · 2026-10-17 · awaiting F13 ratification
> **AUTHOR:** 333-AGI (auto-execute session, F13 `auto go` directive)
> **INTENDED CANON HOME:** `/root/arif-fazil.com/sites/arif-fazil.com/DESIGN_INVARIANTS.md`
> **RATIFICATION PROTOCOL:** F13 SOVEREIGN seal → move from proposal zone to canonical site repo.
> **DOCTRINE:** DITEMPA BUKAN DIBERI — the pixels are forged, not given.

---

## 0. Why this file exists

Per `arif-fazil-site-ops` scar:
> "**Agent-chrome creep — every 'small addition' turns a journalism brand into a GitHub repo** (2026-08-11). … `DESIGN_INVARIANTS.md` declares what is and isn't allowed in visual surfaces. Read this BEFORE touching any visual HTML."

This file is the missing rulebook. Every agent that authors or patches a visual surface on this site MUST read this before acting. Each rule below is enforced by:
- `scripts/design-lint.sh` — to be authored (link below).
- Manual review for proposed promotions to canon.

## 1. Visual chrome — what is FORBIDDEN

The following strings MUST NOT appear in any rendered surface on arif-fazil.com (under `data-ring="SOUL"` — the human surface):

| Forbidden string | Reason |
|---|---|
| `Canonical landing:` | agent self-disclosure; humans don't need to know |
| `WHERE AM I?` | drift between nav and reading flow |
| `WHY CARE?` | instructional scaffolding, not journalism |
| `Source of truth:` (visible in body / footer) | agents' source-tracking leaks into surface |
| `Rendered by scripts/...` | same — agent origin disclosure |
| `URL: /foo` (next to a heading) | URL is in the address bar and JSON-LD already |
| `<!-- last verified ... -->` | visible timestamp tells humans what is shown was checked, which is false unless verified inline |

If any of the above leaks into a `public/**/index.html` or `src/**/*.tsx`, the design-lint.sh check (when written) returns exit 1.

## 2. Visual chrome — what IS allowed

| Allowed | Form |
|---|---|
| Hero text with persona voice | "Constitutional Essays" / "Sovereign reading room — …" |
| Persona signature footer | `DITEMPA BUKAN DIBERI — Forged, not given.` |
| Series badges with semantic meaning | `S4` (Governance Canon), `S6` (Eureka Trilogy), `S8` (Forge + Site), `SITE` (Constitution surface) — only on writing/essays surface |
| Date stamps in human-readable form | `2026-10-17` (ISO yyyy-mm-dd) |
| 999 SEAL stamp | in hero or footer; NEVER inline as `seal: 999` mid-body |
| Site links in footer (max 4) | `HOME / WORLD / LLMS.TXT / DOCTRINE` style short list |
| Bahasa village voice in BM essays | consistent with `makcik-voice` rule for `/world/makcikgpt/` |

## 3. Metadata — what goes where

Metadata is for machines, not for humans. The mapping is enforced:

| Metadata kind | Surface |
|---|---|
| Source-of-truth pointer | `<link rel="alternate" type="application/json" href="/words/writing/index.json">` in `<head>` |
| Canonical URL | `<link rel="canonical" href="...">` in `<head>` |
| Last-updated timestamp | `<meta name="arif-corpus-as-of" content="...">` (machine-only, never visible) |
| File authority | `data-*` attributes on `<html>` or `<body>` (machine-only) |
| Schema.org types | JSON-LD `<script type="application/ld+json">` block (machine-only) |
| Agent discovery manifest | `/.well-known/ard.json`, `/.well-known/ai-catalog.json`, `/.well-known/webmcp.json` (separate surfaces) |
| LLM digest | `/llms.txt`, `/llms-full.txt` (separate surfaces) |
| Tag chips on cards | visible but with semantic meaning (see series list in §2) |

NEVER put agent-internal metadata in the visible body, footer, or hero. The ARIF FAZIL doctrine: "Paginated printed-looking reader pages, not agent consoles."

## 4. Atlas 4D room typing

Every route declares its semantic lane via the 4 attributes on `<html>`:

```
data-ring="SOUL|MIND|BODY|ORGAN"
data-plane="narrative|proof|organ|domain|hub"
data-lane="words|earth|house|machines|..."
data-room="words|<room-name>"
```

This is the canonical labeling. `AtlasGate.tsx` (CANON, owned by ARIF) reads the route table and sets these. `SENSE_ALIGN` gate (per arif-sites-content-ops) verifies them.

If a route's room is not declared in `/root/web-canon/canon/atlas.yaml`, the agent MUST `STOP` and request F13 to declare it. No agent invents a lane.

## 5. Color law

Per `/root/web-canon/canon/design-tokens.json`:
- Primer colors only: red, blue, yellow, and their honest mixtures (green = blue + yellow).
- Red is rationed: SOVEREIGN, VERDICT, SEAL, VOID. Red appears only on `/arif/*` strip, verdict chips (888_HOLD, VOID), seal marks (999). Otherwise red = nothing.
- Neutral bedrock: warm paper (human side), carbon (agent side).

## 6. Geometry law

| Surface | Radius | Notes |
|---|---|---|
| Constitutional organ cards | 2px | cold, mechanical |
| Human reading cards | 12px | warm, held |
| Heroic / invocation surfaces | full (50%) | circle, mandala, ring, sovereignty badge |

`max_torus_per_view = 1`. Two toruses per page = design VOID.

## 7. Trust & provenance

Every visual surface MUST also publish machine-readable provenance:
- `arif-room` meta tag (e.g., `words`)
- `arif-job` meta tag (one short sentence in persona voice)
- `arif-corpus-count`, `arif-corpus-languages`, `arif-corpus-as-of` if surface is a corpus index
- `arif-generator` meta tag pointing at the script/file that produced the surface (when surface is DERIVED)
- `<link rel="alternate" type="application/json">` always pointing at the canonical machine-readable counterpart

## 8. Reversibility

Any change to a visual surface MUST:
1. Backup source file with UTC timestamp: `.bak-YYYYMMDDTHHMMSSZ-pre-<reason>`
2. Render via generator if classified DERIVED (per `/root/arif-fazil.com/canon/file-authority.yaml`)
3. Verify via `make verify-pages` gate
4. Update `surfaces.json` and `sitemap.xml` if route list changed
5. Update `llms.txt` if entry-point set changed

## 9. Lint enforcement (target)

Proposed `scripts/design-lint.sh` (does not yet exist — to be authored):

```bash
#!/usr/bin/env bash
# scans public/**/*.html + src/**/*.{tsx,ts,css} for any of the 6 forbidden strings
# exit 1 on any hit
# wire to prebuild chain in package.json
FORBIDDEN=(
  "Canonical landing:"
  "WHERE AM I?"
  "WHY CARE?"
  "Source of truth:"
  "Rendered by scripts/"
  "<!-- last verified"
)
# regex scan…
```

## 10. Exceptions

| Exception | Where | Why |
|---|---|---|
| "Source of truth:" in DOCTRINE surface only | `/words/doctrine/` | that page exists to explain sources to humans |
| "Rendered by" in machine surfaces | `.well-known/*.json`, `llms.txt`, `llms-full.txt` | those surfaces exist to expose origin to machines |
| Stat chip showing "sealed 999" or "Updated YYYY-MM-DD" | `/words/writing/`, `/world/makcikgpt/` listings | readers benefit from corpus freshness at a glance |

## 11. Change protocol

Any change to visual invariants MUST follow:
1. Read this file + atlas.yaml + design-tokens.json + design-primer.md + a current visible surface for context.
2. Open a proposal in `forge_work/proposals/<agent-id>/<mission>/` with HTML/CSS diff + reasoning.
3. Surface the proposed change to F13 with rationale.
4. F13 ratifies → file moves from proposal zone to canon. After canon, `scripts/design-lint.sh` runs in the prebuild chain and exits 1 on any violation.

## 12. References

- `/root/web-canon/canon/design-primer.md` — PRIMER-1 design canon (tokens, geometry, motion)
- `/root/web-canon/canon/design-tokens.json` — machine-readable tokens
- `/root/web-canon/canon/design-rules.json` — lintable invariants (red rationing, radii, etc.)
- `/root/web-canon/canon/page-instruments.json` — route hero law
- `/root/web-canon/scripts/verify-design-canon.cjs` — 66-check lint gate
- `/root/arif-fazil.com/canon/file-authority.yaml` — file states + lease model
- `/root/arif-fazil.com/sites/arif-fazil.com/public/AGENTS.md` — site-level agent rules
- `/root/arif-fazil.com/AGENTS.md` — site deploy gate (make verify-pages)

## 13. Witness signature

Authored 2026-10-17 by 333-AGI (OpenCode) within the F13 SOVEREIGN 'auto go' directive during the cross-surface audit session. Generator file: `forge_work/proposals/333-AGI/2026-10-17-design-invariants/v1/` (3 files: this file + README + FORGE_RECEIPT).

## 14. Status-rendering separation (anti-conflation guard)

Warns against a specific sibling-agent scar pattern. In August 2026, the mcp.arif-fazil.com front page rendered the literal text "Degraded" on the surface whenever the kernel reported `execution_readiness: "held"` — because the page JS conflated three orthogonal kernel fields:

| Kernel field | What it actually means | What it DOESN'T mean |
|---|---|---|
| `status: "healthy"` | System-wide operational | Anything beyond "alive enough" |
| `execution_readiness: "held"` | Kernel in F13 idle HOLD; awaiting sovereign input. NOT a defect — the canonical normal state between decisions. | System is broken |
| `service_health: "green"` | All measured surfaces are passing their floors | Idle waiting |
| `degraded_layers: [...]` | List of failing layers; empty = all green | Always empty in normal run |

The kernel was never broken. The page text was wrong.

**Mandatory separation rule:** Any JS that renders page status text MUST distinguish these fields:

```js
// CORRECT pattern (vetted against current served file)
const res = await fetch('/health');
if (res.ok) {
  const h = await res.json();
  // Kernel status — only ever render "Degraded" when actually degraded
  if (h.status === 'healthy') {
    // healthy: positive labels OK
  }
  if (h.status !== 'healthy') {
    // ONLY render negative label here
  }
  // Execution readiness — separate axis; render "Held" or "Idle", NOT "Degraded"
  if (h.execution_readiness === 'held') {
    // "Held" / "Idle" / "Awaiting Sovereign" — never "Degraded"
  }
  // service_health — separate axis; render colour-mapped value
}
```

**FORBIDDEN pattern (the bug that survived until 2026-10-13):**

```js
// NEVER confuse kernel.status with execution_readiness
const isHealthy = data.status === 'healthy';
const sm = document.getElementById('status-main');
if (sm) sm.textContent = isHealthy ? 'Operational' : 'Degraded';
```

The above is logically correct ONLY if `data` is the kernel's `status` field. The bug pattern is when `data` is interpreted as `execution_readiness` or when a downstream consumer reads the page "Degraded" text and infers the kernel is degraded. Either way: **never render "Degraded" in response to `execution_readiness: held`**.

**Scar:** SCAR-MCP-PAGE-DEGRADED-CONFLATION-2026-08-04 → RESOLVED 2026-10-13T23:09:28+08:00 by qwen-code/FI-003 commit `573beb847d53` ("fix(mcp): renumber arif_judge from 888 to 666 and guard floor ratio template"). The fix removed the buggy `isHealthy ? Operational : Degraded` branch and replaced it with a simple `floors_pass/floors_target` numeric display — never text-asserting "Degraded".

**Lint enforcement:** the proposed `scripts/design-lint.sh` (§9) MUST add a CSS/XPath rule scanning for any JS substring matching:

```
data\.status\s*===\s*['"]healthy.*\?.*['"](Degraded|Operational)['"]
```

or any textContent/innerHTML assignment to a status span with literal `'Degraded'` or `"Degraded"` on the right-hand side when LHS is an execution_readiness-derived boolean. Exit 1 on any hit.

DITEMPA BUKAN DIBERI ⚒️
