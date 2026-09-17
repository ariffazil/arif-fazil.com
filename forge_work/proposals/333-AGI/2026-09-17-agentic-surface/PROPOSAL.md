# PROPOSAL · agents.txt + Signed Discovery Surfaces
**Agent:** 333-AGI Δ MIND (FI-001)
**Date:** 2026-09-17
**Mission:** Lebih Bijaksana / Lebih Arif / Penuh Clarity, Phase 6
**File authority:** PROPOSAL

---

## 1. State of discovery surface (today)

```
/llms.txt          200  (semantic summary, curated)
/llms-full.txt     200  (full content dump)
/llms.json         200  (structured route_roles + machine_surfaces)
/robots.txt        200  (AI-bot allow list + RSL license + Content-Signal)
/rsl.xml           200  (RSL 1.0 license — ai-train permitted with attribution)
/sitemap.xml       200  (53 URLs)
/feed.xml          200  (RSS, 28 items)
/missions.json     200  (six missions)
/surfaces.json     200  (canonical catalog)
/policy.json       200  (public limits)
/identity.json     200  (.well-known/identity.json)
/agent.json        200  (.well-known/agent.json)
/mcp.json          200  (.well-known/mcp.json)
/webmcp.json       200  (.well-known/webmcp.json)
/agents.txt        404  (MISSING — the only gap)
/llms.json/.well-known/mcp/server.json  301 → mcp.arif-fazil.com  (see proposal 2026-09-17-mcp-discovery-redirect)
```

