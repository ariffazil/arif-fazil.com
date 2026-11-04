# arif-fazil.com — Site Completion & Migration Finish
## Design Document · 2026-11-04 · FI-008 (Kimi Code)

Status: PROPOSAL awaiting sovereign approval. Decision already made this session:
**PRIMER-1 canon wins** (F13 user decision 2026-11-04). Stitch structure adopted, canon skin.

---

## 1. Intent & Why

The owner reported "site cannot view on mobile properly" at what turned out to be a mistyped
URL. Deep research (103-URL mobile sweep + full repo/canon audit) found the real state:

- **Mobile:** 11 of 103 probed pages have horizontal overflow (tables/navs/headers busting a
  390px viewport). Worse, most public shells are empty SPA shells — blank until JS
  hydrates, which is the real "cannot view on mobile" experience. Builder check
  (2026-11-04) corrected the inventory: the 17 essay shells under `words/writing/*` are
  ALREADY content-first (full text, correct titles, no JS needed); 44 of 46 MakcikGPT
  article shells are empty SPA copies.
- **Design migration:** the Stitch "Sovereign Intelligence Architecture" system (DESIGN.md +
  5 TypeScript-validated React components, 2026-10-31) is **orphaned** — sitting at repo-root
  `src/`, outside the app build (`sites/arif-fazil.com/`), imported nowhere. A token
  reconciliation staged 2026-10-31 (`tokens.css.bak-20261031-stitch`) was abandoned untouched.
- **Architecture migration:** fed-nav v7.x is live on only 13 of 220 shells. `dist/` is stale
  behind `public/`. `primer-shells.cjs` is unwired AND would clobber the curated `/world/`
  hub (no preservation guard). `/world/petronas/` is a zombie phantom-200.
- **The site's own upgrade plan** (`sites/arif-fazil.com/docs/UPGRADE-PLAN-2026-11-03.md`,
  P0–P3) defines "complete" and is partially executed.

**Why now:** the owner asked for the site to be finished. All raw materials exist (components,
content, canon, gates). What's missing is integration and the last 90% of shell migration.

## 2. Goals

1. **Every page usable on a phone** — zero horizontal overflow; content visible before JS.
2. **Design migration finished** — Stitch layouts live, skinned in PRIMER-1 canon tokens,
   design gates (verify-design-canon + design-lint) green at build time.
3. **Architecture migration finished** — fed-nav on all public shells; content-first static
   shells for every route per UPGRADE-PLAN P1; generators safe (no `/world/` clobber).
4. **Upgrade-plan P0/P2/P3 items closed** where they overlap this scope (zombie route, token
   single-source, `.bak` archive, verify cron wiring, additive deploys).
5. **Evidence, not claims** — verify-pages gate passes; mobile re-sweep 0-bad; release
   evidence YAML per fabric (`docs/agentic-web/RELEASE-EVIDENCE-TEMPLATE.yaml`).

## 3. Non-goals / Anti-goals

- **Non-goals:** `/aaa/*` control plane (18 pages, internal); new essays/content writing
  (structure existing content only); GEOX data work; Cloudflare DNS changes; touching the
  arifos.arif-fazil.com static surface (own fail-closed AGENTS.md); mutating `design-tokens.json`
  or any CANON file (PRIMER-1 stands as ratified).
- **Anti-goals (failure even if technically working):** a page counting as "done" while it is
  still an empty SPA shell ("200 SPA-shell bukan bukti"); token drift (second copy of tokens);
  `rsync --delete` without orphan preview; whole `make deploy` (Caddy reload is T3 HOLD unless
  Arif names Caddy); self-SEALing.

## 4. Constraints (binding, from repo law)

- Deploy gates: `make verify-pages` non-bypassable; `verify-surfaces` + `verify-content` +
  `design-lint.sh` + `verify-design-canon.cjs` run in prebuild — a PRIMER-1-violating build
  **fails** (this now works for us).
- Additive per-route deploys only; no Caddy reload in this effort; no new Caddy routes
  (enrich existing routes only — avoids the @spa_routes allowlist trap entirely).
- `/var/www/html` is FAIL-CLOSED for direct agent writes (file-authority.yaml); webroot
  changes go through the repo's sanctioned sync scripts, additively.
- Public claims keep source/date/epistemic-label (UPGRADE-PLAN pattern from /petronas).
- Fonts: IBM Plex self-hosted per canon typography — **no new Google font loading** (Stitch's
  Playfair Display / Inter / Material Symbols are NOT adopted).

## 5. Approaches Considered (design fork — decided by sovereign 2026-11-04)

| Approach | What | Verdict |
|---|---|---|
| **A. PRIMER-1 canon wins** ✅ | Stitch layouts/structure, re-skinned to canon tokens; build gate passes unamended | **Chosen.** Canon is ratified (F13, 2026-08-01); zero canon mutation; fastest safe path |
| B. Stitch look wins | Amend design canon; cyan/crimson/amber + Playfair + 0px corners sitewide | Rejected by sovereign — would re-token every migrated surface and rewrite the gate |
| C. Hybrid territory | Stitch for 4 hero surfaces via scoped canon exception | Rejected by sovereign — needs canon amendment anyway; splits the visual language |

