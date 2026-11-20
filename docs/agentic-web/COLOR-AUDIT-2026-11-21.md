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
| `--state-danger` | `#D50000` | 3.40:1 | `#FF1744` | 4.76:1* | `.badge-breach` text `#fff` → `#000` (3.85 → 5.46) |
| `--state-void` | `#616161` | 3.01:1 | `#9CA3AF` | 7.38:1* | `.badge-void` text `var(--text-primary)` → `#000` (2.33 → 8.27) |
| `--color-verdict-unknown` (arifos organ) | `#6B6C78` | 3.59:1 | `#8E959E` | 5.95:1 | — |

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

*(appended by Task 2)*

## 3. Consistency scan (see §4)

*(appended by Task 3)*
