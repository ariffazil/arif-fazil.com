# FI-002 · P1 Reconciliation — agentic discovery surface

**Date:** 2026-10-28 · **Actor:** claude-code-kvm8 (FI-002, engineer lane)
**Authority:** Arif, "P1 RECONCILIATION ONLY". No deploy, no publish, no keys, no new routes,
no MCP/WebMCP change, no A-FORGE mutation, no restart, no second card, no second registry.
**Nature:** Lane B receipt. Not a SEAL. No verdict authority.

---

## Headline

The federation already has a **complete, signed, spec-shaped Agent Card** — and the apex
redirect does not point at it. Meanwhile `agent.json` declares `"a2a": false` in one file and
`"a2a": "Agent-to-Agent protocol via AAA gateway"` in another, and the site's SPA catch-all
answers every phantom `.json` path with `200 text/html`.

Reconciliation, not expansion. Nothing published.

---

## T1 · `agent.json` — what `"a2a": false` means

**File:** `public/.well-known/agent.json` v1.4.0, 2,729 B
**Generated?** No generator writes it. `scripts/generate-discovery.cjs` only *references* the
path in llms.txt output. It is hand-maintained.
**Consumers found in-repo:** `generate-discovery-graph.cjs` (links it at depth 2 and in HTML),
`prerender-articles.cjs` (`<link rel="agent">`), `generate-discovery.cjs` (llms.txt),
`src/pages/Human.tsx`.

**The field appears four times, in four different shapes:**

| Artifact | Value | Reads as |
|---|---|---|
| `.well-known/agent.json` | `"a2a": false` | this apex offers no A2A endpoint |
| `agents.json` | `"a2a": false` | same |
| `.well-known/capabilities.json` → `protocols.a2a` | `"Agent-to-Agent protocol via AAA gateway"` | federation-level, delegated |
| `discovery/index.json` → `capabilities[1].endpoints.a2a` | `"https://aaa.arif-fazil.com/a2a/"` | an actual URL |

**Observed routing resolves the ambiguity in favour of "delegated":**

- `https://aaa.arif-fazil.com/.well-known/agent-card.json` → **200 application/json**
- `https://aaa.arif-fazil.com/a2a/` → **200 text/html** (SPA shell, not a JSON-RPC endpoint)
- `https://arifos.arif-fazil.com/.well-known/agent-card.json` → **200 application/json**

**Conclusion:** `"a2a": false` is *correct for the apex* and *misleading at federation scope*.
It is a boolean standing in for a four-state question (native / federation / delegated /
verified). Per the brief: **value not changed.** A shape change would break consumers that
expect a boolean — and the consumers were not enumerated beyond this repo.

**Staged representation (not applied):** replace the boolean with an object and keep a
backward-compatible alias, OR leave `a2a: false` and add `a2a_federation: {...}` beside it.
Neither is written to any file. This is a schema decision, not a probe result.

---

## T2 · The canonical card — the stub is not the best card in the federation

| | `arifos.arif-fazil.com` (apex 301 target) | `aaa.arif-fazil.com` |
|---|---|---|
| Size / fields | 4 fields | ~7 KB |
| `$schema` | none | `a2a-protocol.org/schemas/agent-card/v1.0` |
| `provider` | none | present |
| `supportedInterfaces` | none | JSONRPC 1.0 |
| `capabilities` | none | 8 extensions (federation-gateway, verdict-grammar, governed-identity, governance, metadata, federation-prompts, kernel-skills, sovereign) |
| `securitySchemes` | none | oauth2 + http bearer |
| `skills` | none | 8 |
| `signatures` | none | Ed25519Signature2020 block |
| `authority_ceiling` | `JUDGE_ONLY` (private field) | `aaa_ceiling: DISPLAY_ONLY` in an extension |

**The apex redirect points at the weaker card.** `/.well-known/agent-card.json` 301 →
`arifos.arif-fazil.com`, while `aaa.arif-fazil.com` carries the real federation gateway card
that itself declares `judge_endpoint: https://arifos.arif-fazil.com/mcp` and
`judge_tool: arif_judge`.

