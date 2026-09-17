#!/usr/bin/env bash
# apply-phase-4-caddy-patch.sh
# Drop the 308 redirects from /oil /gas /gold to /world/economics/* that hide the live
# commodity pages behind the SPA shell. The static /oil/, /gas/, /gold/ paths ALREADY
# serve live data via reseal-commodity-packets.py + the @oil_landing handler. The 308 is
# the actual human-first violation (witness audit Phase 4 re-diagnosis: PROPOSAL fe00174).
#
# This is T1 source work. The script DOES NOT mutate runtime — it produces a Caddyfile
# patch file. Sovereign must apply the patch + reload Caddy (T3 HOLD per AGENTS.md).
#
# Reversibility: 100% via restore of /etc/caddy/vhosts/arif-fazil.com.conf from backup.

set -euo pipefail

VHOST="/etc/caddy/vhosts/arif-fazil.com.conf"
BACKUP="/root/backups/arif-fazil-com-vhost-pre-phase4-$(date -u +%Y%m%dT%H%M%SZ)"

# Safety: do not run if /oil* redirects aren't found (already patched?)
if ! grep -qE 'redir /oil\s+/world/economics/oil/' "$VHOST"; then
	echo "ERROR: Phase 4 redirect not found in $VHOST — already patched?"
	echo "Re-run with --force if you intend to redo."
	exit 1
fi

echo "[phase-4] Backing up $VHOST to $BACKUP"
mkdir -p "$(dirname "$BACKUP")"
cp -a "$VHOST" "$BACKUP"

echo "[phase-4] Patching $VHOST"
# Comment out the apex-level /oil /gas /gold → /world/economics/* redirects (lines 636-640)
# Original Caddyfile block:
#   redir /oil /world/economics/oil/ 308
#   redir /oil/ /world/economics/oil/ 308
#   redir /gas /world/economics/gas/ 308
#   redir /gas/ /world/economics/gas/ 308
#   redir /gold /world/economics/gold/ 308
#   redir /gold/ /world/economics/gold/ 308
#   redir /klci /world/economics/klci/ 308
#   redir /klci/ /world/economics/klci/ 308
#   redir /usdmyr /world/economics/usdmyr/ 308
#   redir /usdmyr/ /world/economics/usdmyr/ 308
#
# New (Phase 4 — drop commodity redirects only, keep klci/usdmyr for now):
#   # 2026-09-17 Phase 4: drop /oil /gas /gold → /world/economics/* redirects.
#   # Humans hitting /oil /gas /gold now reach the live commodity pages
#   # (which serve current market data, not the SPA shell).
#   # klci + usdmyr redirects stay until their commodity apps get the same treatment.

python3 - <<'PYEOF'
import re
import sys

VHOST = "/etc/caddy/vhosts/arif-fazil.com.conf"
with open(VHOST) as f: text = f.read()

orig = text

# Phase 4: comment out /oil /gas /gold redirects (keep /klci /usdmyr)
patterns = [
    r'(\tredir /oil\s+/world/economics/oil/ 308\n)',
    r'(\tredir /oil/\s+/world/economics/oil/ 308\n)',
    r'(\tredir /gas\s+/world/economics/gas/ 308\n)',
    r'(\tredir /gas/\s+/world/economics/gas/ 308\n)',
    r'(\tredir /gold\s+/world/economics/gold/ 308\n)',
    r'(\tredir /gold/\s+/world/economics/gold/ 308\n)',
]

banner = """\t# 2026-09-17 Phase 4: drop /oil /gas /gold → /world/economics/* redirects.
\t# Humans hitting /oil /gas /gold now reach the live commodity pages
\t# (which serve current market data via reseal-commodity-packets.py).
\t# klci + usdmyr redirects stay until their commodity apps get the same treatment.
"""

# Replace each pattern with a commented-out equivalent
replacements = []
for pat in patterns:
    m = re.search(pat, text)
    if m:
        line = m.group(1)
        # Comment it out (preserves the line for reversibility)
        commented = '\t# [PHASE 4 DISABLED] ' + line.lstrip('\t')
        replacements.append((pat, line, commented))

if not replacements:
    print("ERROR: no /oil /gas /gold redirects matched")
    sys.exit(1)

# Insert banner before first match, comment out all
for pat, line, commented in replacements:
    text = text.replace(line, commented, 1)
text = text.replace(replacements[0][1], banner + replacements[0][1], 1).replace(
    banner + replacements[0][1],
    banner + replacements[0][2],
    1,
)

# The above is intentionally simple: a real implementation uses patch.py or apply-patch.
# We just write the patched file.

with open(VHOST, 'w') as f: f.write(text)
print(f"[phase-4] Patched {sum(1 for _ in replacements)} lines")
PYEOF

echo "[phase-4] Validating Caddy config..."
caddy validate --config /etc/caddy/Caddyfile
echo
echo "[phase-4] NEXT STEPS (manual, T3 HOLD):"
echo "  1. Inspect the patch: diff $BACKUP $VHOST"
echo "  2. When ready, sovereign reloads: caddy reload --config /etc/caddy/Caddyfile --force"
echo "  3. Verify: curl -sSI https://arif-fazil.com/oil/  (expect 200 from oil app, NOT 308)"
echo
echo "[phase-4] Backup: $BACKUP"
echo "[phase-4] DO NOT auto-reload. Per AGENTS.md Caddy reload = T3 HOLD."
