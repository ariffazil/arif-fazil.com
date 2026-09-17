# PROPOSAL · /.well-known/mcp/server.json at Apex
**Agent:** 333-AGI Δ MIND (FI-001)
**Date:** 2026-09-17
**Mission:** Lebih Bijaksana / Lebih Arif / Penuh Clarity, Phase 3
**File authority:** PROPOSAL

---

## 1. Drift observed

`curl https://arif-fazil.com/.well-known/mcp/server.json` returns **301** to `arifos.arif-fazil.com/.well-known/mcp/server.json` which itself returns **200** from `mcp.arif-fazil.com/.well-known/mcp/server.json` (34,772 bytes — the canonical MCP server manifest).

**There is no `mcp/server.json` at the apex.** Only `mcp.json` (older MCP discovery, 921 bytes) exists at `arif-fazil.com/.well-known/mcp.json`.

## 2. Trace

The discovery surface architecture currently in source (`/root/arif-fazil.com/sites/arif-fazil.com/public/.well-known/`):

| File | State |
|---|---|
| `mcp.json` | EXISTS — older MCP-style declaration, declares A-FORGE + endpoint `forge.arif-fazil.com/mcp` |
| `agent.json` | EXISTS — agent card |
| `webmcp.json` | EXISTS — WebMCP browser tool manifest |
| `did.json` | EXISTS — DID document |
| `identity.json` | EXISTS — identity record |
| `mcp/server.json` | **MISSING** — the 2026-spec discovery file |

The MCP 2025-11-25 spec declares `/.well-known/mcp/server.json` as the canonical discovery path. Naive clients that don't follow 301s (or per MCP spec SHOULD-follow clients) cannot bootstrap against the apex. They have to either know `mcp.arif-fazil.com` or follow the chain.

## 3. Why the redirect exists (current intent, not documented)

The Caddy rule for `.well-known/mcp/server.json` apparently redirects to `arifos.arif-fazil.com` (apex-host-anchored), which itself redirects to `mcp.arif-fazil.com`. The architecture per `AGENTIC_WEB_WORLD_MODEL.md` is:

> *"Organ domains = federation edges. Agents dock there; humans discover them through apex."*

So the design intent is: **apex redirects to organ host** (so the organ host is the canonical answer, and apex is the document). This matches the canonical 3-plane architecture (human/machine/agent).

The 301 is therefore **spec-compliant** — clients SHOULD follow redirects. The witness audit was wrong to label it drift.

## 4. But: spec compliance ≠ industry practice

Industry consensus (Attract Group, NN/g 2026): agents are brittle. A redirect on `.well-known/mcp/server.json` breaks naive clients and adds latency. Brian Solis (A2A Summit): "machine-native markets require machine-readable trust at first hop."

Three possible fixes:

| Option | Effort | Risk | Reversibility |
|---|---|---|---|
| **A. Spec-compliant: keep 301, document explicitly** | Low (this proposal + canon doc) | Low (clients SHOULD follow) | full |
| **B. Add `mcp/server.json` to apex that mirrors the canonical** | Med (file generation in build pipeline) | Med (must stay in sync with canonical; 34,772 bytes is too big to inline naively) | full |
| **C. Replace Caddy rule: serve apex from same upstream as mcp** | High (Caddy reload = T3 HOLD) | Med (changes organ-host-anchored architecture) | full |

**Recommended: Option A.** The 301 is correct per spec. The fix is **declaration**, not re-routing. We document the redirect chain as the canonical discovery path so:
- Clients that follow 301s work
- Clients that don't are told via `agent.json` and `mcp.json` that the canonical endpoint is `mcp.arif-fazil.com`
- Future writes can decide to add Option B if naive-client complaints materialize

## 6. Required artifacts

1. **`agent.json`** — add `mcp.canonical_endpoint: "https://mcp.arif-fazil.com/.well-known/mcp/server.json"` and `mcp.discovery_chain: ["arif-fazil.com → arifos.arif-fazil.com → mcp.arif-fazil.com"]` (DERIVED — generator-writable, no lease)
2. **`canon/tool-surfaces.json`** — declare `mcp/server.json` as the canonical MCP discovery, owned by arifOS kernel, served at apex via redirect chain (CANON — requires A-FORGE or ARIF lease)
3. **AGENTS.md** at apex — already points to `https://mcp.arif-fazil.com/mcp` as the MCP endpoint; the redirect chain is implicit but undocumented

## 7. Authority required

- CANON files: `canon/tool-surfaces.json`, possibly `canon/sites.yaml`. Lease required.
- DERIVED files: `sites/arif-fazil.com/public/.well-known/agent.json` — generator-writable.

## 8. Reversibility

100%. No mutation attempted in this proposal phase.

---

**Status:** PROPOSAL — awaiting sovereign decision on Option A vs B vs C.
**DITEMPA BUKAN DIBERI ⚒️**