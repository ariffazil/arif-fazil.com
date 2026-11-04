#!/usr/bin/env python3
"""mobile-check.py — arif-fazil.com mobile rendering gate.

Usage:
  python3 scripts/mobile-check.py --urls /human,/map       # probe comma list
  python3 scripts/mobile-check.py --all                    # sitemap + known extras
  python3 scripts/mobile-check.py --base http://localhost:4173 --urls /,/about

Exit 0 = all pages fit (overflow <= 8px) and return 200. Exit 1 = any bad page.
Writes JSON report to stdout (last line) and /tmp/mobile-check-last.json.
Evidence tool for the site-completion plan (2026-11-04); wired into weekly-site-check.sh.
"""
import argparse, json, re, subprocess, sys
from playwright.sync_api import sync_playwright

CHROME = "/root/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome"
IPHONE = dict(
    viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True, has_touch=True,
    user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
)

def collect_paths(base):
    if base.rstrip("/").endswith("arif-fazil.com") and base.startswith("https"):
        xml = subprocess.run(["curl", "-s", base + "/sitemap.xml"], capture_output=True, text=True).stdout
        urls = re.findall(r"<loc>([^<]+)</loc>", xml)
        paths = [u.replace(base, "") or "/" for u in urls]
        paths += ["/oil", "/gas", "/gold", "/klci", "/usdmyr", "/human", "/words/doctrine/",
                  "/world/2027/", "/politics/", "/map/", "/ledger", "/organs/", "/arifos/",
                  "/world/petronas/shadow/", "/geox/", "/earth/kinabalu-basin/", "/earth/malay-basin/",
                  "/world/petronas/", "/federation"]
    else:
        paths = ["/"]
    seen, out = set(), []
    for p in paths:
        if p not in seen:
            seen.add(p); out.append(p)
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--urls", help="comma-separated paths, e.g. /human,/map")
    ap.add_argument("--all", action="store_true", help="sitemap + known extras (live base only)")
    ap.add_argument("--base", default="https://arif-fazil.com")
    ap.add_argument("--timeout", type=int, default=20000)
    a = ap.parse_args()

    paths = [p.strip() for p in a.urls.split(",")] if a.urls else collect_paths(a.base)

    report = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox", "--disable-dev-shm-usage"])
        page = browser.new_context(**IPHONE).new_page()
        for path in paths:
            e = {"path": path}
            try:
                r = page.goto(a.base + path, wait_until="domcontentloaded", timeout=a.timeout)
                e["status"] = r.status if r else None
                page.wait_for_timeout(600)
                e.update(page.evaluate("""() => {
                    const d = document.scrollingElement || document.documentElement;
                    let worst = null;
                    if (d.scrollWidth > d.clientWidth + 1) {
                        const vw = d.clientWidth;
                        for (const el of document.querySelectorAll('body *')) {
                            const r = el.getBoundingClientRect();
                            if (r.right > vw + 8 && r.width > 40) {
                                const cls = (typeof el.className === 'string' ? el.className : '').slice(0, 50);
                                worst = `${el.tagName.toLowerCase()}.${cls} right=${Math.round(r.right)}`;
                                break;
                            }
                        }
                    }
                    return { overflowPx: d.scrollWidth - d.clientWidth, worst,
                             title: document.title.slice(0, 60),
                             hasContent: !!(document.querySelector('article, main, .frame, #root *')) };
                }"""))
            except Exception as ex:
                e["error"] = str(ex)[:140]
            report.append(e)
        browser.close()

    bad = [r for r in report if r.get("overflowPx", 0) > 8 or r.get("status") != 200 or r.get("error")]
    with open("/tmp/mobile-check-last.json", "w") as f:
        json.dump({"report": report, "bad": bad}, f, indent=1)
    print(f"TOTAL {len(report)} | OK {len(report)-len(bad)} | BAD {len(bad)}")
    if bad:
        print(json.dumps(bad, indent=1))
    print(f"report: /tmp/mobile-check-last.json")
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    main()
