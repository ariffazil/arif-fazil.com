# arif-fazil.com — Single Deploy Entry Point
# DITEMPA BUKAN DIBERI
#
# Every agent deploys the same way:
#   make deploy
#
# That's it. One command. The Makefile handles the rest.
# Read DEPLOY.md for the full runbook.

.PHONY: deploy verify build reload status clean help sync-aaa verify-pages

# ── DEFAULT: full deploy ──────────────────────────────────────────────
deploy: verify sync-aaa build verify-pages reload split-roots
	@echo ""
	@echo "═══════════════════════════════════════════"
	@echo "  DEPLOY COMPLETE — arif-fazil.com live"
	@echo "═══════════════════════════════════════════"
	@echo "  Verify:  curl -sI https://arif-fazil.com"
	@echo "  Status:  make status"
	@echo ""

# ── Split-root serving sync (2026-08-25 fix) ─────────────────────────
# Caddy serves /earth* + @root_static from /var/www/html top-level, not
# /var/www/html/arif. Without this step every deploy silently strands
# those files at pre-deploy versions. Syncs dist → top-level + verifies.
split-roots:
	@echo "[split-roots] Syncing top-level serving roots (earth/, root-static)..."
	bash scripts/sync-serving-roots.sh

# ── Dry-run deploy (verify only, no mutation) ─────────────────────────
dry-run: verify
	@echo "✓ Dry-run passed. Ready for deploy."

# ── Pre-deploy verification gate ──────────────────────────────────────
verify: sync-aaa
	@echo "[verify] Checking surface catalog truth..."
	bash scripts/run-gate.sh --gate-id verify.surfaces -- node scripts/verify-surfaces.cjs --base=https://arif-fazil.com
	@echo "[verify] Running Page Inventory Gate..."
	bash scripts/run-gate.sh --gate-id verify.pages -- bash scripts/verify-pages.sh https://arif-fazil.com "$(CURDIR)/sites/arif-fazil.com/dist"
	@echo "[verify] Running Content Assertion Gate..."
	bash scripts/run-gate.sh --gate-id verify.content -- bash scripts/verify-content.sh https://arif-fazil.com
	@echo "[verify] Checking Caddy config..."
	bash scripts/run-gate.sh --gate-id caddy.validate -- caddy validate --config /etc/caddy/Caddyfile && echo "[verify] Caddy config: VALID"
	@echo "[verify] M3 fix 2026-08-01: scanning built/source HTML for dev-only entry points..."
	bash scripts/run-gate.sh --gate-id candidate.stale_dev_entries -- grep -rE 'src="/src/[^"]*"|src="/@vite/|src="/@id/' sites/arif-fazil.com/public/ sites/arif-fazil.com/dist/
	@echo "[verify] No dev-only entry points — safe to deploy."
	@echo "✓ All gates passed."

# ── Sync AAA dist into arif-fazil.com dist ────────────────────────────
sync-aaa:
	@echo "[sync-aaa] Syncing AAA build into arif-fazil.com dist/aaa/..."
	@mkdir -p sites/arif-fazil.com/dist/aaa/
	rsync -av --delete /root/AAA/dist/ sites/arif-fazil.com/dist/aaa/
	@echo "✓ AAA dist synced."

# ── Build the React SPA ───────────────────────────────────────────────
build:
	@echo "[build] Regenerating the WITNESS LEDGER before the SPA build..."
	cd sites/arif-fazil.com && python3 scripts/build-ledger.py --out public/ledger
	@echo "[build] Building arif-fazil.com (React/Vite)..."
	cd sites/arif-fazil.com && npm run build
	@echo "[build] Regenerating discovery catalogs..."
	cd sites/arif-fazil.com && node scripts/generate-discovery.cjs
	@echo "✓ Build complete."

# ── Witness ledger only (no full SPA build) ───────────────────────────
# The ledger must be a BUILD OUTPUT, not a file hand-placed in the webroot:
# deploy-site.sh rsyncs with --delete, and site[0] declares no overlays, so
# anything outside the staged build tree is removed on the next deploy.
# Writing into public/ puts it in dist/ via Vite's publicDir, which makes it
# durable. Regenerate + publish without touching the SPA:
ledger:
	@echo "[ledger] Regenerating the WITNESS LEDGER..."
	cd sites/arif-fazil.com && python3 scripts/build-ledger.py --out public/ledger
	@echo "[ledger] Mirroring into dist/ and the live webroot..."
	cp -a sites/arif-fazil.com/public/ledger/. sites/arif-fazil.com/dist/ledger/
	mkdir -p /var/www/html/arif/ledger
	cp -a sites/arif-fazil.com/public/ledger/. /var/www/html/arif/ledger/
	@echo "✓ Ledger rebuilt and live. Verify: sh /var/www/html/arif/ledger/verify.sh"

# ── Reload Caddy (apply config changes) ───────────────────────────────
reload:
	@echo "[reload] Validating Caddy config..."
	caddy validate --config /etc/caddy/Caddyfile
	@echo "[reload] Reloading Caddy..."
	systemctl reload caddy
	@echo "✓ Caddy reloaded."