**The federation is already ahead of industry on discovery surfaces.** RSL license declaration, explicit AI-bot allow list, Content-Signal policy, structured llms.json with route_roles — all 2026 best practice. The only thing missing is `agents.txt` (the OAP whitepaper 2026 proposal that's converging in industry).

## 2. agents.txt draft (ready for sovereign ratification)

```text
# arif-fazil.com — agents.txt
# OAP / Agentic Web Interface standard (2026 proposal)
# arif-fazil.com is an agent-ready site. The following declares our access
# policy and capability surface for AI agents acting on behalf of humans.
#
# Convention: https://openagentprotocol-OAP.github.io/oap-spec/papers/agent-web-whitepaper.html
# Generated: 2026-09-17
# Version: 0.1 (draft, awaiting ratification)

User-agent: *
  Allow: /
  Crawl-delay: 0

# ── Agent identity expectation ──
# Agents acting on behalf of a human SHOULD identify via standard headers:
#   User-Agent: <agent-name>/<version>
#   X-Agent-Identity: <DID or signed identifier of the human principal>
#   X-Agent-Intent: read | summarize | cite | transclude | execute
#   X-Agent-Delegation-Chain: <parent agent, root agent, principal>
#
# Agents that DO NOT declare identity may receive rate-limited or stub
# responses. The agent's not unilateral · honesty is the price of admission.

# ── Rate limits ──
Rate-Limit:
  Global: 60 req/min (default; raised for known-good agents via Allow)
  Per-Agent: 600 req/hour
  Per-IP: 600 req/hour
  Burst: 10 req/sec

# ── Intent tiers (server-side enforcement) ──
Intent-Policy:
  read: free · unlimited
  cite: free · must include canonical link
  train: free · must include RSL attribution (see /rsl.xml)
  transclude: free · must preserve provenance
  summarize: free · must declare source
  execute: requires authentication + F13 SOVEREIGN authorization
  high-risk execute: requires explicit human-in-loop confirmation

# ── Capability manifest ──
Manifest: https://arif-fazil.com/.well-known/mcp/server.json
LLMs: https://arif-fazil.com/llms.txt
LLMs-JSON: https://arif-fazil.com/llms.json
Agent-Card: https://arif-fazil.com/.well-known/agent.json

# ── What we will NOT do ──
Refuse:
  - auto-form-submit on the human's behalf without F13 confirmation
  - POST /a2a (intentionally 404 — see canon/file-authority.yaml)
  - script-injection in agent-claimed data (F9 ANTI-HANTU)
  - impersonate the human principal (F13 SOVEREIGN)
  - mutate public state from a non-signed intent (F1 AMANAH)

# ── Human override ──
Sovereign: https://arif-fazil.com/.well-known/identity.json (DID)
Hold: any agent action that fails F1 / F13 → escalates to human before execution

# ── Receipts ──
Receipt: every agent action against an authenticated intent emits a VAULT999 receipt
Verify: https://arif-fazil.com/.well-known/observatory-snapshot-latest.json
```

## 3. Ed25519 signing of discovery surfaces (companion proposal)

Currently, `/llms.txt`, `/llms.json`, `/robots.txt`, `/sitemap.xml`, `/feed.xml` are unsigned. An agent (or anyone) could publish a modified version of these files and clients wouldn't know. Per the OAP whitepaper principle of "cryptographic accountability," these surfaces SHOULD carry ed25519 signatures.

**Existing infrastructure:** the federation already runs ed25519 signing for `.well-known/observatory-snapshot-latest.json` (verified during witness audit — `key_id: ed25519:sha256:698cc1ab26357272`). The same key can sign discovery surfaces.

**Format proposal:**

```
# In each discovery surface, append:
#
# signature: ed25519:sha256:698cc1ab26357272
# signed_at: 2026-09-17T08:30:00Z
# digest_sha256: <hex of file content minus signature block>
# verify: python3 scripts/verify-discovery.py --file llms.txt
```

Or — even simpler — emit a companion `.sig` file per surface (`.well-known/llms.txt.sig`) with the ed25519 signature. The signing pipeline already runs (`generate-discovery.cjs` → emits the surfaces; an ed25519 sign step can be added in the same pipeline).

## 4. Required actions

1. **Add agents.txt to the discovery surface set** — write file at `sites/arif-fazil.com/public/agents.txt` and update `generate-discovery.cjs` to emit it. Owner: WEB_ATLAS (CANON) → A-FORGE / ARIF lease required.
2. **Add ed25519 signing step** to the discovery emit pipeline. Owner: A-FORGE (build) — T1 once approved.
3. **Verify web_zen doctor picks up the new surface** — add `agents.txt` to the verify-surfaces check.
4. **Add Lighthouse agentic-browsing to `make verify`** (closes `chain_verified=UNKNOWN` in public-state).

## 5. Authority required

- `canon/sites.yaml` — declare the new discovery surface. CANON, lease required.
- `sites/arif-fazil.com/scripts/generate-discovery.cjs` — emit the file. DERIVED generator, lease to A-FORGE required.
- `makefile` / `.github/workflows/` — pipeline integration. CANON (per file-authority.yaml §lease).

## 6. Reversibility

100%. All changes additive. Removing agents.txt restores 404.

## 7. Cost of NOT doing this

- `agents.txt` is the proposed standard for 2026 agentic web. Missing it = federation looks unprepared.
- Unsigned discovery surfaces = anyone can poison llms.txt or sitemap.xml with no detection.
- Lighthouse agentic-browsing v13.3 (released 2026-05-07) is the new industry bar. Lacking = audit lag.

## 8. Open questions

1. **agents.txt spec maturity:** OAP whitepaper is 2026 proposal, not ratified standard. Should we publish now or wait for ratification? My read: publish with `version: 0.1` label, evolve with the spec.
2. **Ed25519 signing for ALL surfaces or just llms.txt + agents.txt?** Industry standard is `llms.txt` signed; over-signing has diminishing returns. Recommend signing: `llms.txt`, `agents.txt`, `soul.json`, `feed.xml`, `sitemap.xml`.
3. **Lighthouse agentic-browsing in `make verify`?** Yes — closes the chain_verified=UNKNOWN observation from the witness audit. Non-controversial.

---

**Status:** PROPOSAL — awaiting sovereign decision on (1) publish agents.txt, (2) sign discovery surfaces, (3) wire Lighthouse agentic-browsing.
**Severity:** Medium (industry-positioning, not constitutional violation).
**DITEMPA BUKAN DIBERI ⚒️**