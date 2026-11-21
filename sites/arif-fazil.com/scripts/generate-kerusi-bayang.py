#!/usr/bin/env python3
import re
import os

SOURCE_HTML = '/root/arif-fazil.com/sites/arif-fazil.com/public/world/petronas/shadow/index.html'

with open(SOURCE_HTML, 'r', encoding='utf-8') as f:
    orig = f.read()

split_mark = '<section class="person" id="tengku-razaleigh-hamzah">'
if split_mark not in orig:
    raise ValueError("Split mark not found in source HTML!")

_, dossier_part = orig.split(split_mark, 1)

# Ensure dossier part starts with the opening section tag
dossier_part = split_mark + dossier_part

# Let's inspect the cards data
cards_data = [
    {
        "id": "tengku-razaleigh-hamzah",
        "num": "L01",
        "name": "Tengku Razaleigh Hamzah",
        "initials": "TRH",
        "role_badge": "Pengasas · Pengerusi & Ketua Eksekutif",
        "tenure": "1974–1976",
        "categories": "chairman ceo dual",
        "verdict": "LAYAK",
        "verdict_cls": "tersedar",
        "persona": "Putera aristokrat Kelantan & arkitek kedaulatan petroleum negara. Menggubal Akta Pembangunan Petroleum 1974 (PDA 1974) tanpa mengambil sesen pun gaji korporat.",
        "bayang": "Menghubungkan entiti korporat petroleum terus ke dalam orbit kekuasaan politik; merintis model pelaburan konglomerat politik Bumiputera (Fleet Holdings, BBMB) yang kemudiannya menjadi liabiliti fiskal.",
        "tragedi": "Membina asas undang-undang gergasi negara dalam 26 bulan, tetapi terpaksa melepaskan kerusi ke Kementerian Kewangan yang akhirnya mencetuskan pertembungan kuasa politik UMNO.",
        "legacy": "Dalam 26 bulan, beliau meletakkan asas perundangan, fiskal, dan rundingan sebuah syarikat minyak kebangsaan dari sifar.",
        "img": None
    },
    {
        "id": "tan-sri-abdul-kadir-shamsuddin",
        "num": "L02",
        "name": "Tan Sri Abdul Kadir Shamsuddin",
        "initials": "AKS",
        "role_badge": "Pengerusi & Ketua Eksekutif",
        "tenure": "1976–1978",
        "categories": "chairman ceo dual",
        "verdict": "LAYAK",
        "verdict_cls": "tersedar",
        "persona": "Ketua Setiausaha Negara (KSN) pentadbir berdisiplin besi. Diutus memecahkan kebuntuan rundingan 15 bulan menentang gergasi Shell dan Exxon untuk menandatangani Kontrak Perkongsian Pengeluaran (PSC) pertama.",
        "bayang": "Menyuntik budaya birokrasi perkhidmatan awam terus ke dalam urat korporat PETRONAS; meletakkan preseden bahawa kerusi pengerusi adalah kepanjangan tangan KSN Putrajaya.",
        "tragedi": "Meninggal dunia ketika masih dalam perkhidmatan pada 8 November 1978 (usia 58). Tubuhnya rebah tepat ketika mekanisme PSC pertama selesai dimeterai.",
        "legacy": "Mekanisme PSC ialah instrumen tunggal yang mengubah kedaulatan atas kertas PDA 1974 kepada kutipan rente sebenar bernilai berbilion ringgit.",
        "img": "/world/petronas/shadow/assets/abdul-kadir-shamsuddin.jpg"
    },
    {
        "id": "tun-abdullah-mohd-salleh",
        "num": "L03",
        "name": "Tun Abdullah Mohd Salleh",
        "initials": "AMS",
        "role_badge": "Pengerusi & Ketua Eksekutif",
        "tenure": "1979–1988",
        "categories": "chairman ceo dual",
        "verdict": "LAYAK (SCAR)",
        "verdict_cls": "samar",
        "persona": "Peneraju pembinaan hulu dan hilir tempatan. Mengasaskan PETRONAS Carigali, loji LNG Bintulu, dan penapisan Kertih selama sembilan tahun tanpa sebarang skandal peribadi.",
        "bayang": "Beban penyelamatan (bail-out) politik pertama: PETRONAS dipaksa membeli 86.7% Bank Bumiputra (BBMB) bernilai RM2.5B akibat skandal pinjaman spekulasi BMF Hong Kong.",
        "tragedi": "Birokrat berintegriti tinggi yang terpaksa menurunkan tandatangan meluluskan dana petroleum negara untuk menutup krisis perbankan politik.",
        "legacy": "Sembilan tahun membina asas fizikal industri moden negara, namun mencatatkan parut kekal campur tangan fiskal Putrajaya.",
        "img": None
    },
    {
        "id": "tun-raja-mohar-raja-badiozaman",
        "num": "L04",
        "name": "Tun Raja Mohar Raja Badiozaman",
        "initials": "RMR",
        "role_badge": "Pengerusi Lembaga Pengarah",
        "tenure": "1980-an (1984–1988)",
        "categories": "chairman",
        "verdict": "HOLDS",
        "verdict_cls": "samar",
        "persona": "Penasihat Ekonomi Khas Perdana Menteri merangkap diplomat birokrasi Melayu elit. Memelihara kestabilan lembaga tanpa mencetuskan sebarang geseran dengan kepimpinan politik.",
        "bayang": "Pengerusi bayangan yang rekod keputusan komersial spesifiknya kabur; memulakan corak pengerusi emeritus bukan-eksekutif yang menyerahkan kuasa sebenar kepada Jabatan Perdana Menteri.",
        "tragedi": "Tokoh ekonomi terulung yang peranannya di menara minyak lebih kepada payung protokol dan penampan politik berbanding peneraju industri.",
        "legacy": "Menjaga kerusi dengan tenang tanpa skandal, namun mewariskan kekaburan tentang sejauh mana pengerusi boleh menegur eksekutif.",
        "img": None
    },
    {
        "id": "tan-sri-basir-ismail",
        "num": "L05",
        "name": "Tan Sri Basir Ismail",
        "initials": "BI",
        "role_badge": "Pengerusi Lembaga Pengarah",
        "tenure": "1988–1995",
        "categories": "chairman",
        "verdict": "LAYAK",
        "verdict_cls": "tersedar",
        "persona": "Pengerusi korporat pelbagai sektor era industrialisasi Mahathir. Memimpin bersama Azizan Zainul Abidin ketika ledakan Projek Gas Semenanjung (PGU).",
        "bayang": "Pertindihan kepentingan era penswastaan; memegang jawatan pengerusi merentas pelbagai agensi dan GLC serentak (MAHB, MPOB) yang menimbulkan persoalan tadbir urus silang.",
        "tragedi": "Menyaksikan suntikan talian hayat kedua BBMB bernilai RM1.0 bilion pada 1989, membiasakan PETRONAS sebagai pelindung defisit persekutuan.",
        "legacy": "Menstabilkan tadbir urus era peralihan dan menyelesaikan projek tulang belakang gas negara tanpa gangguan pembinaan.",
        "img": None
    },
    {
        "id": "tun-azizan-zainul-abidin",
        "num": "L06",
        "name": "Tun Azizan Zainul Abidin",
        "initials": "AZA",
        "role_badge": "Presiden & CEO (1988–95) · Pengerusi (1995–04)",
        "tenure": "1988–2004",
        "categories": "chairman ceo dual",
        "verdict": "LAYAK",
        "verdict_cls": "tersedar",
        "persona": "Bapa Integriti PETRONAS moden. Bekas Setiausaha Sulit Kanan tiga Perdana Menteri yang meletakkan benteng tadbir urus profesional dan etika kerja kelas dunia.",
        "bayang": "Membina Menara Berkembar KLCC dan bandar pentadbiran Putrajaya; menguruskan kompromi rumit antara mempertahankan kantung syarikat dengan membiayai projek ikonik Mahathir.",
        "tragedi": "Meninggal dunia secara mengejut pada Julai 2004 di meja kerjanya di Putrajaya, meninggalkan jurang kepimpinan moral yang sukar diganti.",
        "legacy": "Piawaian etika dan integriti institusi yang beliau tanamkan kekal menjadi kubu pertahanan terkuat kakitangan PETRONAS hingga hari ini.",
        "img": None
    },
    {
        "id": "tan-sri-mohd-hassan-marican",
        "num": "L07",
        "name": "Tan Sri Mohd Hassan Marican",
        "initials": "MHM",
        "role_badge": "Presiden & CEO (1995–10) · Pemangku Pengerusi (2004)",
        "tenure": "1995–2010",
        "categories": "chairman ceo dual",
        "verdict": "LAYAK KUAT",
        "verdict_cls": "tersedar",
        "persona": "Akauntan berjiwa waja yang mengubah PETRONAS daripada syarikat domestik kepada gergasi global Fortune 500 di lebih 30 buah negara. Penjaga benteng rizab paling kental.",
        "bayang": "Pemusatan kuasa teknokratik mutlak; ketegangan berterusan dengan kepimpinan politik (terutamanya era Abdullah Badawi dan awal Najib Razak) berkenaan pengagihan dividen.",
        "tragedi": "Kontraknya tidak diperbaharui pada Februari 2010 selepas 15 tahun berkhidmat kerana enggan berkompromi tentang integriti perakaunan dan rizab tunai syarikat.",
        "legacy": "Meninggalkan rizab tunai ratusan bilion ringgit dan jenama antarabangsa yang disegani di pasaran bon London dan New York.",
        "img": None
    },
    {
        "id": "tan-sri-shamsul-azhar-abbas",
        "num": "L08",
        "name": "Tan Sri Shamsul Azhar Abbas",
        "initials": "SAA",
        "role_badge": "Presiden & CEO (2010–15) · Pemangku Pengerusi (2011–12)",
        "tenure": "2010–2015",
        "categories": "chairman ceo dual",
        "verdict": "HOLDS",
        "verdict_cls": "samar",
        "persona": "Kader dalaman tulen yang berani bersuara lantang. Membeli Progress Energy di Kanada (C$5.5B), melancarkan kompleks mega Pengerang RAPID, dan menolak campur tangan politik secara terbuka.",
        "bayang": "Pertaruhan gas syal (shale gas) modal tinggi di Kanada pada puncak kitaran sebelum kejatuhan harga komoditi 2014; pergeseran terbuka dengan kerajaan negeri Terengganu dan Sabah.",
        "tragedi": "Kontrak ditamatkan pada 2015 kerana ketegasan beliau menolak tuntutan dividen keterlaluan Najib Razak menjelang krisis kewangan 1MDB.",
        "legacy": "Menunjukkan bahawa CEO lantikan dalaman mampu melawan tekanan politik, walaupun terpaksa membayar dengan kehilangan kerusi.",
        "img": None
    },
    {
        "id": "tan-sri-wan-zulkiflee-wan-ariffin",
        "num": "L09",
        "name": "Tan Sri Wan Zulkiflee Wan Ariffin",
        "initials": "WZW",
        "role_badge": "Presiden & Ketua Pegawai Eksekutif Kumpulan",
        "tenure": "2015–2020",
        "categories": "ceo",
        "verdict": "LAYAK",
        "verdict_cls": "tersedar",
        "persona": "Jurutera kimia dengan disiplin operasi ketat. Mengemudi syarikat meredah kejatuhan harga minyak paling parah (Brent <$30), memotong perbelanjaan RM50 bilion tanpa membuang staf tetap.",
        "bayang": "Terpaksa meluluskan dividen khas rekod RM54 bilion pada 2019 kepada kerajaan Pakatan Harapan untuk menampung tunggakan bayaran balik GST.",
        "tragedi": "Meletakkan jawatan pada Jun 2020 kerana enggan menandatangani penyelesaian politik royalti cukai jualan petroleum Sarawak yang bercanggah dengan PDA 1974.",
        "legacy": "Menyelamatkan kunci kira-kira melalui penjimatan opex/capex paling berdisiplin dalam sejarah syarikat.",
        "img": None
    },
    {
        "id": "tan-sri-mohd-sidek-hassan",
        "num": "L10",
        "name": "Tan Sri Mohd Sidek Hassan",
        "initials": "MSH",
        "role_badge": "Pengerusi Lembaga Pengarah",
        "tenure": "2012–2018",
        "categories": "chairman",
        "verdict": "LAYAK",
        "verdict_cls": "tersedar",
        "persona": "Mantan KSN yang memulihkan dan memisahkan fungsi Pengerusi sebagai institusi pengawasan bebas berasingan daripada jawatan Presiden & CEO.",
        "bayang": "Menghadapi kritikan sebagai lantikan politik pentadbiran Najib Razak; terpaksa mengekalkan ketenangan dewan lembaga ketika skandal 1MDB bergolak di luar menara.",
        "tragedi": "Menyelesaikan dua penggal perkhidmatan penuh dengan rekod tadbir urus bersih, namun terperangkap dalam persepsi polarisasi politik 2018.",
        "legacy": "Mengukuhkan garis pemisah fungsi pengerusi bukan-eksekutif dan memelihara kebebasan audit dalaman syarikat.",
        "img": None
    },
    {
        "id": "tan-sri-ahmad-nizam-salleh",
        "num": "L11",
        "name": "Tan Sri Ahmad Nizam Salleh",
        "initials": "ANS",
        "role_badge": "Pengerusi Lembaga Pengarah",
        "tenure": "2018–2021",
        "categories": "chairman",
        "verdict": "LAYAK",
        "verdict_cls": "tersedar",
        "persona": "Vektor industri minyak berpengalaman kelahiran Terengganu. Membimbing dewan lembaga melalui peralihan tiga kerajaan persekutuan dalam tempoh tiga tahun.",
        "bayang": "Menandatangani Perjanjian Penyelesaian Komersial (CSA) dengan kerajaan Sarawak pada Disember 2020 yang menamatkan hegemoni tunggal pengedaran gas semenanjung di bumi Kenyalang.",
        "tragedi": "Menyelesaikan amanah dengan senyap dan tertib pada Julai 2021 ketika landskap persekutuan masih dihimpit ketidakstabilan politik pandemik.",
        "legacy": "Meredakan ketegangan undang-undang antara Putrajaya dan Sarawak tanpa meruntuhkan struktur teras operasi PETRONAS.",
        "img": None
    },
    {
        "id": "tan-sri-dato-seri-mohd-bakke-salleh",
        "num": "L12",
        "name": "Tan Sri Dato' Seri Mohd Bakke Salleh",
        "initials": "MBS",
        "role_badge": "Pengerusi Lembaga Pengarah",
        "tenure": "2021–kini",
        "categories": "chairman incumbent",
        "verdict": "PENJAWAT KINI · TIADA VERDIK",
        "verdict_cls": "incumbent",
        "persona": "Ikon integriti korporat negara yang meletakkan jawatan daripada 1MDB pada 2009 sebagai protes salah laku. Membawa kredibiliti tadbir urus tertinggi ke kerusi Pengerusi.",
        "bayang": "Menghadapi tekanan pelantikan Petroleum Sarawak Berhad (PETROS) sebagai pengagregat gas tunggal dan persoalan kebebasan lembaga di bawah tekanan fiskal Putrajaya.",
        "tragedi": "Sedang berkhidmat — mengimbangi tuntutan dividen persekutuan RM32B dengan keperluan pelaburan modal peralihan tenaga Gentari.",
        "legacy": "Ujian integriti akhir: adakah benteng tadbir urus beliau mampu bertahan melawan selera perbelanjaan kerajaan persekutuan dan kebangkitan negeri pengeluar.",
        "img": None
    },
    {
        "id": "ym-tan-sri-tengku-muhammad-taufik",
        "num": "L13",
        "name": "YM Tan Sri Tengku Muhammad Taufik",
        "initials": "TMT",
        "role_badge": "Presiden & Ketua Pegawai Eksekutif Kumpulan",
        "tenure": "2020–kini",
        "categories": "ceo incumbent",
        "verdict": "PENJAWAT KINI · TIADA VERDIK",
        "verdict_cls": "incumbent",
        "persona": "Teknokrat perakaunan global & jururunding Davos. Mengemudi pemulihan pasca-pandemik mencatatkan keuntungan bersejarah sambil menubuhkan entiti tenaga bersih Gentari.",
        "bayang": "Kepatuhan teknokratik menyalurkan dividen gergasi persekutuan (RM50B 2022, RM40B 2023, RM32B 2024); hakisan monopoli statutori PDA 1974 di Sarawak kepada PETROS.",
        "tragedi": "Terhimpit di simpang tiga: tuntutan dividen Putrajaya, desakan autonomi minyak Borneo, dan penyusutan margin keuntungan penapisan PRefChem.",
        "legacy": "Kes Terbuka / Hipotesis Terhakis: Penjaga lampu, dompet dan tangki yang berdepan ujian falsifikasi 2027.",
        "img": "/world/petronas/shadow/assets/tengku-muhammad-taufik.jpg",
        "deep_dossier": "/world/petronas/shadow/tengku-muhammad-taufik/"
    }
]

