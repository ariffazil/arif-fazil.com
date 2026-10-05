# PROPOSAL · Slice 2 (UPDATED) — 5 stable primary destinations, 7-organ "Powered by" strip

> **Mission:** Upgrade arif-fazil.com into a coherent, human-first website (F13 directive 2026-10-05, refined same-day, re-confirmed by F13 external audit 10:03–10:06 MYT).
> **Slice:** 2 of 6.
> **Author lane:** 333-AGI / FI-003 (architect — proposal only).
> **Seal:** not yet. A-FORGE or F13 must apply canon mutations.
> **Supersedes:** `slice-2-nav-proposal.md` (preserved for audit history).

---

## What changed since the prior slice 2 nav proposal

The F13 external audit recommended **5 stable primary destinations** (Explore · Read · Build · Evidence · About) and called out that the existing nav mixes competing classification systems. This proposal adopts the audit's recommendation **additively** — same 2-layer model, with the 5 destinations as the new primary layer and the 7-organ canon as the demoted "Powered by" secondary strip (replacing the 6 organ-mirror v7.3 strip with the ratified 7-organ list per `arifOS/README.md` §2.1).

The 9-room Discovery classification is **out of date** (predates arifOS §2.1 ruling 2026-09-14 and AAA P2 2026-09-21). See `architecture-reconciliation.md` — the 7-organ canon is fixed and Discovery is updated as a content edit.

## Proposed two-layer nav (additive to canon v7.3.0)

```yaml
# ADDITIVE — does not remove or rewrite existing primary_links / secondary_links
primary_links_journey:
  description: Human-journey primary nav (5 slots, F13 audit 2026-10-05).
  rule: "Renders above the organ-mirror primary_links on every page. Maximum 5 items."
  items:
    - { label: "Explore",  href: "/earth/",       question: "What does physical reality show?" }
    - { label: "Read",     href: "/words/",       question: "What does this mean for people?" }
    - { label: "Build",    href: "/work/",        question: "What can I do here?" }
    - { label: "Evidence", href: "/999/",         question: "What evidence is this built on?" }
    - { label: "About",    href: "/institution/", question: "Who is Arif and why does this exist?" }

secondary_links_organs:
  description: 7-organ "Powered by" strip, replacing v7.3's 6 organ-mirror.
  rule: "Always visible. Demoted from v7.3 primary. Updated to match arifOS §2.1 (2026-09-14) + AAA P2 (2026-09-21)."
  items:
    - { label: "arifOS",   href: "/canon/",        role: "authority" }
    - { label: "A-FORGE",  href: "/forge/",        role: "execution" }
    - { label: "AAA",      href: "/machines/",     role: "attention" }
    - { label: "GEOX",     href: "https://geox.arif-fazil.com",   role: "domain:earth" }
    - { label: "WEALTH",   href: "https://wealth.arif-fazil.com", role: "domain:capital" }
    - { label: "WELL",     href: "https://well.arif-fazil.com",   role: "domain:vitality" }
    - { label: "arifFlow", href: "/pulse/",        role: "metabolism" }   # /pulse/ to be replaced with /machine/ per audit F12
  # Note: HERMES and CHRON are NOT in the 7-organ strip; they are boundary services per arifOS §2.1.
  # They appear in the "machine doors" footer, not in human nav.
```

## Why these 5 destinations (not 6, not 9, not 12)

The F13 audit identified **competing classification systems**: Discovery (9 rooms), Missions (6 verbs), Words (3 sections + 9 series + 13 floors). One system wins; the others become supporting text. The 5 destinations collapse the 12 hub-like pages the audit named into a single visible hierarchy:

- **Explore** → /earth/ + /world/ + /economics/ + /malaysia/ + /vitals/ + /world/oil-gas-gold/ (the "subjects" cluster)
- **Read** → /words/ + /words/writing/ + /words/wiki/ + /words/makcikgpt/ + /world/makcikgpt/ (the "interpretation" cluster)
- **Build** → /work/ + /forge/ + machine doors (the "action" cluster)
- **Evidence** → /999/ + /000/ + /999/verify + /pulse/ (the "trust" cluster) — *the audit's most urgent cluster: F01 trust contradiction must be fixed here*
- **About** → /institution/ + /pilot/ + canon links (the "identity" cluster)

## F13 binary decisions needed for slice 2

1. **5 stable primary destinations — adopt or amend.** Audit recommendation, not yet ratified. F13 confirmation: keep the 5, or amend (e.g. add a 6th, rename one, reorder).
2. **7-organ "Powered by" strip — adopt.** This IS the canon (arifOS §2.1, AAA P2); adopting it on the public nav is a logical necessity, not a binary. A-FORGE applies.
3. **/pulse/ in Evidence cluster — fix or replace.** /pulse/ is intentionally 410; the Evidence cluster needs a working destination. Options: (a) /999/ (canonical proof, current state), (b) /machine/ (system status — also deleted, also 410 by audit F12), (c) restore /pulse/ with corrected shell, (d) point Evidence to /000/ instead.
4. **/999/ trust contradiction (F01) — new copy.** The "Every claim sealed" copy must change while verifier is `verified:false`. Proposed new copy (subject to F13 approval): the page displays the verifier's current state (`head`, `verified`, `chain_status`, gap count) instead of "SEALED" badges, and links to `/999/verify` prominently.

## What slice 2 ships in this proposal-only state

| Artifact | Path | Status |
|---|---|---|
| Defect log (18 findings, audit schema) | `defect-log-2026-10-05.md` | DRAFT (proposal_zones) |
| Architecture reconciliation | `architecture-reconciliation.md` | DRAFT (proposal_zones) |
| 5-destination nav proposal | this file | DRAFT (proposal_zones) |
| 7-organ demoted strip | this file | DRAFT (proposal_zones) |
| First-release sequence (F01→F09→...) | defect log §"First-release sequence" | DRAFT |
| 1-line surfaces.json batch (e.g. /pulse/ status:retired) | to be authored in slice 2.1 | TODO |
| `canon/navigation.json` JSON-patch | to be authored in slice 2.2 | TODO |

A-FORGE applies after F13 binary on the 4 decisions above.

DITEMPA BUKAN DIBEI ⚒️
