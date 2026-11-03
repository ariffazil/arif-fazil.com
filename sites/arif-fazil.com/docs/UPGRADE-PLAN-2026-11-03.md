# arif-fazil.com — Pelan Naik Taraf · 3 November 2026

Status: PROPOSAL untuk naik taraf berperingkat. Tiga item P0 sudah DILAKSANAKAN hari ini
(receipt di bawah). Prinsip: human first (2am test) · agentic backend (extraction test) ·
setiap halaman data bawa tarikh + sumber + label epistemik.

## Dilaksana 3 Nov 2026 (siap + verify live)

1. **/petronas/** — Seksyen IV baharu "Laut dalam bicara — dan apa yang belum masuk buku":
   Megah-1 (Blok 3K, 2025, 200–300 juta tong = anggaran industri, tiada angka rasmi),
   Lebah Emas-1ST1 (PM6/12, play baharu dekat Duyong), Megah-2 appraisal + notis Marine Dept,
   TGS 514 km² (Julai 2026 → April 2027), Fugro AUV, Limbayong FID 28 Ogos 2026 (laporan),
   ERMAI 6 hari→6 saat (laporan syarikat, IR2025), TIRAI (dilaporkan, tiada metrik),
   myPROdata+Iraya (3 Sep 2026). Semua bergaris sumber. Jalan A dikemas kini;
   2 baris watch-list (Apr 2027 TGS data, Megah-2 keputusan); bahagian dinombor semula I–X.
2. **/earth/kinabalu-basin/** — Megah-1 map data diperbetul: year 2024 → 2025,
   play "Deepwater Turbidite (Miocene)" → "Oligo-Miocene Carbonate (Layang-Layang Basin)",
   sepadan seksyen HTML halaman itu sendiri + rekod awam.
3. **GEOX (repo awam GitHub)** — data telaga dalam `tests/test_anomalous_contrast.py`
   disanitasi: `test_megah1_quantified_case` → `test_synthetic_reef_quantified_case`,
   kedalaman 4710/4720 → 4500/4510 (anjakan seragam −210 m; semua assertion kekal hidup),
   `Upper_Reef/Lower_Reef` → `Reef_Top_Synth/Reef_Base_Synth`. 42 test PASS.

## Keputusan menunggu Arif (F13 / call beliau)

- **Senarai nama terlarang gerbang** di `GEOX src/geox_mcp/tools/model_physics.py:37`
  (`Pekaka, LL-1, Megah, Zoisit, Nuri, Rotan`) terbit di repo awam — ia keperluan berfungsi
  gate kerahsiaan; menukar ia mengubah kelakuan servis hidup geox-mcp. Keputusan: biarkan
  (gate perlu tahu apa yang dijaga) atau pindah senarai ke file luar repo.
- **`okf/sabah-basin/hypothesis_ledger.yaml`** (14 fail okf/ di-track, awam) mengandungi
  7 sebutan nama terlarang. Spine sendiri BERSIH (0 nama, 0 angka, ditulis "PUBLIC LANE ONLY").
  Periksa sama ada 7 baris ledger itu kaedah atau data.

## Naik taraf seluruh laman (berperingkat)

### P0 — Kestabilan realiti (minggu ini)
- **Refresh realiti satu arah**: berita teresah → label (MEASURED / DILAPORKAN / ANGGARAN) →
  halaman, dengan dateModified + blok sumber. Pola sudah wujud di /petronas — generalize.
- **Cron pengesan lapuk** (mingguan): imbas `dateModified` semua halaman data;
  >30 hari tanpa semakan = satu baris ke `/root/work/tasks.json`. Bukan dashboard — satu baris.
- **Rute zombi /world/petronas/**: SPA fallback jawab 200 dengan shell generik (phantom-200).
  Putuskan: bina halaman sebenar ATAU buang matcher dari vhost.

### P1 — Pariti statik + agentic extraction (2–3 minggu)
- Setiap route ada shell statik content-first (`public/<route>/index.html`) — audit senarai
  route yang masih SPA-sahaja; isi mengikut trafik.
- `llms.txt` + `page.json` dijana dari build (sudah wujud) — pastikan halaman baharu didaftar;
  setiap halaman membawa 5 fakta boleh-extract di atas fold.

### P2 — Konsistensi visual + nav (sebulan)
- Satu fail token CSS dikongsi (vitals/_shell + canon tokens); halaman rujuk, jangan salin —
  lawan drift token. Nav canon v7 kekal.
- Audit halaman lawan `.bak` lama di webroot; arkib ke `/root/_archive`, jangan biar hidup.

### P3 — Automasi jaga (berterusan)
- `verify-pages.sh` + `site-preflight.py` masuk cron mingguan; output 1 baris PASS/FAIL + senarai.
- Purge Cloudflare automatik selepas setiap deploy additive (pitfall #9: cache 404).
- Deploy kekal additive per-route, tiada `--delete`, tiada reload.

## Ukuran siap setiap item
curl live URL — status + `<title>` + dateModified + satu string kandungan. Build hijau bukan
bukti; 200 SPA-shell bukan bukti. Tiada nombor tanpa sumber; tiada dakwaan tanpa label.
