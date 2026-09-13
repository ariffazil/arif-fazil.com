# Deployment policy

VERSION CONTROL FIRST. LIVE TREE SECOND.

1. Patch `/root/arif-fazil.com` only.
2. `git commit` on `main` or a named branch.
3. `npm run build` in `sites/arif-fazil.com`.
4. `web_zen.py orphan --src dist --dest /var/www/html/arif`.
5. If deletes listed: review. Do not `--delete` unless every delete is a hashed stale asset you recognize.
6. Default ship: `rsync -av` **without** `--delete`.
7. Snapshot first: `cp -a /var/www/html/arif /root/backups/www-html-arif-<ts>-pre-<reason>`.
8. Top-level Caddy roots (`/earth`, `/institution`, `/llms.txt`, `/.well-known/agent.json`) are **not** always `/var/www/html/arif`. Copy those explicitly. Scar: WEB-001, split-roots 2026-08-25.
9. **Do not run `make deploy` as a whole.** It calls `systemctl reload caddy` (T3 HOLD).
10. Post-ship: doctor after + Playwright journeys for `/`, `/human`, `/institution/`, `/earth`.
11. Report doctor fail-set delta. Oil/gas 500 is PYTHON_PATH (`/root/venv` ENOENT), not `systemctl start`.

Rollback: restore the snapshot; revert the git commit if source must match live.