**Recommended reconciliation (not actioned):** apex 301 → the AAA card; retire the arifOS stub,
since the AAA card already routes to arifOS as an organ. Cheaper and removes a duplicate actor.

**Staged candidate if enrichment is preferred instead:**
`.staging/p1/agent-card.arifos.CANDIDATE.json` — standard A2A fields only, private vocabulary
moved into a named extension, and every unmeasured field left **absent** rather than invented.
Five UNKNOWNs are listed in `_staged_meta`. Not published.

**Signature check on the AAA card — result: UNKNOWN, not PASS, not FAIL.**
The card declares `Ed25519Signature2020`, `canonical_form: JCS-sorted-keys-no-whitespace`,
`verificationMethod: did:web:arif-fazil.com#arif-fazil`, `canonical_sha256: 3f0840e0…`.
The DID key resolves: multibase `z…`, multicodec `ed01` (ed25519-pub), 32-byte key extracted.

Seven canonicalization recipes were tried against the served bytes; **none reproduce
`3f0840e0…`**:

```
JCS no-sig            eea8836d…      JCS with sig-stub     b4edee05…
JCS no-sig ascii      70a796cd…      raw body              d2b3a888…
default no-sig        bfc291e1…      raw body stripped     d2b3a888…
JCS no-sig no-$schema 71f2c3ca…
```

Ed25519 verification over those bytes therefore fails — **but a failure to reproduce the
canonical hash is not proof the signature is bad.** It means either the card changed after it
was signed, or the canonicalization recipe is undocumented. Both are defects; neither is
"signed correctly". **Status: signature unverified. Do not present this card as verified.**

---

## T3 · `capabilities.json` — exists, generated elsewhere, aliased to a different document

| Question | Answer (OBS) |
|---|---|
| Canonical URL | `https://arif-fazil.com/.well-known/capabilities.json` |
| Version | `2.0.0`, `generated_at 2026-10-23T13:18:13Z` |
| Generator | **`WEALTH scripts/sync_manifest.py (from runtime mcp.list_tools)`** — a different repo |
| `$schema` | points at **itself** — no external schema, so nothing can validate it |
| Scope | 5 surfaces: `arif-fazil.com`, `arifos.`, `geox.`, `wealth.`, `well.` |
| Consumers in-repo | `arifos-federation.json`, `federation/identity.json`, `_shared/arifos-federation.json` |

**Two defects:**

1. **The declared compatibility alias is a different document.**
   `compatibility_alias: "https://arif-fazil.com/capabilities.json"`, but
   `/.well-known/capabilities.json` = `8c53976b…` while `/capabilities.json` = `a82f4381…`.
   An alias that serves different bytes is not an alias.

2. **Entry shapes are not uniform.** `wealth.` carries 12 keys (`tool_urls`, `authority_ceiling`,
   `final_authority`); the other four carry 3–4 (`ring`, `role`, `capabilities`, `mcp_endpoint`).
   A consumer cannot iterate surfaces generically.

**`/capabilities/public.json` was NOT created.** The registry exists; the open question is
scope (domain / federation / agent / MCP / public-only), which is a decision, not a probe.

---

## T4 · Machine-readable route honesty — current vs intended

Enumerated all **224** `.json` files under `public/` plus the SPA-route `.json` paths that have
no backing file.

### Current state — paths that lie

| Path | Status | Content-Type | Truth |
|---|---|---|---|
| `/receipts/index.json` | 200 | `text/html` | SPA catch-all |
| `/governance/index.json` | 200 | `text/html` | SPA catch-all |
| `/governance/authority-model` | 200 | `text/html` | SPA catch-all |
| `/governance/authority-model.json` | 200 | `text/html` | SPA catch-all |
| `/world/index.json` | 200 | `text/html` | SPA catch-all |
| `/aaa/llms.json` | 301 → `text/plain` | `text/plain` | resolves, wrong type for the suffix |
| `/forge/llms.json` | 301 → **404** | — | honest, but the apex 301 hides it |
| `/wiki/docs/canon/CANON_SEAL_LOG.json` | 301 → **404** | — | honest |
| `/_routes.json`, `/mcp/llms.json`, `/mcp/proof/index.json`, `/writing/index.json` | 404 | `text/plain` | honest |

