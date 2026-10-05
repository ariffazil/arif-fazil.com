// arifFLOW Agentic Heartbeat Bar — arifOS Federation
// Injected globally across federation surfaces
(function initArifFlowHeartbeat() {
  if (typeof document === 'undefined') return;
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {
    if (document.getElementById('ariflow-heartbeat')) return;

    var bar = document.createElement('div');
    bar.id = 'ariflow-heartbeat';
    bar.style.cssText = "position: fixed; bottom: 0; left: 0; width: 100%; background-color: #050505; color: #4af626; font-family: 'Courier New', Courier, monospace; font-size: 11px; padding: 6px 15px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1a1a1a; z-index: 9999; box-sizing: border-box; letter-spacing: 0.04em;";

    bar.innerHTML = [
      '<div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">',
        '<span style="display:flex; align-items:center; gap:6px;"><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#4af626; box-shadow:0 0 6px #4af626;"></span>arifFLOW</span>',
        '<span id="hb-aforge">A-FORGE: <span style="color:#4af626;">IDLE/HEALTHY</span></span>',
        '<span id="hb-mcp">AAA MCP: <span style="color:#4af626;">ACTIVE</span></span>',
      '</div>',
      '<div style="display:flex; gap:16px; align-items:center;">',
        '<span id="hb-ledger">WITNESS HASH: <span style="color:#888;">SYNCING...</span></span>',
        '<a href="/999/" style="color:#fff; text-decoration:none; font-weight:bold; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:3px;">[ EVIDENCE / 999 ]</a>',
      '</div>'
    ].join('');

    document.body.appendChild(bar);

    // Fetch Witness Ledger for canonical Causal Hash
    fetch('/ledger/ledger.json', { cache: 'no-store' })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) {
        var elLedger = document.getElementById('hb-ledger');
        if (!elLedger) return;
        if (data) {
          var hash = (data.receipts && data.receipts.entries && data.receipts.entries[0] && data.receipts.entries[0].sha256) ||
                     (data.generator && data.generator.sha256) || 'V999-SEALED';
          elLedger.innerHTML = 'WITNESS HASH: <span style="color:#4af626;">[' + hash.substring(0, 8) + ']</span>';
        } else {
          elLedger.innerHTML = 'WITNESS HASH: <span style="color:#f00;">[DESYNC]</span>';
        }
      })
      .catch(function(err) {
        console.error("arifFLOW telemetry fault:", err);
        var elLedger = document.getElementById('hb-ledger');
        if (elLedger) elLedger.innerHTML = 'WITNESS HASH: <span style="color:#faa;">[FAULT]</span>';
      });
  });
})();
