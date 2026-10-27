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