# Generate card HTML
cards_html = []
for c in cards_data:
    if c["img"]:
        portrait_content = f'''<img src="{c['img']}" alt="{c['name']}" loading="lazy" />'''
    else:
        init = c["initials"]
        portrait_content = f'''<svg viewBox="0 0 240 320" class="portrait-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="grad-{init}" cx="50%" cy="38%" r="62%">
              <stop offset="0%" stop-color="#162938" />
              <stop offset="100%" stop-color="#080e18" />
            </radialGradient>
          </defs>
          <rect width="240" height="320" fill="url(#grad-{init})" />
          <circle cx="120" cy="115" r="48" fill="#1e293b" stroke="#00A19C" stroke-width="1.5" stroke-opacity="0.35"/>
          <path d="M 45 275 C 45 195, 80 185, 120 185 C 160 185, 195 195, 195 275 Z" fill="#1e293b" stroke="#00A19C" stroke-width="1.5" stroke-opacity="0.35"/>
          <text x="120" y="125" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="28" font-weight="700" fill="#00A19C" opacity="0.9" letter-spacing="2">{init}</text>
          <text x="120" y="295" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="8.5" fill="#64748B" letter-spacing="1.2">REKOD RASMI · SILUET TERKAWAL</text>
        </svg>'''

    deep_link_html = ""
    if c.get("deep_dossier"):
        deep_link_html = f'''<a href="{c['deep_dossier']}" class="dossier-btn primary-teal">Buka 33 Bayang Penuh (96KB) →</a>'''

    card_str = f'''      <!-- Card {c['num']}: {c['name']} -->
      <article class="pm-card" data-category="{c['categories']}" data-search="{c['name'].lower()} {c['role_badge'].lower()} {c['tenure'].lower()} {c['persona'].lower()} {c['bayang'].lower()}">
        <div class="pm-portrait">
          {portrait_content}
          <div class="order-badge">{c['num']}</div>
          <div class="verdict-badge {c['verdict_cls']}">{c['verdict']}</div>
        </div>
        <div class="pm-body">
          <div class="pm-title">{c['role_badge']}</div>
          <h2 class="pm-name">{c['name']}</h2>
          <div class="pm-tenure">{c['tenure']}</div>

          <div class="pm-section">
            <div class="pm-section-label persona">Persona &amp; Mandat</div>
            <p>{c['persona']}</p>
          </div>

          <div class="pm-section">
            <div class="pm-section-label bayang">Bayang &amp; Parut</div>
            <p>{c['bayang']}</p>
          </div>

          <div class="pm-section tragedi">
            <div class="pm-section-label tragedi">Titik Peralihan / Tragedi</div>
            <p>{c['tragedi']}</p>
          </div>

          <div class="legacy-box {c['verdict_cls']}">
            <div class="legacy-label">Rumusan &amp; Verdik</div>
            {c['legacy']}
          </div>

          <div class="pm-card-actions">
            {deep_link_html}
            <a href="#{c['id']}" class="dossier-btn">Dossier Arkib Mendalam ↓</a>
          </div>
        </div>
      </article>'''
    cards_html.append(card_str)

