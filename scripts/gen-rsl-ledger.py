#!/usr/bin/env python3
"""gen-rsl-ledger.py — Bina <resources> ledger untuk rsl.xml dari fail .md lorong bot.

Setiap entri: url + merkle_leaf (dari front matter seal-999) + sha256 + lastmod.
Idempoten: gantikan blok <resources>…</resources> sedia ada jika wujud.

Guna: python3 gen-rsl-ledger.py [--md-dir DIR] [--rsl FILE]
Lalai: md-dir = /var/www/html/arif/world/makcikgpt (atau arg), rsl = public/rsl.xml dalam repo.
DITEMPA BUKAN DIBERI — FI-008, 2026-09-07.
"""
import argparse, datetime, glob, hashlib, os, re, sys

BEGIN = "  <!-- LEDGER-GENERATED — jangan sunting tangan; jana semula dengan gen-rsl-ledger.py -->"
TAG_RE = re.compile(r"^\s*merkle_leaf:\s*([0-9a-fA-F]{64})\s*$", re.M)
BLOCK_RE = re.compile(
    r"  <!-- LEDGER-GENERATED.*?</resources>\n?", re.S)

def build_entry(path: str, base_url: str) -> str | None:
    raw = open(path, "rb").read()
    text = raw.decode("utf-8", "replace")
    m = TAG_RE.search(text)
    merkle = m.group(1) if m else ""
    sha = hashlib.sha256(raw).hexdigest()
    lm = datetime.datetime.fromtimestamp(os.path.getmtime(path), datetime.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    name = os.path.basename(path)
    url = f"{base_url.rstrip('/')}/{name}"
    mblock = f"\n      <merkle_leaf>{merkle}</merkle_leaf>" if merkle else ""
    return (f"    <resource>\n      <url>{url}</url>\n      <hash algo=\"sha256\">{sha}</hash>"
            f"{mblock}\n      <lastmod>{lm}</lastmod>\n    </resource>")

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--md-dir", default="/var/www/html/arif/world/makcikgpt")
    ap.add_argument("--rsl", default=os.path.join(os.path.dirname(__file__), "..",
                    "sites", "arif-fazil.com", "public", "rsl.xml"))
    ap.add_argument("--base-url", default="https://arif-fazil.com/world/makcikgpt")
    a = ap.parse_args()

    files = sorted(glob.glob(os.path.join(a.md_dir, "*.md")))
    if not files:
        print(f"RALAT: tiada .md di {a.md_dir}", file=sys.stderr)
        return 2

    entries = [e for e in (build_entry(f, a.base_url) for f in files) if e]
    block = f"{BEGIN}\n  <resources count=\"{len(entries)}\">\n" + "\n".join(entries) + "\n  </resources>\n"

    rsl = os.path.abspath(a.rsl)
    body = open(rsl, encoding="utf-8").read()
    if "</rsl>" not in body:
        print(f"RALAT: {rsl} bukan rsl.xml sah", file=sys.stderr)
        return 2
    body = BLOCK_RE.sub("", body)
    body = body.replace("</rsl>", block + "</rsl>")
    open(rsl, "w", encoding="utf-8").write(body)
    print(f"OK: {len(entries)} entri -> {rsl}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
