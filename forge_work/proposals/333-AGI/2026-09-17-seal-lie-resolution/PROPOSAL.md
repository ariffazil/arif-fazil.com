# PROPOSAL · SEAL_LIE Resolution (re-diagnosed)
**Agent:** 333-AGI Δ MIND (FI-001)
**Date:** 2026-09-17
**Mission:** Lebih Bijaksana / Lebih Arif / Penuh Clarity, Phase 4
**File authority:** PROPOSAL

---

## 1. Original finding (witness audit 2026-08-24 + my re-probe 2026-09-17)

`worldIntelData.ts` lines 70, 94 and `CommodityPage.tsx` line 41 carry **hardcoded** values:
- Brent: `$85.48` (CommodityPage: `$88.52`) — live $104.88
- Gold: `$2,425.80` — live $4,326.70 (bundle) / $4,370 (Yahoo)
- Gas: hardcoded in NG=F via bundle but not in source TS

The bundle `dist/assets/index-SZyhdU8S.js` had `0` `status:'SEAL'` strings (already scrubbed) but still carries the hardcoded numbers. Drift ranges −18% to −45%.

## 2. Re-diagnosis: live data IS being served correctly via static JSON-LD

`/var/www/html/{oil,gas,gold}/index.html` contains a live-resealed `<script id="wealth-reality-packet" type="application/ld+json">` with current observed prices:

```
{
  "@type": "CapitalContext",
  "observed_at": "2026-09-17T08:07:03.399Z",
  "asset": "BRENT_CRUDE_OIL",
  "epistemic_tier": "OBS",
  "price_usd": 104.88,
  "ticker": {"symbol": "XBRENT", "price": 104.88, "rsi": 42.3, ...},
  "resealed_at": "2026-09-17T08:07:03.449499+00:00",
  "reseal_source": "live_snapshot_api"
}
```

Same pattern for gold (live `$4326.70` observed 2026-09-17T08:07:07Z) and gas (live `$2.90` observed 2026-09-17T08:13:32Z).

The reseal script `scripts/reseal-commodity-packets.py` runs on a schedule and injects fresh data into the static HTML. The witness was looking at the wrong surface — they probed `/world/economics/oil/` which is the **SPA path**, not the static `/oil/` path.

## 3. The actual drift: SPA routing vs static routing

Two different paths serve the same content semantically:

| Path | Surface | Data freshness |
|---|---|---|
| `/oil/` | Static HTML with live JSON-LD packet | LIVE (~1h old via reseal cron) |
| `/world/economics/oil/` | SPA shell + `worldIntelData.ts` data | HARDCODED |

When a human types `/oil`, Caddy 308-redirects them to `/world/economics/oil/`. So **the lead human with the cleanest URL gets the stale data** while scrapers (who follow `<script>` JSON-LD) get the live data.

This is the **opposite** of human-first. The 308 redirect is anti-human.

## 4. Root cause

`/oil/` is a separate static page built by `reseal-commodity-packets.py`. `/world/economics/oil/` is a route inside the React SPA. The 308 redirect from `/oil` → `/world/economics/oil/` was added in a prior iteration, presumably to consolidate content under one URL. But it routes humans AWAY from the live-data version.

## 5. Three fix options

| Option | Effort | Risk | Outcome |
|---|---|---|---|
| **A. Drop the 308. Keep `/oil` → `/oil/` static (live).** | Low (delete one Caddy rule) | Med (changes URL contract — sitemap files update) | Humans see live data via the apex URL |
| **B. Update SPA data layer to subscribe to live snapshot.** | High (modify SPA bundle) | Med (subscription lifecycle) | Both paths live; single source of truth is the live API |
| **C. Re-route `/world/economics/oil/` → `/oil/`.** | Med (Caddy rule + SPA route delete) | Med (SPA navigations break if any internal links) | SPA is bypassed for commodity pages |

**Recommended: Option A.** Lowest risk, smallest diff, immediately fixes the human-first violation. The 308 redirect was the mistake; removing it re-anchors humans on the live-data URL.

## 6. Additional fix needed (independent of A/B/C)

`sites/arif-fazil.com/src/data/worldIntelData.ts` and `CommodityPage.tsx` carry hand-curated prices that are *narrative anchors* — they're embedded in essay-style descriptions ("Brent crude benchmark directly influences PETRONAS dividend contributions to Putrajaya"). They're not just stale prices; they're author-curated context.

Two paths:
- **Update the values** to match current market (high risk of drift, low value — the narrative is editorial)
- **Add `price_last_updated` and `price_observed_source` fields** next to each value, so the reader sees "Brent: $85.48 (composed 2026-09-XX; live via /oil)" — the human-first disclosure

**Recommended:** Path B. Surface the staleness honestly.

## 7. Required actions

1. **CANON files:** `canon/sites.yaml` and/or `canon/redirects.yaml` — declare the routing decision (Option A/B/C). Lease required.
2. **DERIVED files:** `worldIntelData.ts` + `CommodityPage.tsx` (under `sites/arif-fazil.com/src/`) — these are source-of-truth for SPA. Owner is ARIF per file-authority.yaml context (src/* is CANON).
3. **Caddyfile:** the 308 redirect is at `/etc/caddy/Caddyfile`. CANON? Or runtime-only? Need to check.

## 8. Authority required

- Caddyfile changes = T3 HOLD per AGENTS.md
- src/*.ts changes = CANON, ARIF or A-FORGE lease required
- Both need sovereign authorization

## 9. Reversibility

100%. All paths are reversible via git revert + Caddy reload (when authorized).

---

**Status:** PROPOSAL — awaiting sovereign decision on Option A vs B vs C.
**ΔS ≤ 0:** The fix removes a constitutional-violation / "anti-human-first" routing pattern.
**DITEMPA BUKAN DIBERI ⚒️**