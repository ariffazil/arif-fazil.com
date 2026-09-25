import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TradingViewChart } from '@/components/TradingViewChart';

type CommodityDef = {
  slug: string;
  name: string;
  symbol: string;
  tradingViewSymbol: string;
  description: string;
  source: string;
  color: string;
  yahoo: string;
  price: string;
  delta: string;
  pct: string;
  verdict: 'SEAL' | 'SABAR' | 'HOLD';
  verdictColor: string;
  bias: string;
  s1: string;
  s2: string;
  r1: string;
  r2: string;
  driver: string;
  ground: { title: string; desc: string };
  mind: { title: string; desc: string };
  capital: { title: string; desc: string };
  sovereign: { title: string; desc: string };
};

type TickerLive = {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  rsi: number;
  rsiState: string;
  skewness_20d?: number;
  signal: string;
  confidence: number;
  ema20: number;
  ema50: number;
  ema200: number;
  emaTrend: string;
  support: number[];
  resistance: number[];
  pivot: number;
  timestamp: string;
};

type ApexLive = {
  apex: { A: number; P: number; E: number; X: number; Phi: number };
  G: number;
  C_dark: number;
  dS: number;
  state: string;
  direction: string;
  confidence: number;
  volume_trend: string;
  volume_confirmation: boolean;
  momentum: number;
  volatility_regime: string;
  verdict: string;
  price: number;
  ema_20: number;
  ema_50: number;
  ema_200: number;
  rsi_14: number;
  atr_14: number;
  timestamp: string;
};

