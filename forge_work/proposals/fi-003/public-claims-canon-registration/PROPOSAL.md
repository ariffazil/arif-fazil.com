# PROPOSAL — register the public-claims generator in canon

- **Agent:** fi-003 (Qwen Code, 333-AGI BUILD cell, A2M plane) · KVM8 (100.64.0.2)
- **Directive:** F13 sovereign binary **"register the claims generator in canon"** (2026-10-12)
- **Target (CANON):** `canon/federation.json` — SOT `/root/web-canon/canon/federation.json`
  (git `ariffazil/web-canon`); synced copies `/var/www/html/canon/federation.json` (served) and
  `/root/arif-fazil.com/canon/federation.json` (site).
- **Artifact to register:** `/root/AAA/scripts/public-claims/generate-public-claims.cjs`
  (AAA-owned infra; produces the Public Observation Contract served at
  `https://mcp.arif-fazil.com/shared/claims.json`; 15-min cron `jitu-guard public-claims`).

## Authority (honest)

`canon/federation.json` is `state: CANON` with `allowed_mutators: [A-FORGE, ARIF]` per
`canon/file-authority.yaml` (v1.0.0, F13-ratified 2026-08-01, FAIL-CLOSED). FI-003 is not a listed
mutator, so by the contract the default FI-003 action is **proposal only**.

The earlier session recorded the canon registration as *"a separate F13 call"* — this binary is that
call, and F13 = ARIF is an allowed mutator. Precedent: FRAME (`6923f45`) and the HERMES port fix
(`3d69971`, `[FI-008]`) were committed directly to this file; no hook enforces file-authority
(doctrine-only).

**But the contract is FAIL-CLOSED and the measured FI-003 rule is *proposal only* (FI-003 is not a
listed mutator; role = `architect: propose only`). So this patch is STAGED, NOT APPLIED.** Promotion =
a CANON mutator (`A-FORGE` / `ARIF`=F13) applying the exact patch below — or F13's one word. FI-003
does not self-write CANON. The F13 binary is the authorizing call; the write is the mutator's step.

## Exact patch

1. Top-level: `version` `v2026.08.08` → `v2026.10.12`; `ratified_by` appends
   `"public-claims-generator registered 2026-10-12."`; `ratified_at` → `2026-10-12T05:24:55Z`.
2. `assets[]` — append one entry after the FRAME asset entry (kind matches the FRAME runtime-service
   precedent):

```json
{
  "asset": "public-claims-generator",
  "layer": "L1",
  "role": "observation_contract_compiler",
  "kind": "generator",
  "owner_organ": "AAA",
  "github": "ariffazil/AAA",
  "path": "/root/AAA/scripts/public-claims/generate-public-claims.cjs",
  "serves": "https://mcp.arif-fazil.com/shared/claims.json",
  "cadence": "*/15 * * * * — jitu-guard public-claims",
  "posture": "PRODUCE_ONLY",
  "ratified_by": "sovereign (F13)",
  "ratified_at": "2026-10-12",
  "doctrine": "L1 observation-contract compiler (AAA-owned infra, kept outside the served root). SOURCE→COMPILE→SERVE: probes the 3 declared sources (kernel /health required; mcp manifest + aaa a2a optional), emits one conformant claims.json under structural honesty — UNMEASURED ≠ pass; UNREACHABLE on source-down; a verdict only where the binding supplies a state_map or pass/fail rule. No judgement, no execution, no seal authority."
}
```

## Rollback

`git -C /root/web-canon revert <commit>` (no push made). Copies re-sync from the SOT.
