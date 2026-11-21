# Design-Sync Status — round-2 rulings executed (2026-11-21)

Authority: Arif F13 round-2 ruling (2026-11-21) + the Tri-Witness Validation Receipt
(round 1 and round 2). Lane: `kimi-code/FI-008-site-sync` (isolated worktree,
per-worktree identity `kimi-code/FI-008` — no commit is authored as another lane).

## Rulings → implementation

| Ruling | Implementation | Evidence |
|---|---|---|
| `/organs/` ownership assigned explicitly | `ROUTE-OWNERSHIP.yaml` — site repo owns the `/organs/` hub shell; each organ repo owns its proxied sub-route | file in repo root |
| WELL `:18083` left alone | recorded as a **JSON API** surface in `ROUTE-OWNERSHIP.yaml`; no metadata edit from this repo | probe: 0 occurrences of `https://***` in 4 WELL responses |
| aaa tokens migrated to one source | `--state-danger #D50000→#FF1744`, `--state-void #616161→#9CA3AF` in the aaa tree; all trees now checked against `tokens/design-tokens.json` | `check-design-tokens.py` PASS |
| soul-red restricted | `--soul-primary` (#8B1A1A) is decorative-only; new `--soul-primary-text` #D65656 (≥4.5:1) and `--soul-primary-large` #C04040 (≥3:1); all text usages migrated; the gate now FAILS if soul-primary is used as `color:` | gate rule 3 |
| workspace frozen, fresh isolated lane | primary checkout untouched (65 dirty + 9 stashes frozen); new worktree `/root/worktrees/kimi-code-2/arif-fazil.com` with `extensions.worktreeConfig` + `git config --worktree user.name kimi-code/FI-008` | `git config --get user.name` in lane |
| two-actor rule | documented in `AGENTS.md` + `skills/arif-site-design-sync/SKILL.md`; the builder lane does NOT certify its own deploy | — |
| no rsync without 888 sign-off | `scripts/require-deploy-envelope.sh` — REFUSES without a signed envelope (approver + sha=HEAD + targets + rollback + negative_tests + signed_at) | refusal test: missing envelope → exit 1; empty envelope → exit 1 with 6 named problems |
| the 1 HTTP-404 named | `/mcp/proof/` — its static source exists with a valid block, but the vhost's `handle /mcp*` owns that path (MCP endpoint), so the page is not served there. Not a deploy gap. | live 404 + source block present |
| bonus: 12 Article blocks completed | 6 missing `url`, 4 missing `author` (2 files overlapped) — added from the page's own canonical link and the standard Person node | `validate-jsonld.mjs` now PASS on 225 blocks |

## Gates now wired

| Gate | Where | Fails on |
|---|---|---|
| `check-design-tokens.py` | prebuild + `make verify-design` | token drift vs SOT, contrast below min, decorative-as-text |
| `compile-design-tokens.py` | prebuild (writes) / `--check` (freshness) | stale compiled artifacts |
| `validate-jsonld.mjs` | prebuild + `make verify-design` | unparseable block, missing schema.org required fields, undeclared uncovered page |
| `probe-canonical.sh` | `make verify-live` | canonical form not 200, missing JSON-LD, divergent non-slash 200 |
| `require-deploy-envelope.sh` | `make require-envelope` | any rsync without a signed envelope |

## Known limits (carried forward, not hidden)

- **Two-actor verification is still OPEN for THIS branch**: no independent verifier lane was
  available (three subagent dispatches failed earlier today). The live sweep numbers in this
  branch come from the builder lane. Before rsync, a separate read-only lane must run
  `probe-canonical.sh --full` + `validate-jsonld.mjs` and certify.
- The arifos tree keeps its own verdict palette (declared override in the SOT) — including
  `VOID → #8892A6` and `DANGER → #E5484D`, which collides semantically with canonical
  VOID=grey. Awaiting a sovereign ruling; not silently flipped.
- The `/organs/` hub, `/wiki`, `/geox` and `/aaa/apps/geox` paths redirect (301/308) and
  carry no JSON-LD by design — they are not HTML surfaces.

---

## Observatory upgrade — reality-loop SOT (2026-11-21)

Request: "update and upgrade observability site to be reality loop SOT for the system, all
apex-zen level, navigation with no chaos, lower entropy".

Implemented in `public/_shared/observatory.js` (renderer) + `public/arifos/index.html`
(asset version bump `?v=20261121-loop1`):

- **Reality-loop spine** — a single sticky index row above the NOW strip:
  `OBSERVE → REASON → PLAN → EXECUTE → VERIFY → SEAL → DEPLOY → IMPROVE`.
  Each phase chip carries a LIVE verdict read from the observatory snapshot, its state
  class (blue = flow, red = critical, yellow = human/authority), and its SOT pointer.
  Live values with the real snapshot: OBSERVE `NOT_PROVEN` · REASON `PER_ACTION` ·
  PLAN `RETAK` (the intelligence pipeline has a break — reported, not hidden) ·
  EXECUTE `8/8 proven` · VERIFY `FLOWING` · SEAL `sealed head seq=79` ·
  DEPLOY `ALIGNED` · IMPROVE `human+ai+earth`.
- **Apex-zen band** — 4 anchors under the spine: Constitution F1–F13 · Doctrine (APEX-ZEN)
  · Evidence ledger · Sovereign authority. Gold rule, each linking its canonical surface.
- **One hierarchy (entropy ↓)** — every panel now declares the phase it belongs to via
  `data-loop-phase`; the spine is the only index, so no second legend competes with it.
- **Testable without a browser** — `scripts/test-loop-spine.mjs` runs the SHIPPED spine
  code against a DOM shim + the real snapshot (Chrome cannot launch as root on this box).
  It caught a real bug on first run: composite values rendering as `[object Object]`
  (VERIFY) — fixed by a scalar extractor in `loopScalar()`; the test now asserts against
  that class of defect.

Deferred (deliberately, to keep entropy down — each needs its own ruling):
floor list vs floor-measurement cards, and the organ cards vs pulse table, still render
the same numbers twice. Deduplicating them means choosing ONE authoritative cell per
number — a semantic decision, not a CSS one.
