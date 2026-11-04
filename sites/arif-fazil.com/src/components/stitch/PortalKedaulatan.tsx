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
      <div className={`rounded-none ${className}`.trim()}>
        <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface min-h-screen"><div className="flex flex-col w-full px-margin-mobile pb-space-lg gap-space-lg">

<section className="w-full bg-[#111722] border border-slate-800/90 rounded-none p-space-sm flex flex-col gap-space-xs shadow-lg relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-amber-500/5 pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
<span className="w-2 h-2 rounded-none bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
<span className="font-label-sm text-label-sm tracking-wider font-semibold">SUBSTRATE HEALTHY</span>
</div>
<span className="font-label-sm text-label-sm text-primary/80 font-mono tracking-wider uppercase">SYNTH-NET v4.9</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-1 pt-1 relative z-10">
<span className="truncate text-slate-300">EPOCH 841</span>
<span className="opacity-40 text-slate-600">//</span>
<span className="text-primary font-mono">LATENCY 14ms</span>
<span className="opacity-40 text-slate-600">//</span>
<span className="truncate font-semibold text-amber-400">VAULT999 WITNESS</span>
</div>
</section>

<section className="flex flex-col w-full gap-space-md">
<div className="flex flex-col gap-1">
<div className="inline-flex items-center gap-2">
<span className="w-2 h-2 rounded-none bg-primary shadow-[0_0_8px_#38bdf8]"></span>
<span className="font-label-sm text-label-sm tracking-widest text-primary uppercase font-mono font-medium">Portal Kedaulatan</span>
</div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-white italic font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
        “Ditempa Bukan Diberi”
      </h1>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        A sovereign human architecture navigating synthetic intelligence, subsurface earth telemetry, and civic truth.
      </p>
</div>

<div className="bg-gradient-to-br from-[#111722] to-[#151d2c] border border-blue-900/40 rounded-none p-space-md flex items-center justify-between gap-space-sm shadow-xl relative overflow-hidden">
<div className="flex items-center gap-space-sm z-10 min-w-0">
<div className="relative shrink-0 w-16 h-16 rounded-none overflow-hidden ring-2 ring-primary/40 shadow-[0_0_16px_rgba(56,189,248,0.25)] bg-[#0c0e12]">
<img alt="Editorial studio portrait of Arif Fazil" className="w-full h-full object-cover filter contrast-105 brightness-95" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA11ZmrL7f_2aJjqpenSF01aTlk2Vd2djqbhUFYWS56iUZkYNde83v6mq8U41gHd1_0d0zwOh0LUYbQ7UybZ5mxsozS2skFPUm9I_2iMKEi-Lszc1baiSXhy-KZPFBjc9exUyAwGUedwzu5sqlJYT2qgMDu2RSKFcpZ67FJWe9ttfytTU83Ec37XHZ-Wqh9efJ_YmtD8hObRE45KY2tzmKHQIjOyY8WeTSTD5l0FKg" />
<div className="absolute inset-0 ring-1 ring-inset ring-amber-400/30 rounded-none pointer-events-none"></div>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-headline-sm text-white font-semibold truncate leading-tight">Arif Fazil</span>
<span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: '\'FILL\' 1' }}>verified</span>
</div>
<p className="font-label-sm text-label-sm text-slate-300 truncate mt-0.5">Architect of arifOS &amp; GEOX Fellow</p>
<div className="inline-flex items-center gap-1 mt-1">
<span className="w-1.5 h-1.5 rounded-none bg-amber-400 shadow-[0_0_6px_#f59e0b]"></span>
<span className="font-label-sm text-label-sm text-amber-400 font-semibold tracking-wider uppercase font-mono">HUMAN NODE PRIME</span>
</div>
</div>
</div>

