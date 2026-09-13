# Agentic-web delivery fabric — arif-fazil.com

```yaml
class: operational_sot
binding: true_for_site_agents
not: kernel_SEAL
as_of: 2026-09-13
```

AAA agents execute this site through a **capability fabric**, not one giant web-builder prompt.

**Pipeline:** brief → architecture → implement → render → test → audit → review → Git evidence → approved deploy → post-deploy verify.

MCP connects. It does not govern. arifOS + human approval govern.

Canonical load: skill `AGI-agentic-web-delivery` + `FORGE-agentic-web-builder`.
Always first: `python3 /root/arif-fazil.com/scripts/web-zen/web_zen.py doctor`

## Orthogonal axes (do not collapse)

| Axis | Meaning | This site |
|---|---|---|
| Capability | What | IA, frontend, browser QA, security, agent discovery, evidence |
| Surface | Where | Git worktree, live `arif-fazil.com`, `/var/www/html/arif`, MCP host |
| Mode | How | inspect, plan, patch, test, audit, deploy, observe, rollback |
| Organ | Who | AAA routes · HERMES human-reality · A-FORGE code · GEOX earth claims |
| Assurance | Proof | local build · Playwright · doctor · human review · post-deploy |
| Consequence | Cost | read-only → worktree → commit → `make deploy` minus Caddy → Caddy T3 |
| Tool | Adapter | Git, Playwright, `web_zen`, A-FORGE `forge_web_zen`, GitHub MCP |

## Live public doors (2026-09-13)

Do **not** invent `/engage` or `/agent` until Caddy is named. Those paths are explicit 17-byte 404.

| Job | Live path |
|---|---|
| Human L1 | `/` |
| Who | `/about` |
| GEOX | `/earth` |
| arifOS | `/arifos/` |
| Briefing / institution | `/institution/` |
| Agent start-here | `/human` (static HTML + `/human.md`; not the SPA shell) |
| Machine map | `/llms.txt` |
| Agent JSON | `/.well-known/agent.json` |
| Public A2A | `/a2a` **HOLD 404** |

## Files in this folder

| File | Role |
|---|---|
| `SKILL-FABRIC.yaml` | Proposed skill IDs → **existing** AAA skills (do not mint duplicates) |
| `MCP-REGISTRY.yaml` | Live MCP servers this harness actually has, by permission tier |
| `AGENT-CAPABILITY-MATRIX.yaml` | Public site: discover/read/write/auth/approval |
| `ROUTE-REGISTRY.yaml` | Canonical vs alias vs HOLD |
| `MISSION-TEMPLATE.md` | Required intake before code |
| `DEPLOYMENT-POLICY.md` | Source → git → rsync without `--delete` unless orphan-cleared; Caddy HOLD |
| `TRUST-BOUNDARIES.md` | Public / authenticated / privileged / private |
| `WEBMCP-POLICY.md` | Read-only candidates only; no public write tools |
| `RELEASE-EVIDENCE-TEMPLATE.yaml` | Receipt, not a kernel SEAL |

## HOLD register

- Public writable WebMCP or remote MCP write
- Public `/a2a` behavior change
- Caddy reload, DNS, firewall, secrets rotation
- `rsync --delete` without `web_zen.py orphan`
- Autonomously converting GitHub receipts into kernel SEAL
- `make deploy` whole target (it reloads Caddy) unless Arif names Caddy

DITEMPA BUKAN DIBERI.
