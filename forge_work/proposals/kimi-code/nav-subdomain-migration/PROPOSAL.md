# PROPOSAL — Migrate organ navigation to real subdomains

**Agent:** kimi-code/FI-008 · **Date:** 2026-10-07
**Target:** `canon/navigation.json` — **state: CANON, owner: WEB_ATLAS, allowed_mutators: [A-FORGE, ARIF]**
**Authority:** granted verbally by ARIF (F13 sovereign, an allowed mutator) — "migrate all and make sure navigation design is aligned".

## Evidence: 4 of 7 organ links land on the wrong page

Title-aware probe of `secondary_links_organs` (v7.3.0, as_of 2026-10-03):

| Organ | nav href | Lands on | Verdict |
|---|---|---|---|
| arifOS | `/canon/` | *Doctrine — The 13 Floors + 13 Shadow Paradox* (`/words/doctrine/`) | ❌ wrong page |
| A-FORGE | `/forge/` | *arifOS MCP — Constitutional AI Gateway* (`mcp.arif-fazil.com`) | ❌ wrong organ |
| AAA | `/machines/` | *For Machines — arif-fazil.com* | ❌ wrong host |
| GEOX | `https://geox.arif-fazil.com` | *GEOX — Earth Intelligence Platform* | ✅ |
| WEALTH | `https://wealth.arif-fazil.com` | *WEALTH — Sovereign Capital & Market Synthesis* | ✅ |
| WELL | `https://well.arif-fazil.com` | *WELL — Sovereign Homeostasis & Vitality Substrate* | ✅ |
| arifFlow | *(null)* | — | ❌ no href |

GEOX/WEALTH/WELL were migrated to subdomains. arifOS, A-FORGE, AAA, arifFlow were not.
A status-only check passes all four (they 200 after redirect) — **the defect is only
visible when you read where the link lands.**

## Second misalignment: `machine_links`

`machine_links` (11 entries) lists GEOX/WEALTH/WELL subdomains but:
- `arifOS → /canon/` — same wrong path as above
- **AAA — absent entirely**
- **A-FORGE — absent entirely**
- **arifFlow — absent entirely**

An agent reading the machine surface cannot discover 3 of the 7 organs.

## Proposed change

`secondary_links_organs`:

```diff
- arifOS     /canon/
+ arifOS     https://arifos.arif-fazil.com/
- A-FORGE    /forge/
+ A-FORGE    https://a-forge.arif-fazil.com/
- AAA        /machines/
+ AAA        https://aaa.arif-fazil.com/
- arifFlow   (null)
+ arifFlow   https://arifflow.arif-fazil.com/
```

`machine_links`:
```diff
- arifOS   /canon/
+ arifOS   https://arifos.arif-fazil.com/
+ A-FORGE  https://a-forge.arif-fazil.com/
+ AAA      https://aaa.arif-fazil.com/
+ arifFlow https://arifflow.arif-fazil.com/
```

## Verification (all targets live-probed 2026-10-07 before writing)

| Target | Status | Title served |
|---|---|---|
| `arifos.arif-fazil.com/` | 200 | arifOS Observatory — Reality Witness |
| `aaa.arif-fazil.com/` | 200 | AAA · Attention Desk & Agent Federation |
| `arifflow.arif-fazil.com/` | 200 | *(JSON: `diagnosis: HEURISTIC_ADVISORY`, live FQ payload)* |
| `a-forge.arif-fazil.com/` | 200 | arifOS MCP — Constitutional AI Gateway ⚠️ |

## Known defect NOT fixed by this change

**`a-forge.arif-fazil.com` serves byte-identical content to `mcp.arif-fazil.com`**
(85,466 bytes each; identical modulo dynamic hashes). A-FORGE therefore has **no public
page of its own** — its declared host is a mirror of the arifOS MCP gateway.

This change makes the nav point at A-FORGE's correct host, but that host still shows
the wrong organ's content. **Fixing that is a content task, not a nav task.** A-FORGE
needs its own page, or its nav entry should be suppressed until one exists.

Likewise `arifflow.arif-fazil.com/` serves a **JSON status payload, not a human page** —
correct for a machine surface, wrong for a primary nav link. Consider linking humans to
a rendered page and keeping the JSON for `machine_links` only.

## Reversibility

Four hrefs in one CANON file, tracked by git. `git revert` restores. No service restart,
no DNS, no Caddy reload (nav is rendered at build time from canon, per the file's own
rule: *"Site generates navCanon.ts and MUST render them"*).