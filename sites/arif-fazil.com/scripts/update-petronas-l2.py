#!/usr/bin/env python3
import re

FILE_PATH = '/root/arif-fazil.com/sites/arif-fazil.com/public/petronas/index.html'

with open(FILE_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Styles to inject before </style>
styles_to_inject = '''
  /* ── SOVEREIGN REALITY INSTRUMENT (L2 ACCENTS & HUD) ── */
  body::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.03;
    background-image:
      linear-gradient(var(--hair) 1px, transparent 1px),
      linear-gradient(90deg, var(--hair) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  /* Global Sticky Top Navigation */
  .global-topbar {
    position: sticky; top: 0; z-index: 50; background: rgba(10, 12, 16, 0.94);
    border-bottom: 1px solid var(--hair); backdrop-filter: blur(12px); padding: 0.75rem 0;
  }
  .global-nav-wrap {
    max-width: 64rem; margin: 0 auto; padding: 0 1.4rem;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;
  }
  .brand-group { display: flex; align-items: center; gap: 0.6rem; }
  .brand-badge {
    font-family: var(--mono); font-size: 0.72rem; font-weight: 700;
    padding: 0.15rem 0.45rem; background: rgba(201, 162, 39, 0.15);
    border: 1px solid rgba(201, 162, 39, 0.35); color: var(--accent); border-radius: 4px;
  }
  .brand-title {
    font-family: var(--display); font-size: 1.05rem; font-weight: 700; color: #fff;
  }
  .global-nav {
    display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem 1.1rem;
    font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .global-nav a { color: var(--dim); border-bottom: none; }
  .global-nav a:hover { color: var(--ink); }
  .global-nav a.active { color: var(--accent); font-weight: 700; border-bottom: 2px solid var(--accent); }
  .clock-badge {
    font-family: var(--mono); font-size: 0.7rem; color: var(--dim);
    display: flex; align-items: center; gap: 0.4rem; background: rgba(255, 255, 255, 0.03);
    padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid var(--hair);
  }
  .clock-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; }

  /* L2 Compact Instrument Banner (140–180px) */
  .l2-banner {
    padding: 1.8rem 0 1.4rem; border-bottom: 1px solid var(--hair);
    background: linear-gradient(180deg, rgba(16, 20, 28, 0.6) 0%, rgba(10, 12, 16, 0) 100%);
    margin-bottom: 2rem;
  }
  .breadcrumb-nav {
    display: flex; align-items: center; gap: 0.45rem; font-family: var(--mono);
    font-size: 0.72rem; color: var(--dim); margin-bottom: 0.6rem; text-transform: uppercase;
  }
  .breadcrumb-nav a { color: var(--dim); }
  .breadcrumb-nav a:hover { color: var(--accent); }
  .breadcrumb-sep { color: var(--hair); }
  .l2-title {
    font-family: var(--display); font-size: clamp(1.8rem, 3.8vw, 2.6rem); font-weight: 700;
    line-height: 1.15; color: #fff; margin-bottom: 0.4rem;
  }
  .l2-sub {
    font-family: var(--mono); font-size: 0.78rem; color: var(--dim);
    display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem;
  }
  .epistemic-badge {
    padding: 0.15rem 0.45rem; border-radius: 3px; font-weight: 600;
    font-size: 0.65rem; background: rgba(201, 162, 39, 0.15); color: var(--accent);
    border: 1px solid rgba(201, 162, 39, 0.3);
  }

  /* 4-Metric HUD */
  .hud-container {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.85rem; margin-top: 1.25rem;
  }
  .hud-card {
    background: rgba(15, 20, 30, 0.85); border: 1px solid var(--hair); border-radius: 6px;
    padding: 0.85rem 1rem; position: relative;
  }
  .hud-card::before {
    content: ''; position: absolute; top: -1px; left: -1px; width: 6px; height: 6px;
    border-top: 2px solid var(--accent); border-left: 2px solid var(--accent);
  }
  .hud-card::after {
    content: ''; position: absolute; bottom: -1px; right: -1px; width: 6px; height: 6px;
    border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent);
  }
  .hud-meta {
    font-family: var(--mono); font-size: 0.62rem; text-transform: uppercase;
    color: var(--dim); display: flex; justify-content: space-between; margin-bottom: 0.2rem;
  }
  .hud-val {
    font-family: var(--mono); font-size: 1.15rem; font-weight: 700; color: #fff; line-height: 1.2;
  }
  .hud-caption {
    font-family: var(--mono); font-size: 0.68rem; color: var(--dim); margin-top: 0.2rem;
  }

  /* Closed-Loop Footer */
  .closed-loop-bar {
    margin-top: 4rem; padding: 2rem 0; border-top: 2px solid var(--hair);
    background: rgba(15, 20, 30, 0.7);
  }
  .closed-loop-inner {
    max-width: 64rem; margin: 0 auto; padding: 0 1.4rem;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
  }
  .loop-links {
    display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; font-family: var(--mono);
    font-size: 0.75rem; text-transform: uppercase;
  }
  .loop-links a { color: var(--dim); }
  .loop-links a:hover { color: var(--accent); }
'''

text = text.replace('</style>', styles_to_inject + '\n</style>')

# 2. Replace legacy masthead and hero banner with L2 banner
old_header_start = text.find('<div class="wide">')
old_header_end = text.find('<p class="lede">')

new_header_html = '''<header class="global-topbar">
  <div class="global-nav-wrap">
    <div class="brand-group">
      <span class="brand-badge">Ψ</span>
      <span class="brand-title"><a href="/" style="color:#fff">ARIF FAZIL</a></span>
    </div>
    <nav class="global-nav" aria-label="Global Primary">
      <a href="/">Home</a>
      <a href="/earth/">Earth</a>
      <a href="/wealth/">Wealth</a>
      <a href="/petronas/" class="active" aria-current="page">PETRONAS (KLCC)</a>
      <a href="/world/petronas/shadow/">Shadow</a>
      <a href="/map/">Map</a>
      <a href="/llms.txt">llms.txt</a>
    </nav>
    <div class="clock-badge">
      <span class="clock-dot"></span>
      <span id="petronas-clock">--:--:-- MYT</span>
    </div>
  </div>
</header>

<div class="l2-banner">
  <div class="wide">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/">L0 Home</a>
      <span class="breadcrumb-sep">›</span>
      <a href="/wealth/">L1 Wealth Hub</a>
      <span class="breadcrumb-sep">›</span>
      <span style="color:#fff">L2 KLCC Hydrocarbon Engine</span>
    </nav>
    <h1 class="l2-title">PETRONAS (KLCC) — Dompet Hari Ini, Tangki Masa Depan</h1>
    <div class="l2-sub">
      <span class="epistemic-badge">[OBS] Telemetri Rasmi</span>
      <span>Kunci Kira-Kira Korporat 1H2026 · Digandingkan ke Belanjawan Persekutuan Putrajaya</span>
    </div>

    <!-- 4-Metric HUD -->
    <div class="hud-container">
      <div class="hud-card">
        <div class="hud-meta">
          <span>Rizab Tunai 1H2026</span>
          <span style="color:var(--accent)">[OBS]</span>
        </div>
        <div class="hud-val">RM111.4B</div>
        <div class="hud-caption">Kecairan Tunai Kumpulan</div>
      </div>

      <div class="hud-card">
        <div class="hud-meta">
          <span>Dividen 2026</span>
          <span style="color:var(--accent)">[OBS]</span>
        </div>
        <div class="hud-val">RM32.0B</div>
        <div class="hud-caption">Aliran Tunai ke Putrajaya</div>
      </div>

      <div class="hud-card">
        <div class="hud-meta">
          <span>Baki Tong 2P</span>
          <span style="color:#f87171">[DER]</span>
        </div>
        <div class="hud-val">7.92B tong</div>
        <div class="hud-caption">Menyusut 2 tahun berturut-turut</div>
      </div>

      <div class="hud-card">
        <div class="hud-meta">
          <span>Gandingan Fiskal</span>
          <span style="color:#34d399">[INT]</span>
        </div>
        <div class="hud-val">RM40.0B</div>
        <div class="hud-caption">Subsidi Bahan Api Putrajaya</div>
      </div>
    </div>
  </div>
</div>

<div class="wrap">
'''

text = text[:old_header_start] + new_header_html + text[old_header_end:]

# 3. Replace colophon with Closed-Loop Footer
old_colophon_start = text.find('<div class="wide">\n  <div class="colophon">')
if old_colophon_start == -1:
    old_colophon_start = text.find('<div class="wide">\r\n  <div class="colophon">')
if old_colophon_start == -1:
    old_colophon_start = text.find('<div class="colophon">')

script_tag_idx = text.find('<script type="application/ld+json">')

new_footer_html = '''<footer class="closed-loop-bar">
  <div class="closed-loop-inner">
    <nav class="loop-links" aria-label="Closed-Loop Cross Links">
      <a href="/wealth/">← Kembali ke Hub Wealth (L1)</a>
      <a href="/wealth/malaysia/">⇄ Kembar Fiskal: Putrajaya (/wealth/malaysia/)</a>
      <a href="/map/" style="color:var(--accent)">🗺 Peta Sistem /map/</a>
      <a href="/world/petronas/shadow/tengku-muhammad-taufik/">⇄ 33 Bayang CEO (/shadow/tengku-muhammad-taufik/)</a>
      <a href="/llms.txt">🤖 /llms.txt</a>
    </nav>
    <div class="mono" style="font-size:0.72rem; color:var(--dim)">
      DITEMPA BUKAN DIBERI · arifOS Federation · seal 999
    </div>
  </div>
</footer>

<script>
function updatePetronasClock(){
  const clock = document.getElementById('petronas-clock');
  if(!clock) return;
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const myt = new Date(utc + (3600000 * 8));
  const h = String(myt.getHours()).padStart(2, '0');
  const m = String(myt.getMinutes()).padStart(2, '0');
  const s = String(myt.getSeconds()).padStart(2, '0');
  clock.textContent = `${h}:${m}:${s} MYT`;
}
updatePetronasClock();
setInterval(updatePetronasClock, 1000);
</script>
'''

text = text[:old_colophon_start] + new_footer_html + '\n' + text[script_tag_idx:]

with open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Successfully upgraded {FILE_PATH}. Bytes: {len(text)}")
