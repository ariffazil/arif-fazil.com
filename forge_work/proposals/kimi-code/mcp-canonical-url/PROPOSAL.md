# PROPOSAL — Correct canonical identity of the public arifOS MCP page

**Agent:** kimi-code/FI-008 · **Date:** 2026-10-07 · **Zone:** `forge_work/proposals/` (permitted)
**Target files & authority (required disclosure per file-authority.yaml):**

| File | Authority | Agent action |
|---|---|---|
| `sites/arif-fazil.com/public/mcp/index.html` | **DERIVED** (`public/**/*.html`, `hand_edit: false`) | **STOPPED — no edit made** |
| `sites/arif-fazil.com/dist/mcp/index.html` | **DERIVED** (`dist/**`, `hand_edit: false`) | **STOPPED — no edit made** |
| upstream generator | **UNKNOWN — does not exist** | would be required |

Per the fail-closed rules: *"If DERIVED, stop and find upstream SOT. If no lease, produce proposal only."*
No generator exists for this page, and no lease is held. **This is proposal-only. Nothing was mutated.**

---

## 1. The defect

The page served at `https://arifos.arif-fazil.com/mcp/` (HTTP 200, 84,530 bytes) declares:

```html
<link rel="canonical" href="https://mcp.arif-fazil.com/">
<meta property="og:url" content="https://mcp.arif-fazil.com/">
```

But `mcp.arif-fazil.com` is the **MCP transport host**, not the human page:

```
GET https://mcp.arif-fazil.com/mcp/  ->  HTTP 405 Method Not Allowed  (POST-only endpoint)
GET https://arifos.arif-fazil.com/mcp/ -> HTTP 200 (the human page)
```

**Consequence:** the canonical URL of arifOS's public identity is declared to be a
405 endpoint. A crawler or an agent following the canonical link is told the
authoritative version of the page is a protocol endpoint that errors on `GET`.

**Status:** OBSERVED at 2026-10-07, reproducible on demand.

## 2. Proposed change

In `public/mcp/index.html` lines 9 and the `og:url` meta:

```diff
-    <link rel="canonical" href="https://mcp.arif-fazil.com/">
+    <link rel="canonical" href="https://arifos.arif-fazil.com/mcp/">
-    <meta property="og:url" content="https://mcp.arif-fazil.com/">
+    <meta property="og:url" content="https://arifos.arif-fazil.com/mcp/">
```

Two lines. No behavioural change. No Caddy reload required (static HTML).
`mcp.arif-fazil.com` remains correct where it is used as a **transport** reference
(e.g. `scripts/generate-agent-shells.cjs:106,205` link to the agent door) —
those are correct as-is and must not change.

## 3. Blocker that must be resolved before this can be applied

`public/**/*.html` is `DERIVED / hand_edit: false / owner: generator`, **but no
generator produces this file.** It is hand-maintained in practice.

This is a governance contradiction, not just a URL bug. Two valid resolutions:

- **(a)** Declare `public/mcp/index.html` as `SCRATCH` (hand-maintained page) in
  `canon/file-authority.yaml`, then the two-line patch is permitted.
- **(b)** Create a generator, and have it emit the page — larger change, not
  justified by a two-line URL fix.

**Recommendation: (a).** It matches observed reality with the smallest change.

## 4. Verification plan (on approval)

1. `grep 'rel="canonical"' sites/arif-fazil.com/dist/mcp/index.html` → new URL
2. `curl -sI https://arifos.arif-fazil.com/mcp/ | grep -i canonical`
3. Confirm `mcp.arif-fazil.com/mcp/` still 405s (transport unchanged)
4. Confirm no other page regressed (spot-check `/`, `/geox/status/`)

## 5. Related finding — NOT part of this proposal

The same page fetches live `/health` and renders badges from the response
(`data.status === 'healthy' ? ... : 'degraded'`). As of 2026-10-07 the live
kernel reports `status: degraded`, `floors_pass: 9/13`, and
`software_release.drift: true`.

**This is correct behaviour and must not be "fixed".** The page is already
truth-bound — it will render Degraded because Degraded is true. Recording it here
so no future agent treats the honest `degraded` badge as a bug.

## 6. Reversibility

Two lines in one file, tracked by git. `git revert` restores. No service restart,
no DNS, no Caddy reload (AGENTS.md rule 7 forbids `make deploy` without a named
T3 HOLD; this change does not require it).