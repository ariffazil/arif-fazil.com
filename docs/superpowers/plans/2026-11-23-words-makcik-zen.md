# Words ⇄ MakcikGPT Zen — Redundancy Map & Execution Plan

> **Status:** EXECUTED + DEPLOYED + LIVE-VERIFIED 2026-11-23. Ratified by F13: "sah A B D1 E D2 C, dossier retire".
> Execution order A → B → D1 → E → D2 → C. Ruling: `petronas-full-reality-rakyat-dossier`
> RETIRED (remove essays.json entry); `petronas-leadership-1974-2026` re-pointed to
> `/world/petronas/shadow/` per D1 as written.
> Evidence: `docs/agentic-web/release-evidence/2026-11-23-words-makcik-zen.md`
> (commits b0a4868b…491b35f2, gates, live probes, deviations, rollback).
> **Trigger:** F13 2026-11-23 — "why do i think makcikgpt and words kinda redundants? … explore and probe previous site upgrade plan and map it and update the site plan execution"
> **Author:** FI-003 (qwen-code), measured probes 2026-11-23.
> **Predecessors:** UPGRADE-PLAN-2026-11-03 · MAKCIKGPT_TRUTH_LINEAGE (2026-09-24, ratified) · 2026-11-04-site-completion (executed) · 2026-11-22 entropy pass.

## 1. Why it feels redundant — measured, not vibes

One body of work (the civic column) sits on **three shelves**, fed by **two stores** that drift.

| # | Redundancy | Evidence (probed 2026-11-23) |
|---|---|---|
| R1 | **/words "Essays" list is 59% MakcikGPT.** WordsEssays renders all 92 essays.json items; 54 have `dest.path = /world/makcikgpt/<slug>`. Only 38 are actual essays. The M1–M5 filter chips on the essays page are MakcikGPT series. | `src/pages/WordsEssays.tsx` (no lane filter) · essays.json count: 92 total / 54 makcik-dest / 38 other |
| R2 | **Zombie third shelf: /words/makcikgpt/.** Caddy 301s it to /world/makcikgpt/ since 2026-10-04 ("parallel index with same articles"), but the repo still carries the SPA route + `WordsMakcikgpt.tsx` (170 lines) + a static mirror shell in `public/words/makcikgpt/` and webroot. The 2026-11-04 plan Task 16 even *filled* this dead shell. WordsEssays' sister link still points at it (a 301 hop). | `curl /words/makcikgpt/ → 301 → /world/makcikgpt/` · vhost :899-903 · App.tsx :215-216 |
| R3 | **Two stores, still drifting.** essays.json (92) is SOT for the machine lane (feed/sitemap/llms via `scripts/lib/makcik-source.cjs` — the ratified lineage pipeline, built). But the SPA human lane reads hand-authored `src/data/makcikgpt/index.ts` (54 articles). The lineage doc's last arrow (essays.json → index.ts) was never built. | overlap = 52 · **2 real articles in TS only** (`hukum-kereta-sentuhan-tak-dinamai`, `sayang-ada-pintu`) → absent from feed.xml (54 items), sitemap (54 makcik URLs), llms · **2 dossiers in essays.json only** (`petronas-full-reality-rakyat-dossier`, `petronas-leadership-1974-2026` — the latter already 301→ /world/petronas/shadow/ by the 2026-11-22 merge) |
| R4 | **/words/ ≡ /words/essays/** — two URLs, one component (WordsEssays), both routes in App.tsx :209-212. Minor URL-level duplication. | App.tsx · live titles differ only by document.title effect |
| R5 | **/words/ static shell is thin** (2,873 B: h1 + 3 links, no list) while MakcikGPT has full content-first shells + md mirror. The essays hub fails the content-first parity the rest of the site got in Tasks 12–17. | `curl /words/` size + body |

