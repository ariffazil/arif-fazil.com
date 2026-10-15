# Claim Registry — Public-Surface-Reality-Upgrade

> Authority: DERIVED
> Mission: PUBLIC-SURFACE-REALITY-UPGRADE-2026-10-11
> Agent: kimi-code/FI-008
> Proposal path: `/root/arif-fazil.com/forge_work/proposals/kimi-code-Fi-008/public-surface-reality-upgrade/`

This registry is the canonical public-claims document for the four
surfaces. Every page on the four surfaces reads from
`shared/controlling-claims.json` (the binding observation envelope).
This file is human-readable companion, not the wire format.

## Hard rules

- `UNKNOWN` → stop that file only.
- `DERIVED` → locate upstream SOT; do not silently edit.
- `CANON` → follow repository lease path.
- No current value may be inferred from historical fallback.
- No SEAL · LIVE · OPTIMAL · BALANCED · HEALTHY · AUTHORIZED · COMPLETE
  without a precise measured scope.
- Use only `MEASURED_PASS`, `MEASURED_FAIL`, `REACHABLE`,
  `UNREACHABLE`, `DEGRADED`, `HELD`, `STALE`, `UNMEASURED`,
  `UNKNOWN` for state.
- Use only `OBSERVED`, `DERIVED`, `DECLARED`, `HISTORICAL`,
  `TARGET`, `UNKNOWN` for epistemic_class.

## Controlling claims (mirroring controlling-claims.json)

| metric_id | value | state | epistemic_class | scope |
|---|---:|---|---|---|
| arifos_demo_deterministic_refusal | true | MEASURED_PASS | OBSERVED | Observed single test |
| arifos_demo_unauthorized_mutation_prevented | 1 | MEASURED_PASS | OBSERVED | Observed test |
| arifos_gap_verified_actor | false | MEASURED_FAIL | OBSERVED | Public SOT 2026-10-11 |
| arifos_gap_receipt_fidelity | false | MEASURED_FAIL | OBSERVED | Public SOT 2026-10-11 |
| arifos_gap_sink_agreement | false | MEASURED_FAIL | OBSERVED | Public SOT 2026-10-11 |
| arifos_gap_independent_reconstruction | false | MEASURED_FAIL | OBSERVED | Public SOT 2026-10-11 |
| arifos_floors_pass | 2 | MEASURED_PASS | OBSERVED | F-floor sample |
| arifos_floors_fail | 4 | MEASURED_FAIL | OBSERVED | F2, F11, F12, F13 |
| arifos_floors_unmeasured | 10 | UNMEASURED | OBSERVED | F-floor sample |
| arifos_commercial_paying_customers | 0 | MEASURED_PASS (honest zero) | OBSERVED | billing/CRM |
| arifos_commercial_pilots | 0 | MEASURED_PASS (honest zero) | OBSERVED | federation engagement log |
| arifos_commercial_signed_contracts | 0 | MEASURED_PASS (honest zero) | OBSERVED | CRM |
| arifos_commercial_attributable_revenue | USD 0 | MEASURED_PASS (honest zero) | OBSERVED | finance ledger |
| arifos_usage_hermes_monthly_users | 9 | UNKNOWN (composition unverified) | OBSERVED | Telegram UI, capture 2026-10-11 |

## Per-surface application

| Surface | Applies to |
|---|---|
| /arifos/ | Demonstrated properties, gaps, floor state, commercial state, usage signal, evidence |
| /mcp/    | Live status strip, eight verbs, safe request, two demonstrated, four gaps, current state |
| /aaa/    | Attention items, decisions, federation observations, holds, historical snapshot |
| /forge/  | Capability states, pipeline, execution evidence, receipt truth, security disclosure |

## What is NOT in this registry

- Internal receipt payloads (private)
- Researcher email or message bodies (private)
- Operator tokens or mutation endpoints (out of public surface)
- FQ values without current inputs (UNMEASURED if conditions fail)
- Vendor-specific protocol versions older than one prior (declared legacy)
