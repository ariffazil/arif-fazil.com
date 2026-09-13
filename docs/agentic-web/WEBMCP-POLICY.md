# WebMCP policy

WebMCP (`navigator.modelContext`) is a **community draft**, not a stable browser capability.
It must be additive. Core navigation must work with HTML + `/llms.txt` alone.

**HOLD:** do not ship public writable WebMCP or anonymous remote MCP write.

Safe candidates only (read-only, deterministic, public data):

| Tool | Why safe |
|---|---|
| `site.find_public_page` | Bounded index |
| `site.get_evidence_card` | Claim + date + limit |
| `earth.get_data_status` | Source + timestamp + coverage |
| `site.get_agent_contract` | Points at `/human` + matrix |
| `site.get_contact_options` | Does not send mail |

Never: deploy, Caddy, shell, git write, credentials, email send, `/a2a`, registry modify.
