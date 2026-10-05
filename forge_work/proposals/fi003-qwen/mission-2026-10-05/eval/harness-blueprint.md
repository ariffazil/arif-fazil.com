# Evaluation Harness Blueprint — Slice 1.5 follow-up (deferred)

> **Purpose:** document the path to a replayable evaluation harness without pulling the framework into the default install queue today. Per F13's 2026-10-05 directive: "Keep these out of the default installation queue: a new agent framework, another vector database, a graph database without demonstrated relationship queries, mandatory realtime everywhere, and nine new skills corresponding to nine reference websites."

## What we have today (slice 1)

- 5 reader journeys as markdown (eval/journeys.md)
- 5 evidence-check schemas (eval/evidence-checks.md)
- 5 authority-failure cases (eval/authority-failures.md)
- 1 reproducible baseline probe (eval/probe-baseline.py → eval/baseline-2026-10-05/)

The probe today is HTTP-level (status, type, bytes, title, first meta description). It catches:
- 404s and 5xx
- 200-but-actually-empty (body < 2KB)
- Wrong MIME type (text/html served where application/json expected)
- Missing `<title>` or `<meta name="description">`

It does NOT catch:
- Mobile rendering failures (no browser)
- Reader comprehension (no human)
- Auth/authority failure modes
- Visual regressions
- Accessibility

## What we do not add today (explicit "why not now")

Per the 2026-10-05 directive, the following are out of the default install queue. Each is documented here with the **criteria** that would justify adding it later.

| Tool | Why not now | When to add |
|---|---|---|
| **Playwright** + `@playwright/test` | The site mission is to fix the human-first surface, not to install another framework. Playwright is heavy (browser binaries ~300 MB). The HTTP probe today catches the same 60% of slice-1-relevant failures. | When slice 3 (Earth → Money → Evidence journey) needs a true browser-replayable test. Add at that point, scoped to one test directory. |
| **`@axe-core/playwright`** | Same as Playwright. The directive cites it explicitly: "Passing a scanner is not proof of accessibility." | When a real human evaluation finds an a11y issue that HTTP cannot catch. |
| **Inspect AI** (UK AISI) | We do not have an agent evaluation gap yet — the 5 journeys today are the baseline. Adding Inspect before the baseline is in place would parallel two evaluation systems. | When 333-AGI / 555-ASI reports that the 5 journeys no longer cover the failure modes. Add to the existing 5, not as a replacement. |
| **BGE-M3** retrieval | No retrieval gap has been demonstrated. The 5 journeys do not require semantic search. | When HERMES reports a retrieval failure that simple keyword search cannot solve. |
| **JetStream** durable events | The site is not yet producing durable events that need replay. | When CHRON or arifFLOW reports data loss that in-memory transport cannot prevent. |
| **Supabase** application state | The current site is a Vite SPA + static export. No demonstrated gap. | When a feature requires a stateful back-end that the static export cannot serve. Per the directive: "Do not migrate constitutional authority or the authoritative ledger into a new database without explicit authorization." |

## The harness when it is built (slice 1.5, future)

If/when the criteria above trip, the harness should:

1. **Live next to the 5 journeys** — same directory, same naming, one entry point per journey.
2. **Be Playwright-Node or Playwright-Python** — pick one, do not mix. The repo already uses TypeScript in `sites/arif-fazil.com/`, so Playwright-Node is the natural fit.
3. **Emit a single JSON per run** — same shape as `eval/baseline-2026-10-05/probes.json` so future slices can diff the file directly.
4. **Be replayable against any build** — the same harness must run against the current live site, the next preview deploy, and the prior slice's build.
5. **Produce a per-journey score** — for each of the 5 journeys: pass/fail, time-to-success, evidence-fields-visible, and a list of detection events.
6. **Honest about what it cannot do** — the harness's own README must say "this is a probe, not a usability study".

## Open questions (for the slice that adds the harness)

- Where do CI runs live? GitHub Actions? A separate `arifos-ci`?
- Who is the executor — a sibling agent or a dedicated CI agent?
- What is the cadence — every PR, every deploy, daily?
- What is the failure response — fail-the-merge, page the on-call, or just a receipt?
- What is the slice-1.5 budget — does it require F13 re-seal?

These are NOT slice 1's questions. Slice 1 produces the foundation; slice 1.5 builds the harness on top. The blueprint is the seam between them.

DITEMPA BUKAN DIBERI ⚒️
