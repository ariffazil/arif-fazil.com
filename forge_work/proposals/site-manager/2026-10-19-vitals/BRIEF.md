# BRIEF — /vitals/ reality sync (2026-10-19)

Manager: HERMES. Executor: Claude Code.
Repo: /root/arif-fazil.com  ·  Site: https://arif-fazil.com/vitals/
Single file you may edit: `sites/arif-fazil.com/public/vitals/index.html`
Do NOT edit render-vitals.cjs, dist/, /var/www, or any other page. Do NOT run build or deploy. The manager ships.

## Problem

The page is dated 27 September 2026 and its own tripwire — "9 Oktober 2026, belanjawan" — has
already fired. The running text still presents a resolved question as pending ("menunggu
9 Oktober"). Reality moved; the page did not.

## Facts that are now true (all sourced, all dated — do not embellish, do not add anything else)

F1. Belanjawan 2027 was tabled 9 Oct 2026. MoF `2027 Fiscal Outlook and Federal Government Revenue
    Estimates` (belanjawan.mof.gov.my/pdf/belanjawan2027/revenue/fiscal_outlook_2027.pdf) revises the
    2026 PETRONAS dividend UP from RM20b to RM27b, and carries PETRONAS RM32b in 2027 investment income.
F2. The Edge, 9 Oct 2026 (theedgemalaysia.com/node/821106): RM32b expected for 2027 — RM5b / 18.5%
    above the RM27b expected for 2026; 8.4% of projected federal revenue RM380.8b.
F3. Same MoF report: 2027 crude assumption USD78/bbl (2026: USD85). Petroleum-related revenue 2027
    RM61.2b = 16.1% of total (2026: 15.1%).
F4. Brent 19 Oct 2026 ≈ USD108/bbl (Friday settle 109.86, highest since 19 May); Gulf crude flows to
    Kpler ~8.5m b/d in the week, down from >20m. Context for why cash is strong now.
F5. PETRONAS Gas Berhad: High Court of Malaya approved the internal reorganisation on 7 Oct 2026
    (Bursa announcement GA1-07102026-00089) — gas processing, gas transportation and utilities move
    into PG Gas Processing / PG TransCo / PG Utilities East.
F6. Unchanged from the page: sellable barrels 9.35b (1 Jan 2024), 8.64b (2025), 7.92b (2026);
    proven replacement 3-yr average 1.6 → 0.8 → 0.3; no 2027 number printed.
F7. Unchanged from the page: cash RM193.6b at 30 Jun 2026 (RM204.4b at 31 Dec 2025); group debt
    RM126.8b; gearing 21.2%; H1 2026 PAT RM27.2b including RM5.0b Searah disposal gain;
    RM8b of the RM20b declared dividend paid by 30 Jun.

## What to write (interpretation must read as interpretation, never as fact)

I1. Jalan D ("Tuai hari ini") passed its own test: the budget asked more than the RM20b already
    declared. Status becomes "hidup, 9 Oktober" — but with both caveats stated plainly:
      a. RM32b is MoF's *projection*, not a PETRONAS board declaration.
      b. It sits on a USD78 assumption while Brent is ~108 — the extra cash is partly a war price,
         and the same RM32b must later be paid out of 7.92b sellable barrels at 0.3 replacement.
I2. Nothing about the tankage changed. No 2027 reserves number. Still no evidence that sale rights or
    rent rose to replace the barrels sold. That is the honest scoreboard: wallet up, tank down.
I3. PETGAS court approval (F5) is one more portfolio move — assets being separated, not added.

## Edits required (exact anchors in the file)

1. Line ~68 date strip: `27 September 2026 · bukan ramalan bankrap` → `19 Oktober 2026 · bukan ramalan bankrap`
   (optionally keep the original date as "mula 27 September" — one short clause, not a paragraph).
2. Line ~133–134, card D: status pill `· menunggu 9 Oktober` → `· hidup, 9 Oktober`. Rewrite the body line
   so it states the fact (RM32b for 2027 vs RM20b originally declared) plus caveat (a) in one sentence.
3. Line ~138–140 timeline: mark 9 Oktober as done (`✓ 9 Oktober 2026 — belanjawan: RM32b untuk 2027`),
   keep 31 Disember 2026 and Februari 2027 as pending.
4. Line ~149 (first bullet of "Apa yang perlu ditonton"): convert from open question to answered —
   state the number, the date, and link the source (MoF PDF or The Edge). Keep the other bullets
   exactly as they are (31 Dis, Feb 2027, semakan tong, 30 Sep 2027).
5. Add ONE new section immediately after the four-road block (before the timeline strip) titled in BM —
   e.g. "Apa yang berubah 9 Oktober, dan apa yang tidak" — max 4 short paragraphs, containing:
   F1/F2 numbers, F3 assumption, F4 Brent line, I1(a)+(b), I2. Then F5 in one sentence.
6. Add a "Sumber" line at the end of that section with 3 real links: the MoF fiscal outlook PDF,
   The Edge RM32b article, and the Bursa PETGAS announcement reference (or PETRONAS media page).
   Real URLs only. If you cannot construct the Bursa URL with certainty, cite it as
   "Bursa Malaysia GA1-07102026-00089" in text without a URL rather than inventing a link.
7. Change meta description only if it now contradicts the page. Prefer leaving it.

## Style law (non-negotiable)

- BM dapur, short sentences, same voice as the existing page. No English jargon, no bullets of
  corporate speak, no "in conclusion". Do not re-voice the whole page; patch the regions above.
- Preserve every marker comment (`<!--B11-A:...-->` etc.), all inline styles, the class names, the
  nav/footer, and the existing numbers. The build's renderer replaces the marker regions — anything
  you write inside them will be overwritten, so write outside the markers.
- No invented figures, no invented quotes, no new claims about people. No signatures, no author name.
- Numbers in BM format as the page already uses (RM193.6 bilion, 7.92 bilion tong).

## Deliverable back to manager

Print: the list of edits made (line anchors), the exact new sentences you added, and `git diff --stat`
for the one file. If any fact above looks internally inconsistent with the existing page, say so
instead of harmonising it silently.