## 6. The Build (what gets forged)

### Phase 0 — Mobile hotfixes (immediate, additive)
Fix all 11 overflow pages with standard patterns — no redesign:
- Tables → wrap in `overflow-x:auto` containers (or `display:block` scroll): `/human`,
  `/world/petronas/shadow/`, `/ledger`, `/world/2027/receipts/`
- Nav overflow → wrap/scroll: `/world/politics/ns-election/compare/`, `/map/`
- Headers → responsive collapse: `/geox/`, `/earth/kinabalu-basin/`, `/earth/malay-basin/`
- Code block → `pre` horizontal scroll: `/000/`
Full list with measurements: `/tmp/mobile_sweep_bad.json` (evidence).

### Phase 1 — Stitch components, canon skin (the design migration finish)
1. **Move** `src/components/stitch/*` → `sites/arif-fazil.com/src/components/stitch/`
   (imports are `react` + relative only — portable). Repo-root `src/` retired after copy.
2. **Re-skin to PRIMER-1:** replace Stitch classes/hexes with app/canon tokens —
   cyan→institution blue #2E5F8A family, crimson→rationed sovereign red #B3362B (only where
   semantically veto/alert), amber→human yellow #D9A62E; radii→{2,12}px; typography→IBM Plex
   stack already in app. No per-page hardcoded hex (canon forbids local palettes).
3. **Adapt:** LayoutGrid merged into app shell (no double header); Material Symbols → lucide
   (app standard); hotlinked Google portraits → localized `public/` assets or removed;
   one torus per view max (canon rule).
4. **Wire routes (existing only — no Caddy changes). Integration mechanism = the repo's
   hybrid pattern:** static content-first HTML enriched with the SPA bundle via
   `copy-static-html.js` (the same mechanics the curated `/world/makcikgpt/` landing uses),
   NOT bare SPA routes that static files would shadow (builder-check Q2, settled):
   - `Home` (SPA `/`) ← PortalKedaulatan structure as new hero (old home preserved in git;
     visual QA screenshot before/after)
   - `/world/makcikgpt/` ← MakcikGPTArchive on the **human lane** (canonical path;
     `/makcikgpt` already redirects). NOTE: Caddy splits this path by User-Agent
     (bots get the makcikgpt-md mirror); acceptance target is the **human/browser lane**
     (builder-check Q3, settled — verification must use a browser UA).
   - FederationObservatory: **OPEN sovereign decision** — SPA `/federation` is unreachable
     today: vhost lines 494 + 1926 `redir /federation /doctrine 301` sort before all
     handles, and removing them requires a Caddy reload (T3 HOLD). Options: (a) Arif names
     Caddy for this one bounded change; (b) observatory lands on a different existing
     SPA-reachable route. Doc stays open until answered.
   - GeoxCockpit: *my call:* integrate into the existing `geox-app` surface family
     (`/geox/cockpit/`) if that app is React-compatible; otherwise HOLD as documented
     follow-up (new SPA route would need Caddy T3). Builder verifies and reports.
5. Gates green: `tsc -b && vite build` with verify-design-canon + design-lint in prebuild.

### Phase 2 — Content-first shells for the remaining empty routes (architecture finish)
1. Fix generator safety first: add `/world/` (and other curated routes) to a
   `PRESERVED_ROUTES` guard in `primer-shells.cjs` (mirror of generate-agent-shells.cjs).
   `primer-shells.cjs` stays OUT of prebuild (its "Primer Dark" Google-Fonts trio template
   is superseded by the 2026-11-04 sovereign decision — builder-check Q6, settled).
2. Extend `generate-agent-shells.cjs` `shell()` (the canonical tokens.css template) to
   emit **content-first static HTML** (real text + fed-nav, not `<div id="root">` only),
   ingesting existing markdown sources.
3. Priority order (my call, no traffic data available — nav priority + content readiness):
   1. 44 MakcikGPT article shells that are empty SPA copies (markdown sources exist;
      essays under `words/writing/*` are ALREADY content-first — dropped from scope,
      builder-check correction)
   2. Commodity terminals **`/klci` + `/usdmyr` only** — `/oil /gold /gas` are separate
      apps with their own builds and live APIs (builder-check Q7, settled; they are also
      mobile-clean per sweep)
   3. Politics family + `/world/2027/*` + `/words/doctrine/` (fixes the `/doctrine/`
      redirect landing on an unmigrated page)
   4. GEOX/earth subpages, federation/proof surfaces, `/human`, `/map`, `/ledger`
   5. `/000/ /999/` — static already; fed-nav decision left to builder (may be
      intentionally minimal — check page contract before touching).
4. Each shell: title + dateModified + one extractable content string (UPGRADE-PLAN
   "ukuran siap"), 5 extractable facts above fold where data pages.
5. Rebuild → `dist/` freshness problem resolves itself.

