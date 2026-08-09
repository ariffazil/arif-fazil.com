# DEEP RESEARCH — arif-fazil.com Comprehensive Audit & World Model Design

> **Date:** 2026-08-09
> **Authority:** F13 SOVEREIGN (Arif)
> **Scope:** Full site architecture, design system, navigation, content, agentic surfaces, external benchmarks
> **Method:** Source code audit + live HTTP probe + external research + design philosophy analysis

---

## EXECUTIVE SUMMARY

**The site has 251 HTML pages, 3 competing design systems, 4 naming taxonomies, and 3 navigation models — all simultaneously active.** This is the root cause of chaos. The constitution (SITE_CONSTITUTION.md) is excellent. The execution has drifted into entropy (ΔS > 0). The fix is surgical: consolidate, don't rebuild.

**Verdict:** The bones are strong. The skeleton has too many ribs. We need to remove redundancy, not add complexity.

---

## PART 1: THE THREE DESIGN SYSTEMS (CHAOS #1)

### What exists today

| System | Canonical Source | Status | Colors | Fonts |
|--------|-----------------|--------|--------|-------|
| **PRIMER-1** | `canon/design-primer.md` + `canon/design-tokens.json` | SEAL 2026-08-01 | Yellow/Blue/Green-Blue/Red (4-family) | IBM Plex (Sans/Serif/Mono) |
| **Arrow Hybrid** | `sites/arif-fazil.com/` (React SPA) | LIVE | `#0A0B0D` paper / `#EDEAE2` ink / `#E4572E` ember / `#C9A227` gold | Satoshi/Cabinet Grotesk + JetBrains Mono |
| **World Model** | `canon/world-model.yaml` + `canon/navigation.json` | Phase A LIVE | 9 domain accent colors (subset of PRIMER-1) | Inherits from whichever shell renders |

### The conflict

PRIMER-1 says: `#FAF7F0` paper (warm, light)
Arrow says: `#0A0B0D` paper (dark, geological)

These are **fundamentally incompatible**. The site currently renders DARK (Arrow) on the React SPA pages, but the design tokens file specifies LIGHT (PRIMER-1). The `sites/shared/design-system/tokens.css` is loaded but the actual `root-shell.css` overrides it.

**Evidence:**
- `dist/index.html` line 12: `<title>Arif Fazil — The Arrow of Time</title>` → Arrow
- `canon/design-tokens.json` line 48: `"paper": { "hex": "#FAF7F0" }` → PRIMER-1
- `tailwind.config.js` likely uses Arrow colors (dark paper)

### The fix

**Ratify ONE design system.** Recommendation: **Arrow Dark** is the live system. PRIMER-1 was a proposal that never fully deployed. Update `canon/design-tokens.json` to match reality, or migrate. Don't keep two truths.

---

## PART 2: THE FOUR NAMING TAXONOMIES (CHAOS #2)

### The collision

| Taxonomy | Source | Names | Status |
|----------|--------|-------|--------|
| **5 Buckets** | `surfaces.json` doctrine | HOME · EARTH · WORLD · WORDS · WORK | ACTIVE in surfaces.json |
| **9 World Model Domains** | `canon/world-model.yaml` | Origin · Proof · Law · Earth · Capital · Voice · Work · Signal · Human | Phase A LIVE in nav labels |
| **Trinity Scopes** | `canon/federation.json` + `canon/sites.yaml` | SOVEREIGN · HUMAN · INSTITUTION · EARTH · CROSS_CUTTING | SEALED (999_SEAL 2026-08-01) |
| **Arrow Routes** | `src/App.tsx` (React) | `/` · `/earth` · `/world` · `/words` · `/work` | LIVE in code |

### The collision in practice

A visitor sees "Earth" in the nav. They click. The URL becomes `/earth`. The breadcrumb says "home › earth". The surfaces.json calls this `domain: "earth"`, `verb: "444_observe"`. The Trinity scope is `EARTH`. The bucket is `EARTH`. 

But for "Capital": nav says "Capital", URL is `/economics`, surfaces.json calls it `domain: "capital"`, Trinity scope is `INSTITUTION`. **Four different names for the same thing.**

