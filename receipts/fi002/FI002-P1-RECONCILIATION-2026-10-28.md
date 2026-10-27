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

---

# ADDENDUM · 2026-10-28b — live reconciliation of the arifOS observatory surface

Probes only. Nothing published, no route added, no key touched, no service restarted.
All values below are `curl` against live URLs unless marked otherwise.

## A1 · Measured: the arifOS card is a 105-byte stub

```
GET https://arifos.arif-fazil.com/.well-known/agent-card.json
→ 200 application/json   105 bytes
  keys: [authority_ceiling, id, name, protocolVersion]
  supportedInterfaces: absent   skills: 0   capabilities: absent
  provider: absent   signatures: absent   timestamp: ABSENT
```

Contrast, same probe run:

```
GET https://aaa.arif-fazil.com/.well-known/agent-card.json
→ 200 application/json   11,942 bytes
  8 skills · provider · securitySchemes · signatures · $schema
```

The apex `/.well-known/agent-card.json` still 301s to the 105-byte stub. That is the
whole of the federation's public A2A discovery, expressed in 105 bytes.

**The stub carries no freshness field of any kind.** A card with no `observed_at`, no
`generated_at`, no version date cannot be aged. It will read as current truth forever.

## A2 · HARD GATE — the proposed card advertises an endpoint that is declared not to exist

The draft card reviewed this turn declares:

```json
"supportedInterfaces": [{
  "url": "https://arifos.arif-fazil.com/a2a",
  "protocolBinding": "JSONRPC",
  "protocolVersion": "1.0"
}]
```

Live probe of that exact URL:

```
GET  /a2a  → 301  Location: https://arif-fazil.com/arifos/
POST /a2a  → 301  Location: https://arif-fazil.com/arifos/
             (A2A-Version: 1.0, JSON-RPC message/send body)
https://arif-fazil.com/arifos/ → 200 text/html   39,040 bytes
```

And the federation says so itself — `https://arifos.arif-fazil.com/llms.txt`, verbatim:

> `- Public POST /a2a is not offered.`

So publishing that card would contradict the federation's own published boundary, in
machine-readable form, on the exact surface an autonomous client trusts most. An A2A
client discovers the interface, POSTs `message/send`, receives a 301, follows it, and
gets a React page.

**This is the same failure class as the phantom `.json` routes in §T4** — a machine-readable
artefact promising something the router does not deliver. It is worse, because a card is
*read instead of tested*.

**Gate:** either the transport is built and probed (POST reachable · JSON-RPC binding correct ·
`A2A-Version` handled · `message/send` supported · auth behaviour known · error shape conformant),
**or** `supportedInterfaces` is omitted. A card with no interface is honest; a card with a
dead interface is a lie. There is no third option.

## A3 · Correction to the "stale public-state / two-era vocabulary" reading

That reading does not survive the probe, and the correction matters because it changes the fix.

```
GET https://arifos.arif-fazil.com/api/public-state → 200 application/json  92,610 bytes
generated_at                    2026-10-27T20:04:22Z     ← ~1 day old, not 3 Aug
organs.arifos.identity_state    UNVERIFIED               ← honest about arifOS itself
organs.geox.identity_state      VERIFIED
apex.observed_at                2026-10-27T20:04:22Z
capabilities.as_of              2026-10-27T20:04:07Z
runtime_identity.observed_at    2026-10-27T20:04:21Z
```

**The document is fresh, and arifOS is the organ that grades itself `UNVERIFIED`.**
The vocabulary conflict is real but it sits *inside one document, across organs*
(arifos `UNVERIFIED` vs geox `VERIFIED`, no stated ranking between them) — not between
an old document and a new one. The fix is a declared state ladder, not a re-generation.

What the document does carry, measured:

```
"VERIFIED" string occurrences      15
null confidence fields             70
fleet.observed_at                  null
findings.items[0].timestamp        null
```

70 null confidences beside 15 `VERIFIED` labels is the defect: absence of measurement is
being rendered in the same visual register as a positive claim. `UNKNOWN` and `VERIFIED`
must not look alike.

## A4 · A fully verifiable signature DOES exist in this federation — on the snapshot, not the card

The observatory snapshot verifies end to end. This is the strongest positive result of the
reconciliation, and it supplies the recipe the AAA card is missing.