cards_block = "\n\n".join(cards_html)

# Build Complete HTML Document
head_html = f'''<!doctype html>
<html lang="ms" data-ring="BODY">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Kerusi Bayang — Every PETRONAS Chairman &amp; CEO 1974–2026 | arif-fazil.com</title>
<meta name="description" content="Dossier keluarga Bayang: 13 insan yang memegang dua kerusi yang menjalankan Petroliam Nasional Berhad, 1974–2026. Setiap dakwaan bersumber, yang tak sah dilabel."/>
<link rel="canonical" href="https://arif-fazil.com/world/petronas/shadow/"/>
<meta property="og:title" content="Kerusi Bayang — PETRONAS Chairman &amp; CEO 1974–2026"/>
<meta property="og:description" content="Sovereign Intelligence Dossier · Keluarga Bayang · seal 999"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="https://arif-fazil.com/world/petronas/shadow/"/>
<link rel="alternate" type="text/plain" href="/world/petronas/shadow/llms.txt"/>

<!-- Machine Discovery Endpoints -->
<link rel="alternate" type="application/json" href="https://arif-fazil.com/petronas/state.json" title="PETRONAS Corporate State JSON" />
<link rel="alternate" type="text/markdown" href="https://arif-fazil.com/petronas/brief.md" title="PETRONAS Corporate Brief Markdown" />
<link rel="alternate" type="text/plain" href="https://arif-fazil.com/llms.txt" title="arifOS Master Agentic Index" />

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">

<style>
:root {{
  --bg:#070B14; --bg2:#0B0F19; --ink:#F1F5F9; --dim:#94A3B8; --dim2:#64748B;
  --gold:#E8B84B; --teal:#00A19C; --teal-glow:rgba(0,161,156,0.3); --line:#1F2937;
  --card:#0F172A; --red:#EF4444; --green:#31C48D; --amber:#F59E0B;
  --font-mono:'IBM Plex Mono',monospace; --font-sans:'IBM Plex Sans',system-ui,-apple-system,sans-serif;
}}
*, *::before, *::after {{ box-sizing:border-box; margin:0; padding:0; }}
body {{
  background:var(--bg); color:var(--ink); font-family:var(--font-sans); line-height:1.65;
  -webkit-font-smoothing:antialiased;
}}
.wrap {{
  max-width:1240px; margin:0 auto; padding:1.25rem 1.5rem 4rem;
}}
a {{ color:var(--gold); text-decoration:none; }}
a:hover {{ text-decoration:underline; }}

/* Topbar & Nav */
.topbar {{
  display:flex; justify-content:space-between; align-items:center;
  font-family:var(--font-mono); font-size:.72rem; letter-spacing:.08em;
  text-transform:uppercase; padding:.5rem 0; border-bottom:1px solid var(--line);
}}
.topbar .brand a {{ color:#fff; font-weight:bold; }}
.nav-links {{
  display:flex; flex-wrap:wrap; gap:.75rem 1.25rem; margin:1rem 0;
  font-family:var(--font-mono); font-size:.72rem; text-transform:uppercase;
}}
.nav-links a {{ color:var(--dim); }}
.nav-links a.active {{ color:var(--gold); font-weight:bold; border-bottom:1px solid var(--gold); }}
.crumbs {{
  font-family:var(--font-mono); font-size:.75rem; color:var(--dim2); padding:.35rem 0;
}}
.crumbs a {{ color:var(--dim2); }}

/* Hero header */
.hero-header {{
  padding:2rem 0 1.5rem; border-bottom:1px solid var(--line); margin-bottom:1.5rem;
}}
.kicker {{
  font-family:var(--font-mono); font-size:.72rem; text-transform:uppercase;
  letter-spacing:.14em; color:var(--teal); margin-bottom:.5rem;
}}
h1.page {{
  font-family:Georgia,'DejaVu Serif',serif; font-size:clamp(1.8rem,4.5vw,2.8rem);
  line-height:1.2; margin:.25rem 0 1rem; color:#fff; font-weight:900; font-style:italic;
}}
.sub {{
  color:var(--dim); font-size:1.05rem; max-width:850px; line-height:1.7; margin-bottom:1rem;
}}
.prov {{
  font-size:.8rem; color:var(--dim2); border-left:2px solid var(--line);
  padding-left:.85rem; margin:1rem 0 1.5rem; font-family:var(--font-mono); line-height:1.6;
}}

/* Quick orient */
.orient {{
  display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:.75rem; margin:1rem 0 2rem;
}}
.orient a {{
  display:block; background:var(--card); border:1px solid var(--line);
  border-radius:6px; padding:.75rem .85rem; transition:border-color .2s;
}}
.orient a:hover {{ border-color:var(--teal); text-decoration:none; }}
.orient .os {{ display:block; font-family:var(--font-mono); font-size:.75rem; font-weight:bold; color:var(--teal); text-transform:uppercase; }}
.orient .od {{ font-size:.78rem; color:var(--dim); margin-top:.2rem; }}

/* Gallery Controls */
.gallery-controls {{
  background:var(--card); border:1px solid var(--line); border-radius:8px;
  padding:1.25rem; margin-bottom:2rem; display:flex; flex-direction:column; gap:1rem;
}}
.controls-top {{
  display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;
}}
.filter-group {{
  display:flex; flex-wrap:wrap; gap:.5rem; align-items:center;
}}
.filter-btn {{
  background:rgba(255,255,255,0.04); border:1px solid var(--line); color:var(--dim);
  padding:.4rem .85rem; border-radius:4px; font-family:var(--font-mono); font-size:.72rem;
  cursor:pointer; transition:all .2s; text-transform:uppercase; letter-spacing:.06em;
}}
.filter-btn:hover {{ border-color:var(--dim); color:#fff; }}
.filter-btn.active {{
  background:rgba(0,161,156,0.2); border-color:var(--teal); color:#2dd4bf; font-weight:bold;
}}
.search-box {{
  flex:1; min-width:260px; max-width:400px;
}}
.search-input {{
  width:100%; background:#070B14; border:1px solid var(--line); color:#fff;
  padding:.5rem .85rem; border-radius:4px; font-family:var(--font-mono); font-size:.78rem;
  transition:border-color .2s;
}}
.search-input:focus {{ outline:none; border-color:var(--teal); }}
.search-meta {{
  display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.5rem;
  font-family:var(--font-mono); font-size:.68rem; color:var(--dim2); padding-top:.5rem;
  border-top:1px dashed var(--line);
}}
.legend-bar {{
  display:flex; flex-wrap:wrap; gap:.75rem 1.25rem;
}}
.legend-item {{ display:flex; align-items:center; gap:.4rem; text-transform:uppercase; letter-spacing:.05em; }}
.legend-dot {{ width:7px; height:7px; border-radius:50%; }}

/* PM / Kerusi Bayang Grid */
.pm-grid {{
  display:grid; grid-template-columns:repeat(3, 1fr); gap:1.5rem; padding:1rem 0 3rem;
}}
@media (max-width: 1023px) {{
  .pm-grid {{ grid-template-columns:repeat(2, 1fr); }}
}}
@media (max-width: 639px) {{
  .pm-grid {{ grid-template-columns:1fr; }}
}}

/* Card */
.pm-card {{
  background:var(--card); border:1px solid var(--line); border-radius:8px;
  overflow:hidden; transition:transform .2s ease, border-color .2s ease, box-shadow .2s ease;
  display:flex; flex-direction:column;
}}
.pm-card:hover {{
  border-color:var(--teal); box-shadow:0 8px 24px -8px rgba(0,161,156,0.25);
  transform:translateY(-2px);
}}
.pm-card.hidden {{ display:none !important; }}

/* Portrait */
.pm-portrait {{
  position:relative; width:100%; aspect-ratio:3/4; background:#080e18;
  overflow:hidden; border-bottom:1px solid var(--line);
}}
.pm-portrait img {{
  width:100%; height:100%; object-fit:cover; filter:grayscale(1);
  transition:filter .5s ease, transform .5s ease;
}}
.pm-card:hover .pm-portrait img {{
  filter:grayscale(0); transform:scale(1.02);
}}
.portrait-svg {{
  width:100%; height:100%; display:block; transition:filter .4s ease;
}}
.pm-card:hover .portrait-svg {{
  filter:drop-shadow(0 0 10px rgba(0,161,156,0.25));
}}

/* Badges on Portrait */
.order-badge {{
  position:absolute; top:.75rem; left:.75rem; padding:.2rem .55rem; border-radius:4px;
  background:rgba(7,11,20,0.88); backdrop-filter:blur(4px); border:1px solid var(--line);
  font-family:var(--font-mono); font-size:.65rem; font-weight:700; color:var(--gold);
  letter-spacing:.08em;
}}
.verdict-badge {{
  position:absolute; top:.75rem; right:.75rem; padding:.2rem .6rem; border-radius:4px;
  font-family:var(--font-mono); font-size:.55rem; font-weight:600; text-transform:uppercase;
  letter-spacing:.08em; backdrop-filter:blur(4px);
}}
.verdict-badge.tersedar {{
  background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.35); color:#34d399;
}}
.verdict-badge.samar {{
  background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.35); color:#fbbf24;
}}
.verdict-badge.incumbent {{
  background:rgba(0,161,156,0.18); border:1px solid rgba(0,161,156,0.45); color:#2dd4bf;
}}

/* Card Body */
.pm-body {{
  padding:1.25rem; display:flex; flex-direction:column; flex:1;
}}
.pm-title {{
  font-family:var(--font-mono); font-size:.65rem; color:var(--teal);
  text-transform:uppercase; letter-spacing:.1em; font-weight:600;
}}
.pm-name {{
  font-size:1.25rem; font-weight:800; font-style:italic; font-family:Georgia,serif;
  text-transform:uppercase; margin:.25rem 0 .15rem; color:#fff; line-height:1.2;
}}
.pm-tenure {{
  font-family:var(--font-mono); font-size:.7rem; color:var(--dim2); margin-bottom:.85rem;
}}
.pm-section {{
  border-top:1px solid var(--line); padding-top:.65rem; margin-top:.65rem;
}}
.pm-section-label {{
  font-family:var(--font-mono); font-size:.55rem; text-transform:uppercase;
  letter-spacing:.12em; font-weight:700; margin-bottom:.25rem;
}}
.pm-section-label.persona {{ color:var(--teal); }}
.pm-section-label.bayang {{ color:var(--gold); }}
.pm-section-label.tragedi {{ color:#f87171; }}
.pm-section p {{
  font-size:.82rem; color:var(--dim); line-height:1.55;
}}
.pm-section.tragedi p {{
  font-style:italic; color:#94a3b8;
}}

.legacy-box {{
  padding:.75rem; border-radius:6px; margin-top:.85rem; font-size:.78rem;
  line-height:1.55; background:rgba(15,23,42,0.6); border:1px solid var(--line);
}}
.legacy-box.tersedar {{
  background:rgba(34,197,94,0.05); border-color:rgba(34,197,94,0.2);
}}
.legacy-box.samar {{
  background:rgba(245,158,11,0.05); border-color:rgba(245,158,11,0.2);
}}
.legacy-box.incumbent {{
  background:rgba(0,161,156,0.06); border-color:rgba(0,161,156,0.25);
}}
.legacy-box .legacy-label {{
  font-family:var(--font-mono); font-size:.55rem; text-transform:uppercase;
  letter-spacing:.1em; font-weight:700; margin-bottom:.2rem;
}}
.legacy-box.tersedar .legacy-label {{ color:#34d399; }}
.legacy-box.samar .legacy-label {{ color:#fbbf24; }}
.legacy-box.incumbent .legacy-label {{ color:#2dd4bf; }}

.pm-card-actions {{
  margin-top:1rem; padding-top:.75rem; border-top:1px solid var(--line);
  display:flex; flex-direction:column; gap:.5rem;
}}
.dossier-btn {{
  display:inline-flex; align-items:center; justify-content:center;
  padding:.5rem .85rem; border-radius:4px; font-family:var(--font-mono);
  font-size:.7rem; font-weight:600; text-decoration:none; text-transform:uppercase;
  letter-spacing:.06em; background:rgba(255,255,255,0.04); border:1px solid var(--line);
  color:var(--dim); transition:all .2s;
}}
.dossier-btn:hover {{
  background:rgba(0,161,156,0.15); border-color:var(--teal); color:#fff; text-decoration:none;
}}
.dossier-btn.primary-teal {{
  background:rgba(0,161,156,0.2); border-color:var(--teal); color:#2dd4bf;
}}
.dossier-btn.primary-teal:hover {{
  background:var(--teal); color:#070B14; font-weight:700;
}}

/* Dossier Deep Section styling */
.dossier-break {{
  margin:4rem 0 2rem; padding:2rem 0 1rem; border-top:2px solid var(--line);
  text-align:center;
}}
.dossier-break h2 {{
  font-family:Georgia,serif; font-size:1.8rem; color:#fff; font-style:italic;
}}
.dossier-break p {{
  font-family:var(--font-mono); font-size:.75rem; color:var(--dim2); text-transform:uppercase;
  letter-spacing:.1em; margin-top:.5rem;
}}
.person {{
  background:var(--card); border:1px solid var(--line); border-radius:10px;
  padding:1.5rem 1.75rem; margin:1.75rem auto; max-width:960px;
}}
.person h1 {{
  font-family:Georgia,serif; font-size:1.6rem; color:#fff; margin:.1rem 0 .25rem;
}}
.person h2 {{
  font-family:var(--font-mono); font-size:.85rem; text-transform:uppercase;
  letter-spacing:.1em; color:var(--teal); margin:1.3rem 0 .4rem;
}}
.person h3 {{
  font-family:var(--font-mono); font-size:.78rem; color:var(--dim2); margin:1.1rem 0 .35rem;
}}
.person .seat {{
  display:block; font-size:.88rem; color:var(--gold); font-family:var(--font-mono); margin:.2rem 0 1rem;
}}
.person p {{
  font-size:.95rem; color:var(--ink); margin:.5rem 0; line-height:1.7;
}}
.person table {{
  width:100%; border-collapse:collapse; font-size:.85rem; margin:.75rem 0;
}}
.person th {{
  font-family:var(--font-mono); font-size:.72rem; text-transform:uppercase;
  color:var(--dim2); text-align:left; border-bottom:1px solid var(--line); padding:.45rem .6rem;
}}
.person td {{
  border-bottom:1px solid rgba(31,41,55,.6); padding:.45rem .6rem; vertical-align:top; color:var(--dim);
}}
.table-scroll {{
  overflow-x:auto; -webkit-overflow-scrolling:touch; margin:1rem 0;
}}
.xlink {{
  display:block; background:var(--bg2); border:1px solid var(--line);
  border-radius:8px; padding:.85rem 1rem; margin:.6rem 0; text-decoration:none;
}}
.xlink:hover {{ border-color:var(--gold); text-decoration:none; }}
.xlink .xt {{ font-family:var(--font-mono); font-size:.8rem; font-weight:bold; color:var(--gold); text-transform:uppercase; letter-spacing:.06em; }}
.xlink .xd {{ font-size:.85rem; color:var(--dim); margin-top:.2rem; }}
footer {{
  margin-top:4rem; border-top:1px solid var(--line); padding-top:1.5rem; text-align:center;
}}
.creed {{
  font-family:var(--font-mono); font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; color:var(--dim2);
}}
@media (prefers-reduced-motion:reduce) {{
  *, *::before, *::after {{ animation:none!important; transition:none!important; }}
}}
</style>

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Kerusi Bayang — Every PETRONAS Chairman & Chief Executive, 1974–2026",
  "description": "Every PETRONAS chairman and CEO 1974–2026: mandate, what they brought, what they got, scars, transition, verdict — with claim register and source ledger.",
  "url": "https://arif-fazil.com/world/petronas/shadow/",
  "inLanguage": "ms",
  "dateModified": "2026-11-22"
}}
</script>
<meta name="last-modified" content="2026-11-22" />
</head>
<body>
  <link rel="stylesheet" href="/_shared/fed-nav.css">
  <div id="fed-nav-root"></div>
  <noscript><header class="fed-navbar" aria-label="Federation primary navigation"><a class="nav-brand" href="/"><span class="psi-badge">Ψ</span><span>ARIF FAZIL</span></a><nav class="nav-links" aria-label="Primary"><a href="/">Home</a><a href="/about">About</a><a href="/earth">Earth</a><a href="/words">Words</a><a href="/makcikgpt">MakcikGPT</a><a href="/world">World</a><a href="/work">Work</a></nav></header></noscript>
  <script src="/_shared/fed-nav.js" defer></script>

<div class="wrap">
  <div class="topbar">
    <span class="brand"><a href="/">ARIF FAZIL</a></span>
    <span>Keluarga Bayang · seal 999</span>
  </div>

  <nav class="nav-links" aria-label="Keluarga Bayang">
    <a href="/world/politics/shadow/">PM Bayang</a>
    <a href="/world/ai/shadow/">AI Labs Bayang</a>
    <a href="/world/petronas/shadow/" class="active" aria-current="page">Kerusi Bayang</a>
    <a href="/world/petronas/shadow/tengku-muhammad-taufik/">33 Bayang TMT</a>
    <a href="/wealth/petronas/">KLCC Telemetry</a>
    <a href="/wealth/malaysia/">Putrajaya Telemetry</a>
    <a href="/world/makcikgpt/">MakcikGPT</a>
  </nav>

  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">arif-fazil.com</a> / <a href="/world/">world</a> / <a href="/world/petronas/shadow/">petronas-shadow</a> / kerusi-bayang-1974-2026</nav>

  <header class="hero-header">
    <div class="kicker">Sovereign Intelligence Dossier · Siri Penjaga Menara · Seal 999</div>
    <h1 class="page">Kerusi Bayang — Galeri 13 Pengerusi &amp; Ketua Eksekutif PETRONAS (1974–2026)</h1>
    <p class="sub">Tiga belas insan memegang dua kerusi yang menjalankan Petroliam Nasional Berhad sepanjang lima dekad. Dari arkitek PDA 1974 hingga penjawat pasca-pandemik — siapa yang membina benteng, siapa yang tunduk pada tuntutan rente, dan siapa yang membayar harganya.</p>
    <div class="prov">Prepared for Arif Fazil · Dikemas kini 2026-11-22 · Kuala Lumpur<br/>
Pangkalan Sumber: Laporan Bersepadu PETRONAS (1974–2026), Rekod Parlimen (Hansard), Warta Kerajaan Persekutuan, The Edge Malaysia, Bernama, Reuters, Arkib Kepimpinan Perdana.<br/>
Disiplin Bukti: Setiap dakwaan berlabel [OBS]/[DER]/[INT]. Tiada gambar rekaan atau tidak berlesen. Penjawat kini tidak diberikan verdik muktamad (status kes terbuka).</div>

    <nav class="orient" aria-label="Orientasi pantas">
      <a href="#kerusi-gallery"><span class="os">Galeri Kerusi</span><span class="od">13 Kad Potret &amp; Analisis Bayang</span></a>
      <a href="#dossier-arkib"><span class="os">Dossier Arkib</span><span class="od">Rekod Penuh 13 Penjawat &amp; Bukti</span></a>
      <a href="#the-founding-executive-directors"><span class="os">Pengarah Pengasas</span><span class="od">Rastam &amp; Wan Ismail</span></a>
      <a href="#what-the-seat-rewards"><span class="os">Ganjaran Kerusi</span><span class="od">5 Pola Pengagihan Kuasa</span></a>
      <a href="#sources-amp-provenance"><span class="os">Daftar Sumber</span><span class="od">Ledger Bukti &amp; Jurang Nyata</span></a>
    </nav>
  </header>

  <!-- Interactive Gallery Controls -->
  <section class="gallery-controls" id="kerusi-gallery">
    <div class="controls-top">
      <div class="filter-group">
        <button type="button" class="filter-btn active" data-filter="all">Semua (13)</button>
        <button type="button" class="filter-btn" data-filter="chairman">Chairman (11)</button>
        <button type="button" class="filter-btn" data-filter="ceo">CEO (8)</button>
        <button type="button" class="filter-btn" data-filter="dual">Dual-role (6)</button>
        <button type="button" class="filter-btn" data-filter="incumbent">Incumbent (2)</button>
      </div>

      <div class="search-box">
        <input type="text" id="kerusi-search" class="search-input" placeholder="Cari nama, jawatan, mandat, bayang..." aria-label="Cari kerusi kepimpinan" />
      </div>
    </div>

    <div class="search-meta">
      <div class="legend-bar">
        <div class="legend-item"><span class="legend-dot" style="background:#34d399"></span> TERSEDAR — Mandat &amp; Asas Kukuh</div>
        <div class="legend-item"><span class="legend-dot" style="background:#fbbf24"></span> SAMAR — Bersyarat / Berparut</div>
        <div class="legend-item"><span class="legend-dot" style="background:#2dd4bf"></span> INCUMBENT — Sedang Berkhidmat (Tiada Verdik)</div>
      </div>
      <div id="kerusi-counter">Memaparkan 13 / 13 kerusi</div>
    </div>
  </section>

  <!-- Gallery Grid (13 Cards) -->
  <main class="pm-grid" id="pm-card-grid">
{cards_block}
  </main>

  <div class="dossier-break" id="dossier-arkib">
    <h2>Dossier Arkib Mendalam</h2>
    <p>Rekod Terperinci, Transisi Kuasa, Imbuhan, Parut &amp; Analisis Komparatif (1974–2026)</p>
  </div>

'''

