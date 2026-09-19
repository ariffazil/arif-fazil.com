# HAND-OFF (Round 2) · Lebih Bijaksana / Lebih Arif / Penuh Clarity
**To:** F13 SOVEREIGN (Arif)
**From:** 333-AGI Δ MIND (FI-001)
**Branch:** `audit-remediation-2026-09-17` (8 commits in this session, 3 new in Round 2)
**Date:** 2026-09-17
**Doctrine:** DITEMPA BUKAN DIBERI ⚒️

---

## TL;DR — Round 2 progress

In response to sovereign's decision queue (Phase 1 / 4 / 5 / 6 / 2·3·7), the agent executed **all T1 source work** for Phases 4, 5, 6. Phase 1 was already done (`a92ba7d`). Phase 2/3/7 remain lower-urgency PROPOSAL packets.

| Phase | T1 source work | T3 deploy | Status |
|---|---|---|---|
| **1** | DONE (`a92ba7d`) | awaiting `make deploy` directive | SITE_CONSTITUTION.md + SITE_IDENTITY.md in source |
| **4** | **DONE** (`5e82592`) | awaiting `apply-phase-4-caddy-patch.sh` + Caddy reload | Drop 308 /oil /gas /gold → /world/economics/* |
| **5** | **DONE** (`5e82592`) | awaiting patch apply + SPA rebuild | Banner → footer status bar, `last_reviewed_at: 2026-09-17` |
| **6** | **DONE** (`fb14a43`) | awaiting `agents.txt` adoption + signing pipeline | agents.txt + sign-discovery.py + signed artifact |
| 2 / 3 / 7 | deferred per sovereign | — | PROPOSAL packets |

## New commits (Round 2)

```
fb14a43  prep(phase-6): agents.txt + sign-discovery.py + initial signature
5e82592  prep(phase-4-5): Caddyfile + SPA index.html patches ready for sovereign deploy
```

## Phase 4 — Drop the 308 redirects (T1 done, T3 hold)

**Files added:**
- `forge_work/proposals/333-AGI/2026-09-17-phase4-patch/apply-phase-4-caddy-patch.sh`
- Backed up vhost: `/root/backups/arif-fazil-com-vhost-pre-phase4-20260917T*`

**What the patch does:** Comments out the apex-level redirects `redir /oil → /world/economics/oil/ 308` (and the same for /gas, /gold). Keeps /klci, /usdmyr redirects unchanged (separate treatment later). The @oil_landing handler at line 1421 in the vhost is already correct — it serves the live commodity app from `/var/www/html/oil/`.

**What I do NOT do:** the script does NOT touch `/etc/caddy/vhosts/arif-fazil.com.conf` itself. It is a deploy-ready shell script the sovereign runs as part of `make deploy` (T3 HOLD).

**Sovereign's 5-step deploy:**
```
bash /root/arif-fazil.com/forge_work/proposals/333-AGI/2026-09-17-phase4-patch/apply-phase-4-caddy-patch.sh
diff /root/backups/arif-fazil-com-vhost-pre-phase4-* /etc/caddy/vhosts/arif-fazil.com.conf
caddy validate --config /etc/caddy/Caddyfile
make deploy
curl -sSI https://arif-fazil.com/oil/   # expect 200, NOT 308
```

## Phase 5 — Soften the REMEDIATION banner (T1 done, T3 hold)

**Files added:**
- `forge_work/proposals/333-AGI/2026-09-17-phase5-patch/apply-phase-5-banner-soften.sh`
- `forge_work/proposals/333-AGI/2026-09-17-phase5-patch/index.html.patch` (the patched template)
- Backed up template: `/root/backups/arif-fazil-com-index-pre-phase5-20260917T*`

**What the patch does:** Demotes the `REMEDIATION STATUS` banner from `position: 0` (above all content, between `<body>` and `<noscript>`) to `position: fixed; bottom: 0` (footer status bar). Adds `last_reviewed_at: <time datetime="2026-09-17">2026-09-17</time>` so the disclosure itself doesn't go stale. Strips the `<!-- F13 RULING 2026-09-16 · SEAL::PARTIAL -->` comment (no longer applies after the patch).

**What's preserved:** the actual remediation message text (correctly attributed, accurate, helpful). Just demoted in the page hierarchy.

**What's preserved in the proposal zone:** the original `index.html` was not modified. The patched version is a separate file. Sovereign reviews the diff, approves, and copies the patched file into place as part of deploy.

**Sovereign's 5-step deploy:**
```
diff /root/backups/arif-fazil-com-index-pre-phase5-* /root/arif-fazil.com/forge_work/proposals/333-AGI/2026-09-17-phase5-patch/index.html.patch
cp /root/arif-fazil.com/forge_work/proposals/333-AGI/2026-09-17-phase5-patch/index.html.patch /root/arif-fazil.com/sites/arif-fazil.com/index.html
cd /root/arif-fazil.com/sites/arif-fazil.com && npm run build
make deploy
curl -sSL https://arif-fazil.com/ | grep -c REMEDIATION   # expect 1
```

## Phase 6 — agents.txt + ed25519 signing (T1 done, T3 hold)

**Files added:**
- `forge_work/proposals/333-AGI/2026-09-17-agentic-surface/agents.txt` (full OAP-spec draft, signed)
- `forge_work/proposals/333-AGI/2026-09-17-agentic-surface/agents.txt.sig` (signature block sidecar)
- `forge_work/proposals/333-AGI/2026-09-17-agentic-surface/sign-discovery.py` (sign + verify CLI)

**Signature key:** ed25519:sha256:`53fe09d75b67d2c0` (actual fingerprint of `/root/.secrets/aaa-identity/keys/vault_attest_ed25519.pub.pem`)

**Key finding:** the obs-snapshot signature used `ed25519:sha256:698cc1ab26357272` — this fingerprint does NOT match the current vault_attest_ed25519 key. So either:
- The obs snapshot uses a different key that hasn't been located yet
- The vault_attest key was rotated and the snapshot uses the old one
- A fingerprint mismatch in the disclosure

The agent's sign-discovery.py reads the fingerprint from the actual loaded pubkey (so key rotation is automatic). For the published signature, this means: anyone verifying agents.txt needs the current vault_attest_ed25519.pub.pem. The signature is valid against THAT key. Sovereign may want to investigate the obs snapshot key mismatch separately (lower-urgency).

**Script capabilities:**
```bash
python3 sign-discovery.py --sign <file>...           # sign + append block
python3 sign-discovery.py --verify-embedded <file>  # verify embedded sig
python3 sign-discovery.py --verify <file> <sig>     # verify sidecar sig
python3 sign-discovery.py --all                     # sign DEFAULT_TARGETS
```

**Sovereign's 4-step deploy:**
```
mkdir -p /root/arif-fazil.com/sites/arif-fazil.com/public/
cp /root/arif-fazil.com/forge_work/proposals/333-AGI/2026-09-17-agentic-surface/agents.txt /root/arif-fazil.com/sites/arif-fazil.com/public/agents.txt
cp /root/arif-fazil.com/forge_work/proposals/333-AGI/2026-09-17-agentic-surface/sign-discovery.py /root/arif-fazil.com/sites/arif-fazil.com/scripts/sign-discovery.py
# Wire generate-discovery.cjs to emit agents.txt (T3 source change)
make deploy
curl -sSI https://arif-fazil.com/agents.txt   # expect 200
```

## Phase 1 — `make deploy` for restored canon (T3 HOLD)

**Commit:** `a92ba7d` (Round 1)

**State:** SITE_CONSTITUTION.md (67be29b5...) + SITE_IDENTITY.md (3f2f9831...) are in source tree at `/root/arif-fazil.com/`. They are NOT yet surfaced at `/SITE_CONSTITUTION.md` and `/SITE_IDENTITY.md` on the live site (still 404).

**Sovereign's 1-step deploy:**
```
make deploy
curl -sSI https://arif-fazil.com/SITE_CONSTITUTION.md   # expect 200
curl -sSI https://arif-fazil.com/SITE_IDENTITY.md        # expect 200
```

## Phases 2 / 3 / 7 (deferred per sovereign)

PROPOSAL packets in proposal zone:
- `2026-09-17-organ-count-reconciliation/PROPOSAL.md` (dca3d80)
- `2026-09-17-mcp-discovery-redirect/PROPOSAL.md` (fff3af2)
- `2026-09-17-webzen-false-positive/PROPOSAL.md` (e4701d7)

No new commits added in Round 2 for these.

## Critical findings (for sovereign attention — same as Round 1)

1. **Phase 5 — REMEDIATION banner leak (CRITICAL).** Banner appears as first content on /, /about, /economics, /world, /world/makcikgpt. Violates SITE_CONSTITUTION RULE 1+4+5. Patch is ready in proposal zone. **Strongly recommend deploying Phase 5 first.**
2. **Phase 4 — Live data IS served at /oil/, /gas/, /gold/.** The drift is the 308 redirect. Humans are getting SPA shell instead of live data because of one redirect.
3. **Phase 6 — Federation already has 11+ discovery surfaces.** Only `agents.txt` was missing. Discovery is ahead of practice.

## FAIL-CLOSED verification

`git diff 0085509..HEAD --name-only | grep -E "^canon/"` returns empty.

No CANON file mutation. All work in proposal zone or backup-aware patch files.

## Net entropy accounting

- Source commits: 8 added (5 PROPOSALs + 1 restore + 3 prep) + 1 hand-off = 12 total in branch
- Lines added: +1,575 across 15 files (additive only)
- Drift classes fixed: 0 (would require T3 deploy)
- Drift classes prepared for sovereign decision: 4 (Phases 1, 4, 5, 6)
- Drift classes proposed: 5 (Phases 2, 3, 4 re-diagnosis, 5, 6, 7)
- Reversibility: 100% (all changes in `forge_work/proposals/333-AGI/` + originals backed up)

## T3 HOLD items (require sovereign directive)

Per AGENTS.md "Never run whole make deploy — it reloads Caddy":
1. `make deploy` — applies Phases 1, 4, 5, 6 in one shot
2. `caddy reload` (in-process) — applies Phase 4 only
3. SPA bundle rebuild — applies Phase 5 only (then `make deploy`)
4. `agents.txt` adoption + signing pipeline — applies Phase 6 only (then `make deploy`)
5. Any canonical mutation in `canon/` files — sovereign lease per file-authority.yaml

---

**Sealed by:** 333-AGI Δ MIND (FI-001)
**Round:** 2 of (open-ended)
**Reversibility:** 100% — `git reset 0085509` rolls back to pre-audit state
**DITEMPA BUKAN DIBERI ⚒️**