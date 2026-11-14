#!/usr/bin/env python3
"""verify-served-state.selftest.py — prove the served-state gate actually fails.

A gate that cannot fail is a comment. This self-test builds the exact
2026-11-12 failure in a temp directory and asserts that the verifier:

  1. PASSES when the URL serves the intended artifact;
  2. FAILS when the URL serves something else (the intended source is newer);
  3. FAILS, and NAMES THE MIRROR, when the artifact was written to the copy
     the route does not read — the split-root trap that the site's existing
     preflight gate reported as PASS;
  4. STRIPS the Cloudflare-injected challenge script before hashing, so an
     edge-injected body does not read as a different artifact;
  5. Returns UNKNOWN (exit 2), not FAIL, when the served bytes cannot be
     attributed to any candidate — an unattributable difference is not a
     demonstrated defect.

No network beyond localhost. No live surface is touched.

DITEMPA BUKAN DIBERI
"""

from __future__ import annotations

import http.server
import shutil
import socketserver
import subprocess
import sys
import tempfile
import threading
from pathlib import Path

HERE = Path(__file__).resolve().parent
VERIFIER = HERE / "verify-served-state.py"

BODY = b"<!DOCTYPE html>\n<html><head><title>SPLIT ROOT PROBE</title></head><body><p>artifact</p></body></html>\n"
NEWER = BODY.replace(b"artifact</p>", b"artifact v2</p>")

CF_INJECT = (
    b'<script>(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);'
    b"if(b){var d=b.createElement('script');d.innerHTML=\"window.__CF$cv$params={r:'abc',t:'MTc5'}\";}})();</script>"
)


class _Quiet(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler pinned to an explicit directory.

    The stdlib handler sets ``self.directory`` in __init__ and ignores a class
    attribute, so the directory has to be passed per-construction.
    """

    root = "."

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=self.root, **kwargs)

    def log_message(self, format=None, *args):  # noqa: A002 - stdlib signature
        pass


def serve(directory: Path) -> tuple[socketserver.TCPServer, str]:
    handler = type("_H", (_Quiet,), {"root": str(directory)})
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return httpd, f"http://127.0.0.1:{httpd.server_address[1]}"


def run(url: str, source: str | None, webroots: list[str]) -> tuple[int, str]:
    cmd = [sys.executable, str(VERIFIER), "--url", url]
    if source:
        cmd += ["--source", source]
    for w in webroots:
        cmd += ["--webroot", w]
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.returncode, p.stdout


def main() -> int:
    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        print(f"  {'PASS' if cond else 'FAIL'}  {name}" + (f"  — {detail}" if detail and not cond else ""))
        if not cond:
            failures.append(name)

    tmp = Path(tempfile.mkdtemp(prefix="served-state-selftest-"))
    try:
        # Two webroots, exactly like the live split: /html and /html/arif
        plain = tmp / "html"
        mirror = tmp / "html" / "arif"
        servedir = tmp / "served"
        (plain / "earth").mkdir(parents=True)
        (mirror / "earth").mkdir(parents=True)
        (servedir / "earth").mkdir(parents=True)

        # The artifact exists ONLY in the mirror, and the mirror is what the
        # HTTP server exposes. The plain root has the OLD bytes. This is the
        # live failure: the route reads the mirror, the deploy wrote the plain.
        (mirror / "earth" / "index.html").write_bytes(BODY)
        (plain / "earth" / "index.html").write_bytes(NEWER)
        (servedir / "earth" / "index.html").write_bytes(BODY)  # what the server serves

        source_file = tmp / "source.html"
        source_file.write_bytes(BODY)

        httpd, base = serve(servedir)
        try:
            url = f"{base}/earth/"

            # 1 + 3: the URL serves the mirror's bytes; the plain root has
            # different bytes and must NOT be blamed.
            code, out = run(url, str(source_file), [str(plain), str(mirror)])
            check("served bytes equal the source → PASS (exit 0)", code == 0, f"exit={code}\n{out}")
            check(
                "attribution names the MIRROR, not the plain root",
                str(mirror / "earth" / "index.html") in out,
                out,
            )

            # 2: source newer than served → FAIL
            newer_source = tmp / "source_newer.html"
            newer_source.write_bytes(NEWER)
            code, out = run(url, str(newer_source), [str(plain), str(mirror)])
            check("source != served → FAIL (exit 1)", code == 1, f"exit={code}\n{out}")

            # 3: the trap — source written to the copy the route does NOT read.
            # The plain root now holds the source; the URL still serves the mirror.
            (plain / "earth" / "index.html").write_bytes(BODY)  # deploy landed HERE
            (mirror / "earth" / "index.html").write_bytes(NEWER)  # the route reads HERE
            (servedir / "earth" / "index.html").write_bytes(NEWER)
            code, out = run(url, str(source_file), [str(plain), str(mirror)])
            check("wrong-copy deploy → FAIL (exit 1)", code == 1, f"exit={code}\n{out}")
            check(
                "wrong-copy failure names the mirror that is actually serving",
                str(mirror / "earth" / "index.html") in out,
                out,
            )

            # 4: the edge-injected challenge script must not change the hash.
            (mirror / "earth" / "index.html").write_bytes(BODY + CF_INJECT)
            (servedir / "earth" / "index.html").write_bytes(BODY + CF_INJECT)
            code, out = run(url, str(source_file), [str(plain), str(mirror)])
            check("edge-injected challenge script is stripped before hashing → PASS", code == 0, f"exit={code}\n{out}")

            # 5: unattributable difference → UNKNOWN (exit 2), not FAIL
            (servedir / "earth" / "index.html").write_bytes(b"<html>something else entirely</html>")
            code, out = run(url, str(source_file), [str(plain), str(mirror)])
            check("unattributable served bytes → UNKNOWN (exit 2)", code == 2, f"exit={code}\n{out}")
        finally:
            httpd.shutdown()
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    print()
    if failures:
        print(f"SELF-TEST FAILED: {len(failures)} check(s) — {', '.join(failures)}")
        return 1
    print("SELF-TEST PASSED: 7/7 checks — the gate can fail, and it fails on the split-root trap.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
