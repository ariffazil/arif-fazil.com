import React from 'react';
import { LayoutGrid } from './LayoutGrid';

export interface MakcikGPTArchiveProps {
  className?: string;
}

/**
 * Screen 02 — MakcikGPT Civic Archive & Epistemic Evidence Drawer
 * Source Wireframe: makcikgpt-civic-archive-dark-mode.html
 * Design System Asset: assets/53930e338fa249e8bec7808f181df468
 */
export const MakcikGPTArchive: React.FC<MakcikGPTArchiveProps> = ({ className = '' }) => {
  return (
    <LayoutGrid territory="ARCHIVE">
      <div className={`rounded-none ${className}`.trim()}>
        <main className="flex flex-col relative w-full pt-20 pb-24 bg-[#090B10] min-h-screen"><div className="flex flex-col w-full px-margin-mobile pb-space-xl">

<header className="flex flex-col gap-space-xs mt-space-sm p-space-sm rounded-none bg-[#0F141F]/80 border border-slate-800/80 bg-grid-orthogonal relative overflow-hidden">
<div className="flex items-center justify-between text-slate-400">
<span className="font-telemetry-sm text-[10px] tracking-widest uppercase text-slate-400 font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-none bg-sky-400 animate-ping"></span>ARCHIVE // CIVIC INTELLIGENCE // DOSSIER #402</span>
<span className="font-telemetry-sm text-[10px] text-sky-400 font-bold tracking-wider">64% READ // 8 MIN REMAINING</span>
</div>
<div className="w-full bg-[#151C2B] h-1.5 rounded-none overflow-hidden border border-sky-950">
<div className="bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 h-full rounded-none transition-all duration-300 shadow-[0_0_8px_rgba(56,189,248,0.7)]" style={{ width: '64%' }}></div>
</div>
</header>

<section className="flex flex-col gap-space-sm mt-space-lg">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-sky-950/70 border border-sky-400/40 text-sky-300 w-max shadow-[0_0_10px_rgba(56,189,248,0.15)]">
<span className="w-1.5 h-1.5 rounded-none bg-sky-400 shadow-[0_0_6px_#38bdf8]"></span>
<span className="font-label-sm text-label-sm font-semibold tracking-wider">EPISTEMIC SCORE 98.4% CERTIFIED</span>
</div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-white tracking-tight leading-tight font-serif drop-shadow-sm">
      The Dissection of Subsidized Grain Procurement in Selangor (2021–2024)
    </h1>
<p className="font-body-md text-body-md text-slate-300 italic">
      A federated computational audit reveals supply chain friction and bureaucratic arbitrage.
    </p>
<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-space-xs font-telemetry-sm text-slate-400">
<span className="text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">Arif Fazil with MakcikGPT Node 07</span>
<span className="text-slate-600">•</span>
<span className="text-slate-300 font-mono">14 Oct 2024</span>
<span className="text-slate-600">•</span>
<span className="text-sky-300 font-medium tracking-wide">Hulu Langat Focus</span>
</div>
</section>

<nav aria-label="Sections" className="flex gap-2 overflow-x-auto no-scrollbar py-space-sm mt-space-md -mx-margin-mobile px-margin-mobile">
<button className="shrink-0 px-3.5 py-1.5 rounded-none bg-gradient-to-r from-sky-500 to-blue-600 text-white font-label-sm text-label-sm font-bold whitespace-nowrap shadow-[0_0_12px_rgba(56,189,248,0.35)] border border-sky-300/40">
      I. Executive Audit
    </button>
<button className="shrink-0 px-3.5 py-1.5 rounded-none bg-[#151C2B] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 font-label-sm text-label-sm whitespace-nowrap transition-colors">
      II. Discrepancy Matrix
    </button>
<button className="shrink-0 px-3.5 py-1.5 rounded-none bg-[#151C2B] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 font-label-sm text-label-sm whitespace-nowrap transition-colors">
      III. Epistemic Verification
    </button>
<button className="shrink-0 px-3.5 py-1.5 rounded-none bg-[#151C2B] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 font-label-sm text-label-sm whitespace-nowrap transition-colors">
      IV. Civic Remedy
    </button>
</nav>

<figure className="relative rounded-none overflow-hidden mt-space-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] bg-[#0F141F] border border-slate-800">
<img className="w-full h-44 object-cover filter contrast-110 brightness-90" data-alt="Monochrome archival photography of grain silos and logistic depots at dusk in Selangor Malaysia. High contrast moody cinematic lighting, subtle misty atmospheric depth, grain transport trucks waiting at a terminal scale, austere documentary investigative journalism aesthetics, muted tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMAqZZN_O2HPrHFHgmU_dAvWOj-Cdv34yjQz_HRnHPQ9V8xRtWqIVx3nQ9WPU5N2eQ-zMEyzVrCjGa2DU9B6FXiyPXfRLxQM8yqTQHG0itsQYPln5_3XceBDH8MNukFxo3zYWVEClkVKFkAwVDxgZ1TY1FzI-AgX8ODp4rAwG5-6c3rREoROtS_AQ5xYgugjppaqlBhNE5VNI29l72nYD3WVROysHRGVlfzSNqWS0I" />
<div className="absolute bottom-0 inset-x-0 p-space-sm bg-gradient-to-t from-[#090B10] via-[#090B10]/85 to-transparent backdrop-blur-[2px]">
<p className="font-telemetry-sm text-[11px] text-slate-200 flex items-center justify-between">
<span className="text-sky-300 font-semibold tracking-wider">FIG 4.2 — SILO DEPOT FEED 11B (AMPANG JAYA)</span>
<span className="text-emerald-400 font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse"></span>TELEMETRY SYNCED</span>
</p>
</div>
</figure>

<article className="flex flex-col gap-space-lg mt-space-lg">

<div className="flex flex-col gap-space-xs bg-[#0F141F]/90 backdrop-blur p-space-md rounded-none border border-emerald-500/25 shadow-[0_4px_16px_rgba(0,0,0,0.4)] relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-none blur-xl pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 font-telemetry-sm text-[11px] font-semibold">
<span className="w-1.5 h-1.5 rounded-none bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
          OBS — Observed Fact
        </span>
<span className="font-telemetry-sm text-[10px] text-slate-400 font-mono tracking-wider">SEC. 1.01</span>
</div>
<p className="font-body-md text-body-md text-slate-200 leading-relaxed pt-1">
        The official gazette reported 42,000 metric tonnes disbursed across Hulu Langat hubs between Q2 2022 and Q1 2023. Registry slips confirm receipt at primary intake portals prior to regional distribution staging.
      </p>
</div>

<div className="flex flex-col gap-space-xs bg-[#0F141F]/90 backdrop-blur p-space-md rounded-none border border-sky-500/35 shadow-[0_4px_20px_rgba(56,189,248,0.1)] relative overflow-hidden">
<div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/10 rounded-none blur-2xl pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-sky-950/80 border border-sky-400/50 text-sky-200 font-telemetry-sm text-[11px] font-semibold shadow-[0_0_8px_rgba(56,189,248,0.25)]">
<span className="w-1.5 h-1.5 rounded-none bg-sky-400 shadow-[0_0_6px_#38bdf8]"></span>
          DER — Derived Calculation
        </span>
<span className="font-telemetry-sm text-[10px] text-sky-400 font-mono tracking-wider font-semibold">MATH.DELTA-14</span>
</div>
<p className="font-body-md text-body-md text-slate-200 leading-relaxed pt-1">
        Computational reconciliation against customs manifestos indicates a 14.8% delta in physical depot offloading. Cross-referencing volumetric weigh-station sensor telemetry with merchant manifests yields an unexplained variance of roughly 6,216 metric tonnes.
      </p>

<div className="mt-space-xs p-space-sm bg-[#090B10] border border-red-500/30 rounded-none flex items-center justify-between bg-grid-orthogonal relative shadow-inner">
<div className="flex flex-col">
<span className="font-telemetry-sm text-[10px] tracking-wider text-red-300 uppercase font-semibold flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-none bg-red-500 animate-pulse"></span>ESTIMATED LOGISTIC GAP
          </span>
<span className="font-telemetry-lg text-headline-sm text-red-400 font-bold font-mono tracking-tight drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">-6,216 MT</span>
</div>
<div className="relative">
<svg className="w-28 h-10 text-red-500" fill="none" viewBox="0 0 100 30">
<defs>
<linearGradient id="sparkline-grad" x1="0" x2="1" y1="0" y2="0">
<stop offset="0%" stopColor="#38bdf8"></stop>
<stop offset="60%" stopColor="#f59e0b"></stop>
<stop offset="100%" stopColor="#ef4444"></stop>
</linearGradient>
<filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
<feGaussianBlur result="blur" stdDeviation="2"></feGaussianBlur>
<feMerge>
<feMergeNode in="blur"></feMergeNode>
<feMergeNode in="SourceGraphic"></feMergeNode>
</feMerge>
</filter>
</defs>
<path d="M0 25 L20 22 L40 24 L60 12 L80 18 L100 5" filter="url(#glow)" stroke="url(#sparkline-grad)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
<circle className="animate-ping" cx="100" cy="5" fill="#ef4444" opacity="0.6" r="3.5"></circle>
<circle cx="100" cy="5" fill="#ef4444" r="3"></circle>
</svg>
</div>
</div>
</div>

<div className="flex flex-col gap-space-xs bg-[#0F141F]/90 backdrop-blur p-space-md rounded-none border border-amber-500/30 shadow-[0_4px_16px_rgba(0,0,0,0.4)] relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-none blur-xl pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-amber-950/80 border border-amber-400/50 text-amber-200 font-telemetry-sm text-[11px] font-semibold shadow-[0_0_8px_rgba(245,158,11,0.25)]">
<span className="w-1.5 h-1.5 rounded-none bg-amber-400 shadow-[0_0_6px_#fbbf24]"></span>
          INT — Interpretation
        </span>
<span className="font-telemetry-sm text-[10px] text-amber-400/90 font-mono tracking-wider">NODE-07 AUDIT</span>
</div>
<p className="font-body-md text-body-md text-slate-200 leading-relaxed pt-1">
        This disparity points to intermediary consolidation rather than logistical spoilage. Ambient storage sensor telemetry over identical rainfall periods reveals zero moisture breach thresholds that would otherwise justify systemic writedowns.
      </p>
</div>

<div className="flex flex-col gap-space-xs bg-[#0F141F]/90 backdrop-blur p-space-md rounded-none border border-slate-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.4)] relative">
<div className="flex items-center justify-between">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-slate-800/80 border border-slate-600 text-slate-300 font-telemetry-sm text-[11px] font-semibold">
<span className="w-1.5 h-1.5 rounded-none bg-slate-400"></span>
          SPEC — Speculative Hypothesis
        </span>
<span className="font-telemetry-sm text-[10px] text-slate-400 font-mono tracking-wider">FORECAST</span>
</div>
<p className="font-body-md text-body-md text-slate-300 leading-relaxed pt-1">
        Future procurement cycles without cryptographic attestations will likely replicate the leakage pattern, escalating margin bleed to an estimated 22.4% as wholesale grain benchmark prices rise across regional import corridors.
      </p>
</div>
</article>

<section className="mt-space-lg bg-[#0F141F] rounded-none p-space-md flex flex-col gap-space-sm shadow-[0_8px_28px_rgba(0,0,0,0.5)] border border-sky-500/25 relative overflow-hidden bg-grid-orthogonal">

<div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none text-sky-400">
<svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 100">
<polygon points="50,5 95,27 95,73 50,95 5,73 5,27"></polygon>
<polygon points="50,15 85,32 85,68 50,85 15,68 15,32"></polygon>
<polygon points="50,25 75,37 75,63 50,75 25,63 25,37"></polygon>
<circle cx="50" cy="50" r="10"></circle>
</svg>
</div>
<div className="flex items-center justify-between relative z-10">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[18px] text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]">verified_user</span>
<span className="font-telemetry-sm text-[11px] font-bold uppercase text-white tracking-wider">EVIDENCE ATTESTATION</span>
</div>
<span className="font-telemetry-sm text-[10px] px-2 py-0.5 rounded-none bg-[#151C2B] text-sky-300 font-mono border border-sky-500/30">VAULT999-DOC-9821</span>
</div>
<div className="flex flex-col gap-1 p-space-sm bg-[#090B10]/90 border border-slate-800 rounded-none relative z-10">
<span className="font-telemetry-sm text-[10px] text-slate-400 font-mono tracking-wider flex items-center justify-between">
<span>CRYPTOGRAPHIC RECORD DIGEST (SHA-256)</span>
<span className="text-emerald-400 font-semibold">IMMUTABLE</span>
</span>
<span className="font-telemetry-sm text-[11px] text-sky-300 break-all select-all font-mono tracking-wide selection:bg-sky-500 selection:text-black">
        e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
      </span>
</div>
<div className="flex items-center justify-between pt-space-xs relative z-10">
<button className="flex items-center gap-1.5 text-amber-400 font-telemetry-sm text-[11px] font-bold hover:text-amber-300 transition-colors py-1" id="open-legend-btn">
<span className="material-symbols-outlined text-[16px]">help_center</span>
<span>EPISTEMIC TAXONOMY LEGEND</span>
</button>
<button className="px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-none font-telemetry-sm text-[11px] font-bold hover:brightness-110 transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] border border-sky-300/30">
        VERIFY RECORD
      </button>
</div>
</section>

<div className="hidden fixed inset-x-4 bottom-24 z-50 bg-[#0F141F]/95 backdrop-blur-2xl text-white rounded-none p-space-md shadow-[0_16px_40px_rgba(0,0,0,0.8)] border border-sky-500/40 flex-col gap-space-sm" id="epistemic-legend-modal">
<div className="flex items-center justify-between border-b border-slate-800 pb-2">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[20px] text-amber-400">info</span>
<span className="font-headline-sm text-headline-sm text-white font-serif">Epistemic Badging Key</span>
</div>
<button className="text-slate-400 hover:text-white transition-colors p-1" id="close-legend-btn">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<p className="font-body-sm text-body-sm text-slate-300">
      Every investigative sentence within MakcikGPT civic readers carries a machine-attested evidentiary grade:
    </p>
<div className="grid grid-cols-2 gap-2 pt-1 font-telemetry-sm text-[11px]">
<div className="p-2.5 rounded-none bg-[#090B10] border border-emerald-500/30 flex flex-col gap-0.5">
<span className="text-emerald-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-none bg-emerald-400"></span>[OBS] OBSERVED</span>
<span className="text-slate-400 text-[10px]">Primary sensor logs or notarized state registries.</span>
</div>
<div className="p-2.5 rounded-none bg-[#090B10] border border-sky-500/30 flex flex-col gap-0.5">
<span className="text-sky-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-none bg-sky-400"></span>[DER] DERIVED</span>
<span className="text-slate-400 text-[10px]">Formulaic calculation cross-verified via SQL audit.</span>
</div>
<div className="p-2.5 rounded-none bg-[#090B10] border border-amber-500/30 flex flex-col gap-0.5">
<span className="text-amber-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-none bg-amber-400"></span>[INT] INTERPRETATION</span>
<span className="text-slate-400 text-[10px]">Analytical synthesis by model &amp; investigative desk.</span>
</div>
<div className="p-2.5 rounded-none bg-[#090B10] border border-slate-700 flex flex-col gap-0.5">
<span className="text-slate-300 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-none bg-slate-400"></span>[SPEC] SPECULATION</span>
<span className="text-slate-400 text-[10px]">Probabilistic projection; unproven hypothesis.</span>
</div>
</div>
</div>

<div className="sticky bottom-4 z-40 mt-space-lg w-full bg-[#0F141F]/95 backdrop-blur-xl border border-amber-500/30 text-white rounded-none p-space-sm shadow-[0_12px_32px_rgba(0,0,0,0.8)] flex flex-col gap-2">

<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-space-xs min-w-0">
<button className="w-9 h-9 rounded-none bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.5)] active:scale-95 transition-transform" id="audio-toggle-btn">
<span className="material-symbols-outlined text-[22px] font-bold" id="audio-icon" style={{ fontVariationSettings: '\'FILL\' 1' }}>play_arrow</span>
</button>
<div className="flex flex-col min-w-0">
<span className="font-telemetry-sm text-[12px] font-bold truncate text-amber-200">
            MiniMax Voice: Audio Treatise
          </span>
<span className="font-telemetry-sm text-[10px] text-slate-400 font-mono" id="player-time">
            04:12 / 11:30
          </span>
</div>
</div>
<div className="flex items-center gap-space-xs shrink-0">
<button className="px-2 py-0.5 rounded bg-[#151C2B] border border-slate-700 text-amber-300 font-telemetry-sm text-[11px] font-bold">
          1.0x
        </button>
<button className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-amber-300 transition-colors">
<span className="material-symbols-outlined text-[19px]">volume_up</span>
</button>
</div>
</div>

<div className="w-full bg-[#151C2B] h-1.5 rounded-none overflow-hidden relative cursor-pointer border border-slate-800">
<div className="bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 h-full rounded-none transition-all duration-150 shadow-[0_0_8px_rgba(56,189,248,0.7)]" style={{ width: '36%' }}></div>
</div>
</div>
</div>
</main>
      </div>
    </LayoutGrid>
  );
};

export default MakcikGPTArchive;
