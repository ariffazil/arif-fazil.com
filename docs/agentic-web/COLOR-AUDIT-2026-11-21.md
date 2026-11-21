# Color Audit — 2026-11-21

Lane: `kimi-code/functional-color-audit` · Spec: `docs/superpowers/specs/2026-11-21-functional-color-audit-design.md` (approved)
Scope: functional color system only. No palette redesign, no new tokens.

## 1. Contrast audit (WCAG 2.1 AA)

Tool: `scripts/color-contrast-audit.py` (parses token values from the three design-system
files; 44 rows: 6 state tokens × 3 backgrounds, 6 organ verdict tokens × 3 backgrounds,
3 soul brand tokens (REPORT), 5 badge pairs).

### Baseline failures (fixed)

| Token | Was | Ratio (min) | Now | Ratio (min) | Also changed |
|---|---|---|---|---|---|
| `--state-danger` | `#D50000` | 3.40:1 | `#FF1744` | 4.84:1* | `.badge-breach` text `#fff` → `#000` (3.85 → 5.46) |
| `--state-void` | `#616161` | 3.01:1 | `#9CA3AF` | 7.34:1* | `.badge-void` text `var(--text-primary)` → `#000` (old-text-on-new-bg 2.33 → 8.27; the old-old pairing 5.69 was already passing) |
| `--color-verdict-unknown` (arifos organ) | `#6B6C78` | 3.59:1 | `#8E959E` | 6.16:1 | — |

\* min ratio across site/homepage `#0A0B0D`, soul `#1A0A0A`, organ `#12121A` backgrounds.
Ratios quoted are the worst case per token; all pass ≥4.5:1.

Final run: `python3 scripts/color-contrast-audit.py` → 44 rows examined, exit 0.

### REPORT (no change — brand/decorative, Arif's call)

- `--soul-primary #8B1A1A` — min **2.01:1**, below even the 3:1 large-text bar. Used 20×
  as the SOUL ring primary. Recommendation: restrict to ≥24px/large display use only, or
  lighten one step (candidate `#A32525` ≈ 3.2:1 — not applied; brand decision).
- `--soul-secondary #B33030` — min 3.00:1, large-text-only grade. Same treatment.

### Pre-existing conditions observed, unchanged (out of scope)

- arifos organ `.badge-breach` uses alpha-tint bg (`rgba(229,72,77,.25)`) + verdict-void
  text — alpha-blend pairing not modeled by this audit; untouched.
- `public/aaa/_shared/design-system/tokens.css` still carries the old `#D50000`/`#616161`
  values — the `/aaa` surface is outside this plan's approved file list.

## 2. Blue wiring — agent operational flow (see §3 of the spec; decision by Arif 2026-11-21)

- `html[data-organ="arifos"] .status--live` in `/arifos/index.html` was green raw hex
  (`#38cc84`) — now `color: var(--state-info)` `#58A6FF` + blue-tinted background
  `rgba(88,166,255,.12)`. Green `SEALED` badges (`.status--healthy`) untouched.
- JS check outcome: no JS in the page assigns `status--live` — blue applies to the static
  "CANARY LIVE" phase rows (P1-5, P1-6) only. The `#flow-health` observatory field keeps
  its `status--unknown` state; if JS later sets `status--live`, it inherits blue.
- `--state-info` consumption on the site: 0 → 1. Verified into `dist/arifos/index.html`
  (vite build in lane; full `prebuild` requires git-ignored data absent from lanes —
  see ledger ruling).

## 3. Consistency scan

Raw-hex sweep of `public/` (`*.html`, `*.css`, excl. `.bak*`, `dist/`): 50 rows →
**2 bypass clusters + 2 structural findings**.

### Bypass clusters (report-only — outside this plan's approved edit scope)

1. `public/vitals/_shell/article.css` — `#D4AF37` hardcoded 7× (minified line 1).
   Should reference `var(--soul-accent)`. Note: gold passes AA everywhere, so this is
   consistency debt, not an accessibility failure.
