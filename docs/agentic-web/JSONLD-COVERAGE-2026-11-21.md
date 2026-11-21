# JSON-LD Coverage Report — 2026-11-21

Campaign: Arif F13 order 2026-11-21 ("execute all until deployment", Priority 2–3).
Method: coverage-completion on the existing evidence/claim vocabulary — no schema redesign.

## Result

**225 / 230 apex pages (97.8%) carry valid inline JSON-LD. 0 invalid blocks.** (was 130/230)

| Metric | Before | After |
|---|---|---|
| Pages with inline JSON-LD | 130 | **221** |
| Blocks validated (strict JSON parse) | unknown | **221, 0 invalid** |
| Pages intentionally uncovered | — | 9 (see Exceptions) |

Type census (post-campaign): WebPage 173 · BreadcrumbList 112 · Article 31 ·
CollectionPage 4 · SoftwareApplication 3 · WebPage+DefinedTerm 3 · Dataset 3 ·
SovereignVitals 2 · WebSite/WebAPI/InstitutionalVitals/ItemList/Service/Report 1 each.

## What was done

1. **Stamped 107 pages** (88 `WebPage`, 19 `Article`) via new deterministic stamper
   `scripts/generate-jsonld-coverage.py` (stdlib, idempotent, dry-run mode). Fields are
   derived from each page's own `<title>` / `<meta description>` / `<html lang>` —
   nothing fabricated; no `datePublished` invented. Existing vocabulary only
   (`WebPage` / `Article` / `BreadcrumbList` / `ListItem` / `Person`), matching the
   `@graph` pattern of the covered pages (e.g. `/constitution`).
2. **Repaired 3 pre-existing broken blocks** — `organs/{well,wealth,geox}/index.html`
   carried `"https://***` redaction artifacts that destroyed the JSON
   (`"@context":"https://***@type"`). Restored to `"https://schema.org"`. These were
   parse-failures before this campaign; now valid.
3. **Fixed 145 URL defects** in the newly stamped blocks — `…/index.html/#article`
   → canonical `…/#article` (site convention: no `index.html` in canonical paths).
4. **Made coverage durable** — stamper chained into `prebuild`, so every future build
   re-stamps new pages automatically. Idempotent (re-run stamps 0).

## Exceptions — 9 pages without inline blocks (audited, not gaps of the same class)

- **5 redirect stubs** (skip-with-reason: stamping a redirect as content would be a lie):
  `for-machines/`, `geox/basins/`, `organs/`, `work/resume/`, `work/wells/`.
- **4 pages reference external JSON-LD graphs** (`<link>`/`<script src>` to
  `/.well-known/governance.jsonld` and peers) — covered at the graph level, no inline
  block. `human/` is the pattern example.

## Live-serving taxonomy (added after deployment, 2026-11-21; corrected by full sweep)

Source coverage is 97.8%, but a live census showed the apex is served by **FIVE different
trees**, each needing its own deploy target. Measured, not assumed:

| Live path family | Actually served from | Deploy target | Status |
|---|---|---|---|
| `/words/**`, `/world/**` (article+hub) | `/var/www/html/arif/` | dist → `/var/www/html/arif/` | ✅ stamped, live |
| `/earth/**` | `/var/www/html/earth/` | dist/earth → `/var/www/html/earth/` | ✅ stamped, live (3 pages closed) |
| `/arifos/findings/*`, `/arifos/verify/*` | `/var/www/html/arifos/` (family tree) | dist/arifos → `/var/www/html/arifos/` | ✅ stamped, live |
| `/organs/**` | `/var/www/html/organs/` | dist/organs → `/var/www/html/organs/` | ✅ deployed |
| `/aaa/*` | `/var/www/html/aaa/` | dist/aaa → `/var/www/html/aaa/` | ✅ deployed |
| `/world/makcikgpt/<slug>/` | `/var/www/html/arif/` (slash form) | mirror generator stamps Article JSON-LD | ✅ 53 mirror blocks |

**Full live sweep — all 230 pages, canonical trailing-slash form, cache-busted:**

| Class | Count | Detail |
|---|---|---|
| jsonld-valid | **218** | every real served page |
| no-block | 9 | 5 redirect stubs + 3 redirects (wiki, geox, aaa/apps/geox) + 1 asset path (`/_shared/design-system/geometry`) — **not pages** |
| HTTP-410 | 2 | `pulse`, `audit` (surfaces.json status gone) |
| HTTP-404 | 1 | `mcp/proof` (not served) |
| jsonld-invalid | **0** | — |

**Correction (2026-11-21, after an independent full sweep):** an earlier report of this
campaign stated "8 pages served as Markdown+frontmatter". That was a **URL-form artifact,
not a serving-mode fact**: the *non-slash* form `/world/makcikgpt/<slug>` serves the
Markdown+frontmatter file, while the canonical *slash* form serves the HTML mirror — which
now carries JSON-LD. The Markdown representation remains machine-readable (frontmatter),
and the canonical HTML form carries the graph.

## Verification trail

- Dry-run before write: 107 stampable / 5 stubs — reconciled exactly with the
  112-page missing inventory.
- Idempotency proof: second run `already-covered: 225, stamped: 0`.
- Global validation: 221 blocks parse, 0 failures, 0 `index.html/` URL defects.
- Commits: `8748ea16` (campaign) + `71388ecf` (prebuild chain) on
  `kimi-code/jsonld-coverage`, merged to `main` before deploy.
