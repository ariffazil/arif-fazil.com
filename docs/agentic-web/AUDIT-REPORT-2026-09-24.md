# arif-fazil.com — Site Audit & Next-Steps Proposal

**Date:** 2026-09-24 14:00 MYT
**Auditor:** kimi-code (FI-008, warga-aaa)
**Scope:** Main domain routes, hybrid SPA/static shells, internal links, machine manifests, mobile rendering, asset heft, webroot hygiene, prior-audit issue recheck (AUDIT-REPORT-2026-09-22.md)
**Method:** verify-pages gate · web_zen doctor + orphan · Playwright (desktop + iPhone) · full sitemap link crawl · curl probes · AI-vision screenshot review

---

## Executive Summary

| Metric | Value |
|---|---|
| Pages via gate (`make verify-pages`) | **239 PASS** (8 intentional exclusions) |
| web_zen doctor | **ALL GREEN** |
| web_zen orphan (dist vs webroot) | **0 stale files** |
| Hybrid #root duplication bug class | **Only /words/ (FIXED today); no other route affected** |
| Internal links (sitemap crawl) | 149 unique → 142 OK (95.3%) |
| Mobile (iPhone 390px: /, /words/, /earth) | **No horizontal overflow, 0 console errors** |
| Machine manifests | llms.txt, agent.json, webmcp.json, sitemap.xml, robots.txt, floors.json — all 200 |
| Asset caching | Hashed assets `immutable` 1y ✅ |
| Issues (new + carried) | 14 (0×P0, 0×P1-functional, 6×P2, 6×P3, 2×INFO) |

**Verdict: HEALTHY.** No functional P0/P1. Findings cluster into performance (heavy raster assets, monolithic JS), link/doc consistency, and webroot hygiene.

---

## Issues

### Carried from AUDIT-REPORT-2026-09-22 (rechecked today)

| # | Issue | Sev | Status today |
|---|---|---|---|
| C1 | `/_shared/og-default.png` 404 | P2 | ❌ still open |
| C2 | `wellness.arif-fazil.com/health` 421 (Cloudflare/proxy) | P2 | ❌ still open — F13-class (DNS/CF) |
| C3 | SPA routes missing OG tags (/earth, /klci/, /usdmyr/, /politics/*) | P2 | ❌ still open — words shell shows the pattern to copy |
| C4 | `makcikgpt.arif-fazil.com` 404 (content lives at /world/makcikgpt/) | P3 | ❌ still open — F13-class (DNS/vhost decision) |
| C5 | chron root API-only | P3 | by design — informational |
| C6 | ard.json ≡ ai-catalog.json identical | P3 | informational |

### New findings (2026-09-24)

| # | Issue | Sev | Evidence |
|---|---|---|---|
| N1 | `/status.json` 404 while documented as a discovery file in BOTH AGENTS.md copies (repo public/ + webroot) | P2 | `curl 404`; AGENTS.md "Discovery Files" table |
| N2 | `/receipts/` 404, linked from live page `/world/2027/receipts/` | P2 | link crawl |
| N3 | Heavy raster assets: `favicon.png` **1.4MB** (every pageview), `arifos-logo.png` 1.6MB, `body-mind-soul-icon.png` 1.3MB, `seismic-amber.png` 3.3MB, `ledger-texture.png` 2.5MB, `newsprint-texture.png` 1.7MB | P2-perf | `find +300k` |
| N4 | Monolithic SPA bundle `index-*.js` **2.3MB**, no per-route code splitting | P2-perf | webroot/assets |
| N5 | `geox.arif-fazil.com/basins/kinabalu/` 404 while `/geox/basins/kinabalu/` exists on main domain (cross-vhost path mismatch) | P3 | link crawl + webroot ls |
| N6 | Legacy duplication `/words/essays/` (byte-identical assets to `/essays/`, e.g. binatang-paradox-proof-1.png 2.2MB ×2; zero live references) | P3 | md5 match; only a .bak references it |
| N7 | Stale `.bak` files inside served webroot (`sitemap.xml.bak-20260920`, `usdmyr/index.html.bak-*`, `vitals/*.bak`, `.well-known/did.json.bak.*`, `_shared/unified-header.html.bak-*`, `words/index.html.bak-pre-hero-*`) + `*.bak.*` dirs at `/var/www/html/` level | P3 | find |
| N8 | Two external font stacks loaded simultaneously: Google Fonts (223 refs) + Fontshare (54 refs) | P3 | crawl href hosts |
| N9 | Git working tree uncommitted: 21+ files (Words hero, #root fix, wiki category, copy-static-html.js allowlist) — recovery risk | P2-git | `git status` |
| N10 | `cdn-cgi/l/email-protection` hrefs observed in proxied HTML — **Cloudflare Email Obfuscation artifact, NOT a source bug** (source has mailto:; CF rewrites in flight). Watch: strict CSP must not block CF decode script. | INFO | crawl + grep (absent in source) |
| N11 | HTML responses carry no explicit `cache-control` (assets do) — acceptable with ETag; optional short max-age | INFO | curl -I |

---

## What's Next — prioritized proposal

### FASA 1 — cepat, satu sesi (kepercayaan + menang pantas)
1. **Commit working tree** (hero + #root fix + wiki + postbuild) — tutup risiko N9.
2. **Optimize favicon/logo/icons** (N3): favicon ≤32KB; logos/icons → compressed PNG/WebP. Jimat ~4MB pada setiap lawatan pertama.
3. **Letak `/_shared/og-default.png`** (C1) dan **cipta `/receipts/` hub atau ubah pautan** (N2).
4. **Selesaikan `/status.json`** (N1): pulihkan fail ATAU buang baris dari kedua AGENTS.md.

### FASA 2 — satu hingga dua sesi (prestasi + SEO)
5. Tekstur dekoratif → WebP/AVIF (N3 lanjutan; ~7MB lagi).
6. Code-split bundle: `React.lazy` per route (N4) — shell HTML kini 10KB tapi JS 2.3MB.
7. OG meta statik untuk setiap shell SPA (C3) — ikut corak head statik `words/index.html`.
8. Webroot hygiene (N6+N7): buang `/words/essays/` legasi + semua `.bak` **melalui `web_zen.py orphan` preview + commit** (peraturan AGENTS.md).

### FASA 3 — keputusan F13 (Arif sahaja — DNS/Caddy/kanon)
9. Font: konsolidasi satu stack / self-host (N8).
10. `wellness/health` 421 (C2) & subdomain `makcikgpt` (C4) — Cloudflare/Caddy.
11. `geox` subdomain basins routing (N5) — selarikan vhost atau ubah pautan ke domain utama.
12. ard.json vs ai-catalog.json (C6) — bezakan kandungan atau bersatu secara rasmi.

---

## Receipts

- verify-pages PASS: this session (make verify-pages, 239 pages)
- doctor GREEN: `/root/forge_work/2026-09-24/web-zen/web-zen-doctor-2026-09-24T053019Z.json`
- orphan 0: `/root/forge_work/2026-09-24/web-zen/web-zen-orphan-2026-09-24T055011Z.json`
- #root fix evidence: `release-evidence/2026-09-24-words-atlas-compass/` (05_words_live_hero_FIXED_single.png + release-evidence.yaml)

*REALITY > EVERYTHING · DITEMPA BUKAN DIBERI*
