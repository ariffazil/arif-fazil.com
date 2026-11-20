# Functional Color Audit — arif-fazil.com (short design)

Date: 2026-11-21 · Lane: `kimi-code/functional-color-audit` · Size: small change
Status: APPROVED by Arif (blue decision: wire on /arifos only)

## Intent & why

A tutorial summary proposed "dark #121212 + red/blue/yellow functional accents" for
arif-fazil.com. Probing showed the proposal is ~90% already implemented in the live
token system; this work closes only the real gaps — no redesign.

## Findings (OBS, probed 2026-11-21)

- Source of truth: `sites/shared/design-system/tokens.css` (690 lines). `public/` and
  `dist/` copies are build/sync outputs — never edit them directly.
- Red = critical: EXISTS — `--state-danger #D50000` (badge-breach) + soul blood-red
  family (32+ uses).
- Yellow = attention: EXISTS — `--state-pending #FFD600` (SABAR), `--state-hold
  #FF9500` (888_HOLD), soul gold `#D4AF37`; badges consume them (24 uses).
- Green = SEAL verdict: EXISTS — `--state-operational #00C853` (badge-seal, 8 uses).
  Stays as-is.
- **Blue gap:** `--state-info #58A6FF` is defined, consumed 0 times.
- Live base surfaces: homepage `#0A0B0D`; soul ring `#1A0A0A`.

## Decision (Arif's call)

Blue = **agent operational flow**, wired only into `/arifos` surfaces that already
display agent/MCP activity (`/arifos/`, `/arifos/findings/F-00x`, `/constitution/`).
Green remains the SEAL-verdict color. No new surfaces invented to host a color.

## Work

1. Consistency scan: raw-hex accents bypassing tokens on live pages → report each.
2. WCAG AA contrast: every functional accent on its actual background; fix failures
   at token level only.
3. Wire blue: token usage on existing /arifos agent-activity elements only.
4. Gate: `make verify-pages` must pass; release evidence record produced. No Caddy
   reload, no full `make deploy`.

## Non-goals

No palette redesign · no new pages/tokens · mind/body/organ rings untouched ·
no Caddy/DNS/secret changes.

## Approaches considered

1. **Functional color audit (chosen)** — close real gaps in the existing system.
2. Build a new section via tutorial workflow — rejected: site already exceeds the
   tutorial's endpoint; nothing new was wanted.
3. Full #121212 redesign — rejected: discards a coherent live system (SOUL/MIND/
   BODY/ORGAN + state tokens) to replicate what mostly exists.
