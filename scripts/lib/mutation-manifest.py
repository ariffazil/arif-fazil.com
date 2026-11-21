#!/usr/bin/env python3
"""Pre-computed mutation manifest, containment validator, snapshotter, and idempotent rollback."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import stat
import sys
from pathlib import Path
from typing import Any

DELETE_MIRROR_DIRS = ("earth", "words", "world", "work", "pilot")
SHARED_ASSET_DIRS = ("_shared",)
MERGE_SPLIT_DIRS = (
    "human",
    "institution",
    "connect",
    "laws",
    "verify",
    "discovery",
    "research",
    ".well-known",
)
ROOT_STATIC_FILES = (
    "surfaces.json",
    "llms.json",
    "llms.txt",
    "page.json",
    "llms-full.txt",
    "sitemap.xml",
    "floors.json",
    "human.md",
    "AGENTS.md",
    "robots.txt",
    "rsl.xml",
    "soul.json",
    "feed.xml",
)


def sha256_bytes(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def inspect_entry(path: Path) -> dict[str, Any]:
    """Return non-dereferencing metadata for an existing or absent path."""
    try:
        st = os.lstat(path)
    except FileNotFoundError:
        return {
            "exists": False,
            "kind": "absent",
            "hash": None,
            "owner": None,
            "uid": None,
            "gid": None,
            "mode": None,
            "symlink_target": None,
        }

    mode_str = f"{stat.S_IMODE(st.st_mode):04o}"
    owner_str = f"{st.st_uid}:{st.st_gid}"
    if stat.S_ISLNK(st.st_mode):
        link_target = os.readlink(path)
        return {
            "exists": True,
            "kind": "symlink",
            "hash": f"symlink:{link_target}",
            "owner": owner_str,
            "uid": st.st_uid,
            "gid": st.st_gid,
            "mode": mode_str,
            "symlink_target": link_target,
        }
    if stat.S_ISDIR(st.st_mode):
        return {
            "exists": True,
            "kind": "dir",
            "hash": "dir",
            "owner": owner_str,
            "uid": st.st_uid,
            "gid": st.st_gid,
            "mode": mode_str,
            "symlink_target": None,
        }
    return {
        "exists": True,
        "kind": "file",
        "hash": sha256_bytes(path),
        "owner": owner_str,
        "uid": st.st_uid,
        "gid": st.st_gid,
        "mode": mode_str,
        "symlink_target": None,
    }


def _is_under(path: Path, parent: Path) -> bool:
    return path == parent or str(path).startswith(str(parent) + "/")


def _drop_own_webroot(roots: list[Path], approved_dirs: list[Path]) -> list[Path]:
    """Remove the DEPLOYING site's own webroot from a forbidden-root list.

    2026-11-21 (FI-003): the forbidden roots were hardcoded from the 2026-08-25
    split-root fix, when /var/www/html/arifos had to be protected from the MAIN
    site's deploy. The registry later gave `arifos` its own site entry
    (webroot=arifos, owner=arif-sites) — so the owner of that root could no
    longer deploy through its own registry path: every target under its own
    webroot was rejected as "explicitly forbidden root"
    (deploy receipt 20261121T061842762738074Z, status=failed_pre_swap).

    The deploying site's own webroot is approved_dirs[0] (plan_and_snapshot sets
    approved_dirs = [webroot] first). Dropping ONLY that root restores the
    owner's ability to deploy while every other owner's roots stay forbidden.
    """
    if not approved_dirs:
        return roots
    own = os.path.abspath(str(approved_dirs[0]))
    own_resolved = own
    try:
        own_resolved = os.path.abspath(str(Path(approved_dirs[0]).resolve()))
    except OSError:
        pass
    kept = []
    for r in roots:
        r_abs = os.path.abspath(str(r))
        r_res = r_abs
        try:
            r_res = os.path.abspath(str(Path(r).resolve()))
        except OSError:
            pass
        if r_abs == own or r_res == own or r_abs == own_resolved:
            continue
        kept.append(r)
    return kept


def check_target_allowed(
    target: Path,
    html_root: Path,
    primary_root: Path,
    approved_dirs: list[Path],
    approved_files: list[Path],
    candidate_symlink_target: str | None = None,
) -> None:
    """Fail closed if target or any ancestor/symlink escapes approved roots."""
    norm_raw = os.path.normpath(str(target))
    if ".." in Path(norm_raw).parts:
        raise ValueError(f"path traversal '..' rejected: {target}")

    norm_target = Path(os.path.abspath(str(target)))

    forbidden_roots = [
        Path("/var/www/html/arifos"),
        Path("/var/www/html/arif/arifos"),
        (html_root / "arifos").resolve() if html_root.exists() else Path(os.path.abspath(str(html_root / "arifos"))),
        Path(os.path.abspath(str(html_root / "arifos"))),
        Path(os.path.abspath(str(primary_root / "arifos"))),
        Path(os.path.abspath(str(html_root / "arif" / "arifos"))),
    ]

    forbidden_roots = _drop_own_webroot(forbidden_roots, approved_dirs)

    for forb in forbidden_roots:
        if _is_under(norm_target, forb):
            raise ValueError(f"explicitly forbidden root rejected: {norm_target} (forbidden={forb})")

    if not any(_is_under(norm_target, d) for d in approved_dirs) and norm_target not in approved_files:
        raise ValueError(f"target outside approved roots rejected: {norm_target}")

    # Walk ancestor chain on disk to detect undeclared symlink escapes at or above target.
    rel_from_html = norm_target.relative_to(html_root)
    cur = html_root
    if cur.is_symlink():
        raise ValueError(f"html_root itself is a symlink escape: {cur} -> {os.readlink(cur)}")
    for part in rel_from_html.parts[:-1]:
        cur = cur / part
        if cur.is_symlink():
            resolved = cur.resolve()
            if any(_is_under(resolved, forb) for forb in forbidden_roots):
                raise ValueError(f"undeclared symlink escape to forbidden root: {cur} -> {resolved}")
            if not any(_is_under(resolved, d) for d in approved_dirs):
                raise ValueError(f"undeclared symlink escape outside approved roots: {cur} -> {resolved}")

    if candidate_symlink_target is not None:
        if os.path.isabs(candidate_symlink_target):
            dest = Path(os.path.normpath(candidate_symlink_target))
        else:
            dest = Path(os.path.normpath(str(norm_target.parent / candidate_symlink_target)))
        for forb in forbidden_roots:
            if _is_under(dest, forb):
                raise ValueError(
                    f"candidate symlink points into forbidden root: {norm_target} -> {candidate_symlink_target} ({dest})"
                )
        if not any(_is_under(dest, d) for d in approved_dirs) and dest not in approved_files:
            raise ValueError(
                f"candidate symlink escapes approved roots: {norm_target} -> {candidate_symlink_target} ({dest})"
            )


def classify_root_group(rel_path: str, is_split: bool, root_label: str) -> str:
    if not is_split:
        return "primary"
    if root_label == "root_static":
        return "root_static"
    if root_label in SHARED_ASSET_DIRS:
        return "shared_assets"
    if root_label:
        return f"split_root:{root_label}"
    if rel_path.endswith("index.html"):
        return "index_shell"
    return "primary"


def _walk_tree(root: Path) -> dict[str, Path]:
    entries: dict[str, Path] = {}
    if not root.exists():
        return entries
    for dirpath, dirnames, filenames in os.walk(root, followlinks=False):
        rel_dir = Path(dirpath).relative_to(root)
        keep_dirs = []
        for d in dirnames:
            dp = Path(dirpath) / d
            rel = (rel_dir / d).as_posix() if str(rel_dir) != "." else d
            if dp.is_symlink():
                entries[rel] = dp
            else:
                keep_dirs.append(d)
        dirnames[:] = keep_dirs
        for f in filenames:
            fp = Path(dirpath) / f
            rel = (rel_dir / f).as_posix() if str(rel_dir) != "." else f
            entries[rel] = fp
    return entries


def _add_pair(
    items: list[dict[str, Any]],
    seen_targets: set[str],
    cand_path: Path | None,
    target_path: Path,
    root_group: str,
    html_root: Path,
    primary_root: Path,
    approved_dirs: list[Path],
    approved_files: list[Path],
    candidate_only_create: bool = False,
) -> None:
    target_key = os.path.abspath(str(target_path))
    if target_key in seen_targets:
        return
    seen_targets.add(target_key)

    cand_info = inspect_entry(cand_path) if cand_path is not None else {"exists": False, "kind": "absent", "hash": None, "mode": None, "symlink_target": None}
    check_target_allowed(
        target_path,
        html_root,
        primary_root,
        approved_dirs,
        approved_files,
        candidate_symlink_target=cand_info.get("symlink_target"),
    )

    live_info = inspect_entry(target_path)
    if live_info["kind"] == "symlink":
        # Ensure an existing live symlink cannot redirect promotion outside approved roots
        raw_link = live_info["symlink_target"]
        resolved_live = (
            Path(os.path.normpath(raw_link))
            if os.path.isabs(raw_link)
            else Path(os.path.normpath(str(target_path.parent / raw_link)))
        )
        forbidden_live = _drop_own_webroot(
            [
                Path("/var/www/html/arifos"),
                Path("/var/www/html/arif/arifos"),
                Path(os.path.abspath(str(html_root / "arifos"))),
                Path(os.path.abspath(str(primary_root / "arifos"))),
            ],
            approved_dirs,
        )
        if any(_is_under(resolved_live, forb) for forb in forbidden_live) or (
            not any(_is_under(resolved_live, d) for d in approved_dirs)
            and resolved_live not in approved_files
        ):
            raise ValueError(f"existing live symlink escapes approved roots: {target_path} -> {resolved_live}")

    if cand_info["exists"] and not live_info["exists"]:
        op = "create"
        rb_action = "remove_created"
    elif not cand_info["exists"] and live_info["exists"]:
        if candidate_only_create:
            return
        op = "delete"
        rb_action = "restore_symlink" if live_info["kind"] == "symlink" else "restore_file"
    elif cand_info["exists"] and live_info["exists"]:
        if cand_info["kind"] != live_info["kind"] or cand_info["kind"] == "symlink" or live_info["kind"] == "symlink":
            if cand_info["hash"] == live_info["hash"] and cand_info.get("owner") == live_info["owner"]:
                return
            op = "symlink_replace"
            rb_action = "restore_symlink" if live_info["kind"] == "symlink" else "restore_file"
        elif (
            cand_info["hash"] != live_info["hash"]
            or cand_info["mode"] != live_info["mode"]
            or cand_info.get("owner") != live_info["owner"]
        ):
            op = "overwrite"
            rb_action = "restore_file"
        else:
            return
    else:
        return

    items.append(
        {
            "target": str(target_path),
            "root_group": root_group,
            "operation": op,
            "existed_before": live_info["exists"],
            "before_kind": live_info["kind"],
            "before_symlink_target": live_info["symlink_target"],
            "baseline_hash": live_info["hash"],
            "candidate_hash": cand_info["hash"],
            "candidate_kind": cand_info["kind"],
            "owner": live_info["owner"],
            "uid": live_info["uid"],
            "gid": live_info["gid"],
            "mode": live_info["mode"],
            "candidate_mode": cand_info["mode"],
            "rollback_action": rb_action,
            "snapshot_rel": None,
        }
    )


def plan_and_snapshot(
    stage_dir: Path,
    html_root: Path,
    webroot: Path,
    split_roots: bool,
    manifest_path: Path,
    snapshot_dir: Path,
    extra_targets_file: Path | None = None,
    approved_shared_roots: list[str] | None = None,
) -> dict[str, Any]:
    """Compute complete mutation manifest and snapshot every mutable existing target."""
    html_root = html_root.resolve() if html_root.exists() else Path(os.path.abspath(str(html_root)))
    webroot = Path(os.path.abspath(str(webroot)))
    stage_dir = stage_dir.resolve()

    approved_dirs: list[Path] = [webroot]
    approved_files: list[Path] = []

    # 2026-11-21 (FI-003, F13 sah (a)): a site may DECLARE shared roots it is
    # allowed to REFERENCE — e.g. the arifos site's .well-known/ entries are
    # symlinks into /var/www/html/.well-known, which lives outside its own
    # webroot. Declared roots are approved for RESOLUTION ONLY: the mutation
    # set is still the stage/live diff scoped to this site's own webroot, so a
    # declared shared root is never written by this deploy. This is deliberately
    # narrower than --split-roots, which also admits DELETE_MIRROR_DIRS,
    # MERGE_SPLIT_DIRS and ROOT_STATIC_FILES.
    for _name in (approved_shared_roots or []):
        _nm = str(_name).strip("/")
        if not _nm or _nm.startswith("/") or ".." in Path(_nm).parts:
            raise ValueError(f"invalid approved shared root: {_name!r}")
        approved_dirs.append(Path(os.path.abspath(str(html_root / _nm))))
    if split_roots:
        for d in (*DELETE_MIRROR_DIRS, *SHARED_ASSET_DIRS, *MERGE_SPLIT_DIRS):
            approved_dirs.append(Path(os.path.abspath(str(html_root / d))))
        if webroot != html_root / "arif":
            for d in MERGE_SPLIT_DIRS:
                approved_dirs.append(Path(os.path.abspath(str(html_root / "arif" / d))))
            for f in ROOT_STATIC_FILES:
                approved_files.append(Path(os.path.abspath(str(html_root / "arif" / f))))
        for f in ROOT_STATIC_FILES:
            approved_files.append(Path(os.path.abspath(str(html_root / f))))

    # Verify live primary root is not a symlink pointing outside approved roots
    if webroot.is_symlink():
        raise ValueError(f"primary webroot must not be a symlink: {webroot} -> {os.readlink(webroot)}")

    items: list[dict[str, Any]] = []
    seen_targets: set[str] = set()

    # 1. Primary webroot mutations (full diff between stage_dir and current webroot)
    stage_entries = _walk_tree(stage_dir)
    live_entries = _walk_tree(webroot)
    for rel in sorted(set(stage_entries) | set(live_entries)):
        _add_pair(
            items,
            seen_targets,
            stage_entries.get(rel),
            webroot / rel,
            "index_shell" if rel.endswith("index.html") else "primary",
            html_root,
            webroot,
            approved_dirs,
            approved_files,
        )

    # 2. Split roots when split_roots enabled (matches sync-serving-roots.sh domain)
    if split_roots:
        for d in DELETE_MIRROR_DIRS:
            src_sub = stage_dir / d
            if not src_sub.is_dir():
                continue
            cand_sub = _walk_tree(src_sub)
            live_sub = _walk_tree(html_root / d)
            for rel in sorted(set(cand_sub) | set(live_sub)):
                _add_pair(
                    items,
                    seen_targets,
                    cand_sub.get(rel),
                    html_root / d / rel,
                    f"split_root:{d}",
                    html_root,
                    webroot,
                    approved_dirs,
                    approved_files,
                )

        for d in (*SHARED_ASSET_DIRS, *MERGE_SPLIT_DIRS):
            src_sub = stage_dir / d
            if not src_sub.is_dir():
                continue
            cand_sub = _walk_tree(src_sub)
            rg = "shared_assets" if d in SHARED_ASSET_DIRS else f"split_root:{d}"
            for rel, cpath in sorted(cand_sub.items()):
                _add_pair(
                    items,
                    seen_targets,
                    cpath,
                    html_root / d / rel,
                    rg,
                    html_root,
                    webroot,
                    approved_dirs,
                    approved_files,
                    candidate_only_create=True,
                )
                if d in MERGE_SPLIT_DIRS and webroot != html_root / "arif":
                    _add_pair(
                        items,
                        seen_targets,
                        cpath,
                        html_root / "arif" / d / rel,
                        f"split_root:arif_{d}",
                        html_root,
                        webroot,
                        approved_dirs,
                        approved_files,
                        candidate_only_create=True,
                    )

        for fname in ROOT_STATIC_FILES:
            cand_f = stage_dir / fname
            if cand_f.is_file() or cand_f.is_symlink():
                _add_pair(
                    items,
                    seen_targets,
                    cand_f,
                    html_root / fname,
                    "root_static",
                    html_root,
                    webroot,
                    approved_dirs,
                    approved_files,
                )
                if webroot != html_root / "arif":
                    _add_pair(
                        items,
                        seen_targets,
                        cand_f,
                        html_root / "arif" / fname,
                        "root_static",
                        html_root,
                        webroot,
                        approved_dirs,
                        approved_files,
                    )

    # 3. Optional extra targets (for explicit containment testing)
    if extra_targets_file is not None and extra_targets_file.is_file():
        extras = json.loads(extra_targets_file.read_text(encoding="utf-8"))
        for ex in extras:
            tpath = Path(ex["target"])
            check_target_allowed(
                tpath,
                html_root,
                webroot,
                approved_dirs,
                approved_files,
                candidate_symlink_target=ex.get("symlink_target"),
            )

    # Record directories newly created by `create` items so rollback only prunes empty new dirs
    created_dirs: set[str] = set()
    stop_boundaries = {str(html_root), str(webroot.parent)}
    for item in items:
        if item["rollback_action"] != "remove_created":
            continue
        p = Path(item["target"]).parent
        while str(p) not in stop_boundaries and (
            _is_under(p, html_root) or p == webroot or _is_under(p, webroot)
        ):
            if not p.exists():
                created_dirs.add(str(p))
            else:
                break
            p = p.parent

    # Snapshot every pre-existing mutable item BEFORE any mutation happens
    snapshot_dir.mkdir(parents=True, exist_ok=True)
    snap_items_dir = snapshot_dir / "items"
    snap_items_dir.mkdir(parents=True, exist_ok=True)

    for idx, item in enumerate(items):
        if not item["existed_before"]:
            continue
        tpath = Path(item["target"])
        if item["before_kind"] == "symlink":
            item["snapshot_rel"] = f"symlink:{idx}"
        elif item["before_kind"] == "file":
            snap_file = snap_items_dir / f"{idx:06d}.bin"
            shutil.copy2(tpath, snap_file, follow_symlinks=False)
            item["snapshot_rel"] = f"items/{idx:06d}.bin"

    dir_snapshots: list[dict[str, Any]] = []
    seen_dirs: set[str] = set()
    for base_dir in approved_dirs:
        if not base_dir.is_dir() or base_dir.is_symlink():
            continue
        for dp_str, dirnames, _ in os.walk(base_dir, followlinks=False):
            dp_path = Path(dp_str)
            if dp_path.is_symlink():
                dirnames[:] = []
                continue
            key = os.path.abspath(dp_str)
            if key not in seen_dirs:
                seen_dirs.add(key)
                st = os.lstat(dp_path)
                dir_snapshots.append(
                    {
                        "path": str(dp_path),
                        "uid": st.st_uid,
                        "gid": st.st_gid,
                        "owner": f"{st.st_uid}:{st.st_gid}",
                        "mode": f"{stat.S_IMODE(st.st_mode):04o}",
                    }
                )
            dirnames[:] = sorted(d for d in dirnames if not (dp_path / d).is_symlink())
    dir_snapshots.sort(key=lambda d: len(d["path"]))

    manifest = {
        "schema": "arif-sites.mutation-manifest.v1",
        "html_root": str(html_root),
        "primary_webroot": str(webroot),
        "split_roots": split_roots,
        "snapshot_dir": str(snapshot_dir),
        "approved_dirs": [str(d) for d in approved_dirs],
        "approved_files": [str(f) for f in approved_files],
        "created_dirs": sorted(created_dirs, key=lambda s: -len(s)),
        "dir_snapshots": dir_snapshots,
        "counts": {
            "total": len(items),
            "create": sum(1 for i in items if i["operation"] == "create"),
            "overwrite": sum(1 for i in items if i["operation"] == "overwrite"),
            "delete": sum(1 for i in items if i["operation"] == "delete"),
            "symlink_replace": sum(1 for i in items if i["operation"] == "symlink_replace"),
        },
        "items": items,
    }
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def _restore_owner_and_mode(path: Path, item: dict[str, Any], skip_chown: bool) -> None:
    if not skip_chown and item.get("uid") is not None and item.get("gid") is not None:
        os.chown(path, int(item["uid"]), int(item["gid"]), follow_symlinks=False)
    if item.get("before_kind") != "symlink" and item.get("mode"):
        os.chmod(path, int(item["mode"], 8))


def execute_rollback(
    manifest_path: Path,
    result_path: Path,
    skip_chown: bool = False,
) -> tuple[bool, dict[str, Any]]:
    """Idempotent manifest-bound rollback across primary and all split roots."""
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    snapshot_dir = Path(manifest["snapshot_dir"])
    items = manifest.get("items", [])

    per_target: list[dict[str, Any]] = []
    failures = 0
    restored = 0
    removed = 0
    already_clean = 0

    for item in items:
        target = Path(item["target"])
        action = item["rollback_action"]
        try:
            cur = inspect_entry(target)
            if action == "remove_created":
                if not cur["exists"]:
                    already_clean += 1
                    per_target.append({"target": str(target), "action": action, "status": "already_absent"})
                elif cur["kind"] == "dir":
                    raise OSError(f"refusing to delete directory via file remove action: {target}")
                else:
                    target.unlink()
                    removed += 1
                    per_target.append({"target": str(target), "action": action, "status": "removed"})
            elif action == "restore_symlink":
                link_dest = item["before_symlink_target"]
                if (
                    cur["exists"]
                    and cur["kind"] == "symlink"
                    and cur["symlink_target"] == link_dest
                    and (skip_chown or cur["owner"] == item["owner"])
                ):
                    already_clean += 1
                    per_target.append({"target": str(target), "action": action, "status": "already_restored"})
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    if cur["exists"]:
                        if cur["kind"] == "dir":
                            shutil.rmtree(target)
                        else:
                            target.unlink()
                    os.symlink(link_dest, target)
                    _restore_owner_and_mode(target, item, skip_chown)
                    restored += 1
                    per_target.append({"target": str(target), "action": action, "status": "restored_symlink"})
            elif action == "restore_file":
                snap_rel = item.get("snapshot_rel")
                if not snap_rel or not snap_rel.startswith("items/"):
                    raise FileNotFoundError(f"missing snapshot artifact for {target}")
                snap_file = snapshot_dir / snap_rel
                if not snap_file.is_file():
                    raise FileNotFoundError(f"snapshot file absent: {snap_file}")

                already_same = (
                    cur["exists"]
                    and cur["kind"] == "file"
                    and cur["hash"] == item["baseline_hash"]
                    and cur["mode"] == item["mode"]
                    and (skip_chown or cur["owner"] == item["owner"])
                )
                if already_same:
                    already_clean += 1
                    per_target.append({"target": str(target), "action": action, "status": "already_restored"})
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    if cur["exists"] and cur["kind"] == "dir":
                        shutil.rmtree(target)
                    elif cur["exists"] and cur["kind"] == "symlink":
                        target.unlink()
                    tmp_restore = target.parent / f".rb.tmp.{os.getpid()}.{target.name}"
                    shutil.copy2(snap_file, tmp_restore)
                    _restore_owner_and_mode(tmp_restore, item, skip_chown)
                    os.replace(tmp_restore, target)
                    if sha256_bytes(target) != item["baseline_hash"]:
                        raise IOError(f"post-rollback hash verification failed for {target}")
                    restored += 1
                    per_target.append({"target": str(target), "action": action, "status": "restored_file"})
            else:
                per_target.append({"target": str(target), "action": action, "status": "noop"})
        except Exception as exc:
            failures += 1
            per_target.append(
                {"target": str(target), "action": action, "status": "failed", "error": str(exc)}
            )

    # Prune ONLY directories recorded as newly created (deepest-first), never failing if non-empty
    for dstr in manifest.get("created_dirs", []):
        dp = Path(dstr)
        if dp.is_dir() and not dp.is_symlink():
            try:
                if not any(dp.iterdir()):
                    dp.rmdir()
            except OSError as exc:
                failures += 1
                per_target.append({"target": dstr, "action": "rmdir_created", "status": "failed", "error": str(exc)})

    # Restore pre-existing directory hierarchy, ownership, and modes (shallowest create, deepest attrs)
    dir_snaps = manifest.get("dir_snapshots", [])
    for dmeta in sorted(dir_snaps, key=lambda d: len(d["path"])):
        dp = Path(dmeta["path"])
        try:
            if dp.is_symlink():
                dp.unlink()
            elif dp.exists() and not dp.is_dir():
                dp.unlink()
            if not dp.exists():
                dp.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            failures += 1
            per_target.append({"target": str(dp), "action": "restore_dir", "status": "failed", "error": str(exc)})

    for dmeta in sorted(dir_snaps, key=lambda d: -len(d["path"])):
        dp = Path(dmeta["path"])
        if not dp.is_dir() or dp.is_symlink():
            continue
        try:
            st = os.lstat(dp)
            cur_mode = f"{stat.S_IMODE(st.st_mode):04o}"
            cur_owner = f"{st.st_uid}:{st.st_gid}"
            if (not skip_chown and cur_owner != dmeta["owner"]) or cur_mode != dmeta["mode"]:
                if not skip_chown:
                    os.chown(dp, int(dmeta["uid"]), int(dmeta["gid"]), follow_symlinks=False)
                os.chmod(dp, int(dmeta["mode"], 8))
        except OSError as exc:
            failures += 1
            per_target.append({"target": str(dp), "action": "restore_dir_attrs", "status": "failed", "error": str(exc)})

    ok = failures == 0
    report = {
        "ok": ok,
        "manifest": str(manifest_path),
        "targets_total": len(items),
        "restored": restored,
        "removed": removed,
        "already_clean": already_clean,
        "failed": failures,
        "results": per_target,
    }
    result_path.parent.mkdir(parents=True, exist_ok=True)
    result_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return ok, report


def main() -> int:
    parser = argparse.ArgumentParser(description="Pre-computed deploy mutation manifest & rollback")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_plan = sub.add_parser("plan")
    p_plan.add_argument("--stage-dir", required=True)
    p_plan.add_argument("--html-root", required=True)
    p_plan.add_argument("--webroot", required=True)
    p_plan.add_argument("--split-roots", action="store_true")
    p_plan.add_argument("--manifest", required=True)
    p_plan.add_argument("--snapshot-dir", required=True)
    p_plan.add_argument("--extra-targets", default="")
    p_plan.add_argument("--approved-shared-root", action="append", default=[])

    p_rb = sub.add_parser("rollback")
    p_rb.add_argument("--manifest", required=True)
    p_rb.add_argument("--result", required=True)
    p_rb.add_argument("--skip-chown", action="store_true")

    args = parser.parse_args()
    try:
        if args.cmd == "plan":
            extra = Path(args.extra_targets) if args.extra_targets else None
            manifest = plan_and_snapshot(
                Path(args.stage_dir),
                Path(args.html_root),
                Path(args.webroot),
                args.split_roots,
                Path(args.manifest),
                Path(args.snapshot_dir),
                extra_targets_file=extra,
                approved_shared_roots=list(args.approved_shared_root),
            )
            print(json.dumps(manifest["counts"]))
            return 0
        ok, report = execute_rollback(
            Path(args.manifest),
            Path(args.result),
            skip_chown=args.skip_chown,
        )
        print(json.dumps({k: v for k, v in report.items() if k != "results"}))
        return 0 if ok else 1
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
