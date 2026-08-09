#!/usr/bin/env python3
"""Inject WEALTH institutional health panel into propa/index.html"""
import subprocess, sys

r = subprocess.run(
    ['python3', 'scripts/wealth-institutional.py'],
    capture_output=True, text=True, timeout=25
)
inst = r.stdout.strip()
if not inst:
    print("  [build] Institutional panel: no data returned, skipping")
    sys.exit(0)

with open('dist/world/propa/index.html', 'r') as f:
    html = f.read()

marker = '<!-- B11-E: RECENT EVENTS PANEL'
if marker in html:
    html = html.replace(marker, inst + '\n\n' + marker)
    with open('dist/world/propa/index.html', 'w') as f:
        f.write(html)
    print(f'  [build] Institutional panel injected ({len(html)} bytes)')
else:
    print(f'  [build] Institutional panel: marker not found in dist/world/propa/index.html, skipping')
