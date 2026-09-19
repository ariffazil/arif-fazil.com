---
type: Entity
subtype: Project
tags: [aaa, cockpit, identity, a2a, federation, source-of-truth]
sources:
  - https://aaa.arif-fazil.com
  - /root/arif-fazil.com/canon/tool-surfaces.json
  - /root/arif-fazil.com/arif-fazil-wiki/wiki/projects/arifos-observability.md
last_sync: 2026-09-17
confidence: 0.90
certainty_band: [0.85, 0.95]
epistemic_level: OBS
arifos_floor: [F2, F10, F11, F13]
status: active
---

# AAA Site — Cockpit, Identity, A2A Authority Layer

> **AAA is the federation's control-plane surface. It is the source of truth for *who is calling*, *what role they hold*, and *what authority flows where*.**
> **One-line:** the cockpit that gives observers a single, federated view of the arifOS Federation.

---

## Identity & Role

| Field | Value |
|---|---|
| **Subdomain** | `aaa.arif-fazil.com` |
| **Origin** | Caddy → localhost:3001 |
| **Function** | Cockpit / agent identity / A2A gateway |
| **Mode** | Read + display only — never adjudicate (per role separation law) |
| **Live status** | `healthy` (verified 2026-09-17, identity hash `f909eab0...9578`) |

**Layer role:** arifOS governs; A-FORGE engineers; GEOX / WEALTH / WELL compute; **AAA routes, displays, and never adjudicates.**

---

## What AAA Is

AAA is the **human-cockpit surface** for the federation. It exposes:

1. **Agent identity** — A2A agent cards, DID resolution, actor registry
2. **Routing** — dispatches incoming requests to the right organ
3. **Display** — renders cockpit dashboards, role assignments, federation health snapshots
4. **Authority tracking** — surfaces who has what authority_band, but does not adjudicate

What AAA is **not**:

- Not an adjudicator — never emits verdicts (F12 forbids AAA overriding 888_JUDGE)
- Not an execution surface — never mutates production (F10)
- Not a constitutional source — never modifies floors (F13)

---

## Source-of-Truth Discipline

AAA consumes the same `canon/tool-surfaces.json` that `arif-fazil.com/surfaces.json` consumes. **Both are downstream views of the canonical tool-surfaces SOT.** Any drift between AAA's display and the SOT file is itself a federation bug.

When arifOS or domain organs report `status: degraded`, AAA surfaces that without modification. AAA does not paper over organ failures.

When the SOT file is updated (e.g., 2026-09-17 fix: `arif_critique` → `arif_memory`), both AAA's display and the public catalog update. **AAA is not an independent authority for canonical facts.**

---

## Live Health (verified 2026-09-17)

```
GET https://aaa.arif-fazil.com/health

{
  "status": "healthy",
  "identity": "f909eab007954d345edd20ecad73c361b6b2ad2d417b15b9cf0454caf9399578",
  "identity_hash": "f909eab007954d345edd20ecad73c361b6b2ad2d417b15b9cf0454caf9399578",
  "deployed_commit": "51e5d37",
  "source_commit": "51e5d37",
  "deployment_drift": false,
  "apex_scalars": {
    "G":         { "value": 0.875, "status": "HEALTHY" },
    "C_dark":    { "value": 0.008, "status": "SAFE"     },
    "W3":        { "value": 0.879, "status": "CONSENSUS" }
  }
}
```

The `apex_scalars` block exposes constitutional signal — `G` (governance), `C_dark` (anti-hantu / deception risk), `W3` (tri-witness consensus). These are observation values, not verdicts.

---

## Why AAA Is Not the Source of Truth (despite being the cockpit)

Three reasons:

1. **Role separation law (F10)**: AAA's mandate is routing + display. If AAA held SOT authority, it could override the organs it displays.
2. **Single source of truth doctrine**: The canonical SOT is `canon/tool-surfaces.json` (file in the repo) and the live `/health` endpoints. AAA is a *consumer* of both.
3. **Constitutional floor F13**: Only Arif issues sovereign rulings. AAA's display is advisory — humans must always verify against the actual file/endpoint if consequential.

---

## See Also

- [[arifos-observability]] — arifOS observability SOT (the canonical observability page)
- [[arifos]] — Constitutional runtime
- [[projects/trinity-sites]] — Federation topology
- [[agents-guide/sovereignty-protocols]] — F13 and 888_HOLD procedures

---

**Seal:** VAULT999 | **Last synced:** 2026-09-17 | **Confidence:** 0.90 | **Status:** ACTIVE

**Doctrine:** *AAA displays. It does not adjudicate. The SOT is the file + the endpoint. AAA is downstream.*

DITEMPA BUKAN DIBERI.