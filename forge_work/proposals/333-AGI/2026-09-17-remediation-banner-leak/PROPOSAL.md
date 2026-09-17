# PROPOSAL · REMEDIATION Banner Leak on Human Surfaces
**Agent:** 333-AGI Δ MIND (FI-001)
**Date:** 2026-09-17
**Mission:** Lebih Bijaksana / Lebih Arif / Penuh Clarity, Phase 5 (attention-cost test)
**File authority:** PROPOSAL

---

## 1. Finding (CRITICAL — human-first violation)

The SPA bundle (`dist/assets/index-SZyhdU8S.js`) renders a **`REMEDIATION STATUS — WEALTH is operating under remediation controls`** banner as the **first visible content** on multiple human-plane paths:

| Path | Bytes | REMEDIATION banner? | Title |
|---|---|---|---|
| `/` | 9695 | YES (first content) | "Arif Fazil — Exploration Geoscientist & Sovereign Systems" |
| `/about` | 9695 | YES (first content) | same |
| `/economics` | 9695 | YES (first content) | same |
| `/world` | 9695 | YES (first content) | same |
| `/world/makcikgpt` | 9695 | YES (first content) | same |
| `/vitals` | 170080 | YES (in body) | "PETRONAS · VITALS" — real content but banner present |

Paths with REAL content and no banner leak: `/writing`, `/doctrine`, `/missions`, `/institution`, `/human`, `/000`, `/999`, `/pilot`.

## 2. Why this is critical

This violates three constitutional rules at once:

**RULE 1 — Human understanding > protocol exposure.** A newcomer to `/` reads "WEALTH is operating under remediation controls · Receipt-truth validation, governance evidence-fidelity gates..." before reading "Arif Fazil". Their 30-second test (per SITE_CONSTITUTION) **FAILS** because the first answer is to an agent-internal question, not to "who is this person."

**RULE 4 — Agent surfaces are secondary.** A remediation banner is an agent/system message about its own state. It belongs in:
- `aaa.arif-fazil.com/cockpit/health` (cockpit dashboard)
- `/api/public-state` `findings[]` (machine surface)
- arifOS sovereign inbox (governance)

NOT on `/` as the first pixel.

**RULE 5 — Every page must answer What/Why/Why should I care.** Currently `/` answers: "**What is broken**." Should answer: "**Who is Arif Fazil and why does this site exist.**"

## 3. Why it's there (likely intent)

The banner is probably intended as a **status disclosure** — telling the world that arifOS is being honest about its current state of partial remediation. This is *good intent* (honest UNKNOWN > papered-over success, per F2 TRUTH). But the placement is wrong: it should be on the **governance surface** (`/arifos/` or `/institution/`), not the **landing page**.

## 4. Two fixes

### Option A — Move the banner to the governance plane

Remove the banner from the SPA shell entirely. Add a "Federation Status" section to `/institution/` and `/arifos/` that contains the same honest disclosure, framed as governance transparency rather than landing-page alarm.

```
Landing /  → "Arif Fazil. Senior exploration geoscientist. arifOS built the system."
            Plus: small "Federation Status: WEALTH under remediation" link → /institution/status
```

**Effort:** ~1 day (SPA bundle rebuild + /institution/ content addition)
**Risk:** Med (touches the SPA bundle — must verify build integrity)
**Reversibility:** 100% via git revert + rebuild

### Option B — Soften the banner, keep it

Replace the headline-style banner with a small status indicator (e.g., dot in footer) that says "Federation live · WEALTH under remediation · last updated 2026-09-17." Don't promote it to first content.

**Effort:** ~30 min
**Risk:** Low (smaller diff)
**Reversibility:** 100%

**Recommended:** Option B for the immediate fix (lowest risk, addresses RULE 1+4 violation), then A as the structural long-term fix.

## 5. Required actions

1. **Locate banner source** in `sites/arif-fazil.com/src/` (likely a shared component or layout)
2. **Move/remove banner** per Option B
3. **Add footer status indicator** (small, honest)
4. **Add `/institution/status`** page (Option A, structural)
5. **Verify web_zen doctor passes**
6. **Build + verify-pages**

## 6. Authority required

- `src/components/*` or `src/data/*` modifications → CANON, ARIF or A-FORGE lease
- Build + deploy = T3 HOLD (Caddy reload)
- Caddyfile changes (if any) = T3 HOLD

## 7. Reversibility

100%. All paths reversible via git revert + Caddy reload.

## 8. Cost of NOT fixing

- Every landing-page visitor sees "this federation is broken" before "this is who I am"
- 30-second test fails on the most-trafficked paths
- Hardcoded "WEALTH under remediation" is itself a SEAL-like claim that could go stale (the witness audit showed prices did)
- Industry: every major agent-ready site test (NN/g, Lighthouse agentic-browsing v13.3+) flags this kind of front-page-status as AX friction

## 9. Open question

> Is the REMEDIATION status *currently true*? If yes, the disclosure is needed somewhere. If no, the banner is stale and should be removed entirely.

The banner content ("receipt-truth validation, governance evidence-fidelity gates, runtime capability verification, trade-plan freshness — corrected; commodity-lane validation, registry/runtime — still under remediation") reads like a real ongoing audit. Last-seen date unknown.

**Recommended action:** Add `last_reviewed_at: "2026-09-17"` to the banner so humans can judge staleness.

---

**Status:** PROPOSAL — awaiting sovereign decision on Option A vs B.
**Severity:** CRITICAL (this is the human-first violation called out by the SITE_CONSTITUTION itself).
**ΔS ≤ 0:** Fixing this **reduces** cognitive load on every landing-page visitor.
**DITEMPA BUKAN DIBERI ⚒️**