# Now let's handle the closing of dossier part and ensure scripts and links are integrated
# Let's inspect where xlink or footer starts in dossier_part
xlink_idx = dossier_part.find('<nav aria-label="Keluarga Bayang — surfaces lain">')
if xlink_idx != -1:
    dossier_text = dossier_part[:xlink_idx]
    tail_text = dossier_part[xlink_idx:]
else:
    dossier_text = dossier_part
    tail_text = "</div></body></html>"

# Interactive Filter & Search Script
filter_script = '''
  <nav aria-label="Keluarga Bayang — surfaces lain" style="margin-top:3rem;">
    <a class="xlink" href="/world/petronas/shadow/tengku-muhammad-taufik/"><span class="xt">33 Bayang Tengku Muhammad Taufik →</span><span class="xd">Analisis mendalam 33 bayang teknokrat, dompet, dan tangki negara (2020–2026).</span></a>
    <a class="xlink" href="/world/politics/shadow/"><span class="xt">PM Bayang →</span><span class="xd">Sembilan Perdana Menteri Malaysia — siapa memerintah dari belakang tirai.</span></a>
    <a class="xlink" href="/world/ai/shadow/"><span class="xt">AI Labs Bayang →</span><span class="xd">Bayang model, makmal, dan pemilik — siapa bentu AI yang hang guna hari ini.</span></a>
    <a class="xlink" href="/wealth/petronas/"><span class="xt">KLCC Corporate Telemetry →</span><span class="xd">Kunci kira-kira korporat, capex hulu, dan simulasi dividen masa nyata.</span></a>
    <a class="xlink" href="/world/makcikgpt/"><span class="xt">MakcikGPT →</span><span class="xd">Semua laporan siasatan sivik — Termasuk artikel asal dossier ni.</span></a>
  </nav>

  <footer>
    <p class="creed">DITEMPA BUKAN DIBERI · arifOS Federation · Enjin melapor. Manusia yang putuskan.</p>
    <p class="prov">Persona: MakcikGPT · Dossier asal: <a href="/world/makcikgpt/petronas-leadership-1974-2026">/world/makcikgpt/petronas-leadership-1974-2026</a> · seal 999 · compiled 2026-09-17, updated 2026-11-22</p>
  </footer>
</div>

<script>
(function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('kerusi-search');
  const cards = document.querySelectorAll('.pm-card');
  const counter = document.getElementById('kerusi-counter');

  let currentFilter = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    cards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      const searchText = card.getAttribute('data-search') || '';

      const matchesFilter = (currentFilter === 'all') || categories.includes(currentFilter);
      const matchesSearch = !query || searchText.includes(query);

      if (matchesFilter && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (counter) {
      counter.textContent = `Memaparkan ${visibleCount} / ${cards.length} kerusi`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      searchQuery = e.target.value;
      applyFilters();
    });
  }
})();
</script>
</body>
</html>
'''

full_html = head_html + dossier_text + filter_script

with open(SOURCE_HTML, 'w', encoding='utf-8') as f:
    f.write(full_html)

print(f"Successfully generated {SOURCE_HTML}. New size: {len(full_html)} bytes.")