### What the visitor experiences

| Nav Label | URL | surfaces.json domain | Trinity scope | Question |
|-----------|-----|---------------------|---------------|----------|
| Earth | `/earth` | earth | EARTH | "What's under our feet?" |
| Capital | `/economics` | capital | INSTITUTION | "What's it worth?" |
| Voice | `/world` | voice | SOVEREIGN | "What do I think?" |
| Essays | `/writing` | voice | SOVEREIGN | "What do I think?" |
| Law | `/doctrine` | law | CROSS_CUTTING | "What are the rules?" |
| Work | `/missions` | work | INSTITUTION | "What am I building?" |
| Proof | `/999/` | proof | CROSS_CUTTING | "Is this true?" |

**The URL never matches the label.** This is RULE 2 violation (navigation clarity).

---

## PART 3: NAVIGATION REDUNDANCIES (CHAOS #3)

### The route explosion

`App.tsx` has **157 route definitions**. Many are duplicates:

```
/economics → Economics (same as /world/economics)
/wealth → Redirect to /world/economics
/wealth-live → Wealth (different component!)
/oil → CommodityPageOil
/world/oil → CommodityPageOil  (DUPLICATE)
/gas → CommodityPageGas
/world/gas → CommodityPageGas  (DUPLICATE)
```

The MakcikGPT slug has **4 different path prefixes** that all reach the same component:
```
/world/makcikgpt/:slug → MakcikGptArticle
/makcikgpt/:slug → Redirect to /world/makcikgpt/:slug
/wealth/makcikgpt/:slug → Redirect to /world/makcikgpt/:slug
/economics/makcikgpt/:slug → Redirect to /world/makcikgpt/:slug
```

### The "Words" vs "Writing" confusion

- Nav says: "Essays" → `/writing`
- URL path: `/writing`
- React route: `/words` AND `/writing` (both render `<Writing />`)
- surfaces.json: `domain: "voice"`, path: `/words/`
- World Model: "Voice" domain

**Three names: Words, Writing, Essays. One actual component: `<Writing />`.**

### Dead / orphan paths in dist

```
/dist/aaa/ (17 pages) — AAA cockpit surfaces, not linked from main nav
/dist/geox/ (19 pages) — GEOX sub-pages, not linked from main nav
/dist/arifos/ (12 pages) — arifOS surfaces, not linked from main nav
/dist/wealth/ (4 pages) — wealth sub-pages
/dist/well/ (1 page)
/dist/wiki/ (2 pages)
/dist/propa/ (1 page)
/dist/vitals/ (1 page)
/dist/pulse/ (2 pages)
/dist/for-machines/ (1 page)
/dist/machine/ (1 page)
/dist/machines/ (1 page)
/dist/schemas/ (2 pages)
/dist/governance/ (1 page)
/dist/charter/ (1 page)
/dist/canon/ (1 page)
/dist/federation/ (1 page)
/dist/connect/ (1 page)
/dist/audit/ (1 page)
/dist/knowledge/ (1 page)
/dist/human/ (2 pages)
/dist/images/ (static assets)
/dist/verify/ (2 pages)
```

**~70 pages in dist that are not reachable from the main React SPA navigation.** These are static HTML shells served by Caddy's `@static_dirs` or `@agent_shells` rules — but a human clicking through the site would never find them.

---

## PART 4: CONTENT & DUPLICATION (CHAOS #4)

### Duplicate content locations

| Content | Location 1 | Location 2 | Location 3 |
|---------|-----------|-----------|-----------|
| MakcikGPT articles | `/world/makcikgpt/` (SPA) | `/makcikgpt-md/` (static markdown) | `content/` directory (source) |
| Essays | `/words/writing/` (SPA) | `content/essays/` (markdown source) | dist static pages |
| Doctrine | `/words/doctrine/` (SPA) | `/doctrine/` (static) | `canon/` directory |
| Federation info | `/doctrine/` | `/federation/` (static) | `canon/federation.json` |
| Organs | `/arifos/organs/` (static) | `/organs/` (static) | SPA doesn't render organ pages |

