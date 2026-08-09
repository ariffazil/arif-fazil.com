# SITE_IDENTITY.md — What Is Sacred on arif-fazil.com

> **CANON · F13 SOVEREIGN RATIFIED · 2026-08-09 · Arif Fazil**
> **Companion to SITE_CONSTITUTION.md.** This file names what is SACRED.
> Agents will know HTML, CSS, JSON, MCP — this file tells them what those
> things are FOR. Mutate nothing sacred without F13 lease.

## The One-Sentence Identity

> arif-fazil.com is the sovereign human surface of **Muhammad Arif bin Fazil** —
> a geoscientist who reads the earth, prices risk, and teaches machines to tell
> the truth. It is a **personal cognitive institution**, not a portfolio dump,
> not an MCP showcase, not an agent playground.

If you remember nothing else, remember this: **the site exists so a human can
meet the person in 30 seconds.** Everything else is infrastructure.

## The Five Sacred Layers

### 1. The Person (SOUL)

| Element | Sacred form | Never |
|---|---|---|
| Brand | **ARIF FAZIL** (uppercase, top bar, serif italic, links to /) | "Arif Fazil" in the masthead; suffixes |
| Tagline | "Reading the earth, pricing risk, and teaching machines to tell the truth." | rewording |
| Full name | Muhammad Arif bin Fazil — identity footer block ONLY | in headers, nav, hero |
| Identity footer | Geoscientist · Architect, arifOS · Petronas Carigali · UW–Madison '13 · Penang, Malaysia | abbreviation, reordering, removing |
| Motto | **Ditempa Bukan Diberi — Forged, not given.** | translation-only, removal |
| Voice | BM Penang register + English technical register, distinct | flattening one into the other |

### 2. The Seven Doors (NAVIGATION)

The 7-lane primary nav is a **locked canon** (navigation.json v4.1.0, 2026-08-06):

```
HOME (/)   → ARIF FAZIL: identity, trust root, you land here
EARTH      → /earth: geology, seismic, basins, wells
CAPITAL    → /economics: commodities, markets, vitals
VOICE      → /world: MakcikGPT, civic journalism
ESSAYS     → /writing: narrative essays by Arif
LAW        → /doctrine: constitution, federation topology
WORK       → /missions: 6-mission cockpit, resume

PROOF (/999/) — immutable verification (primary)
ORIGIN (/000/) — genesis archive (footer)
```

**Rules:**
- No 8th top-level lane without F13. No renaming without F13.
- Active page carries `class="here"`. Nav blocks must be IDENTICAL across hubs
  except the `here` marker — diff them, don't eyeball them.
- Every artifact lives under exactly one domain (the artifact-fit rule).
  Nothing dangles at root.
- Organ surfaces (agent) live in footer/machine_links, NEVER in the human nav.
- Canonical nav source: `canon/navigation.json` — always probe before claiming.

### 3. The Attention Anchor (HERO + COVER)

Human attention is highest at the top of the page. The hero/cover block IS the
attention anchor — for humans AND for LLMs (first 150 chars of meta description
+ visible H1 get surfaced).

