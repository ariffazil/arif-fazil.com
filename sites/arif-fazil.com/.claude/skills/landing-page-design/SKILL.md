---
name: landing-page-design
description: Use when building or revising any landing page on arif-fazil.com — hero, section order, copy discipline, locked visual values, and the shipping checklist that decides when a page is actually done.
---

# landing-page-design — arif-fazil.com

One job: a page that a stranger can understand in 30 seconds, that follows one
locked look, and that passes the shipping checklist before it goes live.

Derived from PRIMER-1 (`/root/web-canon/canon/design-tokens.json`, ratified by
F13 2026-08-01) plus the values actually live on the homepage as of 2026-10-28.
Where the two disagree, §B names the drift — it does not silently pick a winner.

Brand colour and typeface changes are F13 decisions. This skill enforces what is
ratified; it does not re-decide it.

---

## PART A — STRATEGY

### A1. Intake (ask in ONE batch, never drip-feed)

1. The one action — the single thing a visitor does (book a call, read a well
   record, email). One page, one button.
2. The offer — what it is, for whom, in one sentence.
3. The buyer — role, not demographic.
4. Top three objections — in their words, e.g. "I tried a coach before and it
   didn't work". Not "price sensitivity".
5. Traffic source — where visitors arrive from, so the headline matches the
   link they clicked.
6. Proof — one number or quote that can be defended.

If Arif cannot answer one, assume and say so in one line. Do not stall.

### A2. Fixed section order (same order, every page)

| # | Section | Job |
|---|---|---|
| 1 | Hero | Outcome + audience in the headline. One primary CTA, one secondary. |
| 2 | Evidence strip | 3–4 hard numbers (years, wells, records). Real, sourced. |
| 3 | The work | Named artefacts (wells, basins, systems). Each links to evidence. |
| 4 | Proof over assertion | 3 cards: what can be inspected, what is interpretation, what is UNKNOWN. |
| 5 | How it works | 3 steps maximum. |
| 6 | Doors | One row per audience: institutions / agents / verification. |
| 7 | Objections | The three objections from A1, answered plainly. |
| 8 | Quote | One attributed sentence. No stock portraits. |
| 9 | Guarantee | What he will not claim, stated as a limit, not a promise. |
| 10 | Final CTA | Identical label to the hero CTA. Same two buttons, same order. |
| 11 | Footer | Canon links, privacy, terms, machine surfaces, copyright year. |
| 12 | 404 + machine surfaces | Branded 404, `llms.txt`, `surfaces.json` still reachable. |

### A3. Copy rules (non-negotiable)

- One offer, one audience, one primary button per page.
- Ban: streamline, leverage, unlock, robust, seamless, cutting-edge, world-class,
  passionate, ninja, revolutionise. `design-lint.sh` already blocks agent chrome;
  this list is the human-side twin.
- Numbers replace adjectives. "Cut weekly reporting from 4 hours to 15 minutes",
  not "save time". Every number carries a source or a date or it is an ESTIMATE.
- Epistemic labels where a claim could be read as fact: OBS · DER · INT · SPEC ·
  UNKNOWN. A page that cannot label a claim has not finished thinking.
- Say the limit. "I refuse fake certainty" beats "I deliver certainty".
- BM-English rojak is allowed in the human register; keep the same voice the
  homepage already uses (`Ditempa bukan diberi`).
- Never claim a capability the repo cannot demonstrate. Link the evidence.

### A4. Headline formulas (pick one, then commit)

- `{Outcome} without {pain}`
- `The {category} for {audience}`
- `Get {result} in {time}`

Current live hero uses outcome + role: "I turn uncertain Earth data into
defensible decisions — and build AI systems that stay bounded by evidence and
human authority." Keep that register.

---

## PART B — VISUAL SYSTEM (locked values, one place)

Change a value here and every page follows. Do not redefine these downstream.

### B1. Colour — hex, no invented hues

| Token | Hex | Use |
|---|---|---|
| `ember` | `#E4572E` | **The** action colour: primary CTA, live accent, focus |
| `ink` | `#EDEAE2` | Primary text on dark |
| `ink-soft` | `#9AA0A8` | Secondary text, labels, meta |
| `hairline` | `#1F2733` | Borders, rules, dividers |
| `canvas` | `#07090E` | Page background |
| `canvas-alt` | `#05070B` | Alternating section band |
| `panel` | `#10141D` | Cards, chips, inset surfaces |
| `band` | `#0A0D14` | Hero-adjacent band |
| `operational` | `#31C48D` | SEAL / live-status dot only |

