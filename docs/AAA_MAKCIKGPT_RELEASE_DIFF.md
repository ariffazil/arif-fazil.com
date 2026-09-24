# AAA & MakcikGPT Release Diff (Phase 888)

> **Branch:** `feat/aaa-makcikgpt-alignment-v2`  
> **Base:** `main` (`e4cd5627e36c3a8e9975e6571a8031b399c351d6`)  

---

## 1. Files Added
- `docs/AAA_MAKCIKGPT_BASELINE.md`
- `docs/MAKCIKGPT_TRUTH_LINEAGE.md`
- `docs/MAKCIKGPT_DRIFT_REPORT.json`
- `docs/MAKCIKGPT_DRIFT_REPORT.md`
- `docs/AAA_EXISTING_CAPABILITY_AUDIT.md`
- `docs/AAA_CAPABILITY_TRUTH_TABLE.json`
- `docs/AAA_MAKCIKGPT_INTEGRATION_SPEC.md`
- `docs/MAKCIKGPT_PUBLICATION_SCHEMA.md`
- `docs/MAKCIKGPT_HUMAN_INFORMATION_ARCHITECTURE.md`
- `docs/MAKCIKGPT_EDITORIAL_HOLD_REGISTER.md`
- `docs/AAA_MAKCIKGPT_VALIDATION_REPORT.md`
- `docs/AAA_MAKCIKGPT_RELEASE_DIFF.md`
- `sites/arif-fazil.com/public/world/makcikgpt/llms.txt`
- `sites/arif-fazil.com/public/world/makcikgpt/llms.json`
- `sites/arif-fazil.com/public/world/makcikgpt/articles.json`

---

## 2. Files Modified
- `sites/arif-fazil.com/scripts/generate-discovery.cjs`:
  - Added emission of MakcikGPT scoped machine surfaces (`llms.txt`, `llms.json`, `articles.json`).
- `sites/arif-fazil.com/scripts/generate-agent-shells.cjs`:
  - Refactored `world/makcikgpt` static shell into 3-tier broadsheet (Current Signal, Live Dossiers, Dispatches, primary action buttons, Trust & Seal lineage footer).
- `sites/arif-fazil.com/src/pages/MakcikGPT.tsx`:
  - Added 3-tier visual hierarchy to React component, matching static shell.
- `sites/arif-fazil.com/tests/makcik-source.test.cjs`:
  - Updated test to verify scoped `public/world/makcikgpt/llms.txt` and exclude machine files from slug capture.
