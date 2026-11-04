import React from 'react';
import { LayoutGrid } from './LayoutGrid';

export interface PortalKedaulatanProps {
  className?: string;
}

/**
 * Screen 01 — Portal Kedaulatan (Root Entry Area & Sovereign Constellation Matrix)
 * Source Wireframe: constellation-home-portal-kedaulatan-dark-mode.html
 * Design System Asset: assets/53930e338fa249e8bec7808f181df468
 */
export const PortalKedaulatan: React.FC<PortalKedaulatanProps> = ({ className = '' }) => {
  return (
    <LayoutGrid territory="PORTAL">
      <div className={`rounded-canon ${className}`.trim()}>
        <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface min-h-screen"><div className="flex flex-col w-full px-margin-mobile pb-space-lg gap-space-lg">

<section className="w-full bg-[#111318] border border-forge-iron/90 rounded-canon p-space-sm flex flex-col gap-space-xs shadow-lg relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-human-500/5 pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-canon bg-telemetry-950/60 border border-telemetry-500/40 text-telemetry-300">
<span className="w-2 h-2 rounded-canon bg-telemetry-400 animate-pulse shadow-[0_0_8px_#31c48d]"></span>
<span className="font-mono text-label-sm tracking-wider font-semibold">SUBSTRATE HEALTHY</span>
</div>
<span className="font-mono text-label-sm text-primary/80 font-mono tracking-wider uppercase">SYNTH-NET v4.9</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-mono text-label-sm px-1 pt-1 relative z-10">
<span className="truncate text-forge-white">EPOCH 841</span>
<span className="opacity-40 text-forge-dim">//</span>
<span className="text-primary font-mono">LATENCY 14ms</span>
<span className="opacity-40 text-forge-dim">//</span>
<span className="truncate font-semibold text-human-400">VAULT999 WITNESS</span>
</div>
</section>

<section className="flex flex-col w-full gap-space-md">
<div className="flex flex-col gap-1">
<div className="inline-flex items-center gap-2">
<span className="w-2 h-2 rounded-canon bg-primary shadow-[0_0_8px_#5f8fb3]"></span>
<span className="font-mono text-label-sm tracking-widest text-primary uppercase font-mono font-medium">Portal Kedaulatan</span>
</div>
<h1 className="font-display-mobile text-headline-lg-mobile text-white italic font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-forge-white to-forge-white">
        “Ditempa Bukan Diberi”
      </h1>
<p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
        A sovereign human architecture navigating synthetic intelligence, subsurface earth telemetry, and civic truth.
      </p>
</div>

<div className="bg-gradient-to-br from-[#111318] to-[#151d2c] border border-sky-900/40 rounded-canon p-space-md flex items-center justify-between gap-space-sm shadow-xl relative overflow-hidden">
<div className="flex items-center gap-space-sm z-10 min-w-0">
<div className="relative shrink-0 w-16 h-16 rounded-canon overflow-hidden ring-2 ring-primary/40 shadow-[0_0_16px_rgba(56,189,248,0.25)] bg-[#0a0c10]">
<img alt="Editorial studio portrait of Arif Fazil" className="w-full h-full object-cover filter contrast-105 brightness-95" src="/images/portal-portrait.jpg" />
<div className="absolute inset-0 ring-1 ring-inset ring-human-400/30 rounded-canon pointer-events-none"></div>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-1.5">
<span className="font-display text-headline-sm text-white font-semibold truncate leading-tight">Arif Fazil</span>
<span className="mi-glyph text-[16px] text-primary">✓</span>
</div>
<p className="font-mono text-label-sm text-forge-white truncate mt-0.5">Architect of arifOS &amp; GEOX Fellow</p>
<div className="inline-flex items-center gap-1 mt-1">
<span className="w-1.5 h-1.5 rounded-canon bg-human-400 shadow-[0_0_6px_#d9a62e]"></span>
<span className="font-mono text-label-sm text-human-400 font-semibold tracking-wider uppercase font-mono">HUMAN NODE PRIME</span>
</div>
</div>
</div>

<svg className="absolute -right-4 -bottom-4 w-32 h-32 opacity-25 text-primary pointer-events-none torus-glow" fill="none" stroke="currentColor" viewBox="0 0 100 100">
<circle cx="50" cy="50" r="46" stroke="#5f8fb3" strokeDasharray="1 3" strokeWidth="0.75"></circle>
<ellipse cx="50" cy="50" rx="42" ry="20" stroke="#5f8fb3" strokeWidth="1.2" transform="rotate(-25 50 50)"></ellipse>
<ellipse cx="50" cy="50" rx="36" ry="14" stroke="#d9a62e" strokeDasharray="2 2" strokeWidth="1.2" transform="rotate(35 50 50)"></ellipse>
<ellipse cx="50" cy="50" rx="28" ry="8" stroke="#c24a3d" strokeWidth="1" transform="rotate(75 50 50)"></ellipse>
<circle cx="50" cy="50" r="10" stroke="#5f8fb3" strokeWidth="1.5"></circle>
<circle cx="50" cy="50" fill="#5f8fb3" opacity="0.6" r="4"></circle>
</svg>
</div>

<div className="grid grid-cols-2 gap-space-sm pt-1">
<button className="bg-[#d9a62e] text-[#0a0c10] rounded-canon py-2.5 px-3 flex items-center justify-center gap-1.5 font-mono text-label-md font-bold shadow-[0_0_16px_rgba(245,158,11,0.3)] hover:bg-[#e8c468] active:scale-[0.98] transition-all">
<span className="mi-glyph text-[16px]">◆</span>
<span className="truncate tracking-wide uppercase">Enter Federation</span>
</button>
<button className="bg-[#182030] text-forge-white border border-forge-iron/80 hover:border-primary/50 hover:text-primary rounded-canon py-2.5 px-3 flex items-center justify-center gap-1.5 font-mono text-label-md font-medium active:scale-[0.98] transition-all shadow-md">
<span className="mi-glyph text-[16px] text-primary">✎</span>
<span className="truncate">Read Manifesto</span>
</button>
</div>
</section>

<section className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between px-1">
<span className="font-mono text-label-sm text-forge-dim uppercase tracking-wider font-semibold">Instrumental Vitality</span>
<span className="font-mono text-label-sm text-telemetry-400 flex items-center gap-1 font-mono">
<span className="w-1.5 h-1.5 rounded-canon bg-telemetry-400 animate-pulse shadow-[0_0_6px_#31c48d]"></span> REAL-TIME
      </span>
</div>
<div className="grid grid-cols-3 gap-space-xs">

<div className="bg-[#111318] border border-human-500/25 p-space-sm rounded-canon flex flex-col justify-between shadow-md min-w-0 relative overflow-hidden">
<div className="absolute top-0 right-0 w-8 h-8 bg-human-500/10 rounded-bl-full pointer-events-none"></div>
<span className="font-mono text-label-sm text-forge-dim truncate">Flow Quotient</span>
<div className="my-1 flex items-baseline gap-1">
<span className="font-metric-display text-[1.4rem] leading-none text-human-300 font-semibold font-mono">1.26</span>
</div>
<div className="inline-flex items-center gap-1 text-human-400">
<span className="mi-glyph text-[13px]">◗</span>
<span className="font-mono text-label-sm font-semibold truncate tracking-tight">FLOWING</span>
</div>
</div>

<div className="bg-[#111318] border border-sovereign-500/30 p-space-sm rounded-canon flex flex-col justify-between shadow-md min-w-0 relative overflow-hidden">
<div className="absolute top-0 right-0 w-8 h-8 bg-sovereign-500/10 rounded-bl-full pointer-events-none"></div>
<span className="font-mono text-label-sm text-forge-dim truncate">Floors Pass</span>
<div className="my-1 flex items-baseline gap-1">
<span className="font-metric-display text-[1.4rem] leading-none text-white font-semibold font-mono">12<span className="text-label-sm font-normal text-forge-dim">/13</span></span>
</div>
<div className="inline-flex items-center gap-1 text-sovereign-400">
<span className="w-1.5 h-1.5 rounded-canon bg-sovereign-500 animate-pulse shadow-[0_0_6px_#c24a3d]"></span>
<span className="font-mono text-label-sm font-semibold truncate tracking-tight text-sovereign-400">F13 ARMED</span>
</div>
</div>

<div className="bg-[#111318] border border-sky-500/30 p-space-sm rounded-canon flex flex-col justify-between shadow-md min-w-0 relative overflow-hidden">
<div className="absolute top-0 right-0 w-8 h-8 bg-sky-500/10 rounded-bl-full pointer-events-none"></div>
<span className="font-mono text-label-sm text-forge-dim truncate">VAULT999</span>
<div className="my-1 flex items-baseline truncate">
<span className="font-mono text-label-sm text-primary font-mono font-semibold truncate">#0x8F9A...C4</span>
</div>
<div className="inline-flex items-center gap-1 text-primary">
<span className="mi-glyph text-[13px]">⛨</span>
<span className="font-mono text-label-sm font-semibold truncate tracking-tight">WITNESSED</span>
</div>
</div>
</div>
</section>

<section className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between px-1">
<span className="font-mono text-label-sm text-forge-dim uppercase tracking-wider font-semibold">Federated Domains</span>
<span className="font-mono text-label-sm text-primary font-mono font-medium">4 NODES ENGAGED</span>
</div>

<div className="bg-[#141A1E] border border-human-500/30 text-forge-white rounded-canon p-space-md flex flex-col gap-space-xs shadow-lg relative overflow-hidden transition-all duration-200 hover:border-human-400 active:scale-[0.99] cursor-pointer group">
<div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-human-500/10 to-transparent pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-canon bg-human-500/15 border border-human-500/30 text-human-300">
<span className="w-1.5 h-1.5 rounded-canon bg-human-400 shadow-[0_0_6px_#d9a62e]"></span>
<span className="font-mono text-label-sm font-semibold uppercase tracking-wider">HUMAN / INVESTIGATIVE</span>
</div>
<span className="font-mono text-label-sm text-human-400/80 font-mono">ARC-MY-01</span>
</div>
<div className="mt-1 relative z-10">
<h3 className="font-display text-headline-sm font-semibold text-white flex items-center justify-between group-hover:text-human-300 transition-colors">
          MakcikGPT Civic Archive
          <span className="mi-glyph text-[20px] text-human-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
</h3>
<p className="font-body text-body-sm text-forge-white mt-1 leading-relaxed">
          Democratized public policy audit and civic discourse analysis under Malaysian jurisdictional context.
        </p>
</div>
<div className="pt-2 flex items-center gap-space-md text-forge-dim font-mono text-label-sm relative z-10">
<span className="flex items-center gap-1"><span className="mi-glyph text-[14px] text-human-400">⚖</span> Sovereign Auditor</span>
<span className="flex items-center gap-1"><span className="mi-glyph text-[14px] text-human-400">▤</span> 2,410 Treatises</span>
</div>
</div>

<div className="bg-[#0E1A1A] border border-sky-500/30 text-forge-white rounded-canon p-space-md flex flex-col gap-space-xs shadow-lg relative overflow-hidden transition-all duration-200 hover:border-sky-400 active:scale-[0.99] cursor-pointer group">
<div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-sky-500/10 to-transparent pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-canon bg-sky-500/15 border border-sky-500/30 text-sky-300">
<span className="w-1.5 h-1.5 rounded-canon bg-sky-400 shadow-[0_0_6px_#22d3ee]"></span>
<span className="font-mono text-label-sm font-semibold uppercase tracking-wider">EARTH / SEISMIC</span>
</div>
<span className="font-mono text-label-sm text-sky-400/80 font-mono">BASIN-5°N</span>
</div>
<div className="mt-1 relative z-10">
<h3 className="font-display text-headline-sm font-semibold text-white flex items-center justify-between group-hover:text-sky-300 transition-colors">
          GEOX Subsurface Exploration
          <span className="mi-glyph text-[20px] text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
</h3>
<p className="font-body text-body-sm text-forge-white mt-1 leading-relaxed">
          Subsurface seismic inversion, Malay Basin rift faults, and stratigraphic reservoir characterization.
        </p>
</div>
<div className="pt-2 flex items-center gap-space-md text-forge-dim font-mono text-label-sm relative z-10">
<span className="flex items-center gap-1"><span className="mi-glyph text-[14px] text-sky-400">≡</span> Malay Rift Model</span>
<span className="flex items-center gap-1"><span className="mi-glyph text-[14px] text-sky-400">◉</span> 4,800m Stratum</span>
</div>
</div>

<div className="bg-[#101828] border border-sky-500/35 text-forge-white rounded-canon p-space-md flex flex-col gap-space-xs shadow-lg relative overflow-hidden transition-all duration-200 hover:border-primary active:scale-[0.99] cursor-pointer group">
<div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-canon bg-primary/15 border border-primary/30 text-primary">
<span className="w-1.5 h-1.5 rounded-canon bg-primary shadow-[0_0_6px_#5f8fb3]"></span>
<span className="font-mono text-label-sm font-semibold uppercase tracking-wider">INSTITUTION / GOVERNANCE</span>
</div>
<span className="font-mono text-label-sm text-primary/80 font-mono">CON-13F</span>
</div>
<div className="mt-1 relative z-10">
<h3 className="font-display text-headline-sm font-semibold text-white flex items-center justify-between group-hover:text-primary transition-colors">
          arifOS Observatory
          <span className="mi-glyph text-[20px] text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
</h3>
<p className="font-body text-body-sm text-forge-white mt-1 leading-relaxed">
          13 Constitutional Floors matrix, federated AI node telemetry, and sovereign verification gates.
        </p>
</div>
<div className="pt-2 flex items-center gap-space-md text-forge-dim font-mono text-label-sm relative z-10">
<span className="flex items-center gap-1"><span className="mi-glyph text-[14px] text-primary">⛨</span> Gatekeeper Active</span>
<span className="flex items-center gap-1"><span className="mi-glyph text-[14px] text-primary">⁂</span> 8 Federated Nodes</span>
</div>
</div>

<div className="bg-[#14171E] border border-forge-iron/60 text-forge-white rounded-canon p-space-md flex flex-col gap-space-xs shadow-lg relative overflow-hidden transition-all duration-200 hover:border-forge-iron active:scale-[0.99] cursor-pointer group">
<div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-forge-dim/10 to-transparent pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-canon bg-surface-container/80 border border-forge-iron/50 text-forge-white">
<span className="w-1.5 h-1.5 rounded-canon bg-forge-dim"></span>
<span className="font-mono text-label-sm font-semibold uppercase tracking-wider">ARCHIVAL / THESIS</span>
</div>
<span className="font-mono text-label-sm text-forge-dim font-mono">VOL-XXIV</span>
</div>
<div className="mt-1 relative z-10">
<h3 className="font-display text-headline-sm font-semibold text-white flex items-center justify-between group-hover:text-forge-white transition-colors">
          Personal Essays &amp; Biography
          <span className="mi-glyph text-[20px] text-forge-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
</h3>
<p className="font-body text-body-sm text-forge-white mt-1 leading-relaxed">
          Reflections on technological sovereignty, cybernetic autonomy, and the craft of enduring systems.
        </p>
</div>
<div className="pt-2 flex items-center gap-space-md text-forge-dim font-mono text-label-sm relative z-10">
<span className="flex items-center gap-1"><span className="mi-glyph text-[14px] text-forge-dim">▤</span> Scholarly Tracts</span>
<span className="flex items-center gap-1"><span className="mi-glyph text-[14px] text-forge-dim">↺</span> 2012–Present</span>
</div>
</div>
</section>

<section className="w-full bg-[#181116] border border-sovereign-500/30 rounded-canon p-space-md flex items-center gap-space-sm shadow-xl relative overflow-hidden">
<div className="absolute -right-6 -bottom-6 w-24 h-24 bg-sovereign-600/10 rounded-canon blur-xl pointer-events-none"></div>
<div className="shrink-0 w-11 h-11 rounded-canon bg-sovereign-950/70 border border-sovereign-500/40 text-sovereign-400 flex items-center justify-center p-1 shadow-[0_0_12px_rgba(239,68,68,0.25)]">

<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="46" stroke="currentColor" strokeDasharray="4 2" strokeWidth="3"></circle>
<circle cx="50" cy="50" fill="none" r="38" stroke="currentColor" strokeWidth="1.5"></circle>
<path d="M50 22 L58 38 L76 41 L63 53 L66 71 L50 63 L34 71 L37 53 L24 41 L42 38 Z" fill="currentColor" opacity="0.9"></path>
</svg>
</div>
<div className="flex flex-col min-w-0 relative z-10">
<div className="flex items-center gap-1 text-sovereign-400 font-mono text-label-sm font-semibold uppercase tracking-wider font-mono">
<span className="mi-glyph text-[14px]">✓</span>
<span>Immutable Seal: SHA-256 Verified</span>
</div>
<p className="font-mono text-label-sm text-forge-white mt-0.5 leading-snug">
        No synthetic consensus shall override constitutional human veto.
      </p>
</div>
</section>
</div></main>
      </div>
    </LayoutGrid>
  );
};

export default PortalKedaulatan;
