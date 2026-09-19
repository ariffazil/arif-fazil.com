# PROP-2026-09-18-site-mcp-provenance

> **Authority:** T3 pending F13 · **Status:** AWAITING_SOVEREIGN
> **Forged:** 2026-09-18 · **Forged by:** FI-008 (kimi-code / k3) under arif-fazil.com/AGENTS.md

## 1. Mission (bounded)

Add machine-discoverable MCP tool provenance to the three territory pages that make MCP-shaped narrative claims, without altering any claim content, score, verdict, or routing. Specifically:

- `/vitals` — bind tripwire/pacemaker narrative to `mcp__wealth__capital_*` verbs
- `/earth` — bind the five GEOX cockpits to `mcp__geox__*` verbs (and capital judge to `mcp__wealth__*`)
- `/999` — bind the proof-chamber claims to `mcp__arifos__arif_seal` + `mcp__aforge__forge_fingerprint_check` + `mcp__aforge__forge_runtime_verify`

Plus 4 new SKILL.md capability wrappers (no implementation logic; capability contracts only).

## 2. The seven laws (binding)

1. NEVER run `make deploy` wholesale.
2. NEVER `rsync --delete` without `web_zen.py orphan` preview.
3. NEVER alter /etc/caddy/Caddyfile, DNS, secrets, or expose new MCP write tools.
4. ALWAYS run `make verify-pages` after edits (the 2026-08-03 non-bypassable gate).
5. ALWAYS produce a release evidence record per `docs/agentic-web/RELEASE-EVIDENCE-TEMPLATE.yaml`.
6. Public/private boundaries preserved. No confidential PETRONAS material added.
7. SKILL.md files declare **kill-switch + reversibility + F11/F13 references** (Attention-Kill F13-ratified 2026-09-11).

## 3. Reconnaissance (already done — receipts)

