# SUPERSEDED 2026-10-05 — see `slice-1-evaluation-foundation.md`

This proposal is preserved for audit history. The slice-1 scope was re-prioritized by F13's 2026-10-05 directive:
> "Your next concrete build should be the evaluation foundation for the website upgrade: establish representative reader journeys, evidence checks, authority failure cases and a reproducible baseline; then improve the shared navigation and one complete domain journey against those tests."

Replaced by `/root/arif-fazil.com/forge_work/proposals/fi003-qwen/mission-2026-10-05/slice-1-evaluation-foundation.md`.

Catalog + nav (the original slice 1) is now **slice 2** in the re-prioritized plan. The 2-layer nav model is preserved as the nav slice proposal (slice 2) — no work is lost; only the order changes.

---

# PROPOSAL · Slice 1 — Catalog consistency + Two-layer navigation (SUPERSEDED)

> **Mission:** Upgrade arif-fazil.com into a coherent, human-first website (F13 directive 2026-10-05)
> **Slice:** 1 of 6 (per mission section 8) — **SUPERSEDED by slice-1-evaluation-foundation.md on 2026-10-05**
> **Author lane:** 333-AGI / FI-003 (Qwen Code) — proposal only, not mutation
> **Date:** 2026-10-05
> **Status:** SUPERSEDED — see new proposal
> **SOTs honored:** `SITE_CONSTITUTION.md` (RULE 1–6), `SITE_IDENTITY.md` (sacred items 1–8), `canon/file-authority.yaml` (FAIL-CLOSED), `canon/navigation.json` v7.3 (mutators `[A-FORGE, ARIF]`)

---

## Why this slice exists

The mission says: *"a first-time visitor can understand the site, find something useful, inspect its evidence, and complete a supported task without first learning our internal vocabulary."*

That requires a navigation that **leads with the human question**, not the organ name. The current canon nav (v7.3) leads with organs (`Home · Earth · Words · MakcikGPT · World · Work`). The mission's proposed nav leads with journeys (`Explore · Read · Build · Evidence · About`).

These two axes are not in conflict — they are **two layers of the same system**. Mission's 5 journey slots become the **primary** layer. Canon v7.3's 6 organ-mirror slots become the **secondary** layer (a "Powered by" strip). Both intentions are honored. None of the sacred items in `SITE_IDENTITY.md` are touched.

---

## Slice 1 deliverables (concrete, falsifiable)

### 1.1 — Catalog reconcile (86 ↔ 85)

**Measured live:**
- `surfaces.json` declares **86 surfaces** (v2026-10-04, `node scripts/verify-surfaces.cjs`)
- `sitemap.xml` exposes **85 `<loc>` URLs**
- Drift = **1 surface missing from sitemap**

**Action (A-FORGE):**
1. Identify the missing surface (which entry in `surfaces.json` is not in `sitemap.xml`).
2. Either:
   - Add the entry to `sitemap.xml` generator, OR
   - Retire it from `surfaces.json` if it is `status:"retired"` or no longer served.
3. Run `node scripts/verify-surfaces.cjs` — must exit 0.
4. Probe live: `curl -s https://arif-fazil.com/sitemap.xml | grep -c '<loc>'` must equal `len(surfaces.json.surfaces)` (86).

**Falsification:** catalog count and sitemap count match to the byte. The single surface that was missing is either live in both, or retired from both.

### 1.2 — Two-layer navigation model (PROPOSAL, not mutation)

**Current state (canon v7.3):**
```
Primary:   Home · Earth · Words · MakcikGPT · World · Work          (organ-mirror)
Secondary: Pilot · Origin · Map · PETRONAS · Malaysia · Politics · Signal · Organs · Institution · Vitals · Proof
Machine:   llms.txt · missions.json · surfaces.json · webmcp · mcp · did · arifOS · GEOX · WEALTH · WELL · Agent contract
```

**Proposed two-layer model:**

```
Layer 1 (PRIMARY · human journey · on every page):
  Explore   →  /earth/  +  /world/  +  /economics/  +  /malaysia/  +  /vitals/  +  /world/oil-gas-gold/
  Read      →  /words/  +  /words/writing/  +  /words/wiki/  +  /words/makcikgpt/  +  /world/makcikgpt/
  Build     →  /work/  +  /forge/  +  /.well-known/* (machine doors)
  Evidence  →  /999/  +  /000/  +  /999/verify  +  /pulse/
  About     →  /institution/  +  /pilot/  +  canon links

Layer 2 (SECONDARY · "Powered by" strip · footer or rail):
  GEOX · WEALTH · WELL · HERMES · AAA · A-FORGE · arifOS
  (organ-mirror, same as canon v7.3's machine_links, moved into a visible-but-secondary position)
```

