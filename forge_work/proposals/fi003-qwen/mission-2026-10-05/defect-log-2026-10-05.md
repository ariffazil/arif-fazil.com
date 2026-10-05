# DEFECT LOG · 2026-10-05 · arif-fazil.com external content/routing/evidence audit

> **Source:** F13 external Firecrawl audit, 12 URLs inspected 10:03–10:06 MYT 2026-10-05.
> **Plus FI-003 first-party re-probe of 8 URLs, same day.**
> **Schema per F13:** URL · observation time · deployment revision · observed behavior · expected behavior · owner · reproduction · acceptance test · retest result.
> **Priority:** P0 = trust contradiction or wrong destination; P1 = navigation / evidence / epistemic; P2 = meta / consistency.
> **First-release target (per F13):** "fix trust contradictions and wrong destinations, then simplify navigation."

---

## P0 — Trust contradictions and wrong destinations (first-release priority)

### F01 (P0) — /999/ claims "Every claim sealed" while verifier reports `gaps-found`
- **URL:** https://arif-fazil.com/999/  ·  (verifier companion: https://arif-fazil.com/999/verify)
- **Observation time:** 2026-10-05 10:03 MYT (F13 audit)  ·  re-probe 2026-10-05 ~11:30 MYT
- **Deployment revision:** HEAD = 1dedd44 ("fix(gates): blue-repair six pre-existing deploy-gate failures (fail-closed held 2026-10-02 deploy)")
- **Observed behavior:**
  - HTML body contains literal strings: `"Every claim sealed"` (in `<meta name="description">` and `og:description`), `"EVERY CLAIM SEALED · arif-fazil.com"`, H1 `"Don't trust this site. Verify it."` — and **4+** `status-sealed` chips labeled `SEALED`.
  - HTML contains **0 references** to `/999/verify` (the verifier endpoint). The "verify it" instruction is a slogan, not a link.
  - `/999/verify` returns: `head: dd759920…, head_seq:45, head_count_seq:62, verified:false, chain_status:"gaps-found", gap_count:6`, gaps include 4 `CHAIN_BREAK` (seq 8, 16, 28, 30) + 1 `HASH_MISMATCH OUT_OF_BAND_APPEND` (seq 43) + 1 `SIGNATURE_FAIL HMAC-SHA256` (seq 43).
- **Expected behavior:** Page should display **current verification state prominently**, link to `/999/verify`, and avoid blanket "SEALED" labels when verifier reports `verified:false`. The 4 classes of claim ("claim support", "record integrity", "human attestation", "independent witness") should be separated.
- **Owner:** A-FORGE + site owner (UI copy) + arifOS + FRAME (verifier diagnostics) — joint.
- **Reproduction:** `curl -sS https://arif-fazil.com/999/ | grep -oE 'Every claim sealed|SEALED' | head -5` (matches) **and** `curl -sS https://arif-fazil.com/999/verify | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['verified'], d['chain_status'])"` (prints `False gaps-found`).
- **Acceptance test:** `/999/` HTML must (a) NOT contain "Every claim sealed" while `/999/verify` is `verified:false`, (b) contain a link to `/999/verify` with the verifier's current `head` hash and `verified` boolean visible to a human reader, (c) state the 6 chain breaks or the 17 unverified entries with their actual values, (d) keep the verifier URL stable.
- **Retest result:** PENDING (copy change + verifier-link insertion not yet applied; verifier repair not yet authorized).

### F02 (P0) — Article URL `/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat/` lands on the index
- **URL:** https://arif-fazil.com/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat/  ·  redirect target: same path without trailing slash → the **MakcikGPT index** (`/world/makcikgpt/`)
- **Observation time:** 2026-10-05 10:04 MYT (F13 audit)  ·  re-probe 2026-10-05 ~11:30 MYT
- **Deployment revision:** HEAD = 1dedd44
- **Observed behavior:**
  - 301 from `/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat/` (trailing slash) to `/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat` (no trailing slash)
  - Following the redirect returns 200, 83,149 B, `<title>` = `"MakcikGPT — Civic Intelligence in Bahasa Makcik · Arif Fazil"`, `og:url` = `"https://arif-fazil.com/world/makcikgpt/"` — **the index, not an article**
  - The article does not exist as its own page; the article URL is a redirect-to-index.
