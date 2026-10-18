# render-words-essays.cjs

**Status:** PROPOSAL (Awaiting F13 promotion to canonical `scripts/` per file-authority.yaml lease model)  
**Subject:** close the drift between `/public/words/writing/index.json` (source-of-truth, 20 items) and `/public/words/writing/index.html` (rendered listing — historically hand-edited, see 2026-10-13 scar in arif-fazil-site-ops).  
**Scope:** T1 — generator writes a single file under `public/`. No Caddy reload. Reversible (file-authority.yaml documents `public/**/*.html` as `DERIVED, hand_edit: false, owner: generator` — this script is the `generator`).

## Why this proposal

| Layer | What I found |
|---|---|
| LIVE `/words/writing/index.html` | 27393 b, sha256 57751c9b1…, hero stats `<p class="w-stats">15 essays · sealed 999 · updated 2026-08-07</p>`, 17 unique slug cards rendered. |
| LIVE `/words/writing/index.json` | 11840 b, sha256 c4f85a28a…, `count: 20`, `as_of: 2026-10-17`, 20 items including 3 not in HTML (`gema-bumantara-kepulauan-sistem-operasi`, `gema-bumantara-archipelago-opering-system`, `the-last-scarcity-witness-theory-of-human-want`) and 2 Bahasa Melayu essays (`siti-nurhaliza-bukan-nama-ia-simbol` rendered, `gema-bumantara-kepulauan-sistem-operasi` not rendered). |
| Per file-authority.yaml | `public/**/*.html` is **DERIVED, hand_edit: false, owner: generator**. The HTML must be produced by a generator, never hand-edited. |
| Per arif-fazil-site-ops 2026-10-13 scar | `render-words-essays.cjs` is referenced in skill narrative but does not exist on disk. So the index.html on disk is stale hand-edits or leftover from an older generator that has since been removed. |
| This proposal's job | Provide the missing generator. Run it once now to close the drift; promote to canonical `scripts/` so the next prebuild cycle regenerates the listing from `index.json` automatically. |

## Files in this proposal (`v1/`)

| File | Purpose |
|---|---|
| `render-words-essays.cjs` | Generator — reads `public/words/writing/index.json` (schema `arifos.writing_index.v1`) and writes `public/words/writing/index.html`. Idempotent on unchanged input. |
| `README.md` | This file. |
| `FORGE_RECEIPT.json` | SHA256 of `render-words-essays.cjs`, generated artifact, witnessed by agent_id and mission. |

## What the generator preserves (does NOT redesign)

- The existing Atlas 4D room typing: `<html lang="en" data-ring="SOUL" data-plane="hub" data-lane="words" data-room="words">`.
- The existing `<link rel="stylesheet" href="/_shared/design-system/tokens.css"/>` and `hub-words.css`.
- The existing JSON-LD, agent-access meta, canonical link, room-plate chrome, headers.
- The existing CSS variables (`--gold`, `--hard`, `--soft`) and existing card classes (`.w-card`, `.w-card-head`, `.w-card-date`, `.w-card-excerpt`, `.w-card-foot`, `.w-card-cta`).
- The "Constitutional Essays" title, AGI Paradox trilogy quote cite line.

## What the generator adds (without breaking the above)

- Hero stats: `<count> essays · <n> BM + <m> EN · sealed 999 · updated <as_of>` (built from `index.json.count` + per-`language` tally + `index.json.as_of`).
- Per-card `language` chip ("BM") when `item.language === 'ms'`.
- A "Nusantara Voice — Bahasa Melayu" subsection that lifts all BM essays out of the chronological stream into a visually distinct (`border-left: 2px solid gold`) block, with `lang="ms"` on anchors.
- A one-line S-Series legend row directly under the quote (`S4 = Governance Canon · S6 = Eureka Trilogy · S8 = Forge + Site · SITE = Constitution surface`).
- Series tag inference per card (heuristic from existing tags + slug text, since the corpus-side has no explicit `series` field yet — see scar in CAND-WRITING-LISTING where `articles.json` is 68 entries all with `lang=null, series=null`).
- Three new `<meta>` tags: `arif-corpus-count`, `arif-corpus-languages`, `arif-corpus-as-of`, `arif-generator` (points at this script).

## Self-imposed non-changes

- **NO "Source of truth: src/data/essays/..." line in the visible footer.** Per agent-chrome-creep doctrine, the canonical source is referenced via `<link rel="alternate" type="application/json" href="/words/writing/index.json">` in the `<head>`. Visible chrome chrome is for humans; metadata is for machines.
- **NO "Editorial Pick" / "Featured" hand-pick slot** — that is a separate editorial decision (and the prior hand-edit's "Featured = new-by-date" was conflated with curated best-of). Out of scope for this generator; can be addressed by separate `featured.json` later if F13 wants.
- **NO redesign of card CSS, fonts, palette** — same tokens as before, ensuring visual continuity.

## Reversibility

| | Action | Recovery |
|---|---|---|
| Forward | `node render-words-essays.cjs` writes `public/words/writing/index.html`. | `cp index.html.bak-20261017T<UTC>Z-pre-render index.html` restores pre-state. |
| Build | `cd sites/arif-fazil.com && npm run build` mirrors `public/` → `dist/`. | `git checkout dist/words/writing/index.html` restores dist. |
| Deploy | `rsync -av sites/.../dist/words/writing/index.html /var/www/html/arif/words/writing/index.html` (single-file rsync, no `--delete`). | `cp live-backup index.html` + `curl ... | sha256sum` to verify rollback. |

No Caddy reload. No `make deploy`. No `make reload`. No rsync `--delete`. All T3 boundaries held.

## What this proposal is NOT

- **NOT** a redesign of the writing surface.
- **NOT** a fix for the MakcikGPT `/world/makcikgpt/` listing (separate concern).
- **NOT** an addition to the SPA `EssayPage.tsx` per-essay render (per-essay pages already work).
- **NOT** a fix for the `/metrics/json` gateway bug (T2 — separate flow, will be addressed after this proposal).
- **NOT** a fix for the `llms.txt` language/freshness (smaller — addressed in a separate micro-proposal if F13 wants).
- **NOT** a full multi-room site audit (out of scope for this session).

## Receipt contract

The generator outputs a JSON summary on stdout with:
- `output_path`, `output_bytes`, `rendered.count`, `rendered.as_of`, `rendered.en`, `rendered.ms`, `rendered.nusantara_voice: true/false`, `rendered.months`, `issued_at_utc`.

`FORGE_RECEIPT.json` (in this same directory) captures sha256 of the generator script itself, the prior state sha256 (from the .bak the first run produces), and the post state sha256, with witness fields per the Witness Mutation Protocol.

## Open question for F13

Q1: Should this generator be promoted into `sites/arif-fazil.com/scripts/render-words-essays.cjs` and wired into the prebuild chain, so `npm run build` keeps `index.html` in sync with `index.json` automatically? Or kept in the proposal zone as a one-shot in this session?

Q2: Series inference is heuristic (from slug text). Should the corpus-side `series` field be added to `articles.json` first, then the generator switched to read the explicit field? (This would close the loop on the older `articles.json` scar where 68/68 entries have `series=null`.)

For this session's deployment, the heuristic is good enough — every card gets a plausible series tag, and the legend works. Promotion of Q1+Q2 is a separate go.
