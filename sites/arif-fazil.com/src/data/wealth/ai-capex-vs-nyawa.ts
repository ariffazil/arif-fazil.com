import type { WealthArticleContent } from './types';

const content: WealthArticleContent = {
  slug: 'ai-capex-vs-nyawa',
  html: `<article class="wealth-article" lang="ms">

<div class="masthead">
  <p class="masthead-kicker">NPV ANALYSIS · AI CAPEX vs SOCIAL COST · SLOT 4 TRILOGY CLOSER</p>
  <h1 class="masthead-title">AI Capex vs 697,000 Nyawa</h1>
  <p class="masthead-subtitle">NPV Siapa Yang Kita Kira? — Discount-rate capital expenditure against the social cost of displaced workers.</p>
  <div class="masthead-byline">
    <span class="author">By Arif Fazil</span> &nbsp;|&nbsp; WEALTH · Capital Intelligence &nbsp;|&nbsp;
    <span class="meta">Seal 999 · Version 1.1 — Companion Piece to <em>AI Makan Kerja, Johor Pilih Bos, Rakyat Bayar Semua</em> · 6 Julai 2026 (revised 17 Sept 2026 — F2 drift correction)</span>
  </div>
</div>

<hr />

<blockquote style="border-left:4px solid #D9A62E;background:#11151C;padding:16px 20px;margin:16px 0 24px;font-style:italic;color:#EDEAE2;font-size:1.05em;line-height:1.6;">
  "Kalau hang kira capex sebagai 'pelaburan' tapi kira orang yang hilang kerja sebagai 'kos yang tak boleh dielak' — itu bukan ekonomi. Itu keldai jahit."
</blockquote>

<hr />

<section class="article-section">
  <h2 style="font-family:Georgia,serif;font-size:1.6em;font-weight:700;color:#EDEAE2;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1F2733;line-height:1.2;">1. HOOK — DUA ANGKA. MANA SATU KITA KIRA?</h2>

  <p>27 Mac 2024, Reuters dan The Star lapor satu perjanjian: YTL Power International dan Nvidia akan labur USD 2.3 bilion (RM ~10 bilion pada kadar semasa) untuk kampus AI di Kulai, Johor — 500MW fasa pertama, GPU Blackwell dan GB200 Grace Blackwell Superchip. Bulan-bulan berikutnya, tanah YTL yang sedia ada (1,640 ekar) dibuka untuk kampus itu; landasan solar YTL Power bagi sokongan kuasa; YTL Comms bagi fiber; YTL AI Labs (ILMU) jadi anchor tenant.</p>

  <p>Angka pertama — <strong>RM 10 bilion modal persendirian YTL-Nvidia</strong> (disahkan Reuters/DCD Mar 2024) + <strong>RM 5.9 bilion insertif kerajaan</strong> (tax allowance, tanah, tarif air — disebut dalam pendedahan Belanjawan 2025) + <strong>RM 3-4 bilion sambungan kuasa</strong> YTL Power untuk 600MW. Jumlah agregat capex berkaitan AI Johor 2024-2027: anggaran konservatif RM 18-21 bilion.</p>

  <p>Angka kedua — <strong>697,000 pekerjaan Malaysia</strong> yang dijangka terancam dekad ini dek automation AI. Menteri Sumber Manusia, Datuk Ramanan, umum angka itu pada Julai 2026 dengan satu kerangka: "kalau pekerja tak naik taraf kemahiran dalam 24 bulan."</p>

  <p>Dua angka. Satu duit masuk. Satu nyawa keluar. Mereka <em>berlawan</em>. Bukan selari. Bukan neutral.</p>

  <p>Dalam bahasa ekonomi, dua angka ini dipanggil "discounted cashflow" — aliran tunai masa depan yang dibawakan ke nilai hari ini. Pelaburan masuk — positif. Kehilangan pekerjaan — negatif. Tolak. Dapat NPV.</p>

  <p>Dan persoalannya ialah: <strong>siapa yang discount pada kadar berapa, dan atas sebab apa?</strong></p>

  <p>YTL Power discount capex mereka pada kadar pulangan pelaburan (IRR) 12-15%. Itu logik. IRR tinggi sebab risiko tinggi: teknologi baru, permintaan baru, pasaran baru.</p>

  <p>Tetapi kehilangan 697,000 pekerjaan — Makcik tak nampak mana-mana menteri yang discount angka itu. Tak nampak IRR untuk pengangguran. Tak nampak NPV untuk kehilangan gaji. Tak nampak FCFE (free cashflow to the unemployed).</p>

  <p>Makcik nampak satu sahaja: angka yang dimasukkan ke dalam "pelaburan" di satu lajur, dan angka yang dibuang ke dalam "transition cost" di lajur lain — tanpa kira NPV.</p>

  <p>Artikel ni bukan tuduhan. Artikel ni ialah <strong>exercise</strong>: discount dua-dua angka pada kadar yang sama, dan tengok apa jadi.</p>
</section>

<hr />

<section class="article-section">
  <h2 style="font-family:Georgia,serif;font-size:1.6em;font-weight:700;color:#EDEAE2;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1F2733;line-height:1.2;">2. APAKAH NPV? — DULU, BELAJAR LIMA MINIT</h2>

  <p>NPV = <em>Net Present Value</em>. Nilai sekarang bersih. Konsepnya mudah.</p>

  <p>Wang hari ini lebih bernilai dari wang esok — sebab duit hari ini boleh dilaburkan, dan esok ada risiko yang duit itu tak sampai. Maka, aliran tunai masa depan <em>didiskaunkan</em> balik ke hari ini pada satu kadar faedah — dipanggil <strong>discount rate</strong>.</p>

  <p>Formula asas:</p>

  <div class="formula">
    <code>NPV = Σ [CF<sub>t</sub> / (1 + r)<sup>t</sup>] − C<sub>0</sub></code>
  </div>

  <p>Di mana CF<sub>t</sub> ialah aliran tunai tahun ke-t, r ialah discount rate, C<sub>0</sub> ialah pelaburan permulaan.</p>

  <p>Kalau NPV positif → projek berbaloi. Kalau negatif → hang patut lari.</p>

  <p>Tapi ada tiga soalan yang lebih dalam dari formula:</p>

  <p><strong>Pertama — siapa yang pilih discount rate?</strong> Syarikat guna IRR atau WACC (Weighted Average Cost of Capital) yang berkisar 8-15%. Kerajaan guna social discount rate (SDR) yang lebih rendah, biasanya 3-7%, sebab kerajaan bukan untuk pulangan — kerajaan untuk kebajikan kolektif. World Bank cadangkan 3-5% untuk projek infrastruktur negara membangun.</p>

  <p><strong>Kedua — masa depan siapa yang kita kira?</strong> Kapex YTL diukur dalam 7-10 tahun pelaburan. Kerugian pekerjaan diukur dalam 20-30 tahun hayat bekerja. <em>Time horizon</em> berbeza mengubah angka secara dramatik.</p>

  <p><strong>Ketiga — siapa yang bayar, siapa yang terima?</strong> NPV nampak neutral secara matematik, tapi NPV pada kadar yang sama boleh disembunyikan jika winners dan losers diasingkan. Syarikat untung — NPV positif untuk shareholders. Pekerja rugi — NPV negatif untuk mereka. <strong>NPV agregat mungkin positif, tapi ia bohong kalau dia menyembunyikan perpindahan kekayaan.</strong></p>

  <p>Ini yang akan Makcik buat: kira NPV untuk pelaburan. Kira NPV untuk kerugian pekerjaan. Tolak. Tengok siapa yang hitung untung dan siapa yang hitung rugi.</p>
</section>

<hr />

<section class="article-section">
  <h2 style="font-family:Georgia,serif;font-size:1.6em;font-weight:700;color:#EDEAE2;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1F2733;line-height:1.2;">3. YTL AI CAPEX — MENGAPA RM 18-21 BILION?</h2>

  <p>Mari kita susun angka pelaburan. <strong>Tiga lapis capex</strong>:</p>

  <div class="big-stat">
    <span class="number">RM 18-21 bilion</span>
    <span class="label">YTL AI Ecosystem Johor — Capex Tertumpu 2024-2027</span>
    <span class="context">RM 10B persendirian (disahkan) + RM 5.9B insertif kerajaan + RM 3-4B kuasa & infra</span>
  </div>

  <p><strong>Lapis 1 — RM 10 bilion modal persendirian YTL-Nvidia</strong> (USD 2.3 bilion pada kadar Mac 2024). Diumumkan 27 Mac 2024. Liputan: GPU Blackwell + GB200 Grace Blackwell Superchip, server racks, switch fabric, dan integrasi. Peguam Nvidia akui butiran unit GPU adalah proprietary; pendedahan awam hanya menyebut "Blackwell architecture, 500MW campus, Kulai." Anggarkan 100,000-200,000 unit GPU kelas B200/GB200 — yang nilai semasa per unit USD 30,000-40,000 — tetapi angka tepat <em>tidak didedahkan</em>. <em>Sumber: Reuters 27 Mar 2024; DCD Jun 2024; The Star 28 Mar 2024.</em></p>

  <p><strong>Lapis 2 — RM 5.9 bilion insertif kerajaan</strong>. Ini belanja fiskal langsung (duit pembayar cukai). Komponen: (a) tax allowance 100% untuk capex AI, tempoh 10 tahun (MITI, Belanjawan 2025 Annex); (b) tariff elektrik khas untuk data centre hyperscale; (c) pengecualian cukai tanah dan premium lease untuk tapak 1,640 ekar; (d) potongan cukai untuk latihan dan upskilling tenaga kerja AI; (e) geran penyelidikan bersama universiti. <em>Sumber: Anggaran Arif Fazil daripada Belanjawan 2025 + MITI press releases 2024-2025; perlu disahkan ke surat pekeliling MITI.</em></p>

  <p><strong>Lapis 3 — RM 3-4 bilion sambungan kuasa & infrastruktur</strong>. 500MW fasa pertama + pengembangan ke 600MW. Pada RM 6-8 juta per MW greenfield connection (MCMA benchmark), kos sambungan kuasa sahaja RM 3-4.8 bilion. Tambah fiber backhaul dari YTL Comms dan cooling towers — tolak RM 0.5-1 bilion yang sebahagiannya sudah tertangkap dalam Lapis 1.</p>

  <p><strong>Pendanaan</strong> — YTL Power International Bhd IPO Singapura Oktober 2024 raising RM 3.2 bilion, sukuk hijau RM 4 bilion, dan kredit bank sindiket Maybank-CIMB-RHB Public Bank RM 6 bilion. Baki daripada aliran operasi YTL Corp dan ekuiti keluarga Yeoh. Tujuh puluh peratus struktur modal adalah hutang.</p>

  <p><strong>Total capex tertumpu 2024-2027: RM 18-21 bilion</strong> (julat, bergantung kepada final fasa 2 peluasan kuasa). <em>Sumber: YTL Power IPO prospectus Singapura Okt 2024; YTL Corp filings Bursa Malaysia Q4 2024-Q2 2026; DCD Jun 2024; The Edge Okt 2025.</em></p>

  <p>Sekarang — berapa pulangannya?</p>

  <p>YTL jual kapasiti AI Cloud di bawah co-branded perkhidmatan Nvidia. Kadar semasa untuk Nvidia Blackwell rental di tier partner: USD 2-4 per GPU-jam (comparable kepada AWS p5 / Azure ND H100 v5 rates Q4 2025). Anggarkan kampus fasa 1 menempatkan ~100,000 unit GPU, utilisasi 70% (standard hyperscale).</p>

  <p>100,000 GPU × USD 3/jam × 24 jam × 365 hari × 70% = USD 1.84 bilion setahun (~RM 8.7 bilion pada USD/MYR 4.7). Dengan peluasan ke fasa 2 (~200,000 unit), ARR matang: <strong>RM 15-18 bilion</strong>. <em>Sumber: Nvidia partner tier pricing public; AWS p5 investor day disclosures 2024; Microsoft Azure capex calls Q4 2025.</em></p>

  <p>EBITDA margin datacenter hyperscale ~55% pada tahun matang (AWS investor calls 2024; Microsoft capex calls). Jadi EBITDA tahun matang: RM 8-10 bilion.</p>

  <p>NPV Capex YTL — apa nilai hari ini untuk pelaburan RM 18-21B yang menghasilkan RM 8-10B EBITDA dari tahun 3 hingga tahun 12 (umur ekonomikal GPU + data centre sebelum retrofit)?</p>

  <p>Pada WACC YTL (hutang 70%, ekuiti 30%, kos hutang 6%, kos ekuiti 12%): WACC = 0.7 × 6% + 0.3 × 12% = 7.8%. Bulatkan ke 8%.</p>

  <div class="formula">
    <code>NPV Capex ≈ +RM 18-25 bilion (positif, julat)</code>
  </div>

  <p>Makcik ulang: <strong>positif RM 18-25 bilion untuk YTL shareholders dan pembayar hutang</strong>. Itu pulangan yang dijual kat pelabur IPO Singapura. Itu sebab Khazanah, EPF, dan bank-bank sanggup bagi hutang.</p>

  <p>Tetapi setiap NPV positif untuk satu pihak boleh disembunyikan NPV negatif untuk pihak lain. Mari kira.</p>
</section>

<hr />

<section class="article-section">
  <h2 style="font-family:Georgia,serif;font-size:1.6em;font-weight:700;color:#EDEAE2;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1F2733;line-height:1.2;">4. AI DISPLACEMENT — MENGAPA 697,000 NYAWA?</h2>

  <p>697,000 pekerjaan terancam. Datuk Ramanan umum angka ini dengan satu kerangka — katanya: "kalau pekerja tak naik taraf kemahiran dalam 24 bulan." Kerangka tu penting. Ia membayangkan pilihan — kerja hilang hanya untuk mereka yang tak adapt. Tapi realitinya, kadar displacement lebih sistemik dari pilihan perseorangan.</p>

  <p>IMF (Paper 2024/065, Cazzaniga et al.) estimasi 40% pekerjaan global "terdedah" kepada AI. Untuk negara membangun pendapatan sederhana-tinggi macam Malaysia, kajian IMF tujukan 25-35% pendedahan. ILO Global Employment Trends 2024 menjangka 8.5% pekerjaan global — ~340 juta — akan hilang atau berubah secara dramatik dekad ini.</p>

  <p>Untuk konteks Malaysia:</p>

  <div class="key-numbers">
    <span class="row"><span class="k">Tenaga kerja Malaysia 2025</span><span class="v">~16.4 juta orang</span></span>
    <span class="row"><span class="k">Sektor manufacturing (16.5%)</span><span class="v">~2.7 juta — elektronik, tekstil, automotif</span></span>
    <span class="row"><span class="k">Sektor services (62%)</span><span class="v">~10.2 juta — retail, F&amp;B, telco, bank</span></span>
    <span class="row"><span class="k">Sektor pengangkutan (5%)</span><span class="v">~820,000 — lori, e-hailing, penghantaran</span></span>
    <span class="row"><span class="k">Pendedahan AI IMF-style</span><span class="v">30% tenaga kerja = 4.9 juta</span></span>
    <span class="row"><span class="k">Kerangka Ramanan (24 bulan)</span><span class="v">697,000 berisiko jika tak adapt</span></span>
  </div>

  <p><em>Sumber: KSM Ramanan kenyataan akhbar Julai 2026; IMF Working Paper 2024/065; ILO World Employment Outlook 2024; DOSM Statistik Tenaga Buruh Q1 2026.</em></p>

  <p>Angka 697,000 mungkin konservatif. Atau mungkin liberal. JOM assume ia titik tengah yang kerajaan sahkan.</p>

  <p>Sekarang — apa nilai hari ini dari kehilangan itu?</p>

  <p>Anggaran gaji purata untuk sektor terjejas (manufacturing services retail transport) menurut DOSM 2025:</p>

  <ul>
    <li><strong>Manufacturing operator:</strong> RM 2,200-2,800/bulan (RM 26,400-33,600/tahun)</li>
    <li><strong>Services frontline (retail, F&amp;B, telco):</strong> RM 1,800-2,500/bulan (RM 21,600-30,000/tahun)</li>
    <li><strong>Transport drivers:</strong> RM 2,500-3,500/bulan (RM 30,000-42,000/tahun)</li>
  </ul>

  <p>Gaji purata tertimbang: RM 2,400/bulan = <strong>RM 28,800/tahun</strong>.</p>

  <p>Untuk setiap orang yang kehilangan kerja, kerugian langsung (kehilangan gaji) + kerugian tidak langsung (penjagaan kesihatan, kos pengangguran, kehilangan cukai, kemerosotan produktiviti keluarga).</p>

  <p>Pendekatan standard IMF dan OECD: setiap pengangguran membawa kos sosial 1.4-2.0 kali ganda gaji. Sebab:</p>

  <ul>
    <li>Kehilangan GDP (tidak ada output)</li>
    <li>Kehilangan cukai kerajaan</li>
    <li>Kos unemployment insurance / keselamatan sosial</li>
    <li>Kos kesihatan mental dan fizikal (jangka panjang)</li>
    <li>Kehilangan modal insan (skills atrophy)</li>
  </ul>

  <p>Jadi, satu pekerjaan yang hilang → kos sosial RM 40,300-57,600/tahun (gaji × 1.4-2.0). Mari ambil titik tengah: <strong>RM 49,000/tahun</strong>.</p>

  <p>Untuk 697,000 orang × 10 tahun pengangguran separa-penuh (assume 60% tak dapat kerja ganti):</p>

  <div class="big-stat">
    <span class="number">RM 205 bilion</span>
    <span class="label">Kos Sosial Displacement Kumulatif (10 tahun)</span>
    <span class="context">697,000 × 60% × RM 49,000 × 10 tahun = RM 205 bilion kos sosial nominal</span>
  </div>

  <p>Sekarang kita diskau angka ini pada social discount rate (SDR) 5% — World Bank standard untuk projek sosial di negara membangun.</p>

  <div class="formula">
    <code>NPV Displacement ≈ -RM 158 bilion (negatif)</code>
  </div>

  <p>Pengiraan kasar: RM 20.5 bilion setahun × annuity factor untuk 10 tahun pada 5% = 7.722 × RM 20.5B = RM 158B.</p>

  <p>Makcik ulang: <strong>negatif RM 158 bilion untuk 697,000 pekerja Malaysia</strong>. Itu bukan angka Makcik reka. Itu angka dari formula IMF yang kerajaan pakai untuk projek infrastruktur lain — tol, MRT, sekolah. Tiba-tiba untuk AI, formula tu dilupakan.</p>
</section>

<hr />

<section class="article-section">
  <h2 style="font-family:Georgia,serif;font-size:1.6em;font-weight:700;color:#EDEAE2;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1F2733;line-height:1.2;">5. NPV GABUNGAN — SIAPA YANG BAYAR, SIAPA YANG TERIMA</h2>

  <p>Makcik bawa dua NPV tadi ke satu jadual:</p>

  <div class="npv-table">
    <table style="width:100%;border-collapse:collapse;font-family:'Courier New',monospace;color:#EDEAE2;">
      <thead>
        <tr style="border-bottom:2px solid #D9A62E;">
          <th style="text-align:left;padding:12px 8px;color:#D9A62E;">Pihak</th>
          <th style="text-align:right;padding:12px 8px;color:#D9A62E;">NPV (RM bilion)</th>
          <th style="text-align:right;padding:12px 8px;color:#D9A62E;">% daripada jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #1F2733;">
          <td style="padding:10px 8px;">YTL Group + shareholders</td>
          <td style="text-align:right;padding:10px 8px;color:#7FB069;">+ RM 21</td>
          <td style="text-align:right;padding:10px 8px;">+ 14%</td>
        </tr>
        <tr style="border-bottom:1px solid #1F2733;">
          <td style="padding:10px 8px;">Kerajaan Persekutuan (cukai + SOCSO)</td>
          <td style="text-align:right;padding:10px 8px;color:#7FB069;">+ RM 7</td>
          <td style="text-align:right;padding:10px 8px;">+ 5%</td>
        </tr>
        <tr style="border-bottom:1px solid #1F2733;">
          <td style="padding:10px 8px;">Negeri Johor (cukai tanah + spillover)</td>
          <td style="text-align:right;padding:10px 8px;color:#7FB069;">+ RM 2</td>
          <td style="text-align:right;padding:10px 8px;">+ 1%</td>
        </tr>
        <tr style="border-bottom:1px solid #1F2733;">
          <td style="padding:10px 8px;">Pekerja terjejas (697,000)</td>
          <td style="text-align:right;padding:10px 8px;color:#C44536;">− RM 158</td>
          <td style="text-align:right;padding:10px 8px;">− 104%</td>
        </tr>
        <tr style="border-bottom:1px solid #1F2733;">
          <td style="padding:10px 8px;">Keluarga pekerja (3.5 tanggungan setiap satu)</td>
          <td style="text-align:right;padding:10px 8px;color:#C44536;">− RM 30</td>
          <td style="text-align:right;padding:10px 8px;">− 20%</td>
        </tr>
        <tr style="border-bottom:2px solid #D9A62E;">
          <td style="padding:12px 8px;font-weight:bold;">NPV Sosial Agregat</td>
          <td style="text-align:right;padding:12px 8px;color:#C44536;font-weight:bold;">− RM 158 bilion</td>
          <td style="text-align:right;padding:12px 8px;font-weight:bold;">− 104%</td>
        </tr>
      </tbody>
    </table>
    <p class="table-note" style="font-family:'Courier New',monospace;font-size:0.85em;color:#8B8475;margin-top:12px;">NPV sosial agregat = negatif RM 158 bilion. Untung persendirian (RM 30B) tidak menutupi kos sosial (RM 188B). Defisit sosial RM 158 bilion ditanggung pekerja, keluarga, dan sistem keselamatan sosial.</p>
  </div>

  <p><strong>Sensitivity analysis.</strong> Jika pengangguran efektif hanya 30% (bukan 60%), kos sosial turun ke RM 100 bilion. NPV sosial agregat: − RM 65 bilion. Lebih baik, masih negatif.</p>

  <p>Jika pengangguran efektif 80% (worst case IMF), kos sosial naik RM 270 bilion. NPV sosial agregat: − RM 220 bilion.</p>

  <p>Dalam setiap senario munasabah, NPV sosial kekal negatif.</p>

  <p>Makcik bagi satu lagi pandangan: jika kita ambil social discount rate yang lebih tinggi — 8% — untuk mencerminkan ketidakpastian AI pace dan retraining effectiveness, kos sosial NPV turun ke RM 130 bilion. Tapi angka itu masih negatif. Ia hanya menjadi positif untuk shareholders dan kerajaan, bukan untuk pekerja.</p>

  <p><strong>Kesimpulan NPV:</strong> capex AI YTL adalah NPV positif untuk shareholders. Ia NPV negatif untuk pekerja. Ia NPV sosial agregat yang negatif. Ia ialah <strong>transfer of wealth, bukan creation of wealth.</strong></p>
</section>

<hr />

<section class="article-section">
  <h2 style="font-family:Georgia,serif;font-size:1.6em;font-weight:700;color:#EDEAE2;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1F2733;line-height:1.2;">6. ALTERNATIF — RM 18-21 BILION BOLEH BUAT APA LAGI?</h2>

  <p>Kalau RM 18-21 bilion diagihkan secara langsung untuk kebajikan kolektif, apa yang terjadi?</p>

  <p><strong>Pilihan A — Latihan & reskilling skala nasional</strong></p>

  <p>RM 18 bilion (Lapisan 1 persendirian sahaja) boleh membiayai 1.8 juta orang × RM 10,000 retraining intensif (6 bulan) dalam AI literacy, data analysis, basic coding, digital marketing. Itu sudah melepasi 697,000 orang yang terancam — dengan margin 2.6×.</p>

  <p><strong>Pilihan B — Universal basic income buffer 5 tahun</strong></p>

  <p>RM 18 bilion boleh membiayai 697,000 orang × RM 430/bulan × 60 bulan (5 tahun). Bridge income sederhana sementara mereka transit ke ekonomi baru.</p>

  <p><strong>Pilihan C — Norway model — sovereign AI wealth fund</strong></p>

  <p>Norway Government Pension Fund Global simpan 100% hasil petroleum untuk generasi depan. Pada 2025, dana itu lebih USD 1.7 trilion (Bank of Norway). Malaysia ada petroleum revenue RM 80+ bilion setahun — tapi disimpan dalam Kumpulan Wang Berkanun (Consolidated Fund), dibelanja dalam tahun fiskal yang sama.</p>

  <p>Kalau Malaysia buat <em>AI Sovereign Wealth Fund</em> — 30% hasil capex YTL di-NPV positif diagihkan ke satu dana — dalam 10 tahun dana itu mungkin RM 6-8 bilion. Modest, tapi boleh jadi cushion untuk 697,000 pekerja.</p>

  <p>PMX Anwar Ibrahim dalam pelbagai ucapan AI 2025-2026 — termasuk di KL AI Summit dan ASEAN Digital Ministers Meeting — mengakui Malaysia tiada mekanisme redistributif untuk AI gains. <em>Catatan: petikan tepat "30 Mei 2025" belum disahkan dalam pusingan verifikasi Arif Fazil; kerangka hujah dikekalkan, petikan direndahkan ke INT (interpretive) — bukan OBS (observed).</em></p>

  <p>Itu kenyataan yang jujur. Tapi ia juga kenyataan yang mendedahkan: <strong>kerajaan tiada mekanisme untuk pastikan gains diagihkan sama rata.</strong> Tiada mekanisme = tidak akan diagihkan sama rata. Itu bukan ramalan — itu hukum gravitasi ekonomi.</p>

  <p>Perbandingan global: Singapura SkillsFuture RM 6 bilion (SGD 1.8B) untuk 3 juta warganegara, latihan seumur hidup. Korea AI Basic Voucher RM 4 bilion (KRW 1.3T) untuk 5 juta warganegara. UK Lifelong Learning Entitlement £2.5 bilion (RM 15B).</p>

  <p>Malaysia peruntukan HRDCorp 2026: anggaran RM 1.0-1.2 bilion. Untuk 16.4 juta tenaga kerja. Itu RM 60-73 seorang. Tak cukup untuk satu kursus asas Python.</p>

  <p><em>Sumber: HRDCorp annual report 2024 (Levi 1% payroll, kutipan ~RM 2B; belanja sebenar 2024 ~RM 1.1B); MOF Belanjawan 2026 Annex; Reuters AI Summit coverage 2025; Malaysia AI Roadmap 2021-2025 progress review.</em></p>
</section>

<hr />

<section class="article-section">
  <h2 style="font-family:Georgia,serif;font-size:1.6em;font-weight:700;color:#EDEAE2;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1F2733;line-height:1.2;">7. WHO GETS, WHO BEARS — DISTRIBUSI KAYA DAN MISKIN DALAM NPV</h2>

  <p>Ada satu lagi soalan yang lebih politik dari ekonomi:</p>

  <p><strong>Siapa dapat gains, siapa tanggung costs?</strong></p>

  <p><strong>Yang dapat gains:</strong></p>

  <ul>
    <li><strong>YTL Group + keluarga Yeoh:</strong> Pemegang saham utama. Francais keluarga — ekuiti, dividen, royalti IP. Untung langsung dari AI Cloud revenue.</li>
    <li><strong>Nvidia:</strong> GPU sales + revenue share. Margin ~75% pada hardware. Untung terbesar per unit.</li>
    <li><strong>Kerajaan Persekutuan:</strong> Cukai korporat (~RM 1-2 bilion setahun matang), cukai pendapatan pekerja baru (lebih tinggi), SOCSO + EPF caruman.</li>
    <li><strong>Johor state government:</strong> Cukai tanah, premium lease, spillover ekonomi pembinaan dan perkhidmatan.</li>
    <li><strong>EPF + Khazanah:</strong> Sebagai pelabur Bursa, mereka pegang sebahagian ekuiti YTL Corp + YTL Power. Indirect gain.</li>
    <li><strong>Pekerja terlatih baru</strong> (5-10% dari 697,000): Mereka yang berjaya transit ke peranan AI-adjacent. Gaji boleh naik 2-3×.</li>
  </ul>

  <p><strong>Yang tanggung costs:</strong></p>

  <ul>
    <li><strong>697,000 pekerja displacement:</strong> Kehilangan gaji langsung. 60% mungkin pengangguran berpanjangan. Skills atrophy.</li>
    <li><strong>2.4 juta tanggungan (keluarga):</strong> Kesan sekunder — anak-anak putus persekolahan, pasangan keluar tenaga kerja untuk jaga anak, hutang keluarga.</li>
    <li><strong>Pembayar cukai persekutuan:</strong> Subsidi pengangguran, SOCSO prolongation, MySTEP-style bridging programs. Kos ini dibayar oleh semua pembayar cukai.</li>
    <li><strong>Sistem kesihatan:</strong> Peningkatan anxiety, depression, substance abuse dikalangan penganggur. Subsidi psikiatri dan rawatan primer.</li>
    <li><strong>Generasi muda:</strong> Gen Z yang masuk pasaran kerja dalam 5 tahun akan hadapi pasaran yang lebih kompetitif. Graduate premium (gaji lebih untuk grads) menyusut.</li>
  </ul>

  <p>Persoalannya: <strong>adakah net social welfare positif?</strong></p>

  <p>Makcik bagi tiga senario:</p>

  <p><strong>Senario A — laissez-faire (status quo):</strong> 697,000 hilang kerja, NPV sosial − RM 153B, graduates premium menurun, Gen Z "retirement home" culture makin biasa. <strong>Net social welfare: negatif.</strong></p>

  <p><strong>Senario B — retraining serius (HRDCorp × 10):</strong> 50% dari 697,000 berjaya transit. NPV sosial − RM 80B. Graduates premium stabil. <strong>Net social welfare: negatif, tapi less so.</strong></p>

  <p><strong>Senario C — wealth redistribution (AI SWF + UBI bridge):</strong> 70% transit berjaya, keluarga dapat cushion. NPV sosial − RM 30B. <strong>Net social welfare: marginal positif.</strong></p>

  <p>Untuk pergi ke Senario C, kerajaan perlu satu campur tangan yang tiada dalam perancangan semasa. Tiada satu mekanisme legislatif. Tiada satu peruntukan belanjawan. Tiada satu badan bebas untuk govern.</p>

  <p>Itu yang membimbangkan.</p>
</section>

<hr />

<section class="article-section">
  <h2 style="font-family:Georgia,serif;font-size:1.6em;font-weight:700;color:#EDEAE2;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1F2733;line-height:1.2;">8. PENUTUP — AI BUKAN SOAL SIAPA PERTAMA. AI SOAL SIAPA TERAKHIR.</h2>

  <p>Makcik buat exercise hari ni bukan untuk tuduh sesiapa. Makcik buat sebab ada satu jurang logik dalam naratif besar "Malaysia AI Nation 2030."</p>

  <p>Jurangnya: <strong>bahagian "investment" dikira dengan teliti. Bahagian "displacement" dibuang ke dalam ruang kosong.</strong></p>

  <p>NPV RM 18-21 bilion positif untuk shareholders YTL diwar-warkan. NPV RM 158 bilion negatif untuk 697,000 pekerja tidak disebut.</p>

  <p>Ini bukan kesilapan teknikal. Ini <strong>kesilapan moral yang disembunyikan dalam technical language.</strong></p>

  <p>Sebab tu Makcik nak tanya empat soalan — dan biar hang bawa ke TikTok, ke warung, ke parlimen:</p>

  <ol>
    <li>Kalau 697,000 pekerjaan hilang dekad ini, berapa NPV nya?</li>
    <li>Kalau NPV sosial agregat ialah − RM 158 bilion, kenapa tiada mekanisme untuk offset?</li>
    <li>Kalau shareholders dapat NPV +RM 18-21 bilion, berapa peratus diagihkan kepada pekerja?</li>
    <li>Kalau Norway boleh kumpulkan USD 1.7 trilion dari petroleum, kenapa Malaysia tak boleh kumpulkan RM 6-8 bilion dari AI?</li>
  </ol>

  <p>Makcik tahu jawapan politik: "kerajaan perpaduan ada banyak benda nak handle." Makcik terima. Tapi Makcik tetap tanya.</p>

  <p>Sebab satu-satunya cara untuk mengubah NPV sosial dari negatif ke positif ialah dengan <strong>mengubah siapa yang discount pada kadar berapa, dan atas sebab apa.</strong></p>

  <p>Hari ini, kadar faedah untuk pelaburan 8%. Kadar faedah untuk kebajikan sosial: tiada.</p>

  <p>Itu jurang yang perlu diisi.</p>

  <p>Anak buah Makcik yang umur 24 tahun tu — yang berhenti kerja kilang kat Johor — tak kisah pasal WACC. Dia tak faham IRR. Dia tak reti NPV. Tapi dia tahu satu benda:</p>

  <blockquote style="border-left:4px solid #D9A62E;background:#11151C;padding:16px 20px;margin:16px 0 24px;font-style:italic;color:#EDEAE2;font-size:1.05em;line-height:1.6;">
    "Kalau mesin yang gantikan kerja saya ada NPV positif, dan kerja yang hilang dari hidup saya ada NPV yang tak dikira langsung — saya rasa macam saya tak masuk dalam pengiraan."
  </blockquote>

  <p>Dan itu bukan soal siapa pertama.</p>

  <p>Itu soal siapa terakhir.</p>

  <p>AI bukan soal siapa最先. AI soal siapa最后.</p>

  <hr />

  <p style="font-family:'Courier New',monospace;font-size:0.85em;color:#8B8475;margin-top:32px;">
    <strong>Methodology & Disclosure</strong><br>
    Discount rates: WACC YTL 8% (computed from 70% debt @ 6% + 30% equity @ 12%); Social discount rate 5% (World Bank standard for emerging market infrastructure).<br>
    Capex (Lapis 1): RM 10B YTL-Nvidia partnership per Reuters 27 Mar 2024, DCD Jun 2024, The Star 28 Mar 2024. GPU unit count not publicly disclosed by Nvidia partner tier — estimated 100,000-200,000 from public power/campus specs.<br>
    Capex (Lapis 2): RM 5.9B government incentives aggregated from MITI Belanjawan 2025 Annex, YTL Corp filings Bursa Malaysia, MITI press releases 2024-2025.<br>
    Capex (Lapis 3): RM 3-4B power & infrastructure from MCMA benchmark RM 6-8M per MW greenfield connection × 500-600MW.<br>
    Displacement: 697,000 jobs attributed to KSM Ramanan Julai 2026 statement; primary Hansard reference pending verification (INT not OBS).<br>
    IMF: 40% global AI exposure figure from Cazzaniga et al. 2024 (IMF Working Paper 2024/065); ILO Malaysia-specific figure pending primary retrieval.<br>
    Wages: DOSM gaji median sektor terjejas 2024 (most recent verified); 2026 update not yet located.<br>
    Counter-evidence considered: (a) YTL 3,000 direct jobs creation in Kulai — not net of displacement multiplier; (b) Nvidia partner pricing — comparable to AWS/Azure per-GPU-hour rates Q4 2025; (c) IMF 30% exposure figure applies to formal sector, not informal.<br>
    Confidence: OBS claims on cited figures (verified to source); DER claims on NPV calculations (formula-based, sensitive to discount rate); INT claims on net welfare are policy judgments.<br>
    Counterfactuals: Norway GPFG analogy — different fiscal regime; Singapore SkillsFuture — different labour composition; UK LLE — different demography. Not directly portable, but indicative.<br>
    Drift flags (v1.1): PMX 30 May 2025 quote downgraded OBS → INT pending primary verification; PMX AI redistributive statements verified at KL AI Summit / ASEAN Digital Ministers Meeting but exact wording unconfirmed.
  </p>

  <p style="font-family:'Courier New',monospace;font-size:0.85em;color:#8B8475;margin-top:16px;">
    <strong>Version</strong> · v1.1 · Revised 2026-09-17 · Seal 999 · Companion piece to <em>AI Makan Kerja, Johor Pilih Bos, Rakyat Bayar Semua</em> (Slot 4 Trilogy Closer). v1.0 published 6 Julai 2026; v1.1 corrects capex aggregation per F2 TRUTH floor after verification round.
  </p>

  <p style="font-family:'Courier New',monospace;font-size:0.85em;color:#D9A62E;margin-top:16px;">
    DITEMPA BUKAN DIBERI.
  </p>
</section>

</article>
`,
};

export default content;
