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

---

# ADDENDUM 2 · 2026-10-28c — the eight risks, tested against the live surface

The angel/devil frame is correct as reasoning. What it lacks is a scoreboard: which of the
eight devil risks are *already true on this federation, today*. That is measurable, so it was
measured. Probes only — nothing published, no route added, no key touched, no restart.

## D1–D8 · risk → live state → verdict

| # | Risk | Measured, live | Verdict |
|---|---|---|---|
| D1 | Reconnaissance | The A2A card reveals almost nothing (105 B). `/api/public-state` reveals **92,610 B** of organ names, endpoints, findings, drift. `mcp/auth` names every public/authenticated/irreversible tool. `llms.txt` lists 9 verbs + email + GitHub. | **REALISED — but not via the card.** The card is the *least* revealing surface; the observatory is the disclosure. |
| D2 | Capability exaggeration | Draft card advertising `/a2a` (301 → HTML). `capabilities.json` aliasing different bytes. | **REALISED — two live instances** (Addendum 1, §A2 and §T3). |
| D3 | Identity mistaken for authority | The 105-byte stub puts `authority_ceiling` **inside a discovery document**. AAA's `_membrane` self-declares `authority: THINK` while the extension one layer away says `aaa_ceiling: DISPLAY_ONLY`. | **REALISED — the two smallest and the largest cards both commit it.** |
| D4 | Prompt injection via metadata | Channel exists and is live (`llms.txt` is 6 KB of imperatives addressed to agents). Content is currently benign; no mechanism distinguishes the two. | **CHANNEL LIVE, BENIGN.** Honest state: untested, not safe. |
| D5 | Judge advertised as executor | Checked all 8 AAA skills. `FORGE-route-task` — *"Routing is not execution."* `arifos.session.seal` — *"AAA does not write VAULT999."* `APEX-enforce-sovereign-veto` — veto, sovereign side. | **NOT realised on skills.** Every risky verb carries an inline refusal. This is the angel side, and it is already built. |
| D6 | Stale cards as authoritative-looking lies | **ArifOS card: no freshness field at all. AAA card: no document-level freshness field.** AAA's `_membrane.timestamp` is a frozen snapshot re-served byte-identical forever. | **REALISED — structurally.** Half the discovery layer cannot be aged (§A5). |
| D7 | Review intake as attack amplifier | `request_bounded_review` exists only as a **draft in a file**. There is no transport (Addendum 1, §A2). | **NOT realised — because it was not built.** Risk arrives with the endpoint, not before. |
| D8 | Sovereignty → attention bottleneck | `mcp/auth`: `human_ack_required_for_irreversible: true`, `session_id_is_authentication: false`. No queue or rate surface probed. | **UNMEASURED.** Stated policy is correct; no mechanism found for volume. |

**Scoreboard: 4 realised (D1, D2, D3, D6) · 1 clean (D5) · 1 channel unguarded (D4) · 1 not built (D7) ·
1 unmeasured (D8).**

## E1 · The AAA signature is dead — and the mechanism is now known

Addendum 1 reported this as UNKNOWN: seven canonicalization recipes, none reproducing
`3f0840e0…`. This addendum closes it.

```
tried every subset exclusion of {signatures, _membrane, schema, $schema}  = 16 combinations
result: NO MATCH
```

Two clocks in the same document:

```
signatures[0].created    2026-08-25T03:43:48Z
_membrane.timestamp      2026-10-27T20:02:41.848Z      ← 63 days later
```

**The card mutated after it was signed.** Since no exclusion subset recovers the declared
hash, the signed content is not present in the served bytes at all. Therefore:

> `Ed25519Signature2020` on `aaa.arif-fazil.com` **does not cover the document that is being
> served today.** It is decorative over current content.

Honest boundary (F7): without an archive of the signed version this proves *current ≠ signed*.
It does **not** prove who changed what, or intent. But "signed" is now a claim that fails on
inspection, which is worse than carrying no signature — an unverified signature invites trust
it has not earned.

Contrast, measured this session: the observatory snapshot **verifies end to end** (§A4). The
federation already knows how to do this correctly. The card does not.

## E2 · The `_membrane` block is the devil, and it is live

