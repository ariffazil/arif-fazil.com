# Evidence Check Schema — Evaluation Foundation, arif-fazil.com (2026-10-05)

> **Purpose:** define what counts as *evidence* on each page-class. The schema is what every page must satisfy before it can claim to be "evidence-grounded". Five page-classes, each with required fields and a closed-loop test.

## Vocabulary (canonical, from existing canon)

Per `arif-fazil-publication-doctrine` and AAA epistemic labels:

- **OBS** — observed, externally verifiable, with provenance
- **DER** — derived from OBS, with the derivation rule visible
- **INT** — interpretation, can be falsified by an alternative INT
- **SPEC** — speculative, explicitly marked
- **UNVERIFIED** — claim exists, evidence missing, status visible to reader

Confidence is **per-claim**, not per-system. A page can be 90% OBS and 10% SPEC; the reader must see both.

## Five page-classes

### Class A — Hub (e.g. `/earth/`, `/words/`, `/world/`, `/work/`, `/institution/`)

**Required evidence fields:**

| Field | Rule |
|---|---|
| `last_checked` | ISO date, visible without scrolling past the intro |
| `primary_source_count` | At least 1 primary source per topic the hub claims to cover |
| `epistemic_label_set` | OBS / DER / INT / SPEC all defined somewhere on the page or linked |
| `update_cadence` | Declared (e.g. "monthly", "daily", "event-driven") and honored |
| `human_journey_link` | Each hub surfaces a "next step" link to a journey-relevant sub-page |

**Closed-loop test:** every claim on the hub links to a page that itself has OBS-grade evidence. A claim without a downstream is a stub.

### Class B — Article (e.g. `/world/makcikgpt/<slug>`, `/words/writing/<slug>`, `/earth/kinabalu-basin/`)

**Required evidence fields:**

| Field | Rule |
|---|---|
| `claim_count` | Number of distinct claims in the article (visible to reader) |
| `source_count` | ≥ 3 sources for non-trivial claims; ≥ 1 primary source |
| `epistemic_label_visible` | Each claim's epistemic label is visible to a human reader, not just the agent surface |
| `last_verified` | Date the article was last verified against sources |
| `revision_history` | At least one prior revision visible (or explicit "first publication") |
| `register` | A (public doctrine) or B (research frontier) per `arif-fazil-publication-doctrine` — labeled on page |

**Closed-loop test:** every inline citation has a working source link. The dual-lane serving defect (memory 2026-09-29 — markdown to bots, shell to humans) fails this test today: a chat/LinkedIn preview sees no `<title>`, no `og:image`, no description; a Googlebot sees raw YAML front-matter, not the article.

### Class C — Dashboard (e.g. `/vitals/`, `/world/oil/`, `/world/gold/`, `/pulse/`)

**Required evidence fields:**

| Field | Rule |
|---|---|
| `data_source_uri` | API URL or file path of the data — visible |
| `last_refresh` | Timestamp of the most recent refresh — visible |
| `units` | Units on every numeric label (RM billion, USD/oz, ppm, etc.) |
| `update_cadence` | Declared (e.g. "15 min", "daily", "event-driven") |
| `confidence_band` | OBS / DER / INT / SPEC per metric, where applicable |
| `stale_state` | If data is > 1 cadence window old, page must say so explicitly |
| `unavailable_state` | If API is down, page must say so explicitly — never silently render empty |

**Closed-loop test:** every number on the dashboard traces back to a data_source_uri. Numbers without a source are UNVERIFIED and must be labeled.

### Class D — Machine (e.g. `/surfaces.json`, `/llms.txt`, `/llms-full.txt`, `/missions.json`, `/.well-known/*`)

**Required evidence fields:**

| Field | Rule |
|---|---|
| `content_type` | The declared MIME type matches the actual response (machine-file truth canary per `arif-site-human-first-audit` Lane A) |
| `schema_version` | A version field, incremented on every breaking change |
| `last_generated` | Timestamp the file was last generated from its SOT |
| `source_sot` | The SOT file path the machine file was generated from (e.g. `surfaces.json` ← `canon/navigation.json` + `canon/file-authority.yaml`) |
| `truth_rule` | A one-line statement of what the file is and is not (e.g. "surfaces.json: if a path is here, it is canonical") |

**Closed-loop test:** the machine file matches the SOT it claims to derive from. Drift = fail.

### Class E — Constitutional page (e.g. `/000/`, `/999/`, `/999/verify`, `/words/doctrine/`)

**Required evidence fields:**

| Field | Rule |
|---|---|
| `content_hash` | The page's SHA-256 (or BLAKE3) is published and verifiable |
| `last_seal` | Timestamp of the last seal event (arif_seal) that affected this page |
| `chain_position` | If the page is part of a chain, its position is published |
| `verifier_url` | The endpoint a third party can hit to verify (e.g. `/999/verify`) |
| `verifier_status` | The last-known verifier status, with a freshness window |

**Closed-loop test (CURRENT FAILURE — T0):** `/999/verify` reports `chain_status:"gaps-found", gap_count:6`. The constitutional claim of "immutable, hash-chained seal" is not currently self-consistent. This is **out of slice 1 scope** (arifOS governance lane) but the evaluation foundation records it as the highest-priority failure mode for the federation, ahead of any UI change.

---

## How the schema is enforced

- The schema is a **proposal** today. Enforcement comes via the evaluation harness (slice 1.5 follow-up) and the 4-lane re-audit (slice 6).
- A page that fails its class's required fields is **not promoted** to a journey-success state, regardless of HTTP 200.
- The schema is **versioned**. A breaking change to a page-class bumps `evidence-checks.md` and re-runs all journeys.

## Anti-bangang guard

This schema is **not** a new canonical file. It is a proposal in `forge_work/proposals/...`. Promotion to canon requires F13 seal and entry into `canon/page-instruments.json` or a new canon file (per file-authority, `mutation_budget.max_new_files: 0` blocks new canon files this slice).

DITEMPA BUKAN DIBERI ⚒️
