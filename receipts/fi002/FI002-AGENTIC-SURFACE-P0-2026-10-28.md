# FI-002 · P0 Observation — agentic discovery surface, arif-fazil.com

**Date:** 2026-10-28 · **Actor:** claude-code-kvm8 (FI-002)
**Scope:** Arif's implementation order, P0 only — "observe only, no new claims on public surfaces".
**Authority:** Arif's own verdict on the architecture doc — *SEAL: architecture proposal and draft
artifacts only. HOLD: implementation, key generation, public publishing, route activation, MCP
exposure, WebMCP registration and deployment.* Nothing below is implemented.

---

## 1. The discovery surface already exists — under different names

`public/.well-known/` in the repo holds **27 files**. Probed live, these return 200 `application/json`:

| Path | Bytes |
|---|---|
| `/.well-known/capabilities.json` | 13,694 |
| `/.well-known/agent-registry.json` | 7,284 |
| `/.well-known/ai-constitution.json` | 7,208 |
| `/.well-known/webmcp.json` | 5,381 |
| `/.well-known/arifos-federation.json` | 5,112 |
| `/.well-known/agent.json` | 2,729 |
| `/.well-known/invariants.json` | 2,043 |
| `/.well-known/did.json` | 1,914 |
| `/.well-known/mcp.json` | 1,346 |
| `/.well-known/security.txt` | 358 |

`did.json` is a real DID Document: `did:web:arif-fazil.com`, six services
(constitution, entity, proof-human, proof-authorship, proof-runtime, vault), verificationMethod
present. **The identity plane in the proposal is already deployed.**

## 2. A2A already answers — at a subdomain, from a stub

```
/.well-known/agent-card.json  →  301  →  arifos.arif-fazil.com/.well-known/agent-card.json  →  200
```

The card it returns is four fields:

```json
{ "id": "arifos", "name": "arifOS", "protocolVersion": "1.0", "authority_ceiling": "JUDGE_ONLY" }
```

No `provider`, no `supportedInterfaces`, no `capabilities`, no `skills`, no security schemes.
An A2A client reading it can determine that something called arifOS exists and can learn nothing
else. **This is the real gap** — not a missing route, an under-filled existing one.

## 3. One declared-vs-observed contradiction, inside one federation

`/.well-known/agent.json` (v1.4.0, live) states:

```json
"a2a": false
```

while `arifos.arif-fazil.com/.well-known/agent-card.json` serves an A2A card. The apex denies the
protocol the subdomain is serving. Either the apex field is stale or the subdomain card is
premature. This is INV-10 territory — *Agent Card ≠ authority ledger* — and it exists today,
before anything new is published.

## 4. HTTP 200 that is not an artifact

Four of the routes in the proposed layout return 200 with `text/html` — the React SPA catch-all,
not the JSON they claim:

| Path | Status | Content-Type | Reality |
|---|---|---|---|
| `/receipts/` | 200 | `text/html` | SPA route, not a receipt index |
| `/receipts/index.json` | 200 | `text/html` | **SPA route masquerading as JSON** |
| `/governance/` | 200 | `text/html` | SPA route |
| `/governance/authority-model` | 200 | `text/html` | SPA route |

This is the site committing INV-08 (*HTTP success ≠ world outcome*) against itself. Any agent
probing `/receipts/index.json` receives `text/html` and a 200. A strict client fails; a lenient
one parses HTML as JSON and fails later, further from the cause.

## 5. What the proposal would duplicate

Proposed path | Live reality | Verdict
---|---|---
`/.well-known/agent-card.json` | 301 → subdomain, 200 stub | **fill the existing card**, don't add a second
`/.well-known/did.json` | 200, real DID Document with 6 services | **already done**
`/.well-known/security.txt` | 200 | **already done**
`/.well-known/oauth-protected-resource` | 301 → `mcp.arif-fazil.com`, 200 | **already done**
`/mcp/` | 307 → `https://arif-fazil.com/mcp`; canonical gateway `mcp.arif-fazil.com/mcp` | **already routed**; `/mcp/public` 404
`/agents/`, `/agents/index.json` | 404 | missing
`/capabilities/public.json` | 404 (but `/.well-known/capabilities.json` is 13.7 KB) | **name collision risk** — two capability registries
`/a2a/gateway`, `/a2a/333` | 404 | missing

`/.well-known/mcp.json` already documents 17 tools and a discovery chain to
`mcp.arif-fazil.com/mcp` (405 on bare GET, which is correct for a POST-only MCP transport).
`arifos.arif-fazil.com/api/status` → 200.

## 6. The conclusion this P0 forces

The proposal reads as *build a discovery layer*. The site already has one — spread across three
hosts (`arif-fazil.com`, `arifos.arif-fazil.com`, `mcp.arif-fazil.com`) and ten well-known files,
none of which the human-readable site links to.

So the first work item is not publishing. It is **reconciling three planes that already disagree**:

1. Apex `agent.json` says `a2a: false`; the subdomain serves an A2A card.
2. Two capability registries would exist the moment `/capabilities/public.json` ships
   (`/.well-known/capabilities.json` already holds the data).
3. `/receipts/index.json` answers 200 `text/html` today.

Publishing a new `/agents/` tree on top of that would add a fourth source of truth — the exact
failure LAW 8 names.

## 7. Nothing was changed

- No file published. No route activated. No key generated. No DID edited.
- No MCP or WebMCP registration. No card rewritten.
- Read-only probes only: `curl` against ten well-known paths, three subdomain endpoints, four
  SPA-route paths.

## 8. Recommended P1 order (for Arif's word, not executed)

1. Fix `agent.json`'s `a2a` field to match reality (cheapest, removes a live contradiction).
2. Fill the existing `arifos.arif-fazil.com/.well-known/agent-card.json` with
   provider / interfaces / skills / security — rather than creating a second card at the apex.
3. Make `/receipts/index.json` and `/governance/*.json` return JSON or 404 — never `text/html`.
4. Only then decide whether `/agents/` is needed at all, given `/.well-known/agent-registry.json`
   (7.2 KB) already exists.
