# Functional Color Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the real gaps in arif-fazil.com's functional color system: AA contrast failures, the unused blue token, and raw-hex bypasses on `/arifos` — no redesign.

**Architecture:** All edits are token-level in the three design-system token copies plus one CSS rule in `/arifos/index.html`. Deliverables: AA-passing state tokens, blue wired as agent-flow color, one audit report, release evidence. No Caddy reload, no deploy.

**Tech Stack:** Plain CSS custom properties, static HTML, Python (contrast computation), npm/Vite build, `make verify-pages`.

**Spec:** `/root/worktrees/kimi-code/arif-fazil.com/docs/superpowers/specs/2026-11-21-functional-color-audit-design.md` (approved; blue decision: wire on /arifos only)

## Global Constraints

- Work ONLY in lane `/root/worktrees/kimi-code/arif-fazil.com` on branch `kimi-code/functional-color-audit`. Primary tree is dirty with another lane's 2 files — never touch it.
- Never run `make deploy`, `make reload`, or anything that reloads Caddy (T3 HOLD per repo AGENTS.md).
- Source of truth: `sites/shared/design-system/tokens.css`. The site copy `sites/arif-fazil.com/public/_shared/design-system/tokens.css` and organ copy `sites/arif-fazil.com/public/arifos/_shared/design-system/tokens.css` have NO auto-sync (they already differ) — every token edit names all files it touches explicitly.
- Semantic mapping conflicts are FINDINGS to report, never silently resolved (only Arif decides which mapping wins).
- Report-only items get fixed only when already inside a file being edited for another approved reason.
- Contrast rule (WCAG 2.1 AA): ≥4.5:1 for normal text, ≥3:1 for large text (≥24px or ≥18.66px bold) and UI indicators. Badge pairs (colored bg + text) are checked as their own pairs.

## Review Focus

1. **Organ alias inversion:** on `/arifos`, `--state-*` resolve through `public/arifos/_shared/.../tokens.css` aliases (`--state-operational: var(--color-verdict-seal)`), so a shared-file value fix is a silent no-op on that page unless the organ copy is edited too. Test: Task 1 Step 5 greps all three files for the new hex.
2. **Badge pairs are not accent-on-dark:** verdict badges use colored background + black/white text; their contrast pairing differs from accent-as-text and must be computed separately. Test: Task 1 script includes badge pairs.
3. **`--color-verdict-void` semantic conflict:** shared maps VOID→grey `#616161`; organ maps verdict-void→red `#E5484D`. Report only — flipping either silently changes verdict meaning. Test: Task 3 report names the conflict with both file:line references.
4. **Build-noise flooding the scan:** raw-hex sweep must exclude `dist/`, `.bak*`, `backups/`, `node_modules/`, `_quarantine/` or the report drowns. Test: Task 3 Step 1 command shows the exclusion flags and the report lists < 30 findings.
5. **JS-driven `status--live`:** if the page JS assigns `status--live` to `#flow-health-value`, blue appears in the observatory field too — intended, but must be verified as rendered behavior, not assumed. Test: Task 2 Step 4 checks the built output and the JS assignment sites.

---

### Task 1: Contrast audit + token-level AA fixes

**Files:**
- Create: `scripts/color-contrast-audit.py` (lane-local one-off audit script)
- Modify: `sites/shared/design-system/tokens.css` (lines with `--state-danger`, `--state-void`)
- Modify: `sites/arif-fazil.com/public/_shared/design-system/tokens.css` (same two tokens — grep for exact lines first; they differ from canonical today)
- Modify: `sites/arif-fazil.com/public/arifos/_shared/design-system/tokens.css` (verdict palette values that fail the script, per rule below)
- Create: `docs/agentic-web/COLOR-AUDIT-2026-11-21.md` (contrast section seeded; Task 3 appends the consistency section)

**Interfaces:**
- Produces: `scripts/color-contrast-audit.py` — runnable with `python3 scripts/color-contrast-audit.py`, exits 0 when every consumed-as-text accent passes its threshold, 1 otherwise. Task 4 re-runs it as the final gate.

- [ ] **Step 1: Write `scripts/color-contrast-audit.py`**

