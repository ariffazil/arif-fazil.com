# RECEIPT — /vitals PETRONAS reality-align #2 (deep research + patch)
- **ts:** 2026-10-05 ~17:00 MYT · **agent:** kimi-code/FI-008
- **class:** DERIVED page patch (public/vitals/index.html) — no canon mutation, no Caddy reload, no routing change
- **trigger:** F13 sovereign directive "deep research to align this site with current reality"
- **backups:**
  - repo: `public/vitals/index.html.bak-20261005-reality-align`
  - serving: `/var/www/html/.arif-backup-20261005-165845-reality-align/index.html`
- **deploy path (T3-safe):** edit public (canonical) → cp to dist → cp to /var/www/html/arif/vitals/ (chown www-data) → `make verify-pages` → live-byte curl. deploy-site.sh --apply NOT used (reloads Caddy — AGENTS.md rule 7).

## Deep-research verification (primary sources, all OBS)
| Site claim | Primary source | Verdict |
|---|---|---|
| RM48B dividen FY2026 (BIMB) | BIMB Securities Budget-2027 preview via Utusan (3 Okt), BH/FMT/Edge (2 Okt) | ✓ real, conditional Brent US$95 |
| Baseline RM20B (Budget 2026) | Dividen diisytihar 26 Feb 2026; Belanjawan 2026 unjuran RM20B (turun dari RM32B/2025) | ✓ |
| Delta +RM28B (+140%) | 20→48 | ✓ math |
| 105.7% vs PAT FY2025 | PAT FY2025 RM45.4B (FRA FY2025) | ✓ 48/45.39 |
| Belanjawan 2027: 9 Okt 2026 | Parlimen portal + Awani + MOF | ✓ |
| Tunai RM193.6B @30 Jun 2026 | Interim FRA 1H26 balance sheet: RM193,635M (Dis 2025: RM204,375M) | ✓ exact |
| Hutang RM126.8B; gearing 21.2% | Interim FRA: RM126,781M; 21.2% | ✓ exact |
| Brent purata US$92.31 (1H26) | FRA 1H26 Highlights (1H25: US$71.87) | ✓ exact |
| Tangki 9.35/8.64/7.92 | IR2023: 9.35 @1 Jan 2024 · IR2024: 8.64 @1 Jan 2025 (-8%) · IR2025: 7.92 @1 Jan 2026 (-8%) | ✓ exact numbers; as-at dates were only in deep layer |
| RM8B dibayar daripada RM20B | Interim FRA Note A5 | ✓ |
| Downstream -RM15.2B / PRefChem RM14.8B / ex-capture +RM7.0B | Interim FRA | ✓ exact |

## Deltas fixed (8 surgical edits, BM voice preserved)
1. Tangki hero card: "Turun dari 9.35. Tahun depan kosong." → "Posisi 1 Jan 2026. Turun dari 9.35." (as-at tag; PETRONAS does not print mid-year reserves)
2. Carta subtitle: "2024 ke 2026. Tahun depan belum dicetak." → "Posisi setiap 1 Januari. 2027 belum dicetak."
3. "Akaun penuh seterusnya, sekitar Februari 2027, yang akan jawab." → wallet vs tank split: duit = Feb 2027 FRA; tong = pertengahan 2027 (posisi 1 Jan 2027, IR2026)
4. Timeline #jalan: tambah "Pertengahan 2027 — semakan tong (posisi 1 Jan 2027)"
5. Alert: tambah laluan BIMB RM32B (2027) / RM25B (2028) pada Brent US$85/75 — puncak bukan penara; Brent spot ~US$102.30 (2 Okt) atas andaian US$95; amaran picitan belanja huluan/infra gas
6. Alert title: "+ disemak 5 Oktober"
7. JSON-LD: dateModified → 2026-10-05; description kini bawa as-at dates + next reserves print
8. Addendum comment block: lineage untuk realign #2 (sumber primer tersenarai)

## Gates & evidence
- `make verify-pages`: PASS — 210 pages reachable (1 pre-existing 301 /.well-known/mcp/server.json, unrelated)
- live-byte curl: 6/6 new strings present, 2/2 old strings absent, og:image unchanged (og-identity.png)
- md5 parity: public = dist = serving = 69e419e3521eff78729e8220d3284c35
- og:image og-identity.png (disemak hidup sebelum patch) — dist dahulu stale kini selari
- NOT done: full `make deploy` / deploy-site.sh --apply (Caddy reload = T3 HOLD). Next scheduled build will pick public/ unchanged.

## VISUAL PASS (same file, 2026-10-05 ~17:19 MYT) — sovereign directive "apply"
- **backups:** repo `index.html.bak-20261005-visual-pass` · serving `/var/www/html/.arif-backup-20261005-171813-visual-pass/`
- **edits (6 ops):** alert fakta/konteks dipecah (dashed divider, 11px footnote) · nombor payload clamp(1.9→2.4rem) · chip −RM10.8B sejak Dis 2025 · carta label ±% (+1%/−8%/−8%, sumber IR2023/24/25) · 2027 baris microtext "semakan pertengahan 2027" · details.sec → 720px satu ritma · #jalan 640→720 · kad duo-cards stack 1-turun <480px
- **gate:** make verify-pages PASS (210 pages) · md5 parity public=dist=serving · live grep 7/7 new strings · screenshot desktop 1280 + mobile 390 disemak — kad stack, divider, delta label semua render

## FULL DEPLOY (2026-10-05 ~18:00 MYT) — sovereign directive "deploy live" (T3 unlock named)
- **initial run BLOCKED by fail-closed gates (4 pre-existing failures, none from vitals work):**
  1. /pulse/ 410 vs surfaces.json "live" → catalog aligned to server truth: status "gone" (Caddy @pulse_gone audit P0 already served honest 410; its own HTML says "surfaces.json: status gone")
  2-4. /oil /gas /gold DTI L3/L5 fail (no h1, no og in raw HTML) → room-plate <b> upgraded to real <h1> (font:inherit, zero visual delta) + og block after canonical; canonical copies → public/{oil,gas,gold}/index.html; backups *.bak-dti-20261005-175322
- **content gate re-anchored:** verify-content.sh asserted the dead pre-27-Sep tripwire design (21 failing needles). Rewritten to assert the current page's verified truth — 50/50 PASS. JSON-LD floor ≥4→≥1 (narrative page carries 1 consolidated block). /klci/ /usdmyr/ now assert real content (they resolve into world room, no longer SPA shells). Bash quoting fix: 'US$92.31'.
- **deploy:** make deploy FULL — verify-surfaces PASS · content 50/50 · verify-pages 210/210 · Caddy validate + reload · split-roots synced (backup /var/www/html/.split-roots-backup-20261005-180055) · commit 1218ab0
- **post-deploy live verification:** /vitals/ BIMB line ✓ · oil/gas/gold h1+og ✓ · /pulse/ 410 ✓ · surfaces.json served carries "gone" ✓ · site root 200 ✓
- **found-scar (for next session):** generate-discovery.cjs resolves canonical surfaces.json at ../../surfaces.json (repo root) — path does not exist; effective flow is public/ (stale Oct 4 copy) overwriting sites/ catalog each build. Catalog edits must land in public/surfaces.json or they get clobbered. Two copies now aligned; generator path fix pending.
