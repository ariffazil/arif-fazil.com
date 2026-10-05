---
site: arif-fazil.com
atlas_kind: chain-of-custody
reconciled_at: 2026-10-05 11:22 MYT
reconciled_by: HERMES (MCP, arifOS Federation)
host: KVM8
purpose: "Make the role of every directory that contains this site's name unambiguous. Probe, do not infer from name or age."
---

# arif-fazil.com — Directory Chain Atlas (KVM8 view)

> **Truth rule:** A directory's name does not establish its role. Live `git remote -v`, `mtime`, and a deploy tag do. Re-probe before SEAL claims.

## Roles observed

| Directory | Role | Evidence (probe 2026-10-05) |
|---|---|---|
| `/root/arif-fazil.com` | **EDITABLE SOURCE** | `git remote -v` → `github.com:ariffazil/arif-fazil.com.git`; HEAD = `73671e1` (2026-10-04 12:53 MYT); working tree has 11 `M` files awaiting KVM8 merge/push. |
| `/root/arif-fazil.com/sites/arif-fazil.com/` | **PUBLISHED CONTENT (source-side)** | Lives inside source repo, tracked; not a build output. |
| `/root/arif-sites/sites/arif-fazil.com/public/` | **PUBLIC BUILD MIRROR** | Build output of source `public/`; mtime 2026-09-12 (older than source — does not yet reflect HEAD `73671e1`); served by Caddy. |
| `/root/forge_work/deployments/arif-fazil.com/<deploy_tag>/` | **DEPLOYMENT RECORDS** | 4 dated tarballs. Latest = `20261004T050025321959536Z`, `source_commit 73671e1`, `build_hash 94a53e2`, `webroot /var/www/html/arif`, `caddy.ok true`. Previous = `previous/` snapshot. |
| `/root/.local/arif-sites/sites/arif-fazil.com/public/data/wealth/` | **STALE LOCAL SNAPSHOT** | mtime 2026-05-11. Not on any deploy tag. Treat as tombstone; do not consume as live. |

## Chain (source → live)

```
[1] /root/arif-fazil.com (git: ariffazil/arif-fazil.com, main)
        ↓  merge + deploy  (per deploy-makcik.sh; KVM4 authority)
[2] /root/forge_work/deployments/arif-fazil.com/<tag>/  (receipt.json, build artifact, previous/)
        ↓  caddy apply
[3] /var/www/html/arif/  (webroot; caddy serves)
        ↓  p2p public  (caddy arif-fazil.com vhost)
[4] https://arif-fazil.com  (live; consumer of /var/www/html/arif/)
```

## Workflow (one positive path)

A live request must traverse source → tar → webroot → caddy → public:

```bash
# 1) Probe source truth (HEAD commit)
git -C /root/arif-fazil.com rev-parse HEAD
# 2) Probe last deploy tag
ls -t /root/forge_work/deployments/arif-fazil.com | head -1
# 3) Probe that deploy's source_commit matches HEAD
jq -r '.source_commit' /root/forge_work/deployments/arif-fazil.com/<tag>/receipt.json
# 4) Probe live site reflects that commit (e.g. via caddy header JSON)
curl -sS https://arif-fazil.com/llms.json | jq -r '.commit // .deployed_commit // .'
# 5) Compare: source_commit from receipt vs llms.json commit
```

**One-receipt positive test:** all four probed values must agree, or the chain is broken.

## One restricted path (paired negative)

**Unauthorized A** does not reach Caddy / DEPLOY-RECORD / SOURCE:

- Editing `/var/www/html/arif/` directly bypasses source-of-truth. This is **forbidden** per `DEPLOY.md` (re-applied by deploy-makcik.sh).
- Editing `/root/.local/arif-sites/sites/arif-fazil.com/public/data/wealth/` looks live but is the May 2026 tombstone. Any consumer that reads it as live is misreading state.
- Editing `/root/arif-fazil.com/sites/arif-fazil.com/999/` (sub-project) is fine; editing `/root/arif-fazil.com/sites/arif-fazil.com/sites/arif-fazil.com/` would be the wrong nested path.

## Verdict (this reconciliation)

- **Source-of-truth = `/root/arif-fazil.com`** (git repo, current HEAD = `73671e1`).
- **Build output = `/root/arif-sites/sites/arif-fazil.com/public/`** (stale vs HEAD — needs redeploy to refresh).
- **Deploy authority = KVM4 (IRFANclaw lane)** (per memory 02/10).
- **Cross-lane audit/relay = KVM8 (HERMES)** — does NOT mutate, only observes.
- **No tombstoning performed.** Stale and live are separated by `mtime` and `deploy_tag`, not by deletion.

## Open unknowns (UNVERIFIED, not blocking)

- Whether `/root/arif-fazil.com/sites/arif-fazil.com/sites/arif-fazil.com/` is intentional nested project or unintended. Out of scope this turn.
- Whether the working-tree modifications (11 `M` files) are pending F13 review or pending KVM4 merge. Out of scope this turn.

## Reconciliation scope

- Touched: `/root/WEALTH/organ.yaml`, `/root/WELL/organ.yaml` (dangling-tombstone repair only).
- Touched: `/root/AAA/.staged/7-level-boundary-map/7-LEVEL-BOUNDARY-MAP.md` (added audit line).
- Untouched: `/root/AAA/canon/`, all source repos, deploy artifacts, `/root/.hermes/`, configuration.
- Did NOT create new system, dashboard, registry, ledger, or JSON schema.
- Did NOT prune backups or staging.

*DITEMPA BUKAN DIBERI ⚒️ · arifOS F1–F13 · LANE=arif · HOST=KVM8`