Script computes WCAG 2.1 relative-luminance contrast and prints a table `token | hex | background | ratio | threshold | PASS/FAIL`. It reads the hex values directly from the three token files (parse `--state-*` from the two shared copies, `--color-verdict-*` from the organ copy) so it can never drift from the files. Backgrounds: `#0A0B0D` (homepage/site), `#1A0A0A` (soul), `#12121A` (organ). Threshold per token: text-consumed accents 4.5; report `soul-primary #8B1A1A` and `soul-secondary` as brand/decorative with threshold "REPORT" (no pass/fail exit effect). Include badge pairs hardcoded from tokens.css: `#000 on #00C853`, `#000 on #FFD600`, `#000 on #FF9500`, `#fff on #D50000` (update the danger pair to the new value after Step 3), `var text on #616161` → replace with new void value pair after Step 3. Exit 1 if any 4.5/3.0-threshold row fails.

- [ ] **Step 2: Run baseline audit**

Run: `python3 scripts/color-contrast-audit.py`
Expected output includes these known fails: `--state-danger #D50000 → 3.59:1 FAIL (4.5)` and `--state-void #616161 → 3.18:1 FAIL (4.5)`; organ copy verdict rows print whatever they print — record them, do not edit yet.

- [ ] **Step 3: Apply the two pinned shared-token fixes**

In BOTH `sites/shared/design-system/tokens.css` and `sites/arif-fazil.com/public/_shared/design-system/tokens.css`:
- `--state-danger: #D50000` → `#FF1744` (pre-computed 5.12:1 on `#0A0B0D`, 5.00:1 on `#1A0A0A`)
- `--state-void: #616161` → `#9CA3AF` (pre-computed 7.76:1 / 7.58:1)
Keep each token's original comment; append `/* AA fix 2026-11-21, was #D50000 3.59:1 */` style note.

- [ ] **Step 4: Fix organ verdict values that fail**

Rule (pinned so the implementer decides nothing): for any `--color-verdict-*` row the baseline script shows FAIL at 4.5, replace with the closest-hue AA-passing value from this table — reds: `#FF1744` (5.12/5.00) or `#F43F5E` (5.36/5.24); greys: `#9CA3AF` (7.76/7.58) or `#8E959E` (6.51/6.36); ambers/oranges: pick the nearest hue ≥4.5 by computing in-script (the script prints candidate suggestions for hues not in the table). If a value passes, leave it — including `#E5484D` (already 5.03/4.91). Do NOT touch the `--state-*` alias lines in the organ file.

- [ ] **Step 5: Verify fixes landed in all three files**

Run: `grep -rn "FF1744\|9CA3AF" sites/shared/design-system/tokens.css sites/arif-fazil.com/public/_shared/design-system/tokens.css sites/arif-fazil.com/public/arifos/_shared/design-system/tokens.css`
Expected: `#FF1744` present in the two shared copies; organ file only if Step 4 required a red/grey change. `#D50000` and `#616161` gone from `--state-*` lines.

- [ ] **Step 6: Re-run audit green**

Run: `python3 scripts/color-contrast-audit.py`
Expected: exit 0; no FAIL rows at 4.5 threshold; badge pairs pass (black on green/amber/orange all >7:1; white on `#FF1744` = compute-and-print, if <4.5 switch badge-breach text to `#000` — its bg is bright enough, note it in the audit doc).

- [ ] **Step 7: Commit**

```bash
git add scripts/color-contrast-audit.py docs/agentic-web/COLOR-AUDIT-2026-11-21.md sites/shared/design-system/tokens.css sites/arif-fazil.com/public/_shared/design-system/tokens.css sites/arif-fazil.com/public/arifos/_shared/design-system/tokens.css
git commit -m "fix(tokens): AA contrast — danger #D50000→#FF1744, void #616161→#9CA3AF + organ verdict fixes"
```

### Task 2: Wire blue as agent-flow color on /arifos

**Files:**
- Modify: `sites/arif-fazil.com/public/arifos/index.html:72` (the `html[data-organ="arifos"] .status--live` rule)

**Interfaces:**
- Consumes: `--state-info #58A6FF` (defined in shared tokens, unchanged by this plan)
- Produces: `.status--live` renders blue; used by static phase-table rows (`P1-5`, `P1-6` "CANARY LIVE") and anywhere JS assigns the class.

- [ ] **Step 1: Check JS assignment sites first**

Run: `grep -n "status--live\|classList" sites/arif-fazil.com/public/arifos/index.html | head`
Record which JS paths assign `status--live` (e.g. flow-health polling). If none, the change affects only the static rows — say so in the audit doc.