// ── WEALTH forecast contract: wealth.forecast.v1 ──
// Three horizons (+24h / +48h / +72h), each with P10/P25/P50/P75/P90 quantiles.
// Calibration gates the rails — SHADOW = no actionable stance, only structural read.
type ForecastLive = {
  schema: 'wealth.forecast.v1';
  asset: 'gold';
  generated_at: string;
  horizon_days: number;
  forecast_status?: 'SHADOW' | 'LIVE';  // optional — absent => treat as SHADOW
  auto_translate_disabled?: boolean;       // explicit: never bridge Trade↔Simpan
  basis: {
    close: number;
    atr14: number;
    slope_per_day: number;
    regime: string;
    rsi: number;
    ema20: number;
    ema50: number;
    ema200: number;
  };
  bias: string;
  cone: {
    t: string[];
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  scenarios: Array<{
    side: 'LONG' | 'SHORT';
    trigger: string;
    objective: number;
    invalidation: number;
    confluence: number;
    of: number;
    eta_days: string;
  }>;
  institutional_read: string;
  epistemic: string;
};

type QuantileRow = {
  horizon: '+24h' | '+48h' | '+72h';
  date: string;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  widthPct: number;   // (P90-P10)/P50 as %
};

// ── State machine classifier (gold-specific) ──
function classifyRegime(t: TickerLive | null, apex: ApexLive | null): { state: string; tag: string; color: string } {
  if (!t || !apex) return { state: 'LOADING', tag: 'AWAITING_DATA', color: '#8E95A5' };

  const rsi = t.rsi;
  const apxState = apex.state;
  const volRegime = apex.volatility_regime;
  const dir = apex.direction;

  // 6-state machine (per gold state machine)
  if (volRegime === 'compressed' && apxState === 'CHAOS') {
    return { state: 'COMPRESSION', tag: 'COILED · AWAITING BREAK', color: '#A78BFA' };
  }
  if (volRegime === 'expanding' && (dir === 'UP' || dir === 'DOWN')) {
    return { state: 'ESTABLISHED_TREND', tag: `${dir === 'UP' ? 'UP' : 'DOWN'}TREND ACTIVE`, color: dir === 'UP' ? '#4ECCA3' : '#F87171' };
  }
  if (rsi >= 70 && dir === 'UP' && t.emaTrend === 'BEARISH') {
    return { state: 'EXHAUSTION', tag: 'OVERBOUGHT DIVERGENCE', color: '#F59E0B' };
  }
  if (rsi <= 30 && dir === 'DOWN' && t.emaTrend === 'BULLISH') {
    return { state: 'EXHAUSTION', tag: 'OVERSOLD DIVERGENCE', color: '#F59E0B' };
  }
  if (apxState === 'CHAOS' && volRegime !== 'compressed') {
    return { state: 'TRANSITION', tag: 'REGIME SHIFT IN PROGRESS', color: '#E27D60' };
  }
  if (volRegime === 'normal' && apxState !== 'CHAOS') {
    return { state: 'RANGING', tag: 'BALANCE ROTATION', color: '#38BDF8' };
  }
  return { state: 'COMPRESSION', tag: 'COMPRESSED BASE', color: '#A78BFA' };
}

// ── Forecast cone (P25/P50/P75) — Monte Carlo-lite from ATR ──
function computeForecastCone(price: number, atr: number, days: number): { p25: number; p50: number; p75: number } {
  // 1-sigma daily move ~ ATR; for n days, sigma scales sqrt(n)
  const sigma = atr * Math.sqrt(days);
  // Empirical GBM quantile anchors
  const p25 = price - 0.674 * sigma;  // ~25th percentile
  const p50 = price;                   // driftless median
  const p75 = price + 0.674 * sigma;  // ~75th percentile
  return { p25, p50, p75 };
}

// ── Decision action guide (auto-derived) ──
function computeActionGuide(t: TickerLive | null, apex: ApexLive | null): {
  action: string;
  entry: string;
  stop: string;
  target: string;
  rr: string;
  trigger: string;
  invalidation: string;
  confluence: string;
  confluenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
} {
  if (!t || !apex) {
    return {
      action: 'LOADING',
      entry: '—', stop: '—', target: '—', rr: '—',
      trigger: '—', invalidation: '—', confluence: '—', confluenceLevel: 'LOW',
    };
  }
  const confluence = apex.G;  // 0-1 from apex
  let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (confluence > 0.6) level = 'HIGH';
  else if (confluence > 0.3) level = 'MEDIUM';

  const verdict = apex.verdict;  // HOLD / LONG / SHORT
  const atr = apex.atr_14;
  const price = t.price;

  if (verdict === 'LONG') {
    return {
      action: '🟢 LONG BIAS',
      entry: price.toFixed(2),
      stop: (price - 1.5 * atr).toFixed(2),
      target: (price + 2.5 * atr).toFixed(2),
      rr: '1.67',
      trigger: `Close above ${(price + 0.5 * atr).toFixed(2)} on rising volume`,
      invalidation: `Close below ${(price - 1.5 * atr).toFixed(2)}`,
      confluence: confluence.toFixed(3),
      confluenceLevel: level,
    };
  }
  if (verdict === 'SHORT') {
    return {
      action: '🔴 SHORT BIAS',
      entry: price.toFixed(2),
      stop: (price + 1.5 * atr).toFixed(2),
      target: (price - 2.5 * atr).toFixed(2),
      rr: '1.67',
      trigger: `Close below ${(price - 0.5 * atr).toFixed(2)} on rising volume`,
      invalidation: `Close above ${(price + 1.5 * atr).toFixed(2)}`,
      confluence: confluence.toFixed(3),
      confluenceLevel: level,
    };
  }
  // HOLD default
  return {
    action: '⚪ SABAR · HOLD',
    entry: '—',
    stop: '—',
    target: '—',
    rr: '—',
    trigger: `Wait for close above ${(price + 1.0 * atr).toFixed(2)} or below ${(price - 1.0 * atr).toFixed(2)}`,
    invalidation: '—',
    confluence: confluence.toFixed(3),
    confluenceLevel: level,
  };
}

// ── Dynamics explanation (auto-derived) ──
function explainDynamics(t: TickerLive | null, apex: ApexLive | null): string[] {
  if (!t || !apex) return ['Loading live dynamics...'];
  const lines: string[] = [];

  // 1. EMA trend
  const dist200 = ((t.price - t.ema200) / t.ema200) * 100;
  if (dist200 > 5) lines.push(`▲ Price ${dist200.toFixed(1)}% above EMA200 — extended uptrend, mean reversion risk`);
  else if (dist200 < -5) lines.push(`▼ Price ${Math.abs(dist200).toFixed(1)}% below EMA200 — extended downtrend, bounce candidate`);
  else lines.push(`◆ Price near EMA200 (${dist200 > 0 ? '+' : ''}${dist200.toFixed(1)}%) — equilibrium zone`);

  // 2. RSI state
  if (t.rsi > 70) lines.push(`⚠ RSI ${t.rsi.toFixed(1)} (OVERBOUGHT) — momentum exhaustion likely`);
  else if (t.rsi < 30) lines.push(`⚠ RSI ${t.rsi.toFixed(1)} (OVERSOLD) — contrarian bounce candidate`);
  else if (t.rsi > 50) lines.push(`→ RSI ${t.rsi.toFixed(1)} (NEUTRAL-BULL) — momentum favors upside`);
  else lines.push(`→ RSI ${t.rsi.toFixed(1)} (NEUTRAL-BEAR) — momentum favors downside`);

  // 3. Vol regime
  const volWidth = (apex.atr_14 / t.price) * 100;
  if (apex.volatility_regime === 'compressed') lines.push(`⏸ Volatility compressed (${volWidth.toFixed(2)}%/bar) — coiled spring, breakout pending`);
  else if (apex.volatility_regime === 'expanding') lines.push(`⚡ Volatility expanding (${volWidth.toFixed(2)}%/bar) — directional move in progress`);
  else lines.push(`◆ Volatility normal (${volWidth.toFixed(2)}%/bar) — standard intraday range`);

  // 4. Volume
  if (apex.volume_confirmation) lines.push(`✓ Volume confirms move (${apex.volume_trend}) — institutional participation`);
  else lines.push(`✗ Volume divergence (${apex.volume_trend}) — move lacks conviction, fade risk`);

  // 5. APEX state
  lines.push(`◈ APEX: ${apex.state} · direction=${apex.direction} · G=${apex.G.toFixed(3)} · dS=${apex.dS.toFixed(2)}`);

  return lines;
}

// ── Quantile bands: extract first 3 days from cone (+24h / +48h / +72h) ──
function extractQuantileBands(fc: ForecastLive | null): QuantileRow[] {
  if (!fc || !fc.cone || !fc.cone.t || fc.cone.t.length < 3) return [];
  const rows: QuantileRow[] = [];
  const horizons: QuantileRow['horizon'][] = ['+24h', '+48h', '+72h'];
  for (let i = 0; i < 3 && i < fc.cone.t.length; i++) {
    const p10 = fc.cone.p10[i];
    const p50 = fc.cone.p50[i];
    const p90 = fc.cone.p90[i];
    rows.push({
      horizon: horizons[i],
      date: fc.cone.t[i],
      p10,
      p25: fc.cone.p25[i],
      p50,
      p75: fc.cone.p75[i],
      p90,
      widthPct: ((p90 - p10) / p50) * 100,
    });
  }
  return rows;
}

// ── Trade rail (margin technical) — NO auto-translation to Simpan ──
// Vocab: LONG BIAS / SHORT BIAS / NO TRADE / EVENT RISK
type TradeStance = {
  stance: 'LONG BIAS' | 'SHORT BIAS' | 'NO TRADE' | 'EVENT RISK';
  reason: string;
  entryZone: string;
  stop: string;
  target: string;
  rr: string;
  shadowGated: boolean;
};
function deriveTradeStance(
  fc: ForecastLive | null,
  apex: ApexLive | null,
  ticker: TickerLive | null,
): TradeStance {
  // SHADOW gate — never emit actionable bias until calibration proves LIVE.
  if (!fc || fc.forecast_status !== 'LIVE') {
    return {
      stance: 'NO TRADE',
      reason: 'Calibration SHADOW — confluence pinball/brier unverified. No actionable bias.',
      entryZone: '—',
      stop: '—',
      target: '—',
      rr: '—',
      shadowGated: true,
    };
  }
  if (!apex || !ticker) {
    return {
      stance: 'NO TRADE',
      reason: 'Awaiting live ticker + APEX state.',
      entryZone: '—', stop: '—', target: '—', rr: '—',
      shadowGated: true,
    };
  }

  // EVENT RISK trigger: high ATR * spike regime, or extreme RSI + low confluence
  const atrPct = (apex.atr_14 / apex.price) * 100;
  if (atrPct > 2.5 || (apex.rsi_14 > 75 || apex.rsi_14 < 25) && apex.G < 0.4) {
    return {
      stance: 'EVENT RISK',
      reason: `ATR ${atrPct.toFixed(2)}%/bar or extreme RSI+low confluence — outcomes bimodal.`,
      entryZone: 'Avoid new positions.',
      stop: 'Tighten stops on existing.',
      target: 'Re-evaluate next session.',
      rr: '—',
      shadowGated: false,
    };
  }

  // Scenarios from the forecast drive direction
  const longs = fc.scenarios.filter((s) => s.side === 'LONG');
  const shorts = fc.scenarios.filter((s) => s.side === 'SHORT');
  const biasL = longs.reduce((a, s) => a + s.confluence, 0);
  const biasS = shorts.reduce((a, s) => a + s.confluence, 0);
  const apexVerdict = apex.verdict;

  if (apexVerdict === 'LONG' && biasL >= biasS && apex.G >= 0.4) {
    // Build entry/stop/target from first LONG scenario
    const sc = longs[0] || { trigger: '—', objective: apex.price, invalidation: apex.price - 1.5 * apex.atr_14 };
    const atr = apex.atr_14;
    const entry = sc.objective - 0.5 * atr;
    const stop = sc.invalidation;
    const target = apex.price + 2.0 * atr;
    const rr = ((target - entry) / (entry - stop)) || 0;
    return {
      stance: 'LONG BIAS',
      reason: `APEX ${apex.state} · bias=${fc.bias} · confluence L=${biasL}/S=${biasS}`,
      entryZone: `${entry.toFixed(2)} (close > R1 ${sc.trigger.replace(/^.*>/, '>')})`,
      stop: stop.toFixed(2),
      target: target.toFixed(2),
      rr: rr > 0 ? rr.toFixed(2) : '—',
      shadowGated: false,
    };
  }
  if (apexVerdict === 'SHORT' && biasS > biasL && apex.G >= 0.4) {
    const sc = shorts[0] || { trigger: '—', objective: apex.price, invalidation: apex.price + 1.5 * apex.atr_14 };
    const atr = apex.atr_14;
    const entry = sc.objective + 0.5 * atr;
    const stop = sc.invalidation;
    const target = apex.price - 2.0 * atr;
    const rr = ((entry - target) / (stop - entry)) || 0;
    return {
      stance: 'SHORT BIAS',
      reason: `APEX ${apex.state} · bias=${fc.bias} · confluence L=${biasL}/S=${biasS}`,
      entryZone: `${entry.toFixed(2)} (close < S1 ${sc.trigger.replace(/^.*>/, '>')})`,
      stop: stop.toFixed(2),
      target: target.toFixed(2),
      rr: rr > 0 ? rr.toFixed(2) : '—',
      shadowGated: false,
    };
  }
  return {
    stance: 'NO TRADE',
    reason: `Regime uncertainty · APEX=${apex.state} · confluence L=${biasL}/S=${biasS} · G=${apex.G.toFixed(2)}`,
    entryZone: '—', stop: '—', target: '—', rr: '—',
    shadowGated: false,
  };
}

// ── Simpan rail (physical saver / store-of-value) — independent derivation ──
// Vocab: SABAR / TUNGGU / JAGA / TAMBAH BERPERINGKAT
// NEVER auto-translate from Trade stance. Different horizon, different spread, different purpose.
type SimpanStance = {
  stance: 'SABAR' | 'TUNGGU' | 'JAGA' | 'TAMBAH BERPERINGKAT';
  reason: string;
  guidance: string;
  rmPerGramNote: string;
  shadowGated: boolean;
};
function deriveSimpanStance(
  fc: ForecastLive | null,
  apex: ApexLive | null,
  ticker: TickerLive | null,
): SimpanStance {
  // Default: SABAR. We err on the side of inaction for physical stackers.
  // Calibration SHADOW does NOT gate Simpan like Trade — saver behaviour is structural,
  // but we never lean toward TAMBAH BERPERINGKAT without LIVE calibration.
  if (!apex || !ticker || !fc) {
    return {
      stance: 'SABAR',
      reason: 'Awaiting live data.',
      guidance: 'Hold current allocation. Reassess when feed stabilizes.',
      rmPerGramNote: '—',
      shadowGated: true,
    };
  }

  const belowEma200 = ticker.price < ticker.ema200;
  const rsi = ticker.rsi;
  const aboveEma200Dist = ((ticker.price - ticker.ema200) / ticker.ema200) * 100;
  const medianPathUp = fc.cone.p50[2] > fc.cone.p50[0];

  // TAMBAH BERPERINGKAT: only when (a) calibration LIVE, (b) below EMA200 in a secular gold story,
  // (c) RSI not extreme, (d) cone's +72h median drifts higher than +24h median.
  if (
    fc.forecast_status === 'LIVE' &&
    belowEma200 &&
    rsi >= 30 && rsi <= 55 &&
    medianPathUp
  ) {
    return {
      stance: 'TAMBAH BERPERINGKAT',
      reason: `Spot ${aboveEma200Dist.toFixed(1)}% below EMA200 · RSI ${rsi.toFixed(1)} (not extreme) · cone drifts up`,
      guidance: 'Pertingkat pegangan fizikal secara berperingkat. Jangan all-in satu harga. Buat purata kos (DCA) sehingga 5–10% daripada portfolio.',
      rmPerGramNote: 'Bandingkan harga fizikal Public Gold / Ar-Rahnu vs XAU/USD · spread 3–6% tipikal.',
      shadowGated: false,
    };
  }

  // TUNGGU: regime ok but we are at the upper end or waiting for pullback
  if (rsi > 65 && apex.volatility_regime !== 'compressed') {
    return {
      stance: 'TUNGGU',
      reason: `RSI ${rsi.toFixed(1)} (tinggi) · Tunggu pullback ke paras EMA50/EMA200 untuk tambah.`,
      guidance: 'Belum tambah sekarang. Tunggu sekurang-kurangnya RSI < 55 ATAU harga dekati support (S1) sebelum pertingkat.',
      rmPerGramNote: '—',
      shadowGated: false,
    };
  }

  // JAGA: high ATR or regime shift — protect existing allocation, no moves
  if (apex.volatility_regime === 'expanding' || apex.state === 'CHAOS') {
    return {
      stance: 'JAGA',
      reason: `Vol regime ${apex.volatility_regime} · APEX ${apex.state} · Lindung nilai sedia ada.`,
      guidance: 'Jangan ubah pegangan. Pastikan serahan fizikal tersimpan di lokasi selamat (Ar-Rahnu / vault). Elakkan leveraj.',
      rmPerGramNote: '—',
      shadowGated: false,
    };
  }

  // SABAR default — neutrality, no recommendation either way
  return {
    stance: 'SABAR',
    reason: `Regime ${fc.basis.regime} · tiada isyarat pelarasan portfolio`,
    guidance: 'Kekalkan peruntukan sedia ada. Tunggu isyarat JAGA / TAMBAH BERPERINGKAT yang lebih jelas dari',
    rmPerGramNote: medianPathUp
      ? 'Cone median +72h lebih tinggi dari +24h — trend jangka panjang masih menaik.'
      : 'Cone median +72h lebih rendah — trend jangka panjang mendatar/menurun.',
    shadowGated: false,
  };
}

const COMMODITIES: Record<string, CommodityDef> = {
  oil: {
    slug: 'oil',
    name: 'Brent Crude Oil',
    symbol: 'BZ=F',
    tradingViewSymbol: 'TVC:UKOIL',
    description: 'Brent crude futures — global benchmark for oil prices. Drives Malaysian petroleum revenue and fiscal budget buffers.',
    source: 'yfinance: BZ=F',
    color: '#C4791A',
    yahoo: 'BZ=F',
    price: '$88.52',
    delta: '+$1.45',
    pct: '+1.64%',
    verdict: 'SEAL',
    verdictColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
    bias: 'BULLISH MANDATE',
    s1: '$88.38', s2: '$87.04', r1: '$89.39', r2: '$90.27',
    driver: 'Primary Driver: Middle East geopolitical risk premium · OPEC+ supply discipline · PETRONAS dividend buffer',
    ground: { title: 'Global Energy Pulse', desc: 'Brent crude benchmark directly influences PETRONAS dividend contributions to Putrajaya and RON95/BUDI95 fuel subsidy thresholds.' },
    mind: { title: 'Trading Desk Risk', desc: 'O&G equity tickers (Dayang, Dialog, Sapura) exhibit strong 0.82 correlation to Brent spot price movements.' },
    capital: { title: 'PETRONAS PROPA Impact', desc: 'Internal corporate KPI narratives intensify when Brent swings. Distinguish core operational signal from executive spin.' },
    sovereign: { title: 'Frontier Drilling Budget', desc: 'Sustained oil above $85/bbl funds offshore exploration campaigns in the Malay and Sabah basins.' },
  },
  gas: {
    slug: 'gas',
    name: 'Natural Gas / LNG',
    symbol: 'NG=F',
    tradingViewSymbol: 'TVC:NGAS',
    description: 'Natural gas futures — benchmark for LNG pricing. Influences Sarawak gas revenue, SEARAH economics, and TNB power tariffs.',
    source: 'yfinance: NG=F',
    color: '#00D4AA',
    yahoo: 'NG=F',
    price: '$3.42',
    delta: '+$0.08',
    pct: '+2.40%',
    verdict: 'SABAR',
    verdictColor: 'bg-amber-950 text-amber-400 border-amber-500/40',
    bias: 'NEUTRAL ACCUMULATION',
    s1: '$3.20', s2: '$3.00', r1: '$3.60', r2: '$3.85',
    driver: 'Primary Driver: Asian LNG demand · Bintulu MLNG cargo dispatch · Seasonal thermal cooling demand',
    ground: { title: 'LNG Export Benchmarks', desc: 'Japan-Korea Marker (JKM) and Henry Hub futures dictate Sarawak state gas sales and Bintulu export revenues.' },
    mind: { title: 'Power Generation Net Cost', desc: 'Natural gas inputs drive 55%+ of Peninsular Malaysia electricity generation costs under IBR tariff rebalancing.' },
    capital: { title: 'SEARAH Asset Economics', desc: 'Gas realization prices determine asset valuation multiples across domestic upstream gas fields.' },
    sovereign: { title: 'Sarawak PDA Sovereignty', desc: 'State-federal gas distribution rights between PETROS and PETRONAS depend on long-term gas netback margins.' },
  },
  gold: {
    slug: 'gold',
    name: 'Gold (XAU/USD)',
    symbol: 'GC=F',
    tradingViewSymbol: 'OANDA:XAUUSD',
    description: 'Gold futures — sovereign hedge and zero-counterparty risk asset. Tracked in USD/oz and RM/gram for capital preservation.',
    source: 'yfinance: GC=F',
    color: '#D4A853',
    yahoo: 'GC=F',
    price: '$2,485.40',
    delta: '+$14.20',
    pct: '+0.58%',
    verdict: 'SEAL',
    verdictColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
    bias: 'SOVEREIGN HEDGE',
    s1: '$2,450.00', s2: '$2,420.00', r1: '$2,500.00', r2: '$2,525.00',
    driver: 'Primary Driver: Central bank gold accumulation · US Fed rate cut expectations · Geopolitical safe-haven demand',
    ground: { title: 'Zero Counterparty Risk', desc: 'Physical gold remains the ultimate store of value, free from sovereign debt default or fiat debasement risk.' },
    mind: { title: 'Currency Hedging', desc: 'Gold in MYR terms (RM 348/gram) protects domestic purchasing power against Ringgit volatility.' },
    capital: { title: 'Portfolio Protection', desc: 'Allocating 5-10% to gold lowers overall portfolio drawdowns during equity market corrections.' },
    sovereign: { title: 'Central Bank Reserves', desc: 'Global monetary authorities continue net gold purchases to diversify away from USD reserve dominance.' },
  },
  klci: {
    slug: 'klci',
    name: 'Bursa Malaysia (FBM KLCI)',
    symbol: '^KLSE',
    tradingViewSymbol: 'MYX:FBMKLCI',
    description: 'FTSE Bursa Malaysia KLCI — benchmark index of Malaysia top 30 blue-chip equities and capital market pulse.',
    source: 'yfinance: ^KLSE',
    color: '#3B82F6',
    yahoo: '^KLSE',
    price: '1,598.40',
    delta: '+4.50',
    pct: '+0.26%',
    verdict: 'SEAL',
    verdictColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
    bias: 'BULLISH RECOVERY',
    s1: '1,580.00', s2: '1,565.00', r1: '1,615.00', r2: '1,630.00',
    driver: 'Primary Driver: Blue-chip accumulation · OPR stability at 2.75% · Domestic demand resilience',
    ground: { title: 'Domestic Equities & Blue Chips', desc: 'Index anchored by banking, O&G, and utility blue chips. Retail & institutional volume steady above RM2.4B daily average.' },
    mind: { title: 'Monetary Stance & Rates', desc: 'BNM OPR maintained at 2.75% provides low-volatility monetary buffer. Foreign inflow responding to defensive valuation multiples.' },
    capital: { title: 'Corporate Earnings & Yield', desc: 'Average dividend yield across top 30 constituent stocks holding at ~4.1%, preserving capital against bond yield volatility.' },
    sovereign: { title: 'Fiscal Buffer & Policy', desc: 'Federal fiscal target aligned with 4.5%–5.0% GDP growth projection. State election resolution removes near-term political risk discount.' },
  },
  usdmyr: {
    slug: 'usdmyr',
    name: 'Ringgit FX (USD/MYR)',
    symbol: 'USDMYR=X',
    tradingViewSymbol: 'FX_IDC:USDMYR',
    description: 'Malaysian Ringgit exchange rate against US Dollar — imported inflation barometer, BNM OPR buffer, and trade surplus anchor.',
    source: 'yfinance: USDMYR=X',
    color: '#F59E0B',
    yahoo: 'USDMYR=X',
    price: '4.4250',
    delta: '-0.0125',
    pct: '-0.28%',
    verdict: 'SABAR',
    verdictColor: 'bg-amber-950 text-amber-400 border-amber-500/40',
    bias: 'STABLE CONTROL',
    s1: '4.3800', s2: '4.3500', r1: '4.4500', r2: '4.5000',
    driver: 'Primary Driver: US Federal Reserve rate pause (3.50%-3.75%) · BNM OPR 2.75% · Export trade surplus buffer',
    ground: { title: 'Imported Inflation & Prices', desc: 'Every 0.10 MYR shift impacts imported food, electronics, and capital equipment costs. Current 1.90% inflation rate reflects moderate FX passthrough.' },
    mind: { title: 'Fed vs BNM Rate Differential', desc: 'US Fed funds rate at 3.50%–3.75% against Bank Negara OPR at 2.75%. Differential narrowing reduces capital outflow pressure.' },
    capital: { title: 'PETRONAS & Exporter Translation', desc: 'PETRONAS USD revenue stream provides natural hedge for national accounts. Exporters converting USD receipts support domestic Ringgit liquidity.' },
    sovereign: { title: 'Trade Surplus & Reserves', desc: 'Malaysia H1 trade surplus reaching MYR 147.1B (+27.5% export growth) maintains strong central bank reserve foundation.' },
  },
};

export function CommodityPage({ slug }: { slug: string }) {
  const commodity = COMMODITIES[slug] || COMMODITIES['oil'];
  const [ticker, setTicker] = useState<TickerLive | null>(null);
  const [apex, setApex] = useState<ApexLive | null>(null);
  const [forecastLive, setForecastLive] = useState<ForecastLive | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Ticker endpoint URL map — finance Capital-routed paths.
  const TICKER_URL: Record<string, string> = {
    gold: '/wealth/gold/api/ticker',
    oil: '/wealth/oil/api/ticker',
    gas: '/wealth/gas/api/ticker',
    usdmyr: '/usdmyr/api/ticker',
    klci: '/klci/api/ticker',
  };
  const APEX_URL: Record<string, string> = {
    gold: '/wealth/gold/api/apex',
    oil: '/wealth/oil/api/apex',
    gas: '/wealth/gas/api/apex',
    usdmyr: '/usdmyr/api/apex',
    klci: '/klci/api/apex',
  };
  // WEALTH forecast contract (wealth.forecast.v1). Gold has horizon=3 (+24h/+48h/+72h quantiles).
  // Other commodities fall back to ticker+apex only — no two-rail on those yet.
  const FORECAST_URL: Record<string, string> = {
    gold: '/wealth/gold/api/forecast?horizon=3',
  };

  const fetchLive = useCallback(async () => {
    const tickerUrl = TICKER_URL[commodity.slug] || `/wealth/${commodity.slug}/api/ticker`;
    const apexUrl = APEX_URL[commodity.slug] || `/wealth/${commodity.slug}/api/apex`;
    const forecastUrl = FORECAST_URL[commodity.slug];

    try {
      const fetches: Promise<unknown>[] = [
        fetch(tickerUrl).then((r) => r.json()).catch((e) => { console.warn('[commodity] ticker fetch failed', e); return null; }),
        fetch(apexUrl).then((r) => r.json()).catch((e) => { console.warn('[commodity] apex fetch failed', e); return null; }),
      ];
      if (forecastUrl) {
        fetches.push(
          fetch(forecastUrl).then((r) => r.json()).catch((e) => { console.warn('[commodity] forecast fetch failed', e); return null; }),
        );
      }
      const results = await Promise.all(fetches);
      const [tkRes, apxRes, fcRes] = results as [any, any, any];
      if (tkRes && tkRes.price) setTicker(tkRes as TickerLive);
      if (apxRes && apxRes.apex) setApex(apxRes as ApexLive);
      if (fcRes && fcRes.schema === 'wealth.forecast.v1') setForecastLive(fcRes as ForecastLive);
      setLastUpdated(new Date());
    } catch {
      // silent fallback to static
    }
  }, [commodity.slug]);

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 60000);  // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchLive]);

  // Live values (with static fallback)
  const currentPrice = ticker ? (slug === 'usdmyr' ? ticker.price.toFixed(4) : `$${ticker.price.toFixed(2)}`) : commodity.price;
  const currentDelta = ticker ? (ticker.change > 0 ? `+${ticker.change.toFixed(2)}` : ticker.change.toFixed(2)) : commodity.delta;
  const currentPct = ticker ? `${ticker.changePct > 0 ? '+' : ''}${ticker.changePct.toFixed(2)}%` : commodity.pct;
  const liveLevels = ticker ? {
    s1: ticker.support[0]?.toFixed(2) || commodity.s1,
    s2: ticker.support[1]?.toFixed(2) || commodity.s2,
    r1: ticker.resistance[0]?.toFixed(2) || commodity.r1,
    r2: ticker.resistance[1]?.toFixed(2) || commodity.r2,
    pivot: ticker.pivot?.toFixed(2) || '—',
    ema20: ticker.ema20?.toFixed(2) || '—',
    ema50: ticker.ema50?.toFixed(2) || '—',
    ema200: ticker.ema200?.toFixed(2) || '—',
    rsi: ticker.rsi?.toFixed(1) || '—',
    emaTrend: ticker.emaTrend || '—',
    signal: ticker.signal || '—',
    confidence: ticker.confidence?.toFixed(2) || '—',
  } : null;

  // Verdict: APEX drives, fallback to static
  const apexVerdict = apex?.verdict || commodity.verdict;
  const apexDirection = apex?.direction || 'FLAT';
  const apexG = apex?.G?.toFixed(3) || '—';
  const apexCdark = apex?.C_dark?.toFixed(3) || '—';
  const apexDS = apex?.dS?.toFixed(3) || '—';

  // Forecast cone — local P25/P50/P75 ATR-scaled (unchanged; UI cushion for offline-only viewers)
  const forecast = ticker && apex ? computeForecastCone(ticker.price, apex.atr_14, 30) : null;

  // State machine
  const regime = classifyRegime(ticker, apex);

  // Action guide (legacy single-rail — kept as cushion; superseded by TWO RAILS below on gold)
  const action = computeActionGuide(ticker, apex);

  // Dynamics
  const dynamics = explainDynamics(ticker, apex);

  // Quantile bands + two-rail (GOLD only — other commodities fall back to legacy action)
  const quantileBands = slug === 'gold' ? extractQuantileBands(forecastLive) : [];
  const tradeStance = slug === 'gold' ? deriveTradeStance(forecastLive, apex, ticker) : null;
  const simpanStance = slug === 'gold' ? deriveSimpanStance(forecastLive, apex, ticker) : null;
  const forecastCalibration =
    forecastLive?.forecast_status === 'LIVE' ? 'LIVE' : 'SHADOW';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0A0B0D] min-h-screen text-[#EDEAE2] font-sans selection:bg-[#E27D60] selection:text-[#0A0B0D] pb-20">

      {/* LOCAL MARKET NAV TICKER */}
      <div className="bg-[#0E1015] border-b border-[#222733] py-2.5 px-4 font-mono text-xs text-[#8E95A5] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#1F180D] text-[#D4AF37] border border-[#3A2E16] text-[10px] font-bold uppercase tracking-wider">
            ● WEALTH SIGNAL TERMINAL
          </span>
          <span className="text-white">arifOS · Federation Market Intelligence · {commodity.name}</span>
          {ticker && (
            <span className="text-[#4ECCA3] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ECCA3] animate-pulse" /> LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <a href="/oil/" className={`px-2.5 py-1 rounded transition-colors ${slug === 'oil' ? 'bg-[#E27D60] text-[#0A0B0D] font-bold' : 'text-[#8E95A5] hover:text-white'}`}>OIL</a>
          <a href="/gas/" className={`px-2.5 py-1 rounded transition-colors ${slug === 'gas' ? 'bg-[#E27D60] text-[#0A0B0D] font-bold' : 'text-[#8E95A5] hover:text-white'}`}>GAS</a>
          <a href="/gold/" className={`px-2.5 py-1 rounded transition-colors ${slug === 'gold' ? 'bg-[#E27D60] text-[#0A0B0D] font-bold' : 'text-[#8E95A5] hover:text-white'}`}>GOLD</a>
          <a href="/usdmyr/" className={`px-2.5 py-1 rounded transition-colors ${slug === 'usdmyr' ? 'bg-[#E27D60] text-[#0A0B0D] font-bold' : 'text-[#8E95A5] hover:text-white'}`}>USD/MYR</a>
          <a href="/klci/" className={`px-2.5 py-1 rounded transition-colors ${slug === 'klci' ? 'bg-[#E27D60] text-[#0A0B0D] font-bold' : 'text-[#8E95A5] hover:text-white'}`}>KLCI</a>
        </div>
      </div>

      {/* HERO & LIVE VERDICT */}
      <section className="py-12 md:py-16 border-b border-[#222733] bg-[#0E1117]/80">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="font-mono text-xs text-[#E27D60] uppercase tracking-widest mb-1">
                WEALTH MARKET SIGNAL · {commodity.symbol}
              </div>
              <h1 className="text-4xl md:text-6xl font-normal font-serif uppercase tracking-tight text-white">
                {commodity.name}
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3.5 py-1.5 rounded font-mono text-xs font-bold border uppercase tracking-wider ${
                    apexVerdict === 'LONG' || apexVerdict === 'SEAL'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      : apexVerdict === 'SHORT'
                      ? 'bg-rose-950 text-rose-400 border-rose-500/40'
                      : 'bg-amber-950 text-amber-400 border-amber-500/40'
                  }`}
                >
                  VERDICT: {apexVerdict}
                </span>
                <span
                  className="px-3 py-1 rounded font-mono text-[10px] font-bold border uppercase tracking-wider"
                  style={{
                    color: regime.color,
                    borderColor: `${regime.color}60`,
                    backgroundColor: `${regime.color}15`,
                  }}
                >
                  ◇ {regime.state}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#8E95A5]">
                {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-GB')} · auto-refresh 60s` : 'AWAITING DATA'}
              </span>
            </div>
          </div>

          <p className="font-light text-base md:text-lg text-[#A0A7B8] max-w-3xl leading-relaxed mb-8">
            {commodity.description}
          </p>

          {/* PRICE CARD */}
          <div className="bg-[#12151D] border border-[#222733] rounded-2xl p-6 md:p-8 mb-6 shadow-xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="font-mono text-xs text-[#8E95A5] uppercase tracking-wider mb-2">
                  Live Price Quote
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-4xl md:text-5xl font-bold text-white">
                    {currentPrice}
                  </span>
                  <span className={`font-mono text-lg md:text-xl font-bold ${ticker && ticker.change >= 0 ? 'text-[#4ECCA3]' : 'text-[#F87171]'}`}>
                    {currentDelta}
                  </span>
                  <span className="font-mono text-sm text-[#8E95A5]">({currentPct})</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {liveLevels && (
                  <span className={`px-3 py-1 rounded border font-mono text-xs uppercase font-bold tracking-wider ${
                    liveLevels.signal === 'LONG'
                      ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40'
                      : liveLevels.signal === 'SHORT'
                      ? 'bg-rose-950/50 text-rose-400 border-rose-500/40'
                      : 'bg-slate-900/50 text-slate-400 border-slate-500/40'
                  }`}>
                    SIGNAL: {liveLevels.signal} (conf {liveLevels.confidence})
                  </span>
                )}
                <span className="px-3 py-1 rounded bg-[#181D26] border border-[#2B3448] text-white font-mono text-xs uppercase font-bold tracking-wider">
                  BIAS: {apexDirection}
                </span>
              </div>
            </div>

            {/* KEY LEVELS — LIVE */}
            <div className="mt-6 pt-6 border-t border-[#1F2533] font-mono text-xs text-[#D4AF37]">
              {liveLevels ? (
                <span className="text-[#4ECCA3]">
                  ● Live APEX state · G={apexG} · dS={apexDS} · C_dark={apexCdark} · {regime.tag}
                </span>
              ) : (
                commodity.driver
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="text-[#8E95A5] uppercase">Key Levels (Live):</span>
              <span className="px-2.5 py-1 rounded bg-[#0E1F1A] border border-[#1E4D3E] text-[#4ECCA3]">S1: {liveLevels?.s1 || commodity.s1}</span>
              <span className="px-2.5 py-1 rounded bg-[#0E1F1A] border border-[#1E4D3E] text-[#4ECCA3]">S2: {liveLevels?.s2 || commodity.s2}</span>
              <span className="px-2.5 py-1 rounded bg-[#0E1F1A] border border-[#1E4D3E] text-[#4ECCA3]">Pivot: {liveLevels?.pivot || '—'}</span>
              <span className="px-2.5 py-1 rounded bg-[#241313] border border-[#522323] text-[#F87171]">R1: {liveLevels?.r1 || commodity.r1}</span>
              <span className="px-2.5 py-1 rounded bg-[#241313] border border-[#522323] text-[#F87171]">R2: {liveLevels?.r2 || commodity.r2}</span>
              <span className="px-2.5 py-1 rounded bg-[#1A1305] border border-[#3A2E16] text-[#D4AF37]">EMA20: {liveLevels?.ema20 || '—'}</span>
              <span className="px-2.5 py-1 rounded bg-[#1A1305] border border-[#3A2E16] text-[#D4AF37]">EMA50: {liveLevels?.ema50 || '—'}</span>
              <span className="px-2.5 py-1 rounded bg-[#1A1305] border border-[#3A2E16] text-[#D4AF37]">EMA200: {liveLevels?.ema200 || '—'}</span>
              <span className="px-2.5 py-1 rounded bg-[#181D26] border border-[#2B3448] text-white">RSI: {liveLevels?.rsi || '—'}</span>
            </div>
          </div>

          {/* ── REAL INTERACTIVE TRADINGVIEW CHART ── */}
          <TradingViewChart
            symbol={commodity.tradingViewSymbol}
            height={560}
          />

          {/* ── FORECAST CONE — P25/P50/P75 30d projection ── */}
          {forecast && ticker && (
            <div className="mt-6 bg-[#0E1117] border border-[#222733] rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-xs text-[#A78BFA] uppercase tracking-widest mb-1">FORECAST CONE · 30-DAY HORIZON</div>
                  <h3 className="text-xl font-serif text-white">Probability Distribution</h3>
                </div>
                <span className="font-mono text-[10px] text-[#8E95A5]">Monte Carlo · ATR-scaled GBM · 95% CI bands</span>
              </div>
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="bg-[#241313]/50 border border-[#522323] rounded-lg p-4 text-center">
                  <div className="text-[10px] text-[#F87171] uppercase tracking-wider mb-1">P25 (bearish floor)</div>
                  <div className="text-2xl font-bold text-[#F87171]">${forecast.p25.toFixed(2)}</div>
                  <div className="text-[10px] text-[#8E95A5] mt-1">{((forecast.p25 / ticker.price - 1) * 100).toFixed(1)}% from spot</div>
                </div>
                <div className="bg-[#181D26] border border-[#2B3448] rounded-lg p-4 text-center">
                  <div className="text-[10px] text-[#38BDF8] uppercase tracking-wider mb-1">P50 (median)</div>
                  <div className="text-2xl font-bold text-[#38BDF8]">${forecast.p50.toFixed(2)}</div>
                  <div className="text-[10px] text-[#8E95A5] mt-1">driftless anchor</div>
                </div>
                <div className="bg-[#0E1F1A]/50 border border-[#1E4D3E] rounded-lg p-4 text-center">
                  <div className="text-[10px] text-[#4ECCA3] uppercase tracking-wider mb-1">P75 (bullish ceiling)</div>
                  <div className="text-2xl font-bold text-[#4ECCA3]">${forecast.p75.toFixed(2)}</div>
                  <div className="text-[10px] text-[#8E95A5] mt-1">{((forecast.p75 / ticker.price - 1) * 100).toFixed(1)}% from spot</div>
                </div>
              </div>
            </div>
          )}

          {/* ── GOLD ONLY: Quantile bands (+24h/+48h/+72h) + TWO RAILS — Trade + Simpan ── */}
          {slug === 'gold' && forecastLive && (
            <>
              {/* CALIBRATION BADGE — always visible when forecast loaded */}
              <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="text-[#8E95A5] uppercase tracking-wider">Forecast Calibration:</span>
                <span
                  className={`px-3 py-1 rounded border font-bold uppercase tracking-wider ${
                    forecastCalibration === 'LIVE'
                      ? 'bg-[#0E1F1A] border-[#1E4D3E] text-[#4ECCA3]'
                      : 'bg-[#241313] border-[#522323] text-[#F87171]'
                  }`}
                  title={forecastCalibration === 'SHADOW' ? 'Auto-set to SHADOW — pinball/brier not validated.' : 'Calibration gate passed.'}
                >
                  {forecastCalibration}
                </span>
                <span className="text-[#8E95A5]">
                  · epistemic: {forecastLive.epistemic}
                </span>
                {forecastLive.auto_translate_disabled && (
                  <span className="px-2 py-0.5 rounded bg-[#181D26] border border-[#2B3448] text-[#A78BFA] uppercase tracking-wider">
                    auto_translate_disabled
                  </span>
                )}
              </div>

              {/* QUANTILE BANDS — P10 / P25 / P50 / P75 / P90 × +24h / +48h / +72h */}
              {quantileBands.length > 0 && (
                <div className="mt-3 bg-[#0E1117] border border-[#222733] rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-mono text-xs text-[#A78BFA] uppercase tracking-widest mb-1">FORECAST CONE · 72-HOUR QUANTILE BANDS</div>
                      <h3 className="text-xl font-serif text-white">Quantile Distribution · +24h / +48h / +72h</h3>
                    </div>
                    <span className="font-mono text-[10px] text-[#8E95A5]">ATR-scaled GBM · basis close={forecastLive.basis.close.toFixed(2)} · RSI {forecastLive.basis.rsi.toFixed(1)}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full font-mono text-xs">
                      <thead>
                        <tr className="text-[#8E95A5] uppercase tracking-wider">
                          <th className="text-left py-2 px-2">Horizon</th>
                          <th className="text-left py-2 px-2">Date</th>
                          <th className="text-right py-2 px-2 text-[#F87171]">P10</th>
                          <th className="text-right py-2 px-2 text-[#FB923C]">P25</th>
                          <th className="text-right py-2 px-2 text-[#38BDF8]">P50</th>
                          <th className="text-right py-2 px-2 text-[#A78BFA]">P75</th>
                          <th className="text-right py-2 px-2 text-[#4ECCA3]">P90</th>
                          <th className="text-right py-2 px-2 text-[#8E95A5]">P90−P10%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quantileBands.map((row) => (
                          <tr key={row.horizon} className="border-t border-[#1F2533]">
                            <td className="py-2 px-2 text-white font-bold">{row.horizon}</td>
                            <td className="py-2 px-2 text-[#A0A7B8]">{row.date}</td>
                            <td className="py-2 px-2 text-right text-[#F87171]">{row.p10.toFixed(2)}</td>
                            <td className="py-2 px-2 text-right text-[#FB923C]">{row.p25.toFixed(2)}</td>
                            <td className="py-2 px-2 text-right text-[#38BDF8] font-bold">{row.p50.toFixed(2)}</td>
                            <td className="py-2 px-2 text-right text-[#A78BFA]">{row.p75.toFixed(2)}</td>
                            <td className="py-2 px-2 text-right text-[#4ECCA3]">{row.p90.toFixed(2)}</td>
                            <td className="py-2 px-2 text-right text-[#8E95A5]">{row.widthPct.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {forecastCalibration === 'SHADOW' && (
                    <div className="mt-4 pt-4 border-t border-[#1F2533] font-mono text-[10px] text-[#F87171]">
                      ※ SHADOW — calibration gate (pinball / brier / coverage) belum lulus. Quantiles adalah statistical sampling, bukan ramalan berisiko yang disahkan.
                      Trade rail default ke NO TRADE sehingga calibration naik ke LIVE.
                    </div>
                  )}
                </div>
              )}

              {/* TWO RAILS — UNTUK TRADE (margin technical) + UNTUK SIMPAN (physical saver) */}
              {(tradeStance || simpanStance) && (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* UNTUK TRADE — margin technical rail */}
                  {tradeStance && (
                    <div className="bg-[#0E1117] border-2 border-[#4ECCA3]/40 rounded-2xl p-6 shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-3 py-1 bg-[#4ECCA3] text-[#0A0B0D] text-[10px] font-mono font-bold uppercase tracking-wider rounded-bl">
                        UNTUK TRADE · Margin
                      </div>
                      <div className="font-mono text-xs text-[#4ECCA3] uppercase tracking-widest mb-2">RAIL 1 · MARGIN TECHNICAL</div>
                      <h3 className="text-2xl font-serif text-white mb-1 flex items-center gap-2">
                        {tradeStance.stance}
                        {tradeStance.shadowGated && (
                          <span className="px-2 py-0.5 rounded bg-[#241313] border border-[#522323] text-[#F87171] text-[10px] font-mono uppercase">SHADOW</span>
                        )}
                      </h3>
                      <div className="font-mono text-[11px] text-[#A0A7B8] mb-4 italic">{tradeStance.reason}</div>

                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex justify-between border-b border-[#1F2533] pb-2">
                          <span className="text-[#8E95A5]">Entry Zone</span>
                          <span className="text-white font-bold">{tradeStance.entryZone}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1F2533] pb-2">
                          <span className="text-[#8E95A5]">Stop</span>
                          <span className="text-[#F87171] font-bold">{tradeStance.stop}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1F2533] pb-2">
                          <span className="text-[#8E95A5]">Target</span>
                          <span className="text-[#4ECCA3] font-bold">{tradeStance.target}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1F2533] pb-2">
                          <span className="text-[#8E95A5]">R:R Ratio</span>
                          <span className="text-white font-bold">{tradeStance.rr}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#1F2533] font-mono text-[10px] text-[#8E95A5]">
                        ※ Bukan nasihat pelaburan. Horizon pendek · broker spread · margin/leverage. Stop sentiasa diperlukan.
                      </div>
                    </div>
                  )}

                  {/* UNTUK SIMPAN — physical saver rail */}
                  {simpanStance && (
                    <div className="bg-[#0E1117] border-2 border-[#D4AF37]/40 rounded-2xl p-6 shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-3 py-1 bg-[#D4AF37] text-[#0A0B0D] text-[10px] font-mono font-bold uppercase tracking-wider rounded-bl">
                        UNTUK SIMPAN · Fizikal
                      </div>
                      <div className="font-mono text-xs text-[#D4AF37] uppercase tracking-widest mb-2">RAIL 2 · FIZIKAL PENSTOK</div>
                      <h3 className="text-2xl font-serif text-white mb-1 flex items-center gap-2">
                        {simpanStance.stance}
                        {simpanStance.shadowGated && (
                          <span className="px-2 py-0.5 rounded bg-[#241313] border border-[#522323] text-[#F87171] text-[10px] font-mono uppercase">SHADOW</span>
                        )}
                      </h3>
                      <div className="font-mono text-[11px] text-[#A0A7B8] mb-4 italic">{simpanStance.reason}</div>

                      <div className="space-y-2 font-mono text-xs">
                        <div>
                          <div className="text-[#8E95A5] mb-1 uppercase tracking-wider">Panduan</div>
                          <div className="text-white leading-relaxed">{simpanStance.guidance}</div>
                        </div>
                        {simpanStance.rmPerGramNote && simpanStance.rmPerGramNote !== '—' && (
                          <div className="pt-2">
                            <div className="text-[#8E95A5] mb-1 uppercase tracking-wider">XAU/MYR · RM/gram nota</div>
                            <div className="text-[#D4AF37] leading-relaxed">{simpanStance.rmPerGramNote}</div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#1F2533] font-mono text-[10px] text-[#8E95A5]">
                        ※ Rail fizikal — tiada entry/stop/target. Spread Public Gold / Ar-Rahnu vs XAU/USD = 3–6%. Anda yang putuskan.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TWO-RAIL DISCIPLINE FOOTER — human veto */}
              <div className="mt-6 bg-[#181D26] border border-[#2B3448] rounded-2xl p-4 font-mono text-[11px] text-[#8E95A5]">
                <div className="font-bold text-[#A0A7B8] mb-2">TWO-RAIL DISCIPLINE · auto_translate_disabled</div>
                <div className="leading-relaxed">
                  <span className="text-white">LONG BIAS</span> ≠ <span className="text-[#D4AF37]">TAMBAH BERPERINGKAT</span> ·{' '}
                  <span className="text-white">SHORT BIAS</span> ≠ "jual emas fizikal anda". Horizon, spread (broker vs dealer fizikal), tujuan (spekulasi vs store-of-value), dan XAU/MYR semuanya berbeza.{' '}
                  <span className="text-[#4ECCA3]">Default sentiasa SABAR / NO TRADE melainkan calibration LIVE.</span>{' '}
                  <span className="text-white">Anda yang putuskan.</span>
                </div>
              </div>
            </>
          )}

          {/* ── STATE MACHINE + DYNAMICS + DECISION ACTION ── */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* STATE MACHINE + DYNAMICS */}
            <div className="bg-[#0E1117] border border-[#222733] rounded-2xl p-6 shadow-md">
              <div className="font-mono text-xs text-[#E27D60] uppercase tracking-widest mb-2">REGIME STATE</div>
              <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: regime.color }}></span>
                {regime.state}
                <span className="text-sm font-mono text-[#8E95A5]">· {regime.tag}</span>
              </h3>

              <div className="font-mono text-xs text-[#8E95A5] uppercase tracking-wider mb-3">DYNAMICS · Why price is moving</div>
              <div className="space-y-2 font-mono text-xs text-[#A0A7B8] leading-relaxed">
                {dynamics.map((line, i) => (
                  <div key={i} className="border-l-2 border-[#222733] pl-3 py-1">{line}</div>
                ))}
              </div>
            </div>

            {/* DECISION ACTION GUIDE */}
            <div className="bg-[#0E1117] border border-[#222733] rounded-2xl p-6 shadow-md">
              <div className="font-mono text-xs text-[#4ECCA3] uppercase tracking-widest mb-2">DECISION ACTION GUIDE</div>
              <h3 className="text-xl font-serif text-white mb-4">{action.action}</h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-[#1F2533] pb-2">
                  <span className="text-[#8E95A5]">Entry</span>
                  <span className="text-white font-bold">${action.entry}</span>
                </div>
                <div className="flex justify-between border-b border-[#1F2533] pb-2">
                  <span className="text-[#8E95A5]">Stop</span>
                  <span className="text-[#F87171] font-bold">${action.stop}</span>
                </div>
                <div className="flex justify-between border-b border-[#1F2533] pb-2">
                  <span className="text-[#8E95A5]">Target</span>
                  <span className="text-[#4ECCA3] font-bold">${action.target}</span>
                </div>
                <div className="flex justify-between border-b border-[#1F2533] pb-2">
                  <span className="text-[#8E95A5]">R:R Ratio</span>
                  <span className="text-white font-bold">{action.rr}</span>
                </div>
                <div className="flex justify-between border-b border-[#1F2533] pb-2">
                  <span className="text-[#8E95A5]">Confluence (G)</span>
                  <span className={`font-bold ${
                    action.confluenceLevel === 'HIGH' ? 'text-[#4ECCA3]' :
                    action.confluenceLevel === 'MEDIUM' ? 'text-[#D4AF37]' : 'text-[#8E95A5]'
                  }`}>
                    {action.confluence} ({action.confluenceLevel})
                  </span>
                </div>
                <div className="pt-2">
                  <div className="text-[#8E95A5] mb-1">Trigger Condition</div>
                  <div className="text-white">{action.trigger}</div>
                </div>
                <div className="pt-1">
                  <div className="text-[#8E95A5] mb-1">Invalidation</div>
                  <div className="text-[#F87171]">{action.invalidation}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#1F2533] font-mono text-[10px] text-[#8E95A5]">
                ※ Not trading advice. Forecast is statistical ensemble from live ATR · confluence &lt; 0.3 = no edge.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4-PLANE DECISION DRIVERS GRID */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="font-mono text-xs text-[#E27D60] uppercase tracking-widest mb-2">4-PLANE DECISION MATRIX</div>
          <h2 className="text-2xl md:text-3xl font-serif font-normal text-white mb-8">$\Delta \rightarrow \Omega \rightarrow \Xi \rightarrow \Psi$ Signal Breakdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="bg-[#0E1117] border border-[#222733] rounded-2xl p-6 shadow-md">
              <div className="text-[#D4AF37] font-bold uppercase tracking-wider mb-2">Δ GROUND · PHYSICAL DATA</div>
              <h3 className="text-base font-bold text-white mb-2">{commodity.ground.title}</h3>
              <p className="font-sans text-sm text-[#A0A7B8] font-light leading-relaxed">{commodity.ground.desc}</p>
            </div>

            <div className="bg-[#0E1117] border border-[#222733] rounded-2xl p-6 shadow-md">
              <div className="text-[#38BDF8] font-bold uppercase tracking-wider mb-2">Ω MIND · TECHNICAL & RISK</div>
              <h3 className="text-base font-bold text-white mb-2">{commodity.mind.title}</h3>
              <p className="font-sans text-sm text-[#A0A7B8] font-light leading-relaxed">{commodity.mind.desc}</p>
            </div>

            <div className="bg-[#0E1117] border border-[#222733] rounded-2xl p-6 shadow-md">
              <div className="text-[#4ECCA3] font-bold uppercase tracking-wider mb-2">Ξ CAPITAL · EARNINGS & ALIGNMENT</div>
              <h3 className="text-base font-bold text-white mb-2">{commodity.capital.title}</h3>
              <p className="font-sans text-sm text-[#A0A7B8] font-light leading-relaxed">{commodity.capital.desc}</p>
            </div>

            <div className="bg-[#0E1117] border border-[#222733] rounded-2xl p-6 shadow-md">
              <div className="text-[#A78BFA] font-bold uppercase tracking-wider mb-2">Ψ SOVEREIGN · FISCAL POLICY</div>
              <h3 className="text-base font-bold text-white mb-2">{commodity.sovereign.title}</h3>
              <p className="font-sans text-sm text-[#A0A7B8] font-light leading-relaxed">{commodity.sovereign.desc}</p>
            </div>
          </div>
        </div>
      </section>

    </motion.div>
  );
}

export default CommodityPage;