# Public Observation Contract — dynamic SOT for the arif-fazil family surfaces

- **Mission:** `public-observation-contract-2026-10-12`
- **Agent:** `fi-003` (Qwen Code, 333-AGI BUILD cell) — A2M plane
- **Date:** 2026-10-12 · KVM8 (100.64.0.2)
- **Status:** **DEPLOYED** 2026-10-12 under F13 GO. Live: `https://mcp.arif-fazil.com/shared/claims.json` (refreshed every 15 min by cron); pages relinked; mcp repo commit `6aba7b6`. Compiler dry-run verified 2026-10-12 (13 claims, 3/3 sources reachable, honesty rules hold).
- **Decision (F13, 2026-10-12):** the `shared/` contract lives in the **mcp vhost** → `/var/www/html/mcp/shared/`.

## Why

The 2026-10-11 surfaces say *"static snapshot dated 2026-10-11 (frozen)"*. Honest, but frozen — and the page **names** a source it does not have (`shared/controlling-claims.json`). This contract makes that file real *and* refreshes the values, **without giving up static serving** (Caddy-first, Cloudflare-cacheable, zero client JS).

## Architecture

```
SOURCE (SOT)                COMPILE                              SERVE
─────────────               ───────                              ─────
kernel  /health        ─┐
mcp .well-known/…json   ├─► generate-public-claims.cjs ──► shared/claims.json  (machine)
AAA     :3001/health    │     1. probe each source              + baked values   (human)
VAULT999 head          ─┘     2. validate vs envelope schema     + "as of <ts>"
                              3. emit claims[]                    + link /health (live)
```

- **Values** are baked into the HTML by the compiler (`{{claim:…}}` / `{{as_of}}`) — run on deploy **and** a 15-min cron. HTML stays static.
- **Optionally** the single status strip may fetch `/shared/claims.json` at runtime; prose stays baked.

## Single schema — no duplicate

Kimi's `shared/observation-envelope.schema.json` remains the **one** schema. Delta to apply (backward-compatible; the 2026-10-11 captures remain valid v1 envelopes):

| Change | Detail |
|---|---|
| add optional `probe` | `object \| null` — binding to a declared source: `{ source, extract, state_rule \| state_map }` |
| add optional `probe_binding_version` | `string` |
| add `REPORTED` to `state` enum | for displayed-but-unverified figures (e.g. the 9 monthly users) |

### Honesty rules the compiler enforces (verified by dry-run)

- **Unresolved field → `UNMEASURED`**, never a pass. (The source answering is not a verdict.)
- **Source down → `UNREACHABLE`**.
- Rule `reachable` → state **`REACHABLE`** (observed, no verdict claimed).
- A verdict (`MEASURED_PASS` / `MEASURED_FAIL` / `DEGRADED`) is asserted **only** when the binding supplies `state_map` or a pass/fail rule (`nonempty_fail`, `bool_pass`).
- This is what makes **`unmeasured ≠ pass`** structural, not prose.

### Dry-run evidence (2026-10-12 03:45Z, KVM8)

`node generate-public-claims.cjs --contract shared/controlling-claims.json` → 13 claims, 3/3 sources reachable. Measured values (this is what the pages would bake):

| metric_id | state | value |
|---|---|---|
| `arifos_floors_pass` | REACHABLE | 2 |
| `arifos_floors_failing` | MEASURED_FAIL | `["F11","F12","F13","F2"]` |
| `arifos_floors_unmeasured_count` | REACHABLE | 10 |
| `arifos_runtime_commit` | REACHABLE | `b7db1e9` |
| `arifos_vault999` | MEASURED_PASS | healthy |
| `mcp_tool_count` | REACHABLE | 8 |
| `mcp_resource_count` | REACHABLE | 40 |
| `mcp_manifest_version` | REACHABLE | `2026.10.10-dbecd35` |
| `aaa_a2a_status` | **DEGRADED** | degraded |
| `users_monthly_reported` | REPORTED | 9 |

Two defects in my own compiler were **caught by the dry-run and fixed before staging**: (1) `runtime.source_commit` did not exist → returned `null` yet stamped PASS — corrected to the real top-level `source_commit`; (2) a `degraded` value was stamped `MEASURED_PASS` — now `DEGRADED`. This is the contract policing itself.

## Files in this proposal

| File | Role |
|---|---|
| `shared/controlling-claims.json` | the **bindings** — live-bound; supersedes Kimi's static captures |
| `scripts/generate-public-claims.cjs` | the **compiler** (probe → validate → `claims.json`) |

## Deploy steps (offline-safe, reversible)

1. `mkdir -p /var/www/html/mcp/shared && cp shared/controlling-claims.json scripts/generate-public-claims.cjs …`
2. Run the generator once; diff `shared/claims.json` against `/health`.
3. Add a 15-min cron (jitu-guard wrapped) to regenerate.
4. Patch the 3 pages: replace the dated-snapshot line with `{{as_of}}` + a link to `/shared/claims.json`.
5. No Caddy reload needed (`file_server` reads per request).

## Verify

- `shared/claims.json` is JSON-valid and conformant to the envelope schema.
- `floors_pass` in `claims.json` == kernel `/health`.
- after 15 min `generated_at` advances; page "as of" == `claims.json.generated_at`.

## Rollback

`rm -rf /var/www/html/mcp/shared/` + revert the page snapshot line; remove the cron entry.

## Authority

New files land in the **proposal zone** first. Promotion into the mcp vhost is a deploy step (mcp is its own vhost + repo; FI-003 has patched it under F13 GO, e.g. commit `9f6e9e6`). Per `canon/file-authority.yaml` (*no ad-hoc scripts without registry*), the generator MUST be registered (mcp manifest / web-canon) before it is promoted to a live path.

## Invariant (keeps it honest)

Every displayed value carries `observed_at` + `state`; **`unmeasured ≠ pass`**; if the contract cannot source a field, the page renders `unmeasured` — never a guess.
