/* fed-nav.js — generated from canon/navigation.json (single source; regenerate via 333 session script 2026-11-04) */
(function(){
  var ACTIVE = (document.currentScript && document.currentScript.getAttribute('data-active')) || '';
  var HTML = `<header class="fed-navbar" aria-label="Federation primary navigation">
  <a class="nav-brand" href="/">
    <span class="psi-badge">Ψ</span>
    <span>ARIF FAZIL</span>
  </a>

  <nav class="nav-links" aria-label="Primary">
    <a href="/" data-slot="home">Home</a>
    <a href="/earth" data-slot="earth">Earth</a>
    <a href="/words" data-slot="words">Words</a>
    <a href="/makcikgpt" data-slot="makcikgpt">MakcikGPT</a>
    <a href="/world" data-slot="world">World</a>
    <a href="/work" data-slot="work">Work</a>
  </nav>

  <div class="nav-right">
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="house-nav">Menu</button>
    <a href="https://geox.arif-fazil.com" target="_blank" rel="noreferrer" class="agentic-link">
      <span>🪞 GEOX</span>
      <span style="font-size:9px;opacity:0.7">↗</span>
    </a>
    <div class="live-clock-badge">
      <span class="pulse-dot"></span>
      <span id="fedNavClock">--:--:-- MYT</span>
    </div>
  </div>

</header>
<nav class="house-drawer" id="house-nav" hidden aria-label="Primary">
  <a href="/" data-slot="home">Home</a>
  <a href="/earth" data-slot="earth">Earth</a>
  <a href="/words" data-slot="words">Words</a>
  <a href="/makcikgpt" data-slot="makcikgpt">MakcikGPT</a>
  <a href="/world" data-slot="world">World</a>
  <a href="/work" data-slot="work">Work</a>
</nav>`;
  var root = document.getElementById('fed-nav-root');
  if (!root) { root = document.createElement('div'); }
  document.body.insertBefore(root, document.body.firstChild);
  root.outerHTML = HTML;
  if (ACTIVE) {
    document.querySelectorAll('a[data-slot="' + ACTIVE + '"]').forEach(function(a){ a.classList.add('active'); });
  }
  (function(){
  var btn=document.querySelector(".nav-toggle");
  var drawer=document.getElementById("house-nav");
  if(!btn||!drawer) return;
  btn.addEventListener("click",function(){
    var open=drawer.hasAttribute("hidden");
    if(open) drawer.removeAttribute("hidden");
    else drawer.setAttribute("hidden","");
    btn.setAttribute("aria-expanded", open?"true":"false");
    btn.textContent=open?"Close":"Menu";
  });
})();
  /* ── live navbar clock ── */
(function(){
  const clock = document.getElementById("fedNavClock");
  if(!clock) return;
  function updateClock(){
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const myt = new Date(utc + (3600000 * 8));
    const h = String(myt.getHours()).padStart(2, '0');
    const m = String(myt.getMinutes()).padStart(2, '0');
    const s = String(myt.getSeconds()).padStart(2, '0');
    clock.textContent = `${h}:${m}:${s} MYT`;
  }
  updateClock();
  setInterval(updateClock, 1000);
})();
})();
