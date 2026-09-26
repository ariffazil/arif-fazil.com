# PROPOSAL — world-quieting-2026-09-27

**Agent:** kimi-code/FI-008 · **Date:** 2026-09-27 · **Session:** SEAL-9db531d3c9874294
**Mission:** Remove internal-state leaks from public attention corridors; close JSON-LD gap on flagship dossier.
**Trigger:** Sovereign request ("make the site less distraction") + two convergent external audits + live measurement.
**Authority state of targets (canon/file-authority.yaml):**
- `sites/arif-fazil.com/index.html` — not declared → UNKNOWN → lease requested (homepage shell, clearly site SOT).
- `sites/arif-fazil.com/public/world/index.html` — declared DERIVED, but copy-static-html.js copies **from** public/ → public/ is de-facto SOT → lease requested.
- `sites/arif-fazil.com/public/world/2027/index.html` — same → lease requested.

**Mutation budget:** 3 files changed (≤5 ✓), 0 new canon files ✓.

---

## Patch A — homepage shell: remove stale REMEDIATION banner
**File:** `sites/arif-fazil.com/index.html` (lines 157–162)
**Measured:** live `/` serves a `position:fixed;bottom:0;z-index:50` banner on every route:
"REMEDIATION STATUS — WEALTH under remediation controls · last_reviewed_at: 2026-09-17".
**F2 problem:** the site's own `/status.json` (generated 2026-09-24, probe-truth) reports `wealth.status = healthy`.
The banner is a 10-day-stale claim contradicted by the site's own machine surface.
**Disclosure is NOT lost:** the full REMEDIATION STATUS section already lives at `/vitals/` (public/vitals/index.html:73)
and runtime state at `/status.json` + `/machine/`. Observability ≠ homepage.
**Change:** delete the banner `<div>` and its comment block (see patch-a.diff).

## Patch B — /world/ footer: replace internal audit jargon with a pointer
**File:** `sites/arif-fazil.com/public/world/index.html` (line 471)
**Measured:** public footer shows "Witness: INCOMPLETE (AI present; human + earth pending). Cross-witness: SINGLE_SOURCE.
Cryptographic seal: PENDING Lane A key (888)…" — internal audit state leaked to every reader.
**Change:** keep the sha256 + integrity hash (F2 honesty preserved), replace the jargon paragraph with a pointer
to `/vitals/` and `/machine/` where witness/seal state belongs (see patch-b.diff).

## Patch C — /world/2027/: add JSON-LD (flagship dossier is machine-invisible)
**File:** `sites/arif-fazil.com/public/world/2027/index.html` (insert after line 11)
**Measured:** no `application/ld+json` in 877 lines — the site's flagship dossier has no machine summary.
Every other major surface (root, /world/, /world/makcikgpt/) has JSON-LD.
**Change:** add Article schema + authority/evidence/related_surfaces block per the external audit spec (see patch-c.diff).

---

## Verification plan (post-lease)
1. `npm run build` in `sites/arif-fazil.com/` (copy-static-html.js carries public/ → dist/)
2. `make verify-pages` (AGENTS.md deploy gate — non-bypassable)
3. `scripts/verify-surfaces.cjs` (DTI: H1, JSON-LD, og, canonical)
4. Live probes: `/` (no banner), `/world/` (footer), `/world/2027/` (ld+json present)
5. Receipt appended to `receipts/kimi-code-FI-008/`
6. Deploy via existing static sync only. **No `make deploy`, no Caddy reload, no DNS** (AGENTS.md rules 3–5).

## Explicitly NOT in this proposal (needs separate sovereign direction)
- Three-lane homepage (Human / Institution / Agent) — direction-of-record, second audit's recommendation.
- /world/ 4-layer restructure (hero → themes → live → archive).
- Nav/sitemap reconciliation. Cache-header policy. MakcikGPT card grouping.

## ONE BINARY for F13
**Grant lease to apply Patches A+B+C as written?** YES / NO
(If YES but you want the WEALTH disclosure kept on the homepage despite being stale, say "B+C only".)