### Duplicate config files

| Config | Location A | Location B |
|--------|-----------|-----------|
| `navigation.json` | `canon/navigation.json` | (nav also defined in `surfaces.json` doctrine + `App.tsx` routes) |
| `federation.json` | `canon/federation.json` | `sites/shared/arifos-federation.json` |
| `sites.yaml` | `canon/sites.yaml` | `config/sites.json` |
| `design-tokens.json` | `canon/design-tokens.json` | `sites/shared/design-system/tokens.css` + `tailwind.config.js` |

---

## PART 5: THE LANDING PAGE PROBLEM

### What a newcomer sees (RULE 1 test)

Landing on `arif-fazil.com`:
1. Title: "Arif Fazil — The Arrow of Time"
2. Hero section with name + tagline
3. Nav bar: Earth | Capital | Voice | Essays | Law | Work | Proof

**Question a newcomer asks:** "What is this site about?"
**Answer after 30 seconds:** A person named Arif Fazil who does... something with geology and AI?

**Missing from the landing page:**
- ❌ No one-sentence explanation of "what is arifOS"
- ❌ No diagram showing the system (Human → arifOS → AAA → A-FORGE → Organs)
- ❌ No evidence of work (no well portfolio, no publications, no proof)
- ❌ The tagline "The Arrow of Time" is poetic but opaque to newcomers

### What the constitution says (SITE_CONSTITUTION.md RULE 1)

> "A newcomer must grasp 'who is Arif, what is arifOS, why it exists, what problem it solves' in 30 seconds, with zero jargon."

**The landing page currently fails RULE 1.** The constitution was written after the page was built. The page hasn't been updated to match.

---

## PART 6: AGENTIC SURFACES AUDIT

### What exists (good)

| Surface | Path | Status | Quality |
|---------|------|--------|---------|
| llms.txt | `/llms.txt` | 200 OK, 9.8KB | ✅ Comprehensive, well-structured |
| llms.json | `/llms.json` | 200 OK | ✅ Machine-readable |
| surfaces.json | `/surfaces.json` | 200 OK, 32.7KB | ✅ 59+ surfaces cataloged |
| agent.json | `/.well-known/agent.json` | 200 OK, 6.3KB | ✅ Capabilities declared |
| webmcp.json | `/.well-known/webmcp.json` | 200 OK, 5.4KB | ✅ Tools declared |
| mcp.json | `/.well-known/mcp.json` | 200 OK | ✅ MCP endpoint declared |
| sitemap.xml | `/sitemap.xml` | 200 OK, 7.2KB | ✅ Standard |
| feed.xml | `/feed.xml` | 200 OK, 11KB | ✅ RSS for MakcikGPT |
| missions.json | `/missions.json` | 200 OK, 4.6KB | ✅ Six missions declared |
| page.json | `/page.json` | 200 OK, 2KB | ✅ Site overview |
| machine/map.json | `/machine/map.json` | 200 OK, 13.8KB | ✅ World model for agents |
| human/map/ | `/human/map/` | 200 OK, 17.5KB | ✅ World model for humans |
| authority.json | `/authority.json` | 200 OK | ✅ Sovereign authority |
| policy.json | `/policy.json` | 200 OK | ✅ Governance policy |
| graph.json | `/graph.json` | 200 OK | ✅ Knowledge graph |
| soul.json | `/soul.json` | 200 OK | ✅ Identity |
| floors.json | `/floors.json` | 200 OK | ✅ F1-F13 |
| scar.json | `/scar.json` | 200 OK | ✅ Scar registry |

### What's missing (gaps)