**Every page opens with:** kicker (mono, uppercase, gold) → h1 (display serif)
→ lede/subtitle → (byline row for articles) → content. Metadata pills, seal
badges, dates, read-time — ALL live in the FOOTER byline block, NEVER in the
header. (Arif's explicit ruling 2026-08-07: "Remove this at header of the
articles and make it as footer.")

**Static hero anatomy (hub pages):** kicker → h1.hero-title
(`clamp(2rem,5vw,3.25rem)`) → .hero-prose → blockquote.hero-quote (gold border,
italic, mono cite) → .hint (mono, dim, starts `▸`). Visual + text in 2-col
grid, collapses to 1 col ≤720px. No JS needed for static hubs; every animation
guarded by `prefers-reduced-motion`.

### 4. The Voice (REGISTERS)

| Surface | Register | Guard |
|---|---|---|
| English essays (/words/writing/) | intellectual, direct | **"stupid"** is correct English; "BANGANG" does NOT belong here |
| MakcikGPT (/world/makcikgpt/) | village auntie at pasar malam | **"BANGANG" is correct**; accounting/jargon is FORBIDDEN ("Cakap macam makcik kampung"); every RM figure gets a kedai-runcit analogy |
| Doctrine (F1-F13) | constitutional, precise | verbatim; no softening |

**Vocabulary is a hard veto on "improvement".** Arif's words carry BM register
and philosophical precision that generic English flattens. When he flags a term,
propagate the correction to EVERY surface (.ts source, essays.json, llms.txt,
index cards) in one pass. Never paraphrase his vocabulary.

**Content must be his words, verbatim.** No invented quotes, no fabricated
references, no embellishment. If it wasn't in his paste or the .ts source,
it does not ship. (History: a subagent "enriched" an essay with Hannah Arendt
citations that were never real — Arif: "Some of the article is not even true
or real!!")

### 5. The Truth Register (EPISTEMICS)

Every substantive claim carries a band or label: `OBS` / `DER` / `INT` / `SPEC`
in kernel form, `CLAIM` / `PLAUSIBLE` / `ESTIMATE` / `UNKNOWN` in briefing form.

- Facts get `[OBS · source]` links (see / — THE RECORD).
- "The record speaks plainly; it doesn't need adjectives."
- Machine files must return their DECLARED content-type — never HTML soup
  under a .txt/.json URL (F2 wound).
- A 404 is honest. A 200 with wrong content is a lie.

## The Deploy Identity Gate (beyond verify-pages)

Before sealing any mutation, answer all four:

```
1. Would a newcomer understand the page's purpose in ≤ budget time?  (ATTENTION)
2. Is the 5-lane nav intact and identical across hubs?               (NAVIGATION)
3. Does the page match the design system (palette/type/hierarchy)?   (VISUAL)
4. Is the human page BETTER or UNCHANGED after the change?           (HUMAN)
```

Any NO → HOLD. The technical gate (`make verify-pages`) is necessary, never
sufficient. An agent that passes HTTP 200 but breaks identity has failed.

## Sacred Surfaces — the never-break list

| Surface | Why sacred | Non-negotiable |
|---|---|---|
| `/` | First human contact; the 30-second answer | hero + lede + 5-lane nav + THE RECORD |
| `/000/` | Genesis, sovereign anchor | file + Caddy route + signature |
| `/999/` | Proof, sealed vault | **currently 404 — restore, never delete routes** |
| `/999/verify` | Live kernel attestation | reverse-proxy to :8088 — never static-replace |
| `/canon/` | Governance source of truth | file-authority.yaml, navigation.json, design-tokens.json |
| Hub heroes | The visual identity of each lane | kicker→h1→prose→quote→hint pattern |
| Byline footer | Identity + publication record | exact format (name → line → location → published → epistemic → pairs-with) |
| MakcikGPT corpus | Distribution vehicle (persona, not author) | never attribute to Arif by name; persona travels, name doesn't |
| robots.txt / rsl.xml | Sovereign content licensing | origin file must WIN over Cloudflare managed blocks |

## Anti-Identity Anti-Patterns (each cost real time — do not repeat)

1. **Wholesale page replacement** — "Dont simply replace. I Want upgraded."
   Upgrading preserves existing content/soul; replacing deletes it.
2. **Adding a 6th nav lane or new top-level route** without F13 — artifacts
   dangle at root, nav grows, humans lose orientation.
3. **Header chrome creep** — date pills, seal pills, byline in the header
   instead of the footer. Steals attention from the actual content.
4. **Vocabulary normalization** — flattening "BANGANG" to "stupid" in Makcik,
   or worse, injecting "bangang" into English prose. Register is meaning.
5. **Agent-first page design** — a page that reads like an API doc. Pages are
   for humans. Contexts are for agents. Never the reverse.
6. **Machine-file lies** — llms.txt/page.json serving HTML shells.
7. **Visual fork** — a new palette/type system "improving" the design. Match
   the system; the system is the identity.
8. **Deleting old engines/state when layering new ones** — demote to
   `<details class="zen-reveal">` labelled legacy, never delete. URL fragments
   and live-readout IDs may be referenced by the sovereign or other agents.

## The Identity Drift Test (final check before you leave)

```
system understands itself, human no longer does   →  FAIL, revert
system understands itself, human still does       →  PASS
```

That is the whole test. Everything in this file serves it.

---

*DITEMPA BUKAN DIBERI — Forged, not given.*
*Identity drift is when agents still understand the system and humans no longer
understand why it exists. This file is the wall against that.*