2. `public/wealth/index.html` — `#3DDC97` hardcoded 9×. This is the **arifos organ
   verdict-seal green** leaking into the WEALTH page raw. Namespace bleed: WEALTH's
   own accent system (BODY amber ring) is bypassed. Recommendation: swap to the
   intended token (likely `--state-operational` or wealth's ring color — WEALTH
   owner's call).

### Structural findings (for Arif's decision — not resolved)

3. **Namespace divergence:** the arifos organ token file
   (`public/arifos/_shared/design-system/tokens.css:71-91`) re-declares a verdict
   palette (`--color-verdict-*`) and aliases the shared `--state-*` names to it
   (`--state-operational: var(--color-verdict-seal)` at :87). Two palettes claim the
   same token names with different values; whichever file loads last wins per surface.
4. **VOID mapping conflict:** shared `--state-void` = grey, fail-closed
   (`#9CA3AF` after this audit; `sites/shared/design-system/tokens.css:85`) vs organ
   `--color-verdict-void` = red (`#E5484D`, organ tokens :74). Same verdict word,
   two colors. Pick one semantics — grey (shared law: fail-closed) or red (organ:
   attention) — and align the other.

### Stale SOT (governance finding)

5. `canon/file-authority.yaml:44` declares `public/_shared/design-system/tokens.css`
   as a `derived_output` of `canon/design-tokens.json` — but that JSON is a 2026-08
   PRIMER palette carrying **no** state/verdict token values, and no generator
   script exists in the repo. The declared derivation cannot reproduce the
   deployed file. Either re-sync the JSON or re-declare the CSS as the SOT —
   otherwise a future regeneration silently reverts the AA fixes from this audit.

### Additional bypass hits (review pass 2026-11-21, same day)

6. `public/work/proof/index.html:228` — raw `#38cc84` (the retired live-green).
7. `public/999/index.html:84` — raw `#38cc84`.
8. `public/_shared/design-system/components.css:528` and organ
   `public/arifos/_shared/design-system/components.css:512` — raw `#8B1A1A`
   (soul-primary as hex inside component CSS, adjacent to token definitions).
   Sweep exclusion gap noted: `public/.shell-wrap-backup-*/` directories leaked
   2 noise rows — the exclusion covered `.bak` filenames but not backup-class
   directories.

## 4. M1 sync debt — CLOSED 2026-11-21 (landed by qwen-code/FI-003 takeover)

Discovery: SOT `sites/shared/design-system/tokens.css:676-690` carries
`v2.1 · M1 RGBY SHELL ACCENTS` (`--accent-red #E05A4E · --accent-blue #7FB3FF ·
--accent-yellow #F2C879 · --accent-green #58C9A0`, AA on carbon, commit `12062f3f`,
2026-11-14) — but the served copy was last committed `4b5a2f2f` (2026-09-03) and every
live copy lacked the block. Live pages referencing `var(--accent-*,…)` rendered only
through per-page hardcoded fallbacks; the token layer was bypassed.

Fix: full-parity sync SOT → `sites/arif-fazil.com/public/_shared/design-system/tokens.css`
(M1 block + Task-1 AA fixes together), then additive rsync (`--update`, no `--delete`,
no Caddy reload) to both served apex-family copies:
`/var/www/html/arif/_shared/design-system/tokens.css` and `/var/www/html/_shared/design-system/tokens.css`.

### Token copy map after landing

| Family | sha256-8 (post-landing) | Paths | Status |
|---|---|---|---|
| apex design-system | `0449655c` | `/var/www/html/arif/_shared/design-system/`, `/var/www/html/_shared/design-system/` | SYNCED (M1 + AA) |
| organ namespace | `8fb03ff2` | arifos subdomain + `…/arif/arifos/_shared/design-system/` | DIVERGENT — separate reconciliation; repo copy now carries the AA unknown fix for its next deploy |
| aaa | `6d6ecd41` | aaa subdomain + `…/arif/aaa/_shared/design-system/` | DIVERGENT (2026-11-17) — own musyawarah before touch |
| legacy short path | `caf7b140` | `…/_shared/tokens.css` ×2 | legacy; reconcile-or-retire later |

`.bak.*` trees under `/var/www/html/` are backups — never edited, never deployed.

### Evidence

- Proposal (governance consensus record): `/root/forge_work/proposals/qwen-code-FI-003/m1-token-sync-debt/proposal.json`
- Authority: Arif F13 direct order 2026-11-21 "ambil alih, fix the M1 sync debt sekarang";
  peer-review seat collapsed (kimi lane ended, FI-002 session not live), sovereign order recorded.
- Origin-direct verification + `make verify-pages`: see receipts entry for this date.
