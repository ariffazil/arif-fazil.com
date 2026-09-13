# Mission intake (refuse underspecified work)

Copy this block. Fill every field. Empty `approval_required` for deploy is a HOLD.

```yaml
mission: <ID>
objective: <one sentence>
audiences: [public_human, technical_institution, ai_agent]
in_scope: []
out_of_scope:
  - Caddy reload
  - public /a2a
  - GitHub About restamp
  - remote MCP write
  - WebMCP public write
consequence: read_only | public_content | infra
required_evidence:
  - web_zen doctor before
  - local production build
  - desktop screenshot
  - mobile screenshot
  - agent-manifest parity (llms.txt, agent.json, routes)
approval_required:
  - production_rsync
  - git_push
rollback:
  - restore backup under /root/backups/www-html-arif-*
  - git revert <SHA>
success:
  - stranger answers who / GEOX / arifOS in 15s
  - agent retrieves /human + /llms.txt without executing JS
```

Doctor first:

```
python3 /root/arif-fazil.com/scripts/web-zen/web_zen.py doctor
```