- [ ] **Step 2: Edit the rule**

Replace the `html[data-organ="arifos"] .status--live{background:rgba(56,204,132,.12);color:#38cc84}` rule with the same shape in blue:
`html[data-organ="arifos"] .status--live{background:rgba(88,166,255,.12);color:var(--state-info)}` — with a trailing comment `/* agent operational flow — blue per design 2026-11-21 */`.
Leave `.status--healthy` (SEALED badges) green — untouched.

- [ ] **Step 3: Verify the edit and blue consumption count**

Run: `grep -c "state-info" sites/arif-fazil.com/public/arifos/index.html`
Expected: `1` (was 0 — blue now consumed).
Run: `grep -n "38cc84" sites/arif-fazil.com/public/arifos/index.html`
Expected: no output.

- [ ] **Step 4: Build and check rendered output**

Run: `cd sites/arif-fazil.com && npm run build 2>&1 | tail -3`
Expected: build completes. Then: `grep -o "state-info" dist/arifos/index.html | head -1` (expected: one match — the rule survived Vite into dist).

- [ ] **Step 5: Commit**

```bash
git add sites/arif-fazil.com/public/arifos/index.html
git commit -m "feat(arifos): wire --state-info blue as agent-flow status--live color"
```

### Task 3: Consistency scan + audit report

**Files:**
- Modify: `docs/agentic-web/COLOR-AUDIT-2026-11-21.md` (append to Task 1's contrast section)

**Interfaces:**
- Consumes: Task 1's contrast table, Task 2's blue change.

- [ ] **Step 1: Raw-hex accent sweep (report-only)**

Run (exclusions pinned to avoid build noise):
`grep -rnoE "#(38cc84|3DDC97|D50000|00C853|FFD600|FF9500|58A6FF|D4AF37|8B1A1A)" sites/arif-fazil.com/public --include="*.html" --include="*.css" | grep -vE "\.bak|dist/" | head -30`
Categorize each hit: `fixed-already` (the `.status--live` line, if still listed pre-build), `bypass` (raw hex where a token exists), `token-definition` (inside a tokens.css — fine).

- [ ] **Step 2: Write the consistency section**

The report lists: (a) every `bypass` hit with file:line; (b) the `--color-verdict-*` vs `--state-*` namespace divergence (organ file aliases state tokens to verdict palette — file:line); (c) the VOID mapping conflict (shared grey `#616161→#9CA3AF` vs organ red `#E5484D`) flagged **for Arif's decision, not resolved**; (d) `soul-primary #8B1A1A` at 2.07–2.12:1 flagged as brand-decorative below 3:1 — recommendation (lighten or restrict to ≥24px large text), no change made; (e) the blue wiring summary.

- [ ] **Step 3: Commit**

```bash
git add docs/agentic-web/COLOR-AUDIT-2026-11-21.md
git commit -m "docs: color consistency audit report 2026-11-21"
```

### Task 4: Gates + release evidence

**Files:**
- Create: `docs/agentic-web/RELEASE-EVIDENCE-2026-11-21-functional-color.yaml` (filled copy of `docs/agentic-web/RELEASE-EVIDENCE-TEMPLATE.yaml`)

**Interfaces:**
- Consumes: `scripts/color-contrast-audit.py` (exit 0 required), `make verify-pages`.

- [ ] **Step 1: Run the deploy gate**

Run: `make verify-pages`
Expected: every `dist/*/index.html` HTTP 200. If it fails → fix routing first (per repo AGENTS.md), do not proceed.

- [ ] **Step 2: Final audit re-run**

Run: `python3 scripts/color-contrast-audit.py`
Expected: exit 0.

- [ ] **Step 3: Fill release evidence record**

Copy the template fields: what changed (3 token files + 1 CSS rule), gates run with outcomes, what was NOT done (no deploy, no Caddy reload, deploy is a separate 888 decision), findings escalated (VOID conflict, soul-red). Do not self-SEAL — leave the seal field empty for review.

- [ ] **Step 4: Commit + lane state**

```bash
git add docs/agentic-web/RELEASE-EVIDENCE-2026-11-21-functional-color.yaml
git commit -m "docs: release evidence — functional color audit 2026-11-21"
git log --oneline origin/main..HEAD
```
Report lane state (branch, ahead count, clean tree) in the completion message.