- **Expected behavior:** Either (a) the article exists at its own URL with its own title, body, og:url, og:image, og:description, JSON-LD article schema, sources, and publication date; OR (b) the URL is removed from the homepage link, surfaces.json, and any nav, and returns a 404 with a "no longer published" explanation; OR (c) the URL 308-redirects to a published version of the article (e.g. via `/words/makcikgpt/<slug>/` or another canonical path) with a "moved permanently" signal.
- **Owner:** A-FORGE + site owner + HERMES (article identity).
- **Reproduction:** `curl -sSL -A "Mozilla/5.0" https://arif-fazil.com/world/makcikgpt/rm48-bilion-belanjawan-atau-darutat/` (the typo path) returns the index. Correct path also returns the index.
- **Acceptance test:** A live article URL must return its own `<title>`, `og:url`, `og:image`, `description`, and a body of substantive size (≥ 5 KB non-shell HTML). For unpublished articles, the URL must return 404 or 308 to a published version — never silently impersonate the index.
- **Retest result:** PENDING.

### F03 (P0) — Article shows "Reality Status sealed," "0/8 src," "10 claims," and "SEAL 999" with unexplained source deficit
- **URL:** https://arif-fazil.com/world/makcikgpt/taufik-pergi-mana  (F13 audit observation; my re-probe confirms 200, 24,759 B, the correct article title and `og:url` resolve to this specific article)
- **Observation time:** 2026-10-05 10:05 MYT
- **Deployment revision:** HEAD = 1dedd44
- **Observed behavior:** The page exposes interface elements implying verification (`Reality Status sealed`, `SEAL 999`) while **simultaneously** showing `0/8 src` and `10 claims` — i.e. the source count is zero against a claimed 10-claim document. The display mixes "sealed" assurance with "0 of 8 sources" deficit in the same visual.
- **Expected behavior:** Either the page satisfies `0 < src_count ≤ claims_count` and shows the source list, OR the page is honest about the unresolved state. The "SEAL" badge must not appear over an unresolved source deficit. Each of the 10 claims should be linkable to its own evidence.
- **Owner:** HERMES + domain reviewers + A-FORGE.
- **Reproduction:** `curl -sS https://arif-fazil.com/world/makcikgpt/taufik-pergi-mana | grep -oE 'Reality Status sealed|0/8 src|SEAL 999|10 claims'` (each matches).
- **Acceptance test:** When `src_count < claims_count`, the SEAL badge must not render; the deficit must be visible above the fold; each claim with src=0 should be addressable (e.g. "claim 3 of 10 needs source").
- **Retest result:** PENDING.

---

## P1 — Navigation, evidence presentation, epistemic labels (second-release priority)

### F05 (P1) — Homepage combines too many roles
- **URL:** https://arif-fazil.com/
- **Observation time:** 2026-10-05 10:03 MYT
- **Observed behavior:** Homepage bundles professional intro, briefing requests, institutional metaphor, 4 well detail cards, agent endpoints, 10 civic-article previews.
- **Expected behavior:** Keep a short introduction, selected work, a few clearly labelled destinations. Move full well details into case studies; reduce the civic preview to a small selection.
- **Owner:** AAA + site owner.

### F06 (P1) — Competing classification systems: Discovery (9 rooms), Missions (6 verbs), Words (3 sections + 9 series + 13 floors)
- **URLs:** /discovery/, /missions, /words/
- **Observed behavior:** Three pages each teach a different organising principle as if it were the site's primary.
- **Expected behavior:** Establish one visible hierarchy — `subjects for exploration, tasks for action, architecture for explanation` — and demote the others to supporting text.
- **Owner:** AAA + site owner.

### F07 (P1) — Room labels are metaphorical ("court", "roll", "measure", "voice")
- **URLs:** /discovery/, /discoveries/ (legacy)
- **Observed behavior:** Visitors must read explanatory text to learn that "court" = Permissions, "roll" = Agent directory, "measure" = System monitoring, "voice" = Writing.
- **Expected behavior:** Lead with literal labels; keep the metaphors as optional supporting language.
- **Owner:** AAA + site owner.