<svg className="absolute -right-4 -bottom-4 w-32 h-32 opacity-25 text-primary pointer-events-none torus-glow" fill="none" stroke="currentColor" viewBox="0 0 100 100">
<circle cx="50" cy="50" r="46" stroke="#38bdf8" strokeDasharray="1 3" strokeWidth="0.75"></circle>
<ellipse cx="50" cy="50" rx="42" ry="20" stroke="#38bdf8" strokeWidth="1.2" transform="rotate(-25 50 50)"></ellipse>
<ellipse cx="50" cy="50" rx="36" ry="14" stroke="#f59e0b" strokeDasharray="2 2" strokeWidth="1.2" transform="rotate(35 50 50)"></ellipse>
<ellipse cx="50" cy="50" rx="28" ry="8" stroke="#ef4444" strokeWidth="1" transform="rotate(75 50 50)"></ellipse>
<circle cx="50" cy="50" r="10" stroke="#38bdf8" strokeWidth="1.5"></circle>
<circle cx="50" cy="50" fill="#38bdf8" opacity="0.6" r="4"></circle>
</svg>
</div>

<div className="grid grid-cols-2 gap-space-sm pt-1">
<button className="bg-[#F59E0B] text-[#0A0C10] rounded-none py-2.5 px-3 flex items-center justify-center gap-1.5 font-label-md text-label-md font-bold shadow-[0_0_16px_rgba(245,158,11,0.3)] hover:bg-[#FBBF24] active:scale-[0.98] transition-all">
<span className="material-symbols-outlined text-[16px]">token</span>
<span className="truncate tracking-wide uppercase">Enter Federation</span>
</button>
<button className="bg-[#182030] text-slate-200 border border-slate-700/80 hover:border-primary/50 hover:text-primary rounded-none py-2.5 px-3 flex items-center justify-center gap-1.5 font-label-md text-label-md font-medium active:scale-[0.98] transition-all shadow-md">
<span className="material-symbols-outlined text-[16px] text-primary">history_edu</span>
<span className="truncate">Read Manifesto</span>
</button>
</div>
</section>

<section className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between px-1">
<span className="font-label-sm text-label-sm text-slate-400 uppercase tracking-wider font-semibold">Instrumental Vitality</span>
<span className="font-label-sm text-label-sm text-emerald-400 flex items-center gap-1 font-mono">
<span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]"></span> REAL-TIME
      </span>
</div>
<div className="grid grid-cols-3 gap-space-xs">

<div className="bg-[#111722] border border-amber-500/25 p-space-sm rounded-none flex flex-col justify-between shadow-md min-w-0 relative overflow-hidden">
<div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>
<span className="font-label-sm text-label-sm text-slate-400 truncate">Flow Quotient</span>
<div className="my-1 flex items-baseline gap-1">
<span className="font-metric-display text-[1.4rem] leading-none text-amber-300 font-semibold font-mono">1.26</span>
</div>
<div className="inline-flex items-center gap-1 text-amber-400">
<span className="material-symbols-outlined text-[13px]">water_drop</span>
<span className="font-label-sm text-label-sm font-semibold truncate tracking-tight">FLOWING</span>
</div>
</div>

<div className="bg-[#111722] border border-red-500/30 p-space-sm rounded-none flex flex-col justify-between shadow-md min-w-0 relative overflow-hidden">
<div className="absolute top-0 right-0 w-8 h-8 bg-red-500/10 rounded-bl-full pointer-events-none"></div>
<span className="font-label-sm text-label-sm text-slate-400 truncate">Floors Pass</span>
<div className="my-1 flex items-baseline gap-1">
<span className="font-metric-display text-[1.4rem] leading-none text-white font-semibold font-mono">12<span className="text-label-sm font-normal text-slate-400">/13</span></span>
</div>
<div className="inline-flex items-center gap-1 text-red-400">
<span className="w-1.5 h-1.5 rounded-none bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]"></span>
<span className="font-label-sm text-label-sm font-semibold truncate tracking-tight text-red-400">F13 ARMED</span>
</div>
</div>

