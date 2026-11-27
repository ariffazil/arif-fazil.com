# RECEIPT — /wealth/malaysia/ + /petronas/ truth-correction and CSS localisation

- **Agent:** 333-AGI (OpenCode FI-001) · lane `lane/333-agi/malaysia-truth-correction`
- **Date:** 2026-11-22 (MYT) · **State:** PRODUCED → DEPLOYED → OBSERVED (live browser witness)
- **Authority:** sovereign in-session order 2026-11-22 ("upgrade amd improve this site…", two briefs, "i hate both of the site currently"); reversible static-surface change; no routing/CSP/DNS/secret/authority change.
- **Deploy envelope:** `<host>/arif-fazil.com/deploy-envelope.json`, sha == HEAD `edbac8c1…`, 12 negative tests declared, 7/7 executed PASS.

## Commits

| sha | what |
|---|---|
| `5b0f2e05` | lane: truth-correction + local Tailwind build + BAND 05 restore + mojibake repair |
| `39221141` | merge into `main` |
| `26e742a0` | lane fix: ftfy `uncurl_quotes` broke inline JS — repaired |
| `edbac8c1` | merge into `main` (HEAD at deploy) |

## Files changed (5)

`sites/arif-fazil.com/public/wealth/malaysia/{index.html,wealth.css,state.json,brief.md}`, `sites/arif-fazil.com/public/petronas/index.html`

## Root cause closed

`/wealth/malaysia/` rendered **100% unstyled** (body `rgba(0,0,0,0)`, `Times New Roman`) because CSP blocks `cdn.tailwindcss.com`; the inline `tailwind.config` therefore never ran. Tailwind is now compiled locally from the page's own theme config into `public/wealth/malaysia/wealth.css` (22,236 B) and linked with `<link rel="stylesheet" href="/wealth/malaysia/wealth.css" />`. **No CSP change. No Caddy reload. No `--delete`.**

## Value corrections (MoF Fiscal Outlook 2027 · PETRONAS 1H2026 IFR · BNM)

| metric | before | after | source |
|---|---|---|---|
| fiscal deficit 2026 | 3.8% | **3.6%** (revised from the 3.5% target) | MoF FO2027 |
| deficit glidepath | 5.6/5.0/4.3/3.8/3.3 | **5.6/5.0/4.3/3.7/3.6/3.3** (2022→27p) | MoF FO2027 |
| FX reserves | 5.0 mo | **4.7 mo** | BNM |
| real GDP growth 2026 | 4.2% | **4.8–5.3%** (scored on the 4.8% lower bound; basis shown on the card) | Budget 2027 / Economic Report 2027 |
| corruption index | 50 / 100 | **52 / 100** | CPI 2025 |
| current account / GDP | 2.1% | **2.1% (fcst)** — labelled as a Kenanga house forecast | Kenanga, Nov 2026 |
| composite pulse | 45 HOLD · 34/56/48 | **49 HOLD · 34/62/50** (equal-weight mean of pillar means; the prior 45 was not reproducible from its own pillars) | derived |
| PETRONAS dividend | implied RM32B for 2026 | **FY2026 RM27B** (MoF, revised from RM20B declared) · **FY2027 RM32B** | MoF FO2027 |
| `/petronas/` HUD cash | RM111.4B | **RM193.6B** (RM111.1B is *current liabilities*, not cash) | PETRONAS 1H2026 IFR |
| `/petronas/` HUD dividend | RM32.0B | **RM20.0B** declared | PETRONAS |

Sealed dates, epistemic tags, verdict language and live proxies were **not** altered. 555-ASI verified 12 claims and corrected four of my assumptions (2,341 kboe/d is correct; FY2026 dividend is RM27B; 19 Dec 2027 is correct; "eight successful wells" is official PETRONAS wording).

## BAND 05 restored

`kimi-code/FI-008-site-sync` (not an ancestor of `main`) → spliced as `<section id="band-detail">` inside `<main>`, with nav link `05 · DETAIL`. Its own corrections: leave granted **16 March 2026** (not "March/April"), deficit **3.6%**, Limbayong FID qualified as industry-reported (PETRONAS has published no official figure). `/oil/` and `/gas/` institutional links added; the phantom `/wealth/petronas/` graph node repointed to `/petronas/`.

## Mojibake

ftfy repaired the file's `â€…` sequences: **0 mojibake markers, 0 control chars** remain. Curly quotes preserved (see regression below).

## Gates (all PASS)

design-lint (814 files, 0 leaks) · validate-jsonld (232 blocks parse) · `node --check` on every inline script (JS OK, JSON-LD parses) · wealth.css class coverage **276/276** (only `.bg-grid-pattern` / `.fade-in` / `dark` absent, all page-inline) · deploy-envelope gate VALID · negative tests 7/7 PASS · source sha256 == live sha256 on all six deployed files.

## Regression caught and fixed (do not repeat)

First pass ran `ftfy.fix_text(html)` with the **default** config, which uncurls `’` → `'`. Inside the page's single-quoted JS strings (`"Coupled directly to KLCC's dividend valve"`) that closed the string literal: `node --check` → `SyntaxError: Unexpected identifier 's'`, and the browser showed **0 tripwire cards** — a styled but data-less page. Repaired with `ftfy.TextFixerConfig(uncurl_quotes=False)`, re-committed `26e742a0`, re-deployed, re-witnessed green. **A curl-only probe cannot see a dead script; `node --check` + a rendered-DOM count can.**

