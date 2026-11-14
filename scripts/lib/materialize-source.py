#!/usr/bin/env python3
"""Exact-commit Git source materializer and external-input guard."""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import shutil
import subprocess
import sys
import tarfile
from pathlib import Path
from typing import Any


def _git(repo_root: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", "-C", str(repo_root), *args],
        capture_output=True,
        text=True,
        check=check,
    )


def _sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def resolve_commit(repo_root: Path, requested: str, authorized: str) -> str:
    """Resolve and verify exact commit SHA, enforcing authorized match."""
    if not (repo_root / ".git").exists() and _git(repo_root, "rev-parse", "--is-inside-work-tree", check=False).returncode != 0:
        raise ValueError(f"not a Git repository/worktree: {repo_root}")

    if requested:
        res = _git(repo_root, "rev-parse", "--verify", f"{requested}^{{commit}}", check=False)
        if res.returncode != 0:
            raise ValueError(f"requested commit not found or invalid: {requested!r} ({res.stderr.strip()})")
        commit_sha = res.stdout.strip()
    elif authorized:
        res = _git(repo_root, "rev-parse", "--verify", f"{authorized}^{{commit}}", check=False)
        if res.returncode != 0:
            raise ValueError(f"authorized commit not found or invalid: {authorized!r} ({res.stderr.strip()})")
        commit_sha = res.stdout.strip()
    else:
        res = _git(repo_root, "rev-parse", "--verify", "HEAD^{commit}", check=False)
        if res.returncode != 0:
            raise ValueError(f"HEAD commit cannot be resolved (commit is absent): {res.stderr.strip()}")
        commit_sha = res.stdout.strip()

    if authorized:
        auth_res = _git(repo_root, "rev-parse", "--verify", f"{authorized}^{{commit}}", check=False)
        if auth_res.returncode != 0:
            raise ValueError(f"authorized commit invalid: {authorized!r}")
        auth_sha = auth_res.stdout.strip()
        if commit_sha != auth_sha:
            raise ValueError(
                f"commit mismatch: resolved {commit_sha} differs from authorized commit {auth_sha}"
            )
    return commit_sha


def check_repo_safety(
    repo_root: Path,
    commit_sha: str,
    source_rel: str,
    explicit_commit: bool,
    allow_dirty_source_with_commit: bool = True,
) -> str:
    """Check submodules, gitlinks, dirty source when commit implicit, and return tree_hash."""
    source_rel = source_rel.strip("/")
    tree_res = _git(repo_root, "rev-parse", "--verify", f"{commit_sha}:{source_rel}", check=False)
    if tree_res.returncode != 0:
        raise ValueError(f"source path {source_rel!r} not tracked in commit {commit_sha}")
    tree_hash = tree_res.stdout.strip()

    sub_res = _git(repo_root, "submodule", "status", "--recursive", check=False)
    if sub_res.returncode != 0:
        raise ValueError(f"submodule status check failed: {sub_res.stderr.strip()}")
    for line in sub_res.stdout.splitlines():
        if line and line[0] in "-+U":
            raise ValueError(f"unresolved or out-of-sync submodule state: {line.strip()}")

    ls_res = _git(repo_root, "ls-tree", "-r", "--full-tree", commit_sha, "--", source_rel, check=False)
    if ls_res.returncode != 0:
        raise ValueError(f"git ls-tree failed for {source_rel!r}: {ls_res.stderr.strip()}")
    for line in ls_res.stdout.splitlines():
        if line.startswith("160000 "):
            raise ValueError(f"unresolved nested repository/submodule gitlink in {source_rel}: {line}")

    if not explicit_commit or not allow_dirty_source_with_commit:
        dirty = _git(repo_root, "status", "--porcelain=v1", "--untracked-files=all", "--", source_rel, check=False)
        if dirty.returncode != 0:
            raise ValueError(f"git status check failed: {dirty.stderr.strip()}")
        if dirty.stdout.strip():
            raise ValueError(
                f"working tree under {source_rel!r} has uncommitted/untracked files and no explicit --commit was given"
            )
    return tree_hash


