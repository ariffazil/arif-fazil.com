# Redirect map — 2026-11-22 entropy pass (333-AGI)

Versioned record of the 301s added in `/etc/caddy/vhosts/arif-fazil.com.conf`
(section "2026-11-22 (333-AGI, F13 site entropy pass)"). Config backup:
`/root/forge_work/backups/arif-fazil.com.conf.bak-20261122T091103Z`.

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
Receipt: `/root/forge_work/receipts/RECEIPT-site-entropy-pass-20261122.md`.
