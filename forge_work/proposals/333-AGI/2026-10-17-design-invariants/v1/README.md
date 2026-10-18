# DESIGN_INVARIANTS — proposal metadata

**Mission:** 333-AGI/2026-10-17-design-invariants/v1
**Subject:** Close the missing design-canon hole at `/root/arif-fazil.com/sites/arif-fazil.com/DESIGN_INVARIANTS.md` (referenced by `arif-sites-content-ops` scar 2026-08-11 as "the missing rulebook").
**Scope:** T1 — write a proposal in the proposal zone. Promote to canonical `sites/arif-fazil.com/DESIGN_INVARIANTS.md` only after F13 seal (per file-authority.yaml: CANON file requires lease).

## Why now

- The site is the federation's human-facing front door. Five years of agent work and a sharp scar doctrine have produced drifts in the chrome pattern (visible prohibition language like "Source of truth: src/data/essays/..." appeared and disappeared across surfaces).
- This rulebook consolidates the doctrine into a single authoritative file. Future agents read it before touching visual HTML.
- It also fills the gap noted in `arif-sites-content-ops` pitfall section "Agent-chrome creep":
  > "The fix is three layers deep: 1. **Canonical SOT** — `/root/arif-fazil.com/sites/arif-fazil.com/DESIGN_INVARIANTS.md` declares what is and isn't allowed in visual surfaces. … 3. **Visual recovery** — git archive at `767596c` has the Primer Dark landing template."
- The 2026-10-17 writing-page re-render (separate proposal CAND-WRITING-LISTING) explicitly REMOVED a `Source of truth:` line from the visible footer, citing this doctrine in advance. The doctrine file is now written so the next agent doesn't add the line back.

## What this file is NOT

- NOT a redesign proposal. Visual surface itself is unchanged.
- NOT an override of `canon/design-primer.md` or `canon/design-tokens.json`. Those remain the machine-readable canon. This file is the human-readable rulebook, the agent-side companion.
- NOT a `scripts/design-lint.sh` script. The lint enforcement is a separate, smaller proposal (linked but not authored in this turn).

## Files in this proposal

| File | Purpose |
|---|---|
| `DESIGN_INVARIANTS.md` | The rulebook. 13 sections.  |
| `README.md` | This file. |
| `FORGE_RECEIPT.json` | Audit trail. |

## Promotion path (after F13 seal)

1. F13 reads `DESIGN_INVARIANTS.md` here in the proposal zone.
2. If F13 approves, F13 says "go promote" (or equivalent).
3. Agent `cp forge_work/proposals/333-AGI/2026-10-17-design-invariants/v1/DESIGN_INVARIANTS.md sites/arif-fazil.com/DESIGN_INVARIANTS.md` and commits it on a canon branch.
4. file-authority.yaml canon section is unchanged (no new CANON file added to the registry beyond this one — promotion adds it under `sites/arif-fazil.com/DESIGN_INVARIANTS.md` as state CANON, owner ARIF, allowed_mutators [A-FORGE, ARIF]).
5. `scripts/design-lint.sh` becomes a follow-up proposal (separate mission: 333-AGI/2026-10-17-design-lint-script/v1).

## Reversibility

- Proposal-zone files are SCRATCH by default. They can be deleted without consequence.
- After promotion, the file becomes CANON. Reversal would require F13 ratification of removal (per file-authority.yaml lease model).

## Open question for F13

Q1: Is the visible `Source of truth:` line on `/words/writing/` footer (used in the prior hand-rendered version, and removed in the 2026-10-17 generator output) canon-allowed?
- This proposal §2 says NO.
- §10 lists `/words/doctrine/` as the one surface where it IS allowed.

Q2: Are Bahasa Melayu essays allowed to have `lang="ms"` on anchor tags? This is currently allowed (§7c trust & provenance).

Q3: Should the proposal be promoted before or after the writing-page deployment (held by pre-existing `/gold/` orphan)? My recommendation: promote the canon first (so all future /words/* generators follow the rulebook), then deploy once /gold/ resolves.