# ── Status check ──────────────────────────────────────────────────────
status:
	@echo "=== Caddy ==="
	@systemctl is-active caddy 2>/dev/null || echo "DOWN"
	@echo ""
	@echo "=== Key surfaces ==="
	@for url in https://arif-fazil.com https://arif-fazil.com/surfaces.json https://arif-fazil.com/llms.txt https://arif-fazil.com/robots.txt https://arif-fazil.com/rsl.xml; do \
		code=$$(curl -sI -o /dev/null -w '%{http_code}' "$$url" 2>/dev/null); \
		printf "  %-50s HTTP %s\n" "$$url" "$$code"; \
	done
	@echo ""
	@echo "=== Git ==="
	@git status --short 2>/dev/null | head -10
	@echo ""
	@echo "=== Last deploy ==="
	@git log --oneline -1 2>/dev/null || echo "  No commits"

# ── Git: commit all changes ───────────────────────────────────────────
commit:
	@git add -A
	@git status --short | head -20
	@echo ""
	@echo "Ready to commit. Run: git commit -m '...' && git push"

# ── Full deploy via deploy-vps.sh (for rsync-based deploys) ───────────
deploy-full:
	@echo "[deploy-full] Running scripts/deploy-vps.sh..."
	bash scripts/deploy-vps.sh

# ── Help ──────────────────────────────────────────────────────────────
help:
	@echo "arif-fazil.com Deploy"
	@echo "===================="
	@echo ""
	@echo "  make deploy       Full deploy: verify → sync-aaa → build → verify-pages → reload"
	@echo "  make dry-run      Verify only, no mutation"
	@echo "  make verify       Pre-deploy surface truth + Caddy check"
	@echo "  make sync-aaa     Sync AAA dist/ into arif-fazil.com dist/aaa/"
	@echo "  make build        Build React SPA + regenerate catalogs"
	@echo "  make verify-pages Page inventory gate — curl every dist/ page, assert 200"
	@echo "  make reload       Validate + reload Caddy"
	@echo "  make status       Health check (Caddy, surfaces, git)"
	@echo "  make commit       Stage all changes for git commit"
	@echo "  make deploy-full  Full rsync-based deploy (deploy-vps.sh)"
	@echo ""
	@echo "  Single command:   make deploy"
	@echo "  Runbook:          cat DEPLOY.md"

# ── Page inventory gate ─────────────────────────────────────────────
# 2026-08-03: Structural fix. Scans every dist/*/index.html → curls
# live URL → asserts 200. Any gap = HALT. No agent can seal site
# work with unreachable pages.
# DITEMPA BUKAN DIBERI — entropy must not accumulate at integration boundaries.
verify-pages:
	@echo "[verify-pages] Running page inventory gate..."
	@bash scripts/run-gate.sh --gate-id verify.pages --tail 400 -- bash scripts/verify-pages.sh
	@echo ""

# ── Design + metadata gates (2026-11-21, F13 ruling round-2) ─────────
# Offline gates (run in prebuild): token SOT parity + WCAG + usage rules,
# SOT artifact freshness, JSON-LD contract. Live probe is separate
# (verify-live) because it needs the network and a canonical-form sweep.
verify-design:
	@echo "[verify-design] Token parity + WCAG + decorative-as-text gate..."
	@python3 sites/arif-fazil.com/scripts/check-design-tokens.py
	@echo "[verify-design] Token artifact freshness..."
	@python3 sites/arif-fazil.com/scripts/compile-design-tokens.py --check
	@echo "[verify-design] JSON-LD contract (DOM-shaped)..."
	@node sites/arif-fazil.com/scripts/validate-jsonld.mjs
	@echo ""

verify-live:
	@echo "[verify-live] Canonical-form live probe (slash + cache-bust)..."
	@bash sites/arif-fazil.com/scripts/probe-canonical.sh
	@echo ""

# ── Deploy envelope gate (2026-11-21) ────────────────────────────────
# REFUSES to proceed without a signed envelope (approver, sha=HEAD,
# targets, rollback, negative tests). A good outcome never excuses a
# bypassed gate.
require-envelope:
	@bash scripts/require-deploy-envelope.sh
	@echo ""

# ── Served-state gate ───────────────────────────────────────────────
# 2026-11-12: a deploy landed on the copy the route does not read; the
# page-inventory gate PASSed because it checks reachability, not bytes.
# This gate asserts the invariant that actually matters:
#   source artifact -> deployed file -> HTTP served bytes must be equal.
# Exit 0 PASS · 1 FAIL (real defect) · 2 UNKNOWN (never a pass).
verify-served:
	@echo "[verify-served] Verifying served bytes equal the intended artifact..."
	@bash scripts/run-gate.sh --gate-id verify.served_state -- python3 scripts/verify-served-state.py \
		--url https://arif-fazil.com/earth/ \
		--source sites/arif-fazil.com/public/earth/index.html
	@echo ""

verify-served-selftest:
	@echo "[verify-served-selftest] Proving the served-state gate can fail..."
	@python3 scripts/verify-served-state.selftest.py
	@echo ""
