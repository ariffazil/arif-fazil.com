#!/usr/bin/env python3
"""
redirect-lint — does the redirect map agree with the wire AND with the pages it lands on?

Three checks, all mandatory. A run that examines zero rows is NOT a pass.

  A. TARGET ALIVE      every redirect target must answer 200 (not 404/405/410/502/000).
  B. CANONICAL HONESTY target HTML's <link rel="canonical"> must equal the URL that
                       actually served (after redirects). Catches the loop where a page
                       declares a canonical that 301s back to itself.
  C. SLASH TWINS       /x and /x/ must not both answer 200. The unslashed form must
                       301/308 to the slashed one (one shape, not two copies).

Usage:
  python3 scripts/redirect-lint.py                 # checks canon/redirects.yaml + PAGES
  python3 scripts/redirect-lint.py --json          # machine output
Exit: 0 = all checks pass, 1 = at least one FAIL.

Falsifier: for any row this script marks OK, curl it yourself; a 404 on an OK row
falsifies the script, not the wire.
"""

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CANON = ROOT / "canon" / "redirects.yaml"
UA = "redirect-lint/1.0 (+https://arif-fazil.com)"
MAX_HOPS = 5

# Surfaces every run must also examine, independent of the map, because these are
# the doors humans and agents actually land on.
PAGES = [
    "https://arif-fazil.com/",
    "https://arif-fazil.com/arifos/",
    "https://arif-fazil.com/institution/",
    "https://aaa.arif-fazil.com/",
    "https://mcp.arif-fazil.com/",
    "https://wiki.arif-fazil.com/",
]


