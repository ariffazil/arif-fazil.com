# PUBLIC-SURFACE AEO / LINK-INTEGRITY HARDENING — proposal

- **Mission:** `public-surface-aeo-hardening-2026-10-12`
- **Agent:** `fi-003` (Qwen Code, 333-AGI BUILD cell) — A2M plane, BUILD-capability
- **Date:** 2026-10-12 · KVM8 (100.64.0.2)
- **Trigger:** F13 review request over `arif-fazil.com/arifos/`, `mcp.arif-fazil.com/`, `aaa.arif-fazil.com/`
- **Status:** **APPLIED 2026-10-12** under F13 GO ("go — relabel as static snapshot"). All three surfaces fixed + verified live; mcp repo committed `9f6e9e6` (deployed=committed). `forge_vault`/`arif_seal` NOT called (F13 gate).

## APPLIED — result (live-verified 2026-10-12)

| Surface | Before | After | Notes |
|---|---|---|---|
| mcp.arif-fazil.com | og 4 · tw 0 · jsonld 0 · viewport 0 · 4 dead links | og 6 · tw 4 · jsonld 1 · viewport 1 · 0 dead links | status relabelled "static snapshot dated 2026-10-11; live at /health"; commit `9f6e9e6` |
| aaa.arif-fazil.com | og 3 · tw 0 · jsonld 0 · llms unlinked | og 6 · tw 4 · jsonld 1 · llms linked | live file `/var/www/html/aaa/index.html` |
| arif-fazil.com/arifos/ | og 4 · tw 0 | og 6 · tw 4 · jsonld 1 | source `sites/arif-fazil.com/public/arifos/` → dist → live |

mcp link targets now absolute: `https://arif-fazil.com/arifos/#evidence`, `https://arif-fazil.com/canon/file-authority.yaml`, `/.well-known/security.txt` (all 200).
- **Authority note:** targets are `DERIVED` (`canon/file-authority.yaml`: `public/**/*.html`, `/var/www/html/arif/**`, `sites/arif-fazil.com/dist/**`, `hand_edit:false`). FI-003 cannot hand-edit them → proposal only. `mcp`/`aaa` are separate vhosts (mcp has its own git repo, no remote) but `/var/www/html/<surface>/` is Caddy-served → treated conservatively as DERIVED.

## Context

All three surfaces were rewritten on **2026-10-11** by mission `PUBLIC-SURFACE-REALITY-UPGRADE-2026-10-11` (agent `kimi-code/FI-008`) into a deliberately honest "bounded, observed" register. That register is correct and should be kept. The rewrite **regressed machine-readable metadata and introduced relative links that 404 on their own host**. This proposal is additive-only: it restores/rounds-out head metadata and repairs links, without touching a word of the honest prose.

Sibling artifacts (untracked): `forge_work/proposals/kimi-code-Fi-008/public-surface-reality-upgrade/`.

## Findings (measured live 2026-10-12, curl + disk)

| # | Surface | Sev | Defect | Evidence |
|---|---|---|---|---|
| 1 | mcp | **P0** | Evidence links are relative → 404 on the mcp host | `mcp.arif-fazil.com/arifos/` → **404**; `/canon/file-authority.yaml` → **404**; `/security` → **404** (page links all three) |
| 2 | mcp | **P0** | Page claims render-time dynamic data it does not have | prose: "counts load from `shared/controlling-claims.json` on render"; `/var/www/html/mcp/shared/` **does not exist**; page has **0 `<script>` tags** → static text asserting dynamic honesty |
| 3 | mcp | P1 | JSON-LD lost vs prior commit | HEAD `a8d2848` had `application/ld+json`; live page has **0** |
| 4 | mcp | P1 | `og:image`, `og:site_name`, all `twitter:*` lost vs HEAD | live `og=4 / twitter=0`; HEAD had 10 social tags |
| 5 | mcp | P1 | Deployed ≠ committed (repo drift) | `git -C /var/www/html/mcp status` → `M index.html`; diffstat `134+/1413−`; repo has no remote |
| 6 | aaa | P1 | No `og:image`, `og:type`, `og:site_name`, `twitter:*` | live `og=3 / twitter=0` |
| 7 | aaa | P2 | `/llms.txt` live (200) but not linked in page | `grep -c llms.txt` = **0** |
| 8 | aaa | P2 | No JSON-LD | 0 `ld+json` |
| 9 | aaa | P2 | Page frozen by design after symlink sever | 15-min cron writes `/var/www/html/aaa/status.json`; index is now a static snapshot ("11:15 · 11 Oct 2026"); `cockpit_probe.py` no longer feeds index → intentional, but confirm no consumer expected the old symlink |
| 10 | arifos | P1 | No `og:image`, `og:site_name`, `twitter:*` | live `og=4 / twitter=0`; JSON-LD present (`SoftwareSourceCode`) ✓ |
| 11 | all | P1 | No `twitter:card` → shares render as bare links | twitter tag count = 0 on all three |

