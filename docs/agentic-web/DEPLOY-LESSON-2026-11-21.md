# Deploy Lesson — 2026-11-21 (reality-loop IGNITION)

> Write-back for the JSON-LD coverage deploy. Memory surface (`arif_memory`) timed out twice
> (2026-11-21, arifOS shim) — H5: recorded here instead, git-tracked and verifiable.

## The fact that cost the most time

**The apex domain is served by FOUR different trees, not one.** A single-source deploy that
targets only `/var/www/html/arif/` leaves most surfaces stale — and looks fine because the
sampled URLs happen to be the ones that got updated.

| Live path family | Served from | Deploy target |
|---|---|---|
| `/words/**`, `/world/**` | `/var/www/html/arif/` | dist → `/var/www/html/arif/` |
| `/arifos/findings/*`, `/arifos/verify/*` | `/var/www/html/arifos/` | dist/arifos → `/var/www/html/arifos/` |
| `/organs/**` | `/var/www/html/organs/` | dist/organs → `/var/www/html/organs/` |
| `/aaa/*` | `/var/www/html/aaa/` | dist/aaa → `/var/www/html/aaa/` |
| `/world/makcikgpt/<slug>/` | **Markdown + YAML frontmatter** (not HTML) | mirror tree; JSON-LD lives in the `.html` mirror |

## Measurement artifacts that produced false readings

1. **Cloudflare serves a stale body for the non-slash URL form** — `/path` (no trailing
   slash) can return the pre-deploy body while `/path/` returns the current one. Always
   measure the canonical slash form with a cache-buster. To diagnose origin vs edge, fetch
   the origin directly: `curl --resolve arif-fazil.com:443:127.0.0.1`.
2. **An over-strict JSON-LD regex counts covered pages as missing** —
   `<script type="application/ld+json">` misses any tag with extra attributes. Use
   `<script[^>]*application/ld\+json[^>]*>`.
3. **Content-length is a better fingerprint than presence** when hunting which file serves
   a path: compare live bytes against candidate local files.

## Defect closed by this loop

`/var/www/html/organs/organs/` — deploy debris (not in repo source or dist), reachable at
`https://arif-fazil.com/organs/organs/well/` (HTTP 200), serving a broken JSON-LD block
(`"https://***` redaction artifact). Quarantined (move, not rm) to
`/root/_quarantine/2026-11-21/organs-nested-ghost/` with `MANIFEST.json` + `RESTORE.sh`.
Live path now 404; the canonical `/organs/well/` serves one valid block.