### Phase 3 — Upgrade-plan items in scope
- **Zombie `/world/petronas/`:** give it a content-first static shell that serves the
  /petronas/ reality-refreshed content pattern (link + summary). No Caddy change. *(If the
  sovereign prefers removing the matcher instead, that's a named Caddy T3 decision — flag it.)*
- **P2 token single-source:** vitals/_shell pages reference `public/_shared/design-system/tokens.css`
  (canon-derived), stop inline copies. Nav canon v7.4.0 stays.
- **P2 `.bak` archive:** move stale `*.bak*` out of webroot to `/root/_archive` (list first,
  additive move, verify no references).
- **P3 cron wiring:** weekly `verify-pages.sh` → one line PASS/FAIL (+ list) to
  `/root/work/tasks.json`, plus the mobile-overflow sweep script (browser-UA lane).
  `site-preflight.py` does not exist on this VPS (builder-check Q8) — NOT written as new
  tooling; the two existing scripts cover the need. Cron entry per VPS convention,
  documented in evidence.

### Phase 4 — Verification & deploy (the terminal state)
1. `make verify` (all gates) → `npm run build` → `make verify-pages` → **mobile re-sweep:
   103+ URLs, 0 overflow, browser UA** → before/after screenshots of the 4 redesigned
   surfaces.
2. Deploy mechanism (builder-check Q4, settled): **cp-only additive per-route copies** to
   the correct serving root — no `rsync`, no `--delete` anywhere, no
   `sync-serving-roots.sh` (it mirrors with `--delete`). First execution step produces the
   confirmed route→root map (repo `sites/arif-fazil.com/dist/*` → webroot split-root
   targets) as an artifact committed with the work. **No Caddy reload.**
3. Cloudflare purge note for changed routes (P3 pitfall #9) — purge request documented in
   evidence; execution via dashboard/API if creds available, else flagged to sovereign.
4. Release evidence YAML filled, committed with the work. No self-SEAL — evidence only.
5. Definition of done per page: `curl` live → status + `<title>` + dateModified + one
   content string. Build green is not proof.

## 7. Verification Summary

| Check | Command / probe | Pass condition |
|---|---|---|
| Build gates | `cd sites/arif-fazil.com && npm run build` | exit 0 (design-canon + lint green) |
| Page truth | `make verify-pages` | all dist pages HTTP 200 live |
| Mobile | re-run `/tmp/mobile_sweep.py` | 0 pages with overflow >8px |
| Visual | screenshots before/after (home, makcikgpt, federation, geox) | sovereign eyeball |
| Surface truth | `node scripts/verify-surfaces.cjs --base=https://arif-fazil.com` | exit 0 |
| Content | `bash scripts/verify-content.sh https://arif-fazil.com` | exit 0 |

## 8. My Calls (defaults I chose — sovereign can override any)

1. GeoxCockpit → `geox-app` family; HOLD if incompatible (no new Caddy route).
2. Shell priority order as listed (no traffic data — nav priority + content readiness).
3. `/world/petronas/` gets a real static shell rather than matcher removal.
4. Fonts stay canon IBM Plex; Stitch typography dropped with its palette.
5. Icons → lucide; portraits localized; one-torus-per-view.
6. `/000/ /999/` treated as already-complete unless page contract says otherwise.
7. Integration pattern = repo hybrid (static content-first + SPA enrichment via
   `copy-static-html.js`), never bare SPA routes on shadowed paths. [builder-check Q2]
8. Shell template = `generate-agent-shells.cjs` canonical tokens.css template;
   `primer-shells.cjs` gets the preservation guard but stays unwired. [Q6]
9. Terminals scope = `/klci` `/usdmyr` only; `/oil /gold /gas` untouched (separate apps). [Q7]
10. Cron wires existing `verify-pages.sh` + mobile sweep only; no new preflight tool. [Q8]
11. Deploy = cp-only additive per-route; route→root map artifact; no rsync/--delete. [Q4]
12. Acceptance target = human/browser lane on every changed route (bot lane insufficient). [Q3]

## 8b. Sovereign decisions — ANSWERED 2026-11-04 (F13)

- **D1 (Q1): GRANTED — named Caddy exception.** FederationObservatory lands at SPA
  `/federation`. Bounded change: delete the two `redir /federation /doctrine` lines
  (vhost :494, :1926), `caddy validate`, one `systemctl reload caddy`. NOTHING else in
  Caddy is touched under this exception.
- **D2 (Q5): GRANTED — approval = lease.** Lease covers generator-written shells under
  `sites/arif-fazil.com/public/**` and registration of the extended generator's owned
  routes. CANON files remain untouched.

## 9. Risks

- **Build gate strictness:** re-skinning 5 components (~250 lines each) against 7 check
  families — expect iteration; gate failures are the system working.
- **Shell content extraction:** 47 makcikgpt + 17 essay shells ingest markdown; frontmatter
  variance may need per-family adapters.
- **`/geox/` header fix** touches the geox-app build, a separate surface — bounded, additive.
- **CF cache:** stale 200s post-deploy; mitigated by purge note + cache-busting query on
  verification curls.

— DITEMPA BUKAN DIBERI
