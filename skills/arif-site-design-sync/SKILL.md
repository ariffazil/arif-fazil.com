---
name: arif-site-design-sync
description: Synchronize design/tokens across all serving trees of arif-fazil.com with governed gates. Use when asked to change site colors, tokens, JSON-LD metadata, or to prepare a deploy of arif-fazil.com.
---

# arif-site-design-sync

Governed sequence for any design/token/metadata change on arif-fazil.com.
Authority: `AGENTS.md` (serving topology, gates, envelope) + `ROUTE-OWNERSHIP.yaml`.

## 0. PRE-FLIGHT (never skip)

- `git status --porcelain` in the MAIN checkout → if dirty, that is another lane's work:
  **freeze, do not clean**. Work in your own worktree only.
- `git worktree list` → confirm no other lane owns your branch.
- Read `ROUTE-OWNERSHIP.yaml` → note every serving tree you will touch.
- Your worktree identity: `git config --worktree user.name "<lane>"` (repo enables
  `extensions.worktreeConfig`). Never commit as another lane.

## 1. TOKEN-BUILD

- Single source: `sites/arif-fazil.com/tokens/design-tokens.json`.
- Edit the SOT, never the compiled copies by hand.
- `python3 sites/arif-fazil.com/scripts/compile-design-tokens.py` → artifacts.
- Functional color rules: `--soul-primary` is decorative only (text → `--soul-primary-text`
  ≥4.5:1, large/UI → `--soul-primary-large` ≥3:1). Blue `--state-info` = agent flow.

## 2. VERIFY (all must pass before you claim anything)

```bash
python3 sites/arif-fazil.com/scripts/check-design-tokens.py   # parity + WCAG + usage rules
node    sites/arif-fazil.com/scripts/validate-jsonld.mjs      # JSON-LD contract (DOM-shaped)
bash    sites/arif-fazil.com/scripts/probe-canonical.sh        # live canonical-form probe
make verify-pages                                               # routes
```

## 3. ENVELOPE (deploy only — needs 888 sign-off)

Write `deploy-envelope.json`: `approver`, `sha` (=HEAD), `targets[]`, `rollback`,
`negative_tests[]`, `signed_at`. Then:

```bash
bash scripts/require-deploy-envelope.sh     # REFUSES without a valid envelope
rsync -a --update --chown=www-data:www-data dist/<tree>/ /var/www/html/<tree>/
```

Never `--delete`. Never reload Caddy unless the Caddyfile changed (separate 888 act).

## 4. TWO-ACTOR

The builder lane never certifies its own deploy. Hand the branch + the sweep results to a
separate read-only verifier lane; the sovereign approves the envelope.

## COMMON TRAPS (learned 2026-11-21)

- Five serving trees; one rsync target is not enough.
- Non-slash URLs can serve a different representation (Markdown) — certify the slash form.
- Cache-bust every live probe (`?v=<nonce>`).
- JSON-LD regex must tolerate extra attributes on the `<script>` tag.
- Never `rm -rf` on this box: use the quarantine protocol
  (`/root/_quarantine/<date>/` + `MANIFEST.json` + `RESTORE.sh`).
