# PROPOSAL · Organ Count Reconciliation
**Agent:** 333-AGI Δ MIND (FI-001)
**Date:** 2026-09-17
**Mission:** Lebih Bijaksana / Lebih Arif / Penuh Clarity transformation, Phase 2
**File authority:** PROPOSAL (per `canon/file-authority.yaml` §proposal_zones)

---

## 1. Drift observed

Three machine SoTs currently disagree on the same number:

| Source | `organ_count` / `declared` | List |
|---|---|---|
| `canon/federation.json` (CANON, ratified 2026-08-08) | **9 organs** + 12 L3 assets = 21 total | arifOS, A-FORGE, AAA, arifFLOW, GEOX, WEALTH, WELL, HERMES, FRAME |
| `/api/public-state` `federation.declared` | **11** transport-reachable | unknown subset; `reachable: 11, semantic_proven: 3, state: PARTIAL` |
| `/api/public-state` `organs[]` | **6** public organs | arifos, aforge, aaa, geox, wealth, well |
| `/soul.json` `organ_count` (DERIVED from public-state) | **6** | matches public-state.organs |
| llms.txt | none (organ count not asserted since ~2026-08-30) | links only |

**Witness audit (2026-08-24) flagged this as drift #7.** Phase 2 re-probe (2026-09-17) confirms the drift persists.

## 2. Self-knowledge already exists

`soul.json` metadata currently reads:
> *"organ_count=6 matches GET /api/public-state.organs. Canon federation.json also lists arifFLOW + HERMES (not public HTTP organs)."*

The author of soul.json was **already aware of the gap** and chose to declare 6 (public) instead of 9 (canon-total) or 11 (transport-reachable). The choice was deliberate but **invisible from the surface** — `organ_count=6` reads as an undercount without the metadata footnote, and no current tool exposes the public/private split.

## 3. The truthful claim

The federation has three layers:
- **Public organs** (6): surfaced at `arif-fazil.com` MCP + `public-state.organs[]`. Anyone can probe these.
- **Internal organs** (3): arifFLOW, HERMES, FRAME — registered in canon but not publicly surfaced. Either tombstoned (arifFLOW), not callable (HERMES), or scoped to internal governance (FRAME).
- **L3 assets** (12): reference registries, infrastructure, models — not runtime organs.

public-state.federation.declared=11 = 6 public + 3 internal + 2 (probable duplicates of FRAME in canonical federation.json — FRAME appears in both `organs[]` and `assets[]`).

## 4. Proposed actions (no mutation attempted)

1. **soul.json** — add `organ_split` object alongside `organ_count`:
   ```json
   "organ_count": 6,
   "organ_split": {
     "public_organs": 6,
     "internal_organs": 3,
     "internal_ids": ["ariflow", "hermes", "frame"],
     "internal_doctrine": "Tombstoned publicly or scoped to internal governance (see canon/federation.json)",
     "canon_total_organs": 9,
     "canon_total_assets": 12
   },
   "organ_sot": "https://arif-fazil.com/canon/federation.json"
   ```
   Currently organ_sot points to `/api/public-state` which is DERIVED, not CANON. Per file-authority.yaml, CANON SOT is `canon/federation.json`.

2. **public-state** — emit a `federation.split` object alongside `federation.declared`:
   ```json
   "federation": {
     "declared": 11,
     "split": {
       "public": 6,
       "internal": 3,
       "infra_in_canon": 2
     },
     "probed": 11, ...
   }
   ```

3. **llms.txt** — already correct (no organ-count claim). No change.

## 5. Authority required

- **CANON files involved:** `canon/federation.json` (read-only for me), `canon/file-authority.yaml` (no change).
- **DERIVED files to update:** `sites/arif-fazil.com/public/soul.json` (DERIVED from public-state; agent-rewritable but SHOULD mirror public-state emission), `/api/public-state` (live organ in arifOS kernel; requires kernel emission change).
- **Owner of soul.json:** ARIF (per metadata). Owner of public-state emission: arifOS kernel (per federation.json).
- **Required lease:** ARIF or A-FORGE per `canon/file-authority.yaml` §lease.

## 6. Reversibility

- 100% reversible. The change adds a new field; it does not mutate `organ_count`. The old value remains the public-facing number.
- If sovereign wants the count changed instead of augmented, the `organ_count` value can be updated to 9 with sub-categorization, also reversible.

## 7. Open question for sovereign

> Does the public-facing federation declare `9 organs` (matching canon) or `6 public + 3 internal` (matching the privacy boundary)?

Per the doctrine of "honest UNKNOWN": the current `organ_count=6` claim is technically truthful but socially misleading — it reads as "the federation is incomplete." Adding the split field removes the misleading read without forcing a count choice.

## 8. Evidence chain

- Probes logged: `/root/.local/share/arifos/probe/2026-09-17-witness-audit/` (from prior audit)
- federation.json SHA256: see git hash on commit touching this file
- proposal mode enforced per FAIL-CLOSED

---

**Status:** PROPOSAL — awaiting sovereign review.
**DITEMPA BUKAN DIBERI ⚒️**