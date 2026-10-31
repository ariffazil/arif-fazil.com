import React from 'react';
import { LayoutGrid } from './LayoutGrid';

export interface GeoxCockpitProps {
  className?: string;
}

/**
 * Screen 03 — GEOX Subsurface Cockpit (/earth/#deeptime Basin & Well Log Console)
 * Source Wireframe: geox-subsurface-cockpit-dark-mode.html
 * Design System Asset: assets/53930e338fa249e8bec7808f181df468
 */
export const GeoxCockpit: React.FC<GeoxCockpitProps> = ({ className = '' }) => {
  return (
    <LayoutGrid territory="GEOX">
      <div className={`rounded-none ${className}`.trim()}>
        <main className="flex flex-col relative w-full pt-20 pb-24 bg-background min-h-screen"><div className="flex flex-col w-full px-margin-mobile pb-space-lg gap-space-md">

<div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-none border border-sky-900/40 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-sky-400/90 font-mono tracking-widest uppercase">GEOX SUBSURFACE TELEMETRY // SEISMIC v4.2</span>
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-emerald-950/80 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
<span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-ping"></span>
<span className="font-label-sm text-label-sm text-emerald-300 font-bold tracking-wide">SEISMIC INVERSION ONLINE</span>
</div>
</div>
<div className="flex flex-col mt-0.5">
<h2 className="font-headline-sm text-headline-sm text-slate-100">Malay Basin Subsurface Cockpit</h2>
<div className="flex items-center gap-1.5 text-sky-400 mt-1 font-mono">
<span className="material-symbols-outlined text-[16px]">explore</span>
<span className="font-label-md text-label-md tracking-wide">PM307 Block // Depth: 3,420m TVDSS</span>
</div>
</div>
</div>

<div className="flex flex-col bg-surface-container-low rounded-none p-space-md gap-space-sm border border-outline-variant/30 shadow-[0_6px_28px_rgba(0,0,0,0.55)] relative overflow-hidden">
<div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sky-400 text-[18px]">layers</span>
<span className="font-label-sm text-label-sm font-semibold tracking-wider text-slate-200 uppercase">Sunda Shelf Tectonic &amp; Well Plane</span>
</div>
<span className="font-label-sm text-label-sm text-slate-400 font-mono">DATUM: WGS84 / UTM 48N</span>
</div>

<div className="relative w-full h-64 bg-[#0a0d14] rounded-none overflow-hidden flex items-center justify-center border border-sky-950/70 shadow-inner">

<svg className="w-full h-full object-cover" fill="none" viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient cx="50%" cy="45%" id="troughGlow" r="60%">
<stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22"></stop>
<stop offset="60%" stopColor="#0284c7" stopOpacity="0.08"></stop>
<stop offset="100%" stopColor="#080a0e" stopOpacity="0"></stop>
</radialGradient>
<pattern height="20" id="gridPattern" patternUnits="userSpaceOnUse" width="20">
<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeOpacity="0.14" strokeWidth="0.5"></path>
</pattern>
</defs>

<rect fill="url(#gridPattern)" height="220" width="360"></rect>
<rect fill="url(#troughGlow)" height="220" width="360"></rect>

<path d="M 40,30 Q 120,40 180,90 T 320,180" opacity="0.55" stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1"></path>
<path d="M 50,15 C 130,55 190,110 300,195" stroke="#0284c7" strokeOpacity="0.75" strokeWidth="1.3"></path>
<path d="M 70,10 C 145,70 200,135 280,210" stroke="#38bdf8" strokeOpacity="0.85" strokeWidth="1.8"></path>

<g filter="drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))" stroke="#ef4444" strokeWidth="1.6">

<path d="M 110,60 Q 170,75 230,120"></path>
<line x1="130" x2="134" y1="65" y2="71"></line>
<line x1="160" x2="164" y1="73" y2="79"></line>
<line x1="190" x2="194" y1="89" y2="96"></line>
<line x1="215" x2="219" y1="108" y2="115"></line>

<path d="M 70,110 Q 130,135 190,165" strokeDasharray="4 2"></path>
<line x1="95" x2="98" y1="120" y2="126"></line>
<line x1="135" x2="138" y1="138" y2="144"></line>
<line x1="165" x2="168" y1="152" y2="159"></line>
</g>

<text fill="#64748b" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600" letterSpacing="1" x="50" y="45">TENGGOL ARCH</text>
<text fill="#38bdf8" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" letterSpacing="1.5" x="175" y="55">MALAY BASIN GRABEN</text>
<text fill="#64748b" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600" letterSpacing="1" x="210" y="195">PENYU BASIN</text>

<rect fill="#38bdf8" fillOpacity="0.12" height="65" rx="4" stroke="#38bdf8" strokeDasharray="2 2" strokeWidth="1.2" width="105" x="135" y="85"></rect>
<text fill="#7dd3fc" fontFamily="JetBrains Mono" fontSize="6.5" fontWeight="700" x="140" y="96">BLOCK PM307 INVERSION</text>

<g className="cursor-pointer group" id="well-melor">
<circle cx="160" cy="115" fill="#38bdf8" r="4.5"></circle>
<circle className="animate-ping" cx="160" cy="115" opacity="0.8" r="8" stroke="#38bdf8" strokeWidth="1.2" style={{ transformOrigin: '160px 115px' }}></circle>
<text fill="#e2e8f0" fontFamily="JetBrains Mono" fontSize="7.5" fontWeight="bold" x="120" y="128">Melor-1 [OIL]</text>
</g>

<g className="cursor-pointer" id="well-cempaka">
<circle cx="205" cy="130" fill="#f59e0b" filter="drop-shadow(0 0 6px #f59e0b)" r="5.5"></circle>
<circle cx="205" cy="130" opacity="0.9" r="11" stroke="#fbbf24" strokeWidth="1.4"></circle>
<polygon fill="#fef08a" points="205,123 209,130 205,137 201,130"></polygon>
<text fill="#fbbf24" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" x="175" y="148">Cempaka Deep ★</text>
</g>

<g className="cursor-pointer" id="well-teratai">
<circle cx="185" cy="100" fill="#64748b" r="3.5"></circle>
<text fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="7" x="188" y="98">Teratai-3 (Dry)</text>
</g>
</svg>

<div className="absolute bottom-2 left-2 bg-[#0c1018]/90 backdrop-blur-md px-2.5 py-1 rounded border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-2">
<span className="w-2 h-2 rounded-none bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse"></span>
<span className="font-label-sm text-label-sm text-amber-200 font-semibold">Target Trap: Zone C Sandstone</span>
</div>
<div className="absolute top-2 right-2 bg-[#0c1018]/90 backdrop-blur-md border border-sky-400/40 px-2 py-1 rounded shadow-sm">
<span className="font-label-sm text-label-sm text-sky-300 font-mono font-bold">SEIS DENSITY: 124 TR/KM</span>
</div>
</div>

<div className="grid grid-cols-3 gap-space-xs text-center pt-1">
<div className="bg-surface-container p-space-xs rounded-none border border-outline-variant/30 flex flex-col">
<span className="font-label-sm text-label-sm text-slate-400 font-mono">WELL SURFACE</span>
<span className="font-label-md text-label-md text-slate-100 font-semibold font-mono">05° 28' 14" N</span>
</div>
<div className="bg-surface-container p-space-xs rounded-none border border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.15)] flex flex-col">
<span className="font-label-sm text-label-sm text-sky-300 font-mono">RHO-B INVERSION</span>
<span className="font-label-md text-label-md text-sky-400 font-bold font-mono">2.34 g/cm³</span>
</div>
<div className="bg-surface-container p-space-xs rounded-none border border-outline-variant/30 flex flex-col">
<span className="font-label-sm text-label-sm text-slate-400 font-mono">WATER DEPTH</span>
<span className="font-label-md text-label-md text-slate-100 font-semibold font-mono">74.2 m</span>
</div>
</div>
</div>

<div className="flex flex-col bg-surface-container-low rounded-none p-space-md gap-space-sm border border-outline-variant/30 shadow-[0_6px_28px_rgba(0,0,0,0.55)]">
<div className="flex items-center justify-between">
<div>
<span className="font-label-sm text-label-sm text-sky-400 uppercase tracking-wider font-mono font-semibold">COMPOSITE LOG // CEMPAKA DEEP-1</span>
<h3 className="font-headline-sm text-headline-sm text-slate-100">Petrophysical Triple Combo</h3>
</div>
<div className="px-2.5 py-1 bg-surface-container-highest border border-sky-400/30 rounded text-right shadow-[0_0_8px_rgba(56,189,248,0.15)]">
<span className="font-label-sm text-label-sm text-sky-300 font-mono font-bold">3,380m - 3,440m</span>
</div>
</div>

<div className="bg-[#07090f] rounded-none p-2 overflow-hidden border border-outline-variant/40 shadow-inner flex flex-col">

<div className="grid grid-cols-7 text-center font-label-sm text-label-sm pb-1 mb-1 border-b border-outline-variant/40">
<div className="col-span-2 text-emerald-400 font-bold">
<div>TRACK 1: GR</div>
<div className="text-[9px] text-emerald-300/70 font-mono">0 - 150 GAPI</div>
</div>
<div className="col-span-1 text-slate-300 font-bold font-mono">
<div>DEPTH</div>
<div className="text-[9px] text-slate-400 font-mono">m TVDSS</div>
</div>
<div className="col-span-2 text-amber-400 font-bold">
<div>TRACK 2: RES</div>
<div className="text-[9px] text-amber-300/70 font-mono">0.2 - 2000 Ω·m</div>
</div>
<div className="col-span-2 text-sky-400 font-bold">
<div>TRACK 3: DT / NPHI</div>
<div className="text-[9px] text-sky-300/70 font-mono">140 - 40 μs/ft</div>
</div>
</div>

<div className="relative w-full h-80">
<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 350 320" xmlns="http://www.w3.org/2000/svg">

<defs>
<pattern height="8" id="shaleHatch" patternTransform="rotate(45)" patternUnits="userSpaceOnUse" width="8">
<line opacity="0.4" stroke="#10b981" strokeWidth="0.8" x1="0" x2="0" y1="0" y2="8"></line>
</pattern>
<linearGradient id="payZoneShading" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"></stop>
<stop offset="50%" stopColor="#fbbf24" stopOpacity="0.38"></stop>
<stop offset="100%" stopColor="#f59e0b" stopOpacity="0.25"></stop>
</linearGradient>
</defs>


<line stroke="#1e293b" strokeWidth="1.2" x1="100" x2="100" y1="0" y2="320"></line>

<line stroke="#1e293b" strokeWidth="1.2" x1="150" x2="150" y1="0" y2="320"></line>

<line stroke="#1e293b" strokeWidth="1.2" x1="250" x2="250" y1="0" y2="320"></line>


<g stroke="#1e293b" strokeOpacity="0.8" strokeWidth="0.8">
<line x1="0" x2="350" y1="0" y2="0"></line>
<line x1="0" x2="350" y1="53" y2="53"></line>
<line x1="0" x2="350" y1="106" y2="106"></line>
<line x1="0" x2="350" y1="160" y2="160"></line>
<line x1="0" x2="350" y1="213" y2="213"></line>
<line x1="0" x2="350" y1="266" y2="266"></line>
<line x1="0" x2="350" y1="319" y2="319"></line>
</g>

<rect fill="url(#payZoneShading)" height="91" width="350" x="0" y="133"></rect>
<rect fill="#f59e0b" fillOpacity="0.3" height="91" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="0.8" width="50" x="100" y="133"></rect>

<g fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="8.5" textAnchor="middle">
<text x="125" y="10">3,380</text>
<text x="125" y="60">3,390</text>
<text x="125" y="110">3,400</text>

<text fill="#fef08a" fontWeight="bold" x="125" y="155">3,408</text>
<text fill="#fef08a" fontWeight="bold" x="125" y="185">3,415</text>
<text fill="#fef08a" fontWeight="bold" x="125" y="215">3,422</text>
<text x="125" y="270">3,430</text>
<text x="125" y="315">3,440</text>
</g>

<rect fill="#78350f" height="13" rx="2" stroke="#f59e0b" strokeWidth="0.7" width="44" x="103" y="165"></rect>
<text fill="#fef08a" fontFamily="JetBrains Mono" fontSize="6.5" fontWeight="bold" textAnchor="middle" x="125" y="174">PAY: ZONE C</text>


<line stroke="#475569" strokeDasharray="2 2" strokeWidth="0.7" x1="50" x2="50" y1="0" y2="320"></line>

<path d="M 50,0 
                   L 78,20 L 72,50 L 85,90 L 68,130 
                   L 22,145 L 18,170 L 15,190 L 25,220 
                   L 75,240 L 88,280 L 82,320 
                   L 50,320 Z" fill="url(#shaleHatch)"></path>

<path d="M 75,0 
                   C 82,15 70,35 78,50 
                   C 85,65 92,80 85,95 
                   C 78,110 70,125 65,133
                   C 30,140 22,155 18,170 
                   C 14,185 20,205 25,224 
                   C 60,232 75,250 82,275 
                   C 90,295 80,310 82,320" fill="none" filter="drop-shadow(0 0 3px rgba(16,185,129,0.7))" stroke="#10b981" strokeLinecap="round" strokeWidth="2"></path>

<path d="M 162,0 
                   C 165,20 160,50 164,80 
                   C 168,105 163,125 170,133 
                   C 210,142 242,160 240,175 
                   C 238,190 230,210 225,224 
                   C 180,235 168,255 165,280 
                   C 162,298 166,310 163,320" fill="none" filter="drop-shadow(0 0 4px rgba(245,158,11,0.8))" stroke="#f59e0b" strokeLinecap="round" strokeWidth="2.2"></path>

<path d="M 280,0 
                   C 275,25 285,55 278,85 
                   C 272,110 282,125 290,133 
                   C 325,150 338,175 330,195 
                   C 322,215 310,220 295,224 
                   C 280,240 275,270 282,290 
                   C 288,305 278,315 280,320" fill="none" filter="drop-shadow(0 0 3px rgba(56,189,248,0.7))" stroke="#38bdf8" strokeDasharray="3 1" strokeWidth="2"></path>
</svg>
</div>

<div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-2 border-t border-outline-variant/30">
<span className="text-amber-300 font-semibold">ZONE C NET PAY: 17.0m</span>
<span className="text-sky-300 font-semibold">AVG PHIE: 24.2%</span>
<span className="text-slate-300 font-semibold">SW (WATER SAT): 18.5%</span>
</div>
</div>
</div>

<div className="flex flex-col bg-surface-container-low text-on-surface rounded-none p-space-md gap-space-sm border border-emerald-600/40 shadow-[0_6px_28px_rgba(0,0,0,0.55)]">
<div className="flex items-start justify-between">
<div className="flex flex-col">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-none bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
<span className="font-label-sm text-label-sm text-emerald-400 font-bold tracking-wider uppercase font-mono">DRILLABLE PROSPECT EVALUATION</span>
</div>
<h4 className="font-headline-sm text-headline-sm font-semibold text-slate-100 mt-0.5">Bunga Raya Deep Stratigraphic Trap</h4>
</div>
<div className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-emerald-300 font-label-sm text-label-sm font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)] font-mono">
        TIER-1
      </div>
</div>

<div className="flex flex-wrap items-center gap-space-xs text-xs font-mono">
<div className="px-2.5 py-1 rounded bg-[#0a151b] border border-sky-400/40 text-sky-300 font-semibold shadow-sm">
        TYPE: Light Crude / Condensate (42° API)
      </div>
<div className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-slate-200">
        DRIVE: Strong Water Drive + Gas Cap
      </div>
</div>

<div className="flex flex-col gap-1.5 pt-1">
<span className="font-label-sm text-label-sm font-bold tracking-wider text-sky-400 uppercase font-mono">Volumetric Recoverable Reserves (MMboe)</span>
<div className="grid grid-cols-3 gap-2">

<div className="bg-surface-container p-2 rounded-none flex flex-col items-center border border-outline-variant/30">
<span className="font-label-sm text-label-sm text-slate-400 font-mono">P90 (LOW)</span>
<span className="font-headline-sm text-headline-sm font-bold text-slate-100 font-mono">18.4</span>
<span className="text-[9px] text-slate-400 font-mono">MMboe</span>
</div>

<div className="bg-gradient-to-b from-[#78350f] to-[#451a03] border-2 border-amber-400 text-amber-100 p-2 rounded-none flex flex-col items-center shadow-[0_0_16px_rgba(245,158,11,0.35)] relative overflow-hidden">
<div className="absolute -top-1 -right-4 bg-amber-400 text-stone-950 text-[8px] font-mono px-3 py-0.5 transform rotate-12 uppercase font-extrabold tracking-wider shadow">MODE</div>
<span className="font-label-sm text-label-sm text-amber-200 font-mono font-bold">P50 (BEST)</span>
<span className="font-headline-sm text-headline-sm font-extrabold text-amber-300 font-mono drop-shadow">46.2</span>
<span className="text-[9px] text-amber-200 font-mono">MMboe</span>
</div>

<div className="bg-surface-container p-2 rounded-none flex flex-col items-center border border-outline-variant/30">
<span className="font-label-sm text-label-sm text-slate-400 font-mono">P10 (HIGH)</span>
<span className="font-headline-sm text-headline-sm font-bold text-slate-100 font-mono">94.8</span>
<span className="text-[9px] text-slate-400 font-mono">MMboe</span>
</div>
</div>
</div>

<div className="flex flex-col gap-1.5 pt-1 bg-surface-container/70 border border-outline-variant/30 p-2.5 rounded-none">
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm font-bold text-slate-200 uppercase font-mono">Geological Chance of Success (GCoS)</span>
<span className="font-label-md text-label-md font-bold text-emerald-400 font-mono">38.6%</span>
</div>

<div className="w-full bg-[#0a0d14] border border-outline-variant/30 h-2.5 rounded-none overflow-hidden flex">
<div className="bg-gradient-to-r from-emerald-500 to-sky-400 h-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '38.6%' }}></div>
</div>
<div className="grid grid-cols-3 text-[10px] font-mono text-slate-400 text-center pt-0.5">
<div>Reservoir: <strong className="text-sky-300">0.85</strong></div>
<div>Seal Integrity: <strong className="text-sky-300">0.70</strong></div>
<div>Trap Closure: <strong className="text-sky-300">0.65</strong></div>
</div>
</div>
</div>

<div className="flex flex-col gap-space-xs pt-1">
<div className="grid grid-cols-2 gap-space-sm">

<button className="h-11 px-3 bg-surface-container border border-outline-variant/50 hover:bg-surface-container-high hover:border-sky-400/50 active:bg-surface-container-highest text-slate-200 rounded-none flex items-center justify-center gap-2 transition-all shadow-sm" id="btn-export-las">
<span className="material-symbols-outlined text-[18px] text-sky-400">download</span>
<span className="font-label-md text-label-md tracking-wider uppercase font-semibold font-mono">Export LAS 2.0</span>
</button>

<button className="h-11 px-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:from-red-700 active:to-rose-800 text-white border border-red-400/60 rounded-none flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(239,68,68,0.4)] transition-all" id="btn-run-inversion">
<span className="material-symbols-outlined text-[18px]">neurology</span>
<span className="font-label-md text-label-md tracking-wider uppercase font-bold font-mono">Run ML Inversion</span>
</button>
</div>

<div className="flex items-center justify-between p-space-sm bg-surface-container-low border border-red-500/30 rounded-none">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded-none bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.3)]">
<span className="material-symbols-outlined text-[18px]">verified_user</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-bold text-slate-100 font-mono">VAULT999 GEOLOGICAL SEAL</span>
<span className="text-[10px] text-slate-400 font-mono">SHA256: e82f...a109 // UNMUTABLE ATT</span>
</div>
</div>
<button className="h-8 px-3 bg-surface-container-highest border border-outline-variant/40 hover:bg-surface-variant hover:border-red-400/50 text-slate-200 font-label-sm text-label-sm rounded-none uppercase font-mono font-semibold" id="btn-inspect-hash">
        Inspect
      </button>
</div>
</div>
</div>
</main>
      </div>
    </LayoutGrid>
  );
};

export default GeoxCockpit;
