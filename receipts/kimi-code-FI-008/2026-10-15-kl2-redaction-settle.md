# KL2 Redaction — Settle Report (VPS side)
Date: 2026-10-15 · Actor: kimi-code/FI-008 · Authority: ARIF directive "now please setel all"
Redaction authored by companion session (commit 7a9ae25d, merge 8e955f0f). This report covers the VPS settlement.

## What was done
1. **Fresh fetch first** (scar-2026-10-03-001: probe-without-fetch = stale map). origin/main = 2ea3cdc7 at fetch time; local 1a1504c9 = 0 ahead / 10 behind → `git pull --ff-only`, no history rewrite.
2. **Verified redaction before trusting the report** (representation ≠ reality):
   - v3 xlsx rebuilt: contains `REDACTED` marker; fixture-fault values 3200/2810/750 NOT present.
   - kl2 folder grep for GWC/VSP/TWT@TD/net-pay: remaining hits are column labels + the v2 fixture-fault row (3200/2810/750) which the README now declares a known DATA-LINEAGE FAULT (made-up test values).
   - README.md + deny-by-default .gitignore present in both clones and runtime.
3. **Deployed to runtime**: /opt/geox was already on origin/main lineage (the other session's pipeline synced it at 15:36) BUT the service process started 11:39 — running pre-redaction code. `systemctl restart geox-mcp` → healthy, identity `geox-70d84f7d` = current HEAD (`git merge-base --is-ancestor 7a9ae25d HEAD` confirmed; also 8e955f0f). tools_loaded 27, surface_drift ok.
   - Note: origin/main moved twice during this session (CI commits 2ea3cdc7 → 70d84f7d by the companion session). FF lineage, nothing overwritten.
4. **Swept resources/ (the 10-08 purge area) + whole repo** for well-value classes: hits are only redaction notices ("metrics withheld", "PURGED 2026-10-08") and an ontology GWC definition. No values.
5. **Public site sweep** (/var/www/html/earth + /geox): no Rotan-1 depth/TWT/GWC/VSP exposure. Kamunsu/Kinarut hits on kinabalu-chronostrat-v2_2.json are unit names in the chronostrat chart (interpretation labels, not well measurements) — consistent with the "picks exist = interpretation, kept" decision.
6. **smoke-deploy green** (smoke_require_live + live tools/call roundtrip).

## State
- /root/GEOX and /opt/geox both contain redaction; untracked files in kl2: none (the untracked `kl2_kinabalu_well_data.xlsx` mentioned in the handover was on the companion's local clone — VPS clones clean).
- Git history retains the values by ARIF decision (repo private; GitHub 404/403 unauthenticated — verified claim from handover, not re-probed).
- Windows worktree `%TEMP%\claude\geox-redact`: out of reach from this VPS (Windows host lock). Safe to delete per handover; `git worktree prune` run on /root/GEOX — only main registered here.

## Failures
None blocking. One Makefile quirk: `make smoke-deploy` must run from /root/GEOX (no Makefile at repo-root cwd).