```
GET https://arifos.arif-fazil.com/.well-known/observatory-snapshot-latest.json
→ 200 application/json   179,040 bytes
observed_at 2026-10-27T20:04:21Z
signature.algorithm         ed25519
signature.state             signed
signature.key_id            ed25519:sha256:698cc1ab26357272
signature.canonicalization  sort_keys+separators+utf8+no_nan
signature.verification_url  /.well-known/did-arifos-observatory.json
signature.payload_hash_sha256  ca385cda9b3d8580…
```

Independent recomputation (FI-002, this turn):

| Step | Result |
|---|---|
| canonical = JCS(sort_keys, sep `,`/`:`, utf8, no_nan) of document **minus** `signature` | — |
| sha256(canonical) vs `payload_hash_sha256` | **MATCH** `ca385cda…` |
| resolve key `did:web:arifos.arif-fazil.com#observatory-key-1` | Multikey, multibase `z`, `ed01` → 32-byte ed25519 |
| ed25519 verify over `sha256(payload)` | FAIL |
| ed25519 **verify over the raw canonical payload** | **PASS** |

Two findings from that:

1. **The signature signs the raw canonical payload, not the hash.** `payload_hash_sha256` is a
   separate integrity field. Anyone verifying by signing-order guesswork gets FAIL and concludes
   "bad signature" — which is exactly what happened to the AAA card. **Document the signed
   object, not just the canonicalization.**
2. **A verifiable card is achievable here today.** The materials exist. The AAA card has a
   `canonical_sha256` but no stated signed object, so its signature is unverifiable by
   construction — a documentation defect, not necessarily a cryptographic one.

**Caveat, F2:** the key document and the payload are served from the **same origin**
(`arifos.arif-fazil.com`). The snapshot labels itself `independent_or_self_reported:
"independent"` — that is a **self-label, not a measured property**. Verification proves key
custody and internal consistency *at that origin*. It does not prove independence, and a
compromised origin could sign anything. Signature = provenance, never benevolence.

## A5 · Canonical precedence — proposal, SPEC, not implemented

The ordering proposed this turn is a good one and is recorded as **SPEC, unimplemented**:

```
1. Fresh signed witness snapshot
2. Current observatory state
3. Canonical capability registry
4. Agent Card discovery metadata
5. llms.txt explanatory narrative
6. Historical public-state snapshots
```

What is actually measurable today, and in what order freshness even exists:

| Surface | Freshness field | Age at probe |
|---|---|---|
| observatory snapshot | `observed_at` | seconds |
| `/api/public-state` | `generated_at` | ~1 day |
| `/api/public-state` sub-organs | `identity_state` | mixed, unranked |
| AAA agent card | none | unageable |
| arifOS agent card (stub) | **none** | unageable |
| `/.well-known/agent.json` | version string only | unageable |

**Half the discovery layer cannot be aged at all.** Precedence cannot be enforced over
artefacts that carry no time.

## A6 · Surfaces confirmed live (200, correct content-type)

```
arifos.arif-fazil.com/llms.txt                200 text/plain      6,102 B
arifos.arif-fazil.com/mcp/auth                200 application/json 1,098 B
  auth_mode: public_read_or_auth_bearer · session_id_is_authentication: FALSE
  write_tools_require_auth: TRUE · human_ack_required_for_irreversible: TRUE
arifos.arif-fazil.com/.well-known/did-arifos-observatory.json
                                              200 application/json   759 B
```

`mcp/auth` is the cleanest artefact on the surface: it states what is public, what is
authenticated, what needs a human, and it explicitly denies that a session id authenticates.
That is the register the Agent Card should be written in.

## A7 · What this changes in the exit condition

Unchanged: still **BLOCKED**, still three decisions with Arif. But one of them is no longer
finely balanced.

Publishing a card with `supportedInterfaces` pointing at a URL that 301s to an HTML page is
**not a design choice — it is a false machine-readable claim**, and the federation's own
`llms.txt` already denies it. Shipping that card would make the discovery surface less
trustworthy than the 105-byte stub it replaces.

Recommended shape if a card is published before any transport exists:

```
canonical      https://aaa.arif-fazil.com/.well-known/agent-card.json   (real, 8 skills)
apex 301       → that card
arifOS card    identity + documentationUrl + skills marked read-only,
               NO supportedInterfaces, explicit freshness field
```

That is honest: it advertises what exists, names what it cannot do, and can be aged.

## Prohibited actions — confirmed not taken in this addendum

No deploy · no publish · no key generation, rotation or export · no new route · no WebMCP
registration · no MCP exposure change · no A-FORGE mutation · no service restart · no second
Agent Card published · no second capability registry · no self-seal.
Every value above is a `curl` against a live URL or a local recomputation.