### F08 (P1) — Discovery mixes room explanations with health states, endpoints, long tool inventories
- **URL:** /discovery/
- **Observed behavior:** Same page tries to teach rooms AND show machine interfaces AND show health labels.
- **Expected behavior:** A short room directory; operational status and machine interfaces behind explicit links.
- **Owner:** AAA + site owner.

### F09 (P1) — /economics/ has 5 essay cards but all link to /writing
- **URL:** https://arif-fazil.com/economics/
- **Observation time:** 2026-10-05 ~11:35 MYT
- **Re-probe (FI-003):** Zero article-shaped links found on /economics/. Top destinations: /assets (3), /.well-known (2), /institution (2), /_shared (1), /feed.xml (1), /discovery (1), /human (1), /llms.txt (1), /work (1).
- **Observed behavior:** Cards on /economics/ advertise specific articles but link to /writing (the general writing hub), not to actual articles. Visitors expecting a specific piece are routed to a category page.
- **Expected behavior:** Each card links to its actual article URL. Forthcoming articles are marked as such, not advertised as available.
- **Owner:** A-FORGE + site owner + HERMES.

### F10 (P1) — /words/ promises 3 simple choices but buries them
- **URL:** https://arif-fazil.com/words/
- **Observed behavior:** Page headline says "Writing" with description "Long-form essays, formal derivations, philosophical treatises…" and 30,143 B body. Choices (Essays / Knowledge / Civic writing) appear after navigational philosophy and series material.
- **Expected behavior:** Put the three choices immediately after the introduction; move series and atlas material below or into Doctrine.
- **Owner:** AAA + site owner.

### F13 (P1) — Homepage "evidence drawers" mix public source with non-public attestation
- **URL:** https://arif-fazil.com/
- **Observed behavior:** Homepage well "evidence drawers" contain assertions, link to broad GEOX destinations, and reference technical packs that are explicitly withheld.
- **Expected behavior:** Each drawer should be labeled accurately: public source / personal professional attestation / non-public supporting material. A general engine homepage is not a claim-specific citation.
- **Owner:** A-FORGE + site owner + HERMES.

### F14 (P1) — /economics/ mixes observations with calculations; lacks source/method
- **URL:** https://arif-fazil.com/economics/
- **Observed behavior:** "Approximate arithmetic result" labeled `[OBS]`, "oil consumed today" counter lacks a source/method. Both are present in retrieved content.
- **Expected behavior:** Distinguish observations from calculations; show source date, units, calculation, uncertainty. Use suitable precision for an estimate.
- **Owner:** WEALTH + GEOX + site owner.

### F15 (P1) — /earth/ example labeled "real query" then admits literature-sourced
- **URL:** https://arif-fazil.com/earth/
- **Observed behavior:** Page introduces an example as a "real query" and "what comes back", then later explains that formation-level detail is literature-sourced and not a live capture.
- **Expected behavior:** Label as "worked example combining a map query and published interpretation". Separate API output from added geological interpretation.
- **Owner:** GEOX + site owner.

### F16 (P1) — /earth/ "coordinates withheld" but example publishes coordinates
- **URL:** https://arif-fazil.com/earth/
- **Observed behavior:** Page says "coordinates withheld" but the worked example publishes coordinates described as the founder's drilling location.
- **Expected behavior:** Resolve publication policy: use a clearly labelled public demonstration location, or intentionally disclose an authorized location with consistent wording.
- **Owner:** GEOX + site owner.

### F04 (P1) — Article states personal motives/fears as conclusions alongside financial figures
- **URL:** https://arif-fazil.com/world/makcikgpt/taufik-pergi-mana
- **Observed behavior:** Interpretation about a person's private motives appears with the same styling as cited financial figures and named sources.
- **Expected behavior:** HERMES should separate documented events, calculations, hypotheses, and opinion. Each claim about someone's private motives must be labeled, and the public evidence supporting it must be visible.
- **Owner:** HERMES + domain reviewers.

