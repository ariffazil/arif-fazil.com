# SITE_CONSTITUTION.md — arif-fazil.com Ψ Human Surface

> **CANON · F13 SOVEREIGN RATIFIED · 2026-08-09 · Arif Fazil**
> **DITEMPA BUKAN DIBERI — Forged, not given.**
>
> Every agent that mutates any file under arif-fazil.com MUST read this file
> before the first write. This file outranks every optimization instinct you
> have. If this file and another instruction conflict — this file wins.

## The Problem This Constitution Solves

Deployment drift was `source != build`. That problem is dead — the gate handles it.

The problem that remains is **identity drift**:

```
Deployment drift:  source != build        →  the gate catches it
Identity drift:    system understands itself, human no longer does
                   →  NO gate catches it. Ever.
```

Future agents will know HTML, CSS, MCP, JSON. They will NOT know:

- human attention
- site identity
- visual feel
- navigation principle
- what is sacred

They will optimize different things in different directions: one SEO, one MCP,
one docs, one visuals, one dashboards — and the site will drift even when every
deploy is perfect.

**This constitution exists so agents never have to guess what is sacred.**

## The Priority Order — NON-NEGOTIABLE

```
Priority_0:  Human comprehension
Priority_1:  Navigation clarity
Priority_2:  Visual coherence
Priority_3:  Agent discoverability
Priority_4:  Protocol optimization
```

Most agents optimize in **reverse order** — protocol first, human last.
That is the drift of the future. Reverse-order optimization = constitutional
violation, even if the deploy passes every technical gate.

## The Six Rules

### RULE 1 — Human understanding > protocol exposure

A human newcomer must be able to answer, within 30 seconds of landing on any
page: **Who is this? What is this? Why should I care?** If a page can only be
understood by reading about MCP tools, JSON schemas, or protocol docs first —
the page fails, regardless of technical correctness.

### RULE 2 — Navigation clarity > feature growth

The 7-lane primary nav (Earth · Capital · Voice · Essays · Law · Work · Proof)
is canonical and sacred. Defined in `canon/navigation.json`. Never add an 8th
top-level lane without F13. Never bury an existing lane. Every artifact must
fit under exactly one domain. If a human journey becomes more complicated after
your change, you failed.

Nav source-of-truth: `canon/navigation.json` — always probe before claiming.
Disagreement between breadcrumb and URL = drift.

### RULE 3 — Visual coherence > technical cleverness

The site has a design system: dark forge palette, gold `#C9A227`, serif display
type, mono kickers. A page that renders as bare unstyled text is a defect even
if the HTML is valid. A page that invents a new palette is a violation. Match
the system; never out-clever it.

### RULE 4 — Agent surfaces are secondary

llms.txt, missions.json, surfaces.json, MCP endpoints, page.json, JSON-LD —
all exist to serve the human surface, never to replace it. If a machine-file
change makes the human page worse (content stripped, nav broken, visual
regression), the machine-file change is void.

### RULE 5 — Every page must answer What? Why? Why should I care?

Every page ships with these three answers visible. The hero/cover block is the
attention anchor — it must answer all three **above the fold**. If the answer
requires 3 minutes of reading, the page is in HALT.

### RULE 6 — Never add a new surface before auditing existing paths

Probe first. If a surface already exists (even under a different name), extend
it. Duplicate surfaces are entropy, not progress. The site has 76 registered
surfaces and 48 sitemap entries — before adding #77, reconcile the gap.

## The Four Audit Gates — Agent Onboarding (MANDATORY)

Every agent must pass all four audits BEFORE receiving mutation rights on
this site. If any audit fails: **NO MUTATION**.

### Audit 1 — The 15-Year-Old Test

Explain arifOS to a 15-year-old. If you cannot do it without jargon, you do
not understand the site well enough to change it.

### Audit 2 — Find the Canon

Point to the canonical governance files: `canon/file-authority.yaml`,
`canon/navigation.json`, `canon/design-tokens.json`, and this file. If you
don't know where the canon lives, you do not know what you are allowed to
mutate.

### Audit 3 — Distinguish the Four Layers

Explain the difference between: Observatory (governance visibility), MCP
Gateway (agent connection), Organs (domain intelligence: GEOX/WEALTH/WELL),
and Trust (identity + canon). Confusion between any two = fail.

### Audit 4 — Why Does a Human Visit?

Answer the question: *"Why does a human visit this site?"* If the answer
starts with "MCP", "Tools", "JSON", or "Protocol" — you have failed. The
answer starts with: *"To meet a person who reads the earth, prices risk, and
teaches machines to tell the truth."* Everything else is infrastructure.

## The Deploy Gate — Beyond Technical

`make verify-pages` proves HTTP 200. That is no longer sufficient.

Every deploy must additionally pass the **human gate**:

```yaml
human_clarity:
  required: true          # What? Why? Why care? — answered above the fold
navigation:
  required: true          # 5-lane intact, no journey got harder
visual:
  required: true          # no aesthetic regression vs baseline
attention:
  required: true          # first meaning within budget (see budget below)
```

If any of these fail: **HOLD**. Do not seal. Do not deploy.

## The Human Attention Budget (per page)

Full machine-readable budget: `config/page-attention-budget.yaml`

| Page class | Understand in | Hard limit |
|---|---|---|
| Landing (/ and hubs) | 15s | 30s |
| Trust (/000/) | 45s | 90s |
| Writing (essays) | 60s | 120s |
| Observatory (/institution, organs) | 60s | 120s |
| Data surfaces (/propa/, /economics/, /gold/) | 30s to first live number | 60s |
| Agent surfaces (llms.txt, page.json) | N/A — machine budget only | must never 200 with wrong content-type |

If a page needs 5 minutes of reading to reveal its purpose — the agent that
built it failed, even if every technical test passed.

## Machine-File Truth (F2 binding)

A machine file that returns HTTP 200 with the WRONG content-type is a lie told
to machines. Known violations class (the deceptive 200):

```
/words/llms.txt   → served SPA HTML (text/html) instead of real llms.txt
```

Every declared machine file (`*.llms.txt`, `page.json`, `agent.json`,
`missions.json`, `sitemap.xml`, `rsl.xml`) must return its declared
content-type AND must NOT contain `<!doctype html` in the body.
**A 404 is honest. A 200-with-wrong-content is a lie.**

## Constitutional Surfaces (SACRED — never break)

| Surface | Role | Status as of 2026-08-09 |
|---|---|---|
| `/000/` | Genesis · Sovereign Anchor | LIVE (200) |
| `/999/` | Proof · Sealed Vault | **404 — BROKEN, must be restored** |
| `/999/verify` | Live kernel attestation (reverse-proxy :8088) | LIVE (200) |
| `/verify` | Kernel attestation | LIVE |
| `/genesis/` | Alias of /000/ | 301 redirect |

`/999/` is a constitutional artifact, not an ordinary page. If a deploy or
cleanup breaks it, the change is void. The Caddy rules exist; the source
(`public/999/`) does not — restore it, never delete the routes.

## The Visual Golden Master (baseline)

Before any visual mutation, capture/reference the canonical screenshots:
`visual-baseline/` — homepage, trust (/000/), observatory, geox, wealth,
canon. Every deploy runs a visual_diff against baseline. Regression = HOLD.

## The Navigation Graph (agent-crawlable)

Canonical source: `canon/navigation.json` (v4.1.0, 2026-08-06)
Live nav renders from this file — no hardcoded navbar lists.

```
HOME (/)
├── Earth (/earth/)              — What's under our feet?
├── Capital (/economics/)        — What's it worth?
├── Voice (/world/)              — What do I think? (MakcikGPT)
├── Essays (/writing/)           — Narrative essays
├── Law (/doctrine/)             — Constitution & federation
├── Work (/missions/)            — 6-mission cockpit
├── Proof (/999/)                — Immutable verification
└── Origin (/000/)               — Genesis archive (footer)
```

Every mutation must pass the navigation regression check: **did any human
journey get harder?** If yes: FAIL.

## Violation Examples — Real Cases That This Constitution Prevents

1. An agent optimized /words/llms.txt for SEO and served the SPA shell to
   machines — 200 with HTML soup. (F2 wound, deceptive 200)
2. A cleanup agent deleted /999/ source during the 5-lane reorg — the
   constitutional Proof page went 404 while its nav links stayed live.
3. The canon/navigation.json still lists pre-v7 labels (Capital/Voice/Essays)
   while live nav shows the 5-lane canon — agents reading canon got the wrong
   map. (Canon drift = the exact disease this constitution cures.)
4. surfaces.json (76) vs sitemap (48) — 28 surfaces invisible to discovery
   engines. Adding surface #77 without reconciling = RULE 6 violation.
5. /essays/<slug> redirects to /writing/essays/<slug> (double-prefix) —
   a redirect that was "working" (200) while silently mangling the URL.
   A journey that LOOKS fine but IS wrong is the most dangerous drift class.

## Authority & Amendment

- Ratified: F13 SOVEREIGN (Arif Fazil), 2026-08-09
- State: CANON. Mutate only with F13 lease.
- Amendment: via the standard canon promotion path (file-authority.yaml),
  with F13 sovereign sign-off. No agent may amend this file.
- Companion: `SITE_IDENTITY.md` (what is sacred), `canon/file-authority.yaml`
  (who may mutate what), `/root/AGENTS.md` (federation doctrine).

---

*DITEMPA BUKAN DIBERI — Forged, not given.*
*The site rots when agents optimize protocol over people.*