| Gap | Impact | Priority |
|-----|--------|----------|
| **No `agent.json` A2A declaration** | `"a2a": false` in agent.json — agents can't discover A2A capabilities | P1 |
| **No `/.well-known/ai-plugin.json`** | OpenAI ChatGPT plugin discovery missing | P2 |
| **No Schema.org `Person` structured data on landing** | SEO + agent discovery for "who is Arif" | P1 |
| **No `manifest.json` (PWA)** | Basic manifest exists but minimal — no icons, no start_url | P2 |
| **llms.txt doesn't link to `/machine/map.json`** | Agents miss the world model entry point | P1 |
| **No `/.well-known/did.json` at root** | DID document only at arifos subdomain | P2 |
| **No `rsl.xml` at root** | RSL (Robot Single Sign-On) only in `/arif/` | P2 |
| **Feed.xml is MakcikGPT-only** | No feed for essays, no feed for all content | P2 |

### The MCP endpoint exposure

Current: `https://mcp.arif-fazil.com/mcp` — single endpoint, all 8 canonical tools.

Best practice (from external research):
- Each MCP endpoint should declare its own `/.well-known/mcp.json`
- Tool descriptions should include `inputSchema` for auto-discovery
- The `webmcp.json` should list ALL tools across ALL organs, not just the ones currently wired

---

## PART 7: EXTERNAL BENCHMARKS (What the best sites do)

### Personal sites of AI-native builders