### F12 (P1) — Multiple agent-entry points (`/human`, `/machines`, `/machine`, `/missions`)
- **URLs:** /human, /machines, /machine, /missions
- **Observed behavior:** Homepage sends "Agent start here" to `/human`; separate surfaces exist.
- **Expected behavior:** One obvious developer/agent entry point with clear sub-paths. Preserve useful compatibility redirects.
- **Owner:** AAA + site owner.

---

## P2 — Meta, consistency, language

### F11 (P2) — Homepage and Discovery repeat the same institutional explanation
- **URLs:** /, /discovery/
- **Observed behavior:** Two pages teach the same federation architecture; Discovery additionally explains rejected alternative reference sites.
- **Expected behavior:** One short architectural explanation. Reference-selection arguments belong in an agent-facing design document, not a public surface.
- **Owner:** AAA + site owner.

### F17 (P2) — MakcikGPT article count drift across surfaces
- **URLs:** /, /words/, /world/makcikgpt/, /words/makcikgpt/
- **Observed behavior:** Counts disagree: homepage promotes "80+", Words says 43, /world/makcikgpt/ index contains 42 article links, archive count 41.
- **Expected behavior:** Generate totals from a single published-content source. If scopes differ (e.g. total vs current collection), explain them.
- **Owner:** A-FORGE + site owner.

### F18 (P2) — Economics header/document title/language inconsistency
- **URL:** https://arif-fazil.com/economics/
- **Observed behavior:** Page title "Economics" but `<title>` element is "Research — Arif Fazil". Malay civic content reports `lang:en`.
- **Expected behavior:** Page `<title>`, social metadata, and `lang` derive from the same content record.
- **Owner:** A-FORGE + site owner.

---

## Architecture reconciliation (F13 audit, unprompted but binding on the public surface)

The Federation's organ classification has THREE different public stances. The canon is **arifOS README §2.1 (2026-09-14 ruling)** — 7 organs, HERMES and CHRON as Tier-3 boundary services:

| Stance | Source | Organs | HERMES | CHRON | Status |
|---|---|---|---|---|---|
| Canon (arifOS §2.1) | arifOS/README.md | 7 (arifOS, A-FORGE, AAA, GEOX, WEALTH, WELL, arifFlow) | boundary (Tier-3) | boundary (temporal) | RATIFIED 2026-09-14 |
| Canon (AAA P2) | AAA/README.md | 7 + HERMES as "meaning plane" + CHRON as "temporal plane" | plane (not organ) | plane (not organ) | RATIFIED 2026-09-21 |
| Discovery | /discovery/ | 9 "rooms" | "domain-organ" | omitted | OUT OF DATE — must be reconciled |

**Resolution (FI-003, this turn):** Discovery (and any other public surface that says "9 rooms" or calls HERMES a "domain-organ") must be reconciled to the 7-organ canon with HERMES and CHRON as Tier-3 boundary services (or "planes" per AAA P2). The choice between "boundary service" and "plane" is terminology; the count (7 organs) is fixed. A-FORGE applies the page edit; this is a content fix, not a canon mutation.

---

## First-release sequence (F13 priority order)

1. **F01** — /999/ trust contradiction (UI copy + verifier link + current state) [F13-binary: new copy]
2. **F02** — RM48B article identity (fix OR retire OR 308 to canonical) [F13-binary: which path]
3. **F03** — /world/makcikgpt/taufik-pergi-mana source deficit display [F13-binary: new copy]
4. **F09** — /economics/ card destinations
5. **F11** + **F12** — single nav hierarchy + single agent entry point [F13-binary: 5 stable primary destinations, ratified or amended]
6. **F17** — MakcikGPT count drift (single source of truth)
7. **F18** — /economics/ title / lang consistency
8. **Architecture reconciliation** — Discovery / 9-rooms → 7-organs canon
9. **F04, F05, F06, F07, F08, F10, F13, F14, F15, F16** — second release (epistemic, evidence, visual consolidation)

DITEMPA BUKAN DIBERI ⚒️
