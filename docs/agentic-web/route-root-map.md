# Route → Serving Root Map — arif-fazil.com

> Generated 2026-11-04 (Task 1, site-completion plan). Source of truth: `/etc/caddy/vhosts/arif-fazil.com.conf` (2734 lines).
> Deploy rule: cp built artifact from `sites/arif-fazil.com/dist/<route>/` to EVERY root listed. cp only — no rsync, no --delete.
> Verify per route: byte-compare live body vs dist file after copy.

## Routes touched by this effort

| Route | Caddy handle | Serving root(s) | Notes |
|---|---|---|---|
| `/human` `/human/*` | :441-451 | `/var/www/html` (top) + `/var/www/html/arif/human/` (mirror) | try_files {path} {path}/index.html |
| `/map` | dedicated | `/var/www/html/arif` → `/map/index.html` | |
| `/ledger` | via `@spa_routes` (:2426) | `/var/www/html/arif` (SPA fallback `/index.html`) | |
| `/000` | :354 | `/var/www/html/arif/000` | |
| `/999` | :368 | `/var/www/html/arif/999` | |
| `/world/*` (politics, 2027, petronas) | :983 | `/var/www/html/arif/world/...` | curated `/world/index.html` PRESERVED |
| `/world/makcikgpt/*` HUMAN lane | :971 | `/var/www/html/arif/world/makcikgpt/...` | UA split! |
| `/world/makcikgpt/*` BOT lane | :955-970 | `/var/www/html/arif/world/makcikgpt/makcikgpt-md/` | bots/curl get md mirror |
| `/world/petronas/` | :983 (phantom) | `/var/www/html/arif/world/petronas/` (to create) | zombie → real page (Task 17) |
| `/words/*` (incl. `/words/doctrine/`) | :1023 | `/var/www/html/arif/words/...` | `/doctrine` 308→`/words/doctrine/` (:618) |
| `/work/*` | :1035 | `/var/www/html/arif/work/...` | |
| `/earth/*` | top-level zone | `/var/www/html/earth/` (top) + arif mirror | split-root: verify byte-diff both |
| `/geox/*` | dedicated | `/var/www/html/arif/geox/...` | geox-app static |
| `/klci` | dedicated | `/var/www/html/arif/klci/` (root=that dir) | |
| `/usdmyr` | dedicated | `/var/www/html/arif/usdmyr/` (root=that dir) | |
| `/politics/*` | dedicated | `/var/www/html/arif/politics/...` | |
| `/` (home SPA) | `@spa_routes` / root handle | `/var/www/html/arif/index.html` + top mirror | SPA |
| `/federation` | REDIRECTED (:494,:496,~:1926,~:1928) → after D1: `@spa_routes` | `/var/www/html/arif` SPA | **4 redirect lines, not 2 — see ruling** |
| `/about`, `/read`, `/home*` | `@spa_routes` | `/var/www/html/arif` | SPA fallback |

## Organs/other families (Task 16 audit targets)

`/organs/* /governance/* /connect/* /verify/* /constitution* /charter* /receipts/* /forge* /discovery/* /research/*` → all via `@spa_routes` or dedicated handles rooted at `/var/www/html/arif/<route>/`. Audit before writing: some have dedicated roots — check the conf handle before each cp.

## UA-split routes (browser-UA verification MANDATORY)

Only `/world/makcikgpt/*` splits by User-Agent today (bot regex :957). Everything else single-lane.

## Caddy D1 exception scope (ruling 2026-11-04)

Plan/spec said "two redir lines (:494, :1926)". Reality: **four** — :494, :496 (zone 1) and ~:1926, ~:1928 (zone 2, "Reverted federation→doctrine merger" block). Removing only two would leave `/federation/` (trailing slash) redirecting = broken half-state. **Ruling: remove all four `/federation` redir lines; `/constellation` redirects adjacent are NOT part of the exception and stay.** Sovereign intent (D1: observatory reachable at /federation) requires the full set.

— evidence: grep output in plan workspace; verify live post-change: `/federation` 200, `/federation/` 200, `/constellation` still 301→/doctrine.