<div className="bg-[#111722] border border-blue-500/30 p-space-sm rounded-none flex flex-col justify-between shadow-md min-w-0 relative overflow-hidden">
<div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>
<span className="font-label-sm text-label-sm text-slate-400 truncate">VAULT999</span>
<div className="my-1 flex items-baseline truncate">
<span className="font-label-sm text-label-sm text-primary font-mono font-semibold truncate">#0x8F9A...C4</span>
</div>
<div className="inline-flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-[13px]">verified_user</span>
<span className="font-label-sm text-label-sm font-semibold truncate tracking-tight">WITNESSED</span>
</div>
</div>
</div>
</section>

<section className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between px-1">
<span className="font-label-sm text-label-sm text-slate-400 uppercase tracking-wider font-semibold">Federated Domains</span>
<span className="font-label-sm text-label-sm text-primary font-mono font-medium">4 NODES ENGAGED</span>
</div>

<div className="bg-[#141A1E] border border-amber-500/30 text-slate-100 rounded-none p-space-md flex flex-col gap-space-xs shadow-lg relative overflow-hidden transition-all duration-200 hover:border-amber-400 active:scale-[0.99] cursor-pointer group">
<div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-amber-500/15 border border-amber-500/30 text-amber-300">
<span className="w-1.5 h-1.5 rounded-none bg-amber-400 shadow-[0_0_6px_#f59e0b]"></span>
<span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">HUMAN / INVESTIGATIVE</span>
</div>
<span className="font-label-sm text-label-sm text-amber-400/80 font-mono">ARC-MY-01</span>
</div>
<div className="mt-1 relative z-10">
<h3 className="font-headline-sm text-headline-sm font-semibold text-white flex items-center justify-between group-hover:text-amber-300 transition-colors">
          MakcikGPT Civic Archive
          <span className="material-symbols-outlined text-[20px] text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">arrow_outward</span>
</h3>
<p className="font-body-sm text-body-sm text-slate-300 mt-1 leading-relaxed">
          Democratized public policy audit and civic discourse analysis under Malaysian jurisdictional context.
        </p>
</div>
<div className="pt-2 flex items-center gap-space-md text-slate-400 font-label-sm text-label-sm relative z-10">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-amber-400">balance</span> Sovereign Auditor</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-amber-400">folder_open</span> 2,410 Treatises</span>
</div>
</div>

<div className="bg-[#0E1A1A] border border-cyan-500/30 text-slate-100 rounded-none p-space-md flex flex-col gap-space-xs shadow-lg relative overflow-hidden transition-all duration-200 hover:border-cyan-400 active:scale-[0.99] cursor-pointer group">
<div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
<span className="w-1.5 h-1.5 rounded-none bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
<span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">EARTH / SEISMIC</span>
</div>
<span className="font-label-sm text-label-sm text-cyan-400/80 font-mono">BASIN-5°N</span>
</div>
<div className="mt-1 relative z-10">
<h3 className="font-headline-sm text-headline-sm font-semibold text-white flex items-center justify-between group-hover:text-cyan-300 transition-colors">
          GEOX Subsurface Exploration
          <span className="material-symbols-outlined text-[20px] text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">arrow_outward</span>
</h3>
<p className="font-body-sm text-body-sm text-slate-300 mt-1 leading-relaxed">
          Subsurface seismic inversion, Malay Basin rift faults, and stratigraphic reservoir characterization.
        </p>
</div>
<div className="pt-2 flex items-center gap-space-md text-slate-400 font-label-sm text-label-sm relative z-10">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-cyan-400">layers</span> Malay Rift Model</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-cyan-400">sensors</span> 4,800m Stratum</span>
</div>
</div>

