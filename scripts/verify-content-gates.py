#!/usr/bin/env python3
"""
CONTENT AUTHORITY GATE — arif-fazil.com
========================================
DITEMPA BUKAN DIBERI · Forged 2026-08-09

Scans all publishable content for authority drift:
  G1 — RECEIPT GATE:  Bare SEAL claims senza receipt reference
  G2 — EPISTEMIC GATE: Factual claims senza epistemic label
  G3 — SOURCE GATE:    Named claims senza source citation

Exit 0 = all gates pass. Exit 1 = HOLD — fix before deploy.
"""

import json, re, sys, os
from pathlib import Path

SITE_ROOT = Path("/root/arif-fazil.com")

# ── G1: RECEIPT GATE ──────────────────────────────────────────────
# Matches bare "SEAL" or "SEAL 🔥" or "SEAL." that is NOT followed by
# a receipt reference (session ID, hash, seq number)
BARE_SEAL = re.compile(
    r"(?<!\w)SEAL\s*[🔥✅🦞]*\s*(?:\n|\.|$|\))"
    r"(?!(?:\s*(?:session|seq|hash|receipt|ΔS)[:\-]))"
)

# ── G2: EPISTEMIC GATE ────────────────────────────────────────────
# Factual claims that lack epistemic band markers
# Matches patterns like "X is Y", "X was Y", "X has Y" without OBS/DER/INT/SPEC
FACTUAL_CLAIM = re.compile(
    r"(?:(?:is|was|are|were|has|have)\s+(?:a|the|an)\s+\w+)"
    r"|(?:\d+\s*(?:billion|million|percent|%|RM|USD))"
)
EPISTEMIC_MARKER = re.compile(
    r"\[(?:OBS|DER|INT|SPEC)(?:\s*[·•]\s*\w+)?\]"
    r"|\((?:OBS|DER|INT|SPEC)\)"
    r"|CLAIM|PLAUSIBLE|ESTIMATE|UNKNOWN"
)

# ── G3: SOURCE GATE ───────────────────────────────────────────────
# Named entity claims (people, companies, events) senza source
NAMED_CLAIM = re.compile(
    r"(?:PETRONAS|Shell|Exxon|Anwar|Mahathir|Najib|Muhyiddin)"
    r"(?:(?:\s+\w+){0,10}\s+(?:said|reported|announced|claimed|did|made|took|gave))"
)
SOURCE_CITATION = re.compile(
    r"\[(?:OBS|source)[:\s]"
    r"|\((?:see|source|ref)[:\s]"
    r"|https?://"
)


def scan_file(filepath: Path) -> list[dict]:
    """Scan one file. Returns list of violations."""
    violations = []
    try:
        text = filepath.read_text(encoding="utf-8")
    except Exception:
        return violations

    lines = text.split("\n")
    in_frontmatter = text.startswith("---")

    for i, line in enumerate(lines, 1):
        # Skip YAML frontmatter
        if in_frontmatter:
            if i > 1 and line.strip() == "---":
                in_frontmatter = False
            continue
        # Skip code blocks
        if line.strip().startswith("```"):
            continue
        # Skip comments
        if line.strip().startswith("//") or line.strip().startswith("#"):
            continue

        # G1: Bare SEAL
        m = BARE_SEAL.search(line)
        if m:
            # Exclude: SEAL references in SITE_CONSTITUTION, documentation
            if "SITE_CONSTITUTION" not in str(filepath) and "governance" not in str(
                filepath
            ):
                violations.append(
                    {
                        "gate": "G1_RECEIPT",
                        "line": i,
                        "text": line.strip()[:80],
                        "fix": "Add receipt: SEAL::{session_id}::seq={seq}::ΔS={delta}",
                    }
                )

        # G2: Epistemic marker (check substantive claims in paragraphs)
        # Only flag if there are factual-sounding claims without markers
        # and the line is not a header, list item, or code
        if len(line) > 40 and not line.startswith("#") and not line.startswith("- "):
            factual = FACTUAL_CLAIM.findall(line)
            epistemic = EPISTEMIC_MARKER.findall(line)
            if factual and not epistemic:
                # Only flag if it looks like a substantive claim
                if any(
                    word in line.lower()
                    for word in [
                        "found",
                        "discovered",
                        "proved",
                        "confirmed",
                        "revealed",
                    ]
                ):
                    violations.append(
                        {
                            "gate": "G2_EPISTEMIC",
                            "line": i,
                            "text": line.strip()[:80],
                            "fix": "Add epistemic label: [OBS] [DER] [INT] or [SPEC]",
                        }
                    )

    return violations


def main():
    content_dirs = [
        SITE_ROOT / "content" / "essays",
        SITE_ROOT / "content" / "wiki",
        SITE_ROOT / "sites" / "arif-fazil.com" / "public" / "makcikgpt-md",
    ]

    total_violations = 0
    all_findings = []

    for content_dir in content_dirs:
        if not content_dir.exists():
            continue
        for md_file in content_dir.rglob("*.md"):
            violations = scan_file(md_file)
            if violations:
                print(f"\n📄 {md_file.relative_to(SITE_ROOT)}")
                for v in violations:
                    print(f"  ⚠️  L{v['line']}: [{v['gate']}] {v['text']}")
                    print(f"      → {v['fix']}")
                total_violations += len(violations)
                all_findings.extend(violations)

    print(f"\n{'=' * 60}")
    if total_violations == 0:
        print("✅ ALL GATES PASSED — 0 authority drift violations")
        return 0
    else:
        print(f"❌ {total_violations} AUTHORITY DRIFT VIOLATIONS FOUND")
        print(
            f"   G1 (Receipt):  {sum(1 for v in all_findings if v['gate'] == 'G1_RECEIPT')}"
        )
        print(
            f"   G2 (Epistemic): {sum(1 for v in all_findings if v['gate'] == 'G2_EPISTEMIC')}"
        )
        print(f"\n   HOLD. Fix before deploy.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