## Live witness (headless chromium, post-deploy, nonce-busted)

`/wealth/malaysia/` @1440×900 and @430×900 — `bodyBg rgb(8,10,15)` (#080A0F) · `bodyFont Inter, system-ui, sans-serif` · `hudBg rgba(16,20,29,0.9)` · `tripwireCards 9` · `bandSections 5` (past/present/coupling/future/detail) · `navLinks 7` · `cssLoaded true` · **console: none · errors: none**.

`/wealth/malaysia/wealth.css` → 200 `text/css` 22,236 B · `/wealth/wealth-coupling.js` → 200 `text/javascript` 3,162 B (was 200 `text/html` — the WEALTH hub).

## Live sha256 (post-deploy)

```
b9d53698aaa85df0a58b58868a58b47dfa2cccd5ddb3ad42ed5f6658f026c621  /var/www/html/arif/wealth/malaysia/index.html
1b81147c5a27d4c2ba8d3058f979a7277c9deebf3ac75dcd582e64fd8c291132  /var/www/html/arif/wealth/malaysia/wealth.css
b9d53698aaa85df0a58b58868a58b47dfa2cccd5ddb3ad42ed5f6658f026c621  /var/www/html/wealth/malaysia/index.html
1b81147c5a27d4c2ba8d3058f979a7277c9deebf3ac75dcd582e64fd8c291132  /var/www/html/wealth/malaysia/wealth.css
9c457c2b0a2a6cf26071b61469939376e1c13a8618df2990cbdf556b4f2d5df2  /var/www/html/wealth/wealth-coupling.js
64c37259d7971af6dbedadbd2543ee1add71e6d734ea32528641f748aa29612e  /var/www/html/arif/petronas/index.html
```

## Rollback

Backups (final stamp `20261122T083412Z`):
`<host>/forge_work/deployments/arif-fazil.com/20261122T083412Z/previous/` and `*.bak-20261122T083412Z` beside each live file.
`rsync -av --update …/previous/wealth/malaysia/ /var/www/html/arif/wealth/malaysia/ ; …/previous/petronas/ /var/www/html/arif/petronas/ ; …/previous/wealth-coupling.js /var/www/html/wealth/wealth-coupling.js`

## Open boundaries (not fixed here)

1. `/wealth/petronas/` still resolves to the WEALTH hub (phantom-200) — needs a Caddy routing decision; the tracked twin was deliberately not deployed.
2. `/oil/` and `/gas/` were status-probed (200) but not render-verified this pass.
3. Two stale backup stamp sets (`T083059Z`, `T083138Z`) remain in the webroots beside the final set.
4. `deploy-envelope.json` at the repo root was overwritten; the previous arifOS-Observatory envelope (sha `7959b728`) is no longer at that path.
5. **Concurrent writer:** `kimi-code/FI-008` merges to `main` every ~2 min. If their branch touches `public/wealth/malaysia/`, this deploy is reverted — re-probe the live sha `b9d53698…` before trusting it persists.

*DITEMPA BUKAN DIBERI — Forged, not given.*

---

## ADDENDUM — zombie-link repoint (2026-11-22T08:39:05Z)

`/wealth/petronas/` is a **phantom-200**: it answers 200 with the WEALTH hub (35,273 B), so "KLCC Telemetry" and the `/map/` graph node silently landed readers on the wrong organ. Eight links across five surfaces repointed to the live `/petronas/` (200, 47,316 B) and its machine twins (`/petronas/state.json` → 200 `application/json`; `/petronas/brief.md` → 200 `text/markdown`).

`public/petronas/state.json` (canonical_url) · `public/petronas/brief.md` · `public/wealth/malaysia/state.json` (mirror_url) · `public/wealth/index.html` (2 `<link rel=alternate>`) · `public/map/index.html` (machine pill + graph node + visible label) · plus the undeployed twin's `canonical`.

Commit `3462379a` → merge `27dfb35f`. Envelope sha == HEAD, additive `rsync -av --update`, no `--delete`, no Caddy reload; source sha == live sha on 4/4.

**Not deployed, deliberately:** `public/wealth/index.html` is a *different artifact* from the live WEALTH hub (9,459 B vs 35,273 B, 808 diff lines) — shipping it would have regressed the hub. Caught by the size/diff pre-check before any write.

**Left alone, flagged:** `public/world/petronas/shadow/**` still carries three links to `/wealth/petronas/` (last touched 14:39 by an active sibling lane on the Kerusi Bayang surface — one writer per surface).

Live witness: `/map/` zombie refs **0**; links now `/petronas/` ×3 and `/petronas/state.json` ×1; `/petronas/state.json` canonical = `https://arif-fazil.com/petronas/`; `/wealth/malaysia/state.json` mirror = `https://arif-fazil.com/petronas/state.json`. All six routes 200 with correct content-types.

Rollback: `<host>/forge_work/deployments/arif-fazil.com/20261122T083905Z/previous/` + `*.bak-20261122T083905Z` beside each live file.