Red-family rule (PRIMER-1): ember is the only warm accent on a human page.
Verdict red (`#B3362B` / `#7A1F18`) appears ONLY on verdict chips, the `/arif`
strip, and VOID states. If red is everywhere, it means nothing.

**Known drift — do not extend, flag to F13:**
`src/index.css` still carries `--accent: #b08d57` (a second, stale accent) used
by 7 call sites, while 214 call sites use `#E4572E`. One accent wins; the other
needs retiring in a single pass.

### B2. Type — one superfamily (IBM Plex)

| Voice | Family | Use |
|---|---|---|
| human | IBM Plex Sans | body, h2, h3, UI |
| doctrine | IBM Plex Serif | h1 on doctrinal/long-form pages |
| machine | IBM Plex Mono | labels, IDs, epistemic tags, code |

Scale ratio √2, base 16.8px, body line-height 1.5, title 1.15, measure 68ch.
Body text never below 14px.

**Known drift — pending F13, brand decision:**
Homepage loads and uses `Satoshi`, `Cabinet Grotesk`, `Fraunces`, `Newsreader`,
`JetBrains Mono`, `Inter` alongside IBM Plex (`src/index.css:84,93,100`;
`index.html` font link). Six families where canon allows one superfamily.
New pages use IBM Plex. Do not add a seventh family while this is open.

### B3. Spacing, radii, frame

- Unit 4px. Allowed steps: 4 · 8 · 16 · 32 · 64 (+ Tailwind 4 scale).
- Section rhythm: `py-16 md:py-20`; hero `py-16 md:py-24`.
- Frame: `max-w-[1360px]`, `px-4 sm:px-6`. Prose blocks cap at 68ch.
- Radii allowed: `2px` (machine), `8px` (default, `--radius`), `999px` (pill).
  Nothing else. No 4px, no 12px, no 16px on this site.
- Borders: 1px hairline. Dashed only for 888_HOLD.

### B4. Motion — one curve

- Reveal: `cubic-bezier(0.16, 1, 0.3, 1)`, 0.6s, translateY(24px) → 0.
- Hover/state: 0.2s ease.
- Nothing else animates except the live clock and the operational pulse. A fake
  "live" animation is a hantu (F9).
- `prefers-reduced-motion: reduce` must render the final state immediately, and
  content must never depend on an observer firing to become visible.
- Max one torus/globe motif per view.

---

## PART C — SHIPPING CHECKLIST

A page is done when every line is true. Not before.

**Strategy**
- [ ] One action, one primary CTA; final CTA label matches the hero exactly
- [ ] Headline names outcome AND audience
- [ ] Three objections answered in their own words
- [ ] Every number has a source or a date
- [ ] Claim labels present (OBS / DER / INT / SPEC / UNKNOWN)

**Visual**
- [ ] Only §B hex values; no new hue, no local palette
- [ ] IBM Plex superfamily only (unless drift is the ratified exception)
- [ ] Radii from `{2, 8, 999}` only
- [ ] One reveal curve; reduced-motion renders final state
- [ ] Content visible without JS (no opacity-0 that only an observer clears)
- [ ] Text contrast ≥ 4.5:1; large text ≥ 3:1
- [ ] No horizontal scroll at 375 / 768 / 1440
- [ ] Non-inline links ≥ 24×24 px (WCAG 2.2 AA 2.5.8); prose links exempt
- [ ] Visible focus ring on every interactive element

**Shipping**
- [ ] Unknown path returns HTTP **404** (not a 200 soft-404)
- [ ] Branded 404 page with a route home
- [ ] `<title>` and `<meta name="description">` written per page
- [ ] `og:image` present, 1200×630, returns 200
- [ ] Favicon present
- [ ] Every image has meaningful `alt` (empty `alt` only if decorative)
- [ ] Forms validate email inline, not after submit; labels not placeholders
- [ ] Privacy and terms reachable from the footer
- [ ] `llms.txt` + `surfaces.json` still accurate after the change
- [ ] Campaign page → `noindex`; evergreen offer → indexable with FAQ marked up
- [ ] Deployed and probed live: status code + rendered screenshot at 375 / 1440

---

## PART D — HOW TO RUN THIS SKILL

```
Follow my landing-page-design skill.
Run the intake first and ask every missing question in one batch.
Before any code, give me the page outline, hero copy, benefits, how it works and the FAQ.
Then build it section by section, starting with the hero. Do not rebuild sections that already pass.
```

Then verify with the browser gate (three widths, screenshot, read the screenshots),
fix the top three failures, and re-screenshot. Section-by-section edits only —
never a whole-page rebuild to change one part.

Verification command that already exists in this repo:

```bash
cd sites/arif-fazil.com && make -C /root/arif-fazil.com dry-run   # gates only, no mutation
```
