# FI-002 · arif-fazil.com landing page audit

**Date:** 2026-10-28 · **Actor:** claude-code-kvm8 (FI-002, engineer lane)
**Method:** `arif-fazil-landing-page` skill v1.0.0 (installed this session)
**Nature:** Lane B receipt. Not a SEAL. No verdict authority.

## What was installed
`/root/AAA/skills/arif-fazil-landing-page/SKILL.md` — 5,497 B,
sha256 `fc5b6dbe76151ae9a6658ca29f4aeb2280eaa7be6ed7fd28342237935010ab9f`.
Written through `canon-mutate run /root/AAA/skills --expect-sha256-post …`
→ `rc=0 lock=true effect=VERIFIED_EFFECT`, tree relocked.

## Evidence probes (all OBS)

| Probe | Command | Result |
|---|---|---|
| Live index | `curl -s -o /dev/null -w '%{http_code}'` | 200, 9,140 B |
| Served CSS | `/assets/index-Cuat_Uam.css` | 184,636 B |
| Render at 390/768/1440 | playwright chromium-1248 | `overflowX = 0` at all three |
| 404 | `GET /no-such-page-fi002-probe` | 404, body `404 — Not Found` |

## Checklist result — live homepage

### Strategy
| Item | Result | Evidence |
|---|---|---|
| One button, repeated top+bottom | **FAIL** | hero has two primaries: `Request a briefing →`, `View selected work →` |
| Headline names outcome + audience | **FAIL** | H1 = `ARIF FAZIL` (name only). Outcome sits in the subheadline. |
| Three objections answered | **FAIL** | no objection sections present |
| Claims carry number + unit + source | **PARTIAL** | `4 wells`, `B-06-16 ST-1` carry numbers; the framing claims (`I turn uncertain Earth data…`) carry none |
| FAQ as real questions | **FAIL** | none |

### Visual
| Item | Result | Evidence |
|---|---|---|
| Zero raw hex outside tokens.css | **FAIL** | `#1F2733` ×359, `#9AA0A8` ×358, `#EDEAE2` ×312, `#E4572E` ×253 in `src/` |
| One display / one UI / one mono font | **FAIL** | 8 families load: Fraunces, Newsreader, Cabinet Grotesk, Satoshi, DM Serif Display, IBM Plex Sans, IBM Plex Mono, JetBrains Mono |
| Accent used once, canon only | **FAIL** | live `#E4572E` ×54 in served CSS; canon `--accent #4aa8ff` ×0 |
| Spacing from `--sp-*` | **UNKNOWN** | Tailwind arbitrary values used throughout; not measured per-element |
| Every transition uses `--ease` | **UNKNOWN** | not measured |

### Shipping
| Item | Result | Evidence |
|---|---|---|
| title / description / canonical / OG | **PASS** | all present and non-empty |
| Favicon | **PARTIAL** | inline `data:image/svg+xml` Ψ glyph — no `.ico`/`.png` file, and Ψ conflicts with the `og:image` alt "AF monogram" |
| Alt text | **N/A** | 0 `<img>` elements on the homepage |
| Branded 404 | **FAIL** | HTTP 404 correct, but `<title>` empty and body is bare `404 — Not Found` |
| Privacy + Terms in footer | **PASS** | footer links present |
| Phone: no button wrap | **PASS** | all hero buttons single-line at 390 px (see `live-phone.png`) |

## Section count
Live homepage: **4** `<section>` / 3 `<h2>`. Rulebook target: **12**.
Gap = problem, offer, how-it-works, 3× objection, who-it's-for, FAQ.

## Screenshots
`live-phone.png` (390×5552) · `live-tablet.png` · `live-desktop.png`
Staged at `/tmp/_skill_stage/`. Not yet copied into the repo.

## Honest limits
- The "wrapped button" detector flagged `Request a briefing →` as 44 px tall vs 16 px line-height at every width — that is padding, not wrapping. Screenshot confirms single line. Heuristic rejected.
- Spacing and motion checks are declared UNKNOWN, not passed. Not measured.
- Nothing was deployed. No page was rebuilt. The live surface is unchanged.

## The one decision this names
Two palettes ship at once and the declared accent is dead code. Fixing that is a
token migration in `src/` (≈1,000 raw-hex occurrences), reversible, no public
change of behaviour — but it touches the live homepage build, so it lands under
Arif's go, not mine.

---

