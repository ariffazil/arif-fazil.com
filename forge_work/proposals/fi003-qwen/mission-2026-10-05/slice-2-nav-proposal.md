# PROPOSAL · Slice 2 — Shared navigation, mobile preview, journey executions

> **Mission:** Upgrade arif-fazil.com into a coherent, human-first website (F13 directive 2026-10-05, refined same-day).
> **Slice:** 2 of 6 (per mission section 8, re-prioritized after slice 1 evaluation foundation).
> **Author lane:** 333-AGI / FI-003 (architect — proposal only, per `canon/file-authority.yaml`).
> **Seal:** not yet. Proposal status = DRAFT. A-FORGE or F13 must apply canon mutations.
> **Date:** 2026-10-05
> **SOTs honored:** `SITE_CONSTITUTION.md`, `SITE_IDENTITY.md`, `canon/file-authority.yaml`, `canon/navigation.json` v7.3.0.

---

## Scope (proposal-only — no canon mutations in this slice's authoring)

This slice proposes, and proposes only. The actual mutations of `canon/navigation.json` and `sites/arif-fazil.com/surfaces.json` are A-FORGE/F13 work.

### 2.1 — Catalog drift fix (1-line canon mutation, batched here)

| File | Before | After | Why |
|---|---|---|---|
| `sites/arif-fazil.com/surfaces.json` | `/pulse/` entry has `status:"live"` | `status:"retired"`, `code:410`, `redirects_to:"/machine/"` | The 410 is intentional UX; the catalog is the drift. |

Plus probe v2 may discover other drift; each gets its own line in this batch.

### 2.2 — Two-layer nav (additive canon block)

Add a new top-level block `primary_links_journey` to `canon/navigation.json` next to the existing `primary_links` (organ-mirror v7.3). The 5 mission slots become the new **primary human-journey** layer; the existing 6 organ-mirror slots move into a new `secondary_links_organs` "Powered by" strip. Both layers render on every page; the **additive** model preserves canon v7.3 (mutators `[A-FORGE, ARIF]`).

```yaml
# ADDITIVE — does not remove or rewrite existing primary_links / secondary_links
primary_links_journey:
  description: Human-journey primary nav (5 slots, F13 mission 2026-10-05).
  rule: "Renders above the organ-mirror primary_links. Both layers visible."
  items:
    - { label: "Explore",  href: "/earth/",     question: "What does physical reality show?" }
    - { label: "Read",     href: "/words/",     question: "What does this mean for people?" }
    - { label: "Build",    href: "/work/",      question: "What can I do here?" }
    - { label: "Evidence", href: "/999/",       question: "What evidence is this built on?" }
    - { label: "About",    href: "/institution/", question: "Who is Arif and why does this exist?" }

secondary_links_organs:
  description: Organ-mirror strip, demoted to secondary (was v7.3 primary).
  rule: "Always visible as 'Powered by' — GEOX · WEALTH · WELL · HERMES · AAA · A-FORGE · arifOS."
  items: [ from existing primary_links ]
```

### 2.3 — Mobile preview prep (in proposal_zones)

The corrected probe v2 (2.4 below) will report mobile-vs-desktop differences. Slice 2 does NOT ship a mobile UI change — that is slice 4 (mobile + visual). This slice **prepares the preview** by:
1. Running probe v2 with a mobile UA on the 4 representative pages
2. Saving screenshots / HTML samples to `forge_work/proposals/fi003-qwen/mission-2026-10-05/eval/mobile-2026-10-05/`
3. Surfacing a per-page "what would need to change" report — but **not changing anything**

### 2.4 — Journey executions (1.6 of slice 1, sliding into slice 2 prep)

Per the corrected slice 1 report, journeys were specs not executions. Slice 2 prep includes:
- Author a `journey-1-journalist.md` execution plan: a literal Playwright-as-CLI walk via the 1mcp-hub if available, OR a hand-executed curl+grep walk
- Author a `journey-4-verifier.md` execution plan: read the JSONL chain, count `head_seq` vs `head_count_seq`, find the 17 unverified entries by index, document each break with the actual entry content
- **No F13 binary needed** — read-only investigation

### 2.5 — Probe v2 (corrected probe model)

- Re-run with categories: `page` / `dynamic_page` / `redirect` / `machine` / `document` / `retired`
- Resolve real slugs for dynamic pages: at minimum 2 from `/world/makcikgpt/` (42 discovered), 1 from `/words/writing/`, 1 from `/words/wiki/`, 1 from `/economics/article/`
- Detect dual-lane serving defect explicitly: HTTP 200 + body < 10 KB + `<title>` matches homepage = suspect
- Save as `eval/baseline-2026-10-05-v2.json` alongside the original `eval/baseline-2026-10-05.json` (preserve original per F13 instruction)

---

## What slice 2 explicitly does NOT do

- ❌ Mutate `canon/navigation.json` from FI-003 (architect role, proposal only)
- ❌ Auto-apply composio REVERSE (awaiting F13 binary on path A/B)
- ❌ Auto-repair the seal chain (read-only investigation only)
- ❌ Add new SKILL.md files
- ❌ Mobile UI changes (slice 4)
- ❌ Build Playwright harness (slice 1.5 follow-up)

## Falsification gate for slice 2

Slice 2 is DONE when:
1. The 1-line `surfaces.json` batch is in `forge_work/proposals/.../slice-2-catalog-batch.json` ready for A-FORGE to apply (or a pre-existing alternative)
2. The 2-layer nav diff is in `forge_work/proposals/.../slice-2-nav-diff.json` (a JSON-patch format ready to apply to `canon/navigation.json`)
3. Probe v2 has re-run with categories and real slugs; both `eval/baseline-2026-10-05.json` (v1) and `eval/baseline-2026-10-05-v2.json` (v2) exist
4. At least 2 of the 5 journeys have an execution-plan markdown (not execution, plan)
5. The verifier investigation produces an entry-by-entry table for the 6 chain breaks (read-only)
6. The dual-lane serving defect is documented with a concrete reproduction (5 URLs → 200 with homepage title)

After slice 2 lands, slice 3 (Earth → Money → Evidence journey) can begin — also as proposal-only work in `proposal_zones`.

## Receipt

Proposal authored. Awaiting F13 binary on:
- (A) Composio REVERSE path (re-confirm with evidence; or different)
- (B) Seal chain next-step (continue read-only; or different)
- (C) /pulse/ catalog update (bundle with slice 2; or fix now)

DITEMPA BUKAN DIBERI ⚒️
