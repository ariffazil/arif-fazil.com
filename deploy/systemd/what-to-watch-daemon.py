#!/usr/bin/env python3
"""
what-to-watch daemon — monitors /gold/api/snapshot for institutional
trigger conditions and writes TRIGGER_FIRED entries to VAULT999 when
thresholds cross.

Trigger conditions — every threshold reads a LIVE source:
  1. Brent < $70/bbl                 →  liquidity squeeze        (OBS /oil/api/snapshot)
  2. CFFO → RM60B floor              →  algorithmic dividend cap (OBS /data/wealth/petronas_vitals.json)
  3. Sovereign extraction > 65%      →  ESCALATE (already ENGAGED)
  4. Capital recycling < 1.0×        →  capital recycling override (INTERPRET — vitals tripwire 5)

The daemon reads the live snapshots every 5 minutes. On state change it writes a
structured TRIGGER_FIRED entry to /root/arifOS/VAULT999/outcomes.jsonl with full
context. Idempotent — does NOT re-fire if state is unchanged.

F2 epistemic tags preserved on every emission. Fail-closed per trigger: a trigger
whose own source is unavailable is SKIPPED and logged — never fired, and never
substituted with a proxy value.

REPAIR 2026-09-20 (three defects found in a live audit):
  a. The daemon read /data/wealth/institutional_signal.v1.json, which was never
     deployed to the served root — every iteration died on HTTP 404 (journal shows
     404 on every 5-minute tick since 2026-08-04).
  b. T1 compared a FABRICATED Brent — gold price × 1.02 — against a $70 oil
     threshold. A made-up number was one fetch away from being written into
     VAULT999 as an OBS trigger. Now reads the real XBRENT price.
  c. `vitals.get("obs_facts", {}).get(...)` crashed on the live file, where
     obs_facts exists but is null. Anchors now read from ifr_anchors_fy2025 and
     the tripwire list is indexed BY DECLARED id, not by list position.

Service: what-to-watch.service (systemd)
"""

import json
import time
import urllib.request
import urllib.error
import sys
import os
from datetime import datetime, timezone

VAULT = "/root/arifOS/VAULT999/outcomes.jsonl"
SNAPSHOT_URL = "https://arif-fazil.com/gold/api/snapshot"
OIL_URL = "https://arif-fazil.com/oil/api/snapshot"
INTERVAL = 300  # 5 minutes

# Trigger thresholds
TRIGGERS = {
    "T1_brent_below_70": {
        "metric": "brent_usd_bbl",
        "operator": "<",
        "threshold": 70.0,
        "source": "/gold/api/snapshot · ticker.price",
        "consequence": "liquidity_squeeze_risk · FCF → 0 within 2 quarters",
        "epistemic": "OBS",
        "fired": False,
    },
    "T2_cffo_below_60b": {
        "metric": "cffo_rm_b",
        "operator": "<",
        "threshold": 60.0,
        "source": "/data/wealth/petronas_vitals.json · ifr_anchors_fy2025.cffo_rm_b (audited IFR anchor)",
        "consequence": "algorithmic_dividend_cap_confirmed",
        "epistemic": "DER",
        "fired": False,
    },
    "T3_extraction_above_65": {
        "metric": "extraction_pct_pat",
        "operator": ">",
        "threshold": 65.0,
        "source": "/data/wealth/petronas_vitals.json · tripwire id=9 (sovereign extraction gauge)",
        "consequence": "AMEND-2026-08-03-001 hard_lock_engaged",
        "epistemic": "OBS",
        "fired": False,  # will already be True on first run
    },
    "T4_reserve_recycling_below_1": {
        "metric": "capital_recycling_x",
        "operator": "<",
        "threshold": 1.0,
        "source": "/data/wealth/petronas_vitals.json · tripwire id=5 (tagged INTERPRET in source)",
        "consequence": "capital_recycling_override",
        "epistemic": "DER",
        "fired": False,
    },
}


def fetch(url, timeout=5):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            return json.loads(r.read())
    except (urllib.error.URLError, json.JSONDecodeError) as e:
        return {"_error": str(e)}


def check_trigger(trigger_id, trigger_def, current_value):
    """Returns True if trigger condition is met (and not already fired)."""
    op = trigger_def["operator"]
    threshold = trigger_def["threshold"]
    if current_value is None:
        return False, "no_value"
    if op == "<" and current_value < threshold:
        return True, f"{current_value} < {threshold}"
    if op == ">" and current_value > threshold:
        return True, f"{current_value} > {threshold}"
    return False, f"{current_value} {op} {threshold} (not met)"


def write_trigger_fired(trigger_id, trigger_def, current_value, comparison, context):
    """Append TRIGGER_FIRED entry to VAULT999 hash chain."""
    receipt = {
        "seq": int(time.time() * 1000),
        "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "coherence_id": f"TRIGGER_FIRED_{trigger_id}_{int(time.time())}",
        "actor_id": "what-to-watch-daemon",
        "session_id": "daemon-2026-08-03",
        "event_type": "TRIGGER_FIRED",
        "decision_class": "C2_PRIVILEGED",
        "epistemic_tier": trigger_def["epistemic"],
        "confidence": 0.95,
        "sovereign_owner": "Muhammad Arif bin Fazil (F13 SOVEREIGN)",
        "floors": {
            "F1_AMANAH": "trigger fires on observed state; reversible via sovereign reseal",
            "F2_TRUTH": f"{trigger_def['epistemic']} epistemic class preserved",
            "F11_AUDIT": "logged in VAULT999 hash chain",
        },
        "payload": {
            "trigger_id": trigger_id,
            "metric": trigger_def["metric"],
            "current_value": current_value,
            "threshold": trigger_def["threshold"],
            "operator": trigger_def["operator"],
            "comparison": comparison,
            "consequence": trigger_def["consequence"],
            "context": context,
            "doctrine": "DITEMPA BUKAN DIBIRI · The federation constrains the present",
        },
        "status": "TRIGGER_FIRED",
        "reversibility": "FULL · next observation reverses if state changes back",
    }
    try:
        with open(VAULT, "a") as f:
            f.write(json.dumps(receipt) + "\n")
        print(f"  ⚡ {trigger_id} FIRED · {comparison} · VAULT999 sealed", flush=True)
        return True
    except Exception as e:
        print(f"  ✗ VAULT write failed for {trigger_id}: {e}", flush=True)
        return False