<div className="bg-[#101828] border border-blue-500/35 text-slate-100 rounded-none p-space-md flex flex-col gap-space-xs shadow-lg relative overflow-hidden transition-all duration-200 hover:border-primary active:scale-[0.99] cursor-pointer group">
<div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-primary/15 border border-primary/30 text-primary">
<span className="w-1.5 h-1.5 rounded-none bg-primary shadow-[0_0_6px_#38bdf8]"></span>
<span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">INSTITUTION / GOVERNANCE</span>
</div>
<span className="font-label-sm text-label-sm text-primary/80 font-mono">CON-13F</span>
</div>
<div className="mt-1 relative z-10">
<h3 className="font-headline-sm text-headline-sm font-semibold text-white flex items-center justify-between group-hover:text-primary transition-colors">
          arifOS Observatory
          <span className="material-symbols-outlined text-[20px] text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">arrow_outward</span>
</h3>
<p className="font-body-sm text-body-sm text-slate-300 mt-1 leading-relaxed">
          13 Constitutional Floors matrix, federated AI node telemetry, and sovereign verification gates.
        </p>
</div>
<div className="pt-2 flex items-center gap-space-md text-slate-400 font-label-sm text-label-sm relative z-10">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-primary">shield</span> Gatekeeper Active</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-primary">device_hub</span> 8 Federated Nodes</span>
</div>
</div>

<div className="bg-[#14171E] border border-slate-700/60 text-slate-100 rounded-none p-space-md flex flex-col gap-space-xs shadow-lg relative overflow-hidden transition-all duration-200 hover:border-slate-500 active:scale-[0.99] cursor-pointer group">
<div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-slate-500/10 to-transparent pointer-events-none"></div>
<div className="flex items-center justify-between relative z-10">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-slate-800/80 border border-slate-600/50 text-slate-300">
<span className="w-1.5 h-1.5 rounded-none bg-slate-400"></span>
<span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">ARCHIVAL / THESIS</span>
</div>
<span className="font-label-sm text-label-sm text-slate-400 font-mono">VOL-XXIV</span>
</div>
<div className="mt-1 relative z-10">
<h3 className="font-headline-sm text-headline-sm font-semibold text-white flex items-center justify-between group-hover:text-slate-200 transition-colors">
          Personal Essays &amp; Biography
          <span className="material-symbols-outlined text-[20px] text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">arrow_outward</span>
</h3>
<p className="font-body-sm text-body-sm text-slate-300 mt-1 leading-relaxed">
          Reflections on technological sovereignty, cybernetic autonomy, and the craft of enduring systems.
        </p>
</div>
<div className="pt-2 flex items-center gap-space-md text-slate-400 font-label-sm text-label-sm relative z-10">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-slate-400">menu_book</span> Scholarly Tracts</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-slate-400">history</span> 2012–Present</span>
</div>
</div>
</section>

<section className="w-full bg-[#181116] border border-red-500/30 rounded-none p-space-md flex items-center gap-space-sm shadow-xl relative overflow-hidden">
<div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-600/10 rounded-none blur-xl pointer-events-none"></div>
<div className="shrink-0 w-11 h-11 rounded-none bg-red-950/70 border border-red-500/40 text-red-400 flex items-center justify-center p-1 shadow-[0_0_12px_rgba(239,68,68,0.25)]">

<svg className="w-9 h-9" fill="currentColor" viewBox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="46" stroke="currentColor" strokeDasharray="4 2" strokeWidth="3"></circle>
<circle cx="50" cy="50" fill="none" r="38" stroke="currentColor" strokeWidth="1.5"></circle>
<path d="M50 22 L58 38 L76 41 L63 53 L66 71 L50 63 L34 71 L37 53 L24 41 L42 38 Z" fill="currentColor" opacity="0.9"></path>
</svg>
</div>
<div className="flex flex-col min-w-0 relative z-10">
<div className="flex items-center gap-1 text-red-400 font-label-sm text-label-sm font-semibold uppercase tracking-wider font-mono">
<span className="material-symbols-outlined text-[14px]">verified</span>
<span>Immutable Seal: SHA-256 Verified</span>
</div>
<p className="font-label-sm text-label-sm text-slate-300 mt-0.5 leading-snug">
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
