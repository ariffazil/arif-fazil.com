# Release evidence — Words ⇄ MakcikGPT zen (2026-11-23)

> Plan: `docs/superpowers/plans/2026-11-23-words-makcik-zen.md`
> Authority: F13 ratification 2026-11-23 — "sah A B D1 E D2 C, dossier retire".
> Executor: FI-003 (qwen-code). Evidence only — NO self-SEAL.

## Commits (repo <host>/arif-fazil.com, main)

| Task | Commit | Scope |
|---|---|---|
| A | `b0a4868b` | /words lists authored essays only; M-chips removed; cross-link card to canonical |
| B | `e373c8a6` | zombie /words/makcikgpt page+route+shell+discovery entries removed; Caddy 301 untouched |
| D1 | `fd1a445f` | hukum-kereta backfill; full-reality retired; leadership re-pointed; parity 53=53 |
| E | `26e15274` | content-first /words/ hub shell via new prebuild generator (39 essays) |
| D2 | `dae09ce2` | essays.json ⋈ presentation → meta.generated.ts; parity gate in prebuild; drift engine retired |
| C | `d1f8bb2f` | /words/essays/ merged into /words/ (SPA Navigate + canonical; no Caddy change) |
| tombstones | `491b35f2` | retirement notices both lanes for full-reality slug (phantom-200 fix) |

## Gates (actual outputs)

- `npm run build` exit 0 (final sync build included; tsc + vite + full prebuild chain).
- `tests/makcik-parity.test.cjs`: RED 3/3 proven before generation → GREEN; final 9/9 pass, wired into prebuild.
- `tests/makcik-source.test.cjs` (pre-existing machine-lane suite): 10/10 pass.
- `make verify-pages`: PASS — 229 pages (9 intentionally excluded), run pre-deploy AND post-deploy.
- `site-preflight.py --check /words/` and `/world/makcikgpt/`: VERDICT PASS (split-root, orphan-assets, phantom-200).
- `mobile-check.py` on /words/, /words/essays/, /world/makcikgpt/, hukum-kereta, full-reality tombstone: TOTAL 5 | OK 5 | BAD 0.

## Deploy (cp-only additive, no rsync/--delete, no Caddy reload)

- Script + log: `<host>/_archive/webroot-zen-20261123/deploy.log` (2026-11-23T01:44+08:00).
- Pre-overwrite backups: `<host>/_archive/webroot-zen-20261123/pre/`.
- SPA index+assets, words family, world/makcikgpt, md mirrors, catalogs → BOTH roots
  (`/var/www/html/arif/` + `/var/www/html/`), per route-root-map + T20 precedent.
- Retired dossier shells/md/html archived (mv, reversible) from both roots + all 3 md-mirror
  dirs. **PDFs preserved live** as historical document assets.
- `words/makcikgpt` webroot shell left in place per plan B (shadowed by Caddy 301).

## Live verification (origin probes --resolve 127.0.0.1 + browser-UA Playwright)

| Surface | Result |
|---|---|
| /words/ static | 200, 11.9KB, 39 `<li>`, title correct |
| /words/ rendered (iPhone UA, new bundle index-DarioqPU.js) | 39 articles, "39 PUBLISHED", 0 makcik article links in list, 2 canonical cross-links, chips ALL+S1–S9 only |
| /words/essays/ | static canonical → /words/; browser Navigates to /words/ |
| /words/makcikgpt/ | 301 → /world/makcikgpt/ (unchanged) |
| /world/makcikgpt/ rendered | 53 unique article links; hukum-kereta IN; both dossiers OUT |
| hukum-kereta article | 200, correct title, content-first shell |
| full-reality slug | human lane: tombstone 200 (noindex, canonical /petronas/); bot lane: markdown retirement notice |
| leadership slug | 301 → /world/petronas/shadow/ (unchanged) |
| feed.xml | 53 items; sitemap 53 articles + landing; llms articleCount 53 |

## Deviations from plan (recorded, not silent)

1. **sayang-ada-pintu NOT backfilled.** Plan premise said "2 real articles"; the file is a
   312-byte stub (`content_html: ''`, no body) — an unfinished draft, never registered in
   index.ts. Publishing it would fabricate a phantom article (F2). Left untouched for its
   author. D1 therefore backfilled 1 article; parity is 53=53, not 54=54.
2. **hukum-kereta provenance = 'migrating'.** TS meta carries seal 999 but an empty
   claim_register; the sealed gate requires claims. Claims were NOT invented; 'migrating'
   is an existing store state (m4-3, m2-11). Claim register compilation is future work.
3. **Tombstones added** (not in plan text): retirement exposed a phantom-200 at the bare
   slug (try_files fallback to archive landing). Fixed additive in both lanes; no Caddy change.
4. **Types widened to project the SOT** (D2): EpistemicTag +HYP (1 real claim),
   SourceItem.type +8 observed types, maruah_review accepts annotated approvals,
   null→omission projection. HYP styling added to both receipt surfaces.
5. **Series placement editorial:** hukum-kereta → GENESIS n8 (fits the recent human-arc
   pieces n12–15 thematically and the Oct-30 date into the n8–11 gap). Renumber if F13 prefers.
6. **Commit A initially swept a foreign staged file** (geox profile.json, shared index).
   Fixed immediately via soft-reset + pathspec re-commit; the other lane's staged WIP was
   preserved byte-exact (MM state restored). All later commits pathspec-scoped.

## Discovered pre-existing defect (NOT fixed — out of ratified scope)

**Receipt URLs shadowed by static landing.** `/world/makcikgpt/<slug>/receipt` renders the
curated archive landing, not RealityReceiptPage: the landing is allowlist-preserved WITHOUT
SPA injection, and Caddy try_files falls back to it for every unshelled child URL. Zero Vite
scripts in the served HTML (measured). Predates the zen (allowlist treatment from 2026-09-18).
Follow-up options need F13 word: hybrid-enrich the landing (inject Vite assets, keep content)
or emit per-slug receipt shells.

## Rollback

- Repo: `git revert b0a4868b..491b35f2` (7 commits, all on main, unpushed).
- Webroot: pre-overwrite copies in `<host>/_archive/webroot-zen-20261123/pre/`; archived
  dossier artifacts restorable by mv back (paths logged in deploy.log). SPA assets additive —
  old hashed bundles still present; restoring previous index.html reverts the bundle ref.
- Caddy: untouched — nothing to roll back.

## Pending

- Cloudflare edge cache self-expires (max-age 3600); purge token lacks scope (T20 precedent).
  Origin verified; cache-busted browser probes confirmed new bundle.
- Push: NOT done (no push instruction given).
- hukum-kereta claim_register compilation; sayang-ada-pintu draft completion (author's lane).
- Receipt-URL shadow fix (needs F13 word).
