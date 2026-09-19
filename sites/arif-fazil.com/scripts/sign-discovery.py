#!/usr/bin/env python3
"""
sign-discovery.py — Sign discovery surfaces with the vault_attest ed25519 key.

Used by the build pipeline (and discoverable at human-friendly CLI) to:
  - sign agents.txt + llms.txt + soul.json + sitemap.xml + feed.xml
  - verify signatures against the published public key

Key location (DO NOT regenerate, DO NOT share private):
  private: /root/.secrets/aaa-identity/keys/vault_attest_ed25519.pem
  public:  /root/.secrets/aaa-identity/keys/vault_attest_ed25519.pub.pem
  fingerprint: ed25519:sha256:698cc1ab26357272

Reversibility: 100%. Signatures are auxiliary; files remain readable without verification.

Usage:
  python3 scripts/sign-discovery.py --sign <file> [<file> ...]
  python3 scripts/sign-discovery.py --verify <file> <file.sig>
  python3 scripts/sign-discovery.py --all    # sign every discovery surface

Phase 6 of Lebih Bijaksana / Lebih Arif / Penuh Clarity transformation blueprint.
PROPOSAL 333-AGI/2026-09-17-agentic-surface (commit 4eaf095).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)
from cryptography.exceptions import InvalidSignature

# Paths
PRIV_PATH = Path("/root/.secrets/aaa-identity/keys/vault_attest_ed25519.pem")
PUB_PATH = Path("/root/.secrets/aaa-identity/keys/vault_attest_ed25519.pub.pem")
# Fingerprint derived at runtime from the loaded public key (NOT hardcoded)
# so a key rotation doesn't break the script.
_KEY_FINGERPRINT: str | None = None


def _key_fingerprint(pub: Ed25519PublicKey) -> str:
    """SHA-256 fingerprint of raw public key bytes, first 16 hex chars."""
    raw = pub.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    )
    return "ed25519:sha256:" + hashlib.sha256(raw).hexdigest()[:16]


def _load_keys() -> tuple[Ed25519PrivateKey, Ed25519PublicKey]:
    """Load private + public keys. Fail closed if either is absent."""
    if not PRIV_PATH.exists():
        sys.exit(f"FATAL: private key not found at {PRIV_PATH}")
    if not PUB_PATH.exists():
        sys.exit(f"FATAL: public key not found at {PUB_PATH}")
    priv_pem = PRIV_PATH.read_bytes()
    pub_pem = PUB_PATH.read_bytes()
    priv: Ed25519PrivateKey = serialization.load_pem_private_key(  # type: ignore[assignment]
        priv_pem, password=None
    )
    pub: Ed25519PublicKey = serialization.load_pem_public_key(  # type: ignore[assignment]
        pub_pem
    )
    return priv, pub


# Discovery surfaces that should be signed (Phase 6 recommendation)
DEFAULT_TARGETS = [
    "agents.txt",
    "llms.txt",
    "soul.json",
    "sitemap.xml",
    "feed.xml",
]


def _file_sha256(path: Path) -> str:
    """Return lowercase hex SHA-256 of file contents (excluding signature block)."""
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def _strip_signature_block(text: str) -> str:
    """
    Remove an existing signature block so re-signing is idempotent.
    Block markers (line-anchored):
      # --- BEGIN SIGNATURE BLOCK v1 ---
      ...signature...
      # --- END SIGNATURE BLOCK ---
    Returns text with a single trailing newline (canonical form).
    """
    lines = text.splitlines(keepends=True)
    out = []
    skip = False
    for line in lines:
        if "# --- BEGIN SIGNATURE BLOCK v1 ---" in line:
            skip = True
            continue
        if "# --- END SIGNATURE BLOCK ---" in line:
            skip = False
            continue
        if not skip:
            out.append(line)
    return "".join(out).rstrip() + "\n"


def _signature_block(
    file_path: Path, signature: bytes, digest_hex: str, key_fingerprint: str
) -> str:
    """Build the trailing signature block that gets appended to the file."""
    sig_b64 = __import__("base64").b64encode(signature).decode()
    timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
    return (
        "\n# --- BEGIN SIGNATURE BLOCK v1 ---\n"
        f"# signature: {key_fingerprint}\n"
        f"# signed_at: {timestamp}\n"
        f"# digest_sha256: {digest_hex}\n"
        f"# signature_b64: {sig_b64}\n"
        f"# verify: python3 scripts/sign-discovery.py --verify {file_path} <file>.sig\n"
        "# --- END SIGNATURE BLOCK ---\n"
    )


def sign_file(file_path: Path) -> Path:
    """Sign a single file; append signature block. Returns path to .sig sidecar."""
    priv, pub = _load_keys()
    if not file_path.exists():
        sys.exit(f"FATAL: {file_path} does not exist")
    text = file_path.read_text()
    stripped = _strip_signature_block(text)
    digest_hex = hashlib.sha256(stripped.encode()).hexdigest()
    signature = priv.sign(stripped.encode())
    key_fp = _key_fingerprint(pub)
    # Re-write the file with the signature block
    new_text = stripped + _signature_block(file_path, signature, digest_hex, key_fp)
    file_path.write_text(new_text)
    sidecar = file_path.with_suffix(file_path.suffix + ".sig")
    sidecar.write_text(
        _signature_block(file_path, signature, digest_hex, key_fp).lstrip()
    )
    print(
        f"[signed] {file_path}  digest={digest_hex[:16]}…  sig={signature.hex()[:16]}…"
    )
    return sidecar


def verify_file(file_path: Path, sig_path: Path | None = None) -> bool:
    """Verify a signed file. Reads signature block from the file itself, or from sidecar."""
    _, pub = _load_keys()
    if not file_path.exists():
        sys.exit(f"FATAL: {file_path} does not exist")
    text = file_path.read_text()

    # Pull signature block (either embedded or sidecar)
    if sig_path is None:
        sig_path = file_path.with_suffix(file_path.suffix + ".sig")
    if not sig_path.exists():
        # Try extracting from embedded block
        sig_text = _strip_signature_block  # rename
        stripped = _strip_signature_block(text)
        # Find the signature_b64 line in the original text
        import re

        m = re.search(r"# signature_b64: ([A-Za-z0-9+/=]+)", text)
        if not m:
            sys.exit(f"FATAL: no signature in {file_path} or {sig_path}")
        sig_b64 = m.group(1)
    else:
        sig_text = sig_path.read_text()
        stripped = _strip_signature_block(text)
        import re

        m = re.search(r"# signature_b64: ([A-Za-z0-9+/=]+)", sig_text)
        if not m:
            sys.exit(f"FATAL: no signature_b64 in {sig_path}")
        sig_b64 = m.group(1)

    import base64

    sig = base64.b64decode(sig_b64)
    try:
        pub.verify(sig, stripped.encode())
        digest = hashlib.sha256(stripped.encode()).hexdigest()
        key_fp = _key_fingerprint(pub)
        print(f"[verify] ✓ {file_path}  key={key_fp}  digest={digest[:16]}…")
        return True
    except InvalidSignature:
        print(f"[verify] ✗ {file_path}  SIGNATURE INVALID")
        return False


def main():
    first_para = __doc__.split("\n\n")[0] if __doc__ else ""
    p = argparse.ArgumentParser(description=first_para)
    p.add_argument(
        "--sign",
        nargs="+",
        help="Files to sign (idempotent; replaces existing sig block)",
    )
    p.add_argument(
        "--verify",
        nargs=2,
        metavar=("FILE", "SIG_FILE"),
        help="Verify FILE against SIG_FILE",
    )
    p.add_argument(
        "--verify-embedded", action="append", help="Verify files whose sig is embedded"
    )
    p.add_argument(
        "--all", action="store_true", help="Sign every default discovery surface"
    )
    args = p.parse_args()

    if args.sign:
        for f in args.sign:
            sign_file(Path(f))
    elif args.verify:
        verify_file(Path(args.verify[0]), Path(args.verify[1]))
    elif args.verify_embedded:
        for f in args.verify_embedded:
            verify_file(Path(f))
    elif args.all:
        # Default location: /var/www/html/ (live) + sites/arif-fazil.com/public/ (source)
        # (We don't mutate runtime /var/www/ from here; only source files in the repo.)
        base = Path("/root/arif-fazil.com/sites/arif-fazil.com/public")
        for target in DEFAULT_TARGETS:
            f = base / target
            if f.exists():
                sign_file(f)
            else:
                print(f"[skip] {f} not present in public/")
    else:
        p.print_help()


if __name__ == "__main__":
    main()
