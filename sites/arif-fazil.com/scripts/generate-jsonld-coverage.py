#!/usr/bin/env python3
"""JSON-LD coverage stamper for arif-fazil.com (apex webroot).

Campaign 2026-11-21 (Arif F13 order: complete the graph, not the redesign).
- Walks public/**/index.html (excl. .bak*, dist, redirect stubs).
- Skips pages that already carry application/ld+json (idempotent).
- Stamps ONLY existing site vocabulary: WebPage / Article / BreadcrumbList
  / ListItem / Person — fields derived from the page's own head; nothing
  fabricated (no datePublished, no description without meta).
- Validates every block it writes as strict JSON.

Usage: python3 scripts/generate-jsonld-coverage.py [--dry-run]
Exit 0 when stamping + validation succeed.
"""
import json
import re
import sys
from pathlib import Path

PUB = Path(__file__).resolve().parent.parent / "public"
BASE = "https://arif-fazil.com"
AUTHOR = {"@type": "Person", "name": "Muhammad Arif bin Fazil", "url": BASE + "/"}
SECTION_NAMES = {
    "words": "Words", "work": "Work", "world": "World", "earth": "Earth",
    "arifos": "arifOS", "writing": "Writing", "laws": "Core Laws",
    "about": "About", "pilot": "Design Partner Pilot",
}


def clean_rel(rel: str) -> str:
    rel = re.sub(r"(?:^|/)index\.html$", "", rel)
    return rel.strip("/")


def page_url(rel: str) -> str:
    cleaned = clean_rel(rel)
    return f"{BASE}/{cleaned}/" if cleaned else f"{BASE}/"


def meta_content(head: str, name: str):
    m = re.search(rf'<meta[^>]+name="{name}"[^>]+content="([^"]*)"', head)
    return m.group(1).strip() if m else None


def page_lang(html: str) -> str:
    m = re.search(r'<html[^>]+lang="([^"]+)"', html)
    return m.group(1) if m else "en"


def is_redirect_stub(html: str) -> bool:
    return bool(re.search(r'http-equiv="refresh"|window\.location\.(?:replace|href)\s*=', html[:4000]))


def breadcrumb(rel: str, title: str) -> dict:
    parts = [p for p in clean_rel(rel).split("/") if p]
    items, url = [], BASE
    for i, p in enumerate(parts, 1):
        url += f"/{p}"
        items.append({"@type": "ListItem", "position": i, "item": url + "/",
                      "name": SECTION_NAMES.get(p, p.replace("-", " ").title())})
    items.append({"@type": "ListItem", "position": len(items) + 1, "name": title})
    return {"@type": "BreadcrumbList", "itemListElement": items}


def build_graph(rel: str, title: str, desc, lang: str) -> dict:
    parts = [p for p in clean_rel(rel).split("/") if p]
    url = page_url(rel)
    is_article = (len(parts) >= 3 and parts[0] == "words" and parts[1] == "writing") or \
                 (len(parts) >= 3 and parts[0] == "world" and parts[1] == "makcikgpt")
    crumb = breadcrumb(rel, title)
    graph = []
    if is_article:
        a = {"@type": "Article", "@id": url + "#article", "headline": title,
             "url": url, "author": AUTHOR, "inLanguage": lang,
             "mainEntityOfPage": url}
        if desc:
            a["description"] = desc
        graph.append(a)
    else:
        w = {"@type": "WebPage", "name": title, "url": url, "author": AUTHOR}
        if desc:
            w["description"] = desc
        graph.append(w)
    graph.append(crumb)
    return {"@context": "https://schema.org", "@graph": graph}


def main() -> int:
    dry = "--dry-run" in sys.argv
    stamped, skipped_stub, already, no_title = [], [], 0, []
    for f in sorted(PUB.rglob("index.html")):
        rel = str(f.relative_to(PUB))
        if ".bak" in rel or rel.startswith("dist"):
            continue
        html = f.read_text(errors="replace")
        if "application/ld+json" in html:
            already += 1
            continue
        if is_redirect_stub(html):
            skipped_stub.append(rel)
            continue
        head = html.split("</head>", 1)[0]
        m = re.search(r"<title>([^<]+)</title>", head)
        title = re.sub(r"\s*— Arif Fazil.*$", "", m.group(1)).strip() if m else None
        if not title:
            no_title.append(rel)
            continue
        desc = meta_content(head, "description")
        block = json.dumps(build_graph(rel, title, desc, page_lang(html)),
                           ensure_ascii=False, indent=1)
        json.loads(block)  # validate before write
        stamped.append((rel, json.loads(block)["@graph"][0]["@type"]))
        if not dry:
            tag = f'<script type="application/ld+json">\n{block}\n</script>\n'
            html = html.replace("</head>", tag + "</head>", 1)
            f.write_text(html)
    kinds = {}
    for _, k in stamped:
        kinds[k] = kinds.get(k, 0) + 1
    print(f"already-covered: {already}  stamped: {len(stamped)} {kinds}")
    print(f"redirect-stubs skipped ({len(skipped_stub)}): {', '.join(skipped_stub) or '-'}")
    if no_title:
        print(f"NO-TITLE pages left unstamped ({len(no_title)}): {', '.join(no_title)}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