| Builder | Site Pattern | Key Feature |
|---------|-------------|-------------|
| **Simon Willison** | simonwillison.net | Blog-first. `llms.txt` prominently linked. Datasette-powered. RSS feed. Every post has tags. Machine-readable API. |
| **Andrej Karpathy** | karpathy.github.io | Minimal. One page. Research + blog. No agent surfaces (doesn't need them). |
| **Guillermo Rauch** | rauchg.com | Minimal. Blog. Links to Vercel. No agent surfaces. |
| **swyx** | swyx.io | Blog + newsletter. `llms.txt` on homepage. Agent-friendly. |
| **Simon Willison's llms.txt** | simonwillison.net/llms.txt | THE reference implementation. Clear, structured, links to all major sections. |
| **Anthropic** | anthropic.com | `.well-known/` surfaces. MCP documentation. Agent cards. |
| **Cloudflare** | blog.cloudflare.com | RSS. Structured data. Developer docs. |

### What the best sites have in common

1. **Blog/content-first** — the human content is the primary surface
2. **RSS/Atom feed** — always present, always current
3. **`llms.txt`** — clear, concise, linked from footer
4. **Structured data** — Schema.org Person + Article
5. **Clean navigation** — max 5-7 top-level items
6. **Fast load** — static HTML where possible, minimal JS
7. **One design system** — consistent visual language

### What arif-fazil.com does BETTER than all of them

1. **7 MCP endpoints** — no personal site has this
2. **Dual human/agent rendering** — every page has a machine mirror
3. **Constitutional governance** — F1-F13 floors on every decision
4. **VAULT999 proof chain** — cryptographic receipts
5. **World model** — structured knowledge graph for agents
6. **9-domain taxonomy** — organized by question, not by topic
7. **MakcikGPT** — civic intelligence in Bahasa Malaysia (unique)

### What arif-fazil.com does WORSE

1. **Too many pages** — 251 HTML pages, most unreachable from nav
2. **Design system drift** — 3 competing systems
3. **Navigation confusion** — 4 naming taxonomies
4. **Landing page opacity** — newcomers can't understand in 30s
5. **Dead zones** — AAA, GEOX, arifOS sub-sites not linked from main nav
6. **Font overload** — 6+ font families loaded (Satoshi, Cabinet Grotesk, JetBrains Mono, Fraunces, Newsreader, IBM Plex, DM Serif Display)

---

## PART 8: WHAT A "WORLD MODEL SITE" SHOULD CONTAIN

### The arif-fazil.com world model (what you're building)

A "world model site" is a personal site that serves as a **structured knowledge base** for both humans and agents. It's not just a portfolio — it's a **navigable ontology** of the builder's work, thinking, and system.

### Required components

| Component | Purpose | arif-fazil.com status |
|-----------|---------|----------------------|
| **Identity root** | Who is this person? | ✅ `/` + `soul.json` + `agent.json` |
| **Knowledge graph** | How concepts connect | ✅ `graph.json` + `surfaces.json` |
| **Domain map** | What topics are covered | ✅ 9 World Model domains |
| **Proof chain** | What's been verified | ✅ `/999/` + VAULT999 |
| **Content index** | All writings, organized | ⚠️ Exists but navigation unclear |
| **Agent entrypoint** | Where agents start | ✅ `llms.txt` + `machine/map.json` |
| **MCP surface** | What tools are available | ✅ 7 MCP endpoints |
| **Constitutional governance** | What rules apply | ✅ F1-F13 floors |
| **Organ dashboard** | System health | ⚠️ Exists but not linked from main nav |
| **Contact/signal** | How to reach | ✅ `/connect/` |

### What's missing from the world model

| Missing | Why it matters |
|---------|---------------|
| **Entity registry** | Agents need a structured list of "things" on the site (people, organs, concepts, publications) |
| **Relationship graph** | `graph.json` exists but isn't navigable — needs to be a visual + machine-readable graph |
| **Publication list** | No structured list of papers, articles, talks — only MakcikGPT has this |
| **Well portfolio** | BEKANTAN-1 and other wells mentioned in prose but not in a structured database |
| **Timeline** | No chronological view of the journey (first well → arifOS → federation) |
| **API documentation** | MCP tools exist but no human-readable API docs on the site |

---

## PART 9: DESIGN RECOMMENDATIONS

### A. Consolidate the design system

**Decision needed:** Arrow Dark vs PRIMER-1 Light.

**Recommendation:** Keep Arrow Dark (it's live, it's working, it matches the "geological" identity). Update PRIMER-1 tokens to match. One truth.

### B. Fix the navigation (the critical fix)

**Current:** 7 primary nav items with mismatched labels/URLs
**Target:** 5 primary nav items, labels match URLs, ≤3 clicks to any page

**Proposed nav:**
```
Home | Earth | World | Writing | Work
```

| Nav | URL | Domain | Why |
|-----|-----|--------|-----|
| Home | `/` | origin | Who is Arif |
| Earth | `/earth` | earth | Geoscience work |
| World | `/world` | voice+capital | MakcikGPT + commodities + politics |
| Writing | `/words` | voice | Essays + doctrine |
| Work | `/work` | work | Missions + proof |

**Remove from primary nav:** Law, Proof (move to footer secondary)
**Rename:** "Voice" → "World" (matches URL), "Essays" → "Writing" (matches URL)

### C. Fix the landing page (RULE 1)

Add above the fold:
1. **One sentence:** "Arif Fazil builds constitutionally-governed AI systems. Same discipline that makes oil wells flow, applied to making AI trustworthy."
2. **One diagram:** Human → arifOS → AAA → A-FORGE → Organs (the system line from SITE_IDENTITY.md)
3. **Three proof points:** Well portfolio | MakcikGPT articles | arifOS MCP tools
4. **One action:** "Explore the federation" or "Read the constitution"

### D. Clean up the route explosion

**Current:** 157 routes in App.tsx
**Target:** ~30 canonical routes + redirects

Consolidate:
- All commodity pages → `/world/commodities/:slug` (one route, one component)
- All MakcikGPT → `/world/makcikgpt/:slug` (keep one canonical, redirect all others)
- All politics → `/world/politics/:slug` (keep one canonical)
- Remove duplicate `<Navigate>` chains where possible

### E. Unify the design tokens

Create ONE source of truth: `canon/design-tokens.json` (Arrow Dark version)
- Remove PRIMER-1 light palette
- Update `sites/shared/design-system/tokens.css` to match
- Update `tailwind.config.js` to match
- Document the decision in `canon/design-primer.md`

### F. Make dead pages reachable

The 70+ static HTML pages in `/dist/aaa/`, `/dist/geox/`, `/dist/arifos/` etc. are valuable but unreachable. Options:
1. Add an "Organs" section to the nav that links to organ sub-sites
2. Add a `/sitemap.html` that visually maps all pages (one already exists!)
3. Ensure `llms.txt` links to the most important ones

---

## PART 10: AGENTIC MODULES NEEDED

### For arif-fazil.com to be a TRUE world model site

| Module | What it does | Priority |
|--------|-------------|----------|
| **Entity Registry** | Structured JSON of all entities (people, organs, concepts, publications, wells) with relationships | P0 |
| **Relationship Graph API** | `/api/graph` endpoint that returns entity connections, queryable by agents | P1 |
| **Publication Index** | `/publications/` with all papers, articles, talks in structured format | P1 |
| **Well Database** | `/earth/wells/` with structured well data (name, basin, status, results) | P1 |
| **Timeline API** | `/api/timeline` — chronological events, queryable by agents | P2 |
| **MCP API Docs** | Human-readable documentation of all MCP tools on the site | P1 |
| **Agent Chat Widget** | WebMCP-powered chat that uses the site's own MCP tools | P2 |
| **Content Sync** | Auto-sync between `content/` markdown → SPA routes → static HTML | P0 |
| **Visual Sitemap** | Interactive graph visualization of all pages and their relationships | P2 |

### Protocols & specs needed

| Protocol | Purpose | Status |
|----------|---------|--------|
| **MCP 2025-11-25** | Agent tool discovery | ✅ Implemented |
| **WebMCP** | Browser-native agent tools | ✅ Implemented |
| **A2A (Agent-to-Agent)** | Agent discovery + delegation | ❌ `"a2a": false` — needs implementation |
| **llms.txt / llms.json** | LLM site overview | ✅ Implemented |
| **Schema.org Person** | Search + agent identity | ❌ Missing on landing page |
| **RSS 2.0 / Atom** | Content syndication | ✅ Implemented (MakcikGPT only) |
| **W3C DID** | Decentralized identity | ✅ `did:web:arif-fazil.com` |
| **RSL** | Robot sign-on | ✅ `/arif/rsl.xml` |
| **OpenAPI / JSON Schema** | API documentation | ⚠️ MCP tools have schemas but no human docs |

---

## PART 11: SPECIFIC FLAWS TO FIX

### Critical (P0)

1. **Landing page fails RULE 1** — newcomer can't understand in 30s
2. **3 design systems** — PRIMER-1, Arrow, World Model all coexist
3. **4 naming taxonomies** — Buckets, Domains, Scopes, Routes all different
4. **157 routes** — massive duplication, ~50% are redirects or duplicates

### High (P1)

5. **Font overload** — 6+ font families loaded (performance + visual chaos)
6. **70+ unreachable pages** — dist has pages not linked from nav
7. **No Schema.org Person** on landing page
8. **llms.txt doesn't link to machine/map.json**
9. **Feed.xml is MakcikGPT-only** — no essay feed
10. **Words/Writing/Essays** — three names for one section

### Medium (P2)

11. **No A2A declaration** on agent.json
12. **No entity registry** for agents
13. **No publication index** (papers, talks)
14. **No well database** (structured)
15. **No visual sitemap/graph**
16. **`/wealth-live`** route exists alongside `/economics` — confusing
17. **Shell wrap backups** in dist (`.shell-wrap-backup-*` directories)

---

## PART 12: THE PATH FORWARD

### Phase 1: Consolidate (this session)

1. **Ratify Arrow Dark** as the single design system
2. **Fix the nav** to 5 items, labels matching URLs
3. **Fix the landing page** to pass RULE 1 (30-second test)
4. **Consolidate routes** — remove ~100 duplicate/redirect routes from App.tsx

### Phase 2: Clean (next session)

5. **Remove dead pages** or link them from nav
6. **Unify design tokens** — one source of truth
7. **Add Schema.org** structured data
8. **Fix font loading** — max 2-3 families

### Phase 3: Build (future)

9. **Entity registry** + relationship graph
10. **Publication index** + well database
11. **A2A declaration** on agent.json
12. **Visual sitemap/graph**

---

*This audit is itself a sealed receipt. It identifies 17 specific flaws, maps 3 competing design systems, counts 4 naming taxonomies, and proposes a 3-phase fix. The site has strong bones — it needs surgical consolidation, not rebuilding.*

*DITEMPA BUKAN DIBERI · Forged, not given*