**Root cause is one rule, not five paths:** the SPA catch-all
`try_files {path} {path}/index.html /index.html =404` (live vhost line 2428) matches any
unmatched path, including machine-readable suffixes. Every nonexistent `.json` path on the
domain is therefore a fake 200. The five paths above are samples, not the set.

### Intended state

A `.json` / `.jsonld` / `.webmanifest` / `.ndjson` path either resolves to a real file or
returns **404**. Never `text/html`.

### Staged fix — not applied

`.staging/p1/caddy-json-honesty.conf` — one matcher block, insert point named, with the exact
apply command, the three verification curls and the rollback. Semantics:
`try_files {path} =404` inside a suffix-scoped handle, so existing real `.json` files are
untouched and only the phantom ones start telling the truth.

**Also found:** the DID's own `VerificationService` endpoints are SPA pages —
`/proof/human`, `/proof/authorship`, `/proof/runtime` all return **200 `text/html`**. A DID
document advertising verification services that serve a React page is the same defect class,
one layer up.

---

## T5 · `did.json` validation

| Check | Result |
|---|---|
| JSON syntax | **PASS** |
| `id` = `did:web:arif-fazil.com`, resolves at `/.well-known/did.json` | **PASS** |
| `@context` | `did/v1` + `w3id.org/security/v1` |
| `verificationMethod` count | **1** — `#arif-fazil`, type `Multikey`, controller correct |
| Key material | multibase `z…`, multicodec `ed01` = ed25519-pub, 32-byte key |
| `authentication` / `assertionMethod` | both reference `#arif-fazil` |
| `#arif-fazil` matches the AAA card's `verificationMethod` | **PASS** |
| Service endpoints reachable | **6/6 → 200** (constitution, entity, proof-human, proof-authorship, proof-runtime, vault) |

**No key generated, rotated, exported or replaced.**

| Status | Value |
|---|---|
| DID discovery | OBSERVED |
| DID syntax / structure | PASS |
| Service endpoint reachability | PASS (HTTP) |
| Service endpoint semantics | **FAIL** — 3 of 6 are SPA pages, not services |
| Proof of private-key control | **UNKNOWN** — no challenge mechanism exists to test, and none was run |
| Rotation / revocation procedure | **UNKNOWN** — not documented anywhere probed |
| Operational identity | **PARTIAL** |

---

## T6 · Deliverables

| Item | Path |
|---|---|
| This receipt | `receipts/fi002/FI002-P1-RECONCILIATION-2026-10-28.md` |
| Staged Caddy fix | `.staging/p1/caddy-json-honesty.conf` |
| Staged Agent Card candidate | `.staging/p1/agent-card.arifos.CANDIDATE.json` |
| Route matrix (current / intended) | §T4 above |
| Content-type probes | §T4, §T5 tables |
| Redirect-chain probes | §T4 (`/aaa/*`, `/forge/*`, `/makcikgpt-md/*`, `/wiki/*`) |
| Schema validation | §T5 DID; capabilities.json has no external schema to validate against |
| Rollback plan | in `caddy-json-honesty.conf` |
| Production artifact hash (rollback target) | `dist/` 89 MB, mtime 2026-10-28 02:31:30 +0800; live CSS `/assets/index-Cuat_Uam.css` |

## Prohibited actions — confirmed not taken

No deploy · no publish · no key generation or rotation · no new route · no WebMCP registration ·
no MCP exposure change · no A-FORGE mutation · no service restart · no second Agent Card
published · no second capability registry · no self-seal.

Every probe was `curl` or `playwright` against a live URL, or a read of a repo file.

---

BLOCKED at gate: P1 deploy authorization.
reason: three reconciliation decisions are Arif's, not measurable ones — (a) whether the apex
A2A pointer should move from the arifOS stub to the signed AAA card or the stub should be
enriched, (b) what `"a2a"` should mean as a type, given four shapes in four artifacts, and
(c) whether `capabilities.json` is the canonical registry or a WEALTH-side projection.
evidence: `receipts/fi002/FI002-P1-RECONCILIATION-2026-10-28.md`