`aaa.arif-fazil.com/.well-known/agent-card.json` carries, inside a static public discovery file:

```
_membrane.membrane_version  0.3
_membrane.actor             {"organ": "UNKNOWN"}
_membrane.authority         THINK              ← while an extension says aaa_ceiling: DISPLAY_ONLY
_membrane.verdict           UNKNOWN
_membrane.floors_checked    []                 ← zero floors checked
_membrane.witness           {human:0, ai:0.5, external:0, W3:0}   ← W3 = 0
_membrane.receipt           {sealed: false, parent_id: "seal-58"}
_membrane._membrane_warnings  "Paradox P11/P12/P13 matured … Route to 888-APEX for
                               constitutional review."
```

Read that as a machine would. A discovery document — the least-trusted artefact class, read
instead of tested — is carrying a **governance envelope about itself**:

- actor **UNKNOWN**
- authority `THINK`, contradicting the `DISPLAY_ONLY` ceiling stated one layer away
- verdict **UNKNOWN**
- **floors checked: none**
- tri-witness consensus **W3 = 0**
- receipt **unsealed**
- and its own warnings say **route to 888-APEX for constitutional review**

That last line is the whole finding. The block asserts that its governance has *not happened*,
inside the artefact that would be read as a governance statement. A caller who parses
`_membrane.verdict` gets nothing. A caller who parses `authority: THINK` gets a claim the same
document contradicts. A caller who ignores it is reading an unsigned governance stamp that is
re-served forever with a timestamp that only ever ages upward.

This is the deepest point of the essay made literal — **an Agent Card is a map offered by the
territory it describes** — and here the territory has stamped the map with its own verdict.

It is also author = judge. The federation's Gödel lock exists to prevent exactly this.

**Note the sharpest part: `_membrane` appears on 1 of 9 live card documents.** It is not a
convention; it is a one-off. So a caller cannot assume governance metadata is present anywhere,
cannot assume it means the same thing, and cannot assume it was checked.

## E3 · Nine card documents, nine schemas

Probed every `/​.well-known/agent-card.json` and `/​.well-known/agent.json` across 8 hosts:

| Host | agent-card.json | agent.json | `_membrane` | signed |
|---|---|---|---|---|
| `geox` | 17 keys | 25 keys | no | no |
| `wealth` | 41 keys | 38 keys | no | **yes** |
| `well` | 30 keys | — | no | **yes** |
| `aaa` | 17 keys | 16 keys | **yes** | **yes** (fails, §E1) |
| `arifos` | **4 keys** | — | no | no |
| `mcp` | 11 keys | — | no | no |
| `forge` | — | 15 keys | no | no |
| apex | 301 → arifos stub | — | — | — |

Nine documents. Key counts **4 / 11 / 15 / 16 / 17 / 25 / 30 / 38 / 41**. No two alike.
One carries a governance membrane. Three claim signatures. The apex pointer lands on the
**smallest document in the federation**.

This is the semantic fragmentation stated plainly: there is no federation-wide card schema,
no shared freshness field, no common signature recipe, and no rule about which document is
canonical when two host the same concept.

## What is already right — do not rebuild it

1. **Skill-level refusals.** D5 is the only devil risk that measures clean, and it is clean
   because someone wrote the refusal *into the skill description*. That is the pattern to keep.
2. **`mcp/auth`** — 1,098 bytes, states public vs authenticated vs irreversible, and explicitly
   denies that a session id authenticates. The most honest artefact on the surface.
3. **The observatory snapshot** — full ed25519 verification, stated canonicalization, stated
   signed object, `verification_url`. The recipe the card needs already exists in-house.

## The one invariant that survives all eight

> Discoverability should increase access to evidence faster than it increases access to power.

Measured against that: the federation's **evidence** surfaces (snapshot, mcp/auth, llms.txt)
are in better shape than its **power** surfaces (cards, membrane, aliases). The direction is
right. The card layer is the part crediting itself with governance it has not performed.

## Prohibited actions — confirmed not taken

No deploy · no publish · no key generation, rotation or export · no new route · no WebMCP
registration · no MCP exposure change · no A-FORGE mutation · no service restart · no second
Agent Card published · no second capability registry · no self-seal.
All values are `curl` against live URLs or local recomputation.
