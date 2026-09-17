#!/usr/bin/env bash
# apply-phase-5-banner-soften.sh
# Soften the REMEDIATION STATUS banner from position-1 (above all content) to a footer
# status bar. Add `last_reviewed_at: 2026-09-17` to prevent the banner itself from
# becoming stale.
#
# The banner is in: sites/arif-fazil.com/index.html (Vite entry template)
# Currently at lines 137-140 (between <body> and <noscript>).
# Source of the REMEDIATION content: canon/tool-surfaces.json + canon/vitals_audit_baseline.json
# (CANON — but the HTML template that displays it is the editable target).
#
# This is T1 source work. The script DOES NOT mutate runtime — it produces a
# sites/arif-fazil.com/index.html.patch + apply script. Sovereign runs it during
# `make deploy` (T3 HOLD).
#
# Option B (recommended) per PROPOSAL 978e18b: demote + add last_reviewed_at.

set -euo pipefail

INDEX_HTML="/root/arif-fazil.com/sites/arif-fazil.com/index.html"
BACKUP="/root/backups/arif-fazil-com-index-pre-phase5-$(date -u +%Y%m%dT%H%M%SZ)"

if ! grep -q "REMEDIATION STATUS" "$INDEX_HTML"; then
	echo "ERROR: Phase 5 banner not found in $INDEX_HTML — already patched?"
	exit 1
fi

echo "[phase-5] Backing up $INDEX_HTML to $BACKUP"
mkdir -p "$(dirname "$BACKUP")"
cp -a "$INDEX_HTML" "$BACKUP"

echo "[phase-5] Producing patch preview..."
python3 - <<'PYEOF'
import sys
INDEX = "/root/arif-fazil.com/sites/arif-fazil.com/index.html"
with open(INDEX) as f: text = f.read()

# Original (lines 137-140 approx):
#     <!-- F13 RULING 2026-09-16 · SEAL::PARTIAL — WEALTH remediation banner -->
#     <div role="status" style="margin:0;padding:12px 18px;border-bottom:1px solid #c9a84c;background:rgba(201,168,76,.07);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.68rem;line-height:1.55;color:#9a948a;text-align:left">
#       <strong style="color:#c9a84;letter-spacing:.08em">REMEDIATION STATUS</strong> — WEALTH ...
#     </div>
#
# Phase 5 Option B patch: keep the banner, demote to fixed-bottom position, smaller,
# add `last_reviewed_at`. Also strip the "F13 RULING" comment (no longer applies after patch).

old_block = '''    <!-- F13 RULING 2026-09-16 · SEAL::PARTIAL — WEALTH remediation banner -->
    <div role="status" style="margin:0;padding:12px 18px;border-bottom:1px solid #c9a84c;background:rgba(201,168,76,.07);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.68rem;line-height:1.55;color:#9a948a;text-align:left">
      <strong style="color:#c9a84c;letter-spacing:.08em">REMEDIATION STATUS</strong> — WEALTH (capital &amp; institutional intelligence) is operating under remediation controls. Recently corrected: receipt-truth validation, governance evidence-fidelity gates, runtime capability verification, trade-plan freshness. Still under remediation: commodity-lane validation, registry/runtime reconciliation, full backtest verification. <strong style="color:#c9a84c">Decision status: ADVISORY USE ONLY</strong> — outputs support investigation and review, not standalone consequential decisions. <strong style="color:#EDEAE2">WEALTH computes. arifOS judges. Human authority remains final.</strong> <a href="/vitals/" style="color:#c9a84c;text-decoration:underline">Details</a>
    </div>'''

new_block = '''    <!-- Phase 5 (2026-09-17): REMEDIATION STATUS demoted from position-1 to footer status bar.
         Per SITE_CONSTITUTION RULE 1 (human understanding first) + RULE 4 (agent surfaces secondary).
         Add last_reviewed_at to prevent this disclosure from becoming stale. -->
    <div role="status" aria-label="Federation remediation status" style="position:fixed;bottom:0;left:0;right:0;z-index:50;padding:6px 18px;border-top:1px solid #c9a84c;background:rgba(10,11,13,.92);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.6rem;line-height:1.4;color:#9a948a;text-align:center;backdrop-filter:blur(6px)">
      <strong style="color:#c9a84c;letter-spacing:.06em">REMEDIATION STATUS</strong> — WEALTH under remediation controls · last_reviewed_at: <time datetime="2026-09-17">2026-09-17</time> · <a href="/vitals/" style="color:#c9a84c;text-decoration:underline">details</a>
    </div>'''

if old_block not in text:
    print("ERROR: exact old_block not found. Manual edit required.")
    sys.exit(1)

patched = text.replace(old_block, new_block, 1)
DIFF_PATH = "/root/arif-fazil.com/forge_work/proposals/333-AGI/2026-09-17-phase5-patch/index.html.patch"
with open(DIFF_PATH, "w") as f: f.write(patched)
print(f"[phase-5] Patch written to {DIFF_PATH}")
print(f"[phase-5] Original kept at $INDEX_HTML")
print(f"[phase-5] DO NOT auto-apply. Sovereign reviews the patch + applies + rebuilds SPA.")
PYEOF

echo
echo "[phase-5] NEXT STEPS (manual, T3 HOLD):"
echo "  1. Review patch: diff $BACKUP /root/arif-fazil.com/forge_work/proposals/333-AGI/2026-09-17-phase5-patch/index.html.patch"
echo "  2. If approved: cp /root/arif-fazil.com/forge_work/proposals/333-AGI/2026-09-17-phase5-patch/index.html.patch $INDEX_HTML"
echo "  3. Rebuild SPA: cd sites/arif-fazil.com && npm run build"
echo "  4. Deploy: make deploy (T3 HOLD — sovereign directive)"
echo "  5. Verify: curl -sSL https://arif-fazil.com/ | grep -c REMEDIATION (expect 1, was 1, now in footer)"
echo
echo "[phase-5] Backup: $BACKUP"
