#!/usr/bin/env bash
# design-lint.sh — agent-chrome prevention (the "5 Rein" forbidden strings).
#
# Failure class: NAMED_GATE_ABSENT — the site doctrine documented this control
# (arif-fazil-site-ops SKILL.md:629) and pointed npm prebuild at it, but the file
# was never created. A gate whose name promises enforcement and does not exist
# is worse than no gate: agents report "design-lint passed" over an absent tool.
#
# Spec (from the skill, implemented literally):
#   scans every public/**/*.html + src/**/*.{tsx,ts,css}
#   for the 5 Rein forbidden chrome strings.
#   Exit 1 on any hit. Wire to `npm run build` prebuild.
#
# The five forbidden strings are chrome leaking from the agent surface into a
# human page. A human reader must never see them.
set -uo pipefail

ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
FORBIDDEN=(
	"Canonical landing:"
	"WHERE AM I?"
	"WHY CARE?"
	"Source of truth:"
	"Rendered by"
)

hits=0
scanned=0

while IFS= read -r f; do
	scanned=$((scanned + 1))
	for s in "${FORBIDDEN[@]}"; do
		if grep -qF -- "$s" "$f"; then
			echo "CHROME-LEAK  $f"
			grep -nF -- "$s" "$f" | head -3 | sed 's/^/     /'
			hits=$((hits + 1))
		fi
	done
done < <(find "$ROOT/public" "$ROOT/src" \( -name "*.html" -o -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -type f 2>/dev/null)

echo "── design-lint ────────────────────────────────"
echo "  scanned: $scanned file(s) · forbidden strings: ${#FORBIDDEN[@]} · leaks: $hits"
if [ "$hits" -gt 0 ]; then
	echo "  VERDICT: FAIL — agent chrome present on a human surface"
	exit 1
fi
echo "  VERDICT: PASS — no agent chrome on any human surface"
exit 0
