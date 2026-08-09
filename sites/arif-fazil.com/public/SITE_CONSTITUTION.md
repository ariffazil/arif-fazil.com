# SITE_CONSTITUTION.md — arif-fazil.com

> **For agents. Mandatory read before ANY mutation.** Humans use the site; agents serve the site.
> Ratified by F13 SOVEREIGN (Arif) 2026-08-09 · Source of truth: `/root/arif-fazil.com/SITE_CONSTITUTION.md`

**The one law:** *Human understanding > everything else an agent can build.*

Deployment drift is a symptom. The real drift is when agents still understand the system
but humans no longer understand why it exists. Every rule below exists to prevent that.

---

## RULES

**RULE 1 — Human understanding > protocol exposure**
A newcomer must grasp "who is Arif, what is arifOS, why it exists, what problem it solves"
in 30 seconds, with zero jargon. Protocol pages (MCP, schemas, governance) are for AFTER
the human understands. If a page leads with protocol, it fails.

**RULE 2 — Navigation clarity > feature growth**
A human must reach any core destination in ≤3 clicks: landing, canon, trust, observatory,
organs. Never add a nav item without checking it doesn't bury an existing path.

**RULE 3 — Visual coherence > technical cleverness**
One design language: paper `#0A0B0D`, ink `#EDEAE2`, ember `#E4572E`, gold `#C9A227`.
Reading hierarchy first. No dead visual zones, no scrolling burden. Not pixel-perfect —
but a human must understand faster, not slower.

**RULE 4 — Agent surfaces are secondary**
MCP endpoints, agent cards, JSON, schemas, governance APIs — all serve the human layer.
Never let agent tooling become the reason a page exists.

**RULE 5 — Every page must answer:**
- **What?** — this page is...
- **Why?** — it exists because...
- **Why should I care?** — for a human, this means...

If a page cannot answer all three in plain language, it is not done.

**RULE 6 — Never add a new surface before auditing existing paths**
No new MCP tool, schema, page, or endpoint without first auditing what already exists.
Capability ≠ authority. Ephemeral tools die. Permission stays with arifOS/Arif.

---

## THE THREE LAYERS (in priority order)

```
Layer 1 · HUMAN TRUTH    — who/why/what-problem · 30-second comprehension · zero jargon
Layer 2 · VISUAL TRUTH   — one diagram, one image, one system · understandable without reading
Layer 3 · AGENT TRUTH    — MCP · agent cards · schemas · protocols · governance APIs
```

Agents may only touch Layer 3 after Layers 1–2 are intact.

---

## DEPLOYMENT GOVERNANCE — FOUR AUDIT LANES

Every deployment must pass all four. `human_clarity: required: true` is a build artifact,
not a checkbox.

| Lane | What it audits | Fail signal |
|------|----------------|-------------|
| **A · Technical** | build, release, checksum, drift (existing) | FAIL_TECHNICAL |
| **B · Navigation** | crawl entire site; answer: landing? canon? trust? observatory? newcomer ≤3 clicks? | FAIL_NAVIGATION |
| **C · Visual** | screenshot entire site; consistency, reading hierarchy, color meaning, dead visual zones, scrolling burden | FAIL_VISUAL |
| **D · Attention** | per-page Attention Cost: how long before a human understands why this page exists? | HALT if >3 min read |

> Lane D is the load-bearing one. If the answer takes 3 minutes of reading — HALT.

---

## IDENTITY (do not drift)

- **Who:** Muhammad Arif bin Fazil — exploration geoscientist, PETRONAS Carigali.
- **What:** arifOS — constitutional intelligence kernel; governed AI under law (F1–F13), not vibes.
- **Why:** field discipline applied to AI uncertainty — the same discipline that makes wells flow.
- **System:** Human → arifOS → AAA → A-FORGE → Organs. One diagram. One system.
- **Motto:** DITEMPA BUKAN DIBERI — forged, not given.

---

## ENFORCEMENT

- Agents: read this file before any mutation of the constellation. Cite it in commit messages
  (`constitution: RULE 1` etc.) when a change touches human-facing surfaces.
- `web_zen.py` gains lanes B/C/D (see `web_zen audit` command): navigation crawl, visual
  screenshot pass, attention-cost scoring. Lane A = existing doctor/verify.
- Violation of RULE 1–6 = drift scar; log to scar registry, cool, fix source.

**Ratified:** 2026-08-09 · **Authority:** F13 SOVEREIGN · **DITEMPA BUKAN DIBERI.**
