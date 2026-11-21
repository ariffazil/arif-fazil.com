# Deploy Lesson — 2026-11-21 (reality-loop IGNITION)

> Write-back for the JSON-LD coverage deploy. Memory surface (`arif_memory`) timed out twice
> (2026-11-21, arifOS shim) — H5: recorded here instead, git-tracked and verifiable.

## The fact that cost the most time

**The apex domain is served by FIVE different trees, not one.** A single-source deploy that
targets only `/var/www/html/arif/` leaves most surfaces stale — and looks fine because the
sampled URLs happen to be the ones that got updated.

| Live path family | Served from | Deploy target |
|---|---|---|
| `/words/**`, `/world/**` | `/var/www/html/arif/` | dist → `/var/www/html/arif/` |
| `/earth/**` | `/var/www/html/earth/` | dist/earth → `/var/www/html/earth/` |
| `/arifos/findings/*`, `/arifos/verify/*` | `/var/www/html/arifos/` | dist/arifos → `/var/www/html/arifos/` |
| `/organs/**` | `/var/www/html/organs/` | dist/organs → `/var/www/html/organs/` |
| `/aaa/*` | `/var/www/html/aaa/` | dist/aaa → `/var/www/html/aaa/` |
| `/world/makcikgpt/<slug>/` | `/var/www/html/arif/` (slash form) | mirror generator stamps the HTML mirror |

## Measurement artifacts that produced false readings

1. **The non-slash URL form is a DIFFERENT REPRESENTATION, not a stale cache.** For
   `/world/makcikgpt/<slug>`, the non-slash form serves the Markdown+frontmatter file
   while the canonical slash form serves the HTML mirror (now with JSON-LD). An earlier
   version of this lesson blamed Cloudflare edge staleness for the same symptom — that
   attribution was **wrong** (the edge was `DYNAMIC`; the origin served both forms).
   Always measure the canonical trailing-slash form with a cache-buster, and check the
   `cf-cache-status` header before blaming the edge.
2. **An over-strict JSON-LD regex counts covered pages as missing** —
   `<script type="application/ld+json">` misses any tag with extra attributes. Use
   `<script[^>]*application/ld\+json[^>]*>`.
3. **Content-length is a better fingerprint than presence** when hunting which file serves
   a path: compare live bytes against candidate local files.
4. **A full sweep beats a sample.** A 30-page sample said "17–18 valid"; the full
   230-page sweep said 218 valid, 9 non-page/redirect, 3 HTTP errors, 0 invalid — and
   exposed the `/earth/` tree that the sample missed entirely.

## Separation of powers — NOT satisfied

An independent verifier subagent was dispatched to certify the deploy (executor must not
certify its own work). **Three dispatch attempts failed** (subagent lane unstable:
`agent-1`/`agent-2`/`agent-3`). The full sweep above was therefore run **by the executor**
and is labelled *self-verification*, not independent verification. This requirement remains
OPEN and is one of the decisions awaiting the sovereign.

## Defect closed by this loop

`/var/www/html/organs/organs/` — deploy debris (not in repo source or dist), reachable at
`https://arif-fazil.com/organs/organs/well/` (HTTP 200), serving a broken JSON-LD block
(`"https://***` redaction artifact). Quarantined (move, not rm) to
`/root/_quarantine/2026-11-21/organs-nested-ghost/` with `MANIFEST.json` + `RESTORE.sh`.
Live path now 404; the canonical `/organs/well/` serves one valid block.