**Why two layers, not one:** the mission's 5-slot nav serves a visitor who doesn't know the organs. The 6-slot organ-mirror serves an agent or a return visitor who does. Forcing them into one nav hurts both audiences. The two-layer design is the GOV.UK pattern (people's needs primary, departments secondary) — which the mission's reference list explicitly endorses.

**Sacred invariants preserved:**
- `/000` (Genesis), `/999` (Proof), `/999/verify` (vault proof endpoint) — all kept as evidence room entries.
- MakcikGPT — kept under "Read" in BOTH `/world/makcikgpt/` (canonical) and `/words/makcikgpt/` (peer subpage). Both are live; both are preserved.
- PETRONAS (propa) — kept under "About" (institutional) and surfaced under "Explore" via /malaysia/. `/vitals/` is the canonical financial surface.
- `Human → arifOS → AAA → A-FORGE → Organs` system line — preserved in Layer 2 and in the brand strip.

**Authority:** this proposal **adds** a new `primary_links_journey` block to `canon/navigation.json`. It does **not** delete the existing `primary_links` organ-mirror block. It does **not** rewrite SITE_IDENTITY.md sacred items. The two-layer model is purely **additive** until F13 (or a delegated 888-judge) ratifies a deeper cut.

### 1.3 — Mobile + meta verification (every primary route)

**Action (A-FORGE):**
For every path in `canon/navigation.json.primary_links_journey.items` plus every path in `primary_links.items` (12 routes total), probe with a mobile UA:
- `curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"` to each route
- Assert: HTTP 200, `Content-Type: text/html`, `<title>` non-empty, `<meta name="description">` non-empty, body bytes > 2,000
- Save probes in `forge_work/proposals/fi003-qwen/mission-2026-10-05/probes/`

**Falsification:** all 12 routes pass; HTML body is not a 9 KB React shell (per memory 2026-09-29 dual-lane defect).

### 1.4 — Surface vs reality check (verify-surfaces.cjs)

**Action (A-FORGE):** Run existing `node scripts/verify-surfaces.cjs` (per `surfaces.json.doctrine.verify_command`). For every `status:"live"` entry, assert the live URL returns 200. For every `status:"redirect"` entry, assert the chain resolves to a 200.

**Known issue flagged for separate work:** the dual-lane serving defect (memory 2026-09-29) — `/world/makcikgpt/<slug>` serves raw markdown front-matter to GPTBot/Googlebot and a 9,507 B bare React shell to real browsers. This is a **renderer bug** in slice 2 (visual), not slice 1 (catalog). Logged here so it isn't lost.

### 1.5 — Falsification gate for slice 1

Slice 1 is DONE when:
1. `node scripts/verify-surfaces.cjs` exits 0 (catalog ↔ live ↔ sitemap all match)
2. The 12 primary routes pass mobile + meta probe (no shell-only responses)
3. The two-layer nav is **rendered** (not just proposed) on at least 4 representative pages: `/`, `/earth/`, `/words/`, `/world/`
4. Before/after screenshots of `/` (home) saved to `visual-baseline/mission-2026-10-05-before.png` and `…-after.png`
5. AAA / 555-ASI has signed off (mismatch report if any)
6. 888-APEX has returned SEAL or HOLD with reasons

---

## What slice 1 does NOT do (boundary discipline)

- ❌ Rewrite SITE_CONSTITUTION.md or SITE_IDENTITY.md
- ❌ Mutate any CANON file (file-authority FAIL-CLOSED, mutators = [A-FORGE, ARIF])
- ❌ Touch the seal chain (separate work, flagged to F13)
- ❌ Touch dual-lane renderer (slice 2)
- ❌ Touch chrome-creep / DESIGN_INVARIANTS (slice 2)
- ❌ Re-author canon/navigation.json — only **add** the new `primary_links_journey` block
- ❌ Author 9 new SKILL.md files (per the prior plan's 9-pattern anti-bangang call)

## Risk register (FLAG, don't fix)

| # | Issue | Severity | Slice |
|---|-------|----------|-------|
| 1 | `/999/verify` reports `chain_status:"gaps-found", gap_count:6` (CHAIN_BREAK) | **T0** — not slice 1; belongs to arifOS governance + F13 | n/a |
| 2 | Dual-lane serving: `/world/makcikgpt/<slug>` markdown to bots, shell to humans | T1 | slice 2 |
| 3 | 86 vs 85 catalog/sitemap drift | T2 | slice 1.1 |
| 4 | canon/navigation.json was 6-slot organ-mirror before this mission | T3 (resolved by additive proposal) | slice 1.2 |

---

## File authority

This file is a **PROPOSAL** at:
```
/root/arif-fazil.com/forge_work/proposals/fi003-qwen/mission-2026-10-05/slice-1-catalog-and-nav.md
```
Per `canon/file-authority.yaml.proposal_zones`, this is the only zone where 333-AGI may write freely. No CANON file is touched. No new file outside the proposal zone is created. `mutation_budget.max_files_changed: 5` is honored (zero files changed in this proposal; the proposal is itself a new file in the allowed zone).

## Receipt

Proposal written. Awaiting:
1. 555-ASI verification (does this design respect the existing canon and SOTs?)
2. 888-APEX constitutional judgment (does this proposal violate F1–F13?)
3. F13 SOVEREIGN ratification (does this match the mission intent?)
4. A-FORGE execution (when ratified — applies the additive change to `canon/navigation.json`)

DITEMPA BUKAN DIBERI ⚒️
