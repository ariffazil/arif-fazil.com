# Design System Governance — tokens.css (Claude Code ↔ Kimi Code)

> Established 2026-11-21 after a hash sweep found four divergent copies of a file whose
> header proclaims "Single Source of Truth". This is the musyawarah contract between the
> two coding lanes sharing this surface. One surface, one writer, deliberate before you
> mutate. Ditempa bukan diberi.

## When deliberation is mandatory (before ANY mutation)

1. Any change to `sites/shared/design-system/tokens.css` — values, semantics, additions.
2. Breaking structural changes: layout shell, DID architecture, semantic HTML contracts.
3. Anything touching agent-discovery surfaces: `/llms.txt`, `ai-catalog.json`,
   `webmcp.json`, ARD manifest, DID documents.

Reads and audits need no ceremony. Mutations do.

## Flow — audit → consensus → execute

1. **AUDIT.** Probe live truth before proposing: origin-direct curl
   (`--resolve arif-fazil.com:443:127.0.0.1` — Cloudflare adds ~1 KB), judge
   content-type not status codes (the SPA shell answers 200 on missing paths), and
   verify the RENDERED layer — some values hydrate from JS, so served bytes ≠ rendered
   page.
2. **CONSENSUS.** The mutating lane drops a `proposal.json` under
   `/root/forge_work/proposals/<lane-id>/<mission>/`: objective, evidence, authority,
   acceptance, deadline, owner, the token diff, and impact on agent-discovery manifests.
   The other lane reviews as an independent voice — no cross-reading mid-deliberation.
   Dissent is recorded, never suppressed. A reviewer is a check, not a judge.
3. **EXECUTE.** One lane mutates atomically, then syncs EVERY live copy (additive
   rsync, no `--delete`, no Caddy reload), `node --check` on any edited inline JS,
   probes each public URL origin-direct, writes a receipt to `receipts/<lane-id>/`,
   and runs `make verify-pages`. Un-deployed = WIP, not done.

## Who decides

- Claude reviews Kimi's proposals; Kimi reviews Claude's. Honest states:
  working ≠ completed; a delegated claim is an opinion until probed live.
- Disputes go to the arifOS kernel (`arif_judge`). The operator's veto is final.
  No lane self-authorizes a SEAL.
- `git push` = announce + lease first, never bare. `deploy-site.sh --apply` = T3.

## Copy map — always re-derive, never trust this snapshot

```bash
find /var/www/html -path '*_shared*' -name 'tokens.css' 2>/dev/null
sha256sum <the copies> | awk '{print substr($1,1,8), $2}'
curl -s --resolve arif-fazil.com:443:127.0.0.1 \
  https://arif-fazil.com/_shared/design-system/tokens.css | sha256sum
```

Backups (`*.bak.*`, `.quarantine*`, `_archive`) are evidence — never edit, never deploy
from them. A token change is DONE only when every live copy hash-matches the intended
result and the rendered page probes clean.

## State at establishment (2026-11-21, all OBS)

| Copy | sha256-8 | mtime |
|---|---|---|
| served apex + arifos subdomain (`/var/www/html/_shared/…`, `shared/…`, `arif/_shared/…`) | `bb83c422` | 2026-11-19 |
| `/var/www/html/aaa/_shared/…` | `6d6ecd41` | 2026-11-17 |
| `/var/www/html/arifos/_shared/…` (+ `arif/arifos/…`) | `8fb03ff2` | 2026-11-14 |
| repo `sites/shared/design-system/tokens.css` | `746a6229` | 2026-11-14 |

The repo copy is STALE: the served copy carries the M1 RGBY shell-accent block
(`--accent-red/blue/yellow/green`, branch `feat/m1-canon-shell-kit`) that the repo copy
lacks. Deploying the repo as-is would strip tokens live pages consume. The functional
state palette (`--state-danger #D50000`, `--state-info #58A6FF`,
`--state-pending #FFD600`, `--state-hold #FF9500`, `--state-operational #00C853`)
exists in all copies; two blues are already live (`--state-info`, `--accent-blue
#7FB3FF`).

**Next token change must reconcile repo ← live FIRST**, then migrate, then converge
every copy — in that order.