def materialize(
    repo_root: Path,
    commit_sha: str,
    source_rel: str,
    dest_dir: Path,
    required_tracked: list[str],
) -> dict[str, Any]:
    """Extract exact commit tree via git archive and verify materialized state."""
    source_rel = source_rel.strip("/")
    dest_dir = dest_dir.resolve()
    dest_dir.mkdir(parents=True, exist_ok=True)

    # Check required tracked paths in the commit tree BEFORE extraction.
    ls_tracked = _git(repo_root, "ls-tree", "-r", "--name-only", commit_sha, "--", source_rel)
    tracked_set = set(ls_tracked.stdout.splitlines())
    missing_tracked = []
    for req in required_tracked:
        full_rel = f"{source_rel}/{req.lstrip('/')}"
        if full_rel not in tracked_set:
            missing_tracked.append(req)
    if missing_tracked:
        raise ValueError(f"required tracked file(s) absent from commit {commit_sha}: {missing_tracked}")

    arch = subprocess.run(
        ["git", "-C", str(repo_root), "archive", "--format=tar", commit_sha, "--", source_rel],
        capture_output=True,
        check=False,
    )
    if arch.returncode != 0:
        raise ValueError(f"git archive failed for {commit_sha}:{source_rel}: {arch.stderr.decode(errors='replace')}")

    allowed_parent_dirs = {
        p.as_posix() for p in Path(source_rel).parents if p.as_posix() != "."
    }
    with tarfile.open(fileobj=io.BytesIO(arch.stdout), mode="r:") as tf:
        prefix = f"{source_rel}/"
        for member in tf.getmembers():
            clean_name = member.name.rstrip("/")
            if member.isdir() and clean_name in allowed_parent_dirs:
                pass
            elif not (clean_name == source_rel or clean_name.startswith(prefix)):
                raise ValueError(f"archive member escapes {source_rel}: {member.name}")
            if ".." in Path(clean_name).parts:
                raise ValueError(f"illegal path traversal in archive member: {member.name}")
            if member.issym() or member.islnk():
                link_target = member.linkname
                if os.path.isabs(link_target):
                    raise ValueError(f"absolute symlink inside git archive disallowed: {member.name} -> {link_target}")
        tf.extractall(dest_dir, filter="data" if sys.version_info >= (3, 12) else None)

    materialized_source = dest_dir / source_rel
    if not materialized_source.is_dir():
        raise ValueError(f"materialized source missing after archive extraction: {materialized_source}")

    return verify_materialized_tree(repo_root, commit_sha, source_rel, materialized_source)


def verify_materialized_tree(
    repo_root: Path,
    commit_sha: str,
    source_rel: str,
    materialized_source: Path,
    allowed_extra_rels: set[str] | None = None,
) -> dict[str, Any]:
    """Verify materialized candidate contains ONLY exact tracked files from commit_sha."""
    source_rel = source_rel.strip("/")
    allowed_extra = allowed_extra_rels or set()
    ls_res = _git(repo_root, "ls-tree", "-r", commit_sha, "--", source_rel)
    expected: dict[str, tuple[str, str]] = {}
    for line in ls_res.stdout.splitlines():
        meta, rel = line.split("\t", 1)
        mode, kind, blob_sha = meta.split()
        if not rel.startswith(f"{source_rel}/"):
            continue
        sub_rel = rel[len(source_rel) + 1 :]
        if kind == "commit":
            raise ValueError(f"unresolved submodule gitlink in {rel}")
        expected[sub_rel] = (mode, blob_sha)

    actual_files: set[str] = set()
    for root, dirs, files in os.walk(materialized_source, followlinks=False):
        if ".git" in dirs or ".git" in files:
            raise ValueError(f"unexpected .git directory/file in materialized source: {root}")
        rel_root = Path(root).relative_to(materialized_source)
        for name in files + [d for d in dirs if (Path(root) / d).is_symlink()]:
            rel_path = (rel_root / name).as_posix() if str(rel_root) != "." else name
            actual_files.add(rel_path)

    extra = sorted(actual_files - set(expected.keys()) - allowed_extra)
    missing = sorted(set(expected.keys()) - actual_files)
    if extra or missing:
        raise ValueError(
            f"candidate tree dirtiness/mismatch: extra={extra[:10]} missing={missing[:10]}"
        )

    for rel_path, (mode, expected_blob) in expected.items():
        p = materialized_source / rel_path
        if mode == "120000":
            continue
        data = p.read_bytes()
        header = f"blob {len(data)}\0".encode("utf-8")
        actual_blob = hashlib.sha1(header + data).hexdigest()
        if actual_blob != expected_blob:
            raise ValueError(
                f"candidate file content mismatch vs commit {commit_sha}: {rel_path}"
            )

    return {"file_count": len(expected), "verified_clean": True}


