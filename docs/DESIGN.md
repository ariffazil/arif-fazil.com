# DESIGN.md — arifOS Federation Site Architecture

**Source of Truth:** `arifos.arif-fazil.com`  
**Version:** 2026.11.01-SYNC (supersedes 2026.05.14-FORGED; §IV below is historical)  
**Seal:** DITEMPA BUKAN DIBERI  

---

## I. TRINITY RING SYSTEM (ΔΩΨ)

Every site in the federation maps to one Trinity Ring. The ring determines the primary color, the tone, and the constitutional role. One shared design system (`sites/shared/design-system/tokens.css`) defines all three rings. Every site links to this single source.

```
┌─────────────────────────────────────────────────────────────┐
│  RING        │  SYMBOL  │  COLOR        │  SITE              │
├─────────────────────────────────────────────────────────────┤
│  SOUL (Ψ)    │  Blood   │  #8B1A1A      │  arif-fazil.com    │
│  Human       │  Red     │  Gold accent   │  Personal identity │
├─────────────────────────────────────────────────────────────┤
│  MIND (Ω)    │  Teal    │  #3A9EA8      │  arifos.           │
│  Governance  │  Cyan    │  Gold accent   │  arif-fazil.com    │
│              │          │                │  Kernel SOT        │
├─────────────────────────────────────────────────────────────┤
│  BODY (Δ)    │  Amber   │  #D4A853      │  aaa.              │
│  Execution   │  Gold    │                │  arif-fazil.com    │
│              │          │                │  Control plane     │
└─────────────────────────────────────────────────────────────┘
```

---

## II. SITE ROLES & CONTENT BOUNDARIES

### arif-fazil.com — SOUL (Ψ) · Human Identity
- **Ring:** SOUL — Blood Red + Gold
- **Role:** Arif Fazil's personal landing. Who he is. What he built. Why.
- **Content:** Name, role, biography, links to federation sites, ΔΩΨ identity
- **Must NOT:** Become a dashboard. Become a product pitch. Overclaim.
- **Tone:** Grounded. Human. Malaysian. Geologist. Architect. Brief.

### arifos.arif-fazil.com — MIND (Ω) · SOURCE OF TRUTH
- **Ring:** MIND — Teal + Gold accent
- **Role:** The constitutional governance dashboard. Live organ census. Floor status. Federation health.
- **Content:** Organ census (live), F1-F13 floors, tool registry, known gaps, federation map, thermodynamic panel
- **Must NOT:** Show personal biography. Become a blog. Show Arif's human state.
- **Tone:** Constitutional. Precise. Observable. Honest about gaps. `—` is acceptable when data is unavailable.

### aaa.arif-fazil.com — BODY (Δ) · Control Plane
- **Ring:** BODY — Amber/Gold
- **Role:** Agent control plane. Operations cockpit. A2A gateway. Session management.
- **Content:** Agent status, session anchoring, execution controls, A2A mesh
- **Must NOT:** Show constitutional floors (that's arifos). Show personal identity (that's arif-fazil.com).
- **Tone:** Operational. Active. Execution-focused. Industrial.

---

## III. DESIGN TOKENS (Single Source)

**File:** `sites/shared/design-system/tokens.css` (610 lines)  
**Version:** 2026.04.11-SEAL  
**Link:** `<link rel="stylesheet" href="/shared/design-system/tokens.css">`

