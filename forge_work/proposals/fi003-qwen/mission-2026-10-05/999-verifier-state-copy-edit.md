# CONTENT EDIT SPEC · /999/ — Verifier-state copy (F01 fix, F13 binary B)

> **Source defect:** `/999/` displays "Every claim sealed" (meta description + og:description + hero) and 4+ `status-sealed` chips labeled `SEALED` while `/999/verify` returns `verified:false`, `chain_status:"gaps-found"`, `gap_count:6`. The page's technical section (line 219) acknowledges 1 historical format transition at seq 8 (bridged by V999-BRIDGE-SEAL-001) — but the verifier reports 4 chain breaks + 1 hash mismatch + 1 signature fail, of which seq 16, 28, 30, and 43 are NOT covered by the page's grandfather rule.
> **Ratification:** F13 binary B — verifier-state copy. 2026-10-05.
> **Scope:** content edit to `/999/` page (`/root/arif-fazil.com/sites/arif-fazil.com/999/index.html`). No canon file touched. Verifier unchanged in this slice.
> **Author lane:** 333-AGI / FI-003 (architect — proposal only). A-FORGE applies.

---

## Edits (in order of file lines)

### E1 — Replace the misleading meta description and og:description (lines 10, 22)

**Before** (line 10):
```html
<meta name="description" content="The immutable proof chamber. Cryptographic signatures, sealed records, DID documents, and the hash-chain audit trail. /999 closes the verification loop — evidence governs truth. Public attestation. No secrets, no keys.">
```

**After:**
```html
<meta name="description" content="VAULT999 — hash-chained constitutional audit ledger. Current verifier state: live at /999/verify. Honest, mutable in the sense that gaps are recorded not erased, immutable in the sense that no record can be retroactively altered. Read the current chain status before you trust any SEAL label.">
```

**Before** (line 22):
```html
<meta property="og:description" content="The immutable proof chamber. Cryptographic signatures, sealed records, DID documents, and the hash-chain audit trail. Evidence governs truth." />
```

**After:**
```html
<meta property="og:description" content="VAULT999 — constitutional audit ledger. Current verifier state: live at /999/verify. The chain is honest about its gaps." />
```

### E2 — Replace the hero copy (around lines 410–412)

**Before:**
```html
<span class="hl">WINDOW 1 — /999/verify</span><br>
ΔΩ∞ · EVERY CLAIM SEALED · arif-fazil.com ·
```

**After** (the hero now shows the verifier's current state, fetched at page-render time, with a direct link to /999/verify):
```html
<span class="hl"><a href="/999/verify" style="color:inherit;text-decoration:underline">WINDOW 1 — current verifier state</a></span><br>
ΔΩ∞ · <span id="verifier-state-label">CHECKING VAULT999…</span> · arif-fazil.com ·
```

A small client-side script (`/999/index.html` already includes one near the seal chain diagram) extends to fetch `/999/verify` on page load and render the state into `#verifier-state-label` with one of:
- `verified — last head <sha256:dd7599…> at seq 45 of 62` (when `verified:true`)
- `verification ongoing — 17 of 62 entries unverified, 6 chain breaks recorded` (current state)
- `verifier unavailable — last known head <sha256:dd7599…>` (when /999/verify errors)

### E3 — Replace the unconditional SEALED badge render (around lines where `status-sealed` is applied)

**Before (multiple instances):**
```html
<span class="status status-sealed">SEALED</span>
```

**After** (only render SEALED when `verified:true`):
```html
<span class="status" data-seal-state="verified">VERIFY FIRST</span>
<!-- A small client script reads /999/verify on load; if verified:true, swaps the label to "SEALED" and class to "status-sealed"; if verified:false, swaps to the verifier's current chain_status. -->
```

### E4 — Add a "Current verifier state" panel at the top of the page (before the existing seal-chain section)

Insert a new `<section>` after the hero. Its content is server-rendered from a fresh `/999/verify` call (or, if SSR is constrained, the client script fills it on hydration). Display:

```html
<section id="current-verifier-state" class="vault-panel">
  <h2>Current verifier state</h2>
  <dl>
    <dt>Last head hash</dt>     <dd><code>sha256:dd759920a624d4c04649482f3c23e488f73d528ff550070be78832f18eb56332</code></dd>
    <dt>Head sequence</dt>      <dd>45 of 62 entries verified</dd>
    <dt>Verified</dt>            <dd><strong>false</strong></dd>
    <dt>Chain status</dt>        <dd><code>gaps-found</code> — 17 unverified entries; 6 chain breaks</dd>
  </dl>
  <h3>Chain breaks (read-only, preserved)</h3>
  <ol>
    <li>seq 8 — CHAIN_BREAK — covered by <code>V999-BRIDGE-SEAL-001</code> under grandfather rule <code>V999-GR-001</code> (historical format transition, preserved not erased)</li>
    <li>seq 16 — CHAIN_BREAK — <em>not covered by any bridge seal</em>; root cause: read <code>VAULT999/observability/traces.jsonl</code> seq 16</li>
    <li>seq 28 — CHAIN_BREAK — <em>not covered</em>; investigate</li>
    <li>seq 30 — CHAIN_BREAK — <em>not covered</em>; investigate</li>
    <li>seq 43 — HASH_MISMATCH + SIGNATURE_FAIL (HMAC-SHA256) — mechanism: <code>OUT_OF_BAND_APPEND</code>, "operation_id is a prefix of its own receipt_hash"</li>
  </ol>
  <p><a href="/999/verify">Live verifier endpoint →</a> · the verifier returns this state at every request. The chain is honest about its gaps.</p>
</section>
```

### E5 — Update the existing "verification holds continuously from seq 8 onward" line (line 219) to be precise

**Before (line 219):**
> Verification holds continuously from seq 8 onward.

**After:**
> Verification holds continuously from seq 8 onward **under the bridge-seal grandfather rule**, which preserves one known format transition. The verifier reports additional breaks at seq 16, 28, 30, and 43 that are NOT covered by the bridge seal and are awaiting root-cause analysis. A re-seal that re-asserts `verified:true` without explaining these gaps would conceal the original failure.

### E6 — Do not change the technical sections about hash-chaining, the F3 TRI-WITNESS amendment, the F1–F13 floor descriptions, or the JSON-LD `object: "every record sealed in VAULT999"` schema. These are correct.

---

## Acceptance test

- `curl -sS https://arif-fazil.com/999/ | grep -c "Every claim sealed"` returns `0`
- `curl -sS https://arif-fazil.com/999/ | grep -c "/999/verify"` returns `>= 1`
- `curl -sS https://arif-fazil.com/999/ | grep -oE "verifier-state-label"` matches the new hero hook
- The page contains a `Current verifier state` section with the 6 break entries listed
- The page still contains the existing V999-BRIDGE-SEAL-001 / V999-GR-001 explanation, but the line 219 wording is updated
- The 4+ `status-sealed` chips are replaced with the conditional `data-seal-state="verified"` labels
- `JSON-LD` `object: "every record sealed in VAULT999"` is preserved
- `verified:true` rendering only happens when the verifier reports `verified:true`; while `verified:false`, the SEALED label does not appear

## Reversibility

- The 4 edits above are content-only and reversible.
- The verifier URL is unchanged.
- The V999-BRIDGE-SEAL-001 grandfather rule is preserved (the page does not erase history).
- The 6 chain breaks are surfaced, not erased.

DITEMPA BUKAN DIBEI ⚒️
