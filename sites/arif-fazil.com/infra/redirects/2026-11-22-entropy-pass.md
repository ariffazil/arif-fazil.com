# Redirect map — 2026-11-22 entropy pass (333-AGI)

Versioned record of the 301s added in `/etc/caddy/vhosts/arif-fazil.com.conf`
(section "2026-11-22 (333-AGI, F13 site entropy pass)"). Config backup:
`<host>/forge_work/backups/arif-fazil.com.conf.bak-20261122T091103Z`.

| # | from | to | reason |
|---|---|---|---|
| 1 | `/index.html` | `/` | duplicate home shell (same canonical) |
| 2 | `/home`, `/home/` | `/` | stray home copy, canonical `/` |
| 3 | `/words/index.html` | `/words/` | directory canonical |
| 4 | `/work/index.html` | `/work/` | directory canonical |
| 5 | `/politics/*` (regexp) | `/world/politics/*` | byte-identical duplicates; canonical declared `/world/politics/…` |
| 6 | `/politics/atlas.html` | `/world/politics/` | no world-side file; orphan duplicate |
| 7 | `/petronas/tengku-taufik[/]` | `/world/petronas/shadow/tengku-muhammad-taufik/` | meta-refresh shim → server 301 |
| 8 | `/petronas/tengkutaufik[/]` | same | typo alias shim → server 301 |
| 9 | `/world/makcikgpt/petronas-leadership-1974-2026[/]` | `/world/petronas/shadow/` | 99.3% 8-word shingle containment; 11-line non-substantive delta |
| 10 | `/receipts/ai-agents-2027[/]` | `/world/2027/receipts/` | duplicate 1,235-word page, canonical already world-side |
| 11 | `/doctrine/_agent-shell[/]` | `/words/doctrine/` | agent-shell copy; canonical `/doctrine/` 308s to `/words/doctrine/` |
| 12 | `/home/index.html` | `/` | 555-ASI residual: file path bypassed the directory 301 |
| 13 | `/world/makcikgpt/petronas-leadership-1974-2026/index.html` | `/world/petronas/shadow/` | 555-ASI residual: legacy file remained reachable 200 |
| 14 | `/petronas/tengku-taufik/index.html`, `/petronas/tengkutaufik/index.html` | shadow detail | file-path bypass |
| 15 | `/receipts/ai-agents-2027/index.html` | `/world/2027/receipts/` | file-path bypass |
| 16 | `/doctrine/_agent-shell/index.html` | `/words/doctrine/` | file-path bypass |
| 17 | `*/index.html` (regexp, all remaining) | directory URL | class-level rule: no page is canonical at an explicit index.html |

Verification: each target probed 200; each source probed 301 with exact Location.
Sitemap after cleanup: 117 URLs, 117 × 200.

Related repo commits: `765592df` (pair alignment), `fbd6f681` (sitemap + MakcikGPT registry).
Receipt: `<host>/forge_work/receipts/RECEIPT-site-entropy-pass-20261122.md`.

## Provenance (counts must trace to instruments)

- Census: 282 page candidates across 3 served roots (scope: `find ... -name '*.html'` with
  explicit asset/mirror exclusions — see map §1) → 251 unique URLs → **153 served 200**,
  97 redirect, 3 dead.
- Sitemap after cleanup: **117 URLs, 117 × HTTP 200** (curl probe loop, all targets direct).
- surfaces.json after 2026-11-22 pass: **126 surfaces** = 67 live page + 40 redirect +
  15 machine + 4 gone (browser-counted on /map/: live 67 / redirect 40 / machine 15 / gone 4).

## Classes added 2026-11-22 (deep-namespace soft-404 sweep)

| Rule | Class | Evidence |
|---|---|---|
| `redir /read/* /words/writing/*` | deep legacy path served the HOME page (soft-404, canonical -> /) | measured 200-home before rule |
| `redir /essays/* /words/writing/*` | flattened 2-hop (/essays/ → /writing/ → /words/writing/) | 301 single-hop after |
| `redir /canon/* /words/doctrine/*` | deep path fell to home behind an index 308 | 301 single-hop after |
| `redir /doctrine/* /words/doctrine/*` | same family | 301 after; `_agent-shell` explicit rule unaffected |
| `redir /missions/* /work/missions/*` | same family | 301 after |
| `redir /constitution/* /words/constitution/*` | deep path served a duplicate of the legacy index | 301 after |
| `/proof/{human,runtime,authorship}/` | **HOLD — legacy-content-without-canonical-twin.** Real content pages (65–78w distinct) but /work/proof/<slug> is a fallback shell (every slug = "Selected Work", 651w). A redirect was added, content-loss caught in the same pass, reverted; legacy pages verified restored 200 with their own titles. Migrate content first, redirect after. | before/after titles probed |
| `/writing/<slug>` → `/words/writing/<slug>` | split-namespace closed; catalog `/writing/:slug` flipped live→redirect | 301 after; residual: canonical SPA fallback still soft-404s unknown slugs (queued) |
