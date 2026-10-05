# Reader Journeys — Evaluation Foundation, arif-fazil.com (2026-10-05)

> **Purpose:** five concrete, browser-replayable journeys that span the user surface. They are the regression set every future slice must be measured against. Authored in `proposal_zones` per `canon/file-authority.yaml`.

Each journey follows the shape: **Persona · Start · Goal · Path · Success criterion · Falsification**.

---

## Journey 1 — Journalist verifying a PETRONAS claim

- **Persona:** Malaysian business journalist, has a 30-minute deadline, needs a single citable figure.
- **Start:** `https://arif-fazil.com/`
- **Goal:** Find PETRONAS post-dividend residual cash (PDRC) for FY2025, with a verifiable source citation.
- **Expected path:** Home → About → Vitals → identify the PDRC line → see the source citation → return home.
- **Success criterion:** PDRC figure + source citation + last-checked date all visible in ≤ 30 seconds. Figure has units (RM billion) and is dated within the past 12 months.
- **Falsification mode:**
  - `/vitals/` returns 404 or 5xx
  - PDRC figure absent, or present without source
  - Source citation is itself a Wikipedia-style secondary reference (must be primary: BNM, PETRONAS annual report, Bursa filing)
  - Last-checked date > 12 months, or absent
  - Page requires 3+ minutes to read to extract the figure (Lane D HALT)

## Journey 2 — Student reading an essay on AI governance

- **Persona:** Undergraduate, first encounter with constitutional AI, no federation vocabulary.
- **Start:** `https://arif-fazil.com/`
- **Goal:** Read a single essay on constitutional AI / arifOS / F1-F13, understand the main argument, see a few sources.
- **Expected path:** Home → Read → Essays → pick an essay → read the body.
- **Success criterion:** Essay body loads in ≤ 20 seconds, renders readably on mobile (no horizontal scroll, ≥ 16px body type), has ≥ 3 inline sources, has a "what is this?" lede visible without scrolling.
- **Falsification mode:**
  - 404 on `/words/` or `/words/writing/`
  - Essay body is < 1,000 characters (looks like a stub)
  - Mobile viewport: horizontal scroll, < 14px body, no `<meta viewport>`
  - No sources, or sources are all internal (federation referencing itself is not evidence)
  - First paragraph leads with jargon ("F13 SOVEREIGN", "constitutional kernel", "MCP") without a 15-year-old-test explanation (per `SITE_CONSTITUTION.md` Rule 1)

## Journey 3 — Developer checking if they can integrate with arifOS

- **Persona:** Senior backend engineer, evaluating arifOS as a governed-AI primitive, technical literacy high, time low.
- **Start:** `https://arif-fazil.com/`
- **Goal:** Find the MCP endpoint, the auth method, and a hello-world example. Confirm it's reachable from outside.
- **Expected path:** Home → Build → see A-FORGE / arifOS links → click through to docs.
- **Success criterion:** MCP URL visible, auth method (key, header, or none) visible, a working example with expected output visible, all in ≤ 30 seconds. The MCP endpoint must be reachable: `curl -I <mcp-url>` returns 200 or 401 (never 404 or 5xx).
- **Falsification mode:**
  - No MCP URL on the public surface
  - Auth method unclear (must say: API key in `Authorization: Bearer`, or did:web, or signature)
  - No hello-world example, or example does not run
  - Linked docs page (e.g. `forge.arif-fazil.com` or `mcp.arif-fazil.com`) is 404 or 5xx
  - Public surface exposes a working API key (F11 violation)

## Journey 4 — Verifier checking the seal chain integrity

- **Persona:** Auditor, security researcher, or journalist who needs to confirm the federation's tamper-evidence claim.
- **Start:** `https://arif-fazil.com/`
- **Goal:** Confirm the VAULT999 seal chain is intact — `head_hash` is published, chain has no gaps, last entry is within a reasonable window.
- **Expected path:** Home → Evidence → `/999/verify` → read the response.
- **Success criterion:** `/999/verify` returns JSON with `head` (hash), `head_seq`, `verified:true`, `chain_status:"ok"`. Response time < 500 ms.
- **Falsification mode (CURRENT — slice 1 must report this):**
  - `verified:false` ← **this is the current state, flagged T0 2026-10-05**
  - `chain_status:"gaps-found"` ← also current
  - `head_count_seq != head_seq` ← 17-entry gap currently
  - `/999/verify` is slow (> 5s) or returns 5xx
  - No public documentation of the chain format (so the verifier can't interpret the response)

**This journey is the canary.** It will fail today. That is the FIRST problem slice 2 must solve, even before shared nav. The federation cannot advertise "evidence-grounded" while the seal chain reports gaps.

## Journey 5 — First-time visitor learning who Arif is

- **Persona:** Curious newcomer, knows nothing about AI governance, found the site via a friend's link.
- **Start:** `https://arif-fazil.com/`
- **Goal:** Understand, in 30 seconds: who Arif is, what he does, what arifOS is, why the site exists.
- **Expected path:** Land on `/` → read the top of the page.
- **Success criterion:** Hero block answers: **Who** (Arif Fazil, geoscientist, PETRONAS), **What** (a federation of governed AI), **Why** (field discipline applied to AI uncertainty). No jargon before the answer. Mobile and desktop both pass.
- **Falsification mode:**
  - Hero leads with protocol/MCP/schemas/jargon (Rule 1 violation)
  - "Who is Arif" is not visible above the fold
  - 30-second comprehension test fails: a first-time reader cannot paraphrase the site in one sentence
  - "Why should I care" is missing (Rule 5 violation: every page must answer What / Why / Why-should-I-care)

---

## Notes for the harness (slice 1.5 follow-up)

- All 5 journeys are browser-replayable. Playwright is the candidate per directive; not added this slice.
- Each journey's success criterion is **automatable as an assertion** (status check, content check, viewport check). The blueprint in `eval/harness-blueprint.md` makes this concrete.
- A journey is a **probe**, not a **usability study**. The directive's caveat: *"Passing a scanner is not proof of accessibility."* These probes catch *broken* journeys; they do not certify *good* journeys.
- Adding a journey is cheap; removing one is hard. Journeys 1–5 are the foundation; new journeys enter via proposal and 555-verify.

DITEMPA BUKAN DIBERI ⚒️