VITALS_URL = "https://arif-fazil.com/data/wealth/petronas_vitals.json"

# Trigger state must survive a restart. Without this, every already-crossed
# threshold re-fires a duplicate TRIGGER_FIRED into VAULT999 on each restart,
# which turns the ledger into a history of process restarts rather than of
# state transitions. Unreadable/unwritable state = fail toward the old
# behaviour (assume not fired), never toward suppressing a real crossing.
STATE_FILE = "/var/lib/what-to-watch/state.json"


def load_state() -> dict:
    try:
        with open(STATE_FILE) as f:
            data = json.load(f)
        return {k: bool(v) for k, v in data.items() if k in TRIGGERS}
    except FileNotFoundError:
        return {}
    except Exception as e:
        print(f"  ! state load failed ({e}) — assuming no prior crossings", flush=True)
        return {}


def save_state() -> None:
    try:
        os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
        tmp = STATE_FILE + ".tmp"
        with open(tmp, "w") as f:
            json.dump({k: v["fired"] for k, v in TRIGGERS.items()}, f, indent=1, sort_keys=True)
        os.replace(tmp, STATE_FILE)
    except Exception as e:
        print(f"  ! state save failed: {e}", flush=True)


def tripwire_now(vitals, wid):
    """Read a tripwire's current value by its DECLARED id, not by list position."""
    for w in vitals.get("tripwires") or []:
        if isinstance(w, dict) and w.get("id") == wid:
            return w.get("now")
    return None


def run_once():
    """One iteration: read the live sources, check triggers, fire on crossing.

    Fail-closed PER TRIGGER: a trigger whose own source is unavailable is skipped
    and named in the log. No value is ever substituted, proxied, or defaulted.
    """
    gold = fetch(SNAPSHOT_URL)
    oil = fetch(OIL_URL)
    vitals = fetch(VITALS_URL)

    unavailable = [
        f"{name}={payload['_error'][:40]}"
        for name, payload in (("gold", gold), ("oil", oil), ("vitals", vitals))
        if "_error" in payload
    ]
    if unavailable:
        print(f"  ! source unavailable: {' | '.join(unavailable)}", flush=True)

    def pick(source, *path):
        if "_error" in source:
            return None
        node = source
        for key in path:
            if not isinstance(node, dict):
                return None
            node = node.get(key)
        return node

    brent = pick(oil, "ticker", "price")                                    # OBS — live XBRENT
    pat = pick(vitals, "ifr_anchors_fy2025", "pat_rm_b")                    # OBS — audited IFR
    cffo = pick(vitals, "ifr_anchors_fy2025", "cffo_rm_b")                  # OBS — audited IFR
    extraction = tripwire_now(vitals, 9) if "_error" not in vitals else None  # OBS gauge (tripwire 9)
    recycling = tripwire_now(vitals, 5) if "_error" not in vitals else None   # INTERPRET ratio (tripwire 5)

    context = {
        "brent_snapshot": brent,
        "pat_snapshot": pat,
        "cffo_anchored": cffo,
        "extraction_snapshot": extraction,
        "capital_recycling_snapshot": recycling,
        "gold_ticker_price": pick(gold, "ticker", "price"),
        "unavailable_sources": unavailable,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    values = {
        "brent_usd_bbl": brent,
        "cffo_rm_b": cffo,
        "extraction_pct_pat": extraction,
        "capital_recycling_x": recycling,
    }

    # Check each trigger
    changed = False
    for tid, tdef in TRIGGERS.items():
        val = values.get(tdef["metric"])
        if val is None:
            print(f"  · {tid} SKIPPED · no live value ({tdef['source'].split(' · ')[0]})", flush=True)
            continue

        fired, comparison = check_trigger(tid, tdef, val)
        if fired and not tdef["fired"]:
            tdef["fired"] = True
            changed = True
            write_trigger_fired(tid, tdef, val, comparison, context)
        elif not fired and tdef["fired"]:
            # State reset — log recovery too
            tdef["fired"] = False
            changed = True
            print(f"  ↺ {tid} reset · {comparison}", flush=True)
        # else: same state, no-op (idempotent)

    if changed:
        save_state()


def main():
    print(f"[what-to-watch daemon] started at {datetime.now(timezone.utc).isoformat()}", flush=True)
    print(f"[what-to-watch daemon] watching: {SNAPSHOT_URL} + {OIL_URL} + {VITALS_URL}", flush=True)
    print(f"[what-to-watch daemon] interval: {INTERVAL}s", flush=True)
    print(f"[what-to-watch daemon] vault: {VAULT}", flush=True)
    print(f"[what-to-watch daemon] state: {STATE_FILE}", flush=True)

    restored = load_state()
    for tid, fired in restored.items():
        TRIGGERS[tid]["fired"] = fired
    print(f"[what-to-watch daemon] restored crossings: "
          f"{[t for t, f in restored.items() if f] or 'none'}", flush=True)

    while True:
        try:
            run_once()
        except Exception as e:
            print(f"  ! iteration error: {e}", flush=True)
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
