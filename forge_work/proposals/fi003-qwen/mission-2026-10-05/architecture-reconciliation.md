# ARCHITECTURE RECONCILIATION · 2026-10-05 · HERMES / AAA / arifFlow / CHRON classification

> **Triggered by:** F13 external audit 2026-10-05 10:03–10:06 MYT — Discovery page classifies organs differently from the canon.
> **Author lane:** 333-AGI / FI-003 (architect — proposal only).
> **Resolution authority:** this is a CONTENT fix, not a canon mutation; A-FORGE applies the page edit, no F13 binary required.

---

## The disagreement (three public stances, all live today)

| Stance | Where it appears | Organs count | HERMES classified as | CHRON classified as |
|---|---|---|---|---|
| **arifOS §2.1** (2026-09-14 ruling) | `/root/arifOS/README.md` "Organs vs. boundaries" | **7** | **Tier-3 boundary infrastructure, not an organ** | **Temporal boundary service, not an organ** |
| **AAA P2** (2026-09-21) | `/root/AAA/README.md` "organs_in_federation" | **7 + 2 planes** | "meaning plane" (plane, not organ) | "temporal plane" (plane, not organ) |
| **Discovery page** | `/discovery/` | **9 rooms** | "domain-organ" | **OMITTED** from the 9-room explanation |

The canon (arifOS §2.1) is the most-recent ratified position and is consistent with the AAA P2 update (2026-09-21). Both agree the organ list is 7. The terminology for HERMES / CHRON differs ("boundary service" vs "plane") but the count is fixed.

## The 7 organs (canon, ratified)

Per `arifOS/README.md` §2.1 and `AAA/README.md` P2:

| # | Organ | Plane | Irreducible question | Port |
|---|---|---|---|---|
| 1 | **arifOS** | authority | "May this action happen?" | :8088 |
| 2 | **A-FORGE** | execution | "How do I execute the authorized action?" | :7071 |
| 3 | **AAA** | attention | "What deserves scarce attention now?" | :3001 |
| 4 | **GEOX** | domain (Earth) | "What does the earth say?" | :8081 |
| 5 | **WEALTH** | domain (capital) | "What do the numbers say?" | :18082 |
| 6 | **WELL** | domain (vitality) | "What does the body say?" | :18083 |
| 7 | **arifFlow** | metabolism / telemetry | "What is the federation's state?" | :7073 |

## The 2 boundary services (canon, ratified)

| # | Boundary | Function | Why it is not an organ |
|---|---|---|---|
| 1 | **HERMES** | meaning integrity, relay only | semantic boundary; never executes, never judges |
| 2 | **CHRON** | episodes, predictions, calibration | temporal boundary; never executes, never judges |

Both are reported by **class** in the federation, not counted among the 7 organs. They have their own irreducible questions but are not "organs" in the AAA organ table.

## What Discovery should say (proposed text, content edit only — no canon mutation)

Replace the current 9-room / Discovery page content with:

> **The federation is one system.**
> Seven organs collaborate under sovereign authority:
>
> - **arifOS** (authority) — *"May this action happen?"*
> - **A-FORGE** (execution) — *"How do I execute the authorized action?"*
> - **AAA** (attention) — *"What deserves scarce attention now?"*
> - **GEOX** (Earth) — *"What does the earth say?"*
> - **WEALTH** (capital) — *"What do the numbers say?"*
> - **WELL** (vitality) — *"What does the body say?"*
> - **arifFlow** (metabolism) — *"What is the federation's state?"*
>
> Two boundary services run alongside:
>
> - **HERMES** (meaning) — preserves claim boundaries; never executes
> - **CHRON** (temporal) — preserves Arrow of Time; never executes
>
> The reference-selection arguments (why GOV.UK, Backstage, OWID, etc.) are in an agent-facing design document, not on this page.

## Why this is a content edit, not a canon mutation

- The canon (organ list, HERMES/CHRON classification) is unchanged.
- The Discovery page is the only public surface that disagrees with the canon.
- A-FORGE can rewrite `/discovery/` page content using the proposed text — no canon file touched.
- `canon/navigation.json`, `canon/file-authority.yaml`, `canon/sites.yaml` are unaffected.
- The 7-organ list and the boundary-service classification are also surfaced (and ratified) in the new nav proposal's "Powered by" strip.

## Reproducing the canon

- `grep -n "7 live organs" /root/arifOS/README.md` — returns the §2.1 ruling line.
- `grep -n "organs_in_federation" /root/AAA/README.md` — returns the AAA P2 organ table.
- Both files are git-tracked, ratified, and authoritative. No F13 binary needed for A-FORGE to apply the page edit.

## Retest

- `curl -sS https://arif-fazil.com/discovery/ | grep -oE "7 organs|nine rooms|9 rooms|domain-organ"` — must return `7 organs` matches; must NOT return `9 rooms`, `nine rooms`, or `domain-organ`.
- `curl -sS https://arif-fazil.com/discovery/ | grep -E "HERMES|CHRON"` — both must appear with the boundary-service classification.

DITEMPA BUKAN DIBEI ⚒️