def apply_external_inputs(
    manifest_path: Path,
    external_dir: Path | None,
    site_name: str,
    dest_source_dir: Path,
    attach_files: bool = True,
) -> dict[str, Any]:
    """Validate and optionally attach typed external/runtime inputs cleanly separated from Git."""
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest_sha = _sha256_file(manifest_path)
    declared = {
        item["dest_rel"]: item
        for item in manifest.get("inputs", [])
        if item.get("site") == site_name
    }

    records: list[dict[str, Any]] = []
    if external_dir is not None:
        if not external_dir.is_dir():
            raise ValueError(f"external inputs directory not found: {external_dir}")
        for root, dirs, files in os.walk(external_dir, followlinks=False):
            for name in files + [d for d in dirs if (Path(root) / d).is_symlink()]:
                full = Path(root) / name
                rel = full.relative_to(external_dir).as_posix()
                if rel not in declared:
                    raise ValueError(
                        f"undeclared untracked/external input rejected: {rel!r} (not in {manifest_path})"
                    )
                item = declared[rel]
                sha = _sha256_file(full) if full.is_file() else "symlink"
                if attach_files:
                    target = (dest_source_dir / rel).resolve()
                    if not str(target).startswith(str(dest_source_dir.resolve()) + "/"):
                        raise ValueError(f"external input path escapes candidate source: {rel}")
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(full, target)
                records.append(
                    {
                        "id": item["id"],
                        "kind": item["kind"],
                        "dest_rel": rel,
                        "sha256": sha,
                        "attached": attach_files,
                        "excluded_from_source_identity": True,
                    }
                )

    for rel, item in declared.items():
        if item.get("required") and not any(r["dest_rel"] == rel for r in records):
            raise ValueError(f"required external input missing for {site_name}: {rel}")

    return {
        "manifest_path": str(manifest_path),
        "manifest_sha256": manifest_sha,
        "exclude_from_source_identity": True,
        "inputs": records,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Materialize exact Git commit for arif-sites deploys.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_plan = sub.add_parser("inspect")
    p_plan.add_argument("--repo-root", required=True)
    p_plan.add_argument("--source-rel", required=True)
    p_plan.add_argument("--site", required=True)
    p_plan.add_argument("--commit", default="")
    p_plan.add_argument("--authorized-commit", default="")
    p_plan.add_argument("--explicit-commit", action="store_true")
    p_plan.add_argument("--required-tracked", action="append", default=[])
    p_plan.add_argument("--external-manifest", required=True)
    p_plan.add_argument("--external-dir", default="")

    p_mat = sub.add_parser("materialize")
    p_mat.add_argument("--repo-root", required=True)
    p_mat.add_argument("--source-rel", required=True)
    p_mat.add_argument("--site", required=True)
    p_mat.add_argument("--dest-dir", required=True)
    p_mat.add_argument("--commit", default="")
    p_mat.add_argument("--authorized-commit", default="")
    p_mat.add_argument("--explicit-commit", action="store_true")
    p_mat.add_argument("--required-tracked", action="append", default=[])
    p_mat.add_argument("--external-manifest", required=True)
    p_mat.add_argument("--external-dir", default="")

    p_ext = sub.add_parser("verify-clean")
    p_ext.add_argument("--repo-root", required=True)
    p_ext.add_argument("--source-rel", required=True)
    p_ext.add_argument("--commit", required=True)
    p_ext.add_argument("--materialized-source", required=True)
    p_ext.add_argument("--external-manifest", default="")
    p_ext.add_argument("--site", default="")

    args = parser.parse_args()
    try:
        repo_root = Path(args.repo_root).resolve()
        if args.cmd == "verify-clean":
            allowed_extra: set[str] = set()
            if args.external_manifest and args.site:
                ext_data = json.loads(Path(args.external_manifest).read_text(encoding="utf-8"))
                allowed_extra = {
                    item["dest_rel"]
                    for item in ext_data.get("inputs", [])
                    if item.get("site") == args.site
                }
            res = verify_materialized_tree(
                repo_root,
                args.commit,
                args.source_rel,
                Path(args.materialized_source).resolve(),
                allowed_extra_rels=allowed_extra,
            )
            print(json.dumps(res))
            return 0

        commit_sha = resolve_commit(repo_root, args.commit, args.authorized_commit)
        tree_hash = check_repo_safety(
            repo_root,
            commit_sha,
            args.source_rel,
            explicit_commit=args.explicit_commit,
        )
        ext_dir = Path(args.external_dir).resolve() if args.external_dir else None
        ext_manifest_path = Path(args.external_manifest).resolve()

        if args.cmd == "inspect":
            # Also check required tracked paths exist in commit tree.
            ls_tracked = _git(repo_root, "ls-tree", "-r", "--name-only", commit_sha, "--", args.source_rel.strip("/"))
            tracked_set = set(ls_tracked.stdout.splitlines())
            missing = [
                req for req in args.required_tracked
                if f"{args.source_rel.strip('/')}/{req.lstrip('/')}" not in tracked_set
            ]
            if missing:
                raise ValueError(f"required tracked file(s) absent from commit {commit_sha}: {missing}")
            ext_info = apply_external_inputs(
                ext_manifest_path, ext_dir, args.site, repo_root / args.source_rel, attach_files=False
            )
            print(json.dumps({
                "source_commit": commit_sha,
                "source_commit_short": commit_sha[:7],
                "tree_hash": tree_hash,
                "external_input_manifest": ext_info,
            }))
            return 0

        dest_dir = Path(args.dest_dir).resolve()
        mat_info = materialize(
            repo_root, commit_sha, args.source_rel, dest_dir, args.required_tracked
        )
        source_dir = dest_dir / args.source_rel.strip("/")
        ext_info = apply_external_inputs(
            ext_manifest_path, ext_dir, args.site, source_dir, attach_files=True
        )
        print(json.dumps({
            "source_commit": commit_sha,
            "source_commit_short": commit_sha[:7],
            "tree_hash": tree_hash,
            "materialized_source": str(source_dir),
            "materialized": mat_info,
            "external_input_manifest": ext_info,
        }))
        return 0
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
