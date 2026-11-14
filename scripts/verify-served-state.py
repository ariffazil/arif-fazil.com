#!/usr/bin/env python3
"""verify-served-state.py — close the gate that passed while the page did not change.

The defect this exists to prevent
----------------------------------
On 2026-11-12 a change was rsynced to `/var/www/html/earth/index.html`. The
rsync succeeded, the site's preflight gate reported PASS on all four checks
(split-root, orphan-assets, phantom-200, redaction), and the public URL kept
serving the OLD bytes — because `/earth/` is served from the *mirror* at
`/var/www/html/arif/earth/`, not from the copy that was written.

A gate that verifies transport and process success is not verifying deployment
success. The invariant that actually matters is:

    SOURCE ARTIFACT  ──hash──▶  DEPLOY TARGET  ──hash──▶  HTTP SERVED ARTIFACT
                                                            must equal expected

This script measures that chain. It does not assume which local file the URL
serves — it DISCOVERS it by matching the served bytes against the candidate
files on disk, because a route can be split across two webroots (the earth
route family is: homepage from /var/www/html/arif, subpages from
/var/www/html).

Exit codes:
    0  PASS     — every URL serves exactly the intended artifact
    1  FAIL     — a real defect: a URL serves something other than the intent
    2  UNKNOWN  — cannot attribute the served bytes to any candidate

Usage:
    python3 scripts/verify-served-state.py \
        --url https://arif-fazil.com/earth/ \
        --source sites/arif-fazil.com/public/earth/index.html

    # several routes at once (url/source pairs, positionally)
    python3 scripts/verify-served-state.py \
        --url https://arif-fazil.com/earth/ \
        --url https://arif-fazil.com/earth/kinabalu-basin/ \
        --source sites/arif-fazil.com/public/earth/index.html \
        --source sites/arif-fazil.com/public/earth/kinabalu-basin/index.html

DITEMPA BUKAN DIBERI
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# Cloudflare injects a JS challenge-platform block into HTML responses. It is
# not part of the artifact, so it is removed before hashing. The pattern is
# distinctive on purpose: a real page script must never be stripped.
_CF_BLOCK = re.compile(
    r"<script[^>]*>(?:(?!</script>).)*?(?:__CF\$cv\$params|cdn-cgi/challenge-platform)(?:(?!</script>).)*?</script>",
    re.DOTALL | re.IGNORECASE,
)


def normalize(raw: bytes) -> bytes:
    """Strip edge-injected markup so the hash measures the artifact, not the edge."""
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw
    stripped = _CF_BLOCK.sub("", text)
    return stripped.strip().encode("utf-8")


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def fetch(url: str, timeout: int = 25) -> tuple[int, bytes, str]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "verify-served-state/1.0 (+arif-fazil.com)",
            "Accept": "*/*",
            "Accept-Encoding": "identity",  # never hash a compressed body
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read(), resp.headers.get("cf-cache-status", "") or ""
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read(), ""
    except Exception as exc:  # network, TLS, timeout
        return 0, f"FETCH_FAILED: {exc}".encode(), ""


def candidates_for(url_path: str, webroots: list[str]) -> list[Path]:
    """Every local file that could be serving this path."""
    out: list[Path] = []
    rel = url_path.strip("/")
    for root in webroots:
        base = Path(root)
        if not rel:
            out.append(base / "index.html")
            continue
        p = base / rel
        out.append(p)
        if p.is_dir():
            out.append(p / "index.html")
        else:
            out.append(base / rel / "index.html")
            out.append(base / (rel + ".html"))
    # de-duplicate, keep order
    seen: set[str] = set()
    uniq: list[Path] = []
    for p in out:
        s = str(p)
        if s not in seen:
            seen.add(s)
            uniq.append(p)
    return uniq


def verify_one(url: str, source: str | None, webroots: list[str]) -> dict:
    path = urllib.parse.urlsplit(url).path
    result: dict = {"url": url, "source": source, "verdict": "UNKNOWN", "reason": ""}

    status, served_raw, cf_cache = fetch(url)
    result["http_status"] = status
    result["cf_cache_status"] = cf_cache
    if status != 200:
        result["reason"] = f"http {status}"
        return result

    served = normalize(served_raw)
    result["served_sha256"] = sha(served)
    result["served_bytes"] = len(served)

    if source:
        sp = Path(source)
        if not sp.exists():
            result["reason"] = f"source not found: {source}"
            return result
        src = normalize(sp.read_bytes())
        result["source_sha256"] = sha(src)
        result["source_bytes"] = len(src)

    # Discover which local file is actually serving this URL.
    matching: list[str] = []
    for cand in candidates_for(path, webroots):
        if not cand.is_file():
            continue
        try:
            cand_sha = sha(normalize(cand.read_bytes()))
        except Exception:
            continue
        result.setdefault("candidates", []).append({"path": str(cand), "sha256": cand_sha})
        if cand_sha == result["served_sha256"]:
            matching.append(str(cand))

    result["served_by"] = matching

    if source:
        if result.get("source_sha256") == result["served_sha256"]:
            result["verdict"] = "PASS"
            result["reason"] = "served bytes equal the intended source artifact"
            return result
        if matching:
            result["verdict"] = "FAIL"
            result["reason"] = (
                "the URL is serving " + ", ".join(matching) + " — NOT the intended source. "
                "The deploy landed on a copy the route does not read."
            )
            return result
        result["verdict"] = "UNKNOWN"
        result["reason"] = "served bytes match no candidate on disk and not the source"
        return result

    if matching:
        result["verdict"] = "PASS"
        result["reason"] = "served bytes attributed to " + ", ".join(matching)
    else:
        result["verdict"] = "UNKNOWN"
        result["reason"] = "served bytes match no candidate on disk"
    return result


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", action="append", required=True, help="public URL to verify (repeatable)")
    ap.add_argument(
        "--source",
        action="append",
        default=[],
        help="intended local artifact (repeatable; paired positionally with --url, or a single one for all)",
    )
    ap.add_argument(
        "--webroot",
        action="append",
        default=[],
        help="webroot to search for the serving copy (default: /var/www/html and /var/www/html/arif)",
    )
    ap.add_argument("--json", help="write the raw result JSON here")
    args = ap.parse_args()

    webroots = args.webroot or ["/var/www/html", "/var/www/html/arif"]
    sources: list[str | None]
    if not args.source:
        sources = [None] * len(args.url)
    elif len(args.source) == 1:
        sources = [args.source[0]] * len(args.url)
    elif len(args.source) == len(args.url):
        sources = list(args.source)
    else:
        print("REFUSED: --source count must be 1 or match --url count", file=sys.stderr)
        return 2

    results = [verify_one(u, s, webroots) for u, s in zip(args.url, sources)]

    if args.json:
        Path(args.json).write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print("═" * 78)
    print("SERVED-STATE VERIFICATION — source artifact → deployed file → HTTP served bytes")
    print("═" * 78)
    for r in results:
        print(f"\n{r['url']}")
        print(f"  http          : {r.get('http_status')}   cf-cache-status: {r.get('cf_cache_status') or '-'}")
        if r.get("source_sha256"):
            print(f"  source sha256: {r['source_sha256'][:16]}  ({r.get('source_bytes')} B)")
        print(f"  served sha256: {r.get('served_sha256', '-')[:16]}  ({r.get('served_bytes', '-')} B)")
        if r.get("served_by"):
            for p in r["served_by"]:
                print(f"  SERVED BY     : {p}")
        for c in r.get("candidates", []):
            print(f"    candidate   : {c['path']}  {c['sha256'][:16]}")
        print(f"  VERDICT       : {r['verdict']} — {r['reason']}")
    print("═" * 78)

    verdicts = {r["verdict"] for r in results}
    if "FAIL" in verdicts:
        return 1
    if "UNKNOWN" in verdicts:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