def parse_map(path):
    """Minimal from:/to: pair reader — the file is a flat list of rows."""
    rows, cur = [], {}
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        m = re.match(r"\s*-?\s*(from|to):\s*(\S+)", line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip("'\"")
        if key == "from":
            if cur.get("from"):
                rows.append(cur)
            cur = {"from": val}
        else:
            cur["to"] = val
    if cur.get("from"):
        rows.append(cur)
    return [r for r in rows if r.get("to")]


def fetch(url):
    """Follow redirects manually; return (chain, final_url, status, content_type, body)."""
    chain, cur = [], url
    for _ in range(MAX_HOPS):
        req = urllib.request.Request(cur, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                body = r.read(400_000).decode("utf-8", "replace")
                return (
                    chain,
                    r.geturl(),
                    r.status,
                    r.headers.get("content-type", ""),
                    body,
                )
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 303, 307, 308):
                loc = e.headers.get("location", "")
                chain.append((cur, e.code, loc))
                cur = urllib.parse.urljoin(cur, loc)
                continue
            return chain, cur, e.code, e.headers.get("content-type", ""), ""
        except Exception as e:  # noqa: BLE001 - 000 class: unreachable, not "down"
            return chain, cur, 0, f"error:{type(e).__name__}", ""
    return chain, cur, 0, "error:too_many_hops", ""


SCRIPT_BLOCK = re.compile(r"<script\b[^>]*>.*?</script>", re.S)


def strip_edge(html):
    """Cloudflare injects a unique per-response script; every body therefore differs.
    Comparing raw bodies always reports 'not identical', and a soft-404 never matches
    the homepage body. Strip ALL script blocks before comparing structure."""
    return SCRIPT_BLOCK.sub("", html)


def canon_of(html):
    m = re.search(
        r'<link[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', html, re.I
    ) or re.search(
        r'<link[^>]+href=["\']([^"\']+)["\'][^>]*rel=["\']canonical["\']', html, re.I
    )
    return m.group(1) if m else None


def norm(u):
    u = u.split("#")[0]
    if u.endswith("/") and u.count("/") > 3:
        return u
    return u


def main():
    results = []

    def record(check, subject, ok, detail):
        results.append({"check": check, "subject": subject, "ok": ok, "detail": detail})

    # ---- A: targets in the map must be alive
    rows = parse_map(CANON) if CANON.exists() else []
    if not rows:
        record("A", str(CANON), False, "no rows parsed — zero examined is not a pass")

    # Baseline: what does a real page look like? A path that answers 200 with the
    # HOMEPAGE body is a soft-404 (deceptive 200), not a live target.
    _, home_final, home_status, _, home_body = fetch("https://arif-fazil.com/")
    home_norm = strip_edge(home_body) if home_status == 200 else ""

    targets = {}
    for r in rows:
        to = r["to"]
        if not to.startswith("http"):
            to = urllib.parse.urljoin("https://arif-fazil.com", to)
        targets.setdefault(to, []).append(r["from"])

    for url, sources in targets.items():
        chain, final, status, ctype, body = fetch(url)
        src = ",".join(sources[:2])
        if status != 200:
            record(
                "A",
                f"{src} -> {url}",
                False,
                f"HTTP {status} (final {final}); chain={[(c, s) for c, s, _ in chain]}",
            )
            continue
        # A 200 that returns the HOMEPAGE body on a non-root path is a soft-404:
        # the target does not exist, the server just answers politely.
        if (
            "html" in ctype
            and home_norm
            and strip_edge(body) == home_norm
            and urllib.parse.urlparse(final).path not in ("/", "")
        ):
            record(
                "A",
                f"{src} -> {url}",
                False,
                "SOFT-404: HTTP 200 but body is the homepage — target does not exist",
            )
            continue
        record(
            "A", f"{src} -> {url}", True, f"200 ({len(body)} B, {ctype.split(';')[0]})"
        )

        # ---- B: canonical honesty on HTML targets
        if "html" in ctype:
            c = canon_of(body)
            if c is None:
                record(
                    "B", url, True, "no rel=canonical (warn: HTML without canonical)"
                )
            elif norm(c) != norm(final):
                record(
                    "B",
                    url,
                    False,
                    f"canonical={c} but served={final} — canonical points elsewhere "
                    f"(loop or foreign canonical)",
                )
            else:
                record("B", url, True, f"canonical == served ({final})")

    # ---- C: slash twins for every path we touched plus the fixed door list
    paths = set()
    for url in list(targets) + PAGES:
        p = urllib.parse.urlparse(url)
        if p.path.endswith("/") and p.path != "/":
            paths.add(f"{p.scheme}://{p.netloc}{p.path}")
    for slashed in sorted(paths):
        bare = slashed.rstrip("/")
        _, _, s_bare, _, body_bare = fetch(bare)
        _, _, s_slash, _, body_slash = fetch(slashed)
        if s_bare == 200 and s_slash == 200:
            same = strip_edge(body_bare) == strip_edge(body_slash)
            record(
                "C",
                bare,
                False,
                f"both 200 (identical={same}) — one must 301/308 to the other",
            )
        elif s_bare in (301, 302, 307, 308):
            record("C", bare, True, f"{s_bare} -> {slashed}")
        else:
            record("C", bare, True, f"bare={s_bare} slashed={s_slash} (no twin)")

    # ---- also check the fixed doors for canonical honesty
    for url in PAGES:
        _, final, status, ctype, body = fetch(url)
        if status == 200 and "html" in ctype:
            c = canon_of(body)
            if c and norm(c) != norm(final):
                record("B", url, False, f"canonical={c} but served={final}")
            elif c:
                record("B", url, True, f"canonical == served ({final})")

    fails = [r for r in results if not r["ok"]]
    if "--json" in sys.argv:
        print(
            json.dumps(
                {"examined": len(results), "fail": len(fails), "results": results},
                indent=2,
            )
        )
    else:
        for r in results:
            print(
                f"[{'PASS' if r['ok'] else 'FAIL'}] {r['check']} {r['subject']} :: {r['detail']}"
            )
        print(f"\nexamined={len(results)} fail={len(fails)}")
        print("VERDICT:", "FAIL" if fails else "PASS")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