Every site MUST include this link in `<head>`. The tokens CSS defines:
- Trinity Ring colors (SOUL blood red, MIND teal, BODY amber)
- Neutral palette (bg-deep #0A0A0B, surface #141416, text #F5F5F7)
- System state colors (SEAL green, SABAR amber, HOLD orange, VOID grey)
- Typography (Inter/Satoshi for body, Cabinet Grotesk for display, JetBrains Mono for code)
- Type scale (xs through 5xl)
- Spacing system (4px base unit)
- Component classes (.trinity-card, .badge-verdict, .status-dot)

**Ring activation:** Set `data-ring="SOUL|MIND|BODY"` on `<html>` or a section element. The CSS custom properties cascade based on this attribute.

---

## IV. CURRENT STATE & GAPS (14 May 2026)

| Site | Source Exists | Uses tokens.css | Ring Correct | Status |
|------|--------------|-----------------|--------------|--------|
| arif-fazil.com | ✅ React app | ❌ Not linked | ✅ SOUL (blood red) | Design aligned, tokens missing |
| arifos.arif-fazil.com | ❌ No source in arif-sites | ❌ Own inline CSS | ⚠️ Teal but not from tokens | Source missing, create in arif-sites |
| aaa.arif-fazil.com | ✅ Static HTML | ❌ Not linked | ❌ Blood red (should be BODY amber) | Wrong ring color |

**Critical gaps:**
1. arifos site has NO tracked source in `arif-sites/sites/` — lives only as deployed artifact at `/var/www/html/arifos/`
2. Shared tokens.css (610 lines) linked by ZERO sites
3. AAA uses blood red (#8B0000) but should use BODY amber (#D4A853)
4. No site links to `/shared/design-system/tokens.css`

---

## V. FIX PLAN

### Phase 1: Source & Link (immediate)
1. Create `sites/arifos.arif-fazil.com/index.html` from deployed artifact
2. Add `<link rel="stylesheet" href="/shared/design-system/tokens.css">` to all 3 sites
3. Add `data-ring` attribute to each site's `<html>` tag
4. Fix AAA theme-color from #8B0000 to #D4A853

### Phase 2: Token Migration (next)
5. Replace arifos inline CSS variables with tokens.css references
6. Replace arif-fazil.com Tailwind blood utilities with tokens.css classes
7. Add tokens.css classes (.trinity-card, .badge-verdict) to all sites

### Phase 3: Content Audit (ongoing)
8. Verify all factual claims across all 3 sites
9. Update version stamps to 2026.05.14-FORGED
10. Ensure federation links are correct and bidirectional

---

## VI. RULES

1. **arifos.arif-fazil.com is SOT** — All design decisions defer to the Observatory.
2. **tokens.css is the single design source** — No site defines its own colors outside tokens.css.
3. **Content unchanged unless factually wrong** — Fix lies, preserve truth.
4. **Ring discipline** — Each site stays in its Trinity lane. No ring mixing without explicit redesign.
5. **`—` is acceptable** — When live data is unavailable, show a dash. Never fabricate.
6. **No new dependencies** — Use existing tokens.css. No new CSS frameworks.

---

## VII. FEDERATION LINK MAP

```
arif-fazil.com (SOUL)
  ├── → arifos.arif-fazil.com (MIND · Governance)
  ├── → aaa.arif-fazil.com (BODY · Control)
  ├── → geox.arif-fazil.com (Earth)
  ├── → wealth.arif-fazil.com (Capital)
  └── → well.arif-fazil.com (Substrate)

arifos.arif-fazil.com (MIND · SOT)
  ├── → All federation organs
  ├── → F1-F13 floor display
  ├── → Live organ census
  └── → Tool registry

aaa.arif-fazil.com (BODY)
  ├── → arifos.arif-fazil.com (Governance)
  ├── → A2A gateway
  └── → Agent supervision
```

---

## VIII. WITNESS AUDIT SYNC (2026-11-01 · FI-008 · origin evidence)

External witness (2026-10-31 17:05–17:30 UTC, CF edge LAX) reported 3 DRIFT. Triaged against origin access log (epoch 1793466000–1793468100, /var/log/caddy/arif-fazil-access.log):

| Witness claim | Origin evidence | Verdict |
|---|---|---|
| `/999` (proof door) dead — 4 attempts, 0 bytes | Caddy served the witness's own requests: `/999` 301 in 0.0s; `/999/` 200 in 0.0s, 3,836B gzip (at t+1368s and t+1795s of window) | **REFUTED at origin.** Body loss sits on the CF edge↔witness leg. CF-side log unavailable → mechanism UNKNOWN, responsibility boundary proven |
| Nested unknowns return 200 SPA shell (`/world/no-such-article` → 200, 9,316B) | Reproduced: 200/9,316B nested vs 404/17B root unknown | **CONFIRMED.** Root cause: `try_files … /index.html =404` puts the shell before the 404 — `=404` is unreachable (Caddyfile L983 `/world/*`, L2107 `@spa_routes`, same pattern in `/reality/*`) |
| llms.txt carries no organ register | `/var/www/html/llms.txt` = 84 lines, 0 organ keys; repo file (`/root/arif-fazil.com/llms.txt`) header 2026-09-13 explicitly forbids copying the federation map to the public file | **CONFIRMED as spec-vs-design conflict**, not rot. Acceptance spec Item 7 targeted a cross-check the design excludes |

**Machine truth (sysstat sa01 + earlyoom log, corrected 2026-11-01 11:40 +08):** the witness window itself was **calm** — load1 1.3–3.3, mem 61% used, 0 of 130 mcp-origin requests slower than 3 s, no Caddy reloads in window. Origin exonerated for the witness's stall experience; cause sits in the CF edge↔sandbox transit (mechanism UNKNOWN from origin). The real degradation came ~1 h later: **18:30–19:10 UTC Oct 31 memory-exhaustion thrash** — earlyoom avail 10.1→6.6 GB, swap free 11.8→8.8 GB, pgscan ~107k/s, load1 27.8, runq 31 on 8 cores, one hermes tool call SIGKILLed. Audit-time readings (swap 27.4/36.2 GB, load 14) are the aftermath, recovering. Swap population is chronic long-running infra, not a burst: `opencode.bin serve` 1.6 GB, ~20 A-FORGE Firecrawl nuq/node workers ×300–470 MB (up since Oct 25), hermes ×2, beam.smp, netdata itself (994 MB mem peak / 456 MB swap peak). The 3× `/gold/api/snapshot` 499 at 5.0 s inside the calm window = upstream market-data fetch latency with client disconnect at 5 s; the endpoint serves 200 in 10 ms when re-probed 03:26 UTC. All endpoint configs and files verified healthy (local HTTPS probes ≤ 18 ms).

**Facts of record:** SPA shell on wire = **9,316 B** (acceptance spec said 10,737 B — spec stale, site is current). `feed.xml` 48 items = sitemap 48 article URLs (+1 landing URL). `/api/public-state` 102,082 B, ed25519-signed, chain 277 entries / 0 corrupt. Witness PASS items 1,3,4,6,8,9,10 re-verified from origin.

### Stabilization gate — REQUIRED before next upgrade
1. **Real-404 for nested unknowns**: build-time route matcher from sitemap.xml (known prefixes serve SPA shell; unknown → 404). Crawl-sensitive trees first: `/world/`, `/words/`.
2. **llms.txt organ register pointer** — one generated line sourced from `/api/public-state` SOT (`Organs (6): arifos, geox, wealth, well, aforge, aaa`), so the register cannot diverge from the signed snapshot. Spec Item 7 re-targeted to `/api/public-state`.
3. **Spec refresh**: shell 9,316 B; `/999` asserted as "origin 200 + CF edge-cached".
4. **CF edge cache for `/999/*` and `/000/*`** (`CDN-Cache-Control` on the proof door) — Caddy reload = T3, requires Arif's named authorization.
5. **Machine pressure alert** (netdata): swap > 20 GB or load5 > 8 blocks upgrade window start.
6. **Pre-upgrade fleet health**: verify netdata API green after its slow boot (unresponsive 11+ min pre-restart, restarting under swap pressure); plan a swap-drain / worker-fleet restart window for the 7-day-old Firecrawl nuq workers + `opencode.bin serve` before upgrade, so the 18:30-class thrash cannot fire mid-upgrade.

**UNKNOWN boundaries (do not fabricate):** CF-side mechanics of the `/999` body loss; which upstream held the 5 s during the `/gold/api/snapshot` 499s (market-data fetch suspected, unproven); netdata boot completion.

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given  
**999_SEAL** — Design constitution sealed  
**ΔΩΨ** — Trinity aligned