Good (verified, keep): `og-identity.png` = **200** (image/png, 16 053 B); arifos anchors `#evidence` `#gaps` `#current-state` exist; kernel `/health` floors (`2 pass · 4 fail: F2,F11,F12,F13`) match the mcp page text — that page is *not* stale.

> Note on `/arifos/`: served bytes (22 378) ≠ disk (21 289) is **Cloudflare email-obfuscation + challenge-script injection**, not drift. No action.

## Proposed patch (additive; apply head-block per surface)

Shared asset: `https://arif-fazil.com/og-identity.png` (200). Add the missing block to each `<head>` after `<link rel="canonical">`.

### mcp.arif-fazil.com — add
```html
<meta property="og:image" content="https://arif-fazil.com/og-identity.png">
<meta property="og:site_name" content="arif-fazil.com">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="arifOS MCP — Developer Gateway">
<meta name="twitter:description" content="Bounded, observed public MCP endpoint for the arifOS kernel.">
<meta name="twitter:image" content="https://arif-fazil.com/og-identity.png">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"SoftwareApplication","name":"arifOS MCP","applicationCategory":"DeveloperApplication","url":"https://mcp.arif-fazil.com/","operatingSystem":"Any","isAccessibleForFree":true}
</script>
```
Plus **link repair** — make cross-host links absolute:
- `/arifos/#evidence` → `https://arif-fazil.com/arifos/#evidence` (×2: §I, §K)
- `/arifos/#gaps` → `https://arif-fazil.com/arifos/#gaps`
- `/canon/file-authority.yaml` → `https://arif-fazil.com/canon/file-authority.yaml` *(verify target resolves first)*
- `/security` → resolve target; **`arif-fazil.com/security` currently 404** — either ship `/security` or repoint to `/.well-known/security.txt`

Plus **honesty fix (P0)** — §A/§B must not promise a file that isn't served. Pick one:
- (a) ship `shared/controlling-claims.json` + the client loader, **or**
- (b) change prose to a static, dated snapshot, e.g. *"Snapshot: 2026-10-11T…Z. Values below are static as of that time; live status is at `/health`."*

### aaa.arif-fazil.com — add
```html
<meta property="og:type" content="website">
<meta property="og:image" content="https://arif-fazil.com/og-identity.png">
<meta property="og:site_name" content="arif-fazil.com">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AAA — What is open">
<meta name="twitter:description" content="Five open readings. AAA points. It does not judge, execute, or seal.">
<meta name="twitter:image" content="https://arif-fazil.com/og-identity.png">
<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"AAA","url":"https://aaa.arif-fazil.com/"}
</script>
```

### arif-fazil.com/arifos/ — add
```html
<meta property="og:image" content="https://arif-fazil.com/og-identity.png">
<meta property="og:site_name" content="arif-fazil.com">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="arifOS — Governed execution for consequential AI agents">
<meta name="twitter:description" content="A research-stage constitutional substrate for agent governance. Two properties demonstrated, four end-to-end gaps open, zero commercial state.">
<meta name="twitter:image" content="https://arif-fazil.com/og-identity.png">
```

## Verification plan (post-apply, per surface)
1. `curl -s <url> | grep -cE 'twitter:|og:image'` → ≥ 4 / ≥ 1 per surface.
2. `curl -s -o /dev/null -w '%{http_code}' https://mcp.arif-fazil.com/arifos/` — **after** link repair, the *link target* is `https://arif-fazil.com/arifos/` (200), not the mcp host.
3. Hosted-card check: Facebook Sharing Debugger / X Card validator on each URL.
4. mcp only: `git -C /var/www/html/mcp status` clean after commit (reconcile deployed = committed).

## Rollback
Head-block additions are contiguous and removable by deleting the added lines. Pre-state is captured in the 2026-10-11 `.pre-deploy-2026-10-11.aa8b6e0` backups and in git (`/var/www/html/mcp` HEAD `a8d2848`).

## What this proposal does NOT touch
- No prose/honesty register changes beyond fixing claim-vs-wiring (mcp §A/§B).
- No canon files, no `canon/*.yaml`, no `navigation.json`. No live mutation. No seal.
- The `aaa` symlink-sever consequence (finding 9) is flagged for F13, not reversed here.

## Recommended order
1. **mcp link repair + honesty fix (P0)** — the page's own evidence trail is currently dead; this is the real defect.
2. **mcp commit** — reconcile deployed = committed.
3. **AEO head blocks** (all three) — one bundled change.
4. **aaa symlink-sever decision** — F13 call.
