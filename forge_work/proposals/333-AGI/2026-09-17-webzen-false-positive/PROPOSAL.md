# PROPOSAL · web_zen Doctor False Positive on /missions Routing
**Agent:** 333-AGI Δ MIND (FI-001)
**Date:** 2026-09-17
**Mission:** Lebih Bijaksana / Lebih Arif / Penuh Clarity, Phase 7
**File authority:** PROPOSAL

---

## 1. Observed (apparent drift)

`python3 scripts/web-zen/web_zen.py doctor` returns two YELLOW warnings:

```
✓ [YELLOW] caddy.spa_routes.missions: missions* must be in @spa_routes (else catch-all 404)
✓ [YELLOW] caddy.root_static.missions_json: missions.json must be in @root_static
```

Per the blueprint this was logged as Phase 7: "Lane E #9: Patch Caddyfile @spa_routes + @root_static for /missions."

## 2. Re-diagnosis (false positive)

The actual live Caddy config has `/missions*` correctly wired **four times** in `/etc/caddy/vhosts/arif-fazil.com.conf`:

| Layer | Line | Entry |
|---|---|---|
| @agent_shells | 943 | `path /missions /missions/ /missions/* /doctrine ...` — explicit agent-shell route, returns static HTML |
| @static_dirs | 2239 | `path ... /missions ...` — static directory catch-all |
| @spa_routes | 2263 | `path ... /missions* ...` — SPA fallback route |
| handle /missions.json | 2254, 2301 | explicit handler, served from `/var/www/html/missions.json` |

`/missions` itself is handled correctly:
- `/missions` → 308 → `/work/missions/` (line 654, the canonical redirect to the new path)
- `/work/missions/` → serves static (from arif dist)
- `/work/missions.json` → handled explicitly

The Caddyfile in `/etc/caddy/Caddyfile` is the **dispatcher** (master + global headers + import declarations). The actual routing is in `/etc/caddy/vhosts/arif-fazil.com.conf`. The doctor's heuristic is reading the wrong file.

## 3. Root cause

`web_zen.py` doctor checks the master Caddyfile imports + global config but not the per-vhost conf files. The intent of the check ("verify /missions is reachable") is correct; the implementation looks at the wrong layer.

## 4. Fix (one-line change in web_zen.py)

In `scripts/web-zen/web_zen.py`, the `caddy.spa_routes.missions` and `caddy.root_static.missions_json` checks should additionally scan `/etc/caddy/vhosts/*.conf` for the same path patterns. Or they should follow the `import` directive at Caddyfile line 53 (`import /etc/caddy/vhosts/*.conf`).

```python
# proposed fix (pseudocode):
VHOST_GLOBS = "/etc/caddy/vhosts/*.conf"
vhost_text = "\n".join(glob(VHOST_GLOBS))
if "missions" in vhost_text and "handle" in vhost_text:
    check.passes("caddy.spa_routes.missions")
```

## 5. Required actions

1. **Update web_zen.py** to scan per-vhost conf files. Owner: A-FORGE (build/tooling), lease to A-FORGE required.
2. **Re-run doctor** — confirm YELLOW → GREEN.
3. **Optional:** Add the same scan to the pre-deploy `make verify` chain to prevent future drift.

## 6. Authority required

- `scripts/web-zen/web_zen.py` — ARIF/A-FORGE lease required (SCRATCH but owner is the tool itself; the lease model says "no agent write without lease" generally).

## 7. Reversibility

100%. Single-file change in a Python script. `git revert` restores.

## 8. Cost of NOT fixing

- Doctor continues to emit doctor warnings on a health path
- Future audit queries may rely on doctor and chase phantom drift → wasted sovereign attention
- Reduces trust in the doctor output (the inverse of "the test exists to catch this class of failure")

## 9. Why this matters per the blueprint

Phase 7 of the Lebih Bijaksana blueprint was: "patch the Caddyfile." Per `forge-route-least-power`, the first question is "Can a simpler tool do this?" — yes: update the doctor. **Patch the doctor, not the Caddy.** That's the route of least power.

---

**Status:** PROPOSAL — awaiting A-FORGE lease to update `scripts/web-zen/web_zen.py`.
**Severity:** Low (cosmetic — false alarms, no functional impact).
**DITEMPA BUKAN DIBERI ⚒️**