- `/vitals` lives at `sites/arif-fazil.com/dist/vitals/index.html` (already-built dist output)
- `/earth` lives at `sites/arif-fazil.com/dist/earth/index.html` (with sub-dist: kinabalu-basin, _legacy-globe, _shared)
- `/999` lives at `sites/arif-fazil.com/dist/999/*` (per AGENTS.md head)
- Source data lives in `sites/arif-fazil.com/src/data/*` (vitals-render.cjs, makcikgpt/*.ts, worldIntelData.ts)

## 4. The four bounded edits (REPRODUCIBLE)

### Edit 1 — `/vitals` JSON-LD provenance

**File:** `sites/arif-fazil.com/dist/vitals/index.html`
**Action:** Insert (or augment) `<script type="application/ld+json">` block within `<head>`:

```json
{
  "@context": ["https://schema.org", "https://arif-fazil.com/.well-known/mcp-context"],
  "@type": "Dataset",
  "name": "PETRONAS Institutional Physics — vitals",
  "identifier": "https://arif-fazil.com/vitals",
  "creator": {"@type": "Person", "name": "Muhammad Arif bin Fazil"},
  "dateCreated": "2026-08-03",
  "dateModified": "2026-09-18",
  "version": "v2026.09.18",
  "isBasedOn": [
    {"@type": "SoftwareApplication", "name": "mcp__wealth__capital_health",
     "url": "https://mcp.arif-fazil.com/mcp", "mode": "survival"},
    {"@type": "SoftwareApplication", "name": "mcp__wealth__capital_polix",
     "url": "https://mcp.arif-fazil.com/mcp", "mode": "topology"},
    {"@type": "SoftwareApplication", "name": "mcp__wealth__capital_entropy",
     "url": "https://mcp.arif-fazil.com/mcp", "mode": "shadow_trace"},
    {"@type": "SoftwareApplication", "name": "mcp__wealth__capital_market",
     "url": "https://mcp.arif-fazil.com/mcp", "mode": "commodity"}
  ],
  "truthClass": "INT",
  "humanRatified": true,
  "schemaVersion": "v2026.08.01",
  "attestationDoctrine": "evidence-gated, human-ratified; GEOX computes, does not adjudicate"
}
```

**Reversibility:** trivial (script tag removal).

### Edit 2 — `/earth` JSON-LD provenance

**File:** `sites/arif-fazil.com/dist/earth/index.html`
**Action:** Add per-cockpit provenance array (5 items):

```json
[
  {"cockpit": "live_macrostrat_globe", "tool": "mcp__geox__geox_basin", "mode": "profile",
   "url": "https://mcp.arif-fazil.com/mcp", "schemaVersion": "v2026.08.01",
   "truthClass": "OBS", "reversibility": "REVERSIBLE"},
  {"cockpit": "geox_prospect", "tool": "mcp__geox__geox_prospect", "mode": "screen",
   "url": "https://mcp.arif-fazil.com/mcp", "schemaVersion": "v2026.08.01",
   "truthClass": "INT", "reversibility": "REVERSIBLE_PRE_SEAL",
   "humanInLoopGate": "888_HOLD"},
  {"cockpit": "geox_wells", "tool": "mcp__geox__geox_well", "mode": "view",
   "secondaryTool": "mcp__geox__geox_petrophysics",
   "url": "https://mcp.arif-fazil.com/mcp", "truthClass": "OBS", "reversibility": "REVERSIBLE"},
  {"cockpit": "wealth_capital_judge", "tool": "mcp__wealth__capital_judge_handoff",
   "secondaryTool": "mcp__wealth__capital_primitive",
   "url": "https://mcp.arif-fazil.com/mcp", "truthClass": "INT",
   "reversibility": "REVERSIBLE_PRE_HUMAN_DECIDE",
   "humanInLoop": true}
]
```

**Reversibility:** trivial.

### Edit 3 — `/999` JSON-LD provenance + receive-channel

**File:** `sites/arif-fazil.com/dist/999/index.html`
**Action:** Add per-claim provenance:

```json
{
  "@context": "https://arif-fazil.com/.well-known/mcp-context",
  "claims": [{
    "text": "13 years at PETRONAS (2013–present), exploration geoscientist",
    "truthClass": "OBS",
    "sealVerifiers": [
      "mcp__aforge__forge_fingerprint_check",
      "mcp__aforge__forge_runtime_verify",
      "mcp__aforge__forge_verify_timeline"
    ],
    "endpoint": "https://mcp.arif-fazil.com/mcp"
  }, {
    "text": "BEKANTAN-1 — shallowest flowing oil discovery in the Malay Basin",
    "truthClass": "OBS",
    "sealVerifiers": ["mcp__arifos__arif_seal", "mcp__aforge__forge_fingerprint_check"],
    "endpoint": "https://mcp.arif-fazil.com/mcp"
  }, {
    "text": "arifOS v2026.08.01 — 13 Constitutional Floors, 8 MCP tools",
    "truthClass": "OBS",
    "sealVerifiers": ["mcp__arifos__arif_init", "mcp__arifos__arif_seal"],
    "endpoint": "https://mcp.arif-fazil.com/mcp"
  }]
}
```

**Reversibility:** trivial.

### Edits 4–7 — Four new SKILL.md capability stubs

**Files (paths under `/root/AAA/skills/`):**

1. `territory-provenance-assertion/SKILL.md` — capability contract for asserting territory claims against MCP receipts
2. `flow-mint-discipline/SKILL.md` — capability contract wrapping `mcp__arifFlow__flow_ingest` with consequence-class defaults
3. `site-deploy-receipt-parser/SKILL.md` — capability contract for parsing `make verify-pages` receipts
4. `federation-onboarding/SKILL.md` — first-load contract for any agent needing the 7 organs + 8 verbs + 13 floors + 6 missions surface

Each stub declares:
- `kill_switch` (explicit text)
- `reversibility` (REVERSIBLE/IRREVERSIBLE)
- `f11_auditability` (what is left in vault)
- `f13_sovereign_veto` (when to escalate)

**Reversibility:** trivial (file deletion).

## 5. Execute order

Step | Action | Gate
---|---|---
1 | `python3 web_zen.py doctor` | must pass cleanly
2 | Read template `/root/arif-fazil.com/docs/agentic-web/RELEASE-EVIDENCE-TEMPLATE.yaml` | n/a
3 | Apply Edits 1–3 to the dist HTML files | n/a
4 | Author Edits 4–7 (4 SKILL.md stubs) | n/a
5 | `make verify-pages` (only) — NOT `make deploy` | MUST PASS 200
6 | `caddy validate --config /etc/caddy/Caddyfile` (only read-only flag) | MUST PASS
7 | Write release evidence record | n/a
8 | Mint a `flow_ingest` step receipt at `flow_ingest.actor_id="af-forge"`, `step_type="Verify"` | n/a
9 | Stop. **DO NOT self-SEAL.** Report SEAL_PENDING to operator.

## 6. Acceptance criteria

- [ ] /vitals, /earth, /999 pages return HTTP 200 after edits
- [ ] `make verify-pages` exits 0
- [ ] Each new SKILL.md file has explicit kill-switch + reversibility + F11/F13 references in body
- [ ] No existing tripwire score / threshold / verdict value altered
- [ ] Existing epistemic tags (`[OBS]`/`[DER]`/`[INT]`/`[SPEC]`) preserved
- [ ] No public write capability added
- [ ] No Caddyfile change
- [ ] Release evidence record present at `/root/arif-fazil.com/forge_work/proposals/2026-09-18-site-mcp-provenance/RELEASE-EVIDENCE.yaml`
- [ ] FlowReceipt minted with step_type=Verify, actor_id=af-forge

## 7. Failure modes (HOLD conditions)

- `make verify-pages` returns non-zero → HOLD; fix routing FIRST
- Any existing tripwire score altered by accident → HOLD; revert
- Any public write capability exposed → 888_HOLD (Caddy route, MCP gateway, etc.)
- Caddy reload attempted → 888_HOLD
- `web_zen.py doctor` reports orphans without preview → HOLD; preview first

## 8. F13 escalation required for

- Changing which `/vitals` data is shown (only provenance, not payload)
- Adding ANY public mutation capability to MCP
- Touching the canonical F1-F13 doctrine files in `/root/AAA/instructions/*`
- Re-routing `/999` (proof chamber) outward expansion (e.g. exposing `/api/seal`)
- Any irreversible change to `/etc/caddy/Caddyfile` or DNS

DITEMPA BUKAN DIBERI · forged, not given.
