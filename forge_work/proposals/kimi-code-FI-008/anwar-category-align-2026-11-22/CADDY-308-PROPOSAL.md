# PROPOSAL — Caddy 308 for the legacy PM Bayang alias paths (T3 · 888 lane)

**Status:** PREPARED, NOT APPLIED. No live Caddy file was touched. No reload was performed.
**Raised by:** kimi-code/FI-008 (site lane) · 2026-11-22
**Why it exists:** the repo-side fix is live; this closes the last leg — the legacy
path currently answers HTTP 200 with a redirect *stub*, where every sibling
`/politics/*` path answers HTTP 308 at the edge.

## Live state (measured 2026-11-22, after the repo deploy)

| URL | Before | After repo deploy | After this proposal |
|---|---|---|---|
| `/politics/` | 308 → `/world/politics/` | 308 | 308 (unchanged) |
| `/politics/shadow/` | 308 → `/world/politics/shadow/` | 308 | 308 (unchanged) |
| `/politics/ns-election/` | 308 → `/world/politics/ns-election/` | 308 | 308 (unchanged) |
| `/politics/shadow/anwar-ibrahim/` | **200 — full duplicate of the article** | 200 — canonical redirect stub | **308 → canonical** |

The duplicate article body is already gone from the live tree (the stub carries
`<link rel="canonical">` + `<meta http-equiv="refresh">` + a visible link). This
proposal only upgrades the status code from 200 to 308 so the edge, not the page,
performs the convergence.

## Why the path escaped the redirect until now

`/etc/caddy/vhosts/arif-fazil.com.conf` (~line 2382):

```
	handle /politics/shadow/* {
		root * /var/www/html/arif
		try_files {path} {path}/index.html /index.html
		file_server
	}
```

The exact-path rules `redir /politics/shadow /world/politics/shadow/ 308` only
match the directory itself. Every descendant fell through to the prefix `handle`,
which served the legacy tree at `/var/www/html/arif/politics/shadow/**` — which
held a second copy of the article.

## Proposed patch

Insert immediately after the existing `redir /politics/shadow/ /world/politics/shadow/ 308`
line (~line 1271), i.e. inside the same block as the other `/politics/*` redirects:

```caddy
	# 2026-11-22 FI-008 · category alignment — the canonical space for the PM Bayang
	# subtree is /world/politics/shadow/. These two paths used to be served as a
	# full duplicate of the article by the /politics/shadow/* prefix handle below.
	# They now converge on the canonical surface at the edge.
	@pm_shadow_anwar path /politics/shadow/anwar-ibrahim /politics/shadow/anwar-ibrahim/
	redir @pm_shadow_anwar https://arif-fazil.com/world/politics/shadow/anwar-ibrahim/ 308

	@pm_shadow_hubfile path /politics/shadow/index.html
	redir @pm_shadow_hubfile https://arif-fazil.com/world/politics/shadow/ 308
```

Optional (removes one redirect hop on the `/pm-bayang` alias, ~line 1159):

```caddy
	redir @pm_bayang /world/politics/shadow/ 301     # was: /politics/shadow/
```

## Ordering — VERIFIED, not assumed

`redir` is evaluated before `handle` in Caddy's route order, so the new rules win
over the existing `handle /politics/shadow/*` block. Proven empirically on a
throwaway local Caddy (`:18899`, isolated config, production untouched):

```
anwar/       -> http=308 redirect=https://arif-fazil.com/world/politics/shadow/anwar-ibrahim/
other.md     -> http=200   (the /politics/shadow/* handle still serves the .md alias)
```

## What this patch must NOT break

`/politics/shadow/anwar-jung-shadow.md` is a live Markdown alias pointing at
`/world/makcikgpt/anwar-jung-shadow`. The proposed matchers are exact paths, so
the `.md` alias continues to be served by the `handle` block. **This is why the
patch uses two exact-path matchers and not a prefix redirect on `/politics/shadow/*`.**

## Negative tests to run BEFORE the reload

1. `caddy validate --config /etc/caddy/Caddyfile` → exit 0.
2. `curl -sI https://arif-fazil.com/politics/shadow/anwar-ibrahim/` → `308` + `Location: https://arif-fazil.com/world/politics/shadow/anwar-ibrahim/`.
3. `curl -sI https://arif-fazil.com/politics/shadow/anwar-jung-shadow.md` → `200`, `Content-Type: text/markdown`.
4. `curl -sI https://arif-fazil.com/politics/shadow/` → `308` → `/world/politics/shadow/` (unchanged).
5. `curl -sI https://arif-fazil.com/pm-bayang/` → `301` → `/world/politics/shadow/` (if the optional line is applied).
6. `bash scripts/verify-pages.sh https://arif-fazil.com <dist>` → PASS (308→200 is accepted by the gate).
7. `bash sites/arif-fazil.com/scripts/probe-canonical.sh` → PASS.
8. Spot-check all 12 federation vhosts still answer (the reload is global).

## Rollback

```bash
cp -a /etc/caddy/vhosts/arif-fazil.com.conf.bak-<ts> /etc/caddy/vhosts/arif-fazil.com.conf
caddy reload --config /etc/caddy/Caddyfile
```

## Authority

T3 — Caddy reload is a 888 act. This proposal is prepared for that lane; the
site lane did not apply it and did not reload Caddy.