# Addendum — Landing Architecture v2 prototype (same day)

**Subject:** Arif's 12-section structure, built and rendered locally. **Not deployed.**

**File:** `.staging/landing-v2/index.html` (single page, no build step)
**Served:** `python3 -m http.server 8099` from repo root, so
`../../sites/shared/tokens.css` resolves to the sealed token file.
**Screenshots:** `evidence-20261028/v2-{phone,tablet,desktop}.png`

## Corrections to the first audit (F2 — my own claim was wrong)

The first pass reported "8 font families load". That was measured from
`document.fonts`, which lists *declared* FontFace objects, not rendered ones.
Re-measured by computed style on every element:

| Family | Computed-first-choice count | Real? |
|---|---|---|
| IBM Plex Mono | 161 | yes — loaded |
| Inter | 88 | **no** — never in a `<link>`, collapses to system sans |
| Newsreader | 58 | yes — loaded |
| Fraunces | 13 | yes — loaded |
| ui-sans-serif | 12 | system fallback |
| Cabinet Grotesk | 0 | **phantom** — no `@font-face`, no file, no CDN |
| Satoshi | 0 | **phantom** — same |
| DM Serif Display | 0 | phantom |

And the sharper finding: the homepage loads
`/_shared/design-system/tokens.css` (TRINITY, 2026-04-11) — **not**
`/_shared/tokens.css`, the sealed "ROOT DESIGN CONSTITUTION v1.0 · F13: ARIF".
Both return 200. The constitutional token file is served but unreferenced.

## Decisions taken in the prototype

| Decision | Choice | Why |
|---|---|---|
| Accent | **Option A — copper `#E4572E`** | 253 occurrences in `src/`, 54 in live CSS. It already *is* the identity; B would require rewriting the accent layer too. |
| Display | Fraunces | Arif's pick; already loading on the live site |
| Body | Cabinet Grotesk | Arif's pick; sourced from `api.fontshare.com` (probed 200). Was a phantom before. |
| Mono | JetBrains Mono | Arif's pick; already loading |
| Primary CTA | one — `Explore arifOS →` → `/sanctuary` | Arif's "satu primary CTA sahaja"; second action demoted to text link |

## Rendered result (playwright, chromium-1248)

| Width | h-overflow | buttons wrapped | real families | doc height |
|---|---|---|---|---|
| 390 | 0 | 0 | 3 | 8,027 px |
| 768 | 0 | 0 | 3 | 7,163 px |
| 1440 | 0 | 0 | 3 | 7,270 px |

HTTP: zero failed requests. `<img>` count: 0, so alt-text is N/A.

## Checklist against the rulebook

| Item | Result |
|---|---|
| One primary button, repeated at 1 and 12, same destination | PASS |
| H1 names outcome + audience | PASS — "Governed intelligence for humans, agents and organisations" |
| Three objections answered | PASS — §08/09/10 |
| FAQ as real questions | PASS — 7 entries |
| Zero raw hex outside one token layer | **PARTIAL** — page-level `:root` override block exists for the v1.1 type/accent decision; it is one block, not scattered |
| One display / one UI / one mono | PASS — 3 measured |
| Branded 404 | **FAIL** — not rebuilt; site 404 still bare |
| Privacy + Terms in footer | PASS |

## Claims on the page, and what backs each

- "6 organs answering health" — OBS: probed `:8088 :7071 :8081 :18082 :18083 :3001`, all 200, 2026-10-28.
- "13 constitutional floors" — F1–F13, doctrine.
- "4 verdict classes" — SEAL / HOLD / SABAR / VOID.
- Kabarkan is described as "the telemetry plane". It is live on `:18902` but
  **degraded** (`postgres_healthy: false`). The page makes no liveness claim
  about it — deliberate.
- No testimonial, metric, or client count was invented anywhere on the page.

## Blocked at gate: human decision (not mine)

1. **Colour** — A (copper) confirmed or B (blue). Prototype ships A; B is a three-value swap.
2. **Type supersession** — Fraunces / Cabinet Grotesk / JetBrains Mono replace
   DM Serif Display / IBM Plex Sans / IBM Plex Mono in `tokens.css`. That file is
   **sealed v1.0 · F13: ARIF**. Bumping it to v1.1 is an F13 act.
3. **Deploy** — swap `Home.tsx` for this structure, `npm run build`, `make deploy`.
   Public surface. Nothing has been published.