**The ratified intent already exists** — Caddy comment 2026-10-04: *"Force canonical /world/makcikgpt"*; WordsMakcikgpt's own doctrine banner: *"this hub page is a discovery surface only"*. The zen is finishing that decision, not making a new one.

## 2. Previous plans — map & execution status

| Plan | Scope | Execution status (probed) |
|---|---|---|
| `sites/arif-fazil.com/docs/UPGRADE-PLAN-2026-11-03.md` | P0 reality refresh · P1 static parity · P2 tokens/nav · P3 automation | P0 three items DONE 3 Nov (receipts in doc). P1–P3 folded into site-completion. **No words⇄makcik scope.** |
| `docs/MAKCIKGPT_TRUTH_LINEAGE.md` (2026-09-24, RATIFIED) | Single-source pipeline: essays.json → all generators + SPA index.ts | **Machine-lane arrows LIVE** (`makcik-source.cjs` guards feed/sitemap/llms/makcik-index). **SPA arrow NOT built** — index.ts hand-authored; drift R3 persists in new form (was 8+2, now 2+2). |
| Caddy Tier-1 nav consolidation (2026-10-04) | /words/makcikgpt/* → /world/makcikgpt/* 301 | **LIVE** (vhost :899-903). Repo-side zombie never cleaned (R2). |
| `docs/superpowers/plans/2026-11-04-site-completion.md` (21 tasks) | Mobile-clean · Stitch heroes PRIMER-1 · content-first shells · UPGRADE-PLAN P2/P3 | **ALL 21 COMPLETE** — ledger `docs/agentic-web/release-evidence/2026-11-04-site-completion-ledger.md`, commits a660f22…3c01803, tag site-completion-2026-11-04. Plan-doc checkboxes stale (banner added 2026-11-23). T16 filled the zombie words/makcikgpt shell — dead on arrival under the 301. |
| 2026-11-22 entropy pass (commits fbd6f68, 8a8e0c4, bc83fb7) | Canonical-only sitemap · leadership dossier merge · redirect map | **LANDED.** Same direction as this zen; R3's leadership entry is its leftover. |

**Gap none of them covered:** the content-lane boundary between /words and /world/makcikgpt (R1), the zombie cleanup (R2), and the SPA store loop (R3). That is this plan.

## 3. Zen target state (LAW 8 — one problem, one owner, one path)

```
/words/            → Arif's authored essays + doctrine + wiki (38 items, S-series)
                     one cross-link card: "MakcikGPT — civic column →"
/world/makcikgpt/  → THE civic archive (canonical, unchanged; UA-split bot mirror stays)
essays.json        → single metadata SOT for BOTH lanes (generators + SPA meta)
src/data/makcikgpt/*.ts → article BODIES only (no competing metadata)
/words/makcikgpt/  → 301 only (edge already does this; repo stops carrying a corpse)
```

Human at 2am: "Words = his essays. MakcikGPT = the column. One click between them."
Agent at scale: one canonical URL per article, feed/sitemap/llms in parity with the archive.

## 4. Tasks — lettered, separately approvable

Global constraints (inherited from site-completion, still binding):
- Gates per task: `npm run build` exit 0 · `make verify-pages` PASS · `mobile-check.py` on changed routes · `site-preflight.py --check <route>` before deploy.
- **cp-only additive deploy**, no rsync/--delete, no Caddy reload. Caddy 301s for /words/makcikgpt STAY (external links).
- Acceptance = human/browser lane (iPhone UA), not curl-only.
- One writer on `public/words/` (pitfall #10). Generator-owned shells: edit the generator, not the output (T8 ruling).
- Working dir `sites/arif-fazil.com`; commit per task; no self-SEAL.

### Task A — /words becomes essays-only (kills R1) · the core zen
- Modify `src/pages/WordsEssays.tsx`: filter out `dest.path` starting `/world/makcikgpt/`; drop M1–M5 chips (keep S-series + ALL); header count reflects filtered length; replace the MakcikGPT sister-link with one cross-link card ("MakcikGPT — civic column in Bahasa Makcik → /world/makcikgpt/").
- No essays.json change (least power — filter at render; data stays one store).
- Verify: build · preview probe /words/ shows 38 items, zero /world/makcikgpt links in the list, one cross-link card · mobile-check.
- Deploy: SPA assets additive; live browser-UA probe.

### Task B — bury the zombie /words/makcikgpt (kills R2)
- Delete `src/pages/WordsMakcikgpt.tsx` + App.tsx routes :215-216.
- Remove `words/makcikgpt` from the shell generator's source-map so prebuild stops regenerating `public/words/makcikgpt/`; delete the repo shell. Webroot copy left in place (Caddy redir shadows it; removal = separate tracked cleanup, not this diff).
- Fix WordsEssays sister link → `/world/makcikgpt/` direct (no 301 hop).
- Verify: build · verify-pages (declare the removed route) · `curl /words/makcikgpt/` still 301 → canonical.

### Task C — one URL per page: /words/essays/ → /words/ (kills R4) · optional, low priority
- SPA: `<Navigate to="/words/" replace>` for /words/essays routes; static shell keeps content but canonical tag → /words/.
- No Caddy change (a 308 redir would need a sovereign exception — not worth it for this; skip unless F13 wants edge-level).

### Task D — close the single-source loop (kills R3)
- **D1 (backfill, small):** add the 2 TS-only articles to essays.json per schema (claim_register, series, dest, seal) → feed/sitemap/llms parity. Re-point or retire the 2 dossier entries: `petronas-leadership-1974-2026` dest → `/world/petronas/shadow/` (matches the live 301); `petronas-full-reality-rakyat-dossier` — **needs F13 ruling**: keep as machine-only dossier entry, or give it a TS body, or retire.
- **D2 (structural, the lineage doc's last arrow):** generate `makcikgpt/index.ts` *metadata* from essays.json at build time (bodies stay in per-slug .ts); add a parity test (TS slugs ↔ essays.json makcik slugs, dossier exceptions declared). Drift becomes a build failure, not an audit finding.
- D1 can land alone; D2 is the durable fix. Recommend both, D1 first.

### Task E — content-first /words/ hub shell (kills R5)
- Enrich `public/words/index.html` (generator/allowlist path, content inside `#root` per house rule): the 38-essay list with dates + dest links, dateModified, cross-link to /world/makcikgpt/. Same for /words/essays/ shell if C not taken.
- Verify: preflight PASS · browser-UA render check (no stray block above nav) · mobile-check.

## 5. Execution record (2026-11-23)

All six tasks executed in ratified order, plus tombstones for the retired slug:
A `b0a4868b` · B `e373c8a6` · D1 `fd1a445f` · E `26e15274` · D2 `dae09ce2` · C `d1f8bb2f` · tombstones `491b35f2`.

Key deviations (full list in the evidence record):
- `sayang-ada-pintu` is a 312-byte EMPTY STUB, not a real article — NOT backfilled, NOT
  registered (F2: no phantom articles). Parity landed at 53=53.
- `hukum-kereta` backfilled with provenance 'migrating' (seal 999 kept; claims not invented).
- D2 found and retired the reverse-direction drift engine `generate-essays-json.cjs`
  (TS-as-canon, zero callers, contradicted the ratified lineage doc).
- Retirement exposed a phantom-200 at the bare slug → tombstones added in both lanes.
- Discovered pre-existing defect (unfixed, needs F13 word): /world/makcikgpt/<slug>/receipt
  URLs are shadowed by the static landing (no SPA injection on the allowlisted landing).

Live state: /words/ = 39 authored essays + one cross-link card · /world/makcikgpt/ = 53
articles · one metadata SOT (essays.json) with a build-time parity gate · feed/sitemap/llms
in parity · /words/essays/ and /words/makcikgpt/ are aliases of their canonical homes.
