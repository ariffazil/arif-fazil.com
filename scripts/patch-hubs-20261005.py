#!/usr/bin/env python3
"""
patch-hubs-20261005.py — F13 binary A/B remediation on static hub pages.

1. Replace old 6-link nv-primary nav (About/Work/Earth/Civic/Writing/Briefing)
   with the canon 5-door nav (Explore/Read/Build/Evidence/About) and add the
   secondary organ strip (7 organs, from /root/web-canon/canon/navigation.json).
2. Fix /999/ og:description "Every claim sealed" -> honest wording.
   (body already honest: Causal Witness Ledger + GAPS DETECTED banner)

Applies to: repo public/, repo dist/, /var/www/html/arif/, top-level /var/www/html/
Backs up every touched file. Idempotent (skips already-patched files).
"""
import re, os, shutil, sys

SITES = "/root/arif-fazil.com/sites/arif-fazil.com"
BACKUP = "/root/arif-fazil.com/backups/hub-nav-20261005"

CANON_NAV = (
    '<nav class="nv-primary" aria-label="Primary">'
    '<a href="/earth/">Explore</a><a href="/words/">Read</a>'
    '<a href="/work/">Build</a><a href="/999/">Evidence</a>'
    '<a href="/institution/">About</a></nav>'
)
ORGAN_STRIP = (
    '<div class="nv-organs" aria-label="Powered by arifOS" '
    'style="display:flex;flex-wrap:wrap;gap:.75rem;padding:6px 0;'
    'font:11px/1.6 ui-monospace,monospace;letter-spacing:.04em;opacity:.75">'
    '<span>Powered by arifOS:</span>'
    '<a href="/canon/">arifOS</a>·<a href="/forge/">A-FORGE</a>·'
    '<a href="/machines/">AAA</a>·<a href="https://geox.arif-fazil.com">GEOX</a>·'
    '<a href="https://wealth.arif-fazil.com">WEALTH</a>·'
    '<a href="https://well.arif-fazil.com">WELL</a>·'
    '<a href="https://arifflow.arif-fazil.com">arifFlow</a></div>'
)
NEW_BLOCK = CANON_NAV + ORGAN_STRIP

NAV_RE = re.compile(r'<nav class="nv-primary"[^>]*>.*?</nav>', re.S)
OLD_OG = 'content="Every claim sealed. Don\'t trust this site — verify it."'
NEW_OG = ('content="Causal Witness Ledger — verifier state live, gaps recorded not erased. '
          'Don\'t trust this site — verify it."')

HUBS = ["earth", "words", "world", "999", "institution"]

def targets():
    for hub in HUBS:
        yield f"{SITES}/public/{hub}/index.html"
        yield f"{SITES}/dist/{hub}/index.html"
        yield f"/var/www/html/arif/{hub}/index.html"
        yield f"/var/www/html/{hub}/index.html"

def backup(path):
    rel = path.lstrip("/").replace("/", "__")
    dst = os.path.join(BACKUP, rel)
    os.makedirs(BACKUP, exist_ok=True)
    if not os.path.exists(dst):
        shutil.copy2(path, dst)

stats = {"nav_replaced": 0, "nav_already": 0, "og_fixed": 0, "missing": 0}
for path in targets():
    if not os.path.exists(path):
        stats["missing"] += 1
        continue
    src = open(path, encoding="utf-8", errors="replace").read()
    out, changed = src, False

    if 'aria-label="Powered by arifOS"' in out:
        stats["nav_already"] += 1
    else:
        out, n = NAV_RE.subn(NEW_BLOCK, out)
        if n:
            stats["nav_replaced"] += n
            changed = True

    if OLD_OG in out:
        out = out.replace(OLD_OG, NEW_OG)
        stats["og_fixed"] += 1
        changed = True

    if changed:
        backup(path)
        with open(path, "w", encoding="utf-8") as f:
            f.write(out)
        print(f"patched {path}")

print(f"nav blocks replaced: {stats['nav_replaced']} | already canon: {stats['nav_already']} | "
      f"og fixed: {stats['og_fixed']} | missing: {stats['missing']}")
